/* Build 34 — regression test: the pre-auth login/signup screen must
   NEVER fetch or apply ANY tenant's saved brand data, including via
   the legacy id=1 fallback. This exact bug shipped: the fallback
   added to fix the "Loading forever" hang had no `hasSession` check,
   so on a live database it fetched Supreme's real saved blue accent
   color and applied it to the public signup screen before anyone had
   signed in — even though DEFAULT_BRAND was correctly set to teal.
   The placeholder-text fix from the same commit deployed fine, which
   is what made this one so confusing to track down: it looked like a
   deployment/cache problem, but it was a real code bug the whole time. */
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

/* ---- static ---- */
check("brand read effect is gated on hasSession, not just !db",
  /if \(!db \|\| !hasSession\) \{ if \(!db\) setLoaded\(true\); return; \}/.test(src));
check("brand read effect's dependency array includes hasSession",
  /\}, \[tenantId, hasSession\]\);/.test(src));

/* ---- render: simulate a LIVE database where Supreme's real saved
   brand row has a DIFFERENT accent color than the neutral default —
   exactly production. Assert that color is NEVER applied pre-auth. */
const SUPREME_REAL_ACCENT = "#1B6DE0"; // Supreme's actual saved blue, pre-existing in the DB

function makeChainable(resolveValue) {
  const p = Promise.resolve(resolveValue);
  const methods = ["select", "eq", "order", "limit", "upsert", "insert", "delete", "update", "single", "maybeSingle", "on", "subscribe"];
  methods.forEach((m) => { p[m] = () => p; });
  return p;
}

let brandQueryCount = 0;
const mockClient = {
  from(table) {
    if (table === "crm_brand") {
      brandQueryCount++;
      // Simulate Supreme's real, pre-existing saved row at id=1 —
      // exactly what a live production database actually has.
      return makeChainable({ data: { data: { company: "Supreme Building Group", accent: SUPREME_REAL_ACCENT } }, error: null });
    }
    return makeChainable({ data: null, error: null });
  },
  channel() { return makeChainable(undefined); },
  functions: { invoke: () => Promise.resolve({ data: null, error: null }) },
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }), // nobody signed in
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signOut: () => Promise.resolve({}),
  },
};

window.__SUPABASE__ = mockClient;
window.__AUTH__ = {
  async loadProfile() { throw new Error("should never be called — nobody is signed in"); },
  async listProfiles() { return []; },
  async getSession() { return null; },
  async exchangeRecovery() { return null; },
  onChange(cb) { setTimeout(() => cb(null), 0); return () => {}; },
  async signOut() {},
};

const App = require("./app.test.cjs").default;
const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });

async function flush(times = 8) {
  for (let i = 0; i < times; i++) {
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
  }
}

(async () => {
  await flush();

  check("pre-auth screen never shows Supreme's real company name",
    !/Supreme Building Group/.test(document.body.textContent));

  // Marketing page's own "Sign in" is a plain text nav link with no
  // background color — navigate into the actual Login form first,
  // where the real primary-colored submit button lives.
  const navSignIn = [...document.querySelectorAll("button")]
    .find((b) => b.textContent.trim() === "Sign in");
  check("marketing nav Sign-in link found", !!navSignIn);
  act(() => { navSignIn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  await flush(2);

  const signInBtn = [...document.querySelectorAll("button")]
    .find((b) => b.textContent.trim() === "Sign in");
  check("Sign in submit button found on the login form", !!signInBtn);
  const style = signInBtn ? (signInBtn.getAttribute("style") || "") : "";
  check("Sign in button is RoofStride teal, NOT Supreme's real saved blue",
    style.includes("rgb(10, 158, 152)") && !style.includes("rgb(27, 109, 224)"));

  console.error = realErr;
  const real = errs.filter((e) => !/not wrapped in act/.test(e));
  if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
  console.log("build 34 tests passed");
})();
