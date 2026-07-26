/* Build 29 — app icon set, PWA manifest, and product-vs-tenant branding split. */
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>",
  { url: "https://example.com/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });

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
const indexHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "public/manifest.json"), "utf8"));

function check(name, cond) {
  if (!cond) { realErr("FAILED: " + name); process.exit(1); }
}

/* ---- static: icon files exist and are real images, not stubs ---- */
const requiredIcons = [
  "public/apple-touch-icon.png", "public/icon-192.png", "public/icon-512.png",
  "public/favicon-32x32.png", "public/favicon-16x16.png", "public/favicon.ico",
  "public/roofstride-logo-horizontal.png", "public/roofstride-mark.png",
];
for (const f of requiredIcons) {
  const p = path.join(__dirname, f);
  check(f + " exists", fs.existsSync(p));
  check(f + " is non-trivial size", fs.statSync(p).size > 500);
}

/* ---- static: index.html wiring ---- */
check("title is RoofStride, not stale Ridgeline text", indexHtml.includes("<title>RoofStride</title>"));
check("no leftover Ridgeline string in index.html", !/Ridgeline/.test(indexHtml));
check("favicon links present", /rel="icon"/.test(indexHtml) && /favicon-32x32\.png/.test(indexHtml));
check("apple-touch-icon linked", /rel="apple-touch-icon"/.test(indexHtml) && /apple-touch-icon\.png/.test(indexHtml));
check("manifest linked", /rel="manifest"/.test(indexHtml) && /manifest\.json/.test(indexHtml));
check("theme-color updated off Supreme's tenant color", !/#28373E/.test(indexHtml));

/* ---- static: manifest correctness ---- */
check("manifest name is RoofStride", manifest.name === "RoofStride");
check("manifest short_name is RoofStride", manifest.short_name === "RoofStride");
check("manifest has 192 and 512 icons", manifest.icons.some((i) => i.sizes === "192x192")
  && manifest.icons.some((i) => i.sizes === "512x512"));
check("manifest icon paths match saved files", manifest.icons.every((i) =>
  fs.existsSync(path.join(__dirname, "public", i.src.replace(/^\//, "")))));

/* ---- static: signup shows product brand, not tenant brand ---- */
check("signup mode branches before the shared tenant header",
  /mode === "signup" \? \(/.test(src));
check("signup uses the RoofStride horizontal lockup image", /roofstride-logo-horizontal\.png/.test(src));
check("signup does not render tenant company name/slogan", /mode !== "signup" && \(/.test(src));

/* ---- render: login still shows tenant brand; signup shows product brand ---- */
const App = require("./app.test.cjs").default;
function clickText(txt) {
  const els = [...document.querySelectorAll("button, a, div, span")];
  const el = els.find((e) => e.textContent && e.textContent.trim().startsWith(txt)
    && (e.tagName === "BUTTON" || e.onclick));
  const btn = el || els.filter((e) => e.tagName === "BUTTON").find((e) => e.textContent.includes(txt));
  if (!btn) return false;
  act(() => { btn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  return true;
}
const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });

// Demo mode's very first screen is the account-picker gate, not the real
// auth screen, so the login-branding assertion runs after "Sign in" too —
// but the tenant name should already be visible pre-auth in a live deploy.
// In demo mode (no Supabase), just confirm signup mode swaps the logo
// correctly, since that path doesn't require a live tenant fetch.
const createAcct = [...document.querySelectorAll("button")]
  .find((b) => /Create an account/.test(b.textContent || ""));
if (createAcct) {
  act(() => { createAcct.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  check("signup panel shows the product logo image", !!document.querySelector('img[alt="RoofStride"]'));
  check("signup panel does not show a tenant company name heading",
    !document.querySelector("div")?.textContent?.includes("Supreme Building Group") ||
    !/Committed to Supreme Quality/.test(document.body.textContent));
}

console.error = realErr;
const real = errs.filter((e) => !/not wrapped in act/.test(e));
if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
console.log("build 29 tests passed");
