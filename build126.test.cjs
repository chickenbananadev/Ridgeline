/* Build 126 — delete crews from the Crews tab.

   The owner: "I don't see a way to delete crews once they are created
   in the crews tab." Confirmed real — every setCrews call site (seed,
   append, edit, active toggle, unpackOrg hydrate) either adds or maps;
   nothing ever removed an element, so a typo'd or test crew was stuck
   on the list permanently.

   Deleting a sub is a cross-entity action, not a list removal, because
   every "is this job unassigned?" test in the app reads !j.crewId and
   never "does that crew still exist". A dangling crewId would:
     - skip the red "no crew assigned" job alert and Dashboard banner,
     - render under NO crew card on the DispatchBoard while also failing
       both "scheduled with no crew" and "needs scheduling" — a
       scheduled install falling silently off the board,
     - and PASS the s8 stage gate (test: (j) => !!j.crewId).
   So the affected jobs are unassigned as part of the delete.

   Two owner decisions are encoded here:
     1. A crew with job history CAN be deleted — the jobs go back to
        unassigned and payout history survives, because payments record
        a sub by NAME (payments[].to, fin.labor[].by), never by id.
     2. A crew still owed money CANNOT — a confirmed/submitted sub
        invoice is only markable-paid from SubInvoiceCard, which needs
        an assigned crew, while the invoice keeps counting in the
        "Subs to pay" queue. Deleting would strand a payable nothing
        could clear.

   Also closed here: the crew-portal card (and its Disable button) used
   to be gated on `crew`, so any path that left a live crewPortalToken
   without a crew left the sub's link serving the work order and punch
   list with nothing in the app able to revoke it. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: the blocker helper is shared, not inlined ---------- */
