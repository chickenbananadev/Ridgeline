/* Build 106 — real two-tier pricing: $119.99/mo base plan (up to 10
   seats), $199.99/mo Unlimited plan (no seat cap). Replaces build 99's
   $119.99 base + $59.99/10-seat add-on model (20-seat hard cap, never
   truly unlimited) entirely — build99.test.cjs is retired along with
   it, since its whole premise ("one plan, one optional add-on, no
   unlimited tier") is what this build reverses.

   The client-side plumbing for two plans (startCheckout({ plan,
   company }), complete-signup reading session.metadata.plan,
   create_tenant(p_plan), my_tenant() returning tenant.plan) was never
   removed — build 99 only collapsed create-checkout-session down to
   always using STRIPE_PRICE_PER_SEAT and ignoring whatever plan the
   client sent. This build re-enables that branch with new prices and
   a real Stripe Price ID for Unlimited, and rebuilds TeamManager's
   seat math and the two Edge Functions that enforce/sync it around
   tenant.plan instead of the retired tenant.seats_paid add-on counter.

   Also fixes a latent bug found while touching every "Start free
   trial" button: four of them were wired as onClick={onStartTrial}
   (bare reference), so a click passed the React SyntheticEvent object
   itself as the "plan" argument — always truthy, so `plan || "per_seat"`
   silently swallowed it into the default. Harmless while there was
   only one plan to select; a real bug now that a wrong plan value
   would send someone to the wrong Stripe price. All five generic CTAs
   (nav, hero, final CTA, footer link, non-plan-specific) now explicitly
   pass "per_seat"; only the two pricing-card buttons pass their own
   tier.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const inviteSrc = fs.readFileSync(path.join(__dirname, "supabase/functions/invite-user/index.ts"), "utf8");
const checkoutSrc = fs.readFileSync(path.join(__dirname, "supabase/functions/create-checkout-session/index.ts"), "utf8");
const webhookSrc = fs.readFileSync(path.join(__dirname, "supabase/functions/stripe-webhook/index.ts"), "utf8");
const deploy = fs.readFileSync(path.join(__dirname, "DEPLOY.md"), "utf8");
const mig027 = fs.readFileSync(path.join(__dirname, "supabase/migrations/027_pricing_seats_paid_default.sql"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: PRODUCT constant ---------- */
ok(/basePrice: 119\.99,/.test(src), "PRODUCT.basePrice is still $119.99");
ok(/baseSeats: 10,/.test(src), "PRODUCT.baseSeats is still 10");
ok(/unlimitedPrice: 199\.99,/.test(src), "PRODUCT.unlimitedPrice is the new $199.99");
ok(!/addonSeats|addonPrice|maxSeats|hasAddon/.test(src),
  "no leftover add-on-block fields or the hasAddon flag remain anywhere in the file");
ok(!fs.existsSync(path.join(__dirname, "build99.test.cjs")),
  "build99.test.cjs (the add-on-model test) is retired, not left contradicting the new pricing");

/* ---------- static: TeamManager seat math reads tenant.plan ---------- */
ok(/const isUnlimited = !!tenant && tenant\.plan === "unlimited";/.test(src),
  "TeamManager derives isUnlimited from tenant.plan, the column my_tenant() already returns");
ok(/const seatsIncluded = tenant \? \(isUnlimited \? Infinity : PRODUCT\.baseSeats\) : null;/.test(src),
  "seatsIncluded is Infinity on Unlimited (so every >= comparison downstream just works) or the base cap otherwise");
ok(/Upgrade to Unlimited in Manage billing/.test(src),
  "the seat-limit error/callout copy points at upgrading plans, not buying a retired add-on");

/* ---------- static: the SyntheticEvent bug is fixed on every generic CTA ---------- */
ok(!/onClick=\{onStartTrial\}/.test(src),
  "no button passes onStartTrial directly as a bare event handler anymore — every call site is explicit about which plan it starts");
ok((src.match(/onClick=\{\(\) => onStartTrial\("per_seat"\)\}/g) || []).length >= 4,
  "at least the four generic 'Start free trial' CTAs (nav, hero, final CTA, footer) explicitly pass \"per_seat\"");
ok(/onClick=\{\(\) => onStartTrial\("unlimited"\)\}/.test(src),
  "the Unlimited pricing card's button explicitly passes \"unlimited\"");

/* ---------- static: two pricing cards on the Marketing page ---------- */
ok(/gridTemplateColumns: "1fr 1fr", gap: 20, textAlign: "left", marginBottom: 28, maxWidth: 700/.test(src),
  "the pricing grid is back to two columns (desktop), wide enough for both cards");
ok(/PRODUCT\.unlimitedPrice\.toFixed\(2\)/.test(src), "the Unlimited card renders PRODUCT.unlimitedPrice");
ok(/No seat limit — add your whole crew/.test(src), "the Unlimited card states plainly that it has no seat cap");

/* ---------- static: signup screen copy reflects the actually-selected plan ---------- */
ok(/selectedPlan === "unlimited"/.test(src) && /PRODUCT\.unlimitedPrice\.toFixed\(2\)}\/mo for unlimited seats/.test(src),
  "the signup screen shows the Unlimited price/copy when that's the plan the visitor actually picked");

/* ---------- static: create-checkout-session branches on the client's plan ---------- */
ok(/const \{ company, plan \} = await req\.json\(\);/.test(checkoutSrc),
  "create-checkout-session reads plan out of the request body again");
ok(/const selectedPlan = plan === "unlimited" \? "unlimited" : "per_seat";/.test(checkoutSrc),
  "an unrecognized or missing plan value falls back to per_seat rather than erroring");
