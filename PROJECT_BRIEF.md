# Ridgeline — Project Brief

Read this first in any new session. Source of truth for what exists,
where it lives, and what must not be redone.

## What this is
**Product name: RoofStride** (renamed from Ridgeline — Ridgeline
collided with the Honda truck). The rename is a one-line change:
`PRODUCT.name` near the top of `ridgeline.jsx`. **Infra keeps the old
name on purpose** — GitHub repo, both Vercel projects, and the
Supabase project all stay `Ridgeline`/`ridgeline-kappa` forever; those
are internal plumbing, invisible to customers, and renaming them risks
breaking the Vercel/GitHub connection for zero benefit. Only
user-facing text changed.

RoofStride: a roofing CRM for Supreme Building Group (competes with
AccuLynx / Roofr / ServiceTitan). Owner: Jacob Henderson. He works
**from a phone only — no terminal, ever.** All server setup must be
browser-dashboard steps or SQL/code he pastes into a web editor.

## Hard rules
- **Commit author must be `Jacobhenderson.36@gmail.com` / "Jacob Henderson".**
  Vercel blocks every other author on this account.
- **Run the smoke test before every push:**
  `npx esbuild ridgeline.jsx --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom --external:lucide-react --format=cjs --outfile=app.test.cjs && node smoke.test.cjs`
  Expects `console.error captured: 0`. It has caught four blank-page bugs.
- **Never re-import the repo to Vercel** — that created the duplicate
  project `ridgeline-kaj8`. Never re-create the Supabase project.
- When giving Jacob SQL, **paste the contents in a code block.** He once
  pasted a filename into the SQL editor because the instruction said
  "copy the file."

## Infrastructure (ALL ALREADY EXISTS)
- **GitHub**: github.com/chickenbananadev/Ridgeline (private, `main`)
- **Live app**: https://ridgeline-kappa.vercel.app (Vercel project
  `ridgeline`). A duplicate `ridgeline-kaj8` also exists; delete it only
  after kappa is confirmed stable.
- **Supabase**: project ref `wkvcsgzlsdidysoyzcwm` ("Ridgeline - SBG")
- **Env vars** (Production, confirmed present): `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, `VITE_GEOAPIFY_KEY`
- **Auth URL config**: Site URL `https://ridgeline-kappa.vercel.app`
  (the missing `https://` broke every invite link — that is fixed).
  Redirect URLs include the same address plus `/**`.
- **Custom SMTP**: Gmail (smtp.gmail.com:465, app password). Required —
  Supabase's built-in mailer only delivers to project team members.

## Codebase
- `ridgeline.jsx` — single file, ~10,000 lines, one default export
  `SupremeCRM`. React, inline styles, lucide-react icons.
- `src/main.jsx` — maps env into `window.__SUPABASE__` / `__AUTH__` /
  `__GEOAPIFY_KEY__`; also holds the auth adapter (signIn, resetPassword,
  updatePassword, inviteSeat, inviteSeatViaLink, sendSms).
- `smoke.test.cjs` — jsdom walk: login → every screen → 16 job tabs →
  team-chat send with a mention.
- Patch style that works: python3 heredocs with assert-guarded string
  replaces, so a missed anchor writes nothing.
- After each pass: `cp ridgeline.jsx /mnt/user-data/outputs/supreme-crm.jsx`,
  commit, push, `present_files`.

## Migrations (paste into Supabase SQL Editor)
`supabase/migrations/` — 002 core persistence, 003 public branding,
004 client portal, 005 auto-profile trigger (role needs `::user_role`
cast), 006 portal messages, 007 operations calendar fields,
008 portal quote requests, 009 portal contact updates,
010 per-seat integration tokens, 011 chat reactions, 012 chat edit
(superseded), 013 chat hard delete, 014 signatures,
**015 multi-tenancy**.
**002–005 are run and verified. 006, 007, 008 must run in that order —
confirm each with Jacob before assuming.**

## Feature state
Persistence is live: jobs, org settings, appointments, activity, chat,
branding, portals all save to Supabase. Jobs start empty in live mode
(no demo seeds); Roofr CSV import brings real data in.

