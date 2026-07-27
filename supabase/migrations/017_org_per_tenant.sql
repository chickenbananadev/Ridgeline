-- ============================================================
-- 017 — crm_org: per-tenant, not a shared singleton
--
-- Same flaw as crm_brand (016), different table: crm_org holds
-- stages, price list, crews, lead sources, message templates,
-- vendors, feature toggles, jurisdiction overrides — the entire
-- org-settings baseline. It was hardcoded to a single row, id=1,
-- read and written by every tenant regardless of who they were.
--
-- Practical effect before this migration: a brand-new company's
-- very first login tries to seed its org-settings baseline via
-- upsert({id: 1, ...}). Since id=1 already belongs to Supreme's
-- tenant, that upsert becomes an UPDATE against Supreme's row,
-- which 015's tenant-scoped RLS correctly blocks — so the new
-- tenant's settings never save, and depending on what state the
-- app happened to have in memory, other tenants could see
-- something that isn't theirs. This is almost certainly the
-- mechanism behind "a new signup could see Supreme's data."
--
-- This migration adds the constraint the app now upserts against
-- (tenant_id, via ON CONFLICT (tenant_id)) instead of id=1.
--
-- Idempotent. Safe to re-run.
-- ============================================================

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'crm_org_tenant_id_key'
  ) then
    alter table crm_org add constraint crm_org_tenant_id_key unique (tenant_id);
  end if;
end $$;
