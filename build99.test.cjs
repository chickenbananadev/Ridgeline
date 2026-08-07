/* Build 99 — real pricing: $119.99/mo base (10 seats), one optional
   +10-seat add-on for $59.99/mo (20-seat hard cap, not repeatable).
   Replaces the placeholder $49.99 base / $169.99 unlimited-tier
   figures and closes the gaps that made seat purchases via Stripe's
   Billing Portal invisible to the app, and made seat caps client-side
   only (trivially bypassed by calling invite-user directly).
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const inviteSrc = fs.readFileSync(path.join(__dirname, "supabase/functions/invite-user/index.ts"), "utf8");
const checkoutSrc = fs.readFileSync(path.join(__dirname, "supabase/functions/create-checkout-session/index.ts"), "utf8");
const webhookSrc = fs.readFileSync(path.join(__dirname, "supabase/functions/stripe-webhook/index.ts"), "utf8");
const migPath = path.join(__dirname, "supabase/migrations/027_pricing_seats_paid_default.sql");
const mig = fs.readFileSync(migPath, "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: PRODUCT constant ---------- */
ok(/basePrice: 119\.99,/.test(src), "PRODUCT.basePrice is $119.99");
ok(/baseSeats: 10,/.test(src), "PRODUCT.baseSeats is 10");
ok(/addonSeats: 10,/.test(src), "PRODUCT.addonSeats is 10");
ok(/addonPrice: 59\.99,/.test(src), "PRODUCT.addonPrice is $59.99");
ok(/get maxSeats\(\) \{ return this\.baseSeats \+ this\.addonSeats; \}/.test(src), "PRODUCT.maxSeats derives from baseSeats+addonSeats (20)");
ok(!/unlimitedPrice|unlimitedSeatCap|extraSeatPrice/.test(src), "no leftover unlimited-tier or per-extra-seat pricing fields remain anywhere in the file");
ok(!/"unlimited"/.test(src), "no code path branches on the string \"unlimited\" anymore");

/* ---------- static: TeamManager seat math ---------- */
ok(/const hasAddon = !!tenant && \(tenant\.seats_paid \|\| 0\) >= PRODUCT\.addonSeats;/.test(src),
  "hasAddon is a real boolean derived from tenant.seats_paid, not a per-seat count");
ok(/const seatsIncluded = tenant \? PRODUCT\.baseSeats \+ \(hasAddon \? PRODUCT\.addonSeats : 0\) : null;/.test(src),
  "seatsIncluded is baseSeats, plus the full addonSeats block only when hasAddon is true");

/* ---------- static: server-side seat cap in invite-user ---------- */
ok(/const BASE_SEATS = 10, ADDON_SEATS = 10;/.test(inviteSrc),
  "invite-user knows the real seat numbers, not just trusting the client");
ok(/if \(\(activeCount \?\? 0\) >= seatsIncluded\)/.test(inviteSrc),
  "invite-user refuses to create a seat past the tenant's own included-seat count, server-side");
ok(/status: 403/.test(inviteSrc), "the seat-cap rejection returns a real error status, not a silent no-op");

/* ---------- static: create-checkout-session no longer branches on plan ---------- */
ok(!/STRIPE_PRICE_UNLIMITED/.test(checkoutSrc), "create-checkout-session no longer references the removed unlimited-tier price");
ok(/const priceId = Deno\.env\.get\("STRIPE_PRICE_PER_SEAT"\);/.test(checkoutSrc),
  "create-checkout-session always uses the one base-plan price, no plan-based branch");

/* ---------- static: stripe-webhook syncs the add-on back to seats_paid ---------- */
ok(/const addonPriceId = Deno\.env\.get\("STRIPE_PRICE_SEAT_ADDON"\);/.test(webhookSrc),
  "stripe-webhook reads the seat-addon price id");
ok(/sub\.items\.data\.some\(\(li\) => li\.price\?\.id === addonPriceId\)/.test(webhookSrc),
  "stripe-webhook inspects the subscription's actual line items for the add-on price");
ok(/update\.seats_paid = hasAddon \? 10 : 0;/.test(webhookSrc),
  "stripe-webhook sets seats_paid to exactly 0 or 10 based on whether the add-on line item is present");

/* ---------- static: migration 027 changes the create_tenant default ---------- */
ok(fs.existsSync(migPath), "migration 027_pricing_seats_paid_default.sql exists");
ok(/values \(org_name, 'trialing', now\(\) \+ interval '7 days', auth\.uid\(\), 0,/.test(mig),
  "create_tenant() now starts every new signup at seats_paid = 0, not the old hardcoded 1");

/* ---------- behavioral: mirror the seat-math formula against real fixtures ---------- */
const PRODUCT = { baseSeats: 10, addonSeats: 10 };
const seatMath = (tenant) => {
  const hasAddon = !!tenant && (tenant.seats_paid || 0) >= PRODUCT.addonSeats;
  const seatsIncluded = tenant ? PRODUCT.baseSeats + (hasAddon ? PRODUCT.addonSeats : 0) : null;
  return { hasAddon, seatsIncluded };
};

ok(seatMath({ seats_paid: 0 }).seatsIncluded === 10, "a fresh tenant with no add-on gets exactly 10 included seats");
ok(seatMath({ seats_paid: 10 }).seatsIncluded === 20, "a tenant that bought the add-on gets exactly 20 included seats");
ok(seatMath({ seats_paid: 10 }).hasAddon === true, "hasAddon reads true once seats_paid reaches the add-on block size");
ok(seatMath({ seats_paid: 0 }).hasAddon === false, "hasAddon reads false with no seats_paid");
/* A stale/partial value (e.g. a webhook race) should still resolve to
   a real yes/no, not some fractional seat count. */
ok(seatMath({ seats_paid: 5 }).seatsIncluded === 10, "a seats_paid value below the full add-on block still counts as no add-on (no fractional seats)");
ok(seatMath(null).seatsIncluded === null, "with no tenant loaded yet, seatsIncluded stays null rather than a wrong default");

if (fails) { console.log("\nbuild 99: " + fails + " FAILED"); process.exit(1); }
console.log("build 99 tests passed");
