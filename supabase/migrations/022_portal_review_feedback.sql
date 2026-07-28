-- Customer review funnel: allow private review feedback to be filed as a
-- portal request. The 1-3 star "tell us privately" path in PortalReview
-- inserts a row with request_type = 'review_feedback', which the original
-- check constraint (quote_change | add_on) rejected. Widen the allowed set;
-- this is additive and does not touch existing rows or policies.
alter table crm_portal_requests
  drop constraint if exists crm_portal_requests_request_type_check;

alter table crm_portal_requests
  add constraint crm_portal_requests_request_type_check
  check (request_type in ('quote_change', 'add_on', 'review_feedback'));
