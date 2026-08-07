/* Build 93 — missing aria-labels on Sheet's close button and
   SubHeader's back button (Phase 2 audit finding #8, low).

   Sheet's close button (used in all 45 instantiations) rendered only a
   decorative <X> icon with no aria-label/aria-labelledby/title — other
   icon-only buttons in the file (e.g. EmojiPicker's close button)
   correctly have one, confirming this was an inconsistency, not house
   style. SubHeader's back button (used 33 times as the primary
   back-navigation control) had the same gap. A screen-reader user gets
   no name for either control. Fixed by adding aria-label="Close" and
   aria-label="Back" respectively.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

const sheetStart = src.indexOf("function Sheet({ open, onClose, title, children, footer, wide, tall, center = true }) {");
const sheetEnd = src.indexOf("\nfunction ", sheetStart + 10);
const sheetSrc = src.slice(sheetStart, sheetEnd);
ok(/<button onClick=\{onClose\} aria-label="Close" style=\{\{/.test(sheetSrc),
  "Sheet's close button now has aria-label=\"Close\"");

const subHeaderStart = src.indexOf("function SubHeader({ title, onBack, right }) {");
const subHeaderEnd = src.indexOf("\nfunction ", subHeaderStart + 10);
const subHeaderSrc = src.slice(subHeaderStart, subHeaderEnd);
ok(/<button onClick=\{onBack\} aria-label="Back" style=\{\{/.test(subHeaderSrc),
  "SubHeader's back button now has aria-label=\"Back\"");

if (fails) { console.log("\nbuild 93: " + fails + " FAILED"); process.exit(1); }
console.log("build 93 tests passed");
