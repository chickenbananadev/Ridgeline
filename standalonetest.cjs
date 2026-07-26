const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>",
  { url: "https://localhost/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
global.self = dom.window;
dom.window.matchMedia = dom.window.matchMedia || (() => ({ matches:false, addListener(){}, removeListener(){} }));
dom.window.HTMLElement.prototype.getBoundingClientRect = function () {
  const isMap = (this.style && this.style.aspectRatio === "1 / 1");
  return isMap ? { left:0, top:0, width:360, height:360, right:360, bottom:360, x:0, y:0 }
               : { left:0, top:0, width:0, height:0, right:0, bottom:0, x:0, y:0 };
};
const React = require("react");
const { createRoot } = require("react-dom/client");
const { act } = require("react");
global.IS_REACT_ACT_ENVIRONMENT = true;
const App = require("./app.test.cjs").default;
function clickText(text) {
  const all = [...document.querySelectorAll("button, a, div, span")];
  const t = all.find((el) => (el.tagName === "BUTTON" || el.onclick) &&
    (el.textContent.trim() === text || el.textContent.trim().startsWith(text)))
    || all.filter((el) => el.tagName === "BUTTON").find((el) => el.textContent.includes(text));
  if (!t) { console.log("  [missing]", text); return false; }
  act(() => t.dispatchEvent(new window.MouseEvent("click", { bubbles: true })));
  return true;
}
function typeInto(ph, v) {
  const el = [...document.querySelectorAll("input")].find(i => (i.placeholder||"").includes(ph));
  if (!el) { console.log("  [no input]", ph); return false; }
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  act(() => { setter.call(el, v); el.dispatchEvent(new window.Event("input", { bubbles: true })); });
  return true;
}
const root = createRoot(document.getElementById("root"));
act(() => root.render(React.createElement(App)));
clickText("Sign in"); clickText("Jacob Henderson");

console.log("--- from the More menu ---");
clickText("More");
let t = document.body.textContent;
console.log("menu shows it     :", t.includes("Measure a roof"));

clickText("Measure a roof");
t = document.body.textContent;
console.log("screen opened     :", t.includes("Which property?"));
console.log("tracer present    :", t.includes("Trace from aerial"));
console.log("manual search     :", t.includes("Or search manually"));

typeInto("Address, or paste", "39.2896, -84.5230");
clickText("Search");
t = document.body.textContent;
console.log("map opened        :", t.includes("via coordinates"));
console.log("tile elements     :", document.querySelectorAll("img[src*='World_Imagery']").length);
console.log("tile status line  :", t.includes("loading tiles") || t.includes("tiles loaded") || t.includes("tiles failed"));

const map = [...document.querySelectorAll("div")].find(d => d.style && d.style.aspectRatio === "1 / 1");
[[60,60],[300,60],[300,300],[60,300]].forEach(([x,y]) =>
  act(() => map.dispatchEvent(new window.MouseEvent("click", { bubbles:true, clientX:x, clientY:y }))));
t = document.body.textContent;
const m = t.match(/Plan area traced([\d,]+) sq ft/);
console.log("");
console.log("--- after tracing 4 corners ---");
console.log("area computed     :", m ? m[1] + " sq ft" : "NO");
console.log("add facet button  :", t.includes("Add as a facet"));
clickText("Add as a facet");
t = document.body.textContent;
console.log("plane recorded    :", t.includes("Planes traced"));
console.log("totals shown      :", t.includes("Squares"));
