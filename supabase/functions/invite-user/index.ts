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
  const { data: me } = await admin.from("profiles").select("role, active, tenant_id").eq("id", user.id).single();
  if (!me || !me.active || me.role !== "admin") {
    return new Response(JSON.stringify({ error: "Admins only" }), { status: 403, headers: cors });
  }
  if (!me.tenant_id) {
    // Should not happen for a real admin (create_tenant assigns this at
    // signup), but fail loudly instead of inviting someone into limbo.
    return new Response(JSON.stringify({ error: "Your account has no company yet — sign out and back in, or contact support." }), { status: 400, headers: cors });
  }

  const { name, email, role, title, commission_rate } = await req.json();
  if (!email || !name) {
    return new Response(JSON.stringify({ error: "Name and email required" }), { status: 400, headers: cors });
  }

  // Seat cap, enforced here rather than trusting the client — the
  // TeamManager UI already blocks this before calling us, but that
  // check is trivially bypassed by calling this function directly.
  // One plan (10 seats) plus one optional 10-seat add-on block; no
  // other tier exists.
  const { data: tenantRow } = await admin.from("tenants").select("seats_paid").eq("id", me.tenant_id).single();
  const BASE_SEATS = 10, ADDON_SEATS = 10;
  const seatsIncluded = BASE_SEATS + ((tenantRow?.seats_paid || 0) >= ADDON_SEATS ? ADDON_SEATS : 0);
  const { count: activeCount } = await admin.from("profiles")
    .select("id", { count: "exact", head: true }).eq("tenant_id", me.tenant_id).eq("active", true);
  if ((activeCount ?? 0) >= seatsIncluded) {
    return new Response(JSON.stringify({
      error: `Your plan includes ${seatsIncluded} seats and all are in use. Add the 10-seat add-on in Manage billing, then invite this person.`,
    }), { status: 403, headers: cors });
  }

  // tenant_id rides in the invite metadata so handle_new_auth_user()
  // (the profile-creation trigger) stamps it on insert. Without this
  // the new profile is created with tenant_id NULL — the account can
  // sign in, but current_tenant_id() never matches anything, so the
  // whole app looks empty. This was the original bug: invites created
  // a login but never actually handed the person a working seat.
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { name, role: role ?? "rep", title: title ?? "Sales Rep", tenant_id: me.tenant_id },
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: cors });
  }

  // Trigger creates the profile (tenant_id included, from metadata
  // above); fill in the fields the trigger doesn't know about.
  await admin.from("profiles")
    .update({ name, role: role ?? "rep", title: title ?? "Sales Rep", commission_rate: commission_rate ?? 60 })
    .eq("id", data.user.id);

  return new Response(JSON.stringify({ ok: true, id: data.user.id }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
