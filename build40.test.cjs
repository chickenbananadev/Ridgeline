/* Build 40 — regression test for "Estimate template isn't working."
   Real bug: applyTemplate wrote directly to est.items regardless of
   tier state. With Good/Better/Best packages on, ANY subsequent
   recompute() (toggling an upgrade, switching tiers) rebuilds
   est.items from tiers+upgrades from scratch, silently discarding
   whatever the template had just added a moment earlier — so applying
   a template looked like it worked, then vanished the instant
   anything else touched the estimate. */
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

check("applyTemplate routes through setTierItems when packages are on, not a direct est.items write",
  /if \(tiersOn\) \{\s*\n\s*setTierItems\(tierTab, \[\.\.\.activeTierItems\(\), \.\.\.newItems\]\);/.test(src));
check("saveTemplate reads from the tier-aware activeTierItems(), not always the flattened est.items",
  /const items = activeTierItems\(\);/.test(src));
check("the Save button's disabled check matches what saveTemplate actually saves",
  /disabled=\{!tplName\.trim\(\) \|\| activeTierItems\(\)\.length === 0\}/.test(src));

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
function setInputValue(el, value) {
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  act(() => { nativeSetter.call(el, value); el.dispatchEvent(new dom.window.Event("input", { bubbles: true })); });
}
function totalNow() { return (document.body.textContent.match(/Total investment\$[\d,.]+/) || [])[0]; }

const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });
clickText("Sign in"); clickText("Sign in"); clickText("Jacob Henderson");
clickText("Jobs");
clickText("Omkar Hirekhan"); // estimate status "Sent" -- editable
clickText("Estimate");

// Save a template from the flat estimate.
clickText("Open");
const nameInput = [...document.querySelectorAll("input")].find((i) => i.placeholder === "Full replacement — architectural");
check("template-name input found", !!nameInput);
setInputValue(nameInput, "Regression Test Package");
const saveBtn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Save");
check("save button enabled with a name and existing items", saveBtn && !saveBtn.disabled);
act(() => { saveBtn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });

// Turn on Good/Better/Best packages.
const cb = [...document.querySelectorAll('input[type="checkbox"]')]
  .find((c) => c.parentElement && c.parentElement.textContent.includes("Good / Better / Best packages"));
check("packages checkbox found and enabled", !!cb && !cb.disabled);
act(() => { cb.click(); });

// Apply the template while packages are on.
clickText("Open");
const totalBeforeApply = totalNow();
const addBtn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Add");
check("an Add (apply template) button is present", !!addBtn);
act(() => { addBtn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
const totalAfterApply = totalNow();
check("applying the template actually changed the total", totalAfterApply !== totalBeforeApply);

// The actual regression: trigger an unrelated recompute (add an
// upgrade option) and confirm the applied template SURVIVES, instead
// of silently reverting to what it was before the template was applied.
clickText("Add upgrade option");
const totalAfterUnrelatedChange = totalNow();
check("the template's items survive an unrelated recompute (this is the bug that was reported)",
  totalAfterUnrelatedChange === totalAfterApply);
check("and specifically did NOT silently revert to the pre-template total",
  totalAfterUnrelatedChange !== totalBeforeApply);

console.error = realErr;
const real = errs.filter((e) => !/not wrapped in act/.test(e));
if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
console.log("build 40 tests passed");
