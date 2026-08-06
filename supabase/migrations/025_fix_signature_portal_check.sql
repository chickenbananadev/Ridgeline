-- ============================================================
-- 025 — fix customer signing, broken by 018's portal-token gate
--
-- 018 correctly closed crm_portal's direct anon SELECT to stop
-- enumeration, moving reads behind portal_get_data() — a SECURITY
-- DEFINER function that takes the token as an argument and does its
-- own exact-match lookup. That was the right fix for reads.
--
-- It missed a second consumer of the same table: 014's crm_signatures
-- policies (sig_insert_customer, sig_read_portal) validate a token by
-- running `exists (select 1 from crm_portal p where ...)` as a
-- subquery. That subquery is itself the anon role, and is therefore
-- still subject to crm_portal's own RLS — which, after 018, has no
-- policy granting anon any row at all. The EXISTS can only ever see
-- zero rows now, so it always evaluates to false: every customer
-- signature insert is rejected, and nothing already signed can be
-- read back, regardless of whether the token and job are genuinely
-- valid. This is why "Could not sign... row-level security policies"
-- fires for a customer signing an estimate, contract, or change order
-- from a real, unrevoked portal link — the document type is not the
-- variable, the shared check underneath all of them is.
--
-- Fix: the same move 018 already made for reads — a narrow SECURITY
-- DEFINER function that checks token/job validity and returns only a
-- boolean, not the row. No new data becomes visible to anon; the
-- token is still the only thing that unlocks anything, same as
-- portal_get_data() already established.
-- ============================================================

create or replace function portal_token_valid(p_token text, p_job_id text default null)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from crm_portal p
    where p.token = p_token
      and (p_job_id is null or p.job_id = p_job_id)
      and p.revoked = false
  );
$$;
revoke all on function portal_token_valid(text, text) from public;
grant execute on function portal_token_valid(text, text) to anon, authenticated;

drop policy if exists sig_insert_customer on crm_signatures;
create policy sig_insert_customer on crm_signatures for insert to anon
  with check (
    signer_role = 'customer'
    and consent = true
    and portal_token_valid(portal_token, job_id)
  );

drop policy if exists sig_read_portal on crm_signatures;
create policy sig_read_portal on crm_signatures for select to anon
  using (portal_token_valid(portal_token));
