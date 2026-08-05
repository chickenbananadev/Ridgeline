/* Build 53 — geography honesty.

   The app is expanding past Ohio. This round removed the places where it
   quietly assumed Ohio, or presented a guess as a checked fact. Each
   assertion below stands for a specific way a rep outside the home market
   was being given wrong information:

     - an Ohio code section cited on an out-of-state supplement
     - an Ohio county's building department returned for a New Jersey zip
     - a placeholder 555 number shown under a green "Verified" chip
     - a Virginia zip resolved to the DC construction codes
     - a Kentucky town routed to the wrong county's counter
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: the silent Ohio defaults are gone ---------- */
ok(!/\|\| "OH";/.test(src), "no bare Ohio fallback survives");
ok(!/IRC_BASE\[topic\] \|\| CODE_PROVISIONS\.OH\[topic\]/.test(src),
  "citeFor no longer reaches into the Ohio provisions for an unknown topic");
ok(!/stateSel: "OH"/.test(src), "the new-lead form no longer defaults the state to Ohio");
ok(/f\.zip\.trim\(\) && f\.stateSel/.test(src), "state is required to create a lead");
/* And it is derived from the zip rather than typed, so requiring it costs
   the rep nothing on a normal entry. */
ok(/const setZip = \(e\) => \{[\s\S]{0,200}stateForZip\(zip\)/.test(src),
  "the state is derived from the zip as it is typed");
/* Assert against the rendered string, not the source — the comment
   explaining the removal names the statute, and matching that would make
   this pass vacuously. */
ok(!/terms: "[^"]*Ohio Revised Code[^"]*"/.test(src),
  "the portal no longer cites an Ohio statute to every homeowner at signing");
ok(!/terms: "[^"]*\bOhio\b[^"]*"/.test(src), "no signing-terms string names a single state at all");

/* The seat-level state picker wrote "AL,Alabama" because US_STATES holds
   [abbrev, name] pairs and this one call site did not destructure. The
   per-state phone lines it feeds could therefore never match a job. */
ok(!/US_STATES\.map\(\(s\) => <option key=\{s\} value=\{s\}>/.test(src),
  "every US_STATES picker destructures the [abbrev, name] pair");
ok((src.match(/US_STATES\.map\(\(\[/g) || []).length === 3, "all three state pickers use the pair form");

/* County departments are keyed by state and county together. */
ok(/COUNTY_DEPARTMENTS\[`\$\{state\}:\$\{county\}`\]/.test(src), "department lookups are state-scoped");
ok((src.match(/COUNTY_DEPARTMENTS\[/g) || []).length === 2, "no unscoped department lookup remains");
ok(/"OH:Hamilton County"/.test(src) && /"KY:Campbell County"/.test(src), "the department table carries state-scoped keys");

/* No record may claim to be verified while carrying a placeholder number. */
const sampleBlock = src.slice(src.indexOf("const JURISDICTIONS"), src.indexOf("const CODE_PROVISIONS"));
ok(/555-0100/.test(sampleBlock), "the sample numbers are still there (they are honest placeholders)");
ok(!/verified: true/.test(sampleBlock), "but no sample record claims to be verified");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_geo53.jsx");
const bundle = path.join(__dirname, "_geo53.cjs");
fs.writeFileSync(scratch, src + "\nexport { stateForZip, resolveJurisdiction, citeFor, supplementFindings, MARKET_JURISDICTIONS, COUNTY_DEPARTMENTS };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_geo53.cjs");

/* 201xx is Loudoun County, Virginia — it sat inside the 200-205 DC block. */
ok(m.stateForZip("20147") === "VA", `Ashburn VA resolves to VA (got ${m.stateForZip("20147")})`);
ok(m.stateForZip("20176") === "VA", "Leesburg VA resolves to VA");
ok(m.stateForZip("20001") === "DC", "DC proper still resolves to DC");
ok(m.stateForZip("20500") === "DC", "the rest of the DC block is untouched");
ok(m.stateForZip("21201") === "MD", "Maryland is untouched");

/* 41042 is Florence, in Boone County. A disambiguator key for Taylor Mill
   ("41042b", listed under Kenton) was shadowing it, so the rep was sent to
   Kenton County's counter for a Boone County job. */
const florence = m.MARKET_JURISDICTIONS["41042"];
ok(florence && florence.city === "Florence", `41042 is Florence (got ${florence && florence.city})`);
ok(florence && florence.county === "Boone County", `41042 is in Boone County (got ${florence && florence.county})`);

/* A county name that exists in many states must not return another
   state's department. */
const njWarren = m.COUNTY_DEPARTMENTS["NJ:Warren County"];
ok(!njWarren, "a New Jersey county with the same name has no Ohio department attached");
ok(!!m.COUNTY_DEPARTMENTS["OH:Warren County"], "the Ohio record is still reachable under its scoped key");

/* An unknown topic must produce no citation rather than an Ohio one. */
const unknown = m.citeFor("TX", "someTopicNobodyCurated");
ok(unknown.cite === "" && unknown.missing === true, "an uncurated topic returns no cite");
ok(!/RCO/.test(unknown.note || ""), "and does not mention the Ohio code");
/* A curated state still works. */
ok(/R905/.test(m.citeFor("OH", "dripEdge").cite), "Ohio still cites Ohio");
/* An uncurated state falls back to the IRC base, clearly unverified. */
const tx = m.citeFor("TX", "dripEdge");
ok(/R905/.test(tx.cite) && tx.verified === false, "an uncurated state gets the IRC base, flagged unverified");
ok(!/RCO/.test(tx.cite), "and never an Ohio section number");

/* A supplement on a job whose zip does not resolve must not carry Ohio
   cites. This is the path that put "RCO R905.2.8.5" on a Texas claim. */
const jobNoZip = {
  zip: "", state: "", stageId: "s4", tasks: [], checklist: {}, contract: {}, payments: [],
  estimate: { items: [{ id: "a", desc: "Architectural shingles", qty: 30, unit: "SQ", price: 310 }] },
  measurements: { squares: "30", eaves: "160", rakes: "100", valleys: "40" },
};
const found = m.supplementFindings(jobNoZip);
ok(found.length > 0, "findings still fire without a resolvable zip");
ok(found.every((f) => !/RCO/.test(f.cite || "")), "no Ohio section number appears on a job with no state");
ok(found.every((f) => !/RCO/.test(f.why || "")), "nor in the rationale");

/* And a Texas job cites Texas's adopted code, not Ohio's. */
const txJob = { ...jobNoZip, zip: "78704", state: "TX" };
const txFound = m.supplementFindings(txJob);
ok(txFound.every((f) => !/RCO/.test(f.cite || "")), "a Texas job carries no Ohio cite");
ok(txFound.every((f) => f.verified !== true || !/RCO/.test(f.cite || "")), "and nothing Ohio is marked verified");

/* The state-level fallback has to ask for a building department rather than
   rendering a blank one as if it were on file. */
const tx78704 = m.resolveJurisdiction("78704");
ok(tx78704 && tx78704.state === "TX", "an out-of-market zip still resolves its state");
ok(tx78704 && tx78704.needsContact === true,
  "and asks for the building department instead of showing an empty record");
ok(tx78704 && tx78704.verified === false, "and is never marked verified");

fs.unlinkSync(bundle);
if (fails) { console.log("\nbuild 53: " + fails + " FAILED"); process.exit(1); }
console.log("build 53 tests passed");