Built and working: 12-stage pipeline with board, job detail (16 tabs),
estimate builder with margin controls and templates, contracts with
deposit modes, invoices, work orders, real PDF/print via a document
engine, public client portal with live auto-republish and two-way
messaging, inspection checklist with multi-select, financials and
4-structure commission engine with cap-out worksheet, insurance hub,
activity feed (role-scoped), team chat (@mentions, job tags, bubbles),
notes with customer-visible toggle and full edit/delete audit trail,
tasks with deadlines and times, calendar, dispatch board, purchase
orders with line-level receiving, warranty tracking plus a searchable
warranty center, call log with lead-source attribution, announcements,
crews with docs and paid totals, vendors, price list, categorized More
menu, Today strip and pipeline card on home, System check diagnostic.

Builds 1–3 (merged July 24 from an offline working session; details in
BUILD_NOTES.md / BUILD_2_NOTES.md / BUILD_3_NOTES.md): guided lead
intake that prefills the inspection checklist, contacts/properties
split from jobs with multi-property customer cards and repeat-project
reuse, board-card Quick add (notes, calls, texts, tasks, appointments),
operations calendar (Sales/Production/Issues/Delivery views, durations,
statuses, resource assignment, overlap blocking, ZIP travel warnings),
seven-step homeowner project tracker with per-job override, portal
document sharing with Internal/Shared control, customer quote-change
and future-work requests with a team review queue, and queued customer
updates on stage moves gated by SMS/email consent. Test suites:
`npm run test:smoke` / `test:features` / `test:build2` / `test:build3`.

## Multi-tenancy & sign-up (build 26)
`PRODUCT` (top of ridgeline.jsx) holds the product name, seat price,
and trial length. **Renaming the product is a one-line change there** —
the repo, Vercel project, and Supabase project keep the name Ridgeline
regardless; those are infrastructure, not branding.

Migration **015 adds real tenant isolation.** Before it, every RLS
policy was `using (true)` — any signed-in user could read every row in
the database. 015 adds `tenant_id` to all 12 tables, a `stamp_tenant`
insert trigger (so app queries did not have to change), and rewrites
every policy to scope by `current_tenant_id()`. Supreme is backfilled
into a fixed tenant UUID marked `internal` so it is never billed.

Sign-up: `create_tenant(org_name)` RPC runs as security definer,
because a brand-new user has no tenant and so passes no policy.
`my_tenant()` returns trial days left and a `locked` flag.
7-day trial, no card. $49.99/seat after.

**OUTSTANDING SECURITY ISSUE — client portal is enumerable.**
`portal_public_read` is `to anon ... using (revoked = false)`, so
anyone with the anon key (public, in the browser bundle) can dump
every portal row: customer names, addresses, job details. Fix is to
move portal reads behind a security-definer function that requires
the token. Not yet done. Blocking for outside tenants.

## Weather / rain-risk on scheduled jobs (build 27)
Dispatch board now flags jobs whose install day has a high chance of
rain. Uses **Open-Meteo** (api.open-meteo.com) — free, no API key, no
Edge Function, called straight from the browser. One request per
distinct job address returns a full 16-day forecast, cached 3 hours
in a module-scope Map (`WEATHER_CACHE`), keyed by rounded lat/lng —
not React state, so it survives across screens in the same session.

`RAIN_POP_THRESHOLD = 40` (%) is the only tuning knob. Shows on the
14-day day-strip (small cloud icon), a summary banner on the selected
day, and a chip on every job row, both unassigned and crew-assigned.
Requires the job to have `lat`/`lng` (set automatically by address
autocomplete) and a `schedDate` — jobs without coordinates are simply
skipped, never blocked or warned about.

**Fails silent by design.** No network, a rejected fetch, and a slow
connection all resolve to "no weather data" rather than an error —
dispatch must never break because a weather API is unreachable.
Covered by build27, which asserts this under three conditions: no
`fetch` at all, `fetch` rejecting, and `fetch` resolving.

## Competitive parity pass vs Trussi.AI (build 28)
Four features, all deterministic and real — no scaffolds:
- **Supplement check** (job → Estimate, top card): `supplementFindings(job)`
  compares checklist + measurements against estimate line-item text and
  flags unpriced documented conditions with evidence and code cites
  (IRC R905.1.1/.1.2/.2.8.5). Includes a waste-factor sanity rule
  (hips+valleys LF per square). Silent on empty estimates. Their
  version is AI; ours is rules, on purpose — findings must be
  defensible to an adjuster, and their lead-scoring approach is
  patented (US 12,131,277), so deterministic-with-reasons is both the
  legal lane and the better product.
- **Focus list** (home dashboard, `FocusList`): `focusScore(job)` ranks
  open jobs by staleness, dollars, manual priority/quality, overdue
  tasks, signed-but-unscheduled, and estimate-sent-no-answer. HARD
  RULE: a job with zero visible reasons never surfaces (build28 tests
  this — value alone can nudge, never surface).
