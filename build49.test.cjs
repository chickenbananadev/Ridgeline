/* Build 49 — the field round.

   One bug and two features, all three about what happens on a phone in a
   driveway: the bottom nav drifting mid-scroll, not knowing which house you
   are looking at, and the homeowner not knowing when anyone is coming.

   Static assertions over the source and assets. The behavioural proof for
   these lives in the headless-browser runs (real OSRM and Open-Meteo response
   shapes, a real 1600px image through the downscaler) — the endpoints are
   blocked from CI, so what is asserted here is the shape and the degradation. */
const fs = require("fs");
const src = fs.readFileSync("./ridgeline.jsx", "utf8");
const html = fs.readFileSync("./index.html", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- 1. The nav bar no longer drifts ---------- */
ok(/\.rl-shell \{ height: 100vh; height: 100dvh;/.test(html),
  "the shell is a fixed-height flex column, with a vh fallback under the dvh");
ok(/\.rl-scroll \{ flex: 1; min-height: 0; overflow-y: auto;/.test(html),
  "screens scroll in their own pane");
ok(/<div className="rl-shell"/.test(src) && /<div className="rl-scroll" ref=\{scrollPane\}>/.test(src),
  "the app uses the shell and the pane");
/* The whole point: the nav is an ordinary flex child now. A position:fixed
   bar over a scrolling document is the arrangement iOS mishandles. */
const navBlock = src.slice(src.indexOf("{/* Bottom navigation"), src.indexOf("<JobQuickPanel"));
ok(/flexShrink: 0, zIndex: 50,/.test(navBlock) && !/position: "fixed"/.test(navBlock),
  "the bottom nav is a flex child, not a fixed overlay");
ok(/scrollPane\.current\.scrollTop = 0; \}, \[nav, openJobId\]\)/.test(src),
  "opening a screen starts it at the top, since the document no longer scrolls");
/* The 110px of clearance existed only to keep content out from under a
   floating bar. Nothing floats now, so it is dead space. */
ok(!/paddingBottom: 110/.test(src) && !/110px", background: S\.bg/.test(src),
  "the nav-clearance padding is gone from every screen");
ok(/gridTemplateColumns: "repeat\(auto-fit, minmax\(150px, 1fr\)\)"/.test(src),
  "the money tiles reflow instead of clipping a six-figure number");

/* ---------- 2. Property photo ---------- */
ok(/function imageToDataUrl\(file, maxW = 1000, quality = 0\.72\)/.test(src),
  "photos are downscaled before they go anywhere near the synced job blob");
ok(/c\.toDataURL\("image\/jpeg", quality\)/.test(src), "stored as JPEG, not a raw multi-megabyte data URL");
ok(/img\.onerror = \(\) => resolve\(raw\)/.test(src), "a canvas failure still yields a usable image");
ok(/function PropertyPhoto\(\{ job, mut, toast \}\)/.test(src), "PropertyPhoto exists");
ok(/<PropertyPhoto job=\{job\} mut=\{mut\} toast=\{toast\} \/>/.test(src), "it renders on the job's site-location card");
ok(/Or use one you've already shot/.test(src), "an existing job photo can be promoted without re-shooting");
ok(/\{job\.propertyPhoto && job\.propertyPhoto\.url && \(/.test(src), "the board card carries the photo");
ok(/height: 104, objectFit: "cover"/.test(src), "as a banner across the top of the card");

/* ---------- 3. Five-day forecast ---------- */
ok(/async function fetchForecastFor\(lat, lng, days = 5\)/.test(src), "forecast fetch exists");
ok(/wind_speed_10m_max/.test(src) && /temperature_2m_min/.test(src),
  "it pulls wind and the overnight low, not just rain — both decide a roofing day");
ok(/function roofDayVerdict\(day\)/.test(src), "days are judged as roofing days");
ok(/day\.lo < 40\) return \{ ok: false, tone: "amber", why: "Too cold to seal" \}/.test(src),
  "a low under 40 is flagged — shingles won't seal below that");
ok(/num\(day\.windMph\) >= 25\) return \{ ok: false, tone: "red", why: "Wind" \}/.test(src), "25 mph wind is flagged");
ok(/function ForecastStrip\(\{ lat, lng, zip, schedDate = null \}\)/.test(src), "ForecastStrip exists");
ok(/if \(!days \|\| !days\.length\) return null;/.test(src),
  "it renders nothing rather than an empty box when the site can't be located");
ok(/<ForecastStrip lat=\{job\.lat \?\? job\.property\?\.lat\}/.test(src), "it renders on the job");
ok(/This roof is scheduled for \{sched\.date\} and that day reads/.test(src),
  "a bad install day is called out against the scheduled date specifically");
ok(/const FORECAST_MS = 60 \* 60 \* 1000;/.test(src), "forecasts are cached, not re-fetched per render");

/* ---------- 4. On my way / ETA ---------- */
ok(/function haversineMi\(aLat, aLng, bLat, bLng\)/.test(src), "straight-line distance helper");
ok(/async function driveEta\(fromLat, fromLng, toLat, toLng\)/.test(src), "drive-time helper");
ok(/router\.project-osrm\.org\/route\/v1\/driving/.test(src), "routes through OSRM's free public server — no key, no account");
ok(/return \{ minutes: Math\.max\(1, Math\.round\(\(miles \/ 35\) \* 60\)\), miles: \+miles\.toFixed\(1\), routed: false \};/.test(src),
  "and degrades to a labelled estimate when routing is unreachable");
ok(/routed: true/.test(src) && /straight line — road distance unavailable, this is an estimate/.test(src),
  "the UI says which of the two the number is");
ok(/async function jobCoords\(job\)/.test(src) && /return await geocodeZip\(job\.zip\)/.test(src),
  "the destination resolves from coordinates, a stamped photo, or the zip");
ok(/function EnRouteCard\(\{ job, mut, toast, currentUser, integrations = \{\} \}\)/.test(src), "EnRouteCard exists");
ok(/<EnRouteCard job=\{job\} mut=\{mut\} toast=\{toast\} currentUser=\{currentUser\} \/>/.test(src), "it renders on the job");
ok(/function etaRemaining\(er\)/.test(src), "the ETA counts down against the promise instead of going stale");
ok(/is on the way to \$\{job\.address\} — about \$\{mins\} minutes out, arriving around/.test(src),
  "the customer message carries a wall-clock arrival, not just a duration");
ok(/enroute: \(job\.enroute && job\.enroute\.active && job\.enroute\.sharedAt\) \?/.test(src),
  "the ETA only reaches the portal while active AND deliberately shared");
const portalEr = src.slice(src.indexOf("enroute: (job.enroute"), src.indexOf("enroute: (job.enroute") + 400);
ok(!/lat|lng/.test(portalEr),
  "the homeowner gets the arrival window, never the rep's live coordinates");
ok(/function PortalEnRoute\(\{ er, accent \}\)/.test(src), "the portal renders the arrival banner");
ok(/if \(left < -120\) return null;/.test(src),
  "a two-hour-stale banner removes itself rather than lying about the time");
ok(/<PortalEnRoute er=\{d\.enroute\} accent=\{prim\} \/>/.test(src), "it sits above the ordered portal sections");

if (fails) { console.log("\nbuild 49: " + fails + " FAILED"); process.exit(1); }
console.log("build 49 tests passed");
