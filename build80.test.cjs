/* Build 80 — real date pickers from the site audit.

   1. Estimate tab's "Date" field was a plain text input a rep typed
      free-form, unlike its neighbor "Valid through" (already a real
      type=date picker via humanToIso/isoToHuman).
   2. The Construction Agreement's "DATE OF LOSS" and "DATE" header
      fields were plain text on-screen, and printed the raw ISO string
      ("2026-08-06") instead of a real date ("August 6, 2026") like
      every other date the print engine renders via longDate().
   3. Payments' edit-sheet Date field was bound directly to a payment
      row's `date`, which is nowStamp() — "Aug 6, 3:00 PM", no year —
      so a native type=date input (which requires ISO) silently
      rendered blank for every payment ever logged. Fixed by adding a
      real `dateIso` field alongside the existing human stamp, plus a
      payDateIso() shim — NOT humanToIso, which V8 mis-parses a
      year-less string like nowStamp()'s into the year 2001.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/<Field label="Date">\s*<input style=\{dateInputStyle\} type="date" disabled=\{locked\}\s*value=\{humanToIso\(est\.date\) \|\| todayIso\(\)\}\s*onChange=\{\(e\) => setEst\(\{ date: isoToHuman\(e\.target\.value\) \}\)\}/.test(src),
  "Estimate tab's Date field is now a real type=date picker via humanToIso/isoToHuman");

ok(/\{ k: "dateOfLoss", label: "DATE OF LOSS", t: "date" \}/.test(src),
  "AGREEMENT_HEADER tags dateOfLoss as a date field");
ok(/\{ k: "agreementDate", label: "DATE", t: "date" \}/.test(src),
  "AGREEMENT_HEADER tags agreementDate as a date field");
ok(/function payDateIso\(p\) \{/.test(src), "payDateIso() shim exists");
ok(/const dateTxt = \(k\) => \(/.test(src), "AgreementForm gained a dateTxt helper");
ok(/\{f\.t === "money" \? moneyTxt\(f\.k\) : f\.t === "date" \? dateTxt\(f\.k\) : txt\(f\.k\)\}/.test(src),
  "the header field render branches on f.t to use dateTxt for date fields");
ok(/const val = f\.t === "money" \? agMoney\(a\[f\.k\]\) : f\.t === "date" \? esc\(longDate\(a\[f\.k\]\)\) : esc\(a\[f\.k\] \|\| ""\);/.test(src),
  "agFieldHtml routes date fields through longDate() on the printed page");

ok(/\{ id: uid\("pay"\), type: form\.type, label: form\.label, amt: num\(form\.amt\), date: nowStamp\(\), dateIso: todayIso\(\) \}/.test(src),
  "logging a payment now stamps a real dateIso alongside the human date");
ok(/<Field label="Date"><input style=\{dateInputStyle\} type="date" value=\{payDateIso\(ef2\)\}/.test(src),
  "the payment edit sheet's Date field uses dateInputStyle and payDateIso, not the raw human stamp");
ok(/onChange=\{\(e\) => setEf2\(\{ \.\.\.ef2, dateIso: e\.target\.value, date: isoToHuman\(e\.target\.value\) \}\)\}/.test(src),
  "editing the date writes both dateIso and a matching human date");

/* Sanity check on the sibling field this build's Estimate Date now matches. */
ok(/<Field label="Valid through">\s*<input style=\{dateInputStyle\} type="date" disabled=\{locked\}\s*value=\{humanToIso\(est\.validThrough\)\}/.test(src),
  "sanity check: Valid through already used this exact pattern");

/* ---------- behavioral ---------- */
const scratch = path.join(__dirname, "_b80.jsx");
const bundle = path.join(__dirname, "_b80.cjs");
fs.writeFileSync(scratch, src + "\nexport { humanToIso, isoToHuman, longDate, payDateIso, agFieldHtml, todayIso };\n");
const { execSync } = require("child_process");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b80.cjs");

/* Estimate Date field's round trip: human -> ISO (for the input) -> human (on save). */
ok(m.humanToIso("Jul 24, 2026") === "2026-07-24", `humanToIso parses an existing human date (got: ${m.humanToIso("Jul 24, 2026")})`);
ok(m.isoToHuman("2026-07-24") === "Jul 24, 2026", `isoToHuman round-trips back (got: ${m.isoToHuman("2026-07-24")})`);

/* Agreement print path: an ISO date field now prints as a real long date, not raw ISO. */
const dateHtml = m.agFieldHtml({ k: "dateOfLoss", label: "DATE OF LOSS", t: "date" }, { dateOfLoss: "2026-03-14" });
ok(dateHtml.includes("March 14, 2026"), `a date-tagged field prints a real long date (got: ${dateHtml})`);
ok(!dateHtml.includes("2026-03-14"), "the raw ISO string is not what prints");
const blankDateHtml = m.agFieldHtml({ k: "dateOfLoss", label: "DATE OF LOSS", t: "date" }, { dateOfLoss: "" });
ok(blankDateHtml.includes('<div class="agfval"></div>'), "a blank date field prints empty, not 'Invalid Date'");

/* payDateIso: the actual bug this build fixes. */
ok(m.payDateIso({ dateIso: "2026-08-06" }) === "2026-08-06", "a payment row with a real dateIso uses it directly");
const legacyRow = { date: "Aug 6, 3:00 PM" }; // pre-build-80 shape, no dateIso
const legacyResult = m.payDateIso(legacyRow);
ok(legacyResult === m.todayIso(), `a legacy row with no dateIso falls back to today rather than a year-2001 misparse (got: ${legacyResult})`);
ok(!legacyResult.startsWith("2001"), "confirms the exact bug this replaces: humanToIso(nowStamp()) would have produced a 2001 date");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 80: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 80 tests passed");
