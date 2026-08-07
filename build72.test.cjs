/* Build 72 — the "Bucket not found" report against punch-list photo
   upload. uploadJobFile() already had a graceful inline-storage fallback
   for any Storage error before this build touched it — this locks that
   behavior in with a real test (it had none) and fills the two actual
   gaps: no migration ever created the "job-files" bucket the whole app's
   upload path depends on, and DEPLOY.md never said to. */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- migration ---------- */
const migPath = path.join(__dirname, "supabase/migrations/024_job_files_bucket.sql");
ok(fs.existsSync(migPath), "a migration creates the job-files bucket — it's reproducible, not a manual dashboard step only");
const migSrc = fs.existsSync(migPath) ? fs.readFileSync(migPath, "utf8") : "";
ok(/insert into storage\.buckets \(id, name, public\)/.test(migSrc) && /values \('job-files', 'job-files', true\)/.test(migSrc),
  "the bucket is created public — required because the app calls getPublicUrl() with no signed-URL path anywhere");
ok(/on conflict \(id\) do nothing;/.test(migSrc), "re-running the migration on a project that already has the bucket is a safe no-op");
ok(/for select to public using \(bucket_id = 'job-files'\);/.test(migSrc), "public read policy exists — getPublicUrl() links would 403 without it");
ok(/for insert to authenticated with check \(bucket_id = 'job-files'\);/.test(migSrc), "only signed-in seats can upload — not an open write target");

/* ---------- DEPLOY.md ---------- */
const deploySrc = fs.readFileSync(path.join(__dirname, "DEPLOY.md"), "utf8");
ok(/job-files/.test(deploySrc), "DEPLOY.md actually mentions the bucket by name now — it had zero hits before this fix");
ok(/Bucket not found/.test(deploySrc), "DEPLOY.md names the exact symptom, so a search for the error text finds the fix");
ok(/supabase db push/.test(deploySrc.slice(deploySrc.indexOf("Bucket not found") - 400, deploySrc.indexOf("Bucket not found") + 800)),
  "the fix instructions sit right next to the symptom, not buried in an unrelated section");

/* ---------- uploadJobFile's existing fallback, now actually tested ---------- */
ok(/if \(!error\) \{[\s\S]{0,200}return \{ storage: "supabase"/.test(src),
  "a successful Storage upload still returns the supabase-backed shape");
ok(/\/\* Missing bucket \/ not on Pro: fall through to the inline path\. \*\//.test(src),
  "a Storage error (bucket missing, plan doesn't include Storage) is explicitly expected to fall through, not surfaced raw");

const scratch = path.join(__dirname, "_b72.jsx");
const bundle = path.join(__dirname, "_b72.cjs");
fs.writeFileSync(scratch, src + "\nexport { uploadJobFile };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b72.cjs");

global.window = {};
global.FileReader = function () {
  this.readAsDataURL = function (file) {
    this.result = `data:${file.type};base64,ZmFrZQ==`;
    if (this.onload) this.onload();
  };
};

async function run() {
  /* A missing bucket returns an error object rather than throwing —
     this is the exact shape a real "Bucket not found" 404 comes back
     as from supabase-js's storage client. */
  global.window.__SUPABASE__ = {
    storage: {
      from() {
        return {
          upload: async () => ({ error: { statusCode: "404", error: "Bucket not found", message: "Bucket not found" } }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        };
      },
    },
  };
  const small = { name: "roof.jpg", type: "image/jpeg", size: 1024 };
  const result = await m.uploadJobFile("job1", small);
  ok(result && result.storage === "inline", "a bucket-not-found error falls back to inline storage instead of throwing the raw provider error at the caller");
  ok(result && result.url && result.url.startsWith("data:"), "the inline fallback actually produces a usable data URL, not an empty result");

  /* A provider call that throws outright (a network error, a rejected
     promise) must fall back exactly the same way — the try/catch has to
     catch BOTH failure shapes supabase-js can produce. */
  global.window.__SUPABASE__ = {
    storage: { from() { return { upload: async () => { throw new Error("network down"); } }; } },
  };
  const result2 = await m.uploadJobFile("job1", small);
  ok(result2 && result2.storage === "inline", "a thrown storage exception (not just a returned error) also falls back to inline rather than propagating");

  /* And the happy path: Storage actually works. */
  global.window.__SUPABASE__ = {
    storage: {
      from() {
        return {
          upload: async () => ({ error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "https://example.supabase.co/storage/v1/object/public/job-files/job1/roof.jpg" } }),
        };
      },
    },
  };
  const result3 = await m.uploadJobFile("job1", small);
  ok(result3 && result3.storage === "supabase" && result3.url.includes("job-files"),
    "once Storage genuinely works, the real public URL is returned — the fallback doesn't shadow a working bucket");

  if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 72: " + fails + " FAILED"); process.exit(1); }
  fs.unlinkSync(bundle);
  console.log("build 72 tests passed");
}
run();
