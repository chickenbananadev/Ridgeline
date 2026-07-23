# Ridgeline

CRM for Supreme Building Group — jobs pipeline, checklists, estimates & contracts
with signature capture, cap-out financials with role-gated commission structures,
Code Verify, and Insurance Resources.

## Modules

- **Jobs pipeline** — kanban board with a customizable workflow, filters/sort,
  full job detail (checklist, measurements, materials, estimate, contract,
  inspection report, photos, payments, invoice, work order, portal sharing).
- **Financials / Cap-Out** — per-job revenue, COGS, and reimbursements, with an
  admin-only commission structure selector: Net Profit, Gross Profit (default),
  10/50/50, Gross Contract. Sales reps see their payout only, never the levers
  or company splits. CSV export.
- **Code Verify** — zip lookup for adopted building code, permit rules, and
  inspector info, with links to official sources (codes.ohio.gov, KY DHBC,
  ICC Digital Codes, Municode) and a verification status badge per jurisdiction.
- **Insurance Resources** — Ohio Insurance Law, Policy Provisions, Documentation
  Checklist, Claim Tips, Do & Don't, Truck Cheat Sheet.
- **Review automation** — consent-gated Google review requests on job completion.

## Files

- `ridgeline.jsx` — the full app, a single React component (default export).
  This supersedes the earlier standalone `ridgeline-update.jsx` module; its
  commission-structure, Code Verify, and Insurance Resources content is now
  merged directly into this file.
