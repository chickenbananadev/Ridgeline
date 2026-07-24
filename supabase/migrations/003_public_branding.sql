-- ============================================================
-- Ridgeline persistence layer (003)
-- Fixes: logo/colors reverting on the login screen after refresh.
-- Cause: crm_org requires a logged-in session to read (correct,
-- since it holds price lists and vendor accounts), but the login
-- screen itself renders before anyone is logged in — so it had
-- nothing to load branding from and fell back to defaults.
-- Fix: a separate, small table holding ONLY public-facing brand
-- fields (logo, colors, name, slogan, contact info) that anyone
-- can read, logged in or not — the same info that already appears
-- on quotes and the client portal, so nothing new is exposed.
-- Paste into Supabase → SQL Editor → Run.
-- ============================================================

create table if not exists crm_brand (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table crm_brand enable row level security;

-- Anyone can read it — logged in or not. This is what makes the
-- logo show up on the login screen before anyone has signed in.
drop policy if exists brand_read_public on crm_brand;
create policy brand_read_public on crm_brand for select to anon, authenticated using (true);

-- Only signed-in seats can change it.
drop policy if exists brand_write_auth on crm_brand;
create policy brand_write_auth on crm_brand for insert to authenticated with check (true);
drop policy if exists brand_update_auth on crm_brand;
create policy brand_update_auth on crm_brand for update to authenticated using (true) with check (true);
