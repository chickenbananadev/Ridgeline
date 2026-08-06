/* Build 62 — JobBoard column-level risk rollup.

   A stage column used to show a count and a dollar total and nothing
   about whether anything in it needed a rep's attention — you had to
   open every card to find out. This aggregates the same jobExceptions()
   the Dashboard's exception feed already runs per job, rolled up to the
   stage a rep is actually scanning.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

ok(/function JobBoard\(\{[\s\S]{0,400}appointments = \[\]/.test(src),
  "JobBoard accepts an appointments prop so its checks can see the calendar, same as the Dashboard's feed");
ok(/const exceptionsByJob = useMemo\(\(\) => \{/.test(src),
  "column risk is computed once per render, not per column");
ok(/filtered\.forEach\(\(j\) => map\.set\(j\.id, jobExceptions\(j, ctx\)\)\);/.test(src),
  "reuses jobExceptions — the same source of truth the Dashboard's exception feed reads");
ok(/const stageExc = inStage\.flatMap\(\(j\) => exceptionsByJob\.get\(j\.id\) \|\| \[\]\);/.test(src),
  "each column rolls up only the jobs actually sitting in it");
ok(/const redCount = stageExc\.filter\(\(e\) => e\.tone === "red"\)\.length;/.test(src) &&
   /const amberCount = stageExc\.filter\(\(e\) => e\.tone === "amber"\)\.length;/.test(src),
  "red and amber are counted separately so a column reads at a glance, not just a raw total");
ok(/\{redCount > 0 && <Chip tone="red">\{redCount\} at risk<\/Chip>\}/.test(src) &&
   /\{amberCount > 0 && <Chip tone="amber">\{amberCount\} to watch<\/Chip>\}/.test(src),
  "the badge only renders when there's something to say — a clean column stays clean");
ok(/<JobBoard jobs=\{jobs\} stages=\{stages\} filters=\{filters\}/.test(src) &&
   /stageRules=\{stageRules\} onBulkMoveStage=\{bulkMoveStage\} appointments=\{appointments\}/.test(src),
  "the live appointments collection is actually threaded through at the call site, not just accepted and ignored");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_b62.jsx");
const bundle = path.join(__dirname, "_b62.cjs");
fs.writeFileSync(scratch, src + "\nexport { jobExceptions, stageRuleFor, DEFAULT_STAGE_RULES };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b62.cjs");

const stages = [{ id: "s8", name: "Production" }];
const stageRules = { s8: { sla: 3, gate: { mode: "off", checks: [] }, tasks: [], notify: false } };

/* A job three days late against its stage SLA — jobExceptions must flag
   it red, which is what the column badge counts. */
const lateJob = {
  id: "j1", stageId: "s8", stageAt: "2020-01-01 00:00", schedDate: null,
  tasks: [], punch: [], claimType: "Retail",
};
const lateExc = m.jobExceptions(lateJob, { stages, stageRules, appointments: [] });
ok(lateExc.some((e) => e.tone === "red"), "a stage-overdue job surfaces a red exception the column can count");

/* A job with nothing wrong — no exceptions, so the column shows no badge
   for it, which is the whole point: a clean column stays visually clean. */
const cleanJob = {
  id: "j2", stageId: "s8", stageAt: new Date().toISOString().slice(0, 16).replace("T", " "),
  schedDate: null, tasks: [], punch: [], claimType: "Retail",
};
const cleanExc = m.jobExceptions(cleanJob, { stages, stageRules, appointments: [] });
ok(cleanExc.length === 0, "a healthy job contributes nothing to its column's risk count");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 62: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 62 tests passed");
