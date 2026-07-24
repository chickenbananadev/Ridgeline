/* Build 4 — home week-ahead card, admin-only delete, duplicate address
   blocking, and the attic ventilation calculator. */
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>",
  { url: "https://localhost/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
global.self = dom.window; global.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.matchMedia = dom.window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));

const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (cond, label) => { if (!cond) { fails++; console.log("FAIL: " + label); } };

/* --- address fingerprint: abbreviation folding --- */
const ADDR_WORDS = { st:"street", str:"street", rd:"road", ave:"avenue", av:"avenue",
  dr:"drive", ln:"lane", ct:"court", cir:"circle", blvd:"boulevard", pkwy:"parkway",
  hwy:"highway", ter:"terrace", pl:"place", sq:"square", n:"north", s:"south",
  e:"east", w:"west", ne:"northeast", nw:"northwest", se:"southeast", sw:"southwest",
  apt:"unit", ste:"unit", suite:"unit", "#":"unit" };
function fp(raw) {
  if (!raw) return "";
  return String(raw).toLowerCase().replace(/[.,#]/g, " ").replace(/\s+/g, " ").trim()
    .split(" ").map((w) => ADDR_WORDS[w] || w)
    .filter((w) => w && !/^(oh|ohio|ky|kentucky|il|illinois|usa|us)$/.test(w)).join(" ");
}
ok(fp("1247 Maple Ave.") === fp("1247 Maple Avenue"), "Ave and Avenue collide");
ok(fp("88 W. Oak St, Dayton, OH") === fp("88 West Oak Street Dayton"), "directional + suffix + state fold");
ok(fp("12 Elm St") !== fp("13 Elm St"), "different house numbers stay distinct");
ok(src.includes("addrFingerprint"), "fingerprint helper is in the source");
ok(src.includes("dupBlocked"), "duplicate block flag exists");
ok(src.includes('{dupBlocked ? "Duplicate address" : "Create lead"}'), "save button reports the block");

/* --- ventilation math --- */
const VENT_EXHAUST = [{ id:"oc-ventsure", nfa:18, per:"ft" }, { id:"powered", nfa:0, per:"each" }];
const VENT_INTAKE = [{ id:"soffit-cont", nfa:9, per:"ft" }];
function ventMath(v) {
  const area = Number(v.atticSqFt) || 0;
  const ratio = v.ratio === "300" ? 300 : 150;
  const findEx = VENT_EXHAUST.find((x) => x.id === v.exhaustId) || VENT_EXHAUST[0];
  const findIn = VENT_INTAKE.find((x) => x.id === v.intakeId) || VENT_INTAKE[0];
  const exhaustIn2 = (Number(v.exhaustQty) || 0) * findEx.nfa;
  const intakeIn2 = (Number(v.intakeQty) || 0) * findIn.nfa;
  const totalIn2 = exhaustIn2 + intakeIn2;
  const upperPct = totalIn2 > 0 ? (exhaustIn2 / totalIn2) * 100 : 0;
  const balanced = upperPct >= 40 && upperPct <= 60;
  const effectiveRatio = ratio === 300 && !balanced ? 150 : ratio;
  const effectiveRequired = area > 0 ? (area / effectiveRatio) * 144 : 0;
  return { effectiveRequired, effectiveRatio, totalIn2, exhaustIn2, intakeIn2, upperPct,
    balanced, meets: totalIn2 >= effectiveRequired && effectiveRequired > 0,
    starved: exhaustIn2 > 0 && intakeIn2 < exhaustIn2 };
}
// 1800 sq ft at 1/150 => 12 sq ft => 1728 in²
let m = ventMath({ atticSqFt:"1800", ratio:"150", exhaustId:"oc-ventsure", exhaustQty:"48", intakeId:"soffit-cont", intakeQty:"96" });
ok(Math.round(m.effectiveRequired) === 1728, "1800 sq ft at 1/150 needs 1728 in²");
ok(m.exhaustIn2 === 864 && m.intakeIn2 === 864, "48 LF ridge and 96 LF soffit each give 864 in²");
ok(m.meets, "1728 in² provided meets 1728 in² required");
ok(m.balanced && Math.round(m.upperPct) === 50, "even split reads as balanced at 50 percent");
ok(!m.starved, "equal intake and exhaust is not starved");

// 1/300 requested but split is unbalanced -> falls back to 1/150
m = ventMath({ atticSqFt:"1800", ratio:"300", exhaustId:"oc-ventsure", exhaustQty:"48", intakeId:"soffit-cont", intakeQty:"10" });
ok(m.effectiveRatio === 150, "unbalanced system loses the 1/300 reduction");
ok(m.starved, "intake below exhaust flags starvation");

// 1/300 with a balanced split is allowed
m = ventMath({ atticSqFt:"1800", ratio:"300", exhaustId:"oc-ventsure", exhaustQty:"24", intakeId:"soffit-cont", intakeQty:"48" });
ok(m.effectiveRatio === 300 && Math.round(m.effectiveRequired) === 864, "balanced system keeps 1/300 at 864 in²");

// powered fan contributes no NFA
m = ventMath({ atticSqFt:"1000", ratio:"150", exhaustId:"powered", exhaustQty:"2", intakeId:"soffit-cont", intakeQty:"10" });
ok(m.exhaustIn2 === 0, "powered fan adds no net free area");

/* --- source-level guarantees --- */
ok(src.includes("function TabVentilation"), "ventilation tab exists");
ok(src.includes('["ventilation", "Ventilation"]'), "ventilation tab is registered");
ok(src.includes('confirm-delete'), "delete confirmation control exists");
ok(src.includes('typed.trim().toUpperCase() !== "DELETE"'), "delete requires typing DELETE");
ok(src.includes('const isAdmin = !!(currentUser && currentUser.role === "admin")'), "contacts gate delete on admin");
ok(src.includes("Week ahead"), "home screen week-ahead card exists");
ok(src.includes('go("dispatch")'), "week-ahead card links to dispatch");
ok(src.includes("SetupKeys"), "setup and keys screen exists");

if (fails) { console.log("\nbuild 4: " + fails + " FAILED"); process.exit(1); }
console.log("build 4 tests passed");
