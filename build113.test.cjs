/* Build 113 — cap-out notify trigger (part 4 of the sub/cap-out
   payment-ready notification feature).

   Wires TabPayments' log/edit/delete payment handlers to auto-notify
   the billing contact the instant a job's balance crosses fully paid
   (paymentsSummary(job).balance <= 0.01 — the same threshold
   STAGE_CHECKS.paidfull already uses to warn-gate entry into "Job
   completed"). A new job.capOutNotifiedAt field guards against
   re-firing on every subsequent payment edit once already notified,
   and is cleared if a later edit/refund pushes the balance back above
   the threshold, so a genuine re-completion notifies again.

   Requires threading currentUser/brand/integrations/users through
   TabFinancialsCombined and TabPayments (both previously lacked users;
   TabPayments lacked all four).
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: prop threading ---------- */
ok(/function TabPayments\(\{ job, mut, toast, onLog = \(\) => \{\}, currentUser, brand, integrations, users \}\)/.test(src),
  "TabPayments now accepts currentUser/brand/integrations/users");
ok(/function TabFinancialsCombined\(\{ job, mut, toast, isAdmin, currentUser, brand, integrations = \{\}, onLog = \(\) => \{\}, users \}\)/.test(src),
  "TabFinancialsCombined now also accepts users (it already had the other three)");
ok(/<TabPayments job=\{job\} mut=\{mut\} toast=\{toast\} onLog=\{onLog\} currentUser=\{currentUser\} brand=\{brand\} integrations=\{integrations\} users=\{users\} \/>/.test(src),
  "TabFinancialsCombined threads all four down into TabPayments");
ok(/case "financials": return <TabFinancialsCombined job=\{job\} mut=\{mut\} toast=\{toast\} isAdmin=\{isAdmin\} currentUser=\{currentUser\} brand=\{brand\} integrations=\{integrations\} onLog=\{onLog\} users=\{users\} \/>;/.test(src),
  "JobDetail's own TabFinancialsCombined call site now passes users through");

/* ---------- static: notifyCapOutIfReady exists and is wired into all three mutation sites ---------- */
const nsStart = src.indexOf("const notifyCapOutIfReady = async (nextPayments) => {");
ok(nsStart !== -1, "notifyCapOutIfReady exists");
const nsSrc = src.slice(nsStart, nsStart + 900);
ok(/const ready = paymentsSummary\(\{ \.\.\.job, payments: nextPayments \}\)\.balance <= 0\.01;/.test(nsSrc),
  "readiness reuses the same balance<=0.01 threshold STAGE_CHECKS.paidfull already uses — no new threshold invented");
ok(/if \(ready && !job\.capOutNotifiedAt\) \{/.test(nsSrc), "only notifies when newly ready and not already notified");
ok(/const out = await deliverToBillingContact\(job, \{ subject, body \}, integrations, users, brand, currentUser\);/.test(nsSrc),
  "calls the real deliverToBillingContact with real params");
ok(/if \(out\.contact\) mut\(\(j\) => \(\{ \.\.\.j, capOutNotifiedAt: new Date\(\)\.toISOString\(\) \}\)\);/.test(nsSrc),
  "only stamps capOutNotifiedAt when a contact was actually resolvable");
ok(/\} else if \(!ready && job\.capOutNotifiedAt\) \{\s*\n\s*mut\(\(j\) => \(\{ \.\.\.j, capOutNotifiedAt: null \}\)\);/.test(nsSrc),
  "clears capOutNotifiedAt when a later edit pushes the balance back above the threshold");

ok(/await notifyCapOutIfReady\(nextPayments\);\s*\n\s*\}\}><Plus size=\{15\} \/> Log payment/.test(src),
  "logging a payment checks readiness with the freshly-computed payments array");
ok(/setEditPay\(null\); toast\("Payment updated"\);\s*\n\s*await notifyCapOutIfReady\(nextPayments\);/.test(src),
  "editing a payment checks readiness after saving");
ok(/setEditPay\(null\); toast\("Payment removed"\);\s*\n\s*await notifyCapOutIfReady\(nextPayments\);/.test(src),
  "deleting a payment checks readiness after removing (a refund crossing the balance back up should clear, not just skip)");

/* ---------- behavioral: mirror the readiness/guard logic against synthetic data ---------- */
function paymentsSummary(job) {
  const received = job.payments.filter((p) => p.type === "Received").reduce((s, p) => s + p.amt, 0);
  return { received, balance: job.contract.price - received };
}
async function fakeDeliverToBillingContact(hasContact) {
  return hasContact ? { contact: { id: "u1" } } : { contact: null };
}
async function fakeNotify(job, nextPayments, hasContact) {
  const patches = [];
  const ready = paymentsSummary({ ...job, payments: nextPayments }).balance <= 0.01;
  if (ready && !job.capOutNotifiedAt) {
    const out = await fakeDeliverToBillingContact(hasContact);
    if (out.contact) patches.push({ capOutNotifiedAt: "STAMPED" });
  } else if (!ready && job.capOutNotifiedAt) {
    patches.push({ capOutNotifiedAt: null });
  }
  return patches;
}
(async () => {
  const job = { contract: { price: 5000 }, capOutNotifiedAt: null };

  const partial = await fakeNotify(job, [{ type: "Received", amt: 3000 }], true);
  ok(partial.length === 0, "a partial payment (balance still owed) never notifies");

  const full = await fakeNotify(job, [{ type: "Received", amt: 5000 }], true);
  ok(full.length === 1 && full[0].capOutNotifiedAt === "STAMPED", "a payment that brings the balance to exactly zero notifies and stamps");

  const alreadyNotifiedJob = { contract: { price: 5000 }, capOutNotifiedAt: "2026-01-01T00:00:00.000Z" };
  const reEdit = await fakeNotify(alreadyNotifiedJob, [{ type: "Received", amt: 5000 }], true);
  ok(reEdit.length === 0, "editing a payment on an already-notified, still-fully-paid job doesn't re-notify");

  const refund = await fakeNotify(alreadyNotifiedJob, [{ type: "Received", amt: 2000 }], true);
  ok(refund.length === 1 && refund[0].capOutNotifiedAt === null,
    "a refund/edit that pushes an already-notified job back into balance-owed clears capOutNotifiedAt");

  const noContact = await fakeNotify(job, [{ type: "Received", amt: 5000 }], false);
  ok(noContact.length === 0, "reaching full payment with no resolvable billing contact never fakes a stamp");

  if (fails) { console.log("\nbuild 113: " + fails + " FAILED"); process.exit(1); }
  console.log("build 113 tests passed");
})();
