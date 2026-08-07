/* Build 67 — predictive stage risk, the first of the six "bigger bets"
   from the competitive gap analysis. Genuinely different from every other
   "needs attention" signal in the app: those compare a job against a rule
   someone configured (an SLA day count, a gate check); this compares a
   job against what actually happened to every other job that passed
   through the same stage. No competitor in the market research had this
   working either — not a catch-up move.

   The only historical record of stage duration is the activity feed:
   moveStage logs one "moved X to \"Stage\"" entry per move with a real
   timestamp, and nothing else persists how long a job sat in a stage
   once it moves on. stageDurationSamples() reconstructs it by pairing a
   job's own consecutive stage-move log entries and reading the gap.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

ok(/function stageDurationSamples\(activity, stages\) \{/.test(src),
  "duration samples are reconstructed by a standalone, testable function");
ok(/const STALL_MIN_SAMPLE = 3;/.test(src),
  "a minimum sample size is enforced before any stage gets a prediction");
ok(/if \(!pool \|\| pool\.length < STALL_MIN_SAMPLE\) return null;/.test(src),
  "a stage with too little history reports nothing rather than a guess with no real basis");
ok(/const median = \(arr\) => \{/.test(src),
  "the baseline is a median, not a mean, so one outlier job can't drag the whole bar");
ok(/if \(!\(days >= 0\)\) continue; \/\/ clock skew \/ bad data — skip rather than pollute the sample/.test(src),
  "a negative gap (clock skew, bad data) is skipped rather than corrupting the sample");
ok(/const stallRisk = useMemo\(\(\) => predictedStallRisk\(jobs, activity, stages\), \[jobs, activity, stages\]\);/.test(src),
  "the Dashboard computes stall risk from the scoped job list but company-wide history");
ok(/\{stallRisk\.length > 0 && \(/.test(src),
  "the card doesn't render at all when nothing is flagged — no empty-state noise");
ok(/const \[activity, setActivity\] = useState\(\(\) => \(liveDb\(\) \? \[\] : buildSeedActivity\(\)\)\);/.test(src),
  "demo mode (no backend) seeds a plausible activity history instead of starting empty — " +
  "otherwise stall risk (and everything else reading the activity feed) has no history to work from " +
  "and never shows anything on a fresh demo, real or not");
ok(/function buildSeedActivity\(\) \{/.test(src),
  "the seed history is built by a standalone function, not inlined into the useState call");
/* Build 123 removed the dead chatMsgs/onSendChat props (never read by
   Dashboard's body; the handler built conversationless messages) —
   assert the parts that carry this test's actual concern: the
   signature still ends with the activity feed. */
