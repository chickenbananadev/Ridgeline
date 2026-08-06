/* Build 77 — the demo-mode / sync-error banners were position:fixed
   siblings rendered AFTER .rl-scroll closed, with no compensating top
   padding on .rl-scroll. That put them on top of the first ~90px of
   every screen, silently swallowing real taps there — the SubHeader
   back button and every right-side header action button on Calendar,
   Job Board, Team & seats, and by construction every other screen using
   the same shell. Fixed by making both banners in-flow flexShrink:0
   children at the TOP of .rl-shell, ahead of .rl-scroll, so .rl-scroll's
   flex:1 shrinks around them automatically — same pattern the bottom
   nav in the same shell already uses. This was confirmed live via
   document.elementFromPoint() resolving to the banner instead of the
   button, and a real (non-JS-dispatched) Playwright click producing no
   effect — the audit's highest-severity finding, and it went first
   because every other screen's Playwright verification was unreliable
   until this landed. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
const shellStart = src.indexOf('<div className="rl-shell"');
const scrollStart = src.indexOf('<div className="rl-scroll"');
ok(shellStart > 0 && scrollStart > shellStart, "rl-shell opens before rl-scroll, as expected");
const shellHeader = src.slice(shellStart, scrollStart);

ok(/!liveDb\(\) &&/.test(shellHeader), "the demo-mode banner condition now lives before .rl-scroll opens");
ok(/\(syncErr \|\| brandErr\) &&/.test(shellHeader), "the sync-error banner condition now lives before .rl-scroll opens");
ok(!/position: "fixed", top: 0, left: 0, right: 0/.test(shellHeader),
  "neither banner in the pre-scroll header block is position:fixed anymore");
ok((shellHeader.match(/flexShrink: 0,/g) || []).length >= 2,
  "both banners are flexShrink:0 in-flow children instead");

/* Nothing should still emit the old fixed-top-banner shape anywhere —
   confirms this wasn't just duplicated rather than moved. */
ok(!/position: "fixed", top: 0, left: 0, right: 0, zIndex: 95/.test(src), "the old fixed demo-mode banner block is gone");
ok(!/position: "fixed", top: 0, left: 0, right: 0, zIndex: 90/.test(src), "the old fixed sync-error banner block is gone");

/* Sheets/toasts must NOT have been swept up in this change — they are
   correctly position:fixed (that's what lets them cover the bottom nav
   too), and the fix must not have touched that. */
ok(/position: "fixed", inset: 0, zIndex: 60/.test(src), "the Sheet component itself is still position:fixed (unaffected)");
ok(/position: "fixed", bottom: 96/.test(src), "the Toast component itself is still position:fixed (unaffected)");

if (fails) { console.log("\nbuild 77: " + fails + " FAILED"); process.exit(1); }
console.log("build 77 tests passed");
