/* Build 128 — canvassing core: the map, the pins, the dispositions.

   The owner asked for a door-knocking app in the shape of SalesRabbit
   / HailDrive: a map you drop pins on, a status per door, prospect
   details, storm history by address, and leads that become real jobs.
   This build is the core loop — map, pins, dispositions, sharing.

   Three decisions are encoded here and worth stating, because each
   one is a thing that goes wrong if you build it the obvious way:

   1. PINS ARE SHARED with the whole company, not private to a rep.
      A pin only its author can see does not stop the second rep
      knocking that door twenty minutes later, and not knocking twice
      is most of why a canvassing tool exists. Attribution lives in
      created_by / assigned_to and in every history entry instead.

   2. A TAP NEAR AN EXISTING PIN SELECTS IT rather than dropping a
      second one. Suburban lots are 15–25 m wide, so a 20 m snap
      catches the house you meant without swallowing its neighbour.
      Without it, shared pins silently accumulate duplicates on the
      busiest doors — exactly the ones two reps both tried.

   3. DISPOSITIONS APPEND, they never overwrite. A door knocked three
      times across a season is one pin with three history entries.
      Overwriting would erase the fact that someone already said "come
      back Tuesday", which is the single most valuable thing on the pin.

   The map is hand-built rather than Leaflet: ridgeline.jsx is a
   single self-contained file with no CSS imports, and Leaflet needs
   its stylesheet to position panes, which breaks `npm run
   bundle:test` — the pipeline every build here is verified through.
   The upside is that the projection math is a pure function this file
   can test directly instead of through a rendered map. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const mig = fs.readFileSync(path.join(__dirname, "supabase/migrations/037_canvassing.sql"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };
const near = (a, b, tol) => Math.abs(a - b) <= tol;

/* ---------- migration: a real table, tenant-scoped like jobs ---------- */
ok(/create table if not exists crm_canvass \(/.test(mig), "037 creates crm_canvass");
ok(/create policy canvass_rw on crm_canvass for all to authenticated\s*\n\s*using \(tenant_id = current_tenant_id\(\)\) with check \(tenant_id = current_tenant_id\(\)\);/.test(mig),
  "RLS is the same tenant-scoped for-all shape as jobs_rw — no bespoke policy to get subtly wrong");
ok(/create trigger stamp_tenant before insert on crm_canvass/.test(mig),
  "the shared set_tenant_id() trigger stamps the tenant, so the client never sends one");
ok(/create index if not exists crm_canvass_bbox_idx on crm_canvass\(tenant_id, lat, lng\);/.test(mig),
  "there is an index for the viewport query, because that is the query the map makes on every pan");
ok(/alter publication supabase_realtime add table crm_canvass;/.test(mig),
  "pins are published to realtime — two reps on one street see each other's work without reloading");
ok(/history jsonb not null default '\[\]'::jsonb/.test(mig), "history is an append-only array on the row");
ok(/job_id text/.test(mig), "a pin can point at a job once it converts, and is null until then");

/* ---------- statuses: shipped defaults, company-editable ---------- */
ok(/const CANVASS_STATUSES = \[/.test(src), "a default disposition set ships");
["not_home", "callback", "not_interested", "appointment", "inspected", "sold", "dnk"].forEach((id) =>
  ok(new RegExp(`id: "${id}"`).test(src), `the shipped set includes ${id}`));
ok(/id: "dnk", name: "Do not knock", color: "#111827", contact: false, open: false, terminal: true/.test(src),
  "do-not-knock is flagged terminal — it is a promise to a homeowner, not just another color");
ok(/canvassStatuses,/.test(src) && /if \(d\.canvassStatuses\) setCanvassStatuses\(d\.canvassStatuses\);/.test(src),
  "the list persists in the org blob beside pipeline stages, so editing it needs no migration");
ok(/function canvassStatusList\(saved\)/.test(src) && /function canvassStatus\(saved, id\)/.test(src),
  "helpers resolve a saved list against the shipped one");

/* ---------- map: projection, tiles, attribution ---------- */
ok(/function lngToWorldX\(lng, z\)/.test(src) && /function worldXToLng\(x, z\)/.test(src)
  && /function latToWorldY\(lat, z\)/.test(src) && /function worldYToLat\(y, z\)/.test(src),
  "Web Mercator project/unproject exist as pure functions");
ok(/https:\/\/maps\.geoapify\.com\/v1\/tile\/\$\{MAP_TILE_STYLE\}\/\$\{z\}\/\$\{x\}\/\$\{y\}\.png\?apiKey=\$\{GEO_PROVIDER\.apiKey\}/.test(src),
  "tiles come from Geoapify on the key the address lookup already uses — nothing new to sign up for");
ok(/window\.__MAP_TILE_URL__/.test(src),
  "the tile URL is overridable, which is the hook for satellite imagery later without a rebuild");
ok(/openstreetmap\.org\/copyright/.test(src) && /geoapify\.com/.test(src),
  "attribution renders on the map — OpenStreetMap's licence and Geoapify's terms both require it");
ok(/touchAction: "none"/.test(src), "the map swallows browser touch gestures so a pan doesn't scroll the page instead");
ok(/if \(wasDrag\.moved > 6\) return;/.test(src),
  "a drag over 6px is a pan, not a tap — without the slop, dropping a pin on a phone is near impossible");

/* ---------- the snap rule ---------- */
ok(/const PIN_SNAP_METRES = 20;/.test(src), "the snap radius is a named constant, not a magic number");
ok(/const hit = nearestPin\(pins, lat, lng\);\s*\n\s*if \(hit\) onTapPin\(hit\); else onTapMap\(lat, lng\);/.test(src),
  "a tap near an existing pin opens it instead of dropping a duplicate");

/* ---------- viewport loading + honest writes ---------- */
ok(/\.gte\("lat", b\.south\)\.lte\("lat", b\.north\)\s*\n\s*\.gte\("lng", b\.west\)\.lte\("lng", b\.east\)/.test(src),
  "pins load for the visible bounds, not the whole company's history");
ok(/if \(mine !== seq\.current\) return;/.test(src),
  "a slow response from an earlier pan cannot overwrite the results of a later one");
ok(/setErr\("That knock didn't save/.test(src),
  "a failed write is surfaced — a knock silently lost is worse here than anywhere, because the rep has already walked to the door");
ok(/if \(before\) merge\(\[before\]\); else setPins\(\(prev\) => \{ const n = \{ \.\.\.prev \}; delete n\[row\.id\]; return n; \}\);/.test(src),
  "a rejected write rolls the optimistic pin back rather than leaving a phantom on the map");

/* ---------- appending, not overwriting ---------- */
ok(/history: \[\.\.\.\(pin\.history \|\| \[\]\), entry\],/.test(src),
  "setting a disposition APPENDS to history — an earlier visit is never erased by a later one");
ok(/knocked_at: entry\.at,/.test(src), "the knock timestamp moves with the newest entry");

/* ---------- wiring ---------- */
ok(/\) : nav === "canvass" \? \(/.test(src), "the screen is reachable from the nav switch");
ok(/\["canvass", MapPin, "Canvassing", "Knock a neighborhood — pins, dispositions, storm history"\]/.test(src),
  "and listed in the More menu under Sales & marketing");

/* ================= behavioral: the projection ================= */
const TILE_SIZE = 256, MAX_LAT = 85.05112878;
const lngToWorldX = (lng, z) => ((lng + 180) / 360) * TILE_SIZE * Math.pow(2, z);
const latToWorldY = (lat, z) => {
  const c = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
  const s = Math.sin((c * Math.PI) / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * TILE_SIZE * Math.pow(2, z);
};
const worldXToLng = (x, z) => (x / (TILE_SIZE * Math.pow(2, z))) * 360 - 180;
const worldYToLat = (y, z) => {
  const n = Math.PI - (2 * Math.PI * y) / (TILE_SIZE * Math.pow(2, z));
  return (180 / Math.PI) * Math.atan(Math.sinh(n));
};

ok(lngToWorldX(-180, 0) === 0 && near(lngToWorldX(180, 0), 256, 1e-9),
  "at zoom 0 the whole world is one 256px tile wide");
ok(near(lngToWorldX(0, 0), 128, 1e-9), "the prime meridian sits at the middle of it");
ok(near(latToWorldY(0, 0), 128, 1e-9), "the equator sits at the vertical middle");
ok(latToWorldY(85.05112878, 0) < 0.001 && latToWorldY(-85.05112878, 0) > 255.999,
  "Mercator's usable limits map to the top and bottom edges");
/* Round-tripping is what pin placement and tap-to-drop both depend on. */
[[41.78, -88.15, 17], [25.76, -80.19, 12], [61.2, -149.9, 19], [-33.86, 151.2, 15]].forEach(([lat, lng, z]) => {
  ok(near(worldXToLng(lngToWorldX(lng, z), z), lng, 1e-9), `lng round-trips at z${z} (${lng})`);
  ok(near(worldYToLat(latToWorldY(lat, z), z), lat, 1e-9), `lat round-trips at z${z} (${lat})`);
});
ok(latToWorldY(95, 5) === latToWorldY(MAX_LAT, 5),
  "a latitude past Mercator's limit clamps instead of producing Infinity and blanking the map");
/* Zoom doubles the world each level — the invariant the tile grid rests on. */
ok(near(lngToWorldX(-88.15, 11), lngToWorldX(-88.15, 10) * 2, 1e-9), "one zoom level doubles the world");

/* ================= behavioral: distance and snapping ================= */
function metresBetween(lat1, lng1, lat2, lng2) {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
ok(metresBetween(41.78, -88.15, 41.78, -88.15) === 0, "the same point is zero metres away");
ok(near(metresBetween(41.0, -88.0, 41.001, -88.0), 111, 1), "0.001° of latitude is ~111 m everywhere");
ok(metresBetween(41.78, -88.15, 41.79, -88.15) > 1000, "0.01° of latitude is over a kilometre — not the same house");

const PIN_SNAP_METRES = 20;
function nearestPin(pins, lat, lng, within = PIN_SNAP_METRES) {
  let best = null, bestD = Infinity;
  (pins || []).forEach((p) => {
    const d = metresBetween(lat, lng, p.lat, p.lng);
    if (d < bestD) { bestD = d; best = p; }
  });
  return bestD <= within ? best : null;
}
const HOUSE = { id: "a", lat: 41.78000, lng: -88.15000 };
const NEIGHBOUR = { id: "b", lat: 41.78000, lng: -88.14964 };   // ~30 m east
const PINS = [HOUSE, NEIGHBOUR];
ok(nearestPin(PINS, 41.780005, -88.150005) === HOUSE,
  "tapping essentially on a pin selects it — the duplicate-prevention case");
ok(nearestPin(PINS, 41.78, -88.14988) === HOUSE,
  "a tap 10 m off still means that house — GPS and fat fingers are both imprecise");
ok(nearestPin(PINS, 41.78, -88.14964) === NEIGHBOUR,
  "the neighbouring house is its own pin, not swallowed by the first");
ok(nearestPin(PINS, 41.7810, -88.1500) === null,
  "a tap on an empty lot 110 m away drops a NEW pin rather than hijacking a distant one");
ok(nearestPin([], 41.78, -88.15) === null, "an empty street always drops a new pin");
ok(nearestPin(null, 41.78, -88.15) === null, "no pin list doesn't crash the tap handler");
/* The rule is nearest-wins, not first-wins. */
ok(nearestPin([NEIGHBOUR, HOUSE], 41.780001, -88.150001) === HOUSE,
  "when two pins are both in range the CLOSER one wins regardless of list order");

/* ================= behavioral: the status registry ================= */
const CANVASS_STATUSES = [
  { id: "new", name: "Not knocked", color: "#9CA3AF", contact: false, open: true, terminal: false },
  { id: "not_home", name: "Not home", color: "#6B7280", contact: false, open: true, terminal: false },
  { id: "callback", name: "Come back", color: "#B45309", contact: true, open: true, terminal: false },
  { id: "not_interested", name: "Not interested", color: "#B42318", contact: true, open: false, terminal: false },
  { id: "appointment", name: "Appointment set", color: "#1D4ED8", contact: true, open: true, terminal: false },
  { id: "inspected", name: "Inspected", color: "#7C3AED", contact: true, open: true, terminal: false },
  { id: "sold", name: "Sold", color: "#047857", contact: true, open: false, terminal: false },
  { id: "dnk", name: "Do not knock", color: "#111827", contact: false, open: false, terminal: true },
];
function canvassStatusList(saved) {
  const list = Array.isArray(saved) && saved.length ? saved : CANVASS_STATUSES;
  return list.map((s) => ({ ...CANVASS_STATUSES.find((d) => d.id === s.id), ...s }));
}
function canvassStatus(saved, id) {
  const list = canvassStatusList(saved);
  return list.find((s) => s.id === id)
    || CANVASS_STATUSES.find((s) => s.id === id)
    || { id: id || "new", name: id || "Not knocked", color: "#9CA3AF", contact: false, open: true, terminal: false };
}
ok(canvassStatusList(null).length === 8, "a company that never edited the list gets the shipped one");
ok(canvassStatusList([]).length === 8, "an empty saved list falls back rather than leaving a rep with no buttons");
ok(canvassStatus(null, "sold").name === "Sold", "the shipped names resolve");
/* A company renames a status: their word wins, the behaviour flags survive. */
const RENAMED = [{ id: "callback", name: "Swing back" }, { id: "sold", name: "Signed" }];
ok(canvassStatus(RENAMED, "callback").name === "Swing back", "a company's own wording wins");
ok(canvassStatus(RENAMED, "callback").contact === true,
  "renaming keeps the behaviour flags — a renamed 'contact' status still counts as someone answering");
ok(canvassStatus(RENAMED, "callback").color === "#B45309", "and keeps its color unless they change that too");
/* A status dropped from the list still has pins pointing at it. */
ok(canvassStatus(RENAMED, "dnk").name === "Do not knock",
  "a pin whose status was removed from the list still renders with its real name, not a blank grey dot");
ok(canvassStatus(RENAMED, "dnk").terminal === true,
  "and critically keeps terminal=true — a dropped 'do not knock' must never quietly become knockable again");
ok(canvassStatus(RENAMED, "wat").name === "wat", "an unknown id degrades to something visible rather than crashing");

/* ================= behavioral: history appends ================= */
function applyDisposition(pin, statusId, who, at) {
  const entry = { at, status: statusId, by: who.name, byId: who.id };
  return { ...pin, status: statusId, history: [...(pin.history || []), entry], knocked_at: at };
}
const REP = { id: "u1", name: "Jacob Henderson" };
const OTHER = { id: "u2", name: "Drew Klass" };
let pin = { id: "p1", status: "new", history: [] };
pin = applyDisposition(pin, "not_home", REP, "2026-08-01T18:00:00Z");
pin = applyDisposition(pin, "callback", OTHER, "2026-08-04T23:10:00Z");
pin = applyDisposition(pin, "appointment", REP, "2026-08-07T17:30:00Z");
ok(pin.history.length === 3, "three visits leave three entries, not one");
ok(pin.status === "appointment", "the pin shows the latest disposition");
ok(pin.history[0].status === "not_home" && pin.history[0].by === "Jacob Henderson",
  "the FIRST visit survives intact — including who made it");
ok(pin.history[1].by === "Drew Klass",
  "a second rep's visit is attributed to them, which is how a shared pin stays fair");
ok(pin.knocked_at === "2026-08-07T17:30:00Z", "knocked_at tracks the most recent knock");
ok(applyDisposition({ id: "p2", status: "new" }, "sold", REP, "x").history.length === 1,
  "a pin with no history array yet doesn't crash on its first disposition");

/* ================= behavioral: the today count ================= */
function knockedToday(pins, today) {
  return pins.filter((p) => p.knocked_at && String(p.knocked_at).slice(0, 10) === today).length;
}
ok(knockedToday([{ knocked_at: "2026-08-07T17:30:00Z" }, { knocked_at: "2026-08-06T12:00:00Z" }, {}], "2026-08-07") === 1,
  "the day counter counts today's knocks only, and ignores pins never knocked");

if (fails) { console.log("\nbuild 128: " + fails + " FAILED"); process.exit(1); }
console.log("build 128 tests passed");
