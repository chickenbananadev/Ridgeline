/* Build 83 — gate change-order approval behind a real signature.

   Change orders were the one document type in the whole signing system
   that any staff member could push straight to "Approved" by clicking a
   status pill — no customer signature, no consent, nothing — even
   though Contract and Estimate both correctly require the customer to
   sign in the portal first. The pill click also silently changed what
   the customer is billed. Contract/Estimate already had this exact gap
   closed (build "Fix 8"); TabChangeOrders never got the same treatment.

   Per the owner's explicit decision ("Gate it like Contract/Estimate"),
   this closes it the same way those two work today: no staff-side
   manual-approve path at all (Contract/Estimate don't have one either,
   post Fix 8) — "Approved" is only ever reached by
   countersign() after the homeowner signs in the portal. Declined/Sent/
   Draft stay freely staff-editable since they don't assert a signature.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- countersign() gained a change_order branch ---------- */
const tsStart = src.indexOf("function TabSignatures(");
const tsEnd = src.indexOf("\nfunction ", tsStart + 10);
const tsSrc = src.slice(tsStart, tsEnd > 0 ? tsEnd : tsStart + 6000);
ok(/if \(signing\.doc_type === "change_order"\) \{/.test(tsSrc),
  "countersign() gained the missing change_order branch");
ok(/changeOrders: \(j\.changeOrders \|\| \[\]\)\.map\(\(c\) =>\s*c\.id === signing\.doc_id \? \{ \.\.\.c, status: "Approved", approvedAt: todayIso\(\) \} : c\),/.test(tsSrc),
  "countersigning a change order flips ONLY the matching change order (by id) to Approved");
/* Sanity check: the existing contract/estimate branches this build sits
   next to are untouched. */
ok(/if \(signing\.doc_type === "contract"\) \{/.test(tsSrc), "sanity check: the contract branch is still present");
ok(/if \(signing\.doc_type === "estimate"\) \{/.test(tsSrc), "sanity check: the estimate branch is still present");

/* ---------- TabChangeOrders: Approved is no longer staff-clickable ---------- */
const coStart = src.indexOf("function TabChangeOrders(");
const coEnd = src.indexOf("\nfunction ", coStart + 10);
const coSrc = src.slice(coStart, coEnd > 0 ? coEnd : coStart + 8000);
ok(/const gated = st === "Approved";/.test(coSrc), "the Approved pill is identified as gated");
ok(/<button key=\{st\} disabled=\{gated\} onClick=\{gated \? undefined : \(\) => editCo\(c\.id, "status", st\)\}/.test(coSrc),
  "the status button is disabled and has no click handler when gated (Approved)");
ok(/Approval happens when the homeowner signs at/.test(coSrc),
  "a hint explains that approval only happens via the portal signature, matching Estimate's/Contract's own hint pattern");
/* Draft/Sent/Declined must still be freely clickable — this is a
   targeted gate on Approved only, not a full lockdown. */
ok(!/disabled=\{gated\}[\s\S]{0,5}onClick=\{gated \? undefined : \(\) => editCo\(c\.id, "status", "Declined"\)/.test(coSrc),
  "sanity check: this isn't literally hardcoded per-status in a way that also disables Declined");

/* ---------- sendForSigning's print-and-wet-sign path is unaffected ---------- */
ok(/const sendForSigning = \(co\) => \{/.test(coSrc), "sendForSigning still exists, unaffected by the gate");
ok(/if \(co\.status === "Draft"\) editCo\(co\.id, "status", "Sent"\);/.test(coSrc),
  "sendForSigning can still move a change order to Sent — only the jump straight to Approved is gated");

if (fails) { console.log("\nbuild 83: " + fails + " FAILED"); process.exit(1); }
console.log("build 83 tests passed");
