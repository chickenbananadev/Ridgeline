# Ridgeline — Build 4

## Home screen
- **Week ahead** card: the next seven days of appointments and scheduled
  roofs on the home screen, so the calendar and the dispatch board are
  answered without leaving it. Each row taps through to the job.
- Roofs scheduled without a crew show a "No crew" badge, and a running
  count links straight to dispatch.

## Contacts — admin-only deletion
- Admins get a delete control on each project and a **Delete customer**
  action that removes every project under that contact.
- Non-admins see neither control.
- Deleting requires typing DELETE. The confirmation names exactly what
  disappears and warns that published portals stop working.
- Deletions are written to the activity feed.
- Removal flows through the existing sync diff, which issues the
  matching `crm_jobs` delete — no new database work.

## Duplicate address blocking
- New leads are fingerprinted on address: punctuation stripped, street
  suffixes and directionals folded (Ave/Avenue, W/West, St/Street),
  state and country dropped.
- A match against any existing job blocks the save and lists the
  conflicting records with their phone numbers.
- Choosing an existing customer's own property is exempt — that is a
  deliberate repeat project, not a duplicate.

## Attic ventilation calculator
- New **Ventilation** tab on every job.
- Sizes intake and exhaust against the net-free-area ratio in
  IRC/RCO R806.2 — 1/150 default, 1/300 only with a balanced system.
- Requesting 1/300 with a split outside 40–60 percent upper silently
  recalculates at 1/150 and says why.
- Owens Corning (VentSure) and GAF (Cobra) product families plus box
  vents, turbines, and the common intake products, each with published
  net-free-area values.
- Flags intake starvation — exhaust outrunning intake — separately from
  the pass/fail, because it voids shingle warranties even when the
  total area passes.
- Powered fans are excluded from the balance math; they are rated in
  CFM, not NFA.
- Generates supplement wording that mirrors the R806.2 argument already
  in the insurance hub, with the shortfall and the requested scope
  filled in.
- NFA figures are typical published values per product family. The
  screen says so and tells the user to verify against the current data
  sheet before sending to a carrier.

## Setup & keys (admin only)
- Checklist of every service still to connect, each with the exact
  dashboard, variable name, and steps in phone-browser order.
- Status per item persists to `crm_org`.
- Secrets are deliberately not entered in the app: Ridgeline talks to
  Supabase from the browser with the public anon key, so a value stored
  there is readable by every signed-in seat regardless of a UI gate.
  The screen routes each secret to Vercel env vars or Edge Function
  secrets and stores only non-secret config.

## Verification
`npm run test:smoke` / `test:features` / `test:build2` / `test:build3` /
`test:build4`, plus `npm run build`. All pass, `console.error captured: 0`.

## Not built (still requires you)
- Anything needing an API key: AI assistant, Twilio texting, Gmail.
- File storage — needs the Supabase Pro upgrade and a bucket.
- Migrations 006, 007, 008 must still be run in the SQL editor.
