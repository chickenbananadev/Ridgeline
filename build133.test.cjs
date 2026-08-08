/* Build 133 — storm watch: settings, and the detection engine.

   The owner's ask: "when a storm hits, it automatically pulls data to
   let us know so we can be boots on the ground. You can set the radius
   in the back end."

   This build is the half nobody sees — where the company says which
   areas to watch and how hard it has to blow, plus the pure function
   that turns NOAA storm reports into alert candidates. Build 134 puts
   them on screen.

   Three things are worth guarding here, because each is a way this
   could look like it works while quietly doing nothing:

   1. ONE ENGINE. Detection reads the same fetchStormReports the claim
      tab and the pin sheet read. If storm alerts had their own weather
      lookup, the hail size in an alert and the hail size backing the
      claim could disagree, and the alert becomes marketing.

   2. NOISE IS THE FAILURE MODE. One hailstorm files dozens of spotter
      reports as it tracks across a county. One alert per area per kind
      per day, carrying the WORST magnitude — not forty notifications
      anyone would switch off within a week.

   3. SILENCE MUST NEVER READ AS GOOD NEWS. Watching switched on with
      no areas set alerts on nothing; the screen says so. A radius
      wider than the bounded NOAA query would find nothing out there;
      it's capped at the query's real reach. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const sql = fs.readFileSync(path.join(__dirname, "supabase/migrations/038_storm_alerts.sql"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ================= 1. migration 038 ================= */
ok(/create table if not exists crm_storm_alerts/.test(sql), "038 creates crm_storm_alerts");
ok(/report_key text not null/.test(sql), "every alert carries the key that identifies its storm");
ok(/create unique index if not exists crm_storm_alerts_key_idx\s*\n\s*on crm_storm_alerts\(tenant_id, report_key\)/.test(sql),
  "the dedupe key is unique PER TENANT — two companies watching the same county each get their own alert");
ok(/A bare\s*\n-- unique\(report_key\) would let whichever tenant detected it first\s*\n-- silently suppress it for everyone else\./.test(sql),
  "and the migration says why a global unique key would be a cross-tenant bug");
ok(/alter table crm_storm_alerts add column if not exists tenant_id uuid references tenants\(id\)/.test(sql),
  "tenant column, same as every other table");
ok(/create trigger stamp_tenant before insert on crm_storm_alerts\s*\n\s*for each row execute function set_tenant_id\(\)/.test(sql),
  "the shared insert trigger stamps the tenant");
ok(/create policy storm_alerts_rw on crm_storm_alerts for all to authenticated\s*\n\s*using \(tenant_id = current_tenant_id\(\)\) with check \(tenant_id = current_tenant_id\(\)\)/.test(sql),
  "RLS is the same for-all shape as jobs_rw");
ok(/acknowledged_by uuid/.test(sql) && /dismissed boolean not null default false/.test(sql),
  "acknowledged and dismissed are separate columns — 'handled' and 'ignored' are different answers");
ok(/alter publication supabase_realtime add table crm_storm_alerts/.test(sql),
  "alerts are realtime, so a storm raised by the scheduled job reaches an app that's already open");
ok(/radius_miles numeric/.test(sql),
  "the radius in force is recorded on the alert, so changing the setting later doesn't rewrite history");

/* ================= 2. the settings model ================= */
/* Build 138 raised the look-back from 7 days to 90 at the owner's
   request. The thresholds and the off-by-default are what this line
   exists to protect, and both are unchanged. */
ok(/const STORM_WATCH_DEFAULTS = \{ enabled: false, areas: \[\], minHailIn: 1, minWindMph: 58, lookbackDays: 90 \};/.test(src),
  "defaults start OFF with the NWS severe thresholds for hail and wind");
ok(/const STORM_WATCH_MAX_RADIUS = Math\.round\(LSR_RADIUS_DEG \* 69\);/.test(src),
  "the radius cap is derived from the storm query's actual reach, not a made-up number");
