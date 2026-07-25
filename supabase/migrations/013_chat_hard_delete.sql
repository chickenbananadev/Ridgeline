-- Build 14: chat messages are deleted for real, not tombstoned.
--
-- Replaces the soft-delete columns from 012. A deleted message should
-- be gone, so the row is removed. Any tombstones written under 012 are
-- cleared out on the way past.
--
-- Authorship is still enforced in the app, not the policy: crm_chat
-- identifies people by name (by_name), and there is no reliable
-- server-side link between a row and the seat that wrote it. Worth
-- being plain about — this stops honest mistakes, not a determined
-- person with the browser console. Chat is one internal company
-- channel, so the exposure is an employee deleting a colleague's
-- message.

delete from crm_chat where deleted_at is not null;

alter table crm_chat
  drop column if exists deleted_at,
  drop column if exists deleted_by;

drop policy if exists chat_delete on crm_chat;
create policy chat_delete on crm_chat for delete to authenticated
  using (true);
