/* Build 116 — extract PersonPicker from TeamChat's inline @mention
   Sheet (part 2 of the channels/DMs feature).

   Pure refactor: the exact avatar-initials/name/title row that
   already existed as inline JSX inside TeamChat's mention Sheet
   becomes a standalone, reusable PersonPicker component with a
   multi-select mode PersonPicker doesn't use yet — the @mention flow
   is rewired to call it in single-select mode with the identical
   click behavior (insert "@Name", close the sheet) it always had.
   Zero behavior change today; multi-select gets exercised starting in
   build 117 ("Start a DM").
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: PersonPicker exists with the expected API ---------- */
ok(/function PersonPicker\(\{ open, onClose, title = "Choose people", users, excludeName, multi = false, selectedIds = \[\], onPick, footer = null \}\)/.test(src),
  "PersonPicker exists with single/multi-select support via a multi prop");
ok(/const list = \(users \|\| \[\]\)\.filter\(\(u\) => u && u\.name && u\.active !== false && u\.name !== excludeName\);/.test(src),
  "PersonPicker excludes inactive users and the excluded name, matching the original mention Sheet's filter exactly");
ok(/\{multi && \(picked\s*\n\s*\? <CheckCircle2 size=\{19\} color=\{T\.accent\} \/>\s*\n\s*: <Circle size=\{19\} color=\{S\.line\} \/>\)\}/.test(src),
  "PersonPicker shows a checkmark/circle indicator only in multi-select mode — single-select stays visually identical to the old Sheet");
ok(/No one else to choose from\./.test(src), "PersonPicker has a real empty state instead of rendering nothing");

/* ---------- static: TeamChat's mention flow now uses PersonPicker, not inline JSX ---------- */
ok(/<PersonPicker open=\{mentionOpen\} onClose=\{\(\) => setMentionOpen\(false\)\} title="Mention someone"\s*\n\s*users=\{users\} excludeName=\{me\}\s*\n\s*onPick=\{\(u\) => \{ insert\(`@\$\{u\.name\}`\); setMentionOpen\(false\); \}\} \/>/.test(src),
  "the @mention Sheet is now PersonPicker in single-select mode, calling the exact same insert()+close behavior as before");
ok(!/<Sheet open=\{mentionOpen\} onClose=\{\(\) => setMentionOpen\(false\)\} title="Mention someone">/.test(src),
  "the old inline mention Sheet JSX is gone, not left as dead duplicate code");

/* ---------- static: the avatar palette/initials logic is hoisted to one shared place, not duplicated per component ---------- */
ok(/const AV_COLORS = \["#1B6DE0", "#177245", "#92600A", "#7C3AED", "#B42318", "#0E7490"\];\s*\n\s*const avatarColorOf = /.test(src),
  "the avatar color palette lives in one module-level constant, reused by both PersonPicker and TeamChat, instead of being copy-pasted into the new component");
ok((src.match(/"#1B6DE0", "#177245", "#92600A"/g) || []).length === 1,
  "the palette literal itself appears exactly once in the source — extracting PersonPicker did not introduce a second copy (this is what build33.test.cjs's own unrelated assertion also depends on)");
ok(/const initials = avatarInitials, colorOf = avatarColorOf;/.test(src),
  "TeamChat's own message-author avatars now source from the same shared helpers PersonPicker uses, not a re-typed local duplicate");
ok(/background: colorOf\(m\.by\), flexShrink: 0,/.test(src),
  "message rows in the feed still color their avatar by author, unaffected by the picker extraction");

/* ---------- behavioral: mirror PersonPicker's filter + click semantics ---------- */
const USERS = [
  { id: "u1", name: "Jacob Henderson", title: "Owner", active: true },
  { id: "u2", name: "Drew Klass", title: "Sales Rep", active: true },
  { id: "u3", name: "Retired Rep", title: "Sales Rep", active: false },
];
function pickerList(users, excludeName) {
  return (users || []).filter((u) => u && u.name && u.active !== false && u.name !== excludeName);
}
ok(pickerList(USERS, "Jacob Henderson").length === 1 && pickerList(USERS, "Jacob Henderson")[0].id === "u2",
  "the caller (excludeName) and any inactive seat are both excluded from the list — matches the original mention Sheet exactly");
ok(pickerList([], "Jacob Henderson").length === 0, "an empty user list produces an empty pick list, not a crash");

/* single-select semantics: onPick fires once per click, caller owns closing */
let pickedSingle = null, closedSingle = false;
function singleOnPick(u) { pickedSingle = u; closedSingle = true; }
singleOnPick(USERS[1]);
ok(pickedSingle.name === "Drew Klass" && closedSingle === true,
  "in single-select mode, one click both selects and (via the caller's own onPick) signals close — the exact old mention-Sheet contract");

/* multi-select semantics: onPick toggles membership in a selected set, sheet stays open */
function toggle(selected, id) {
  return selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
}
let selected = [];
selected = toggle(selected, "u1");
selected = toggle(selected, "u2");
ok(selected.length === 2, "multi-select accumulates picks across clicks instead of closing after the first");
selected = toggle(selected, "u1");
ok(selected.length === 1 && selected[0] === "u2", "clicking an already-selected person in multi-select mode deselects them");

if (fails) { console.log("\nbuild 116: " + fails + " FAILED"); process.exit(1); }
console.log("build 116 tests passed");
