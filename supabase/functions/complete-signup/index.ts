// Edge Function: called when the browser lands back on the app after
// Stripe Checkout. Verifies the session server-side (never trusts the
// URL alone — a session_id in a query string is not proof of anything
// by itself) and only THEN calls create_tenant, so a company record
// only ever gets created after Stripe confirms a card was collected.
//
// Deploy:  supabase functions deploy complete-signup
// Secrets required: STRIPE_SECRET_KEY (same as create-checkout-session)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Stripe is not configured yet." }), { status: 500, headers: cors });
    }
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Not signed in" }), { status: 401, headers: cors });
    }

    const { session_id } = await req.json();
    if (!session_id) {
      return new Response(JSON.stringify({ error: "Missing session_id" }), { status: 400, headers: cors });
    }

    // The real verification step: ask Stripe directly whether this
    // session actually completed and belongs to this signed-in user.
    // Nothing about the redirect URL itself is trusted.
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.metadata?.supabase_user_id !== user.id) {
      return new Response(JSON.stringify({ error: "This checkout session does not belong to your account." }), { status: 403, headers: cors });
    }
    if (session.status !== "complete" || session.payment_status === "unpaid") {
      return new Response(JSON.stringify({ error: "Checkout has not completed yet." }), { status: 400, headers: cors });
    }

    // Idempotent: if this user already has a tenant (e.g. the success
    // page got reloaded), just return it instead of erroring. This
    // reads via the user's own session — profiles_read already allows
    // reading your own row (id = auth.uid()) regardless of tenant, so
    // no service-role client is needed here at all.
    const { data: profile } = await caller.from("profiles").select("tenant_id").eq("id", user.id).single();
    if (profile?.tenant_id) {
      return new Response(JSON.stringify({ tenant_id: profile.tenant_id, already: true }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    const companyName = session.metadata?.company || "Your Company";
    const plan = session.metadata?.plan || "per_seat";
    const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
    const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;

    // create_tenant reads auth.uid() to know who's calling — that only
    // resolves via the user-scoped client (the one built from this
    // request's own Authorization header). The service-role client has
    // no user JWT at all, so auth.uid() would be null and the function
    // would reject it as "Not signed in" every time.
    const { data: tenantId, error: rpcErr } = await caller.rpc("create_tenant", {
      org_name: companyName,
      p_stripe_customer_id: stripeCustomerId,
      p_stripe_subscription_id: stripeSubscriptionId,
      p_plan: plan,
    });
    if (rpcErr) throw rpcErr;

    return new Response(JSON.stringify({ tenant_id: tenantId }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Could not finish signup" }),
      { status: 500, headers: cors });
  }
});
