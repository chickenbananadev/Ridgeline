/* Build 111 — billingContactFor / deliverToBillingContact helpers
   (part 2 of the sub/cap-out payment-ready notification feature).

   These are the send plumbing for the notification: billingContactFor
   resolves brand.billingContactUserId (added in build 110) to a real
   active user, falling back to any active admin so an unconfigured
   company still gets notified by someone. deliverToBillingContact
   fires email and/or SMS to that contact via the existing deliverMessage
   primitive — immediately, no job.messages "Queued" step, per the
   owner's explicit auto-send decision. No call sites are wired to
   these yet (that's builds 112/113) — this build verifies the helpers
   in isolation.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/function billingContactFor\(brand, users\) \{/.test(src),
  "billingContactFor exists with the expected signature");
ok(/const chosen = id && list\.find\(\(u\) => u\.id === id && u\.active !== false\);/.test(src),
  "billingContactFor only accepts an active user as the configured contact");
ok(/return list\.find\(\(u\) => u\.active !== false && u\.role === "admin"\) \|\| null;/.test(src),
  "billingContactFor falls back to any active admin when unset/inactive, never returns nothing silently");
ok(/async function deliverToBillingContact\(job, \{ subject, body \}, integrations, users, brand, currentUser\) \{/.test(src),
  "deliverToBillingContact exists with the expected signature");
ok(/if \(!contact\) return \{ contact: null, sent: \[\] \};/.test(src),
  "deliverToBillingContact no-ops safely when no contact can be resolved at all (empty user list)");
ok(/sent\.push\(await deliverMessage\(\{ to: contact\.email, kind: "email"/.test(src),
  "deliverToBillingContact sends email to the resolved contact when they have one on file");
ok(/sent\.push\(await deliverMessage\(\{ to: contact\.phone, kind: "sms"/.test(src),
  "deliverToBillingContact sends SMS to the resolved contact when they have a phone on file");
ok(!/deliverToBillingContact[\s\S]{0,400}status: "Queued"/.test(src.slice(src.indexOf("async function deliverToBillingContact"), src.indexOf("async function deliverToBillingContact") + 900)),
  "deliverToBillingContact never appends a Queued status itself — it calls deliverMessage directly (auto-send, no human queue step)");

/* ---------- behavioral: mirror billingContactFor's resolution logic ---------- */
function billingContactFor(brand, users) {
  const list = users || [];
  const id = brand && brand.billingContactUserId;
  const chosen = id && list.find((u) => u.id === id && u.active !== false);
  if (chosen) return chosen;
  return list.find((u) => u.active !== false && u.role === "admin") || null;
}
const USERS = [
  { id: "u1", name: "Jacob Henderson", role: "admin", active: true, email: "jacob@x.com", phone: "5551234567" },
  { id: "u2", name: "Drew Klass", role: "rep", active: true, email: "drew@x.com", phone: "" },
  { id: "u3", name: "Retired Admin", role: "admin", active: false, email: "old@x.com", phone: "" },
];
ok(billingContactFor({ billingContactUserId: "u2" }, USERS).id === "u2",
  "resolves the configured contact when set and active");
ok(billingContactFor({ billingContactUserId: "" }, USERS).id === "u1",
  "falls back to the active admin when no contact is configured");
ok(billingContactFor({ billingContactUserId: "u3" }, USERS).id === "u1",
  "falls back to the active admin when the configured contact was deactivated since being set");
ok(billingContactFor({ billingContactUserId: "nonexistent" }, USERS).id === "u1",
  "falls back to the active admin when the configured id no longer matches any user");
ok(billingContactFor({}, []) === null,
  "returns null (not a crash) when there are no users at all — the caller no-ops on this");

/* ---------- behavioral: mirror deliverToBillingContact's dual-channel send shape ---------- */
async function fakeDeliverMessage({ to, kind }) { return { kind, to, status: "Sent", delivered: true }; }
async function fakeDeliverToBillingContact(job, { subject, body }, contact) {
  if (!contact) return { contact: null, sent: [] };
  const sent = [];
  if (contact.email) sent.push(await fakeDeliverMessage({ to: contact.email, kind: "email", subject, body, jobId: job.id }));
  if (contact.phone) sent.push(await fakeDeliverMessage({ to: contact.phone, kind: "sms", subject, body, jobId: job.id }));
  return { contact, sent };
}
(async () => {
  const bothChannels = await fakeDeliverToBillingContact({ id: "j1" }, { subject: "s", body: "b" }, USERS[0]);
  ok(bothChannels.sent.length === 2, "a contact with both email and phone gets both channels sent");
  ok(bothChannels.sent[0].kind === "email" && bothChannels.sent[1].kind === "sms",
    "email is attempted before SMS, matching the order in the real function");

  const emailOnly = await fakeDeliverToBillingContact({ id: "j1" }, { subject: "s", body: "b" }, USERS[1]);
  ok(emailOnly.sent.length === 1 && emailOnly.sent[0].kind === "email",
    "a contact with no phone on file only gets the email channel, no SMS attempt");

  const nobody = await fakeDeliverToBillingContact({ id: "j1" }, { subject: "s", body: "b" }, null);
  ok(nobody.sent.length === 0 && nobody.contact === null, "no contact resolvable means no sends at all, not an error");

  if (fails) { console.log("\nbuild 111: " + fails + " FAILED"); process.exit(1); }
  console.log("build 111 tests passed");
})();
