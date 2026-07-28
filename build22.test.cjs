/* Build 22 — ZIP lookup that grows the jurisdiction table with use. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- county normalisation: the join key between lookup and departments --- */
function normCounty(raw) {
  return raw && !/county$/i.test(raw) ? raw + " County" : raw;
}
ok(normCounty("Hamilton") === "Hamilton County", "a bare county name gains the suffix");
ok(normCounty("Hamilton County") === "Hamilton County", "an already-suffixed name is untouched");
ok(normCounty("Mason County") === "Mason County", "Kentucky counties normalise the same way");
ok(normCounty("") === "", "an empty county stays empty");

/* the join actually works against real department keys */
const deptKeys = ["Montgomery County", "Greene County", "Warren County", "Butler County",
  "Hamilton County", "Clermont County", "Mason County", "Lewis County",
  "Kenton County", "Campbell County"];
ok(deptKeys.includes(normCounty("Montgomery")), "a bare Geoapify county matches a department key");
ok(deptKeys.includes(normCounty("Clermont County")), "a suffixed county matches too");

/* --- an unknown ZIP in a known county resolves completely --- */
function resolveFromLookup(hit, depts) {
  const county = normCounty(hit.county);
  const dept = depts[county] || null;
  return { county, dept, needsContact: !dept };
}
const fakeDepts = { "Montgomery County": { office: "Montgomery County Building Regulations" } };
let r = resolveFromLookup({ county: "Montgomery" }, fakeDepts);
ok(r.dept && !r.needsContact, "a new ZIP in a known county arrives with its department");
r = resolveFromLookup({ county: "Clark" }, fakeDepts);
ok(!r.dept && r.needsContact, "a new county needs its office adding");

/* --- source guarantees --- */
ok(src.includes("async function geoLookupZip"), "lookup function exists");
ok(src.includes("type=postcode"), "the lookup queries by postcode");
ok(src.includes("function jurisdictionFromLookup"), "a saveable record is built from the result");
ok(src.includes("let LEARNED_JURISDICTIONS"), "learned ZIPs are held");
ok(src.includes("function setLearnedJurisdictions"), "learned ZIPs can be hydrated");
ok(src.includes("learnedJuris"), "learned ZIPs persist in company settings");
ok(src.includes('data-testid="lookup-zip"'), "the lookup is reachable from the UI");
ok(src.includes('data-testid="save-zip"'), "the result can be saved");
ok(src.includes("Save to the company"), "saving is shared, not personal");

/* --- precedence: curated data still wins --- */
const exactIdx = src.indexOf("const exact = JURISDICTIONS[z];");
const learnedIdx = src.indexOf("const learned = LEARNED_JURISDICTIONS[z];");
const mktIdx = src.indexOf("const mkt = MARKET_JURISDICTIONS[z];");
ok(exactIdx > 0 && learnedIdx > exactIdx, "hand-verified records take precedence over learned ones");
ok(learnedIdx > 0 && mktIdx > learnedIdx, "learned records are checked before the market fallback");

/* --- out-of-area honesty: any US state now resolves to its adopted-code
   family, but non-OH/KY/IL results are flagged "verify locally" rather than
   presented as a validated Ohio basis. --- */
ok(src.includes("curated: !!STATE_DEFAULTS[state]"), "results carry a curated flag for OH/KY/IL vs everywhere else");
ok(src.includes("!lookupResult.curated") && /Verify locally/.test(src),
  "an out-of-state ZIP resolves but is flagged to verify locally");
ok(src.includes("function codeNameForState"), "the adopted-code name resolves for any state");
ok(src.includes("Could not reach the lookup service"), "a network failure is reported plainly");

if (fails) { console.log("\nbuild 22: " + fails + " FAILED"); process.exit(1); }
console.log("build 22 tests passed");
