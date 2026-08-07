/* Build 101 — six roles: Admin, Secretary, Production manager, Sales
   manager, Sales rep, Crew (up from four). Secretary is admin-lite
   ops (scheduling/customers/documents, no financials, no structure
   changes); Sales manager is admin-lite sales (every rep's jobs/
   commissions/leaderboard, same shape as Production manager but for
   the sales side).

   Direct role-string comparisons were scattered across 13+ places in
   the file, most critically 10 identical copies of `role === "admin"
   || role === "manager"` gating back-office config screens with no
   shared helper backing them — splitting "manager" into two new roles
   and adding Secretary couldn't be done by editing ROLES alone. This
   build introduces canManageCompanyConfig() as the one new
   centralized helper replacing all 10 duplicates, plus
   canSeeCompanyPerformance() fixing a related pre-existing gap:
   Performance's own "isAdmin" prop was wired to admin-only even
   though Production manager's ROLES blurb always promised company-
   wide visibility — Sales manager needs the identical thing.

   Also: canSeeMoney() now excludes secretary alongside crew, which
   the crm_financials RLS policy (migration 028) and the client-side
   useDbSync money-fetch gate (renamed isCrew -> isMoneyBlocked) both
   had to catch up to, or the database would stay a wider door than
   the UI shows -- the same class of bug fixed for crew's own leak in
   build 96.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const migPath = path.join(__dirname, "supabase/migrations/028_six_roles.sql");
const mig = fs.readFileSync(migPath, "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: ROLES ---------- */
const rolesMatch = src.match(/const ROLES = \[([\s\S]*?)\];/);
ok(!!rolesMatch, "ROLES constant found");
const rolesBody = rolesMatch ? rolesMatch[1] : "";
["admin", "secretary", "manager", "sales_manager", "rep", "crew"].forEach((id) => {
  ok(new RegExp(`id: "${id}"`).test(rolesBody), `ROLES includes id "${id}"`);
});
ok((rolesBody.match(/\{ id:/g) || []).length === 6, "ROLES has exactly 6 entries, not more or fewer");
ok(/label: "Secretary"/.test(rolesBody), "Secretary has a real label");
ok(/label: "Sales manager"/.test(rolesBody), "Sales manager has a real label");

/* ---------- static: money visibility ---------- */
ok(/const canSeeMoney = \(u\) => u && !\["crew", "secretary"\]\.includes\(u\.role\);/.test(src),
  "canSeeMoney now excludes secretary alongside crew");

/* ---------- static: new centralized helpers ---------- */
ok(/const canManageCompanyConfig = \(u\) => u && \["admin", "secretary", "manager", "sales_manager"\]\.includes\(u\.role\);/.test(src),
  "canManageCompanyConfig exists with the right 4-role membership");
ok(/const canSeeCompanyPerformance = \(u\) => u && \["admin", "manager", "sales_manager"\]\.includes\(u\.role\);/.test(src),
  "canSeeCompanyPerformance exists, deliberately excluding secretary (no financials) and rep/crew");

/* ---------- static: all 10 old inline duplicates are gone ---------- */
ok(!/role === "admin".*role === "manager"|role === "manager".*role === "admin"/.test(src),
  "no more inline \"admin or manager\" role-string comparisons remain anywhere in the file");
const configCallCount = (src.match(/canManageCompanyConfig\(currentUser\)/g) || []).length;
ok(configCallCount >= 10, `canManageCompanyConfig(currentUser) is called at least 10 times, replacing every old duplicate (found ${configCallCount})`);

/* ---------- static: Performance gets real company-wide visibility for both manager roles ---------- */
ok(/isAdmin=\{canSeeCompanyPerformance\(liveUser\)\}/.test(src),
  "the <Performance> call site passes canSeeCompanyPerformance's result, not the general admin-only isAdmin");
/* The root isAdmin (structure/seats/other sensitive gates) must stay
   admin-only and untouched by this change. */
ok(/const isAdmin = canEditStructure\(liveUser\);/.test(src),
  "the root isAdmin variable used for structure/seat gates is unchanged (still admin-only)");

/* ---------- static: isCrew fully renamed to isMoneyBlocked ---------- */
ok(!/\bisCrew\b/.test(src), "no isCrew identifier remains anywhere in the file");
ok(/isMoneyBlocked: !!\(currentUser && !canSeeMoney\(currentUser\)\)/.test(src),
  "useDbSync's caller computes isMoneyBlocked from canSeeMoney, not a role === \"crew\" check");
ok((src.match(/if \(!isMoneyBlocked\) \{/g) || []).length === 2,
  "both crm_financials read and write gates in useDbSync now check !isMoneyBlocked");

/* ---------- static: migration 028 ---------- */
ok(fs.existsSync(migPath), "migration 028_six_roles.sql exists");
ok(/alter type user_role add value if not exists 'secretary';/.test(mig), "the enum gains 'secretary'");
ok(/alter type user_role add value if not exists 'sales_manager';/.test(mig), "the enum gains 'sales_manager'");
ok(/p\.role is distinct from 'crew' and p\.role is distinct from 'secretary'/.test(mig),
  "crm_financials's RLS policy now blocks secretary at the database level too, matching the new canSeeMoney");
const finRwCount = (mig.match(/p\.role is distinct from 'crew' and p\.role is distinct from 'secretary'/g) || []).length;
ok(finRwCount === 2, "the secretary exclusion appears in both the USING and WITH CHECK clauses");

/* ---------- behavioral: mirror the helper logic against real fixtures ---------- */
const canSeeMoney = (u) => u && !["crew", "secretary"].includes(u.role);
const canManageCompanyConfig = (u) => u && ["admin", "secretary", "manager", "sales_manager"].includes(u.role);
const canSeeCompanyPerformance = (u) => u && ["admin", "manager", "sales_manager"].includes(u.role);

const roleIds = ["admin", "secretary", "manager", "sales_manager", "rep", "crew"];
const expectMoney =    { admin: true,  secretary: false, manager: true,  sales_manager: true,  rep: true,  crew: false };
const expectConfig =   { admin: true,  secretary: true,  manager: true,  sales_manager: true,  rep: false, crew: false };
const expectCompanyPerf = { admin: true, secretary: false, manager: true, sales_manager: true, rep: false, crew: false };

roleIds.forEach((role) => {
  const u = { role };
  ok(canSeeMoney(u) === expectMoney[role], `canSeeMoney(${role}) === ${expectMoney[role]}`);
  ok(canManageCompanyConfig(u) === expectConfig[role], `canManageCompanyConfig(${role}) === ${expectConfig[role]}`);
  ok(canSeeCompanyPerformance(u) === expectCompanyPerf[role], `canSeeCompanyPerformance(${role}) === ${expectCompanyPerf[role]}`);
});
ok(canSeeMoney(null) === null || canSeeMoney(null) === false || !canSeeMoney(null), "canSeeMoney(null) is falsy, not a crash");

if (fails) { console.log("\nbuild 101: " + fails + " FAILED"); process.exit(1); }
console.log("build 101 tests passed");
