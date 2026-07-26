import React from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import App from "../ridgeline.jsx";

/* Env is read here, in a real module, and handed to the app on window.
   Keeping import.meta out of ridgeline.jsx lets that same file run in
   preview sandboxes that don't evaluate it as an ES module. */
window.__GEOAPIFY_KEY__ = import.meta.env.VITE_GEOAPIFY_KEY || "";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* When both are present the app runs on real auth. When they're absent
   (artifact preview, local sketching) it falls back to the demo picker. */
if (url && anon) {
  const supabase = createClient(url, anon);
  window.__SUPABASE__ = supabase;
  window.__AUTH__ = {
    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    async signOut() { await supabase.auth.signOut(); },
    async resetPassword(email) {
      /* The link must land back on this app with the recovery token in
         the URL hash; the app detects it and shows the new-password
         screen. Supabase also requires this exact origin to be listed
         under Authentication -> URL Configuration -> Redirect URLs. */
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/?recovery=1",
      });
      if (error) throw error;
    },
    async updatePassword(newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    async exchangeRecovery() {
      /* Supabase JS parses the hash automatically on load; this just
         reports whether we ended up with a session from it. */
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    async getSession() {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    onChange(cb) {
      const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session));
      return () => data.subscription.unsubscribe();
    },
    async loadProfile(userId) {
      const { data, error } = await supabase
        .from("profiles").select("*").eq("id", userId).single();
      if (error) throw error;
      return data;
    },
    async listProfiles() {
      const { data, error } = await supabase
        .from("profiles").select("*").order("added_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    async updateProfile(id, patch) {
      const { error } = await supabase.from("profiles").update(patch).eq("id", id);
      if (error) throw error;
    },
    async inviteSeat(payload) {
      const { data, error } = await supabase.functions.invoke("invite-user", { body: payload });
      if (error) throw error;
      return data;
    },
    /* Fallback used when the invite Edge Function isn't deployed.
       signInWithOtp with shouldCreateUser creates the account and mails
       a sign-in link using only the public key — no server function.
       The metadata rides along so the auto-profile trigger fills in
       name, role, and title. Requires email signups to be enabled in
       Authentication -> Sign In / Providers. */
    async sendSms({ to, body, jobId }) {
      const { data, error } = await supabase.functions.invoke("send-sms", { body: { to, body, jobId } });
      if (error) {
        /* Surface Twilio's own wording where we can get at it. */
        let detail = error.message || "Could not send";
        try {
          const ctx = await error.context?.json?.();
          if (ctx && ctx.error) detail = ctx.error;
        } catch { /* keep the generic message */ }
        throw new Error(detail);
      }
      if (data && data.error) throw new Error(data.error);
      return data;
    },
    async inviteSeatViaLink({ name, email, role, title, commission_rate }) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin,
          data: { name, role: role || "rep", title: title || "Sales Rep", commission_rate: commission_rate ?? 60 },
        },
      });
      if (error) throw error;
      return { ok: true, viaLink: true };
    },
  };
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
