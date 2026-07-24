# Ridgeline Build 3

Build 3 expands the customer portal while preserving Builds 1 and 2.

## Customer project tracker

- Adds a seven-step homeowner-facing tracker:
  1. Appointment scheduled
  2. Inspection & estimating
  3. Quote approved
  4. Materials ordered
  5. Installation scheduled
  6. Installation
  7. Complete
- The tracker can follow the internal job stage or be overridden from the job's Portal tab.
- The customer portal and the internal portal preview use the same milestone.

## Portal communication and documents

- Existing two-way portal messages remain available.
- Job files now have an Internal/Shared control.
- Shared files can appear in the customer portal when Documents visibility is enabled.
- Customer-visible job notes continue to appear as project updates.
- Estimate, contract, photos, invoice, and documents each have separate visibility controls.

## Quote and future-work requests

- Customers can request a change to their current quote.
- Customers can request pricing for future work such as gutters, siding, or another property.
- The team can review requests and move them through Reviewing, Quoted, and Closed.
- Portal admins can independently enable or disable quote-change and future-work requests.

## Stage updates

- Moving a job to a new board stage can queue a customer update when the customer has SMS or email consent.
- The Portal tab contains a control for enabling or disabling these queued updates.

## Database migration

Run `supabase/migrations/008_portal_quote_requests.sql` after migrations 001–007. It creates the portal request table, access policies, indexes, and real-time publication.

## Verification

Run:

```bash
npm run test:smoke
npm run test:features
npm run test:build2
npm run test:build3
npm run build
```
