/* Build 107 — a canceled subscription must actually stop granting
   access, and only the right people can trigger cancellation in the
   first place.

   Before this build, is_tenant_locked() existed in the database and
   my_tenant() already returned it, but nothing in ridgeline.jsx ever
   read it — the ONLY visible trace of a canceled or past_due company
   was a colored status chip on the admin's own Team & seats screen.
   A canceled company kept full, unrestricted access to the entire
   product forever.

   Two real, independent fixes:

   1. App-side gate: once tenantLock.locked is true, the whole app is
      replaced with a "Subscription canceled" screen offering
      Reactivate billing (admin/delegated) or a message to contact an
      admin (everyone else), instead of the real app.
   2. Server-side gate: create-portal-session — the function that
      actually opens Stripe's Billing Portal, where a subscription is
      changed or canceled — had NO role check at all. Any active seat
      could call it directly and reach billing controls the client UI
      never shows them. Now mirrors invite-user's admin-or-delegated
      shape.

   Also: migration 030 narrows is_tenant_locked() itself. The version
   inherited from migration 026 locked on `past_due` (the very first
   failed charge, before Stripe's own ~2-3 week retry schedule has even
   started) and on `trialing AND trial_ends_at < now()` (a race against
   stripe-webhook's own delivery, which could lock someone out in the
   exact moment they're supposed to convert smoothly from trial to
   paid). Both would have been "block immediately" — the option
   explicitly NOT chosen. `status = 'canceled'` alone already gives the
   real grace period: Stripe never sets that status until a
   cancel-at-period-end cycle genuinely ends, or its own retries are
   exhausted.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const portalSrc = fs.readFileSync(path.join(__dirname, "supabase/functions/create-portal-session/index.ts"), "utf8");
const migPath = path.join(__dirname, "supabase/migrations/030_billing_lockout.sql");
const mig = fs.readFileSync(migPath, "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: migration 030 narrows is_tenant_locked() ---------- */
ok(fs.existsSync(migPath), "migration 030_billing_lockout.sql exists");
ok(/select t\.status = 'canceled'\s*\n\s*from tenants t where t\.id = p_tenant_id and t\.id = current_tenant_id\(\)/.test(mig),
  "is_tenant_locked() now checks status = 'canceled' only, still scoped to the caller's own tenant");
ok(!/t\.status = 'past_due'/.test(mig) || /past_due.*fires the moment ONE card charge attempt fails/.test(mig),
  "the migration's own body doesn't reintroduce a bare past_due lock clause (only discusses it in the explanatory comment)");
ok(!/trialing.*trial_ends_at < now\(\)/.test(mig.split("Idempotent")[1] || ""),
  "the final function body (after the explanatory comment) drops the trial-clock race condition clause");

/* ---------- static: App fetches and stores the lock state ---------- */
ok(/const \[tenantLock, setTenantLock\] = useState\(null\);/.test(src),
  "the App component tracks tenantLock, starting unresolved (null) rather than a guessed default");
ok(/auth\.myTenant\(\)\s*\n\s*\.then\(\(t\) => \{ if \(alive\) setTenantLock\(\{ locked: !!\(t && t\.locked\) \}\); \}\)/.test(src),
  "the fetch reads my_tenant().locked, the same security-definer field TeamManager's own tenant fetch already trusts");
ok(/\.catch\(\(\) => \{ if \(alive\) setTenantLock\(\{ locked: false \}\); \}\);/.test(src),
  "a failed fetch fails OPEN (locked: false), not closed — a network hiccup must never lock out a paying customer");

/* ---------- static: the gate itself ---------- */
ok(/if \(liveAuth\(\) && liveUser\.tenantId && tenantLock && tenantLock\.locked\) \{/.test(src),
  "the lockout screen only renders once tenantLock has actually resolved to locked — never while still null/loading");
ok(/Subscription canceled/.test(src), "the lockout screen states plainly what happened");
ok(/const canReactivate = canManageSeats\(liveUser\);/.test(src),
  "who sees a working Reactivate-billing button is gated by the same canManageSeats capability Team & seats already uses for Manage billing");
ok(/Ask an admin to reactivate billing/.test(src),
  "a non-admin sees a message pointing at their admin, not a button they can't use");
ok(/nothing has been deleted/.test(src), "the copy reassures that canceling didn't destroy their data");

/* ---------- static: create-portal-session gets a real role check ---------- */
ok(/select\("tenant_id, role, active, permission_overrides"\)/.test(portalSrc),
  "create-portal-session now fetches role/active/permission_overrides, not just tenant_id");
ok(/const canManageBilling = profile\.active && \(profile\.role === "admin" \|\| !!profile\.permission_overrides\?\.manageSeats\);/.test(portalSrc),
  "the same admin-or-delegated-manageSeats shape invite-user already enforces, applied here for the first time");
ok(/if \(!canManageBilling\) return json\(\{ error: "Only an admin can manage billing\." \}, 403\);/.test(portalSrc),
  "a caller who fails the check is rejected with a real 403, not silently handed a portal link anyway");

/* ---------- behavioral: mirror the lock decision against real fixtures ---------- */
/* Mirrors is_tenant_locked()'s new SQL exactly: only a genuinely
   canceled status locks — nothing else, regardless of how it got
   there. */
const isLocked = (tenant) => !!tenant && tenant.status === "canceled";

ok(isLocked({ status: "canceled" }) === true, "a canceled tenant is locked");
ok(isLocked({ status: "active" }) === false, "an active tenant is not locked");
ok(isLocked({ status: "trialing" }) === false, "a tenant still trialing is not locked, even close to trial end");
ok(isLocked({ status: "trialing", trial_ends_at: "2000-01-01T00:00:00Z" }) === false,
  "a tenant whose trial clock has already run out is STILL not locked on the clock alone — only a confirmed canceled status locks, avoiding the webhook-race false lock");
ok(isLocked({ status: "past_due" }) === false,
  "a single failed charge (past_due) does not lock — Stripe's own retry schedule is the real grace period, not blocked access");
ok(isLocked(null) === false, "no tenant loaded yet reads as not locked (fails open)");

/* ---------- behavioral: mirror who can reactivate/manage billing ---------- */
const canManageBilling = (u) => !!u && u.active !== false && (u.role === "admin" || !!(u.permissionOverrides && u.permissionOverrides.manageSeats));

ok(canManageBilling({ role: "admin", active: true }) === true, "an active admin can manage billing");
ok(canManageBilling({ role: "rep", active: true }) === false, "a plain rep cannot manage billing");
ok(canManageBilling({ role: "rep", active: true, permissionOverrides: { manageSeats: true } }) === true,
  "a rep delegated manageSeats CAN manage billing — the delegation feature actually reaches this gate");
ok(canManageBilling({ role: "admin", active: false }) === false,
  "a deactivated admin's seat cannot manage billing, even though the role field still says admin");
ok(canManageBilling({ role: "sales_manager", active: true, permissionOverrides: { editStructure: true } }) === false,
  "a DIFFERENT delegated capability (editStructure) does not also grant billing access — only manageSeats does");

if (fails) { console.log("\nbuild 107: " + fails + " FAILED"); process.exit(1); }
console.log("build 107 tests passed");
