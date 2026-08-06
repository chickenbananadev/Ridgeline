/* Build 92 — portal auto-derived stage mapping gaps (Phase 2 audit
   finding #7, medium).

   portalProgressFor's regex chain didn't match several of the app's own
   default pipeline stages at all ("Payments / Invoicing / Cap out",
   "Claim filed," "Supplementing" all fell through to step 0, "just
   getting started") and mismatched "Appointment scheduled" against the
   wrong rule (/scheduled/ matched before /approved|deposit|won|sold/ was
   checked), overstating a brand-new job as "Installation scheduled" in
   front of the customer.

   Fixed with an explicit stage-id -> portal-step map covering the app's
   full default pipeline (survives a company renaming a stage's label,
   which a label-regex can't), falling back to the regex chain — now with
   /approved|deposit|won|sold/ checked before /scheduled/ — for any
   genuinely custom stage a company adds in the Workflow editor.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/const DEFAULT_STAGE_PORTAL_STEP = \{\s*\n\s*s1: 0, s2: 0, s3: 1, s4: 1, s5: 2, s6: 2, s7: 4, s8: 5, s9: 6, s10: 6,\s*\n\s*\};/.test(src),
  "an explicit id-based map now covers every default pipeline stage");
ok(/if \(job\.stageId && Object\.prototype\.hasOwnProperty\.call\(DEFAULT_STAGE_PORTAL_STEP, job\.stageId\)\) \{/.test(src),
  "portalProgressFor checks the id map before falling back to the label regex");
const chainOrder = src.indexOf("if (/approved|deposit|won|sold/.test(stage)) return 2;");
const scheduledOrder = src.indexOf("if (/scheduled/.test(stage)) return 4;");
ok(chainOrder > 0 && scheduledOrder > 0 && chainOrder < scheduledOrder,
  "the fallback regex chain now checks approved/deposit/won/sold before scheduled");

/* ---------- behavioral ---------- */
const scratch = path.join(__dirname, "_b92.jsx");
const bundle = path.join(__dirname, "_b92.cjs");
fs.writeFileSync(scratch, src + "\nexport { portalProgressFor };\n");
const { execSync } = require("child_process");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b92.cjs");

const STAGE_NAMES = {
  s1: "New lead", s2: "Appointment scheduled", s3: "Estimate sent / Follow up", s4: "Claim filed",
  s5: "Job approved", s6: "Supplementing", s7: "Deposit paid — job scheduled", s8: "Production",
  s9: "Payments / Invoicing / Cap out", s10: "Job completed",
};
const expected = { s1: 0, s2: 0, s3: 1, s4: 1, s5: 2, s6: 2, s7: 4, s8: 5, s9: 6, s10: 6 };
for (const [id, name] of Object.entries(STAGE_NAMES)) {
  const got = m.portalProgressFor({ stageId: id, stageLabel: name });
  ok(got === expected[id], `${id} "${name}" now maps to portal step ${expected[id]} (got ${got})`);
}

/* The two bugs named explicitly in the audit, isolated. */
ok(m.portalProgressFor({ stageId: "s2", stageLabel: "Appointment scheduled" }) === 0,
  "a brand-new job with just an appointment on the books no longer overclaims 'Installation scheduled'");
ok(m.portalProgressFor({ stageId: "s9", stageLabel: "Payments / Invoicing / Cap out" }) !== 0,
  "a job in Payments/Invoicing no longer falls back to 'just getting started'");

/* A genuinely custom stage (not in the default map) still resolves via
   the regex fallback, reordered so approved/deposit beats scheduled. */
ok(m.portalProgressFor({ stageId: "custom1", stageLabel: "Deposit paid, crew scheduled" }) === 2,
  "a custom stage mentioning BOTH 'deposit' and 'scheduled' now matches approved/deposit first — the exact ordering bug this build fixes for non-default stages");
ok(m.portalProgressFor({ stageId: "custom2", stageLabel: "Materials on order" }) === 3,
  "a custom materials-ordered stage still resolves via the regex fallback");
ok(m.portalProgressFor({ stageId: "custom3", stageLabel: "Nonsense stage name" }) === 0,
  "a totally unrecognized custom stage still safely falls back to step 0, not a crash");

/* portalProgress override still wins over everything, unchanged behavior. */
ok(m.portalProgressFor({ stageId: "s1", stageLabel: "New lead", portalProgress: 5 }) === 5,
  "an explicit portalProgress override still takes precedence over the id map");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 92: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 92 tests passed");
