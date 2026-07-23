// Edge Function: create a seat and email an invite.
// Deploy:  supabase functions deploy invite-user
// Runs server-side with the service-role key, which must never reach the browser.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Verify the CALLER is an admin before creating anything.
  const authHeader = req.headers.get("Authorization") ?? "";
  const caller = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await caller.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Not signed in" }), { status: 401, headers: cors });
  }
  const { data: me } = await admin.from("profiles").select("role, active").eq("id", user.id).single();
  if (!me || !me.active || me.role !== "admin") {
    return new Response(JSON.stringify({ error: "Admins only" }), { status: 403, headers: cors });
  }

  const { name, email, role, title, commission_rate } = await req.json();
  if (!email || !name) {
    return new Response(JSON.stringify({ error: "Name and email required" }), { status: 400, headers: cors });
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { name, role: role ?? "rep", title: title ?? "Sales Rep" },
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: cors });
  }

  // Trigger creates the profile; fill in the rest.
  await admin.from("profiles")
    .update({ name, role: role ?? "rep", title: title ?? "Sales Rep", commission_rate: commission_rate ?? 60 })
    .eq("id", data.user.id);

  return new Response(JSON.stringify({ ok: true, id: data.user.id }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
