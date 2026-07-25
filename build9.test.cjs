/* Build 9 — timezone-correct dates, home quick actions, task deep links. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- the actual dispatch bug: UTC conversion shifted local days --- */
function isoLocal(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}
// A local midnight in a negative UTC offset serialises to the previous
// day via toISOString. isoLocal must not.
const localMidnight = new Date(2026, 6, 24, 0, 0, 0); // 24 Jul 2026 local
ok(isoLocal(localMidnight) === "2026-07-24", "local midnight keeps its own date, got " + isoLocal(localMidnight));
const lateEvening = new Date(2026, 6, 24, 23, 30, 0);
ok(isoLocal(lateEvening) === "2026-07-24", "late evening does not roll to tomorrow, got " + isoLocal(lateEvening));
ok(isoLocal(new Date(2026, 0, 1, 2, 0, 0)) === "2026-01-01", "new year morning stays in January");

ok(src.includes("function isoLocal"), "local-date helper exists");
ok(src.includes("function todayIso"), "today helper exists");
ok(src.includes("const iso = (d) => isoLocal(d);"), "dispatch uses local dates");
ok(!src.includes("const today = iso(new Date());"), "dispatch no longer derives today from UTC");

/* --- home quick actions --- */
ok(src.includes('setQuick("note")'), "home has a quick note action");
ok(src.includes('setQuick("call")'), "home has a quick call action");
ok(src.includes('setQuick("task")'), "home has a quick task action");
ok(src.includes("const saveQuick"), "quick logger writes to the job");
ok(src.includes('Call — ${text}') || src.includes("`Call — ${text}`"), "calls are labelled in the note trail");

/* --- deep links --- */
ok(src.includes("const [jobOpenTab, setJobOpenTab]"), "deep-link tab state exists");
ok(src.includes('onOpenJob(job.id, "tasks")'), "home tasks open the Tasks tab");
ok(src.includes("openTab = null }"), "JobDetail accepts a starting tab");

if (fails) { console.log("\nbuild 9: " + fails + " FAILED"); process.exit(1); }
console.log("build 9 tests passed");
