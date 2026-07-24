-- Ridgeline (006) — two-way portal messaging.
-- Homeowners write from their portal link (no account); the team
-- replies from the job's Portal tab. The token scopes everything:
-- anon visitors can only read and write messages for a live,
-- non-revoked portal token they already hold.

create table if not exists crm_portal_msgs (
  id text primary key,
  token text not null,
  job_id text,
  by_role text not null check (by_role in ('customer','team')),
  by_name text,
  body text not null,
  at timestamptz not null default now()
);

create index if not exists crm_portal_msgs_token_idx on crm_portal_msgs(token);

alter table crm_portal_msgs enable row level security;

drop policy if exists pmsg_read on crm_portal_msgs;
create policy pmsg_read on crm_portal_msgs for select to anon, authenticated
  using (exists (select 1 from crm_portal p where p.token = crm_portal_msgs.token and p.revoked = false));

-- Anonymous portal visitors may only write as the customer.
drop policy if exists pmsg_insert_customer on crm_portal_msgs;
create policy pmsg_insert_customer on crm_portal_msgs for insert to anon
  with check (by_role = 'customer'
    and exists (select 1 from crm_portal p where p.token = crm_portal_msgs.token and p.revoked = false));

drop policy if exists pmsg_insert_team on crm_portal_msgs;
create policy pmsg_insert_team on crm_portal_msgs for insert to authenticated
  with check (exists (select 1 from crm_portal p where p.token = crm_portal_msgs.token and p.revoked = false));

do $$
begin
  begin
    alter publication supabase_realtime add table crm_portal_msgs;
  exception when duplicate_object then null;
  end;
end $$;
