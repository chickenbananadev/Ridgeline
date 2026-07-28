// Edge Function: send an email from the caller's connected Gmail.
//
// Uses the refresh token stored by gmail-oauth to mint a short-lived access
// token, builds an RFC-822 message, and calls the Gmail API. Mail is sent as
// the rep's own address, so replies land in their inbox.
//
// Deploy:  supabase functions deploy gmail-send
// Secrets: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (same as gmail-oauth)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

// base64url without padding, for the Gmail "raw" field.
function b64url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function buildMime(from: string, to: string, subject: string, body: string): string {
  // Encode the subject per RFC 2047 so non-ASCII survives.
  const subj = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subj}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    body,
  ].join("\r\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (o: unknown, status = 200) =>
    new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    if (!clientId || !clientSecret) return json({ error: "Gmail isn't configured on the server." }, 500);

    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: "Not signed in" }, 401);

    const { to, subject, body } = await req.json();
    if (!to || !body) return json({ error: "Missing recipient or body" }, 400);

    // Load the seat's Gmail refresh token.
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: integ } = await admin
      .from("crm_user_integrations").select("data").eq("user_id", user.id).maybeSingle();
    const gmail = integ && integ.data && integ.data.gmail;
    if (!gmail || !gmail.refresh_token) return json({ error: "Your Gmail isn't connected." }, 400);

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
      return json({ error: "Gmail authorization expired — reconnect your Gmail." }, 400);
    }

    const mime = buildMime(gmail.email || "me", to, subject || "", body);
    const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { Authorization: "Bearer " + tok.access_token, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: b64url(mime) }),
    });
    if (!sendRes.ok) {
      const err = await sendRes.text();
      return json({ error: "Gmail rejected the message: " + err.slice(0, 200) }, 400);
    }
    return json({ ok: true, from: gmail.email });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Send failed" }, 500);
  }
});
