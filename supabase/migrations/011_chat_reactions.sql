-- Build 10: emoji reactions on team chat.
--
-- Reactions live on the message row as jsonb keyed by emoji, each
-- holding the list of names who reacted:
--   {"👍": ["Jacob Henderson", "Ty Miller"], "🔥": ["Ty Miller"]}
--
-- Storing names rather than ids keeps it readable in the dashboard and
-- matches how the rest of the chat row identifies people (crm_chat.by
-- is already a name). Last-write-wins is acceptable here: two people
-- reacting at the same instant is low-stakes and self-correcting on
-- the next realtime sync.

alter table crm_chat
  add column if not exists reactions jsonb not null default '{}'::jsonb;

-- Reacting means updating someone else's message row, so the update
-- policy has to allow it. Chat is a single company-wide channel and
-- every seat can already read every message, so this grants nothing
-- new in terms of visibility.
drop policy if exists chat_update_reactions on crm_chat;
create policy chat_update_reactions on crm_chat for update to authenticated
  using (true) with check (true);
