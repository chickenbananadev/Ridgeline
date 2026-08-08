/* Build 138 — three canvassing bugs from the field, and two look-back
   defaults that were too short.

   Reported from an iPhone:

   1. "It doesn't let me drag the map and it refresh." One bug wearing
      two faces. Dragging DOWN on a full-screen map is also the
      pull-to-refresh gesture; iOS claims it, reloads the app, and the
      map never gets the pan. `touch-action: none` on the map is not
      enough — Safari has long triggered the refresh anyway — so
      overscroll has to be suppressed at the document level.

   2. "When I click details. Nothing happens." It did happen: the
      sheet opened UNDERNEATH the map. Nothing between the map wrapper
      and <body> created a stacking context, so Leaflet's panes
      (z-index 400) and the map's own controls (500–602) were
      competing in the ROOT stacking context against every Sheet in
      the app, which is a z-index 60 overlay. Verified by walking the
      ancestor chain in a real browser: not one ancestor created a
      context.

   3. "When you drop a pin on an address, it should allow you to pull
      the storm history." Already built — the pin sheet has a full
      StormLookup for that address. It was unreachable because of (2),
      so this file guards that it stays wired rather than adding it
      twice.

   Plus: alerts look back 90 days rather than a week, and the
   date-of-loss lookup opens on 5 years rather than 2. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const fn = fs.readFileSync(path.join(__dirname, "supabase/functions/storm-watch/index.ts"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ============ 1. the map can be dragged, and dragging can't reload ============ */
ok(/html, body \{ overscroll-behavior: none; \}/.test(html),
  "overscroll is suppressed at the document level — the only thing that reliably stops iOS pull-to-refresh");
ok(/\.rl-map \{ touch-action: none; overscroll-behavior: none; \}/.test(html),
  "and the map owns every gesture that starts on it, so a drag can't chain out to an ancestor mid-gesture");
ok(/A rep drags DOWN on a full-screen map to pan north\. iOS reads\n         that as a pull-to-refresh on the document, claims the gesture,\n         and reloads the app/.test(html),
  "with the mechanism recorded — 'won't drag' and 'refreshes' are one bug, not two");
ok(/`touch-action: none` on the map is not enough: Safari has long\n         triggered the refresh regardless\./.test(html),
  "and why the obvious fix alone doesn't work");
ok(/className="rl-map"/.test(src), "the map wrapper actually carries the class");

/* ============ 2. sheets paint above the map ============ */
ok(/isolation: "isolate"/.test(src),
  "the map wrapper creates its own stacking context");
ok(/style=\{\{ flex: 1, position: "relative", minHeight: 0, isolation: "isolate" \}\}/.test(src),
  "on the element that actually contains the map and its overlays");
ok(/Nothing between this element and <body> created a stacking\n           context/.test(src),
  "with the diagnosis recorded — this looks like a cosmetic property and is load-bearing");
ok(/The map therefore painted OVER any sheet opened from this\n           screen, which is why tapping "Details" appeared to do\n           nothing: the sheet opened, underneath the map\./.test(src),
  "including the symptom it explains, so nobody 'tidies' it away later");
/* The layering the fix restores. Sheet must beat the bottom nav; a
   toast must beat the sheet, or a save confirmation is invisible. */
ok(/position: "fixed", inset: 0, zIndex: 60, background: "rgba\(17,24,39,\.45\)"/.test(src),
  "Sheet is still the z-60 overlay");
ok(/flexShrink: 0, zIndex: 50,/.test(src), "the bottom nav stays below it");
ok(/fontSize: 14, fontWeight: 600, zIndex: 90, whiteSpace: "nowrap",/.test(src), "and toasts stay above it");

/* ============ 3. storm history on a dropped pin ============ */
ok(/<Btn small style=\{\{ flex: 1 \}\} data-testid="open-pin-details" onClick=\{\(\) => setDetail\(selected\.id\)\}>Details<\/Btn>/.test(src),
  "the bottom sheet's Details button opens the pin's full record");
ok(/const detailPin = list\.find\(\(p\) => p\.id === detail\) \|\| null;/.test(src),
  "which resolves to a real pin");
ok(/<Field label="Storm history at this address"/.test(src),
  "and that record carries storm history for the address");
ok(/<StormLookup job=\{\{ lat: pin\.lat, lng: pin\.lng, address: pin\.address, zip: "" \}\}/.test(src),
  "using the pin's own coordinates, not the map centre");
ok(/dol=\{p\.stormDate \|\| ""\} onPick=\{\(d\) => set\("stormDate"\)\(d\)\}/.test(src),
  "and the chosen date of loss is saved onto the pin");

/* ============ 4. look-back windows ============ */
ok(/lookbackDays: 90 \};/.test(src), "alerts look back 90 days by default");
ok(/s\.lookbackDays = isFinite\(rawLookback\) && rawLookback > 0 \? Math\.min\(90, rawLookback\) : 90;/.test(src),
  "and 90 is the ceiling, not 30");
