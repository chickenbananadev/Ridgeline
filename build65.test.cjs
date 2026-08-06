/* Build 65 — two Performance-screen quick wins from the gap analysis.

   1. Trend chart: revenue and jobs-won by month, trailing 6 months.
      Every other number on this screen is a point-in-time snapshot;
      this is the one place a rep sees whether things are moving up or
      down instead of re-deriving it by memory across visits. Bucketed
      on contract.signedAt (the same date the QuickBooks export already
      treats as the invoice date), falling back to the job's last stage
      move for jobs with no recorded signing date.

   2. Rep goal: an admin-settable revenue target per rep with a progress
      bar next to numbers the leaderboard already computes (r.revenue).
      No new metric is introduced — goal tracking is just a comparison
      against what was already there.

   Live browser verification of the trend chart against the seeded demo
   jobs caught a real bug before it shipped: signedAt is written in at
   least three different shapes across this codebase depending on which
   code path wrote it — todayIso()'s "2026-07-15", the seed data's
   "Jul 15, 2026", and (via a shared Contract sheet) nowStamp()'s
   year-less "Aug 6, 11:47 PM". The first cut of the bucketing logic
   assumed ISO and did `String(raw).slice(0, 7)`, which silently matched
   nothing against the seed data's format — every won job in the demo
   fell outside the "trailing window" that never actually existed. Fixed
   by parsing with the same real-date reconstruction build63 already
   built for nowStamp() (parseNowStamp), composed with a native Date
   fallback for the other two shapes (parseAnyStamp).
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- 1: trend chart ---------- */
ok(/const raw = \(j\.contract && j\.contract\.signedAt\) \|\| j\.stageAt;/.test(src),
  "revenue is bucketed on the same signed date the QuickBooks export already treats as canonical, not a new date field");
ok(/function parseAnyStamp\(raw\) \{/.test(src),
  "date parsing goes through a shared helper that knows about every shape this codebase actually writes, not a single assumed format");
ok(/const viaNowStamp = parseNowStamp\(raw\);\s*\n\s*if \(viaNowStamp\) return viaNowStamp;\s*\n\s*const d = new Date\(raw\);/.test(src),
  "the year-less nowStamp() shape is tried first, then a native Date parse covers ISO and long-date-with-year");
ok(/const d = parseAnyStamp\(raw\);\s*\n\s*if \(!d\) return;\s*\n\s*const key = `\$\{d\.getFullYear\(\)\}-\$\{String\(d\.getMonth\(\) \+ 1\)\.padStart\(2, "0"\)\}`;/.test(src),
  "the trend's bucket key is built from an actually-parsed date, not a string slice that assumes ISO");
ok(!/String\(raw\)\.slice\(0, 7\)/.test(src),
  "the naive slice(0,7) bucketing that silently matched nothing against the seed data's date format is gone");
ok(/const TrendChart = \(\{ data, valueKey, formatValue, tone \}\) => \{/.test(src),
  "the chart is a reusable local component, not duplicated markup per metric");
ok(/\{trend\.some\(\(d\) => d\.won > 0\) && \(/.test(src),
  "an org with nothing won in the trailing window shows no empty chart, matching the app's no-noise convention elsewhere");
ok(/<TrendChart data=\{trend\} valueKey="revenue" formatValue=\{moneyCompact\} \/>/.test(src) &&
   /<TrendChart data=\{trend\} valueKey="won" formatValue=\{\(v\) => String\(v\)\} tone="#5B8DEF" \/>/.test(src),
  "both revenue and jobs-won render through the same chart component");
ok(/const moneyCompact = \(n\) => \{/.test(src),
  "the chart's dollar labels use a compact formatter (\"$9.4k\") instead of full precision that doesn't fit a narrow bar");

/* ---------- 2: rep goal ---------- */
ok(/const setGoal = \(name, val\) => setUsers && setUsers\(\(prev\) => prev\.map\(\(u\) => u\.name === name \? \{ \.\.\.u, goal: val \} : u\)\);/.test(src),
  "goal is stored raw on the user record, same convention every other MoneyInput field in the app already uses");
ok(/const progress = goal > 0 \? Math\.min\(100, \(r\.revenue \/ goal\) \* 100\) : 0;/.test(src),
  "progress is computed against r.revenue — a number the leaderboard already computes, not a new metric");
ok(/function Performance\(\{ jobs, stages, users, onBack, isAdmin, currentUser, toast, crews = \[\], setUsers \}\) \{/.test(src),
  "Performance actually accepts setUsers rather than silently no-oping");
ok(/<Performance jobs=\{jobs\} stages=\{stages\} users=\{users\} onBack=\{\(\) => setNav\("more"\)\}\s*\n\s*isAdmin=\{isAdmin\} currentUser=\{liveUser\} toast=\{toast\} crews=\{crews\} setUsers=\{setUsers\} \/>/.test(src),
  "setUsers is actually threaded through at the call site, not just accepted and unused");
ok(/\{setUsers && \(\s*\n\s*<MoneyInput style=\{\{ \.\.\.inputStyle, width: "100%" \}\} placeholder="Set a revenue goal"/.test(src),
  "the goal input only renders when there's actually a way to persist it");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_b65.jsx");
const bundle = path.join(__dirname, "_b65.cjs");
fs.writeFileSync(scratch, src + "\nexport { computeCapOut, WON_STAGES, parseAnyStamp };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b65.cjs");

ok(m.WON_STAGES.length > 0, "WON_STAGES is a real, non-empty list the trend/goal logic both depend on");
const wonJob = { id: "j1", stageId: m.WON_STAGES[0], contract: { signedAt: "2026-03-14", price: 10000 },
  fin: { materials: [], labor: [], other: [], structure: "grossProfit", commissionRate: 10 }, changeOrders: [] };
const cap = m.computeCapOut(wonJob);
ok(typeof cap.contract === "number" && cap.contract > 0, "computeCapOut still returns a usable contract figure for a signed job — the trend chart's revenue source");

/* This is the exact regression: every one of these shapes has to bucket
   into month 3 (March) of 2026, or a real won job silently vanishes from
   the trend the way the whole seed dataset did before the fix. */
const shapes = [
  ["ISO (todayIso())", "2026-03-14"],
  ["long date with year (seed data)", "Mar 14, 2026"],
];
shapes.forEach(([label, raw]) => {
  const d = m.parseAnyStamp(raw);
  ok(d instanceof Date, `parseAnyStamp returns a real Date for the ${label} shape`);
  ok(d && d.getFullYear() === 2026 && d.getMonth() === 2, `${label} correctly buckets into March 2026, not some other month or a dropped row`);
});
/* The nowStamp() shape has no year, so it can't be pinned to a specific
   month across runs — this is the same guard build63 already carries,
   repeated here because it's this feature's fallback path too. */
const nowStampShape = new Date().toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const parsedNow = m.parseAnyStamp(nowStampShape);
ok(parsedNow instanceof Date && Math.abs(parsedNow.getTime() - Date.now()) < 61000,
  "the year-less nowStamp() shape still resolves to the real current time through the shared helper, not a dropped row");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 65: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 65 tests passed");
