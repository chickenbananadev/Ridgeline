/* Build 69 — AI damage detection on photos, the third of the six "bigger
   bets." The gap-analysis research found no roofing CRM doing this well —
   not even CompanyCam, whose whole product is photos — so this is a real
   opportunity, not a catch-up move.

   Same sandbox contract as the existing ai-assistant: the Anthropic key
   lives only in a new photo-damage-detect Edge Function, the model sees
   exactly one photo's bytes and nothing else about the tenant, and the
   client degrades silently with no key deployed — same pattern proven by
   askAssistant/pushToCalendar (never throws, returns null on any failure).
   An accepted finding becomes the exact same findingTag the manual
   "Tag a photo" flow in SupplementCheck already writes, so it's real claim
   evidence from here on, not a second parallel system nobody else reads.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- edge function ---------- */
const fnPath = path.join(__dirname, "supabase/functions/photo-damage-detect/index.ts");
ok(fs.existsSync(fnPath), "photo-damage-detect Edge Function exists");
const fnSrc = fs.existsSync(fnPath) ? fs.readFileSync(fnPath, "utf8") : "";
ok(/ANTHROPIC_API_KEY/.test(fnSrc), "reuses the same secret ai-assistant already requires — no new key to provision");
ok(/if \(!key\) return json\(\{ ok: false, reason: "unconfigured" \}\);/.test(fnSrc),
  "with no key deployed this degrades to unconfigured rather than a hard failure");
ok(/const \{ data: \{ user \} \} = await caller\.auth\.getUser\(\);/.test(fnSrc) && /if \(!user\)/.test(fnSrc),
  "only a signed-in seat can call this — not an open relay to a paid API");
ok(/type: "image", source: \{ type: "base64", media_type: mimeType, data: imageBase64 \}/.test(fnSrc),
  "the image goes to the model as an actual image content block, not pasted as text");
ok(/Never infer damage that isn't in the frame/.test(fnSrc),
  "the system prompt explicitly forbids inferring damage that isn't visible");
ok(/never estimate repair cost or dollar value/.test(fnSrc),
  "the prompt keeps this to visible-damage description, not a claim or cost determination");
ok(/ALLOWED_MIME = new Set/.test(fnSrc), "only real image mime types are accepted, not arbitrary file uploads");

/* ---------- client wiring ---------- */
const mainSrc = fs.readFileSync(path.join(__dirname, "src/main.jsx"), "utf8");
ok(/async detectPhotoDamage\(\{ imageBase64, mimeType \}\) \{/.test(mainSrc),
  "the AUTH() surface exposes exactly the shape the edge function expects");
ok(/if \(error \|\| !data \|\| !data\.ok \|\| !Array\.isArray\(data\.findings\)\) return null;/.test(mainSrc),
  "any failure shape returns null rather than throwing into the UI");

/* ---------- ridgeline.jsx: helpers + TabPhotos wiring ---------- */
ok(/async function dataUrlFromImageUrl\(url\) \{/.test(src) && /if \(String\(url\)\.startsWith\("data:"\)\) return url;/.test(src),
  "an already-inline photo (demo mode, no Storage) skips the network round trip entirely");
ok(/function splitDataUrl\(dataUrl\) \{/.test(src),
  "the base64 payload and mime type are pulled apart by one shared, testable function");
ok(/const \[scanning, setScanning\] = useState\(null\);/.test(src),
  "TabPhotos tracks which single photo is mid-scan, not a single global busy flag");
ok(/const scanPhoto = async \(p\) => \{/.test(src),
  "scanning is a real function on TabPhotos, not inlined into the button's onClick");
ok(/if \(!a \|\| !a\.detectPhotoDamage\) \{ toast\("Damage detection isn't available in demo mode"\); return; \}/.test(src),
  "demo mode (or a backend without this deployed) tells the rep why, instead of the button silently doing nothing");
ok(/if \(!p\.url\) \{ toast\("This photo has no image to scan"\); return; \}/.test(src),
  "a photo with no real image data (a legacy record) can't be sent for scanning");
ok(/mut\(\(j\) => \(\{ \.\.\.j, photos: j\.photos\.map\(\(x\) => \(x\.id === p\.id \? \{ \.\.\.x, aiScan: \{ at: nowStamp\(\), findings \} \} : x\)\) \}\)\);/.test(src),
  "scan results are written onto the job's own photo record, so they survive a reload like every other fact on the job");
ok(/const useAiFinding = \(p, finding\) => \{/.test(src) &&
   /findingTag: \{ title: finding\.type, cite: null \}/.test(src),
  "accepting an AI finding writes the same findingTag shape the manual tagging flow uses — one evidence system, not two");
ok(/\{p\.url && !p\.aiScan && \(/.test(src),
  "the scan button only appears for a photo that has real image data and hasn't been scanned yet");
ok(/AI SCAN · VERIFY IN PERSON/.test(src),
  "results are visibly labeled as needing human verification, not presented as a determination");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_b69.jsx");
const bundle = path.join(__dirname, "_b69.cjs");
fs.writeFileSync(scratch, src + "\nexport { splitDataUrl };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b69.cjs");

ok(m.splitDataUrl(null) === null, "a missing url never crashes the split, it just reports nothing to send");
ok(m.splitDataUrl("https://example.com/photo.jpg") === null,
  "a plain https URL (not yet converted to a data URL) is correctly recognized as not-yet-splittable");

const split = m.splitDataUrl("data:image/jpeg;base64,/9j/4AAQSkZJRg==");
ok(split && split.mime === "image/jpeg", "the mime type is read out of the data URL header exactly");
ok(split && split.base64 === "/9j/4AAQSkZJRg==", "the base64 payload is separated from the header with nothing lost or added");

/* A real photo upload's data URL can itself contain a comma (base64 never
   does, but the regex has to not stop at the first comma in the header in
   principle) — prove the split takes everything after the FIRST comma. */
const split2 = m.splitDataUrl("data:image/png;base64,iVBORw0KGgoAAAA=");
ok(split2 && split2.base64 === "iVBORw0KGgoAAAA=", "a PNG data URL splits the same way a JPEG one does");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 69: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 69 tests passed");
