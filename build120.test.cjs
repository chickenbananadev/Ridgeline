/* Build 120 — two real bugs the owner reported directly from the
   "Subs to pay" flow.

   1. CrewPayouts' "Subs to pay" queue rows opened the job at Overview,
      forcing the admin to hunt for the sub invoice card themselves —
      the row's own caption ("Mark paid on the job's work order") says
      exactly where it should land but the click handler never told
      onOpenJob which tab to open.

   2. CrewManager's crew card always showed "$0.00 paid" regardless of
      real payment history. Root cause: paidFor() read
      j.financials.costLines — but this codebase renamed that field to
      job.fin long ago (26+ live uses of job.fin vs. a handful of dead
      job.financials references elsewhere in the file, per build 96's
      earlier finding of the exact same rename gap). j.financials is
      always undefined, so paidFor summed an empty array every time,
      no matter how many sub invoices had actually been marked paid.
      It also never would have matched markPaid()'s real output, which
      appends a { type: "Paid", to: crew.name, amt } row to
      job.payments, not a cost line. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: Subs-to-pay row deep-links to the work order tab ---------- */
ok(/onClick=\{\(\) => onOpenJob && onOpenJob\(r\.job\.id, "workorder"\)\}/.test(src),
  "clicking a Subs-to-pay row opens the job directly on its Work order tab, matching the row's own 'Mark paid on the job's work order' caption");
ok(!/onClick=\{\(\) => onOpenJob && onOpenJob\(r\.job\.id\)\}/.test(src),
  "the old tab-less onOpenJob call (which landed on Overview) is gone");

/* ---------- static: paidFor reads real payments, not the dead financials field ---------- */
const pfStart = src.indexOf("const paidFor = (crewId) => {");
ok(pfStart !== -1, "paidFor exists");
const pfSrc = src.slice(pfStart, pfStart + 500);
ok(!/j\.financials/.test(pfSrc), "paidFor no longer reads the dead job.financials field (renamed to job.fin long ago, always undefined)");
ok(!/costLines/.test(pfSrc), "paidFor no longer looks for a costLines array that markPaid() never writes to");
ok(/j\.payments \|\| \[\]/.test(pfSrc) && /p\.type !== "Received"/.test(pfSrc),
  "paidFor now sums real job.payments rows, the same source markPaid() actually writes to");
ok(/String\(p\.to \|\| ""\)\.toLowerCase\(\)\.includes\(crewName\.toLowerCase\(\)\)/.test(pfSrc),
  "paidFor matches payments by crew name the same way CrewPayouts' own (already-correct) paid calculation does");

/* ---------- static: stale hint copy describing the old (wrong) source is gone ---------- */
ok(!/Totals come from labor and subcontractor lines on each crew's jobs in the Financials tab\./.test(src),
  "the old hint claiming totals come from Financials cost lines is gone — that was never true of what paidFor actually read once the rename happened");
ok(/Totals come from payments logged against each crew's jobs/.test(src),
  "the hint now accurately describes the real source: payments logged against the crew's jobs");

/* ---------- behavioral: mirror paidFor's new logic against synthetic data ---------- */
function paidFor(jobs, crews, crewId, range) {
  const cutoff = range === "all" ? 0 : Date.now() - (range === "30" ? 30 : range === "90" ? 90 : 365) * 86400000;
  const crewName = (crews.find((c) => c.id === crewId) || {}).name || "";
  return jobs.filter((j) => j.crewId === crewId).reduce((sum, j) => {
    const payouts = (j.payments || [])
      .filter((p) => p.type !== "Received" && String(p.to || "").toLowerCase().includes(crewName.toLowerCase()));
    return sum + payouts.filter((p) => !p.at || new Date(p.at).getTime() >= cutoff).reduce((t, p) => t + (Number(p.amt) || 0), 0);
  }, 0);
}
const CREWS = [{ id: "c1", name: "Hillwood Contractors" }];
const JOBS_AFTER_MARK_PAID = [
  { id: "j1", crewId: "c1", subInvoice: { status: "paid", paidAt: "2026-08-07" },
    payments: [{ id: "p1", type: "Paid", to: "Hillwood Contractors", amt: 5025, at: "2026-08-07" }] },
];
ok(paidFor(JOBS_AFTER_MARK_PAID, CREWS, "c1", "all") === 5025,
  "after a sub invoice is marked paid, paidFor reflects the real amount instead of $0");
ok(paidFor([{ id: "j2", crewId: "c1", financials: { costLines: [{ label: "Labor — install", amt: 9999 }] }, payments: [] }], CREWS, "c1", "all") === 0,
  "a job with only the old dead financials.costLines field (no real payments) correctly contributes $0, proving the fix reads payments, not the dead field");
ok(paidFor(JOBS_AFTER_MARK_PAID, CREWS, "c2", "all") === 0,
  "a different crew's jobs never contribute to this crew's paid total");
const JOBS_MULTI = [
  ...JOBS_AFTER_MARK_PAID,
  { id: "j3", crewId: "c1", payments: [{ id: "p2", type: "Received", to: "Hillwood Contractors", amt: 1000, at: "2026-08-01" }] },
];
ok(paidFor(JOBS_MULTI, CREWS, "c1", "all") === 5025,
  "a 'Received' payment row (money coming in, not going out to the crew) is excluded from the paid total, matching CrewPayouts' own definition of a payout");

if (fails) { console.log("\nbuild 120: " + fails + " FAILED"); process.exit(1); }
console.log("build 120 tests passed");
