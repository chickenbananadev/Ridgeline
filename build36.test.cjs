/* Build 36 — client portal token-gate (migrations 018/019). The old
   `portal_public_read` RLS policy on crm_portal was `revoked = false`
   for anon with no token correlation: RLS filters which rows CAN come
   back, not what the query asked for, so anyone holding the public
   anon key could skip the token filter entirely and read every
   tenant's portal data. Same root problem in the customer mark-read
   path, which validated the target row's own token but never that the
   caller supplied it. Fixed by moving both behind security-definer
   functions that take the token as an explicit argument. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
const fs = require("fs");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- client no longer does an open-ended table read for the anon path --- */
ok(!src.includes('db.from("crm_portal").select("data, revoked")'),
  "PublicPortal no longer selects crm_portal directly");
ok(src.includes('db.rpc("portal_get_data"'), "PublicPortal reads through the token-gated function");
ok(src.includes('db.rpc("portal_get_messages"'), "the customer message thread reads through the token-gated function");
ok(src.includes('db.rpc("portal_mark_customer_read"'), "the customer mark-read goes through the token-gated function");

/* --- staff path (meRole "team") is untouched — it already has a real
   session and tenant-scoped RLS, never the vulnerable path --- */
ok(src.includes('db.from("crm_portal_msgs").update({ read_by_team: true })'),
  "staff mark-read still uses the normal tenant-scoped table update");

/* --- migrations exist and actually close the hole, not just add
   functions alongside the old policy --- */
const m018 = fs.readFileSync("./supabase/migrations/018_portal_token_gate.sql", "utf8");
const m019 = fs.readFileSync("./supabase/migrations/019_portal_mark_read_fix.sql", "utf8");
ok(/drop policy if exists portal_public_read on crm_portal/.test(m018), "018 drops the anon-enumerable read policy");
ok(/drop policy if exists pmsg_update_customer on crm_portal_msgs/.test(m018), "018 drops the untargeted customer update policy");
ok(/security definer/.test(m018) && /security definer/.test(m019), "the replacement functions run as security definer");
ok(/revoke all on function portal_get_data\(text\) from public/.test(m018), "portal_get_data isn't executable by the PUBLIC pseudo-role");

if (fails) { console.log("\nbuild 36: " + fails + " FAILED"); process.exit(1); }
console.log("build 36 tests passed");
