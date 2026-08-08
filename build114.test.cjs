/* Build 114 — "Ready to pay" Home card + nav badge (part 5, final part,
   of the sub/cap-out payment-ready notification feature).

   Adds a live-queue-depth surface for what builds 112/113 already
   auto-notify on: a Home dashboard card (admin-only, mirroring the
   existing Subcontractors card's shape) and a badge on the Home nav
   icon, counting jobs where either a sub invoice is confirmed and
   awaiting payment, or a cap-out was notified but the job hasn't left
   the Payments/Invoicing/Cap out stage (s9) yet. This is a live count,
   not a "seen"/unread tracker — there's no persisted paid/processed
   status for cap-outs to track against, same as the existing
   Subcontractors card's subsReview/subsPay counts.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: the shared readiness expression exists in both places ---------- */
const READY_EXPR = /\(j\.subInvoice && j\.subInvoice\.status === "confirmed"\) \|\|\s*\n\s*\(j\.capOutNotifiedAt && j\.stageId !== "s10"\)/;
const readyMatches = src.match(new RegExp(READY_EXPR, "g")) || [];
ok(readyMatches.length === 2,
  "the readiness expression (confirmed sub invoice OR notified-but-not-yet-completed cap-out) appears at both the root App level and inside Dashboard — found " + readyMatches.length);

/* ---------- static: root App level — nav badge ---------- */
ok(/const readyToPayCount = jobs\.filter\(\(j\) =>/.test(src), "root App computes readyToPayCount from the live jobs list");
/* Build 134 added unhandled storm alerts to the same badge. The
   ready-to-pay half must stay admin-gated — it is a money queue, and a
   rep seeing a count of invoices awaiting payment is the leak this
   assertion exists to catch. The storm half is deliberately NOT gated
   (whoever is nearest should be able to go), so the check is on the
   admin ternary rather than on the whole expression. */
ok(/<NavBtn id="home" icon=\{Home\} label="Home" badge=\{\(isAdmin \? readyToPayCount : 0\)/.test(src),
  "the Home nav button shows the ready-to-pay count as a badge, still admin-only");

/* ---------- static: Dashboard level — the card ---------- */
ok(/const readyToPay = jobs\.filter\(\(j\) =>/.test(src), "Dashboard computes its own readyToPay count from its jobs prop");
ok(/\{isAdmin && readyToPay > 0 && \(/.test(src), "the Ready to pay card is admin-gated, same as the Subcontractors card");
ok(/<CardTitle>Ready to pay<\/CardTitle>/.test(src), "the card is titled 'Ready to pay'");
ok(/The billing contact has already been notified on these/.test(src),
  "the card explains these are already-notified items, not a new to-do");

/* ---------- behavioral: mirror the readiness filter against synthetic jobs ---------- */
function readyToPayFilter(jobs) {
  return jobs.filter((j) =>
    (j.subInvoice && j.subInvoice.status === "confirmed") ||
    (j.capOutNotifiedAt && j.stageId !== "s10")
  ).length;
}
const JOBS = [
  { id: "j1", stageId: "s9", subInvoice: { status: "confirmed" }, capOutNotifiedAt: null },
  { id: "j2", stageId: "s9", subInvoice: { status: "submitted" }, capOutNotifiedAt: null },
  { id: "j3", stageId: "s9", subInvoice: null, capOutNotifiedAt: "2026-01-01T00:00:00.000Z" },
  { id: "j4", stageId: "s10", subInvoice: null, capOutNotifiedAt: "2026-01-01T00:00:00.000Z" },
  { id: "j5", stageId: "s5", subInvoice: { status: "draft" }, capOutNotifiedAt: null },
];
ok(readyToPayFilter(JOBS) === 2,
  "counts exactly the confirmed-sub-invoice job and the still-in-cap-out-stage notified job (2 of 5), not submitted/draft/completed ones");
ok(readyToPayFilter([JOBS[1]]) === 0, "a submitted (not confirmed) sub invoice doesn't count — it's already past the 'ready to pay' moment");
ok(readyToPayFilter([JOBS[3]]) === 0,
  "a notified cap-out on a job that already moved to 'Job completed' (s10) drops out of the live count — the stage move is treated as done, no separate flag needed");
ok(readyToPayFilter([]) === 0, "an empty job list counts zero, no crash");

if (fails) { console.log("\nbuild 114: " + fails + " FAILED"); process.exit(1); }
console.log("build 114 tests passed");
