// Edge Function: relay CompanyCam API calls from the browser.
//
// Why this exists: browsers enforce CORS, and api.companycam.com does not
// send permissive headers for our origin, so a direct fetch from the app is
// blocked before it leaves the page. This function makes the call server-side
// (no CORS there) using the rep's own CompanyCam personal access token, and
// returns the result to the app with permissive CORS headers.
//
// The rep's token is sent in the request body over HTTPS and used only to
// call CompanyCam — it is never logged or stored here (it already lives, per
// seat, in crm_user_integrations behind RLS).
//
// Deploy:  supabase functions deploy companycam-proxy
// Secrets: none beyond the defaults Supabase injects (SUPABASE_URL,
//          SUPABASE_ANON_KEY). Requires a signed-in caller.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};
const CC_API = "https://api.companycam.com/v2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    // Only a signed-in seat may use the proxy, so it can't be turned into an
    // open relay to CompanyCam.
    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ status: 0, error: "Not signed in" }, 401);

    const { token, path, method, payload } = await req.json();
    if (!token || !path) return json({ status: 0, error: "Missing token or path" });
    if (!String(path).startsWith("/")) return json({ status: 0, error: "Invalid path" });

    const ccRes = await fetch(CC_API + path, {
      method: method || "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: payload !== undefined && method && method !== "GET" ? JSON.stringify(payload) : undefined,
    });

    const text = await ccRes.text();
    let body: unknown = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    // Always 200 to the app; the real CompanyCam status rides in the payload
    // so the client can tell 401 (bad token) from 404 etc.
    return json({ status: ccRes.status, body });
  } catch (e) {
    return json({ status: 0, error: e instanceof Error ? e.message : "Proxy error" });
  }
});
