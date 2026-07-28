import { createClient } from "@supabase/supabase-js";

/* The publishable (anon) key is designed to ship in frontend code.
   It is only safe because Row Level Security is enabled on every table —
   see supabase/schema.sql. If RLS is ever turned off, this key reads
   the whole database. */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* persistSession + a stable storageKey keep an installed home-screen web app
   signed in between launches (see src/main.jsx for the full rationale). */
export const supabase = url && anonKey ? createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "roofstride.auth",
  },
}) : null;
export const backendReady = () => !!supabase;

/* ---------------- auth ---------------- */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
export async function signOut() {
  await supabase.auth.signOut();
}
export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset`,
  });
  if (error) throw error;
}
/* Returns the signed-in user's profile row (role, title, rate) or null. */
export async function currentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();
  if (error) return null;
  return data;
}
export function onAuthChange(cb) {
  return supabase.auth.onAuthStateChange((_evt, session) => cb(session));
}

/* ---------------- seats ---------------- */
export async function listProfiles() {
  const { data, error } = await supabase
    .from("profiles").select("*").order("added_at", { ascending: true });
  if (error) throw error;
  return data;
}
export async function updateProfile(id, patch) {
  const { error } = await supabase.from("profiles").update(patch).eq("id", id);
  if (error) throw error;
}
/* Creating a seat requires the service-role key, which must never sit in
   the browser. Deploy supabase/functions/invite-user as an Edge Function
   and call it here — it runs server-side with the privileged key. */
export async function inviteSeat({ name, email, role, title, commissionRate }) {
  const { data, error } = await supabase.functions.invoke("invite-user", {
    body: { name, email, role, title, commission_rate: commissionRate },
  });
  if (error) throw error;
  return data;
}

/* ---------------- jobs ---------------- */
export async function listJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select(`*,
      assignee:profiles!jobs_assignee_id_fkey (id, name),
      job_tasks (*), job_photos (*), job_files (*),
      job_cost_lines (*), job_reimbursements (*), job_payments (*)`)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function createJob(job) {
  const { data, error } = await supabase.from("jobs").insert(job).select().single();
  if (error) throw error;
  return data;
}
export async function updateJob(id, patch) {
  const { error } = await supabase.from("jobs").update(patch).eq("id", id);
  if (error) throw error;
}

/* ---------------- stages ---------------- */
export async function listStages() {
  const { data, error } = await supabase
    .from("stages").select("*").order("position", { ascending: true });
  if (error) throw error;
  return data;
}

/* ---------------- photo upload ---------------- */
/* Uploads to the private job-photos bucket and records the row. Returns a
   signed URL valid for one hour for immediate display. */
export async function uploadJobPhoto(jobId, file, meta) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${jobId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("job-photos").upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) throw upErr;

  const { data: row, error: rowErr } = await supabase.from("job_photos").insert({
    job_id: jobId,
    label: meta.label,
    storage_path: path,
    taken_at: meta.takenAt || new Date().toISOString(),
    lat: meta.lat ?? null,
    lng: meta.lng ?? null,
    accuracy_m: meta.accuracy ?? null,
    address: meta.address ?? null,
  }).select().single();
  if (rowErr) throw rowErr;

  const { data: signed } = await supabase.storage
    .from("job-photos").createSignedUrl(path, 3600);
  return { ...row, url: signed ? signed.signedUrl : null };
}
export async function signedPhotoUrl(path, seconds = 3600) {
  const { data } = await supabase.storage.from("job-photos").createSignedUrl(path, seconds);
  return data ? data.signedUrl : null;
}

/* ---------------- company settings ---------------- */
export async function getSettings() {
  const { data, error } = await supabase
    .from("company_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}
export async function saveSettings(patch) {
  const { error } = await supabase
    .from("company_settings").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) throw error;
}
