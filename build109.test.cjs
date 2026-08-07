/* Build 109 — Financials tab crashed to a blank screen, confirmed
   against real production data, not just static reading.

   Both of Supreme Building Group's real jobs (job_id jbtc5t3, jvq46ju)
   have a crm_financials row shaped { costLines: [], reimbursements: [] }
   — written by a version of the app before costs were split into
   materials/labor/other buckets. useDbSync's hydrate read path was
   `fin: fin.financials || base.fin || EMPTY_FIN()` — a plain ||
   chain, so any truthy loaded object won outright, missing keys and
   all. computeFin(), the first thing TabFinancials calls on render,
   immediately does fin.materials.reduce(...) — undefined.reduce()
   throws. This app has no error boundary anywhere, so that one
   uncaught render exception unmounts the entire tree: not just the
   tab, the whole screen goes blank.

   Fix: merge the loaded fin ONTO EMPTY_FIN()'s defaults instead of
   replacing them outright — { ...EMPTY_FIN(), ...(loaded) } — so a
   legacy or partial shape gets exactly the missing keys backfilled,
   while every key a real, current-shape fin actually has still wins
   (object spread overwrites left-to-right). Self-heals in the
   database too: any future save of that job writes the now-complete
   shape back to crm_financials.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/fin: \{ \.\.\.EMPTY_FIN\(\), \.\.\.\(fin\.financials \|\| base\.fin \|\| \{\}\) \},/.test(src),
  "useDbSync's hydrate merges loaded financials onto EMPTY_FIN()'s defaults instead of an outright || replace");
ok(!/fin: fin\.financials \|\| base\.fin \|\| EMPTY_FIN\(\),/.test(src),
  "the old plain-|| chain (any truthy loaded object wins wholesale, missing keys included) is gone");

/* ---------- behavioral: mirror the exact merge against real production shapes ---------- */
const EMPTY_FIN = () => ({ materials: [], labor: [], other: [], commissionRate: 60, structure: "grossProfit", overheadPct: 10, reimbursements: [] });
const mergeFin = (loaded) => ({ ...EMPTY_FIN(), ...loaded });
const computeFinLike = (fin) => {
  // Mirrors computeFin()'s exact shape of access — this is what threw.
  const sum = (a) => a.reduce((s, x) => s + x.amt, 0);
  return { materials: sum(fin.materials), labor: sum(fin.labor), other: sum(fin.other) };
};

/* The real, live legacy row found in production. */
const legacyRow = { costLines: [], reimbursements: [] };
const mergedLegacy = mergeFin(legacyRow);
ok(Array.isArray(mergedLegacy.materials) && Array.isArray(mergedLegacy.labor) && Array.isArray(mergedLegacy.other),
  "the exact legacy shape found live in production backfills materials/labor/other as real arrays");
ok(mergedLegacy.structure === "grossProfit" && mergedLegacy.commissionRate === 60 && mergedLegacy.overheadPct === 10,
  "…and backfills structure/commissionRate/overheadPct, none of which the legacy row carried");
ok(Array.isArray(mergedLegacy.reimbursements) && mergedLegacy.reimbursements.length === 0,
  "the legacy row's OWN reimbursements key (present, just empty) survives the merge rather than being overwritten by the default");
let threw = false;
try { computeFinLike(mergedLegacy); } catch (e) { threw = true; }
ok(!threw, "computeFin()'s exact access pattern no longer throws against the merged legacy shape — this is the actual crash, reproduced and fixed");

/* A fully modern, real fin object must survive completely untouched —
   real dollar amounts must never be silently zeroed by the merge. */
const modernRow = {
  materials: [{ id: "x1", label: "Shingles", amt: 4200, by: "Jacob" }],
  labor: [{ id: "x2", label: "Install crew", amt: 3100, by: "Jacob" }],
  other: [],
  commissionRate: 45, structure: "netProfit", overheadPct: 12,
  reimbursements: [{ id: "r1", amt: 80 }],
};
const mergedModern = mergeFin(modernRow);
ok(mergedModern.materials.length === 1 && mergedModern.materials[0].amt === 4200,
  "a real materials line with real dollars is untouched by the merge");
ok(mergedModern.commissionRate === 45 && mergedModern.structure === "netProfit" && mergedModern.overheadPct === 12,
  "a company's real, non-default commission settings are untouched by the merge — the defaults never win over real data");
ok(mergedModern.reimbursements.length === 1 && mergedModern.reimbursements[0].amt === 80,
  "a real reimbursement line is untouched");

/* No stored row at all (a job that's never had one) still resolves to
   a complete, usable EMPTY_FIN() — the pre-existing third fallback
   case in the || chain, unaffected by this fix. */
const mergedEmpty = mergeFin({});
ok(Array.isArray(mergedEmpty.materials) && mergedEmpty.materials.length === 0 && mergedEmpty.structure === "grossProfit",
  "a job with no stored financials at all still resolves to a complete, empty default — unaffected by this fix");

if (fails) { console.log("\nbuild 109: " + fails + " FAILED"); process.exit(1); }
console.log("build 109 tests passed");
