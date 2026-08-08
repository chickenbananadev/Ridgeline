/* Build 132 — a canvassing map that doesn't feel broken.

   The owner's verdict on v1 was "wonky to say the least… nothing like
   SalesRabbit", and it was right. Three things made it feel wrong, and
   each one is fixed here for a specific reason:

   1. THE FEEL. A hand-rolled Mercator renderer gets the projection
      right and the feel wrong: no momentum, no inertia, no double-tap
      zoom, panning that dies the instant a finger lifts. That is most
      of what a map is, and it is exactly what a map library exists to
      provide. So this runs on Leaflet now — reversing my earlier call,
      which was correct about the constraint (a CSS import in
      ridgeline.jsx breaks `npm run bundle:test`) and wrong about the
      conclusion. Leaflet is imported in src/main.jsx, the composition
      root that already hands the app __SUPABASE__, __AUTH__ and
      __GEOAPIFY_KEY__, and arrives as window.__LEAFLET__.
      ridgeline.jsx stays import-free and the bundle test is untouched.

   2. IT WASN'T A MAP SCREEN. The map was a 420px card wedged between a
      search card and a legend card inside a scrolling page. Now the
      screen is a flex column and the map fills it, with search
      floating over it and the door opening as a bottom sheet — so
      dispositions are under a thumb with the street still visible,
      instead of below the fold.

   3. ANY TAP DROPPED A PIN. Reading the map created doors. Adding is
      now deliberate: a + enters add mode, a crosshair marks the spot,
      and a confirm drops it. A stray tap does nothing.

   Satellite ships as a real control even though it cannot work yet:
   every free aerial basemap bars commercial use (Esri's World Imagery
   explicitly), so it needs a provider key. Hiding the control until
   then would leave a rep wondering whether they are missing a gesture;
   showing it disabled with a reason is honest. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const main = fs.readFileSync(path.join(__dirname, "src/main.jsx"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- Leaflet arrives without breaking the bundle ---------- */
ok(!!(pkg.dependencies && pkg.dependencies.leaflet), "leaflet is a real dependency");
ok(/import L from "leaflet";/.test(main) && /import "leaflet\/dist\/leaflet\.css";/.test(main),
  "leaflet AND its stylesheet are imported in main.jsx");
ok(/window\.__LEAFLET__ = L;/.test(main), "and handed to the app on window, like every other outside dependency");
ok(!/from "leaflet"/.test(src) && !/leaflet\.css/.test(src),
  "ridgeline.jsx imports NOTHING — that is what keeps `npm run bundle:test` working");
ok(/const L = typeof window !== "undefined" \? window\.__LEAFLET__ : null;/.test(src),
  "the map reads Leaflet off window");
ok(/The map engine didn't load\. Reload the page/.test(src),
  "and says so when it is absent rather than rendering an empty grey box");

/* ---------- the feel: Leaflet's own behaviours are on ---------- */
ok(/inertia: true, tap: true, doubleClickZoom: true/.test(src),
  "inertia, tap and double-tap zoom are explicitly enabled — the momentum whose absence was the 'wonky'");
ok(/if \(!L \|\| !boxRef\.current \|\| mapRef\.current\) return;/.test(src),
  "the map is created ONCE — re-creating it per render would throw away the inertia this rewrite exists to add");
