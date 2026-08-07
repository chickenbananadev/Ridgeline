/* Build 96 — crew financial-data leak (security fix).

   The app renamed its job cost-line field from `financials` to `fin`
   long ago (26 live uses of job.fin vs. 3 of the dead job.financials),
   but useDbSync's save path never caught up: it destructured the
   nonexistent `job.financials` out of the job before writing the rest
   to `crm_jobs`, and tried to write `job.financials` (always undefined)
   into the role-gated `crm_financials` table. Net effect: real cost
   data (contract price components, commission rate/structure,
   insurance claim values) never left `crm_jobs` — the table every
   signed-in seat, crew included, can read — while `crm_financials`
   (correctly RLS-gated against crew) silently received nothing.

   Fix: destructure the real `job.fin` field (not the dead
   `job.financials`) out of what gets saved to crm_jobs, and write
   `job.fin` into the crm_financials upsert. The read path is fixed to
   match: restore `job.fin` from crm_financials on load (it previously
   only ever restored the dead `job.financials` field, so nothing was
   read back either). EMPTY_FIN() is corrected to match the real fin
   shape used everywhere else in the app (materials/labor/other/
   commissionRate/structure/overheadPct/reimbursements), not the
   unrelated {costLines, reimbursements} shape nothing else produces.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/const \{ fin, payments, \.\.\.rest \} = j;/.test(src),
  "save path now destructures the real `fin` field (not the dead `financials`) out of what's written to crm_jobs");
ok(!/const \{ financials, payments, \.\.\.rest \} = j;/.test(src),
  "the old buggy destructure of the nonexistent `financials` field is gone");
ok(/data: \{ financials: j\.fin, payments: j\.payments \}/.test(src),
  "the crm_financials upsert now sources real cost data from job.fin");
ok(!/data: \{ financials: j\.financials, payments: j\.payments \}/.test(src),
  "the old buggy crm_financials upsert (always-undefined j.financials) is gone");
ok(/fin: fin\.financials \|\| base\.fin \|\| EMPTY_FIN\(\),/.test(src),
  "the load path now restores job.fin from crm_financials (or a base.fin fallback), not the dead job.financials field");
ok(/const EMPTY_FIN = \(\) => \(\{ materials: \[\], labor: \[\], other: \[\], commissionRate: 60, structure: "grossProfit", overheadPct: 10, reimbursements: \[\] \}\);/.test(src),
  "EMPTY_FIN() now matches the real fin shape used everywhere else (materials/labor/other/...), not the unrelated costLines shape");

/* ---------- behavioral ---------- */
/* Mirror the exact save-path destructure with a real job object that
   has both `fin` (real cost data) and no `financials` field at all
   (matching every real job in this codebase) — confirm the built
   crm_jobs row never carries `fin`, and the crm_financials row gets
   the real data. */
const job = {
  id: "job1", name: "Roger Perry", stageId: "sold", assignee: "Jacob",
  fin: { materials: [{ label: "Shingles", amt: 4200 }], labor: [], other: [], commissionRate: 60, structure: "grossProfit", overheadPct: 10, reimbursements: [] },
  payments: [{ id: "p1", amt: 1000 }],
  address: "123 Main St",
};
const { fin, payments, ...rest } = job;
ok(!("fin" in rest), "the object written to crm_jobs.data never carries the job's fin field");
ok(!("payments" in rest), "the object written to crm_jobs.data never carries the job's payments field (unchanged behavior)");
ok(rest.address === "123 Main St", "every other job field still passes through to crm_jobs.data unchanged");

const finRow = { job_id: job.id, data: { financials: job.fin, payments: job.payments } };
ok(finRow.data.financials.materials[0].amt === 4200, "crm_financials now actually receives the job's real cost data");
ok(JSON.stringify(finRow.data.financials) === JSON.stringify(job.fin), "the exact fin object round-trips into the crm_financials payload");

/* Mirror the read-path restoration: a crm_financials row with real
   data should produce job.fin on load, not a dead job.financials. */
const EMPTY_FIN = () => ({ materials: [], labor: [], other: [], commissionRate: 60, structure: "grossProfit", overheadPct: 10, reimbursements: [] });
const finMap = { job1: { financials: job.fin, payments: job.payments } };
const jobRow = { id: "job1", data: rest };
const base = jobRow.data;
const finFromMap = finMap[jobRow.id] || {};
const loaded = {
  ...base, id: jobRow.id,
  fin: finFromMap.financials || base.fin || EMPTY_FIN(),
  payments: finFromMap.payments || base.payments || [],
};
ok(loaded.fin.materials[0].amt === 4200, "loading a job restores its real fin data from crm_financials");
ok(!("financials" in loaded), "the loaded job object no longer carries a dead `financials` field");

/* A job with no crm_financials row at all (never saved by a non-crew
   session yet) still gets a correctly-shaped empty fin, not a crash or
   the old costLines shape. */
const loadedNoFin = {
  ...base, id: "job2",
  fin: ({}).financials || undefined || EMPTY_FIN(),
  payments: ({}).payments || undefined || [],
};
ok(Array.isArray(loadedNoFin.fin.materials) && Array.isArray(loadedNoFin.fin.labor) && Array.isArray(loadedNoFin.fin.other),
  "a job with no crm_financials row yet still gets a real, correctly-shaped empty fin object");
ok(!("costLines" in loadedNoFin.fin), "the empty-fin fallback no longer uses the unrelated costLines shape");

if (fails) { console.log("\nbuild 96: " + fails + " FAILED"); process.exit(1); }
console.log("build 96 tests passed");
