/* Build 45 — Claim Assistant (KB retrieval) + audit fixes + Insurance section. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- Claim Assistant --- */
ok(src.includes("function buildClaimCorpus"), "claim corpus builder exists");
/* Now memoized behind claimCorpus() rather than built at module load — the
   corpus reaches constants declared later in the file, and a const in its
   temporal dead zone throws on access. Still built exactly once. */
ok(/_claimCorpus = buildClaimCorpus\(\)/.test(src) && /if \(!_claimCorpus\)/.test(src),
  "corpus is built once, lazily");
ok(src.includes("function answerClaim"), "retrieval scorer exists");
ok(src.includes("function ClaimAssistant"), "assistant component exists");
ok(src.includes('["ask", "Assistant"]'), "assistant is a hub tab");
/* The hub instance has no job, so it now takes a state from the hub's own
   picker rather than answering for nowhere in particular. Match the opening
   tag, not the exact self-closing render. */
ok(/\{tab === "ask" && <ClaimAssistant[ /]/.test(src), "assistant tab renders the component");
ok(src.includes('"insurance:ask"'), "assistant has a menu deep-link");
ok(src.includes("not legal advice"), "answers carry a verify disclaimer");
// corpus draws from multiple KB sources
["KB_CODES", "KB_TERMS", "CLAIM_SCENARIOS", "SUPPLEMENT_TEMPLATES"].forEach((kb) =>
  ok(src.includes(`(${kb} || []).forEach`) || src.includes(`${kb} !== "undefined"`) || new RegExp(`\\(${kb}`).test(src), `corpus includes ${kb}`));

/* --- audit fixes --- */
ok(!/Object\.entries\(CODE_PROVISIONS\[juris\.state\]\)/.test(src), "code-lookup provisions no longer index CODE_PROVISIONS by raw state (crash fixed)");
ok(src.includes("tiers.length && est.selectedTier") && src.includes("applyEstimateSelection(next)"),
  "supplement 'Add to estimate' writes to the active tier when tiers are on");
ok(src.includes("(job.checklist || {}).layers"), "checklist.layers accesses are guarded");
ok(src.includes("skylight|vent|flash|boot|pipe|jack"), "subCodeFor excludes accessory installs from per_square");

/* --- Insurance section --- */
ok(src.includes('"Insurance & resources"'), "Insurance is its own top-level menu group");

if (fails) { console.log("\nbuild 45: " + fails + " FAILED"); process.exit(1); }
console.log("build 45 tests passed");