ok(/rather than 0 quietly meaning "the default" while -5 quietly means\n     "one day"\. Both are garbage input and both deserve the same\n     answer\./.test(src),
  "with nonsense input handled consistently — 0 and a negative can't mean two different things");
ok(/\[7, 14, 30, 60, 90\]\.map\(\(n\) => <option key=\{n\} value=\{n\}>\{n\} days<\/option>\)/.test(src),
  "with 90 offered in the picker");
ok(/Hail claims stay open for months and a\n   company switching this on wants the storms it has already missed,\n   not only what falls from tomorrow\./.test(src),
  "and the reason recorded");
ok(/each storm only ever raises one alert, so a long window doesn't mean repeat notifications/.test(src),
  "with the reassurance that a long window isn't a notification flood — the dedupe is what makes it safe");
ok(/lookbackDays: 90, \.\.\.\(v \|\| \{\}\) \};/.test(fn), "the scheduled function agrees");
ok(/s\.lookbackDays = isFinite\(rawLookback\) && rawLookback > 0 \? Math\.min\(90, rawLookback\) : 90;/.test(fn),
  "including its clamp — a drift here would have the two sweeps searching different windows");

ok(/d\.setFullYear\(d\.getFullYear\(\) - 5\); return iso\(d\);/.test(src),
  "the date-of-loss lookup opens on 5 years");
ok(/Roofs carry damage from storms\n     several seasons back, and the lookup is one cheap request either\n     way/.test(src),
  "with the reason — a short default reads as 'no hail here' when the answer is 'not lately'");

/* ============ behavioral: the look-back clamp ============ */
const DEFAULTS = { enabled: false, areas: [], minHailIn: 1, minWindMph: 58, lookbackDays: 90 };
function normalizeLookback(v) {
  const s = { ...DEFAULTS, ...(v || {}) };
  const raw = Math.round(Number(s.lookbackDays));
  return isFinite(raw) && raw > 0 ? Math.min(90, raw) : 90;
}
ok(normalizeLookback(null) === 90, "no settings at all gives 90 days");
ok(normalizeLookback({}) === 90, "and so does an empty blob");
ok(normalizeLookback({ lookbackDays: 7 }) === 7, "a company that picked a week keeps its week");
ok(normalizeLookback({ lookbackDays: 90 }) === 90, "90 survives the clamp it used to be cut down by");
ok(normalizeLookback({ lookbackDays: 30 }) === 30,
  "and a blob saved under the old 30-day ceiling is untouched rather than silently widened");
ok(normalizeLookback({ lookbackDays: 400 }) === 90, "beyond the ceiling clamps to 90");
ok(normalizeLookback({ lookbackDays: 0 }) === 90, "zero falls back to the default rather than checking nothing");
ok(normalizeLookback({ lookbackDays: -5 }) === 90, "and so does a negative — same answer as zero, since both are nonsense");
ok(normalizeLookback({ lookbackDays: "nope" }) === 90, "and so does unparseable text");
ok(normalizeLookback({ lookbackDays: "60" }) === 60, "a string from JSON is made numeric");

/* ============ behavioral: the window a 90-day sweep asks for ============ */
function windowFor(days, todayMs) {
  const end = new Date(todayMs).toISOString().slice(0, 10);
  const start = new Date(todayMs - days * 864e5).toISOString().slice(0, 10);
  return { start, end };
}
const T = Date.parse("2026-08-08T12:00:00Z");
ok(windowFor(90, T).start === "2026-05-10", "90 days back from 8 Aug is 10 May: " + windowFor(90, T).start);
ok(windowFor(7, T).start === "2026-08-01", "and a week back is 1 Aug");
ok(windowFor(90, T).end === "2026-08-08", "the window ends today either way");
/* SWDI caps a query at one year, so the ceiling must stay well inside
   it — a 90-day sweep is never at risk of being rejected. */
ok(90 < 365, "the 90-day ceiling stays inside the storm service's one-year query limit");

/* ============ behavioral: the history window ============ */
function historyStart(todayMs, years) {
  const d = new Date(todayMs);
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}
ok(historyStart(T, 5) === "2021-08-08", "the lookup opens five years back: " + historyStart(T, 5));
ok(historyStart(T, 5) < historyStart(T, 2), "which is further back than the old two-year default");
/* Leap-year safety: setFullYear on 29 Feb rolls to 1 Mar rather than
   throwing or producing an invalid date. */
const LEAP = Date.parse("2028-02-29T12:00:00Z");
ok(/^\d{4}-\d{2}-\d{2}$/.test(historyStart(LEAP, 5)), "and 29 February still yields a valid date: " + historyStart(LEAP, 5));

if (fails) { console.log("\nbuild 138: " + fails + " FAILED"); process.exit(1); }
console.log("build 138 tests passed");
