/* Build 29 — tracing precision: magnification, snapping, drag.
   Imagery resolution was never the limit; finger accuracy was. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };
const close = (a, b, t) => Math.abs(a - b) < (t == null ? 0.01 : t);

/* --- angle snapping --- */
function snapToAngle(from, to, ref, steps, tol) {
  const dx = to.x - from.x, dy = to.y - from.y, len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ang = Math.atan2(dy, dx);
  let best = null, bd = (tol * Math.PI) / 180;
  for (const st of steps) {
    const t = ref + (st * Math.PI) / 180;
    const d = Math.abs(Math.atan2(Math.sin(ang - t), Math.cos(ang - t)));
    if (d < bd) { bd = d; best = t; }
  }
  if (best == null) return null;
  return { x: from.x + Math.cos(best) * len, y: from.y + Math.sin(best) * len };
}
const STEPS = [0, 45, 90, 135, 180, 225, 270, 315];
const O = { x: 0, y: 0 };
const at = (deg, len) => ({ x: Math.cos(deg * Math.PI / 180) * len, y: Math.sin(deg * Math.PI / 180) * len });
const angOf = (p) => (Math.atan2(p.y, p.x) * 180) / Math.PI;

let r = snapToAngle(O, at(88, 100), 0, STEPS, 12);
ok(r && close(angOf(r), 90, 0.01), "an 88 degree edge squares to 90");
ok(r && close(Math.hypot(r.x, r.y), 100, 0.001), "and keeps its length");
r = snapToAngle(O, at(-3, 80), 0, STEPS, 12);
ok(r && close(Math.abs(angOf(r)), 0, 0.01), "a nearly-horizontal edge flattens");
r = snapToAngle(O, at(43, 60), 0, STEPS, 12);
ok(r && close(angOf(r), 45, 0.01), "a 43 degree edge snaps to 45");
ok(snapToAngle(O, at(67, 100), 0, STEPS, 12) === null,
  "a genuinely diagonal 67 degree edge is left alone, not forced square");
ok(snapToAngle(O, at(20, 100), 0, STEPS, 12) === null, "20 degrees is outside tolerance too");
ok(snapToAngle(O, { x: 0.4, y: 0.2 }, 0, STEPS, 12) === null, "a zero-length drag does not snap");

/* snapping is relative to the previous edge, so a rotated building
   stays square to itself rather than to the screen */
const ref30 = (30 * Math.PI) / 180;
r = snapToAngle(O, at(118, 100), ref30, STEPS, 12);
ok(r && close(angOf(r), 120, 0.01), "on a building rotated 30 degrees, square means 120, got " + (r ? angOf(r).toFixed(1) : "null"));

/* --- vertex snapping --- */
function snapToVertex(pt, vs, tol) {
  let best = null, bd = tol;
  for (const v of vs) { const d = Math.hypot(v.x - pt.x, v.y - pt.y); if (d < bd) { bd = d; best = v; } }
  return best ? { x: best.x, y: best.y } : null;
}
const verts = [{ x: 100, y: 100 }, { x: 200, y: 100 }];
ok(snapToVertex({ x: 104, y: 97 }, verts, 14).x === 100, "a near miss snaps to the corner");
ok(snapToVertex({ x: 150, y: 150 }, verts, 14) === null, "a distant point does not");
ok(snapToVertex({ x: 0, y: 0 }, [], 14) === null, "no vertices, no snap");
/* the nearest wins when two are in range */
ok(snapToVertex({ x: 190, y: 100 }, verts, 40).x === 200, "the nearest vertex wins");

/* --- the precision case for magnification --- */
const E = 156543.03392804097;
const mpp = (lat, z) => (E * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, z);
const inPerScreenPx = (mag) => (mpp(39.29, 20) * 39.37) / (360 / (512 / mag));
const tapErrFt = (mag) => (inPerScreenPx(mag) * 8) / 12;
ok(tapErrFt(1) > 4, "at 1x a tap is over 4 ft out, got " + tapErrFt(1).toFixed(2));
ok(tapErrFt(4) < 1.2, "at 4x it is around a foot, got " + tapErrFt(4).toFixed(2));
ok(tapErrFt(4) < tapErrFt(1) / 3.5, "4x is roughly a fourfold improvement");

/* --- wired up --- */
ok(src.includes("function snapToVertex"), "vertex snapping exists");
ok(src.includes("function snapToAngle"), "angle snapping exists");
ok(src.includes("function placePoint"), "placement combines both");
ok(src.includes("const v = snapToVertex(raw, all, tolPx);\n  if (v) return v;"),
  "a vertex snap takes precedence over an angle snap");
ok(src.includes("const [mag, setMag] = useState(2)"), "magnification defaults to 2x");
ok(src.includes("[1, 2, 4].map"), "1x, 2x and 4x are offered");
ok(src.includes("const grab ="), "points can be grabbed");
ok(src.includes("const dragMove ="), "and dragged");
ok(src.includes("Drag any point to adjust it"), "dragging is discoverable");
ok(src.includes("Snap edges square"), "snapping can be turned off");
ok(src.includes("const edgeLen ="), "edge lengths are shown for sanity-checking");
ok(src.includes('vectorEffect="non-scaling-stroke"'), "the outline stays readable when magnified");
ok(src.includes("tapTolPx = 14 / mag"), "snap tolerance is in screen terms, not map terms");
ok(src.includes("makes the target bigger"), "the reasoning is stated to the user");

if (fails) { console.log("\nbuild 29: " + fails + " FAILED"); process.exit(1); }
console.log("build 29 tests passed");
