-- Build 5: customers may propose a correction to their own contact
-- details from the portal. Nothing is applied automatically — the
-- request lands in the team's Portal tab for approval, so a stray tap
-- on a phone cannot silently rewrite the record we bill and dispatch
-- against.

-- Widen the request-type constraint to carry contact changes.
alter table crm_portal_requests
  drop constraint if exists crm_portal_requests_request_type_check;

alter table crm_portal_requests
  add constraint crm_portal_requests_request_type_check
  check (request_type in ('quote_change', 'add_on', 'contact_update'));

-- Proposed values travel as jsonb so one row carries the whole change
-- set rather than one row per field.
alter table crm_portal_requests
  add column if not exists proposed jsonb;

-- Read receipts for the message thread, so both ends can show an
-- unread count without a separate table.
alter table crm_portal_msgs
  add column if not exists read_by_team boolean not null default false,
  add column if not exists read_by_customer boolean not null default false;

create index if not exists crm_portal_msgs_unread_idx
  on crm_portal_msgs(token, read_by_team, read_by_customer);

-- Both sides need to be able to mark messages read.
drop policy if exists pmsg_update_team on crm_portal_msgs;
create policy pmsg_update_team on crm_portal_msgs for update to authenticated
  using (true) with check (true);

drop policy if exists pmsg_update_customer on crm_portal_msgs;
create policy pmsg_update_customer on crm_portal_msgs for update to anon
  using (exists (select 1 from crm_portal p where p.token = crm_portal_msgs.token and p.revoked = false))
  with check (exists (select 1 from crm_portal p where p.token = crm_portal_msgs.token and p.revoked = false));
