/* Build 37 — Stripe checkout is required for signup, not just a copy
   change. Asserts the actual flow: signUpOwner no longer calls
   create_tenant directly, startCheckout redirects to a Stripe-hosted
   page, and complete-signup verifies with Stripe before create_tenant
   ever runs. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const mainSrc = fs.readFileSync(path.join(__dirname, "src/main.jsx"), "utf8");

function check(name, cond) {
  if (!cond) { console.error("FAILED: " + name); process.exit(1); }
}

/* ---- client-side flow ---- */
check("signUpOwner no longer calls create_tenant directly (Stripe must happen first)",
  !/signUpOwner\(\{[\s\S]*?create_tenant/.test(mainSrc.slice(mainSrc.indexOf("async signUpOwner"), mainSrc.indexOf("async signUpOwner") + 700)));
check("startCheckout exists and redirects the browser to Stripe", /async startCheckout\(/.test(mainSrc)
  && /window\.location\.href = data\.url/.test(mainSrc));
check("completeSignupAfterCheckout exists", /async completeSignupAfterCheckout\(/.test(mainSrc));

/* ---- signup button actually triggers checkout, not immediate completion ---- */
check("signup submit calls startCheckout after signUpOwner, not create_tenant directly",
  /await a\.startCheckout\(\{ plan: selectedPlan, company: suCompany\.trim\(\) \}\)/.test(src));
check("signup button copy reflects payment step ('Continue to payment')",
  /Continue to payment/.test(src));
check("signup copy says a card IS required, not 'no card required'",
  /Card required to start/.test(src) && !/No card required\. After the trial/.test(src));

/* ---- plan selection threaded from pricing card through to checkout ----
   Build 99 removed the unlimited tier — one plan, one optional add-on
   purchased later via Manage billing, not chosen at signup — so the
   single remaining pricing card's button no longer needs to pass a
   plan argument; it defaults to "per_seat" the same way every other
   "Start trial" button on the marketing page already does. */
check("no pricing-card button passes an explicit plan argument anymore", !/onStartTrial\("per_seat"\)|onStartTrial\("unlimited"\)/.test(src));
check("plain onClick={onStartTrial} buttons (incl. the pricing card) still exist", (src.match(/onClick=\{onStartTrial\}/g) || []).length >= 4);
check("selectedPlan state threaded into Login", /selectedPlan=\{selectedPlan\}/.test(src));

/* ---- checkout return handling ---- */
check("CheckoutReturnScreen component exists", /function CheckoutReturnScreen/.test(src));
check("checkout return is gated on an actual signed-in session, not just the URL",
  /if \(currentUser && checkoutOutcome === "success" && checkoutSessionId\)/.test(src));

/* ---- Edge Functions exist and do real server-side verification ---- */
const checkoutFn = fs.readFileSync(path.join(__dirname, "supabase/functions/create-checkout-session/index.ts"), "utf8");
const completeFn = fs.readFileSync(path.join(__dirname, "supabase/functions/complete-signup/index.ts"), "utf8");
const webhookFn = fs.readFileSync(path.join(__dirname, "supabase/functions/stripe-webhook/index.ts"), "utf8");

check("create-checkout-session requires a card even during the trial",
  /payment_method_collection: "always"/.test(checkoutFn));
check("create-checkout-session sets a 7-day trial", /trial_period_days: 7/.test(checkoutFn));
check("complete-signup verifies the session belongs to the calling user, not just trusts the URL",
  /session\.metadata\?\.supabase_user_id !== user\.id/.test(completeFn));
check("complete-signup checks the session actually completed before creating a tenant",
  /session\.status !== "complete"/.test(completeFn));
check("complete-signup calls create_tenant via the user-scoped client (auth.uid() requires it), not the service-role client",
  /caller\.rpc\("create_tenant"/.test(completeFn) && !/admin\.rpc\("create_tenant"/.test(completeFn));
check("stripe-webhook verifies Stripe's signature, not just trusts incoming POSTs",
  /stripe\.webhooks\.constructEventAsync/.test(webhookFn));

/* ---- migration 021 exists and is idempotent ---- */
const mig = fs.readFileSync(path.join(__dirname, "supabase/migrations/021_stripe_signup.sql"), "utf8");
check("migration 021 drops the old create_tenant signature before recreating (avoids ambiguous overload)",
  /drop function if exists create_tenant\(text\);/.test(mig));
check("migration 021 drops my_tenant before recreating (return-type change needs a drop first)",
  /drop function if exists my_tenant\(\);/.test(mig));
check("migration 021 adds a real lock check, not just a UI hint", /function is_tenant_locked/.test(mig));

console.log("build 37 tests passed");
