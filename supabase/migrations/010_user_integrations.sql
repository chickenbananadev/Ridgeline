-- Build 6: per-seat integration tokens.
--
-- These were previously held in React state only, so they vanished on
-- refresh. The obvious fix — dropping them into crm_org with the rest
-- of the settings — would be worse: crm_org is readable by every
-- signed-in seat, so one rep could read another rep's CompanyCam
-- token. This table is scoped by RLS to the owning user instead.

create table if not exists crm_user_integrations (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table crm_user_integrations enable row level security;

-- A seat can read and write only its own row. No policy grants read
-- access to anyone else's, including admins: an admin needing to
-- revoke a token should do it in the vendor's dashboard, not by
-- reading the secret out of ours.
drop policy if exists user_integrations_own_select on crm_user_integrations;
create policy user_integrations_own_select on crm_user_integrations
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists user_integrations_own_insert on crm_user_integrations;
create policy user_integrations_own_insert on crm_user_integrations
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists user_integrations_own_update on crm_user_integrations;
create policy user_integrations_own_update on crm_user_integrations
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists user_integrations_own_delete on crm_user_integrations;
create policy user_integrations_own_delete on crm_user_integrations
  for delete to authenticated using (auth.uid() = user_id);
