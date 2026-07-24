/* Build 8 — real uploads, job quick actions, home task completion,
   functional review tracker, warranty date-field fix. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

ok(src.includes("async function uploadJobFile"), "real file uploader exists");
ok(src.includes('db.storage.from("job-files").upload'), "tries Supabase Storage first");
ok(src.includes("INLINE_FILE_CAP"), "inline fallback has a size cap");
ok(src.includes('type="file" multiple'), "Files tab has a real file input");
ok(src.includes("readAsDataUrl"), "fallback reads the file, not just its name");
ok(!src.includes('disabled={!name.trim()} onClick={() => {\n          mut((j) => ({ ...j, files: [...j.files, { id: uid("f"), name: name.trim()'),
  "old name-only upload stub is gone");

ok(src.includes('href={tel ? `tel:${tel}` : null} icon={Phone} label="Call"'), "job quick-call action");
ok(src.includes('href={tel ? `sms:${tel}` : null} icon={MessageCircle} label="Text"'), "job quick-text action");
ok(src.includes('icon={MapPin} label="Directions"'), "job directions action");
ok(src.includes('onClick={() => setTab("files")} icon={Upload} label="Upload"'), "job upload jumps to files");

ok(src.includes("onToggleTask"), "home passes a task-toggle handler");
ok(src.includes('aria-label={t.done ? "Mark not done" : "Mark done"}'), "home task rows have a completion control");

ok(src.includes("REQUESTS SENT"), "review tracker lists sent requests");
ok(src.includes("ready to ask"), "review tracker surfaces eligible jobs");
ok(src.includes("Posted ★") || src.includes('r.posted ? "Posted'), "review tracker shows posted status");
ok(!src.includes("Completed jobs with SMS or email consent get an automatic Google review request. Manage settings under"),
  "dead placeholder review card removed");

ok(src.includes("const dateInputStyle"), "date input has a mobile-safe style");
ok(src.includes('WebkitAppearance: "none"'), "date input neutralises iOS native sizing");

if (fails) { console.log("\nbuild 8: " + fails + " FAILED"); process.exit(1); }
console.log("build 8 tests passed");
