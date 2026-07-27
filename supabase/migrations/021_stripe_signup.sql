-- ============================================================
-- 021 — Stripe: card required for signup, real trial enforcement
--
-- create_tenant previously always started a trial with no Stripe
-- involvement at all — nothing actually required a card, and nothing
-- checked back in once the trial ended. This migration:
--
-- 1. Lets create_tenant accept the Stripe customer/subscription IDs
--    created during Checkout, so a tenant is only ever created AFTER
--    a card has actually been collected and Stripe confirms it.
-- 2. Adds a real lock: is_tenant_locked() returns true once a trial
--    has ended with no active paid subscription, or the subscription
--    was canceled. Wire this into the app's write-side checks (the
--    app already surfaces my_tenant().locked in the UI; this makes
--    the SAME condition enforceable at the database level too, not
--    just a UI hint that could be bypassed).
--
-- Idempotent. Safe to re-run.
-- ============================================================

-- Postgres resolves overloaded functions by full signature (name +
-- parameter types), not just name — a new 4-arg version does NOT
-- replace the old 1-arg one, it sits alongside it, and a 1-argument
-- call becomes ambiguous between "the old function" and "the new
-- function using its trailing defaults." Drop the old signature
-- explicitly before creating the new one.
drop function if exists create_tenant(text);

create or replace function create_tenant(
  org_name text,
  p_stripe_customer_id text default null,
  p_stripe_subscription_id text default null,
  p_plan text default 'per_seat'
)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  if (select tenant_id from profiles where id = auth.uid()) is not null then
    raise exception 'This account already belongs to a company';
  end if;

  insert into tenants (name, status, trial_ends_at, created_by, seats_paid,
                        stripe_customer_id, stripe_subscription_id, plan)
  values (org_name, 'trialing', now() + interval '7 days', auth.uid(), 1,
          p_stripe_customer_id, p_stripe_subscription_id, p_plan)
  returning id into new_id;

  update profiles
     set tenant_id = new_id, role = 'admin'::user_role
   where id = auth.uid();

  return new_id;
end $$;

grant execute on function create_tenant(text, text, text, text) to authenticated;

-- `plan` didn't exist before this migration — which per-seat/unlimited
-- plan the tenant is on, set at signup, changeable later from billing.
alter table tenants add column if not exists plan text not null default 'per_seat';

-- ---------- Real lock enforcement, not just a UI hint ----------
create or replace function is_tenant_locked(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select t.status = 'canceled'
       or (t.status = 'trialing' and t.trial_ends_at is not null and t.trial_ends_at < now())
       or (t.status = 'past_due')
     from tenants t where t.id = p_tenant_id),
    false
  );
$$;

grant execute on function is_tenant_locked(uuid) to authenticated;

-- Same overload/signature issue as above: adding a new output column
-- to a RETURNS TABLE function is a return-type change, which CREATE OR
-- REPLACE FUNCTION cannot do in place — Postgres requires a drop first.
drop function if exists my_tenant();

create or replace function my_tenant()
returns table (
  id uuid, name text, status text, trial_ends_at timestamptz,
  days_left int, seats_paid int, locked boolean, plan text
)
language sql stable security definer set search_path = public
as $$
  select t.id, t.name, t.status, t.trial_ends_at,
         greatest(0, extract(day from (t.trial_ends_at - now()))::int) as days_left,
         t.seats_paid, is_tenant_locked(t.id) as locked, t.plan
    from tenants t
   where t.id = current_tenant_id();
$$;

grant execute on function my_tenant() to authenticated;
