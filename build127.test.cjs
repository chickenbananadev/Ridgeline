/* Build 127 — the storm history never showed hail. Owner: "under the
   property weather reports, it's not showing any hail dates."

   Root cause, confirmed against the service's own source: the IEM
   Local Storm Report GeoJSON exposes TYPECODE as the property named
   `type` — a ONE-CHARACTER id ("H" hail, "G" gust, "D" damage, "T"
   tornado) — and the human string as `typetext` ("HAIL", "TSTM WND
   GST"). The old code tested `String(p.type).includes("HAIL")`, which
   is false for "H" and can never be true for any report ever
   returned. So hailIn and reportWind were null on every day, the
   "Hail — n″ (NOAA)" chip could not render, and the only remaining
   hail signal was ERA5 weather codes 96/99 — which reanalysis
   effectively never emits, since it has no hail observation at all.
   Net effect: zero hail, everywhere, always.

   Three further defects fixed in the same path, each of which would
   have kept the feature wrong even after the matching was corrected:

   1. The lookup pulled the ENTIRE NATIONAL report set once per day and
      filtered client-side, so a multi-year hail history was N national
      downloads. The service accepts a bounding box (west/east/south/
      north, all four required together) — the whole window is now one
      small request.
   2. Gust magnitudes arrive in knots as well as mph, carried in the
      `unit` field the old code ignored, making the reported wind wrong
      by 15% whenever a report was filed in knots.
   3. Reports were bucketed by the UTC date in `valid`. An evening
      hailstorm lands after midnight UTC, so it filed under the NEXT
      day — putting the wrong date of loss on a claim.

   And the ranking bug that made the whole thing unrecoverable: days
   were scored by a severity function that could not see hail (hailIn
   was still null at ranking time), the top 8 kept, and only those
   asked about. A real hail day that was unremarkable in the
   reanalysis was never queried, so no amount of looking would surface
   it. Reports now LEAD and reanalysis decorates. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: the actual bug is gone ----------
   Checked against a comment-stripped view: the block comment above
   lsrKind quotes the broken expression on purpose, to document what
   went wrong, and that quotation must not read as the bug still being
   present. */
const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
ok(!/[^y]type\.includes\("HAIL"\)/.test(code),
  "nothing matches hail against the one-character TYPECODE field anymore — that comparison was never once true");
ok(!/type\.includes\("WND"\)/.test(code), "same for wind: 'G' never contained 'WND'");
ok(!/async function enrichStormDay/.test(src),
  "the per-day national-pull enrichment is gone, not left as a dead second path");
ok(/const t = String\(p\.typetext \|\| ""\)\.toUpperCase\(\);/.test(src),
  "classification reads typetext, the field that actually carries 'HAIL'");
ok(/if \(t\.includes\("HAIL"\) \|\| code === "H"\) return "hail";/.test(src),
  "the one-char code is kept as a FALLBACK, so a missing typetext degrades instead of silently misreporting");

/* ---------- static: one bbox-scoped request for the whole window ---------- */
const frStart = src.indexOf("async function fetchStormReports(lat, lng, start, end) {");
ok(frStart !== -1, "fetchStormReports replaces the per-day call");
const frSrc = src.slice(frStart, src.indexOf("function haversineMiles", frStart));
ok(/&west=\$\{\(lng - LSR_RADIUS_DEG\)\.toFixed\(3\)\}&east=\$\{\(lng \+ LSR_RADIUS_DEG\)\.toFixed\(3\)\}/.test(frSrc) &&
   /&south=\$\{\(lat - LSR_RADIUS_DEG\)\.toFixed\(3\)\}&north=\$\{\(lat \+ LSR_RADIUS_DEG\)\.toFixed\(3\)\}/.test(frSrc),
  "the request is bounded to the property — all four box edges, which the service requires together");
ok(/sts=\$\{start\}T00:00Z&ets=\$\{ets\}T00:00Z/.test(frSrc),
  "one request spans the whole window instead of one request per day");
ok(/const date = localDateAt\(p\.valid, lng\);/.test(frSrc),
  "reports bucket by local date, so an evening storm doesn't file under tomorrow");
ok(/const mph = lsrWindMph\(mag, p\.unit\);/.test(frSrc),
  "wind magnitude is normalized through the unit field rather than trusted as mph");

/* ---------- static: reports lead, reanalysis decorates ---------- */
/* Build 136 added radar hail and measured gusts as further sources,
   so the merge takes four arguments now. The guarantee this file
   exists to protect is unchanged and is asserted below: a day with a
   storm report is included WITHOUT having to also look notable in the
   reanalysis. */
