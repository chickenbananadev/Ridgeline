/* Build 55 — the verification ladder.

   Two bugs shipped from one root cause: placeholder phone numbers under a
   green "Verified" chip, and Ohio code sections marked verified on an
   out-of-state supplement. Both were somebody setting `verified: true` on
   data that was not. So confidence is now a value the render path reads
   rather than a flag the author sets, and `printable()` is the gate on
   anything that leaves the building.

   The tests that matter here are the ones about *leaving the building*.
   Every leak this covers goes to a carrier, an adjuster, or the claim
   record a rep reads from — none of them were in a PDF, which is where a
   first look would have gone hunting.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static wiring ---------- */
ok(/const FACT_TIERS = \["unknown", "seeded", "derived", "verified"\];/.test(src), "the tiers are declared in order");
ok(/f\.confidence === "verified" && !!String\(f\.value \|\| ""\)\.trim\(\)/.test(src),
  "printable requires the verified tier AND an actual value");
ok(/function Cited\(\{ fact: f, compact = false, style \}\)/.test(src), "Cited exists");
/* The whole point: the caller cannot choose the tone. */
ok(/const tone = factTone\(x\);/.test(src), "Cited computes its own tone from the fact");
ok(!/<Cited[^>]*tone=/.test(src), "no caller passes a tone to Cited");

