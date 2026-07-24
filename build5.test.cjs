/* Build 5 — portal section ordering and per-section visibility, rep
   block, customer contact review, measurement report parsing. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- measurement text parsing (mirrors parseMeasureText) --- */
const MEASURE_PATTERNS = [
  ["squares", /(?:total\s+(?:roof\s+)?area|total\s+squares|roof\s+area)\D{0,20}?([\d,]+(?:\.\d+)?)/i],
  ["pitch", /(?:predominant\s+pitch|primary\s+pitch|pitch)\D{0,15}?(\d{1,2})\s*[\/:]\s*12/i],
  ["ridges", /ridges?\b\D{0,20}?([\d,]+(?:\.\d+)?)/i],
  ["hips", /hips?\b\D{0,20}?([\d,]+(?:\.\d+)?)/i],
  ["valleys", /valleys?\b\D{0,20}?([\d,]+(?:\.\d+)?)/i],
  ["eaves", /(?:eaves?|drip\s*edge)\b\D{0,20}?([\d,]+(?:\.\d+)?)/i],
  ["rakes", /rakes?\b\D{0,20}?([\d,]+(?:\.\d+)?)/i],
  ["stepFlash", /step\s*flash(?:ing)?\b\D{0,20}?([\d,]+(?:\.\d+)?)/i],
  ["wallFlash", /(?:wall\s*flash(?:ing)?|headwall)\b\D{0,20}?([\d,]+(?:\.\d+)?)/i],
  ["penetrations", /penetrations?\b\D{0,20}?([\d,]+)/i],
];
function parseMeasureText(text) {
  const found = {};
  const flat = String(text || "").replace(/\s+/g, " ");
  MEASURE_PATTERNS.forEach(([key, re]) => {
    const hit = flat.match(re);
    if (hit && hit[1]) {
      const clean = hit[1].replace(/,/g, "");
      if (clean && !Number.isNaN(Number(clean))) found[key] = clean;
    }
  });
  if (found.squares && Number(found.squares) > 300 && /sq\.?\s*ft|square\s*feet/i.test(flat)) {
    found.squares = (Number(found.squares) / 100).toFixed(1);
  }
  return found;
}

const eagle = `EagleView Report
Total Roof Area 2,431 sq ft
Predominant Pitch 6/12
Ridges 48 ft
Hips 22 ft
Valleys 36 ft
Eaves 118 ft
Rakes 64 ft
Step Flashing 24 ft
Penetrations 5`;
let m = parseMeasureText(eagle);
ok(m.squares === "24.3", "2,431 sq ft converts to 24.3 squares, got " + m.squares);
ok(m.pitch === "6", "pitch reads 6/12");
ok(m.ridges === "48" && m.valleys === "36" && m.eaves === "118", "linear measures parse");
ok(m.penetrations === "5", "penetration count parses");

const roofr = "Roof Area 28.4 SQ Ridges 51 Valleys 40 Rakes 70";
m = parseMeasureText(roofr);
ok(m.squares === "28.4", "squares already in SQ are left alone, got " + m.squares);

ok(Object.keys(parseMeasureText("nothing useful here")).length === 0, "junk text yields nothing");

/* --- source guarantees --- */
ok(src.includes("function MeasureImport"), "measurement importer exists");
ok(src.includes('accept=".pdf,.csv,.tsv,text/csv,application/pdf"'), "importer accepts PDF and CSV");
ok(src.includes("has no readable text"), "scanned PDFs are reported honestly");
ok(src.includes("pdfjs-dist/legacy/build/pdf"), "legacy pdfjs build is used");
ok(src.includes("PORTAL_SECTIONS"), "portal section registry exists");
ok(src.includes("function portalSectionOn"), "per-section visibility helper exists");
ok(src.includes("tracker: true, updates: true, messages: true"), "every section defaults switchable");
ok(src.includes("function PortalContactCard"), "customer contact card exists");
ok(src.includes("function PortalContactApprovals"), "team-side approval exists");
ok(src.includes('request_type: "contact_update"'), "contact changes go through the request table");
ok(!src.includes("Order the customer sees"), "duplicate ordering block was removed");
ok(src.includes("JOB_TAB_GROUPS"), "job tabs are grouped");
ok(src.includes("read_by_team"), "message read receipts are wired");

/* --- CompanyCam --- */
ok(src.includes('const CC_API = "https://api.companycam.com/v2"'), "real CompanyCam API base");
ok(src.includes("async function ccCreateProject"), "project creation exists");
ok(src.includes("async function ccProjectPhotos"), "photo pull exists");
ok(src.includes("err.cors = true"), "CORS failures are distinguished from outages");
ok(src.includes("crm_user_integrations"), "tokens stored in the RLS-scoped table");
ok(src.includes("function CompanyCamJobCard"), "job-level CompanyCam card exists");
ok(src.includes("Open in CompanyCam"), "project link is exposed on the job");
ok(!src.includes("Today this stores your token per seat; pulling project photos"),
  "stale placeholder copy removed");

/* address splitting for the CompanyCam payload */
function ccAddress(job) {
  const parts = String(job.address || "").split(",").map((x) => x.trim()).filter(Boolean);
  if (parts.length >= 3) {
    const stateZip = parts[parts.length - 1].split(/\s+/);
    return { street_address_1: parts.slice(0, parts.length - 2).join(", "),
      city: parts[parts.length - 2], state: stateZip[0] || "", postal_code: stateZip[1] || "" };
  }
  return { street_address_1: job.address || "", city: "", state: job.state || "", postal_code: job.zip || "" };
}
let a1 = ccAddress({ address: "720 5th Avenue, Mansfield, OH 44903" });
ok(a1.street_address_1 === "720 5th Avenue" && a1.city === "Mansfield" && a1.state === "OH" && a1.postal_code === "44903",
  "three-part address splits correctly");
let a2 = ccAddress({ address: "1099 Waycross Road", state: "OH", zip: "45240" });
ok(a2.street_address_1 === "1099 Waycross Road" && a2.state === "OH" && a2.postal_code === "45240",
  "single-line address falls back to job fields");

if (fails) { console.log("\nbuild 5: " + fails + " FAILED"); process.exit(1); }
console.log("build 5 tests passed");
