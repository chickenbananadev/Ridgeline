-- ============================================================
-- 030 — Narrow is_tenant_locked() to match a real product decision:
-- lock the app after a subscription is genuinely canceled, never on
-- the first hiccup.
--
-- Until now nothing in the app actually read is_tenant_locked() at
-- all — a canceled or past_due tenant kept full, unrestricted access
-- forever, the ONLY visible trace being a colored status chip on the
-- admin's own Team & seats screen. ridgeline.jsx now gates the whole
-- app behind this function's result, which means its exact definition
-- has gone from cosmetic to load-bearing, and the definition inherited
-- from migration 026 is too aggressive for that job:
--
--   select t.status = 'canceled'
--      or (t.status = 'trialing' and t.trial_ends_at is not null and t.trial_ends_at < now())
--      or (t.status = 'past_due')
--
-- Two of those three clauses would lock someone out over a timing
-- race or a single retry-able hiccup, not a real, resolved
-- cancellation:
--
--   * `past_due` fires the moment ONE card charge attempt fails —
--     Stripe's own Smart Retries schedule keeps trying for roughly
--     two to three weeks afterward before it gives up. Locking on the
--     first failure would cut off a paying customer mid-job over a
--     bank hiccup that often resolves on its own by the next retry.
--   * `trialing AND trial_ends_at < now()` is a race against
--     stripe-webhook's own delivery: the trial clock running out is
--     not the same moment Stripe actually attempts (and confirms) the
--     conversion charge. Locking on the clock alone could cut off
--     someone whose card was about to be charged successfully within
--     seconds, which is exactly backwards for "make sure it starts
--     charging after the trial."
--
-- `status = 'canceled'` alone already IS the right grace period, with
-- no extra scheduling logic needed: Stripe does not set a
-- subscription's status to canceled the instant someone clicks
-- cancel — cancel_at_period_end (the recommended Billing Portal
-- setting, see DEPLOY.md §2) keeps status at 'active'/'trialing'
-- until the current period genuinely ends, and a failed charge only
-- ever resolves to 'canceled'/'unpaid' after Stripe's retry schedule
-- is exhausted. stripe-webhook already collapses 'unpaid' into
-- 'canceled' in tenants.status, so this one clause covers both.
--
-- Idempotent. Safe to re-run.
-- ============================================================

create or replace function is_tenant_locked(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select t.status = 'canceled'
     from tenants t where t.id = p_tenant_id and t.id = current_tenant_id()),
    false
  );
$$;
