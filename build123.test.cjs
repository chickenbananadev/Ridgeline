/* Build 123 — three fix groups out of the full-site verification pass
   the owner requested after the chat RLS recursion bug (033) proved
   this class of silent failure could hide for months.

   GROUP 1 — portal customer writes, dead since migration 018.
   018 dropped crm_portal's anon SELECT policy (closing a real
   enumeration hole) and moved customer READS behind token-argument
   RPCs — but the two anon INSERT policies from 006/008 validate their
   token with a raw `exists (select 1 from crm_portal ...)` subquery
   that runs under the CALLER's RLS. Zero visible rows for anon since
   018 → both policies permanently false → every homeowner write
   (portal chat, review feedback, quote/change requests, contact
   updates) silently rejected. Reproduced against production with a
   real valid token before fixing. Migration 025 fixed this exact
   defect for crm_signatures; 034 now applies the same cure here,
   plus tenant stamping (an anon insert has no current_tenant_id(),
   so rows landed tenant-less and invisible to the team's tenant-
   scoped reads) and a portal_get_requests() RPC for customer reads
   (anon has had no SELECT policy on crm_portal_requests since 015 —
   the request list and contact-card pending check read nothing).

   GROUP 2 — chat's five silent-swallow error paths. Message send,
   reactions, edits, mark-read, and delete all discarded their
   errors — the exact masking that hid the 033 recursion bug and the
   018 portal bug. All five now surface through the existing sync-
   error banner. Also fixes a latent crash: root App's deleteJobs
   called setSyncErr without ever receiving it from useDbSync.

   GROUP 3 — realtime gaps. crm_chat_conversations and
   crm_chat_members were added to the realtime publication in 031 but
   never subscribed client-side (new channels/DMs didn't appear until
   reload), and crm_chat had no DELETE handler (a message deleted on
   another device lingered until reload). Dead flat-chat plumbing on
   Dashboard (chatMsgs/onSendChat, whose handler built messages with
   no conversationId — invisible in every channel) is removed. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const migSrc = fs.readFileSync(path.join(__dirname, "supabase/migrations/034_fix_portal_customer_writes.sql"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ========== GROUP 1: migration 034 ========== */
ok(/create policy pmsg_insert_customer on crm_portal_msgs for insert to anon\s*\n\s*with check \(by_role = 'customer' and portal_token_valid\(token, job_id\)\);/.test(migSrc),
  "customer message inserts validate their token through portal_token_valid() (SECURITY DEFINER, 025's cure), not a raw subquery blinded by 018");
ok(/create policy portal_requests_customer_insert on crm_portal_requests for insert to anon\s*\n\s*with check \(status = 'New' and portal_token_valid\(token, job_id\)\);/.test(migSrc),
  "customer request inserts get the same cure");
ok(/create or replace function set_portal_tenant_id\(\) returns trigger/.test(migSrc) &&
   /select p\.tenant_id into new\.tenant_id from crm_portal p where p\.token = new\.token;/.test(migSrc),
  "tenant stamping falls back to the portal row's tenant when the writer is anonymous, so customer rows are visible to the team's tenant-scoped reads");
ok(/create or replace function portal_get_requests\(p_token text\)\s*\nreturns setof crm_portal_requests/.test(migSrc) &&
   /security definer/.test(migSrc.slice(migSrc.indexOf("portal_get_requests"))),
  "customer reads of their requests go through a token-argument security-definer RPC — a plain anon SELECT policy would reopen 018's enumeration hole");
ok(/grant execute on function portal_get_requests\(text\) to anon, authenticated;/.test(migSrc),
  "the RPC is callable by the anonymous portal visitor");
ok(/update crm_portal_msgs m set tenant_id = p\.tenant_id/.test(migSrc) && /update crm_portal_requests r set tenant_id = p\.tenant_id/.test(migSrc),
  "existing tenant-less rows are backfilled from their portal row");

