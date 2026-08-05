/* Build 56 — the assistant answers for one state, not for Ohio.

   The retrieval index was flat and stateless. Every record about what the
   law requires was Ohio's, and nothing said so, so a New Mexico rep asking
   "how far does ice barrier have to go" got RCO R905.1.2 quoted back with a
   citation chip attached. The edge function made it worse: its prompt says
   to use a record's citation verbatim, so the model repeated the section
   number as though it governed Albuquerque.

   The important half of this is the *fallback* path. `answerClaim` runs
   unconditionally before any network call and its hits render on screen with
   no model in the loop, so filtering has to live in the scorer. A test that
   only exercised the edge function would pass while the bug shipped.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static wiring ---------- */
ok(/function answerClaim\(q, limit = 4, state = ""\)/.test(src), "the scorer takes the state");
ok(/const hits = answerClaim\(question, 4, askState\);/.test(src), "the on-screen cards are filtered");
ok(/const grounding = answerClaim\(question, 12, askState\);/.test(src), "and so is the model's grounding");
/* Both call sites, not one. The cards render without the model, so filtering
   only the grounding would leave the leak fully intact on the fallback path. */
ok((src.match(/answerClaim\(question, \d+, askState\)/g) || []).length === 2,
  "no answerClaim call site was left unfiltered");

/* The penalty must be multiplicative — scoring adds covered² × 2, so a
   subtraction is swamped by the coverage term on a long question. */
ok(/score: x\.score \* 0\.2/.test(src), "the out-of-state penalty is a multiplier, not a subtraction");
ok(/const LAW_STATING_TAGS = new Set\(\["Code", "Policy", "Playbook", "Supplement"\]\);/.test(src),
  "the tags that assert what the law requires are named");

/* The component has a state source when there is no job to take one from. */
ok(/function ClaimAssistant\(\{ job = null, defaultState = "" \}\)/.test(src),
  "the hub instance can be given a state");
