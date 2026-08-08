/* Build 135 — satellite imagery, actually turned on.

   Build 132 shipped the Street/Satellite control with the provider
   plumbing behind it but no imagery, because every genuinely free
   aerial basemap bars commercial use. The owner picked Mapbox, so this
   wires it as the one-value path: paste a token, satellite works.

   Three things are guarded, and two of them are licensing rather than
   correctness:

   1. THE OVERRIDE MUST STILL WIN. A company already paying for Google
      or MapTiler should never have to open a Mapbox account. A full
      tile template takes precedence over the token.

   2. ATTRIBUTION MUST FOLLOW THE IMAGERY. Printing Mapbox's credit
      over Google's tiles is both wrong and a licence breach. The
      moment a custom endpoint is set, the Mapbox credit must not
      appear.

   3. A DEAD CONTROL MUST STILL EXPLAIN ITSELF. With no key at all,
      satellite stays visible and disabled and names the exact variable
      that would enable it — never a button that silently does
      nothing. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const main = fs.readFileSync(path.join(__dirname, "src/main.jsx"), "utf8");
const deploy = fs.readFileSync(path.join(__dirname, "DEPLOY.md"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ================= 1. the token is wired ================= */
ok(/window\.__MAPBOX_TOKEN__ = import\.meta\.env\.VITE_MAPBOX_TOKEN \|\| "";/.test(main),
  "the Mapbox token is read from env in the composition root");
ok(/window\.__SATELLITE_ATTRIBUTION__ = import\.meta\.env\.VITE_SATELLITE_ATTRIBUTION \|\| "";/.test(main),
  "and so is the attribution that has to accompany any non-Mapbox provider");
ok(/const token = window\.__MAPBOX_TOKEN__;/.test(src), "the satellite basemap reads that token");
ok(/https:\/\/api\.mapbox\.com\/v4\/mapbox\.satellite\/\{z\}\/\{x\}\/\{y\}@2x\.jpg90\?access_token=\$\{token\}/.test(src),
  "and builds Mapbox's raster tile URL from it — @2x for retina, jpg90 because aerial photography doesn't need PNG");
ok(/if \(window\.__SATELLITE_TILE_URL__\) return window\.__SATELLITE_TILE_URL__;/.test(src),
  "a full tile template WINS over the token, so a company on another provider never needs a Mapbox account");
ok(/a company already paying for Google or MapTiler\s*\n       pastes their template and never touches the token/.test(src),
  "and the comment says why that precedence is that way round");
