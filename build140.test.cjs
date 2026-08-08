/* Build 140 — "Knock it" must land on a visible storm area.

   Tapping Knock it on the Home storm banner landed on a map with
   nothing drawn. The live alert row explained it twice over:

   1. THE CIRCLE WAS OFF-SCREEN. The deep link opened at a fixed
      zoom where a phone screen is ~7 miles wide, and the watched
      circle was 60 miles across — its thin dashed edge never entered
      the viewport, and the only fitBounds was keyed on a swath that
      never arrived.

   2. THE SWATH WAS EMPTY, AND EMPTY DREW NOTHING. The radar swath
      comes from NCEI's SWDI archive, which publishes DAYS late. For
      the storm that hit yesterday — the whole point of a storm alert
      — it returns nothing, and an empty (as opposed to failed) fetch
      rendered no rectangles, no legend, and no explanation.

   The fix: frame the watched circle the moment a rep arrives and
   fill it lightly when it is the only geometry; and turn the swath
   into a ladder — NCEI radar, then IEM's LIVE feed of the same
   Level III products (real-time, verified from the service's own
   source), then the day's spotter reports through the same binner,
   then an honest "radar hasn't published yet" notice. Plus: the
   no-satellite-token toast stops telling door-knockers to redeploy. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ============ 1. the watched area is visible on arrival ============ */
ok(/const circleFitRef = useRef\(null\);/.test(src),
  "the circle fit is guarded by its own ref");
ok(/map\.fitBounds\(circleRef\.current\.getBounds\(\), \{ padding: \[24, 24\] \}\);/.test(src),
  "arriving frames the whole watched circle, not a fixed zoom that may not contain any of it");
ok(/const key = `\$\{highlight\.lat\},\$\{highlight\.lng\},\$\{highlight\.radiusMiles\}`;\s*\n\s*if \(!hasSwath && circleFitRef\.current !== key\) \{/.test(src),
  "once per focus, and never once a swath owns the framing — a rep panning away must never be yanked back");
ok(/if \(!highlight\) \{ circleFitRef\.current = null; return; \}/.test(src),
  "and re-opening the same storm later frames it again rather than remembering it already did");
ok(/circleFitRef\.current = null;\s*\n\s*\};\s*\n\s*\}, \[L\]\);/.test(src),
  "the fit memory dies with the map — StrictMode's dev double-mount destroyed the fitted map and the survivor was never framed");
ok(/a 30-mile radius sat\s*\n       entirely outside a 7-mile-wide phone screen/.test(src),
  "with the failure it fixes recorded at the fit");
ok(/fill: !hasSwath, fillColor: "#B42318", fillOpacity: hasSwath \? 0 : 0\.07,/.test(src),
  "the circle fills lightly ONLY when it is the only geometry — over a swath it stays an outline");
ok(/highlight && highlight\.lat, highlight && highlight\.lng,\s*\n\s*highlight && highlight\.radiusMiles, ready, swath\]/.test(src),
  "the effect depends on the three scalars, not the object the parent rebuilds every render");

