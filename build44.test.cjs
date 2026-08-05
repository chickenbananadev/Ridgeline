/* Build 44 — robustness round: taller sheets, address fix, property lookup,
   supplement engine, reporting depth, global search + bulk, dup detection,
   depreciation tracking, and the link-preview OG tags. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
const html = require("fs").readFileSync("./index.html", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* A1 — taller sheets */
ok(/minHeight: tall \? "55vh" : undefined/.test(src), "Sheet gains a tall prop");
ok(/title="Estimate templates" tall/.test(src), "Estimate templates sheet opens tall");

/* A2 — address search */
ok(src.includes("let GEO_BIAS") && src.includes("bias=proximity:"), "address search is proximity-biased");
ok(src.includes("stateSel: it.state || p.stateSel"), "address pick keeps any state");
ok(src.includes("US_STATES.map(([ab]) =>"), "state dropdown lists all states");

/* A3 — link preview */
ok(/property="og:image"/.test(html) && html.includes("og-image.png"), "OG image meta present");
ok(html.includes("Built for Roofing. Made to Move."), "tagline in meta");
ok(require("fs").existsSync("./public/og-image.png"), "branded OG image exists");

/* A4 — property record */
ok(src.includes("const PROPERTY_PROVIDER") && src.includes("window.__PROPERTY_KEY__"), "property provider scaffold");
ok(src.includes("function PropertyRecordCard") && src.includes("countyRecordsLink"), "property card + free county link");
ok(src.includes("yearBuilt: existingPropertyJob?.property?.yearBuilt"), "yearBuilt persisted on property");

/* B1 — supplement engine */
ok(src.includes("citeFor(state, opts.topic)"), "supplement findings cite the job's state");
ok(/Kickout \/ diverter flashing/.test(src), "added kickout flashing check");
ok(src.includes("Overhead & profit (O&P)"), "added O&P check on claims");
ok(src.includes("const addToEstimate") && src.includes("const addAsSupplement"), "findings are actionable");

/* B2 — reporting */
ok(src.includes("weightedPipeline") && src.includes("Weighted pipeline"), "weighted pipeline metric");
ok(src.includes("Crew throughput"), "crew throughput table");

/* B3 — search + bulk */
ok(src.includes("j.insurance?.claim, j.claim?.claim"), "search covers phone/email/claim");
ok(src.includes("const [selecting, setSelecting]") && src.includes("onBulkUpdate"), "bulk select + update");
ok(src.includes("jobs-export.csv"), "bulk CSV export");

/* B4 — dup detection */
ok(src.includes("const contactDupes"), "phone/email duplicate detection");

/* B5 — depreciation */
ok(src.includes("const setDepStatus") && /depStatus/.test(src), "depreciation release status");
/* The standalone dashboard banner became an exception-feed row in the
   workflow round — same nudge, one place to look instead of two. */
ok(/in recoverable depreciation not yet requested/.test(src), "held depreciation surfaces as a blocker");

if (fails) { console.log("\nbuild 44: " + fails + " FAILED"); process.exit(1); }
console.log("build 44 tests passed");
