-- ============================================================
-- 034 — un-break every customer (anon) portal write, dead since 018
--
-- Migration 018 closed a real enumeration hole by dropping
-- crm_portal's anon SELECT policy and moving customer READS behind
-- token-argument SECURITY DEFINER RPCs (portal_get_messages, 018;
-- portal_mark_customer_read, 019). What it missed: two anon INSERT
-- policies written back in 006/008 validate their token with a raw
--   exists (select 1 from crm_portal p where p.token = ...)
-- subquery. That subquery runs under the CALLER's RLS — and once 018
-- removed anon's ability to see any crm_portal row, it began
-- returning zero rows for every anonymous visitor, making both
-- policies permanently false. Confirmed by reproduction against
-- production: an insert with a real, valid, unrevoked token is
-- rejected with an RLS violation. Every homeowner-side write — the
-- portal chat thread, review feedback, quote/change requests,
-- contact-update requests — has silently failed since 018 shipped.
-- Migration 025 fixed this exact defect for crm_signatures (its own
-- commit message describes the mechanism) but the same cure was
-- never applied here.
--
-- Also fixed in the same pass, discovered while reproducing:
--  * tenant stamping — the stamp_tenant trigger derives tenant_id
--    from current_tenant_id(), which is NULL for anon, so even a
--    successful customer insert would land with tenant_id NULL and
--    be invisible to the team's tenant-scoped reads. The trigger
--    for these two tables now falls back to the portal row's own
--    tenant_id, resolved by token.
--  * customer reads of crm_portal_requests — the request center and
--    contact-card "pending" check do direct selects, but anon has
--    had no SELECT policy on this table since 015's cleanup. A plain
--    anon SELECT policy would reopen 018's enumeration hole (any
--    row with a currently-valid token would be readable without
--    knowing the token), so reads go behind a token-argument RPC
--    instead, exactly like portal_get_messages.
--
-- Verified against production before this file was committed: with
-- these policies, an anon insert with a valid token succeeds and the
-- row carries the right tenant_id; an anon insert with an invalid or
-- revoked token is still rejected; a bare anon SELECT still returns
-- zero rows.
--
-- Idempotent. Safe to re-run.
-- ============================================================

-- ---------- tenant stamping that works for anonymous portal writes ----------
create or replace function set_portal_tenant_id() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.tenant_id is null then
    new.tenant_id := current_tenant_id();
  end if;
  if new.tenant_id is null and new.token is not null then
    select p.tenant_id into new.tenant_id from crm_portal p where p.token = new.token;
  end if;
  return new;
end $$;

drop trigger if exists stamp_tenant on crm_portal_msgs;
create trigger stamp_tenant before insert on crm_portal_msgs
  for each row execute function set_portal_tenant_id();

drop trigger if exists stamp_tenant on crm_portal_requests;
create trigger stamp_tenant before insert on crm_portal_requests
  for each row execute function set_portal_tenant_id();

-- ---------- customer inserts, validated the way 025 already does it ----------
-- portal_token_valid() (025) is SECURITY DEFINER, so it can see
-- crm_portal regardless of the caller's RLS — the whole point.
drop policy if exists pmsg_insert_customer on crm_portal_msgs;
create policy pmsg_insert_customer on crm_portal_msgs for insert to anon
  with check (by_role = 'customer' and portal_token_valid(token, job_id));

drop policy if exists portal_requests_customer_insert on crm_portal_requests;
create policy portal_requests_customer_insert on crm_portal_requests for insert to anon
  with check (status = 'New' and portal_token_valid(token, job_id));

-- ---------- customer reads of their own requests, without enumeration ----------
-- Mirrors portal_get_messages (018): the only rows reachable are the
-- ones matching the token the caller actually presents.
create or replace function portal_get_requests(p_token text)
returns setof crm_portal_requests
language sql stable security definer set search_path = public as $$
  select r.* from crm_portal_requests r
  where r.token = p_token
    and exists (select 1 from crm_portal p where p.token = p_token and p.revoked = false)
  order by r.created_at desc;
$$;
grant execute on function portal_get_requests(text) to anon, authenticated;

-- ---------- backfill: repair rows that landed tenant-less before this fix ----------
update crm_portal_msgs m set tenant_id = p.tenant_id
  from crm_portal p where p.token = m.token and m.tenant_id is null;
update crm_portal_requests r set tenant_id = p.tenant_id
  from crm_portal p where p.token = r.token and r.tenant_id is null;
