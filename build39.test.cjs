/* Build 39 — regression test for the exact bug Jacob hit: opening the
   Estimate tab for a REAL, pre-existing job crashed and got stuck,
   because job.estimate for any job created before this session's
   tiers/upgrades work has neither field at all (undefined, not []).
   mkEstimate()'s defaults only apply to brand-new estimates -- every
   seed/demo job in the normal test suite is built fresh via the
   CURRENT mkEstimate() every time, so it always has the new fields
   and could never have caught this. This test uses a separately
   bundled copy with those fields deliberately stripped out of
   mkEstimate's defaults, simulating exactly what a real stored job
   looks like, to test against data shaped like production reality
   rather than data shaped like the current source file. */
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>",
  { url: "https://example.com/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
global.Blob = dom.window.Blob; global.URL = dom.window.URL; global.FileReader = dom.window.FileReader;
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

function check(name, cond) {
  if (!cond) { realErr("FAILED: " + name); process.exit(1); }
}

/* ---- static: confirm the fix is actually in the real source, not just this scratch copy ---- */
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
check("TabEstimate normalizes tiers/upgrades to arrays before anything reads them",
  /const est = \{ \.\.\.job\.estimate, tiers: job\.estimate\.tiers \|\| \[\], upgrades: job\.estimate\.upgrades \|\| \[\] \};/.test(src));

/* ---- render: the actual crash scenario, against data shaped like production ----
   Self-contained: builds its own "legacy" bundle at runtime (a copy of
   the real source with tiers/upgrades/selectedTier stripped out of
   mkEstimate's defaults, simulating exactly what a job created before
   this session's work looks like when loaded from the real database)
   rather than depending on a scratch file built by hand earlier. */
const { execSync } = require("child_process");
const legacySrcPath = path.join(__dirname, "_build39_legacy_src.jsx");
const legacyBundlePath = path.join(__dirname, "_build39_legacy_bundle.cjs");
const defaultsBlock = `    tiers: [],            // [{ id, name, items: [...same shape as items] }]
    selectedTier: null,   // id of the active tier, or null = flat estimate (old behavior)
    upgrades: [],         // [{ id, desc, price, cost, selected }]
`;
check("mkEstimate's tiers/selectedTier/upgrades defaults block found (source drifted?)", src.includes(defaultsBlock));
fs.writeFileSync(legacySrcPath, src.replace(defaultsBlock, ""));
execSync(
  `npx esbuild "${legacySrcPath}" --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom --external:lucide-react --format=cjs --outfile="${legacyBundlePath}"`,
  { cwd: __dirname, stdio: "pipe" },
);
const App = require(legacyBundlePath).default;

function clickText(txt) {
  const els = [...document.querySelectorAll("button, a, div, span")];
  const matches = els.filter((e) => e.textContent && e.textContent.trim().startsWith(txt)
    && (e.tagName === "BUTTON" || e.tagName === "A" || e.onclick));
  matches.sort((a, b) => a.textContent.length - b.textContent.length);
  const btn = matches[0] || els.filter((e) => e.tagName === "BUTTON").find((e) => e.textContent.includes(txt));
  if (!btn) return false;
  act(() => { btn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  return true;
}

const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });

clickText("Sign in"); clickText("Sign in"); clickText("Jacob Henderson");
clickText("Jobs");
clickText("Omkar Hirekhan");
check("Estimate tab opens without crashing for a job whose estimate has no tiers/upgrades fields at all",
  clickText("Estimate"));
check("the Pricing card actually rendered (not stuck on a blank/crashed screen)",
  document.body.textContent.includes("Pricing"));
check("the Packages card rendered too (tiersOn correctly computed from a missing field, not thrown)",
  document.body.textContent.includes("Good / Better / Best"));
check("Optional upgrades card rendered (upgrades.length read safely from an undefined field)",
  document.body.textContent.includes("Optional upgrades"));

console.error = realErr;
const real = errs.filter((e) => !/not wrapped in act/.test(e));
try { fs.unlinkSync(legacySrcPath); } catch {}
try { fs.unlinkSync(legacyBundlePath); } catch {}
if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
console.log("build 39 tests passed");
