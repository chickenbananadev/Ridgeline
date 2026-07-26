/* Build 24 — roof takeoff engine. The geometry has to be exactly right;
   a wrong slope factor silently under-orders every job. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };
const close = (a, b, tol) => Math.abs(a - b) < (tol == null ? 0.0001 : tol);
const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

/* --- slope factor: sqrt(144 + rise^2)/12 --- */
const slopeFactor = (rise) => Math.sqrt(144 + Math.abs(num(rise)) ** 2) / 12;
ok(close(slopeFactor(0), 1), "a flat roof has factor 1");
ok(close(slopeFactor(4), 1.054093), "4/12 = 1.054093, got " + slopeFactor(4));
ok(close(slopeFactor(6), 1.118034), "6/12 = 1.118034, got " + slopeFactor(6));
ok(close(slopeFactor(8), 1.201850), "8/12 = 1.201850, got " + slopeFactor(8));
ok(close(slopeFactor(9), 1.25), "9/12 = 1.25 exactly");
ok(close(slopeFactor(12), Math.SQRT2), "12/12 = root 2");
ok(close(slopeFactor(16), 5 / 3), "16/12 = 5/3 exactly");
/* the classic wrong answers */
ok(!close(slopeFactor(6), 1.5, 0.01), "6/12 is NOT 1.5 — the common guess");
ok(!close(slopeFactor(6), 1.1, 0.01), "6/12 is NOT a flat 10 percent");

/* --- hip and valley run diagonally: sqrt(2 + (rise/12)^2) --- */
const hvFactor = (rise) => Math.sqrt(2 + (Math.abs(num(rise)) / 12) ** 2);
ok(close(hvFactor(0), Math.SQRT2), "a flat hip is still the 45-degree diagonal");
ok(close(hvFactor(6), 1.5), "6/12 hip factor = 1.5 exactly, got " + hvFactor(6));
ok(close(hvFactor(12), Math.sqrt(3)), "12/12 hip factor = root 3");
ok(hvFactor(6) > slopeFactor(6), "a hip is longer than the same plan run of rake");

/* --- area: the whole point --- */
function area(facets) {
  return facets.reduce((a, f) => a + num(f.length) * num(f.width) * slopeFactor(f.pitch), 0);
}
// 40x30 footprint at 6/12 = 1200 plan, 1341.64 sloped
ok(close(area([{ length: 40, width: 30, pitch: 6 }]), 1341.6408, 0.01),
  "1200 sf plan at 6/12 is 1341.64 sf of roof");
// mixed pitch must be applied per facet, not averaged
const mixed = [{ length: 40, width: 15, pitch: 6 }, { length: 40, width: 15, pitch: 10 }];
const perFacet = area(mixed);
const averaged = 1200 * slopeFactor(8);
ok(!close(perFacet, averaged, 1), "mixed pitches are computed per facet, not from an average");
ok(close(perFacet, 600 * slopeFactor(6) + 600 * slopeFactor(10), 0.01), "each facet uses its own factor");

/* --- waste --- */
const withWaste = (sq, pct) => sq * (1 + pct / 100);
ok(close(withWaste(20, 10), 22), "10 percent waste on 20 squares is 22");
ok(close(withWaste(28.5, 15), 32.775), "15 percent on 28.5 is 32.775");
ok(close(withWaste(20, 0), 20), "zero waste changes nothing");

/* --- material rounding must go up, never down --- */
const bundles = (sq) => Math.ceil(sq * 3);
ok(bundles(22) === 66, "22 squares is 66 bundles");
ok(bundles(22.1) === 67, "a part square still needs a whole bundle");
ok(bundles(0.1) === 1, "a tiny roof still needs one bundle");
const sticks = (lf) => Math.ceil(lf / 10);
ok(sticks(100) === 10, "100 LF of drip edge is 10 sticks");
ok(sticks(101) === 11, "101 LF needs an eleventh stick");

/* --- step flashing: one piece per course --- */
const stepPieces = (lf, exposure) => Math.ceil((lf * 12) / exposure);
ok(stepPieces(20, 5.625) === 43, "20 LF at 5.625in exposure is 43 pieces, got " + stepPieces(20, 5.625));
ok(stepPieces(0, 5.625) === 0, "no wall, no step flashing");

/* --- source guarantees --- */
ok(src.includes("function slopeFactor"), "slope factor is computed, not tabulated");
ok(src.includes("Math.sqrt(144 + r * r) / 12"), "the exact identity is used");
ok(src.includes("function hipValleyFactor"), "hips and valleys use their own factor");
ok(src.includes("function computeTakeoff"), "the takeoff engine exists");
ok(src.includes("const WASTE_BANDS"), "waste is banded by complexity");
ok(src.includes("function TabTakeoff"), "the takeoff section exists");
ok(src.includes("Enter plan dimensions, not along-the-slope"),
  "the double-counting error is warned about");
ok(src.includes("counts the slope twice"), "and explained");
ok(src.includes("not an aerial survey"), "the tool is honest about what it is not");
ok(src.includes("carries more\n            weight with a carrier") || src.includes("carries more"),
  "an aerial report is acknowledged as stronger for a claim");
ok(src.includes("Steep and high charges apply to"), "access modifiers are surfaced");
ok(src.includes("pushToJob"), "the takeoff can populate the job measurements");

if (fails) { console.log("\nbuild 24: " + fails + " FAILED"); process.exit(1); }
console.log("build 24 tests passed");
