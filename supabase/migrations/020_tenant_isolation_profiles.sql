-- ============================================================
-- 020 — close a cross-tenant hole in `profiles` and make the seat-
-- invite flow actually hand the new person a working account.
--
-- Two related problems, found while implementing the admin invite
-- flow (task: "an admin should be able to invite someone and that
-- should actually let them sign up"):
--
-- 1. profiles_read/profiles_admin_write (predating multi-tenancy,
--    migration 015 never touched `profiles`) were tenant-blind:
--      profiles_read:        is_active_user()
--      profiles_admin_write: is_admin()
--    Neither checks tenant_id. Any signed-in user at ANY company
--    could read every other company's team roster (name, email,
--    phone, role, commission rate), and any admin at ANY company
--    could update or deactivate any OTHER company's team members.
--    This is the same class of bug as the portal hole fixed in
--    018/019, just on a different table.
--
-- 2. New seats never got a tenant. handle_new_auth_user() (005)
--    inserts the profile row with no tenant_id at all, and neither
--    invite path (the invite-user Edge Function, nor the sign-in-
--    link fallback) ever set one. An invited teammate could sign in
--    but current_tenant_id() would return NULL for them, which
--    never matches any tenant-scoped row — every screen would look
--    empty. The invite "worked" (account created) but the person
--    could not actually use the product. Fixed in this migration by
--    letting handle_new_auth_user() read tenant_id out of the new
--    user's metadata when present; the Edge Function (redeployed
--    alongside this migration) now supplies it from the inviting
--    admin's own tenant_id.
--
-- Also adds a trigger so tenant_id, once set, can never be changed
-- by an ordinary UPDATE (self-service or admin-write) — only the
-- initial assignment (NULL -> a tenant) is allowed. Without this, a
-- user could rewrite their own tenant_id and current_tenant_id()
-- would follow them into someone else's company. Role changes are
-- similarly guarded: only an already-admin session (or the initial
-- signup moment that pairs tenant_id NULL->set with role->admin)
-- may change a profile's role, so a rep can't self-promote.
-- ============================================================

-- ---------- 1. Tenant-scope the profiles policies ----------
drop policy if exists profiles_read on profiles;
create policy profiles_read on profiles for select to authenticated
  using (is_active_user() and (tenant_id = current_tenant_id() or id = auth.uid()));

drop policy if exists profiles_admin_write on profiles;
create policy profiles_admin_write on profiles for all to authenticated
  using (is_admin() and tenant_id = current_tenant_id())
  with check (is_admin() and tenant_id = current_tenant_id());

-- profiles_self_update (id = auth.uid()) is left as-is — it is
-- already row-scoped to the caller's own profile. Column-level abuse
-- (self-promoting role, or hopping tenant_id) is blocked below.

-- ---------- 2. tenant_id: settable once, then immutable; role:
--    changeable only by an admin (or at the moment of first tenant
--    assignment, i.e. brand-new signup becoming their own admin) ----------
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

  return new;
end;
$$;

drop trigger if exists guard_profile_privileged on profiles;
create trigger guard_profile_privileged
  before update on profiles
  for each row execute function guard_profile_privileged_columns();

-- ---------- 3. Let the auto-profile trigger stamp tenant_id from
--    invite metadata, so a freshly invited seat lands inside the
--    inviting admin's company instead of in tenant limbo ----------
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, title, active, commission_rate, tenant_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'rep')::user_role,
    coalesce(new.raw_user_meta_data->>'title', 'Sales Rep'),
    true,
    coalesce((new.raw_user_meta_data->>'commission_rate')::numeric, 60),
    nullif(new.raw_user_meta_data->>'tenant_id', '')::uuid
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
