/* Build 61 — five bugs the six-agent wiring audit found and hand-verified.

   Every finding here is a variant of the same failure: a feature that talks
   to a real recipient (a crew, the office's own accounting inbox, a
   homeowner) but the code that actually delivers it was never taught who
   that recipient is, or was told a fact about the world it never checked.

   The worst of the five: routing every queued message through the
   customer-delivery path meant an internal note about what a crew is being
   paid — amount, PO number, payment method — went to the CUSTOMER'S OWN
   phone or email whenever they had consent on file, and never reached
   accounting when they didn't. Consent is a customer-protection mechanic;
   a crew and the office's own inbox were never subject to it, and treating
   them as if they were sent one contractor's payment details to their
   client's front door.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- 1: audience-aware delivery ---------- */
ok(/async function deliverMessage\(\{ to, kind, subject = "", body, jobId \}, integrations, currentUser\) \{/.test(src),
  "a delivery primitive exists that takes an explicit address, not a job to resolve one from");
ok(/return deliverMessage\(\{ to, kind, subject, body, jobId: job\.id \}, integrations, currentUser\);/.test(src),
  "deliverToCustomer now delegates the actual attempt rather than duplicating it");
/* The consent gate has to stay exactly where it was — on the function that
   resolves an address FROM the job, not on the primitive a Crew/Accounting
   send also goes through. Moving it would either strand internal sends
   behind a customer-consent check that makes no sense for them, or drop
   consent-gating for the customer path entirely. */
const deliverMessageBody = src.slice(src.indexOf("async function deliverMessage("), src.indexOf("async function deliverToCustomer("));
ok(!/consent/i.test(deliverMessageBody), "the shared delivery primitive itself carries no consent logic");
ok(/const smsOk = !!\(consent\.sms && consent\.sms\.granted\) && !!job\.phone;/.test(src),
  "consent gating still lives on the customer-address resolver");

ok(/const out = \(msg\.audience && msg\.audience !== "Customer"\)/.test(src),
  "the Inbox's send-now drain branches on who the message is actually addressed to");
ok(/await deliverMessage\(\{ to: msg\.to, kind: msg\.kind \|\| "email", subject: msg\.subject \|\| "", body: msg\.body, jobId \}, integrations, liveUser\)/.test(src),
  "a Crew or Accounting message delivers to its own recorded address");
ok(/status: `Not sent — no address on file for \$\{msg\.audience\}`/.test(src),
  "and refuses rather than silently resolving to nothing when that address is missing");

/* ---------- 2: work order stops asserting an unchecked fact ---------- */
ok(/const status = crew\.email \? "Queued" : "Queued — add an email on this crew's file to notify them";/.test(src),
  "queuing a work order no longer claims to already know the provider isn't connected");
ok(!/status: "Queued — no provider connected",\s*\n\s*\}\]\,?\s*\}\)\);\s*\n\s*setSending\(false\);/.test(src),
  "the hardcoded false status is gone from the work order send path");
ok(/toast\("Work order queued to crew — send it from the Inbox"\);/.test(src),
  "and the toast matches what actually happened — queued, not delivered");

