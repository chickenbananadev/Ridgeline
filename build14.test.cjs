/* Build 14 — Slack-style chat: flat rows, grouped messages, full emoji
   picker, real deletion with author/admin rules. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- emoji catalogue --- */
const groupCount = (src.match(/\["Reactions",|\["Faces",|\["Work",|\["Weather",|\["Other",/g) || []).length;
ok(groupCount === 5, "five emoji groups, got " + groupCount);
ok(src.includes("const EMOJI_GROUPS"), "grouped emoji catalogue exists");
ok(src.includes("function EmojiPicker"), "reusable picker component exists");
ok(src.includes('placeholder="Search reactions, faces, work…"'), "picker is searchable");

/* --- Slack-style layout --- */
ok(src.includes("const grouped = prev && prev.by === m.by && !newDay"),
  "consecutive messages from one person group together");
ok(!src.includes('borderRadius: mine ? "16px 16px 4px 16px"'), "chat bubbles replaced with flat rows");
ok(!src.includes("flexDirection: mine ? \"row-reverse\" : \"row\""), "own messages are no longer right-aligned");
ok(src.includes('borderLeft: mentioned ? "3px solid #E8B931"'), "mentions highlight the whole row");
ok(src.includes("endRef"), "thread scrolls to the newest message");
ok(src.includes("This is the beginning of the channel"), "empty channel has a real empty state");

/* --- deletion is real and permission-gated --- */
ok(src.includes("const canEdit = (m) => m.by === me;"), "only the author edits");
ok(src.includes("const canDelete = (m) => m.by === me || isAdmin;"),
  "author or admin deletes — a rep cannot delete someone else's");
ok(src.includes("(prev || []).filter((m) => m.id !== id)"), "delete removes the message from the thread");
ok(src.includes('db.from("crm_chat").delete().eq("id", id)'), "delete removes the database row");
ok(src.includes("removes the message permanently"), "the confirmation says it is permanent");
ok(src.includes("You are deleting <b>{confirmDel.by}</b>'s message as an admin"),
  "an admin deleting someone else's message is told so");
ok(!src.includes("deleted_at: m.deletedAt"), "soft-delete sync removed");
ok(!src.includes("Message deleted"), "no tombstones anywhere");

/* permission table */
const canDelete = (by, me, role) => by === me || role === "admin";
ok(canDelete("Jacob", "Jacob", "rep"), "rep deletes own");
ok(!canDelete("Ty", "Jacob", "rep"), "rep cannot delete another's");
ok(canDelete("Ty", "Jacob", "admin"), "admin deletes any");

/* --- composer --- */
ok(src.includes('aria-label="Emoji"'), "composer has an emoji control");
ok(src.includes('aria-label="Tag a job"'), "composer can tag a job");
ok(src.includes('aria-label="Send"'), "composer has a send control");

if (fails) { console.log("\nbuild 14: " + fails + " FAILED"); process.exit(1); }
console.log("build 14 tests passed");
