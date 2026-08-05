/* Build 52 — money inputs in accounting format.

   Every field that holds dollars renders "$1,234.56" when it isn't being
   typed in. The two things that can silently go wrong:

     1. formatting on keystroke instead of on blur, which makes a field
        impossible to type into ("1" becomes "$1.00", so "12" is out of
        reach);
     2. parsing a value that already carries "$" or "," — parseFloat stops
        at the dollar sign, so a formatted figure becomes a silent zero.
*/
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/function MoneyInput\(\{ value, onChange, disabled, style, placeholder = "\$0\.00", \.\.\.rest \}\)/.test(src),
  "MoneyInput exists");
ok(/const moneyNum = \(v\) => num\(String\(v == null \? "" : v\)\.replace\(\/\[\^0-9\.-\]\/g, ""\)\);/.test(src),
  "moneyNum strips currency punctuation before parsing");
ok(/const shown = editing \? raw : \(blank \? "" : money\(moneyNum\(value\)\)\);/.test(src),
  "formatting is suppressed while the field is being edited");
ok(/onBlur=\{\(\) => \{\s*setEditing\(false\);/.test(src), "the value settles on blur");
ok(/fontVariantNumeric: "tabular-nums"/.test(src), "figures are tabular so columns line up");

/* No money field should still be a bare input. Every remaining
   inputMode="decimal" in the file must be a quantity or a percentage —
   a dollar sign on "27 squares" would be worse than none. */
const moneyish = /(price|cost|amount|amt|deposit|deductible|rcv|acv|balance|fee|payment)/i;
const strays = [];
src.split("\n").forEach((line, i) => {
  if (!/inputMode="decimal"|type="number"/.test(line)) return;
  if (/MoneyInput/.test(line)) return;
  /* Look at the whole element, which may wrap across lines. */
  const chunk = src.split("\n").slice(Math.max(0, i - 3), i + 3).join(" ");
  if (/MoneyInput/.test(chunk)) return;
  const m = chunk.match(/value=\{([^}]*)\}/);
  const bound = m ? m[1] : "";
  if (moneyish.test(bound) && !/pct|Pct|percent|margin|Margin|rate|Rate/i.test(bound)) {
    strays.push(`${i + 1}: ${bound.trim()}`);
  }
});
ok(strays.length === 0, "every dollar field goes through MoneyInput (stragglers: " + strays.join(" | ") + ")");

/* An adjacent "$" label would double up with the one MoneyInput prints. */
ok(!/>\$<\/span>\s*\n\s*<MoneyInput/.test(src), "no leftover '$' label beside a money input");

/* ---------- behavioural: mount one and drive it ---------- */
const scratch = path.join(__dirname, "_money52.jsx");
const bundle = path.join(__dirname, "_money52.cjs");
fs.writeFileSync(scratch, src + "\nexport { MoneyInput, moneyNum, money };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>",
  { url: "https://example.com/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
dom.window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
const React = require("react");
const { act } = require("react");
const { createRoot } = require("react-dom/client");
global.IS_REACT_ACT_ENVIRONMENT = true;
const m = require("./_money52.cjs");

ok(m.moneyNum("$24,850.00") === 24850, "parses a fully formatted figure");
ok(m.moneyNum("24850") === 24850, "parses a bare number");
ok(m.moneyNum("1,500") === 1500, "parses a figure with a thousands separator");
ok(m.moneyNum("") === 0 && m.moneyNum(null) === 0, "blank parses to zero rather than NaN");
ok(m.moneyNum("-500") === -500, "parses a negative");

/* Drive the component: focus, type, blur. React 18 delegates onFocus and
   onBlur to the focusin/focusout events, so those are what we dispatch. */
let stored = "1234.5";
function Harness() {
  const [v, setV] = React.useState(stored);
  stored = v;
  return React.createElement(m.MoneyInput, { value: v, onChange: setV });
}
const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(Harness)); });
const el = document.querySelector("input");

ok(el.value === "$1,234.50", `renders accounting format at rest (got "${el.value}")`);
act(() => { el.dispatchEvent(new dom.window.FocusEvent("focusin", { bubbles: true })); });
ok(el.value === "1234.5", `shows the plain number once focused (got "${el.value}")`);

/* The keystroke test: typing "1" must leave "1" in the box, not "$1.00" —
   otherwise the next keystroke can never produce "12". */
act(() => {
  const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set;
  setter.call(el, "1");
  el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
});
ok(el.value === "1", `typing does not reformat mid-entry (got "${el.value}")`);
act(() => {
  const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set;
  setter.call(el, "12");
  el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
});
ok(el.value === "12", "a second digit is reachable");

act(() => { el.dispatchEvent(new dom.window.FocusEvent("focusout", { bubbles: true })); });
ok(el.value === "$12.00", `settles into accounting format on blur (got "${el.value}")`);
ok(stored === "12", `stores a plain parseable number, not the formatted string (got "${stored}")`);

/* Clearing a field must leave it empty rather than a hard zero — an empty
   cost field means "not known", which is not the same as free. */
act(() => { el.dispatchEvent(new dom.window.FocusEvent("focusin", { bubbles: true })); });
act(() => {
  const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set;
  setter.call(el, "");
  el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
});
act(() => { el.dispatchEvent(new dom.window.FocusEvent("focusout", { bubbles: true })); });
ok(stored === "", `a cleared field stays empty rather than becoming zero (got "${stored}")`);
ok(el.value === "", "an empty field renders empty, not $0.00");

fs.unlinkSync(bundle);
if (fails) { console.log("\nbuild 52: " + fails + " FAILED"); process.exit(1); }
console.log("build 52 tests passed");
