/* Build 28 — geocoding chain and the manual escape hatch.
   "It cannot find the house" was a silent single-provider failure. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- coordinate paste: the path that needs no network at all --- */
function parseLatLon(text) {
  const m = String(text || "").match(/(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
  if (!m) return null;
  const lat = Number(m[1]), lon = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}
ok(parseLatLon("39.2896, -84.5230").lat === 39.2896, "plain coordinates parse");
ok(parseLatLon("39.2896,-84.5230") !== null, "no space still parses");
ok(parseLatLon("  39.2896 , -84.5230  ") !== null, "padding is tolerated");
ok(parseLatLon("Dropped pin 39.2896, -84.5230") !== null,
  "surrounding text is tolerated — phones paste more than the numbers");
ok(parseLatLon("38.6412, -83.7443").lon === -83.7443, "a Kentucky pin parses");
ok(parseLatLon("1099 Waycross Road") === null, "an address is not mistaken for coordinates");
ok(parseLatLon("") === null, "empty is rejected");
ok(parseLatLon(null) === null, "null does not throw");
ok(parseLatLon("200.5, -84.5") === null, "an impossible latitude is rejected");
ok(parseLatLon("39.2896, -184.5") === null, "an impossible longitude is rejected");
ok(parseLatLon("39, -84") === null, "whole numbers are not treated as coordinates");

/* --- the chain --- */
ok(src.includes("const GEOCODERS"), "several providers are defined");
ok(src.includes("nominatim.openstreetmap.org"), "OpenStreetMap is one of them");
ok(src.includes("geocoding.geo.census.gov"), "the US Census geocoder is one of them");
ok(src.includes("async function geocodeAddress"), "the chain has a single entry point");
ok(src.includes("return { failed: true, tried"), "failure returns what was tried, not null");
ok(src.includes("via: g.label"), "success records which provider answered");

/* order matters: the keyless CORS-friendly one first, the keyed one last */
const iNom = src.indexOf('id: "nominatim"');
const iCen = src.indexOf('id: "census"');
const iGeo = src.indexOf('id: "geoapify"');
ok(iNom > 0 && iCen > iNom, "OpenStreetMap is tried before the Census geocoder");
ok(iGeo > iCen, "the key-dependent provider is tried last");

/* --- failure is visible --- */
ok(src.includes("{tried.map((t, i) =>"), "each provider's failure is shown");
ok(src.includes("Could not find it"), "the failure is labelled plainly");
ok(src.includes("Try a simpler address"), "and suggests what to do next");
ok(!src.includes("const hits = await geoAutocomplete(query || job.address"),
  "the old silent autocomplete path is gone");

/* --- the escape hatch is always present, not only after a failure --- */
ok(src.includes("Or search manually"), "a manual search box exists");
ok(src.includes('data-testid="manual-locate"'), "and is reachable");
ok(src.includes("Long-press the roof in any map app"), "pasting coordinates is explained");
ok(src.includes("Search again"), "the search can be redone from the map");
ok(src.includes("Searching for {jobQuery}"), "the address being searched is shown up front");
ok(src.includes("No address on this job"), "a job with no address says so rather than failing silently");

/* --- what was found is reported --- */
ok(src.includes("via {via}"), "the provider that answered is named");
ok(src.includes('setVia("coordinates")'), "a pasted pin is labelled as such");

if (fails) { console.log("\nbuild 28: " + fails + " FAILED"); process.exit(1); }
console.log("build 28 tests passed");
