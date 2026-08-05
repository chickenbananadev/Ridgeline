/* Build 50 — the proposal rebuild.

   The document the customer judges the company by used to read as an
   invoice: a centred title, straight into a wall of line items with unit
   prices, then a bare total. It gave a homeowner one price to say yes or no
   to and nothing that justified twenty thousand dollars.

   The biggest single defect was functional, not cosmetic: Good/Better/Best
   existed in the builder, in the data model, and in the customer portal —
   and the printed proposal ignored it entirely and printed the flattened
   single price. Options are the whole ballgame in this category.

   Static assertions over the source. The layout itself was verified by
   rendering the real document through the real shell and printing it to PDF. */
const fs = require("fs");
const src = fs.readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- Options reach the page ---------- */
ok(/function tierCardsHtml\(est, brand, doc = \{\}\)/.test(src), "the proposal renders tier cards");
ok(/if \(sec === "options"\) \{ out \+= tierCardsHtml\(est, brand, doc\); continue; \}/.test(src),
  "and the options section is wired into the document");
ok(/const tiers = \(est\.tiers \|\| \[\]\)\.filter\(\(t\) => \(t\.items \|\| \[\]\)\.length\);\s*\n\s*const hasTiers = tiers\.length >= 2;/.test(src),
  "tiers only render when there are at least two real ones");
/* Cards that all list the same shared scope are worse than no cards — three
   identical lists at three prices makes the dear ones look like a markup on
   nothing. Each card has to lead with what is unique to it. */
ok(/const common = new Set\(\);/.test(src) && /const unique = items\.filter\(\(it\) => !common\.has\(descOf\(it\)\)\);/.test(src),
  "each tier card leads with what differs from the others");
