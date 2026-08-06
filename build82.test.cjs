/* Build 82 — portal honesty fixes from the site audit.

   1. PortalReview.log() swallowed insert errors in a bare catch{}, and
      finishUnhappy() always called setDone(true) regardless — so a
      customer's private negative feedback could silently fail to save
      while they were told "someone will reach out." Nobody would.
   2. PortalThread.send() cleared the typed message before attempting
      the insert, with no feedback on failure — a customer's message
      could vanish from the input with no way to know it never sent.
   3. TabPortal.publishPortal()'s demo-mode branch never called
      navigator.clipboard.writeText, despite the button reading
      "Update & copy link" on every path, live database or not.
   4. PublicPortal's "Link unavailable" screen appended the same
      generic "contact your contractor for a new one" to both a
      missing-database-connection error (a site config issue no new
      link fixes) and an invalid/revoked token (which a new link does
      fix) — now each gets its own matching hint.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- 1. PortalReview ---------- */
const prStart = src.indexOf("function PortalReview(");
const prEnd = src.indexOf("\nfunction ", prStart + 10);
const prSrc = src.slice(prStart, prEnd > 0 ? prEnd : prStart + 6000);
ok(/const \{ error \} = await db\.from\("crm_portal_requests"\)\.insert\(row\);\s*return !error;/.test(prSrc),
  "PortalReview.log() returns whether the insert actually succeeded, instead of swallowing the error");
ok(!/catch \(e\) \{ \/\* non-fatal \*\/ \}/.test(prSrc), "the old bare catch{} that discarded the error is gone");
ok(/const finishUnhappy = async \(\) => \{[\s\S]*?if \(!ok\) \{ setLogErr\(true\); return; \}/.test(prSrc),
  "finishUnhappy() does not call setDone(true) when the write failed — the private feedback IS the deliverable");
ok(/\{logErr && <Callout tone="red" label="Couldn't send that">/.test(prSrc),
  "a failed private-feedback send shows a real error, not a silent false 'thank you'");
ok(/const finishHappy = async \(\) => \{[\s\S]*?setDone\(true\); if \(!ok\) setLogErr\(true\);\s*if \(link\) window\.open/.test(prSrc),
  "finishHappy() still opens the Google review link even if the internal log fails — that's the real deliverable on the happy path");

/* ---------- 2. PortalThread ---------- */
const ptStart = src.indexOf("function PortalThread(");
const ptEnd = src.indexOf("\nfunction ", ptStart + 10);
const ptSrc = src.slice(ptStart, ptEnd > 0 ? ptEnd : ptStart + 6000);
ok(/const \[sendErr, setSendErr\] = useState\(""\);/.test(ptSrc), "PortalThread tracks a send error");
ok(/if \(!db\) \{ setSendErr\("Not connected — try again in a moment\."\); return; \}/.test(ptSrc),
  "a missing db connection now surfaces a real error instead of silently doing nothing");
ok(/if \(error\) \{ setSendErr\("Couldn't send that message\. Try again\."\); return; \}\s*setTxt\(""\);/.test(ptSrc),
  "the typed message is only cleared AFTER a confirmed successful insert, not before attempting it");
ok(/\{sendErr && <div style=\{\{ fontSize: 12, color: "#B42318", marginTop: 8 \}\}>\{sendErr\}<\/div>\}/.test(ptSrc),
  "a send error renders visibly near the message input");

/* ---------- 3. TabPortal.publishPortal ---------- */
const tpStart = src.indexOf("function TabPortal(");
const tpEnd = src.indexOf("\nfunction ", tpStart + 10);
const tpSrc = src.slice(tpStart, tpEnd > 0 ? tpEnd : tpStart + 8000);
ok(/if \(!db\) \{\s*mut\(\(j\) => \(\{ \.\.\.j, portalToken: tok \}\)\);\s*\/\*[\s\S]*?const copied = navigator\.clipboard \? await navigator\.clipboard\.writeText\(portalUrl\(tok\)\)\.then\(\(\) => true, \(\) => false\) : false;/.test(tpSrc),
  "the demo-mode (no db) branch now actually copies the link, matching what the 'Update & copy link' button claims");
ok(/toast\(copied\s*\? "Link copied — it goes live once the app is connected to the database"\s*: "Link created — it goes live once the app is connected to the database"\);/.test(tpSrc),
  "the demo-mode toast reflects whether the copy actually succeeded");

/* ---------- 4. PublicPortal error screen ---------- */
const ppStart = src.indexOf("function PublicPortal(");
const ppEnd = src.indexOf("\nfunction ", ppStart + 10);
const ppSrc = src.slice(ppStart, ppEnd > 0 ? ppEnd : ppStart + 4000);
ok(/err: "This link needs a live connection\.",\s*hint: "This looks like a site configuration issue, not something a new link would fix/.test(ppSrc),
  "the no-database-connection error gets a hint that does NOT suggest a new link would help");
ok(/err: "This link isn't valid or has been turned off\.",\s*hint: "Please contact your contractor for a new one\."/.test(ppSrc),
  "the invalid/revoked-token error keeps the 'get a new link' advice, since that's the actual fix");
ok(/\{state\.err\} \{state\.hint\}/.test(ppSrc), "the error screen renders the matched hint next to the error, not a blanket sentence");

if (fails) { console.log("\nbuild 82: " + fails + " FAILED"); process.exit(1); }
console.log("build 82 tests passed");
