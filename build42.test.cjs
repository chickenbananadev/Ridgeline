/* Build 42 — schedule appointment quick-actions: call, text, and
   directions in Waze / Apple Maps / Google Maps with a remembered default. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- map-provider helpers --- */
ok(/const directionsAppleLink = \(addr\) =>/.test(src), "Apple Maps directions helper exists");
ok(src.includes("https://maps.apple.com/?daddr="), "Apple Maps uses the daddr universal link");
ok(/const directionsWazeLink = \(addr\) =>/.test(src), "Waze directions helper exists");
ok(src.includes("https://waze.com/ul?q=") && src.includes("navigate=yes"), "Waze uses a navigate universal link");
ok(src.includes("const MAP_PROVIDERS"), "MAP_PROVIDERS list exists");
ok(/id: "google"/.test(src) && /id: "apple"/.test(src) && /id: "waze"/.test(src), "all three providers registered");
ok(src.includes("const smsHref"), "sms: helper exists");

/* --- remembered default map app (device-local, guarded) --- */
ok(src.includes('MAP_PREF_KEY = "ridgeline.mapProvider"'), "map preference storage key defined");
ok(src.includes("const getMapPref") && src.includes("const setMapPref"), "map preference get/set helpers exist");
ok(/catch \(e\) \{ return "google"; \}/.test(src), "getMapPref falls back to google when storage is unavailable");

/* --- appointment quick popup wiring --- */
ok(src.includes("const [viewingId, setViewingId]"), "CalendarView tracks the tapped appointment");
ok(src.includes("const [mapPref, setMapPrefState]"), "CalendarView holds the remembered map app in state");
ok((src.match(/onClick=\{\(\) => setViewingId\(ap\.id\)\}/g) || []).length >= 2,
  "both appointment tap handlers open the popup instead of the edit form");
ok(src.includes("providersOrdered"), "providers are ordered with the preferred app first");
ok(src.includes("setMapPref(p.id); setMapPrefState(p.id);"), "tapping a provider remembers it as the new default");
ok(src.includes("openEdit(ap); }}") || src.includes("openEdit(ap);"), "Edit still reaches the appointment edit form");
ok(/href=\{vTel \? telHref\(vJob\.phone\)/.test(src), "Call uses telHref, disabled without a phone");
ok(/href=\{vTel \? smsHref\(vJob\.phone\)/.test(src), "Text uses smsHref, disabled without a phone");

if (fails) { console.log("\nbuild 42: " + fails + " FAILED"); process.exit(1); }
console.log("build 42 tests passed");
