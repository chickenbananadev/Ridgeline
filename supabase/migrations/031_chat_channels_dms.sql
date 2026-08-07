-- ============================================================
-- 031 — Team chat: named channels + private direct messages
--
-- crm_chat has been one flat, tenant-wide feed since migration 002 —
-- no channel, thread, or recipient concept exists anywhere, and RLS
-- (015, hardened by 026) only ever scoped by tenant. A DM "only
-- visible to the two of you" cannot be built as a client-side filter
-- over that model; it needs real per-conversation authorization in
-- Postgres, which is what this migration adds.
--
-- Channels and DMs share one table (crm_chat_conversations, kind
-- 'channel'|'dm') rather than two, because they need identical RLS
-- shape, identical realtime shape, and identical rendering — the
-- only real difference is is_private, which is what actually decides
-- whether a membership row is required to read/post. Every DM is
-- private; a channel can be either (default open, per product
-- decision — matches how chat already behaves today).
--
-- Group DMs are "free" under this model: start_conversation() takes
-- an array of member ids, so a 2-person DM and a 5-person group DM
-- are the same call with a different array length.
--
-- Existing crm_chat history is preserved live, not archived: one
-- open "general" channel is backfilled per tenant that has existing
-- rows, and every legacy row is pointed at it. A brand-new tenant
-- with no legacy rows gets #general bootstrapped client-side on
-- first load (see ridgeline.jsx) using the same id convention,
-- so the migration path and the fresh-tenant path converge.
--
-- Idempotent. Safe to re-run.
-- ============================================================

-- ---------- Conversations (channels + DMs) ----------
create table if not exists crm_chat_conversations (
  id           text primary key,
  tenant_id    uuid not null references tenants(id),
  kind         text not null check (kind in ('channel','dm')),
  name         text,                          -- e.g. "general", "dispatch"; null for a dm
  topic        text,
  is_private   boolean not null default false, -- always true for kind='dm'
  created_by   uuid references profiles(id),
  created_at   timestamptz not null default now(),
  archived_at  timestamptz
);

-- ---------- Membership (required only for private conversations) ----------
create table if not exists crm_chat_members (
  conversation_id text not null references crm_chat_conversations(id) on delete cascade,
  user_id         uuid not null references profiles(id) on delete cascade,
  joined_at       timestamptz not null default now(),
  last_read_at    timestamptz not null default now(),
  primary key (conversation_id, user_id)
);
create index if not exists chat_members_user_idx on crm_chat_members(user_id);

-- ---------- Point every message at a conversation ----------
alter table crm_chat add column if not exists conversation_id text references crm_chat_conversations(id);
create index if not exists chat_conversation_idx on crm_chat(conversation_id);

-- ---------- Backfill: legacy history becomes an open #general per tenant ----------
insert into crm_chat_conversations (id, tenant_id, kind, name, topic, is_private, created_by, created_at)
select 'general-' || t.tenant_id::text, t.tenant_id, 'channel', 'general',
       'Everyone at the company — migrated from the original single chat feed', false, null, now()
from (select distinct tenant_id from crm_chat where tenant_id is not null) t
on conflict (id) do nothing;

update crm_chat set conversation_id = 'general-' || tenant_id::text
  where conversation_id is null and tenant_id is not null;

-- ---------- RLS: conversations ----------
alter table crm_chat_conversations enable row level security;

drop policy if exists conv_select on crm_chat_conversations;
create policy conv_select on crm_chat_conversations for select to authenticated
  using (tenant_id = current_tenant_id() and (
    not is_private
    or exists (select 1 from crm_chat_members m where m.conversation_id = id and m.user_id = auth.uid())
  ));

-- Open channels only — private channels and every DM are only ever
-- created through start_conversation() below (security definer,
-- bypasses this policy), since creating a private conversation also
-- means writing OTHER people's membership rows, which a per-row
-- check here (user_id = auth.uid()) can't cover.
drop policy if exists conv_insert on crm_chat_conversations;
create policy conv_insert on crm_chat_conversations for insert to authenticated
  with check (tenant_id = current_tenant_id() and created_by = auth.uid() and not is_private);

