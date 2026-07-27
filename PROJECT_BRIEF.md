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

## Bottom nav redesigned — was reading as a copy of Roofr (this session)
Jacob flagged the bottom nav (Home / Jobs / floating "+" / Inbox /
More) as looking identical to Roofr's. The floating raised circular
FAB dead-center in a 5-icon bar is the single most common bottom-nav
pattern in field-service apps — that shape specifically is what reads
as copied, not the icon choices (house/briefcase/message/menu are
universal conventions, not Roofr's invention).

Kept exactly what was asked: 4 real destinations (Home, Jobs, Inbox,
More — Jacob's "4 of the most needed"), Inbox unchanged in its
ordinal position (third of four, still right before More). Changed:
- FAB: squircle (borderRadius 15, matches the RoofStride mark's own
  rounded-square language) instead of a plain circle, smaller and
  sitting closer to the bar (translateY(-6px) not -12px) instead of
  dramatically floating above it.
- Active-tab treatment: a soft rounded pill highlight (`T.accentSoft`)
  behind the icon, not just recoloring the icon — a small, deliberate
  difference from the generic "icon turns blue" pattern.
- Still uses `T.accent`/`T.accentSoft` (the signed-in TENANT's own
  brand colors), not a hardcoded RoofStride teal — this screen is
  post-auth and every company's instance should look like their own
  brand, not force RoofStride's colors onto Supreme's or anyone else's
  app. Only the marketing site and the pre-auth Login screen show
  RoofStride's own identity; this was a deliberate choice to keep that
  distinction intact.

Also hoisted `NavBtn` out of `SupremeCRM`'s render body to module
scope while touching this — it was defined inside the render function
(the same anti-pattern that caused the input-focus and touch-tap bugs
documented earlier), just harmless here since it held no state of its
own. Took explicit `active`/`onPress` props instead of reading `nav`/
`openJob`/`setNav`/`setOpenJobId` from closure.

Verified via pixel-sampling a real render (the `view` tool wasn't
displaying images in this session) rather than skipping visual
verification — confirmed the pill highlight, squircle color/dimensions,
and centering all render as designed.

## CRITICAL FIX — app was hanging on "Loading…" forever in production
Jacob reported: "the site just loads and never works for the app
aspect." Root cause: the crm_org/crm_brand tenant-scoping fix from
earlier this session hard-blocked on `tenantId` with NO fallback —
`if (!db || !ready || !tenantId) return;` in the hydrate effect meant
that if `tenantId` was ever falsy, `setHydrated(true)` was NEVER
called, and the app shows a permanent loading screen
(`if (booting || (liveAuth() && currentUser && !hydrated))`).

`tenantId` comes from `profiles.tenant_id`, which does not exist as a
column until migration 015 runs. **Since migrations 015/016/017 had
not been confirmed as run, every real sign-in got `tenantId = null`,
and the app never loaded past the loading screen for anyone.** This
was a severe regression I introduced and shipped without catching —
none of the 32 suites at the time exercised live mode
(`window.__SUPABASE__` present); they all run in demo mode, where
`DB()` returns null and every affected code path bails out before the
`!tenantId` check is ever reached. The bug was invisible to the whole
test suite.

**Fixed with a legacy fallback, not a harder gate.** Every place that
used to hard-block on `tenantId` now branches: tenant-scoped query
when `tenantId` is available, the OLD `id=1` singleton query when it
is not. This means:
- The app works exactly as it did before ANY of this session's
  multi-tenancy work, for as long as migrations haven't been run.
- The moment migrations 015/016/017 are actually run and a user's
  profile carries a real `tenant_id`, the SAME code automatically
  switches to correct per-tenant isolation — no further changes
  needed, no redeploy required beyond what's already shipped.
- Fixed in: `useBrandSync`'s read AND save effects, `useDbSync`'s
  hydrate effect (the one directly causing the hang), the debounced
  org-save effect, and the SystemCheck diagnostic's stored-branding
  report (was silently reporting "nothing saved" against real data).

**New regression test: build32.** Simulates real live mode
(`window.__SUPABASE__` set to a mock Supabase client) with a profile
that has no `tenant_id` at all — exactly what a pre-migration database
returns. Asserts the app renders past the loading screen rather than
hanging. Verified this test actually catches the bug by temporarily
reverting the fix and confirming build32 fails against the broken
code, then restoring the fix and confirming it passes again — this
is the kind of bug that's easy to "fix" with a test that doesn't
actually re-exercise the failure mode, so I checked directly rather
than assuming.

Also updated two existing suites (build29, build30) that had encoded
the ORIGINAL hard-block behavior as if it were correct — after this
fix, those specific assertions were testing for the bug itself. Now
assert the fallback behavior instead.

**Reminder: migrations 015, 016, and 017 still need to be run**, in
that order, for tenant isolation to actually take effect. Until then,
the app now correctly behaves exactly as it did before any of this
session's multi-tenancy changes — functional, just not yet
tenant-isolated.

## Pre-auth branding + generic placeholders fixed (this session)
Jacob's screenshots of the real deployed login/signup screen showed
two things: buttons rendering blue instead of RoofStride's teal, and
the email placeholder still showing "you@supremebuildinggroup.com" —
Jacob's own literal domain, hardcoded on the screen every new company
sees when signing up.

**Root cause of the color, same class of bug as the crm_brand/crm_org
fixes**: `DEFAULT_BRAND.accent` was `#1B6DE0` (an arbitrary blue), and
every `<Btn kind="primary">` (Sign in, Start free trial, etc.) reads
its color from `T.accent`, which derives from `brand.accent` — pre-auth,
`brand` is always `DEFAULT_BRAND`, so buttons never actually got
RoofStride's real teal. Fixed by changing `DEFAULT_BRAND.accent` to
`#0A9E98` (the real teal) and `primary` to `#20242A` (the real
charcoal) — this ALSO means a brand-new tenant's un-customized starting
point is now RoofStride's own professional color scheme rather than an
arbitrary blue, until they set their own in Company Branding.
`accentSoft` (light pill-highlight tint) auto-derives from `accent` via
`softOf()`, so no separate change was needed there. Also updated the
matching defensive fallbacks: the bootstrap `T` constant, `T.accent =
brand.accent || "#1B6DE0"`, and two component default props
(`SignatureField`, `SignConsent`) — all now default to teal instead of
blue. Left the AV/AV_COLORS avatar palettes alone — coincidentally
reuses the same old blue hex as one of several DISTINCT avatar colors,
unrelated to branding.

**Placeholders**: login screen's email field said
"you@supremebuildinggroup.com" (Jacob's own domain) and password said
"Enter your password" — both hardcoded, both shown to every new
company on the one screen where they're deciding whether to sign up.
Now: email placeholder matches the signup form's existing wording
("you@yourcompany.com"), password is just "Password". Also fixed a
third occurrence in a settings-screen fallback placeholder.

build33: asserts the actual rendered Sign-in button's color
(`rgb(10, 158, 152)`), both placeholders' literal values, and that the
avatar palette (a legitimate, unrelated reuse of the old hex) wasn't
accidentally touched.

## More hardcoded personal info found (this session, immediately after the last fix)
Jacob's next screenshot was the SIGNUP form specifically (not login) —
"Your name" and "Company name" fields had placeholder text of
"Jacob Henderson" and "Supreme Building Group" literally. Same class
of bug as the email/password placeholders, just on fields I hadn't
checked yet. Fixed to "Your full name" / "Your company name". Also
found and fixed one more in an unrelated spot while sweeping for
others: a cost-line "Paid to / by" field's example text named Jacob
specifically ("e.g. Jacob, QXO, Black Bull") — lower stakes (inside
the authenticated app, not the public signup screen) but same
principle, fixed to a generic example.

## Investigated: Jacob still saw a blue button after the teal fix shipped
Rigorously checked this rather than assuming deployment lag: sampled
the exact pixel color from Jacob's own screenshot
(rgb(149, 181, 235)) and compared it mathematically against what the
OLD blue (#1B6DE0) blended at 50% opacity over white should produce
— they match almost exactly. Then rendered the actual current code
locally the same way and got rgb(10, 158, 152) (real teal) as
expected. Confirmed via source: `T.accent = brand.accent || "#0A9E98"`
runs unconditionally on every render (before the pre-auth early
return), and `brand` initializes directly to `DEFAULT_BRAND`, whose
accent is `#0A9E98`. The code is correct and was verified working
locally — the discrepancy is almost certainly Vercel deployment lag or
a cached bundle on Jacob's device, not a code bug. Told him plainly
rather than guessing.

## REAL BUG FOUND — pre-auth was fetching Supreme's real saved brand data
Jacob's follow-up screenshot proved it: the placeholder-text fix from
the previous commit WAS live (showing "Your full name" correctly), but
the button was still Supreme's real blue. Since the placeholder and
color fixes shipped in the SAME commit, this ruled out deployment lag
entirely — it had to be a real, separate code bug specifically in the
color path, not caching.

**Root cause**: `useBrandSync`'s READ effect (added as part of the
"hang forever" fix two sessions ago) had a comment claiming it "only
runs once a tenant is known post sign-in" — but the actual code only
checked `if (!db) { ... return; }`. No `hasSession` check at all. Since
a real Supabase connection exists in production regardless of auth
state, this effect ran on every page load, pre-auth included. Before
sign-in, `tenantId` is null, so it took the legacy `id=1` fallback
path — which fetched Supreme's OWN real saved brand row (their actual
blue accent, saved in the database from before any of this session's
work) and merged it into `brand` state via `setBrand`, overwriting the
correctly-set `DEFAULT_BRAND` teal seconds after every page mount, for
every visitor, including strangers looking at the public signup page.

**Fixed**: added the `hasSession` check the comment always claimed
existed. The legacy `id=1` fallback still works correctly for real
signed-in users on a pre-migration database (that's still needed and
still there) — it just no longer fires before anyone has actually
signed in.

**New regression test (build34)**: mocks a live Supabase connection
where Supreme's real saved brand row has a different accent color
than the neutral default, with nobody signed in, and asserts that
color is never applied to the pre-auth screen. Verified this test
actually catches the bug the same way as build32 — reverted the fix,
confirmed build34 failed, restored the fix, confirmed it passed again.

This is the second time in two sessions a "fix the hang" patch quietly
reintroduced a "pre-auth shows tenant-specific data" bug via a legacy
fallback path that wasn't scoped as tightly as its own comments
claimed. Worth being extra careful about this exact failure shape if
touching useBrandSync or useDbSync again: any fallback added for
resilience needs its OWN explicit session/auth gate, not just a
comment saying it's already covered.

## Direct Supabase MCP access confirmed working (this session)
Claude now has a live Supabase MCP connector (project: "Ridgeline - SBG",
id `wkvcsgzlsdidysoyzcwm`) — can query/modify the actual database
directly, not just edit migration files for Jacob to paste in. Confirmed
via Supabase's own migration ledger that **migrations 002 through 020
are ALL already applied** — that other Cowork session's direct DB
access had already run everything, including 015/016/017 (multi-
tenancy) and 018/019/020 (portal + profiles security fixes). Verified
this isn't just a ledger entry: pulled the live `pg_policies` rows for
crm_portal/crm_portal_msgs/profiles directly and confirmed the old
vulnerable policies are actually gone and the new ones match the
migration files exactly.

## Legacy schema.sql tables dropped from the live database (this session)
`supabase/schema.sql` was the ORIGINAL schema, before the app moved to
crm_* jsonb-blob tables at migration 002. It defined 10 tables:
`profiles` (still genuinely live, evolved through migrations 005/015/
020) and 9 others — `stages`, `jobs`, `job_photos`, `job_tasks`,
`job_files`, `job_cost_lines`, `job_reimbursements`, `job_payments`,
`company_settings` — that migration 002's own comment already called
out as superseded ("the app now reads/writes crm_*").

Confirmed zero references to any of the 9 anywhere in `ridgeline.jsx`,
`src/main.jsx`, or any `supabase/functions/*` before touching anything.
Dropped via `apply_migration` (`drop_legacy_normalized_tables`), all 9
with `cascade` to cleanly resolve their FK relationships to each other
(job_photos/job_tasks/etc. → jobs → stages). `profiles` and every
`crm_*`/`tenants` table confirmed untouched afterward — `profiles` still
shows its original 4 rows.

`schema.sql` itself is left in the repo but now has a prominent
"HISTORICAL / DO NOT RUN" header — running it again would recreate the
9 dropped tables as empty, orphaned, still-unused tables. `profiles`'
definition in that file is also stale (superseded by migrations since);
never treat schema.sql as the source of truth for it.

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

## Marketing screenshots STILL had real PII — the build31 fix only caught the cosmetic bugs (this session)
A fresh audit (Jacob asked for a full pass: "none of my info should be in the home
page screenshots") found that the six `public/marketing/*.png` files were never
actually wrong in the way the previous session's fix addressed (demo banner,
off-center badges) — they were ALSO still running the real demo dataset when
captured, which meant:
- `shot-dashboard.png` said **"Welcome back, Jacob"** in giant text, plus
  stale pre-teal blue icon colors and the old circular-FAB bottom nav — this
  screenshot predated both the brand-color fix and the nav redesign and was
  never regenerated after either.
- `shot-pipeline.png` showed real-looking customer names and addresses
  (Marcy Templeton / 44 Birch Row, Crystal Lake IL; Rob Kennard / 127 Market
  Street) on the public, pre-auth marketing page.
- `shot-job-detail.png` showed **"Jacob Henderson"** twice (assignee chip and
  Sales team field) plus a real-looking customer name/address (Roger Perry,
  810 South College Avenue).
- All six were captured via the old jsdom+wkhtmltoimage pipeline, which no
  longer exists in the repo (never committed — it was a throwaway script from
  whichever session built build31).

**Fixed differently this time**: rather than editing the shipped demo/seed
data (`DEMO_JOBS`/`TEAM`, which Jacob's own team may reasonably use for
internal training/demos and which stays as-is in the shipped app), captured
fresh screenshots from a **sanitized scratch copy** — same code, same styling,
demo names/addresses swapped for clearly generic ones (Alex Rivera, Jamie
Novak, Sam Ellery, Casey Brooks, Robin Faust, Chris Delgado, Pat Sorensen, and
generic Springfield/Vanceburg-style addresses) — using real Playwright/
Chromium against the actual `vite preview` build rather than jsdom, which
also means the new screenshots are pixel-accurate (no more CSS Grid
`place-items` rendering bug to work around) and automatically reflect the
current teal/charcoal brand and the redesigned bottom nav. The shipped app's
real demo data is untouched; only the six PNGs changed.

**Also found and fixed while sweeping for this**: `PRODUCT.supportEmail` was
hardcoded to `support@supremebuildinggroup.com` — Jacob's own real business
email, shown as the generic RoofStride product's help-desk contact to
**every tenant**, not just Supreme. Same class of bug as the earlier
PRODUCT-vs-brand leaks, just never checked because it's plain text, not a
color or a placeholder. Now `support@roofstride.com`.

All 35 suites still pass after both changes; nothing here touched app logic,
only static assets and one string constant.

## OUTSTANDING — found during this audit, NOT yet fixed (need Jacob's go-ahead)
1. **`crm_portal.portal_public_read` is `using (revoked = false)` for
   `anon` with no token check.** Anyone who has the public anon key (which
   ships in every browser bundle) can currently run a raw REST query and
   read every non-revoked portal row in the whole database — every tenant's
   customer names, addresses, and job data. This is the exact issue already
   flagged earlier in this doc as "OUTSTANDING SECURITY ISSUE — client
   portal is enumerable," confirmed still true by direct policy inspection
   via the Supabase MCP connector this session. Real fix: move portal reads
   behind a security-definer function keyed by token, not a blanket
   `anon`-readable policy. **Still not fixed — needs a design decision, not
   just a query change.**
2. ~~Migrations 015/016/017 not run~~ — **done this session.** All 16
   pending migrations (002–017, from `roofstride_all_migrations.sql`) were
   applied via `apply_migration`. One conflict surfaced along the way: 016
   failed on a unique-constraint violation because `crm_brand` had a second
   row (`id=99`) containing only `{"_probe": <timestamp>}` — confirmed via
   direct query to be leftover System Check diagnostic write-test data, not
   a second tenant's real row — deleted, then 016 re-ran clean. `crm_org`
   checked for the same pattern before 017; only one legitimate row, no
   conflict.

## SESSION LOG — 2026-07-27 design/bug pass
- **Supplement Check "ugly bubble" chips**: root cause was `display:flex`
  rows without `alignItems` set, so the pill-shaped `Chip` (borderRadius
  999) stretched to match a taller sibling and rendered as a blob instead
  of a pill. Fixed at the `Chip` component itself (`alignSelf:
  "flex-start", flexShrink: 0`) rather than the 148 call sites, since 192
  flex rows in the file lack `alignItems` and could hit the same bug.
- **Team chat "text box too high" / dead gray gap before the bottom nav**:
  the embedded composer used `position: sticky, bottom: 0`, which only
  "catches" once a thread is tall enough to scroll past it — with a short
  or empty thread it just sat in normal flow after the last message,
  leaving a tall gap of background color before the nav bar. Switched it
  to `position: fixed, bottom: 86` (same convention already used by the
  standalone/non-embedded composer elsewhere in the file) and increased
  the embedded wrapper's reserved bottom padding from 8px to 170px so the
  last message never sits under the now-fixed composer. Verified visually
  with Playwright against both an empty thread and a populated one.
- **Chat message showing a raw sender name ("jacobhenderson.36")**: `by_name`
  is snapshotted onto each `crm_chat` row at send time, not live-joined to
  `profiles`. One historical row (the very first test message, sent
  2026-07-24 04:53) was written before Jacob's profile name was corrected
  to "Jacob Henderson" and kept the old raw fallback forever after. Fixed
  by updating that one row directly; every message since already showed
  correctly once the profile name was set. Not a live bug — `profiles.name`
  is correct for all four accounts today.
- **Checked while there**: all four `profiles` rows share the single
  `internal` tenant (Supreme Building Group) — this is the expected result
  of migration 015's backfill (everything that existed before
  multi-tenancy belonged to one company by definition) and `create_tenant()`
  correctly refuses to run for any account whose `profile.tenant_id` is
  already set, so new self-serve signups get their own isolated tenant
  going forward. Not a leak; flagging only because the *rows themselves*
  are worth a look if `steven@supremebuildinggroup.com` /
  `brandyn@allamericanroofpros.com` are stale test accounts Jacob no longer
  needs.
- **Marketing/landing page redesign**: added a reusable `Reveal` component
  (IntersectionObserver-driven fade-up, plays once per section) and applied
  it to every section below the hero — feature rows, STRIDE values
  (staggered per card), pricing, and final CTA — for the "sections ease
  into place as you scroll" feel that was asked for. Replaced the one-line
  logo+copyright footer with a real four-column footer (Product feature
  links that smooth-scroll to their section, Company links, Support/contact
  email, tagline blurb) plus a "Back to top" control, all same-page anchors
  since this is a single-page marketing site — no links point at pages that
  don't exist. Also fixed a latent contrast bug in the old footer: it used
  the dark-ink `roofstride-mark.png` at 0.7 opacity directly on the
  dark-ink footer background, which would have rendered nearly invisible;
  the new footer inverts the full wordmark to white instead.
- All 35 test suites pass after every change above. Verified visually with
  Playwright: hero, all feature-row reveals, STRIDE grid, footer (desktop
  and 390px mobile width), footer anchor links (Pipeline & leads → scrolls
  to Pipeline section; Back to top → scrolls to 0), and the Inbox composer
  fix on both an empty and a populated thread.
- **Not started this session**: the broader "many things through the site
  need improved" pass beyond Supplement Check, Team Chat, and the marketing
  page — this is genuinely open-ended (the app is ~19,000 lines across
  dozens of screens) and needs to be worked through screen by screen rather
  than claimed done in one pass.

## SESSION LOG — 2026-07-27, second pass (bug reports from live screenshots)
Jacob sent screenshots of the live site flagging several things; the live
site turned out to be running a stale build (see below), but the
underlying issues were real in the source regardless.

- **Roof takeoff removed completely**, per Jacob's explicit call — not
  hidden, deleted: the `JOB_SECTIONS` entry, the render case, the "Open
  roof takeoff" CTA on Measurements, and the whole `computeTakeoff`/
  `TabTakeoff`/`slopeFactor`/`WASTE_BANDS`/etc. engine (~500 lines).
  Confirmed nothing else in the app read `job.takeoff` or called
  `computeTakeoff` before deleting. `build24`/`build25` (the takeoff
  regression tests) are retired; `build35` asserts the removal instead.
- **"BY STAGE" dashboard rows showing no stage name** (just a bar and a
  count): `byStage` spreads a stage object (which has `.name`) but the row
  read `{st.label}` — a field that has never existed on a stage. Different
  bug from the Chip/flexbox issue fixed earlier, same "wrong field name,
  rendered as blank" shape. Fixed to `{st.name}`.
- **Unread badges (Inbox count, @mention count under More) never actually
  cleared**: `chatSeenCount` lived in plain `useState(0)`, so a reload —
  backgrounding Safari, a PWA relaunch, even just refreshing — reset it to
  zero and every previously-read message counted as unread again. It looked
  like notifications never cleared; they cleared for the session and then
  forgot. Persisted per-user in localStorage now.
- **Bottom nav still read as a copy of Roofr** even after the earlier
  "squircle, closer to the bar" pass — because the real signature isn't the
  shape, it's a raised, oversized, drop-shadowed center button floating
  above an otherwise plain icon row, which is the single most common
  pattern among field-service competitors regardless of whether the button
  is round or square. Removed the elevation/shadow/oversizing entirely:
  all five items (Home, Jobs, Add, Inbox, More) are now the same flat,
  equal-height tab button, and the active-tab indicator changed from a
  filled background pill to a slim accent bar along the top edge — a
  materially different visual language, not a reskin of the same shape.
- **Insurance code lookup by zip — already exists and is already live**,
  not a placeholder: `InsuranceHub`'s Code lookup tab resolves a zip
  through a hand-researched Ohio/Kentucky county → building-department
  database first, and falls back to a real Geoapify geocoding call
  (`geoLookupZip`) for anything not already on file, saving what it learns
  so the database grows with use. Verified end-to-end for Jacob's actual
  market (45402/Dayton — instant, full building-department contact info).
  A zip outside that seeded list failed the live Geoapify call in this dev
  sandbox specifically — this environment blocks outbound requests to
  arbitrary external domains, so that failure could be the sandbox and not
  the real thing; worth Jacob trying an out-of-market zip on the actual
  deployed site to confirm the Geoapify key is reachable from production.
- **Client portal security — fixed the previously-flagged anon-enumerable
  read** (migrations 018/019), now that Jacob gave a standing go-ahead to
  apply changes without asking each time. `portal_public_read` on
  `crm_portal` was `revoked = false` for anon with no token check —
  RLS controls which rows CAN come back, not what a query asks for, so
  anyone holding the public anon key could skip the app's own token filter
  and read every tenant's portal data directly from the REST endpoint.
  Found the identical shape of bug one level down while fixing it:
  `pmsg_update_customer` validated that the message row being updated had
  a live token, but never that the caller supplied that token — so an
  anonymous visitor could mark any tenant's portal messages read, not just
  their own thread. Both closed by moving the token check into
  security-definer functions (`portal_get_data`, `portal_get_messages`,
  `portal_mark_customer_read`) that take the token as an explicit argument,
  so the only rows ever reachable are the ones matching what the caller
  actually passed in. Staff viewing the same thread from inside a job were
  never affected — that path already used real tenant-scoped RLS and stays
  on it. `build36` asserts the fix. **Caught and fixed my own mistake
  mid-way**: migration 018's first version of the mark-read function had
  the role/column pairing backwards; 019 corrects it before anything in
  the client ever called it, so no bad data was written.
- **New, separate finding, not fixed**: `crm_portal_msgs` has no anon
  SELECT policy at all (by design, to avoid reopening the enumeration
  hole) and Supabase Realtime enforces RLS on subscriptions — meaning a
  homeowner's live portal chat almost certainly never received new
  team replies in real time; they'd only see them on their next full page
  load. Pre-existing, not something this session's changes touched either
  way. Would need a proper design (likely Realtime's authorized/broadcast
  channels) rather than a quick policy tweak — flagging rather than
  guessing at a fix.
- **The live deployed site (ridgeline-kappa.vercel.app) is stale.**
  Screenshots Jacob sent show blue UI throughout (nav, buttons, pills);
  `T.accent` has been `#0A9E98` (teal) since commit `51aa8a5`, which
  `origin/main` has had since well before this session started. Something
  between GitHub and Vercel isn't picking up pushes — worth checking the
  Vercel project's Deployments tab for a failed build or a paused
  auto-deploy, since no amount of further code fixes will be visible on
  that URL until it redeploys from the current `main`.

## Honest limits (do not promise otherwise)
- Google reviews cannot be auto-posted; no API exists. The compliant
  ask-first flow is built.
- Email open tracking needs a pixel backend (arrives with Gmail).
- @mention push notifications need a notification service; the in-app
  badge and toast work today.
- Job edits sync on refresh, last-write-wins. No live field merging.
- KY and IL insurance citations are unverified placeholders. Ohio's are
  verified.
- Client portal live chat (customer side) does not update in real time —
  see above; needs Realtime's authorized-channel support, not built yet.