ok(/function unpaidSubInvoiceJobs\(jobs, crewId\) \{\s*\n\s*return \(jobs \|\| \[\]\)\.filter\(\(j\) => j\.crewId === crewId && j\.subInvoice\s*\n\s*&& \["confirmed", "submitted"\]\.includes\(j\.subInvoice\.status\)\);/.test(src),
  "unpaidSubInvoiceJobs exists as one definition, matching the exact status set the Subs-to-pay queue treats as owed");

/* ---------- static: deleteCrew exists at the root and does the whole job ---------- */
const dcStart = src.indexOf("const deleteCrew = (id) => {");
ok(dcStart !== -1, "deleteCrew exists at the root, next to deleteJobs");
const dcSrc = src.slice(dcStart, dcStart + 2200);
ok(/const affected = jobs\.filter\(\(j\) => j\.crewId === id\);/.test(dcSrc),
  "deleteCrew finds the jobs still pointing at the crew");
ok(/setJobs\(\(prev\) => prev\.map\(\(j\) => \(hit\.has\(j\.id\) \? \{ \.\.\.j, crewId: null \} : j\)\)\);/.test(dcSrc),
  "those jobs are unassigned rather than left holding a dangling crewId that would drop them off the dispatch board");
ok(/db\.from\("crm_portal"\)\.update\(\{ revoked: true \}\)\.in\("token", tokens\)/.test(dcSrc),
  "the crew's live portal links are revoked in crm_portal, mirroring deleteJobs' revoke");
ok(/setCrews\(\(prev\) => prev\.filter\(\(c\) => c\.id !== id\)\)/.test(dcSrc),
  "the crew is actually removed from the list — the thing that never existed before");
ok(/setSyncErr\(/.test(dcSrc),
  "a failed revoke is surfaced, not swallowed — the whole reason three production bugs went unnoticed this session");
ok(/if \(error\) warn\(\); else clearTokens\(\);/.test(dcSrc),
  "crewPortalToken is only cleared locally once revoked=true actually lands — clearing it on a failed write would hide a still-live link behind a token the UI no longer has");
ok(/logAct\(\{ type: "delete", text: `Deleted crew: /.test(dcSrc),
  "the deletion is logged to activity with the crew name and unassigned-job count");
ok(/onDeleteCrew=\{deleteCrew\}/.test(src), "the root wires the real deleteCrew into CrewManager, not a stub");

/* ---------- static: CrewManager's delete control + three-state confirm ---------- */
ok(/function CrewManager\(\{ crews, setCrews, currentUser, jobs, onBack, toast, onDeleteCrew = null \}\)/.test(src),
  "CrewManager accepts onDeleteCrew");
ok(/aria-label=\{`Delete \$\{c\.name\}`\}/.test(src),
  "each crew card has a labelled Delete control, reachable by assistive tech");
const cdStart = src.indexOf("const owed = unpaidSubInvoiceJobs(jobs, confirmDel.id);");
ok(cdStart !== -1, "the confirm sheet computes the unpaid-invoice blocker from the shared helper");
/* Bounded by the sheet's own closing rather than a character count, so
   the window can't silently fall short of an assertion as the copy
   grows — the failure mode build 118's test already hit once. */
const cdSrc = src.slice(cdStart, src.indexOf("INTEGRATIONS — Gmail / SMS provider connection", cdStart));
ok(/\{!owed\.length && \(\s*\n\s*<Btn data-testid="confirm-delete-crew"/.test(cdSrc),
  "there is NO delete control at all when the crew is still owed money — blocked, not merely warned");
ok(/disabled=\{needsTyping && delTyped\.trim\(\)\.toUpperCase\(\) !== "DELETE"\}/.test(cdSrc),
  "deleting a crew that has jobs is gated behind typing DELETE, matching the job-delete convention");
ok(/const needsTyping = assigned\.length > 0;/.test(cdSrc),
  "a crew with no jobs gets a plain confirm — no typing ceremony for a consequence-free removal");
ok(/Settle what's owed first/.test(cdSrc), "the blocked state names the reason plainly");
ok(/money\(subInvoiceTotal\(j\.subInvoice\)\)/.test(cdSrc),
  "the blocked state shows the actual amount owed per job, not just a count");
ok(/What you've already paid \{confirmDel\.name\} stays on the books\./.test(cdSrc),
  "the has-jobs warning states that payout history survives — otherwise deleting looks like it erases the money trail");
ok(/<b>Deactivate<\/b> keeps their file, price sheet and history intact/.test(cdSrc),
  "the confirm points at Deactivate as the non-destructive alternative");

/* ---------- static: paidFor can't total the whole company under one sub ---------- */
ok(/const crewName = \(crews\.find\(\(c\) => c\.id === crewId\) \|\| \{\}\)\.name \|\| "";[\s\S]{0,300}?if \(!crewName\) return 0;/.test(src),
  "an unknown crew id yields 0 paid, not every payout in the company — \"anything\".includes(\"\") is true, so falling through would sum the lot");

/* ---------- static: a live crew link is always revocable ---------- */
ok(/\{\(crew \|\| job\.crewPortalToken\) && \(/.test(src),
  "the Crew portal card renders on a live token even with no crew — its Disable button is the only way to kill that link");
ok(/A crew link for this job is still live even though no crew is assigned/.test(src),
  "the no-crew-but-live-token state explains itself instead of showing a card about a crew that isn't there");
const rcStart = src.indexOf("const revokeCrewPortal = async () => {");
const rcSrc = src.slice(rcStart, rcStart + 900);
ok(/if \(error\) \{ toast\("Couldn't disable that link — it's still live\./.test(rcSrc),
  "revoke reports a failed write instead of the old try/catch, which never fired (supabase-js returns {error}, it doesn't throw) and always toasted success");

/* ---------- behavioral: mirror unpaidSubInvoiceJobs ---------- */
function unpaidSubInvoiceJobs(jobs, crewId) {
  return (jobs || []).filter((j) => j.crewId === crewId && j.subInvoice
    && ["confirmed", "submitted"].includes(j.subInvoice.status));
}
const JOBS = [
  { id: "j1", crewId: "c1", subInvoice: { status: "paid" } },
  { id: "j2", crewId: "c1", subInvoice: { status: "confirmed" } },
  { id: "j3", crewId: "c1", subInvoice: { status: "draft" } },
  { id: "j4", crewId: "c2", subInvoice: { status: "submitted" } },
  { id: "j5", crewId: "c1" },
];
ok(unpaidSubInvoiceJobs(JOBS, "c1").map((j) => j.id).join() === "j2",
  "only a confirmed/submitted invoice blocks — paid is settled, draft was never sent");
ok(unpaidSubInvoiceJobs(JOBS, "c2").map((j) => j.id).join() === "j4", "submitted counts as owed");
ok(unpaidSubInvoiceJobs(JOBS, "c3").length === 0, "a crew with no jobs is never blocked");
ok(unpaidSubInvoiceJobs(null, "c1").length === 0, "a missing job list doesn't crash the confirm sheet");

/* ---------- behavioral: mirror the unassign transform ---------- */
function unassign(jobs, crewId) {
  const hit = new Set(jobs.filter((j) => j.crewId === crewId).map((j) => j.id));
  return jobs.map((j) => (hit.has(j.id) ? { ...j, crewId: null } : j));
}
const FLEET = [
  { id: "j1", crewId: "c1", crewPortalToken: "tok-1", payments: [{ to: "Hillwood", amt: 500 }] },
  { id: "j2", crewId: "c2", crewPortalToken: "tok-2" },
  { id: "j3", crewId: "c1" },
];
const after = unassign(FLEET, "c1");
ok(after.filter((j) => j.crewId === null).map((j) => j.id).join() === "j1,j3",
  "every job the crew held is unassigned — null, not a dangling id that fakes its way past the stage gate");
ok(after.find((j) => j.id === "j2").crewId === "c2", "another crew's jobs are untouched");
ok(after.find((j) => j.id === "j1").payments.length === 1,
  "payment history rides along untouched — a sub is recorded by name, so what they were paid survives the delete");

/* ---------- behavioral: mirror the token revoke set ---------- */
function tokensToRevoke(jobs, crewId) {
  return jobs.filter((j) => j.crewId === crewId).map((j) => j.crewPortalToken).filter(Boolean);
}
ok(tokensToRevoke(FLEET, "c1").join() === "tok-1",
  "only the deleted crew's own live links are revoked — never another crew's");
ok(tokensToRevoke(FLEET, "c3").length === 0,
  "no live links means no crm_portal write at all, rather than an update matching nothing");

/* ---------- behavioral: mirror the confirm sheet's three states ---------- */
function confirmState(jobs, crewId) {
  if (unpaidSubInvoiceJobs(jobs, crewId).length) return "blocked";
  return jobs.filter((j) => j.crewId === crewId).length ? "type-delete" : "plain";
}
ok(confirmState(JOBS, "c1") === "blocked", "owed money → blocked, whatever else is true");
ok(confirmState([{ id: "a", crewId: "c9" }], "c9") === "type-delete", "jobs but nothing owed → typed confirmation");
ok(confirmState([{ id: "a", crewId: "c9" }], "c8") === "plain", "no jobs → plain confirm");

/* ---------- behavioral: the portal card's render gate ---------- */
function showsPortalCard(crew, token) { return !!(crew || token); }
ok(showsPortalCard(null, "tok-1") === true,
  "a live token with no crew still shows the card — otherwise that link can never be revoked from the app");
ok(showsPortalCard({ id: "c1" }, null) === true, "an assigned crew with no link yet still gets the create control");
ok(showsPortalCard(null, null) === false, "no crew and no link shows nothing, as before");

if (fails) { console.log("\nbuild 126: " + fails + " FAILED"); process.exit(1); }
console.log("build 126 tests passed");
