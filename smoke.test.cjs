const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { url: "http://localhost/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Blob = dom.window.Blob; global.URL = dom.window.URL;
global.FileReader = dom.window.FileReader;
window.matchMedia = () => ({ matches: false, addListener(){}, removeListener(){} });
const React = require("react");
const { createRoot } = require("react-dom/client");
const { act } = require("react");
global.IS_REACT_ACT_ENVIRONMENT = true;
const App = require("./app.test.cjs").default;

const errors = [];
const origErr = console.error;
console.error = (...a) => { errors.push(a.map(String).join(" ").slice(0, 300)); };

function clickText(txt) {
  const els = [...document.querySelectorAll("button, a, div, span")];
  const el = els.find((e) => e.textContent && e.textContent.trim().startsWith(txt) && (e.tagName === "BUTTON" || e.onclick));
  const btn = el || els.filter((e) => e.tagName === "BUTTON").find((e) => e.textContent.includes(txt));
  if (!btn) { console.log(`  [miss] "${txt}"`); return false; }
  act(() => { btn.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
  return true;
}
const bodyLen = () => document.body.textContent.length;

(async () => {
  const root = createRoot(document.getElementById("root"));
  act(() => { root.render(React.createElement(App)); });
  console.log("login screen:", bodyLen(), "chars");
  clickText("Sign in");                 // demo mode -> account picker
  console.log("account picker:", bodyLen());
  clickText("Jacob Henderson");         // login
  console.log("dashboard:", bodyLen());
  clickText("Open board");
  console.log("job board:", bodyLen());
  // open a job
  clickText("Roger Perry");
  console.log("job detail:", bodyLen());
  // walk every tab
  for (const t of ["Checklist","Measurements","Materials","Estimate","Contract","Report","Messages","Photos","Financials","Payments","Invoice","Work order","Tasks","Files","Portal","Overview"]) {
    clickText(t);
    console.log(`tab ${t}:`, bodyLen());
  }
  // back + more screens
  clickText("Jobs"); // nav
  clickText("More");
  console.log("more:", bodyLen());
  for (const m of ["Activity feed","Team chat","Insurance","Performance","Calendar","Contacts","Team & seats","Crews","Documents","Price list","Message templates","Integrations","Import jobs","Lead sources","Vendors","Review automation","Company branding"]) {
    clickText("More");
    clickText(m);
    console.log(`screen ${m}:`, bodyLen());
  }
  clickText("Home");
  console.log("home again:", bodyLen());
  // New lead sheet
  clickText("Jobs");
  clickText("New");
  console.log("new lead sheet:", bodyLen());
  console.log("\n=== console.error captured:", errors.length);
  errors.slice(0, 12).forEach((e) => console.log(" *", e));
})().catch((e) => { origErr("FATAL", e && e.stack ? e.stack.split("\n").slice(0,4).join("\n") : e); });
