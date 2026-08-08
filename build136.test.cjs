/* Build 136 — more than one source for storm dates.

   The complaint: NOAA-only isn't accurate enough. It's a fair one, and
   the reason is specific. Local Storm Reports only exist where a human
   stood outside during a hailstorm and phoned it in. That makes them
   sparse and biased toward towns, roads and daylight — a roof two miles
   from the nearest spotter can be destroyed while the lookup says "no
   hail found", which is not "no hail happened" but reads exactly like
   it and loses the claim.

   Two sources are added, both free, both national:

   RADAR (NEXRAD Level-3 via NCEI's Severe Weather Data Inventory) has
   no coverage gap. It answers "did hail cross THIS roof" instead of
   "did anyone near this roof call it in". It is the single biggest
   accuracy gain available, and it is the same data the commercial
   hail-report companies resell.

   MEASURED GUSTS (ASOS/AWOS airport instruments via IEM) replace a
   spotter's estimate or a model's guess with an instrument reading —
   the most defensible wind number there is.

   Neither one outranks the spotter reports; they answer different
   questions. A spotter measured a stone against a ruler and is better
   evidence OF SIZE. Radar saw every address and is better evidence of
   COVERAGE. So all of it is shown, each tagged with what it is, and
   the code is careful never to let a radar ESTIMATE read as a
   MEASUREMENT — that is how a claim gets picked apart.

   The failure modes guarded here are the ones that fail quietly:
   a service contract detail that truncates results, a missing field
   that reads as zero, and a lookup failure that reads as "nothing
   happened". */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const fn = fs.readFileSync(path.join(__dirname, "supabase/functions/storm-watch/index.ts"), "utf8");
