/* Build 57 — per-state legal packs, and the gate on binding documents.

   The construction agreement recited "the State of Ohio and Kentucky" on
   every tenant's contract, for every roof in the country, and told every
   homeowner they had three business days to cancel — which is Ohio's
   window, stated as fact to people who do not live there. mkContract also
   baked a 5-year warranty, 1.5% per month and a 50% deposit into every new
   tenant on day one; the deposit alone is a per-se violation in states that
   cap it at a third.

   The fix is not better seed data. Outbound research here returns
   lead-generation aggregators that contradict each other, so the app seeds
   the pointer and refuses to sign until a named person has read the source
   on a date. These tests are mostly about that refusal holding.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: the hardcoded state recitals are gone ---------- */
ok(!/ordinances in the State of Ohio and Kentucky/.test(src),
  "the agreement no longer recites Ohio and Kentucky to every tenant");
ok(/ordinances in \{state\}/.test(src), "it resolves the governing law instead");
ok(!/prior to midnight of the third business day/.test(src),
  "the RIGHT TO CANCEL box no longer hardcodes Ohio's window");
ok(!/prior to midnight of the 3rd business day/.test(src),
  "nor does clause 21 on the reverse");
/* Count the token in the two clause strings, not across the source — the
   comment explaining the change names the token too, and matching that
   would make this pass vacuously. Same trap as build53's Ohio-statute
   assertion, hit for the third time. The real check is the behavioural
   one further down, which renders the document and counts the window. */
ok((src.match(/cancel this transaction at any time prior to midnight of \{rescission\}/g) || []).length === 2,
  "both cancellation statements resolve through the same field, so they cannot disagree");

/* Every state-keyed slot is filled through one resolver that knows the
   property's state — a call site that forgot it would silently fall back
   to whatever the default was, which is how this started. */
ok(/function agreementFillLegal\(text, brand, state\)/.test(src), "one resolver fills the state-keyed slots");
ok(!/agreementFill\([A-Z_]+, brand\)\)/.test(src), "no agreement call site fills without a state");
ok(/const st = job\.state \|\| "";/.test(src), "the builder takes the state off the job");

/* ---------- static: the gate ---------- */
ok(/const blockers = agreementBlockers\(job\);/.test(src), "the contract tab computes its blockers");
ok(/disabled=\{locked \|\| blockers\.length > 0\}/.test(src), "an unconfirmed state disables the signature pad");
ok(/con\.clientSig && con\.contractorSig && !locked && blockers\.length === 0 &&/.test(src),
  "and the execute button");
