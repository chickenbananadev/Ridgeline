// Sends a text through EZ Texting.
//
// Was Twilio. Switched because Twilio's A2P 10DLC campaign registration
// kept failing review for this account. EZ Texting sends over a shared
// short code by default, which is a different FCC/carrier category and
// does not go through 10DLC campaign review the way a standard 10-digit
// long code does — that is almost certainly why an EZ Texting account
// cleared approval when Twilio's did not. Nothing else about this
// integration is Twilio-specific: every automated send in the app
// (en-route ETA, appointment confirmations, stage updates) funnels
// through one function, deliverMessage() -> auth.sendSms(), which just
// calls this endpoint with {to, body, jobId}. That contract is
// unchanged, so nothing above this file needed to change.
//
// IMPORTANT — verify this against EZ Texting's own docs before relying
// on it: this sandbox's network policy blocked outbound access to
// developers.eztexting.com (same constraint hit earlier researching
// per-state legal statutes), so the request shape below is built from
// third-party integration guides and code-sample summaries, cross-
// checked against each other, NOT a direct read of EZ Texting's current
// reference docs. It is a reasonable, corroborated best effort, not a
// verified contract. Before going live: log into
// https://app.eztexting.com, generate an API key (Settings ->
// Integrations / Developer API), and confirm against
// https://www.eztexting.com/developers/sms-api-documentation/rest that
// the endpoint, auth header, and body field names below still match —
// especially if EZ Texting has since migrated everyone off whatever
// they call the "legacy" API.
//
// Secrets to set in Supabase (Edge Functions -> Secrets):
//   EZTEXTING_API_KEY      generated in the EZ Texting dashboard

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  // 1. Caller must be a signed-in, active seat.
  const authHeader = req.headers.get("Authorization") ?? "";
  const caller = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await caller.auth.getUser();
  if (!user) return json({ error: "Not signed in" }, 401);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: me } = await admin
    .from("profiles").select("role, active, name").eq("id", user.id).single();
  if (!me || !me.active) return json({ error: "Account is not active" }, 403);

  // 2. Validate the request.
  const { to, body, jobId } = await req.json();
  if (!to || !body) return json({ error: "Recipient and message are required" }, 400);

  const digits = String(to).replace(/\D/g, "");
  const e164 = digits.length === 10 ? `+1${digits}`
    : digits.length === 11 && digits.startsWith("1") ? `+${digits}`
    : String(to).startsWith("+") ? String(to)
    : null;
  if (!e164) return json({ error: `Cannot read "${to}" as a phone number` }, 400);

  // 3. Consent gate, enforced server-side rather than trusting the client.
  if (jobId) {
    const { data: job } = await admin.from("crm_jobs").select("data").eq("id", jobId).maybeSingle();
    const consent = job?.data?.consent?.sms;
    if (!consent?.granted) {
      return json({ error: "No SMS consent on file for this customer" }, 403);
    }
  }

  // 4. Send.
  const apiKey = Deno.env.get("EZTEXTING_API_KEY");
  if (!apiKey) {
    return json({ error: "EZ Texting secrets are not configured on this project" }, 500);
  }

  // EZ Texting's REST API takes E.164 numbers without the leading "+" in
  // the ones we found documented; strip it defensively rather than
  // guess which form is actually required.
  const res = await fetch("https://api.eztexting.com/v1/sms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      PhoneNumbers: [e164.replace(/^\+/, "")],
      Message: String(body).slice(0, 1500),
    }),
  });

  let result: any = {};
  try { result = await res.json(); } catch { /* some error responses aren't JSON */ }

  if (!res.ok) {
    return json({
      error: result.Message || result.message || result.error || "EZ Texting rejected the message",
      code: result.Code || result.code || res.status,
    }, 400);
  }

  // The exact success-response field names weren't confirmed against
  // EZ Texting's own docs (see the note at the top of this file) — try
  // the shapes seen in third-party examples, and fall back to something
  // truthy rather than crash on an unexpected but successful response.
  const messageId = result.MessageID ?? result.messageId ?? result.id ?? null;
  const status = result.Status ?? result.status ?? "sent";
  return json({ ok: true, sid: messageId, status });
});