ok(/return token\s*\n\s*\? `https:\/\/api\.mapbox\.com/.test(src),
  "with no token and no override the URL is empty, which is what keeps the control disabled");

/* ================= 2. attribution follows the imagery ================= */
ok(/function basemapAttribution\(id\) \{/.test(src),
  "attribution is resolved by a function, not read straight off the registry");
ok(/attribution: basemapAttribution\(basemapId\)/.test(src),
  "and that function is what the tile layer is given");
ok(/return window\.__SATELLITE_ATTRIBUTION__ \|\| "Satellite imagery";/.test(src),
  "a custom endpoint gets its own credit, falling back to a neutral label rather than someone else's name");
ok(/printing Mapbox's name over Google's\s*\n   tiles would be both wrong and a licence breach/.test(src),
  "with the licensing reason recorded, because this looks like cosmetics and isn't");
ok(/attribution: '© <a href="https:\/\/www\.mapbox\.com\/about\/maps\/">Mapbox<\/a> · '/.test(src),
  "the Mapbox entry carries Mapbox's required credit — the placeholder from build 132 is gone");
ok(!/attribution: "Satellite imagery",/.test(src),
  "and the placeholder is not still sitting in the registry");
ok(/© <a href="https:\/\/www\.openstreetmap\.org\/copyright">OpenStreetMap<\/a>/.test(src.slice(src.indexOf("id: \"satellite\""), src.indexOf("id: \"satellite\"") + 900)),
  "including the OpenStreetMap credit Mapbox's terms also require");

/* ================= 3. the disabled control still explains itself ================= */
ok(/Satellite needs an imagery key — add VITE_MAPBOX_TOKEN and redeploy\. See DEPLOY\.md\./.test(src),
  "tapping satellite with no key names the exact variable that would enable it");
ok(/id: "satellite", label: "Satellite", needsKey: true,/.test(src),
  "the entry still declares that it needs a key");
ok(/function basemapReady\(id\) \{ return !!basemap\(id\)\.url\(\); \}/.test(src),
  "and readiness is derived from whether a URL resolves, not from a separate flag that could drift");

/* ================= 4. the instructions are followable ================= */
ok(/\| `VITE_MAPBOX_TOKEN` \| canvassing satellite imagery \(optional — see below\) \|/.test(deploy),
  "DEPLOY.md lists the token in the env-var table");
ok(/\| `VITE_SATELLITE_ATTRIBUTION` \| required alongside `VITE_SATELLITE_TILE_URL` \|/.test(deploy),
  "and marks the attribution as REQUIRED with a custom endpoint, not optional");
ok(/Sign up at \[mapbox\.com\]\(https:\/\/account\.mapbox\.com\/auth\/signup\/\)\. No card is\s+required to get a token\./.test(deploy),
  "with the actual signup URL and whether a card is needed");
ok(/it starts `pk\.`/.test(deploy), "and how to recognise the right token");
ok(/A public token is the right kind — it ships in the browser bundle, which is\s+how all tile providers work\./.test(deploy),
  "reassuring the deployer that a public token in the bundle is normal, not a leak");
ok(/Restrict it to your domain under\s+Account → Tokens → URL restrictions\./.test(deploy),
  "while still telling them to restrict it");
ok(/\*\*200,000 tile\nrequests a month\*\*/.test(deploy), "the free allowance is stated");
ok(/a rep working a\nneighbourhood for an hour is on the order of a few hundred/.test(deploy),
  "in terms of actual canvassing rather than an abstract number");
ok(/check current rates on Mapbox's pricing page before\ncommitting a large team/.test(deploy),
  "and points at the live pricing rather than quoting a rate that will go stale");
ok(/the app deliberately will not print Mapbox's name\nover someone else's imagery/.test(deploy),
  "the attribution rule is explained where someone switching providers will read it");

/* ================= behavioral: URL resolution ================= */
function satelliteUrl(win) {
  if (!win) return "";
  if (win.__SATELLITE_TILE_URL__) return win.__SATELLITE_TILE_URL__;
  const token = win.__MAPBOX_TOKEN__;
  return token ? `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=${token}` : "";
}
function basemapReady(win) { return !!satelliteUrl(win); }

ok(satelliteUrl({}) === "", "no token and no override resolves to nothing");
ok(basemapReady({}) === false, "so the control is not usable");
ok(basemapReady({ __MAPBOX_TOKEN__: "pk.abc" }) === true, "a token alone makes it usable");
ok(satelliteUrl({ __MAPBOX_TOKEN__: "pk.abc" })
  === "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.abc",
  "and produces Mapbox's endpoint with the token in it");
ok(satelliteUrl({ __MAPBOX_TOKEN__: "pk.abc" }).includes("{z}")
  && satelliteUrl({ __MAPBOX_TOKEN__: "pk.abc" }).includes("{x}")
  && satelliteUrl({ __MAPBOX_TOKEN__: "pk.abc" }).includes("{y}"),
  "keeping the placeholders the map engine substitutes per tile");
ok(satelliteUrl({ __SATELLITE_TILE_URL__: "https://other.example/{z}/{x}/{y}.jpg", __MAPBOX_TOKEN__: "pk.abc" })
  === "https://other.example/{z}/{x}/{y}.jpg",
  "an override beats the token even when BOTH are set — the case where someone pastes a template and forgets to clear the token");
ok(basemapReady({ __SATELLITE_TILE_URL__: "https://other.example/{z}/{x}/{y}.jpg" }) === true,
  "and an override alone is enough");
ok(satelliteUrl({ __MAPBOX_TOKEN__: "" }) === "", "an empty token is not a token");
ok(satelliteUrl(null) === "", "and a pre-mount render with no window resolves to nothing rather than throwing");

/* ================= behavioral: attribution follows the imagery ================= */
const MAPBOX_CREDIT = '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> · '
  + '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
function attributionFor(win) {
  if (win && win.__SATELLITE_TILE_URL__) return win.__SATELLITE_ATTRIBUTION__ || "Satellite imagery";
  return MAPBOX_CREDIT;
}
ok(attributionFor({ __MAPBOX_TOKEN__: "pk.abc" }) === MAPBOX_CREDIT,
  "Mapbox tiles carry Mapbox's credit");
ok(attributionFor({ __MAPBOX_TOKEN__: "pk.abc" }).includes("OpenStreetMap"),
  "including OpenStreetMap, which Mapbox's terms also require");
const other = { __SATELLITE_TILE_URL__: "https://other.example/{z}/{x}/{y}.jpg" };
ok(!attributionFor(other).includes("Mapbox"),
  "someone else's tiles NEVER carry Mapbox's credit — the licence breach this exists to prevent");
ok(attributionFor(other) === "Satellite imagery",
  "falling back to a neutral label when the deployer hasn't set one");
ok(attributionFor({ ...other, __SATELLITE_ATTRIBUTION__: "© Example Provider" }) === "© Example Provider",
  "and using theirs when they have");
ok(attributionFor({ ...other, __SATELLITE_ATTRIBUTION__: "© Example", __MAPBOX_TOKEN__: "pk.abc" }) === "© Example",
  "a leftover Mapbox token can't drag Mapbox's credit onto another provider's tiles");

if (fails) { console.log("\nbuild 135: " + fails + " FAILED"); process.exit(1); }
console.log("build 135 tests passed");
