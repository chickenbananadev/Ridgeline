/* Build 121 — channel/DM management: archive + leave (part 6 of the
   channels/DMs feature).

   The owner reported "Can't delete channels or DMs after created" —
   confirmed real: migration 031 shipped conv_archive (RLS letting a
   creator/admin archive a channel) but no client code ever called it,
   and crm_chat_members had select/insert/update policies but no
   delete policy at all, so nobody could ever leave a DM either.

   Fixed with two distinct actions, matching how real Slack actually
   behaves (not one "delete" button for both):
   - Archive a channel: creator or admin, removes it for EVERYONE
     (matches conv_archive's RLS exactly — no migration change
     needed there). Blocked for #general, the one channel every
     session lands on by default.
   - Leave a conversation: any member, removes only the caller's OWN
     membership row (migration 032's new members_leave policy) —
     hides a DM/private channel from just that person, exactly like
     closing a DM in Slack. Not offered for open channels, since an
     open channel's membership row is only ever read-tracking, not
     visibility — everyone always sees it regardless of membership.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const migSrc = fs.readFileSync(path.join(__dirname, "supabase/migrations/032_chat_conversation_delete.sql"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: migration adds the missing leave policy ---------- */
ok(/create policy members_leave on crm_chat_members for delete to authenticated\s*\n\s*using \(user_id = auth\.uid\(\)\);/.test(migSrc),
  "migration 032 adds a DELETE policy so a member can remove their own membership row");

/* ---------- static: ConversationHeader exists with archive + leave ---------- */
ok(/function ConversationHeader\(\{ conversation, conversationMembers, users, currentUser, onArchive, onLeave \}\)/.test(src),
  "ConversationHeader exists with the expected props");
/* Build 125 (owner decision) removed #general's archive protection
   along with the pre-created channel itself — no channel is special;
   any channel is archivable by its creator or an admin. */
ok(/const canArchive = !isDm && \(conversation\.createdBy === me \|\| isAdmin\);/.test(src),
  "archiving is gated to the channel's creator or an admin, matching conv_archive's RLS exactly");
ok(/const canLeave = isDm \|\| conversation\.isPrivate;/.test(src),
  "leaving is only offered for DMs and private channels, not open channels where membership never gates visibility");
ok(!/const isGeneral = /.test(src),
  "no channel is special-cased against archiving anymore — nothing is pre-created, so there is no 'default' channel to protect");
ok(/This removes <b># \{conversation\.name\}<\/b> for everyone in the company, not just you\./.test(src),
  "the archive confirmation is explicit that this affects everyone, not just the person clicking it");

/* ---------- static: ChatThread threads the new props + renders the header ---------- */
ok(/function ChatThread\(\{ msgs, setMsgs, users, jobs, currentUser, onOpenJob, onBack, embedded = false, onDeleteMsg, conversationId = null, conversation = null, conversationMembers = \[\], onArchiveConversation = null, onLeaveConversation = null \}\)/.test(src),
  "ChatThread accepts the conversation object and the archive/leave handlers");
