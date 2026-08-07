/* Build 91 — Close rate 100x display bug + dashboard layout not
   persisting (Phase 2 audit finding #6, medium).

   (a) Home dashboard computed closeRate as a raw 0-1 fraction
   (wonCount / jobs.length) and passed it straight to pct1(), which
   expects an already-0-100-scaled value — every other pct1 caller in
   the file pre-multiplies by 100 first. 3/6 won jobs displayed as
   "0.50%" instead of "50.00%" on the primary landing screen. Fixed by
   multiplying by 100 before passing to pct1(), matching every sibling
   caller (Reports screen, Performance's own closeRate stat).

   (b) "My dashboard" widget layout lived in local component state
   inside Performance, which resets on unmount; the screen's own
   caption claims the layout is "saved to your own account," but in
   demo mode (dashLoadLayout/dashSaveLayout are real-backend-only, per
   their own DB() guard) any add/remove/reorder was silently discarded
   on navigation — unlike users/integrations/features, which are
   correctly lifted to top-level App state. Fixed by lifting layout to
   the App component the same way.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/const closeRate = jobs\.length \? \(wonCount \/ jobs\.length\) \* 100 : 0;/.test(src),
  "Home dashboard's closeRate now pre-multiplies by 100 before pct1(), matching every other pct1 caller");
ok(!/const closeRate = jobs\.length \? wonCount \/ jobs\.length : 0;/.test(src),
  "the old un-scaled closeRate computation is gone");

ok(/const \[dashLayout, setDashLayout\] = useState\(DEFAULT_DASHBOARD_LAYOUT\);/.test(src),
  "dashLayout is now a top-level App state variable, alongside users/integrations/features");
ok(/function Performance\(\{ jobs, stages, users, onBack, isAdmin, currentUser, toast, crews = \[\], setUsers, dashLayout, setDashLayout \}\)/.test(src),
  "Performance now accepts dashLayout/setDashLayout as props");
ok(/const layout = dashLayout;\s*\n\s*const setLayout = setDashLayout;/.test(src),
  "Performance's layout/setLayout now alias the lifted props instead of local useState");
ok(!/const \[layout, setLayout\] = useState\(DEFAULT_DASHBOARD_LAYOUT\);/.test(src),
  "the old component-local layout useState is gone");
ok(/<Performance jobs=\{jobs\} stages=\{stages\} users=\{users\} onBack=\{\(\) => setNav\("more"\)\}/.test(src) &&
   /dashLayout=\{dashLayout\} setDashLayout=\{setDashLayout\} \/>/.test(src),
  "Performance's call site now passes dashLayout/setDashLayout down");

/* ---------- behavioral ---------- */
const pct1 = (n) => `${n.toFixed(2)}%`;
const closeRateFor = (wonCount, totalJobs) => totalJobs ? (wonCount / totalJobs) * 100 : 0;
ok(pct1(closeRateFor(3, 6)) === "50.00%", `3/6 won jobs now displays as 50.00%, not 0.50% (got: ${pct1(closeRateFor(3, 6))})`);
ok(pct1(closeRateFor(0, 6)) === "0.00%", "zero won jobs still correctly shows 0.00%");
ok(pct1(closeRateFor(0, 0)) === "0.00%", "an empty job list doesn't divide by zero (NaN%)");
ok(pct1(closeRateFor(6, 6)) === "100.00%", "a perfect close rate shows 100.00%, not 1.00%");

if (fails) { console.log("\nbuild 91: " + fails + " FAILED"); process.exit(1); }
console.log("build 91 tests passed");
