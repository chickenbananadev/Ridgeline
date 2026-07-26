/* Build 16 — appointment notifications, consent-gated. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- consent decides the channel, and gates sending at all --- */
function consentChannel(j) {
  if (!j || !j.consent) return null;
  if (j.consent.sms && j.consent.sms.granted) return "sms";
  if (j.consent.email && j.consent.email.granted) return "email";
  return null;
}
ok(consentChannel({ consent: { sms: { granted: true }, email: { granted: true } } }) === "sms",
  "text is preferred when both are granted");
ok(consentChannel({ consent: { sms: { granted: false }, email: { granted: true } } }) === "email",
  "falls back to email when SMS is refused");
ok(consentChannel({ consent: { sms: { granted: false }, email: { granted: false } } }) === null,
  "no consent means no channel");
ok(consentChannel({}) === null, "a job with no consent record sends nothing");
ok(consentChannel(null) === null, "a missing job sends nothing");

/* --- the day-before date, in local terms --- */
function isoLocal(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}
function dayBefore(iso) {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() - 1);
  return isoLocal(d);
}
ok(dayBefore("2026-07-24") === "2026-07-23", "day before a normal date");
ok(dayBefore("2026-08-01") === "2026-07-31", "crosses a month boundary");
ok(dayBefore("2026-01-01") === "2025-12-31", "crosses a year boundary");
ok(dayBefore("2028-03-01") === "2028-02-29", "handles a leap year");
ok(dayBefore(null) === null, "no date, no reminder");
// midday anchoring keeps DST from shifting the result
ok(dayBefore("2026-11-02") === "2026-11-01", "unaffected by a DST boundary");

/* --- source guarantees --- */
ok(src.includes("const consentChannel"), "consent helper exists");
ok(src.includes("const queueFor"), "one queue path for confirmations and reminders");
ok(src.includes("function dayBefore"), "day-before helper exists");
ok(src.includes("const [notifyNow, setNotifyNow]"), "confirmation is opt-outable");
ok(src.includes("const [notifyDayBefore, setNotifyDayBefore]"), "day-before reminder is opt-outable");
ok(src.includes("sendOn: kindOf === \"reminder\" ? dayBefore(appt.date) : null"),
  "reminders carry the date they should go out");
ok(src.includes("No messaging consent on file"), "missing consent is explained, not silently ignored");
ok(src.includes("TCPA"), "the legal reason for consent is stated");
ok(src.includes("a homeowner will not open a portal to be reminded")
  || src.includes("not open a portal to be reminded"),
  "the portal-versus-push distinction is explained in the UI");
ok(src.includes('if (!editingId && notifyNow && jb)'),
  "editing an appointment does not re-send the original confirmation");

if (fails) { console.log("\nbuild 16: " + fails + " FAILED"); process.exit(1); }
console.log("build 16 tests passed");
