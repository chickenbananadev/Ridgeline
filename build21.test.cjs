/* Build 21 — market jurisdiction coverage, Dayton OH to Maysville KY. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- coverage --- */
const oh = src.match(/const OH_COUNTY_ZIPS = \{[\s\S]*?\n\};/)[0];
const ky = src.match(/const KY_COUNTY_ZIPS = \{[\s\S]*?\n\};/)[0];
const ohZips = (oh.match(/"\d{5}[a-z]?":/g) || []).length;
const kyZips = (ky.match(/"\d{5}[a-z]?":/g) || []).length;
ok(ohZips >= 140, "substantial Ohio coverage, got " + ohZips);
ok(kyZips >= 30, "substantial Kentucky coverage, got " + kyZips);

/* the corridor endpoints and the counties between them */
["Montgomery County", "Greene County", "Warren County", "Butler County",
 "Hamilton County", "Clermont County", "Brown County", "Clinton County",
 "Highland County", "Adams County", "Preble County", "Miami County"].forEach((c) => {
  ok(oh.includes(`"${c}"`), `Ohio covers ${c}`);
});
["Mason County", "Lewis County", "Bracken County", "Campbell County",
 "Kenton County", "Boone County", "Fleming County", "Pendleton County"].forEach((c) => {
  ok(ky.includes(`"${c}"`), `Kentucky covers ${c}`);
});

/* the two named endpoints */
ok(oh.includes('"45402": "Dayton"'), "Dayton is covered");
ok(ky.includes('"41056": "Maysville"'), "Maysville is covered");
/* jobs already in the system */
ok(ky.includes('"41179": "Vanceburg"'), "Vanceburg, an existing job, is covered");
ok(oh.includes('"45240": "Forest Park"'), "Forest Park, an existing job, is covered");

/* --- the resolver --- */
ok(src.includes("const MARKET_JURISDICTIONS"), "market records are built");
ok(src.includes("function buildMarketJurisdictions"), "records are generated, not hand-written");
ok(src.includes('return { ...mkt, precision: "market" }'), "market ZIPs resolve at market precision");
ok(src.includes("needsContact: true"), "records admit the contact is missing");

/* precision ordering: an explicitly verified record still wins */
const order = src.indexOf("const exact = JURISDICTIONS[z];");
const mkt = src.indexOf("const mkt = MARKET_JURISDICTIONS[z];");
ok(order > 0 && mkt > order, "hand-verified records take precedence over generated ones");

/* --- office-supplied contacts --- */
ok(src.includes("let JURIS_OVERRIDES"), "office overrides exist");
ok(src.includes("function setJurisOverrides"), "overrides can be set");
ok(src.includes("jurisContacts"), "contacts persist in company settings");
ok(src.includes("Saved for the whole company"), "saving is shared, not personal");
ok(src.includes("a dead line on a permit call costs more than an empty field")
  || src.includes("dead\n                    line on a permit call costs more than an empty field"),
  "the blank-contact decision is explained");

/* --- researched departments --- */
ok(src.includes("const COUNTY_DEPARTMENTS"), "department data exists");
const counties = ["Montgomery County", "Greene County", "Warren County", "Butler County",
  "Hamilton County", "Clermont County", "Mason County", "Lewis County",
  "Kenton County", "Campbell County"];
counties.forEach(function (c) {
  ok(src.indexOf('"' + c + '": {') !== -1, c + " has a researched department record");
});
ok(src.includes("9372254622"), "Montgomery County number stored as digits");
ok(src.includes("5139464550"), "Hamilton County number stored");
ok(src.includes("6065642525"), "Maysville building official number stored");
ok(src.includes("5137327213"), "Clermont Permit Central number stored");
ok(src.includes("No local building inspector"), "Lewis County has no inspector, and says so");
ok(src.includes("Does NOT cover Fairborn, Xenia"), "Greene County exclusions are recorded");
ok(src.includes("City of Cincinnati runs its own Permit Center"), "Cincinnati is flagged as separate");
ok(src.includes("not residential there"), "Clermont covers only commercial in Brown County");
ok(src.includes('checked: "Jul 2026"'), "records carry a lookup date");
ok(src.includes("Check this before you apply"), "exceptions are surfaced, not buried");
ok(src.includes("needsContact: !dept"), "records with a department are not marked as missing one");

/* phone numbers are stored as digits so formatting is single-sourced */
const deptBlock = src.slice(src.indexOf("const COUNTY_DEPARTMENTS"), src.indexOf("/* Flatten the county maps"));
ok(!/phone: "\(\d{3}\)/.test(deptBlock), "department phones are stored unformatted");

if (fails) { console.log("\nbuild 21: " + fails + " FAILED"); process.exit(1); }
console.log("build 21 tests passed");
