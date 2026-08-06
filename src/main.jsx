import React from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import App from "../ridgeline.jsx";

/* Env is read here, in a real module, and handed to the app on window.
   Keeping import.meta out of ridgeline.jsx lets that same file run in
   preview sandboxes that don't evaluate it as an ES module. */
window.__GEOAPIFY_KEY__ = import.meta.env.VITE_GEOAPIFY_KEY || "";
window.__PROPERTY_KEY__ = import.meta.env.VITE_PROPERTY_KEY || "";
/* Google OAuth client ID for per-rep Gmail sending. The matching client
   SECRET lives only in the gmail-oauth / gmail-send Edge Functions. */
window.__GOOGLE_CLIENT_ID__ = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

/* Apply the saved theme before React mounts so there's no flash of the wrong
   appearance. With no saved choice we leave data-theme unset and let the CSS
   prefers-color-scheme rule pick, matching the app's first-run default. */
try {
  const saved = localStorage.getItem("rl_theme");
  if (saved === "dark" || saved === "light") document.documentElement.dataset.theme = saved;
} catch (e) { /* private mode / SSR */ }

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* When both are present the app runs on real auth. When they're absent
   (artifact preview, local sketching) it falls back to the demo picker. */
if (url && anon) {
  /* Persist the session so an installed home-screen web app stays signed in
     between launches instead of asking for a password every time. Supabase
     keeps a long-lived refresh token in localStorage and silently refreshes
     the short-lived access token; on iOS the standalone app keeps that store
     until its storage is evicted (roughly a week of no use under Safari's
     tracking-prevention), after which the user signs in again — the one-week
     "keep me logged in, then relogin" behavior we want. A stable storageKey
     keeps the session tied to this app. */
  const supabase = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: "roofstride.auth",
    },
  });
  /* Re-check the session whenever the app is brought back to the foreground —
     iOS freezes a standalone web app rather than reloading it, so without this
     a token that expired while backgrounded wouldn't refresh until a manual
     reload. */
  const revalidate = () => { if (document.visibilityState === "visible") supabase.auth.getSession(); };
  document.addEventListener("visibilitychange", revalidate);
  window.addEventListener("focus", revalidate);
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
    /* Sign-up: create the auth user only. The tenant is NOT created
       here anymore — Stripe Checkout (card required) happens in
       between, and create_tenant only runs after the complete-signup
       Edge Function verifies with Stripe that a card was actually
       collected. See startCheckout / completeSignupAfterCheckout. */
    async signUpOwner({ name, email, password, company }) {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name, role: "admin", title: "Owner" } },
      });
      if (error) throw error;
      /* Email confirmation on = no session yet. Checkout needs an
         active session (it calls an Edge Function as this user), so
         if there's no session, the person has to confirm their email
         and sign in before checkout can proceed. */
      if (!data.session) return { confirmEmail: true };
      return { confirmEmail: false };
    },
    /* Redirects the browser to Stripe Checkout. plan is "per_seat" or
       "unlimited", matching the two cards on the pricing section. */
    async startCheckout({ plan, company }) {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", { body: { plan, company } });
      if (error) throw error;
      if (!data?.url) throw new Error("Stripe did not return a checkout link.");
      window.location.href = data.url;
    },
    /* Opens the Stripe Billing Portal for the current tenant so the owner can
       change plan, add/remove seats, update the card, or cancel. Requires the
       create-portal-session Edge Function (see DEPLOY.md). */
    async manageBilling() {
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: { return_url: window.location.origin + "/" },
      });
      if (error) throw new Error(error.message || "Couldn't open the billing portal");
      if (!data?.url) throw new Error("Billing portal isn't configured yet.");
      window.location.href = data.url;
    },
    /* ---- Per-rep Gmail sending ---- */
    /* Redirect the browser to Google's consent screen. Comes back to the app
       root with ?state=gmail&code=..., which the app hands to gmailExchange.
       Scope now also covers Calendar — a rep who connected before this
       shipped is still gmail.send-only until they reconnect, which
       calendar-push surfaces as its own distinct error rather than a bare
       failure, so Integrations can tell them what to do about it. */
    gmailConnect() {
      const clientId = window.__GOOGLE_CLIENT_ID__;
      if (!clientId) throw new Error("Gmail sending isn't configured (VITE_GOOGLE_CLIENT_ID missing).");
      const redirectUri = window.location.origin + "/";
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar.events",
        access_type: "offline",
        prompt: "consent",
        state: "gmail",
      });
      window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
    },
    async gmailExchange(code) {
      const { data, error } = await supabase.functions.invoke("gmail-oauth", {
        body: { code, redirect_uri: window.location.origin + "/" },
      });
      if (error) throw new Error(error.message || "Couldn't finish connecting Gmail");
      if (data?.error) throw new Error(data.error);
      return data;
    },
    async gmailDisconnect() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("crm_user_integrations").select("data").eq("user_id", user.id).maybeSingle();
      const next = { ...((data && data.data) || {}) };
      delete next.gmail;
      await supabase.from("crm_user_integrations").upsert({ user_id: user.id, data: next, updated_at: new Date().toISOString() });
    },
    async gmailStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("crm_user_integrations").select("data").eq("user_id", user.id).maybeSingle();
      return (data && data.data && data.data.gmail) || null;
    },
    async sendGmail({ to, subject, body }) {
      const { data, error } = await supabase.functions.invoke("gmail-send", { body: { to, subject, body } });
      if (error) {
        let detail = error.message || "Could not send";
        try { const ctx = await error.context?.json?.(); if (ctx && ctx.error) detail = ctx.error; } catch { /* keep */ }
        throw new Error(detail);
      }
      if (data && data.error) throw new Error(data.error);
      return data;
    },
    /* One-way outbound sync: push a newly booked appointment to the rep's
       own Google Calendar. The app calendar stays the system of record —
       this never reads anything back. Never throws: a rep who hasn't
       connected Google, or connected before Calendar access was part of
       the scope, should never see a booking fail because a nice-to-have
       sync couldn't fire. Callers get null on any failure and can choose
       to ignore it, same as askAssistant's degrade-silently contract. */
    async pushToCalendar({ summary, description, location, start, end, timeZone }) {
      try {
        const { data, error } = await supabase.functions.invoke("calendar-push", {
          body: { summary, description, location, start, end, timeZone },
        });
        if (error || !data || data.error) return null;
        return data;
      } catch {
        return null;
      }
    },
    /* Knowledge assistant. Retrieval happens in the app — it already holds
       the whole reference library — so only the matched records travel. The
       API key lives in the Edge Function and never in this bundle.

       Never throws: every failure path (no key deployed, provider down,
       offline) resolves to null, and the caller falls back to the local
       cited answer it has always given. A knowledge base that quietly stops
       working is worse than one that never claimed to be smart. */
    async askAssistant({ question, records, job }) {
      try {
        const { data, error } = await supabase.functions.invoke("ai-assistant", {
          body: { question, records, job },
        });
        if (error || !data || !data.ok || !data.answer) return null;
        return data.answer;
      } catch {
        return null;
      }
    },
    /* Called once, when the browser lands back on the app with
       ?checkout=success&session_id=... in the URL. */
    async completeSignupAfterCheckout(sessionId) {
      const { data, error } = await supabase.functions.invoke("complete-signup", { body: { session_id: sessionId } });
      if (error) throw error;
      return data;
    },
    /* Called after sign-in. No-op when the user already has a company,
       so it is safe to run on every session start. */
    async ensureTenant(company) {
      const { data, error } = await supabase.rpc("create_tenant", { org_name: company });
      if (error) return null;
      return data;
    },
    async myTenant() {
      const { data, error } = await supabase.rpc("my_tenant");
      if (error) return null;
      return Array.isArray(data) ? data[0] || null : data;
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
