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
ok(/function tierCardsHtml\(est, brand\)/.test(src), "the proposal renders tier cards");
ok(/if \(sec === "options"\) \{ out \+= tierCardsHtml\(est, brand\); continue; \}/.test(src),
  "and the options section is wired into the document");
ok(/const hasTiers = \(est\.tiers \|\| \[\]\)\.filter\(\(t\) => \(t\.items \|\| \[\]\)\.length\)\.length >= 2;/.test(src),
  "tiers only render when there are at least two real ones");
/* Cards that all list the same shared scope are worse than no cards — three
   identical lists at three prices makes the dear ones look like a markup on
   nothing. Each card has to lead with what is unique to it. */
ok(/const common = new Set\(\);/.test(src) && /const unique = items\.filter\(\(it\) => !common\.has\(descOf\(it\)\)\);/.test(src),
  "each tier card leads with what differs from the others");
ok(/\$\{inc\.map\(\(it, i\) => `<li\$\{i < unique\.length \? ' class="key"' : ""\}>/.test(src),
  "and marks those differentiating lines so they read first");
ok(/\.tierlist li\.key \{ font-weight: 700/.test(src), "the differentiators are visually weighted");
ok(/const itemOpts = hasTiers \? \{ honorLine: true, hidePrice: true \} : \{ honorLine: true \};/.test(src),
  "with options on the table the itemised sheet is inclusions, not a second price list");
ok(/function upgradesHtml\(est\)/.test(src) && /Optional upgrades/.test(src), "upgrades print with tick boxes");
ok(/const chosen = est\.selectedTier \|\|/.test(src) && /Recommended for your roof/.test(src),
  "one option is recommended rather than leaving the homeowner to guess");

/* ---------- It sells before it prices ---------- */
ok(/const PROPOSAL_DEFAULT_SECTIONS = \["cover", "why", "findings", "options", "items", "warranty", "process", "notes", "terms"\];/.test(src),
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

if (fails) { console.log("\nbuild 50: " + fails + " FAILED"); process.exit(1); }
console.log("build 50 tests passed");
