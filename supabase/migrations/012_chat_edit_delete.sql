-- Build 11: editing and deleting team chat messages.
--
-- Deletes are soft: the row stays and is marked, so a thread someone
-- replied to does not develop holes and the audit trail survives. The
-- app renders a tombstone in place of the body.
--
-- Authorship is enforced in the app rather than the policy because
-- crm_chat identifies people by name (by_name), not auth.uid() — there
-- is no reliable server-side link between a row and the seat that
-- wrote it. This is deliberate and worth being clear about: it stops
-- honest mistakes, not a determined person with the browser console.
-- Chat is a single internal company channel, so the exposure is one
-- employee tampering with another's message, and every edit and delete
-- is written to the activity log where an admin can see it.

alter table crm_chat
  add column if not exists edited_at timestamptz,
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by text;

-- The reaction policy from 011 already permits updates; this makes the
-- intent explicit for edits and soft deletes.
drop policy if exists chat_update_own on crm_chat;
create policy chat_update_own on crm_chat for update to authenticated
  using (true) with check (true);
