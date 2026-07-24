const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Blob = dom.window.Blob;
global.URL = dom.window.URL;
global.FileReader = dom.window.FileReader;
window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });

const React = require("react");
const { createRoot } = require("react-dom/client");
const { act } = require("react");
global.IS_REACT_ACT_ENVIRONMENT = true;
const App = require("./app.test.cjs").default;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function clickText(text) {
  const all = [...document.querySelectorAll("button, a, div, span")];
  const target = all.find((el) =>
    (el.tagName === "BUTTON" || el.onclick) &&
    (el.textContent.trim() === text || el.textContent.trim().startsWith(text)))
    || all.filter((el) => el.tagName === "BUTTON").find((el) => el.textContent.includes(text));
  assert(target, `Clickable text not found: ${text}`);
  act(() => target.dispatchEvent(new window.MouseEvent("click", { bubbles: true })));
  return target;
}

function setSelect(selector, value) {
  const element = document.querySelector(selector);
  assert(element, `Select not found: ${selector}`);
  const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
  act(() => {
    setter.call(element, value);
    element.dispatchEvent(new window.Event("change", { bubbles: true }));
  });
}

(async () => {
  const root = createRoot(document.getElementById("root"));
  act(() => root.render(React.createElement(App)));
  clickText("Sign in");
  clickText("Jacob Henderson");
  clickText("Jobs");
  clickText("Roger Perry");
  clickText("Portal");

  assert(document.body.textContent.includes("Customer project tracker"), "Portal tracker should render");
  assert(document.body.textContent.includes("Request changes to the current quote"), "Quote-change tool should render");
  assert(document.body.textContent.includes("Request pricing for future work"), "Future-project tool should render");
  assert(document.body.textContent.includes("Queue text/email updates when the stage changes"), "Stage update control should render");

  setSelect('[data-testid="portal-progress"]', "3");
  assert(document.body.textContent.includes("Materials ordered"), "Customer tracker should accept a manual milestone");
  assert(document.body.textContent.includes("Customer can request quote changes and future project pricing"), "Portal preview should show customer request tools");

  clickText("Files");
  const internal = [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === "Internal");
  assert(internal, "Job documents should expose an Internal/Shared portal control");
  act(() => internal.dispatchEvent(new window.MouseEvent("click", { bubbles: true })));
  assert([...document.querySelectorAll("button")].some((button) => button.textContent.trim() === "Shared"), "A document should be shareable with the customer");

  clickText("Portal");
  assert(document.body.textContent.includes("1 shared"), "Portal should count shared documents");

  console.log("build 3 tests passed");
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
