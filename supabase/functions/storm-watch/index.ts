// Edge Function: sweep NOAA storm reports for every tenant's watched
// areas and raise storm alerts.
//
// WHY THIS EXISTS WHEN THE APP ALREADY SWEEPS
//
// The in-app sweep only runs while somebody has the app open. Hail
// lands at 9pm on a Saturday, and the useful window for knocking a
// storm is the next morning — not whenever a rep next opens their
// phone. This runs on a schedule so the alert is already waiting.
//
// Nothing breaks without it. Deploying this is an upgrade, not a
// requirement: a company that never deploys it still gets alerts,
// just later.
//
// THE DETECTION LOGIC BELOW IS A PORT, NOT A SECOND OPINION
//
// lsrKind, lsrWindMph, localDateAt, haversineMiles, fetchStormReports,
// stormAlertKey and detectStormAlerts are the same functions as in
// ridgeline.jsx, deliberately kept identical. If they drift, the
// scheduled sweep and the in-app sweep will disagree about what
// counts as a storm, and the same hail will raise two different
// alerts — which is exactly what report_key exists to prevent. Change
// one, change both.
//
// TENANT STAMPING — the one thing that differs from the app
//
// This runs on the service role, where auth.uid() is null, so
// migration 015's set_tenant_id() trigger cannot fill tenant_id and
// would leave it NULL. A NULL tenant_id row is invisible to every
// authenticated user (the RLS policy compares against
// current_tenant_id()), so the alert would be written and never seen.
// Every insert below sets tenant_id EXPLICITLY.
//
// Deploy:   supabase functions deploy storm-watch --no-verify-jwt
// Schedule: see DEPLOY.md — pg_cron calling this hourly
// Secrets:  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (both provided
//           automatically by the platform), plus STORM_WATCH_SECRET
//           to stop anyone on the internet triggering a sweep.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LSR_RADIUS_DEG = 0.45; // ~30 mi — matches the app

function lsrKind(p: Record<string, unknown>) {
  const t = String(p.typetext || "").toUpperCase();
  const code = String(p.type || "").toUpperCase();
  if (t.includes("HAIL") || code === "H") return "hail";
  if (t.includes("TORNADO") || code === "T") return "tornado";
  if (/WND GST|WIND|DOWNBURST/.test(t) || code === "G") return "wind";
  if (/DMG|DAMAGE/.test(t) || code === "D") return "damage";
  return "other";
}

function lsrWindMph(mag: number, unit: unknown) {
  if (!isFinite(mag)) return null;
  return /KT|KNOT/i.test(String(unit || "")) ? mag * 1.15078 : mag;
}

function localDateAt(utcIso: string, lng: number) {
  const t = Date.parse(utcIso);
  if (!isFinite(t)) return null;
  return new Date(t + Math.round(lng / 15) * 3600000).toISOString().slice(0, 10);
}

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

async function fetchStormReports(lat: number, lng: number, start: string, end: string) {
  try {
    const ets = new Date(Date.parse(end + "T00:00Z") + 2 * 864e5).toISOString().slice(0, 10);
    const base = `https://mesonet.agron.iastate.edu/geojson/lsr.geojson?sts=${start}T00:00Z&ets=${ets}T00:00Z`;
    const bbox = `&west=${(lng - LSR_RADIUS_DEG).toFixed(3)}&east=${(lng + LSR_RADIUS_DEG).toFixed(3)}`
      + `&south=${(lat - LSR_RADIUS_DEG).toFixed(3)}&north=${(lat + LSR_RADIUS_DEG).toFixed(3)}`;
    let gj: { features?: unknown[] } | null = null;
    for (const url of [base + bbox, base]) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        gj = await res.json();
        if (gj && Array.isArray(gj.features)) break;
        gj = null;
      } catch { /* try the next shape */ }
    }
    if (!gj) return null;
    const byDate: Record<string, { reports: Record<string, unknown>[] }> = {};
    for (const f of (gj.features || []) as Record<string, any>[]) {
      const c = f.geometry && f.geometry.coordinates;
      if (!c) continue;
      const [flng, flat] = c;
      const miles = haversineMiles(lat, lng, flat, flng);
      if (miles > LSR_RADIUS_DEG * 69) continue;
      const p = f.properties || {};
      const date = localDateAt(p.valid, lng);
      if (!date || date < start || date > end) continue;
      const kind = lsrKind(p);
      if (kind === "other") continue;
      const mag = parseFloat(p.magnitude);
      const row = byDate[date] || (byDate[date] = { reports: [] });
      row.reports.push({
        kind, mag: isFinite(mag) ? mag : null, unit: p.unit || "",
        city: p.city || "", county: p.county || "", state: p.state || "",
        lat: flat, lng: flng, miles,
      });
    }
    return byDate;
  } catch { return null; }
}

