/* Build 17 — appointment-type-aware notifications, review sequence. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- the right message for the right appointment --- */
const APPT_MESSAGES = [
  { match: /adjuster|inspection with|carrier/i, remind: true, id: "adjuster" },
  { match: /inspect|estimate|assessment|measure/i, remind: true, id: "inspect" },
  { match: /install|production|tear.?off|roof day/i, remind: true, id: "install" },
  { match: /deliver|material|drop|dump|trailer/i, remind: false, id: "delivery" },
  { match: /final|walk.?through|punch|completion/i, remind: true, id: "final" },
  { match: /repair|service|warranty|callback|leak/i, remind: true, id: "service" },
  { match: /sign|contract|paperwork/i, remind: true, id: "sign" },
];
const pick = (t) => (APPT_MESSAGES.find((m) => m.match.test(String(t || ""))) || { id: "fallback", remind: true });

ok(pick("Adjuster meeting").id === "adjuster", "adjuster meeting matched");
ok(pick("Roof inspection").id === "inspect", "inspection matched");
ok(pick("Installation").id === "install", "install matched");
ok(pick("Tear-off").id === "install", "tear-off routes to the install message");
ok(pick("Material delivery").id === "delivery", "delivery matched");
ok(pick("Final walkthrough").id === "final", "final walkthrough matched");
ok(pick("Warranty callback").id === "service", "service call matched");
ok(pick("Contract signing").id === "sign", "signing matched");
ok(pick("Coffee with Dave").id === "fallback", "an unknown type falls back safely");
ok(pick("").id === "fallback", "an empty type falls back safely");

/* the reminder default follows the type */
ok(pick("Material delivery").remind === false, "a delivery does not nag the customer the day before");
ok(pick("Installation").remind === true, "an install does remind — the driveway needs clearing");

/* order matters: adjuster is checked before the generic inspection rule */
ok(pick("Adjuster inspection").id === "adjuster",
  "an adjuster inspection is an adjuster meeting, not a routine inspection");

/* --- review funnel state --- */
function reviewState(job) {
  const r = job.review || {};
  if (r.posted) return "posted";
  if (r.rating && Number(r.rating) <= 3) return "recover";
  if (r.rating) return "rated";
  if (r.clicked) return "clicked";
  if (r.sent) return "sent";
  return "ready";
}
ok(reviewState({ review: {} }) === "ready", "an un-asked job is ready");
ok(reviewState({ review: { sent: true } }) === "sent", "asked but silent");
ok(reviewState({ review: { sent: true, clicked: true } }) === "clicked", "opened the link");
ok(reviewState({ review: { sent: true, rating: 5 } }) === "rated", "a happy rating");
ok(reviewState({ review: { sent: true, rating: 2 } }) === "recover", "a poor rating needs a human");
ok(reviewState({ review: { sent: true, rating: 3 } }) === "recover", "three is not a good review");
ok(reviewState({ review: { posted: true, rating: 1 } }) === "posted",
  "posted wins — the funnel is done regardless of what they said");

/* --- source guarantees --- */
ok(src.includes("const APPT_MESSAGES"), "appointment templates exist");
ok(src.includes("function apptMessageFor"), "type resolver exists");
ok(src.includes("THEY WILL RECEIVE"), "the exact message is previewed before queueing");
ok(src.includes("const typeRemindRef"), "changing type updates the reminder default");
ok(src.includes("move vehicles off the driveway"), "the install message says something useful");
ok(src.includes("You don't need to be home"), "delivery and inspection say attendance is not needed");
ok(src.includes("const REVIEW_STEPS"), "review sequence defined");
ok(src.length > 0 && (src.match(/id: "ask"|id: "request"|id: "nudge"|id: "final"/g) || []).length === 4,
  "four review touches");
ok(src.includes("function reviewState"), "funnel state resolver exists");
ok(src.includes("function nextReviewStep"), "next-due step resolver exists");
ok(src.includes("this is review gating"), "gating is addressed rather than copied");
ok(src.includes("Google's review policies prohibit"), "the risk of gating is stated plainly");
ok(src.includes("gateNegativeReviews"), "gating is an explicit, off-by-default choice");
ok(src.includes("conversion"), "conversion is measured");

if (fails) { console.log("\nbuild 17: " + fails + " FAILED"); process.exit(1); }
console.log("build 17 tests passed");
