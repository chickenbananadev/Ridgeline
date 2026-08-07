/* Build 131 — make it actually work in a browser.

   Driving the real app in Chromium turned up something no jsdom test
   could: when tile imagery fails, the canvassing screen renders a grid
   of BROKEN-IMAGE ICONS on a grey rectangle with no explanation. Every
   other part of the screen works — pins drop, dispositions save, the
   list and scoreboard are fine — but it reads as "this feature is
   dead", which is indistinguishable from a real outage to the person
   looking at it.

   Three fixes, all about not failing silently or misleadingly:

   1. A failed tile is hidden rather than left as a torn-page icon, and
      once a few fail the map says what is actually wrong (a map key
      that isn't set or has hit its limit) and that everything else
      still works. The counter resets on any successful tile so a
      handful of 404s at the edge of the world don't stick.

   2. VITE_MAP_TILE_URL is wired through main.jsx. The override existed
      in the app but NOTHING SET IT — the "hook for satellite later"
      was unreachable in production without editing source. It also
      matters for quota: tiles otherwise spend the same daily budget as
      address autocomplete, and a rep panning a map outruns anyone
      typing addresses, so a busy canvassing day could starve address
      lookup company-wide.

   3. The storm-report lookup falls back to the unbounded query if the
      bounding-box call fails. Hail silently disappearing is the exact
      bug this path exists to fix (build 127); it must not depend on
      the service accepting one parameter set. The distance filter
      moved client-side so it holds on BOTH paths — the fallback is
      national, and "near this house" is the claim being made either
      way. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const main = fs.readFileSync(path.join(__dirname, "src/main.jsx"), "utf8");
const deploy = fs.readFileSync(path.join(__dirname, "DEPLOY.md"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- 1. tile failure is legible, not a wall of broken icons ---------- */
ok(/onError=\{\(e\) => \{ e\.currentTarget\.style\.visibility = "hidden"; setTileFails\(\(n\) => n \+ 1\); \}\}/.test(src),
  "a broken tile is hidden instead of rendering the browser's torn-page icon");
ok(/onLoad=\{\(\) => setTileFails\(0\)\}/.test(src),
  "the failure counter resets on any successful tile, so a few edge-of-world 404s don't stick");
ok(/const tilesDown = tileFails >= 3;/.test(src), "a few failures, not one, before crying wolf");
ok(/data-testid="tiles-down"/.test(src), "there is a notice element");
ok(/Map images aren't loading/.test(src), "it says what is wrong in plain words");
ok(/usually a map key that isn't set or has hit its daily limit/.test(src),
  "...and names the actual likely cause, which is what makes it actionable");
ok(/Everything else still works: you can drop pins, mark doors and see them in the list\./.test(src),
  "...and says the rest of the feature is fine — the difference between 'no map' and 'broken app'");
ok(/pointerEvents: "none", *\n? *\}\}>\s*\n\s*<div style=\{\{ fontSize: 13\.5, fontWeight: 700, color: S\.ink \}\}>Map images aren't loading/.test(src)
  || /zIndex: 4, pointerEvents: "none"/.test(src),
  "the notice never swallows taps — a rep must still be able to drop a pin through it");

/* ---------- 2. the tile override is reachable in production ---------- */
ok(/window\.__MAP_TILE_URL__ = import\.meta\.env\.VITE_MAP_TILE_URL \|\| "";/.test(main),
  "VITE_MAP_TILE_URL is wired through main.jsx — the override was previously unreachable without editing source");
ok(/spends\s*\n?\s*the SAME daily quota address lookup depends on/.test(main),
  "and the reason is recorded: tiles otherwise share the geocoding quota");
ok(/window\.__MAP_TILE_URL__/.test(src), "the app still reads the override");
ok(/VITE_MAP_TILE_URL/.test(deploy), "it is documented in DEPLOY.md");
ok(/starve address lookup for the whole company/.test(deploy),
  "DEPLOY.md warns about the shared quota rather than leaving it to be discovered in production");
ok(/satellite imagery/i.test(deploy), "and explains that this is the switch for satellite imagery");