- **Collections card** (Performance → summary): per-job open balances,
  won/completed stages only, sorted desc, capped at 8 rows.
- **QuickBooks CSV export** (Performance → summary, admin-only):
  customers + invoices in QBO's own import-wizard column layout.
  Goes through the gated `downloadCsv` like every export. This is the
  no-API bridge; the real OAuth sync can replace it later without
  changing what the books receive.

NOT built, with reasons: EagleView/Hover/supplier ordering (need
partner API agreements), native iOS/Android (different stack),
dialer (needs Twilio Voice), Google Ads/Analytics (external
accounts). Revisit only when the prerequisite exists.

## Brand assets & PWA icon set (build 29)
Jacob supplied final RoofStride logo files (app icon, wordmark, mark,
horizontal lockup). Processed into a real icon set for the first time
— **the app previously had no favicon, no apple-touch-icon, no
manifest.json at all.** `public/` is new.

- Source app icon (1024x1024) had its rounded-square shape pre-baked
  with transparent corners — flattened onto its dominant navy fill
  (#062860) before resizing, because iOS/Android apply their own
  corner-masking and render pre-rounded transparent PNGs badly
  (visible checkerboard/white corners). Full-bleed square in, OS
  rounds it.
- Generated: apple-touch-icon.png (180), icon-192/512.png (PWA),
  favicon-16/32.png, favicon.ico (multi-res).
- `public/manifest.json`: name/short_name "RoofStride", theme
  #062860.
- `index.html`: fixed a real staleness — title was hardcoded
  `"Ridgeline — Supreme Building Group"`, present since before
  multi-tenancy existed. Now just `"RoofStride"`, since the HTML
  shell loads before any tenant is known.
- **Real bug found and fixed while wiring this up:** the auth
  screen's header (logo + company name + slogan) was shared across
  login/signup/forgot modes, so someone signing up for a **brand-new**
  company saw Supreme Building Group's logo and slogan first. Signup
  mode now shows the RoofStride product lockup
  (`public/roofstride-logo-horizontal.png`) instead of whatever
  tenant's brand happens to be cached; login/forgot still show the
  signed-in tenant's own brand as before.
- build29 tests both the asset wiring (files exist, non-trivial size,
  manifest paths resolve) and the render behavior (signup shows the
  product logo, not a tenant name).

## Known-good debugging habits
- **More → System check** first for any "not working" report. It tests
  the connection, every table, and whether writes are permitted.
- Blank page after an action = almost always a JS crash. Reproduce in
  jsdom before guessing; two were temporal-dead-zone errors from reading
  a `const` declared further down the component.
- Components defined **inside** another component remount every render:
  inputs lose focus after one character and taps get swallowed on touch.
  All such components are hoisted; keep it that way.

## Open / pending
1. **Migration 006** (portal messages) — Jacob must run it.
2. **Twilio**: rotate the auth token (it was pasted in chat), set
   `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` in
   Edge Function secrets, deploy `supabase/functions/send-sms`, and
   check toll-free verification for +18556000482.
3. **Gmail OAuth**: needs a Google Cloud project and a token-exchange
   Edge Function. Walkthrough already in the app's Integrations screen.
4. **Photos** are stored as data URLs inside jsonb. Migrate to Supabase
   Storage and move to the Pro plan ($25/mo) before go-live — the free
   tier pauses after a week of inactivity, which production cannot have.
5. **Cap-out CSV redesign** — Jacob's Excel format is at
   docs.google.com/spreadsheets/d/1G8qP-8zXufP-zXLYfixELJlcrNLM1Lyz and
   is unreadable via Drive tools (uploaded .xlsx). Ask him to Save-as
   Google Sheets or to describe the columns.
6. **Edge Function deploys have failed twice on mobile.** The app now
   works without them (invite falls back to a magic link). If one is
   truly needed, offer the GitHub-integration route instead of the editor.
7. Recommended next features: Stripe payments, then point-of-sale
   financing (Wisetack/GreenSky), then QuickBooks sync.

## Honest limits (do not promise otherwise)
- Google reviews cannot be auto-posted; no API exists. The compliant
  ask-first flow is built.
- Email open tracking needs a pixel backend (arrives with Gmail).
- @mention push notifications need a notification service; the in-app
  badge and toast work today.
- Job edits sync on refresh, last-write-wins. No live field merging.
- KY and IL insurance citations are unverified placeholders. Ohio's are
  verified.