// Radar-detected hail from NCEI's Severe Weather Data Inventory. See
// the app's copy for the full reasoning; the contract details that
// bite are: `limit` defaults to 25 (so a real storm truncates
// silently), `radius` is documented as unreliable (so the spatial
// filter is bbox plus a client-side distance check), and `enddate` is
// exclusive.
const SWDI_LIMIT = 20000;

function swdiNum(row: Record<string, any>, names: string[]) {
  for (const n of names) {
    const v = row[n] ?? row[n.toLowerCase()] ?? row[n.toUpperCase()];
    if (v == null || v === "") continue;
    const f = parseFloat(v);
    if (isFinite(f)) return f;
  }
  return null;
}

function swdiRows(payload: Record<string, any> | null) {
  if (!payload) return null;
  for (const k of ["result", "results", "data", "rows"]) {
    if (Array.isArray(payload[k])) return payload[k];
  }
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.features)) {
    return payload.features.map((f: Record<string, any>) => ({
      ...(f.properties || {}),
      LAT: f.geometry?.coordinates?.[1], LON: f.geometry?.coordinates?.[0],
    }));
  }
  return null;
}

async function fetchRadarHail(lat: number, lng: number, start: string, end: string, radiusMiles?: number) {
  const reach = Number(radiusMiles) || LSR_RADIUS_DEG * 69;
  const deg = Math.max(0.05, reach / 69);
  const compact = (d: string) => d.replace(/-/g, "");
  const stop = new Date(Date.parse(end + "T00:00Z") + 2 * 864e5).toISOString().slice(0, 10);
  const range = `${compact(start)}:${compact(stop)}`;
  const bbox = `${(lng - deg).toFixed(3)},${(lat - deg).toFixed(3)},${(lng + deg).toFixed(3)},${(lat + deg).toFixed(3)}`;
  const base = `https://www.ncei.noaa.gov/swdiws/json/nx3hail/${range}`;
  try {
    let rows: Record<string, any>[] | null = null;
    for (const url of [
      `${base}?bbox=${bbox}&limit=${SWDI_LIMIT}`,
      `${base}?tile=${lng.toFixed(1)},${lat.toFixed(1)}&limit=${SWDI_LIMIT}`,
    ]) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        rows = swdiRows(await res.json());
        if (rows) break;
      } catch { /* try the next shape */ }
    }
    if (!rows) return null;
    const byDate: Record<string, Record<string, any>> = {};
    for (const r of rows) {
      const rlat = swdiNum(r, ["LAT", "Latitude"]);
      const rlng = swdiNum(r, ["LON", "LONGITUDE", "Longitude"]);
      if (rlat == null || rlng == null) continue;
      const miles = haversineMiles(lat, lng, rlat, rlng);
      if (miles > reach) continue;
      const size = swdiNum(r, ["MAXSIZE", "MAX_SIZE", "SIZE", "MESH"]);
      if (size == null) continue;
      const when = r.ZTIME || r.ztime || r.TIME || r.time || "";
      const date = localDateAt(String(when).replace(" ", "T").replace(/Z?$/, "Z"), lng);
      if (!date || date < start || date > end) continue;
      const row = byDate[date] || (byDate[date] = { maxSizeIn: null, cells: 0, nearestMiles: null });
      row.cells++;
      row.maxSizeIn = Math.max(row.maxSizeIn ?? 0, size);
      if (row.nearestMiles == null || miles < row.nearestMiles) row.nearestMiles = miles;
    }
    return byDate;
  } catch { return null; }
}

