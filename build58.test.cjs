/* Build 58 — the certificate of completion.

   The document a carrier wants before it releases recoverable depreciation.
   The owner supplied a signed one as the template. It is a statement of fact
   about a finished job, so the point of this build is that it is *generated*
   — nobody retypes the claim number onto a Word document at the end of a job,
   and nobody has to remember what day the crew finished.

   Two things it needed that the job file did not record: the completion date
   (stageAt is the date of the last stage move, which stops being the same
   thing the moment a job bounces back for a punch item) and the peril.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static wiring ---------- */
ok(/if \(stageId === "s10" && !next\.completedAt\) next\.completedAt = todayIso\(\);/.test(src),
  "reaching Job completed stamps the completion date");
/* Stamped once. A job moved out of s10 and back must not have the date of the
   work rewritten to the date somebody fixed the stage. */
ok(/!next\.completedAt/.test(src), "and never overwrites a date already on file");
ok(/<Field label="Type of loss">/.test(src), "the peril is recorded on the claim screen");
ok(/const PERILS = \[/.test(src), "from a fixed list, so it reads the same on every certificate");

ok(/function certificateDocHtml\(job, brand\)/.test(src), "the document builder exists");
ok(/function certificateFor\(job, brand\)/.test(src), "with one resolver feeding both it and the screen");
ok(/function certificateGaps\(job, brand\)/.test(src), "and a readiness check");
ok(/function TabCertificate\(/.test(src), "the job section exists");
ok(/case "certificate": return <TabCertificate/.test(src), "and is reachable");
ok(/\["certificate", "Certificate of completion"\]/.test(src), "it is in JOB_TABS, so the section actually renders");
ok(/if \(id === "certificate"\) return job\.claimType === "Insurance";/.test(src),
  "a retail job has no carrier to certify anything to");

/* PDF and email, the pair every other document has. */
ok(/openDoc\(docTitle, brand, certificateDocHtml\(job, brand\), toast, \{ bare: true \}\)/.test(src),
  "it prints through the same path as every other document");
ok(/subject: `Certificate of completion — \$\{job\.address\}`/.test(src), "and emails to the customer");
ok(/<Btn style=\{\{ flex: 1 \}\} disabled=\{!ready\}/.test(src), "emailing is blocked while it is incomplete");

/* Portal. */
ok(/function portalDocuments\(job, brand, portal\)/.test(src), "the portal's document list is built in one place");
ok(/certificate: true,/.test(src), "sharing the certificate is on by default");
ok(/portal\.certificate !== false && cert\.shared !== false && certificateReady\(job, brand\)/.test(src),
  "and withheld until the certificate is actually complete");
/* The Documents section is normally gated on portal.documents, which ships
   off — filing the certificate there without this would hide it. */
ok(/sid === "documents" \? portalDocs\.length > 0 : portalSectionOn\(portal, sid\)/.test(src),
  "the Documents section opens when there is something in it");
ok(/\{!file\.url && file\.html && \(/.test(src), "a generated document renders a View action rather than a dead Open link");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_coc58.jsx");
const bundle = path.join(__dirname, "_coc58.cjs");
fs.writeFileSync(scratch, src + "\nexport { certificateDocHtml, certificateFor, certificateGaps, certificateReady, " +
  "portalDocuments, buildPortalSnapshot, longDate, DEFAULT_PORTAL_SETTINGS, paymentsSummary };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_coc58.cjs");

const brand = { company: "Supreme Building Group, Inc.", address: "311 Elm St", phone: "(513) 555-0111", email: "office@sbg.com", primary: "#2B3440" };
/* Modelled on the supplied certificate. */
const job = {
  id: "j-lange", name: "Jennifer Lange", address: "13045 Old Dayton Rd, New Lebanon, OH 45345",
  zip: "45345", state: "OH", stageId: "s10", claimType: "Insurance", assignee: "Jacob Henderson",
  completedAt: "2026-08-03",
  insurance: { carrier: "The Cincinnati Insurance Companies", policy: "HO40355904", claim: "4701721",
    adjusterName: "Logan Hubbard", deductible: "1000", coverage: "RCV" },
  claim: { dateOfLoss: "2026-05-23", typeOfLoss: "Wind" },
  contract: { price: 20168.62, status: "Signed" },
  estimate: { items: [] }, changeOrders: [], payments: [], tasks: [], checklist: {},
  measurements: {}, files: [], photos: [], portal: { ...m.DEFAULT_PORTAL_SETTINGS },
};

const a = m.certificateFor(job, brand);
ok(a.owner === "Jennifer Lange", "the owner comes off the job");
ok(a.claimNo === "4701721", "the claim number comes off the insurance record");
ok(a.policyNo === "HO40355904", "so does the policy number");
ok(a.typeOfLoss === "Wind", "the peril comes off the claim");
ok(a.dateOfLoss === "2026-05-23", "so does the date of loss");
ok(a.adjuster === "Logan Hubbard", "the adjuster is carried through");
ok(a.manager === "Jacob Henderson", "and the assigned rep is the project manager");
ok(a.completedAt === "2026-08-03", "the completion date is the one stamped on the job");
ok(m.certificateReady(job, brand), "so nothing is missing");

/* The money. Total, not an itemised schedule — the owner contracts on a
   total, and a certificate that disagrees with the carrier's estimate line
   for line starts an argument on a document meant to end one. */
ok(a.rcv === 20168.62, `RCV is the contract price (got ${a.rcv})`);
ok(a.deductible === 1000, "the deductible is read off the claim");
ok(a.net === 19168.62, `net claim is RCV less the deductible (got ${a.net})`);

/* An approved change order raises the contract price, and must raise the
   certificate with it — the invoice had exactly this bug. */
const withCo = { ...job, changeOrders: [
  { id: "c1", title: "Decking", status: "Approved", lines: [{ id: "l1", label: "OSB", qty: 10, unit: "sheet", price: 85 }] },
  { id: "c2", title: "Skylight", status: "Sent", lines: [{ id: "l2", label: "Velux", qty: 1, unit: "ea", price: 1400 }] },
] };
ok(m.certificateFor(withCo, brand).rcv === 21018.62,
  `an approved change order is in the certified total (got ${m.certificateFor(withCo, brand).rcv})`);
ok(m.certificateFor(withCo, brand).rcv !== 22418.62, "an unapproved one is not");

const doc = m.certificateDocHtml(job, brand);
ok(/CERTIFICATE OF COMPLETION/.test(doc), "the document is titled");
ok(/Residential Roof Replacement — Insurance Restoration/.test(doc), "and says what was done");
ok(/Jennifer Lange/.test(doc) && /4701721/.test(doc) && /HO40355904/.test(doc), "it carries the project information");
ok(/The Cincinnati Insurance Companies/.test(doc), "including the carrier");
/* Dates read as statements, not form fields. Parsed at noon so a timezone
   west of UTC cannot walk a date-only string back a day. */
ok(/August 3, 2026/.test(doc), "dates are written out");
ok(/May 23, 2026/.test(doc), "including the date of loss");
ok(m.longDate("2026-01-01") === "January 1, 2026", "and the first of the month does not slip to December 31");
ok(/\$20,168\.62/.test(doc), "the contract price is stated");
ok(/\(\$1,000\.00\)/.test(doc), "the deductible is shown as a deduction");
ok(/\$19,168\.62/.test(doc), "and the net claim follows");
ok(/completed on\s*\n?\s*August 3, 2026/.test(doc.replace(/\s+/g, " ")) || /completed on August 3, 2026/.test(doc.replace(/\s+/g, " ")),
  "the certification sentence names the completion date");
ok(/&mdash; Property Owner/.test(doc), "there is a line for the homeowner to sign");
ok(/Certificate of Completion &nbsp;\|&nbsp; Jennifer Lange/.test(doc), "and a running footer identifying it");
/* The owner's signature line must stay blank — the app never signs for them. */
ok(/class="certline"/.test(doc), "the owner's signature line is blank");

/* No line items, per the owner: they contract on a total. */
ok(!/Line Item Total/.test(doc), "the certificate does not itemise");
ok(!/Material Sales Tax/.test(doc), "and states no tax the app does not track");

/* ---------- gaps ---------- */
const noDate = { ...job, completedAt: "" };
ok(m.certificateGaps(noDate, brand).some((g) => /completed/.test(g)), "a job with no completion date is not ready");
ok(!m.certificateReady(noDate, brand), "and says so");
ok(m.certificateGaps({ ...job, insurance: { ...job.insurance, claim: "" } }, brand).some((g) => /claim number/.test(g)),
  "nor is one with no claim number");
ok(m.certificateGaps({ ...job, contract: { price: 0 } }, brand).some((g) => /contract price/.test(g)),
  "nor one with no price to certify");
/* A draft still prints, so a rep can see what is blank. */
ok(/CERTIFICATE OF COMPLETION/.test(m.certificateDocHtml(noDate, brand)), "an incomplete certificate still prints as a draft");

/* ---------- the portal ---------- */
const snap = m.buildPortalSnapshot(job, brand, "tok123", []);
const docs = snap.data.documents;
ok(docs.length === 1 && docs[0].name === "Certificate of Completion", "the certificate reaches the portal");
ok(docs[0].html && /CERTIFICATE OF COMPLETION/.test(docs[0].html), "carrying its rendered body, since it has no storage URL");
ok(docs[0].url === null, "and no URL to a file that does not exist");
ok(docs[0].date === "August 3, 2026", "dated the day the work finished");
/* Documents ships OFF, and governs uploaded files. The certificate must not
   be filed into a section the homeowner cannot open. */
ok(m.DEFAULT_PORTAL_SETTINGS.documents === false, "uploaded-file sharing is still off by default");
ok(snap.data.order.includes("documents"), "but the Documents section opens because there is a certificate in it");

/* Turning it off, at either level, takes it away. */
ok(m.portalDocuments(job, brand, { ...m.DEFAULT_PORTAL_SETTINGS, certificate: false }).length === 0,
  "the company can switch certificate sharing off");
ok(m.portalDocuments({ ...job, certificate: { shared: false } }, brand, m.DEFAULT_PORTAL_SETTINGS).length === 0,
  "and so can the job");
/* An incomplete one never reaches a homeowner. */
ok(m.portalDocuments(noDate, brand, m.DEFAULT_PORTAL_SETTINGS).length === 0,
  "an incomplete certificate is withheld from the portal");
ok(!m.buildPortalSnapshot(noDate, brand, "t", []).data.order.includes("documents"),
  "and the empty section does not appear");

/* Uploaded files still work, and the certificate leads. */
const withFiles = { ...job, files: [{ id: "f1", name: "Permit.pdf", cat: "Permits", at: "Jul 2", shared: true, url: "https://x/permit.pdf" }],
  portal: { ...m.DEFAULT_PORTAL_SETTINGS, documents: true } };
const both = m.portalDocuments(withFiles, brand, { ...m.DEFAULT_PORTAL_SETTINGS, documents: true });
ok(both.length === 2, `shared files still appear alongside it (got ${both.length})`);
ok(both[0].name === "Certificate of Completion", "with the certificate first");
ok(both[1].url === "https://x/permit.pdf", "and an uploaded file keeping its URL");

/* A retail job has no carrier, so no certificate. */
const retail = { ...job, claimType: "Retail", insurance: null, claim: {} };
ok(!m.certificateReady(retail, brand), "a retail job cannot produce a certificate");
ok(m.portalDocuments(retail, brand, m.DEFAULT_PORTAL_SETTINGS).length === 0, "and none reaches its portal");

/* Corrections on the certificate screen win over the job file, without
   writing back to it — the rule the agreement already follows. */
const corrected = { ...job, certificate: { completedAt: "2026-08-10", claimNo: "NEW-1", deductible: "2500" } };
const c2 = m.certificateFor(corrected, brand);
ok(c2.completedAt === "2026-08-10" && c2.claimNo === "NEW-1", "a correction overrides the job file");
ok(c2.deductible === 2500 && c2.net === 17668.62, "including the deductible, which moves the net claim");
ok(job.completedAt === "2026-08-03" && job.insurance.claim === "4701721", "and the job itself is untouched");

fs.unlinkSync(bundle);
if (fails) { console.log("\nbuild 58: " + fails + " FAILED"); process.exit(1); }
console.log("build 58 tests passed");
