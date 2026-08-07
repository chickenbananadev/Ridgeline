/* Build 100 — loading screen is always RoofStride, never a tenant's
   own logo. Build 97 already fixed the boot screen's *fallback*
   (brand.short text badge -> RoofStride mark) but still prioritized a
   tenant's own brand.logo when one was set. A tenant-isolation audit
   also found a second, previously unflagged site with the same issue:
   PasswordSetScreen (invite-acceptance / password-recovery / password-
   change), whose own non-logo fallback was a brand.short text badge,
   not RoofStride's mark either. Both now always show RoofStride's
   mark unconditionally — a tenant's own logo continues to render
   normally everywhere else in the actual signed-in app (Dashboard
   header, printed documents, Branding settings, portal snapshot).
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: boot-loading screen ---------- */
const bootStart = src.indexOf("if (booting || (liveAuth() && currentUser && !hydrated)) {");
ok(bootStart > 0, "the boot-loading screen block is still present");
const bootBlock = src.slice(bootStart, bootStart + 900);
ok(!bootBlock.includes("brand.logo"), "the boot-loading screen no longer references brand.logo at all");
ok(/<img src="\/icon-512\.png" alt="RoofStride" style=\{\{\s*\n\s*width: 73, height: 73, borderRadius: 16, objectFit: "contain", margin: "0 auto 14px", display: "block",\s*\n\s*\}\} \/>/.test(bootBlock),
  "the boot-loading screen unconditionally renders the RoofStride mark at 73px");
ok(bootBlock.includes("Loading…"), "the Loading… label is unchanged");

/* ---------- static: PasswordSetScreen ---------- */
const pwScreenStart = src.indexOf("function PasswordSetScreen");
ok(pwScreenStart > 0, "PasswordSetScreen is still present");
const pwBlock = src.slice(pwScreenStart, pwScreenStart + 1600);
ok(!pwBlock.includes("brand.logo"), "PasswordSetScreen no longer references brand.logo at all");
ok(!/\{brand\.short\}/.test(pwBlock), "PasswordSetScreen no longer falls back to a brand.short text badge");
ok(/<img src="\/icon-512\.png" alt="RoofStride" style=\{\{\s*\n\s*width: 58, height: 58, borderRadius: 15, objectFit: "contain", margin: "0 auto 12px", display: "block",\s*\n\s*\}\} \/>/.test(pwBlock),
  "PasswordSetScreen unconditionally renders the RoofStride mark at 58px");
ok(pwBlock.includes('mode === "invite" ? "Welcome — set your password"'),
  "the invite/recovery/change heading logic right after the mark is unchanged");

/* ---------- static: every other brand.logo use in the app is untouched ---------- */
/* These are all real in-app or document-generation contexts, not
   pre-hydration loading gates — a tenant's own logo should still show
   there exactly as before. */
const otherLogoSites = [
  'src={brand.logo} alt={brand.company} style={{ height: 40, maxWidth: 130,', // Dashboard header
  'const logo = brand.logo',                                                 // docShell letterhead
  'const mark = brand.logo',                                                 // proposal / agreement letterhead (2 sites share this exact text)
  'brand.logo ? (\n              <img src={brand.logo} alt="Company logo"',  // Branding settings preview
];
otherLogoSites.forEach((snippet) => ok(src.includes(snippet), `unrelated brand.logo site is untouched: ${JSON.stringify(snippet.slice(0, 40))}...`));
const markCount = (src.match(/const mark = brand\.logo/g) || []).length;
ok(markCount === 2, "both document-generation 'const mark = brand.logo' sites (proposal + agreement) are still present, untouched");

if (fails) { console.log("\nbuild 100: " + fails + " FAILED"); process.exit(1); }
console.log("build 100 tests passed");