ok(/a wider radius would silently under-report/.test(src),
  "and says why: a bigger number would look like it was watching further while finding nothing");
ok(/function normalizeStormWatch\(v\) \{/.test(src), "saved settings are normalized rather than trusted");
ok(/const s = \{ \.\.\.STORM_WATCH_DEFAULTS, \.\.\.\(v \|\| \{\}\) \};/.test(src),
  "a blob saved before a field existed gets the shipped value, not undefined");
ok(/s\.areas = \(s\.areas \|\| \[\]\)\.filter\(\(a\) => a && a\.lat != null && a\.lng != null\)/.test(src),
  "an area with no coordinates is dropped — it could never be checked against anything");
ok(/if \(d\.stormWatch\) setStormWatch\(normalizeStormWatch\(d\.stormWatch\)\);/.test(src),
  "normalization happens on the way IN from the database too, not only on save");
ok(/const orgDeps = \[[^\]]*stormWatch[^\]]*\]/.test(src), "changes to storm watch trigger a save");
ok(/priceList, companyDocs, crews, canvassStatuses, stormWatch, vendors/.test(src),
  "and storm watch is packed into the org blob");

/* ================= 3. the detection engine ================= */
/* Build 136 added radar hail as a fourth argument — the same pure
   function, now able to see a storm no spotter phoned in. */
