/* Build 137 — draw the hail swath, not a circle.

   Tapping "Knock it" on a hail alert put a rep on the map with a solid
   red disc round the storm centre. That circle is the wrong shape AND
   the wrong claim: hail does not fall evenly across a disc, it tracks
   across the ground in a band a few miles wide, dropping bigger stones
   in some places than others. Working from a circle means knocking
   streets that got nothing and missing the ones that got hammered.

   Build 136 already fetched the radar detections; it just threw their
   positions away and kept a worst-size number. Keeping the positions
   makes the real footprint drawable.

   Three judgement calls are guarded here, because each could quietly
   mislead someone standing at a door:

   1. THE GRID IS DELIBERATELY COARSE. A NEXRAD row is a detected storm
      CELL — several miles across — not a point sample. Binning at
      radar-bin resolution would draw a dotted line of pinpricks:
      understating the area hit while implying precision the data does
      not have.

   2. WORST SIZE WINS A CELL, never an average. Averaging washes a
      destructive core out against the light hail around it, which is
      exactly the street a rep most needs to find.

   3. IT IS AN ESTIMATE AND SAYS SO. A swath quoted to an adjuster as
      a survey is how a claim gets picked apart. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ================= 1. positions are kept ================= */
ok(/points: \[\],/.test(src), "the radar row keeps a points array");
ok(/if \(row\.points\.length < RADAR_POINT_CAP\) row\.points\.push\(\{ lat: rlat, lng: rlng, sizeIn: size \}\);/.test(src),
  "every detection's position is recorded, not just the aggregate worst size");
ok(/const RADAR_POINT_CAP = 4000;/.test(src),
  "with a cap, so a multi-hour outbreak can't fill a phone's memory");
ok(/A single\s*\n         worst-size number tells a rep a storm happened; the track\s*\n         tells them which streets to work\./.test(src),
  "and the comment says why positions matter at all");

