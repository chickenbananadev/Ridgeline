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

function setControl(selector, value) {
  const element = document.querySelector(selector);
  assert(element, `Control not found: ${selector}`);
  const proto = element.tagName === "SELECT" ? window.HTMLSelectElement.prototype
    : element.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
  act(() => {
    setter.call(element, value);
    element.dispatchEvent(new window.Event("change", { bubbles: true }));
    element.dispatchEvent(new window.Event("input", { bubbles: true }));
  });
}

(async () => {
  const root = createRoot(document.getElementById("root"));
  act(() => root.render(React.createElement(App)));
  clickText("Sign in"); // marketing page -> auth screen
  clickText("Sign in"); // auth screen -> demo account picker
  clickText("Jacob Henderson");

  clickText("More");
  clickText("Contacts");
  clickText("Add another project");

  const contactSelect = document.querySelector('[data-testid="existing-contact"]');
  const propertySelect = document.querySelector('[data-testid="existing-property"]');
  assert(contactSelect && contactSelect.value, "Existing customer should be preselected");
  assert(propertySelect && propertySelect.options.length > 1, "Existing customer properties should be available");
  setControl('[data-testid="existing-property"]', propertySelect.options[1].value);
  setControl('[data-testid="lead-source"]', "Repeat customer");

  const create = document.querySelector('[data-testid="create-lead"]');
  assert(create && !create.disabled, "Repeat-customer project should be creatable");
  act(() => create.dispatchEvent(new window.MouseEvent("click", { bubbles: true })));
  assert(!document.querySelector('[data-testid="create-lead"]'), "Repeat-customer project sheet should close");

  clickText("More");
  clickText("Contacts");
  assert(document.body.textContent.includes("2 projects"), "Contact should now show multiple projects");

  clickText("Jobs");
  clickText("Quick add");
  assert(document.body.textContent.includes("Appointment"), "Quick panel should expose appointment actions");
  setControl('[data-testid="quick-note"]', "Customer requested a morning callback.");
  const saveNote = document.querySelector('[data-testid="quick-save-note"]');
  assert(saveNote && !saveNote.disabled, "Quick note should be saveable");
  act(() => saveNote.dispatchEvent(new window.MouseEvent("click", { bubbles: true })));
  assert(!document.querySelector('[data-testid="quick-note"]'), "Quick panel should close after saving");

  clickText("More");
  clickText("Schedule");
  for (const label of ["All", "Sales", "Production", "Issues", "Delivery"]) {
    assert([...document.querySelectorAll("button")].some((button) => button.textContent.trim() === label), `Schedule view missing: ${label}`);
  }

  console.log("build 2 tests passed");
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