ok(/<Btn kind="ghost" disabled=\{blockers\.length > 0\} onClick=\{\(\) => sendClientEmail/.test(src),
  "and emailing it to the customer");
/* Printing stays open on purpose: a rep has to be able to look at the
   draft and see which clauses are unfilled. */
ok(/Printing the draft still works so you can see exactly which clauses are unfilled/.test(src),
  "printing stays available, and says why");
ok(/portal\.contract && legalReady\(job\.state\)/.test(src),
  "the customer portal will not offer an unconfirmed contract for signature");

/* ---------- static: the snapshot ---------- */
ok(/const LEGAL_PACK_VERSION = 1;/.test(src), "packs are versioned");
ok(/legalPackState: job\.state \|\| "",/.test(src), "a signature records which state's pack it was signed under");
ok(/renderedLegalText: renderedLegalText\(job\),/.test(src),
  "and the rendered words, so editing a pack later cannot rewrite what a past signature covered");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_legal57.jsx");
const bundle = path.join(__dirname, "_legal57.cjs");
fs.writeFileSync(scratch, src + "\nexport { legalPackFor, legalPackGaps, legalPackReady, legalPack, legalReady, " +
  "setLegalOverrides, LEGAL_FIELDS, BINDING_LEGAL_FIELDS, printable, agreementFill, agreementFillLegal, " +
  "agreementBlockers, agreementDocHtml, renderedLegalText, stateName, US_STATES, AGREEMENT_TERMS_INTRO };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_legal57.cjs");

/* Every state gets a row for every field. A state missing from the table
   entirely is how the Ohio fallback used to happen. */
ok(m.LEGAL_FIELDS.length >= 10, `there are enough fields to be worth having (${m.LEGAL_FIELDS.length})`);
for (const [ab] of m.US_STATES) {
  const pack = m.legalPackFor(ab);
  const missing = m.LEGAL_FIELDS.filter((f) => !pack[f.key]);
  if (missing.length) { ok(false, `${ab} is missing ${missing.map((f) => f.key).join(", ")}`); break; }
}
ok(m.US_STATES.every(([ab]) => m.LEGAL_FIELDS.every((f) => !!m.legalPackFor(ab)[f.key])),
  `every state has a row for every field (${m.US_STATES.length} states)`);

/* And every one of those rows either has something behind it or names the
   body that settles it. A blank with no pointer is the old behaviour. */
const pointerless = [];
m.US_STATES.forEach(([ab]) => {
  const pack = m.legalPackFor(ab);
  m.LEGAL_FIELDS.forEach((f) => {
    const x = pack[f.key];
    if (!x.value && !(x.sourceUrl && x.note)) pointerless.push(`${ab}.${f.key}`);
  });
});
ok(pointerless.length === 0, `an empty field always carries its authority and a link (${pointerless.slice(0, 3).join(", ")})`);

/* Nothing is verified out of the box. This is the whole design: only a
   human confirming on a date reaches the tier that prints. */
const seededVerified = [];
m.US_STATES.forEach(([ab]) => {
  const pack = m.legalPackFor(ab);
  m.LEGAL_FIELDS.forEach((f) => { if (pack[f.key].confidence === "verified") seededVerified.push(`${ab}.${f.key}`); });
});
ok(seededVerified.length === 0, `no field ships pre-verified (${seededVerified.slice(0, 3).join(", ")})`);
ok(m.US_STATES.every(([ab]) => !m.legalPackReady(ab)), "so no state can sign until somebody confirms it");
ok(!m.legalPackReady(""), "and a job with no state at all is never ready");

/* Ohio's seeded values are the assertions the app already made, carried
   over so there is one place to confirm them — at `derived`, not verified. */
const oh = m.legalPackFor("OH");
ok(oh.rescission.confidence === "derived", "Ohio's rescission window is seeded but unconfirmed");
ok(/three \(3\) business days/i.test(oh.rescission.value), "and still says what it has always said");
ok(oh.rescission.sourceUrl.includes("codes.ohio.gov"), "pointing at the official text");
ok(!m.printable(oh.rescission), "which is not enough to print into a contract");
/* Kentucky asserts nothing today, so it seeds nothing. */
ok(m.legalPackFor("KY").rescission.confidence === "unknown", "Kentucky seeds no cancellation window it has not checked");

/* A pack is never borrowed from another state — the rule citeFor learned
   first, applied to contract law. */
const nm = m.legalPackFor("NM");
ok(!nm.rescission.value, "New Mexico gets no rescission window");
ok(!/Ohio/.test(`${nm.rescission.value} ${nm.rescission.note}`), "and no mention of Ohio's");
ok(!/three \(3\) business days/i.test(JSON.stringify(nm)), "no Ohio text leaks into another state's pack at all");
ok(nm.choiceOfLaw.confidence === "unknown", "not even the governing law is assumed");

/* ---------- confirming unlocks, and only for that state ---------- */
const confirmAll = (st) => {
  const o = { [st]: {} };
  m.BINDING_LEGAL_FIELDS.forEach((k) => { o[st][k] = { value: `${st} answer for ${k}`, at: "2026-08-05", by: "Jacob Henderson" }; });
  return o;
};
const ohConfirmed = confirmAll("OH");
ok(m.legalPackReady("OH", ohConfirmed), "confirming every binding field unlocks that state");
ok(!m.legalPackReady("KY", ohConfirmed), "and does not unlock the state next door");
ok(m.legalPackFor("OH", ohConfirmed).rescission.confidence === "verified", "a confirmation reaches the verified tier");
ok(m.legalPackFor("OH", ohConfirmed).rescission.verifiedBy === "Jacob Henderson", "carrying who");
ok(m.legalPackFor("OH", ohConfirmed).rescission.asOf === "2026-08-05", "and when");
/* Withdrawing one field re-blocks the state. */
const partial = { OH: { ...ohConfirmed.OH } };
delete partial.OH[m.BINDING_LEGAL_FIELDS[0]];
ok(!m.legalPackReady("OH", partial), "withdrawing one binding field blocks the state again");
/* A non-binding field is not a blocker — it informs, it does not print. */
const nonBinding = m.LEGAL_FIELDS.filter((f) => !f.binding).map((f) => f.key);
ok(nonBinding.length > 0 && nonBinding.every((k) => !m.legalPackGaps("OH", ohConfirmed).some((g) => g.key === k)),
  "an unconfirmed advisory field does not block signing");

/* ---------- what the document actually renders ---------- */
const brand = { company: "Supreme Building Group, Inc.", primary: "#2B3440", short: "SBG" };
const nmJob = {
  name: "Rosa Vigil", address: "14 Camino Real, Santa Fe, NM", zip: "87501", state: "NM",
  stageId: "s5", tasks: [], checklist: {}, payments: [], estimate: { items: [] },
  measurements: {}, contract: { price: 22400, depositPct: 50, status: "Not started" },
};
m.setLegalOverrides({});
const nmDoc = m.agreementDocHtml(nmJob, brand);
ok(!/State of Ohio and Kentucky/.test(nmDoc), "a New Mexico agreement does not recite Ohio and Kentucky");
ok(!/third business day/.test(nmDoc) && !/3rd business day/.test(nmDoc),
  "and does not tell a New Mexico homeowner they have Ohio's three days");
ok(/not confirmed\]/.test(nmDoc), "it prints a visible placeholder where the clause belongs");
ok(/Right to cancel for NM — not confirmed/.test(nmDoc), "naming the clause and the state");
ok(m.agreementBlockers(nmJob).length > 0, "and the job is blocked from signing");