function stormAlertKey(watchId: string, kind: string, date: string) {
  return `${watchId}|${kind}|${date}`;
}

function detectStormAlerts(
  reportsByDate: Record<string, { reports: Record<string, any>[] }> | null,
  area: Record<string, any>,
  thresholds: { minHailIn?: number; minWindMph?: number },
  radarByDate?: Record<string, any> | null,
) {
  if (!area || area.lat == null) return [];
  const t = { minHailIn: 0, minWindMph: 0, ...(thresholds || {}) };
  const radius = Number(area.radiusMiles) || 15;
  const out: Record<string, any>[] = [];
  const seen = new Set<string>();
  Object.entries(reportsByDate || {}).forEach(([date, day]) => {
    const worst: Record<string, { value: number; report: Record<string, any>; count: number }> = {};
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
        lat: r.lat != null ? r.lat : area.lat,
        lng: r.lng != null ? r.lng : area.lng,
        radiusMiles: radius,
        place: [r.city, [r.county, r.state].filter(Boolean).join(" ")].filter(Boolean).join(", "),
        reportCount: w.count,
        source: "reported",
        reportKey: stormAlertKey(area.id, kind, date),
      });
      seen.add(`${kind}|${date}`);
    });
  });
  // Radar fills the gaps the spotters left — see the app's copy of
  // this function for why that matters. A measured stone wins when
  // both exist for the same day.
  Object.entries(radarByDate || {}).forEach(([date, rad]) => {
    if (seen.has(`hail|${date}`)) return;
    const size = rad && (rad as Record<string, any>).maxSizeIn;
    if (size == null || !isFinite(size) || size < t.minHailIn) return;
    const near = (rad as Record<string, any>).nearestMiles;
    if (near != null && near > radius) return;
    out.push({
      watchId: area.id, watchName: area.name || "", kind: "hail", occurredOn: date,
      magnitude: Math.round(size * 100) / 100,
      unit: "in",
      lat: area.lat, lng: area.lng,
      radiusMiles: radius,
      place: area.name || "",
      reportCount: (rad as Record<string, any>).cells || 1,
      source: "radar",
      reportKey: stormAlertKey(area.id, "hail", date),
    });
  });
  return out;
}

function normalizeStormWatch(v: Record<string, any> | null) {
  const s = { enabled: false, areas: [], minHailIn: 1, minWindMph: 58, lookbackDays: 7, ...(v || {}) };
  s.areas = (s.areas || [])
    .filter((a: Record<string, any>) => a && a.lat != null && a.lng != null)
    .map((a: Record<string, any>) => ({
      id: a.id, name: a.name || "Watched area",
      lat: Number(a.lat), lng: Number(a.lng),
      radiusMiles: Math.min(Math.round(LSR_RADIUS_DEG * 69), Math.max(1, Number(a.radiusMiles) || 15)),
    }));
  s.minHailIn = Math.max(0, Number(s.minHailIn) || 0);
  s.minWindMph = Math.max(0, Number(s.minWindMph) || 0);
  s.lookbackDays = Math.min(30, Math.max(1, Math.round(Number(s.lookbackDays) || 7)));
  return s;
}

