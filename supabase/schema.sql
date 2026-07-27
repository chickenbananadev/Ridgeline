-- ============================================================
-- ⚠️ HISTORICAL / DO NOT RUN — kept for reference only.
--
-- This is the ORIGINAL schema, before the app moved to the crm_*
-- jsonb-blob tables starting at migration 002. Of the 10 tables
-- defined below, 9 (stages, jobs, job_photos, job_tasks, job_files,
-- job_cost_lines, job_reimbursements, job_payments,
-- company_settings) were confirmed unused anywhere in the app or
-- Edge Functions and were DROPPED from the live database on
-- 2026-07-27. Running this file again would recreate them as empty,
-- orphaned tables the app still would not use.
--
-- `profiles` (the one table here still genuinely live) is NOT
-- affected — it has continued to evolve through migrations 005,
-- 015, and 020 since this file was written, and this file's version
-- of it is stale. Never run this file to "set up" profiles; the
-- current, correct definition only exists as the sum of every
-- migration that has touched it since.
-- ============================================================

-- ============================================================
-- RIDGELINE — Supabase schema + Row Level Security
-- Paste into: Supabase dashboard -> SQL Editor -> New query -> Run
-- Safe to re-run; drops and recreates policies.
-- ============================================================

-- ---------- extensions ----------
create extension if not exists "pgcrypto";

-- ---------- roles ----------
do $$ begin
  create type user_role as enum ('admin', 'manager', 'rep', 'crew');
exception when duplicate_object then null; end $$;

-- ============================================================
-- PROFILES — one row per seat, linked to Supabase Auth
-- ============================================================
create table if not exists profiles (
  id              uuid primary key references auth.users on delete cascade,
  name            text not null,
  email           text unique not null,
  phone           text,
  role            user_role not null default 'rep',
  title           text,
  commission_rate numeric(5,2) default 60,
  active          boolean not null default true,
  added_at        date default current_date,
  created_at      timestamptz default now()
);

-- Helper functions. SECURITY DEFINER so policies can read profiles
-- without recursing through profiles' own RLS.
create or replace function current_role_of() returns user_role
  language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid()
$$;

create or replace function is_active_user() returns boolean
  language sql stable security definer set search_path = public as $$
  select coalesce((select active from profiles where id = auth.uid()), false)
$$;

-- Can this user see money? Everyone except crew.
create or replace function can_see_money() returns boolean
  language sql stable security definer set search_path = public as $$
  select is_active_user() and current_role_of() <> 'crew'
$$;

create or replace function is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select is_active_user() and current_role_of() = 'admin'
$$;

-- New auth users get a profile automatically.
create or replace function handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, role, title)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'rep'),
    coalesce(new.raw_user_meta_data->>'title', 'Sales Rep')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- WORKFLOW STAGES
