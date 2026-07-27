/* Build 32 — regression test for the "app hangs on Loading forever"
   bug. This exact scenario shipped to production: tenant-scoping the
   crm_org/crm_brand hydrate effects on `tenantId` with no fallback
   meant that ANY real user, on a database where migrations 015/016/017
   haven't been run yet (so profiles.tenant_id doesn't exist), got
   `tenantId = null` forever — and the hydrate effect hard-blocked on
   it, so `hydrated` never became true, so the loading screen never
   went away. This suite simulates exactly that: live mode
   (window.__SUPABASE__ present), a mocked client that behaves like a
   pre-migration database, and asserts the app actually renders past
   the loading screen. */
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

/* ---- static: every tenant-scoped effect must have a legacy fallback ---- */
check("brand read never hard-blocks on tenantId",
  !/if \(!db \|\| !tenantId\) \{ if \(!db\) setLoaded\(true\); return; \}/.test(src));
check("brand read falls back to id=1 when tenantId is unavailable",
  /db\.from\("crm_brand"\)\.select\("data"\)\.eq\("id", 1\)\.maybeSingle\(\)/.test(src));
check("org hydrate never hard-blocks on tenantId",
  !/if \(!db \|\| !ready \|\| !tenantId\) return;/.test(src));
check("org hydrate falls back to id=1 when tenantId is unavailable",
  /db\.from\("crm_org"\)\.select\("data"\)\.eq\("id", 1\)\.maybeSingle\(\)/.test(src));
check("org first-boot seed falls back to id=1 upsert",
  /db\.from\("crm_org"\)\.upsert\(\{ id: 1, data: orgPack\(\), updated_at: new Date\(\)\.toISOString\(\) \}\);/.test(src));
check("org debounced save falls back to id=1 upsert",
  /db\.from\("crm_org"\)\.upsert\(\{ id: 1, data: orgPack\(\), updated_at: new Date\(\)\.toISOString\(\) \}\)\s*: db\.from\("crm_org"\)\.upsert\(\{ id: 1/.test(src)
  || (src.match(/db\.from\("crm_org"\)\.upsert\(\{ id: 1/g) || []).length >= 2);
check("brand save falls back to id=1 upsert",
  /db\.from\("crm_brand"\)\.upsert\(\{ id: 1, data: payload, updated_at: new Date\(\)\.toISOString\(\) \}\);/.test(src));
check("hydrate effect's setHydrated(true) is unconditional, outside the try/catch",
  /\} catch \(e\) \{\s*\n\s*if \(alive\) setSyncErr\(/.test(src) && /if \(alive\) setHydrated\(true\);\s*\n\s*\}\)\(\);/.test(src));

/* ---- render: simulate live mode + a pre-migration database ---- */

/* A minimal chainable Supabase-like mock. Built on a REAL Promise (not
   a Proxy pretending to be thenable) so .then()/.catch() have correct
   native semantics when chained — query-builder methods (select, eq,
   order, limit, upsert, ...) are attached directly onto that promise
   and just return the same object, letting any chain shape resolve to
   the given value. This mirrors what a pre-migration database returns
   for these exact queries: crm_org/crm_brand succeed with no row
   (data: null) — since tenantId is null in this scenario, the code
   should take the id=1 fallback path and never query the tenant_id
   column that doesn't exist yet. */
function makeChainable(resolveValue) {
  const p = Promise.resolve(resolveValue);
  const methods = ["select", "eq", "order", "limit", "upsert", "insert", "delete", "update", "single", "maybeSingle", "on", "subscribe"];
  methods.forEach((m) => { p[m] = () => p; });
  return p;
}

const mockClient = {
  from(table) {
    return makeChainable({ data: null, error: null });
  },
  channel() {
    return makeChainable(undefined);
  },
  functions: { invoke: () => Promise.resolve({ data: null, error: null }) },
  auth: {
    getSession: () => Promise.resolve({ data: { session: { user: { id: "u1" } } } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signOut: () => Promise.resolve({}),
  },
};

// A profile lookup that behaves like a pre-migration database: the
// row exists (real user), but has no tenant_id at all, because the
// column doesn't exist yet.
window.__SUPABASE__ = mockClient;
window.__AUTH__ = {
  async loadProfile() {
    return { id: "u1", name: "Jacob Henderson", email: "jacob@supremebuildinggroup.com",
      role: "admin", title: "Owner", active: true, commission_rate: 60, added_at: "2026-01-01" };
    // Deliberately no tenant_id key at all — matches a real pre-015 row.
  },
  async listProfiles() { return []; },
  async getSession() { return { user: { id: "u1" } }; },
  async exchangeRecovery() { return null; },
  onChange(cb) {
    // Fire once, synchronously-ish, with a session — mirrors a real
    // already-signed-in user reloading the page.
    setTimeout(() => cb({ user: { id: "u1" } }), 0);
    return () => {};
  },
  async signOut() {},
};

const App = require("./app.test.cjs").default;
const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });

// Let any pending promises/timeouts resolve.
async function flush(times = 8) {
  for (let i = 0; i < times; i++) {
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
  }
}

(async () => {
  await flush();
  const text = document.body.textContent;
  check("the app does not hang on the Loading screen forever",
    !(/^Loading…$/.test(text.trim())) && text.length > 20);
  check("no unhandled crash occurred", !/Cannot read propert|is not a function|undefined is not/i.test(text));

  console.error = realErr;
  const real = errs.filter((e) => !/not wrapped in act/.test(e));
  if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
  console.log("build 32 tests passed");
})();
