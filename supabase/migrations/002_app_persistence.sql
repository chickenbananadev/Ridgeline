-- ============================================================
-- Ridgeline persistence layer (002)
-- Paste this whole file into Supabase → SQL Editor → Run.
-- Safe to run more than once. Ignores the older normalized
-- tables from schema.sql; the app now reads/writes crm_*.
-- ============================================================

-- Company-wide settings: brand, stages, lead sources, templates,
-- price list, docs metadata, crews, vendors, review settings.
create table if not exists crm_org (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Jobs. Core columns for querying; the full rich object in data.
-- Financial details live in crm_financials so crew can be blocked.
create table if not exists crm_jobs (
  id text primary key,
  name text,
  stage_id text,
  assignee text,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists crm_financials (
  job_id text primary key references crm_jobs(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists crm_appointments (
  id text primary key,
  job_id text,
  type text,
  date text,
  "time" text,
  notes text,
  created_by text,
  created_at timestamptz not null default now()
);

-- Immutable audit log. Insert-only by design: no update or delete
-- policy exists, so edits/deletions of notes can never be scrubbed
-- from history even by someone with the app open in devtools.
create table if not exists crm_activity (
  id text primary key,
  at timestamptz not null default now(),
  by_name text,
  kind text,
  job_id text,
  job_name text,
  body text
);

-- Team chat. Also insert-only.
create table if not exists crm_chat (
  id text primary key,
  at timestamptz not null default now(),
  by_name text,
  body text,
  mentions text[] default '{}',
  job_id text
);

-- ---------- Row Level Security ----------
alter table crm_org enable row level security;
alter table crm_jobs enable row level security;
alter table crm_financials enable row level security;
alter table crm_appointments enable row level security;
alter table crm_activity enable row level security;
alter table crm_chat enable row level security;

-- Any active signed-in seat may read/write company data.
drop policy if exists org_rw on crm_org;
create policy org_rw on crm_org for all to authenticated
  using (true) with check (true);

drop policy if exists jobs_rw on crm_jobs;
create policy jobs_rw on crm_jobs for all to authenticated
  using (true) with check (true);

drop policy if exists appts_rw on crm_appointments;
create policy appts_rw on crm_appointments for all to authenticated
  using (true) with check (true);

-- Financials: everyone except crew. Enforced here, not just in UI.
drop policy if exists fin_rw on crm_financials;
create policy fin_rw on crm_financials for all to authenticated
  using (exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.role is distinct from 'crew'
  ))
  with check (exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.role is distinct from 'crew'
  ));

-- Audit + chat: read and insert only. No update/delete policies →
-- Postgres denies those operations for everyone on the anon key.
drop policy if exists activity_read on crm_activity;
create policy activity_read on crm_activity for select to authenticated using (true);
drop policy if exists activity_insert on crm_activity;
create policy activity_insert on crm_activity for insert to authenticated with check (true);

drop policy if exists chat_read on crm_chat;
create policy chat_read on crm_chat for select to authenticated using (true);
drop policy if exists chat_insert on crm_chat;
create policy chat_insert on crm_chat for insert to authenticated with check (true);

-- ---------- Realtime for chat + activity ----------
do $$
begin
  begin
    alter publication supabase_realtime add table crm_chat;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table crm_activity;
  exception when duplicate_object then null;
  end;
end $$;
