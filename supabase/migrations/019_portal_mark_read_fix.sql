-- ============================================================
-- 019 — fix 018's mark-read function: it had the role/column pairing
-- backwards. The customer's "open thread, mark the other side read"
-- action must flip read_by_customer (i.e. "the customer has now read
-- this") on messages the TEAM authored (by_role = 'team') -- 018's
-- portal_mark_team_msgs_read did the opposite (flipped read_by_team on
-- by_role='team' rows, which is meaningless: a message's own author
-- doesn't need to be marked as having read themselves). Caught before
-- the client was wired up to call it, so no bad data was ever written
-- by this function; replacing it outright rather than leaving the
-- wrong one in place.
-- ============================================================

drop function if exists portal_mark_team_msgs_read(text);

create or replace function portal_mark_customer_read(p_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update crm_portal_msgs
     set read_by_customer = true
   where token = p_token
     and by_role = 'team'
     and read_by_customer = false
     and exists (select 1 from crm_portal p where p.token = p_token and p.revoked = false);
end;
$$;
revoke all on function portal_mark_customer_read(text) from public;
grant execute on function portal_mark_customer_read(text) to anon, authenticated;
