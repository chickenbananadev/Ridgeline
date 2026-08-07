/* Build 89 — checklist Layers multi-select corruption + Report
   concatenation (Phase 2 audit finding #4, medium).

   (a) The "Layers" checklist field used `<PillGroup multi ...>` for
   what should be a single fact — 1 layer, 2 layers, or 3+. `multi` let
   contradictory values ("1 Layer" AND "2 Layers") both be selected,
   which flowed unmodified into the estimate's auto-generated tear-off
   line item, producing a real customer-facing line reading "Tear-off &
   disposal — 1 Layer,2 Layers". Fixed by removing `multi`, matching
   sibling single-fact fields (Structure type, Decking condition).

   (b) The Report tab's "Overview & property facts" and "Decking &
   structure" sections passed raw arrays straight into <KV v={...}/>,
   which JSX renders back-to-back with zero separator ("Asphalt
   shingleMetal", "1 Layer2 Layers") — this happens even for a
   legitimate multi-select (shingle main roof + metal porch section),
   not just the contradictory Layers case. The adjacent "Systems
   present" KV already correctly used .join(", "). Fixed by adding a
   listVal() helper and routing every multi-select-backed KV through it.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/<Field label="Layers"><PillGroup options=\{\["1 Layer", "2 Layers", "3\+ Layers"\]\} value=\{c\.layers\} onPick=\{set\("layers"\)\} \/><\/Field>/.test(src),
  "the Layers checklist field no longer has the multi flag");
ok(!/<Field label="Layers"><PillGroup multi/.test(src), "no code still renders Layers as a multi-select");

ok(/const listVal = \(v\) => \(Array\.isArray\(v\) \? v\.join\(", "\) : v\);/.test(src),
  "a listVal() helper exists to join array-backed checklist values for display");
ok(/<KV k="Roof covering" v=\{listVal\(c\.roofType\)\} \/>/.test(src), "Report's Roof covering KV routes through listVal");
ok(/<KV k="Layers" v=\{listVal\(c\.layers\)\} \/>/.test(src), "Report's Layers KV routes through listVal");
ok(/<KV k="Method" v=\{listVal\(c\.method\) \|\| "Visual, non-invasive"\} \/>/.test(src), "Report's Method KV routes through listVal");
ok(/<KV k="Decking type" v=\{listVal\(c\.deckingType\) \|\| "—"\} \/>/.test(src), "Report's Decking type KV routes through listVal");
ok(/<KV k="Condition \(attic view\)" v=\{listVal\(c\.atticDecking\) \|\| "—"\} \/>/.test(src), "Report's attic decking condition KV routes through listVal");

/* ---------- behavioral ---------- */
const listVal = (v) => (Array.isArray(v) ? v.join(", ") : v);
ok(listVal(["Asphalt shingle", "Metal"]) === "Asphalt shingle, Metal",
  "a legitimate two-value multi-select now renders with a real separator, not concatenated");
ok(listVal(["1 Layer", "2 Layers"]) === "1 Layer, 2 Layers",
  "even a stale contradictory value (from data saved before this fix) now displays readably instead of garbled");
ok(listVal("1 Layer") === "1 Layer", "a plain string (the normal case going forward) passes through unchanged");
ok(listVal("") === "", "an empty string passes through so the existing '|| \"—\"' fallback still applies");
ok(listVal(undefined) === undefined, "undefined passes through so the existing fallback still applies");

/* PillGroup's own non-multi click handler, mirrored exactly — confirms a
   single tap now produces a plain string, not an array, going forward. */
const nonMultiPick = (value, o) => (value === o ? "" : o);
ok(nonMultiPick("", "1 Layer") === "1 Layer", "selecting a layers option now stores a plain string");
ok(nonMultiPick("1 Layer", "2 Layers") === "2 Layers", "selecting a different option replaces the single value rather than adding to an array");
ok(nonMultiPick("1 Layer", "1 Layer") === "", "tapping the already-selected option clears it, same as every other single-fact field");

if (fails) { console.log("\nbuild 89: " + fails + " FAILED"); process.exit(1); }
console.log("build 89 tests passed");
