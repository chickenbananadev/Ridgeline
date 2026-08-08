/* Build 139 — "I can no longer drop pins on the map while canvassing."

   The live database told the story: after build 138 deployed, the rep
   could still UPDATE a pin (a disposition landed at 02:42 UTC) but not
   one new pin was INSERTED — and the only code unique to inserting was
   the duplicate guard at the top of dropPin. It refused to create a
   pin whenever ANY existing pin sat within 20 m of the crosshair,
   silently selecting that pin instead. Suburban lots run 15–25 m
   wide, so once build 138 made the map draggable on iOS and the first
   real door-to-door session began, every house NEXT DOOR to a pinned
   one was undroppable. The guard's own comment claimed 20 m "selects
   the house you meant without swallowing its neighbour" — it swallowed
   exactly the neighbour.

   The fix changes the dedupe's question from "within 20 m?" to "same
   DOOR?": only a crosshair essentially ON a pin (6 m) or a matching
   reverse-geocoded address selects the existing pin. Two smaller
   things ride along: the drop now reads the map's live centre instead
   of React's moveend echo of it, and `touch-action: none` comes off
   the .rl-map wrapper, where it was confiscating the pin sheet's
   touch-scrolling. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ============ 1. dedupe by door, not by disc ============ */
ok(/const PIN_SNAP_TIGHT_METRES = 6;/.test(src),
  "the proximity snap is 6 m — on the pin itself, under even rowhouse frontage");
ok(!/const PIN_SNAP_METRES = 20;/.test(src),
  "the 20 m disc is gone, not merely bypassed");
ok(/function resolveDropTarget\(pins, lat, lng, rev\) \{/.test(src),
  "the drop decision is one pure function, so the whole table below mirrors real code");
ok(/a 20 m disc swallowed exactly the neighbour/.test(src),
  "with the failure it replaces recorded where the constant lives");
ok(/const onTop = nearestPin\(pins, lat, lng, PIN_SNAP_TIGHT_METRES\);/.test(src),
  "crosshair on the pin still means that pin");
ok(/p\.address\.trim\(\)\.toLowerCase\(\) === addr\.trim\(\)\.toLowerCase\(\)/.test(src),
  "beyond that, the door's ADDRESS is what makes two drops the same door");
ok(/const target = resolveDropTarget\(list, lat, lng, rev\);/.test(src),
  "and dropPin actually asks it");
ok(/toast\(`Already pinned — \$\{target\.pin\.address \|\| "this door"\}`\)/.test(src),
  "selecting an existing door still says so out loud");
ok(/ended the first real door-to-door session four doors in/.test(src),
  "dropPin's comment records why the disc had to go");

/* ============ 2. the drop lands under the crosshair ============ */
ok(/mapApiRef = null,\s*\n\}\) \{/.test(src) || /swath = null, mapApiRef = null,/.test(src),
  "CanvassMap accepts a handle the parent can ask");
ok(/getCenter: \(\) => \{ const c = map\.getCenter\(\); return \{ lat: c\.lat, lng: c\.lng \}; \},/.test(src),
  "which reports the map's own centre");
ok(/if \(mapApiRef\) mapApiRef\.current = null;/.test(src),
  "and is nulled when the map unmounts, so a dead map can't answer");
ok(/const c = \(mapApiRef\.current && mapApiRef\.current\.getCenter\(\)\) \|\| center;\s*\n\s*await dropPin\(c\.lat, c\.lng\);/.test(src),
  "confirm-drop asks the live map where it is, with controlled state only as fallback");
ok(/pinning the house on screen and pinning wherever\s*\n\s+React last heard the map was/.test(src),
  "with the stale-state risk recorded at the call site");

/* ============ 3. the pin sheet gets its touches back ============ */
ok(/\.rl-map \{ overscroll-behavior: none; \}/.test(html),
  "the wrapper keeps the overscroll guard");
