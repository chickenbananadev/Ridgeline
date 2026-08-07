/* Build 90 — double-booking check gap + Toast blocking Sheet save button
   (Phase 2 audit finding #5, medium).

   (a) scheduleChecks only compared appointment-vs-appointment; it never
   read jobs[].crewId/schedDate (what Dispatch uses to book a crew onto a
   production install), so a crew or rep already committed to a full
   production day could be booked into an overlapping appointment with
   zero warning. Fixed by adding productionConflicts, which treats any
   same-day production job for the same rep (job.assignee) or crew
   (assignedTo matched against the crew's name via crewId) as a hard
   conflict — a schedDate booking has no time, so it's a full-day
   commitment — feeding into the same hardConflicts array that already
   blocks Save for appointment-vs-appointment overlaps.

   (b) The global Toast component rendered above every Sheet with no
   pointer-events: none, and its screen rect happened to overlap the
   Add-appointment sheet's footer save button almost exactly — a second
   save within ~2.2s of a prior toast silently no-op'd because the tap
   landed on the toast instead of the button underneath. Fixed with
   pointer-events: none — Toast is informational, never itself tappable.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/function CalendarView\(\{[\s\S]{0,300}crews = \[\][\s\S]{0,100}embedded = false \}\)/.test(src),
  "CalendarView now accepts a crews prop");
ok(/const productionConflicts = f\.date \? jobs\.filter\(\(j\) => \{/.test(src),
  "productionConflicts is computed from jobs, not just appointments");
ok(/const hardConflicts = \[\.\.\.scheduleChecks\.filter\(\(check\) => check\.overlap\), \.\.\.productionConflicts\];/.test(src),
  "hardConflicts now includes productionConflicts, reusing the same save-blocking mechanism");
ok(/<CalendarView jobs=\{jobs\} onBack=\{\(\) => setNav\("more"\)\} onOpenJob=\{openJobScreen\}/.test(src) &&
   /apptTypes=\{apptTypes\} setApptTypes=\{setApptTypes\} toast=\{toast\} onLog=\{logAct\} users=\{users\} crews=\{crews\}/.test(src),
  "CalendarView's call site now passes the crews prop");
ok(/\{productionConflicts\.map\(\(check\) => \(/.test(src), "production conflicts render their own Callout warning");

const toastStart = src.indexOf("function Toast({ msg }) {");
const toastEnd = src.indexOf("\n}", toastStart);
const toastSrc = src.slice(toastStart, toastEnd);
ok(/pointerEvents: "none",/.test(toastSrc), "Toast now has pointer-events: none so it can never swallow a real tap");

/* ---------- behavioral ---------- */
/* productionConflicts filter logic, mirrored exactly. */
const crews = [{ id: "c1", name: "Hillwood Contractors" }, { id: "c2", name: "Northgate Exteriors" }];
const jobsData = [
  { id: "j1", assignee: "Jacob Henderson", schedDate: "2026-08-10", crewId: null },
  { id: "j2", assignee: "Drew Klass", schedDate: "2026-08-10", crewId: "c1" },
  { id: "j3", assignee: "Stephen Klein", schedDate: "2026-08-11", crewId: null },
];
const findProductionConflicts = (f, resolvedAssignedTo) => f.date ? jobsData.filter((j) => {
  if (j.id === f.jobId || !j.schedDate || j.schedDate !== f.date) return false;
  if (!resolvedAssignedTo) return false;
  const crewName = j.crewId ? (crews.find((c) => c.id === j.crewId) || {}).name : null;
  return j.assignee === resolvedAssignedTo || (crewName && crewName === resolvedAssignedTo);
}) : [];

const repConflict = findProductionConflicts({ date: "2026-08-10", jobId: "new" }, "Jacob Henderson");
ok(repConflict.length === 1 && repConflict[0].id === "j1",
  "a rep already booked on a full production day now shows as a conflict for a same-day appointment");

const crewConflict = findProductionConflicts({ date: "2026-08-10", jobId: "new" }, "Hillwood Contractors");
ok(crewConflict.length === 1 && crewConflict[0].id === "j2",
  "a crew already booked on a full production day (matched via crewId -> crew name) shows as a conflict when assignedTo names that crew");

const noConflictDifferentDay = findProductionConflicts({ date: "2026-08-11", jobId: "new" }, "Jacob Henderson");
ok(noConflictDifferentDay.length === 0, "no false positive on a different date");

const noConflictUnrelatedRep = findProductionConflicts({ date: "2026-08-10", jobId: "new" }, "Steven Tatgenhorst");
ok(noConflictUnrelatedRep.length === 0, "no false positive for a rep with nothing booked that day");

const excludesSelfWhenEditing = findProductionConflicts({ date: "2026-08-10", jobId: "j1" }, "Jacob Henderson");
ok(excludesSelfWhenEditing.length === 0, "a production job is never flagged as its own conflict when the same job is what's being scheduled");

if (fails) { console.log("\nbuild 90: " + fails + " FAILED"); process.exit(1); }
console.log("build 90 tests passed");
