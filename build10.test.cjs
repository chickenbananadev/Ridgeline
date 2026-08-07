/* Build 10 — chat emoji reactions, composer tray, home-screen chat. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- reaction toggle semantics --- */
function toggle(msgs, id, emoji, me) {
  return msgs.map((m) => {
    if (m.id !== id) return m;
    const r = { ...(m.reactions || {}) };
    const who = Array.isArray(r[emoji]) ? [...r[emoji]] : [];
    const at = who.indexOf(me);
    if (at >= 0) who.splice(at, 1); else who.push(me);
    if (who.length) r[emoji] = who; else delete r[emoji];
    return { ...m, reactions: r };
  });
}
let msgs = [{ id: "a", reactions: {} }];
msgs = toggle(msgs, "a", "👍", "Jacob");
ok(msgs[0].reactions["👍"].length === 1, "first reaction is recorded");
msgs = toggle(msgs, "a", "👍", "Ty");
ok(msgs[0].reactions["👍"].length === 2, "second person joins the same reaction");
msgs = toggle(msgs, "a", "👍", "Jacob");
ok(msgs[0].reactions["👍"].length === 1 && msgs[0].reactions["👍"][0] === "Ty",
  "tapping again removes only that person");
msgs = toggle(msgs, "a", "👍", "Ty");
ok(msgs[0].reactions["👍"] === undefined, "empty reaction is dropped, not left at zero");
msgs = toggle(msgs, "a", "🔥", "Jacob");
msgs = toggle(msgs, "a", "✅", "Jacob");
ok(Object.keys(msgs[0].reactions).length === 2, "multiple distinct reactions coexist");

/* --- source guarantees --- */
ok(src.includes("const CHAT_EMOJI"), "emoji set defined");
ok(src.includes("const toggleReaction"), "reaction handler exists");
ok(src.includes('aria-label="More reactions"'), "messages expose a full reaction picker");
ok(src.includes("setActionsFor(showActions ? null : m.id)"), "tapping a message reveals its actions");
ok(src.includes("reactions: r.reactions || {}"), "reactions hydrate from the database");
ok(src.includes('db.from("crm_chat").update({ reactions:'), "reactions sync back");
ok(src.includes("const reactionSig"), "only changed reaction maps are written");
ok(src.includes("Team chat lives in the Inbox"), "team chat moved off the home page to the Inbox");
ok(src.includes("setEmojiOpen"), "composer has an emoji tray");

/* --- chat consolidated into the Inbox --- */
ok(src.includes('[["team", "Team chat"], ["customers", "Customers"]]'), "inbox has team and customer panes");
ok(src.includes("unreadChat"), "inbox tracks unread team messages");
/* Build 119 replaced the chatMsgs.length-minus-chatSeenCount index
   math with a real per-conversation totalUnread sum (chatSeenCount
   itself is gone) — match on the still-true substring. */
ok(src.includes('label="Inbox" badge={totalUnread}'), "nav badge counts unread chat");
ok(src.includes('"Schedule", "Appointments'), "More menu leads with a Schedule entry (calendar lives here)");
/* Build 117 renamed TeamChat to ChatThread and added a conversationId
   prop after onDeleteMsg; build 121 appended conversation/
   conversationMembers/onArchiveConversation/onLeaveConversation after
   that — match on the still-true substring rather than the now-stale
   exact-signature-tail string. */
ok(src.includes("embedded = false, onDeleteMsg, conversationId = null"), "ChatThread (formerly TeamChat) is embeddable and can delete");
ok(!src.includes('onBack={() => { setChatSeenCount(chatMsgs.length); setNav("more"); }} />'),
  "standalone chat route no longer renders a separate screen");

if (fails) { console.log("\nbuild 10: " + fails + " FAILED"); process.exit(1); }
console.log("build 10 tests passed");