/* The case that actually tests the gate, and the one a first pass misses:
   Ohio HAS a seeded value with real text in it. If the document printed
   anything with a value rather than anything verified, New Mexico would
   still show a placeholder (it has no value at all) and the test would
   pass while Ohio quietly shipped an unconfirmed statutory window. Caught
   by reintroducing exactly that bug and watching this file stay green. */
const ohJob = { ...nmJob, address: "8259 Spruce Needle Ct, Columbus, OH", zip: "43235", state: "OH" };
const ohDraft = m.agreementDocHtml(ohJob, brand);
ok(!/three \(3\) business days/i.test(ohDraft),
  "Ohio's seeded window does not print until somebody has confirmed it");
ok(/Right to cancel for OH — not confirmed/.test(ohDraft), "it shows the placeholder like anywhere else");
ok(m.agreementBlockers(ohJob).length > 0, "and an Ohio job is blocked too — seeded is not confirmed");
/* Then it prints, once confirmed, exactly as it always read. */
m.setLegalOverrides({ OH: { ...confirmAll("OH").OH,
  rescission: { value: "the third business day", at: "2026-08-05", by: "Jacob Henderson" } } });
const ohOk = m.agreementDocHtml(ohJob, brand);
ok(/prior to midnight of the third business day/.test(ohOk), "and once confirmed Ohio reads as it always did");
ok(m.agreementBlockers(ohJob).length === 0, "with signing unblocked");
m.setLegalOverrides({});

/* A job with no state at all is blocked, and says why — this is not a
   national contract, it is a contract nobody checked. */
ok(m.agreementBlockers({ ...nmJob, state: "" })[0].key === "state",
  "a job with no state is blocked on the state itself");

/* Once confirmed, the words the office wrote are the words that print. */
m.setLegalOverrides({ NM: {
  choiceOfLaw: { value: "the State of New Mexico", at: "2026-08-05", by: "Jacob Henderson" },
  rescission: { value: "the seventh calendar day", at: "2026-08-05", by: "Jacob Henderson" },
  noticeOfCancellation: { value: "Two copies, 12-point bold", at: "2026-08-05", by: "Jacob Henderson" },
  insuranceRescission: { value: "None on file", at: "2026-08-05", by: "Jacob Henderson" },
  deductibleNotice: { value: "Required", at: "2026-08-05", by: "Jacob Henderson" },
  financeCharge: { value: "1% per month", at: "2026-08-05", by: "Jacob Henderson" },
  downPayment: { value: "One third", at: "2026-08-05", by: "Jacob Henderson" },
  cancellationFee: { value: "Not enforceable", at: "2026-08-05", by: "Jacob Henderson" },
  warrantyFloor: { value: "None", at: "2026-08-05", by: "Jacob Henderson" },
  licenceOnContract: { value: "Licence number must appear", at: "2026-08-05", by: "Jacob Henderson" },
} });
const nmOk = m.agreementDocHtml(nmJob, brand);
ok(/the State of New Mexico/.test(nmOk), "a confirmed governing law prints");
ok(/prior to midnight of the seventh calendar day/.test(nmOk), "so does a confirmed cancellation window");
ok(!/not confirmed\]/.test(nmOk), "with no placeholder left behind");
ok(m.agreementBlockers(nmJob).length === 0, "and the job can be signed");
/* Both statements of the window agree, because they resolve the same field. */
ok((nmOk.match(/the seventh calendar day/g) || []).length === 2,
  "page one's cancel box and clause 21 state the same window");

/* The snapshot binds to the words, not to a reference that can be edited. */
const snap = m.renderedLegalText(nmJob);
ok(/Right to cancel: the seventh calendar day/.test(snap), "the signature snapshot carries the rendered text");
m.setLegalOverrides({ NM: { rescission: { value: "the fortieth day", at: "2026-08-06", by: "Someone Else" } } });
ok(/the seventh calendar day/.test(snap), "and a later edit to the pack does not change the snapshot already taken");
m.setLegalOverrides({});

/* stateName exists because "OH" reads as jargon in a sentence a rep acts on. */
ok(m.stateName("NM") === "New Mexico", "state codes resolve to names");
ok(m.stateName("ZZ") === "", "and an unknown code says nothing rather than printing undefined");

fs.unlinkSync(bundle);
if (fails) { console.log("\nbuild 57: " + fails + " FAILED"); process.exit(1); }
console.log("build 57 tests passed");
