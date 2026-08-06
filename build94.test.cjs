/* Build 94 — clean up dead/drifted constants: JOB_TYPES and
   REVIEW_PLATFORMS (Phase 2 audit finding #9, low).

   JOB_TYPES was declared and never referenced; NewLeadSheet and
   TabOverview each hand-rolled the same four claim-type options in a
   different order, and neither matched JOB_TYPES (which was also
   missing "Unknown"). REVIEW_PLATFORMS was likewise fully unreferenced;
   ReviewSettings hardcoded the same three platforms inline, and the
   three hardcoded fields weren't even structurally consistent with each
   other (Google reads/writes brand.googleReviewLink; Facebook/BBB
   read/write settings.*Link).

   Fixed by making both constants the real source both consumers map
   over: JOB_TYPES now includes "Unknown" and both pickers map over it
   directly; REVIEW_PLATFORMS is now an array of {id, name, blurb,
   label, hint/placeholder, source, field} objects, and ReviewSettings'
   "Where reviews go" section maps over it — source/field preserves the
   real, deliberate difference between Google (stored on brand, used
   company-wide in merge fields) and Facebook/BBB (settings-only)
   instead of papering over it.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: JOB_TYPES ---------- */
ok(/const JOB_TYPES = \["Retail", "Insurance", "Commercial", "Unknown"\];/.test(src),
  "JOB_TYPES now includes Unknown, matching every real picker's option set");
ok(/\{JOB_TYPES\.map\(\(c\) => \(/.test(src), "NewLeadSheet's claim-type picker now maps over JOB_TYPES");
ok(/<PillGroup options=\{JOB_TYPES\} value=\{job\.claimType\}/.test(src), "TabOverview's claim-type picker now maps over JOB_TYPES");
ok(!/\["Insurance", "Retail", "Commercial", "Unknown"\]\.map/.test(src), "the old hand-rolled NewLeadSheet array is gone");
ok(!/<PillGroup options=\{\["Retail", "Insurance", "Commercial", "Unknown"\]\}/.test(src), "the old hand-rolled TabOverview array is gone");

/* ---------- static: REVIEW_PLATFORMS ---------- */
const platformsStart = src.indexOf("const REVIEW_PLATFORMS = [");
const platformsEnd = src.indexOf("\n];", platformsStart) + 3;
const platformsSrc = src.slice(platformsStart, platformsEnd);
ok(/id: "google"[\s\S]*?source: "brand", field: "googleReviewLink" \}/.test(platformsSrc),
  "REVIEW_PLATFORMS' google entry carries its real storage source (brand)");
ok(/id: "facebook"[\s\S]*?source: "settings", field: "facebookLink" \}/.test(platformsSrc),
  "REVIEW_PLATFORMS' facebook entry carries its real storage source (settings)");
ok(/id: "bbb"[\s\S]*?source: "settings", field: "bbbLink" \}/.test(platformsSrc),
  "REVIEW_PLATFORMS' bbb entry carries its real storage source (settings)");

ok(/\{REVIEW_PLATFORMS\.map\(\(p\) => \(/.test(src), "ReviewSettings' 'Where reviews go' section now maps over REVIEW_PLATFORMS");
ok(/value=\{\(p\.source === "brand" \? brand\[p\.field\] : settings\[p\.field\]\) \|\| ""\}/.test(src),
  "each platform field reads from the right source (brand vs settings) per its own entry");
ok(!/<Field label="Google review link" hint="Google Business Profile/.test(src), "the old hardcoded Google field block is gone");
ok(!/<Field label="Facebook reviews link">/.test(src), "the old hardcoded Facebook field block is gone");
ok(!/<Field label="BBB profile link">/.test(src), "the old hardcoded BBB field block is gone");

/* ---------- behavioral ---------- */
/* The value/onChange resolver, mirrored exactly. */
const REVIEW_PLATFORMS = [
  { id: "google", field: "googleReviewLink", source: "brand" },
  { id: "facebook", field: "facebookLink", source: "settings" },
  { id: "bbb", field: "bbbLink", source: "settings" },
];
const resolveValue = (p, brand, settings) => (p.source === "brand" ? brand[p.field] : settings[p.field]) || "";
const brand = { googleReviewLink: "https://g.page/r/example" };
const settings = { facebookLink: "https://facebook.com/example/reviews", bbbLink: "" };
ok(resolveValue(REVIEW_PLATFORMS[0], brand, settings) === "https://g.page/r/example", "google resolves from brand");
ok(resolveValue(REVIEW_PLATFORMS[1], brand, settings) === "https://facebook.com/example/reviews", "facebook resolves from settings");
ok(resolveValue(REVIEW_PLATFORMS[2], brand, settings) === "", "an unset bbb link resolves to an empty string, not undefined");

if (fails) { console.log("\nbuild 94: " + fails + " FAILED"); process.exit(1); }
console.log("build 94 tests passed");
