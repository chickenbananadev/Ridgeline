/* Build 73 — remove the per-state legal-clause gate. The attorney has
   reviewed and approved the contract as written; the confirm-before-signing
   system (LEGAL_FIELDS/LEGAL_PACK_SEED/legalPackFor/CoverageByState, the
   "Not ready to sign" block on TabContract, and the bracketed
   "[... — not confirmed]" placeholders it could print) is gone. Signing,
   executing, printing and emailing a contract no longer depend on any
   state having been confirmed on an admin screen, and the two state-law
   template tokens ({state}, {rescission}) always resolve to real text. */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- the whole gating subsystem is actually gone ---------- */
ok(!/function CoverageByState/.test(src), "CoverageByState admin component removed");
ok(!/function legalPackFor/.test(src), "legalPackFor removed");
ok(!/function legalPackGaps/.test(src), "legalPackGaps removed");
ok(!/function legalPackReady/.test(src), "legalPackReady removed");
ok(!/const LEGAL_FIELDS/.test(src), "LEGAL_FIELDS registry removed");
ok(!/const LEGAL_PACK_SEED/.test(src), "LEGAL_PACK_SEED removed");
ok(!/const LEGAL_AUTHORITIES/.test(src), "LEGAL_AUTHORITIES removed");
ok(!/function agreementBlockers/.test(src), "agreementBlockers removed");
ok(!/function renderedLegalText/.test(src), "renderedLegalText removed");
ok(!/function agreementFillLegal/.test(src), "agreementFillLegal (the bracket-placeholder renderer) removed");
ok(!/setLegalOverrides|LEGAL_OVERRIDES/.test(src), "the module-scope legal-override plumbing removed");
ok(!/stateFacts/.test(src), "stateFacts state and its persistence wiring removed");
ok(!/onConfirmLegal|onClearLegal/.test(src), "the confirm/withdraw handlers removed");
ok(!/insurance:coverage/.test(src), "the 'Coverage by state' nav entry removed — no dangling menu item");
ok(!/Not ready to sign in/.test(src), "the blocking Callout text is gone from TabContract");
ok(!/blockers\.length/.test(src), "no control in TabContract is disabled by 'blockers' anymore");
ok(!/— not confirmed\]/.test(src), "the bracketed not-confirmed placeholder text can no longer be produced");
ok(!/NAAG_DIRECTORY|NASCLA_DIRECTORY/.test(src), "the now-unused AG/licensing-board directory constants removed");
/* NAIC_DIRECTORY has an independent consumer (regulatorFor) and must survive. */
ok(/NAIC_DIRECTORY/.test(src) && /regulatorFor/.test(src), "regulatorFor and its NAIC_DIRECTORY constant are untouched — unrelated feature");

/* ---------- print/send/sign controls are unconditionally enabled ---------- */
ok(/disabled=\{locked\}><PenLine size=\{13\} \/> Sign here/.test(src),
  "the company-rep 'Sign here' button is gated only on `locked`, not on any per-state confirmation");
ok(/con\.clientSig && con\.contractorSig && !locked && \(/.test(src),
  "'Execute contract' shows once both signatures exist and it's unlocked — no separate gap-count condition");
ok(/<Send size=\{15\} \/> Email to client/.test(src) && !/disabled=\{blockers/.test(src),
  "'Email to client' is no longer disabled by unresolved state clauses");

/* ---------- portalDocuments no longer withholds the contract on legalReady ---------- */
ok(/if \(con && con\.price && con\.status !== "Signed" && portal\.contract\) \{/.test(src),
  "the contract enters signDocs on price/status/portal alone — the legalReady(job.state) clause is gone");
ok(!/legalPackState|legalPackVersion/.test(src),
  "the now-meaningless legalPackState/legalPackVersion snapshot fields are gone from the signature record");

/* ---------- agreementFill still exists and resolves unconditionally ---------- */
ok(/function agreementFill\(text, brand, state\)/.test(src), "agreementFill survives as the {company}/{state}/{rescission} filler");
ok(/\.replace\(\/\\\{state\\\}\/g, stateName\(state\)/.test(src), "{state} resolves via stateName(), a plain factual lookup");
ok(/three \(3\) business days/.test(src), "{rescission} resolves to a fixed, federally-safe default");

/* ---------- behavioral: agreementFill never emits a placeholder ---------- */
const scratch = path.join(__dirname, "_b73.jsx");
const bundle = path.join(__dirname, "_b73.cjs");
fs.writeFileSync(scratch, src + "\nexport { agreementFill, stateName };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b73.cjs");

const brand = { company: "Supreme Building Group" };
const tpl = "Governed by {state} law. Cancel within {rescission}. Contact {company}.";

const oh = m.agreementFill(tpl, brand, "OH");
ok(oh === "Governed by Ohio law. Cancel within three (3) business days. Contact Supreme Building Group.",
  `OH resolves to real state name + fixed rescission text (got: ${oh})`);

const mo = m.agreementFill(tpl, brand, "MO");
ok(mo === "Governed by Missouri law. Cancel within three (3) business days. Contact Supreme Building Group.",
  `MO (never seeded/confirmed under the old system) still resolves cleanly now (got: ${mo})`);

const noState = m.agreementFill(tpl, brand, "");
ok(!/\[.*not confirmed\]/.test(noState), `a missing state never produces a bracketed placeholder (got: ${noState})`);
ok(noState.includes("the property's state"), `a missing state falls back to a plain phrase, not a blank or a bracket (got: ${noState})`);

ok(m.stateName("KY") === "Kentucky", "stateName still resolves normally (unaffected by this change)");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 73: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 73 tests passed");
