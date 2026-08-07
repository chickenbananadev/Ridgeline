/* Build 125 — no pre-created channels (owner decision, reversing the
   auto-#general from builds 115/117).

   The owner's call: "there shouldn't be pre-created chat, every
   company sets theirs up differently — general should be deleted and
   companies choose their structure." So:
   - The client no longer bootstraps a #general for a fresh tenant.
   - Nothing prefers or protects a channel named "general" — no
     channel is special; any channel is archivable by its creator or
     an admin.
   - A company with zero conversations gets a real starting point in
     Inbox (create-your-first-channel guidance), not an empty
     composer aimed at no conversation.
   - Migration 036 archived the auto-created #general rows in
     production (created_by is null — the fingerprint of both the 031
     backfill and the old client bootstrap). Channels real people
     created are untouched, whatever they're named. Archived, not
     deleted: message history stays in crm_chat. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const migSrc = fs.readFileSync(path.join(__dirname, "supabase/migrations/036_no_precreated_channels.sql"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- no auto-creation anywhere ---------- */
ok(!/general-\$\{tenantId\}/.test(src), "no code path constructs the auto-#general id anymore");
ok(!/name: "general"/.test(src), "no code path inserts a channel named 'general'");
ok(!/const isGeneral = /.test(src), "no channel is special-cased against archiving — there is no 'default' channel to protect");
ok(/const canArchive = !isDm && \(conversation\.createdBy === me \|\| isAdmin\);/.test(src),
  "any channel is archivable by its creator or an admin, full stop");

/* ---------- landing/fallback logic has no general preference ---------- */
ok(/if \(activeConversationId \|\| !conversations\.length\) return;\s*\n\s*selectConversation\(conversations\[0\]\.id\);/.test(src),
  "landing just picks the first conversation — and a company with none stays unselected instead of crashing on a missing default");
ok(/const fallback = remaining\[0\];\s*\n\s*if \(fallback\) selectConversation\(fallback\.id\); else setActiveConversationId\(null\);/.test(src),
  "archiving/leaving the active conversation falls back to whatever remains, or to the empty state");

/* ---------- the empty state exists and gates the composer ---------- */
ok(/\{!activeConversationId \? \(\s*\n\s*<Card>\s*\n\s*<CardTitle>Set up your team chat<\/CardTitle>/.test(src),
  "a company with no conversations sees the set-up guidance instead of a chat thread");
ok(/Every company structures chat its own way\./.test(src),
  "the empty state explains the model: the company chooses its own structure");
ok(/many teams start with one for everyone, then\s*\n\s*add channels per crew, per office, or per project/.test(src),
  "the guidance suggests common structures without imposing one");

/* ---------- migration 036: archive only the AUTO-created generals ---------- */
ok(/update crm_chat_conversations\s*\n\s*set archived_at = coalesce\(archived_at, now\(\)\)\s*\n\s*where kind = 'channel' and name = 'general' and created_by is null;/.test(migSrc),
  "036 archives only auto-created #general rows (created_by is null) — a channel a real person created is theirs, whatever they named it");
ok(/coalesce\(archived_at, now\(\)\)/.test(migSrc), "re-running never bumps an existing archive timestamp (idempotent)");
ok(!/delete from/.test(migSrc), "archived, not deleted — the message history stays in crm_chat");

/* ---------- behavioral: mirror the landing decision ---------- */
function landOn(activeId, conversations) {
  if (activeId || !conversations.length) return activeId || null;
  return conversations[0].id;
}
ok(landOn(null, []) === null, "zero conversations → no selection → the set-up state shows");
ok(landOn(null, [{ id: "chan-1" }, { id: "chan-2" }]) === "chan-1", "the first conversation wins with no name-based preference");
ok(landOn("chan-2", [{ id: "chan-1" }, { id: "chan-2" }]) === "chan-2", "an existing selection is never overridden");

/* ---------- behavioral: mirror 036's archive filter ---------- */
function shouldArchive(row) {
  return row.kind === "channel" && row.name === "general" && row.created_by == null;
}
ok(shouldArchive({ kind: "channel", name: "general", created_by: null }) === true,
  "the auto-created #general (backfill or bootstrap — created_by null) is archived");
ok(shouldArchive({ kind: "channel", name: "general", created_by: "u1" }) === false,
  "a channel a real person created and happened to name 'general' is NOT touched");
ok(shouldArchive({ kind: "channel", name: "dispatch", created_by: null }) === false,
  "no other channel is touched regardless of created_by");
ok(shouldArchive({ kind: "dm", name: "general", created_by: null }) === false,
  "DMs are never touched");

if (fails) { console.log("\nbuild 125: " + fails + " FAILED"); process.exit(1); }
console.log("build 125 tests passed");
