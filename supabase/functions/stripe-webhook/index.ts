// Edge Function: Stripe webhook. Keeps tenants.status accurate as
// things happen on Stripe's side over time — trial converting to a
// paid subscription, a card failing, a cancellation. This is what
// makes the lock in my_tenant().locked (and is_tenant_locked() at the
// database level) actually track reality, not just what was true at
// the moment someone signed up.
//
// customer.subscription.updated also syncs tenants.plan: a customer
// can switch between the base and Unlimited plans self-service through
// the Stripe Billing Portal (configure the two prices as a swappable
// group under Settings > Billing > Customer portal). Without this
// sync, upgrading to Unlimited there would charge the card but never
// actually lift the app's own 10-seat cap.
//
// Deploy:  supabase functions deploy stripe-webhook --no-verify-jwt
//   (--no-verify-jwt is required: Stripe calls this directly, with no
//   Supabase auth header at all — the signature check below is what
//   verifies the request is genuinely from Stripe instead.)
//
// After deploying, add the endpoint in the Stripe dashboard:
//   Developers > Webhooks > Add endpoint
//   URL: https://<project-ref>.supabase.co/functions/v1/stripe-webhook
//   Events to send: customer.subscription.updated,
//     customer.subscription.deleted, invoice.payment_failed,
//     invoice.paid
// Then copy the "Signing secret" Stripe shows you into:
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";

Deno.serve(async (req) => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    return new Response("Stripe webhook not configured", { status: 500 });
  }
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  let event;
  try {
    // This is the actual security boundary for this whole function —
    // anyone can POST to this URL, but only a request signed with the
    // secret Stripe and this function both know verifies as real.
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret);
  } catch (e) {
    return new Response(`Webhook signature verification failed: ${e instanceof Error ? e.message : e}`, { status: 400 });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    switch (event.type) {
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const status = sub.status === "active" ? "active"
          : sub.status === "trialing" ? "trialing"
          : sub.status === "past_due" ? "past_due"
          : sub.status === "canceled" || sub.status === "unpaid" ? "canceled"
          : sub.status;
        const unlimitedPriceId = Deno.env.get("STRIPE_PRICE_UNLIMITED");
        const perSeatPriceId = Deno.env.get("STRIPE_PRICE_PER_SEAT");
        const update: Record<string, unknown> = { status };
        // Only touch plan once we can actually tell the two prices
        // apart — without both env vars set, leave it alone rather
        // than guessing.
        if (unlimitedPriceId && perSeatPriceId) {
          const onUnlimited = sub.items.data.some((li) => li.price?.id === unlimitedPriceId);
          update.plan = onUnlimited ? "unlimited" : "per_seat";
        }
        await admin.from("tenants").update(update).eq("stripe_subscription_id", sub.id);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await admin.from("tenants").update({ status: "canceled" }).eq("stripe_subscription_id", sub.id);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription.id;
          await admin.from("tenants").update({ status: "past_due" }).eq("stripe_subscription_id", subId);
        }
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription.id;
          // A successful payment after past_due should clear the lock.
          await admin.from("tenants").update({ status: "active" }).eq("stripe_subscription_id", subId).eq("status", "past_due");
        }
        break;
      }
      default:
        // Unhandled event types are fine to ignore — Stripe expects a
        // 200 regardless, or it will keep retrying delivery.
        break;
    }
  } catch (e) {
    // Log and still return 200: a DB hiccup shouldn't make Stripe
    // hammer this endpoint with retries for an event we did receive.
    console.error("stripe-webhook handling error", e);
  }

  return new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } });
});
