/* Build 35 — session fixes: Roof takeoff fully removed (Jacob's call —
   the company doesn't have takeoff software and didn't want the section
   implying otherwise), the "BY STAGE" dashboard row showing blank labels,
   unread badges forgetting their seen-count on every reload, and the
   bottom nav's raised center "+" reading as a copy of Roofr's tab bar. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- Roof takeoff: completely gone, not just hidden --- */
ok(!/takeoff/i.test(src), "no 'takeoff' reference survives anywhere in the source");
ok(!src.includes("function computeTakeoff"), "the takeoff engine function is gone");
ok(!src.includes("function TabTakeoff"), "the takeoff tab component is gone");
ok(!src.includes("Open roof takeoff"), "the takeoff CTA on Measurements is gone");
/* Removing it should not have taken the rest of Measurements down with it. */
ok(src.includes("function TabMeasure({ job, mut, toast }) {"), "Measurements tab still renders on its own, no takeoff prop");
ok(src.includes("MeasureImport"), "measurement PDF import on the Measurements tab is untouched");

/* --- dashboard "BY STAGE" rows: st.label doesn't exist on a stage object
   (stages carry `.name`), so every row rendered with a blank name next
   to its bar and count. --- */
ok(!/BY STAGE[\s\S]{0,800}\{st\.label\}/.test(src), "the by-stage dashboard row no longer reads the nonexistent st.label field");
ok(/BY STAGE[\s\S]{0,800}\{st\.name\}/.test(src), "the by-stage dashboard row prints the real stage name");

/* --- unread badges: chatSeenCount used to live in plain useState(0)
   and forgot everything on every reload; it was later given a
   per-user localStorage wrapper to survive a reload. Build 119
   replaced that whole scheme with real server-side per-conversation
   read state (crm_chat_members.last_read_at via chat_unread_counts())
   — strictly stronger than localStorage, since it now also survives
   switching devices, which localStorage never could. Assert the
   underlying goal (unread state persists, not tied to one browser's
   local storage) still holds via the new mechanism. */
ok(src.includes('const [unreadCounts, setUnreadCounts] = useState({});'), "unread state is now a real per-conversation map, not a bare seen-index useState(0)");
ok(src.includes('db.rpc("chat_unread_counts")'), "unread counts are read from the server (chat_unread_counts()), which — unlike localStorage — follows a seat across devices");
ok(src.includes('db.from("crm_chat_members").upsert('), "marking a conversation read writes a real server-side row (last_read_at), not a client-only value");
ok(!src.includes("ridgeline.chatSeen."), "the old per-browser localStorage key is gone — no code still writes or reads it");

/* --- bottom nav: no more raised/oversized/drop-shadowed center button.
   The whole point was removing the elevation, not swapping the shape. --- */
ok(!src.includes('transform: "translateY(-6px)"'), "the quick-add button no longer floats above the bar");
ok(!/New lead"[\s\S]{0,300}boxShadow/.test(src), "the quick-add button no longer casts its own drop shadow");
ok(src.includes('aria-label="New lead"'), "the quick-add action itself still exists, just restyled");

if (fails) { console.log("\nbuild 35: " + fails + " FAILED"); process.exit(1); }
console.log("build 35 tests passed");
