-- ============================================================
-- 026 — Tenant isolation hardening
--
-- "No company should ever see another company's info" was assumed
-- true after migration 015 tenant-scoped every crm_* table, but a
-- direct audit of every RLS policy found 5 real gaps still live:
--
-- 1. crm_brand SELECT was deliberately left `using(true)` for BOTH
--    anon and authenticated (015's own comment says so) — any signed-
--    in user at ANY tenant can read every other tenant's logo,
--    colors, company name, slogan, and contact info. The app's fetch
--    logic already scopes correctly; this closes the same hole at
--    the database level, which a direct REST call bypasses entirely.
--    Dropping anon read entirely is safe: nothing in the app queries
--    crm_brand directly before authentication — the customer portal
--    reads branding from its own frozen snapshot (buildPortalSnapshot),
--    and the pre-auth boot/login screen no longer depends on any
--    tenant's brand at all (see the loading-screen fix landing
--    alongside this).
--
-- 2. crm_chat's UPDATE/DELETE policies (added by migrations 011-013)
--    were never tenant-scoped — 015's rewrite pass only touched
--    crm_chat's SELECT/INSERT, so reactions/edit/delete stayed
--    `using(true)`: any authenticated user from ANY tenant could
--    modify or delete any company's chat messages.
--
-- 3. crm_user_integrations regressed from per-user isolation (built
--    in migration 010 specifically so one rep can't read another
--    rep's CompanyCam token) to per-tenant-only isolation — 015's
--    blanket "remaining tables" loop replaced the original 4
--    auth.uid()=user_id policies with one tenant-scoped ALL policy.
--    Restoring per-user scoping here (015 already gave this table a
--    tenant_id column too; kept as a defense-in-depth check even
--    though user_id alone already can't cross tenants).
--
-- 4. crm_signatures's no-delete guarantee (migration 014, built for
--    audit-trail integrity: signatures are voided, never deleted) was
--    silently removed by the same 015 loop, which replaced it with a
--    permissive tenant-scoped ALL policy that allows DELETE.
--
-- 5. The job-files Storage bucket (migration 024) has zero tenant
--    scoping — bucket is public, and all 4 object policies check only
--    bucket_id. Read stays public here (object keys are unguessable
--    UUID+timestamp, and tightening read would break already-issued
--    URLs embedded in already-sent documents/emails/portal snapshots
--    — a bigger, separate signed-URL migration, not done here).
--    Write/update/delete are scoped to a tenant-id path prefix new
--    uploads now carry (see uploadJobFile in ridgeline.jsx) — nothing
--    in the app ever calls storage update/delete today, so this adds
--    a real guard with zero behavior change for existing uploads.
--
-- Also: is_tenant_locked(tenant_id) took an arbitrary tenant id with
-- no ownership check — any signed-in user could probe whether some
-- OTHER company's subscription is locked/past-due/canceled. Minor
-- billing-status enumeration, not a data leak, closed here too.
--
-- Idempotent. Safe to re-run.
-- ============================================================

-- ---------- 1. crm_brand: close the cross-tenant read ----------
drop policy if exists brand_read_public on crm_brand;
create policy brand_read_public on crm_brand for select to authenticated
  using (tenant_id = current_tenant_id());

-- ---------- 2. crm_chat: tenant-scope the write policies ----------
drop policy if exists chat_update_reactions on crm_chat;
create policy chat_update_reactions on crm_chat for update to authenticated
  using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id());

drop policy if exists chat_update_own on crm_chat;
create policy chat_update_own on crm_chat for update to authenticated
  using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id());

drop policy if exists chat_delete on crm_chat;
create policy chat_delete on crm_chat for delete to authenticated
  using (tenant_id = current_tenant_id());

-- ---------- 3. crm_user_integrations: restore per-user scoping ----------
drop policy if exists crm_user_integrations_tenant_rw on crm_user_integrations;

create policy user_integrations_own_select on crm_user_integrations
  for select to authenticated using (auth.uid() = user_id);
create policy user_integrations_own_insert on crm_user_integrations
  for insert to authenticated with check (auth.uid() = user_id);
create policy user_integrations_own_update on crm_user_integrations
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy user_integrations_own_delete on crm_user_integrations
  for delete to authenticated using (auth.uid() = user_id);

-- ---------- 4. crm_signatures: restore the no-delete guarantee ----------
drop policy if exists crm_signatures_tenant_rw on crm_signatures;

create policy sig_team_select on crm_signatures for select to authenticated
  using (tenant_id = current_tenant_id());
create policy sig_team_insert on crm_signatures for insert to authenticated
  with check (tenant_id = current_tenant_id());
create policy sig_team_update on crm_signatures for update to authenticated
  using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id());

drop policy if exists sig_no_delete on crm_signatures;
create policy sig_no_delete on crm_signatures for delete to authenticated
  using (false);

-- ---------- 5. job-files Storage bucket: NOT done here ----------
-- This section originally created tenant-prefixed write/update/delete
-- policies named job_files_authenticated_*, on the assumption that
-- migration 024 had created that bucket and those policies. Checking
-- the live database before applying showed that assumption is wrong:
--
--   * 024 was never applied. The job-photos and job-files buckets were
--     created by hand and are private (public = false), not the public
--     bucket 024 describes.
--   * The live storage.objects policies are the schema.sql-era
--     job_photos_read / job_photos_write / job_photos_delete, gated on
--     is_active_user() / can_see_money() across BOTH buckets, with no
--     tenant scoping.
--
-- Adding tenant-scoped policies alongside those would have achieved
-- nothing: Postgres ORs permissive policies together, so the existing
-- broad job_photos_write would still allow any active user to write
-- anywhere. Actually closing this requires dropping the broad policies,
-- which cannot be done safely until every client is on the
-- tenant-prefixed key format uploadJobFile now produces — a cached
-- older bundle would start failing uploads immediately.
--
-- Current exposure, stated plainly rather than papered over: both
-- buckets are private, so an object needs an authenticated, active
-- user AND knowledge of the exact object key (jobId/timestamp_name,
-- or tenantId/jobId/timestamp_name for new uploads). There is no
-- listing or enumeration path exposed by the app. But a user of one
-- tenant who obtains another tenant's key can read, overwrite or
-- delete that object. That is a real remaining gap, tracked separately
-- from this migration.

-- ---------- is_tenant_locked: stop cross-tenant billing-status probing ----------
create or replace function is_tenant_locked(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select t.status = 'canceled'
       or (t.status = 'trialing' and t.trial_ends_at is not null and t.trial_ends_at < now())
       or (t.status = 'past_due')
     from tenants t where t.id = p_tenant_id and t.id = current_tenant_id()),
    false
  );
$$;
