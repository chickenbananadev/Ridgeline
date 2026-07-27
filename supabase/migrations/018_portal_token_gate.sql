-- ============================================================
-- 018 — client portal: close the anon-enumerable read
--
-- `portal_public_read` on crm_portal was `using (revoked = false)`
-- for both anon and authenticated, with no correlation to the token
-- the caller actually holds. RLS filters which ROWS satisfy a
-- condition; it does not know or care what the caller's query asked
-- for. So while the app's own client code always adds
-- `.eq("token", token)`, that was a courtesy, not a boundary — anyone
-- holding the public anon key (which ships in every browser bundle)
-- could call the REST endpoint directly with no token filter at all
-- and get back every non-revoked portal row for every tenant: every
-- homeowner's name, address, and job data.
--
-- The same shape of bug was hiding in `pmsg_update_customer`: it
-- checked that the ROW being updated had a live, non-revoked token,
-- but never that the caller supplied that specific token. Since every
-- customer's portal is (by design) live and non-revoked while the job
-- is active, that check passed for ANY tenant's message rows — an
-- anonymous caller could mark any customer's messages read/unread
-- across the whole database, not just their own thread.
--
-- Fix, in both places: move the token check into a SECURITY DEFINER
-- function that takes the token as an explicit argument and does its
-- own exact-match lookup. The only rows ever reachable are the ones
-- matching the token the caller actually passes in — table-level RLS
-- is no longer relied on to enforce that boundary for anon. Staff
-- viewing the same thread from inside a job stay on the existing
-- tenant-scoped table policies; only the anonymous customer path
-- moves to these functions.
-- ============================================================

drop policy if exists portal_public_read on crm_portal;

-- Replaces: db.from("crm_portal").select("data, revoked").eq("token", token)
create or replace function portal_get_data(p_token text)
returns table (data jsonb, revoked boolean)
language sql
security definer
set search_path = public
stable
as $$
  select p.data, p.revoked
  from crm_portal p
  where p.token = p_token
  limit 1;
$$;
revoke all on function portal_get_data(text) from public;
grant execute on function portal_get_data(text) to anon, authenticated;

-- Replaces the customer-role branch of:
-- db.from("crm_portal_msgs").select("*").eq("token", token)...
create or replace function portal_get_messages(p_token text)
returns setof crm_portal_msgs
language sql
security definer
set search_path = public
stable
as $$
  select m.*
  from crm_portal_msgs m
  where m.token = p_token
    and exists (select 1 from crm_portal p where p.token = p_token and p.revoked = false)
  order by m.at asc
  limit 200;
$$;
revoke all on function portal_get_messages(text) from public;
grant execute on function portal_get_messages(text) to anon, authenticated;

-- Replaces the customer-role branch of the "mark the other side's
-- messages read" update. Only ever touches rows under p_token, and
-- only ever flips read_by_team (the customer marking the team's
-- messages as read) — a customer has no legitimate reason to flip
-- read_by_customer on their own thread from this path.
create or replace function portal_mark_team_msgs_read(p_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update crm_portal_msgs
     set read_by_team = true
   where token = p_token
     and by_role = 'team'
     and read_by_team = false
     and exists (select 1 from crm_portal p where p.token = p_token and p.revoked = false);
end;
$$;
revoke all on function portal_mark_team_msgs_read(text) from public;
grant execute on function portal_mark_team_msgs_read(text) to anon, authenticated;

-- The customer mark-read path now goes through the function above,
-- which is the only thing that should ever flip read_by_team for an
-- anonymous caller. Nothing else used this policy: customer inserts
-- go through pmsg_insert_customer (untouched — it already validates
-- the new row's own token against a live portal, which is safe
-- because INSERT can't be used to enumerate existing data), and staff
-- reads/updates go through crm_portal_msgs_tenant_rw (untouched).
drop policy if exists pmsg_update_customer on crm_portal_msgs;