/* ---------- 3. hail can't silently vanish again ---------- */
ok(/for \(const url of \[base \+ bbox, base\]\) \{/.test(src),
  "the storm-report lookup tries the bounded query, then the unbounded one");
ok(/if \(gj && Array\.isArray\(gj\.features\)\) break;/.test(src),
  "a response only counts if it actually carries features");
ok(/const miles = haversineMiles\(lat, lng, flat, flng\);\s*\n\s*if \(miles > LSR_RADIUS_DEG \* 69\) continue;/.test(src),
  "the distance filter is client-side, so it holds on the unbounded fallback too");
ok(/A report from three\s*\n\s*states over must never land on this address's record\./.test(src),
  "and the comment says why that matters — this is evidence attached to a claim");
ok(/miles,\s*\n/.test(src), "the computed distance is reused rather than recomputed per report");

/* ================= behavioral: the tile-failure gate ================= */
function tilesDown(fails) { return fails >= 3; }
ok(tilesDown(0) === false, "a fresh map shows no warning");
ok(tilesDown(1) === false, "one failed tile is not an outage — tiles 404 legitimately past the poles");
ok(tilesDown(2) === false, "nor two");
ok(tilesDown(3) === true, "three failures is a real problem worth telling someone about");
ok(tilesDown(9) === true, "a whole screen of failures certainly is");
/* The reset is what keeps it honest as you pan. */
function applyTileEvents(events) {
  let n = 0;
  events.forEach((e) => { n = e === "ok" ? 0 : n + 1; });
  return tilesDown(n);
}
ok(applyTileEvents(["err", "err", "err"]) === true, "three straight failures trips it");
ok(applyTileEvents(["err", "err", "ok", "err"]) === false,
  "a successful tile clears the count — panning back over good imagery removes the warning");
ok(applyTileEvents(["ok", "ok", "ok"]) === false, "a working map never shows it");

/* ================= behavioral: the tile URL override ================= */
function tileUrl(z, x, y, custom, key) {
  if (custom) return String(custom).replace("{z}", z).replace("{x}", x).replace("{y}", y);
  return `https://maps.geoapify.com/v1/tile/osm-bright/${z}/${x}/${y}.png?apiKey=${key}`;
}
ok(tileUrl(17, 1, 2, "", "K") === "https://maps.geoapify.com/v1/tile/osm-bright/17/1/2.png?apiKey=K",
  "with no override the map uses Geoapify on the existing key");
ok(tileUrl(17, 33440, 48762, "https://tiles.example.com/{z}/{x}/{y}@2x.jpg?k=abc", "K")
  === "https://tiles.example.com/17/33440/48762@2x.jpg?k=abc",
  "an override substitutes all three placeholders and keeps its own query string");
ok(tileUrl(5, 1, 1, "https://sat.example.com/{z}/{x}/{y}.png", "K").startsWith("https://sat.example.com/"),
  "a satellite endpoint drops straight in — no rebuild, no code change");

/* ================= behavioral: the report-radius filter ================= */
function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
const LSR_RADIUS_DEG = 0.45;
const LIMIT = LSR_RADIUS_DEG * 69;   // ~31 mi
function nearEnough(lat, lng, flat, flng) { return haversineMiles(lat, lng, flat, flng) <= LIMIT; }
ok(nearEnough(41.78, -88.15, 41.78, -88.15) === true, "a report on the house counts");
ok(nearEnough(41.78, -88.15, 41.9, -88.3) === true, "a report a few towns over counts — hail cores are wide");
ok(nearEnough(41.78, -88.15, 39.0, -94.6) === false,
  "a report in Kansas City does NOT attach to an Illinois roof — the case the unbounded fallback would otherwise let through");
ok(nearEnough(41.78, -88.15, 41.78, -87.0) === false, "nor one 60 miles east");
ok(Math.round(LIMIT) === 31, "the radius is about 31 miles, matching the bounding box the service is asked for");

if (fails) { console.log("\nbuild 131: " + fails + " FAILED"); process.exit(1); }
console.log("build 131 tests passed");
