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
check("title is RoofStride, not stale Ridgeline text", /<title>RoofStride[^<]*<\/title>/.test(indexHtml));
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
check("Login always shows RoofStride's own identity, not a tenant's",
  /Login never renders once signed in/.test(src));
check("Login no longer branches on mode to decide whose brand to show",
  !/mode === "signup" \? \(/.test(src));
check("Login uses the RoofStride horizontal lockup image", /roofstride-logo-horizontal\.png/.test(src));

/* ---- static: the actual root cause — tenant-scoped brand storage ---- */
const migration016 = fs.readFileSync(path.join(__dirname, "supabase/migrations/016_brand_per_tenant.sql"), "utf8");
check("migration 016 adds a unique constraint on tenant_id", /unique \(tenant_id\)/.test(migration016));
check("migration 016 is idempotent", /if not exists[\s\S]*pg_constraint/.test(migration016));

check("fromProfile carries tenantId through", /tenantId: row\.tenant_id \|\| null/.test(src));
check("useBrandSync takes a tenantId parameter", /function useBrandSync\(brand, setBrand, hasSession, tenantId\)/.test(src));
check("brand read is scoped by tenant_id, not a hardcoded id",
  /db\.from\("crm_brand"\)\.select\("data"\)\.eq\("tenant_id", tenantId\)/.test(src));
check("brand read falls back to legacy id=1 when tenantId is unavailable, rather than hard-blocking forever (fixed after a production hang)",
  /db\.from\("crm_brand"\)\.select\("data"\)\.eq\("id", 1\)\.maybeSingle\(\)/.test(src));
check("brand save upserts by tenant_id with onConflict, not a shared id",
  /upsert\(\{ tenant_id: tenantId, data: payload,[\s\S]*?\{ onConflict: "tenant_id" \}\)/.test(src));
check("no remaining hardcoded crm_brand id:1 read/write in the live sync path",
  !/\.eq\("id", 1\)\.maybeSingle\(\)/.test(src.split("function SystemCheck")[0]));

const defaultBrandBlock = src.match(/const DEFAULT_BRAND = \{[\s\S]*?\n\};/)[0];
check("DEFAULT_BRAND no longer leaks Jacob's real contact info",
  !/847\) 757-9890/.test(defaultBrandBlock) && !/steven@supremebuildinggroup\.com/.test(defaultBrandBlock)
    && !/Supreme-Building-Group-Review/.test(defaultBrandBlock));
check("DEFAULT_BRAND is an explicit neutral placeholder", /company: "Your Company"/.test(defaultBrandBlock));

check("SystemCheck probe upserts on the tenant's own row, not a shared/random id",
  /db\.from\("crm_brand"\)\.upsert\(\{ tenant_id: currentUser\.tenantId, updated_at/.test(src));
check("SystemCheck stored-branding report is tenant-scoped",
  /currentUser && currentUser\.tenantId[\s\S]*?eq\("tenant_id", currentUser\.tenantId\)/.test(src));

/* ---- render: the FIRST screen anyone sees, before any click, must
   never show a tenant's name/slogan — this is the exact bug reported:
   the default landing screen showed "Supreme Building Group" and its
   slogan to every visitor, not just the signup form. ---- */
const App = require("./app.test.cjs").default;
const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });

check("first paint shows the RoofStride logo, not any tenant's",
  !!document.querySelector('img[alt="RoofStride"]'));
check("first paint never shows Supreme's company name",
  !/Supreme Building Group/.test(document.body.textContent));
check("first paint never shows Supreme's slogan",
  !/Committed to Supreme Quality/.test(document.body.textContent));
check("first paint never shows the old placeholder default company name either",
  !/Your Company\b/.test(document.body.textContent));

function clickText(txt) {
  const els = [...document.querySelectorAll("button, a, div, span")];
  const el = els.find((e) => e.textContent && e.textContent.trim().startsWith(txt)
    && (e.tagName === "BUTTON" || e.onclick));
  const btn = el || els.filter((e) => e.tagName === "BUTTON").find((e) => e.textContent.includes(txt));
  if (!btn) return false;
  act(() => { btn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  return true;
}

const createAcct = [...document.querySelectorAll("button")]
  .find((b) => /Create an account/.test(b.textContent || ""));
if (createAcct) {
  act(() => { createAcct.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  check("signup panel also shows the product logo image", !!document.querySelector('img[alt="RoofStride"]'));
  check("signup panel never shows Supreme's company name",
    !/Supreme Building Group/.test(document.body.textContent));
}

console.error = realErr;
const real = errs.filter((e) => !/not wrapped in act/.test(e));
if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
console.log("build 29 tests passed");