ok(/\{embedded && conversation && \(\s*\n\s*<ConversationHeader conversation=\{conversation\} conversationMembers=\{conversationMembers\} users=\{users\}/.test(src),
  "ChatThread renders ConversationHeader when embedded with a known conversation");

/* ---------- static: Inbox resolves the active conversation object and threads handlers ---------- */
ok(/onArchiveConversation = \(\) => \{\}, onLeaveConversation = \(\) => \{\} \}\) \{/.test(src),
  "Inbox accepts onArchiveConversation/onLeaveConversation");
ok(/conversation=\{\(conversations \|\| \[\]\)\.find\(\(c\) => c\.id === activeConversationId\) \|\| null\}/.test(src),
  "Inbox resolves the full active conversation object (not just its id) to hand ChatThread real name/topic/privacy data");

/* ---------- static: root App implements archive/leave against the real tables ---------- */
const acStart = src.indexOf("const archiveConversation = async (id) => {");
ok(acStart !== -1, "archiveConversation exists at the root");
const acSrc = src.slice(acStart, acStart + 700);
ok(/db\.from\("crm_chat_conversations"\)\.update\(\{ archived_at: new Date\(\)\.toISOString\(\) \}\)\.eq\("id", id\)/.test(acSrc),
  "archiving sets archived_at on the real conversation row");

const lcStart = src.indexOf("const leaveConversation = async (id) => {");
ok(lcStart !== -1, "leaveConversation exists at the root");
const lcSrc = src.slice(lcStart, lcStart + 700);
ok(/db\.from\("crm_chat_members"\)\.delete\(\)\.eq\("conversation_id", id\)\.eq\("user_id", currentUser\.id\)/.test(lcSrc),
  "leaving deletes only the caller's own membership row, never anyone else's");

ok(/onArchiveConversation=\{archiveConversation\} onLeaveConversation=\{leaveConversation\}/.test(src),
  "the root wires the real archive/leave functions into Inbox, not stubs");

/* ---------- behavioral: mirror the archive/leave permission gates ----------
   (Build 125 removed the #general special case — no channel is
   protected from archiving anymore, because none is pre-created.) */
function canArchive(conversation, me, isAdmin) {
  const isDm = conversation.kind === "dm";
  return !isDm && (conversation.createdBy === me || isAdmin);
}
function canLeave(conversation) {
  return conversation.kind === "dm" || conversation.isPrivate;
}
ok(canArchive({ kind: "channel", name: "dispatch", createdBy: "u1" }, "u1", false) === true,
  "the creator of a channel can archive it");
ok(canArchive({ kind: "channel", name: "dispatch", createdBy: "u2" }, "u1", true) === true,
  "an admin can archive any channel they didn't create");
ok(canArchive({ kind: "channel", name: "dispatch", createdBy: "u2" }, "u1", false) === false,
  "a regular member who isn't the creator or an admin cannot archive a channel");
ok(canArchive({ kind: "channel", name: "general", createdBy: null }, "u1", true) === true,
  "even a channel named 'general' is archivable by an admin — no name is special (build 125)");
ok(canArchive({ kind: "dm", createdBy: "u1" }, "u1", true) === false,
  "a DM is never archivable (only leavable) — archive is a channel-only, affects-everyone action");
ok(canLeave({ kind: "dm" }) === true, "any DM can be left");
ok(canLeave({ kind: "channel", isPrivate: true }) === true, "a private channel can be left");
ok(canLeave({ kind: "channel", isPrivate: false }) === false,
  "an open channel cannot be 'left' — membership never gates visibility for one, so leaving would silently do nothing useful");

/* ---------- behavioral: mirror landSomewhereAfterLeaving's fallback logic ----------
   (Build 125: no #general preference — the fallback is simply the
   first remaining conversation, or nothing at all.) */
function landSomewhereAfterLeaving(activeId, removedId, remaining) {
  if (activeId !== removedId) return activeId; // untouched if a different conversation was removed
  const fallback = remaining[0];
  return fallback ? fallback.id : null;
}
const REMAINING = [{ id: "chan-a" }, { id: "dm-1" }];
ok(landSomewhereAfterLeaving("dm-2", "dm-2", REMAINING) === "chan-a",
  "leaving/archiving the active conversation lands on the first remaining one");
ok(landSomewhereAfterLeaving("dm-1", "dm-2", REMAINING) === "dm-1",
  "leaving/archiving a DIFFERENT conversation never moves you off the one you're actually looking at");
ok(landSomewhereAfterLeaving("only-one", "only-one", []) === null,
  "leaving/archiving your only conversation with nothing left to fall back to doesn't crash — lands on null, not a dangling id");

if (fails) { console.log("\nbuild 121: " + fails + " FAILED"); process.exit(1); }
console.log("build 121 tests passed");
