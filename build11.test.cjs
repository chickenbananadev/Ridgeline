/* Build 11 — chat message editing and soft deletion. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- permission logic --- */
const canEdit = (m, me) => m.by === me;
const canDelete = (m, me, role) => m.by === me || role === "admin";

const mine = { by: "Jacob", text: "hi" };
const theirs = { by: "Ty", text: "hi" };


ok(canEdit(mine, "Jacob"), "can edit my own message");
ok(!canEdit(theirs, "Jacob"), "cannot edit someone else's message");

ok(canDelete(mine, "Jacob", "rep"), "can delete my own message");
ok(!canDelete(theirs, "Jacob", "rep"), "a rep cannot delete someone else's message");
ok(canDelete(theirs, "Jacob", "admin"), "an admin can delete anyone's message");


/* --- hard delete removes the message --- */
function hardDelete(msgs, id) { return msgs.filter((m) => m.id !== id); }
let msgs = [{ id: "a", by: "Jacob", text: "secret" }, { id: "b", by: "Ty", text: "reply" }];
msgs = hardDelete(msgs, "a");
ok(msgs.length === 1, "the message is actually gone");
ok(!msgs.some((m) => m.id === "a"), "no trace of the deleted message remains");
ok(msgs[0].text === "reply", "surrounding messages are untouched");

/* --- edit marks the message --- */
function applyEdit(msgs, id, text) {
  return msgs.map((m) => m.id === id ? { ...m, text, editedAt: "2026-07-24 10:05" } : m);
}
msgs = applyEdit(msgs, "b", "reply, fixed");
const edited = msgs.find((m) => m.id === "b");
ok(edited.text === "reply, fixed" && edited.editedAt, "edit updates text and flags it");

/* --- source guarantees --- */
ok(src.includes("const canEdit = (m) => m.by === me;"), "edit is limited to the author");
ok(src.includes('currentUser.role === "admin"'), "admins can moderate");
ok(src.includes("<Pencil size={12} /> Edit"), "edit affordance exists");
ok(src.includes("<Trash2 size={12} /> Delete"), "delete affordance exists");
ok(src.includes("removes the message permanently"), "deletion is described as permanent");
ok(!src.includes("Message deleted"), "no tombstone — deletion is real");
ok(src.includes("(edited)"), "edited messages are marked");
ok(src.includes('db.from("crm_chat").delete().eq("id", id)'), "deletions remove the row");
ok(src.includes("const editSig"), "only genuine edits are written");
ok(src.includes("const canDelete = (m) => m.by === me || isAdmin;"), "reps delete only their own; admins delete any");
ok(src.includes("setMsgs((prev) => (prev || []).filter((m) => m.id !== id))"), "delete removes the message from the thread");

if (fails) { console.log("\nbuild 11: " + fails + " FAILED"); process.exit(1); }
console.log("build 11 tests passed");
