// Edge Function: open the Stripe Billing Portal for the caller's tenant.
//
// This is the only supported way for an owner to change plan, add or remove
// seats, update the card on file, or cancel. It looks up the tenant's
// stripe_customer_id server-side (with the service role, so the lookup isn't
// limited by RLS) and hands back a one-time portal URL.
//
// Deploy:  supabase functions deploy create-portal-session
// Secrets required (supabase secrets set):
//   STRIPE_SECRET_KEY  — Stripe Developers > API keys
//   APP_URL            — e.g. https://roofstride.com (fallback return URL)
// SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are injected
// automatically.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ error: "Stripe is not configured yet. Contact support." }, 500);
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

    // Identify the caller.
    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: "Not signed in" }, 401);

    // Look up the tenant's Stripe customer with the service role.
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: profile } = await admin
      .from("profiles").select("tenant_id").eq("id", user.id).single();
    if (!profile?.tenant_id) return json({ error: "No company on file for this account." }, 400);

    const { data: tenant } = await admin
      .from("tenants").select("stripe_customer_id").eq("id", profile.tenant_id).single();
    if (!tenant?.stripe_customer_id) {
      return json({ error: "No billing account yet — this company hasn't completed checkout." }, 400);
    }

    const { return_url } = await req.json().catch(() => ({}));
    const appUrl = Deno.env.get("APP_URL") || "https://roofstride.com";
    const session = await stripe.billingPortal.sessions.create({
      customer: tenant.stripe_customer_id,
      return_url: return_url || appUrl + "/",
    });

    return json({ url: session.url });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not open the billing portal" }, 500);
  }
});
