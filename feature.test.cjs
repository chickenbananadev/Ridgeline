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

function clickButton(text) {
  const candidates = [...document.querySelectorAll("button, a, div, span")];
  const target = candidates.find((el) =>
    (el.tagName === "BUTTON" || el.onclick) &&
    (el.textContent.trim() === text || el.textContent.trim().startsWith(text)))
    || candidates.filter((el) => el.tagName === "BUTTON").find((el) => el.textContent.includes(text));
  assert(target, `Button not found: ${text}`);
  act(() => target.dispatchEvent(new window.MouseEvent("click", { bubbles: true })));
  return target;
}

function setControl(selector, value) {
  const element = document.querySelector(selector);
  assert(element, `Control not found: ${selector}`);
  const proto = element.tagName === "SELECT"
    ? window.HTMLSelectElement.prototype
    : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
  act(() => {
    setter.call(element, value);
    element.dispatchEvent(new window.Event("change", { bubbles: true }));
    element.dispatchEvent(new window.Event("input", { bubbles: true }));
  });
}

function clickFieldChoice(labelText, choiceText) {
  const field = [...document.querySelectorAll("label")]
    .find((el) => el.textContent.trim().startsWith(labelText));
  assert(field, `Field not found: ${labelText}`);
  const button = [...field.querySelectorAll("button")]
    .find((el) => el.textContent.trim() === choiceText);
  assert(button, `Choice not found: ${labelText} → ${choiceText}`);
  act(() => button.dispatchEvent(new window.MouseEvent("click", { bubbles: true })));
}

(async () => {
  const root = createRoot(document.getElementById("root"));
  act(() => root.render(React.createElement(App)));

  clickButton("Sign in"); // marketing page -> auth screen
  clickButton("Sign in"); // auth screen -> demo account picker
  clickButton("Jacob Henderson");
  clickButton("Jobs");
  clickButton("New");

  setControl('[data-testid="lead-first"]', "Test");
  setControl('[data-testid="lead-last"]', "Flatroof");
  setControl('input[placeholder="123 Main St"]', "100 Test Lane");
  setControl('[data-testid="lead-zip"]', "45240");
  setControl('[data-testid="lead-roof-age"]', "15");
  setControl('[data-testid="lead-layers"]', "1 Layer");
  setControl('[data-testid="lead-source"]', "Call in");
  clickFieldChoice("Current roof type", "Flat / membrane");
  clickFieldChoice("What are they interested in?", "Roof replacement");
  clickFieldChoice("Reason for calling", "Active leak");

  const create = document.querySelector('[data-testid="create-lead"]');
  assert(create && !create.disabled, "Create lead should be enabled");
  act(() => create.dispatchEvent(new window.MouseEvent("click", { bubbles: true })));

  assert(!document.querySelector('[data-testid="create-lead"]'), "Lead sheet should close after creation");
  assert(document.body.textContent.includes("Test Flatroof"), "Created lead should open");
  assert(document.body.textContent.includes("Active leak"), "Intake reason should appear in the job");
  assert(document.body.textContent.includes("Roof replacement"), "Requested work should appear in the job");

  // Sections are collapsible now; the header expands the section.
  clickButton("Inspection checklist");
  clickFieldChoice("Structure type", "Single Family");
  clickFieldChoice("Overall roof condition", "Good");

  const complete = document.querySelector('[data-testid="complete-checklist"]');
  assert(complete && !complete.disabled, "Flat-roof checklist should not require pitch");
  act(() => complete.dispatchEvent(new window.MouseEvent("click", { bubbles: true })));
  assert(document.body.textContent.includes("Checklist complete"), "Checklist completion confirmation should appear");

  console.log("feature tests passed");
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
