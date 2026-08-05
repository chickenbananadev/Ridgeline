/* Build 59 — the punch list.

   `moveStage` has stamped `completedAt` since the certificate landed, and the
   comment explaining why it is stamped only once already said "a job bounces
   back for a punch item" — while no punch item existed anywhere in the app.
   There was no model, no screen, and no way to know a finished job still owed
   work.

   It warns and never blocks, by decision. So almost every assertion here is
   about the warning actually reaching somebody: the home screen row, the
   collapsed section badge, the stage gate, the certificate. A punch list
   nobody sees is worse than none, because it looks like the problem is
   handled.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- the three registries ----------
   Adding a section to JOB_SECTIONS alone renders nothing: the filter ends in
   allowed.has(id), and `allowed` comes from JOB_TABS. It fails silently, with
   no error — which is why handoff and changeorders carry a hardcoded escape
   hatch. All three edits, or the section does not exist. */
ok(/\["punchlist", "Punch list"\]/.test(src), "punchlist is in JOB_TABS, so it survives the section filter");
ok(/\["punchlist", "Punch list", ClipboardCheck, "Build"\]/.test(src), "and in JOB_SECTIONS, with an icon");
ok(/case "punchlist": return <TabPunchList/.test(src), "and the render switch returns the component");
/* The icon is not optional: the destructure feeds <Icon size={17}/> and a
   missing third element takes the whole job screen down. */