/* ================= 2. the swath geometry ================= */
ok(/function hailSwath\(points, gridDeg = HAIL_GRID_DEG\) \{/.test(src), "the footprint is a pure function");
ok(/const HAIL_GRID_DEG = 0\.03;\s+\/\/ ~2\.1 mi of latitude/.test(src),
  "the grid is about two miles, and says so in the units a person thinks in");
ok(/Binning at radar-bin resolution would draw a dotted\s*\n   line of pinpricks: it would understate the area hit while implying\s*\n   a precision the data does not have\./.test(src),
  "with the reasoning for a coarse grid recorded — it looks like sloppiness and isn't");
ok(/if \(p\.sizeIn > cur\.sizeIn\) cur\.sizeIn = p\.sizeIn;/.test(src), "worst size wins a cell");
ok(/Averaging would wash a destructive\s*\n         core out against the light hail around it/.test(src),
  "and averaging is explicitly rejected, with the reason");
ok(/return \[\.\.\.cells\.values\(\)\]\.sort\(\(a, b\) => a\.sizeIn - b\.sizeIn\);/.test(src),
  "cells are ordered smallest-first so big stones paint on top");
ok(/const HAIL_BANDS = \[/.test(src), "sizes are banded");
ok(/\{ min: 2\.5,/.test(src) && /\{ min: 1\.75,/.test(src) && /\{ min: 1,/.test(src),
  "at the sizes that change the conversation — severe, functional-damage, total");
ok(/1" is the\s*\n   NWS severe threshold, 1\.75" is where most carriers stop arguing\s*\n   about functional damage, 2\.5"\+ is a total\./.test(src),
  "and the band choice is justified in roofing terms, not arbitrary colour stops");
ok(/function swathBands\(swath\) \{/.test(src), "the legend is derived from the bands actually present");

/* ================= 3. drawing it ================= */
ok(/basemapId = "street", highlight = null, swath = null,/.test(src), "the map takes a swath");
ok(/L\.rectangle\(\[\[c\.south, c\.west\], \[c\.north, c\.east\]\], \{/.test(src), "drawn as real map polygons");
ok(/fillOpacity: 0\.34, interactive: false,/.test(src),
  "translucent and non-interactive — a rep needs the street names under it, and it must never swallow a tap meant for a door");
ok(/l\.bringToBack && l\.bringToBack\(\)/.test(src), "and it sits behind the pins, so weather never hides a door");
ok(/if \(swathRef\.current\) \{ map\.removeLayer\(swathRef\.current\); swathRef\.current = null; \}/.test(src),
  "the old swath is removed before a new one is drawn — no stacking layers as a rep moves between storms");

/* ================= 4. the circle stops lying ================= */
/* Build 140 note: with a swath drawn the circle stays unfilled for
   exactly the reason below — but when the circle is the ONLY
   geometry (radar not yet published, wind alert) it now takes a
   light fill, because an off-screen hairline reads as an unmarked
   map. The conditional preserves this build's decision where it
   applies. */
ok(/fill: !hasSwath, fillColor: "#B42318", fillOpacity: hasSwath \? 0 : 0\.07,/.test(src),
  "the watched-area circle stays unfilled whenever a real swath is on the map");
ok(/a solid circle over a swath would read as "hail\s*\n     fell across all of this", the misreading the swath exists to\s*\n     prevent\./.test(src),
  "with the reason: a filled circle over a swath asserts something about the weather that isn't true");

/* ================= 5. wiring ================= */
ok(/date: a\.occurred_on, kind: a\.kind,/.test(src), "the alert carries its day and peril into the map");
ok(/fetchRadarHail\(focus\.lat, focus\.lng, focus\.date, focus\.date, reach\)/.test(src),
  "which the map uses to fetch that day's detections");
ok(/if \(!focus \|\| !focus\.date \|\| focus\.kind === "wind"\) return undefined;/.test(src),
  "a wind alert draws no hail swath — there is no hail to draw");
ok(/const \[zoom, setZoom\] = useState\(\(\) => \(focus && focus\.date \? 12 : 17\)\);/.test(src),
  "arriving from a storm starts zoomed out, because a swath is miles across");
ok(/landing tight shows a\s*\n     rep one red square with no idea which way the storm ran/.test(src),
  "and the comment says what the wrong zoom actually costs");
/* The browser run found this: a guessed zoom cannot frame a storm
   whose size is unknown, so Leaflet computes the fit. */
ok(/map\.fitBounds\(bounds, \{ padding: \[28, 28\], maxZoom: 15 \}\);/.test(src),
  "the map fits itself to the swath rather than trusting a guessed zoom");
ok(/if \(fittedRef\.current !== swath && bounds\.isValid\(\)\) \{/.test(src),
  "once per swath only — re-fitting every render would yank the map back each time a rep panned to the next street");
ok(/A guessed zoom cannot work here: a swath is whatever size the\s*\n       storm was, from a couple of miles to sixty\./.test(src),
  "with the reason a fixed zoom can't work recorded");
ok(/data-testid="swath-legend"/.test(src), "there's a legend");
ok(/Radar estimate — approximate area, not a survey/.test(src),
  "which says plainly that this is an estimate");
ok(/Captioning spotter cells as radar —\s*\n                  or either as a survey — is how a claim gets picked\s*\n                  apart in front of an adjuster\./.test(src),
  "with the reason that caption exists (build 140 widened it to cover the spotter-cell caption)");
ok(/Couldn't load the hail area for this storm\. The pins and dispositions all still work\./.test(src),
  "and a failed swath fetch says so rather than silently drawing nothing");
ok(/setSwath\(null\); setSwathSource\(null\); setSwathErr\(false\);/.test(src),
  "state resets between storms, so one storm's footprint never lingers over another");

/* ================= behavioral: hailSwath ================= */
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
      south: gy * gridDeg, north: (gy + 1) * gridDeg, west: gx * gridDeg, east: (gx + 1) * gridDeg });
  });
  return [...cells.values()].sort((a, b) => a.sizeIn - b.sizeIn);
}
const P = (lat, lng, sizeIn) => ({ lat, lng, sizeIn });

ok(hailSwath([]).length === 0, "no detections is no swath");
ok(hailSwath(null).length === 0, "and a failed fetch doesn't throw");
ok(hailSwath([P(41.78, -88.15, 1.75)]).length === 1, "one detection is one cell");

/* Detections close together must MERGE, or a storm track renders as
   disconnected pinpricks instead of a band. */
const tight = hailSwath([P(41.781, -88.151, 1), P(41.782, -88.152, 1.5), P(41.783, -88.150, 1.25)]);
ok(tight.length === 1, "three detections within a mile collapse into one cell, not three specks");
ok(tight[0].sizeIn === 1.5, "carrying the WORST size in that cell, not the first or the average");
ok(tight[0].count === 3, "and how many detections backed it");

/* A track across the ground must produce adjacent cells. */
const track = hailSwath([
  P(41.70, -88.30, 1), P(41.73, -88.26, 1.25), P(41.76, -88.22, 1.75),
  P(41.79, -88.18, 2.5), P(41.82, -88.14, 1.75), P(41.85, -88.10, 1),
]);
ok(track.length >= 5, "a storm track produces a run of cells, not one blob: " + track.length);
ok(track[track.length - 1].sizeIn === 2.5, "with the biggest stones drawn last, so they stay visible on top");
ok(track[0].sizeIn <= track[track.length - 1].sizeIn, "ordering really is smallest-first");

/* Geometry has to be a real rectangle in the right place. */
const one = hailSwath([P(41.78, -88.15, 2)])[0];
ok(one.north > one.south && one.east > one.west, "each cell is a well-formed box");
ok(one.south <= 41.78 && one.north >= 41.78, "which contains the detection's latitude");
ok(one.west <= -88.15 && one.east >= -88.15, "and its longitude");
ok(Math.abs((one.north - one.south) - HAIL_GRID_DEG) < 1e-9, "sized to the grid");
/* Negative longitudes are the entire US — a floor() that rounded
   toward zero would put every western cell one box east of the hail. */
ok(one.west < 0 && one.east <= 0, "and negative longitudes bin correctly rather than drifting east");
const west = hailSwath([P(39.7, -104.99, 1.5)])[0];
ok(west.west <= -104.99 && west.east >= -104.99, "still true out in Denver");

/* Junk in, nothing out — never a phantom cell at the equator. */
ok(hailSwath([P(null, -88.15, 1), P(41.78, null, 1), P(41.78, -88.15, null), null]).length === 0,
  "detections missing a coordinate or a size are dropped, not binned at 0,0");
ok(hailSwath([P(41.78, -88.15, 1), P(null, null, null)]).length === 1,
  "and one bad detection doesn't discard the good ones alongside it");

/* ================= behavioral: bands ================= */
const HAIL_BANDS = [
  { min: 2.5, color: "#7F1D1D", label: '2.5"+' },
  { min: 1.75, color: "#B42318", label: '1.75"+' },
  { min: 1.25, color: "#D97706", label: '1.25"+' },
  { min: 1, color: "#F59E0B", label: '1"+' },
  { min: 0, color: "#FCD34D", label: 'under 1"' },
];
function hailBand(inches) {
  return HAIL_BANDS.find((b) => (inches ?? 0) >= b.min) || HAIL_BANDS[HAIL_BANDS.length - 1];
}
function swathBands(swath) {
  const present = new Set((swath || []).map((c) => hailBand(c.sizeIn).label));
  return HAIL_BANDS.filter((b) => present.has(b.label));
}
ok(hailBand(3).label === '2.5"+', "3 inch hail is the top band");
ok(hailBand(2.5).label === '2.5"+', "exactly 2.5 is too — the boundary belongs to the band it names");
ok(hailBand(2.49).label === '1.75"+', "and just under drops a band");
ok(hailBand(1).label === '1"+', "1 inch is the severe threshold band");
ok(hailBand(0.99).label === 'under 1"', "and just under it is the sub-severe band");
ok(hailBand(0).label === 'under 1"', "zero is still a band, not a crash");
ok(hailBand(null).label === 'under 1"', "and so is a missing size");

const legend = swathBands(track);
/* The track carries 1, 1.25, 1.75 and 2.5 inch cells — four bands.
   "under 1" is the one that must NOT appear. */
ok(legend.length === 4, "the legend keys only the bands actually on the map: " + legend.map((b) => b.label).join(","));
ok(legend[0].label === '2.5"+', "biggest first, the way the registry reads");
ok(!legend.some((b) => b.label === 'under 1"'), "a band with nothing in it is absent, not a dead colour swatch");
ok(swathBands([]).length === 0, "an empty swath has no legend at all");
ok(swathBands(null).length === 0, "and a missing swath doesn't throw");

if (fails) { console.log("\nbuild 137: " + fails + " FAILED"); process.exit(1); }
console.log("build 137 tests passed");
