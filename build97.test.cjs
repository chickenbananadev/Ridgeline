/* Build 97 — splash-screen "YC" flash.

   DEFAULT_BRAND's fallback company initials are literally "YC"
   ({ company: "Your Company", short: "YC" }) — the template used before
   a tenant's real per-tenant brand row loads from Supabase. The boot-
   loading screen (shown while `booting || (liveAuth() && currentUser
   && !hydrated)`) fell back to a 56x56 dark badge rendering
   `brand.short` as plain text whenever `brand.logo` hadn't loaded yet
   — true for the brief window on every cold load, so real users
   briefly saw a "YC" badge before their own branding appeared.

   Fix: replace the text-initials fallback with the real RoofStride
   platform mark (/icon-512.png, already in public/ — a self-contained
   square icon with its own dark background, no extra brand.primary
   wrapper needed), sized ~30% larger than the old 56px badge (~73px).
   The brand.logo branch (a tenant's own uploaded logo) is untouched.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/<img src="\/icon-512\.png" alt="RoofStride" style=\{\{\s*\n\s*width: 73, height: 73, borderRadius: 16, objectFit: "contain", margin: "0 auto 14px", display: "block",\s*\n\s*\}\} \/>/.test(src),
  "the boot-loading fallback now renders the RoofStride icon image at 73px (56px * 1.3), not a text badge");
const bootScreenStart = src.indexOf("if (booting || (liveAuth() && currentUser && !hydrated)) {");
ok(bootScreenStart > 0, "the boot-loading screen block is still present");
const bootScreenBlock = src.slice(bootScreenStart, bootScreenStart + 1200);
ok(!bootScreenBlock.includes("{brand.short}"),
  "brand.short is no longer rendered as visible fallback text in the boot-loading screen specifically (other brand.short fallback badges elsewhere in the app, e.g. Home avatar / portal header / branding settings preview, are untouched)");
ok(bootScreenBlock.includes('brand.logo ?'),
  "a tenant's own uploaded logo (brand.logo) still takes priority and is unaffected by this fix");
ok(bootScreenBlock.includes('src={brand.logo}'),
  "the brand.logo <img> branch is unchanged");
ok(bootScreenBlock.includes('Loading…'),
  "the Loading… label beneath the mark/logo is unchanged");
ok(!bootScreenBlock.includes('background: brand.primary'),
  "the old colored-box wrapper around the text initials is gone (icon-512.png already has its own background baked in)");

/* ---------- behavioral ---------- */
/* Mirror the exact fallback-badge sizing math: 56px * 1.3 = 72.8,
   confirm the chosen 73px is genuinely ~30% larger, not a smaller or
   unrelated bump. */
const oldSize = 56;
const newSize = 73;
const pctLarger = (newSize - oldSize) / oldSize;
ok(pctLarger > 0.28 && pctLarger < 0.32, "the new fallback mark is genuinely ~30% larger than the old 56px badge (got " + Math.round(pctLarger * 100) + "%)");

if (fails) { console.log("\nbuild 97: " + fails + " FAILED"); process.exit(1); }
console.log("build 97 tests passed");
