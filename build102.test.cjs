/* Build 102 — delegated per-capability authority.

   Today only role === "admin" can edit commission structure, manage
   seats, or touch AdminControls' feature toggles. The owner wants
   that to stay the default but be delegable: an admin can hand one
   or more of these three capabilities to a specific non-admin person
   without making them a full admin (which would also hand them
   seat/branding/structure-editing power all at once, whether or not
   that was the intent).

   New profiles.permission_overrides jsonb column (flat capability-key
   -> true map), a hasCapability() helper backing canEditStructure/
   canManageSeats/the new canManageFeatures, a guard-trigger branch so
   only an admin can grant or revoke a capability (never the recipient,
   never a plain self-edit), and a checkbox group in TeamManager's
   seat-edit Sheet.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const migPath = path.join(__dirname, "supabase/migrations/029_permission_delegation.sql");
const mig = fs.readFileSync(migPath, "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: capability helpers ---------- */
ok(/const hasCapability = \(u, cap\) => !!u && \(u\.role === "admin" \|\| !!\(u\.permissionOverrides && u\.permissionOverrides\[cap\]\)\);/.test(src),
  "hasCapability exists: admin always passes, otherwise checks the granted map");
ok(/const canEditStructure = \(u\) => hasCapability\(u, "editStructure"\);/.test(src), "canEditStructure now routes through hasCapability");
ok(/const canManageSeats = \(u\) => hasCapability\(u, "manageSeats"\);/.test(src), "canManageSeats now routes through hasCapability");
ok(/const canManageFeatures = \(u\) => hasCapability\(u, "manageFeatures"\);/.test(src), "canManageFeatures is a new helper, also capability-based");

/* ---------- static: profile mapping ---------- */
ok(/permissionOverrides: row\.permission_overrides \|\| \{\},/.test(src), "fromProfile reads permission_overrides from the DB row");
ok(/permission_overrides: u\.permissionOverrides \|\| \{\},/.test(src), "toProfile writes permissionOverrides back to the DB column");

/* ---------- static: AdminControls actually uses the delegable gate ---------- */
ok(/const admin = canManageFeatures\(currentUser\);/.test(src),
  "AdminControls' own screen gate now uses canManageFeatures, not a bare role === \"admin\" check");
ok(/canManageFeatures\(currentUser\) && \["admin", Shield, "Admin controls"/.test(src),
  "the MoreMenu entry for Admin controls is reachable by anyone with the delegated capability, not just role===admin — otherwise a delegated person could pass the screen's own gate but never find the menu item to get there");

/* ---------- static: TeamManager UI ---------- */
ok(/const CAPABILITIES = \[/.test(src) && /"editStructure", "Edit commission structure"/.test(src)
  && /"manageSeats", "Manage seats"/.test(src) && /"manageFeatures", "Manage feature toggles"/.test(src),
  "the 3 delegable capabilities are defined with real labels");
ok(/permissionOverrides: \{\}/.test(src), "a brand-new seat's blank form starts with an empty overrides map, not undefined");
ok(/isAdmin && f\.role !== "admin" && editing !== "new" && \(/.test(src),
  "the capability checkboxes only show for an admin editing an EXISTING non-admin seat — never for a brand-new invite, since invite-user doesn't send permission_overrides at creation time, and never for someone already admin (nothing to grant)");
ok(/checked=\{!!\(f\.permissionOverrides && f\.permissionOverrides\[key\]\)\}/.test(src),
  "each checkbox reflects the seat's actual current grant, not a stale default");

/* ---------- static: save path threads permissionOverrides through ---------- */
ok(/const next = \{ \.\.\.editing, \.\.\.f, name: f\.name\.trim\(\), email: f\.email\.trim\(\) \};/.test(src),
  "editing an existing seat spreads the full form (including permissionOverrides) into what gets saved");

/* ---------- static: migration 029 ---------- */
ok(fs.existsSync(migPath), "migration 029_permission_delegation.sql exists");
ok(/alter table profiles add column if not exists permission_overrides jsonb not null default '\{\}'::jsonb;/.test(mig),
  "the permission_overrides column is added with a safe default");
ok(/if new\.permission_overrides is distinct from old\.permission_overrides then/.test(mig),
  "the guard trigger gained a branch watching this new column");
ok(/raise exception 'only an admin can grant or revoke a delegated capability';/.test(mig),
  "a non-admin (including the person being granted a capability) cannot change permission_overrides themselves");
/* Sanity: the pre-existing tenant_id/role guards are still present,
   not accidentally replaced by this migration. */
ok(/tenant_id cannot be changed once assigned/.test(mig), "the existing tenant_id immutability guard is preserved");
ok(/only an admin can change a role/.test(mig), "the existing role-change guard is preserved");

/* ---------- behavioral: mirror hasCapability against real fixtures ---------- */
const hasCapability = (u, cap) => !!u && (u.role === "admin" || !!(u.permissionOverrides && u.permissionOverrides[cap]));
const canEditStructure = (u) => hasCapability(u, "editStructure");
const canManageSeats = (u) => hasCapability(u, "manageSeats");
const canManageFeatures = (u) => hasCapability(u, "manageFeatures");

const admin = { role: "admin" };
const repNoGrant = { role: "rep", permissionOverrides: {} };
const repWithSeatGrant = { role: "rep", permissionOverrides: { manageSeats: true } };
const secretaryWithFeatureGrant = { role: "secretary", permissionOverrides: { manageFeatures: true } };
const repUndefinedOverrides = { role: "rep" };

ok(canEditStructure(admin) === true, "admin always passes canEditStructure regardless of any grant");
ok(canManageSeats(admin) === true, "admin always passes canManageSeats");
ok(canManageFeatures(admin) === true, "admin always passes canManageFeatures");

ok(canManageSeats(repNoGrant) === false, "a rep with no grants fails canManageSeats");
ok(canManageSeats(repWithSeatGrant) === true, "a rep granted manageSeats specifically passes canManageSeats");
ok(canEditStructure(repWithSeatGrant) === false, "the SAME rep, granted only manageSeats, still fails canEditStructure — grants are per-capability, not all-or-nothing");
ok(canManageFeatures(repWithSeatGrant) === false, "and still fails canManageFeatures too");

ok(canManageFeatures(secretaryWithFeatureGrant) === true, "a secretary granted manageFeatures passes canManageFeatures despite the role itself having no default authority");
ok(canManageSeats(secretaryWithFeatureGrant) === false, "the same secretary still fails canManageSeats — not granted");

ok(canManageSeats(repUndefinedOverrides) === false, "a user object with no permissionOverrides key at all (not even {}) doesn't crash and correctly denies");
ok(canManageSeats(null) === false || !canManageSeats(null), "canManageSeats(null) is falsy, not a crash");

if (fails) { console.log("\nbuild 102: " + fails + " FAILED"); process.exit(1); }
console.log("build 102 tests passed");
