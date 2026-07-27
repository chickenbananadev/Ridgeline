/* Build 27 — rain-risk weather on scheduled jobs. */
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

const src = require("fs").readFileSync(require("path").join(__dirname, "ridgeline.jsx"), "utf8");

function check(name, cond) {
  if (!cond) { realErr("FAILED: " + name); process.exit(1); }
}

/* ---- static assertions ---- */
check("weather module present", /Weather — rain risk on scheduled jobs/.test(src));
check("uses Open-Meteo (free, no key)", /api\.open-meteo\.com\/v1\/forecast/.test(src));
check("requests precipitation probability", /precipitation_probability_max/.test(src));
check("has a rain threshold constant", /const RAIN_POP_THRESHOLD = 40/.test(src));
check("caches by rounded lat,lng", /function weatherKey\(lat, lng\)/.test(src));
check("cache has a TTL", /WEATHER_CACHE_MS = 3 \* 60 \* 60 \* 1000/.test(src));
check("fetch failures are swallowed, never thrown", /catch \(e\) \{\s*\n\s*return null;/.test(src));
check("useScheduleWeather hook exists", /function useScheduleWeather\(jobs\)/.test(src));
check("hook only considers jobs with a schedDate and coordinates",
  /j\.schedDate && lat != null && lng != null/.test(src));
check("RainChip component exists", /function RainChip\(\{ w \}\)/.test(src));
check("RainChip hides when not risky", /if \(!w\.risky\) return null;/.test(src));
check("DispatchBoard calls the weather hook", /const weather = useScheduleWeather\(jobs\);/.test(src));
check("day strip shows a rain indicator", /dayIsRisky\(iso\) && <CloudRain/.test(src));
check("selected-day rain summary banner exists", /chance of rain<\/b> on \{dayLabel\(day\)\.toLowerCase\(\)\}/.test(src));
check("unassigned job rows show RainChip", (src.match(/<RainChip w=\{weather\[j\.id\]\} \/>/g) || []).length >= 2);
check("CloudRain icon imported", /CloudRain,/.test(src) && /from "lucide-react"/.test(src));

/* ---- render: dispatch board survives with fetch mocked, both ways ---- */
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

/* Case 1: no fetch at all (closest to jsdom's real default) — must not throw. */
delete global.fetch;
let root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });
clickText("Sign in"); // marketing page -> auth screen
clickText("Sign in");
clickText("Jacob Henderson");
clickText("More");
check("Dispatch board opens with no fetch available", clickText("Dispatch board"));
check("Dispatch board rendered", /Dispatch/.test(document.body.textContent));

/* Case 2: fetch rejects (offline) — still must not throw or hang. */
global.fetch = () => Promise.reject(new Error("offline"));
act(() => { root.unmount(); });
root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });
clickText("Sign in"); // marketing page -> auth screen
clickText("Sign in");
clickText("Jacob Henderson");
clickText("More");
check("Dispatch board opens with fetch rejecting", clickText("Dispatch board"));

/* Case 3: fetch resolves with a canned forecast — still must not throw. */
global.fetch = () => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    daily: {
      time: ["2026-07-26", "2026-07-27", "2026-07-28"],
      precipitation_probability_max: [10, 80, 20],
      precipitation_sum: [0.1, 5.2, 0.4],
      weathercode: [1, 63, 2],
    },
  }),
});
act(() => { root.unmount(); });
root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });
clickText("Sign in"); // marketing page -> auth screen
clickText("Sign in");
clickText("Jacob Henderson");
clickText("More");
check("Dispatch board opens with fetch resolving", clickText("Dispatch board"));

console.error = realErr;
const real = errs.filter((e) => !/not wrapped in act/.test(e));
if (real.length) { realErr("console errors:\n" + real.join("\n")); process.exit(1); }
console.log("build 27 tests passed");
