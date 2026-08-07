/* Build 108 — a dedicated, discoverable Billing screen: More → Billing
   → Manage subscription, per the owner's explicit request. Before
   this, the only way to reach Stripe's Billing Portal was a small
   "Manage billing" button buried inside Team & seats — reachable, but
   not what anyone would call discoverable, and there was no page that
   previewed what the portal actually offers before sending someone
   into it.

   BillingSettings is a new, separate screen (not a replacement for
   TeamManager's own compact Subscription card, which stays — useful
   there for at-a-glance context while already managing seats). Same
   data source (my_tenant()), same action (manageBilling(), unchanged),
   same admin-or-delegated gate create-portal-session already enforces
   server-side (build 107) — this build only adds a second, more
   prominent front door to it, consistent with the copy the owner asked
   for: change cards, view invoices, cancel, switch plans, update
   billing information.

   Also renames the user-visible "Manage billing" label to "Manage
   subscription" everywhere it appears, so the two entry points use one
   consistent term instead of two different ones for the same action.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: the new screen exists and is wired in ---------- */
ok(/function BillingSettings\(\{ currentUser, onBack, toast \}\) \{/.test(src),
  "BillingSettings component exists with the standard screen-component signature");
ok(/\["billing", CreditCard, "Billing",/.test(src),
  "a 'Billing' entry exists in the More menu's Setup group");
ok(/nav === "billing" \? \(\s*\n\s*<BillingSettings currentUser=\{liveUser\} onBack=\{\(\) => setNav\("more"\)\} toast=\{toast\} \/>/.test(src),
  "the root App component routes nav === \"billing\" to BillingSettings");

/* ---------- static: gated the same way create-portal-session enforces server-side ---------- */
ok(/const canManage = canManageSeats\(currentUser\);/.test(src),
  "BillingSettings gates on canManageSeats, matching create-portal-session's own admin-or-delegated check");
ok(/Billing is managed by an admin\. Ask them to change cards, view invoices, switch/.test(src),
  "a non-admin, non-delegated user sees a message pointing at their admin instead of billing details");

/* ---------- static: previews all 5 things the owner asked the Customer Portal to offer ---------- */
for (const line of [
  "Change your card", "View and download invoices", "Switch between Base and Unlimited",
  "Update billing information", "Cancel your subscription",
]) {
  ok(src.includes(`"${line}"`), `the Billing screen previews: ${line}`);
}

/* ---------- static: the actual button and its wiring ---------- */
ok(/<Btn style=\{\{ width: "100%" \}\} onClick=\{manageBilling\} disabled=\{busy\}>\s*\n\s*\{busy \? "Opening…" : "Manage subscription"\}/.test(src),
  "the primary button is labeled 'Manage subscription' and calls the same manageBilling() action");
ok(/RoofStride itself never\s*\n\s*stores your card\./.test(src),
  "the screen is honest that RoofStride never touches card data itself — Stripe does");

/* ---------- static: consistent labeling everywhere else the action appears ---------- */
ok(!/"Manage billing"/.test(src), "no user-visible button/label still says the old 'Manage billing' wording");
ok(/Upgrade to Unlimited in Manage subscription/.test(src),
  "TeamManager's seat-limit copy was updated to the new consistent wording too");
ok(/reach Manage subscription from Team & seats or More → Billing/.test(src),
  "the billing-lockout screen's own comment (build 107) was updated to reference both real entry points");

/* ---------- static: CreditCard icon is actually imported, not just referenced ---------- */
ok(/CreditCard \} from "lucide-react";/.test(src), "CreditCard is imported from lucide-react, not left as an undefined reference");

/* ---------- behavioral: mirror who reaches a working button vs. the admin message ---------- */
const canManageSeats = (u) => !!u && (u.role === "admin" || !!(u.permissionOverrides && u.permissionOverrides.manageSeats));
ok(canManageSeats({ role: "admin" }) === true, "an admin reaches the full Billing screen");
ok(canManageSeats({ role: "rep" }) === false, "a plain rep sees the 'ask an admin' message instead");
ok(canManageSeats({ role: "secretary", permissionOverrides: { manageSeats: true } }) === true,
  "a secretary delegated manageSeats also reaches the full Billing screen — matches TeamManager's own gate");

if (fails) { console.log("\nbuild 108: " + fails + " FAILED"); process.exit(1); }
console.log("build 108 tests passed");
