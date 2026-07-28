/* Build 43 — current weather on jobs/appointments + NOAA/Open-Meteo storm
   history date-of-loss lookup, and the 50-state supplement expansion. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- current weather (keyless) --- */
ok(src.includes("async function fetchCurrentWeatherFor"), "current-weather fetch helper exists");
ok(src.includes("current=temperature_2m,weather_code,wind_speed_10m,is_day"), "requests current conditions from Open-Meteo");
ok(src.includes("temperature_unit=fahrenheit") && src.includes("wind_speed_unit=mph"), "current weather in F / mph");
ok(src.includes("async function geocodeZip") && src.includes("api.zippopotam.us/us/"), "keyless ZIP geocoder fallback exists");
ok(src.includes("function useCurrentWeather") && src.includes("function WeatherNow"), "current-weather hook + chip exist");
ok(src.includes("function wmoLabel"), "WMO code label helper exists");
ok((src.match(/<WeatherNow /g) || []).length >= 2, "WeatherNow shown on at least two surfaces (job + appointment)");

/* --- storm history / date of loss --- */
ok(src.includes("async function fetchStormHistory"), "storm-history fetch helper exists");
ok(src.includes("https://archive-api.open-meteo.com/v1/archive"), "uses Open-Meteo Archive (keyless historical)");
ok(src.includes("wind_gusts_10m_max"), "pulls max wind gusts for the date of loss");
ok(/code === 96 \|\| code === 99/.test(src), "infers hail from thunderstorm-with-hail WMO codes");
ok(src.includes("function spcReportLink") && src.includes("spc.noaa.gov/climo/reports/"), "links the official NOAA SPC storm report");
ok(src.includes("function StormLookup"), "StormLookup component exists");
ok(src.includes("<StormLookup job={job}"), "StormLookup wired into the claim tab");
ok(src.includes('onPick={(d) => set("dateOfLoss")(d)}'), "picking a storm day sets the date of loss");

/* --- 50-state supplement expansion --- */
ok(src.includes("const US_STATES") && (src.match(/\["[A-Z]{2}", "/g) || []).length >= 50, "all 50 states + DC listed");
ok(src.includes("const STATE_CODE_ADOPTION"), "per-state adopted-code map exists");
ok(src.includes("const IRC_BASE"), "IRC base cites exist for the citeFor fallback");
ok(src.includes("US_STATES.map(([ab, name]) =>"), "supplement selector renders a full state dropdown");
ok(!/\["OH", "KY", "IL"\].map\(\(st\)/.test(src), "the old 3-state OH/KY/IL toggle is gone");

if (fails) { console.log("\nbuild 43: " + fails + " FAILED"); process.exit(1); }
console.log("build 43 tests passed");
