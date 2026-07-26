-- ============================================================
-- 015 — Multi-tenancy
--
-- Turns a single-company app into one that can host many.
-- Every table gains a tenant_id. Every policy is rewritten to
-- scope by the signed-in user's tenant. A trigger stamps
-- tenant_id on insert so ~18,000 lines of app code did not have
-- to change: the queries stay the same, the database filters.
--
-- Existing Supreme Building Group data is backfilled into one
-- tenant and marked internal so it is never billed.
--
-- Idempotent. Safe to re-run.
-- ============================================================

-- ---------- Tenants ----------
create table if not exists tenants (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  created_at             timestamptz not null default now(),
  created_by             uuid references auth.users(id),

  -- Billing. 'internal' never bills and never expires.
  status                 text not null default 'trialing',
    -- trialing | active | past_due | canceled | internal
  trial_ends_at          timestamptz,
  seats_paid             int  not null default 0,
  stripe_customer_id     text,
  stripe_subscription_id text
);

alter table tenants enable row level security;

-- ---------- tenant_id on profiles ----------
alter table profiles add column if not exists tenant_id uuid references tenants(id);
create index if not exists profiles_tenant_idx on profiles(tenant_id);

-- ---------- tenant_id on every data table ----------
do $$
declare t text;
begin
  foreach t in array array[
    'crm_org','crm_jobs','crm_appointments','crm_financials','crm_activity',
    'crm_chat','crm_brand','crm_portal','crm_portal_msgs','crm_portal_requests',
    'crm_signatures','crm_user_integrations'
  ] loop
    if to_regclass(t) is not null then
      execute format('alter table %I add column if not exists tenant_id uuid references tenants(id)', t);
      execute format('create index if not exists %I on %I(tenant_id)', t || '_tenant_idx', t);
    end if;
  end loop;
end $$;

-- ---------- Backfill: one tenant for existing data ----------
-- Fixed UUID so re-running never creates a second Supreme.
insert into tenants (id, name, status, seats_paid)
values ('00000000-0000-0000-0000-000000000001', 'Supreme Building Group', 'internal', 0)
on conflict (id) do nothing;

update profiles set tenant_id = '00000000-0000-0000-0000-000000000001' where tenant_id is null;

do $$
declare t text;
begin
  foreach t in array array[
    'crm_org','crm_jobs','crm_appointments','crm_financials','crm_activity',
    'crm_chat','crm_brand','crm_portal','crm_portal_msgs','crm_portal_requests',
    'crm_signatures','crm_user_integrations'
  ] loop
    if to_regclass(t) is not null then
      execute format(
        'update %I set tenant_id = ''00000000-0000-0000-0000-000000000001'' where tenant_id is null', t);
    end if;
  end loop;
end $$;

-- ---------- Who am I ----------
-- STABLE so Postgres caches it per statement instead of
-- re-querying profiles for every row scanned.
create or replace function current_tenant_id()
returns uuid
language sql stable security definer set search_path = public
as $$ select tenant_id from profiles where id = auth.uid() $$;

-- ---------- Stamp tenant_id on insert ----------
create or replace function set_tenant_id()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.tenant_id is null then
    new.tenant_id := current_tenant_id();
  end if;
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array[
    'crm_org','crm_jobs','crm_appointments','crm_financials','crm_activity',
    'crm_chat','crm_brand','crm_portal','crm_portal_msgs','crm_portal_requests',
    'crm_signatures','crm_user_integrations'
  ] loop
    if to_regclass(t) is not null then
      execute format('drop trigger if exists stamp_tenant on %I', t);
      execute format(
        'create trigger stamp_tenant before insert on %I
           for each row execute function set_tenant_id()', t);
    end if;
  end loop;
end $$;

-- ---------- Tenant policies ----------
drop policy if exists tenant_read on tenants;
create policy tenant_read on tenants for select to authenticated
  using (id = current_tenant_id());

-- Only an admin can change their own tenant row. Billing columns
-- are written by the Stripe webhook, which uses the service key
-- and bypasses RLS entirely.
drop policy if exists tenant_update on tenants;
create policy tenant_update on tenants for update to authenticated
  using (id = current_tenant_id() and exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (id = current_tenant_id());

-- ---------- Rewrite every data policy to scope by tenant ----------
-- These replace the old `using (true)` policies, which let any
-- signed-in user read every row in the database.

-- crm_org
drop policy if exists org_rw on crm_org;
create policy org_rw on crm_org for all to authenticated
  using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id());

-- crm_jobs
drop policy if exists jobs_rw on crm_jobs;
create policy jobs_rw on crm_jobs for all to authenticated
  using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id());

