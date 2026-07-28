// Edge Function: finish the Gmail OAuth handshake for a seat.
//
// The app redirects the rep to Google's consent screen (scope
// gmail.send), Google redirects back to the app with a one-time code, and the
// app hands that code here. This exchanges it for a refresh token and stores
// it against the seat, so the rep's own Gmail can send from then on.
//
// One Google Cloud OAuth client serves the whole company; each rep authorizes
// their own mailbox. The client secret lives only here.
//
// Deploy:  supabase functions deploy gmail-oauth
// Secrets: supabase secrets set GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=...
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
    if (!clientId || !clientSecret) return json({ error: "Gmail OAuth isn't configured (GOOGLE_CLIENT_ID/SECRET missing)." }, 500);

    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: "Not signed in" }, 401);

    const { code, redirect_uri } = await req.json();
    if (!code || !redirect_uri) return json({ error: "Missing code or redirect_uri" }, 400);

    // Exchange the authorization code for tokens.
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code, client_id: clientId, client_secret: clientSecret,
        redirect_uri, grant_type: "authorization_code",
      }),
    });
    const tok = await tokenRes.json();
    if (!tokenRes.ok || !tok.refresh_token) {
      return json({ error: tok.error_description || tok.error || "Google didn't return a refresh token. Remove the app under myaccount.google.com/permissions and reconnect." }, 400);
    }

    // Find out which mailbox they authorized.
    let email = "";
    try {
      const prof = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: { Authorization: "Bearer " + tok.access_token },
      });
      const pj = await prof.json();
      email = pj.emailAddress || "";
    } catch { /* non-fatal */ }

    // Store the refresh token against the seat (service role, upsert into the
    // seat's own integrations row).
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: existing } = await admin
      .from("crm_user_integrations").select("data").eq("user_id", user.id).maybeSingle();
    const next = {
      ...((existing && existing.data) || {}),
      gmail: { connected: true, email, refresh_token: tok.refresh_token, at: new Date().toISOString().slice(0, 10) },
    };
    await admin.from("crm_user_integrations")
      .upsert({ user_id: user.id, data: next, updated_at: new Date().toISOString() });

    return json({ connected: true, email });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "OAuth exchange failed" }, 500);
  }
});
