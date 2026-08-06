/* Build 81 — dateInputStyle consistency sweep from the site audit.

   dateInputStyle exists specifically to fix a documented iOS Safari bug
   where a native type=date input renders taller than a text input and
   overruns its neighbor in a two-column grid. 7 real type="date" inputs
   in the file still used the generic inputStyle instead: Calendar
   add-appointment Date, the job quick-panel's task due date and
   appointment date, Invoice due date, Tasks add-row date, document
   expiry date, and the Home quick-task deadline. (An 8th confirmed site,
   Payments' edit-sheet Date, was already fixed as part of build 80's
   functional fix, not this purely cosmetic sweep.) This is a static-only
   sweep — no stored data or behavior changes, so no behavioral tests.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- every type="date" input uses dateInputStyle ---------- */
const dateInputRe = /<input[^>]*type="date"[^>]*\/?>/g;
const dateInputs = src.match(dateInputRe) || [];
ok(dateInputs.length >= 18, `found a sane number of type="date" inputs to check (got ${dateInputs.length})`);
const usingPlainInputStyle = dateInputs.filter((tag) => /style=\{inputStyle\}/.test(tag) || /style=\{\{\s*\.\.\.inputStyle\b/.test(tag));
ok(usingPlainInputStyle.length === 0,
  `every type="date" input uses dateInputStyle, not plain inputStyle (offenders: ${JSON.stringify(usingPlainInputStyle)})`);

/* ---------- the 7 specific sites this build touched ---------- */
ok(/<Field label="Date \*"><input style=\{dateInputStyle\} type="date" value=\{f\.date\}/.test(src),
  "Calendar add-appointment Date field uses dateInputStyle");
ok(/<Field label="Due date"><input style=\{dateInputStyle\} type="date" value=\{task\.due\}/.test(src),
  "job quick-panel task due date uses dateInputStyle");
ok(/<Field label="Date"><input style=\{dateInputStyle\} type="date" value=\{appt\.date\}/.test(src),
  "job quick-panel appointment date uses dateInputStyle");
ok(/<input style=\{dateInputStyle\} type="date" value=\{job\.invoiceDue \|\| ""\}/.test(src),
  "Invoice due date uses dateInputStyle");
ok(/<input style=\{\{ \.\.\.dateInputStyle, width: 138 \}\} type="date" value=\{due\}/.test(src),
  "Tasks add-row date uses dateInputStyle");
ok(/<input style=\{dateInputStyle\} type="date" value=\{f\.expires\}/.test(src),
  "document expiry date uses dateInputStyle");
ok(/<input style=\{\{ \.\.\.dateInputStyle, flex: 1 \}\} type="date" value=\{qt\.due\}/.test(src),
  "Home quick-task deadline uses dateInputStyle");

/* ---------- sanity: sites already correct before this build stayed correct ---------- */
ok(/<Field label="Date"><input style=\{dateInputStyle\} type="date" value=\{payDateIso\(ef2\)\}/.test(src),
  "sanity check: Payments edit-sheet Date (fixed in build 80) is unaffected");
ok(/<Field label="Valid through">\s*<input style=\{dateInputStyle\} type="date" disabled=\{locked\}/.test(src),
  "sanity check: Estimate Valid through (already correct) is unaffected");

if (fails) { console.log("\nbuild 81: " + fails + " FAILED"); process.exit(1); }
console.log("build 81 tests passed");
