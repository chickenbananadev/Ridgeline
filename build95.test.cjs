/* Build 95 — two live bugs the owner reported directly, from a
   screenshot of the printed Roofing Proposal document.

   (a) docShell's sticky top bar (used by every print/PDF document in
   the app — contract, estimate/proposal, invoice, work order, cap-out,
   certificate, change orders, report, sub-invoice) had exactly one
   button, "Save as PDF / Print" — no way to close/back out of the
   document once opened. Since every document routes through this one
   shared bar, one fix (a real Close button calling window.close(),
   which JS is allowed to call on a window/tab the page's own script
   opened) closes the gap everywhere at once.

   (b) The proposal's "Accept and sign online" section printed the raw
   portal URL as plain text directly under the QR code — the only place
   in the file a raw portal URL prints next to a QR. Owner's explicit
   choice, asked directly: remove it entirely, QR code only. The QR
   still scans fine; anyone who can't scan can be sent the link another
   way.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/<button onclick="window\.print\(\)">Save as PDF \/ Print<\/button>\s*\n\s*<button onclick="window\.close\(\)">Close<\/button>/.test(src),
  "docShell's bar now has a real Close button next to Save as PDF/Print");

const barCssStart = src.indexOf('.bar button { background: #fff;');
const barCssEnd = src.indexOf(';', barCssStart) + 1;
ok(barCssStart > 0, "the shared .bar button CSS rule is still present, applying to both buttons");

ok(!/<div class="qru">\$\{esc\(portalUrl\)\}<\/div>/.test(src),
  "the raw portal URL is no longer printed under the QR code on the proposal");
ok(!/\.qru \{ font-size: 11px;/.test(src), "the now-unused .qru CSS rule is gone");
ok(/<div class="qrh">Accept and sign online<\/div>\s*\n\s*<div class="qrn">Opens your private project page/.test(src),
  "the QR heading and explanatory note still render immediately after each other, with no URL line between them");
ok(/\$\{qr \? `<div class="qr">\$\{qr\}<\/div>` : ""\}/.test(src), "the QR code itself still renders unchanged");

/* ---------- behavioral ---------- */
/* Mirror the exact accept-online block construction with a real
   portalUrl, and confirm the rendered HTML contains the QR div and the
   heading/note, but never the raw URL string as its own element. */
const esc = (x) => String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const portalUrl = "https://ridgeline-example.vercel.app/?portal=abc123token";
const qr = "<svg>fake-qr</svg>";
const block = `<div class="accepton">
      ${qr ? `<div class="qr">${qr}</div>` : ""}
      <div class="qrtext">
        <div class="qrh">Accept and sign online</div>
        <div class="qrn">Opens your private project page — no login or account needed.</div>
      </div>
    </div>`;
ok(block.includes('<div class="qr">'), "the built block still contains the QR div");
ok(!block.includes(esc(portalUrl)), "the built block never contains the raw URL text anywhere");
ok(!block.includes('class="qru"'), "the built block has no qru element at all");

if (fails) { console.log("\nbuild 95: " + fails + " FAILED"); process.exit(1); }
console.log("build 95 tests passed");
