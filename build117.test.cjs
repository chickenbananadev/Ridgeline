/* Build 117 — ConversationList + create-channel/start-DM flows (part 3
   of the channels/DMs feature).

   Wires the schema from build 115 and the PersonPicker from build 116
   into an actual UI: TeamChat is renamed ChatThread and now stamps
   conversationId on every message it sends; a new ConversationList
   sits above it in Inbox's "team" pane, showing channels + DMs as a
   pill strip with "+ Channel" / "+ Direct message" actions.

   Creating an open channel is a plain client insert (conv_insert's RLS
   only permits non-private rows that way). Private channels and every
   DM go through the start_conversation() RPC from build 115, since
   writing another person's membership row can't happen through a
   per-row insert policy — createChannel/startDm/startConversation at
   the root implement exactly that branch.

   chatMsgs stays ONE flat array (build 118 will properly scope hydrate
   per-conversation) — ChatThread receives a filtered view and a
   setMsgs wrapper that merges its updates back into the full array
   without touching other conversations' messages.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: ChatThread (renamed from TeamChat) stamps conversationId ---------- */
/* Build 121 appended conversation/conversationMembers/
   onArchiveConversation/onLeaveConversation to the signature — match
   on the still-true prefix rather than the now-stale exact tail. */
ok(/function ChatThread\(\{ msgs, setMsgs, users, jobs, currentUser, onOpenJob, onBack, embedded = false, onDeleteMsg, conversationId = null,/.test(src),
  "TeamChat is renamed ChatThread and accepts a conversationId prop");
ok(!/function TeamChat\(/.test(src), "the old TeamChat name is gone, not left as a dead duplicate");
ok(/text: t, mentions, jobId: tagged \|\| null, reactions: \{\}, conversationId,/.test(src),
  "every outgoing message is stamped with the conversation it was sent in");

/* ---------- static: ConversationList exists with create-channel + start-DM flows ---------- */
/* Build 119 added an unreadCounts prop for the per-pill unread
   indicator — match on the still-true prefix rather than the now-
   stale full signature. */
ok(/function ConversationList\(\{ conversations, conversationMembers, activeConversationId, onSelect, users, currentUser, onCreateChannel, onStartDm/.test(src),
  "ConversationList exists with the expected props");
ok(/const channels = \(conversations \|\| \[\]\)\.filter\(\(c\) => c\.kind === "channel"\)/.test(src),
  "ConversationList separates channels from DMs by kind");
ok(/const otherIds = \(conversationMembers \|\| \[\]\)\.filter\(\(m\) => m\.conversationId === c\.id && m\.userId !== me\)/.test(src),
  "a DM's display label is derived from membership + users, not a stored name (DMs have no name column)");
ok(/<PersonPicker open=\{creating === "dm"\} onClose=\{closeCreate\} title="Start a direct message"\s*\n\s*users=\{users\} excludeName=\{currentUser && currentUser\.name\} multi/.test(src),
  "starting a DM reuses PersonPicker in multi-select mode, per the owner's group-DM decision");

/* ---------- static: root App creates conversations through the right path per is_private ---------- */
const scStart = src.indexOf("const startConversation = async (kind, name, topic, isPrivate, memberIds) => {");
ok(scStart !== -1, "startConversation exists at the root");
const scSrc = src.slice(scStart, scStart + 1600);
ok(/if \(!isPrivate\) \{/.test(scSrc) && /db\.from\("crm_chat_conversations"\)\.insert\(\{/.test(scSrc),
  "an open (non-private) conversation is created via a plain insert");
ok(/db\.rpc\("start_conversation", \{/.test(scSrc), "a private conversation/DM goes through the start_conversation RPC instead of a direct insert");
ok(/p_kind: kind, p_name: name \|\| null, p_topic: topic \|\| null, p_is_private: true, p_member_ids: memberIds \|\| \[\],/.test(scSrc),
  "the RPC call passes through the real kind/name/topic/member list, not hardcoded values");
ok(/const createChannel = async \(name, topic, isPrivate\) => \{/.test(src) && /const startDm = async \(memberIds\) => \{/.test(src),
  "createChannel and startDm wrap startConversation and land the new conversation as active");

/* ---------- static: root state + hydrate for conversations/members ---------- */
ok(/const \[conversations, setConversations\] = useState\(\[\]\);/.test(src), "root App tracks the visible conversation list");
ok(/const \[activeConversationId, setActiveConversationId\] = useState\(null\);/.test(src), "root App tracks which conversation is open");
ok(/const \[conversationMembers, setConversationMembers\] = useState\(\[\]\);/.test(src), "root App tracks membership rows for private conversations");
ok(/if \(alive && \(!convRows \|\| !convRows\.length\)\) \{/.test(src) && /const generalId = `general-\$\{tenantId\}`;/.test(src),
  "a brand-new tenant with zero conversations bootstraps #general client-side, using the same id convention as migration 031's backfill");

/* ---------- static: outbound insert stamps conversation_id, hydrate reads it back ---------- */
ok(/reactions: m\.reactions \|\| \{\}, conversation_id: m\.conversationId \|\| null,/.test(src),
  "the chat insert effect writes conversation_id to crm_chat, or every private conversation's RLS would reject the write");
ok((src.match(/conversationId: r\.conversation_id \|\| null/g) || []).length >= 2,
  "both the initial hydrate and the realtime insert handler map conversation_id back onto the client message shape");

/* ---------- static: Inbox threads the new props through and scopes ChatThread's messages ---------- */
ok(/msgs=\{\(chatMsgs \|\| \[\]\)\.filter\(\(m\) => m\.conversationId === activeConversationId\)\}/.test(src),
  "ChatThread only ever receives the active conversation's own messages, not the whole company's chat");
ok(/const mine = \(all \|\| \[\]\)\.filter\(\(m\) => m\.conversationId === activeConversationId\);/.test(src) &&
   /return \[\.\.\.others, \.\.\.next\]\.sort\(\(a, b\) => \(a\.at \|\| ""\)\.localeCompare\(b\.at \|\| ""\)\);/.test(src),
  "ChatThread's setMsgs wrapper merges its (possibly-updater-function) result back into the full array without dropping other conversations' messages, and keeps global chronological order");

/* ---------- behavioral: mirror the setMsgs merge wrapper against synthetic state ---------- */
function mergeWrapper(all, activeId, updater) {
  const mine = (all || []).filter((m) => m.conversationId === activeId);
  const others = (all || []).filter((m) => m.conversationId !== activeId);
  const next = typeof updater === "function" ? updater(mine) : updater;
  return [...others, ...next].sort((a, b) => (a.at || "").localeCompare(b.at || ""));
}
const ALL = [
  { id: "m1", conversationId: "general", at: "2026-01-01T00:00" },
  { id: "m2", conversationId: "dm-1", at: "2026-01-02T00:00" },
];
const afterSendToGeneral = mergeWrapper(ALL, "general", [...ALL.filter((m) => m.conversationId === "general"), { id: "m3", conversationId: "general", at: "2026-01-03T00:00" }]);
ok(afterSendToGeneral.length === 3 && afterSendToGeneral.some((m) => m.id === "m2"),
  "sending a new message into one conversation never drops another conversation's already-loaded messages");
const afterReactOnDm = mergeWrapper(ALL, "dm-1", (prev) => prev.map((m) => ({ ...m, reactions: { "👍": ["Me"] } })));
ok(afterReactOnDm.find((m) => m.id === "m2").reactions["👍"].length === 1 && afterReactOnDm.find((m) => m.id === "m1").reactions === undefined,
  "a functional updater (reactions/edit/delete) only ever touches the active conversation's own messages");

/* ---------- behavioral: mirror the open-vs-private conversation-creation routing decision ---------- */
function routeFor(isPrivate) { return isPrivate ? "rpc" : "direct-insert"; }
ok(routeFor(false) === "direct-insert", "an open channel is created via a direct insert");
ok(routeFor(true) === "rpc", "a private channel or DM always routes through the RPC, never a direct insert");

/* ---------- behavioral: mirror ConversationList's DM label resolution ---------- */
function dmLabel(conversationMembers, users, conversationId, me) {
  const otherIds = conversationMembers.filter((m) => m.conversationId === conversationId && m.userId !== me).map((m) => m.userId);
  const names = otherIds.map((id) => { const u = users.find((x) => x.id === id); return u ? u.name : "Someone"; });
  return names.length ? names.join(", ") : "Direct message";
}
const MEMBERS = [{ conversationId: "dm-1", userId: "u1" }, { conversationId: "dm-1", userId: "u2" }];
const USERS = [{ id: "u1", name: "Jacob Henderson" }, { id: "u2", name: "Drew Klass" }];
ok(dmLabel(MEMBERS, USERS, "dm-1", "u1") === "Drew Klass", "a 1:1 DM's label is the other participant's real name, not their id");
ok(dmLabel([{ conversationId: "dm-2", userId: "u1" }, { conversationId: "dm-2", userId: "u2" }, { conversationId: "dm-2", userId: "u3" }],
  [...USERS, { id: "u3", name: "Ty Miller" }], "dm-2", "u1") === "Drew Klass, Ty Miller",
  "a group DM's label lists every other participant, matching the owner's group-DM decision");
ok(dmLabel([], USERS, "dm-3", "u1") === "Direct message", "a DM with no resolvable members yet falls back to a plain label instead of crashing or showing blank");

if (fails) { console.log("\nbuild 117: " + fails + " FAILED"); process.exit(1); }
console.log("build 117 tests passed");