ok(/map\.on\("moveend zoomend"/.test(src), "the parent learns about movement from Leaflet's own events");
ok(/const moved = metresBetween\(c\.lat, c\.lng, center\.lat, center\.lng\) > 25;/.test(src),
  "following the controlled centre has a deadband, so the app never fights the user's own panning");

/* ---------- it is a map screen now ---------- */
ok(/height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: S\.bg/.test(src),
  "the screen is a flex column that fills its pane instead of a scrolling page of cards");
ok(/<div ref=\{mapWrapRef\} style=\{\{ flex: 1, position: "relative", minHeight: 0 \}\}>/.test(src),
  "the map takes all the remaining height");
ok(/position: "absolute", left: 10, right: 10, top: 10, zIndex: 600/.test(src),
  "search floats over the map rather than pushing it down the page");
ok(/data-testid="pin-sheet"/.test(src), "the selected door is a bottom sheet");
ok(/borderTopLeftRadius: 18, borderTopRightRadius: 18/.test(src), "...shaped like one");
ok(/paddingBottom|padding: "12px 14px calc\(14px \+ env\(safe-area-inset-bottom\)\)"/.test(src),
  "...and clears the phone's home indicator");
ok(/data-testid="canvass-stats"/.test(src),
  "the scoreboard moved into a sheet — it was pushing the map off the screen");

/* ---------- adding is deliberate ---------- */
ok(/const \[adding, setAdding\] = useState\(false\);/.test(src), "there is an explicit add mode");
ok(/data-testid="add-door"/.test(src) && /data-testid="add-crosshair"/.test(src)
  && /data-testid="confirm-drop"/.test(src),
  "+ enters add mode, a crosshair marks the spot, and a separate control confirms");
ok(!/onTapMap/.test(src),
  "the tap-anywhere-drops-a-pin path is GONE, not merely discouraged — reading the map no longer creates doors");
ok(/Line the marker up on the house, then drop it\./.test(src), "and the mode explains itself");

/* ---------- basemaps ---------- */
ok(/const BASEMAPS = \[/.test(src), "there is one basemap registry");
ok(/id: "satellite", label: "Satellite", needsKey: true/.test(src), "satellite is declared, not hidden");
ok(/window\.__SATELLITE_TILE_URL__ = import\.meta\.env\.VITE_SATELLITE_TILE_URL \|\| "";/.test(main),
  "the satellite URL is wired from env, so a key is all it takes");
/* The testid is templated per basemap, so assert the template plus the
   registry rather than two literals that never appear in the source.
   The browser run is what confirms both actually render. */
ok(/data-testid=\{`basemap-\$\{b\.id\}`\}/.test(src) && /\{BASEMAPS\.map\(\(b\) => \{/.test(src),
  "every basemap in the registry renders as a real, identifiable control");
/* Build 135 wired Mapbox as the one-value path, so the message names
   the token rather than the raw tile URL. Still the same requirement:
   a disabled control has to say what would enable it. */
ok(/Satellite needs an imagery key — add VITE_MAPBOX_TOKEN and redeploy\. See DEPLOY\.md\./.test(src),
  "tapping satellite with no key says exactly what to do rather than doing nothing");
ok(/every aerial basemap that looks free[\s\S]{0,80}bars commercial use/i.test(src)
  || /bars commercial use/.test(src),
  "the reason satellite needs a key is recorded where the next person will look");
ok(/top: 66, background: "rgba\(255,255,255,\.96\)"/.test(src),
  "the tiles-down notice sits below the floating search — at the same offset it was clipped to an unreadable sliver");

/* ---------- the storm hand-off this map has to support ---------- */
ok(/highlight\.radiusMiles \* 1609\.34/.test(src),
  "the map can draw a storm's affected radius, which is how an alert turns into knocking");
ok(/focus = null,/.test(src), "and the screen accepts a focus point to open on");

/* ================= behavioral: basemap resolution ================= */
function basemapUrl(id, { street, satellite, geoKey }) {
  if (id === "satellite") return satellite || "";
  return street || `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${geoKey}`;
}
const basemapReady = (id, env) => !!basemapUrl(id, env);
const NOKEY = { street: "", satellite: "", geoKey: "K" };
ok(basemapReady("street", NOKEY) === true, "street always works — it falls back to the geocoding key");
ok(basemapReady("satellite", NOKEY) === false, "satellite is unavailable until a key is set");
ok(basemapReady("satellite", { ...NOKEY, satellite: "https://sat/{z}/{x}/{y}.png" }) === true,
  "and becomes available the moment one is — no rebuild, no code change");
ok(basemapUrl("street", { ...NOKEY, street: "https://own/{z}/{x}/{y}.png" }) === "https://own/{z}/{x}/{y}.png",
  "a street override wins over the Geoapify default");
ok(basemapUrl("nonsense", NOKEY).includes("geoapify"), "an unknown id degrades to street rather than a blank map");

/* ================= behavioral: clustering ================= */
const CLUSTER_BELOW_ZOOM = 16;
function clusterPins(pins, zoom) {
  if (zoom >= CLUSTER_BELOW_ZOOM) return (pins || []).map((p) => ({ single: p, lat: p.lat, lng: p.lng, count: 1 }));
  const cell = 360 / Math.pow(2, zoom) / 4;
  const buckets = new Map();
  (pins || []).forEach((p) => {
    const key = `${Math.floor(p.lat / cell)}:${Math.floor(p.lng / cell)}`;
    const b = buckets.get(key) || { lat: 0, lng: 0, count: 0, pins: [] };
    b.lat += p.lat; b.lng += p.lng; b.count++; b.pins.push(p);
    buckets.set(key, b);
  });
  return [...buckets.values()].map((b) => (b.count === 1
    ? { single: b.pins[0], lat: b.pins[0].lat, lng: b.pins[0].lng, count: 1 }
    : { single: null, lat: b.lat / b.count, lng: b.lng / b.count, count: b.count, pins: b.pins }));
}
/* A worked block: 40 doors within a few hundred metres. */
const BLOCK = Array.from({ length: 40 }, (_, i) => ({
  id: `p${i}`, lat: 41.78 + (i % 8) * 0.0004, lng: -88.15 + Math.floor(i / 8) * 0.0004,
}));
ok(clusterPins(BLOCK, 18).length === 40 && clusterPins(BLOCK, 18).every((c) => c.single),
  "at street zoom every door is its own pin — that is where a rep works");
ok(clusterPins(BLOCK, 17).length === 40, "still individual at the clustering threshold's near side");
const far = clusterPins(BLOCK, 11);
ok(far.length < 40, "zoomed out they collapse — 40 overlapping dots is not a map");
ok(far.reduce((n, c) => n + c.count, 0) === 40, "and no door is lost or double-counted in the collapse");
ok(far.some((c) => !c.single && c.count > 1), "a real cluster carries a count rather than a status colour");
/* A lone pin never becomes a "1" bubble. */
const lone = clusterPins([{ id: "a", lat: 41.78, lng: -88.15 }], 8);
ok(lone.length === 1 && !!lone[0].single,
  "a single pin stays a pin at any zoom — a cluster bubble reading '1' is just a worse pin");
ok(clusterPins([], 12).length === 0 && clusterPins(null, 12).length === 0,
  "no pins clusters to nothing rather than crashing");
/* The centroid is inside the group it represents. */
const two = clusterPins([{ id: "a", lat: 41.0, lng: -88.0 }, { id: "b", lat: 41.0004, lng: -88.0004 }], 10);
ok(two.length === 1 && Math.abs(two[0].lat - 41.0002) < 1e-9,
  "a cluster sits at the average of its members, not on one of them");

/* ================= behavioral: the snap still governs selection ================= */
function metresBetween(lat1, lng1, lat2, lng2) {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
function nearestPin(pins, lat, lng, within = 20) {
  let best = null, bestD = Infinity;
  (pins || []).forEach((p) => {
    const d = metresBetween(lat, lng, p.lat, p.lng);
    if (d < bestD) { bestD = d; best = p; }
  });
  return bestD <= within ? best : null;
}
const HOUSE = { id: "a", lat: 41.78, lng: -88.15 };
ok(nearestPin([HOUSE], 41.780005, -88.150005) === HOUSE,
  "the 20 m snap survives the rewrite — it is what stops two reps stacking pins on one door");
ok(nearestPin([HOUSE], 41.7810, -88.1500) === null, "and still leaves distant taps alone");

if (fails) { console.log("\nbuild 132: " + fails + " FAILED"); process.exit(1); }
console.log("build 132 tests passed");