const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 10)}`;

Deno.serve(async (req) => {
  const json = (o: unknown, status = 200) =>
    new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });

  // Deployed with --no-verify-jwt so pg_cron can reach it, which means
  // the shared secret is the only thing standing between this and the
  // open internet. Refuse rather than sweep if it isn't configured.
  const secret = Deno.env.get("STORM_WATCH_SECRET");
  if (!secret) return json({ error: "STORM_WATCH_SECRET is not set on this function." }, 500);
  const given = req.headers.get("x-storm-watch-secret") ?? "";
  if (given !== secret) return json({ error: "Not authorized" }, 401);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Every tenant's settings blob. Storm watch rides inside crm_org.data
  // alongside pipeline stages, so this reads the same row the app saves.
  const { data: orgs, error: orgErr } = await admin.from("crm_org").select("tenant_id, data");
  if (orgErr) return json({ error: "Couldn't read company settings: " + orgErr.message }, 500);

  const summary: Record<string, number> = { tenants: 0, areas: 0, inserted: 0, raised: 0, skipped: 0, lookupFailed: 0 };

  for (const org of orgs || []) {
    const tenantId = (org as Record<string, any>).tenant_id;
    if (!tenantId) continue;
    const watch = normalizeStormWatch(((org as Record<string, any>).data || {}).stormWatch);
    if (!watch.enabled || !watch.areas.length) continue;
    summary.tenants++;

    // Existing alerts for this tenant, keyed the same way the app keys
    // them — so "already raised" means the same thing in both places.
    const { data: existingRows } = await admin.from("crm_storm_alerts")
      .select("id, report_key, magnitude").eq("tenant_id", tenantId);
    const existing: Record<string, Record<string, any>> =
      Object.fromEntries((existingRows || []).map((r: Record<string, any>) => [r.report_key, r]));

    const end = new Date().toISOString().slice(0, 10);
    const start = new Date(Date.now() - watch.lookbackDays * 864e5).toISOString().slice(0, 10);

    for (const area of watch.areas) {
      summary.areas++;
      // Both observed sources. Radar is the one that catches a storm
      // nobody phoned in, which is most of them.
      const [reports, radar] = await Promise.all([
        fetchStormReports(area.lat, area.lng, start, end),
        fetchRadarHail(area.lat, area.lng, start, end, area.radiusMiles),
      ]);
      // A failed lookup is not "nothing happened" — skip it and let the
      // next run try again rather than recording a quiet all-clear.
      // One source answering is still an answer.
      if (!reports && !radar) { summary.lookupFailed++; continue; }

      const found = detectStormAlerts(reports || {}, area, {
        minHailIn: watch.minHailIn, minWindMph: watch.minWindMph,
      }, radar || {});

      for (const c of found) {
        const row = {
          tenant_id: tenantId,                 // explicit: see the header note
          watch_id: c.watchId, watch_name: c.watchName, kind: c.kind,
          lat: c.lat, lng: c.lng, radius_miles: c.radiusMiles,
          occurred_on: c.occurredOn, magnitude: c.magnitude, unit: c.unit,
          place: c.place, report_count: c.reportCount, report_key: c.reportKey,
          source: c.source || "reported",     // 039: radar estimate vs measured stone
        };
        const prior = existing[c.reportKey];
        if (!prior) {
          const { error } = await admin.from("crm_storm_alerts").insert({ id: uid("sa"), ...row });
          // A unique violation means the in-app sweep won the race,
          // which is the dedupe working, not a fault.
          if (error && !/duplicate|unique/i.test(error.message || "")) {
            console.error("insert failed", error.message);
            continue;
          }
          existing[c.reportKey] = { ...row, id: "pending" };
          summary.inserted++;
        } else if (Number(c.magnitude) > Number(prior.magnitude)) {
          // Bigger than what was reported before: raise the figure and
          // reopen it, because both the acknowledgement and any
          // dismissal were decided against the smaller storm.
          const { error } = await admin.from("crm_storm_alerts")
            .update({ ...row, acknowledged_by: null, acknowledged_at: null, dismissed: false })
            .eq("id", prior.id);
          if (error) { console.error("raise failed", error.message); continue; }
          existing[c.reportKey] = { ...prior, magnitude: c.magnitude };
          summary.raised++;
        } else {
          summary.skipped++;
        }
      }
    }
  }

  return json({ ok: true, ...summary });
});