ok(/\$\{inc\.map\(\(it, i\) => `<li\$\{i < unique\.length \? ' class="key"' : ""\}>/.test(src),
  "and marks those differentiating lines so they read first");
ok(/\.tierlist li\.key \{ font-weight: 700/.test(src), "the differentiators are visually weighted");
ok(/const itemOpts = showLine \? \{ honorLine: true \} : \{ honorLine: true, hidePrice: true \};/.test(src),
  "the itemised sheet follows the price toggle");
ok(/function upgradesHtml\(est\)/.test(src) && /Optional upgrades/.test(src), "upgrades print with tick boxes");
ok(/const chosen = est\.selectedTier \|\|/.test(src) && /Recommended for your roof/.test(src),
  "one option is recommended rather than leaving the homeowner to guess");

/* ---------- It sells before it prices ---------- */
ok(/const PROPOSAL_DEFAULT_SECTIONS = \["cover", "why", "findings", "options", "items", "concealed", "warranty", "process", "notes", "terms"\];/.test(src),
  "the default order puts who we are and what we found before any number");
ok(/function credentialsHtml\(brand, contact\)/.test(src), "a credentials section exists");
ok(/function findingsHtml\(job\)/.test(src), "a what-we-found section exists");
ok(/\(job\.photos \|\| \[\]\)\.filter\(\(p\) => p\.shared/.test(src),
  "it shows the photos the rep chose to share, not every shot on the job");
ok(/function processHtml\(\)/.test(src) && /const PROPOSAL_STEPS = \[/.test(src),
  "what happens after they sign is spelled out");
ok(/function warrantyHtml\(job, brand\)/.test(src), "warranty section exists");
ok(/const w = job\.warranty \|\| \{\};/.test(src),
  "reading the job's real warranty record, the one the Warranties screen writes");
/* Every one of these renders nothing rather than an empty box when the
   company has not filled the data in. */
ok(/if \(!mfr && !labor\) return "";/.test(src), "no warranty on file means no warranty page");
ok(/if \(!shots\.length && !facts\.length\) return "";/.test(src), "no photos or measurements means no findings page");
ok(/if \(tiers\.length < 2\) return "";/.test(src), "one tier means no options page");

/* ---------- It reads as a document ---------- */
ok(/function proposalCss\(brand\)/.test(src), "the proposal has its own typography");
ok(/section\.page \{ page-break-before: always; \}/.test(src), "sections start on their own page");
ok(/section, \.tier, figure, \.wbox, \.steps li \{ page-break-inside: avoid; \}/.test(src),
  "and nothing splits across a page boundary mid-thought");
ok(/\.cotitle \{ font-size: 40px/.test(src), "the cover has a real title, not a centred heading");
ok(/\.cover \.hero \{ width: 100%; height: 4\.4in/.test(src), "with the house on it");
ok(/const img = doc\.coverImage \|\| \(job\.propertyPhoto && job\.propertyPhoto\.url\) \|\| null;/.test(src),
  "falling back to the property photo so a cover is never blank for nothing");
ok(/const money0 = \(n\) =>/.test(src), "big customer-facing numbers are whole dollars");
ok(/<div class="tierprice">\$\{money0\(totalOf\(t\)\)\}<\/div>/.test(src), "option prices use it");
ok(/class="accept"/.test(src) && /Ready to go ahead\?/.test(src),
  "the document closes with an ask, not a bare signature line");

/* ---------- One renderer ---------- */
/* The builder used to re-create the whole layout in React for its preview.
   Two implementations of the same document guarantee drift, and after this
   rebuild they had drifted completely. */
ok(/<iframe title="Proposal preview" srcDoc=\{html\}/.test(src),
  "the builder previews the real document instead of a second implementation");
ok(/sandbox=""/.test(src), "and does it in a sandboxed frame");
ok(/=> docShell\(doc\.title \|\| "Roofing Proposal", brand, estimateDocHtml\(/.test(src),
  "through the same docShell + estimateDocHtml the PDF uses");
ok(!/function ProposalPreview\(\{ job, brand, est, doc, total \}\) \{\s*\n\s*const blocks/.test(src),
  "the old React re-implementation is gone");
ok(/function estimateDocHtml\(job, brand, users = \[\]\)/.test(src),
  "the document resolves the rep contact the same way every other surface does");
ok(/const contact = repContactFor\(users, job\);/.test(src), "using the shared resolver");

/* ---------- Authorable ---------- */
ok(/const PROPOSAL_SECTION_LABELS = \{/.test(src), "the new sections are named for the builder");
ok(/Object\.keys\(PROPOSAL_SECTION_LABELS\)\.filter\(\(k\) => !has\(k\)\)\.map/.test(src),
  "and every one of them can be added back from the Add-section menu");
ok(/const BUILTIN = Object\.fromEntries\(Object\.entries\(PROPOSAL_SECTION_LABELS\)/.test(src),
  "the builder's labels come from the same registry, so they can't fall out of step");

/* The old shell rules for the cover are gone — two rulesets that disagreed
   about the hero height is how the last layout bug started. */
ok(!/\.cover img\.hero \{ width: 100%; height: 4\.8in/.test(src),
  "the shell no longer carries a competing cover rule");

/* ================================================================
   Round two — the four defects the owner called out, plus options
   the proposal could compare and a price toggle the rep controls.
   ================================================================ */

/* ---------- Page one is a cover, not a letterhead ---------- */
ok(/function docShell\(title, brand, bodyHtml, opts = \{\}\)/.test(src), "docShell takes options");
ok(/\$\{opts\.bare \? "" : `<div class="head">/.test(src), "opts.bare drops the letterhead");
ok(/\$\{opts\.bare \? "" : `<div class="foot">/.test(src), "and the closing footer");
ok(/function openDoc\(title, brand, bodyHtml, toast, opts = \{\}\)/.test(src), "openDoc passes them through");
ok((src.match(/estimateDocHtml\(job, brand, users\), toast, \{ bare: true \}\)/g) || []).length === 2,
  "both proposal PDF buttons render bare");
ok(/estimateDocHtml\(\{ \.\.\.job, estimate: \{ \.\.\.est, doc \} \}, brand, users\), \{ bare: true \}\)/.test(src),
  "and so does the builder preview, so the two still match");
ok(/const mark = brand\.logo/.test(src) && /class="colgo"/.test(src),
  "the cover carries the logo itself");
ok(/\.colead \{ display: flex/.test(src), "with its own letterhead row");

/* ---------- Every page says who it belongs to ---------- */
ok(/class="runfoot"/.test(src), "a running footer exists");
ok(/\.runfoot \{ position: fixed; bottom: 0;/.test(src),
  "fixed, which is what makes it repeat on every printed page");
ok(/@media print \{ body \{ padding-bottom: 24px; \} \}/.test(src),
  "and the flow stops short of it, or it prints through the signature lines");
ok(/Chrome does not implement\s*\n\s*CSS Paged Media margin boxes/.test(src),
  "the missing page number is explained rather than silently absent");

/* ---------- Accept online ---------- */
ok(/function qrMatrix\(text\)/.test(src) && /function qrSvg\(text, px = 120\)/.test(src),
  "QR codes are generated in-app");
ok(!/api\.qrserver|chart\.googleapis|quickchart/.test(src),
  "and never by handing the portal token to a third-party image service");
ok(/const portalUrl = job\.portalToken && typeof window !== "undefined"/.test(src),
  "the accept block links to the customer portal");
ok(/const qr = portalUrl \? qrSvg\(portalUrl, 116\) : "";/.test(src), "with a scannable code");
ok(/no login or account needed/.test(src), "and says what the link does");
ok(/const fbit = \(i\) => \(fmt >> \(14 - i\)\) & 1;/.test(src),
  "format bits go down most-significant first — reversed, no reader decodes it");
ok(/function nameInText\(name, text\)/.test(src), "whole-name matching helper exists");

/* ---------- Payment schedule ---------- */
ok(/function paymentScheduleHtml\(job, amount\)/.test(src), "the payment schedule exists");
ok(/const mode = con\.depositMode \|\| "pct";/.test(src), "reading the deposit terms already on the contract");
ok(/if \(!deposit\) return "";/.test(src), "and printing nothing when none are set");
ok(/const dueTotal = chosenTier/.test(src),
  "written against the recommended option, not the flattened estimate");

/* ---------- Comparison table ---------- */
ok(/function tierSpecFor\(tier, override\)/.test(src), "tier specs resolve");
ok(/function tierCompareHtml\(est, doc\)/.test(src), "and render as a matrix");
ok(/const TIER_COMPARE_ROWS = \[/.test(src), "with a named row set");
ok(/return vals\.some\(Boolean\) && new Set\(vals\)\.size > 1;/.test(src),
  "rows that read the same on every option are dropped — they argue against the upgrade");
ok(/specs\.forEach\(\(m\) => String\(m\.class4 \|\| ""\)\.split/.test(src),
  "impact-rated product names count as candidates, since several aren't in the shingle catalogue");
ok(/const mfr = hit \? hit\.mfr : \(specs\.find\(\(m\) => nameInText\(m\.mfr, text\)\) \|\| \{\}\)\.mfr;/.test(src),
  "an unrecognised product still resolves its manufacturer's published specs");
ok(/const system = \(typeof MFR_WARRANTIES !== "undefined" \? MFR_WARRANTIES : \[\]\)/.test(src),
  "an enhanced system warranty named in the items beats the generic shingle warranty");
ok(/\(doc\.compare \|\| \{\}\)\[t\.id\]/.test(src), "with a per-tier manual override");

/* ---------- Price detail is the rep's call ---------- */
ok(/const showLine = doc\.showLinePrices === undefined \? !hasTiers : !!doc\.showLinePrices;/.test(src),
  "line prices default to today's behaviour and are overridable");
ok(/showLinePrices: d\.showLinePrices,/.test(src),
  "left undefined when unset, so old estimates keep their current behaviour");
ok(/Show unit and line prices on the itemised list/.test(src), "the builder exposes the toggle");
ok(/the carrier's scope is itemised/.test(src),
  "and explains the retail-versus-insurance difference, which is the whole reason it's a choice");

/* ---------- Concealed conditions and terms ---------- */
ok(/if \(sec === "concealed"\) \{ out \+= concealedTableHtml\(est\); continue; \}/.test(src),
  "concealed conditions is a reorderable section");
ok(/if \(!secs\.includes\("concealed"\)\) out \+= concealedTableHtml\(est\);/.test(src),
  "and estimates saved before it was one still get it, exactly once");
ok(/function termsHtml\(text\)/.test(src), "terms render through a helper");
ok(/if \(parts\.length < 2\) return `<div class="body small">/.test(src),
  "single-block terms stay prose rather than being chopped up on a guess");
ok(/<ol class="clauses">/.test(src), "multi-paragraph terms become numbered clauses");

/* ---------- QR round-trip, against a real decoder ---------- */
/* Structural checks pass on a symbol no reader can read — this one caught a
   reversed format word that left finders, timing and the dark module correct. */
(() => {
  let jsQR;
  try { jsQR = require("jsqr"); } catch (e) {
    console.log("SKIP: jsqr not installed — QR round-trip not verified in this run");
    return;
  }
  const { execSync } = require("child_process");
  const path = require("path");
  execSync(`npx esbuild ${JSON.stringify(path.join(__dirname, "ridgeline.jsx"))} --loader:.jsx=jsx --jsx=automatic --bundle`
    + " --external:react --external:react-dom --external:lucide-react --external:pdfjs-dist/* --external:pdf-lib"
    + " --format=cjs --outfile=./_qr_check.cjs --footer:js=module.exports.qrMatrix=qrMatrix;", { stdio: "pipe" });
  const { qrMatrix } = require("./_qr_check.cjs");
  for (const text of ["https://roofstride.com/?portal=p8x2k9qmz4hd7b3n", "Roger Perry roof proposal"]) {
    const m = qrMatrix(text);
    const scale = 6, quiet = 4, n = m.length, total = (n + quiet * 2) * scale;
    const px = new Uint8ClampedArray(total * total * 4).fill(255);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (!m[r][c]) continue;
      for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
        const i = (((r + quiet) * scale + dy) * total + (c + quiet) * scale + dx) * 4;
        px[i] = px[i + 1] = px[i + 2] = 0;
      }
    }
    const got = jsQR(px, total, total);
    ok(got && got.data === text, `a real QR reader decodes "${text.slice(0, 28)}…"`);
  }
  try { require("fs").unlinkSync("./_qr_check.cjs"); } catch (e) { /* ignore */ }
})();


if (fails) { console.log("\nbuild 50: " + fails + " FAILED"); process.exit(1); }
console.log("build 50 tests passed");
