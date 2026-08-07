/* Build 122 — fix a real, live infinite-recursion bug in the chat
   RLS policies (migration 033).

   Migration 031's conv_select policy (on crm_chat_conversations)
   checked private-conversation membership by querying
   crm_chat_members directly; 031's members_select policy (on
   crm_chat_members) checked conversation visibility by querying
   crm_chat_conversations directly — a genuine mutual cycle. Postgres
   refuses this with "infinite recursion detected in policy for
   relation crm_chat_members" on ANY query touching either table for
   a private conversation. Reproduced directly against the production
   Supabase project (a bare `select count(*) from crm_chat_members`
   as a real authenticated user failed this way) before writing this
   fix, and confirmed the fix resolves it the same way, in a
   rolled-back transaction, before applying it for real.

   This had been silently breaking every DM and private channel since
   migration 031 shipped — the client's optimistic UI updates (a
   message/membership row appears in local state instantly regardless
   of whether the write actually reached the database) masked it
   completely until build 121's "Leave conversation" surfaced the raw
   Postgres error to a real user.

   Fix: SECURITY DEFINER helper functions (is_conversation_member,
   conversation_visible) that bypass RLS internally — the same
   pattern current_tenant_id()/is_admin() already use for
   profiles/tenants — so resolving one table's policy never re-enters
   the other table's RLS.
*/
const fs = require("fs");
const path = require("path");
const migSrc = fs.readFileSync(path.join(__dirname, "supabase/migrations/033_fix_chat_rls_recursion.sql"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: the two SECURITY DEFINER helpers exist ---------- */
ok(/create or replace function is_conversation_member\(p_conversation_id text\) returns boolean\s*\nlanguage sql stable security definer set search_path = public/.test(migSrc),
  "is_conversation_member is a stable security-definer function, so its internal query bypasses RLS on crm_chat_members instead of re-triggering members_select");
ok(/create or replace function conversation_visible\(p_conversation_id text\) returns boolean\s*\nlanguage sql stable security definer set search_path = public/.test(migSrc),
  "conversation_visible is a stable security-definer function, so its internal query bypasses RLS on crm_chat_conversations instead of re-triggering conv_select");
ok(/grant execute on function is_conversation_member\(text\) to authenticated;/.test(migSrc), "authenticated users can actually call is_conversation_member");
ok(/grant execute on function conversation_visible\(text\) to authenticated;/.test(migSrc), "authenticated users can actually call conversation_visible");

/* ---------- static: is_conversation_member never re-enters crm_chat_members' own RLS ---------- */
const icmStart = migSrc.indexOf("create or replace function is_conversation_member");
const icmBody = migSrc.slice(icmStart, migSrc.indexOf("$$;", icmStart));
ok(/from crm_chat_members\s*\n\s*where conversation_id = p_conversation_id and user_id = auth\.uid\(\)/.test(icmBody),
  "is_conversation_member's own query is a plain, non-recursive membership lookup");

/* ---------- static: conv_select/members_select route through the helpers, not raw cross-table EXISTS ---------- */
ok(/create policy conv_select on crm_chat_conversations for select to authenticated\s*\n\s*using \(tenant_id = current_tenant_id\(\) and \(not is_private or is_conversation_member\(id\)\)\);/.test(migSrc),
  "conv_select now calls is_conversation_member() instead of a raw EXISTS subquery against crm_chat_members");
ok(/create policy members_select on crm_chat_members for select to authenticated\s*\n\s*using \(conversation_visible\(conversation_id\)\);/.test(migSrc),
  "members_select now calls conversation_visible() instead of a raw EXISTS subquery against crm_chat_conversations (which itself used to re-query crm_chat_members)");

/* ---------- static: every crm_chat policy that used to cross both tables now uses the single helper ---------- */
["chat_read", "chat_insert", "chat_update_reactions", "chat_update_own", "chat_delete"].forEach((name) => {
  ok(migSrc.includes(`drop policy if exists ${name} on crm_chat;`) && migSrc.includes("conversation_visible(conversation_id)"),
    `${name} is rebuilt against conversation_visible() instead of the old nested crm_chat_conversations/crm_chat_members EXISTS chain`);
});

/* ---------- static: idempotent, matching every other migration's convention ---------- */
ok(/create or replace function/.test(migSrc) && /drop policy if exists/.test(migSrc),
  "the migration is safe to re-run (create or replace / drop-if-exists throughout), matching every prior migration's convention");

if (fails) { console.log("\nbuild 122: " + fails + " FAILED"); process.exit(1); }
console.log("build 122 tests passed");