-- crm_appointments
drop policy if exists appts_rw on crm_appointments;
create policy appts_rw on crm_appointments for all to authenticated
  using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id());

-- crm_financials — tenant scope AND the existing no-crew rule.
drop policy if exists fin_rw on crm_financials;
create policy fin_rw on crm_financials for all to authenticated
  using (tenant_id = current_tenant_id() and exists (
    select 1 from profiles p where p.id = auth.uid() and p.role is distinct from 'crew'))
  with check (tenant_id = current_tenant_id() and exists (
    select 1 from profiles p where p.id = auth.uid() and p.role is distinct from 'crew'));

-- crm_activity
drop policy if exists activity_read on crm_activity;
create policy activity_read on crm_activity for select to authenticated
  using (tenant_id = current_tenant_id());
drop policy if exists activity_insert on crm_activity;
create policy activity_insert on crm_activity for insert to authenticated
  with check (tenant_id = current_tenant_id());

-- crm_chat
drop policy if exists chat_read on crm_chat;
create policy chat_read on crm_chat for select to authenticated
  using (tenant_id = current_tenant_id());
drop policy if exists chat_insert on crm_chat;
create policy chat_insert on crm_chat for insert to authenticated
  with check (tenant_id = current_tenant_id());

-- crm_brand — staff writes are tenant-scoped. The public read
-- stays open because the portal renders branding before anyone
-- signs in; brand rows hold no customer data.
drop policy if exists brand_write_auth on crm_brand;
create policy brand_write_auth on crm_brand for insert to authenticated
  with check (tenant_id = current_tenant_id());
drop policy if exists brand_update_auth on crm_brand;
create policy brand_update_auth on crm_brand for update to authenticated
  using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id());

-- crm_portal — staff paths scoped. The anon read path is left as
-- it was on purpose: narrowing it requires moving portal reads to
-- a token-checking function, which is its own change.
drop policy if exists portal_staff_insert on crm_portal;
create policy portal_staff_insert on crm_portal for insert to authenticated
  with check (tenant_id = current_tenant_id());
drop policy if exists portal_staff_update on crm_portal;
create policy portal_staff_update on crm_portal for update to authenticated
  using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id());
drop policy if exists portal_staff_delete on crm_portal;
create policy portal_staff_delete on crm_portal for delete to authenticated
  using (tenant_id = current_tenant_id());

-- Remaining tables: scope whatever authenticated policies exist.
do $$
declare r record;
begin
  for r in
    select tablename, policyname from pg_policies
    where schemaname = 'public'
      and tablename in ('crm_portal_msgs','crm_portal_requests','crm_signatures','crm_user_integrations')
      and 'authenticated' = any(roles)
  loop
    execute format('drop policy if exists %I on %I', r.policyname, r.tablename);
  end loop;
end $$;

do $$
declare t text;
begin
  foreach t in array array['crm_portal_msgs','crm_portal_requests','crm_signatures','crm_user_integrations'] loop
    if to_regclass(t) is not null then
      execute format(
        'create policy %I on %I for all to authenticated
           using (tenant_id = current_tenant_id())
           with check (tenant_id = current_tenant_id())', t || '_tenant_rw', t);
    end if;
  end loop;
end $$;

-- ---------- Sign-up: create a tenant and become its admin ----------
-- Runs as definer because a brand-new user has no tenant yet and
-- therefore cannot pass any of the policies above.
create or replace function create_tenant(org_name text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  -- One tenant per user. Prevents a refresh spawning duplicates.
  if (select tenant_id from profiles where id = auth.uid()) is not null then
    raise exception 'This account already belongs to a company';
  end if;

  insert into tenants (name, status, trial_ends_at, created_by, seats_paid)
  values (org_name, 'trialing', now() + interval '7 days', auth.uid(), 1)
  returning id into new_id;

  update profiles
     set tenant_id = new_id, role = 'admin'::user_role
   where id = auth.uid();

  return new_id;
end $$;

grant execute on function create_tenant(text) to authenticated;
grant execute on function current_tenant_id() to authenticated;

-- ---------- Trial / subscription status for the app ----------
create or replace function my_tenant()
returns table (
  id uuid, name text, status text, trial_ends_at timestamptz,
  days_left int, seats_paid int, locked boolean
)
language sql stable security definer set search_path = public
as $$
  select t.id, t.name, t.status, t.trial_ends_at,
         greatest(0, extract(day from (t.trial_ends_at - now()))::int) as days_left,
         t.seats_paid,
         (t.status = 'canceled'
          or (t.status = 'trialing' and t.trial_ends_at is not null and t.trial_ends_at < now()))
           as locked
    from tenants t
   where t.id = current_tenant_id();
$$;

grant execute on function my_tenant() to authenticated;
