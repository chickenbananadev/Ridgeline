import React from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
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
  };
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
