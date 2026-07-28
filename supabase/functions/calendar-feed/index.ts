// Edge Function: a subscribable calendar feed (iCalendar / .ics).
//
// A rep subscribes their iPhone or Google Calendar to a personal URL
//   https://<ref>.functions.supabase.co/calendar-feed?token=<their-token>
// and their RoofStride appointments appear, refreshing on the calendar app's
// own schedule (roughly hourly). This is read-only and one-way: the calendar
// shows what's in RoofStride; edits happen in the app.
//
// The token is a per-seat secret stored in crm_user_integrations. It's the
// only credential a calendar subscription can carry (they can't send an auth
// header), so treat the URL like a password — anyone with it can read the
// tenant's appointments. Rotating the token in the app invalidates the old URL.
//
// Deploy (must be public — calendar apps don't authenticate):
//   supabase functions deploy calendar-feed --no-verify-jwt
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

function icsEscape(s: string): string {
  return String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}
// A floating (no-timezone) datetime from "YYYY-MM-DD" + "HH:MM", plus minutes.
function stamp(date: string, time: string, addMin = 0): string | null {
  if (!date) return null;
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return null;
  let hh = 0, mm = 0;
  if (time && /^\d{1,2}:\d{2}/.test(time)) { const p = time.split(":"); hh = Number(p[0]); mm = Number(p[1]); }
  // Use a UTC Date purely as arithmetic; we emit the components as floating.
  const base = Date.UTC(y, m - 1, d, hh, mm) + addMin * 60000;
  const dt = new Date(base);
  const p2 = (n: number) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}${p2(dt.getUTCMonth() + 1)}${p2(dt.getUTCDate())}T${p2(dt.getUTCHours())}${p2(dt.getUTCMinutes())}00`;
}
function dateOnly(date: string): string {
  return date.replace(/-/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return new Response("Missing token", { status: 400, headers: cors });

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // token -> the seat that owns it
    const { data: integ } = await admin
      .from("crm_user_integrations").select("user_id, data")
      .filter("data->>calendarToken", "eq", token).maybeSingle();
    if (!integ) return new Response("Unknown token", { status: 404, headers: cors });

    // seat -> tenant
    const { data: profile } = await admin
      .from("profiles").select("tenant_id").eq("id", integ.user_id).single();
    const tenantId = profile?.tenant_id;

    // appointments for the tenant (RLS bypassed by the service role)
    let q = admin.from("crm_appointments")
      .select("id, job_id, type, date, time, notes, assigned_to, duration_min, status");
    if (tenantId) q = q.eq("tenant_id", tenantId);
    const { data: appts } = await q;

    // job_id -> name + address
    const jobIds = [...new Set((appts || []).map((a) => a.job_id).filter(Boolean))];
    const jobsById: Record<string, { name: string; address: string }> = {};
    if (jobIds.length) {
      const { data: jobs } = await admin.from("crm_jobs").select("id, name, data").in("id", jobIds);
      for (const j of jobs || []) jobsById[j.id] = { name: j.name || "", address: (j.data && j.data.address) || "" };
    }

    const now = new Date();
    const dtstamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}T${String(now.getUTCHours()).padStart(2, "0")}${String(now.getUTCMinutes()).padStart(2, "0")}00Z`;

    const lines: string[] = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//RoofStride//Calendar//EN",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:RoofStride",
      "X-PUBLISHED-TTL:PT1H", "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    ];
    for (const a of appts || []) {
      if (String(a.status || "").toLowerCase() === "canceled") continue;
      const job = jobsById[a.job_id] || { name: "", address: "" };
      const summary = [a.type, job.name].filter(Boolean).join(" — ") || "Appointment";
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${a.id}@roofstride`);
      lines.push(`DTSTAMP:${dtstamp}`);
      if (a.time) {
        const s = stamp(a.date, a.time, 0);
        const e = stamp(a.date, a.time, Number(a.duration_min) || 60);
        if (s) lines.push(`DTSTART:${s}`);
        if (e) lines.push(`DTEND:${e}`);
      } else {
        lines.push(`DTSTART;VALUE=DATE:${dateOnly(a.date)}`);
      }
      lines.push(`SUMMARY:${icsEscape(summary)}`);
      if (job.address) lines.push(`LOCATION:${icsEscape(job.address)}`);
      const desc = [a.assigned_to ? `Assigned: ${a.assigned_to}` : "", a.notes || ""].filter(Boolean).join("\n");
      if (desc) lines.push(`DESCRIPTION:${icsEscape(desc)}`);
      lines.push("END:VEVENT");
    }
    lines.push("END:VCALENDAR");

    return new Response(lines.join("\r\n"), {
      headers: {
        ...cors,
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="roofstride.ics"',
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    return new Response("Calendar feed error: " + (e instanceof Error ? e.message : "unknown"), { status: 500, headers: cors });
  }
});
