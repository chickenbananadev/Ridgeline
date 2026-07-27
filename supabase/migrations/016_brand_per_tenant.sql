-- ============================================================
-- 016 — crm_brand: per-tenant, not a shared singleton
--
-- Since 003, crm_brand was a true singleton: one row (id=1),
-- read by anyone (anon included, so the client portal and the
-- old single-tenant login screen could show a logo pre-auth),
-- written by whichever admin last touched Company Branding.
--
-- 015 added tenant_id and scoped writes by tenant, but nothing
-- stopped a second company from colliding on the same id=1 row,
-- and the app was still hardcoded to fetch/save id=1 for every
-- tenant. In practice: every visitor, from every company, saw
-- Supreme's logo and slogan before signing in, and any other
-- tenant's Company Branding save would either silently fail
-- (blocked by 015's tenant-scoped RLS) or, worse, succeed against
-- the wrong row if RLS allowed it.
--
-- This migration adds the constraint the app now upserts against
-- (tenant_id, via ON CONFLICT (tenant_id)) instead of id=1. The
-- corresponding app fix stops fetching any brand at all before a
-- tenant is known — the sign-in screen shows RoofStride's own
-- brand instead of any customer's, which needed no migration.
--
-- Idempotent. Safe to re-run.
-- ============================================================

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'crm_brand_tenant_id_key'
  ) then
    alter table crm_brand add constraint crm_brand_tenant_id_key unique (tenant_id);
  end if;
end $$;
