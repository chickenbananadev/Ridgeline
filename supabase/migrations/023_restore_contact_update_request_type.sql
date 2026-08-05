-- Restore 'contact_update' to the portal request types.
--
-- Migration 009 added 'contact_update' so a homeowner could submit a change
-- of phone or email from the portal. Migration 022 then added
-- 'review_feedback' by rewriting the whole CHECK constraint from scratch and
-- listed only ('quote_change', 'add_on', 'review_feedback') — silently
-- dropping the type 009 had added.
--
-- The app still writes contact_update (the portal's "update my details"
-- flow) and still reads it in two places, so since 022 shipped every
-- customer contact update has been rejected by the database. The insert
-- fails, the portal shows nothing useful, and the office never learns the
-- number changed.
--
-- This restores all four types. Written as a full replacement, like 022,
-- but enumerating every type the application actually uses.

alter table crm_portal_requests
  drop constraint if exists crm_portal_requests_request_type_check;

alter table crm_portal_requests
  add constraint crm_portal_requests_request_type_check
  check (request_type in ('quote_change', 'add_on', 'contact_update', 'review_feedback'));
