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

## Official brand slogan wired (this session)
`PRODUCT.tagline` was a placeholder I invented ("Roofing, start to
paid.") — never actually chosen by Jacob. Replaced with the real
slogan: "Built for Roofing. Made to Move." Now rendered under the
RoofStride logo on the signup screen (the one place product identity
shows instead of tenant identity, per the build-29 fix).

Jacob also supplied, not yet acted on: a marketing headline ("One
Stride Ahead of Every Job"), the STRIDE values acronym, positioning/
mission/vision statements, and a 10-section brand+launch roadmap
(ideal customer and differentiators are explicitly open decisions in
his own doc; sections 7-10 — brand system, product foundation docs,
domain/trademark/legal, launch materials — are a checklist, not yet
scoped to specific deliverables). Waiting on his prioritization before
building further.

## crm_brand made genuinely per-tenant (this session)
Root cause of "login screen shows Supreme's logo to everyone": crm_brand
was a true singleton, hardcoded to `id=1`, fetched and saved by every
tenant regardless of who they were. 015 added tenant_id and scoped the
*write* RLS policy by tenant, but the app code never stopped hardcoding
id=1, and the *read* policy is deliberately open (`using (true)`) so the
client portal can render branding pre-auth. Net effect: every visitor,
from every company, saw Supreme's logo/name/slogan before signing in,
and any other tenant's Company Branding save would likely fail RLS
silently (or, if it somehow succeeded, would have clobbered Supreme's
row — the write-side risk 015 already closed, but the read-side and the
app's hardcoded id were still wrong).

Fixed:
- **Migration 016**: unique constraint on `crm_brand.tenant_id`.
- **`useBrandSync(brand, setBrand, hasSession, tenantId)`**: reads and
  writes scoped by `tenant_id` (upsert `onConflict: "tenant_id"`), and
  never fires at all before a tenant is known — no more pre-auth fetch.
- **`fromProfile`**: now carries `tenantId: row.tenant_id`.
- **`Login`**: simplified — it never renders once signed in, so there
  is no legitimate tenant to show. Always shows RoofStride's own logo +
  tagline now, for every mode (login/signup/forgot), plus the bottom-
  of-screen copyright footer (was `brand.company`, now `PRODUCT.name`).
- **`DEFAULT_BRAND`**: was Jacob's real phone/email/address/Google
  review link, hardcoded as the fallback for every brand-new tenant.
  Neutralized to a generic "Your Company" placeholder.
- **SystemCheck probe**: was a shared `id=99` row — only the first
  tenant to ever run System Check could write it; every other company
  would see a false "write blocked." Now a random per-run id.
- **SystemCheck's stored-branding report**: was also `.eq("id",1)`;
  now scoped to `currentUser.tenantId`.

**Migration 016 must be run in Supabase before this deploys**, or
Company Branding saves will fail with a clear in-app error pointing
at it (built into the error-message branch already).

## OUTSTANDING — crm_org has the identical flaw, not yet touched
While fixing crm_brand, found `db.from("crm_org").select("data").eq("id", 1)`
— the exact same hardcoded-singleton pattern, but for the table holding
stages, price list, crews, lead sources, message templates, vendors,
feature toggles, and jurisdiction overrides. This is almost certainly
the actual mechanism behind the bug Jacob reported and asked to hold
off on: "when I signed up as a new user I could access all Supreme
info." Deliberately NOT fixed this session per his explicit instruction
to leave that one alone — flagged for him to decide on timing.

## crm_org made per-tenant (this session) — the real fix for the deferred bug
Same flaw as crm_brand, different table: crm_org (stages, price list,
crews, lead sources, message templates, vendors, feature toggles,
jurisdiction overrides) was hardcoded to `id=1`. A brand-new tenant's
first login tries to seed its settings via `upsert({id:1,...})` —
since id=1 already belongs to Supreme, that becomes an UPDATE against
Supreme's row, which 015's RLS correctly blocks. This is almost
certainly the actual mechanism behind "new signup could see Supreme's
data" — Jacob gave the go-ahead to fix it this session.

Fixed identically to crm_brand: migration 017 (unique constraint on
tenant_id), useDbSync's hydrate + first-boot-seed + debounced-save all
scoped by tenant_id with `onConflict: "tenant_id"`, gated so nothing
fires before tenantId is known. **Migrations 015, 016, AND 017 must
all be run, in order, before this is actually fixed in production** —
if 015 hasn't run yet, none of the tenant RLS exists at all regardless
of what the app code does.

## Logo update (this session) — charcoal/teal, not navy/orange
Jacob supplied new brand files (RoofStride.zip): charcoal #20242A
(was navy #062860), teal accent #0A9E98 (was orange). Regenerated the
full icon set from `RoofStride-App-Icon-Black-Teal.png` (same flatten-
onto-dominant-fill process as before — pre-rounded transparent
corners). Updated: all PWA/favicon assets, `public/roofstride-logo-
horizontal.png`, `public/roofstride-mark.png`, `manifest.json` theme_
color, `index.html` meta theme-color, `DEFAULT_BRAND.primary`.

## Public marketing landing page (this session)
The app previously had no public site — visiting it showed a bare
login form, even to someone who had never heard of RoofStride. Added
a real pre-auth entry point: `entry` state (`"marketing" | "auth"`)
defaults to `"marketing"`, showing the new `Marketing` component
first. "Sign in" and "Start free trial" both route into the existing
`Login` component (now accepts `initialMode` and `onBackToMarketing`),
just in different modes. Recovery/invite links still bypass this
entirely — those early-return before the entry check, unaffected.

Content: hero with Jacob's actual headline ("One Stride Ahead of
Every Job") and slogan, five feature sections each paired with a real
screenshot, the STRIDE values (verbatim from Jacob), pricing ($49.99/
seat, 7-day trial, card required — see note below), final CTA,
footer. IA follows the standard SaaS-site shape (hero → features →
values → pricing → CTA) without copying any competitor's actual
layout, per Jacob's instruction.

**Screenshots are real, not mockups.** This sandbox has `wkhtmltoimage`
(a real rendering engine, already installed) and the Inter font. The
capture technique: mount the actual app in the same jsdom harness the
test suites already use, navigate with real clicks to a real screen,
serialize the resulting DOM (100% inline styles in this app, so
serialized HTML carries real pixel-accurate styling), then rasterize
with wkhtmltoimage. Six shots landed in `public/marketing/`: dashboard,
pipeline, job detail (insurance claim tracking), the supplement
checker (real findings, real IRC citations), dispatch, and performance/
profitability. For the job-detail page specifically (a long
collapsible-sections scroll, not a tab strip) — extracting the target
section's DOM node directly and rendering it in isolation worked far
better than guessing a pixel crop offset into a 9000px page.

**NOT built: real credit-card collection.** The pricing section's copy
says "card required," per Jacob's request, but the actual trial signup
form does not collect a card — that requires real Stripe integration
(Stripe Checkout or Elements, a Stripe account, webhook handling for
trial-end billing), none of which exists yet. Do not add a card input
field to the signup form without wiring it to a real processor — a
fake-looking card form that doesn't actually process anything is a
trust/security problem, not a feature gap to shortcut.

## A latent test-helper quirk worth knowing about
`clickText` (used identically across ~30 test files) matches on
`(tagName === "BUTTON" || e.onclick)`, and elements are walked in
document order. In this specific jsdom + React 18 (`createRoot`)
setup, the ROOT container itself reports a truthy `.onclick` (a jsdom
quirk — this never happens in a real browser, where `.onclick` and
React's `addEventListener`-based delegation are correctly
independent). This means if a target button's text happens to be the
very first text rendered inside some ancestor (all the way up to
`#root`), the OUTER ancestor div can spuriously outrank the real
button in the match, since it satisfies the `e.onclick` branch of the
check before the loop ever reaches the actual `<button>`. Surfaced by
the new "Back to roofstride.com" button (the first child in Login's
render tree) in build31 — fixed there by requiring a strict
BUTTON/A tagName match first, falling back to the looser check only
after. The other ~30 test files still use the old pattern and are all
currently passing, so this wasn't fixed globally — just worth knowing
if a future button placed as the first child of a large container
starts causing a confusing click-target mismatch in a test.

## Marketing screenshots fixed (this session) — two real rendering bugs
Jacob caught this live on his phone at the real deployed URL, not in a
test: the hero screenshot showed the red "Demo mode" warning banner,
and round icon badges (the L/P/A/C/I pipeline-stage circles) had their
letters visibly off-center.

**Neither bug exists in the live app** — both were artifacts of the
screenshot-CAPTURE pipeline, not the product:
- The demo banner is real and correct in the app (there's no Supabase
  connection in the jsdom capture environment, so it renders exactly
  as designed) — it just has no business appearing on a marketing
  screenshot. Now stripped before rasterizing.
- The off-center letters: this app uses `display: grid; place-items:
  center` (46 places) for every round badge. wkhtmltoimage's rendering
  engine (an old WebKit build) does not correctly support that CSS
  Grid shorthand — a real, modern phone browser renders it fine. Fixed
  with a render-compat CSS override injected ONLY into the screenshot-
  capture HTML (`[style*="display: grid; place-items: center"] {
  display: flex !important; ... }`) — nothing in the shipped app
  changed, because nothing in the shipped app was actually broken.

**A second real bug found while fixing this**: the original capture
script called `element.remove()` directly on the LIVE React-managed
DOM to strip the banner, then kept clicking through the same app
instance for more screenshots — crashed with "The child can not be
found in the parent" on the next re-render, because React still
expected a node that had been ripped out from underneath it. Fixed by
stripping the banner from a serialized HTML STRING via a detached
`DOMParser` document, never touching the live tree.

Regenerated all 6 screenshots; `shot-supplement-check.png` is
byte-identical to before (that card has no circular badges, so it was
never affected). If screenshots ever need regenerating again: capture
via the jsdom harness → strip demo banner on a STRING/detached DOM,
not the live one → inject the place-items compat CSS → rasterize.

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
