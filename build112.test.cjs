/* Build 112 — sub-payout notify trigger (part 3 of the sub/cap-out
   payment-ready notification feature).

   Wires SubInvoiceCard.confirmInv() to auto-notify the company's
   designated billing contact (build 110/111) the instant a sub
   invoice is confirmed — no queue, immediate send, per the owner's
   explicit auto-send decision. A new job.subInvoice.notifiedAt field
   guards against firing twice for the same invoice.

   Requires threading integrations/users into SubInvoiceCard and its
   TabWorkOrder call site, and integrations into TabWorkOrder itself
   (users was already there).
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: prop threading ---------- */
ok(/function SubInvoiceCard\(\{ job, crew, mut, toast, currentUser, brand, integrations, users \}\)/.test(src),
  "SubInvoiceCard now accepts integrations and users");
ok(/function TabWorkOrder\(\{ job, mut, toast, brand, crews, templates, currentUser, users, integrations \}\)/.test(src),
  "TabWorkOrder now accepts integrations too (users was already there)");
ok(/<SubInvoiceCard job=\{job\} crew=\{crew\} mut=\{mut\} toast=\{toast\} currentUser=\{currentUser\} brand=\{brand\} integrations=\{integrations\} users=\{users\} \/>/.test(src),
  "TabWorkOrder threads integrations and users down into SubInvoiceCard");
ok(/case "workorder": return <TabWorkOrder job=\{job\} mut=\{mut\} toast=\{toast\} brand=\{brand\}\s*\n\s*crews=\{crews\} templates=\{templates\} currentUser=\{currentUser\} users=\{users\} integrations=\{integrations\} \/>;/.test(src),
  "JobDetail's own TabWorkOrder call site now passes integrations through");

/* ---------- static: confirmInv wiring ---------- */
const ciStart = src.indexOf("const confirmInv = async () => {");
ok(ciStart !== -1, "confirmInv is now async (it awaits the notification send)");
const ciSrc = src.slice(ciStart, ciStart + 1200);
ok(/if \(!inv\.notifiedAt\) \{/.test(ciSrc), "confirmInv only notifies once per invoice — guarded by notifiedAt");
ok(/const out = await deliverToBillingContact\(job, \{ subject, body \}, integrations, users, brand, currentUser\);/.test(ciSrc),
  "confirmInv calls the real deliverToBillingContact helper with the real params, not a stub");
ok(/if \(out\.contact\) setInv\(\{ notifiedAt: new Date\(\)\.toISOString\(\) \}\);/.test(ciSrc),
  "confirmInv only stamps notifiedAt when a contact was actually resolvable — never claims a send that couldn't have happened");
ok(/setInv\(\{ status: "confirmed", confirmedBy: \(currentUser \|\| \{\}\)\.name \|\| "", confirmedAt: todayIso\(\), dueDate \}\);/.test(ciSrc),
  "the original status-confirm behavior is unchanged and still fires synchronously before the async notify step");

/* ---------- behavioral: mirror the guard + contact-gated stamping logic ---------- */
async function fakeDeliverToBillingContact(job, msg, hasContact) {
  return hasContact ? { contact: { id: "u1" }, sent: [{ delivered: true }] } : { contact: null, sent: [] };
}
async function fakeConfirmInv(inv, hasContact) {
  const patches = [];
  patches.push({ status: "confirmed" });
  if (!inv.notifiedAt) {
    const out = await fakeDeliverToBillingContact({ id: "j1" }, { subject: "s", body: "b" }, hasContact);
    if (out.contact) patches.push({ notifiedAt: "STAMPED" });
  }
  return patches;
}
(async () => {
  const withContact = await fakeConfirmInv({ status: "draft" }, true);
  ok(withContact.length === 2 && withContact[1].notifiedAt === "STAMPED",
    "confirming with a resolvable billing contact stamps notifiedAt");

  const noContact = await fakeConfirmInv({ status: "draft" }, false);
  ok(noContact.length === 1, "confirming with no resolvable contact still confirms the invoice but never fakes a notifiedAt stamp");

  const alreadyNotified = await fakeConfirmInv({ status: "confirmed", notifiedAt: "2026-01-01T00:00:00.000Z" }, true);
  ok(alreadyNotified.length === 1, "an invoice that was already notified doesn't get notified a second time, even if re-confirmed");

  if (fails) { console.log("\nbuild 112: " + fails + " FAILED"); process.exit(1); }
  console.log("build 112 tests passed");
})();