/* The three old vocabularies are gone from the cite surfaces. */
ok(!/<Chip tone=\{f\.verified \? "blue" : "amber"\}>\{f\.cite\}/.test(src), "supplement rows use Cited");
ok(!/<Chip tone=\{p\.verified \? "blue" : "amber"\}>\{p\.cite\}/.test(src), "code-lookup provisions use Cited");
ok(!/<Chip tone=\{p\.srcOH === "RCO" \? "blue" : "amber"\}/.test(src), "no tone driven by a source id");
ok(!/\{h\.cite && <span style=\{\{ fontSize: 12, fontWeight: 700, color: T\.accent \}\}>/.test(src),
  "the assistant's source cards no longer print a bare unqualified cite");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_fact55.jsx");
const bundle = path.join(__dirname, "_fact55.cjs");
fs.writeFileSync(scratch, src + "\nexport { fact, asFact, printable, factTone, citeFor, renderLetter, regulatorFor, LETTER_TEMPLATES };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_fact55.cjs");

/* The ladder itself, as a property. */
for (const tier of ["unknown", "seeded", "derived"]) {
  ok(!m.printable(m.fact("R905.2.8.5", { confidence: tier })), `${tier} is not printable`);
  ok(m.factTone(m.fact("x", { confidence: tier })) !== "green", `${tier} never renders green`);
}
ok(m.printable(m.fact("R905.2.8.5", { confidence: "verified" })), "verified is printable");
/* A confident fact with nothing in it is a bug upstream, not something to
   print. This exact combination made renderLetter report ready:true while
   emitting "[code citation for dripEdge — not on file]". */
ok(!m.printable(m.fact("", { confidence: "verified" })), "an empty verified fact is not printable");
ok(!m.printable({ confidence: "verified", cite: "" }), "nor an empty one in the older cite shape");
ok(m.printable({ confidence: "verified", cite: "RCO R905.2.8.5" }), "but the older cite shape still resolves its value");
ok(m.factTone(m.fact("x", { confidence: "verified" })) === "green", "verified is the only green");
/* A value with no stated confidence must not default to trusted. */
ok(m.fact("something").confidence === "seeded", "an unstated confidence defaults to seeded, not verified");
ok(m.fact("").confidence === "unknown", "an empty value is unknown");

/* citeFor speaks the same vocabulary. */
ok(m.asFact(m.citeFor("OH", "dripEdge")).confidence === "verified", "a curated Ohio cite is verified");
ok(m.asFact(m.citeFor("TX", "dripEdge")).confidence === "derived", "an IRC fallback is derived, not verified");
ok(m.asFact(m.citeFor("TX", "nonsenseTopic")).confidence === "unknown", "an uncurated topic is unknown");
ok(!m.printable(m.citeFor("TX", "dripEdge")), "so a Texas cite cannot be sent to a carrier unchecked");

/* ---------- the letters, which are the worst leak ---------- */
const supp = m.LETTER_TEMPLATES.find((t) => t.id === "lt-supp");
ok(!/RCO R905/.test(supp.body), "the supplement letter body carries no hardcoded Ohio section");
ok(/\{CITE:dripEdge\}/.test(supp.body), "it carries a token instead");
const odi = m.LETTER_TEMPLATES.find((t) => t.id === "lt-odi");
ok(!/Columbus, OH 43215/.test(odi.body), "the regulator letter is not pre-addressed to Ohio");
ok(/\{REGULATOR_BLOCK\}/.test(odi.body), "it resolves the regulator instead");

/* Ohio still works, and still says what it always said. */
const oh = m.renderLetter(supp, "OH");
ok(oh.ready, "the supplement letter is ready to send in Ohio");
ok(/RCO R905\.2\.8\.5/.test(oh.body), "and resolves to the Ohio drip-edge section");
ok(!/\{CITE/.test(oh.body), "with no token left behind");

/* Texas must not receive Ohio law, and must not be sendable on a cite
   nobody has checked. */
const tx = m.renderLetter(supp, "TX");
ok(!/RCO/.test(tx.body), "a Texas supplement letter contains no Ohio section number");
ok(!/OAC/.test(tx.body), "and no Ohio administrative code");
ok(!/IECC Climate Zones 4A and 5A/.test(tx.body), "and does not assert Ohio's climate zones");
ok(!tx.ready, "and is blocked from copying because its cites are unverified there");
ok(tx.blocking.length > 0, "with the specific unresolved references named");

const odiTx = m.renderLetter(odi, "TX");
ok(!/Columbus/.test(odiTx.body), "a Texas complaint is not addressed to Columbus");
ok(!odiTx.ready, "and is blocked until the right agency is on file");
ok(m.regulatorFor("TX").sourceUrl.includes("naic.org"),
  "pointing at the NAIC directory rather than inventing an address");
ok(m.regulatorFor("OH").confidence === "verified", "Ohio's regulator is on file and verified");

/* The matching argument is an Ohio regulation most states do not have. */
const match = m.LETTER_TEMPLATES.find((t) => t.id === "lt-match");
ok(!/OAC 3901-1-54/.test(match.body), "the matching letter carries no hardcoded Ohio regulation");
ok(/OAC 3901-1-54/.test(m.renderLetter(match, "OH").body), "which still resolves for Ohio");
const matchTx = m.renderLetter(match, "TX");
ok(!/OAC/.test(matchTx.body), "and resolves to a policy argument in Texas");
ok(/like kind and quality/.test(matchTx.body), "rather than to nothing at all");

/* An Ohio case is not authority in Texas. */
const appr = m.LETTER_TEMPLATES.find((t) => t.id === "lt-appraisal");
ok(!/Schwartz/.test(m.renderLetter(appr, "TX").body), "no Ohio case cited to a Texas carrier");
ok(/Schwartz/.test(m.renderLetter(appr, "OH").body), "still cited in Ohio");

/* ---------- the other outbound paths ---------- */
ok(/const cite = printable\(cf\) && cf\.value \? ` \[\$\{cf\.value\}\]` : "";/.test(src),
  "an unverified cite is left off the claim-record supplement row");
ok(/citeConfidence: cf\.confidence/.test(src), "and the tier travels with the row instead of being discarded");
ok(!/const cite = "IRC \/ RCO R806\.2";/.test(src), "the ventilation supplement no longer hardcodes a dual OH/IRC cite");
ok(/const vf = asFact\(citeFor\(job\.state \|\| "", "ventilation"\)\)/.test(src), "it resolves against the property's state");
ok(/const canCopy = printable\(pf\);/.test(src), "supplement-template copying is gated on the cite being verified");
ok(/t\.wording\.replace\(\/Per \\\{CITE\\\},\\s\*\/g, ""\)/.test(src),
  'a missing cite drops the clause rather than producing "Per , …"');
ok(/printable\(kf\)\s*\n\s*\? `\$\{c\.supplement\}\\n\\nAuthority/.test(src),
  '"Authority:" is only used for a verified cite');

fs.unlinkSync(bundle);
if (fails) { console.log("\nbuild 55: " + fails + " FAILED"); process.exit(1); }
console.log("build 55 tests passed");
