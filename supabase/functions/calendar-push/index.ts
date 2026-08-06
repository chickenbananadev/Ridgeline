// Edge Function: push a newly booked appointment to the caller's own
// Google Calendar.
//
// One-way outbound only — the app calendar stays the system of record;
// this never reads anything back from Google. Uses the same refresh
// token gmail-oauth already stores (the OAuth consent now requests
// calendar.events alongside gmail.send), so there is no separate connect
// step — a rep who reconnects their Gmail after this ships gets Calendar
// access in the same grant.
//
// Deploy:  supabase functions deploy calendar-push
// Secrets: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (same as gmail-oauth)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (o: unknown, status = 200) =>
    new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    if (!clientId || !clientSecret) return json({ error: "Google isn't configured on the server." }, 500);

    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: "Not signed in" }, 401);

    const { summary, description, location, start, end, timeZone } = await req.json();
    if (!summary || !start || !end) return json({ error: "Missing summary, start, or end" }, 400);

    // Load the seat's Google refresh token — the same one gmail-oauth stored.
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: integ } = await admin
      .from("crm_user_integrations").select("data").eq("user_id", user.id).maybeSingle();
    const gmail = integ && integ.data && integ.data.gmail;
    if (!gmail || !gmail.refresh_token) return json({ error: "Your Google account isn't connected." }, 400);

    // Refresh an access token.
    const tokRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId, client_secret: clientSecret,
        refresh_token: gmail.refresh_token, grant_type: "refresh_token",
      }),
    });
    const tok = await tokRes.json();
    if (!tokRes.ok || !tok.access_token) {
      return json({ error: "Google authorization expired — reconnect your Google account." }, 400);
    }

    const evRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: { Authorization: "Bearer " + tok.access_token, "Content-Type": "application/json" },
      body: JSON.stringify({
        summary,
        description: description || "",
        location: location || "",
        start: { dateTime: start, timeZone: timeZone || "UTC" },
        end: { dateTime: end, timeZone: timeZone || "UTC" },
      }),
    });
    if (!evRes.ok) {
      const err = await evRes.text();
      // A rep who connected before Calendar access was part of the scope
      // has a valid refresh token that Google will still honor for Gmail,
      // but Calendar calls come back insufficient-scope — surfaced as its
      // own case so the caller can tell "not connected" from "connected,
      // but needs to reconnect for this specific permission."
      const needsRescope = evRes.status === 403 && /insufficient/i.test(err);
      return json({
        error: needsRescope
          ? "Your Google connection doesn't include Calendar access yet — reconnect from Integrations to grant it."
          : "Google Calendar rejected the event: " + err.slice(0, 200),
      }, 400);
    }
    const ev = await evRes.json();
    return json({ ok: true, eventId: ev.id, htmlLink: ev.htmlLink });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Calendar push failed" }, 500);
  }
});
