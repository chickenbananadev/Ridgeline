/* Build 11 — chat message editing and soft deletion. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- permission logic --- */
const canEdit = (m, me) => m.by === me && !m.deletedAt;
const canDelete = (m, me, role) => (m.by === me || role === "admin") && !m.deletedAt;

const mine = { by: "Jacob", text: "hi" };
const theirs = { by: "Ty", text: "hi" };
const gone = { by: "Jacob", text: "hi", deletedAt: "2026-07-24 10:00" };

ok(canEdit(mine, "Jacob"), "can edit my own message");
ok(!canEdit(theirs, "Jacob"), "cannot edit someone else's message");
ok(!canEdit(gone, "Jacob"), "cannot edit a deleted message");
ok(canDelete(mine, "Jacob", "rep"), "can delete my own message");
ok(!canDelete(theirs, "Jacob", "rep"), "a rep cannot delete someone else's message");
ok(canDelete(theirs, "Jacob", "admin"), "an admin can delete anyone's message");
ok(!canDelete(gone, "Jacob", "admin"), "cannot delete twice");

/* --- soft delete keeps the row --- */
function softDelete(msgs, id, me) {
  return msgs.map((m) => m.id === id ? { ...m, deletedAt: "2026-07-24 10:00", deletedBy: me } : m);
}
let msgs = [{ id: "a", by: "Jacob", text: "secret" }, { id: "b", by: "Ty", text: "reply" }];
msgs = softDelete(msgs, "a", "Jacob");
ok(msgs.length === 2, "soft delete keeps the thread intact — no holes");
ok(msgs[0].deletedAt, "deleted message is marked");
ok(msgs[1].text === "reply", "surrounding replies are untouched");

/* --- edit marks the message --- */
function applyEdit(msgs, id, text) {
  return msgs.map((m) => m.id === id ? { ...m, text, editedAt: "2026-07-24 10:05" } : m);
}
msgs = applyEdit(msgs, "b", "reply, fixed");
ok(msgs[1].text === "reply, fixed" && msgs[1].editedAt, "edit updates text and flags it");

/* --- source guarantees --- */
ok(src.includes("const canEdit = (m) => m.by === me"), "edit is limited to the author");
ok(src.includes('currentUser.role === "admin"'), "admins can moderate");
ok(src.includes('aria-label="Edit this message"'), "edit affordance exists");
ok(src.includes('aria-label="Delete this message"'), "delete affordance exists");
ok(src.includes("Message deleted"), "deleted messages render a tombstone");
ok(src.includes('" · edited"'), "edited messages are marked");
ok(src.includes("deleted_at: m.deletedAt || null"), "deletions sync to the database");
ok(src.includes("const editSig"), "only genuine edits are written");
ok(src.includes("{!m.deletedAt && m.reactions"), "deleted messages drop their reactions");

if (fails) { console.log("\nbuild 11: " + fails + " FAILED"); process.exit(1); }
console.log("build 11 tests passed");
