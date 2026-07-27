/* Build 38 — Good/Better/Best estimate tiers, customer-toggleable
   upgrades, and the donut chart component. */
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
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");

function check(name, cond) {
  if (!cond) { realErr("FAILED: " + name); process.exit(1); }
}

/* ---- data model: backward compatibility is the whole point ---- */
check("mkEstimate defaults tiers to an empty array (no tiers = old flat behavior)",
  /tiers: \[\],(\s*\/\/[^\n]*)?\s*\/\/ \[\{ id, name, items/.test(src) || /tiers: \[\],/.test(src));
check("mkEstimate defaults selectedTier to null", /selectedTier: null,/.test(src));
check("mkEstimate defaults upgrades to an empty array", /upgrades: \[\],/.test(src));
check("applyEstimateSelection falls back to est.items when no tier matches (old jobs untouched)",
  /const base = tier \? tier\.items : est\.items;/.test(src));
check("estimateTotal is unchanged -- every existing caller (financials, PDF, portal, commission) keeps working",
  /function estimateTotal\(est\) \{\s*\n\s*return est\.items\.reduce/.test(src));

/* ---- rep-side UI exists and is wired correctly ---- */
check("LineItemEditor is a shared, hoisted component (not redefined per-tier)",
  /function LineItemEditor\(\{ items, setItems, locked/.test(src));
check("Packages card offers a Good/Better/Best toggle, off by default", /Offer this as Good \/ Better \/ Best packages/.test(src));
check("enabling tiers seeds Better from the current flat items (existing work isn't lost)",
  /items: est\.items\.map\(\(it\) => \(\{ \.\.\.it, id: uid\("e"\) \}\)\)/.test(src));
check("Optional upgrades card explains they're customer-toggleable and update the total",
  /the total updates as they choose/.test(src));
check("recompute merges a patch AND re-flattens items in the same update (no stale total)",
  /const merged = \{ \.\.\.est, \.\.\.patch \};\s*\n\s*setEst\(\{ \.\.\.patch, items: applyEstimateSelection\(merged\) \}\);/.test(src));

/* ---- DonutChart exists and is a real, hoisted, reusable component ---- */
check("DonutChart component exists", /function DonutChart\(\{ data, size = 132/.test(src));
check("DonutChart uses conic-gradient (no charting library dependency)", /conic-gradient\(\$\{stops\.join/.test(src));
check("a shared DONUT_PALETTE exists so charts look consistent across screens", /const DONUT_PALETTE = \[/.test(src));
check("donut wired into revenue-by-source", /centerLabel="won revenue"/.test(src));
check("donut wired into job financials cost mix", /Where this job's money goes/.test(src));

/* ---- render: the actual interactive flow, not just source patterns ---- */
const App = require("./app.test.cjs").default;
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
function setCheckbox(labelStartsWith) {
  const all = [...document.querySelectorAll("div")];
  const row = all.filter((e) => e.textContent && e.textContent.includes(labelStartsWith))
    .sort((a, b) => a.textContent.length - b.textContent.length)[0];
  if (!row) return false;
  const cb = row.querySelector('input[type="checkbox"]') || (row.parentElement && row.parentElement.querySelector('input[type="checkbox"]'));
  if (!cb) return false;
  act(() => { cb.click(); });
  return true;
}

const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });

clickText("Sign in"); clickText("Sign in"); clickText("Jacob Henderson");
clickText("Jobs");
clickText("Omkar Hirekhan"); // estimate status "Sent" -- editable, unlike Roger Perry ("Signed")
clickText("Estimate");

check("Estimate tab reached (Pricing card visible)", document.body.textContent.includes("Pricing"));
const totalBefore = (document.body.textContent.match(/Total investment\$[\d,.]+/) || [""])[0];
check("a starting total is shown before any tier/upgrade interaction", /Total investment\$[\d,.]+/.test(document.body.textContent));

check("Packages checkbox found and toggled on", (() => {
  const cb = [...document.querySelectorAll('input[type="checkbox"]')]
    .find((c) => c.parentElement && c.parentElement.textContent.includes("Good / Better / Best packages"));
  if (!cb || cb.disabled) return false;
  act(() => { cb.click(); });
  return true;
})());

check("three tier tabs (Good/Better/Best) appear after enabling", ["Good", "Better", "Best"].every((n) => document.body.textContent.includes(n)));
check("Better is marked as what the customer currently sees (seeded as the active tier)",
  document.body.textContent.includes("Customer sees this"));

// Switch to the Good tier tab (starts empty) — this only changes which
// tier the rep is viewing/editing, by design; it must NOT silently
// change what the customer sees until explicitly made active.
check("switched to Good tier tab", clickText("Good"));
check("viewing a non-active tier does NOT change the customer-facing total (by design)",
  document.body.textContent.includes(totalBefore));
// Now actually make Good the active tier and confirm the total DOES change.
check("made Good the active tier", clickText("Show customer this tier instead"));
check("making Good active changes the total (Good starts empty, so it should drop)",
  !document.body.textContent.includes(totalBefore));

console.error = realErr;
const real = errs.filter((e) => !/not wrapped in act/.test(e));
if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
console.log("build 38 tests passed");
