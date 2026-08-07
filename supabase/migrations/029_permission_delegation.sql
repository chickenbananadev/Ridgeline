-- ============================================================
-- 029 — delegated per-capability authority
--
-- Today, canEditStructure/canManageSeats/AdminControls's own feature-
-- toggle gate are all hard role === 'admin' checks — the owner wants
-- that to stay the default, but be delegable: a specific trusted
-- non-admin person (e.g. an office manager) can be handed one or more
-- of these capabilities individually, without becoming a full admin
-- (which would also hand them seat/branding/structure-editing power
-- they weren't necessarily meant to have all at once).
--
-- Adds one flat jsonb map, `permission_overrides`, keyed by capability
-- name (currently: editStructure, manageSeats, manageFeatures — see
-- ridgeline.jsx's hasCapability()). An admin still passes every check
-- unconditionally; a grant here only matters for someone who isn't
-- one. Guarded by the same trigger that already protects `role` and
-- `tenant_id`, so only an admin can grant or revoke a capability —
-- never the person receiving it, and never a plain profile self-edit.
--
-- Idempotent. Safe to re-run.
-- ============================================================

alter table profiles add column if not exists permission_overrides jsonb not null default '{}'::jsonb;

create or replace function guard_profile_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.tenant_id is not null and new.tenant_id is distinct from old.tenant_id then
    raise exception 'tenant_id cannot be changed once assigned';
  end if;

  if new.role is distinct from old.role then
    if old.tenant_id is null and new.tenant_id is not null then
      -- first-time signup pairing tenant assignment with becoming admin: allowed
      null;
    elsif auth.uid() is not null and not is_admin() then
      -- auth.uid() is null for service-role callers (the invite Edge
      -- Function), which already checked "caller is admin" themselves
      -- before invoking this update, so those are left alone.
      raise exception 'only an admin can change a role';
    end if;
  end if;

  if new.permission_overrides is distinct from old.permission_overrides then
    if auth.uid() is not null and not is_admin() then
      raise exception 'only an admin can grant or revoke a delegated capability';
    end if;
  end if;

  return new;
end;
$$;

-- drop/create rather than replace-in-place isn't required here (same
-- signature, same trigger name already exists from migration 020) —
-- kept as create or replace for consistency with that migration's own
-- style; the trigger binding itself doesn't need to be re-created.
