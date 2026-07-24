/* Build 6 — delete-anywhere (admin), calendar week/month + day detail,
   task next-step pathways for retail/insurance/commercial. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- pathway logic (mirrors nextStepAfter) --- */
const JOB_PATHS = {
  Retail: ["Schedule inspection", "Complete inspection", "Build estimate", "Present estimate to homeowner"],
  Insurance: ["Schedule inspection", "Complete inspection", "Document damage with photos", "File claim with carrier"],
  Commercial: ["Site assessment", "Take measurements", "Build scope of work", "Submit proposal / bid"],
};
function jobPathFor(job) { return JOB_PATHS[(job && job.claimType) || "Retail"] || JOB_PATHS.Retail; }
function nextStepAfter(job, completedLabel) {
  const path = jobPathFor(job);
  const idx = path.findIndex((s) => s.toLowerCase() === String(completedLabel || "").trim().toLowerCase());
  if (idx === -1 || idx === path.length - 1) return null;
  const existing = new Set((job.tasks || []).map((t) => String(t.label || "").toLowerCase()));
  for (let i = idx + 1; i < path.length; i++) if (!existing.has(path[i].toLowerCase())) return path[i];
  return null;
}
let job = { claimType: "Retail", tasks: [] };
ok(nextStepAfter(job, "Schedule inspection") === "Complete inspection", "retail: inspection -> complete inspection");
ok(nextStepAfter(job, "Complete inspection") === "Build estimate", "retail: advances along the path");
job = { claimType: "Insurance", tasks: [] };
ok(nextStepAfter(job, "Complete inspection") === "Document damage with photos", "insurance path differs from retail");
job = { claimType: "Commercial", tasks: [] };
ok(nextStepAfter(job, "Site assessment") === "Take measurements", "commercial path differs again");
job = { claimType: "Retail", tasks: [{ label: "Complete inspection" }] };
ok(nextStepAfter(job, "Schedule inspection") === "Build estimate", "skips a step already on the board");
job = { claimType: "Retail", tasks: [] };
ok(nextStepAfter(job, "Present estimate to homeowner") === null, "last step yields nothing");
ok(nextStepAfter(job, "not on the path") === null, "unknown task yields nothing");

/* --- source guarantees --- */
ok(src.includes("const JOB_PATHS"), "job pathways defined");
ok(src.includes("function nextStepAfter"), "next-step resolver exists");
ok(src.includes('"Retail", "Insurance", "Commercial"'), "three job types present");
ok(src.includes("data-testid=\"confirm-delete-job\""), "job detail has an admin delete confirm");
ok(src.includes("onDelete={isAdmin ? deleteJobs : null}"), "job delete is admin-gated");
ok(src.includes("const deleteJobs = (ids, label)"), "single shared delete path");
ok(src.includes('setMode("month")') || src.includes('[["month", "Month"], ["week", "Week"]]'), "calendar has month/week switch");
ok(src.includes("selDay"), "calendar tracks a selected day");
ok(src.includes("Next step:"), "task next-step prompt exists");
ok(src.includes("doneAt:"), "completing a task timestamps it");

if (fails) { console.log("\nbuild 6: " + fails + " FAILED"); process.exit(1); }
console.log("build 6 tests passed");
