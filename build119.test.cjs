/* Build 119 — real per-conversation unread tracking (part 5, final
   part, of the channels/DMs feature).

   Retires chatSeenCount — a single numeric index into one flat array,
   persisted per-user in localStorage — which had no notion of "N
   conversations, each with its own read state" and could not be
   extended to cover this feature. Replaced with:
   - chat_unread_counts() (the RPC added in build 115) polled whenever
     the chat feed changes, populating a real
     { [conversationId]: { unread, mentions } } map.
   - markConversationRead(): upserts this seat's own crm_chat_members
     row (last_read_at = now) when a conversation is opened, and
     optimistically zeroes that conversation's badge locally so it
     doesn't wait on a round trip.
   - The Inbox pill, bottom-nav Inbox badge, and More-menu mention
     badge all now sum real per-conversation counts instead of doing
     index math against one flat array.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: chatSeenCount is fully retired ---------- */
ok(!/const \[chatSeenCount, setChatSeenCountRaw\] = useState\(0\);/.test(src), "the old chatSeenCount state is gone");
ok(!/ridgeline\.chatSeen\.\$\{currentUser\.id\}/.test(src), "the old per-user localStorage key is no longer written or read anywhere");
ok(!/const setChatSeenCount = /.test(src), "the old setChatSeenCount setter is gone, not left as dead code");
ok(!/onSeenChat/.test(src), "the old blanket 'mark the whole flat feed seen when this pane is open' prop/effect is gone");

/* ---------- static: real per-conversation state replaces it ---------- */
ok(/const \[unreadCounts, setUnreadCounts\] = useState\(\{\}\);/.test(src), "root App tracks real per-conversation unread/mention counts");
ok(/const markConversationRead = \(conversationId\) => \{/.test(src), "markConversationRead exists");
ok(/db\.from\("crm_chat_members"\)\.upsert\(\s*\n\s*\{ conversation_id: conversationId, user_id: currentUser\.id, last_read_at: new Date\(\)\.toISOString\(\) \},\s*\n\s*\{ onConflict: "conversation_id,user_id" \}/.test(src),
  "marking read is a real upsert of this seat's own membership row's last_read_at, matching the column name chat_unread_counts() actually reads");
ok(/setUnreadCounts\(\(prev\) => \(\{ \.\.\.prev, \[conversationId\]: \{ unread: 0, mentions: 0 \} \}\)\);/.test(src),
  "marking a conversation read optimistically zeroes its own badge locally instead of waiting on a round trip");
ok(/const selectConversation = \(id\) => \{ setActiveConversationId\(id\); markConversationRead\(id\); \};/.test(src),
  "selecting a conversation always marks it read in the same action — opening a channel/DM is what clears its badge");
ok(/db\.rpc\("chat_unread_counts"\)\.then\(\(\{ data \}\) => \{/.test(src), "counts are refreshed via the real chat_unread_counts() RPC from migration 031, not recomputed by guessing at local state");
ok(/\}, \[hydrated, currentUser && currentUser\.tenantId, chatMsgs\.length\]\);/.test(src),
  "the count refresh re-fires whenever the chat feed actually changes, not just once on mount");

/* ---------- static: badges sum real counts instead of doing index math ---------- */
ok(/const totalUnread = Object\.values\(unreadCounts\)\.reduce\(\(s, c\) => s \+ \(c\.unread \|\| 0\), 0\);/.test(src), "totalUnread sums every conversation's real unread count");
ok(/const totalMentions = Object\.values\(unreadCounts\)\.reduce\(\(s, c\) => s \+ \(c\.mentions \|\| 0\), 0\);/.test(src), "totalMentions sums every conversation's real mention count");
ok(/unreadChat=\{totalUnread\}/.test(src), "the Inbox pill's badge now uses the real total, not chatMsgs.length minus a seen-index");
ok(/<NavBtn id="inbox" icon=\{MessageCircle\} label="Inbox" badge=\{totalUnread\}/.test(src), "the bottom-nav Inbox badge uses the real total");
ok(/<NavBtn id="more" icon=\{Menu\} label="More" badge=\{totalMentions\}/.test(src), "the More-menu mention badge uses the real total, not the old chatSeenCount-sliced computation");
ok(/onSelectConversation=\{selectConversation\}/.test(src), "the root wires selectConversation (mark-read + activate) into Inbox, not a bare setActiveConversationId that would never mark anything read");
ok(/unreadCounts=\{unreadCounts\}/.test(src), "per-conversation counts are threaded down to ConversationList for the per-pill indicator");

/* ---------- static: ConversationList shows a per-conversation indicator ---------- */
ok(/function ConversationList\(\{ conversations, conversationMembers, activeConversationId, onSelect, users, currentUser, onCreateChannel, onStartDm, unreadCounts = \{\} \}\)/.test(src),
  "ConversationList accepts unreadCounts");
ok(/const unread = \(unreadCounts\[c\.id\] \|\| \{\}\)\.unread \|\| 0;/.test(src), "each pill looks up its own conversation's unread count safely (no crash if missing)");
ok(/\{unread > 0 && c\.id !== activeConversationId \? ` · \$\{unread\}` : ""\}/.test(src),
  "a pill only shows its unread count when it's actually unread AND not the one currently open (an open conversation's badge is already cleared)");

/* ---------- behavioral: mirror the total-sum reducers ---------- */
function totalUnread(counts) { return Object.values(counts).reduce((s, c) => s + (c.unread || 0), 0); }
function totalMentions(counts) { return Object.values(counts).reduce((s, c) => s + (c.mentions || 0), 0); }
const COUNTS = { "general-t1": { unread: 3, mentions: 1 }, "dm-1": { unread: 2, mentions: 0 } };
ok(totalUnread(COUNTS) === 5, "total unread sums across every conversation, not just the active one");
ok(totalMentions(COUNTS) === 1, "total mentions sums across every conversation too");
ok(totalUnread({}) === 0 && totalMentions({}) === 0, "no known conversations yet means zero badges, not NaN or a crash");

/* ---------- behavioral: mirror the RPC-row-to-state mapping ---------- */
function mapRpcRows(rows) {
  const next = {};
  rows.forEach((r) => { next[r.conversation_id] = { unread: Number(r.unread_count) || 0, mentions: Number(r.mention_count) || 0 }; });
  return next;
}
const mapped = mapRpcRows([{ conversation_id: "general-t1", unread_count: "3", mention_count: "1" }]);
ok(mapped["general-t1"].unread === 3 && mapped["general-t1"].mentions === 1,
  "RPC rows (unread_count/mention_count, possibly numeric-as-string from Postgres) map cleanly into the client's {unread, mentions} shape");
ok(mapRpcRows([{ conversation_id: "x", unread_count: null, mention_count: null }])["x"].unread === 0,
  "a null count from the RPC becomes 0, never NaN, so the badge never renders garbage");

/* ---------- behavioral: mirror markConversationRead's optimistic zero-out ---------- */
function optimisticMarkRead(prev, conversationId) { return { ...prev, [conversationId]: { unread: 0, mentions: 0 } }; }
const afterMarkRead = optimisticMarkRead(COUNTS, "general-t1");
ok(afterMarkRead["general-t1"].unread === 0 && afterMarkRead["general-t1"].mentions === 0, "marking a conversation read zeroes exactly that conversation's badge");
ok(afterMarkRead["dm-1"].unread === 2, "marking one conversation read never touches another conversation's still-real unread count");

if (fails) { console.log("\nbuild 119: " + fails + " FAILED"); process.exit(1); }
console.log("build 119 tests passed");