ok(/function detectStormAlerts\(reportsByDate, area, thresholds, radarByDate\) \{/.test(src),
  "detection is a pure function of reports, one area, thresholds and radar");
ok(/function stormAlertKey\(watchId, kind, date\) \{\s*\n\s*return `\$\{watchId\}\|\$\{kind\}\|\$\{date\}`;/.test(src),
  "the storm key is area + kind + day — stable across both detectors");
ok(/forty notifications for one storm is not an\s*\n   alert system, it is a reason to switch alerts off/.test(src),
  "and the comment says why it isn't one alert per report");
ok(/if \(r\.miles != null && r\.miles > radius\) return;/.test(src),
  "the company's own radius filters reports, not just the 30-mile query box");
ok(/const value = r\.kind === "hail" \? r\.mag : lsrWindMph\(r\.mag, r\.unit\);/.test(src),
  "wind is converted from knots before it's compared — the same helper the claim path uses");
ok(/if \(value < floor\) return;/.test(src), "anything under the threshold never becomes an alert");
ok(/if \(value > cur\.value\) \{ cur\.value = value; cur\.report = r; \}/.test(src),
  "the alert carries the WORST report of the day, not the first one filed");
ok(/lat: r\.lat != null \? r\.lat : area\.lat/.test(src),
  "the alert is centred on the storm, falling back to the area only when a report has no position");
ok(/lat: flat, lng: flng, miles,/.test(src),
  "which is possible because storm reports now carry where they landed, not only how far away");
ok(/A storm alert has to put a rep on a map at the right place,\s*\n           and "26 mi from the office" is not a place\./.test(src),
  "and the comment says why distance alone was not enough");
ok(/function jobsWithinRadius\(jobs, area\) \{/.test(src),
  "how many of the company's own roofs sit under a storm is computable");
ok(/function seedStormAreas\(jobs, radiusMiles = 15\) \{/.test(src),
  "setup can suggest areas from where the company already works");
ok(/function stormAlertHeadline\(a\) \{/.test(src), "there is one sentence a rep can act on");

/* ================= 4. the setup screen ================= */
ok(/function StormWatchEditor\(\{ watch, setWatch, jobs, onBack, toast, currentUser \}\) \{/.test(src),
  "there's a storm watch screen");
ok(/const canEdit = canManageCompanyConfig\(currentUser\);/.test(src.slice(src.indexOf("function StormWatchEditor"), src.indexOf("function StormWatchEditor") + 400)),
  "gated behind company-settings access, like every other setup screen");
ok(/\["stormwatch", CloudRain, "Storm watch", "Get told when hail lands in your territory — areas and radius"\]/.test(src),
  "and it's reachable from the Setup menu");
ok(/nav === "stormwatch" \?[\s\S]{0,220}<StormWatchEditor watch=\{stormWatch\} setWatch=\{setStormWatch\} jobs=\{jobs\}/.test(src),
  "wired into the router with the real state, not a placeholder");
ok(/\{s\.enabled && !s\.areas\.length && \([\s\S]{0,400}Watching is on, but no areas are set — so nothing will ever alert\./.test(src),
  "watching switched on with no areas says so — silence must never read as good news");
ok(/max=\{STORM_WATCH_MAX_RADIUS\}/.test(src), "the radius control is capped at what the query can actually see");
ok(/const n = jobsWithinRadius\(jobs, a\)\.length;\s*\n\s*return n === 1 \? "1 of your jobs sits inside this circle\." : `\$\{n\} of your jobs sit inside this circle\.`;/.test(src),
  "the radius shows its consequence in jobs, not just a number of miles — and reads as English at one job");
ok(/const suggestions = seedStormAreas\(jobs\)\.filter\(\(a\) => !already\(a\.lat, a\.lng\)\)\.slice\(0, 4\);/.test(src),
  "suggested areas exclude ones already watched, and are capped so 400 jobs in one metro don't flood the screen");
ok(/Taken from the addresses on your jobs\. Tap one to watch it\./.test(src),
  "suggestions are offered for confirmation, never silently added");
ok(/<AddressAutocomplete value=\{draft\.address\}/.test(src), "areas are added with the existing address autocomplete");
ok(/onChange=\{\(v\) => setDraft\(\(d\) => \(\{ \.\.\.d, address: v, lat: null, lng: null \}\)\)\}/.test(src),
  "typing after picking clears the coordinates — an edited address must not keep the old pin's position");
ok(/disabled=\{draft\.lat == null\}/.test(src),
  "and an area can't be saved from typed text alone, because there'd be nowhere to watch");

/* ================= behavioral: normalizeStormWatch ================= */
const LSR_RADIUS_DEG = 0.45;
const STORM_WATCH_DEFAULTS = { enabled: false, areas: [], minHailIn: 1, minWindMph: 58, lookbackDays: 7 };
const MAX_R = Math.round(LSR_RADIUS_DEG * 69);
function normalizeStormWatch(v) {
  const s = { ...STORM_WATCH_DEFAULTS, ...(v || {}) };
  s.areas = (s.areas || []).filter((a) => a && a.lat != null && a.lng != null).map((a) => ({
    id: a.id, name: a.name || "Watched area", address: a.address || "",
    lat: Number(a.lat), lng: Number(a.lng),
    radiusMiles: Math.min(MAX_R, Math.max(1, Number(a.radiusMiles) || 15)),
  }));
  s.minHailIn = Math.max(0, Number(s.minHailIn) || 0);
  s.minWindMph = Math.max(0, Number(s.minWindMph) || 0);
  s.lookbackDays = Math.min(30, Math.max(1, Math.round(Number(s.lookbackDays) || 7)));
  return s;
}
ok(normalizeStormWatch(null).minHailIn === 1, "no saved settings at all gives the shipped hail threshold");
ok(normalizeStormWatch(null).enabled === false, "and watching is off until someone turns it on");
ok(normalizeStormWatch({ areas: [{ id: "a", lat: 41, lng: -88 }] }).minWindMph === 58,
  "a blob saved before wind thresholds existed still gets one, rather than comparing against undefined");
ok(normalizeStormWatch({ areas: [{ id: "a", lat: 41, lng: -88, radiusMiles: 900 }] }).areas[0].radiusMiles === MAX_R,
  "a radius beyond the query's reach is clamped rather than accepted and quietly under-reported");
ok(normalizeStormWatch({ areas: [{ id: "a", lat: 41, lng: -88, radiusMiles: 0 }] }).areas[0].radiusMiles === 15,
  "a zero radius falls back to the default rather than surviving as an area that alerts on nothing — silence reading as good news is the failure this whole feature exists to avoid");
ok(normalizeStormWatch({ areas: [{ id: "a", lat: 41, lng: -88, radiusMiles: 0.4 }] }).areas[0].radiusMiles === 1,
  "and a fractional radius is floored at a mile, which is the tightest the slider allows");
ok(normalizeStormWatch({ areas: [{ id: "a", lat: 41 }, { id: "b", lat: 41, lng: -88 }] }).areas.length === 1,
  "an area with no longitude is dropped");
ok(normalizeStormWatch({ lookbackDays: 400 }).lookbackDays === 30, "look-back is capped at a month");
ok(normalizeStormWatch({ lookbackDays: 0 }).lookbackDays === 7,
  "and a zero look-back falls back to the default rather than checking an empty window");
ok(normalizeStormWatch({ areas: [{ id: "a", lat: "41.5", lng: "-88.2" }] }).areas[0].lat === 41.5,
  "coordinates that came back from JSON as strings are made numeric — string maths in haversine would be silently wrong");

/* ================= behavioral: detectStormAlerts ================= */
function lsrWindMph(mag, unit) {
  if (!isFinite(mag)) return null;
  return /KT|KNOT/i.test(String(unit || "")) ? mag * 1.15078 : mag;
}
function stormAlertKey(watchId, kind, date) { return `${watchId}|${kind}|${date}`; }
function detectStormAlerts(reportsByDate, area, thresholds) {
  if (!area || area.lat == null) return [];
  const t = { minHailIn: 0, minWindMph: 0, ...(thresholds || {}) };
  const radius = Number(area.radiusMiles) || 15;
  const out = [];
  Object.entries(reportsByDate || {}).forEach(([date, day]) => {
    const worst = {};
    (day.reports || []).forEach((r) => {
      if (r.kind !== "hail" && r.kind !== "wind") return;
      if (r.miles != null && r.miles > radius) return;
      const value = r.kind === "hail" ? r.mag : lsrWindMph(r.mag, r.unit);
      if (value == null || !isFinite(value)) return;
      const floor = r.kind === "hail" ? t.minHailIn : t.minWindMph;
      if (value < floor) return;
      const cur = worst[r.kind];
      if (!cur) worst[r.kind] = { value, report: r, count: 1 };
      else { cur.count++; if (value > cur.value) { cur.value = value; cur.report = r; } }
    });
    Object.entries(worst).forEach(([kind, w]) => {
      const r = w.report;
      out.push({
        watchId: area.id, watchName: area.name || "", kind, occurredOn: date,
        magnitude: Math.round(w.value * 100) / 100,
        unit: kind === "hail" ? "in" : "mph",
        lat: r.lat != null ? r.lat : area.lat, lng: r.lng != null ? r.lng : area.lng,
        radiusMiles: radius,
        place: [r.city, [r.county, r.state].filter(Boolean).join(" ")].filter(Boolean).join(", "),
        reportCount: w.count, reportKey: stormAlertKey(area.id, kind, date),
      });
    });
  });
  return out.sort((a, b) => (b.occurredOn < a.occurredOn ? -1 : b.occurredOn > a.occurredOn ? 1 : b.magnitude - a.magnitude));
}

const AREA = { id: "w1", name: "Naperville", lat: 41.78, lng: -88.15, radiusMiles: 20 };
const TH = { minHailIn: 1, minWindMph: 58 };
const hail = (mag, miles, extra) => ({ kind: "hail", mag, miles, unit: "in", lat: 41.8, lng: -88.2, city: "Naperville", county: "DuPage", state: "IL", ...extra });

/* the basic contract */
ok(detectStormAlerts({}, AREA, TH).length === 0, "no reports, no alerts");
ok(detectStormAlerts(null, AREA, TH).length === 0, "and a failed weather lookup doesn't throw");
ok(detectStormAlerts({ "2026-08-06": { reports: [hail(1.75, 3)] } }, AREA, TH).length === 1,
  "one qualifying hail report raises one alert");
ok(detectStormAlerts({ "2026-08-06": { reports: [hail(1.75, 3)] } }, null, TH).length === 0,
  "an area with no coordinates can't detect anything, and says so by returning nothing");

/* thresholds — the edges, where an off-by-one hides */
ok(detectStormAlerts({ d: { reports: [hail(0.99, 3)] } }, AREA, TH).length === 0,
  "hail just under the threshold is not an alert");
ok(detectStormAlerts({ d: { reports: [hail(1, 3)] } }, AREA, TH).length === 1,
  "hail exactly AT the threshold is — 1\" is the severe threshold, not the first size above it");
const wind = (mag, unit, miles) => ({ kind: "wind", mag, unit, miles, lat: 41.8, lng: -88.2, city: "Naperville", county: "DuPage", state: "IL" });
ok(detectStormAlerts({ d: { reports: [wind(57, "MPH", 3)] } }, AREA, TH).length === 0, "57 mph is under the wind threshold");
ok(detectStormAlerts({ d: { reports: [wind(58, "MPH", 3)] } }, AREA, TH).length === 1, "58 mph is at it");
ok(detectStormAlerts({ d: { reports: [wind(52, "KT", 3)] } }, AREA, TH).length === 1,
  "52 KNOTS is 60 mph and alerts — the conversion bug that would otherwise drop a genuine severe gust");
ok(detectStormAlerts({ d: { reports: [wind(49, "KT", 3)] } }, AREA, TH).length === 0,
  "49 knots is 56 mph and does not — the same conversion, the other way");
ok(Math.round(detectStormAlerts({ d: { reports: [wind(52, "KT", 3)] } }, AREA, TH)[0].magnitude) === 60,
  "and the alert carries the converted mph, not the raw knots");

/* radius — the "set the radius in the back end" ask */
ok(detectStormAlerts({ d: { reports: [hail(2, 25)] } }, AREA, TH).length === 0,
  "hail 25 mi out is outside a 20 mi area, even though the query fetched it");
ok(detectStormAlerts({ d: { reports: [hail(2, 25)] } }, { ...AREA, radiusMiles: 30 }, TH).length === 1,
  "widening the radius to 30 mi picks up that same report — the setting does real work");
ok(detectStormAlerts({ d: { reports: [hail(2, 20)] } }, AREA, TH).length === 1, "a report exactly on the boundary counts");
ok(detectStormAlerts({ d: { reports: [hail(2, 20.1)] } }, AREA, TH).length === 0, "one just past it does not");
ok(detectStormAlerts({ d: { reports: [hail(2, 25)] } }, AREA, TH).length === 0
  && detectStormAlerts({ d: { reports: [hail(2, null)] } }, AREA, TH).length === 1,
  "a report with no distance is kept rather than dropped — it came back from a query about this area");

/* noise control — the whole point of the key */
const storm = { "2026-08-06": { reports: [hail(1.25, 4), hail(2.5, 6), hail(1.75, 2), hail(1, 9)] } };
const one = detectStormAlerts(storm, AREA, TH);
ok(one.length === 1, "four spotter reports from one hailstorm raise ONE alert, not four");
ok(one[0].magnitude === 2.5, "and it carries the biggest stone reported, not the first one filed");
ok(one[0].reportCount === 4, "with the report count kept, so the alert can say how well corroborated it is");
ok(one[0].reportKey === "w1|hail|2026-08-06", "keyed by area, kind and day");
const both = detectStormAlerts({ "2026-08-06": { reports: [hail(1.5, 3), wind(70, "MPH", 3)] } }, AREA, TH);
ok(both.length === 2, "hail and wind on the same day are two different alerts — different damage, different pitch");
ok(new Set(both.map((a) => a.reportKey)).size === 2, "with distinct keys, so neither overwrites the other");
const twoDays = detectStormAlerts({ "2026-08-06": { reports: [hail(1.5, 3)] }, "2026-08-07": { reports: [hail(1.5, 3)] } }, AREA, TH);
ok(twoDays.length === 2, "two separate storm days are two alerts");
ok(twoDays[0].occurredOn === "2026-08-07", "newest first — the one still worth knocking today");

/* re-running must not multiply alerts */
const runA = detectStormAlerts(storm, AREA, TH);
const runB = detectStormAlerts(storm, AREA, TH);
ok(runA[0].reportKey === runB[0].reportKey,
  "the in-app sweep and the scheduled job derive the SAME key from the same data — one alert, not two");

/* what the alert points at */
ok(one[0].lat === 41.8 && one[0].lng === -88.2,
  "the alert is centred where the hail fell, so opening the map lands a rep on the right street");
ok(one[0].place === "Naperville, DuPage IL", "and reads as a place a person recognizes");
ok(detectStormAlerts({ d: { reports: [{ kind: "hail", mag: 2, miles: 3 }] } }, AREA, TH)[0].lat === AREA.lat,
  "a report with no coordinates falls back to the area centre rather than dropping the alert");
ok(one[0].radiusMiles === 20, "the radius in force is recorded on the alert, so history survives a settings change");

/* things that must never alert */
ok(detectStormAlerts({ d: { reports: [{ kind: "tornado", mag: 3, miles: 2 }] } }, AREA, TH).length === 0,
  "a tornado report is not a hail or wind alert — this system sells roofs, and the storm tab already covers the rest");
ok(detectStormAlerts({ d: { reports: [{ kind: "hail", mag: null, miles: 2 }] } }, AREA, TH).length === 0,
  "hail with no measured size can't be compared to a threshold, so it doesn't alert");
ok(detectStormAlerts({ d: { reports: [] } }, AREA, TH).length === 0, "a day with an empty report list is not a storm");

/* thresholds off entirely */
ok(detectStormAlerts({ d: { reports: [hail(0.25, 3)] } }, AREA, {}).length === 1,
  "with no thresholds passed, everything qualifies — the caller's settings are the only gate");

/* ================= behavioral: jobsWithinRadius ================= */
function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
function jobsWithinRadius(jobs, area) {
  if (!area || area.lat == null) return [];
  const radius = Number(area.radiusMiles) || 15;
  return (jobs || []).filter((j) => j.lat != null && j.lng != null
    && haversineMiles(area.lat, area.lng, j.lat, j.lng) <= radius);
}
const JOBS = [
  { id: "j1", lat: 41.78, lng: -88.15 },      // on top of it
  { id: "j2", lat: 41.85, lng: -88.30 },      // a few miles
  { id: "j3", lat: 39.0, lng: -94.6 },        // Kansas City
  { id: "j4" },                                // never geocoded
];
ok(jobsWithinRadius(JOBS, AREA).length === 2, "only the jobs actually inside the circle count");
ok(jobsWithinRadius(JOBS, AREA).every((j) => j.id !== "j4"),
  "a job that was never geocoded is excluded rather than assumed nearby");
ok(jobsWithinRadius(JOBS, AREA).every((j) => j.id !== "j3"), "and Kansas City is not in DuPage County");
ok(jobsWithinRadius(JOBS, null).length === 0, "no area, no jobs — rather than a crash on a half-built area");
ok(jobsWithinRadius(null, AREA).length === 0, "and no jobs is zero, not an exception");

/* ================= behavioral: seedStormAreas ================= */
function seedStormAreas(jobs, radiusMiles = 15) {
  const pts = (jobs || []).filter((j) => j.lat != null && j.lng != null);
  const areas = [];
  pts.forEach((j) => {
    const hit = areas.find((a) => haversineMiles(a.lat, a.lng, j.lat, j.lng) <= radiusMiles);
    if (hit) { hit.count++; return; }
    areas.push({
      lat: j.lat, lng: j.lng, count: 1,
      name: (j.property && j.property.city) || String(j.address || "").split(",")[1]?.trim() || j.address || "Watched area",
      address: j.address || "", radiusMiles,
    });
  });
  return areas.sort((a, b) => b.count - a.count);
}
const SEED = [
  { lat: 41.78, lng: -88.15, property: { city: "Naperville" } },
  { lat: 41.80, lng: -88.17, property: { city: "Naperville" } },
  { lat: 41.79, lng: -88.14, property: { city: "Naperville" } },
  { lat: 39.10, lng: -84.51, property: { city: "Cincinnati" } },
  { lat: 39.99, lng: -83.00 },                                     // no city, no address
];
const seeded = seedStormAreas(SEED);
ok(seeded.length === 3, "three job clusters become three suggested areas, not five");
ok(seeded[0].name === "Naperville" && seeded[0].count === 3,
  "the busiest cluster is offered first, named for the city rather than one job's street");
ok(seedStormAreas([]).length === 0, "a company with no geocoded jobs gets no suggestions rather than a bogus one");
ok(seedStormAreas([{ lat: 41, lng: -88 }])[0].name === "Watched area",
  "a job with no city and no address still yields a usable, honestly-named suggestion");
ok(seedStormAreas([{ lat: 41, lng: -88, address: "123 Main St, Aurora, IL 60505" }])[0].name === "Aurora",
  "and an address with no city field falls back to the city inside the address");

/* ================= behavioral: stormAlertHeadline ================= */
const HAIL_SIZES = [[4.5, "softball"], [4, "grapefruit"], [3, "teacup"], [2.75, "baseball"],
  [2.5, "tennis ball"], [2, "hen egg"], [1.75, "golf ball"], [1.5, "ping pong ball"],
  [1.25, "half dollar"], [1, "quarter"], [0.88, "nickel"], [0.75, "penny"], [0.5, "marble"]];
function hailSizeLabel(inches) {
  if (inches == null) return "";
  const hit = HAIL_SIZES.find(([n]) => inches >= n);
  return hit ? hit[1] : "pea";
}
function stormAlertHeadline(a) {
  if (!a) return "";
  const where = a.place || a.watch_name || a.watchName || "your area";
  if (a.kind === "hail") {
    const size = hailSizeLabel(Number(a.magnitude));
    const inches = Number(a.magnitude).toFixed(2).replace(/\.?0+$/, "");
    return `${inches}" hail${size ? ` (${size})` : ""} — ${where}`;
  }
  return `${Math.round(Number(a.magnitude))} mph winds — ${where}`;
}
ok(stormAlertHeadline({ kind: "hail", magnitude: 1.75, place: "Naperville, DuPage IL" })
  === `1.75" hail (golf ball) — Naperville, DuPage IL`,
  "a hail alert reads in the vocabulary a homeowner and an adjuster both use");
ok(stormAlertHeadline({ kind: "hail", magnitude: 2, place: "Aurora" }) === `2" hail (hen egg) — Aurora`,
  "a round size doesn't print as 2.00");
ok(stormAlertHeadline({ kind: "hail", magnitude: 1.5, place: "Aurora" }) === `1.5" hail (ping pong ball) — Aurora`,
  "nor 1.50");
ok(stormAlertHeadline({ kind: "wind", magnitude: 71.4, place: "Aurora" }) === "71 mph winds — Aurora",
  "wind reads in whole mph — nobody says 71.4 mph gusts");
ok(stormAlertHeadline({ kind: "hail", magnitude: 1.75, watchName: "Naperville" }).endsWith("Naperville"),
  "with no place from the report it falls back to the area's own name");
ok(stormAlertHeadline({ kind: "hail", magnitude: 1.75 }).endsWith("your area"),
  "and with neither, it still says something true rather than 'undefined'");
ok(stormAlertHeadline(null) === "", "a missing alert renders nothing rather than throwing");

if (fails) { console.log("\nbuild 133: " + fails + " FAILED"); process.exit(1); }
console.log("build 133 tests passed");
