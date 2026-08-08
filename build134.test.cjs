/* Build 134 — storm alerts, and getting boots on the ground.

   Build 133 supplied the settings and the detection engine. This is the
   half a person actually sees, and the payoff the whole feature exists
   for: an alert opens the canvassing map centred on the storm with the
   affected radius drawn, so "hail hit Naperville" becomes knocking
   without anyone typing an address.

   Four things are guarded here, because each is a way this could look
   like it works while quietly failing:

   1. THE SWEEP MUST NOT MULTIPLY ALERTS. It runs on open and on an
      interval, over a moving window, against reports it has already
      seen. The default has to be "do nothing" — an alert that
      re-announces itself every half hour is worse than no alert.

   2. A BIGGER STORM MUST STILL GET THROUGH. Hail reports arrive over
      hours: an early run legitimately sees 1", a later one 2.5". If
      the dedupe were absolute, the alert would permanently understate
      the storm on the strength of whichever report was filed first.

   3. A FAILED LOOKUP IS NOT AN ALL-CLEAR. fetchStormReports returns
      null when NOAA doesn't answer. Treating that as "no storms" is
      silence reading as good news, which is the failure this whole
      feature exists to avoid.

   4. A FAILED WRITE MUST BE VISIBLE. An acknowledgement that silently
      didn't save would have a whole team believing a storm was
      covered. Same optimistic-then-reconcile-then-say-so shape as
      useCanvassPins. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const fn = fs.readFileSync(path.join(__dirname, "supabase/functions/storm-watch/index.ts"), "utf8");
const deploy = fs.readFileSync(path.join(__dirname, "DEPLOY.md"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ================= 1. the alert lifecycle rules ================= */
ok(/function mergeStormAlert\(existing, candidate\) \{/.test(src),
  "what to do with a storm that already has a row is one named rule, not scattered conditionals");
ok(/if \(!existing\) return "insert";/.test(src), "a storm never seen before is raised");
ok(/if \(isFinite\(now\) && \(!isFinite\(was\) \|\| now > was\)\) return "raise";/.test(src),
  "a bigger reported size raises the existing alert");
ok(/return "skip";/.test(src), "and anything else does nothing — the common case is a repeat");
ok(/an alert that re-announces itself every half hour is worse\s*\n   than no alert\./.test(src),
  "the comment says why skipping is the default, at the interval the sweep actually runs");
ok(/It can only fire when the reported\s*\n   size actually grows, never on a repeat of the same figure, and the\s*\n   dismiss control says so before anyone taps it\./.test(src),
  "reopening a dismissed alert is documented as a deliberate, narrowly-triggered exception");
ok(/toast\("Dismissed — it only comes back if a bigger report lands"\)/.test(src),
  "and the dismiss control tells the user that before they tap it, so the reopen is never a surprise");
ok(/\.update\(\{ \.\.\.row, acknowledged_by: null, acknowledged_at: null, dismissed: false \}\)/.test(src),
  "a raise actually clears both decisions, matching what the control promised");

ok(/function openStormAlerts\(alerts\) \{/.test(src), "there is one definition of 'still needs someone'");
ok(/\.filter\(\(a\) => !a\.dismissed && !a\.acknowledged_at\)/.test(src),
  "which excludes both dismissed and acknowledged alerts");
ok(/function stormAlertAge\(occurredOn, todayIsoStr\) \{/.test(src),
  "age takes today explicitly, so it can be tested without freezing a clock");

/* ================= 2. the hook ================= */
ok(/function useStormAlerts\(\{ tenantId, ready \}\) \{/.test(src), "alerts have a hook of their own");
ok(/setErr\("That didn't save — you're seeing it on this device only\. " \+ \(error\.message \|\| ""\)\);\s*\n\s*merge\(\[before\]\);/.test(src),
  "a failed write is surfaced AND rolled back — never a silent optimistic lie");
ok(/const acknowledge = \(id, userId\) =>\s*\n\s*patch\(id, \{ acknowledged_by: userId \|\| null, acknowledged_at: new Date\(\)\.toISOString\(\) \}\);/.test(src),
  "acknowledging records who and when, not just a boolean");
ok(/const unacknowledge = \(id\) => patch\(id, \{ acknowledged_by: null, acknowledged_at: null \}\);/.test(src),
  "and can be undone — a rep tapping the wrong row needs a way back");
ok(/if \(!\/duplicate\|unique\/i\.test\(error\.message \|\| ""\)\) \{/.test(src),
  "a unique violation on insert is the OTHER detector winning the race, so it isn't reported as a fault");
ok(/event: "INSERT", schema: "public", table: "crm_storm_alerts", filter: `tenant_id=eq\.\$\{tenantId\}`/.test(src),
  "realtime is filtered by tenant, so a storm raised by the scheduled job reaches an app already open");
ok(/byKey: Object\.fromEntries\(list\.map\(\(a\) => \[a\.report_key, a\]\)\)/.test(src),
  "the hook exposes alerts keyed by report_key, which is what the sweep compares against");

/* ================= 3. the sweep ================= */
ok(/function useStormSweep\(\{ watch, alerts, ready \}\) \{/.test(src), "the in-app sweep exists");
/* Build 136: two observed sources now, so the skip is on BOTH
   failing — one answering is still an answer. The guarantee that a
   failed lookup never reads as an all-clear is unchanged. */
ok(/if \(!reports && !radar\) continue;/.test(src),
  "a failed lookup is skipped, not treated as 'nothing happened'");
ok(/treating "we\s*\n             couldn't ask" as "nothing happened" is the failure this\s*\n             whole feature exists to avoid/.test(src),
  "and the comment says why that distinction matters");
ok(/if \(running\.current \|\| !alive\) return;/.test(src),
  "two sweeps can't overlap — a slow one must not be lapped by the interval");
ok(/const alertsRef = useRef\(alerts\);\s*\n\s*alertsRef\.current = alerts;/.test(src),
  "the sweep reads alerts through a ref, so a long run doesn't re-raise storms it just wrote");
ok(/setInterval\(sweep, 30 \* 60 \* 1000\)/.test(src),
  "it runs half-hourly while open, not on every render");
ok(/if \(!ready \|\| !w\.enabled \|\| !w\.areas\.length\) return;/.test(src),
  "nothing sweeps until settings have loaded and at least one area exists");
ok(/useStormSweep\(\{ watch: stormWatch, alerts: stormAlerts, ready: hydrated \}\);/.test(src),
  "gated on hydrated — sweeping before the org blob arrives would ask about no areas and conclude, wrongly, that nothing happened");

/* ================= 4. the surfaces ================= */
ok(/function StormAlertBanner\(\{ alerts, onOpen, onCanvass \}\) \{/.test(src), "there's a home banner");
ok(/const open = openStormAlerts\(alerts\);[\s\S]{0,300}if \(!open\.length\) return null;/.test(src),
  "which shows nothing at all when nothing is unhandled");
ok(/<StormAlertBanner alerts=\{stormAlerts\.list\} onOpen=\{\(\) => setNav\("stormalerts"\)\} onCanvass=\{canvassStorm\} \/>\s*\n\s*<AnnouncementBar/.test(src),
  "and sits ABOVE announcements on the home screen — a storm outranks anything anyone typed");
ok(/background: "#FEF3F2", border: "1px solid #FDA29B"/.test(src),
  "styled as an alert, not as an announcement — this is weather costing money, not someone talking");
ok(/const openStormCount = openStormAlerts\(stormAlerts\.list\)\.length;/.test(src), "the nav badge counts unhandled storms");
ok(/badge=\{\(isAdmin \? readyToPayCount : 0\) \+ openStormCount\}/.test(src),
  "and is NOT gated on role — whoever is nearest should be able to go");
ok(/Not gated on role — the point of an\s*\n     alert is that whoever is nearest can go, not that it waits for an\s*\n     admin to forward it\./.test(src),
  "with the reasoning recorded next to it");
ok(/function StormAlertsScreen\(\{ alerts, jobs, users, currentUser, onBack, onCanvass, onSetup, toast \}\) \{/.test(src),
  "there's a screen listing every storm");
ok(/\["open", "Needs attention", open\.length\], \["handled", "Handled", handled\.length\], \["dismissed", "Dismissed", dropped\.length\]/.test(src),
  "split three ways, so 'handled' and 'ignored' stay distinguishable");
ok(/const inside = jobsWithinRadius\(jobs, \{ lat: a\.lat, lng: a\.lng, radiusMiles: a\.radius_miles \}\);/.test(src),
  "each alert says how many of your own roofs sit under it — the number that turns an alert into a decision");
ok(/radiusMiles: a\.radius_miles/.test(src),
  "measured against the radius recorded ON the alert, so widening an area later can't rewrite what an old alert claimed");
ok(/Acknowledged by \{nameOf\(a\.acknowledged_by\)\} on \{String\(a\.acknowledged_at\)\.slice\(0, 10\)\}/.test(src),
  "and who acknowledged it is shown, not just that somebody did");
ok(/\["stormalerts", CloudRain, "Storm alerts", "Hail and wind that landed in your territory"\]/.test(src),
  "reachable from the menu");

/* ================= 5. the payoff — one tap to canvass ================= */
/* Build 137 added the day and peril so the map can draw the storm's
   real footprint, not just the watched circle. */
ok(/setCanvassFocus\(\{\s*\n\s*lat: a\.lat, lng: a\.lng, radiusMiles: Number\(a\.radius_miles\) \|\| 15,/.test(src)
  && /setNav\("canvass"\);/.test(src),
  "opening a storm centres the canvassing map on it and carries the radius");
ok(/canvassStatuses=\{canvassStatuses\} toast=\{toast\} focus=\{canvassFocus\}/.test(src),
  "which reaches CanvassScreen through the focus prop build 132 already added");
ok(/useEffect\(\(\) => \{ if \(nav !== "canvass"\) setCanvassFocus\(null\); \}, \[nav\]\);/.test(src),
  "and is dropped on leaving, so opening Canvassing tomorrow doesn't reopen on last week's storm");
ok(/onCanvass=\{\(\) => onCanvass\(a\)\} data-testid="storm-canvass"/.test(src) || /onClick=\{\(\) => onCanvass\(a\)\} data-testid="storm-canvass"/.test(src),
  "the alert card has the knock-it button");
ok(/data-testid="storm-banner-canvass"/.test(src), "and so does the banner, so it's one tap from the home screen");

/* ================= 6. the scheduled function ================= */
ok(/tenant_id: tenantId,\s+\/\/ explicit: see the header note/.test(fn),
  "the Edge Function sets tenant_id EXPLICITLY — the service role has no auth.uid(), so the trigger can't");
ok(/A NULL tenant_id row is invisible to every\n\/\/ authenticated user/.test(fn),
  "and the header explains that a null tenant_id row would be written and never seen");
ok(/if \(!secret\) return json\(\{ error: "STORM_WATCH_SECRET is not set on this function\." \}, 500\);/.test(fn),
  "deployed with --no-verify-jwt, so it refuses to run at all without a shared secret rather than sweeping for anyone");
ok(/if \(given !== secret\) return json\(\{ error: "Not authorized" \}, 401\);/.test(fn), "and checks it");
ok(/if \(!reports && !radar\) \{ summary\.lookupFailed\+\+; continue; \}/.test(fn),
  "a failed lookup is counted and skipped, not recorded as a quiet all-clear");
ok(/if \(error && !\/duplicate\|unique\/i\.test\(error\.message \|\| ""\)\) \{/.test(fn),
  "and losing the race to the in-app sweep is the dedupe working, not an error");
ok(/\.update\(\{ \.\.\.row, acknowledged_by: null, acknowledged_at: null, dismissed: false \}\)/.test(fn),
  "the raise rule matches the app's exactly");
ok(/Change\n\/\/ one, change both\./.test(fn),
  "the function says out loud that its detection code is a port that must not drift");
ok(/function stormAlertKey\(watchId: string, kind: string, date: string\) \{\s*\n\s*return `\$\{watchId\}\|\$\{kind\}\|\$\{date\}`;/.test(fn),
  "and the key it derives is character-for-character the app's");
ok(/## 7b\. Storm watch — scheduled hail detection \(optional\)/.test(deploy), "DEPLOY.md documents it");
ok(/supabase functions deploy storm-watch --no-verify-jwt/.test(deploy), "with the deploy command");
ok(/create extension if not exists pg_cron;/.test(deploy) && /cron\.schedule\(/.test(deploy), "and the pg_cron schedule");
ok(/\*\*Everything here is optional\.\*\*/.test(deploy),
  "stated up front as an upgrade — storm alerts work with nothing deployed");
ok(/On a quiet week `inserted` is 0 and that is correct — no storms is the\nnormal answer\./.test(deploy),
  "and the verification step says what a boring result looks like, so nobody debugs a working system");

/* ================= behavioral: mergeStormAlert ================= */
function mergeStormAlert(existing, candidate) {
  if (!existing) return "insert";
  const was = Number(existing.magnitude), now = Number(candidate.magnitude);
  if (isFinite(now) && (!isFinite(was) || now > was)) return "raise";
  return "skip";
}
ok(mergeStormAlert(null, { magnitude: 1.75 }) === "insert", "a storm never seen is raised");
ok(mergeStormAlert(undefined, { magnitude: 1 }) === "insert", "and so is one whose lookup came back empty");
ok(mergeStormAlert({ magnitude: 1.75 }, { magnitude: 1.75 }) === "skip",
  "the same storm re-detected does nothing — the case that happens on almost every sweep");
ok(mergeStormAlert({ magnitude: 2.5 }, { magnitude: 1.25 }) === "skip",
  "a smaller later report does NOT downgrade an alert — the worst stone is the finding");
ok(mergeStormAlert({ magnitude: 1 }, { magnitude: 2.5 }) === "raise",
  "a bigger later report raises it — hail reports arrive over hours");
ok(mergeStormAlert({ magnitude: 1 }, { magnitude: 1.01 }) === "raise", "even slightly bigger");
ok(mergeStormAlert({ magnitude: null }, { magnitude: 1.25 }) === "raise",
  "an existing row with no recorded size is filled in rather than left blank forever");
ok(mergeStormAlert({ magnitude: 1.25 }, { magnitude: null }) === "skip",
  "and a candidate with no size can't blank out a real figure");

/* Re-running the sweep must converge, not accumulate. */
function runSweep(candidates, store) {
  candidates.forEach((c) => {
    const action = mergeStormAlert(store[c.reportKey], c);
    if (action === "insert") store[c.reportKey] = { ...c, acknowledged_at: null, dismissed: false };
    else if (action === "raise") store[c.reportKey] = { ...store[c.reportKey], ...c, acknowledged_at: null, dismissed: false };
  });
  return store;
}
const CAND = [{ reportKey: "w1|hail|2026-08-06", magnitude: 1.75 }];
let store = {};
runSweep(CAND, store); runSweep(CAND, store); runSweep(CAND, store); runSweep(CAND, store);
ok(Object.keys(store).length === 1, "four sweeps over the same storm leave exactly one alert");
ok(store["w1|hail|2026-08-06"].magnitude === 1.75, "at the size it was first seen");

store = {};
runSweep([{ reportKey: "k", magnitude: 1 }], store);
store.k.acknowledged_at = "2026-08-06T14:00:00Z";
runSweep([{ reportKey: "k", magnitude: 1 }], store);
ok(store.k.acknowledged_at === "2026-08-06T14:00:00Z",
  "a repeat sweep does NOT un-acknowledge — the whole point of acknowledging is that it stops shouting");
runSweep([{ reportKey: "k", magnitude: 2.75 }], store);
ok(store.k.acknowledged_at === null,
  "but a genuinely bigger storm reopens it — 'on it' was decided about 1\" hail, not baseballs");
ok(store.k.magnitude === 2.75, "carrying the larger figure");

store = {};
runSweep([{ reportKey: "k", magnitude: 1 }], store);
store.k.dismissed = true;
runSweep([{ reportKey: "k", magnitude: 1 }], store);
ok(store.k.dismissed === true, "a repeat sweep does NOT resurrect a dismissed alert");
runSweep([{ reportKey: "k", magnitude: 2.75 }], store);
ok(store.k.dismissed === false,
  "only a bigger report does — and the dismiss control says so before anyone taps it");

/* ================= behavioral: openStormAlerts ================= */
function openStormAlerts(alerts) {
  return (alerts || [])
    .filter((a) => !a.dismissed && !a.acknowledged_at)
    .sort((a, b) => (a.occurred_on < b.occurred_on ? 1 : a.occurred_on > b.occurred_on ? -1
      : Number(b.magnitude) - Number(a.magnitude)));
}
const A = [
  { id: "1", occurred_on: "2026-08-06", magnitude: 1.5 },
  { id: "2", occurred_on: "2026-08-08", magnitude: 1 },
  { id: "3", occurred_on: "2026-08-08", magnitude: 2.75 },
  { id: "4", occurred_on: "2026-08-07", magnitude: 3, dismissed: true },
  { id: "5", occurred_on: "2026-08-07", magnitude: 3, acknowledged_at: "2026-08-07T10:00:00Z" },
];
const O = openStormAlerts(A);
ok(O.length === 3, "dismissed and acknowledged alerts drop out of the unhandled list");
ok(O[0].id === "3", "newest first, and within a day the biggest stone first");
ok(O[1].id === "2" && O[2].id === "1", "then the rest in date order");
ok(openStormAlerts([]).length === 0, "no alerts is zero, so the banner renders nothing");
ok(openStormAlerts(null).length === 0, "and a hook that hasn't loaded yet doesn't throw");
ok(openStormAlerts(A.map((a) => ({ ...a, dismissed: true }))).length === 0,
  "a company that dismissed everything sees a clean home screen");

/* ================= behavioral: stormAlertAge ================= */
function stormAlertAge(occurredOn, todayIsoStr) {
  if (!occurredOn) return "";
  const days = Math.round((Date.parse(todayIsoStr + "T00:00Z") - Date.parse(occurredOn + "T00:00Z")) / 864e5);
  if (!isFinite(days)) return "";
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  return `${Math.round(days / 7)} weeks ago`;
}
ok(stormAlertAge("2026-08-08", "2026-08-08") === "today", "a storm that landed today says so");
ok(stormAlertAge("2026-08-07", "2026-08-08") === "yesterday", "and yesterday's says that");
ok(stormAlertAge("2026-08-05", "2026-08-08") === "3 days ago", "then a day count");
ok(stormAlertAge("2026-08-01", "2026-08-08") === "last week", "then a week");
ok(stormAlertAge("2026-07-11", "2026-08-08") === "4 weeks ago", "then weeks");
ok(stormAlertAge("2026-08-09", "2026-08-08") === "today",
  "a report timestamped just past local midnight reads as today rather than 'in -1 days'");
ok(stormAlertAge(null, "2026-08-08") === "", "a missing date renders nothing rather than 'NaN days ago'");
ok(stormAlertAge("2026-08-08", "not-a-date") === "", "and an unparseable today does too");

/* ================= behavioral: jobs under a storm ================= */
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
  { id: "a", lat: 41.78, lng: -88.15 }, { id: "b", lat: 41.85, lng: -88.30 },
  { id: "c", lat: 39.0, lng: -94.6 }, { id: "d" },
];
const STORM = { lat: 41.80, lng: -88.20, radius_miles: 20 };
ok(jobsWithinRadius(JOBS, { lat: STORM.lat, lng: STORM.lng, radiusMiles: STORM.radius_miles }).length === 2,
  "an alert counts only the jobs actually under it");
/* The radius travels ON the alert, so an owner widening a watched area
   next month cannot retroactively change what an old alert claimed. */
ok(jobsWithinRadius(JOBS, { lat: STORM.lat, lng: STORM.lng, radiusMiles: 1 }).length === 0,
  "and reading the alert's own recorded radius, not the current setting");
ok(jobsWithinRadius(JOBS, { lat: null, lng: null, radiusMiles: 20 }).length === 0,
  "an alert with no position counts nothing rather than crashing the screen");

if (fails) { console.log("\nbuild 134: " + fails + " FAILED"); process.exit(1); }
console.log("build 134 tests passed");
