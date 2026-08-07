/* Build 124 — the subcontractor crew portal (owner decision, deferred
   from the crew-financial-leak work and now built).

   Model: "the crew is the subcontractor" — admins/reps are the
   company, subs get a per-job token link, not a login or a paid seat.
   The portal reuses crm_portal's entire token/snapshot/RPC machinery
   (018's anti-enumeration posture included) with one new audience
   discriminator ('customer' | 'crew', migration 035). Scope, per the
   owner: work order, punch list, notes/communication, photo uploads —
   with WRITE parity (check punch items off, upload photos, message
   the office) and never any financial data. Privacy is by
   construction: no dollar figure is ever placed in the crew snapshot,
   so there is nothing to hide or leak.

   Server side (035, applied to production and verified there as the
   anon role before this file was written): crew_portal_update_punch
   flips one punch item on the REAL job and mirrors it into the
   snapshot so the crew's own reload agrees; crew_portal_add_photo
   appends a size-capped inline photo to the job's album (tagged
   source:'crew-portal') and mirrors it; the portal-thread insert
   policy and by_role CHECK constraint widen to include 'crew' (the
   constraint was caught DURING live verification — policy alone
   wasn't enough). */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const migSrc = fs.readFileSync(path.join(__dirname, "supabase/migrations/035_crew_portal.sql"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ========== migration 035 ========== */
ok(/alter table crm_portal add column if not exists audience text not null default 'customer';/.test(migSrc),
  "crm_portal gains the audience discriminator; every existing row stays 'customer'");
ok(/check \(audience in \('customer','crew'\)\)/.test(migSrc), "audience is constrained to the two real values");
ok(/add constraint crm_portal_msgs_by_role_check check \(by_role in \('customer','team','crew'\)\)/.test(migSrc),
  "006's by_role CHECK constraint widens to include 'crew' — the policy alone wasn't enough (caught live)");
ok(/with check \(by_role in \('customer','crew'\) and portal_token_valid\(token, job_id\)\)/.test(migSrc),
  "the anon thread-insert policy accepts crew messages, still token-validated through 025's cure");
ok(/create or replace function crew_portal_update_punch\(p_token text, p_item_id text, p_done boolean, p_by text default null\)/.test(migSrc) &&
   /security definer/.test(migSrc.slice(migSrc.indexOf("crew_portal_update_punch"))),
  "punch check-off is a token-gated security-definer RPC, never a raw table policy an anon visitor could probe");
ok(/where p\.token = p_token and p\.revoked = false and p\.audience = 'crew';/.test(migSrc),
  "both crew RPCs refuse revoked tokens and refuse CUSTOMER tokens — a homeowner's link can never flip punch items");
ok((migSrc.match(/update crm_jobs j set data = jsonb_set/g) || []).length === 2 &&
   (migSrc.match(/update crm_portal p set data = jsonb_set/g) || []).length === 2,
  "each crew write lands in BOTH the real job and the snapshot, so the crew's own reload agrees without waiting for an office re-snapshot");
ok(/if length\(p_data_url\) > 2500000 then/.test(migSrc) && /p_data_url !~ '\^data:image\/'/.test(migSrc),
  "photo uploads are size-capped and content-type-checked server-side");
ok(/'source', 'crew-portal'/.test(migSrc), "crew photos are tagged with their origin in the job's album");
ok(/grant execute on function crew_portal_update_punch\(text, text, boolean, text\) to anon, authenticated;/.test(migSrc) &&
   /grant execute on function crew_portal_add_photo\(text, text, text, text\) to anon, authenticated;/.test(migSrc),
  "both RPCs are callable by the anonymous crew visitor");

/* ========== snapshot builder: crew-scoped, no money by construction ========== */
const bcpStart = src.indexOf("function buildCrewPortalSnapshot(job, brand, token, crew) {");
ok(bcpStart !== -1, "buildCrewPortalSnapshot exists");
const bcpSrc = src.slice(bcpStart, src.indexOf("\n}", bcpStart) + 2);
ok(/audience: "crew",/.test(bcpSrc), "the snapshot declares its audience — the client branches on this");
["fin", "payments", "estimate", "contract", "price", "commission", "invoice", "deductible", "balance"].forEach((word) => {
  ok(!new RegExp(`\\b${word}\\b`, "i").test(bcpSrc),
    `no financial field ('${word}') exists anywhere in the crew snapshot builder — privacy by construction, not by hiding`);
});
ok(/punch: \(job\.punch \|\| \[\]\)\.map/.test(bcpSrc), "the punch list rides in the snapshot");
ok(/workOrder: \{/.test(bcpSrc) && /materials: \(generateRoofingMaterials\(m\) \|\| \[\]\)\.map\(\(x\) => \(\{ item: x\.item, qty: x\.qty, unit: x\.unit \}\)\)/.test(bcpSrc),
  "work order + materials ride along, materials stripped to item/qty/unit (the printed work order's own no-pricing convention)");
ok(/\.filter\(\(ph\) => ph\.source === "crew-portal"\)\.slice\(-12\)/.test(bcpSrc),
  "only the crew's own uploads are exposed (not the office album), capped so inline data-URLs can't bloat the snapshot");

/* ========== PublicPortal branches by audience; PublicCrewPortal renders ========== */
ok(/if \(d\.audience === "crew"\) return <PublicCrewPortal d=\{d\} token=\{token\} \/>;/.test(src),
  "one ?portal= entry point serves both audiences — the snapshot decides which surface renders");
const pcpStart = src.indexOf("function PublicCrewPortal({ d, token }) {");
ok(pcpStart !== -1, "PublicCrewPortal exists");
const pcpSrc = src.slice(pcpStart, src.indexOf("\nfunction PublicPortal", pcpStart));
ok(/db\.rpc\("crew_portal_update_punch", \{\s*\n\s*p_token: token, p_item_id: p\.id, p_done: next, p_by: d\.crewName \|\| "Crew",\s*\n\s*\}\)/.test(pcpSrc),
  "tapping a punch item calls the real RPC with the crew's name for the doneBy stamp");
ok(/setPunch\(\(prev\) => prev\.map\(\(x\) => x\.id === p\.id \? \{ \.\.\.x, done: p\.done, doneBy: p\.doneBy \|\| null \} : x\)\);\s*\n\s*setPunchErr\("That didn't save/.test(pcpSrc),
  "a failed check-off REVERTS and says so — never left looking done (the 018/033/034 lesson)");
ok(/downscaleImageFile\(file, 1280, 0\.78\)/.test(pcpSrc) && /db\.rpc\("crew_portal_add_photo"/.test(pcpSrc),
  "photo uploads downscale client-side then go through the token-gated RPC — no Storage policy opens to anon");
ok(/<PortalThread token=\{token\} meRole="crew" meName=\{d\.crewName \|\| "Crew"\} accent=\{prim\} \/>/.test(pcpSrc),
  "crew↔office messaging reuses the existing portal thread under the crew token");

/* ========== PortalThread treats crew like the anon side ========== */
ok(/if \(meRole !== "team"\) \{\s*\n\s*db\.rpc\("portal_get_messages", \{ p_token: token \}\)/.test(src),
  "every non-staff reader (customer OR crew) loads the thread through the token-argument RPC");
ok(!/if \(meRole === "customer"\) \{\s*\n\s*db\.rpc\("portal_get_messages"/.test(src),
  "the old customer-only branch is gone — crew would have fallen into the staff path and read nothing");

/* ========== office side: create/copy/revoke + auto re-snapshot ========== */
ok(/const publishCrewPortal = async \(\) => \{/.test(src) && /buildCrewPortalSnapshot\(job, brand, tok, crew\)/.test(src),
  "TabWorkOrder can mint the crew link, mirroring TabPortal's publish shape (demo branch included)");
ok(/const revokeCrewPortal = async \(\) => \{/.test(src) && /crewPortalToken: null/.test(src),
  "the crew link can be disabled, same as the customer link");
ok(/const crewPublished = changed\.filter\(\(j\) => j\.crewPortalToken\);/.test(src) &&
   /buildCrewPortalSnapshot\(j, st\.brandRef, j\.crewPortalToken,\s*\n\s*\(\(st\.crewsRef \|\| \[\]\)\.find\(\(c\) => c\.id === j\.crewId\) \|\| null\)\)/.test(src),
  "every office-side job save re-snapshots a live crew portal — new punch items and work-order changes reach the sub without re-publishing");
ok(/crewsRef: crews,/.test(src), "the crews roster is threaded into the sync hook for the re-snapshot's crew name");

/* ========== behavioral: mirror the punch toggle's optimistic/revert logic ========== */
function applyToggle(punch, id, next, crewName) {
  return punch.map((x) => x.id === id ? { ...x, done: next, doneBy: next ? crewName : null } : x);
}
function revertToggle(punch, original) {
  return punch.map((x) => x.id === original.id ? { ...x, done: original.done, doneBy: original.doneBy || null } : x);
}
const PUNCH = [{ id: "pn1", label: "Gutter", done: false, doneBy: null }, { id: "pn2", label: "Cap", done: false, doneBy: null }];
const toggled = applyToggle(PUNCH, "pn1", true, "Hillwood");
ok(toggled[0].done === true && toggled[0].doneBy === "Hillwood" && toggled[1].done === false,
  "checking one item off touches exactly that item, stamped with the crew's name");
const reverted = revertToggle(toggled, PUNCH[0]);
ok(reverted[0].done === false && reverted[0].doneBy === null,
  "a failed RPC reverts the item to exactly its prior state");

/* ========== behavioral: mirror the snapshot's photo filter ========== */
function crewPhotos(photos) {
  return (photos || []).filter((ph) => ph.source === "crew-portal").slice(-12);
}
const MIXED = [
  { id: "p1", source: undefined, url: "https://x/office.jpg" },
  { id: "p2", source: "crew-portal", url: "data:image/jpeg;base64,x" },
];
ok(crewPhotos(MIXED).length === 1 && crewPhotos(MIXED)[0].id === "p2",
  "the office's own photo album never rides in the crew snapshot — only the crew's uploads");
ok(crewPhotos(Array.from({ length: 30 }, (_, i2) => ({ id: "c" + i2, source: "crew-portal" }))).length === 12,
  "the snapshot carries at most the latest 12 crew photos, bounding inline-data-URL weight");

if (fails) { console.log("\nbuild 124: " + fails + " FAILED"); process.exit(1); }
console.log("build 124 tests passed");
