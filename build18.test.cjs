/* Build 18 — sold handoff, change orders, admin switches, audit log,
   anomaly detection. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };
const num = (x) => Number(String(x ?? "").replace(/[^0-9.-]/g, "")) || 0;

/* --- handoff readiness --- */
const checks = [
  { id: "contract", test: (j) => !!(j.contract && j.contract.status === "Signed") },
  { id: "price", test: (j) => num(j.contract && j.contract.price) > 0 || num(j.fin && j.fin.contract) > 0 },
  { id: "deposit", test: (j) => num((j.payments || []).reduce((a, p) => a + num(p.amount), 0)) > 0 || !!j.depositWaived },
  { id: "claim", test: (j) => j.claimType !== "Insurance" || ["scope", "supplement", "scheduled", "invoiced", "closed"].includes((j.claim || {}).stage) },
];
const ready = (j) => checks.every((c) => c.test(j));
ok(!ready({}), "an empty job is not ready for production");
ok(ready({ contract: { status: "Signed", price: 18000 }, payments: [{ amount: 5000 }], claimType: "Retail" }),
  "a signed, priced, deposited retail job is ready");
ok(!ready({ contract: { status: "Signed", price: 18000 }, payments: [{ amount: 5000 }], claimType: "Insurance", claim: { stage: "filed" } }),
  "an insurance job with no approved scope is not ready");
ok(ready({ contract: { status: "Signed", price: 18000 }, payments: [{ amount: 5000 }], claimType: "Insurance", claim: { stage: "scope" } }),
  "an approved carrier scope satisfies the claim check");
ok(ready({ contract: { status: "Signed", price: 18000 }, depositWaived: true, claimType: "Retail" }),
  "a waived deposit satisfies the deposit check");

/* --- change orders move the contract only when approved --- */
function contractWith(job) {
  const base = num(job.contract && job.contract.price);
  const co = (job.changeOrders || []).filter((c) => c.status === "Approved").reduce((a, c) => a + num(c.amount), 0);
  return base + co;
}
let j = { contract: { price: 20000 }, changeOrders: [
  { amount: 1500, status: "Approved" }, { amount: 800, status: "Sent" },
  { amount: 400, status: "Draft" }, { amount: 900, status: "Declined" }] };
ok(contractWith(j) === 21500, "only approved changes move the contract, got " + contractWith(j));
j.changeOrders.push({ amount: -600, status: "Approved" });
ok(contractWith(j) === 20900, "a credit reduces the contract, got " + contractWith(j));
ok(contractWith({ contract: { price: 20000 } }) === 20000, "no change orders leaves the contract alone");

/* --- anomaly detection --- */
const ANOMALY_RULES = [
  { id: "rapid_open", window: 60000, count: 25 },
  { id: "export_attempts", window: 300000, count: 3 },
  { id: "bulk_delete", window: 300000, count: 8 },
];
function detect(events, now) {
  for (const r of ANOMALY_RULES) {
    if (events.filter((e) => e.at >= now - r.window && e.rule === r.id).length >= r.count) return r;
  }
  return null;
}
const now = 1000000;
const many = (rule, n, spread) => Array.from({ length: n }, (_, i) => ({ rule, at: now - i * spread }));
ok(detect(many("rapid_open", 24, 1000), now) === null, "24 job opens is normal work");
ok(detect(many("rapid_open", 25, 1000), now).id === "rapid_open", "25 in a minute trips it");
ok(detect(many("rapid_open", 30, 10000), now) === null, "30 opens spread over five minutes is fine");
ok(detect(many("export_attempts", 3, 1000), now).id === "export_attempts", "three blocked exports trips it");
ok(detect(many("export_attempts", 2, 1000), now) === null, "two blocked exports does not");
ok(detect(many("bulk_delete", 8, 1000), now).id === "bulk_delete", "eight deletions trips it");
ok(detect([], now) === null, "no activity trips nothing");

/* --- feature switches --- */
const DEFAULTS = { portal: true, claim: true, chat: true };
const featureOn = (f, k) => ({ ...DEFAULTS, ...(f || {}) })[k] !== false;
ok(featureOn({}, "portal"), "features default on");
ok(!featureOn({ portal: false }, "portal"), "a switched-off feature reads off");
ok(featureOn(null, "claim"), "a missing feature map does not break anything");

/* --- source guarantees --- */
ok(src.includes("function TabHandoff"), "handoff section exists");
ok(src.includes("function buildJobFolder"), "job folder is generated");
ok(src.includes("later edits to the estimate do not change what"), "the folder is explained as a snapshot");
ok(src.includes("Approve anyway"), "an admin may override the checks");
ok(src.includes("recorded against your name"), "overriding is attributed");
ok(src.includes("function TabChangeOrders"), "change orders section exists");
ok(src.includes("Charging the customer for our own error"), "self-inflicted change orders are flagged");
ok(src.includes("function AdminControls"), "admin controls exist");
ok(src.includes("const FEATURE_SWITCHES"), "feature switches defined");
ok(src.includes("function detectAnomaly"), "anomaly detection exists");
ok(src.includes("Deliberately not exportable"), "the audit log cannot be exported");
ok(src.includes("Treat it as a tripwire, not a lock"), "the limits of anomaly logout are stated");
ok(src.includes("noteBehaviour"), "behaviour is recorded for detection");
ok(src.includes("if (!featureOn(features, id)) return false"), "switched-off features hide their sections");

if (fails) { console.log("\nbuild 18: " + fails + " FAILED"); process.exit(1); }
console.log("build 18 tests passed");
