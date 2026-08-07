-- ============================================================
-- 027 — new pricing: seats_paid starts at 0, not 1
--
-- create_tenant() hardcoded seats_paid to 1 for every brand-new
-- signup, a leftover from the old per-seat-priced model. Under the
-- new pricing ($119.99/mo for 10 seats, one optional +10-seat add-on
-- for $59.99/mo — see PRODUCT in ridgeline.jsx), a fresh signup has
-- bought no add-on yet; seats_paid tracks only whether that add-on
-- block has been purchased (0 = no, 10 = yes — see stripe-webhook,
-- which is what actually flips this to 10 once the add-on is bought
-- through the Stripe Billing Portal).
--
-- Same signature as the version in 021_stripe_signup.sql — only the
-- hardcoded seats_paid literal changes.
--
-- Idempotent. Safe to re-run.
-- ============================================================

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
  values (org_name, 'trialing', now() + interval '7 days', auth.uid(), 0,
          p_stripe_customer_id, p_stripe_subscription_id, p_plan)
  returning id into new_id;

  update profiles
     set tenant_id = new_id, role = 'admin'::user_role
   where id = auth.uid();

  return new_id;
end $$;

grant execute on function create_tenant(text, text, text, text) to authenticated;