const sql = fs.readFileSync(path.join(__dirname, "supabase/migrations/039_storm_alert_source.sql"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ============ 1. radar hail: the service contract's landmines ============ */
ok(/async function fetchRadarHail\(lat, lng, start, end, radiusMiles = LSR_RADIUS_DEG \* 69\) \{/.test(src),
  "radar hail has its own fetch, with the search radius a caller can narrow");
ok(/const SWDI_LIMIT = 20000;/.test(src) && /limit=\$\{SWDI_LIMIT\}/.test(src),
  "the row limit is ALWAYS sent — it defaults to 25, which would silently truncate a real hailstorm");
ok(/`limit` DEFAULTS TO 25\. A serious hailstorm produces thousands\s*\n      of cell detections; taking the default would silently truncate/.test(src),
  "and the comment records why, because 25 rows looks like a working answer");
ok(/`radius` IS DOCUMENTED AS UNRELIABLE/.test(src),
  "the radius parameter is documented as unreliable and deliberately not used");
ok(/\?bbox=\$\{bbox\}&limit=/.test(src),
  "the spatial filter is bbox, which is unambiguous decimal degrees");
ok(/if \(miles > radiusMiles\) continue;/.test(src),
  "plus a client-side distance check, so the answer is right whichever shape the service accepted");
ok(/`enddate` IS EXCLUSIVE/.test(src),
  "the exclusive end date is called out — an inclusive read drops the day people actually ask about");
ok(/const stop = new Date\(Date\.parse\(end \+ "T00:00Z"\) \+ 2 \* 864e5\)/.test(src),
  "and the window is widened to cover it, plus the local-vs-UTC evening shift");
ok(/tile=\$\{lng\.toFixed\(1\)\},\$\{lat\.toFixed\(1\)\}/.test(src),
  "a coarser tile query is the fallback if bbox is refused");
ok(/Never\s*\n       fall back to an unbounded national query here/.test(src),
  "but never an unbounded national query — radar cells number in the millions, unlike storm reports");

/* ============ 2. tolerant parsing, because a silent null reads as "no hail" ============ */
ok(/function swdiNum\(row, names\) \{/.test(src), "numeric fields are read across candidate spellings");
ok(/build 127's bug was precisely a field-name assumption\s*\n   \(`type` vs `typetext`\) that silently reported no hail for months/.test(src),
  "with the precedent that motivated it recorded");
ok(/const size = swdiNum\(r, \["MAXSIZE", "MAX_SIZE", "SIZE", "MESH"\]\);/.test(src),
  "hail size accepts the plausible field names");
ok(/if \(size == null\) continue;/.test(src),
  "and a row with no readable size is skipped rather than counted as zero-inch hail");
ok(/function swdiRows\(payload\) \{/.test(src), "the response envelope is also read tolerantly");

/* ============ 3. measured gusts ============ */
ok(/async function fetchMeasuredGusts\(lat, lng, state, start, end\) \{/.test(src), "measured gusts have a fetch");
ok(/if \(!state\) return null;\s*\/\/ no state, no station list — say nothing rather than guess/.test(src),
  "with no state there's no station network to ask, so it says nothing rather than guessing");
ok(/function nearestStations\(features, lat, lng, n = 3\) \{/.test(src),
  "station choice is a pure function, checkable without a network");
ok(/https:\/\/mesonet\.agron\.iastate\.edu\/geojson\/network\/\$\{net\}\.geojson/.test(src),
  "using the documented per-state station GeoJSON");
ok(/deliberately does not fan out per station/.test(src),
  "one multi-station request, because the service is rate-limited to about one call a second");
ok(/function parseAsosCsv\(text\) \{/.test(src), "the CSV answer is parsed by a named function");
ok(/const idx = \(name\) => head\.indexOf\(name\);/.test(src),
  "by HEADER NAME, not column position — the column set changes with the data parameter");
ok(/if \(!v \|\| v === "M" \|\| v === "T"\) return null;/.test(src),
  "missing values are rejected explicitly");
ok(/Number\(""\)\s*\n       is 0 — so an empty cell must be rejected explicitly or a calm\s*\n       hour would report as a zero-mph gust and drag a max down/.test(src),
  "and the comment says why: Number(\"\") is 0, which would quietly wreck a daily maximum");
ok(/mph: knots \* 1\.15078,\s+\/\/ ASOS reports knots/.test(src),
  "knots are converted — the same class of bug as the spotter wind conversion");

/* ============ 4. the evidence ladder ============ */
ok(/const STORM_SOURCES = \{/.test(src), "the sources are a registry, not scattered strings");
ok(/measured: \{ rank: 4/.test(src) && /reported: \{ rank: 3/.test(src)
  && /radar: \{ rank: 2/.test(src) && /modelled: \{ rank: 1/.test(src),
  "ranked: an instrument beats a spotter beats radar beats a model");
ok(/Radar does not outrank a spotter and a spotter does not outrank\s*\n   radar; they answer different questions and both are shown\./.test(src),
  "with the important caveat recorded — the ladder governs phrasing, not which evidence survives");
ok(/function stormEvidence\(r\) \{/.test(src), "what backs a day is computable and pure");
ok(/function bestHail\(r\) \{/.test(src), "and there's one definition of the best hail figure available");

/* ============ 5. radar days can now appear at all ============ */
ok(/function mergeStormDays\(days, reportsByDate, radarByDate, gustByDate\) \{/.test(src),
  "the merge takes all four sources");
ok(/\.filter\(\(r\) => r\.reports \|\| r\.radarHailIn != null \|\| r\.hail \|\| r\.highWind \|\| r\.storm/.test(src),
  "a radar-only day is included — before this it could not appear in the list at all");
ok(/That is the "it says\s*\n   no hail but the roof is destroyed" case, and it is now a day with\s*\n   evidence on it\./.test(src),
  "and the comment names the exact complaint this fixes");
ok(/\|\| \(r\.measuredGust != null && r\.measuredGust >= 45\)/.test(src),
  "a measured gust earns a row only at a damaging speed — every breezy Tuesday has a peak gust");
ok(/const hailIn = r\.hailIn \?\? r\.radarHailIn \?\? null;/.test(src),
  "severity ranking can see radar hail");
ok(/Before this, a day the radar saw hail over the house but nobody\s*\n     phoned in scored ZERO for hail and sank below a rainy afternoon/.test(src),
  "which matters because such a day used to rank below a rainy afternoon");

/* ============ 6. never let an estimate read as a measurement ============ */
ok(/const est = a\.source === "radar" \? " est" \: "";/.test(src),
  "a radar-sourced alert headline says 'est'");
ok(/A radar figure that reads like\s*\n       a measured one is how a rep ends up quoting an estimate to an\s*\n       adjuster as though someone had held a ruler to the stone\./.test(src),
  "with the reason recorded, because it looks like a cosmetic detail");
ok(/Hail — \{r\.hailIn\.toFixed\(2\)\.replace\(\/\\\.\?0\+\$\/, ""\)\}″\{size \? ` \(\$\{size\}\)` : ""\} · Spotter/.test(src),
  "the spotter chip says Spotter");
ok(/″ est · Radar/.test(src), "and the radar chip says est · Radar");
ok(/Spotter and radar hail are shown SIDE BY SIDE when\s*\n                        both exist rather than one replacing the other\./.test(src),
  "both are shown together when both exist — an adjuster conversation uses both");
ok(/\{r\.measuredGust\} mph · Measured/.test(src), "measured wind is labelled Measured");
ok(/Measured beats reported beats modelled, and only\s*\n                        the strongest one gets a chip/.test(src),
  "but only the strongest wind number gets a chip — three on one row is noise");

/* ============ 7. failures are named, not absorbed ============ */
ok(/setMissing\(\[\s*\n\s*!reports && "spotter reports",\s*\n\s*!radar && "radar hail",\s*\n\s*state && !gusts && "measured wind",\s*\n\s*\]\.filter\(Boolean\)\);/.test(src),
  "each source that failed is named individually");
ok(/label=\{`Couldn't check \$\{missing\.join\(" or "\)\}`\}/.test(src),
  "and the warning says which one");
ok(/This is not evidence that nothing happened here\./.test(src),
  "stating plainly that a failed lookup is not an all-clear");
ok(/if \(!days && !reports && !radar\) \{ setErr/.test(src),
  "only a total failure is a hard error — one source answering is still an answer");

/* ============ 8. alerts, and the shared Edge Function ============ */
ok(/function detectStormAlerts\(reportsByDate, area, thresholds, radarByDate\) \{/.test(src),
  "detection takes radar too");
ok(/RADAR IS WHY THIS CATCHES STORMS IT USED TO MISS\./.test(src),
  "and says why that is the point");
ok(/if \(seen\.has\(`hail\|\$\{date\}`\)\) return;\s+\/\/ a measured stone already covers this day/.test(src),
  "a spotter report wins when both exist for a day — no double alert");
ok(/source: "radar",/.test(src) && /source: "reported",/.test(src),
  "each candidate records which evidence raised it");
ok(/const \[reports, radar\] = await Promise\.all\(\[/.test(src),
  "the in-app sweep asks both sources at once");
ok(/if \(!reports && !radar\) continue;/.test(src),
  "and skips only when BOTH failed");
ok(/add column if not exists source text not null default 'reported'/.test(sql),
  "039 records the source on the alert");
ok(/Defaults to 'reported' so every alert raised before this migration\n-- keeps its correct meaning/.test(sql),
  "defaulting so existing alerts keep their true meaning rather than being relabelled");
ok(/async function fetchRadarHail\(lat: number, lng: number, start: string, end: string, radiusMiles\?: number\)/.test(fn),
  "the scheduled function has the same radar fetch");
ok(/const SWDI_LIMIT = 20000;/.test(fn), "including the limit that stops silent truncation");
ok(/source: c\.source \|\| "reported",     \/\/ 039: radar estimate vs measured stone/.test(fn),
  "and writes the source through");
ok(/if \(!reports && !radar\) \{ summary\.lookupFailed\+\+; continue; \}/.test(fn),
  "with the same both-failed rule as the app");

/* ================= behavioral: swdiNum ================= */
function swdiNum(row, names) {
  for (const n of names) {
    const v = row[n] ?? row[n.toLowerCase()] ?? row[n.toUpperCase()];
    if (v == null || v === "") continue;
    const f = parseFloat(v);
    if (isFinite(f)) return f;
  }
  return null;
}
const SIZE = ["MAXSIZE", "MAX_SIZE", "SIZE", "MESH"];
ok(swdiNum({ MAXSIZE: "1.75" }, SIZE) === 1.75, "reads the documented field name");
ok(swdiNum({ maxsize: "1.75" }, SIZE) === 1.75, "and the same name lowercased");
ok(swdiNum({ MESH: 2.5 }, SIZE) === 2.5, "and an alternative spelling, as a number");
ok(swdiNum({ MAXSIZE: "" }, SIZE) === null, "an empty value is NOT zero — that would report no hail as hail of size 0");
ok(swdiNum({ MAXSIZE: null }, SIZE) === null, "nor is null");
ok(swdiNum({ MAXSIZE: "M" }, SIZE) === null, "nor an unparseable marker");
ok(swdiNum({}, SIZE) === null, "a row missing the field entirely yields nothing rather than a wrong number");
ok(swdiNum({ MAXSIZE: "", MESH: "1.25" }, SIZE) === 1.25, "and it keeps looking past an empty first candidate");

/* ================= behavioral: parseAsosCsv ================= */
function parseAsosCsv(text) {
  const lines = String(text || "").split("\n").filter((l) => l && !l.startsWith("#"));
  if (lines.length < 2) return [];
  const head = lines[0].split(",").map((h) => h.trim());
  const idx = (name) => head.indexOf(name);
  const iSta = idx("station"), iTime = idx("valid"),
    iGust = idx("gust"), iPeak = idx("peak_wind_gust"), iLon = idx("lon"), iLat = idx("lat");
  if (iSta < 0 || iTime < 0) return [];
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split(",");
    const num = (j) => {
      if (j < 0) return null;
      const v = (c[j] || "").trim();
      if (!v || v === "M" || v === "T") return null;
      const f = parseFloat(v);
      return isFinite(f) ? f : null;
    };
    const knots = Math.max(num(iGust) ?? -1, num(iPeak) ?? -1);
    if (knots < 0) continue;
    out.push({ station: (c[iSta] || "").trim(), valid: (c[iTime] || "").trim(),
      mph: knots * 1.15078, lat: num(iLat), lng: num(iLon) });
  }
  return out;
}
const CSV = [
  "# a comment line the service prepends",
  "station,valid,lon,lat,gust,peak_wind_gust",
  "DPA,2026-08-06 21:53,-88.32,41.91,45,62",
  "DPA,2026-08-06 22:53,-88.32,41.91,M,M",
  "ORD,2026-08-06 21:51,-87.90,41.98,38,M",
  "ORD,2026-08-06 23:51,-87.90,41.98,,",
].join("\n");
const obs = parseAsosCsv(CSV);
ok(obs.length === 2, "rows with no usable gust are dropped, comments ignored");
ok(Math.round(obs[0].mph) === 71, "62 knots reads as 71 mph — the peak gust wins over the routine one");
ok(Math.round(obs[1].mph) === 44, "and 38 knots as 44 mph");
ok(obs.every((o) => o.mph > 0), "a blank cell never becomes a zero-mph gust");
ok(parseAsosCsv("").length === 0, "empty input is no observations, not a crash");
ok(parseAsosCsv("# only a comment").length === 0, "nor is a comment-only response");
ok(parseAsosCsv("station,valid\nDPA,2026-08-06 21:53").length === 0,
  "a response with no gust columns yields nothing rather than inventing a number");
/* Column order must not matter — the `data` parameter controls it. */
const REORDERED = ["valid,peak_wind_gust,station,gust", "2026-08-06 21:53,62,DPA,45"].join("\n");
ok(Math.round(parseAsosCsv(REORDERED)[0].mph) === 71 && parseAsosCsv(REORDERED)[0].station === "DPA",
  "reordering the columns changes nothing, because parsing is by header name");

/* ================= behavioral: nearestStations ================= */
function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
function nearestStations(features, lat, lng, n = 3) {
  return (features || [])
    .map((f) => {
      const c = f.geometry && f.geometry.coordinates;
      const sid = f.properties && f.properties.sid;
      if (!c || !sid) return null;
      return { sid, name: (f.properties.sname || sid), lat: c[1], lng: c[0],
        miles: haversineMiles(lat, lng, c[1], c[0]) };
    })
    .filter(Boolean).sort((a, b) => a.miles - b.miles).slice(0, n);
}
const stn = (sid, lng, lat, sname) => ({ properties: { sid, sname }, geometry: { coordinates: [lng, lat] } });
const NET = [
  stn("ORD", -87.90, 41.98, "Chicago O'Hare"),
  stn("DPA", -88.32, 41.91, "DuPage"),
  stn("ARR", -88.48, 41.77, "Aurora"),
  stn("MDW", -87.75, 41.79, "Chicago Midway"),
  { properties: {}, geometry: { coordinates: [-88, 41] } },      // no sid
  { properties: { sid: "BAD" } },                                 // no geometry
];
const near = nearestStations(NET, 41.78, -88.15, 3);
ok(near.length === 3, "the three nearest stations are chosen");
ok(near[0].sid === "DPA", "nearest first: " + near.map((s) => s.sid).join(","));
ok(near[0].miles < near[1].miles && near[1].miles < near[2].miles, "strictly by distance");
ok(near.every((s) => s.sid !== "BAD"), "a station with no coordinates is dropped rather than crashing the lookup");
ok(near[0].name === "DuPage", "the human-readable name comes along, for the claim file");
ok(near[0].miles < 20, "and the distance, because a gust 60 miles away is not this roof's wind");
ok(nearestStations([], 41, -88).length === 0, "an empty network is no stations");
ok(nearestStations(null, 41, -88).length === 0, "and a failed network fetch doesn't throw");

/* ================= behavioral: the evidence ladder ================= */
const STORM_SOURCES = {
  measured: { rank: 4, label: "Measured" }, reported: { rank: 3, label: "Spotter" },
  radar: { rank: 2, label: "Radar" }, modelled: { rank: 1, label: "Modelled" },
};
function stormEvidence(r) {
  const out = [];
  if (!r) return out;
  if (r.measuredGust != null) out.push({ source: "measured", peril: "wind", value: r.measuredGust });
  if (r.hailIn != null) out.push({ source: "reported", peril: "hail", value: r.hailIn });
  if (r.reportWind != null) out.push({ source: "reported", peril: "wind", value: r.reportWind });
  if (r.radarHailIn != null) out.push({ source: "radar", peril: "hail", value: r.radarHailIn });
  if (r.gust != null && r.measuredGust == null && r.reportWind == null) {
    out.push({ source: "modelled", peril: "wind", value: r.gust });
  }
  return out.sort((a, b) => STORM_SOURCES[b.source].rank - STORM_SOURCES[a.source].rank);
}
const FULL = { measuredGust: 71, hailIn: 1.75, reportWind: 60, radarHailIn: 2.5, gust: 55 };
const ev = stormEvidence(FULL);
ok(ev[0].source === "measured", "the instrument reading leads");
ok(ev.some((e) => e.source === "radar") && ev.some((e) => e.source === "reported"),
  "radar and spotter BOTH survive — neither is dropped in favour of the other");
ok(!ev.some((e) => e.source === "modelled"),
  "but the model is omitted once anything observed exists — it is context, not a finding");
ok(stormEvidence({ gust: 55 })[0].source === "modelled",
  "with nothing observed, the model is still shown rather than an empty row");
ok(stormEvidence({ radarHailIn: 1.25 }).length === 1,
  "a radar-only day has exactly one piece of evidence, and it appears");
ok(stormEvidence({}).length === 0, "a quiet day claims nothing");
ok(stormEvidence(null).length === 0, "and a missing row doesn't throw");

/* ================= behavioral: bestHail ================= */
function bestHail(r) {
  if (!r) return null;
  if (r.hailIn != null) return { inches: r.hailIn, source: "reported" };
  if (r.radarHailIn != null) return { inches: r.radarHailIn, source: "radar" };
  return null;
}
ok(bestHail({ hailIn: 1.75, radarHailIn: 2.5 }).source === "reported",
  "a measured stone leads even when radar estimated bigger — provenance beats magnitude here");
ok(bestHail({ hailIn: 1.75, radarHailIn: 2.5 }).inches === 1.75, "and carries the measured figure");
ok(bestHail({ radarHailIn: 2.5 }).source === "radar", "with no spotter, radar is the answer");
ok(bestHail({ radarHailIn: 2.5 }).inches === 2.5, "at its estimated size");
ok(bestHail({}) === null, "and no hail is null, not zero");

/* ================= behavioral: radar-only days now rank ================= */
function stormSeverity(r) {
  const hailIn = r.hailIn ?? r.radarHailIn ?? null;
  const hailScore = hailIn != null ? (r.hailIn != null ? 4000 : 3800) + hailIn * 500 : r.hail ? 3000 : 0;
  return hailScore + (r.measuredGust || r.reportWind || r.gust || 0)
    + (r.storm ? 20 : 0) + (r.precip ? r.precip * 12 : 0);
}
const rainyDay = { date: "2026-08-01", precip: 1.4, gust: 30 };
const radarDay = { date: "2026-08-06", radarHailIn: 1.25 };
ok(stormSeverity(radarDay) > stormSeverity(rainyDay),
  "a day radar saw hail on now outranks a rainy afternoon — the exact inversion that hid these days");
const spotterDay = { date: "2026-08-06", hailIn: 1.25 };
ok(stormSeverity(spotterDay) > stormSeverity(radarDay),
  "a spotter-confirmed day of the same size still edges out a radar estimate");
ok(stormSeverity({ hailIn: 2.5 }) > stormSeverity({ hailIn: 1 }), "and bigger hail still outranks smaller");
ok(stormSeverity({ measuredGust: 71 }) > stormSeverity({ gust: 55 }),
  "a measured gust counts for more than a modelled one of lower speed");

/* ================= behavioral: merge includes radar-only days ================= */
function mergeStormDays(days, reportsByDate, radarByDate, gustByDate) {
  const byDate = new Map();
  const blank = (date) => ({ date, gust: null, precip: null, code: null,
    hail: false, highWind: false, damagingWind: false, storm: false });
  (days || []).forEach((d) => byDate.set(d.date, { ...d }));
  Object.entries(reportsByDate || {}).forEach(([date, rep]) => {
    const base = byDate.get(date) || blank(date);
    byDate.set(date, { ...base, hailIn: rep.hailIn, reportWind: rep.reportWind,
      reports: rep.count, reportList: rep.reports });
  });
  Object.entries(radarByDate || {}).forEach(([date, rad]) => {
    const base = byDate.get(date) || blank(date);
    byDate.set(date, { ...base, radarHailIn: rad.maxSizeIn, radarCells: rad.cells,
      radarNearestMiles: rad.nearestMiles });
  });
  Object.entries(gustByDate || {}).forEach(([date, g]) => {
    const base = byDate.get(date) || blank(date);
    byDate.set(date, { ...base, measuredGust: g.gustMph == null ? null : Math.round(g.gustMph) });
  });
  return [...byDate.values()]
    .filter((r) => r.reports || r.radarHailIn != null || r.hail || r.highWind || r.storm
      || (r.measuredGust != null && r.measuredGust >= 45)
      || (r.precip != null && r.precip >= 0.75))
    .sort((a, b) => stormSeverity(b) - stormSeverity(a) || (a.date < b.date ? 1 : -1));
}
/* THE HEADLINE CASE: ERA5 saw a calm day, no spotter called anything
   in, and radar saw 2" hail overhead. Before this build the lookup
   returned nothing at all. */
const merged = mergeStormDays(
  [{ date: "2026-08-06", gust: 22, precip: 0.1, hail: false, highWind: false, storm: false }],
  {},
  { "2026-08-06": { maxSizeIn: 2, cells: 14, nearestMiles: 0.4 } },
  {},
);
ok(merged.length === 1, "a radar-only hail day appears — it previously could not appear at all");
ok(merged[0].radarHailIn === 2, "carrying the estimated size");
ok(merged[0].radarCells === 14, "and how many detections back it");
ok(mergeStormDays([{ date: "2026-08-06", gust: 22, precip: 0.1 }], {}, {}, {}).length === 0,
  "while a genuinely calm day with nothing on it still returns nothing");
const both = mergeStormDays([], { d: { hailIn: 1.75, count: 3, reports: [] } },
  { d: { maxSizeIn: 2.5, cells: 9, nearestMiles: 0.2 } }, {});
ok(both[0].hailIn === 1.75 && both[0].radarHailIn === 2.5,
  "when both exist, BOTH are kept — the row can show a measured stone and radar coverage side by side");
const windy = mergeStormDays([], {}, {}, { d: { gustMph: 71.4 } });
ok(windy.length === 1 && windy[0].measuredGust === 71, "a measured damaging gust earns a row on its own");
ok(mergeStormDays([], {}, {}, { d: { gustMph: 30 } }).length === 0,
  "but an ordinary breezy day does not — every day has a peak gust, and listing them buries the storms");

/* ================= behavioral: alerts from radar ================= */
function stormAlertKey(watchId, kind, date) { return `${watchId}|${kind}|${date}`; }
function detectStormAlerts(reportsByDate, area, thresholds, radarByDate) {
  if (!area || area.lat == null) return [];
  const t = { minHailIn: 0, minWindMph: 0, ...(thresholds || {}) };
  const radius = Number(area.radiusMiles) || 15;
  const out = []; const seen = new Set();
  Object.entries(reportsByDate || {}).forEach(([date, day]) => {
    const worst = {};
    (day.reports || []).forEach((r) => {
      if (r.kind !== "hail") return;
      if (r.miles != null && r.miles > radius) return;
      if (r.mag == null || r.mag < t.minHailIn) return;
      const cur = worst.hail;
      if (!cur) worst.hail = { value: r.mag, count: 1 };
      else { cur.count++; if (r.mag > cur.value) cur.value = r.mag; }
    });
    Object.entries(worst).forEach(([kind, w]) => {
      out.push({ kind, occurredOn: date, magnitude: w.value, source: "reported",
        reportKey: stormAlertKey(area.id, kind, date) });
      seen.add(`${kind}|${date}`);
    });
  });
  Object.entries(radarByDate || {}).forEach(([date, rad]) => {
    if (seen.has(`hail|${date}`)) return;
    const size = rad && rad.maxSizeIn;
    if (size == null || !isFinite(size) || size < t.minHailIn) return;
    if (rad.nearestMiles != null && rad.nearestMiles > radius) return;
    out.push({ kind: "hail", occurredOn: date, magnitude: size, source: "radar",
      reportKey: stormAlertKey(area.id, "hail", date) });
  });
  return out;
}
const AREA = { id: "w1", lat: 41.78, lng: -88.15, radiusMiles: 20 };
const TH = { minHailIn: 1, minWindMph: 58 };
const radarOnly = detectStormAlerts({}, AREA, TH, { "2026-08-06": { maxSizeIn: 1.75, cells: 8, nearestMiles: 2 } });
ok(radarOnly.length === 1, "radar alone raises an alert — the storm nobody phoned in");
ok(radarOnly[0].source === "radar", "tagged as radar, so it can never be quoted as a measurement");
ok(detectStormAlerts({}, AREA, TH, { d: { maxSizeIn: 0.75, nearestMiles: 2 } }).length === 0,
  "radar hail under the company's threshold still raises nothing");
ok(detectStormAlerts({}, AREA, TH, { d: { maxSizeIn: 2, nearestMiles: 40 } }).length === 0,
  "and radar hail outside the watched radius raises nothing");
const bothSrc = detectStormAlerts(
  { "2026-08-06": { reports: [{ kind: "hail", mag: 1.75, miles: 3 }] } }, AREA, TH,
  { "2026-08-06": { maxSizeIn: 2.5, nearestMiles: 1 } });
ok(bothSrc.length === 1, "a day with both sources raises ONE alert, not two");
ok(bothSrc[0].source === "reported", "and the measured stone is what it reports");
ok(bothSrc[0].magnitude === 1.75, "at the measured size, not the radar estimate");
const twoDays = detectStormAlerts(
  { "2026-08-06": { reports: [{ kind: "hail", mag: 1.75, miles: 3 }] } }, AREA, TH,
  { "2026-08-07": { maxSizeIn: 1.5, nearestMiles: 1 } });
ok(twoDays.length === 2, "different days from different sources are separate alerts");
ok(new Set(twoDays.map((a) => a.reportKey)).size === 2, "with distinct keys, so neither overwrites the other");

if (fails) { console.log("\nbuild 136: " + fails + " FAILED"); process.exit(1); }
console.log("build 136 tests passed");