ok(/function Dashboard\(\{ jobs: allJobs, stages, onOpenJob, userName, go, onNewLead, onQuickTask, onOpenStage, brand = DEFAULT_BRAND,/.test(src) &&
   /stageRules = \{\}, currentUser = null, showMoney = true, isAdmin = true, activity = \[\] \}\) \{/.test(src),
  "Dashboard actually accepts the activity feed rather than silently having nothing to compute from");
ok(/<Dashboard jobs=\{jobs\} stages=\{stages\} onOpenJob=\{openJobScreen\} userName=\{userName\} go=\{setNav\}/.test(src) &&
   /stageRules=\{stageRules\} currentUser=\{liveUser\} showMoney=\{showMoney\} isAdmin=\{isAdmin\} activity=\{activity\}/.test(src),
  "activity is actually threaded through at the call site, not just accepted and unused");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_b67.jsx");
const bundle = path.join(__dirname, "_b67.cjs");
fs.writeFileSync(scratch, src + "\nexport { stageDurationSamples, predictedStallRisk, buildSeedActivity, DEFAULT_STAGES };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b67.cjs");

const stages = [{ id: "s3", name: "Estimate sent / Follow up" }, { id: "s7", name: "Production" }];

/* Build a synthetic activity log: 4 jobs each moved through s3 -> s7 at
   known intervals, so the true median time-in-s3 is exactly known
   (5 days), then check the reconstruction gets it right. */
const mkMove = (jobId, at, stageName) => ({ kind: "stage", jobId, at, text: `moved Job to "${stageName}"` });
const activity = [
  mkMove("j1", "2026-01-01 09:00", "Estimate sent / Follow up"), mkMove("j1", "2026-01-04 09:00", "Production"), // 3d
  mkMove("j2", "2026-01-01 09:00", "Estimate sent / Follow up"), mkMove("j2", "2026-01-06 09:00", "Production"), // 5d
  mkMove("j3", "2026-01-01 09:00", "Estimate sent / Follow up"), mkMove("j3", "2026-01-06 09:00", "Production"), // 5d
  mkMove("j4", "2026-01-01 09:00", "Estimate sent / Follow up"), mkMove("j4", "2026-01-11 09:00", "Production"), // 10d
];
const samples = m.stageDurationSamples(activity, stages);
ok(Array.isArray(samples.s3) && samples.s3.length === 4, "all four historical moves through s3 are captured");
const sorted = [...samples.s3].sort((a, b) => a - b);
ok(JSON.stringify(sorted) === JSON.stringify([3, 5, 5, 10]), "the exact durations reconstructed from timestamps match what was actually logged (3, 5, 5, 10 days)");

/* A live job sitting in s3 for 6 days — past the median (5) — must be
   flagged; one sitting for 4 days must not be, and a stage with fewer
   than STALL_MIN_SAMPLE historical points must never produce a guess. */
const today = new Date().toISOString().slice(0, 10);
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const stalledJob = { id: "live1", name: "Stalled Job", stageId: "s3", stageAt: daysAgo(6) };
const freshJob = { id: "live2", name: "Fresh Job", stageId: "s3", stageAt: daysAgo(4) };
const sparseJob = { id: "live3", name: "Sparse History Job", stageId: "s7", stageAt: daysAgo(30) }; // s7 has 0 samples

const risk = m.predictedStallRisk([stalledJob, freshJob, sparseJob], activity, stages);
ok(risk.some((r) => r.job.id === "live1"), "a job past the historical median for its stage is flagged");
ok(!risk.some((r) => r.job.id === "live2"), "a job still under the historical median is not flagged");
ok(!risk.some((r) => r.job.id === "live3"), "a stage with zero historical samples never produces a prediction, no matter how long the job has sat");

const flagged = risk.find((r) => r.job.id === "live1");
ok(flagged && flagged.typicalDays === 5, "the reported baseline is the real median (5), not a mean or some other statistic");
ok(flagged && flagged.sampleSize === 4, "the reported sample size is honest about how much history backs the prediction");

/* Completed/lost/unqualified jobs are never candidates for stalling —
   they're done, not stuck. */
const doneJob = { id: "live4", name: "Done", stageId: "s10", stageAt: daysAgo(200) };
ok(!m.predictedStallRisk([doneJob], activity, stages).length, "a completed job is never flagged as likely to stall");

/* The demo build has no database to load real history from — without
   buildSeedActivity() the activity feed starts truly empty and this whole
   feature is invisible on a fresh demo, which is exactly the live-rendering
   bug this build fixed. Rob Kennard (seeded 12 days into "Appointment
   scheduled") and Omkar Hirekhan (26 days into "Estimate sent / Follow up")
   are both stale enough, against the rest of the seed jobs' reconstructed
   history, that the demo shows the card working out of the box instead of
   silently doing nothing until real usage accumulates. */
const seedActivity = m.buildSeedActivity();
ok(seedActivity.length > 0, "the demo seeds a real activity history instead of starting from nothing");
const seedSamples = m.stageDurationSamples(seedActivity, m.DEFAULT_STAGES);
ok(Object.keys(seedSamples).some((k) => seedSamples[k].length >= 3),
  "the seeded history alone produces at least one stage with enough samples to predict from");
const seedRisk = m.predictedStallRisk(
  [
    { id: "j1", name: "Rob Kennard", stageId: "s2", daysInStage: 12 },
    { id: "j2", name: "Omkar Hirekhan", stageId: "s3", daysInStage: 26 },
    { id: "j5", name: "Marcy Templeton", stageId: "s1", daysInStage: 1 },
  ],
  seedActivity, m.DEFAULT_STAGES
);
ok(seedRisk.some((r) => r.job.id === "j1"), "Rob Kennard's real seeded state is actually flagged as likely to stall");
ok(seedRisk.some((r) => r.job.id === "j2"), "Omkar Hirekhan's real seeded state is actually flagged as likely to stall");
ok(!seedRisk.some((r) => r.job.id === "j5"), "a lead that's only been in its first stage a day is not falsely flagged");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 67: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 67 tests passed");