/* ---------- 3: the per-stage notify checkbox is no longer write-only ---------- */
ok(/if \(j\.portal\?\.notifyStage && rule\.notify && stage\) \{/.test(src),
  "a stage-change customer message requires both the job's own preference and the stage's own policy");
/* rule has to be computed from the SAME stageRules the move is gated on,
   ahead of the notify check, not a second, possibly-stale lookup. */
ok(/const rule = stageRuleFor\(stageRules, stageId\);\s*\n\s*setJobs/.test(src),
  "the rule is resolved once, before the notify decision, from the live stage rules");

/* ---------- 4: crew documents are stored, the same way company documents are ---------- */
ok(/up = await uploadCompanyFile\(file\);/.test(src) && (src.match(/up = await uploadCompanyFile\(file\);/g) || []).length >= 2,
  "crew documents go through the same real upload path company documents were just fixed to use");
ok(/setF\(\(prev\) => \(\{ \.\.\.prev, docs: \[\.\.\.\(prev\.docs \|\| \[\]\), \{[\s\S]{0,40}id: uid\("cd"\)/.test(src),
  "a saved crew document carries a real id");
ok(/url: up\.url, storage: up\.storage, storageKey: up\.key, mime: up\.mime,\s*\n\s*\}\]\s*\}\)\);/.test(src),
  "and where the file actually lives, not just its name");
ok(/setF\(c \? \{ \.\.\.c \} : \{ \.\.\.blank, id: uid\("c"\) \}\)/.test(src),
  "a brand-new crew gets a stable id immediately, so a document uploaded before the first save has somewhere to belong");

/* ---------- 5: the review sequence stops claiming to send itself ---------- */
ok(!/Automatic review requests/.test(src), "the misleading label is gone");
ok(/Review request sequence/.test(src), "replaced with what it actually is");
ok(!/A four-touch sequence starting the day after a job completes,/.test(src),
  "the description no longer implies the app dispatches the touches itself");
ok(/mark each touch sent as you make it/.test(src), "and says who actually sends them");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_audit61.jsx");
const bundle = path.join(__dirname, "_audit61.cjs");
fs.writeFileSync(scratch, src + "\nexport { deliverMessage, deliverToCustomer, stageRuleFor, DEFAULT_STAGE_RULES, EMPTY_RULE };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_audit61.cjs");

(async () => {
  /* No AUTH() is configured in this bundle — same as a fresh install with
     no Gmail/SMS connected — so every attempt takes the honest "no
     provider" branch rather than throwing. */
  const crewSend = await m.deliverMessage(
    { to: "crew@example.com", kind: "email", subject: "Work order", body: "…" }, {}, { id: "u1" });
  ok(crewSend.to === "crew@example.com", "an internal send goes to the address it was actually given");
  ok(crewSend.status === "Queued — no provider connected", "and reports the real (unconfigured) state honestly");
  ok(!crewSend.delivered, "not marked delivered when nothing was attempted");

  const acctSend = await m.deliverMessage(
    { to: "accounting@sbg.example", kind: "email", subject: "Sub payment due", body: "Owed $2,400" }, {}, { id: "u1" });
  ok(acctSend.to === "accounting@sbg.example", "an accounting send is addressed to accounting, not resolved from any job");

  /* deliverToCustomer must remain exactly what it always was: customer-only,
     consent-gated, address resolved from the job — never handed an
     arbitrary address by a caller. This is the guarantee that makes the
     audience branch in sendQueuedMessage safe: the customer path can't be
     tricked into sending to whatever `to` a queued message happens to carry. */
  const consentedJob = { id: "j1", phone: "5135550100", email: "cust@example.com",
    consent: { sms: { granted: true }, email: { granted: true } } };
  const custSend = await m.deliverToCustomer(consentedJob, { prefer: "sms", body: "On our way" }, {}, { id: "u1" });
  ok(custSend.to === "5135550100", "deliverToCustomer still resolves the address from the job's own phone");
  const noConsentJob = { ...consentedJob, consent: { sms: { granted: false }, email: { granted: false } } };
  const blocked = await m.deliverToCustomer(noConsentJob, { prefer: "sms", body: "On our way" }, {}, { id: "u1" });
  ok(!blocked.delivered && /consent/i.test(blocked.status), "and still refuses without consent — unaffected by the refactor");

  /* The notify gate: EMPTY_RULE (an unconfigured stage) carries notify:false,
     so a stage with no explicit rule now correctly withholds the customer
     message — before this fix that outcome depended only on the job's
     portal setting, never on the stage. */
  ok(m.EMPTY_RULE.notify === false, "a stage with no configured rule defaults to not notifying");
  ok(m.stageRuleFor(m.DEFAULT_STAGE_RULES, "s10").notify === true,
    "Job completed is explicitly configured to notify — the shipped default this fix must not silently change");

  fs.unlinkSync(bundle);
  if (fails) { console.log("\nbuild 61: " + fails + " FAILED"); process.exit(1); }
  console.log("build 61 tests passed");
})();
