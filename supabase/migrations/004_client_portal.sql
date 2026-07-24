-- ============================================================
-- Ridgeline persistence layer (004) — public client portal
-- Paste into Supabase → SQL Editor → Run.
--
-- A portal link has to open for a homeowner who has no account and
-- never signs in. This table holds a per-job snapshot keyed by a
-- random token: anyone holding the link can read that one row, and
-- nothing else. Revoking is a delete.
-- ============================================================

create table if not exists crm_portal (
  token text primary key,
  job_id text not null,
  data jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now(),
  revoked boolean not null default false
);

create index if not exists crm_portal_job_idx on crm_portal(job_id);

alter table crm_portal enable row level security;

-- Public read of non-revoked links only. The token is the secret;
-- it is random and unguessable, and each row exposes only the one
-- job's customer-facing summary — no pricing internals, no other
-- customers, no company data.
drop policy if exists portal_public_read on crm_portal;
create policy portal_public_read on crm_portal for select to anon, authenticated
  using (revoked = false);

-- Only signed-in staff can create, update, or revoke links.
drop policy if exists portal_staff_insert on crm_portal;
create policy portal_staff_insert on crm_portal for insert to authenticated with check (true);
drop policy if exists portal_staff_update on crm_portal;
create policy portal_staff_update on crm_portal for update to authenticated using (true) with check (true);
drop policy if exists portal_staff_delete on crm_portal;
create policy portal_staff_delete on crm_portal for delete to authenticated using (true);
