/* Build 27 — aerial tracing on standard XYZ tiles. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };
const close = (a, b, tol) => Math.abs(a - b) < (tol == null ? 0.01 : tol);

const TILE = 256, E = 156543.03392804097;
function lonLatToPixel(lon, lat, z) {
  const w = TILE * Math.pow(2, z);
  const x = ((lon + 180) / 360) * w;
  const r = (lat * Math.PI) / 180;
  const y = (0.5 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / (2 * Math.PI)) * w;
  return { x, y };
}
const mpp = (lat, z) => (E * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, z);
function tileGrid(lon, lat, z, size) {
  const c = lonLatToPixel(lon, lat, z);
  const ox = c.x - size / 2, oy = c.y - size / 2;
  const fx = Math.floor(ox / TILE), fy = Math.floor(oy / TILE);
  const lx = Math.floor((ox + size) / TILE), ly = Math.floor((oy + size) / TILE);
  const out = [];
  for (let tx = fx; tx <= lx; tx++) for (let ty = fy; ty <= ly; ty++)
    out.push({ x: tx, y: ty, left: tx * TILE - ox, top: ty * TILE - oy });
  return out;
}

/* --- projection anchors --- */
ok(close(lonLatToPixel(0, 0, 0).x, 128) && close(lonLatToPixel(0, 0, 0).y, 128),
  "the origin sits at the centre of the single zoom-0 tile");
ok(close(lonLatToPixel(-180, 0, 0).x, 0), "the antimeridian is pixel 0");
ok(lonLatToPixel(0, 60, 2).y < lonLatToPixel(0, 0, 2).y, "north is up");
ok(lonLatToPixel(10, 0, 2).x > lonLatToPixel(0, 0, 2).x, "east is right");

/* --- resolution --- */
ok(close(mpp(0, 0), E, 0.001), "zoom 0 at the equator is the full constant");
ok(close(mpp(0, 1), E / 2, 0.001), "each zoom halves the resolution");
ok(close(mpp(39.76, 20), 0.1147, 0.0005), "Dayton at z20 is ~11.5cm per pixel, got " + mpp(39.76, 20));
ok(mpp(39.76, 20) * 39.37 < 5, "which is under 5 inches per pixel — enough to trace a roof");
ok(mpp(60, 20) < mpp(0, 20), "resolution improves with latitude, as Mercator dictates");

/* --- the grid tiles seamlessly --- */
const g = tileGrid(-84.523, 39.2896, 20, 512);
ok(g.length === 9, "a 512px view needs 9 tiles at 256px, got " + g.length);
const lefts = [...new Set(g.map((t) => Math.round(t.left)))].sort((a, b) => a - b);
ok(lefts.length === 3, "three distinct columns");
ok(close(lefts[1] - lefts[0], 256, 0.6) && close(lefts[2] - lefts[1], 256, 0.6),
  "columns step by exactly one tile — no seams or overlaps");
ok(lefts[0] <= 0, "the first column starts at or before the left edge");
ok(lefts[2] + 256 >= 512, "the last column reaches past the right edge");

/* --- a traced plane comes back exactly --- */
const M2_TO_SQFT = 10.7639104167;
function polygonAreaPx(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) { const j = (i + 1) % pts.length; a += pts[i].x * pts[j].y - pts[j].x * pts[i].y; }
  return Math.abs(a) / 2;
}
const lat = 39.2896, z = 20;
const m = mpp(lat, z), ftPerPx = m * 3.28084;
const w = 40 / ftPerPx, h = 30 / ftPerPx;
const plane = [{x:0,y:0},{x:w,y:0},{x:w,y:h},{x:0,y:h}];
const traced = polygonAreaPx(plane) * m * m * M2_TO_SQFT;
ok(close(traced, 1200, 0.01), "a 40x30 ft plane traces back as 1200 sq ft, got " + traced.toFixed(3));

/* zoom must not change the answer */
const z2 = 19, m2 = mpp(lat, z2), fp2 = m2 * 3.28084;
const plane2 = [{x:0,y:0},{x:40/fp2,y:0},{x:40/fp2,y:30/fp2},{x:0,y:30/fp2}];
ok(close(polygonAreaPx(plane2) * m2 * m2 * M2_TO_SQFT, 1200, 0.01),
  "the same plane at a different zoom gives the same area");

/* latitude must not be forgotten */
const wrong = polygonAreaPx(plane) * Math.pow(E / Math.pow(2, z), 2) * M2_TO_SQFT;
ok(wrong > traced * 1.6, "ignoring latitude would inflate the area by over 60 percent");

/* --- source guarantees --- */
ok(src.includes("const TILE_SOURCES"), "tile sources defined");
ok(src.includes("server.arcgisonline.com/arcgis/rest/services/World_Imagery"), "Esri World Imagery is wired");
ok(src.includes("basemap.nationalmap.gov"), "USGS is offered as a fallback source");
ok(src.includes("function lonLatToPixel"), "projection helper exists");
ok(src.includes("function metresPerPixel"), "resolution helper exists");
ok(src.includes("function tileGrid"), "the grid builder exists");
ok(src.includes("no API key"), "the licensing position is recorded");
ok(src.includes("const pan ="), "the view can be nudged when the roof sits off-centre");
ok(src.includes('data-testid="locate-roof"'), "the locate control is reachable");
ok(src.includes('data-testid="add-traced-facet"'), "a traced plane can be added");
ok(src.includes("no overhead image can tell you this"), "the pitch limit is stated at the point of entry");
ok(src.includes("Some tiles did not load"), "missing tiles are explained and a fallback offered");
ok(!src.includes("ImageServer/exportImage"), "the fragile per-state exportImage endpoints are gone");
ok(!src.includes("const AERIAL_SOURCES"), "the superseded source map is gone");
ok(!src.includes("function aerialRequest"), "the superseded request builder is gone");

/* --- reachable without hunting --- */
ok(src.includes('function RoofMeasure'), 'a standalone measuring screen exists');
ok(src.includes('nav === "roofmeasure"'), 'it has its own route');
const salesIdx = src.indexOf('["Sales", [');
const measureIdx = src.indexOf('"roofmeasure", Layers');
const prodIdx = src.indexOf('["Production", [');
ok(salesIdx > 0 && measureIdx > salesIdx && measureIdx < prodIdx,
  'the menu entry sits in Sales, which is open by default');
ok(src.includes('Which property?'), 'the screen can run with or without a job');
ok(src.includes('Planes traced'), 'traced planes accumulate on the screen');

if (fails) { console.log("\nbuild 27: " + fails + " FAILED"); process.exit(1); }
console.log("build 27 tests passed");
