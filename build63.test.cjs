/* Build 63 — two supplement quick wins from the competitive gap analysis.

   1. supplementJustification(): each SupplementCheck finding can now hand
      back a ready-to-send, carrier-legible paragraph instead of leaving a
      rep to write one from a bare "missing ice & water shield" line —
      the specific pattern Ketterly and Restoration AI sell as their whole
      product. Never asserts a code citation that isn't actually verified
      for the job's state, same discipline the letter-template library
      already follows.

   2. SupplementPipeline: job.claim.supplements[] rolled up across every
      job into one cross-job board, grouped by status with $ totals — the
      same thing paid spreadsheet tools ("Supplement Tracker", "SuppTrax")
      exist to bolt onto other CRMs because their claim tab doesn't give
      supplement-heavy shops a real pipeline view.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- 1: justification text ---------- */
ok(/function supplementJustification\(f, job\) \{/.test(src),
  "a standalone function generates the justification, independent of any component");
ok(/const citeClause = printable\(cf\) \? ` per \$\{cf\.value\}` : "";/.test(src),
  "the code cite only appears in the sentence when it's actually verified — never an unconfirmed claim to a carrier");
ok(/justification: supplementJustification\(f, job\)/.test(src),
  "a supplement row keeps its justification text once added, not just recomputed on the fly");
ok(/const copyJustification = \(f\) => \{/.test(src) && /Copy justification/.test(src),
  "a rep can copy the justification straight to clipboard from the finding");

/* ---------- 2: supplement pipeline ---------- */
ok(/function SupplementPipeline\(\{ jobs, onOpenJob, embedded = false, onBack \}\) \{/.test(src),
  "the pipeline is its own component, reusable embedded or standalone like ClaimsDashboard");
ok(/const rows = jobs\.flatMap\(\(j\) => \(\(j\.claim \|\| \{\}\)\.supplements \|\| \[\]\)\.map\(\(s\) => \(\{ job: j, s \}\)\)\);/.test(src),
  "rolls up the exact same supplements array the claim tab already writes — no new data model");
ok(/function parseNowStamp\(s\) \{/.test(src),
  "aging math parses nowStamp()'s actual display format instead of trusting a generic Date.parse on a string with no year");
ok(/const d = parseNowStamp\(s\.at\);\s*\n\s*if \(!d\) return null;/.test(src),
  "the pipeline's day count is built from the real parsed date, not a naive slice-and-parse of a locale string");
ok(/const atTime = \(s\) => \{ const d = parseNowStamp\(s\.at\); return d \? d\.getTime\(\) : 0; \};/.test(src),
  "the recency sort uses the same real date, not an alphabetical string compare where \"Oct\" < \"Sep\"");
ok(/\["all", \.\.\.SUPPLEMENT_STATUS\]\.map/.test(src),
  "reuses the existing SUPPLEMENT_STATUS enum rather than inventing new pipeline stages");
ok(/tab === "supqueue" && \(/.test(src) && /<SupplementPipeline jobs=\{jobs\} onOpenJob=\{onOpenJob\} embedded \/>/.test(src),
  "wired into the Insurance hub as its own tab, not just a dead component");
ok(/\["clients", "Clients"\], \["claims", "Claims"\], \["supqueue", "Supplement queue"\]/.test(src),
  "the tab appears right after Claims, where a rep is already looking for claim money");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_b63.jsx");
const bundle = path.join(__dirname, "_b63.cjs");
fs.writeFileSync(scratch, src + "\nexport { supplementJustification, citeFor, parseNowStamp };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b63.cjs");

const job = { address: "127 Market Street, Vanceburg, KY", claim: { claim: "CLM-9981" } };

/* An unverified finding (no topic passed, so citeFor never resolves a
   confident cite) must not put a "per <code>" clause into carrier-facing
   text — this is the same rule that keeps the letter library from citing
   sections nobody has confirmed. */
const unverified = { title: "Kickout / diverter flashing", why: "Wall-to-roof intersections need a diverter.", sev: "MODERATE", topic: null, cite: null, verified: false };
const unverifiedText = m.supplementJustification(unverified, job);
ok(!/ per /.test(unverifiedText), "an unverified finding's justification carries no citation clause");
ok(unverifiedText.includes("CLM-9981"), "the claim number is threaded into the justification when the job has one");
ok(unverifiedText.includes(job.address), "the property address is threaded into the justification");
ok(/should be included as an approved supplement/.test(unverifiedText), "reads as a request, addressed to the carrier, not an internal note");

/* A verified finding must actually surface its citation. */
const verifiedCite = m.citeFor("OH", "iceBarrier");
if (verifiedCite && verifiedCite.verified) {
  const verified = { title: "Ice & water shield — eaves", why: "Ice-barrier code requires it at eaves.", sev: "HIGH", topic: "iceBarrier", cite: verifiedCite.cite, verified: true };
  const verifiedText = m.supplementJustification(verified, { ...job, address: "1 Main St, Columbus, OH" });
  ok(new RegExp(` per ${verifiedCite.cite.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(verifiedText),
    "a verified finding's justification does state its citation");
} else {
  console.log("  (skipped verified-cite assertion — OH iceBarrier not marked verified in this build; unverified-path assertions above still cover the core discipline)");
}

/* parseNowStamp — this is the regression that actually broke aging in
   the browser: nowStamp()'s exact output format, "Aug 6, 11:47 PM", fed
   through a naive Date.parse produced a date in the year 2001 (V8's
   default when no year is present), so a supplement added an hour ago
   read as "9131 days in this status". */
const now = new Date();
const stampNow = now.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const parsed = m.parseNowStamp(stampNow);
ok(parsed instanceof Date, "parseNowStamp actually returns a Date for a real nowStamp() string");
ok(parsed && Math.abs(parsed.getTime() - now.getTime()) < 61000,
  "and it lands within a minute of the real time — not 9,131 days off");
ok(m.parseNowStamp("not a timestamp") === null, "garbage input returns null instead of a nonsense date");
ok(m.parseNowStamp("") === null, "empty input returns null rather than throwing");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 63: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 63 tests passed");
