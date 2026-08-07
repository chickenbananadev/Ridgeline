/* Build 103 — deploy builds 96-102 to production, and fix two real
   bugs found while investigating why the owner still saw the old "YC"
   loading badge live: index.html's pre-React crawlable fallback (both
   its visible <main> copy and its JSON-LD structured data) still
   quoted the OLD pricing ($49.99 base / $169.99 unlimited), never
   updated when build 99 changed PRODUCT to the real $119.99/$59.99
   figures — this file isn't scanned by anything that touches
   ridgeline.jsx, so it silently drifted.

   Also: the owner described this pre-mount screen itself as "the
   glitched what is RoofStride screen" — a real, if brief, flash of
   unbranded-looking marketing copy before React mounts and replaces
   it. Adding the RoofStride mark at the top makes it read as an
   intentional branded splash instead of a jarring flash of a
   different-looking page, without touching the actual crawlable
   marketing content search engines index.
*/
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: visible fallback pricing is current ---------- */
/* Build 106 reintroduced a real Unlimited tier ($199.99/mo, no seat
   cap) alongside the base plan, replacing the $59.99/20-seat add-on
   this file originally asserted. The specific figures below are
   re-verified by build106.test.cjs; these checks only confirm the old,
   now-wrong numbers didn't survive that change. */
ok(html.includes("$119.99/mo including 10 seats"), "the crawlable fallback's visible pricing paragraph shows the real base price/seat count");
ok(!html.includes("$49.99"), "the old $49.99 base price is gone from index.html entirely");
ok(!html.includes("$169.99"), "the old $169.99 unlimited price is gone from index.html entirely");
ok(!html.includes("Team plan $49.99"), "the old 'Team plan' copy is gone");
ok(!html.includes("(20 seats max)"), "the old 20-seat hard cap is gone — Unlimited has no seat cap at all now");

/* ---------- static: JSON-LD structured data matches ---------- */
const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
ok(!!ldMatch, "the JSON-LD structured-data script block is still present");
const ld = ldMatch ? JSON.parse(ldMatch[1]) : null;
const app = ld && ld["@graph"] && ld["@graph"].find((n) => n["@type"] === "SoftwareApplication");
ok(!!app, "the SoftwareApplication node exists in the structured data");
ok(app && Array.isArray(app.offers) && app.offers.some((o) => o.price === "119.99"),
  "the structured-data offers still include the real $119.99 base price");

/* ---------- static: branded splash, SEO content unchanged otherwise ---------- */
ok(/<img src="\/icon-512\.png" alt="RoofStride" width="56" height="56"/.test(html),
  "the RoofStride mark now appears at the top of the pre-mount fallback, matching the app's own loading-screen branding");
ok(html.includes("RoofStride — the roofing CRM built for the field"), "the real H1 marketing copy is untouched");
ok(html.includes("What RoofStride does"), "the real feature-list section is untouched");
/* Build 105 moved this marketing block into <noscript> (it was flashing
   full-page on cold loads) and rewrote the comment above it to explain
   that placement. The comment's job is unchanged — say why the markup
   exists at all — so assert on that meaning rather than the old wording. */
const flatHtml = html.replace(/\s+/g, " ");
ok(flatHtml.includes("crawlers and link unfurlers — which read the served markup, not the painted page"),
  "the explanatory comment still records why this markup exists: crawlers read the served HTML, not the painted page");

if (fails) { console.log("\nbuild 103: " + fails + " FAILED"); process.exit(1); }
console.log("build 103 tests passed");
