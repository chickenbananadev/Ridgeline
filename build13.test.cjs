/* Build 13 — multiple sales reps per job with commission splits. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- normalisation: legacy single-assignee jobs --- */
function jobReps(job) {
  const list = Array.isArray(job && job.reps) ? job.reps.filter((r) => r && r.name) : [];
  if (list.length) return list.map((r) => ({ name: r.name, split: Number(r.split) || 0 }));
  return job && job.assignee ? [{ name: job.assignee, split: 100 }] : [];
}
const splitTotal = (j) => jobReps(j).reduce((a, r) => a + (Number(r.split) || 0), 0);
const splitValid = (j) => { const r = jobReps(j); return !r.length || Math.abs(splitTotal(j) - 100) < 0.01; };

let job = { assignee: "Jacob Henderson" };
ok(jobReps(job).length === 1 && jobReps(job)[0].split === 100,
  "a legacy single-assignee job normalises to one rep at 100%");
ok(splitValid(job), "legacy job is valid without migration");

job = { assignee: "Jacob Henderson", reps: [{ name: "Jacob Henderson", split: 60 }, { name: "Ty Miller", split: 40 }] };
ok(jobReps(job).length === 2, "two reps are read back");
ok(splitTotal(job) === 100 && splitValid(job), "60/40 is valid");

job = { reps: [{ name: "A", split: 60 }, { name: "B", split: 60 }] };
ok(splitTotal(job) === 120 && !splitValid(job), "120% is caught, not silently rescaled");
job = { reps: [{ name: "A", split: 30 }, { name: "B", split: 30 }] };
ok(!splitValid(job), "60% is caught too");

/* --- pool division --- */
function shares(job, commission) {
  return jobReps(job).map((r) => ({ name: r.name, split: r.split, amount: commission * (r.split / 100) }));
}
// From the real cap-out sheet: $2,597.51 commission pool.
const pool = 2597.51;
let sh = shares({ reps: [{ name: "Jacob", split: 60 }, { name: "Ty", split: 40 }] }, pool);
ok(Math.abs(sh[0].amount - 1558.506) < 0.01, "60% share is correct, got " + sh[0].amount);
ok(Math.abs(sh[1].amount - 1039.004) < 0.01, "40% share is correct, got " + sh[1].amount);
ok(Math.abs(sh[0].amount + sh[1].amount - pool) < 0.01,
  "shares sum back to the pool — the company pays no more for a shared job");

sh = shares({ assignee: "Jacob" }, pool);
ok(Math.abs(sh[0].amount - pool) < 0.01, "a solo rep still takes the whole pool");

/* three-way */
sh = shares({ reps: [{ name: "A", split: 50 }, { name: "B", split: 30 }, { name: "C", split: 20 }] }, pool);
ok(Math.abs(sh.reduce((a, r) => a + r.amount, 0) - pool) < 0.01, "three-way split still sums to the pool");

/* --- reporting must not double-count --- */
function repCommission(jobs, name, commissionOf) {
  return jobs.filter((j) => jobReps(j).some((r) => r.name === name))
    .reduce((a, j) => {
      const c = commissionOf(j);
      const share = shares(j, c).find((r) => r.name === name);
      return a + (share ? share.amount : c);
    }, 0);
}
const shared = [{ id: "1", reps: [{ name: "A", split: 50 }, { name: "B", split: 50 }] }];
const commissionOf = () => 1000;
ok(repCommission(shared, "A", commissionOf) === 500, "rep A is credited half");
ok(repCommission(shared, "B", commissionOf) === 500, "rep B is credited half");
ok(repCommission(shared, "A", commissionOf) + repCommission(shared, "B", commissionOf) === 1000,
  "company total is not doubled by a shared job");

/* --- source guarantees --- */
ok(src.includes("function jobReps"), "rep normaliser exists");
ok(src.includes("function repSplitValid"), "split validation exists");
ok(src.includes("repShares"), "cap-out exposes per-rep amounts");
ok(src.includes("Add another rep…"), "reps can be added from the job");
ok(src.includes("Splits do not total 100%"), "invalid splits are surfaced on the cap-out");
ok(src.includes("do not pay from this sheet until corrected"), "printed sheet refuses to look settled");
ok(src.includes("assignee: next.length ? next[0].name : j.assignee"),
  "primary rep stays in sync so the board and portal keep working");
ok(src.includes("jobReps(j).some((r) => r.name === u.name)"), "shared jobs appear for every rep on them");

if (fails) { console.log("\nbuild 13: " + fails + " FAILED"); process.exit(1); }
console.log("build 13 tests passed");