drop policy if exists conv_archive on crm_chat_conversations;
create policy conv_archive on crm_chat_conversations for update to authenticated
  using (tenant_id = current_tenant_id() and (created_by = auth.uid() or is_admin()))
  with check (tenant_id = current_tenant_id());

-- ---------- RLS: membership ----------
alter table crm_chat_members enable row level security;

drop policy if exists members_select on crm_chat_members;
create policy members_select on crm_chat_members for select to authenticated
  using (exists (
    select 1 from crm_chat_conversations c where c.id = conversation_id
      and c.tenant_id = current_tenant_id()
      and (not c.is_private or exists (
        select 1 from crm_chat_members m2 where m2.conversation_id = c.id and m2.user_id = auth.uid()))
  ));

-- Self-service joining is only meaningful for open channels — private
-- conversations gain members exclusively through start_conversation().
drop policy if exists members_join_open on crm_chat_members;
create policy members_join_open on crm_chat_members for insert to authenticated
  with check (user_id = auth.uid() and exists (
    select 1 from crm_chat_conversations c where c.id = conversation_id
      and c.tenant_id = current_tenant_id() and not c.is_private
  ));

drop policy if exists members_mark_read on crm_chat_members;
create policy members_mark_read on crm_chat_members for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- RLS: crm_chat itself — the actual privacy boundary ----------
-- Replaces the tenant-only chat_read/chat_insert from 015 with a
-- conversation-membership-aware check. This is also what makes
-- realtime private for free: Supabase filters postgres_changes
-- payloads by the subscriber's SELECT policy, which is already the
-- only thing stopping cross-tenant leakage on today's unfiltered
-- realtime channel — tightening chat_read tightens realtime too, no
-- separate realtime-specific policy needed.
drop policy if exists chat_read on crm_chat;
create policy chat_read on crm_chat for select to authenticated
  using (tenant_id = current_tenant_id() and exists (
    select 1 from crm_chat_conversations c where c.id = crm_chat.conversation_id
      and c.tenant_id = current_tenant_id()
      and (not c.is_private or exists (
        select 1 from crm_chat_members m where m.conversation_id = c.id and m.user_id = auth.uid()))
  ));

drop policy if exists chat_insert on crm_chat;
create policy chat_insert on crm_chat for insert to authenticated
  with check (tenant_id = current_tenant_id() and exists (
    select 1 from crm_chat_conversations c where c.id = conversation_id
      and c.tenant_id = current_tenant_id()
      and (not c.is_private or exists (
        select 1 from crm_chat_members m where m.conversation_id = c.id and m.user_id = auth.uid()))
  ));

-- Reactions/edit/delete (from 011-013, tenant-scoped by 026) get the
-- same conversation-membership clause added, on top of the existing
-- tradeoff those migrations already document and accept (authorship
-- is enforced client-side, not server-side, since crm_chat identifies
-- people by name — this closes "any seat in the tenant" down to "any
-- member of this specific conversation", it doesn't change that
-- existing tradeoff).
drop policy if exists chat_update_reactions on crm_chat;
create policy chat_update_reactions on crm_chat for update to authenticated
  using (tenant_id = current_tenant_id() and exists (
    select 1 from crm_chat_conversations c where c.id = crm_chat.conversation_id
      and c.tenant_id = current_tenant_id()
      and (not c.is_private or exists (
        select 1 from crm_chat_members m where m.conversation_id = c.id and m.user_id = auth.uid()))
  ))
  with check (tenant_id = current_tenant_id());

drop policy if exists chat_update_own on crm_chat;
create policy chat_update_own on crm_chat for update to authenticated
  using (tenant_id = current_tenant_id() and exists (
    select 1 from crm_chat_conversations c where c.id = crm_chat.conversation_id
      and c.tenant_id = current_tenant_id()
      and (not c.is_private or exists (
        select 1 from crm_chat_members m where m.conversation_id = c.id and m.user_id = auth.uid()))
  ))
  with check (tenant_id = current_tenant_id());

drop policy if exists chat_delete on crm_chat;
create policy chat_delete on crm_chat for delete to authenticated
  using (tenant_id = current_tenant_id() and exists (
    select 1 from crm_chat_conversations c where c.id = crm_chat.conversation_id
      and c.tenant_id = current_tenant_id()
      and (not c.is_private or exists (
        select 1 from crm_chat_members m where m.conversation_id = c.id and m.user_id = auth.uid()))
  ));