ok(/function mergeStormDays\(days, reportsByDate, radarByDate, gustByDate\)/.test(src), "mergeStormDays exists");
const msStart = src.indexOf("function mergeStormDays(days, reportsByDate, radarByDate, gustByDate)");
const msSrc = src.slice(msStart, msStart + 2000);
ok(/\.filter\(\(r\) => r\.reports \|\| /.test(msSrc),
  "any day carrying a storm report survives the filter unconditionally — it no longer has to also look notable in the reanalysis");
ok(/const base = byDate\.get\(date\) \|\| blank\(date\);/.test(msSrc),
  "a hail day the reanalysis never flagged is ADDED to the list, not dropped for having no ERA5 row");
ok(/fetchStormHistory\(lat, lng, start, end\),\s*\n\s*fetchStormReports\(lat, lng, start, end\),/.test(src),
  "both sources are fetched together, so neither blocks the other");
ok(!/notable\.slice\(0, 8\)/.test(src),
  "the top-8 enrichment cap is gone — it was the reason a real hail day could be invisible no matter how you searched");

/* ---------- static: honest empty vs failed ---------- */
/* Build 136: each observed source that failed is now named
   individually rather than one combined flag, but the guarantee is the
   same — a failed fetch must never render as a genuinely empty result. */
ok(/!reports && "spotter reports",/.test(src),
  "a failed hail-record fetch is tracked separately from a genuinely empty result");
/* Build 136 widened the wording from hail alone to any source, since
   radar and measured wind can now fail independently. Same promise. */
ok(/This is not evidence that nothing happened here\./.test(src),
  "\"couldn't check\" is never presented as \"nothing happened\" — the distinction a rep repeats to a homeowner");
ok(/No storm reports or notable weather between \{start\} and \{end\}/.test(src),
  "a real empty result says so plainly and suggests a longer look-back");
ok(/d\.setFullYear\(d\.getFullYear\(\) - 2\);/.test(src),
  "the default window is two years — one year routinely returns nothing and reads as 'no hail here'");

/* ---------- behavioral: mirror lsrKind against REAL service values ---------- */
function lsrKind(p) {
  const t = String(p.typetext || "").toUpperCase();
  const code = String(p.type || "").toUpperCase();
  if (t.includes("HAIL") || code === "H") return "hail";
  if (t.includes("TORNADO") || code === "T") return "tornado";
  if (/WND GST|WIND|DOWNBURST/.test(t) || code === "G") return "wind";
  if (/DMG|DAMAGE/.test(t) || code === "D") return "damage";
  return "other";
}
/* Exactly the shape the service returns — type is the 1-char code. */
ok(lsrKind({ type: "H", typetext: "HAIL", magnitude: "1.75" }) === "hail",
  "a real hail feature classifies as hail — the case that was broken in production");
ok(lsrKind({ type: "G", typetext: "TSTM WND GST" }) === "wind", "thunderstorm wind gust");
ok(lsrKind({ type: "G", typetext: "NON-TSTM WND GST" }) === "wind", "non-thunderstorm gust still counts as wind");
ok(lsrKind({ type: "D", typetext: "TSTM WND DMG" }) === "damage", "wind damage is its own kind — it carries no magnitude");
ok(lsrKind({ type: "T", typetext: "TORNADO" }) === "tornado", "tornado");
ok(lsrKind({ type: "5", typetext: "SNOW" }) === "other", "unrelated report types are ignored, not miscounted as wind");
ok(lsrKind({ type: "H", typetext: "" }) === "hail",
  "a feature with no typetext still classifies off the code — the fallback earns its place");
/* The regression itself, stated as a test. */
ok(lsrKind({ type: "H", typetext: "HAIL" }) !== "other",
  "REGRESSION: the old String(p.type).includes('HAIL') test returned false here, which is why no hail ever appeared");

/* ---------- behavioral: unit normalization ---------- */
function lsrWindMph(mag, unit) {
  if (!isFinite(mag)) return null;
  return /KT|KNOT/i.test(String(unit || "")) ? mag * 1.15078 : mag;
}
ok(lsrWindMph(60, "MPH") === 60, "mph passes through untouched");
ok(Math.round(lsrWindMph(60, "KTS")) === 69, "60 knots is 69 mph — reporting it as 60 understates a severe gust");
ok(lsrWindMph(NaN, "MPH") === null, "a report with no magnitude yields null rather than NaN leaking into a max()");

/* ---------- behavioral: local-date bucketing ---------- */
function localDateAt(utcIso, lng) {
  const t = Date.parse(utcIso);
  if (!isFinite(t)) return null;
  return new Date(t + Math.round(lng / 15) * 3600000).toISOString().slice(0, 10);
}
ok(localDateAt("2024-05-08T02:30:00Z", -88) === "2024-05-07",
  "a 9:30pm Illinois hailstorm is May 7 locally, not the May 8 its UTC stamp reads — this is a wrong date of loss on a claim");
ok(localDateAt("2024-05-07T19:00:00Z", -88) === "2024-05-07", "an afternoon storm is unaffected");
ok(localDateAt("2024-05-08T04:00:00Z", -118) === "2024-05-07", "same correction on the west coast, with a bigger offset");
ok(localDateAt("garbage", -88) === null, "an unparseable timestamp is skipped rather than bucketed under NaN");

/* ---------- behavioral: mirror the merge, the heart of the fix ---------- */
function stormSeverity(r) {
  return (r.hailIn ? 4000 + r.hailIn * 500 : r.hail ? 3000 : 0)
    + (r.reportWind || r.gust || 0) + (r.storm ? 20 : 0) + (r.precip ? r.precip * 12 : 0);
}
function mergeStormDays(days, reportsByDate) {
  const byDate = new Map();
  (days || []).forEach((d) => byDate.set(d.date, { ...d }));
  Object.entries(reportsByDate || {}).forEach(([date, rep]) => {
    const base = byDate.get(date) || { date, gust: null, precip: null, code: null,
      hail: false, highWind: false, damagingWind: false, storm: false };
    byDate.set(date, { ...base, hailIn: rep.hailIn, reportWind: rep.reportWind,
      reports: rep.count, reportList: rep.reports });
  });
  return [...byDate.values()]
    .filter((r) => r.reports || r.hail || r.highWind || r.storm || (r.precip != null && r.precip >= 0.75))
    .sort((a, b) => stormSeverity(b) - stormSeverity(a) || (a.date < b.date ? 1 : -1));
}
/* The exact production scenario: a genuine hail day that the reanalysis
   found unremarkable. Under the old flow this day was filtered out
   before enrichment and could never be seen. */
const CALM_ERA5 = [
  { date: "2024-05-07", gust: 22, precip: 0.3, hail: false, highWind: false, storm: false },
  { date: "2024-06-02", gust: 51, precip: 0.1, hail: false, highWind: true, storm: false },
];
const REPORTS = { "2024-05-07": { hailIn: 1.75, reportWind: null, count: 4, reports: [{ miles: 2 }] } };
const merged = mergeStormDays(CALM_ERA5, REPORTS);
ok(merged.some((r) => r.date === "2024-05-07" && r.hailIn === 1.75),
  "a 1.75\" hail day survives even though ERA5 saw a calm 22 mph day — the exact case that was invisible");
ok(merged[0].date === "2024-05-07",
  "and it ranks ABOVE a windier day, because a confirmed hail report outranks a modelled gust");

/* A hail day with no ERA5 row at all still appears. */
const orphan = mergeStormDays([], { "2023-04-15": { hailIn: 1, reportWind: null, count: 1, reports: [] } });
ok(orphan.length === 1 && orphan[0].date === "2023-04-15" && orphan[0].gust === null,
  "a report-only day is added with null reanalysis fields rather than dropped for having no matching ERA5 day");

/* Quiet days are still excluded — the filter didn't just become a pass-through. */
const quiet = mergeStormDays([{ date: "2024-01-01", gust: 12, precip: 0.01, hail: false, highWind: false, storm: false }], {});
ok(quiet.length === 0, "an ordinary calm day with no report is still filtered out");

/* Reanalysis-only notable days survive — a wind claim needs no spotter. */
const windOnly = mergeStormDays([{ date: "2024-03-03", gust: 62, precip: 0.2, hail: false, highWind: true, damagingWind: true, storm: false }], {});
ok(windOnly.length === 1, "a damaging-wind day with no storm report still shows — nobody has to have called it in");

/* ---------- behavioral: hail size vocabulary ---------- */
const HAIL_SIZES = [[4.5, "softball"], [4, "grapefruit"], [3, "teacup"], [2.75, "baseball"],
  [2.5, "tennis ball"], [2, "hen egg"], [1.75, "golf ball"], [1.5, "ping pong ball"],
  [1.25, "half dollar"], [1, "quarter"], [0.88, "nickel"], [0.75, "penny"], [0.5, "marble"]];
function hailSizeLabel(inches) {
  if (inches == null) return "";
  const hit = HAIL_SIZES.find(([n]) => inches >= n);
  return hit ? hit[1] : "pea";
}
ok(hailSizeLabel(1.75) === "golf ball", "1.75\" is golf ball — the size everyone on a doorstep actually says");
ok(hailSizeLabel(1) === "quarter", "1\" is quarter, the NWS severe threshold");
ok(hailSizeLabel(2.6) === "tennis ball", "sizes round DOWN to the size actually reached, never up");
ok(hailSizeLabel(0.3) === "pea", "below the smallest named size still gets a word");
ok(hailSizeLabel(null) === "", "no hail means no size label, not 'pea'");

/* ---------- behavioral: distance ---------- */
function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
ok(Math.round(haversineMiles(41.88, -87.63, 41.88, -87.63)) === 0, "same point is zero miles");
ok(Math.abs(haversineMiles(41.88, -87.63, 41.88, -88.63) - 51.5) < 2,
  "one degree of longitude at Chicago's latitude is ~51.5 mi");
ok(Math.abs(haversineMiles(41.0, -88.0, 42.0, -88.0) - 69) < 1, "one degree of latitude is ~69 mi anywhere");

if (fails) { console.log("\nbuild 127: " + fails + " FAILED"); process.exit(1); }
console.log("build 127 tests passed");
