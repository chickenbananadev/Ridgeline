/* Build 86 — admin self-lockout guard + role gates on Branding/Pipeline
   editors (Phase 2 audit #2 and #3, both high).

   1. Deactivating your own seat (TeamManager) fired immediately with no
      confirmation and no check for whether you're the last active admin
      — an instant, unrecoverable lockout with nobody left to undo it.
      The adjacent Remove button already guarded self-removal; Deactivate
      had no equivalent guard.
   2. BrandingEditor (company logo/colors/name — printed on every document
      and the login screen) and WorkflowEditor (the pipeline every job and
      rep depends on) took no role prop and performed no permission check
      at all, unlike every sibling Setup screen (VendorManager, and
      TeamManager itself), which already restrict themselves to
      admin/manager.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- 1. TeamManager: last-admin guard + self-deactivate confirm ---------- */
const tmStart = src.indexOf("function TeamManager(");
const tmEnd = src.indexOf("\nfunction ", tmStart + 10);
const tmSrc = src.slice(tmStart, tmEnd > 0 ? tmEnd : tmStart + 12000);

ok(/const activeAdmins = users\.filter\(\(u\) => u\.active && u\.role === "admin"\);/.test(tmSrc),
  "TeamManager computes the current list of active admins");
ok(/const \[confirmDeactivate, setConfirmDeactivate\] = useState\(null\);/.test(tmSrc),
  "TeamManager tracks a pending self-deactivation confirmation");
ok(/if \(u\.active && u\.role === "admin" && activeAdmins\.length === 1 && activeAdmins\[0\]\.id === u\.id\) \{/.test(tmSrc),
  "toggleActive hard-blocks deactivating the sole remaining active admin");
ok(/Can't deactivate \$\{u\.name\} — they're the only active admin\./.test(tmSrc),
  "the last-admin block gives a real explanation, not a silent no-op");
ok(/if \(u\.active && u\.id === currentUser\.id\) \{ setConfirmDeactivate\(u\); return; \}/.test(tmSrc),
  "clicking Deactivate on your OWN seat routes through a confirmation instead of firing immediately");
ok(/title="Deactivate your own seat\?"/.test(tmSrc), "a real confirmation Sheet exists for self-deactivation");
ok(/You'll be logged out right away/.test(tmSrc), "the confirmation explains the real, immediate consequence");
/* Sanity check: deactivating someone ELSE still fires immediately, no
   confirmation needed — this build only adds friction to the two genuinely
   risky cases (self, last admin), not to routine admin work. */
ok(/toggleActive\(u\);\s*\}\}>\s*\{u\.active \? "Deactivate" : "Reactivate"\}/.test(tmSrc),
  "sanity check: the button still calls toggleActive directly in the non-self path");

/* ---------- 2a. BrandingEditor role gate ---------- */
const beStart = src.indexOf("function BrandingEditor(");
const beEnd = src.indexOf("\nfunction ", beStart + 10);
const beSrc = src.slice(beStart, beEnd > 0 ? beEnd : beStart + 8000);
/* Build 110 added a `users = []` prop (to populate a new billing-contact
   picker) to this same signature and call site — match on the
   currentUser piece specifically rather than the now-stale full
   signature/call-site strings. */
ok(/function BrandingEditor\(\{ brand, setBrand, onBack, toast, brandErr = "", currentUser = null/.test(beSrc),
  "BrandingEditor still accepts a currentUser prop");
ok(/const canEdit = !currentUser \|\| canManageCompanyConfig\(currentUser\);/.test(beSrc),
  "BrandingEditor computes canEdit via the shared canManageCompanyConfig helper (build 101 centralized this)");
ok(/if \(!canEdit\) \{/.test(beSrc) && /Branding is management-only/.test(beSrc),
  "a non-management role sees a real explanation instead of the editable form");
ok(/<BrandingEditor brand=\{brand\} setBrand=\{setBrand\} onBack=\{\(\) => setNav\("more"\)\} toast=\{toast\} brandErr=\{brandErr\} currentUser=\{liveUser\}/.test(src),
  "the call site still passes the signed-in user down");

/* ---------- 2b. WorkflowEditor role gate ---------- */
const weStart = src.indexOf("function WorkflowEditor(");
const weEnd = src.indexOf("\nfunction ", weStart + 10);
const weSrc = src.slice(weStart, weEnd > 0 ? weEnd : weStart + 8000);
ok(/function WorkflowEditor\(\{ open, onClose, stages, setStages, stageRules = \{\}, setStageRules = \(\) => \{\}, currentUser = null \}\)/.test(weSrc),
  "WorkflowEditor now accepts a currentUser prop");
ok(/const canEdit = !currentUser \|\| canManageCompanyConfig\(currentUser\);/.test(weSrc),
  "WorkflowEditor computes canEdit via the shared canManageCompanyConfig helper (build 101 centralized this)");
ok(/footer=\{canEdit \? \(/.test(weSrc), "the Save/Cancel footer only appears for someone who can actually save");
ok(/Pipeline stages are management-only/.test(weSrc), "a non-management role sees a real explanation instead of the stage editor");
ok(/<WorkflowEditor open=\{workflowOpen\} onClose=\{\(\) => setWorkflowOpen\(false\)\} stages=\{stages\}\s*setStages=\{applyRemovedStages\} stageRules=\{stageRules\} setStageRules=\{setStageRules\} currentUser=\{liveUser\} \/>/.test(src),
  "the call site now passes the signed-in user down");

/* Sanity check: VendorManager's existing pattern (the convention both
   fixes above matched at the time) was itself later centralized too —
   build 101 replaced this exact duplicated check, along with 9 other
   identical copies elsewhere in the file, with one shared helper. */
ok((src.match(/const canEdit = canManageCompanyConfig\(currentUser\);/g) || []).length >= 6,
  "sanity check: VendorManager and its siblings now route through the same shared canManageCompanyConfig helper, not a re-duplicated inline check");

if (fails) { console.log("\nbuild 86: " + fails + " FAILED"); process.exit(1); }
console.log("build 86 tests passed");
