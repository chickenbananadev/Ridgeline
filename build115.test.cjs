/* Build 115 — Team chat: named channels + private direct messages.

   crm_chat has been one flat, tenant-wide feed since migration 002 —
   no channel, thread, or recipient concept exists anywhere, and RLS
   (015, hardened by 026) only ever scoped by tenant, never by
   conversation. The owner asked for Slack-style channels plus DMs
   that are genuinely private (only visible to participants), which
   cannot be built as a client-side filter — it needs real
   per-conversation authorization in Postgres.

   New migration 031_chat_channels_dms.sql adds:
   - crm_chat_conversations (kind 'channel'|'dm', is_private) and
     crm_chat_members, one shared model for both since they need
     identical RLS/realtime/rendering shape.
   - crm_chat.conversation_id, backfilled so existing history becomes
     an open #general channel per tenant — no data loss, no separate
     "legacy" view.
   - RLS on crm_chat rewritten from tenant-only to conversation-
     membership-aware (the actual new privacy boundary), plus RLS on
     the two new tables.
   - start_conversation(): the only way to create a private
     conversation (writes other people's membership rows, which a
     plain per-row policy can't do), follows the same
     security-definer + explicit-argument-validation shape as
     portal_get_messages (018_portal_token_gate.sql). Group DMs are
     free under this model — p_member_ids is just an array.
   - chat_unread_counts(): per-conversation unread/mention counts,
     replacing the old single global-index scheme (build 119's job).
*/
const fs = require("fs");
const path = require("path");
const migPath = path.join(__dirname, "supabase/migrations/031_chat_channels_dms.sql");
const mig = fs.readFileSync(migPath, "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: migration exists and defines the new tables ---------- */
ok(fs.existsSync(migPath), "migration 031_chat_channels_dms.sql exists");
ok(/create table if not exists crm_chat_conversations \(/.test(mig), "crm_chat_conversations table is defined");
ok(/kind\s+text not null check \(kind in \('channel','dm'\)\)/.test(mig), "conversations have a kind discriminator restricted to channel|dm");
ok(/is_private\s+boolean not null default false/.test(mig), "is_private defaults to false (open channels need no membership row, matching today's behavior)");
ok(/create table if not exists crm_chat_members \(/.test(mig), "crm_chat_members table is defined");
ok(/primary key \(conversation_id, user_id\)/.test(mig), "membership is keyed on (conversation, user) — one row per person per conversation");
ok(/alter table crm_chat add column if not exists conversation_id text references crm_chat_conversations\(id\);/.test(mig),
  "crm_chat gains a conversation_id column");

/* ---------- static: backfill preserves history as an open #general, no archive ---------- */
ok(/insert into crm_chat_conversations \(id, tenant_id, kind, name, topic, is_private, created_by, created_at\)\s*\n\s*select 'general-' \|\| t\.tenant_id::text, t\.tenant_id, 'channel', 'general',/.test(mig),
  "one open #general channel is backfilled per tenant with existing chat history");
ok(/update crm_chat set conversation_id = 'general-' \|\| tenant_id::text\s*\n\s*where conversation_id is null and tenant_id is not null;/.test(mig),
  "every legacy crm_chat row is pointed at its tenant's #general channel — history stays live, nothing is archived");

/* ---------- static: crm_chat RLS becomes conversation-membership-aware, not just tenant-scoped ---------- */
for (const policy of ["chat_read", "chat_insert", "chat_update_reactions", "chat_update_own", "chat_delete"]) {
  ok(new RegExp(`drop policy if exists ${policy} on crm_chat;`).test(mig), `${policy} policy is redefined (dropped before recreate)`);
}
ok(/create policy chat_read on crm_chat for select to authenticated\s*\n\s*using \(tenant_id = current_tenant_id\(\) and exists \(/.test(mig),
  "chat_read now requires conversation membership on top of tenant scoping, not tenant scoping alone");
ok((mig.match(/not c\.is_private or exists \(\s*\n\s*select 1 from crm_chat_members m2? where m2?\.conversation_id = c\.id and m2?\.user_id = auth\.uid\(\)\)\)/g) || []).length >= 5,
  "the same 'open channel OR member of it' privacy check is applied consistently across chat_read/insert/reactions/edit/delete and the conversations/members policies");

/* ---------- static: private conversations can only be created through start_conversation() ---------- */
ok(/create policy conv_insert on crm_chat_conversations for insert to authenticated\s*\n\s*with check \(tenant_id = current_tenant_id\(\) and created_by = auth\.uid\(\) and not is_private\);/.test(mig),
  "the direct-insert policy on conversations only permits OPEN channels — private channels/DMs must go through the RPC");
ok(/create or replace function start_conversation\(/.test(mig), "start_conversation() RPC is defined");
ok(/if p_kind = 'dm' and not p_is_private then/.test(mig), "a dm can never be created as non-private");
ok(/where not exists \(\s*\n\s*select 1 from profiles p where p\.id = uid and p\.tenant_id = v_tenant and p\.active\s*\n\s*\)/.test(mig),
  "every invited member is validated as an active seat in the caller's own tenant — the real cross-tenant guard");
ok(/select c\.id into v_existing[\s\S]{0,400}limit 1;/.test(mig) && /if v_existing is not null then\s*\n\s*return v_existing;/.test(mig),
  "re-opening a dm with the exact same member set returns the existing conversation instead of duplicating it");
ok(/grant execute on function start_conversation\(text, text, text, boolean, uuid\[\]\) to authenticated;/.test(mig),
  "start_conversation is actually grantable/callable by authenticated users, not left unreachable");

/* ---------- static: unread counts RPC exists for the future badge rework ---------- */
ok(/create or replace function chat_unread_counts\(\)/.test(mig), "chat_unread_counts() RPC is defined");
ok(/grant execute on function chat_unread_counts\(\) to authenticated;/.test(mig), "chat_unread_counts is grantable");

/* ---------- behavioral: mirror start_conversation's DM de-dup member-set comparison ---------- */
function memberSetsMatch(existingMembers, requestedMembers) {
  const a = [...existingMembers].sort();
  const b = [...new Set(requestedMembers)].sort();
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
ok(memberSetsMatch(["u1", "u2"], ["u2", "u1"]) === true, "member-set comparison is order-independent (matches the array_agg(... order by ...) approach in SQL)");
ok(memberSetsMatch(["u1", "u2"], ["u1", "u2", "u2"]) === true, "requesting the same member twice still de-dupes to the same conversation (mirrors array_agg(distinct ...))");
ok(memberSetsMatch(["u1", "u2"], ["u1", "u3"]) === false, "a different member set is never treated as the same DM");
ok(memberSetsMatch(["u1", "u2", "u3"], ["u1", "u2"]) === false, "a subset of members is not treated as the same conversation — group DMs stay distinct from smaller DMs");

/* ---------- behavioral: mirror chat_unread_counts' filter logic ---------- */
function unreadCount(messages, lastReadAt) {
  return messages.filter((m) => new Date(m.at) > new Date(lastReadAt)).length;
}
function mentionCount(messages, lastReadAt, myName) {
  return messages.filter((m) => new Date(m.at) > new Date(lastReadAt) && (m.mentions || []).includes(myName)).length;
}
const MSGS = [
  { at: "2026-01-01T00:00:00Z", mentions: [] },
  { at: "2026-01-02T00:00:00Z", mentions: ["Ty Miller"] },
  { at: "2026-01-03T00:00:00Z", mentions: [] },
];
ok(unreadCount(MSGS, "2026-01-01T12:00:00Z") === 2, "unread count only includes messages strictly after last_read_at");
ok(mentionCount(MSGS, "2026-01-01T12:00:00Z", "Ty Miller") === 1, "mention count is a subset of unread, filtered to messages mentioning me");
ok(unreadCount(MSGS, "2026-01-05T00:00:00Z") === 0, "a fully-read conversation reports zero unread, not a negative or stale count");

if (fails) { console.log("\nbuild 115: " + fails + " FAILED"); process.exit(1); }
console.log("build 115 tests passed");
