/* Build 87 — deposit-gate field mismatch + approved supplements not
   reaching contract (Phase 2 audit finding #2, high).

   Bug 1: STAGE_CHECKS.deposit summed `p.amount` across job.payments, but
   every payment object the app ever creates uses field name `amt`, never
   `amount` — the sum was always 0, so the check could only ever pass via
   the "Deposit waived" checkbox, even with a real deposit on file.

   Bug 2: computeCapOut()/paymentsSummary() built "contract price" from
   job.contract.price plus approved change orders only — approved
   insurance-claim supplements (computed independently in claimMath) were
   never added in, so approved supplements never flowed into gross
   profit, commission, balance due, or the invoice.

   Fixed by reading p.amt (matching paymentsSummary/computeCapOut's own
   payment reads elsewhere) and by adding approved/paid claim supplements
   into the same contract-price calc that already includes approved
   change orders.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/deposit: \{ label: "Deposit collected or waived",\s*\n\s*test: \(j\) => num\(\(j\.payments \|\| \[\]\)\.reduce\(\(a, p\) => a \+ num\(p\.amt\)/.test(src),
  "STAGE_CHECKS.deposit now reads p.amt, matching every payment object the app actually creates");
ok(!/reduce\(\(a, p\) => a \+ num\(p\.amount\)/.test(src), "no code still sums the nonexistent p.amount field");

const capOutStart = src.indexOf("function computeCapOut(job)");
const capOutEnd = src.indexOf("\n}", capOutStart);
const capOutSrc = src.slice(capOutStart, capOutEnd);
ok(/const supApproved = \(Array\.isArray\(\(job\.claim \|\| \{\}\)\.supplements\) \? job\.claim\.supplements : \[\]\)/.test(capOutSrc),
  "computeCapOut computes supApproved from job.claim.supplements");
ok(/\.filter\(\(s\) => s\.status === "Approved" \|\| s\.status === "Paid"\)\.reduce\(\(a2, s\) => a2 \+ num\(s\.amount\), 0\);/.test(capOutSrc),
  "computeCapOut sums Approved/Paid supplement amounts");
ok(/const contract = \(job\.contract\.price \|\| estimateTotal\(job\.estimate\) \|\| job\.value \|\| 0\) \+ coApproved \+ supApproved;/.test(capOutSrc),
  "computeCapOut's contract total now includes supApproved alongside coApproved");

const paySummaryStart = src.indexOf("function paymentsSummary(job)");
const paySummaryEnd = src.indexOf("\n}", paySummaryStart);
const paySummarySrc = src.slice(paySummaryStart, paySummaryEnd);
ok(/const supApproved = \(Array\.isArray\(\(job\.claim \|\| \{\}\)\.supplements\) \? job\.claim\.supplements : \[\]\)/.test(paySummarySrc),
  "paymentsSummary computes supApproved from job.claim.supplements");
ok(/const contract = \(job\.contract\.price \|\| estimateTotal\(job\.estimate\) \|\| job\.value \|\| 0\) \+ coApproved \+ supApproved;/.test(paySummarySrc),
  "paymentsSummary's contract total now includes supApproved alongside coApproved");

/* ---------- behavioral ---------- */
const scratch = path.join(__dirname, "_b87.jsx");
const bundle = path.join(__dirname, "_b87.cjs");
fs.writeFileSync(scratch, src + "\nexport { computeCapOut, paymentsSummary, STAGE_CHECKS, num };\n");
const { execSync } = require("child_process");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b87.cjs");

/* Deposit gate: a real $5,000 deposit on file (field name "amt", the
   only field the app ever writes) should pass the check. Before the
   fix this summed to 0 and only "Deposit waived" could pass it. */
const jobWithDeposit = { payments: [{ type: "Received", amt: 5000 }], depositWaived: false };
ok(m.STAGE_CHECKS.deposit.test(jobWithDeposit) === true,
  "a real deposit recorded under `amt` now passes the deposit-collected gate");
const jobNoDeposit = { payments: [], depositWaived: false };
ok(m.STAGE_CHECKS.deposit.test(jobNoDeposit) === false,
  "a job with no payments and no waiver still correctly fails the gate");

/* Approved supplements move the contract total, same as approved change
   orders — the actual bug this build closes. */
const baseJob = {
  contract: { price: 20000 },
  estimate: {}, value: 0,
  changeOrders: [],
  claim: {
    supplements: [
      { status: "Approved", amount: 3000 },
      { status: "Filed", amount: 1500 }, // not yet approved — must not count
      { status: "Paid", amount: 800 },
      { status: "Denied", amount: 900 }, // must not count
    ],
  },
  payments: [],
  fin: { materials: [], labor: [], other: [], reimbursements: [], structure: "grossProfit", commissionRate: 10, overheadPct: 10 },
};
const pay = m.paymentsSummary(baseJob);
ok(pay.contract === 23800, `paymentsSummary's contract includes only Approved+Paid supplements (20000+3000+800=23800), got ${pay.contract}`);

const cap = m.computeCapOut(baseJob);
ok(cap.contract === 23800, `computeCapOut's contract includes only Approved+Paid supplements (20000+3000+800=23800), got ${cap.contract}`);

/* A job with no claim at all (most jobs aren't insurance claims) must
   not throw and must behave exactly as before. */
const noClaimJob = { ...baseJob, claim: undefined };
ok(m.paymentsSummary(noClaimJob).contract === 20000, "a job with no claim object still computes a correct contract total (no crash, no phantom supplement)");
ok(m.computeCapOut(noClaimJob).contract === 20000, "computeCapOut on a job with no claim object still computes a correct contract total");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 87: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 87 tests passed");