-- ============================================================
create table if not exists stages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  position   int  not null default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- JOBS
-- ============================================================
create table if not exists jobs (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  address       text,
  city          text,
  state         text,
  zip           text,
  lat           numeric(10,6),
  lng           numeric(10,6),
  phone         text,
  email         text,
  stage_id      uuid references stages on delete set null,
  assignee_id   uuid references profiles on delete set null,
  lead_source   text,
  claim_type    text default 'Unknown',      -- Insurance | Retail | Unknown
  value         numeric(12,2) default 0,
  sched_date    date,

  -- consent, stored with timestamp + source (TCPA / CAN-SPAM trail)
  sms_consent           boolean default false,
  sms_consent_at        timestamptz,
  sms_consent_source    text,
  email_consent         boolean default false,
  email_consent_at      timestamptz,
  email_consent_source  text,

  -- insurance
  insurance      jsonb,   -- carrier, policy, claim, adjuster, deductible, coverage, oLaw, endorsements{}
  checklist      jsonb default '{}'::jsonb,
  measurements   jsonb default '{}'::jsonb,
  estimate       jsonb default '{}'::jsonb,
  contract       jsonb default '{}'::jsonb,
  portal         jsonb default '{}'::jsonb,
  review         jsonb default '{}'::jsonb,

  -- commission config (admin-controlled)
  commission_structure text default 'grossProfit',
  commission_rate      numeric(5,2) default 60,
  overhead_pct         numeric(5,2) default 10,

  created_by  uuid references profiles on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists jobs_stage_idx    on jobs(stage_id);
create index if not exists jobs_assignee_idx on jobs(assignee_id);

create or replace function touch_updated_at() returns trigger
  language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists jobs_touch on jobs;
create trigger jobs_touch before update on jobs
  for each row execute function touch_updated_at();

-- ============================================================
-- JOB CHILD TABLES
-- ============================================================
create table if not exists job_photos (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references jobs on delete cascade,
  label       text,
  storage_path text,            -- path inside the job-photos bucket
  taken_at    timestamptz default now(),
  lat         numeric(10,6),
  lng         numeric(10,6),
  accuracy_m  int,
  address     text,             -- reverse-geocoded at capture
  uploaded_by uuid references profiles on delete set null,
  created_at  timestamptz default now()
);
create index if not exists job_photos_job_idx on job_photos(job_id);

create table if not exists job_tasks (
  id        uuid primary key default gen_random_uuid(),
  job_id    uuid not null references jobs on delete cascade,
  label     text not null,
  done      boolean default false,
  due_date  date,
  created_at timestamptz default now()
);

create table if not exists job_files (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references jobs on delete cascade,
  name        text not null,
  category    text,
  storage_path text,
  uploaded_by uuid references profiles on delete set null,
  created_at  timestamptz default now()
);

-- MONEY TABLES — crew has no access to any of these
create table if not exists job_cost_lines (
  id        uuid primary key default gen_random_uuid(),
  job_id    uuid not null references jobs on delete cascade,
  bucket    text not null check (bucket in ('materials','labor','other')),
  label     text not null,
  amount    numeric(12,2) not null default 0,
  entered_by uuid references profiles on delete set null,
  created_at timestamptz default now()
);
create index if not exists cost_lines_job_idx on job_cost_lines(job_id);

create table if not exists job_reimbursements (
  id      uuid primary key default gen_random_uuid(),
  job_id  uuid not null references jobs on delete cascade,
  label   text not null,
  amount  numeric(12,2) not null default 0,
  status  text default 'Needs paid' check (status in ('Needs paid','Reimbursed')),
  created_at timestamptz default now()
);

create table if not exists job_payments (
  id      uuid primary key default gen_random_uuid(),
  job_id  uuid not null references jobs on delete cascade,
  kind    text not null check (kind in ('Received','Paid out','Expense')),
  label   text,
  amount  numeric(12,2) not null default 0,
  paid_on date default current_date,
  created_at timestamptz default now()
);

-- ============================================================
-- COMPANY SETTINGS (branding, review automation) — single row
-- ============================================================
create table if not exists company_settings (
  id          int primary key default 1 check (id = 1),
  branding    jsonb default '{}'::jsonb,
  review      jsonb default '{}'::jsonb,
  updated_at  timestamptz default now()
);
insert into company_settings (id) values (1) on conflict do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- Without this, the publishable key can read everything.
-- ============================================================
alter table profiles            enable row level security;
alter table stages              enable row level security;
alter table jobs                enable row level security;
alter table job_photos          enable row level security;
alter table job_tasks           enable row level security;
alter table job_files           enable row level security;
alter table job_cost_lines      enable row level security;
alter table job_reimbursements  enable row level security;
alter table job_payments        enable row level security;
alter table company_settings    enable row level security;

-- ---------- profiles ----------
drop policy if exists profiles_read on profiles;
create policy profiles_read on profiles
  for select to authenticated using (is_active_user());

drop policy if exists profiles_self_update on profiles;
create policy profiles_self_update on profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Only admins manage seats.
drop policy if exists profiles_admin_write on profiles;
create policy profiles_admin_write on profiles
  for all to authenticated using (is_admin()) with check (is_admin());

-- ---------- stages ----------
drop policy if exists stages_read on stages;
create policy stages_read on stages
  for select to authenticated using (is_active_user());

drop policy if exists stages_admin_write on stages;
create policy stages_admin_write on stages
  for all to authenticated using (is_admin()) with check (is_admin());

-- ---------- jobs ----------
-- Everyone active can see the board (crew needs work orders + addresses).
drop policy if exists jobs_read on jobs;
create policy jobs_read on jobs
  for select to authenticated using (is_active_user());

drop policy if exists jobs_write on jobs;
create policy jobs_write on jobs
  for insert to authenticated with check (can_see_money());

drop policy if exists jobs_update on jobs;
create policy jobs_update on jobs
  for update to authenticated
  using (
    is_admin()
    or current_role_of() = 'manager'
    or (current_role_of() = 'rep' and assignee_id = auth.uid())
  );

drop policy if exists jobs_delete on jobs;
create policy jobs_delete on jobs
  for delete to authenticated using (is_admin());

-- ---------- photos / tasks / files (crew CAN use these) ----------
drop policy if exists photos_rw on job_photos;
create policy photos_rw on job_photos
  for all to authenticated using (is_active_user()) with check (is_active_user());

drop policy if exists tasks_rw on job_tasks;
create policy tasks_rw on job_tasks
  for all to authenticated using (is_active_user()) with check (is_active_user());

drop policy if exists files_rw on job_files;
create policy files_rw on job_files
  for all to authenticated using (is_active_user()) with check (is_active_user());

-- ---------- money tables (crew BLOCKED at the database) ----------
drop policy if exists cost_lines_rw on job_cost_lines;
create policy cost_lines_rw on job_cost_lines
  for all to authenticated using (can_see_money()) with check (can_see_money());

drop policy if exists reimb_rw on job_reimbursements;
create policy reimb_rw on job_reimbursements
  for all to authenticated using (can_see_money()) with check (can_see_money());

drop policy if exists payments_rw on job_payments;
create policy payments_rw on job_payments
  for all to authenticated using (can_see_money()) with check (can_see_money());

-- ---------- company settings ----------
drop policy if exists settings_read on company_settings;
create policy settings_read on company_settings
  for select to authenticated using (is_active_user());

drop policy if exists settings_admin_write on company_settings;
create policy settings_admin_write on company_settings
  for all to authenticated using (is_admin()) with check (is_admin());

-- ============================================================
-- STORAGE — private bucket for job photos and documents
-- ============================================================
insert into storage.buckets (id, name, public)
values ('job-photos', 'job-photos', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('job-files', 'job-files', false)
on conflict (id) do nothing;

drop policy if exists job_photos_read on storage.objects;
create policy job_photos_read on storage.objects
  for select to authenticated
  using (bucket_id in ('job-photos','job-files') and is_active_user());

drop policy if exists job_photos_write on storage.objects;
create policy job_photos_write on storage.objects
  for insert to authenticated
  with check (bucket_id in ('job-photos','job-files') and is_active_user());

drop policy if exists job_photos_delete on storage.objects;
create policy job_photos_delete on storage.objects
  for delete to authenticated
  using (bucket_id in ('job-photos','job-files') and can_see_money());

-- ============================================================
-- SEED — default pipeline stages
-- ============================================================
insert into stages (name, position)
select * from (values
  ('New lead', 1), ('Appointment scheduled', 2), ('Estimate sent / Follow up', 3),
  ('Claim filed', 4), ('Job approved', 5), ('Production', 6),
  ('Invoicing / Cap out', 7), ('Job completed', 8)
) as v(name, position)
where not exists (select 1 from stages);

-- ============================================================
-- AFTER RUNNING THIS:
-- 1. Authentication -> Users -> Add user. Create your own login.
-- 2. Then run, replacing the email:
--      update profiles set role = 'admin', title = 'Owner / Admin'
--      where email = 'jacob@supremebuildinggroup.com';
--    The first admin must be set by hand — nobody can promote
--    themselves through the app.
-- 3. Add the rest of the team from the app's Team & seats screen.
-- ============================================================
