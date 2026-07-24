// Sends a text through Twilio.
//
// Why this exists as a server function: the Twilio auth token can send
// messages billed to the account, so it can never be shipped in the
// browser bundle where anyone can read it. The app calls this; this
// holds the secret.
//
// Secrets to set in Supabase (Edge Functions -> Secrets):
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER      e.g. +18556000482

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
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_FROM_NUMBER");
  if (!sid || !token || !from) {
    return json({ error: "Twilio secrets are not configured on this project" }, 500);
  }

  const form = new URLSearchParams({ To: e164, From: from, Body: String(body).slice(0, 1500) });
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${sid}:${token}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    },
  );

  const result = await res.json();
  if (!res.ok) {
    // Twilio's own message is the most useful thing to show the rep.
    return json({ error: result.message || "Twilio rejected the message", code: result.code }, 400);
  }

  return json({ ok: true, sid: result.sid, status: result.status });
});
