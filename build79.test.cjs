/* Build 79 — money fields from the site audit.

   1. New Lead sheet's "Deductible ($)" field was a bare <input>, so a
      rep typing "1500" never got the $1,500.00 formatting every other
      dollar field in the app shows.
   2. The Construction Agreement's "OUT OF POCKET" header field was
      plain text on-screen (txt()) and printed via a raw esc() with no
      accounting formatting, unlike its sibling price-box fields
      (Final Contract Price, Deductible, Deposit) which already use
      MoneyInput on-screen and agMoney() on the printed page.
   3. "Balance due on completion" is deliberately NOT a money field — a
      rep may write "See addendum" there, and the print engine already
      formats a purely numeric entry correctly. This must stay
      untouched; a regression guard protects it from a future sweep
      "fixing" it into a MoneyInput by mistake.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/<Field label="Deductible \(\$\)"><MoneyInput style=\{inputStyle\} value=\{f\.deductible\} onChange=\{set\("deductible"\)\} \/><\/Field>/.test(src),
  "New Lead sheet's Deductible ($) field now uses MoneyInput");

ok(/\{ k: "outOfPocket", label: "OUT OF POCKET", t: "money" \}/.test(src),
  "AGREEMENT_HEADER tags outOfPocket as a money field");
ok(/outOfPocket: ins\.deductible \? String\(num\(ins\.deductible\)\) : "",/.test(src),
  "agreementPrefill seeds outOfPocket as a raw numeric string, matching the sibling deductible field");
ok(/const moneyTxt = \(k\) => \(/.test(src), "AgreementForm gained a moneyTxt helper");
/* build 80 added a third (date) branch to both of these lines — assert
   money still routes through moneyTxt/agMoney without pinning the exact
   line text, since a later, legitimate build extends it further. */
ok(/f\.t === "money" \? moneyTxt\(f\.k\)/.test(src),
  "the header field render branches on f.t to use moneyTxt for money fields");
ok(/const val = f\.t === "money" \? agMoney\(a\[f\.k\]\) :/.test(src),
  "agFieldHtml routes money fields through agMoney() on the printed page");

/* Regression guard: Balance due on completion stays free text, not MoneyInput. */
const balField = src.slice(src.indexOf('Field label="Balance due on completion"') - 20, src.indexOf('Field label="Balance due on completion"') + 400);
ok(/<input style=\{inputStyle\} value=\{a\.balance \|\| ""\} disabled=\{locked\} placeholder=\{price \? money\(price - dep\) : ""\}/.test(balField),
  "Balance due on completion stays a plain <input>, not MoneyInput — free text is intentional");
ok(!/MoneyInput/.test(balField), "no MoneyInput reference near the Balance due on completion field");

/* Sanity check on the sibling price-box fields this build's fields now match. */
ok(/AGREEMENT_PRICE_ROWS\.map\(\(r\) => \(\s*<Field key=\{r\.k\} label=\{r\.label\}>\s*<MoneyInput style=\{inputStyle\} value=\{a\[r\.k\] \|\| ""\} disabled=\{locked\}/.test(src),
  "sanity check: the existing price-row fields already use MoneyInput (the pattern this build extends)");

/* ---------- behavioral ---------- */
const scratch = path.join(__dirname, "_b79.jsx");
const bundle = path.join(__dirname, "_b79.cjs");
fs.writeFileSync(scratch, src + "\nexport { agreementPrefill, agFieldHtml, agMoney };\n");
const { execSync } = require("child_process");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b79.cjs");

const job = { name: "Rob Kennard", address: "123 Main St, Vanceburg, KY 41179", insurance: { deductible: "1500" } };
const pre = m.agreementPrefill(job, {});
ok(pre.outOfPocket === "1500", `agreementPrefill seeds outOfPocket as a raw numeric string (got: ${pre.outOfPocket})`);

const moneyHtml = m.agFieldHtml({ k: "outOfPocket", label: "OUT OF POCKET", t: "money" }, { outOfPocket: "1500" });
ok(moneyHtml.includes("$1,500.00"), `a money-tagged field prints accounting-formatted on the agreement (got: ${moneyHtml})`);

const plainHtml = m.agFieldHtml({ k: "customerName", label: "CUSTOMER NAME" }, { customerName: "Rob Kennard" });
ok(plainHtml.includes("Rob Kennard") && !plainHtml.includes("$"), "an untagged field still prints as plain text, unaffected");

const balanceHtml = m.agMoney("See addendum");
ok(balanceHtml === "See addendum", "agMoney still passes non-numeric free text through verbatim (Balance due on completion's contract)");
const balanceNumeric = m.agMoney("2450");
ok(balanceNumeric === "$2,450.00", "agMoney still formats a purely numeric entry (Balance due on completion's other case)");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 79: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 79 tests passed");
