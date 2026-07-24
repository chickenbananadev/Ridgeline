# Ridgeline — Build 2

Build 2 expands the operational foundation created in Build 1.

## Multi-property customers

- Contact cards now include an **Add another project** action.
- New projects can select an existing customer.
- A project can use one of that customer's existing properties or create a new
  property.
- Repeat projects reuse the contact and property identifiers instead of
  creating duplicate customer records.

## Job-board quick actions

Every board card now has a **Quick add** panel for:

- Internal notes
- Call summaries
- Text drafts
- Tasks and deadlines
- Appointments

These actions write into the existing job thread, task list, call log,
appointment calendar, and activity history.

## Operations calendar

- Added calendar views for All, Sales, Production, Issues, and Delivery.
- Added appointment duration, status, category, and assigned resource.
- Resources can be a rep, crew, or material/dump driver.
- Overlapping appointments for the same resource are blocked.
- Appointments in different ZIP codes with less than 90 minutes between them
  show a travel-time warning.
- Added default appointment types for service issues, material deliveries, and
  trailer/dump runs.

## Database update

Run `supabase/migrations/007_operations_calendar.sql` after the prior
migrations. It adds the operational scheduling fields to `crm_appointments`.

## Verification

- Production build passes.
- Full application smoke walkthrough passes with no captured runtime errors.
- Build 1 lead-intake and flat-roof tests pass.
- Build 2 repeat-customer, quick-action, and calendar-view tests pass.