ok(/useState\(\(job && job\.state\) \|\| defaultState \|\| ""\)/.test(src), "which seeds the picker");
ok(/useEffect\(\(\) => \{ if \(job && job\.state\) setAskState\(job\.state\); \}/.test(src),
  "and the job's state wins when the job loads or changes");
/* tplState used to default to "OH" — the letter and supplement screens
   answered for Ohio for every tenant in the country until someone noticed
   the picker. */
ok(!/useState\("OH"\)/.test(src), "no state picker defaults to Ohio");

/* The transport carries the tag so the model can weigh it. */
ok(/state: h\.state \|\| "national",/.test(src), "each grounding record tells the model whose law it is");

/* ---------- edge function ---------- */
const fn = fs.readFileSync(path.join(__dirname, "supabase/functions/ai-assistant/index.ts"), "utf8");
ok(/state="\$\{st\}"/.test(fn), "the record tag carries the state through to the prompt");
ok(/state="national" means it applies anywhere/.test(fn), "the prompt explains what national means");
ok(/Never present one state's code section or insurance regulation as the answer for a different state/.test(fn),
  "and the verbatim-citation rule is now bounded by jurisdiction");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_ask56.jsx");
const bundle = path.join(__dirname, "_ask56.cjs");
fs.writeFileSync(scratch, src + "\nexport { answerClaim, claimCorpus, LAW_STATING_TAGS, US_STATES };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_ask56.cjs");

const corpus = m.claimCorpus();
ok(corpus.length > 100, `the corpus still builds (${corpus.length} records)`);

/* Every record declares a jurisdiction. `state: undefined` and `state: null`
   both mean national — what must not exist is a record whose state is a
   two-letter code the filter cannot read. */
const badState = corpus.filter((r) => r.state != null && !/^[A-Z]{2}$/.test(r.state));
ok(badState.length === 0, `every state tag is a two-letter code (${badState.length} are not)`);

/* The Ohio-only sources are actually tagged. If these come back national the
   filter has nothing to bite on and every assertion below passes vacuously. */
const ohio = corpus.filter((r) => r.state === "OH");
ok(ohio.length >= 20, `the Ohio records are tagged as Ohio (found ${ohio.length})`);
const national = corpus.filter((r) => !r.state);
ok(national.length > ohio.length, "and the bulk of the library is still national");

/* An Ohio section number must not appear in a record that claims to be
   national — that is the tagging bug this whole part exists to fix. */
/* Title included deliberately: several LAW_ITEMS records carry the section
   number in the title and nowhere else, so a cite-and-body check reported
   the corpus clean while an untagged "OAC 3901-1-54" was reaching New
   Mexico. Verified by untagging LAW_ITEMS and watching this stay green. */
const mislabelled = national.filter((r) => /\b(RCO|OAC)\b/.test(`${r.title || ""} ${r.cite || ""} ${r.body || ""}`));
ok(mislabelled.length === 0,
  `no national record carries an Ohio section (${mislabelled.length}: ${mislabelled.slice(0, 3).map((r) => r.title).join(" | ")})`);

/* A national record must not name a state either. Section numbers were the
   obvious leak; prose was the quiet one — "Ohio applies efficient proximate
   cause" and "In Ohio this is ORC Chapter 3951" both shipped inside records
   the filter treats as applying everywhere, and both read as the rule to a
   rep in New Mexico. Found by reading the cards in a browser, not by any
   assertion above, which is why this one exists.

   The allowlist is the point of the test: naming a state is sometimes a
   fact about a factory or about this app's own coverage rather than a claim
   about law. A new record that names a state has to be looked at and added
   here deliberately, or it fails. */
const NAMES_A_STATE_LEGITIMATELY = [
  /* Where a manufacturer's plant is. */
  "CertainTeed Landmark (English size)",
  "Pabco Premier / Prestige / Radiance",
  /* Which states this app has a validated library for — a statement about
     the software, not about anyone's law. */
  "Code lookup by ZIP — any state",
];
const stateNames = (typeof m.US_STATES !== "undefined" ? m.US_STATES : []).map(([, n]) => n);
const namesAState = new RegExp(`\\b(${stateNames.join("|")})\\b`);
const prose = national
  .filter((r) => !NAMES_A_STATE_LEGITIMATELY.includes(r.title))
  .filter((r) => namesAState.test(`${r.title || ""} ${r.body || ""}`));
ok(prose.length === 0,
  `no national record names a state in its prose (${prose.length}: ${prose.slice(0, 3).map((r) => `${r.title} → ${(`${r.title} ${r.body}`.match(namesAState) || [])[0]}`).join(" | ")})`);

/* ---------- the New Mexico question ---------- */
const QUESTIONS = [
  "how far does the ice barrier have to extend past the wall",
  "does the carrier owe drip edge on the eaves and rakes",
  "the adjuster is refusing to match my discontinued siding",
  "how long does the carrier have to acknowledge my claim",
];
for (const q of QUESTIONS) {
  const nm = m.answerClaim(q, 12, "NM");
  const blob = nm.map((r) => `${r.title} ${r.cite || ""} ${r.body || ""}`).join(" ");
  ok(!/\bRCO\b/.test(blob), `"${q.slice(0, 34)}…" returns no RCO section in New Mexico`);
  ok(!/\bOAC\b/.test(blob), `"${q.slice(0, 34)}…" returns no Ohio administrative code in New Mexico`);
  ok(nm.every((r) => !r.state || r.state === "NM"), `and no record tagged to another state at all`);
}

/* Ohio must keep working. The filter is not allowed to be a blanket ban on
   state-tagged records — that would quietly gut the home market. */
const oh = m.answerClaim("how long does the carrier have to acknowledge my claim", 12, "OH");
ok(oh.some((r) => /\bOAC\b/.test(`${r.cite || ""} ${r.body || ""}`)),
  "an Ohio rep still gets the Ohio claim-handling rule");
ok(oh.some((r) => r.state === "OH"), "and Ohio-tagged records still surface in Ohio");

/* No state given — the picker's "All states" option — filters nothing, so
   the assistant behaves exactly as it did before this change. */
const anywhere = m.answerClaim("how long does the carrier have to acknowledge my claim", 12, "");
ok(anywhere.some((r) => r.state === "OH"), "with no state selected nothing is filtered");

/* National records must reach every state. A filter that dropped them would
   leave a Nevada rep with no manufacturer specs and no IRC. */
const NATIONAL_Q = [
  ["how many nails per shingle does the manufacturer require", "Manufacturer"],
  ["what does the IRC require for attic ventilation", "Code"],
];
for (const st of ["NM", "NV", "TX", "FL", "OH", "AK"]) {
  for (const [q, tag] of NATIONAL_Q) {
    const hits = m.answerClaim(q, 8, st);
    ok(hits.length > 0, `"${q.slice(0, 28)}…" still answers in ${st}`);
    ok(hits.some((r) => !r.state), `and reaches a national record in ${st}`);
    ok(hits.some((r) => r.tag === tag), `including a ${tag} record in ${st}`);
  }
}

/* The down-weight, not the drop: a record that is out of state but does not
   state law (a carrier pattern, a glossary term) may still appear — it just
   must not outrank an in-state or national record that covers as much. */
const nmAll = m.answerClaim("matching discontinued profile", 12, "NM");
const firstOff = nmAll.findIndex((r) => r.state && r.state !== "NM");
ok(firstOff === -1 || firstOff >= 1, "an out-of-state record never leads the results");

/* The supplement templates carried a literal {CITE} token into the corpus,
   so the source card read "Per {CITE}, ice barrier is required…". */
ok(!corpus.some((r) => /\{CITE\}/.test(r.body || "")), "no corpus record shows an unresolved token");
ok(corpus.some((r) => r.tag === "Supplement" && r.topic), "supplement templates carry their topic for per-state resolution");

fs.unlinkSync(bundle);
if (fails) { console.log("\nbuild 56: " + fails + " FAILED"); process.exit(1); }
console.log("build 56 tests passed");
