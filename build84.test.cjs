/* Build 84 — swap the SMS backend from Twilio to EZ Texting.

   Twilio's A2P 10DLC campaign registration kept failing for this
   account. EZ Texting was chosen because the owner already has an
   approved account there, and because it sends over a shared short
   code by default — a different carrier category that does not go
   through 10DLC campaign review, which is almost certainly why it
   cleared when Twilio's didn't. Every automated send in the app funnels
   through one function, deliverMessage() -> auth.sendSms() -> the
   send-sms Edge Function, so the swap is contained to that one file's
   HTTP call plus the operational docs that describe it — nothing above
   the Edge Function boundary changes, confirmed by the fact this test
   needs zero changes to any other build's assertions.

   The exact EZ Texting request/response shape could not be confirmed
   against developers.eztexting.com directly — this sandbox's network
   policy blocked it, the same constraint hit earlier researching
   per-state legal statutes — so send-sms/index.ts is built from
   cross-checked third-party integration guides, with that limitation
   stated explicitly in the file's own header comment and in the
   SetupKeys deploy step, not hidden. This test asserts the file is
   honest about that, not that the exact wire format is correct
   (unverifiable without live network access to EZ Texting's docs).
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const smsFn = fs.readFileSync(path.join(__dirname, "supabase/functions/send-sms/index.ts"), "utf8");
const deployMd = fs.readFileSync(path.join(__dirname, "DEPLOY.md"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- no stale/operational Twilio references remain ---------- */
ok(!/Twilio|TWILIO/.test(src), "ridgeline.jsx has no remaining Twilio references");
/* The Edge Function's own header and DEPLOY.md's §7 both explain the
   swap by name — that's documentation of why the change happened, not
   a live operational reference telling someone to configure Twilio. No
   TWILIO_* secret name or Twilio setup instruction may remain, though. */
ok(/Was Twilio\. Switched because/.test(smsFn), "the Edge Function documents why it moved off Twilio");
ok(!/TWILIO_/.test(smsFn), "no TWILIO_* secret name remains in the Edge Function");
ok(/this project's original Twilio\s*number never cleared review/.test(deployMd),
  "DEPLOY.md explains why EZ Texting was chosen, by name, same as the Edge Function's own comment");
ok(!/TWILIO_/.test(deployMd), "no TWILIO_* secret name remains in DEPLOY.md");
ok(!/twilio console|Twilio console/i.test(deployMd), "no Twilio setup instruction remains in DEPLOY.md");

/* ---------- send-sms/index.ts: real EZ Texting request shape, contract preserved ---------- */
ok(/EZTEXTING_API_KEY/.test(smsFn), "the function reads an EZTEXTING_API_KEY secret");
ok(/https:\/\/api\.eztexting\.com\/v1\/sms/.test(smsFn), "posts to EZ Texting's REST endpoint");
ok(/Authorization: `Bearer \$\{apiKey\}`/.test(smsFn), "authenticates with a bearer token");
ok(/PhoneNumbers: \[e164\.replace\(\/\^\\\+\/, ""\)\]/.test(smsFn), "sends the recipient as a PhoneNumbers array");
ok(/Message: String\(body\)\.slice\(0, 1500\)/.test(smsFn), "sends the message body under the Message field");
/* The function's own contract to the rest of the app must be unchanged —
   this is what makes the swap contained to one file. */
ok(/const \{ to, body, jobId \} = await req\.json\(\);/.test(smsFn), "still accepts {to, body, jobId} — unchanged input contract");
ok(/return json\(\{ ok: true, sid: messageId, status \}\);/.test(smsFn), "still returns an {ok, sid, status}-shaped response — unchanged output contract");
/* Auth, active-seat check, and the server-side consent gate are the
   security-critical parts of this file — confirm the swap didn't touch
   them. */
ok(/if \(!user\) return json\(\{ error: "Not signed in" \}, 401\);/.test(smsFn), "sanity check: the signed-in check is untouched");
ok(/if \(!me \|\| !me\.active\) return json\(\{ error: "Account is not active" \}, 403\);/.test(smsFn), "sanity check: the active-seat check is untouched");
ok(/No SMS consent on file for this customer/.test(smsFn), "sanity check: the server-side consent gate is untouched");

/* ---------- honesty about the unverified wire format ---------- */
ok(/blocked outbound access to\s*\/\/ developers\.eztexting\.com/.test(smsFn) || /blocked outbound access to$/m.test(smsFn) || /network policy blocked/.test(smsFn),
  "the file states plainly that the exact API shape wasn't confirmed against EZ Texting's own docs");
ok(/verify this against EZ Texting's own docs before relying/i.test(smsFn),
  "the file tells whoever deploys it to verify before trusting it in production");

/* ---------- ridgeline.jsx: SetupKeys descriptor + provider labels ---------- */
ok(/id: "eztexting", label: "Texting \(EZ Texting\)", secret: true,/.test(src), "SetupKeys' texting entry is now EZ Texting, not Twilio");
ok(/keyName: "EZTEXTING_API_KEY",/.test(src), "SetupKeys names the real single secret this function actually reads");
ok(/network policy blocked developers\.eztexting\.com directly\./.test(src),
  "the in-app setup steps also carry the same honesty about the unverified request shape, not just the code comment");
ok(/provider: "EZ Texting", number: addr\.trim\(\) \}/.test(src), "connecting SMS in the admin panel now records EZ Texting as the provider");

/* ---------- DEPLOY.md: texting gets its own full section, like every other integration ---------- */
ok(/## 7\. Texting — EZ Texting/.test(deployMd), "texting has its own numbered section, not a line buried in a generic 'everything else' list");
ok(/supabase secrets set EZTEXTING_API_KEY=\.\.\.\s*# app\.eztexting\.com → Settings → Integrations \/ Developer API/.test(deployMd),
  "DEPLOY.md gives the real dashboard location for the secret, not just its name");
ok(/supabase functions deploy send-sms/.test(deployMd), "DEPLOY.md gives the real deploy command");
ok(/network policy blocked outbound\s*access to `developers\.eztexting\.com`/.test(deployMd),
  "DEPLOY.md carries the same unverified-wire-format honesty as the code comment and the in-app setup steps");
ok(/checks `crm_jobs\.data\.consent\.sms\.granted`/.test(deployMd), "DEPLOY.md documents the server-side consent gate, not just how to turn sending on");

if (fails) { console.log("\nbuild 84: " + fails + " FAILED"); process.exit(1); }
console.log("build 84 tests passed");
