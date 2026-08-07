-- ============================================================
-- 036 — no pre-created channels
--
-- Owner decision (build 125): every company structures its chat its
-- own way, so nothing is ever created for them. This retires the
-- auto-#general in both directions:
--
--  * Going forward, the client no longer bootstraps a channel for a
--    fresh tenant (that code is gone in build 125), and 031's
--    backfill never runs again (its insert was one-time).
--  * Looking back, the #general rows those two paths already created
--    are archived here. Only AUTO-created ones: created_by is null
--    is the fingerprint of both the 031 backfill and the client
--    bootstrap — a channel a real person created (created_by set)
--    is theirs, whatever they named it, and is not touched.
--
-- Archived, not deleted: the message history stays in crm_chat,
-- reachable again if a company ever asks for it back.
--
-- Idempotent. Safe to re-run.
-- ============================================================

update crm_chat_conversations
  set archived_at = coalesce(archived_at, now())
  where kind = 'channel' and name = 'general' and created_by is null;
