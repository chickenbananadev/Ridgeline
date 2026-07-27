/* Build 33 — pre-auth screen uses RoofStride's own teal, not tenant
   blue; login/signup placeholders are generic, not Jacob's own domain. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");

function check(name, cond) {
  if (!cond) { console.error("FAILED: " + name); process.exit(1); }
}

check("DEFAULT_BRAND accent is RoofStride's teal, not a generic blue",
  /accent: "#0A9E98"/.test(src));
check("no leftover blue default accent in any brand-accent fallback",
  !/accent: "#1B6DE0"/.test(src) && !/accent = "#1B6DE0"/.test(src)
    && !/brand\.accent \|\| "#1B6DE0"/.test(src));
check("avatar color palette (unrelated to branding) is untouched",
  (src.match(/"#1B6DE0", "#177245", "#92600A"/g) || []).length === 2);
check("login email placeholder is generic, not Jacob's own domain",
  /placeholder="you@yourcompany\.com"/.test(src));
check("no remaining supremebuildinggroup.com in any placeholder attribute",
  !/placeholder="[^"]*supremebuildinggroup\.com[^"]*"/.test(src)
    && !/placeholder=\{[^}]*supremebuildinggroup\.com[^}]*\}/.test(src));
check("login password placeholder is just 'Password'",
  /placeholder="Password"/.test(src));
check("no leftover 'Enter your password' placeholder", !/Enter your password/.test(src));
check("signup name field placeholder is generic, not Jacob's own name",
  /placeholder="Your full name"/.test(src) && !/placeholder="Jacob Henderson"/.test(src));
check("signup company field placeholder is generic, not Jacob's own company",
  /placeholder="Your company name"/.test(src) && !/placeholder="Supreme Building Group"/.test(src));
check("cost-line paid-to example no longer names Jacob specifically",
  !/e\.g\. Jacob, QXO, Black Bull/.test(src));

/* ---- render: confirm the actual button color and placeholders ---- */
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>",
  { url: "https://example.com/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
global.fetch = () => Promise.reject(new Error("no network in tests"));

const errs = [];
const realErr = console.error;
console.error = (...a) => { errs.push(a.join(" ")); };

const React = require("react");
const { act } = require("react");
const { createRoot } = require("react-dom/client");
global.IS_REACT_ACT_ENVIRONMENT = true;
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

const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });
clickText("Sign in"); // marketing page -> login screen

const signInBtn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Sign in");
check("sign-in button rendered", !!signInBtn);
check("sign-in button is RoofStride teal (rgb(10, 158, 152))",
  (signInBtn.getAttribute("style") || "").includes("rgb(10, 158, 152)"));

const emailInput = [...document.querySelectorAll("input")].find((i) => i.type === "email");
check("email input has the generic placeholder", emailInput && emailInput.placeholder === "you@yourcompany.com");

const pwInput = [...document.querySelectorAll("input")].find((i) => i.type === "password");
check("password input placeholder is just 'Password'", pwInput && pwInput.placeholder === "Password");

console.error = realErr;
const real = errs.filter((e) => !/not wrapped in act/.test(e));
if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
console.log("build 33 tests passed");
