-- ============================================================
-- 035 — subcontractor crew portal
--
-- Crew access moves off logins entirely (owner decision: "the crew
-- is the subcontractor" — admin/reps are the company, subs get a
-- per-job link, not a paid seat). The portal reuses crm_portal's
-- whole token/snapshot/RPC machinery — same table, same
-- portal_get_data() read path, same anti-enumeration posture from
-- 018 — with one new discriminator column:
--
--   audience: 'customer' (default, every existing row) | 'crew'
--
-- The snapshot's own data carries the audience too, so the client
-- can render the crew surface off the same portal_get_data() call
-- the customer portal already uses.
--
-- Crew WRITES (owner decision: write parity — check off punch
-- items, upload photos, message the office) go through token-gated
-- SECURITY DEFINER RPCs, the same shape as every other portal
-- write fixed in 025/034 — never a raw table policy an anonymous
-- visitor could probe:
--
--   crew_portal_update_punch  — flips one punch item on the real
--     job AND mirrors it into the crew snapshot, so the crew's own
--     reload shows the change without waiting for the office app
--     to re-snapshot.
--   crew_portal_add_photo     — appends a downscaled inline photo
--     to the job's photo album (tagged with its crew-portal
--     source) and mirrors it into the snapshot. Size-capped and
--     content-type-checked server-side; inline data-URL storage is
--     the same fallback path uploadJobFile already uses, so no
--     Storage policy has to open up to anon.
--
-- Crew↔office messaging reuses crm_portal_msgs under the crew
-- token — the anon insert policy (034) widens from 'customer' to
-- ('customer','crew') so the two sides stay distinguishable in the
-- thread.
--
-- Idempotent. Safe to re-run.
-- ============================================================

alter table crm_portal add column if not exists audience text not null default 'customer';
do $$ begin
  alter table crm_portal add constraint crm_portal_audience_check check (audience in ('customer','crew'));
exception when duplicate_object then null; end $$;

-- ---------- crew messages in the portal thread ----------
-- 006's CHECK constraint also pins by_role to ('customer','team') —
-- both the constraint and the policy have to widen or the insert
-- still bounces (caught during live verification of this migration).
alter table crm_portal_msgs drop constraint if exists crm_portal_msgs_by_role_check;
alter table crm_portal_msgs add constraint crm_portal_msgs_by_role_check check (by_role in ('customer','team','crew'));

drop policy if exists pmsg_insert_customer on crm_portal_msgs;
create policy pmsg_insert_customer on crm_portal_msgs for insert to anon
  with check (by_role in ('customer','crew') and portal_token_valid(token, job_id));

-- ---------- check off a punch item ----------
create or replace function crew_portal_update_punch(p_token text, p_item_id text, p_done boolean, p_by text default null)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  v_job_id text;
  v_stamp text := to_char(now(), 'FMMon FMDD, FMHH12:MI AM');
begin
  select p.job_id into v_job_id from crm_portal p
    where p.token = p_token and p.revoked = false and p.audience = 'crew';
  if v_job_id is null then
    return false;
  end if;

  update crm_jobs j set data = jsonb_set(j.data, '{punch}', (
    select coalesce(jsonb_agg(
      case when elem->>'id' = p_item_id then elem || jsonb_build_object(
        'done', p_done,
        'doneAt', case when p_done then v_stamp else null end,
        'doneBy', case when p_done then coalesce(nullif(p_by, ''), 'Crew') else null end
      ) else elem end), '[]'::jsonb)
    from jsonb_array_elements(j.data->'punch') elem
  ), false)
  where j.id = v_job_id and jsonb_typeof(j.data->'punch') = 'array';

  update crm_portal p set data = jsonb_set(p.data, '{punch}', (
    select coalesce(jsonb_agg(
      case when elem->>'id' = p_item_id then elem || jsonb_build_object(
        'done', p_done,
        'doneAt', case when p_done then v_stamp else null end,
        'doneBy', case when p_done then coalesce(nullif(p_by, ''), 'Crew') else null end
      ) else elem end), '[]'::jsonb)
    from jsonb_array_elements(p.data->'punch') elem
  ), false)
  where p.token = p_token and jsonb_typeof(p.data->'punch') = 'array';

  return true;
end $$;
revoke all on function crew_portal_update_punch(text, text, boolean, text) from public;
grant execute on function crew_portal_update_punch(text, text, boolean, text) to anon, authenticated;

-- ---------- upload a job-site photo ----------
-- 2,500,000 chars of base64 ≈ 1.8 MB of image — comfortably above
-- what the client's downscale step produces (~200-500 KB) and
-- comfortably below anything that would bloat crm_jobs.data.
create or replace function crew_portal_add_photo(p_token text, p_label text, p_data_url text, p_by text default null)
returns text
language plpgsql security definer set search_path = public as $$
declare
  v_job_id text;
  v_id text := 'p' || substr(md5(random()::text || clock_timestamp()::text), 1, 12);
  v_photo jsonb;
begin
  select p.job_id into v_job_id from crm_portal p
    where p.token = p_token and p.revoked = false and p.audience = 'crew';
  if v_job_id is null then
    return null;
  end if;
  if p_data_url is null or p_data_url !~ '^data:image/' then
    raise exception 'Only images can be uploaded';
  end if;
  if length(p_data_url) > 2500000 then
    raise exception 'That photo is too large — try again, it will be compressed automatically';
  end if;

  v_photo := jsonb_build_object(
    'id', v_id,
    'label', coalesce(nullif(p_label, ''), 'Crew photo'),
    'at', to_char(now(), 'FMMon FMDD, FMHH12:MI AM'),
    'iso', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'url', p_data_url,
    'storage', 'inline',
    'shared', false,
    'by', coalesce(nullif(p_by, ''), 'Crew'),
    'source', 'crew-portal'
  );

  update crm_jobs j set data = jsonb_set(j.data, '{photos}',
    coalesce(j.data->'photos', '[]'::jsonb) || v_photo, true)
  where j.id = v_job_id;

  update crm_portal p set data = jsonb_set(p.data, '{photos}',
    coalesce(p.data->'photos', '[]'::jsonb) || jsonb_build_object(
      'id', v_id, 'label', v_photo->>'label', 'at', v_photo->>'at', 'url', p_data_url
    ), true)
  where p.token = p_token;

  return v_id;
end $$;
revoke all on function crew_portal_add_photo(text, text, text, text) from public;
grant execute on function crew_portal_add_photo(text, text, text, text) to anon, authenticated;
