# Ridgeline — Project Brief

Read this first in any new working session. It is the source of truth for
what exists, where it lives, and what not to redo.

## What this is
Ridgeline: a roofing CRM for Supreme Building Group (competitor to
AccuLynx/Roofr). Owner: Jacob Henderson (jacob@supremebuildinggroup.com).
Git commits must be authored as `Jacobhenderson.36@gmail.com` — Vercel
blocks any other author on this account.

## Infrastructure — DO NOT RE-CREATE ANY OF THIS
- **GitHub**: github.com/chickenbananadev/Ridgeline (private, branch: main)
- **Vercel**: TWO projects exist from a duplicate import: `ridgeline`
  (URL ridgeline-kappa.vercel.app) and `ridgeline-kaj8`. Both build from
  this repo. Environment variables have been added to at least one.
  NEVER instruct importing the repo to Vercel again — that is how the
  duplicate happened. One project should eventually be deleted after
  confirming the other is fully working.
- **Supabase**: project ref `wkvcsgzlsdidysoyzcwm` ("Ridgeline - SBG").
  Schema in supabase/schema.sql (NOTE: seeds 8 stages; app uses 12 —
  unreconciled). Edge Function supabase/functions/invite-user/index.ts
  exists in repo; deploy status uncertain — check before assuming.
- **Env vars** (Vite requires the VITE_ prefix): VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY, VITE_GEOAPIFY_KEY. Values live in the Vercel
  dashboard — do not ask for them again, and never commit them.

## Codebase
- Single file: `ridgeline.jsx` (~7,500 lines, React, inline styles,
  lucide-react, no localStorage). Entry: src/main.jsx maps env →
  window.__SUPABASE__/__AUTH__/__GEOAPIFY_KEY__.
- Test: `node smoke.test.cjs` after building `app.test.cjs` with esbuild
  (see package scripts / prior transcripts). Run it before every push —
  it has caught three shipped-crash-level bugs.
- Brand: Supreme Building Group, #28373E primary / #1B6DE0 accent, live
  theme object `T` (colors editable in-app). Slogan: "Committed to
  Supreme Quality and Results." Review link:
  https://tinyurl.com/Supreme-Building-Group-Review

## Feature state (July 2026)
Built and working on seed data: 12-stage pipeline, job board, job detail
(16 tabs incl. estimate builder w/ margin controls + templates + document
builder, contract w/ deposit modes + editable terms, work orders without
pricing, financials/commission engine w/ 4 structures), Roofr CSV import,
insurance hub (OH cites verified; KY/IL placeholders — do not present as
verified), price list w/ margin editing, calendar w/ appointments +
task deadlines, inbox, activity feed (role-scoped), team chat
(@mentions, job tags), notes w/ customer-visible toggle + portal
updates, vendors, lead sources, per-user Gmail model, review manager
w/ rating gate (Google review gating warning included — keep it).

## The one big thing NOT done
**Persistence.** Everything runs on in-memory seed data and resets on
refresh. Next phase: wire jobs/customers to Supabase, then
notes/tasks/appointments/activity/chat, then photos (needs Supabase
Storage; recommend Pro plan before go-live). Until this lands, the app
is a demo, not a tool.

## Known honest limits (do not promise otherwise)
- Email/SMS sending needs Gmail OAuth (Google Cloud + Edge Function) and
  Twilio w/ 10DLC. Composing/queueing/consent gating already work.
- Google reviews cannot be auto-posted (no API exists). Rating-gate flow
  with internal recovery is the compliant ceiling.
- Email "Viewed" tracking needs a pixel backend (comes with Gmail).
- Jacob works phone-only — no terminal. All server setup must be
  browser-dashboard instructions or code he pastes into web editors.
