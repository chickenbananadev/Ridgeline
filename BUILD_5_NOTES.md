# Ridgeline — Build 5

## Home screen
- Live **calendar** and **dispatch board** embedded, toggled between.
  They are the same components as the full screens, so an appointment
  added from home is the same record as one added under More.
- **Pipeline** redesigned as five rings (Leads / Pipeline / Approved /
  Production / Invoicing) with counts and dollars, per-stage breakdown
  kept underneath.

## Client portal
- **Every section is now switchable and reorderable from one list.**
  Visibility toggles and ordering used to be two separate lists saying
  the same thing; they are merged. Tracker, updates, messages and the
  contact blocks are switchable too, not just the document sections.
- **Project contact block**: the assigned rep's name, title, phone and
  email, tap-to-call. A per-job override puts a different person in
  front of a customer without reassigning the job.
- **Customer contact details**: shown to the homeowner, who can request
  a correction. Nothing applies automatically — the request lands in
  the job's Portal tab for approval, so a stray tap cannot repoint the
  number we dispatch and bill against.
- **Read receipts** on portal messages, and a browser notification on
  both ends when the tab is open but backgrounded.

## Measurements
- **Import an aerial report** — EagleView, Roofr, Hover, QuickMeasure —
  as PDF or CSV. Values are parsed against the labels those vendors
  print and shown for review before anything writes to the job.
- Square-foot totals convert to squares automatically.
- Image-only PDFs have no text layer; the UI says so rather than
  importing zeros.
- Uses the legacy pdfjs build deliberately: the modern one ships
  top-level await, which would force a build target that drops older
  mobile Safari.

## Navigation
- **Job tabs grouped** into Inspect / Sell / Build / Money / Customer.
  Seventeen tabs in one scrolling strip meant hunting.
- **More menu search** flattens the four accordions when you type.

## Database
Run `009_portal_contact_updates.sql` after 006–008. It widens the
request-type constraint for contact changes, adds the proposed-values
column, and adds message read receipts.

## Verification
`test:smoke`, `test:features`, `test:build2`–`test:build5`, `npm run build`.
All pass, `console.error captured: 0`.
