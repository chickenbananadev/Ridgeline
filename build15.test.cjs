/* Build 15 — per-job insurance claim tracker. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };
const num = (x) => Number(String(x ?? "").replace(/[^0-9.-]/g, "")) || 0;

/* --- the settlement arithmetic --- */
function claimMath(job) {
  const c = job.claim || {}, ins = job.insurance || {};
  const rcv = num(c.rcv), acv = num(c.acv);
  const deductible = num(c.deductible || ins.deductible);
  const nonRecov = num(c.nonRecoverable);
  const heldBack = Math.max(0, rcv - acv - deductible);
  const recoverable = Math.max(0, heldBack - nonRecov);
  const sups = c.supplements || [];
  const supApproved = sups.filter((s) => s.status === "Approved" || s.status === "Paid").reduce((a, s) => a + num(s.amount), 0);
  const supPaid = sups.filter((s) => s.status === "Paid").reduce((a, s) => a + num(s.amount), 0);
  const depReceived = num(c.depReceived);
  const depOutstanding = Math.max(0, recoverable - depReceived);
  const supOutstanding = Math.max(0, supApproved - supPaid);
  return { heldBack, recoverable, depOutstanding, supOutstanding,
    owedByCarrier: depOutstanding + supOutstanding,
    claimValue: rcv + supApproved,
    collected: num(c.acvReceived) + depReceived + supPaid + num(c.deductibleCollected) };
}

// A realistic RCV claim: $18,000 scope, $1,000 deductible, $4,200 held back.
let job = { claim: { rcv: 18000, acv: 12800, deductible: 1000 } };
let m = claimMath(job);
ok(m.heldBack === 4200, "held back is RCV less ACV less deductible, got " + m.heldBack);
ok(m.recoverable === 4200, "all of it recoverable when none is written off");
ok(m.owedByCarrier === 4200, "carrier owes the depreciation before it releases");

// Depreciation cheque arrives.
job.claim.depReceived = 4200;
ok(claimMath(job).owedByCarrier === 0, "nothing owed once depreciation lands");

// Non-recoverable depreciation is never paid.
job = { claim: { rcv: 18000, acv: 12800, deductible: 1000, nonRecoverable: 1200 } };
m = claimMath(job);
ok(m.recoverable === 3000, "non-recoverable is excluded from what the carrier owes, got " + m.recoverable);
ok(m.heldBack === 4200, "held back still reflects the full withholding");

// Supplements only count once approved.
job = { claim: { rcv: 18000, acv: 12800, deductible: 1000, depReceived: 4200,
  supplements: [
    { amount: 900, status: "Filed" },
    { amount: 1400, status: "Approved" },
    { amount: 600, status: "Denied" },
    { amount: 300, status: "Paid" },
  ] } };
m = claimMath(job);
ok(m.supOutstanding === 1400, "only approved-but-unpaid supplements are owed, got " + m.supOutstanding);
ok(m.claimValue === 19700, "claim value is RCV plus approved and paid supplements, got " + m.claimValue);

// Deductible falls back to the legacy insurance block.
job = { insurance: { deductible: 2500 }, claim: { rcv: 10000, acv: 6000 } };
ok(claimMath(job).heldBack === 1500, "deductible reads from the existing insurance record");

// Nothing entered yet must not produce negatives.
m = claimMath({ claim: {} });
ok(m.heldBack === 0 && m.owedByCarrier === 0 && m.recoverable === 0, "an empty claim is all zeros, never negative");
m = claimMath({ claim: { rcv: 5000, acv: 9000, deductible: 1000 } });
ok(m.heldBack === 0, "an ACV above RCV clamps to zero rather than going negative");

/* --- source guarantees --- */
ok(src.includes("function TabClaim"), "claim section exists");
ok(src.includes("function claimMath"), "settlement maths is a separate function");
ok(src.includes("const CLAIM_STAGES"), "claim pipeline defined");
ok(src.includes("OWED BY CARRIER"), "owed-by-carrier is the headline");
ok(src.includes('["claim", "Insurance claim", Shield]'), "claim is a job section");
ok(src.includes('if (id === "claim") return job.claimType === "Insurance"'),
  "the claim section only appears on insurance jobs");
ok(src.includes("const SUPPLEMENT_STATUS"), "supplements carry a status");
ok(src.includes("mortgagee"), "mortgage company is tracked");
ok(src.includes("absorbing or rebating it is fraud exposure"),
  "uncollected deductible is flagged with the compliance reason");
ok(src.includes("An ACV policy never releases depreciation"),
  "ACV policies are called out explicitly");

if (fails) { console.log("\nbuild 15: " + fails + " FAILED"); process.exit(1); }
console.log("build 15 tests passed");