ok(/ClipboardCheck \} from "lucide-react"|, ClipboardCheck[ ,}]/.test(src), "the icon is imported");
ok(/\["punchlist", "Punch list", "Track what a finished roof still owes/.test(src),
  "it is switchable like every other section");

/* ---------- the home screen ----------
   The emitter has to sit OUTSIDE the `if (!done)` block. `done` covers s10,
   so an emitter inside it goes quiet at exactly the moment it matters. */
const fn = src.slice(src.indexOf("function jobExceptions("), src.indexOf("function exceptionFeed("));
/* Brace-matched, not a slice to the next known statement — the emitter sits
   immediately after the block closes, so a naive slice swallows it and the
   assertion passes while the bug is present. */
const notDoneBlock = (() => {
  const start = fn.indexOf("if (!done) {");
  let depth = 0;
  for (let i = fn.indexOf("{", start); i < fn.length; i++) {
    if (fn[i] === "{") depth++;
    else if (fn[i] === "}" && --depth === 0) return fn.slice(start, i + 1);
  }
  return fn;
})();
ok(/add\("punch"/.test(fn), "jobExceptions emits a punch row");
ok(!/add\("punch"/.test(notDoneBlock), "and does it outside the block that is skipped for completed jobs");
ok(/"punchlist"\);/.test(fn), "the row deep-links to the punch list section");

/* ---------- the collapsed header ---------- */
ok(/const sectionBadge = \(sid\) => \{/.test(src), "the accordion header can carry a count");
ok(/punchlist: "What this roof still owes"/.test(src), "and the collapsed row explains itself");

/* ---------- the stage gate ---------- */
ok(/punchclear: \{ label: "Punch list cleared"/.test(src), "a stage check exists");
ok(/checks: \["paidfull", "punchclear"\]/.test(src), "registered on Job completed");
ok(/s10: \{ sla: 0, gate: \{ mode: "warn"/.test(src), "which warns rather than blocks, as decided");

/* ---------- the certificate ----------
   Warned, not gated: openPunch must not reach certificateGaps, which is what
   disables the email button. */
const certGaps = src.slice(src.indexOf("function certificateGaps("), src.indexOf("function certificateReady("));
ok(!/punch/i.test(certGaps), "open punch items do not block the certificate");
ok(/punch \$\{openPunch\(job\)\.length === 1 \? "item is" : "items are"\} still open/.test(src),
  "but the certificate screen says so");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_punch59.jsx");
const bundle = path.join(__dirname, "_punch59.cjs");
fs.writeFileSync(scratch, src + "\nexport { openPunch, punchTone, jobExceptions, exceptionFeed, STAGE_CHECKS, " +
  "stageGate, DEFAULT_STAGE_RULES, certificateGaps, certificateDocHtml, buildPortalSnapshot, " +
  "DEFAULT_PORTAL_SETTINGS, seedJobs, todayIso };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_punch59.cjs");

const OPEN = { id: "pn1", label: "Gutter apron short at the NE corner", done: false, at: "Jul 21", by: "Stephen Klein" };
const FIXED = { id: "pn2", label: "Nail pops on the south slope", done: true, at: "Jul 21", by: "Stephen Klein", doneAt: "Jul 22" };
const base = {
  id: "jx", name: "Dale Whitfield", address: "902 Ridgepoint Dr, Maysville, KY",
  stageId: "s6", claimType: "Retail", tasks: [], checklist: {}, payments: [], estimate: { items: [] },
  contract: {}, measurements: {}, files: [], photos: [], review: {},
};
const ctx = { stages: [{ id: "s6", name: "Production" }, { id: "s10", name: "Job completed" }], stageRules: {}, appointments: [] };

/* Every read is guarded — no job created before this feature has the field. */
ok(m.openPunch({}).length === 0, "a job with no punch field reads as empty rather than throwing");
ok(m.punchTone({ stageId: "s6" }) === null, "and has no tone");
ok(() => { m.jobExceptions(base, ctx); return true; }, "jobExceptions survives a job with no punch list");
ok(m.jobExceptions(base, ctx).every((e) => !/punch/.test(e.id)), "and emits no punch row");

ok(m.openPunch({ punch: [OPEN, FIXED] }).length === 1, "only open items count");

/* ---------- tone means something ---------- */
const inFlight = { ...base, punch: [OPEN] };
ok(m.punchTone(inFlight) === "amber", "an open item on a job in flight is amber");
const completed = { ...base, stageId: "s10", punch: [OPEN] };
ok(m.punchTone(completed) === "red", "an open item on a completed job is red — it is being called finished");
const overdue = { ...base, punch: [{ ...OPEN, due: "2020-01-01" }] };
ok(m.punchTone(overdue) === "red", "and so is one past its date");
ok(m.punchTone({ ...base, punch: [FIXED] }) === null, "a fully closed list has no tone at all");
/* The Blockers card handles red and amber only. */
ok(["red", "amber"].includes(m.punchTone(inFlight)) && ["red", "amber"].includes(m.punchTone(completed)),
  "no tone outside what the card can render");

/* ---------- the row reaches the feed, including on a completed job ---------- */
const rowFor = (job) => m.jobExceptions(job, ctx).find((e) => /:punch$/.test(e.id));
const liveRow = rowFor(inFlight);
ok(!!liveRow, "an in-flight job with open items produces a row");
/* Optional-chained: when the row is missing the assertion above already
   says so, and a hard crash here would hide every check below it. */
ok(liveRow?.tab === "punchlist", "that deep-links to the punch list");
ok(liveRow?.tone === "amber", "amber");
ok(/Gutter apron/.test(liveRow?.text || ""), "and names the item so the row is self-explanatory");

const doneRow = rowFor(completed);
ok(!!doneRow, "a COMPLETED job with open items still produces a row — the whole point");
ok(doneRow?.tone === "red", "in red");
ok(/job marked job completed/i.test(doneRow?.text || ""), "saying the job has been called finished");

ok(!rowFor({ ...base, punch: [FIXED] }), "a cleared list produces no row");
ok(!rowFor({ ...base, stageId: "s10", punch: [FIXED] }), "not even on a completed job");

/* The feed sorts red first, so a completed job with open work outranks
   amber noise from jobs still running. */
const feed = m.exceptionFeed([inFlight, { ...completed, id: "jy" }], ctx);
const punchRows = feed.filter((e) => /:punch$/.test(e.id));
ok(punchRows.length === 2, "both jobs appear");
ok(punchRows[0]?.tone === "red", "with the completed one first");

/* ---------- the stage gate warns ---------- */
ok(!!m.STAGE_CHECKS.punchclear, "the check is registered");
ok(m.STAGE_CHECKS.punchclear.test({ punch: [FIXED] }), "it passes when every item is closed");
ok(!m.STAGE_CHECKS.punchclear.test({ punch: [OPEN, FIXED] }), "and fails while one is open");
ok(m.STAGE_CHECKS.punchclear.test({}), "a job with no list passes rather than throwing");
const gate = m.stageGate({ ...base, punch: [OPEN] }, "s10", m.DEFAULT_STAGE_RULES, ctx);
ok(gate.failed.some((f) => f.id === "punchclear"), "moving to Job completed reports it unmet");
ok(gate.mode === "warn", "as a warning");
ok(gate.mode !== "block", "never a block — nothing is prevented");

/* ---------- nothing leaks outward ---------- */
const brand = { company: "Supreme Building Group, Inc.", address: "a", phone: "p", email: "e", primary: "#28373E" };
const insured = {
  ...base, stageId: "s10", claimType: "Insurance", assignee: "Jacob Henderson", completedAt: "2026-08-03",
  insurance: { carrier: "Cincinnati", policy: "P1", claim: "C1", adjusterName: "Logan", deductible: "1000" },
  claim: { dateOfLoss: "2026-05-23", typeOfLoss: "Wind" }, contract: { price: 20000 },
  punch: [OPEN], portal: { ...m.DEFAULT_PORTAL_SETTINGS },
};
/* Warned, not gated — the email button stays live. */
ok(!m.certificateGaps(insured, brand).some((g) => /punch/i.test(g)),
  "an open punch item does not make the certificate unsendable");
/* And the list is internal: it must never reach a carrier or a homeowner. */
const doc = m.certificateDocHtml(insured, brand);
ok(!/Gutter apron/.test(doc), "the printed certificate carries no punch item");
ok(!/punch/i.test(doc), "and no mention of a punch list at all");
const snap = m.buildPortalSnapshot(insured, brand, "tok", []);
ok(!/Gutter apron/.test(JSON.stringify(snap)), "nor does anything the homeowner's portal receives");
ok(!/"punch"/.test(JSON.stringify(snap)), "the field is not shipped to the portal either");

/* ---------- the seed exercises the real path ---------- */
const seeded = (m.seedJobs || []).filter((j) => (j.punch || []).some((p) => !p.done));
ok(seeded.length >= 1, "a seed job carries an open punch item, so demo mode shows the row");
ok(seeded.every((j) => ["s10", "s11", "s12"].includes(j.stageId)),
  "on a completed job, so the red case is the one on screen");

fs.unlinkSync(bundle);
if (fails) { console.log("\nbuild 59: " + fails + " FAILED"); process.exit(1); }
console.log("build 59 tests passed");
