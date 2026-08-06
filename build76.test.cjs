/* Build 76 — read a subcontractor's rate sheet out of a PDF, not just a CSV.

   A sub's pricing is usually an exhibit buried inside their signed
   agreement (verified against a real one, Hillwood Contractors' 15-page
   agreement), and pdf.js's own text extraction order pulls a table apart
   into column blocks — every item label, then every unit, then every
   price — rather than reading order, because that's drawing order on the
   page, not visual layout. pdfRowsFromItems rebuilds rows from each text
   run's actual x/y position instead of trusting extraction order, which
   is what makes it work across differently laid-out PDFs, not just one
   that happened to already read top-to-bottom. parseSubSheetPdfRows then
   turns each reconstructed row into a candidate {label, unit, price} —
   never straight into a crew's real rate card, always into a review
   sheet first, since a wrong number here changes what a sub gets paid.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/function pdfRowsFromItems\(/.test(src), "pdfRowsFromItems (position-based row reconstruction) exists");
ok(/async function extractSubSheetRowsFromPdf\(file\)/.test(src), "extractSubSheetRowsFromPdf exists");
ok(/function parseSubSheetPdfRows\(rows\)/.test(src), "parseSubSheetPdfRows exists");
ok(/accept=".csv,text\/csv,.pdf,application\/pdf"/.test(src), "the pricing-sheet file input now accepts PDF too");
ok(/file\.type === "application\/pdf" \|\| \/\\\.pdf\$\/i\.test\(file\.name\)/.test(src), "onPriceFile branches PDFs to the new path");
ok(/title="Review price sheet from PDF"/.test(src), "a dedicated review sheet exists for PDF-parsed rows");
ok(/No readable text found/.test(src), "a scanned\/image-only PDF gets an explicit, honest message instead of a silent empty import");
/* The safety property that matters most: a PDF never writes straight to
   rateCard the way a CSV does — it always lands in pdfImport first. */
ok(/setPdfImport\(\{ fileName, mode: "replace", \.\.\.patch \}\)/.test(src) || /onPdfImportDone = \(fileName, patch\) => setPdfImport/.test(src),
  "parsed PDF rows are staged for review, not written directly");
ok(!/rateCard: parseSubSheetPdfRows/.test(src), "no code path writes PDF-parsed rows straight into rateCard, bypassing review");

/* ---------- behavioral ---------- */
const scratch = path.join(__dirname, "_b76.jsx");
const bundle = path.join(__dirname, "_b76.cjs");
fs.writeFileSync(scratch, src + "\nexport { pdfRowsFromItems, parseSubSheetPdfRows, subCodeFor };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b76.cjs");

/* A synthetic 3-row, 3-column table fed in COLUMN-BLOCK order — every
   label first, then every unit, then every price — exactly the shape a
   real multi-column PDF table extracts as, and exactly what broke a
   naive "read the text in order" approach. transform[4]/[5] are pdf.js's
   real x/y fields. */
const pt = (str, x, y) => ({ str, transform: [1, 0, 0, 1, x, y] });
const items = [
  pt("Tear Off and Install", 50, 700), pt("Install Only", 50, 680), pt("Steep 9/12", 50, 660),
  pt("SQ", 250, 700), pt("SQ", 250, 680), pt("SQ", 250, 660),
  pt("$100.00", 300, 700), pt("$40.00", 300, 680), pt("$10.00", 300, 660),
];
const rows = m.pdfRowsFromItems(items);
ok(JSON.stringify(rows) === JSON.stringify([
  "Tear Off and Install SQ $100.00", "Install Only SQ $40.00", "Steep 9/12 SQ $10.00",
]), `column-block extraction order gets reassembled into real rows top-to-bottom (got: ${JSON.stringify(rows)})`);

/* Shuffling the same items must not change the result — position, not
   array order, is what determines the row. */
const shuffled = [...items].reverse();
const rows2 = m.pdfRowsFromItems(shuffled);
ok(JSON.stringify(rows2) === JSON.stringify(rows), "row reconstruction depends on position, not input array order");

const candidates = m.parseSubSheetPdfRows(rows);
ok(candidates.length === 3, `all three real rows became candidates (got ${candidates.length})`);
ok(candidates[0].label === "Tear Off and Install" && candidates[0].unit === "SQ" && candidates[0].price === 100,
  `first row parsed correctly (got ${JSON.stringify(candidates[0])})`);
ok(candidates[0].code === "tearoff_per_square", "the parsed label still resolves to a real pay code via subCodeFor, same as the CSV path");
ok(candidates[2].label === "Steep 9/12" && candidates[2].price === 10, `third row parsed correctly (got ${JSON.stringify(candidates[2])})`);

/* False-positive guards, using text pulled from the real Hillwood PDF. */
const noise = m.parseSubSheetPdfRows([
  "Labor Item / Description Unit Pay Rate",              // table header, no trailing number
  "Dump Fee Per Receipt",                                  // real row, but no numeric price to guess at
  "Commercial General Liability Insurance with limits",    // legal prose, no trailing number
  "governed by the laws of the State of Ohio 11",           // legal prose that DOES end in digits — stopword guard
  "",
]);
ok(noise.length === 0, `legal boilerplate and non-numeric rows are rejected rather than guessed at (got ${JSON.stringify(noise)})`);

/* Real false positives this exact PDF produced on the first pass — the
   letterhead's address block and the exhibit sub-headers sit at their
   own row positions same as any table row, and a zip code or a policy
   number ends in digits exactly like a price does. */
const letterhead = m.parseSubSheetPdfRows([
  ": Crystal Lake, IL 60014 : Englewood, OH 45322",
  "Also Operating At: 311 Elm St, STE 270 Effective Date: April 15, 2026",
  ": Cincinnati, OH 45202",
  "Hillwood Contractors, LLC | Effective: April 15, 2026",
  "Hillwood Contractors, LLC | Policy: NXTTDQJC9W-00-GL | Exp: 09/11/2026",
]);
ok(letterhead.length === 0, `letterhead/exhibit-header noise is filtered out, not imported as fake price rows (got ${JSON.stringify(letterhead)})`);

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 76: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 76 tests passed");
