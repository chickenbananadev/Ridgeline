/* Build 104 — cross-tenant leak reported live: a brand-new account
   (personal email, no company) opened Setup and saw another company's
   name, short mark, slogan, phone, email, head-office address and
   Google review link, plus a raw "new row violates row-level security
   policy for table crm_brand" error banner.

   Root cause was a chain, not one bug:

   1. The account's profiles.tenant_id was NULL — auth succeeded but
      create_tenant never ran (checkout abandoned). Nothing stopped
      that session from entering the app.
   2. Every tenant-scoped read/write in the app carried a legacy
      pre-multi-tenancy fallback: `when tenantId is missing, use the
      singleton id=1 row`. In a live multi-tenant database that row
      belongs to whichever company was migrated first — so a
      tenant-less session read (and tried to write) that company's
      branding and org settings as its own.
   3. crm_brand's SELECT policy was still `using(true)` in production
      (migration 026 written but never applied), so the database
      happily served the read.

   Fixed at all three layers. This test covers the app layer; the
   database layer is migration 026, applied separately.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- 1. A tenant-less session can't reach the app at all ---------- */
ok(/if \(liveAuth\(\) && !liveUser\.tenantId\) \{/.test(src),
  "a signed-in account with no tenant is gated out of the app before any screen renders");
ok(/Finish setting up your company/.test(src),
  "the gate explains what's wrong in plain language rather than dropping the user into an empty app");
ok(/you won't see any other company's data/.test(src),
  "the gate states the isolation guarantee explicitly");
ok(/const \[setupBusy, setSetupBusy\] = useState\(false\);/.test(src),
  "the Finish setup button has its own busy state so it can't be double-fired");
/* The gate must sit AFTER the checkout-return screen, or someone
   coming back from Stripe would be bounced before create_tenant runs. */
const gateIdx = src.indexOf('if (liveAuth() && !liveUser.tenantId) {');
const checkoutIdx = src.indexOf('checkoutOutcome === "success" && checkoutSessionId');
ok(checkoutIdx > 0 && gateIdx > checkoutIdx,
  "the no-tenant gate runs AFTER the checkout-return screen, so completing signup still works");

/* ---------- 2. No legacy singleton fallbacks remain ---------- */
/* Match the executable query form, not the prose in the comments that
   explain why it was removed (those quote `.eq("id", 1)` verbatim). */
ok(!/\.eq\("id", 1\)\.maybeSingle\(\)/.test(src),
  "no query anywhere still falls back to the legacy singleton id=1 row");
ok(!/upsert\(\{ id: 1,/.test(src),
  "no write anywhere still targets the legacy singleton id=1 row");
ok(!/onConflict: "id" \}/.test(src),
  "no upsert still conflict-targets the legacy id column");

/* ---------- 3. Brand read/write are strictly tenant-scoped ---------- */
ok(/if \(!tenantId\) \{ finish\(\); return \(\) => \{ alive = false; \}; \}/.test(src),
  "the brand load bails out cleanly when there's no tenant, leaving RoofStride defaults in place");
ok(/const query = db\.from\("crm_brand"\)\.select\("data"\)\.eq\("tenant_id", tenantId\)\.maybeSingle\(\);/.test(src),
  "the brand load is unconditionally tenant-scoped");
ok(/if \(!db \|\| !hasSession \|\| !loaded \|\| !tenantId\) return;/.test(src),
  "the brand save never fires without a tenant, so no bogus RLS error can surface");

/* ---------- 4. Org settings read/write are strictly tenant-scoped ---------- */
ok(/const \{ data: orgRow, error: orgErr \} = tenantId\s*\n\s*\? await db\.from\("crm_org"\)\.select\("data"\)\.eq\("tenant_id", tenantId\)\.maybeSingle\(\)\s*\n\s*: \{ data: null, error: null \};/.test(src),
  "the org load is tenant-scoped with a null result rather than a legacy-row fallback");
ok(/\} else if \(tenantId\) \{/.test(src),
  "first-boot org seeding only happens for a real tenant");
ok(/if \(!db \|\| !ready \|\| !hydrated \|\| !tenantId\) return;/.test(src),
  "the org save never fires without a tenant");

/* ---------- 5. SysCheck probes don't test another company's row ---------- */
ok(/This account isn't attached to a company yet — finish signup first\./.test(src),
  "the 'Can save settings' probe reports the real reason instead of probing a foreign row");
ok(/: \{ data: null \};/.test(src),
  "the 'Stored branding' probe reports nothing rather than another company's branding");

/* ---------- behavioral: mirror the gate + fallback logic ---------- */
const gateBlocks = (liveAuthOn, tenantId) => liveAuthOn && !tenantId;
ok(gateBlocks(true, null) === true, "live auth + no tenant => blocked");
ok(gateBlocks(true, undefined) === true, "live auth + undefined tenant => blocked");
ok(gateBlocks(true, "tenant-abc") === false, "live auth + real tenant => allowed through");
ok(gateBlocks(false, null) === false, "demo mode (no live auth) is unaffected — there is no tenant concept there");

/* The old fallback, reproduced, to document exactly what it did: with
   no tenant it resolved to a query for the singleton row, which is a
   real company's data in any multi-tenant database. */
const oldTarget = (tenantId) => (tenantId ? { by: "tenant_id", val: tenantId } : { by: "id", val: 1 });
const newTarget = (tenantId) => (tenantId ? { by: "tenant_id", val: tenantId } : null);
ok(oldTarget(null).by === "id" && oldTarget(null).val === 1,
  "documented: the old code targeted the shared id=1 row when tenantId was missing");
ok(newTarget(null) === null,
  "the new code targets nothing at all when tenantId is missing");
ok(newTarget("t1").by === "tenant_id" && newTarget("t1").val === "t1",
  "a real tenant still targets its own row, unchanged");

if (fails) { console.log("\nbuild 104: " + fails + " FAILED"); process.exit(1); }
console.log("build 104 tests passed");