ok(!/\.rl-map \{ touch-action: none/.test(html),
  "but no longer confiscates every touch that starts inside it");
ok(/including the pin bottom sheet,\s*\n\s+which scrolls, and stopped scrolling under that rule/.test(html),
  "with the regression it caused recorded so nobody puts it back");
ok(/html, body \{ overscroll-behavior: none; \}/.test(html),
  "while the rule that actually stops iOS pull-to-refresh stays");

/* ============ behavioral: the decision table ============ */
function metresBetween(lat1, lng1, lat2, lng2) {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
const PIN_SNAP_TIGHT_METRES = 6;
function nearestPin(pins, lat, lng, within = PIN_SNAP_TIGHT_METRES) {
  let best = null, bestD = Infinity;
  (pins || []).forEach((p) => {
    const d = metresBetween(lat, lng, p.lat, p.lng);
    if (d < bestD) { bestD = d; best = p; }
  });
  return bestD <= within ? best : null;
}
function resolveDropTarget(pins, lat, lng, rev) {
  const onTop = nearestPin(pins, lat, lng, PIN_SNAP_TIGHT_METRES);
  if (onTop) return { kind: "existing", pin: onTop };
  const addr = rev && (rev.formatted || rev.street);
  if (addr) {
    const same = (pins || []).find((p) => p.address
      && p.address.trim().toLowerCase() === addr.trim().toLowerCase());
    if (same) return { kind: "existing", pin: same };
  }
  return { kind: "create", address: addr || "" };
}

/* A street. 0.0002° of longitude at this latitude is ~17 m — a lot
   width, the exact distance the 20 m disc used to swallow. */
const FIRST = { id: "a", lat: 41.78, lng: -88.15, address: "1113 Waycross Road" };
const rev = (formatted) => ({ formatted });

let r = resolveDropTarget([FIRST], 41.78, -88.1498, rev("1115 Waycross Road"));
ok(r.kind === "create",
  "THE BUG: the house next door (~17 m) with its own address is a NEW pin, not 'Already pinned'");
ok(r.kind === "create" && r.address === "1115 Waycross Road",
  "and the new pin carries the neighbour's address, not the first pin's");

r = resolveDropTarget([FIRST], 41.780002, -88.150002, rev("1113 Waycross Road"));
ok(r.kind === "existing" && r.pin === FIRST,
  "a drop right on the pin still selects it — second rep, same door");

r = resolveDropTarget([FIRST], 41.7803, -88.1503, rev("1113 Waycross Road"));
ok(r.kind === "existing" && r.pin === FIRST,
  "40 m away but geocoding to the SAME address is still that door — a long driveway is one house");

r = resolveDropTarget([FIRST], 41.7803, -88.1503, rev("1113 WAYCROSS ROAD  "));
ok(r.kind === "existing" && r.pin === FIRST,
  "the address match shrugs off case and stray whitespace — geocoders are not consistent");

r = resolveDropTarget([FIRST], 41.78, -88.1498, null);
ok(r.kind === "create" && r.address === "",
  "no geocoder answer (rural, offline): 17 m out still creates, with an empty address");

r = resolveDropTarget([FIRST], 41.780002, -88.150002, null);
ok(r.kind === "existing" && r.pin === FIRST,
  "no geocoder answer but crosshair ON the pin: still the same door");

r = resolveDropTarget([{ ...FIRST, address: "" }], 41.7803, -88.1503, rev("1113 Waycross Road"));
ok(r.kind === "create",
  "a pin that never got an address can only be matched by proximity — empty never equals empty");

r = resolveDropTarget([], 41.78, -88.15, rev("1113 Waycross Road"));
ok(r.kind === "create", "an empty street always drops a new pin");
r = resolveDropTarget(null, 41.78, -88.15, null);
ok(r.kind === "create", "no pin list at all doesn't crash the drop");

/* The tight radius itself: 6 m must sit below rowhouse frontage (~5–6 m
   is the narrowest US rowhouse; two DOORS are farther apart than that
   centre-to-centre distance only when lots are wider, which they are
   everywhere the 20 m disc was failing). And ~17 m — a normal lot —
   must be outside it. */
ok(metresBetween(41.78, -88.15, 41.78, -88.1498) > PIN_SNAP_TIGHT_METRES,
  "a neighbouring lot (~17 m) is outside the tight snap: " + Math.round(metresBetween(41.78, -88.15, 41.78, -88.1498)) + " m");
ok(metresBetween(41.78, -88.15, 41.780002, -88.150002) < PIN_SNAP_TIGHT_METRES,
  "while a drop essentially on the pin is inside it");

if (fails) { console.log("\nbuild 139: " + fails + " FAILED"); process.exit(1); }
console.log("build 139 tests passed");
