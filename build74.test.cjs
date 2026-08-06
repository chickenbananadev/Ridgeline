/* Build 74 — two live-reported calendar bugs.

   1. "Add appointment" Type list was missing Punch list and Material
      selection — the two owner-reported gaps. "Custom (write-in)" already
      existed (the "Add a custom type…" field right below the dropdown,
      wired to setApptTypes so a typed-in type sticks around for reuse);
      nothing needed to change there.
   2. "The page won't scroll to click Add to calendar" — the shared Sheet
      modal sized its max height in `vh`, which on iOS Safari is the
      layout viewport (can be taller than what's actually on screen while
      the address bar is showing), pushing the footer — where every
      Sheet's primary submit button lives — below the real visible area
      with no way to reach it, since the overlay itself doesn't scroll.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- appointment types ---------- */
const apptTypesMatch = src.match(/const \[apptTypes, setApptTypes\] = useState\(\[([\s\S]*?)\]\);/);
ok(!!apptTypesMatch, "the default appointment-types seed list is still found");
const apptTypesSrc = apptTypesMatch ? apptTypesMatch[1] : "";
ok(/["']Punch list["']/i.test(apptTypesSrc), "Punch list is now a default appointment type");
ok(/["']Material selection["']/i.test(apptTypesSrc), "Material selection is now a default appointment type");
ok(/Inspection/.test(apptTypesSrc) && /Final walkthrough/.test(apptTypesSrc),
  "the pre-existing default types are still present — nothing was replaced");
ok(/Add a custom type/.test(src), "the write-in custom-type field is untouched — it already covers 'Custom'");
ok(/const addType = /.test(src) || /setApptTypes\(\[\.\.\.apptTypes, v\]\)/.test(src),
  "a typed-in custom type is still persisted for reuse, not just used once");

/* ---------- Sheet viewport / scroll fix ---------- */
ok(!/maxHeight: center \? "82vh" : "90vh"/.test(src), "the old vh-based Sheet height is gone");
ok(/maxHeight: center \? "82dvh" : "90dvh"/.test(src),
  "Sheet now sizes against the dynamic (actually visible) viewport, not the layout viewport");
ok(/minHeight: tall \? "55dvh" : undefined/.test(src), "the tall-sheet minHeight also moved to dvh");
const sheetFn = src.slice(src.indexOf("function Sheet("), src.indexOf("function Sheet(") + 3200);
ok(/WebkitOverflowScrolling: "touch"/.test(sheetFn), "Sheet's scrollable body gets native iOS momentum scrolling");
ok(/overscrollBehavior: "contain"/.test(sheetFn), "scrolling the sheet body doesn't chain into the backdrop");
/* The footer (every Sheet's primary action button) must stay OUTSIDE the
   scrollable div — that's what guarantees it's always reachable without
   scrolling once the sheet itself fits the real viewport. */
ok(/overflowY: "auto"[\s\S]{0,300}\}\}>\{children\}<\/div>\s*\{footer && /.test(sheetFn),
  "footer renders as a sibling after the scrollable children, not inside the scroll area");

if (fails) { console.log("\nbuild 74: " + fails + " FAILED"); process.exit(1); }
console.log("build 74 tests passed");
