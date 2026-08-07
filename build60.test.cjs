/* Build 60 — company documents actually store the file.

   Uploading a COI or a license under Company Documents produced a row with a
   name, a category, and a size of "—". The picked File object was read for its
   name and then discarded — `save()` never touched it. Every job file and job
   photo goes through a working Supabase Storage (or inline-fallback) upload;
   this was the one document surface that was never connected to it. The
   symptom the office would actually hit: open the document later and it says
   "files aren't stored anywhere," on a screen that looked like it worked.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/function uploadCompanyFile\(file\) \{ return uploadJobFile\("_company", file\); \}/.test(src),
  "company uploads go through the same tested path as job files, not a parallel one");
ok(/const save = async \(\) => \{/.test(src), "saving a document is now async — it has to wait on the upload");
ok(/up = await uploadCompanyFile\(file\);/.test(src), "and it actually uploads the picked file");
ok(!/size: "—",\s*\n\s*at: today, by: currentUser\.name, pinned: false, expires: f\.expires \|\| null,\s*\n\s*\}\]\);/.test(src),
  "the old metadata-only record shape is gone");
ok(/url: up\.url, storage: up\.storage, storageKey: up\.key, mime: up\.mime,/.test(src),
  "the new record carries where the file actually lives");
/* An upload that fails must not leave a row pointing at nothing — the same
   rule photos and job files already follow. */
ok(/setErr\(\(e && e\.message\) \|\| "Couldn't save that file\."\);\s*\n\s*return;/.test(src),
  "a failed upload records nothing and says so");
ok(/if \(!file\) \{ setErr\("Choose a file first\."\); return; \}/.test(src),
  "save refuses to run with no file picked");

/* The viewing sheet must actually offer the file once one exists, and must
   not claim "not available yet" for a document that HAS a url — that
   sentence is only honest for records that predate this fix. */
ok(/viewing\.url \? \(/.test(src), "the preview sheet branches on whether a file is actually attached");
ok(/Open \{viewing\.name\}/.test(src), "and opens the real file when there is one");
ok(/This record predates file storage and has no file attached/.test(src),
  "a legacy metadata-only record says so specifically, not that storage in general doesn't work");
ok(!/Once documents are wired to Supabase Storage, this opens the actual PDF\./.test(src),
  "the old blanket disclaimer is gone — storage is wired now");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_docs60.jsx");
const bundle = path.join(__dirname, "_docs60.cjs");
fs.writeFileSync(scratch, src + "\nexport { uploadCompanyFile, uploadJobFile };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_docs60.cjs");

/* No live Supabase client in this test, so uploadJobFile takes its inline
   fallback — which is exactly the path a fresh install without Storage
   configured takes too, and it must actually return usable bytes. */
const file = { name: "coi-2026.pdf", size: 1024, type: "application/pdf",
  slice: () => new Blob(["%PDF-1.4 fake"]), arrayBuffer: async () => new TextEncoder().encode("%PDF-1.4 fake").buffer };
/* readAsDataUrl uses FileReader, which jsdom/node doesn't provide — stub the
   minimum it needs so this test exercises uploadCompanyFile's own key/bucket
   logic rather than re-testing FileReader. */
global.FileReader = class {
  readAsDataURL() {
    this.result = "data:application/pdf;base64,ZmFrZQ==";
    this.onload && this.onload({ target: this });
  }
};

(async () => {
  const up = await m.uploadCompanyFile(file);
  ok(up.storage === "inline", `with no DB client configured, it takes the inline fallback (got ${up.storage})`);
  ok(up.url.startsWith("data:application/pdf"), "and the fallback actually carries the file's bytes");
  ok(up.size === 1024, "the real size is reported, not a placeholder dash");
  /* Build 98 added a tenant-id path segment ahead of the job/company
     scope (${tenantPrefix}/${jobId}/...) so the tenant-scoped Storage
     policies have something to check; with no window.__TENANT_ID__ in
     this plain-Node test environment it falls back to "_shared". The
     job/company scope itself is still the segment right after that. */
  ok(up.key.split("/")[1] === "_company", "company documents still get their own key prefix, distinct from any job's");
  ok(!/^\d+_company_/.test(up.key), "and the prefix reads as a scope, not a job id that happens to be a fake string");

  fs.unlinkSync(bundle);
  if (fails) { console.log("\nbuild 60: " + fails + " FAILED"); process.exit(1); }
  console.log("build 60 tests passed");
})();