/* ============ 2. the geometry ladder ============ */
ok(/function stormGeometry\(radarByDate, lsrByDate, date\) \{/.test(src),
  "what to draw is one pure function, so the ladder is testable");
ok(/function reportedHailPoints\(day\) \{/.test(src),
  "and spotter reports become swath points through one pure function");
ok(/r\.kind === "hail" && r\.mag != null && r\.lat != null && r\.lng != null/.test(src),
  "only hail reports with a size and a position qualify — wind reports never draw hail cells");
ok(/const lsr = hasPoints\(radar\)\s*\n\s*\? null\s*\n\s*: await fetchStormReports\(focus\.lat, focus\.lng, focus\.date, focus\.date\);/.test(src),
  "spotter reports are only fetched when radar can't answer — usually a cache hit from the sweep that raised the alert");
ok(/live = await fetchRadarAttrs\(focus\.lat, focus\.lng, focus\.date, focus\.date, reach\);\s*\n\s*if \(hasPoints\(live\)\) radar = live;/.test(src),
  "when the archive is empty the live radar feed is asked before falling back to spotters");
ok(/setSwath\(g\.swath\); setSwathSource\(g\.source\);/.test(src),
  "the map is told what it is drawing, not just what to draw");
ok(/\{swathSource === "reported"\s*\n\s*\? "Spotter reports — where hail was called in, not full coverage"\s*\n\s*: "Radar estimate — approximate area, not a survey"\}/.test(src),
  "and the legend caption matches the source — spotter cells are never captioned as radar coverage");
ok(/data-testid="swath-pending"/.test(src),
  "loaded-but-empty says so on screen instead of leaving the map silently blank");
ok(/Radar hasn't published this day's hail track yet — it can lag a\s*\n\s+day or two\. The circle is the watched area from the alert\./.test(src),
  "in words a rep can act on");
ok(/swath && swath\.length === 0 && !swathErr && focus && focus\.date && focus\.kind !== "wind"/.test(src),
  "shown only in the loaded-and-empty case — never over an error, a wind alert, or a still-loading fetch");

/* ============ 3. the live radar feed's contract, encoded ============ */
ok(/const RADAR_ATTR_CACHE = new Map\(\);/.test(src), "live radar answers are cached like the others");
ok(/nexrad_storm_attrs\.py"\s*\n\s*\+ `\?fmt=csv&sts=\$\{start\}T00:00:00Z&ets=\$\{ets\}T00:00:00Z&min_hail_size=0\.25\$\{radarParam\}`;/.test(src),
  "the live query is CSV, time-bounded, and hail-only — min_hail_size is what keeps a national query small");
ok(/if \(\/\^ERROR\/i\.test\(String\(text\)\.trim\(\)\)\) \{ RADAR_ATTR_CACHE\.set\(key, \{\}\); return \{\}; \}/.test(src),
  "the service's zero-rows sentinel (an HTTP 200 'ERROR: no results' body) is a real empty answer, not a failure");
ok(/geojson\/network\/NEXRAD\.geojson/.test(src),
  "space is bounded by the nearest radar sites — the same station-discovery pattern as the wind path");
ok(/nearestStations\(\(gj && gj\.features\) \|\| \[\], lat, lng, 3\)/.test(src),
  "reusing the existing helper rather than a second implementation");
ok(/catch \(e\) \{ \/\* national hail-only query below still answers \*\/ \}/.test(src),
  "a failed station lookup degrades to the hail-only national query, not to nothing");
ok(/const header = \(lines\.shift\(\) \|\| ""\)\.split\(","\)\.map\(\(h\) => h\.trim\(\)\.toUpperCase\(\)\);/.test(src),
  "the CSV is parsed by header name, not column position — the column set is the service's to change");
ok(/if \(iLat < 0 \|\| iLng < 0 \|\| iSize < 0 \|\| iValid < 0\) throw new Error\("attrs-header"\);/.test(src),
  "a header missing the load-bearing columns is a loud failure, not silent zeros");
ok(/verified from the service's source, akrherz\/iem/.test(src),
  "with where the contract came from recorded, since the service is unreachable from this test environment");
ok(/if \(row\.points\.length < RADAR_POINT_CAP\) row\.points\.push/.test(src),
  "the same point cap as the archive path — a phone never holds an unbounded outbreak");

/* ============ 4. the satellite toast knows its audience ============ */
ok(/toast\(canManageCompanyConfig\(currentUser\)\s*\n\s*\? "Satellite needs an imagery key — add VITE_MAPBOX_TOKEN and redeploy\. See DEPLOY\.md\."\s*\n\s*: "Satellite isn't set up for your company yet — ask your admin\."\)/.test(src),
  "admins get the fix; everyone else gets a sentence about their own world, not someone else's deploy");

/* ============ behavioral: the ladder ============ */
const HAIL_GRID_DEG = 0.03;
function hailSwath(points, gridDeg = HAIL_GRID_DEG) {
  const cells = new Map();
  (points || []).forEach((p) => {
    if (!p || p.lat == null || p.lng == null || p.sizeIn == null) return;
    const gy = Math.floor(p.lat / gridDeg), gx = Math.floor(p.lng / gridDeg);
    const key = `${gy}:${gx}`;
    const cur = cells.get(key);
    if (cur) { cur.count++; if (p.sizeIn > cur.sizeIn) cur.sizeIn = p.sizeIn; return; }
    cells.set(key, { sizeIn: p.sizeIn, count: 1,
      south: gy * gridDeg, north: (gy + 1) * gridDeg,
      west: gx * gridDeg, east: (gx + 1) * gridDeg });
  });
  return [...cells.values()].sort((a, b) => a.sizeIn - b.sizeIn);
}
function reportedHailPoints(day) {
  return ((day && day.reports) || [])
    .filter((r) => r.kind === "hail" && r.mag != null && r.lat != null && r.lng != null)
    .map((r) => ({ lat: r.lat, lng: r.lng, sizeIn: r.mag }));
}
function stormGeometry(radarByDate, lsrByDate, date) {
  const radar = radarByDate && radarByDate[date];
  if (radar && radar.points && radar.points.length) {
    return { swath: hailSwath(radar.points), source: "radar" };
  }
  const pts = reportedHailPoints(lsrByDate && lsrByDate[date]);
  if (pts.length) return { swath: hailSwath(pts), source: "reported" };
  return { swath: [], source: null };
}

const D = "2026-08-07";
const RADAR = { [D]: { points: [
  { lat: 39.63, lng: -84.24, sizeIn: 1.25 },
  { lat: 39.66, lng: -84.20, sizeIn: 1 },
] } };
const LSR = { [D]: { reports: [
  { kind: "hail", mag: 1, lat: 39.63, lng: -84.235 },
  { kind: "hail", mag: 1.75, lat: 39.631, lng: -84.236 },     // same cell, bigger stone
  { kind: "wind", mag: 60, lat: 39.6, lng: -84.3 },           // must not draw
  { kind: "hail", mag: null, lat: 39.7, lng: -84.1 },         // sizeless: can't band it
  { kind: "hail", mag: 0.75, lat: 39.7, lng: -84.1 },
] } };

let g = stormGeometry(RADAR, LSR, D);
ok(g.source === "radar" && g.swath.length === 2,
  "radar answers when it has points, and spotters are not consulted");

g = stormGeometry({}, LSR, D);
ok(g.source === "reported",
  "THE GAP: radar empty (the archive hasn't published yesterday yet) falls back to the day's spotter reports");
ok(g.swath.length === 2,
  "five reports become two cells — wind and sizeless reports draw nothing: " + g.swath.length);
const worst = g.swath[g.swath.length - 1];
ok(worst.sizeIn === 1.75,
  "two reports in one cell keep the worst stone, same rule as radar cells: " + worst.sizeIn);

g = stormGeometry({ [D]: { points: [] } }, LSR, D);
ok(g.source === "reported",
  "a radar day with zero points is as empty as no radar day at all");

g = stormGeometry({}, {}, D);
ok(g.source === null && g.swath.length === 0,
  "nothing anywhere is an EMPTY swath with no source — which the screen renders as the honest notice");

g = stormGeometry({ "2026-08-06": RADAR[D] }, {}, D);
ok(g.source === null,
  "radar for a DIFFERENT day never draws on this day's alert");

ok(stormGeometry(null, null, D).source === null, "no data objects at all doesn't throw");

g = stormGeometry({}, { [D]: { reports: [{ kind: "hail", mag: 2, lat: null, lng: null }] } }, D);
ok(g.source === null,
  "a hail report with no position can't be drawn — better no cell than a cell at (0,0)");

/* ============ behavioral: the VALID timestamp rewrite ============ */
const iso = "202608070134".replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3T$4:$5:00Z");
ok(iso === "2026-08-07T01:34:00Z", "the live feed's YYYYMMDDHHMM becomes a real ISO instant: " + iso);
ok(!isNaN(Date.parse(iso)), "which parses");
ok("garbage".replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3T$4:$5:00Z") === "garbage",
  "a malformed VALID stays malformed and is dropped by the date filter, not misparsed");

if (fails) { console.log("\nbuild 140: " + fails + " FAILED"); process.exit(1); }
console.log("build 140 tests passed");
