/* Build 75 — three live-reported portal bugs.

   1. Customer signing (estimate/contract/change order) was rejected by
      Postgres RLS on every attempt, regardless of device. Root cause,
      confirmed against the live database (project wkvcsgzlsdidysoyzcwm):
      migration 018 correctly closed crm_portal's direct anon SELECT to
      stop enumeration, but 014's crm_signatures policies still validated
      a token by querying crm_portal directly in an EXISTS subquery —
      which is itself subject to crm_portal's RLS, and after 018 has no
      policy granting anon any row. The EXISTS always evaluated to false,
      so every customer signature insert (and every read of what's
      already signed) failed regardless of doc type. Migration 025 moves
      the check into a SECURITY DEFINER function (the same pattern 018
      already established for reads) and was applied directly to the
      live project — confirmed live: portal_token_valid() returns true
      for a real token+job and false for a bogus one, as the anon role.
   2. The portal header/preview said "Your roofing project" always,
      even guessing from a narrow keyword list — wrong for jobs doing
      siding, gutters, or anything the guesser didn't recognize. Now
      just "Your project" in both the live portal header and the
      internal "Portal preview" mirror on the job's Client portal tab.
   3. The Sign section was labelled "Documents to sign" — renamed to
      "Agreements & signatures" for clearer language, per request.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- migration file ---------- */
const migPath = path.join(__dirname, "supabase/migrations/025_fix_signature_portal_check.sql");
ok(fs.existsSync(migPath), "a migration exists for the signature RLS fix");
const migSrc = fs.existsSync(migPath) ? fs.readFileSync(migPath, "utf8") : "";
ok(/create or replace function portal_token_valid/.test(migSrc),
  "portal_token_valid() is defined — the same SECURITY DEFINER pattern 018 used for reads");
ok(/security definer/.test(migSrc), "the function bypasses crm_portal's RLS internally rather than depending on a direct anon SELECT");
ok(/grant execute on function portal_token_valid\(text, text\) to anon, authenticated;/.test(migSrc),
  "anon can actually call it — a SECURITY DEFINER function is still gated by EXECUTE privilege");
ok(/create policy sig_insert_customer on crm_signatures for insert to anon[\s\S]{0,200}portal_token_valid\(portal_token, job_id\)/.test(migSrc),
  "sig_insert_customer now checks the function instead of a direct crm_portal subquery");
ok(/create policy sig_read_portal on crm_signatures for select to anon[\s\S]{0,100}portal_token_valid\(portal_token\)/.test(migSrc),
  "sig_read_portal (loading what's already signed) gets the same fix");
/* The function body itself legitimately does `select exists (select 1
   from crm_portal ...)` — that's fine, it's wrapped in SECURITY DEFINER
   now, not a per-row RLS policy subquery. What must NOT exist is a
   `create policy` whose check still queries crm_portal directly. */
ok(!/create policy[\s\S]{0,300}exists \(\s*select 1 from crm_portal/i.test(migSrc),
  "no policy in this migration still does the broken direct-subquery check");

/* ---------- DEPLOY.md ---------- */
const deploySrc = fs.readFileSync(path.join(__dirname, "DEPLOY.md"), "utf8");
ok(/Could not sign.*row-level security/.test(deploySrc), "DEPLOY.md names the exact symptom, so a search for it finds the fix");
ok(/migration `025`/.test(deploySrc), "DEPLOY.md points at migration 025 specifically");

/* ---------- portal wording ---------- */
ok(!/Your \{d\.projectType \|\| "roofing"\} project/.test(src), "the live portal header no longer guesses a trade name");
ok(!/Your \{projectNoun\(job\)\} project/.test(src), "the internal 'Portal preview' mirror no longer guesses either");
ok((src.match(/>Your project</g) || []).length >= 2,
  "both the live portal header and its internal preview now say the same neutral 'Your project'");
ok(!/projectType: projectNoun\(job\)/.test(src), "the now-unused projectType field was removed from the portal data payload, not left dead");
ok(/function projectNoun\(job\)/.test(src), "projectNoun itself stays — still used for change-order scope text");

/* ---------- sign section label ---------- */
ok(!/\["sign", "Documents to sign"\]/.test(src), "the old label is gone from PORTAL_SECTIONS");
ok(/\["sign", "Agreements & signatures"\]/.test(src), "PORTAL_SECTIONS carries the new label");
ok(/Agreements & signatures\s*<\/CardTitle>/.test(src), "the Sign card's own title matches");

if (fails) { console.log("\nbuild 75: " + fails + " FAILED"); process.exit(1); }
console.log("build 75 tests passed");
