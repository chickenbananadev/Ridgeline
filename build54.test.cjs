/* Build 54 — the money bugs.

   Every assertion here stands for a way the app lost money or lied about
   what it had done, confirmed by reading the code path before the fix:

     - storm photos were never uploaded, so every document that left the
       building showed a broken image
     - the printed invoice omitted approved change orders and under-billed
     - multi-story sub invoices went out short by the access adder
     - three features wrote a "Queued" message, said the customer had been
       notified, and nothing ever sent it
     - deleting a job left the homeowner's portal link live forever

   These are behavioural where the behaviour is reachable, and structural
   where the code path needs a browser (uploads, sends).
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- 0a: photos are uploaded, not held as a blob: URL ---------- */
ok(!/URL\.createObjectURL\(file\)/.test(src),
  "no photo path stores a blob: URL that dies on reload");
ok(/up = await uploadJobFile\(job\.id, small\)/.test(src),
  "photos go through the same upload path as job files");
ok(/function downscaleImageFile\(/.test(src), "camera photos are downscaled before upload");
/* A failed upload must not record a photo we cannot show later. */
ok(/setUpErr\(\(e && e\.message\) \|\| "Couldn't save that photo\."\);\s*\n\s*return;/.test(src),
  "an upload failure records nothing and says so");

/* ---------- 0g: photos can actually be shared to the portal ---------- */
ok(/const toggleShared = \(id\) =>\s*\n\s*mut\(\(j\) => \(\{ \.\.\.j, photos: j\.photos\.map/.test(src),
  "photo.shared can be written (it was read in two places and written in none)");
ok(/shared: false,/.test(src), "a new photo starts unshared");

/* ---------- 0d/0e: sends are real, and consent is checked ---------- */
ok(/async function deliverToCustomer\(job, \{ prefer = "sms", subject = "", body \}, integrations, currentUser\)/.test(src),
  "one delivery path for app-initiated customer messages");
ok(/const smsOk = !!\(consent\.sms && consent\.sms\.granted\) && !!job\.phone;/.test(src),
  "SMS requires consent AND a number");
ok(/const emailOk = !!\(consent\.email && consent\.email\.granted\) && !!job\.email;/.test(src),
  "email requires consent AND an address");
ok(/const out = await deliverToCustomer\(job, \{ prefer: "sms", subject: "On our way", body \}/.test(src),
  "the en-route ETA actually sends");
/* It used to address the message to the customer's own name. */
ok(!/to: j\.consent\?\.sms\?\.granted \? \(j\.phone \|\| j\.name\)/.test(src),
  "no send path falls back to the customer's name as an address");
ok(/const sendQueuedMessage = async \(jobId, msgId\) => \{/.test(src),
  "queued messages have a drain");
ok(/onSendQueued=\{sendQueuedMessage\}/.test(src), "the Inbox is wired to it");
/* And the toasts stop claiming an automatic delivery that never happens. */
ok(!/queued for the customer/.test(src), "no toast claims a message was queued for delivery");
ok(!/reminder queued — see it in the Inbox/.test(src), "the reminder toast no longer implies it will send itself");

/* ---------- 0f: the audit trail the UI promises now exists ---------- */
ok(/Corrections are fine — every edit is written to the activity feed/.test(src), "the claim is still made");
ok(/onLog\(\{ kind: "payment", jobId: job\.id, jobName: job\.name,/.test(src), "and payment edits now log it");
ok(/removed a \$\{money\(num\(before\.amt\)\)\} payment/.test(src), "deletions log the old amount");

/* ---------- 0h: deleting a job kills the portal ---------- */
ok(/db\.from\("crm_portal"\)\.update\(\{ revoked: true \}\)\.in\("token", tokens\)/.test(src),
  "deleting a job revokes its customer portal link");

/* ---------- 0i/0j: no hardcoded demo identity ---------- */
ok(!/assignee: TEAM\[0\]/.test(src), "new leads do not default to a demo name");
ok(/const roster = useMemo\(\(\) => \{/.test(src), "the lead sheet reads the real seat list it was always passed");
ok(!/\{TEAM\.map\(/.test(src), "no picker renders the hardcoded TEAM list");
ok(!/brand\.name \|\| "Supreme Building Group"/.test(src),
  "review templates read brand.company, not a field that does not exist");

/* ---------- 0k: appointment sync failures surface ---------- */
ok(!/catch \{ \/\* surfaced via jobs path if systemic \*\/ \}/.test(src),
  "appointment sync errors are no longer swallowed");
ok(/Couldn't save an appointment — it exists on this device only\./.test(src),
  "and say what happened");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_money54.jsx");
const bundle = path.join(__dirname, "_money54.cjs");
fs.writeFileSync(scratch, src + "\nexport { invoiceDocHtml, buildSubInvoiceDraft, paymentsSummary, subInvoiceTotal };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_money54.cjs");

const brand = { company: "Supreme Building Group, Inc.", address: "311 Elm St", phone: "555", primary: "#2B3440" };
/* 0b — a job with an approved change order. The screen has always added it;
   the printed invoice computed its own total and left it out. */
const jobCo = {
  name: "Roger Perry", address: "1 Main St", stageId: "s8", tasks: [], checklist: {},
  contract: { price: 20000 }, payments: [{ id: "p1", type: "Received", amt: 10000, date: "2026-07-01", method: "Check" }],
  estimate: { items: [{ id: "e1", desc: "Roof replacement", qty: 1, unit: "job", price: 20000 }] },
  changeOrders: [
    { id: "c1", title: "Decking replacement", status: "Approved",
      lines: [{ id: "l1", label: "7/16 OSB", qty: 12, unit: "sheet", price: 85 }] },
    { id: "c2", title: "Skylight", status: "Sent",
      lines: [{ id: "l2", label: "Velux curb mount", qty: 1, unit: "ea", price: 1400 }] },
  ],
};
const inv = m.invoiceDocHtml(jobCo, brand);
const pay = m.paymentsSummary(jobCo);
ok(pay.contract === 21020, `paymentsSummary includes the approved CO (got ${pay.contract})`);
ok(inv.includes("$21,020.00"), "the printed invoice total matches the screen");
ok(!/Contract total<\/span><span>\$20,000\.00/.test(inv), "and is no longer the pre-change-order figure");
ok(/Balance due<\/span><span>\$11,020\.00/.test(inv), "balance due follows");
ok(/Approved change orders/.test(inv) && /Decking replacement — 7\/16 OSB/.test(inv),
  "the approved change-order lines are itemised, not just added to the total");
ok(!/Velux curb mount/.test(inv), "an unapproved change order is not billed");

/* A job with no change orders must be unaffected. */
const plain = { ...jobCo, changeOrders: [] };
ok(m.invoiceDocHtml(plain, brand).includes("$20,000.00"), "a job with no change orders bills the contract price");

/* 0c — the 2- and 3-story access adders. subCodeFor parses these out of the
   crew's rate card; the draft builder never read wo.stories. */
const crew = { name: "A1 Roofing", payment: { terms: "Net 15" }, rateCard: [
  { id: "r1", code: "per_square", label: "Install", price: 85, unit: "SQ", category: "Shingle Installation" },
  { id: "r2", code: "story_2", label: "2 story", price: 400, unit: "flat", category: "Access" },
  { id: "r3", code: "story_3", label: "3 story", price: 900, unit: "flat", category: "Access" },
] };
const base = { measurements: { squares: "30", waste: 10, eaves: "0", rakes: "0", ridges: "0", hips: "0", valleys: "0" }, checklist: {} };
const oneStory = m.buildSubInvoiceDraft({ ...base, workOrder: {} }, crew);
ok(!oneStory.lines.some((l) => /story/i.test(l.label)), "a single-story job gets no adder");
const twoStory = m.buildSubInvoiceDraft({ ...base, workOrder: { stories: "2" } }, crew);
const twoAdder = twoStory.lines.find((l) => /2-story/i.test(l.label));
ok(!!twoAdder, "a 2-story job gets the adder");
ok(twoAdder && twoAdder.price === 400, `at the rate-card price (got ${twoAdder && twoAdder.price})`);
const threeStory = m.buildSubInvoiceDraft({ ...base, workOrder: { stories: "3+" } }, crew);
const threeAdder = threeStory.lines.find((l) => /3\+ story/i.test(l.label));
ok(!!threeAdder && threeAdder.price === 900, "a 3+ story job gets its own adder");
ok(m.subInvoiceTotal(twoStory) > m.subInvoiceTotal(oneStory),
  "and the sub is paid more for the harder job, which was the entire bug");
/* A crew whose rate card has no adder must not gain a zero line. */
const bareCrew = { ...crew, rateCard: [crew.rateCard[0]] };
ok(!m.buildSubInvoiceDraft({ ...base, workOrder: { stories: "2" } }, bareCrew).lines.some((l) => /story/i.test(l.label)),
  "a crew with no adder on file gets no adder line");

/* computeSubPay was a second, unreferenced implementation of the same pay
   maths — the drift risk that let this bug exist. */
ok(!/function computeSubPay\(/.test(src), "the duplicate pay calculation is gone");
ok(/SUB_RATE_LABELS\[r\.code\]/.test(src),
  "the rate-card editor shows which rows the app will auto-apply");

fs.unlinkSync(bundle);
if (fails) { console.log("\nbuild 54: " + fails + " FAILED"); process.exit(1); }
console.log("build 54 tests passed");
