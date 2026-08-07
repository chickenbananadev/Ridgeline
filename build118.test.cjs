/* Build 118 — per-conversation realtime + scoped hydrate (part 4 of
   the channels/DMs feature).

   Two changes to useDbSync, both about scope rather than new
   capability — the functional pieces (channels, DMs, privacy) already
   shipped in builds 115-117:

   1. Hydrate's chat fetch used to be one unconditional
      `.order("at").limit(300)` company-wide regardless of channel —
      a busy #general could crowd a quieter DM's history out of that
      shared cap. It now scopes to `.in("conversation_id", <ids this
      seat can see>)` with a higher cap, falling back to the old
      unscoped query only for the rare tenant-less session where
      there's no conversation list yet to scope by.
   2. The single "crm-stream" realtime channel used to subscribe to
      every tenant's crm_chat INSERTs unfiltered, relying entirely on
      chat_read's RLS to keep it private (the same mechanism that
      already made this safe — Supabase filters postgres_changes
      payloads by the subscriber's own SELECT policy). It now adds a
      `tenant_id=eq.<id>` filter (bandwidth hygiene, not a new security
      fix) and, as a real functional fix landing alongside the
      refactor, now also subscribes UPDATE — a teammate's reaction,
      edit, or delete on an already-loaded message never used to show
      live before this build; only a full reload picked it up.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: hydrate scopes the chat fetch to visible conversations ---------- */
ok(/let visibleConvIds = null;/.test(src), "hydrate tracks which conversation ids this seat can see, defaulting to null (not yet scoped)");
ok(/visibleConvIds = convRows\.map\(\(r\) => r\.id\);/.test(src), "visibleConvIds is populated from the conversations this seat's RLS actually returned");
ok(/const chatQuery = visibleConvIds\s*\n\s*\? db\.from\("crm_chat"\)\.select\("\*"\)\.in\("conversation_id", visibleConvIds\)\.order\("at", \{ ascending: true \}\)\.limit\(1000\)\s*\n\s*: db\.from\("crm_chat"\)\.select\("\*"\)\.order\("at", \{ ascending: true \}\)\.limit\(300\);/.test(src),
  "the chat fetch scopes to visible conversation ids when known, with the old unscoped query kept only as a tenant-less fallback");
ok(/const \{ data: chatRows \} = await chatQuery;/.test(src), "the scoped/fallback query is actually the one awaited and used");

/* ---------- static: realtime channel is tenant-filtered and covers UPDATE ---------- */
const rtStart = src.indexOf('/* ---------- realtime: chat + activity from other devices');
const rtSrc = src.slice(rtStart, rtStart + 2600);
ok(/if \(!db \|\| !ready \|\| !tenantId\) return;/.test(rtSrc), "the realtime effect now requires a known tenantId before subscribing at all");
ok(/const upsertFromRow = \(r\) => \(\{/.test(rtSrc), "INSERT and UPDATE share one row-mapping helper instead of two copies of the same object shape");
ok(/event: "INSERT", schema: "public", table: "crm_chat", filter: `tenant_id=eq\.\$\{tenantId\}`/.test(rtSrc),
  "the crm_chat INSERT subscription is now tenant-filtered instead of company-wide unfiltered");
ok(/event: "UPDATE", schema: "public", table: "crm_chat", filter: `tenant_id=eq\.\$\{tenantId\}`/.test(rtSrc),
  "crm_chat UPDATE (reactions/edits) is now subscribed too — this is the real functional fix, not just a scoping change");
ok(/setChatMsgs\(\(prev\) => prev\.some\(\(m\) => m\.id === r\.id\) \? prev\.map\(\(m\) => \(m\.id === r\.id \? upsertFromRow\(r\) : m\)\) : prev\);/.test(rtSrc),
  "an UPDATE only ever replaces the one matching message, and is a safe no-op if that message isn't loaded locally");
ok(/\}, \[ready, tenantId\]\);/.test(rtSrc), "the effect re-subscribes if tenantId changes (e.g. after login resolves it)");
ok(/event: "INSERT", schema: "public", table: "crm_activity" \}, \(payload\)/.test(rtSrc),
  "the unrelated crm_activity subscription is left exactly as it was — this build only touches the crm_chat leg");

/* ---------- behavioral: mirror the hydrate scoping fallback decision ---------- */
function chooseChatQuery(visibleConvIds) {
  return visibleConvIds ? { scoped: true, ids: visibleConvIds, limit: 1000 } : { scoped: false, limit: 300 };
}
ok(chooseChatQuery(["general-t1", "dm-1"]).scoped === true, "a known conversation list scopes the fetch by those ids");
ok(chooseChatQuery(null).scoped === false, "no known conversation list (tenant-less session) falls back to the old unscoped fetch, not an empty result");
ok(chooseChatQuery(["general-t1"]).limit === 1000 && chooseChatQuery(null).limit === 300,
  "the scoped path raises the cap since it's now per-seat-visible history, not a single global feed's cap");

/* ---------- behavioral: mirror the realtime UPDATE merge logic ---------- */
function applyRealtimeUpdate(prev, row) {
  const upsertFromRow = (r) => ({ id: r.id, text: r.body, reactions: r.reactions || {} });
  return prev.some((m) => m.id === row.id) ? prev.map((m) => (m.id === row.id ? upsertFromRow(row) : m)) : prev;
}
const LOADED = [{ id: "cm1", text: "hi", reactions: {} }, { id: "cm2", text: "yo", reactions: {} }];
const afterReaction = applyRealtimeUpdate(LOADED, { id: "cm1", body: "hi", reactions: { "👍": ["Drew"] } });
ok(afterReaction.find((m) => m.id === "cm1").reactions["👍"].length === 1, "a live reaction UPDATE from another seat is applied to the right message");
ok(afterReaction.find((m) => m.id === "cm2").text === "yo", "an UPDATE to one message never touches an unrelated message already loaded");
const updateForUnloaded = applyRealtimeUpdate(LOADED, { id: "cm-not-loaded", body: "x", reactions: {} });
ok(updateForUnloaded === LOADED, "an UPDATE for a message this session never loaded is a safe no-op, not an error or a phantom insert");

if (fails) { console.log("\nbuild 118: " + fails + " FAILED"); process.exit(1); }
console.log("build 118 tests passed");
