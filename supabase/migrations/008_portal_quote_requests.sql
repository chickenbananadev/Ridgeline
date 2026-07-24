-- Build 3: structured quote-change and future-project requests from
-- a customer's private portal.

create table if not exists crm_portal_requests (
  id text primary key,
  token text not null,
  job_id text,
  request_type text not null check (request_type in ('quote_change', 'add_on')),
  category text,
  details text not null,
  status text not null default 'New',
  requested_by text,
  team_response text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_portal_requests_token_idx
  on crm_portal_requests(token, created_at desc);

alter table crm_portal_requests enable row level security;

drop policy if exists portal_requests_read on crm_portal_requests;
create policy portal_requests_read on crm_portal_requests for select to anon, authenticated
  using (exists (
    select 1 from crm_portal p
    where p.token = crm_portal_requests.token and p.revoked = false
  ));

drop policy if exists portal_requests_customer_insert on crm_portal_requests;
create policy portal_requests_customer_insert on crm_portal_requests for insert to anon
  with check (
    status = 'New'
    and exists (
      select 1 from crm_portal p
      where p.token = crm_portal_requests.token
        and p.job_id = crm_portal_requests.job_id
        and p.revoked = false
    )
  );

drop policy if exists portal_requests_team_insert on crm_portal_requests;
create policy portal_requests_team_insert on crm_portal_requests for insert to authenticated
  with check (true);

drop policy if exists portal_requests_team_update on crm_portal_requests;
create policy portal_requests_team_update on crm_portal_requests for update to authenticated
  using (true) with check (true);

do $$
begin
  begin
    alter publication supabase_realtime add table crm_portal_requests;
  exception when duplicate_object then null;
  end;
end $$;
