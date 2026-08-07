-- ============================================================
-- 032 — let a member leave a DM or private channel
--
-- 031 gave crm_chat_members select/insert/update policies but no
-- delete policy, so RLS's default-deny meant nobody — not even the
-- row's own owner — could ever remove their own membership. That is
-- what "Leave conversation" (ridgeline.jsx, ConversationHeader) calls:
-- deleting your own row hides a DM/private channel from your own
-- view without touching it for anyone else, the same way closing a
-- DM works in Slack.
--
-- Archiving a whole channel for everyone (creator or admin) already
-- works via conv_archive (031) — this migration only adds the
-- missing personal "leave" path, nothing about archiving changes.
--
-- Idempotent. Safe to re-run.
-- ============================================================

drop policy if exists members_leave on crm_chat_members;
create policy members_leave on crm_chat_members for delete to authenticated
  using (user_id = auth.uid());
