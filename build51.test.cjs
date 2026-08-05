/* Build 51 — the construction agreement.

   The agreement is a paper form reproduced in HTML: a spec definition
   (AGREEMENT_SPEC / AGREEMENT_HEADER / AGREEMENT_PRICE_ROWS) drives both
   the in-app form and the printed page. The tests below check the three
   things that can silently go wrong:

     1. the two sides drifting apart — a field that exists in the form but
        never prints, or prints but can't be filled in;
     2. the printed page-one growing past one sheet, which is the whole
        point of the document;
     3. the reverse-side legal text being quietly "corrected".
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: the pieces exist and are wired ---------- */
ok(/^const AGREEMENT_SPEC = \[/m.test(src), "AGREEMENT_SPEC is a single data definition");
ok(/^const AGREEMENT_HEADER = \[/m.test(src), "AGREEMENT_HEADER declares the customer/claim boxes");
ok(/^const AGREEMENT_PRICE_ROWS = \[/m.test(src), "AGREEMENT_PRICE_ROWS declares the price box");
ok(/function agreementDocHtml\(job, brand\)/.test(src), "agreementDocHtml renders the printed form");
ok(/function agreementCss\(brand\)/.test(src), "the agreement carries its own print stylesheet");
ok(/function AgreementForm\(\{ job, brand, mut, toast, locked \}\)/.test(src), "AgreementForm is the in-app form");
ok(/\{form === "agreement" && <AgreementForm job=\{job\} brand=\{brand\}/.test(src), "the contract tab renders the form when the agreement is chosen");
ok(/con\.form === "agreement" \? "agreement" : "simple"/.test(src), "the document choice lives on job.contract.form");
ok(/openDoc\(`Construction Agreement — \$\{job\.name\}`, brand, agreementDocHtml\(job, brand\), toast, \{ bare: true \}\)/.test(src),
  "the agreement prints through the bare shell — it carries its own letterhead");
ok(/function AgreementBranding\(/.test(src) && /<AgreementBranding brand=\{brand\} setBrand=\{setBrand\}/.test(src),
  "diagram + terms are editable in Branding");
ok(/const AGREEMENT_DIAGRAM_DEFAULT = "\/reference-diagram\.jpg"/.test(src), "the reference diagram ships as a bundled default");
ok(fs.existsSync(path.join(__dirname, "public", "reference-diagram.jpg")), "the reference diagram asset is in public/");

/* The simple contract must still be reachable — this is an added form, not
   a replacement. */
ok(/\{form === "simple" && \(/.test(src), "the plain service contract is still selectable");
ok(/function contractDocHtml\(job, brand\)/.test(src), "contractDocHtml is untouched");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_agr51.jsx");
const bundle = path.join(__dirname, "_agr51.cjs");
fs.writeFileSync(scratch, src + "\nexport { agreementDocHtml, agreementCss, docShell, agreementFor, agreementPrefill, " +
  "AGREEMENT_SPEC, AGREEMENT_HEADER, AGREEMENT_PRICE_ROWS, AGREEMENT_TERMS, AGREEMENT_TERMS_INTRO, agreementTermsFor, agreementFill };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
const m = require("./_agr51.cjs");
fs.unlinkSync(scratch);

const brand = {
  company: "Supreme Building Group, Inc.", short: "SBG",
  address: "311 Elm Street, Suite 270 • Cincinnati, OH 45202",
  phone: "283.212.3456", email: "info@supremebuildinggroup.com",
  website: "www.supremebuildinggroup.com", primary: "#2B3440", accent: "#0A9E98",
  agreementDiagram: "file://" + path.join(__dirname, "public", "reference-diagram.jpg"),
};
const baseJob = {
  name: "Roger Perry", address: "4821 Blue Rock Road, Cincinnati, OH", zip: "45247", state: "OH",
  phone: "(513) 555-0142", email: "roger.perry@example.com",
  insurance: { carrier: "State Farm", claim: "CLM-448190", deductible: "2500" },
  claim: { dateOfLoss: "2026-04-18" },
  checklist: { layers: "2 Layers" },
  contract: { price: 24850, depositMode: "pct", depositPct: 50 },
};

/* Prefill reads the job file rather than asking the rep to retype it. */
const pre = m.agreementPrefill(baseJob, brand);
ok(pre.customerName === "Roger Perry", "prefill takes the customer name");
ok(pre.propertyAddress === "4821 Blue Rock Road", "prefill splits the street out of the address");
ok(pre.city === "Cincinnati", "prefill splits the city out of the address");
ok(pre.state === "OH" && pre.zip === "45247", "prefill takes state and zip");
ok(pre.carrier === "State Farm" && pre.claimNumber === "CLM-448190", "prefill takes carrier and claim number");
ok(pre.dateOfLoss === "2026-04-18", "prefill takes the date of loss");
ok(pre.tearoffLayers === "2", "prefill reads the layer count off the inspection checklist");
ok(/12,425/.test(pre.deposit), "prefill computes the deposit from the contract's deposit terms");

/* An address that isn't comma-shaped must not lose the street. */
const odd = m.agreementPrefill({ ...baseJob, address: "127 Market Street" }, brand);
ok(odd.propertyAddress === "127 Market Street" && odd.city === "", "an address with no commas still fills the street");

/* Opening a job must not write to it. */
ok(baseJob.agreement === undefined, "agreementPrefill does not mutate the job");

/* The rep's edits win over the prefill. */
const edited = m.agreementFor({ ...baseJob, agreement: { customerName: "R. Perry Jr." } }, brand);
ok(edited.customerName === "R. Perry Jr.", "a saved value overrides the prefill");
ok(edited.carrier === "State Farm", "unsaved fields still fall back to the prefill");

/* ---------- one definition, both sides ---------- */
/* Every key declared in the spec has to reach the printed page and has to
   be reachable from the form. Both are generated from the same arrays, so
   this is really a check that neither generator quietly filters rows. */
const filled = {};
const specKeys = [];
for (const sec of m.AGREEMENT_SPEC) {
  for (const row of sec.rows || []) {
    for (const p of row) {
      if (!p.k) continue;
      specKeys.push(p.k);
      filled[p.k] = p.t === "c" ? true : "VAL-" + p.k;
    }
  }
}
for (const box of m.AGREEMENT_HEADER) for (const row of box.rows) for (const f of row) { specKeys.push(f.k); filled[f.k] = "VAL-" + f.k; }
for (const r of m.AGREEMENT_PRICE_ROWS) { specKeys.push(r.k); filled[r.k] = "VAL-" + r.k; }
ok(specKeys.length === new Set(specKeys).size, "no field key is declared twice");

const doc = m.agreementDocHtml({ ...baseJob, agreement: filled }, brand);
const missing = specKeys.filter((k) => {
  const val = filled[k];
  return val === true ? false : !doc.includes(val);
});
ok(missing.length === 0, "every text field in the spec prints (missing: " + missing.join(", ") + ")");
const checkKeys = [];
for (const sec of m.AGREEMENT_SPEC) for (const row of sec.rows || []) for (const p of row) if (p.t === "c") checkKeys.push(p.k);
ok(checkKeys.length >= 15, "the form carries the checkbox items from the paper original");
ok((doc.match(/class="agck on"/g) || []).length === checkKeys.length,
  "every checked box prints as ticked");
/* And unticked when the job says so. */
const blankDoc = m.agreementDocHtml(baseJob, brand);
ok(!/agck on/.test(blankDoc), "an unfilled agreement prints empty boxes, not ticked ones");
ok(/class="agfval"/.test(blankDoc), "an unfilled agreement still prints its rules so it can be finished by hand");

/* The balance line is arithmetic unless the rep overrode it. */
const auto = m.agreementDocHtml({ ...baseJob, agreement: { finalPrice: "$24,850", deposit: "$12,425" } }, brand);
ok(/BALANCE DUE ON COMPLETION<\/span><span class="agbl"[^>]*>\$12,425</.test(auto), "balance = price less deposit");
const manual = m.agreementDocHtml({ ...baseJob, agreement: { finalPrice: "$24,850", deposit: "$12,425", balance: "See addendum" } }, brand);
ok(/BALANCE DUE ON COMPLETION<\/span><span class="agbl"[^>]*>See addendum</.test(manual), "a written balance overrides the arithmetic");

/* ---------- the reverse side ---------- */
ok(m.AGREEMENT_TERMS.length === 21, "all 21 clauses of the printed agreement are carried");
/* These two are typos in the customer's own printed agreement. They are
   deliberately preserved — silently rewriting the wording of a contract is
   not this app's call. If the customer wants them fixed they can edit the
   text in Branding, which is why the text is editable at all. */
ok(/CHARGES SHALL BE DDED FROM THE DATE/.test(src), "clause 3 keeps the original 'DDED' wording");
ok(/named herein on th reverse side/.test(m.AGREEMENT_TERMS_INTRO), "the intro keeps the original 'th reverse side' wording");
ok(m.agreementFill(m.AGREEMENT_TERMS_INTRO, brand).includes("Supreme Building Group, Inc."),
  "{company} resolves to the tenant's company name");
ok(!m.agreementFill(m.AGREEMENT_TERMS_INTRO, brand).includes("{company}"), "no placeholder leaks onto the page");
ok(m.agreementTermsFor({ agreementTerms: ["Only clause"] }).length === 1, "a tenant's own terms replace the supplied text");
ok(m.agreementTermsFor({}).length === 21, "a tenant with no custom terms gets the supplied text");
for (let i = 1; i <= 21; i++) ok(doc.includes(m.AGREEMENT_TERMS[i - 1].slice(0, 40)), "clause " + i + " prints");

/* ---------- print fit ----------
   Page one has to be one page. Chromium is the only browser available
   here; where it is missing the check is skipped loudly rather than
   silently passing. */
/* A realistically completed agreement — the fit target. The exhaustive
   `filled` object above deliberately uses long placeholder strings to prove
   coverage; it is not what a real sheet looks like and is not the fit case.
   A rep who writes a paragraph into Notes will push the price box onto a
   second sheet, which is why these two blocks are kept whole: */
ok(/\.agbottom \{[^}]*page-break-inside: avoid/.test(src), "the price box never splits across pages");
ok(/\.agsigs \{[^}]*page-break-inside: avoid/.test(src), "the signature block never splits across pages");

const realJob = { ...baseJob, agreement: {
  tearoffLayers: "2", felt30: true, synthetic: "GAF FeltBuster",
  dripColor: "White", apronColor: "White", iwStandard: true, iwNote: "6 ft at eaves",
  valleyIw: true, valleyMetal: true, valleyColor: "Brown",
  starterPremium: true, starterNote: "GAF WeatherBlocker",
  shingleStyle: "Timberline HDZ", shingleColor: "Weathered Wood", shingleBrand: "GAF",
  flashChimney: true, flashStep: true, extraGarage: true,
  pipeBoots: "5", skylights: "2", ridgeStandard: "48 LF", boxVents: "0", powerVent: "1",
  capHigh: "Seal-A-Ridge", warrEnhanced: true,
  notes: "Detach and reset satellite dish. Gutter guards by others.",
  ownerInit1: "RP", hoaNo: true, ownerInit2: "RP",
  startWeeks: "2", endWeeks: "1", deckRate: "78.00", cancelInit: "RP",
} };

/* ---------- render: the form actually opens and fills ---------- */
{
  const { JSDOM } = require("jsdom");
  const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>",
    { url: "https://example.com/", pretendToBeVisual: true });
  global.window = dom.window; global.document = dom.window.document;
  global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
  global.Blob = dom.window.Blob; global.URL = dom.window.URL;
  global.Image = dom.window.Image;
  dom.window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
  global.fetch = () => Promise.reject(new Error("no network in tests"));
  const errs = [];
  const realErr = console.error;
  console.error = (...a) => { errs.push(a.join(" ")); };
  const React = require("react");
  const { act } = require("react");
  const { createRoot } = require("react-dom/client");
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const App = require("./app.test.cjs").default;
  const click = (txt) => {
    const els = [...document.querySelectorAll("button, a, div, span")];
    const el = els.find((e) => e.textContent && e.textContent.trim().startsWith(txt) && (e.tagName === "BUTTON" || e.onclick))
      || els.filter((e) => e.tagName === "BUTTON").find((e) => e.textContent.includes(txt));
    if (!el) return false;
    act(() => { el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
    return true;
  };
  const root = createRoot(document.getElementById("root"));
  act(() => { root.render(React.createElement(App)); });
  click("Sign in"); click("Sign in"); click("Jacob Henderson");
  click("Open board");
  /* An unsigned job — a signed contract is locked and its form picker is
     disabled, which is correct behaviour but nothing to test here. */
  click("Rob Kennard");
  ok(click("Contract"), "the contract section opens");
  ok(/Service contract/.test(document.body.textContent), "the plain contract is the default");
  ok(click("Construction agreement"), "the construction agreement can be chosen");
  const txt = document.body.textContent;
  ok(/ROOF DECK PROTECTION/.test(txt) && /RIDGE CAP \/ HIP CAP/.test(txt),
    "the numbered specification renders in the app form");
  ok(/Roofing specification/.test(txt), "the specification card is present");
  ok(/Agreement price/.test(txt) && /Balance due on completion/.test(txt), "the price block renders");
  ok(/Print the agreement/.test(txt), "the form offers a print button");
  const inputs = [...document.querySelectorAll("input")].length;
  ok(inputs > 30, `the form generates an input per blank (found ${inputs})`);
  console.error = realErr;
  const real = errs.filter((e) => !/not wrapped in act/.test(e));
  if (real.length) { fails++; console.log("FAIL: console errors during render:\n" + real.join("\n")); }
}

let pw = null;
try { pw = require("/opt/node22/lib/node_modules/playwright"); } catch (e) { /* not installed */ }
if (!pw || !fs.existsSync("/opt/pw-browsers/chromium")) {
  console.log("SKIPPED: print-fit check (no Chromium available in this environment)");
} else {
  const html = m.docShell("Construction Agreement — Roger Perry", brand,
    m.agreementDocHtml(realJob, brand), { bare: true });
  const tmp = path.join(__dirname, "_agr51.html");
  fs.writeFileSync(tmp, html);
  const run = (async () => {
    const b = await pw.chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
    const pg = await b.newPage();
    await pg.goto("file://" + tmp);
    await pg.emulateMedia({ media: "print" });
    /* Matches the @page rule the agreement sets: letter, 0.45in sides,
       0.35in top / 0.3in bottom. */
    await pg.setViewportSize({ width: 730, height: 993 });
    await pg.waitForTimeout(400);
    const r = await pg.evaluate(() => {
      const pages = [...document.querySelectorAll(".agpage")];
      const foot = document.querySelector(".agfoot");
      return {
        pageCount: pages.length,
        first: Math.round(pages[0].getBoundingClientRect().height),
        footFixed: foot ? getComputedStyle(foot).position : null,
        footText: foot ? foot.textContent.trim() : "",
      };
    });
    await b.close();
    return r;
  })();
  run.then((r) => {
    /* 993px is the printable height; the running footer reserves 16 of it. */
    ok(r.first <= 977, `page one fits on one sheet (rendered ${r.first}px of 977 usable)`);
    ok(r.pageCount === 2, "the document is the form plus its reverse");
    ok(r.footFixed === "fixed", "the running footer repeats on every page");
    ok(/Supreme Building Group/.test(r.footText) && /Roger Perry/.test(r.footText),
      "the running footer names the company and the customer");
    finish();
  }).catch((e) => { fails++; console.log("FAIL: print-fit check threw — " + e.message); finish(); });
}

function finish() {
  try { fs.unlinkSync(bundle); } catch (e) { /* already gone */ }
  try { fs.unlinkSync(path.join(__dirname, "_agr51.html")); } catch (e) { /* not written */ }
  if (fails) { console.log("\nbuild 51: " + fails + " FAILED"); process.exit(1); }
  console.log("build 51 tests passed");
}
if (!pw || !fs.existsSync("/opt/pw-browsers/chromium")) finish();
