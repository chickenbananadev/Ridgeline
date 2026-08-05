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
/* Prop list deliberately not pinned byte-for-byte — it gained `integrations`
   when the ETA share was made to actually send. */
ok(/<EnRouteCard job=\{job\} mut=\{mut\} toast=\{toast\} currentUser=\{currentUser\}/.test(src), "it renders on the job");
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

/* ---------- 5. The rep's contact card reaches the customer ---------- */
/* job.assigneeContact was read in four places and written in none, so the
   portal's "your project contact" showed a bare name with no phone and no
   email on every job nobody hand-typed. */
ok(!/job\.assigneeContact\?\./.test(src), "nothing reads the dead assigneeContact field any more");
ok(/function repContactFor\(users, job\)/.test(src), "the contact resolves from the seat");
ok(/function seatLineFor\(seat, state\)/.test(src), "a seat can carry a different number per state");
ok(/\(line && line\.phone\) \|\| seat\.repPhone \|\| seat\.phone/.test(src),
  "a state line beats the seat's direct line, which beats its login number");
ok(/const pick = \(k\) => \(String\(o\[k\] \|\| ""\)\.trim\(\) \? o\[k\] : base\[k\]\);/.test(src),
  "a per-job override still wins over both");
ok(/function buildPortalSnapshot\(job, brand, token, users = \[\]\)/.test(src),
  "the portal snapshot resolves the same way the job screen does");
ok(/const c = repContactFor\(users, job\);/.test(src), "and uses the shared resolver, not its own chain");
ok(/usersRef: users,/.test(src), "the sync layer has the seats it needs to resolve on republish");
/* Prefilled means the field shows the resolved value, not a placeholder —
   and stays live, so a rep changing their number fixes every job at once
   instead of leaving stale copies on each one. */
ok(/<input style=\{inputStyle\} type=\{type \|\| "text"\} value=\{contact\[k\] \|\| ""\}/.test(src),
  "the Project contact fields show the resolved value");
ok(/Reset to \{contact\.base\[k\]\}/.test(src), "an overridden field can be put back on the seat");
ok(/Filled in from \{contact\.seat\.name\}/.test(src), "the card says where the values came from");
ok(/Numbers by state/.test(src) && /Add a state line/.test(src), "seats can be given per-state numbers");

/* ---------- 6. "Needs your attention" explains itself ---------- */
/* A row used to be a bare name plus a reason, and lead quality alone could
   surface a job — so a lead entered five minutes ago and rated 4/5 topped
   the list with "4/5 lead quality" as its whole justification. */
ok(/const causes = \[\];\s*\n\s*const context = \[\];/.test(src), "signals split into causes and context");
ok(/context\.push\(`\$\{job\.leadQuality\}\/5 lead quality`\)/.test(src),
  "lead quality is context — it ranks a job but can't surface one");
ok(/context\.push\(`\$\{money\(v\)\} at stake`\)/.test(src), "so is dollar value");
ok(/causes\.push\(`\$\{late\} overdue/.test(src), "a broken commitment is a cause");
ok(/if \(!causes\.length\) return null;/.test(src), "no cause, no row");
ok(/causes\.push\("new lead, no contact logged yet"\)/.test(src),
  "an uncalled lead is a real cause, and now says so");
ok(/function focusAction\(job, f\)/.test(src), "each row carries the next thing to do");
ok(/onOpenJob\(j\.id, act\.tab \|\| undefined\)/.test(src), "and opens the section that action lives in");
ok(/\[j\.address, stage && stage\.name\]\.filter\(Boolean\)\.join\(" · "\)/.test(src),
  "the row shows the address and stage, so it reads as a job rather than a name");


/* ---------- 7. The cap-out sheet renders as a table ---------- */
/* It didn't. docShell styles .head and .tot as display:flex — they are the
   document header block and the running-total lines — and the cap-out sheet
   used those same names on its <tr> elements. Those rows dropped out of the
   table grid and rendered as narrow boxes with the text stacking one letter
   per line. Two guards: the shell's flex rules are scoped to div, and the
   sheet's rows are namespaced. */
const shellCss = src.slice(src.indexOf("function docShell"), src.indexOf("<body>"));
ok(/div\.head \{ display: flex;/.test(shellCss), "the shell's .head flex rule is scoped to div");
ok(/div\.tot \{ display: flex;/.test(shellCss), "the shell's .tot flex rule is scoped to div");
ok(/div\.tot\.grand \{/.test(shellCss), "and so is its grand-total variant");
/* The general form of the bug: any class the shell lays out as flex, used on
   a table row anywhere in the app's printed documents. */
const flexClasses = [...shellCss.matchAll(/(?:^|\s)(?:div\.)?\.?([a-z][\w-]*)(?:\.[\w-]+)? \{[^}]*display: flex/g)]
  .map((m) => m[1]).filter((c) => !/^div$/.test(c));
const rowClassUses = [...src.matchAll(/<tr class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
const collisions = rowClassUses.filter((c) => flexClasses.includes(c));
ok(collisions.length === 0, "no table row reuses a class the document shell lays out as flex: " + collisions.join(", "));
ok(/<tr class="caphead">/.test(src) && /<tr class="captot">/.test(src),
  "the cap-out rows are namespaced so they can't collide again");
ok(/table\.cap tr\.caphead td/.test(src) && /table\.cap tr\.captot td/.test(src),
  "and the sheet's own CSS follows the rename");
/* Fixed columns, in the proportions of the company's own spreadsheet, so a
   long description wraps instead of pushing the sheet off the page. */
ok(/table\.cap\{width:100%;table-layout:fixed/.test(src), "the cap-out table has a fixed column grid");
ok(/<colgroup><col class="c1"><col class="c2"><col class="c3"><col class="c4"><\/colgroup>/.test(src),
  "with an explicit colgroup");
ok(/table\.cap col\.c1\{width:26%\}/.test(src) && /table\.cap col\.c3\{width:37%\}/.test(src),
  "line item, amount, a wide description, reimbursement");
ok(/overflow-wrap:break-word/.test(src), "long cell content breaks rather than forcing the table wider");
/* Every derived figure says how it was arrived at — a cap-out sheet is a
   document that gets argued over. */
ok(/const kv = \(k, v, desc\) =>/.test(src), "kv rows carry a description");
ok(/"Gross profit ÷ net revenue"/.test(src) && /"Company net profit ÷ job total"/.test(src),
  "the profit and split rows explain their maths");
ok(/const totRow = \(title, amt, desc\) =>/.test(src), "so do the total rows");


if (fails) { console.log("\nbuild 49: " + fails + " FAILED"); process.exit(1); }
console.log("build 49 tests passed");
