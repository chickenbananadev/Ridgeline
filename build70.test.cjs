/* Build 70 — a batch of concrete bugs/gaps reported directly against
   the live Estimate and Contract screens: no date picker on "Valid
   through", a missing checkbox on the roof-deck-protection line, a
   money field that wasn't one, Sheet with no Escape key, a punch-list
   deep link that lands on the wrong scroll position, and a property
   photo picker that could only open the camera. */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- Fix 1: Valid through date picker ---------- */
ok(/function humanToIso\(s\) \{/.test(src) && /function isoToHuman\(iso\) \{/.test(src),
  "the human-string <-> ISO shim exists as standalone, testable functions");
ok(/value=\{humanToIso\(est\.validThrough\)\}/.test(src) && /onChange=\{\(e\) => setEst\(\{ validThrough: isoToHuman\(e\.target\.value\) \}\)\}/.test(src),
  "the picker converts only at the edges — the stored value stays a human string like every other date field");
ok(/type="date"/.test(src.slice(src.indexOf('label="Valid through"'), src.indexOf('label="Valid through"') + 300)),
  "Valid through is an actual native date input now, not free text");

/* ---------- Fix 2: Roof deck protection checkbox ---------- */
ok(/\{ t: "t", v: "C\. Synthetic" \}, \{ t: "c", k: "syntheticOn" \}, \{ t: "b", k: "synthetic", w: 175 \}/.test(src),
  "Synthetic gets a real checkbox alongside its existing write-in blank, matching its 15lb/30lb siblings");

/* ---------- Fix 3: Defective decking rate is a money field ---------- */
ok(/<MoneyInput style=\{inputStyle\} value=\{a\.deckRate \|\| ""\} disabled=\{locked\} onChange=\{\(v\) => set\("deckRate", v\)\} \/>/.test(src),
  "deckRate uses MoneyInput now, the same component its sibling price fields already use");
ok(!/\{txt\("deckRate"\)\}/.test(src), "the old plain-text render of deckRate is gone, not just supplemented");

/* ---------- Fix 4: Escape closes a Sheet ---------- */
ok(/const onKey = \(e\) => \{ if \(e\.key === "Escape"\) onClose\(\); \};/.test(src),
  "Sheet listens for Escape");
ok(/document\.addEventListener\("keydown", onKey\);/.test(src) && /document\.removeEventListener\("keydown", onKey\);/.test(src),
  "the listener is added AND cleaned up — a leaked listener would fire onClose for every Sheet ever opened after the first");

/* ---------- Fix 6: punch-list deep link scrolls to the section ---------- */
ok((() => {
  const idx = src.indexOf("if (!openTab) return;");
  if (idx < 0) return false;
  const nearby = src.slice(idx, idx + 800);
  return /setTab\(openTab\);/.test(nearby) && /setOpen\(\(o\) => \(\{ \.\.\.o, \[openTab\]: true \}\)\);/.test(nearby)
    && /document\.getElementById\(`jobsec-\$\{openTab\}`\)/.test(nearby)
    && /scrollIntoView\(\{ behavior: "smooth", block: "start" \}\);/.test(nearby);
})(), "opening a job via a deep link (not just Quick Actions) now scrolls to the target section, the same way jumpToSection already did");

/* ---------- Fix 11: property photo allows the camera roll ---------- */
const propertyPhotoIdx = src.indexOf("function PropertyPhoto(");
const propertyPhotoInput = src.slice(propertyPhotoIdx, propertyPhotoIdx + 2000);
ok(/<input ref=\{fileRef\} type="file" accept="image\/\*" onChange=\{onFile\}/.test(propertyPhotoInput),
  "the property-photo file input no longer forces capture=environment");
ok(!/capture="environment"/.test(propertyPhotoInput),
  "no capture attribute anywhere in PropertyPhoto specifically — the OS picker (camera or library) is offered");
/* The on-site captures are a deliberately different case and must be
   unaffected — this proves the fix wasn't a blanket find-and-replace. */
const punchListIdx = src.indexOf("function TabPunchList(");
ok(/capture="environment"/.test(src.slice(punchListIdx, punchListIdx + 2500)),
  "the punch-list photo capture still forces the live camera — that GPS/timestamp-verifiable-evidence behavior is intentional and untouched");

/* ---------- behavioural: the date shim ---------- */
const scratch = path.join(__dirname, "_b70.jsx");
const bundle = path.join(__dirname, "_b70.cjs");
fs.writeFileSync(scratch, src + "\nexport { humanToIso, isoToHuman };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b70.cjs");

ok(m.humanToIso("") === "", "an empty string round-trips to empty, not a garbage date");
ok(m.humanToIso("not a date") === "", "unparseable text never produces a fake ISO date");
ok(m.humanToIso("Jul 24, 2026") === "2026-07-24",
  "a real seed-data-shaped date ('Jul 24, 2026') converts to the exact ISO date a native picker needs");
ok(m.isoToHuman("") === "", "no ISO value round-trips to empty, not 'Invalid Date'");
ok(m.isoToHuman("2026-07-24") === "Jul 24, 2026",
  "picking a date and converting back produces the exact same human string the rest of the app already stores");
/* The whole reason for building from y/m/d parts instead of parsing the
   ISO string as an instant: prove it doesn't roll the date back a day. */
const roundTrip = m.isoToHuman(m.humanToIso("Dec 31, 2026"));
ok(roundTrip === "Dec 31, 2026", "round-tripping a year-end date doesn't drift a day in either direction");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 70: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 70 tests passed");