ok(/STRIPE_PRICE_UNLIMITED/.test(checkoutSrc), "create-checkout-session knows about the new Unlimited Stripe price");
ok(/plan: selectedPlan/.test(checkoutSrc), "the Checkout session's metadata carries the real selected plan, not a hardcoded \"per_seat\"");

/* ---------- static: stripe-webhook syncs tenants.plan, not seats_paid ---------- */
ok(!/seats_paid/.test(webhookSrc), "stripe-webhook no longer touches the retired seats_paid add-on counter");
ok(/const unlimitedPriceId = Deno\.env\.get\("STRIPE_PRICE_UNLIMITED"\);/.test(webhookSrc),
  "stripe-webhook reads the Unlimited price id");
ok(/update\.plan = onUnlimited \? "unlimited" : "per_seat";/.test(webhookSrc),
  "stripe-webhook sets tenants.plan from whichever price is actually on the subscription");

/* ---------- static: invite-user's seat cap is plan-gated, not add-on-gated ---------- */
ok(/const BASE_SEATS = 10;/.test(inviteSrc), "invite-user still knows the real base-plan seat count");
ok(/if \(tenantRow\?\.plan !== "unlimited"\) \{/.test(inviteSrc),
  "invite-user only enforces the seat cap for tenants NOT on the Unlimited plan — Unlimited truly has none, server-side too");
ok(!/seats_paid/.test(inviteSrc), "invite-user no longer reads the retired seats_paid column");

/* ---------- static: index.html pricing (visible copy + JSON-LD) ---------- */
ok(html.includes("$119.99/mo including 10 seats, or $199.99/mo for unlimited seats"),
  "the crawlable fallback's pricing paragraph states both real tiers");
const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
const ld = ldMatch ? JSON.parse(ldMatch[1]) : null;
const app = ld && ld["@graph"] && ld["@graph"].find((n) => n["@type"] === "SoftwareApplication");
ok(!!app && Array.isArray(app.offers) && app.offers.length === 2,
  "the JSON-LD now lists exactly two offers — base and Unlimited");
ok(app && app.offers.some((o) => o.price === "119.99") && app.offers.some((o) => o.price === "199.99"),
  "the two JSON-LD offers carry the real base and Unlimited prices");

/* ---------- static: DEPLOY.md documents both Stripe prices ---------- */
ok(/STRIPE_PRICE_UNLIMITED=price_\.\.\./.test(deploy), "DEPLOY.md's Stripe secrets list includes the new Unlimited price id");
ok(!/STRIPE_PRICE_SEAT_ADDON/.test(deploy), "DEPLOY.md no longer references the retired seat add-on price");

/* ---------- static: migration 027's still-true fact carries forward ---------- */
ok(/values \(org_name, 'trialing', now\(\) \+ interval '7 days', auth\.uid\(\), 0,/.test(mig027),
  "create_tenant() still starts every signup's seats_paid at 0 (the column is now unused by app logic but the migration's own fact still holds)");

/* ---------- behavioral: mirror TeamManager's seat-math formula ---------- */
const PRODUCT = { baseSeats: 10 };
const seatMath = (tenant, activeCount) => {
  const isUnlimited = !!tenant && tenant.plan === "unlimited";
  const seatsIncluded = tenant ? (isUnlimited ? Infinity : PRODUCT.baseSeats) : null;
  const atLimit = seatsIncluded != null && activeCount >= seatsIncluded;
  return { isUnlimited, seatsIncluded, atLimit };
};

ok(seatMath({ plan: "per_seat" }, 9).seatsIncluded === 10, "a base-plan tenant gets exactly 10 included seats");
ok(seatMath({ plan: "per_seat" }, 10).atLimit === true, "a base-plan tenant at exactly 10 active seats is at the limit");
ok(seatMath({ plan: "per_seat" }, 9).atLimit === false, "a base-plan tenant at 9 active seats is not at the limit");
ok(seatMath({ plan: "unlimited" }, 500).atLimit === false, "an Unlimited tenant is never at the limit, no matter how many active seats");
ok(seatMath({ plan: "unlimited" }, 500).isUnlimited === true, "isUnlimited reads true for a plan === \"unlimited\" tenant");
ok(seatMath(null, 0).seatsIncluded === null, "with no tenant loaded yet, seatsIncluded stays null rather than a wrong default");
/* A tenant row with a legacy/unset plan (pre-migration data, or a
   webhook that hasn't fired yet) must fail closed to the base cap, not
   open to unlimited. */
ok(seatMath({ plan: null }, 20).atLimit === true, "a tenant with no plan value set is treated as base-plan (fails closed, not open)");
ok(seatMath({}, 20).atLimit === true, "a tenant object with plan entirely absent is also treated as base-plan");

/* ---------- behavioral: mirror create-checkout-session's plan selection ---------- */
const pickPlan = (clientPlan) => (clientPlan === "unlimited" ? "unlimited" : "per_seat");
ok(pickPlan("unlimited") === "unlimited", "an explicit \"unlimited\" request selects the Unlimited price");
ok(pickPlan("per_seat") === "per_seat", "an explicit \"per_seat\" request selects the base price");
ok(pickPlan(undefined) === "per_seat", "a missing plan value defaults to the base price, not an error or Unlimited");
ok(pickPlan("something_else") === "per_seat", "an unrecognized plan value defaults to the base price rather than erroring");

if (fails) { console.log("\nbuild 106: " + fails + " FAILED"); process.exit(1); }
console.log("build 106 tests passed");
