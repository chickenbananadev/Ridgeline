/* Build 26 — sign-up flow, multi-tenancy plumbing, help desk. */
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>",
  { url: "https://example.com/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
global.localStorage = dom.window.localStorage;

const errs = [];
const realErr = console.error;
console.error = (...a) => { errs.push(a.join(" ")); };

const React = require("react");
const { act } = require("react");
const { createRoot } = require("react-dom/client");
global.IS_REACT_ACT_ENVIRONMENT = true;

const src = require("fs").readFileSync(require("path").join(__dirname, "ridgeline.jsx"), "utf8");
const App = require("./app.test.cjs");
const Comp = App.default || App;

function check(name, cond) {
  if (!cond) { realErr("FAILED: " + name); process.exit(1); }
}

/* ---- static source assertions ---- */
check("PRODUCT constant exists", /const PRODUCT = \{/.test(src));
check("PRODUCT carries the two-tier pricing model", /basePrice: 49\.99/.test(src) && /extraSeatPrice: 14\.99/.test(src) && /unlimitedPrice: 169\.99/.test(src));
check("PRODUCT carries trial length", /trialDays: 7/.test(src));

check("signup mode panel exists", /mode === "signup"/.test(src));
check("signup calls signUpOwner", /signUpOwner\(/.test(src));
check("signup collects a company name", /suCompany/.test(src));
check("signup confirms the password", /suPw2/.test(src));
check("create-account entry point exists", /Create an account/.test(src));

check("help desk component exists", /function HelpDesk\(/.test(src));
check("help articles are data", /const HELP_ARTICLES = \[/.test(src));
check("help is in the More menu", /\["help", BookOpen, "Help & guides"/.test(src));
check("help has a route", /nav === "help"/.test(src));

/* Every article must be well-formed and reachable from a category. */
const catBlock = src.match(/const HELP_CATS = \[([\s\S]*?)\];/);
check("HELP_CATS present", !!catBlock);
const cats = (catBlock[1].match(/"([^"]+)"/g) || []).map((x) => x.slice(1, -1));
const artBlock = src.match(/const HELP_ARTICLES = \[([\s\S]*?)\n\];/);
check("HELP_ARTICLES block parses", !!artBlock);
const artCats = (artBlock[1].match(/cat: "([^"]+)"/g) || []).map((x) => x.slice(6, -1));
check("at least 20 help articles", artCats.length >= 20);
for (const c of new Set(artCats)) {
  check("article category '" + c + "' is listed in HELP_CATS", cats.includes(c));
}
const ids = (artBlock[1].match(/id: "([a-z-]+)", cat:/g) || []).map((x) => x.slice(5).split('"')[0]);
check("article ids are unique", new Set(ids).size === ids.length);

/* ---- migration assertions ---- */
const mig = require("fs").readFileSync(
  require("path").join(__dirname, "supabase/migrations/015_multi_tenancy.sql"), "utf8");
check("tenants table created", /create table if not exists tenants/.test(mig));
check("current_tenant_id helper", /function current_tenant_id\(\)/.test(mig));
check("insert trigger stamps tenant", /function set_tenant_id\(\)/.test(mig));
check("create_tenant rpc", /function create_tenant\(org_name text\)/.test(mig));
check("trial is 7 days", /interval '7 days'/.test(mig));
check("supreme backfilled as internal", /'Supreme Building Group', 'internal'/.test(mig));
check("migration is idempotent", /on conflict \(id\) do nothing/.test(mig));

/* No table may keep a permissive authenticated policy. */
const permissive = mig.match(/create policy \w+ on crm_\w+ for all to authenticated\s*\n\s*using \(true\)/g);
check("no using(true) policies remain for authenticated", !permissive);

/* Every data table must gain tenant_id and a stamp trigger. */
for (const t of ["crm_jobs", "crm_financials", "crm_chat", "crm_activity", "crm_appointments"]) {
  check(t + " is in the tenant column list", mig.includes("'" + t + "'"));
}
check("financials keeps the no-crew rule", /role is distinct from 'crew'/.test(mig));

/* ---- render: More menu shows Help, and it opens ---- */
window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(Comp)); });

function clickText(txt) {
  const els = [...document.querySelectorAll("button, a, div, span")];
  const el = els.find((e) => e.textContent && e.textContent.trim().startsWith(txt)
    && (e.tagName === "BUTTON" || e.onclick));
  const btn = el || els.filter((e) => e.tagName === "BUTTON").find((e) => e.textContent.includes(txt));
  if (!btn) return false;
  act(() => { btn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  return true;
}

clickText("Sign in"); // marketing page -> auth screen
clickText("Sign in"); // auth screen -> demo account picker
check("demo account picker reachable", clickText("Jacob Henderson"));
check("More menu opens", clickText("More"));
clickText("SETUP");
check("Help & guides is in the More menu", clickText("Help & guides"));
check("help desk rendered", /Help & guides/.test(document.body.textContent));
check("help search box rendered", !!document.querySelector("[data-testid='help-search']"));
check("categories rendered", /Getting started/.test(document.body.textContent));

const box = document.querySelector("[data-testid='help-search']");
const setVal = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set;
act(() => {
  setVal.call(box, "commission");
  box.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
});
check("search finds the commission article", /Commission structures/.test(document.body.textContent));

check("article opens", clickText("Commission structures"));
check("article body rendered", /Net profit/.test(document.body.textContent));
check("back link present", /All articles/.test(document.body.textContent));

console.error = realErr;
const real = errs.filter((e) => !/not wrapped in act/.test(e));
if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
console.log("build 26 tests passed");
