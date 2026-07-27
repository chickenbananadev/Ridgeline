/* Build 31 — public marketing landing page. */
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>",
  { url: "https://example.com/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
global.Blob = dom.window.Blob; global.URL = dom.window.URL;
global.FileReader = dom.window.FileReader;
window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
global.fetch = () => Promise.reject(new Error("no network in tests"));

const errs = [];
const realErr = console.error;
console.error = (...a) => { errs.push(a.join(" ")); };

const React = require("react");
const { act } = require("react");
const { createRoot } = require("react-dom/client");
global.IS_REACT_ACT_ENVIRONMENT = true;

const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");

function check(name, cond) {
  if (!cond) { realErr("FAILED: " + name); process.exit(1); }
}

/* ---- static ---- */
check("Marketing component exists", /function Marketing\(\{ onSignIn, onStartTrial \}\)/.test(src));
check("entry state defaults to marketing", /const \[entry, setEntry\] = useState\("marketing"\);/.test(src));
check("pre-auth gate renders Marketing when entry is marketing",
  /if \(entry === "marketing"\) \{[\s\S]*?<Marketing/.test(src));
check("Sign in on marketing routes to login mode",
  /onSignIn=\{\(\) => \{ setAuthMode\("login"\); setEntry\("auth"\); \}\}/.test(src));
check("Start trial on marketing routes to signup mode and captures the selected plan",
  /onStartTrial=\{\(plan\) => \{ setSelectedPlan\(plan \|\| "per_seat"\); setAuthMode\("signup"\); setEntry\("auth"\); \}\}/.test(src));
check("Login can navigate back to marketing", /onBackToMarketing && \(/.test(src));
check("marketing headline present", /One Stride Ahead/.test(src));
check("brand slogan present", /PRODUCT\.tagline/.test(src) && !/Roofing, start to paid\./.test(src));
check("all six STRIDE values present", ["Simplicity", "Transparency", "Responsibility", "Innovation", "Dependability", "Empowerment"]
  .every((w) => src.includes(w)));
check("pricing shows the real base and unlimited prices", /\$\{PRODUCT\.basePrice\.toFixed\(2\)\}/.test(src) && /\$\{PRODUCT\.unlimitedPrice\.toFixed\(2\)\}/.test(src));
check("trial terms state card is required", /7-day free trial, card required/.test(src));
check("uses real screenshots, not placeholder images", [
  "/marketing/shot-dashboard.png", "/marketing/shot-pipeline.png", "/marketing/shot-job-detail.png",
  "/marketing/shot-supplement-check.png", "/marketing/shot-dispatch.png", "/marketing/shot-performance.png",
].every((p) => src.includes(p)));

for (const f of ["shot-dashboard.png", "shot-pipeline.png", "shot-job-detail.png",
  "shot-supplement-check.png", "shot-dispatch.png", "shot-performance.png"]) {
  const p = path.join(__dirname, "public/marketing", f);
  check(f + " exists", fs.existsSync(p));
  check(f + " is a real image, not a stub", fs.statSync(p).size > 20000);
}

/* ---- render ---- */
const App = require("./app.test.cjs").default;
function clickText(txt) {
  const els = [...document.querySelectorAll("button, a, div, span")];
  /* Prefer an actual <button>/<a> element first — a wrapping container
     div can spuriously report a truthy .onclick in this jsdom/React 18
     setup (its root container does too), which would otherwise let a
     giant ancestor div outrank the real button whenever the target
     text happens to be the first thing rendered inside it. */
  const strict = els.find((e) => (e.tagName === "BUTTON" || e.tagName === "A")
    && e.textContent && e.textContent.trim().startsWith(txt));
  const loose = els.find((e) => e.textContent && e.textContent.trim().startsWith(txt)
    && (e.tagName === "BUTTON" || e.onclick));
  const fallback = els.filter((e) => e.tagName === "BUTTON").find((e) => e.textContent.includes(txt));
  const btn = strict || loose || fallback;
  if (!btn) return false;
  act(() => { btn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  return true;
}

const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });

check("marketing page is the first thing shown", /One Stride Ahead/.test(document.body.textContent));
check("marketing page never shows a tenant name", !/Supreme Building Group/.test(document.body.textContent));
check("pricing shown on the marketing page", /49\.99/.test(document.body.textContent));
check("STRIDE section rendered", /The STRIDE standard/.test(document.body.textContent));

check("Start free trial routes into signup mode", clickText("Start your free trial"));
check("signup form reached from marketing CTA", /Start free trial/.test(document.body.textContent)
  || /Start your.*trial/.test(document.body.textContent));
check("back-to-marketing link present after navigating in", clickText("Back to roofstride.com"));
check("back link returns to the marketing page", /One Stride Ahead/.test(document.body.textContent));

console.error = realErr;
const real = errs.filter((e) => !/not wrapped in act/.test(e));
if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
console.log("build 31 tests passed");
