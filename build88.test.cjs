/* Build 88 — JobBoard sort/assign bugs (Phase 2 audit finding #3, medium).

   (a) The sort switch had no branch for "updated" — both the default
   filters.sort value and a selectable "Last updated (newest)" option —
   so the default board view was effectively unsorted. touchedAt is
   already stamped on every job mutation but was never read anywhere.
   Fixed by sorting on touchedAt descending for that branch.

   (b) NewLeadSheet had two competing useEffects on `open`: one defaulted
   assignee to roster[0], a second unconditionally reset the whole form
   to blank (assignee: "") in the same render flush and always won
   because it replaces the whole object rather than using a functional
   update — new leads silently landed with assignee: "" while the <select>
   visually showed the first roster name (browser fallback-to-first-option
   on an unmatched value). Fixed by defaulting assignee inside the reset
   effect itself, so it no longer depends on effect ordering.

   (c) The bulk "Assign..." menu's assigneeOptions was built only from
   existing job assignees, not the live active-user roster — a newly
   onboarded rep with zero jobs was invisible as a bulk-assign target.
   Fixed by unioning active users with job assignees, matching
   FiltersSheet's existing pattern, and threading a `users` prop into
   JobBoard (its call site never passed one).
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/if \(s === "updated"\) out = \[\.\.\.out\]\.sort\(\(a, b\) => \(b\.touchedAt \|\| 0\) - \(a\.touchedAt \|\| 0\)\);/.test(src),
  "the sort switch now has an 'updated' branch reading touchedAt descending");

const newLeadStart = src.indexOf("function NewLeadSheet(");
const newLeadEnd = src.indexOf("\nfunction ", newLeadStart + 10);
const newLeadSrc = src.slice(newLeadStart, newLeadEnd > 0 ? newLeadEnd : newLeadStart + 6000);
ok(/assignee: roster\.length \? roster\[0\] : "",\s*\n\s*contactMode: selected \? "existing" : "new",/.test(newLeadSrc),
  "the form-reset effect now defaults assignee to roster[0] directly, instead of relying on effect ordering");
ok(/\}, \[open, seed, roster\]\); \/\/ eslint-disable-line/.test(newLeadSrc),
  "the form-reset effect's dependency array now includes roster");

ok(/^function JobBoard\(\{.*appointments = \[\], users = \[\] \}\) \{$/m.test(src), "JobBoard now accepts a users prop");
ok(/const assigneeOptions = useMemo\(\(\) => \[\.\.\.new Set\(\[\.\.\.users\.filter\(\(u\) => u\.active !== false\)\.map\(\(u\) => u\.name\),\s*\n\s*\.\.\.jobs\.map\(\(j\) => j\.assignee\)\]\.filter\(Boolean\)\)\]\.sort\(\), \[jobs, users\]\);/.test(src),
  "JobBoard's assigneeOptions now unions active users with job assignees, matching FiltersSheet");
ok(/<JobBoard jobs=\{jobs\} stages=\{stages\} filters=\{filters\}/.test(src) &&
   /stageRules=\{stageRules\} onBulkMoveStage=\{bulkMoveStage\} appointments=\{appointments\} users=\{users\}/.test(src),
  "JobBoard's call site now passes the users prop");

/* ---------- behavioral ---------- */
/* (a) Sort by touchedAt descending — the exact comparator now in the file. */
const sortByUpdated = (jobs) => [...jobs].sort((a, b) => (b.touchedAt || 0) - (a.touchedAt || 0));
const jobsForSort = [
  { id: "j1", touchedAt: 1000 },
  { id: "j2", touchedAt: 3000 },
  { id: "j3" }, // never touched — falls to the back, not to the front via NaN
  { id: "j4", touchedAt: 2000 },
];
const sorted = sortByUpdated(jobsForSort);
ok(sorted.map((j) => j.id).join(",") === "j2,j4,j1,j3",
  `most-recently-touched job sorts first, untouched jobs sort last (got: ${sorted.map((j) => j.id).join(",")})`);

/* (b) The reset effect's assignee default, mirrored exactly. */
const roster = ["Drew Klass", "Stephen Klein"];
const blank = { assignee: "" };
const resetForm = { ...blank, assignee: roster.length ? roster[0] : "" };
ok(resetForm.assignee === "Drew Klass", "a new lead now defaults to the first roster name, not an empty assignee");
const emptyRoster = [];
const resetFormNoRoster = { ...blank, assignee: emptyRoster.length ? emptyRoster[0] : "" };
ok(resetFormNoRoster.assignee === "", "with no active seats at all, assignee correctly stays empty rather than throwing");

/* (c) assigneeOptions union, mirrored exactly. */
const assigneeOptionsFor = (jobs, users) => [...new Set([...users.filter((u) => u.active !== false).map((u) => u.name),
  ...jobs.map((j) => j.assignee)].filter(Boolean))].sort();
const jobsNoNewRep = [{ assignee: "Jacob Henderson" }, { assignee: "Drew Klass" }];
const usersWithNewRep = [
  { name: "Jacob Henderson", active: true },
  { name: "Drew Klass", active: true },
  { name: "Brand New Rep", active: true }, // zero jobs yet
  { name: "Departed Rep", active: false },
];
const options = assigneeOptionsFor(jobsNoNewRep, usersWithNewRep);
ok(options.includes("Brand New Rep"), "a newly onboarded rep with zero jobs is now a valid bulk-assign target");
ok(!options.includes("Departed Rep"), "a deactivated seat with no jobs is correctly excluded");
ok(options.length === 3, `union has no duplicates for reps who are both active users and existing assignees (got: ${JSON.stringify(options)})`);

if (fails) { console.log("\nbuild 88: " + fails + " FAILED"); process.exit(1); }
console.log("build 88 tests passed");
