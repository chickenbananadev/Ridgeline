/* Build 105 — the pre-React marketing fallback flashed full-page on
   every cold load.

   index.html carries real marketing copy inside <div id="root"> so
   crawlers and link unfurlers, which read the served markup rather
   than the painted page, can index what RoofStride is. React replaces
   that subtree on mount — but on a phone over cellular the gap between
   "HTML parsed" and "React mounted" is a visible beat, so a real user
   got a full screen of headline + feature list + pricing, then the
   loading screen, then the app. Build 103 put the RoofStride mark on
   top of it to make it read as intentional; the owner's follow-up was
   that it shouldn't appear at all.

   Fix: the marketing copy moves into <noscript>. A scripting-enabled
   user agent never paints a noscript subtree, so the flash is gone by
   construction rather than by timing — but the copy is still in the
   served HTML for crawlers, and still renders for a genuinely JS-less
   visitor. What sits in #root instead is a copy of the app's OWN boot
   screen (RoofStride mark at 73px on the card background, "Loading…"
   beneath), so React mounting is a continuation of the same screen
   rather than a change of screen.

   The theme tokens, meta description and JSON-LD stay outside
   <noscript> — those are the structured signals that actually matter
   for SEO, and they were never part of the flash.
*/
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: the marketing block is inside <noscript> ---------- */
/* Two <noscript> blocks exist: a style in <head> that hides #root when
   scripting is off, and the marketing markup in <body>. Select the
   marketing one by the <main> it wraps rather than by position. */
const noscriptBlocks = html.match(/<noscript>[\s\S]*?<\/noscript>/g) || [];
const marketingBlock = noscriptBlocks.find((b) => b.includes("<main"));
ok(!!marketingBlock, "index.html has a <noscript> block wrapping the marketing <main>");
const noscript = marketingBlock || "";

ok(noscript.includes("RoofStride — the roofing CRM built for the field"),
  "the marketing H1 now lives inside <noscript>, so a scripting-enabled browser never paints it");
ok(noscript.includes("What RoofStride does"),
  "the feature list moved into <noscript> with it");
ok(noscript.includes("$119.99/mo including 10 seats"),
  "the pricing paragraph moved into <noscript> with it");

/* ---------- static: #root now holds the app's own boot screen ---------- */
const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<noscript>/);
ok(!!rootMatch, "#root is still present and now sits directly before the <noscript> block");
const root = rootMatch ? rootMatch[1] : "";

ok(/<img src="\/icon-512\.png" alt="RoofStride" width="73" height="73"/.test(root),
  "#root's pre-mount frame shows the RoofStride mark at 73px — the same asset and size as the app's own boot screen");
ok(root.includes("Loading…"),
  "#root's pre-mount frame carries the same 'Loading…' label the app's boot screen uses, so the handoff to React isn't a visible swap");
ok(/background:var\(--rl-card\)/.test(root),
  "the pre-mount frame paints the card background token, matching the boot screen's background and following the OS/user theme");
ok(/min-height:100dvh/.test(root),
  "the frame fills the visible viewport using dvh, the same unit .rl-shell uses for iOS toolbar collapse");
ok(!/<h1/.test(root) && !/\$119\.99/.test(root),
  "no marketing headline or pricing copy is left inside #root — that's the whole point of the fix");

/* ---------- static: no-JS agents don't get a permanent loading screen ---------- */
/* Found live: with scripting off, React never mounts, so #root's frame
   would sit there forever as a full-viewport "Loading…" the visitor has
   to scroll past to reach the marketing copy. A <noscript> style in
   <head> hides #root in exactly that case. */
ok(/<noscript><style>#root \{ display: none; \}<\/style><\/noscript>/.test(html),
  "a <noscript> style hides #root when scripting is disabled, so a JS-less visitor lands on the copy rather than a stuck loading screen");
ok(html.indexOf("<noscript><style>#root") < html.indexOf("</head>"),
  "that style sits in <head>, where it applies before #root is painted");

/* ---------- static: SEO signals stay OUTSIDE noscript ---------- */
const outside = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");
ok(/<script type="application\/ld\+json">/.test(outside),
  "the JSON-LD structured data stays outside <noscript> — it was never part of the flash and is what search engines actually parse");
ok(/<meta name="description"/.test(outside),
  "the meta description stays outside <noscript>");
ok(/<meta property="og:image"/.test(outside),
  "the Open Graph card tags stay outside <noscript>, so link unfurling is unaffected");

/* The copy still exists in the SERVED markup — moving it into
   <noscript> hides it from the painted page, not from a crawler
   reading the response body. */
ok(html.includes("Sales pipeline and job board for every roof from lead to paid"),
  "the crawlable feature copy is still present in the raw HTML a crawler receives");

/* ---------- behavioral: what a scripting-enabled UA actually paints ---------- */
const dom = new JSDOM(html);
const doc = dom.window.document;

/* Mirror the browser rule this fix relies on: a user agent with
   scripting enabled does not render the contents of a <noscript>
   element. Everything else in <body> is painted. */
const paintedText = (document) => {
  const body = document.body.cloneNode(true);
  body.querySelectorAll("noscript").forEach((n) => n.remove());
  return body.textContent.replace(/\s+/g, " ").trim();
};

const painted = paintedText(doc);
ok(painted.includes("Loading…"),
  "a scripting-enabled visitor paints the 'Loading…' frame before React mounts");
ok(!painted.includes("the roofing CRM built for the field"),
  "a scripting-enabled visitor never paints the marketing headline — the reported flash cannot happen");
ok(!painted.includes("What RoofStride does"),
  "…nor the feature list");
ok(!painted.includes("$119.99"),
  "…nor the pricing copy");

/* And the no-JS path still works: with scripting disabled the noscript
   subtree IS rendered, which is the fallback's actual remaining job. */
const noJsText = doc.body.textContent.replace(/\s+/g, " ").trim();
ok(noJsText.includes("the roofing CRM built for the field"),
  "with scripting disabled the marketing copy still renders — the fallback still does its job for a JS-less agent");

/* Structural: the headline must be a descendant of <noscript>, not
   merely absent from #root (e.g. moved somewhere else in the body). */
const h1 = doc.querySelector("h1");
ok(!!h1, "the marketing H1 element still exists in the document");
ok(!!h1 && h1.closest("noscript"), "the marketing H1 is a descendant of <noscript>");
ok(!!h1 && !h1.closest("#root"), "the marketing H1 is no longer inside #root");

const rootEl = doc.getElementById("root");
ok(!!rootEl, "#root still exists for React to mount into");
const rootImg = rootEl && rootEl.querySelector('img[alt="RoofStride"]');
ok(!!rootImg, "#root contains the RoofStride mark image");
ok(!!rootImg && rootImg.getAttribute("src") === "/icon-512.png",
  "#root's mark points at the same asset the app's boot screen uses, so it's already in cache when React renders its own");

if (fails) { console.log("\nbuild 105: " + fails + " FAILED"); process.exit(1); }
console.log("build 105 tests passed");
