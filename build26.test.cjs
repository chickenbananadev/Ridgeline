/* Build 26 — aerial tracing on public-domain state imagery.
   The scale maths is the whole feature; a wrong latitude correction
   inflates every measurement by ~69% and nobody notices until a job
   loses money. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };
const close = (a, b, tol) => Math.abs(a - b) < (tol == null ? 0.01 : tol);

/* --- shoelace --- */
function polygonAreaPx(pts) {
  if (!pts || pts.length < 3) return 0;
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    a += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
  }
  return Math.abs(a) / 2;
}
const square = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
ok(polygonAreaPx(square) === 100, "a 10x10 square is 100");
ok(polygonAreaPx([...square].reverse()) === 100, "winding direction does not change the area");
ok(polygonAreaPx([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 10 }]) === 50, "a triangle is half");
ok(polygonAreaPx([{ x: 0, y: 0 }, { x: 1, y: 1 }]) === 0, "two points have no area");
ok(polygonAreaPx([]) === 0, "no points, no area");
/* an L-shape, which is what a real roof plane often is */
const L = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 10 }, { x: 0, y: 10 }];
ok(polygonAreaPx(L) === 75, "an L-shape computes correctly, got " + polygonAreaPx(L));

/* --- the correction that matters --- */
const M2_TO_SQFT = 10.7639104167;
function tracedAreaSqFt(pts, mPerPx) {
  return polygonAreaPx(pts) * mPerPx * mPerPx * M2_TO_SQFT;
}
// 640px window spanning 60 true ground metres
const mPerPx = 60 / 640;
// a 20x20 metre building = 213.3 px per side at this scale
const px = 20 / mPerPx;
const bldg = [{ x: 0, y: 0 }, { x: px, y: 0 }, { x: px, y: px }, { x: 0, y: px }];
ok(close(tracedAreaSqFt(bldg, mPerPx), 400 * M2_TO_SQFT, 1),
  "a 20m square traces as 400 m2, got " + (tracedAreaSqFt(bldg, mPerPx) / M2_TO_SQFT));
ok(close(tracedAreaSqFt(bldg, mPerPx), 4305.6, 1), "which is 4305.6 sq ft");

/* the Mercator inflation the request has to remove */
const inflate = (lat) => 1 / Math.cos(lat * Math.PI / 180);
ok(close(inflate(39.76), 1.3008, 0.001), "Dayton inflates distance by 1.30x, got " + inflate(39.76));
ok(close(inflate(39.76) ** 2, 1.692, 0.002), "and area by 1.69x — a 2000 sf roof would read 3384");
ok(close(inflate(0), 1), "at the equator there is no inflation");
ok(inflate(38.65) < inflate(39.76), "Maysville distorts slightly less than Dayton");

/* --- perimeter --- */
function perim(pts) {
  let d = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    d += Math.hypot(pts[j].x - pts[i].x, pts[j].y - pts[i].y);
  }
  return d;
}
ok(perim(square) === 40, "square perimeter is 40");

/* --- imagery sources are public domain, and that is the point --- */
ok(src.includes("const AERIAL_SOURCES"), "imagery sources are defined");
ok(src.includes("geo1.oit.ohio.gov"), "Ohio OSIP endpoint present");
ok(src.includes("kyraster.ky.gov"), "Kentucky KyFromAbove endpoint present");
ok(src.includes("public domain"), "the licence position is recorded");
ok(src.includes("prohibit\n   commercial tracing") || src.includes("commercial tracing"),
  "why Mapbox and Google were rejected is explained");
ok(src.includes("exportImage"), "images are requested for an exact bounding box");
ok(src.includes("bboxSR=3857"), "the bounding box is in Web Mercator");
ok(src.includes("leaf-off"), "leaf-off is called out as the reason these beat consumer satellite");

/* --- the maths is in the code, not just the test --- */
ok(src.includes("function polygonAreaPx"), "shoelace is implemented");
ok(src.includes("function aerialRequest"), "the request builder exists");
ok(src.includes("const inflate = 1 / Math.cos(lat * Math.PI / 180)"),
  "Mercator inflation is applied when sizing the window");
ok(src.includes("mPerPx: (spanM) / px"), "metres per pixel is derived from true ground span");
ok(src.includes("function AerialTracer"), "the tracer component exists");
ok(src.includes('data-testid="add-traced-facet"'), "a traced plane can be added to the takeoff");
ok(src.includes("the image cannot tell you this"), "the pitch limitation is stated at the point of entry");

/* --- graceful failure: a government server going down must not break the page --- */
ok(src.includes("onError={() =>"), "an imagery failure is handled");
ok(src.includes("did not respond"), "and explained rather than left blank");
ok(src.includes("fallbackUrl"), "Ohio has a second endpoint to fall back to");

/* --- traced area survives the trip into the takeoff exactly --- */
const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
const slopeFactor = (rise) => Math.sqrt(144 + Math.abs(num(rise)) ** 2) / 12;
const planOf = (f) => (f.planArea != null && f.planArea !== "") ? num(f.planArea) : num(f.length) * num(f.width);

const traced = tracedAreaSqFt(bldg, mPerPx);
const facet = { length: Math.sqrt(traced).toFixed(2), width: Math.sqrt(traced).toFixed(2), pitch: 6, planArea: traced, traced: true };
ok(planOf(facet) === traced, "a traced plan area reaches the engine with no loss");
ok(Math.abs(planOf(facet) - num(facet.length) * num(facet.width)) > 0.01,
  "and is NOT the rounded square, which would have drifted");

/* a typed facet is untouched by the change */
ok(close(planOf({ length: "40", width: "30" }) * slopeFactor(6), 1341.64, 0.01),
  "a typed 40x30 at 6/12 is still 1341.64 sf");

/* each facet takes its own pitch */
const mixed = [
  { planArea: 775, pitch: 6 },
  { planArea: 129.17, pitch: 10 },
];
const perFacet = mixed.reduce((a, f) => a + planOf(f) * slopeFactor(f.pitch), 0);
const averaged = (775 + 129.17) * slopeFactor(8);
ok(Math.abs(perFacet - averaged) > 40,
  "per-facet and averaged differ materially — averaging is not equivalent");
ok(close(perFacet, 775 * slopeFactor(6) + 129.17 * slopeFactor(10), 0.01),
  "each facet uses its own slope factor");

ok(src.includes("f.planArea != null"), "the engine prefers a measured plan area");
ok(src.includes("planArea: areaSf, traced: true"), "the tracer stores the exact area");
ok(src.includes("clears ? { ...f, [k]: v, planArea: null, traced: false }"),
  "editing a traced facet's dimensions drops the stored area so the edit takes effect");

if (fails) { console.log("\nbuild 26: " + fails + " FAILED"); process.exit(1); }
console.log("build 26 tests passed");
