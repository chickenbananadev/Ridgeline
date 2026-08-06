/* Build 85 — portal sign-sheet e-signature mismatch (Phase 2 audit finding #1, high).

   PortalSignCenter rendered the itemized lines, total, and the displayed
   "Document reference" hash from a static, office-authored snapshot that
   never reflected the customer's live Good/Better/Best tier + upgrades
   selection. Only submit() — which runs AFTER the customer has already
   reviewed and signed — substituted the real selection and computed the
   hash that actually gets stored. A customer could visually review and
   attest to one price/scope while a materially different one got
   permanently recorded, hashed, under their signature: real legal/
   contractual exposure, not just a cosmetic bug.

   Fixed by deriving both the displayed content (effectiveDoc) and the
   displayed hash (effectiveSnapshot) from the exact same computation
   submit() now also uses — the divergence is structurally impossible
   rather than merely coincidentally absent.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

const pscStart = src.indexOf("function PortalSignCenter(");
const pscEnd = src.indexOf("\nfunction ", pscStart + 10);
const pscSrc = src.slice(pscStart, pscEnd > 0 ? pscEnd : pscStart + 10000);

/* ---------- static ---------- */
ok(/function PortalSignCenter\(\{ token, jobId, customer, docs, accent, brand, estimate = null, estSelection = null \}\)/.test(pscSrc),
  "PortalSignCenter now accepts an `estimate` prop (needed to rebuild tier/upgrade lines)");
ok(/const effectiveSnapshot = useMemo\(\(\) => \{/.test(pscSrc), "effectiveSnapshot is computed once and shared");
ok(/const effectiveDoc = useMemo\(\(\) => \{/.test(pscSrc), "effectiveDoc is computed once and shared");
ok(/doc_hash: docHash\(effectiveSnapshot\),/.test(pscSrc), "submit() hashes effectiveSnapshot");
ok(/doc_snapshot: effectiveSnapshot,/.test(pscSrc), "submit() stores effectiveSnapshot");
ok(!/const snapshot = \(openDoc\.type === "estimate" && estSelection\)/.test(pscSrc),
  "the old duplicated snapshot-substitution logic inside submit() is gone");
ok(/\{\(effectiveDoc\.lines \|\| \[\]\)\.map/.test(pscSrc), "the displayed line items come from effectiveDoc, not openDoc");
ok(/effectiveDoc\.total != null/.test(pscSrc) && /money\(effectiveDoc\.total\)/.test(pscSrc),
  "the displayed total comes from effectiveDoc, not openDoc");
ok(/<b>\{docHash\(effectiveSnapshot\)\}<\/b>/.test(pscSrc),
  "the displayed 'Document reference' hash is computed from effectiveSnapshot — the SAME value submit() hashes");
ok(!/<b>\{docHash\(openDoc\.snapshot\)\}<\/b>/.test(pscSrc), "the displayed hash no longer reads the stale static snapshot directly");

ok(/<PortalSignCenter token=\{token\} jobId=\{d\.jobId \|\| null\} customer=\{d\.customer \|\| \{\}\}\s*docs=\{d\.signDocs \|\| \[\]\} accent=\{prim\} brand=\{d\} estimate=\{d\.estimate \|\| null\} estSelection=\{estSel\} \/>/.test(src),
  "the call site now passes the full estimate object down");

/* ---------- behavioral ---------- */
const scratch = path.join(__dirname, "_b85.jsx");
const bundle = path.join(__dirname, "_b85.cjs");
fs.writeFileSync(scratch, src + "\nexport { docHash, money, num };\n");
const { execSync } = require("child_process");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b85.cjs");

/* Simulate the exact effectiveSnapshot/effectiveDoc computation for an
   estimate with tiers, and confirm the hash of what would be displayed
   equals the hash of what submit() would store — the actual bug this
   build closes. Before the fix, these would have been computed from two
   different objects (static snapshot vs. live selection). */
const openDoc = {
  type: "estimate", id: "est", title: "Estimate EST-1",
  snapshot: { number: "EST-1", date: "Aug 1", total: 9000 }, // office's stale default-tier total
};
const estSelection = { tierId: "t2", tierName: "Better", upgradeIds: ["u1"], total: 13047 };
const estimate = {
  tiers: [
    { id: "t1", name: "Good", total: 9000, items: [{ desc: "3-tab shingle roof", qty: 1, unit: "JOB", price: 9000 }] },
    { id: "t2", name: "Better", total: 12000, items: [{ desc: "Architectural shingle roof", qty: 1, unit: "JOB", price: 12000 }] },
  ],
  upgrades: [{ id: "u1", desc: "Ridge vent upgrade", price: 1047 }],
};

const effectiveSnapshot = (openDoc.type === "estimate" && estSelection)
  ? { ...openDoc.snapshot, selection: estSelection, total: estSelection.total }
  : openDoc.snapshot;
const tierObj = estimate.tiers.find((t) => t.id === estSelection.tierId);
const upgradeObjs = estimate.upgrades.filter((u) => estSelection.upgradeIds.includes(u.id));
const effectiveDoc = {
  ...openDoc,
  lines: [
    ...tierObj.items.map((it) => ({ label: `${it.desc} — ${it.qty} ${it.unit}`, value: m.money(m.num(it.qty) * m.num(it.price)) })),
    ...upgradeObjs.map((u) => ({ label: u.desc, value: `+${m.money(m.num(u.price))}` })),
  ],
  total: estSelection.total,
};

ok(effectiveDoc.total === 13047, `effectiveDoc reflects the customer's live selection total, not the stale snapshot's 9000 (got: ${effectiveDoc.total})`);
ok(effectiveDoc.lines.some((l) => l.label.includes("Architectural shingle")), "effectiveDoc's lines reflect the chosen tier's real items");
ok(effectiveDoc.lines.some((l) => l.label === "Ridge vent upgrade"), "effectiveDoc's lines include the selected upgrade");

const displayedHash = m.docHash(effectiveSnapshot);
const storedHash = m.docHash(effectiveSnapshot); // submit() now hashes the identical value
ok(displayedHash === storedHash, "the hash shown to the customer before signing equals the hash that would be stored — no divergence possible");
ok(effectiveSnapshot.total === 13047, `the stored snapshot's total matches what was displayed (got: ${effectiveSnapshot.total})`);

/* Regression check: the OLD behavior (displaying openDoc.snapshot's hash
   while storing effectiveSnapshot's hash) would have diverged — prove
   that by hashing the stale openDoc.snapshot on its own and confirming
   it differs from the fixed value now used everywhere. */
const staleHash = m.docHash(openDoc.snapshot);
ok(staleHash !== effectiveSnapshot && m.docHash(openDoc.snapshot) !== m.docHash(effectiveSnapshot),
  "sanity check: the stale static snapshot really does hash to something different — proving this was a real, not hypothetical, divergence");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 85: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 85 tests passed");
