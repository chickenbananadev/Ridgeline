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

/* --- no invented contact data --- */
const marketBlock = src.slice(src.indexOf("const OH_COUNTY_ZIPS"), src.indexOf("const MARKET_JURISDICTIONS"));
ok(!/\(\d{3}\)\s?\d{3}-\d{4}/.test(marketBlock), "no fabricated phone numbers in the market data");

if (fails) { console.log("\nbuild 21: " + fails + " FAILED"); process.exit(1); }
console.log("build 21 tests passed");