-- ---------- start_conversation: the only way to create a private conversation ----------
-- Creating a DM or a private channel means writing OTHER people's
-- membership rows, which a plain per-row insert policy can't do
-- (user_id = auth.uid() doesn't cover the invitee). Follows the same
-- security-definer, explicit-argument-validation shape this codebase
-- already uses for portal_get_messages/portal_mark_team_msgs_read
-- (018_portal_token_gate.sql).
create or replace function start_conversation(
  p_kind text, p_name text, p_topic text, p_is_private boolean, p_member_ids uuid[]
) returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant uuid := current_tenant_id();
  v_id text;
  v_existing text;
  v_all_members uuid[];
begin
  if v_tenant is null then
    raise exception 'Not signed in to a company';
  end if;
  if p_kind not in ('channel','dm') then
    raise exception 'Invalid conversation kind';
  end if;
  if p_kind = 'dm' and not p_is_private then
    raise exception 'A direct message is always private';
  end if;

  v_all_members := (select array_agg(distinct x) from unnest(p_member_ids || auth.uid()) x);

  -- Every invited person must be an active seat in the caller's own
  -- tenant — this is the actual boundary preventing a DM/channel from
  -- ever being started with someone outside the company.
  if exists (
    select 1 from unnest(v_all_members) uid
    where not exists (
      select 1 from profiles p where p.id = uid and p.tenant_id = v_tenant and p.active
    )
  ) then
    raise exception 'One or more members are not active seats at this company';
  end if;

  if p_kind = 'dm' then
    -- Re-opening a DM with the exact same people returns the existing
    -- conversation instead of spawning a duplicate.
    select c.id into v_existing
    from crm_chat_conversations c
    where c.tenant_id = v_tenant and c.kind = 'dm' and c.archived_at is null
      and (select array_agg(m.user_id order by m.user_id) from crm_chat_members m where m.conversation_id = c.id)
          = (select array_agg(x order by x) from unnest(v_all_members) x)
    limit 1;
    if v_existing is not null then
      return v_existing;
    end if;
  end if;

  v_id := gen_random_uuid()::text;
  insert into crm_chat_conversations (id, tenant_id, kind, name, topic, is_private, created_by)
  values (v_id, v_tenant, p_kind, p_name, p_topic, p_is_private, auth.uid());

  insert into crm_chat_members (conversation_id, user_id)
  select v_id, x from unnest(v_all_members) x
  on conflict do nothing;

  return v_id;
end;
$$;
revoke all on function start_conversation(text, text, text, boolean, uuid[]) from public;
grant execute on function start_conversation(text, text, text, boolean, uuid[]) to authenticated;

-- ---------- chat_unread_counts: per-conversation unread state ----------
-- Replaces the client's old chatSeenCount scheme (a single numeric
-- index into one flat array, persisted in localStorage — impossible
-- to extend to "N conversations, each with its own read state").
-- Mirrors my_tenant() (015_multi_tenancy.sql) for shape.
create or replace function chat_unread_counts()
returns table (conversation_id text, unread_count bigint, mention_count bigint)
language sql stable security definer set search_path = public
as $$
  select c.id,
    count(m.*) filter (where m.at > coalesce(mem.last_read_at, c.created_at)),
    count(m.*) filter (where m.at > coalesce(mem.last_read_at, c.created_at)
                        and (select p.name from profiles p where p.id = auth.uid()) = any(m.mentions))
  from crm_chat_conversations c
  left join crm_chat_members mem on mem.conversation_id = c.id and mem.user_id = auth.uid()
  left join crm_chat m on m.conversation_id = c.id
  where c.tenant_id = current_tenant_id()
    and (not c.is_private or mem.user_id is not null)
  group by c.id, mem.last_read_at, c.created_at;
$$;
grant execute on function chat_unread_counts() to authenticated;

-- ---------- Realtime ----------
do $$ begin
  alter publication supabase_realtime add table crm_chat_conversations;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table crm_chat_members;
exception when duplicate_object then null; end $$;
