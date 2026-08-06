/* Build 64 — two more quick wins from the competitive gap analysis, both
   turning the photo album into something more than a generic gallery.

   1. Before/after pairing: a lightweight join over the existing photo
      album (job.photoPairs[]), the same shape the app already uses for
      other registries instead of mutating the photo record itself —
      CompanyCam's single most-praised specific feature, scoped down to
      side-by-side cards since there's no image-manipulation library here
      for a true slider/overlay.

   2. Photo-to-finding tagging: a SupplementCheck finding can now be
      pointed at a specific photo, turning the album into claim evidence
      instead of a generic gallery — the gap Encircle and DocuSketch are
      built specifically to close. The tag stores whether its citation
      was actually verified, same discipline as the justification text.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- 1: before/after pairing ---------- */
ok(/photoPairs: \[\.\.\.\(j\.photoPairs \|\| \[\]\), \{ id: uid\("pp"\), label: pairLabel\.trim\(\) \|\| "Before \/ after", beforeId: pairBefore, afterId: pairAfter \}\]/.test(src),
  "a pair is a lightweight join — two existing photo ids and a label, not a new kind of photo");
ok(/const deletePair = \(id\) => mut\(\(j\) => \(\{ \.\.\.j, photoPairs: \(j\.photoPairs \|\| \[\]\)\.filter\(\(pp\) => pp\.id !== id\) \}\)\);/.test(src),
  "a pair can be removed without touching the underlying photos");
ok(/const photoById = \(id\) => job\.photos\.find\(\(p\) => p\.id === id\);/.test(src),
  "pairs resolve their photos live from the album rather than duplicating photo data");
ok(/if \(!before \|\| !after\) return null;/.test(src),
  "a pair whose photo was deleted renders nothing instead of a broken card");
ok(/\[\["BEFORE", before\], \["AFTER", after\]\]\.map/.test(src),
  "both sides of a pair render through the same card markup");

/* ---------- 2: photo-to-finding tagging ---------- */
ok(/const tagPhoto = \(f, photoId\) => \{/.test(src),
  "tagging is its own function, independent of add-to-estimate/add-as-supplement");
ok(/\? \{ \.\.\.p, findingTag: \{ title: f\.title, cite: printable\(cf\) \? cf\.value : null \} \}/.test(src),
  "the tag records whether its citation is actually verified — same rule the justification text follows");
ok(/\{isClaim && job\.photos\.length > 0 && \(/.test(src) && /Tag a photo/.test(src),
  "the tagging action only appears when there's something to tag it with");
ok(/const active = p\.findingTag && p\.findingTag\.title === f\.title;/.test(src),
  "the picker highlights whichever photo is already tagged to this finding");
ok(/\{p\.findingTag && \(/.test(src) && /Evidence: \{p\.findingTag\.title\}/.test(src),
  "a tagged photo shows its evidence label right in the album, not just in the finding list");
/* The action row used to hide entirely once a finding was marked done —
   tagging has to survive that, since evidence-gathering isn't the same
   step as filing the supplement. */
ok(/\{done\[f\.title\] && <Chip tone="green">/.test(src) && !/\{done\[f\.title\] \? \(/.test(src),
  "the done state no longer replaces the whole action row — tagging stays available after a finding is filed");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_b64.jsx");
const bundle = path.join(__dirname, "_b64.cjs");
fs.writeFileSync(scratch, src + "\nexport { supplementFindings };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b64.cjs");

/* Sanity check that supplementFindings (what tagPhoto's `f` comes from)
   still returns stable, titled findings — the tag keys off f.title, so a
   finding without one would tag nothing to nothing. */
const job = {
  claimType: "Insurance", zip: "45202", state: "OH",
  estimate: { items: [{ id: "e1", desc: "Architectural shingles", qty: 20, unit: "SQ", price: 400 }] },
  measurements: { squares: 20, valleys: 40, eaves: 60 }, checklist: {},
};
const found = m.supplementFindings(job);
ok(found.length > 0, "a real job with gaps still produces findings for the tagging UI to key off of");
ok(found.every((f) => typeof f.title === "string" && f.title.length > 0), "every finding has a non-empty title");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 64: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 64 tests passed");
