/* Build 30 — crm_org made per-tenant, and the new charcoal/teal logo. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");

function check(name, cond) {
  if (!cond) { console.error("FAILED: " + name); process.exit(1); }
}

/* ---- static: crm_org root-cause fix ---- */
const migration017 = fs.readFileSync(path.join(__dirname, "supabase/migrations/017_org_per_tenant.sql"), "utf8");
check("migration 017 adds a unique constraint on tenant_id", /unique \(tenant_id\)/.test(migration017));
check("migration 017 is idempotent", /if not exists[\s\S]*pg_constraint/.test(migration017));

check("useDbSync destructures tenantId", /ready, isMoneyBlocked, userName, tenantId,/.test(src));
check("org hydrate read is scoped by tenant_id, not a hardcoded id",
  /db\.from\("crm_org"\)\.select\("data"\)\.eq\("tenant_id", tenantId\)/.test(src));
check("org hydrate falls back to legacy id=1 when tenantId is unavailable, rather than hard-blocking forever (fixed after a production hang)",
  /db\.from\("crm_org"\)\.select\("data"\)\.eq\("id", 1\)\.maybeSingle\(\)/.test(src));
check("org first-boot seed upserts by tenant_id with onConflict, not id:1",
  /upsert\(\{ tenant_id: tenantId, data: orgPack\(\), updated_at: new Date\(\)\.toISOString\(\) \}, \{ onConflict: "tenant_id" \}\)/.test(src));
check("org debounced save falls back to legacy id=1 when tenantId is unavailable, rather than silently never saving (fixed after a production hang)",
  /db\.from\("crm_org"\)\.upsert\(\{ id: 1, data: orgPack\(\), updated_at: new Date\(\)\.toISOString\(\) \}\)/.test(src));
check("the legacy id=1 fallback exists deliberately in exactly the right places (org read, org first-boot seed, org debounced save)",
  (src.match(/"crm_org"\)\.(?:select\("data"\)\.eq\("id", 1\)\.maybeSingle\(\)|upsert\(\{ id: 1)/g) || []).length >= 3);
check("useDbSync call site passes tenantId through", /tenantId: currentUser && currentUser\.tenantId,/.test(src));

/* ---- static: new logo colors wired everywhere ---- */
const indexHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "public/manifest.json"), "utf8"));
check("no leftover old navy hex anywhere", !/#062860/.test(src) && !/#062860/.test(indexHtml));
check("theme-color updated to new charcoal", indexHtml.includes('content="#20242A"'));
check("manifest theme_color updated to new charcoal", manifest.theme_color === "#20242A");
check("DEFAULT_BRAND.primary updated to new charcoal", /primary: "#20242A"/.test(src));

const iconFiles = ["apple-touch-icon.png", "icon-192.png", "icon-512.png",
  "favicon-32x32.png", "favicon-16x16.png", "favicon.ico",
  "roofstride-logo-horizontal.png", "roofstride-mark.png"];
for (const f of iconFiles) {
  const p = path.join(__dirname, "public", f);
  check(f + " exists", fs.existsSync(p));
  check(f + " is non-trivial size", fs.statSync(p).size > 500);
}

/* Confirm the actual pixel color of the regenerated app icon matches
   the new palette, not a stale cached render from the old logo. */
const { execSync } = require("child_process");
const sample = execSync(
  `python3 -c "from PIL import Image; im = Image.open('${path.join(__dirname, "public/icon-512.png")}').convert('RGB'); print(im.getpixel((10,10)))"`
).toString().trim();
check("regenerated icon corner is the new charcoal, not old navy", sample === "(32, 36, 42)");

console.log("build 30 tests passed");
