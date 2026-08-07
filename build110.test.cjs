/* Build 110 — billing-contact setting (part 1 of the sub/cap-out
   payment-ready notification feature).

   The owner asked: when a sub payout or a job's cap-out is ready to
   pay, how does the person who handles billing find out? Locked
   decisions: a designated billing-contact user, notified automatically
   (in-app + email/SMS backstop), not every admin and not a shared
   inbox. This build adds the setting itself — brand.billingContactUserId
   — plus a picker in BrandingEditor. No sends are wired yet (build 111).

   brand.billingContactUserId round-trips through crm_brand the same
   way every other brand field already does (useBrandSync persists the
   whole object) — no migration needed.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/billingContactUserId: "",\s*\n\};/.test(src),
  "DEFAULT_BRAND now has a billingContactUserId field (defaults to unset)");
ok(/function BrandingEditor\(\{ brand, setBrand, onBack, toast, brandErr = "", currentUser = null, users = \[\] \}\)/.test(src),
  "BrandingEditor now accepts a users prop to populate the billing-contact picker");
ok(/<BrandingEditor brand=\{brand\} setBrand=\{setBrand\} onBack=\{\(\) => setNav\("more"\)\} toast=\{toast\} brandErr=\{brandErr\} currentUser=\{liveUser\} users=\{users\} \/>/.test(src),
  "the root App component threads the real users list into BrandingEditor");
ok(/Field label="Billing contact"/.test(src),
  "a Billing contact field exists in BrandingEditor");
ok(/value=\{brand\.billingContactUserId \|\| ""\} onChange=\{set\("billingContactUserId"\)\}/.test(src),
  "the picker is bound to brand.billingContactUserId via the same set() helper every other field uses");
ok(/users\.filter\(\(u\) => u\.active !== false\)\.map\(\(u\) => \(/.test(src),
  "the picker only lists active users, matching TeamManager's own active-seat convention");
ok(/No one selected — falls back to an admin/.test(src),
  "the picker's empty state explains the fallback behavior instead of silently allowing an unset contact");

/* ---------- behavioral: mirror the picker's filter + option-building logic ---------- */
const SEED_USERS = [
  { id: "u1", name: "Jacob Henderson", role: "admin", active: true },
  { id: "u2", name: "Drew Klass", role: "rep", active: true },
  { id: "u5", name: "Former Employee", role: "rep", active: false },
];
const ROLES = [
  { id: "admin", label: "Admin" },
  { id: "rep", label: "Sales rep" },
];
const options = SEED_USERS.filter((u) => u.active !== false).map((u) => ({
  id: u.id,
  text: `${u.name}${u.role ? ` — ${(ROLES.find((r) => r.id === u.role) || {}).label || u.role}` : ""}`,
}));
ok(options.length === 2, "an inactive user is excluded from the billing-contact picker's options");
ok(options.some((o) => o.id === "u1" && o.text === "Jacob Henderson — Admin"),
  "the picker labels each option with the user's real role, not just their name");
ok(!options.some((o) => o.id === "u5"), "the deactivated seat never appears as a selectable billing contact");

if (fails) { console.log("\nbuild 110: " + fails + " FAILED"); process.exit(1); }
console.log("build 110 tests passed");
