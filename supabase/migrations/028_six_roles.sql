-- ============================================================
-- 028 — Six roles: Secretary and Sales manager
--
-- ridgeline.jsx's ROLES grew from 4 to 6 (admin, secretary, manager,
-- sales_manager, rep, crew), and canSeeMoney() now excludes secretary
-- alongside crew. The user_role enum and the crm_financials RLS
-- policy both need to catch up, or the database stays a wider door
-- than the UI shows — the exact class of bug fixed for crew's own
-- money leak in build 96 and for tenant isolation in migration 026.
--
-- Idempotent. Safe to re-run (ALTER TYPE ... ADD VALUE IF NOT EXISTS
-- is itself idempotent; the policy replace is too).
-- ============================================================

-- ---------- New enum values ----------
-- Each ALTER TYPE ... ADD VALUE must be its own statement, not
-- combined in the same transaction as anything that USES the new
-- value (a hard Postgres restriction) — kept as the only two
-- statements before the policy change below, which is safe since it
-- only references 'crew' and 'secretary' as text literals compared
-- against the role column, not as enum-typed values being inserted.
alter type user_role add value if not exists 'secretary';
alter type user_role add value if not exists 'sales_manager';

-- ---------- crm_financials: secretary is blocked, same as crew ----------
-- Matches the original policy's `is distinct from` style rather than
-- `not in`, which stays correct if role were ever NULL (it isn't
-- today — profiles.role is NOT NULL — but this is the same defensive
-- style the rest of this policy already uses).
drop policy if exists fin_rw on crm_financials;
create policy fin_rw on crm_financials for all to authenticated
  using (tenant_id = current_tenant_id() and exists (
    select 1 from profiles p where p.id = auth.uid()
      and p.role is distinct from 'crew' and p.role is distinct from 'secretary'))
  with check (tenant_id = current_tenant_id() and exists (
    select 1 from profiles p where p.id = auth.uid()
      and p.role is distinct from 'crew' and p.role is distinct from 'secretary'));
