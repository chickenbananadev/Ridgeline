-- ============================================================
-- 033 — fix infinite RLS recursion between crm_chat_conversations
-- and crm_chat_members
--
-- 031's conv_select policy (on crm_chat_conversations) checks
-- membership by directly querying crm_chat_members; 031's
-- members_select policy (on crm_chat_members) checks conversation
-- visibility by directly querying crm_chat_conversations, which in
-- turn re-triggers conv_select, which re-queries crm_chat_members
-- again — a genuine mutual cycle. Postgres detects this and refuses
-- with "infinite recursion detected in policy for relation
-- crm_chat_members" on ANY query touching either table for a
-- private conversation — confirmed directly against production:
-- even a bare `select count(*) from crm_chat_members` as a real
-- authenticated user failed this way before this migration. Every
-- private channel and DM has therefore never actually worked end to
-- end; the client's optimistic UI updates (a message/membership row
-- appears in local state the instant it's sent, regardless of
-- whether the underlying write reached the database) masked this
-- completely until "Leave conversation" surfaced the raw error.
--
-- Fix: route the cross-table membership check through SECURITY
-- DEFINER helper functions (bypass RLS the same way
-- current_tenant_id()/is_admin() already do for profiles/tenants),
-- so resolving one table's policy never re-enters the other table's
-- RLS. Applied everywhere the cycle crossed: conv_select,
-- members_select, and crm_chat's chat_read/chat_insert/
-- chat_update_reactions/chat_update_own/chat_delete.
--
-- Verified directly against production before applying: the old
-- policies threw the recursion error on a plain SELECT as a real
-- authenticated user; the new policies below do not, and a real
-- membership upsert + delete (the exact operations
-- markConversationRead/leaveConversation perform) both succeeded.
-- Applied directly to the production Supabase project the same day
-- this file was written, since the bug was actively breaking live
-- DM/private-channel use.
--
-- Idempotent. Safe to re-run.
-- ============================================================

create or replace function is_conversation_member(p_conversation_id text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from crm_chat_members
    where conversation_id = p_conversation_id and user_id = auth.uid()
  );
$$;
grant execute on function is_conversation_member(text) to authenticated;

create or replace function conversation_visible(p_conversation_id text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from crm_chat_conversations c
    where c.id = p_conversation_id
      and c.tenant_id = current_tenant_id()
      and (not c.is_private or is_conversation_member(c.id))
  );
$$;
grant execute on function conversation_visible(text) to authenticated;

drop policy if exists conv_select on crm_chat_conversations;
create policy conv_select on crm_chat_conversations for select to authenticated
  using (tenant_id = current_tenant_id() and (not is_private or is_conversation_member(id)));

drop policy if exists members_select on crm_chat_members;
create policy members_select on crm_chat_members for select to authenticated
  using (conversation_visible(conversation_id));

drop policy if exists chat_read on crm_chat;
create policy chat_read on crm_chat for select to authenticated
  using (tenant_id = current_tenant_id() and conversation_visible(conversation_id));

drop policy if exists chat_insert on crm_chat;
create policy chat_insert on crm_chat for insert to authenticated
  with check (tenant_id = current_tenant_id() and conversation_visible(conversation_id));

drop policy if exists chat_update_reactions on crm_chat;
create policy chat_update_reactions on crm_chat for update to authenticated
  using (tenant_id = current_tenant_id() and conversation_visible(conversation_id))
  with check (tenant_id = current_tenant_id());

drop policy if exists chat_update_own on crm_chat;
create policy chat_update_own on crm_chat for update to authenticated
  using (tenant_id = current_tenant_id() and conversation_visible(conversation_id))
  with check (tenant_id = current_tenant_id());

drop policy if exists chat_delete on crm_chat;
create policy chat_delete on crm_chat for delete to authenticated
  using (tenant_id = current_tenant_id() and conversation_visible(conversation_id));
