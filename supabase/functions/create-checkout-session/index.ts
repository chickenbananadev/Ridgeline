// Edge Function: create a Stripe Checkout session for a new company
// signing up. Card required, 7-day trial — Stripe holds the card and
// starts billing automatically the moment the trial ends, no charge
// before that.
//
// Deploy:  supabase functions deploy create-checkout-session
// Secrets required (supabase secrets set):
//   STRIPE_SECRET_KEY        — from the Stripe dashboard, Developers > API keys
//   STRIPE_PRICE_PER_SEAT    — Price ID for the base plan: $119.99/mo,
//                              up to 10 seats.
//   STRIPE_PRICE_UNLIMITED   — Price ID for the Unlimited plan:
//                              $199.99/mo, no seat cap.
//   APP_URL                  — e.g. https://roofstride.com (no trailing
//                              slash) — where Stripe redirects back to
//
// The client sends { plan: "per_seat" | "unlimited", company } — see
// the two pricing-card buttons on the Marketing page. An unrecognized
// or missing plan value falls back to "per_seat" rather than rejecting
// the request outright.
//
// Runs server-side with the service-role key so it can look up the
// caller's identity; the Stripe secret key never reaches the browser.
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
      return new Response(JSON.stringify({ error: "Stripe is not configured yet (STRIPE_SECRET_KEY missing). Contact support." }),
        { status: 500, headers: cors });
    }
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

    // Verify the caller has a real, just-created Supabase session —
    // this runs right after signUp(), before create_tenant, so there is
    // a user but no tenant/company yet.
    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user || !user.email) {
      return new Response(JSON.stringify({ error: "Not signed in" }), { status: 401, headers: cors });
    }

    const { company, plan } = await req.json();
    const selectedPlan = plan === "unlimited" ? "unlimited" : "per_seat";
    const priceEnvVar = selectedPlan === "unlimited" ? "STRIPE_PRICE_UNLIMITED" : "STRIPE_PRICE_PER_SEAT";
    const priceId = Deno.env.get(priceEnvVar);
    if (!priceId) {
      return new Response(JSON.stringify({ error: "Stripe pricing is not configured yet. Contact support." }),
        { status: 500, headers: cors });
    }

    const appUrl = Deno.env.get("APP_URL") || "https://roofstride.com";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 7 },
      payment_method_collection: "always", // card required even during the trial
      success_url: `${appUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?checkout=cancelled`,
      metadata: { supabase_user_id: user.id, company: company || "", plan: selectedPlan },
    });

    return new Response(JSON.stringify({ url: session.url }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Could not start checkout" }),
      { status: 500, headers: cors });
  }
});