/* ---------- client: customer reads route through the RPC ---------- */
ok(/if \(role === "customer"\) \{\s*\n\s*db\.rpc\("portal_get_requests", \{ p_token: token \}\)/.test(src),
  "PortalRequestCenter's customer read uses the RPC; staff keep the tenant-scoped direct select");
ok(/db\.rpc\("portal_get_requests", \{ p_token: token \}\)\s*\n\s*\.then\(\(\{ data \}\) => \{\s*\n\s*if \(!alive \|\| !data\) return;\s*\n\s*const latest = data\.find\(\(r\) => r\.request_type === "contact_update"\);/.test(src),
  "PortalContactCard's pending-change check uses the RPC too (it's customer-only)");
ok(/setSubmitErr\("That didn't send\. Please try again, or call us instead\."\);/.test(src),
  "a failed quote-request submit shows a real error instead of silently doing nothing");

/* ========== GROUP 2: chat error surfacing ========== */
ok(/setSyncErr\("A chat message couldn't be sent — it shows on this device only\. " \+ \(error\.message \|\| ""\)\);/.test(src),
  "a failed chat message insert surfaces in the sync-error banner");
ok((src.match(/A reaction couldn't be saved — it shows on this device only\./g) || []).length >= 1,
  "a failed reaction write surfaces");
ok((src.match(/A message edit couldn't be saved — it shows on this device only\./g) || []).length >= 1,
  "a failed edit write surfaces");
ok(/setSyncErr\("Couldn't mark that conversation read — its unread count may reappear\. " \+ \(error\.message \|\| ""\)\);/.test(src),
  "a failed mark-read upsert surfaces (the optimistic badge zero-out no longer hides it)");
ok(/setSyncErr\("Couldn't delete that chat message — it will reappear on reload\./.test(src),
  "a failed message delete surfaces instead of quietly resurrecting on reload");
ok(!/db\.from\("crm_chat"\)\.update\(\{ reactions: m\.reactions \|\| \{\} \}\)\.eq\("id", m\.id\)\s*\n\s*\.then\(\(\) => \{\}, \(\) => \{\}\);/.test(src),
  "the old swallow-everything reaction handler is gone");
ok(/return \{ hydrated, syncErr, setSyncErr \};/.test(src),
  "useDbSync returns setSyncErr — root App's deleteJobs was already calling it without receiving it, a latent ReferenceError on portal-revoke failure");
ok(/const \{ hydrated, syncErr, setSyncErr \} = useDbSync\(\{/.test(src),
  "root App actually receives setSyncErr");

/* ========== GROUP 3: realtime + dead code ========== */
ok(/event: "DELETE", schema: "public", table: "crm_chat" \}/.test(src),
  "a message deleted on another device now disappears live instead of lingering until reload");
ok(/event: "INSERT", schema: "public", table: "crm_chat_conversations", filter: `tenant_id=eq\.\$\{tenantId\}`/.test(src),
  "a channel/DM created by a teammate now appears live (031 published these tables but nothing ever subscribed)");
ok(/event: "UPDATE", schema: "public", table: "crm_chat_conversations", filter: `tenant_id=eq\.\$\{tenantId\}`/.test(src),
  "archiving a channel on another device removes it live");
ok(/event: "INSERT", schema: "public", table: "crm_chat_members" \}/.test(src) && /event: "DELETE", schema: "public", table: "crm_chat_members" \}/.test(src),
  "membership changes (added to a DM, someone leaves) sync live");
ok(!/chatMsgs = \[\], onSendChat,/.test(src),
  "Dashboard's dead flat-chat props are gone — its onSendChat handler built messages with no conversationId, invisible in every channel");
ok(!/onSendChat=\{\(text\) => \{/.test(src),
  "the root App no longer wires the dead onSendChat handler");

/* ========== behavioral: mirror the new realtime handlers ========== */
function onConvInsert(prev, r) {
  if (r.archived_at) return prev;
  return prev.some((c) => c.id === r.id) ? prev : [...prev, {
    id: r.id, kind: r.kind, name: r.name, topic: r.topic,
    isPrivate: !!r.is_private, createdBy: r.created_by, createdAt: r.created_at,
  }];
}
function onConvUpdate(prev, r) {
  if (r.archived_at) return prev.filter((c) => c.id !== r.id);
  return prev.map((c) => c.id === r.id ? { ...c, name: r.name, topic: r.topic, isPrivate: !!r.is_private } : c);
}
const CONVS = [{ id: "general-t1", kind: "channel", name: "general", isPrivate: false }];
const added = onConvInsert(CONVS, { id: "dm-9", kind: "dm", name: null, topic: null, is_private: true, created_by: "u2", created_at: "2026-08-07" });
ok(added.length === 2 && added[1].isPrivate === true, "a teammate's new DM lands in the list live, mapped to the client shape");
ok(onConvInsert(added, { id: "dm-9", kind: "dm", is_private: true }).length === 2, "a duplicate INSERT event (own optimistic add already applied) never double-lists a conversation");
ok(onConvInsert(CONVS, { id: "chan-x", kind: "channel", archived_at: "2026-08-07T00:00:00Z" }).length === 1, "an already-archived conversation never appears");
const archived = onConvUpdate(added, { id: "dm-9", archived_at: "2026-08-07T00:00:00Z" });
ok(archived.length === 1 && archived[0].id === "general-t1", "an archive on another device removes exactly that conversation, nothing else");
ok(onConvUpdate(added, { id: "general-t1", kind: "channel", name: "general", topic: "New topic", is_private: false })[0].topic === "New topic",
  "a topic edit on another device updates in place");

function onMemberDelete(prev, r) {
  return prev.filter((m) => !(m.conversationId === r.conversation_id && m.userId === r.user_id));
}
const MEMS = [{ conversationId: "dm-9", userId: "u1" }, { conversationId: "dm-9", userId: "u2" }];
ok(onMemberDelete(MEMS, { conversation_id: "dm-9", user_id: "u2" }).length === 1, "someone leaving a DM removes only their own membership row");
ok(onMemberDelete(MEMS, { conversation_id: "dm-other", user_id: "u1" }).length === 2, "a leave event for a different conversation touches nothing");

if (fails) { console.log("\nbuild 123: " + fails + " FAILED"); process.exit(1); }
console.log("build 123 tests passed");
