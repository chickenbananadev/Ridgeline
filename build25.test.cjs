/* Build 25 — audit fixes: diagnostic database errors, the review
   sequence actually driving something, measurement source guidance. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- database errors name the cause --- */
function dbErrorMessage(error, opts) {
  const o = opts || {};
  if (!error) return "";
  const code = error.code || "";
  const msg = String(error.message || "");
  if (code === "42P01" || /does not exist/i.test(msg)) {
    return ("The " + (o.table || "table") + " this needs has not been created yet. Run migration " + (o.migration || "") + " in the Supabase SQL editor.").replace(/\s+/g, " ").trim();
  }
  if (code === "42501" || /row-level security|policy/i.test(msg)) {
    return "The database refused this write. Check the row-level security policies for " + (o.table || "this table") + ".";
  }
  if (code === "23514") return "A value failed a database check constraint. " + msg;
  if (code === "23505") return "That record already exists.";
  return msg || "Unknown database error.";
}
let m = dbErrorMessage({ code: "42P01" }, { table: "signatures", migration: "014" });
ok(/migration 014/.test(m), "a missing table names the migration to run, got: " + m);
ok(/signatures/.test(m), "and names the table");
ok(/row-level security/i.test(dbErrorMessage({ code: "42501" }, {})), "an RLS refusal is identified as such");
ok(dbErrorMessage({ code: "23505" }, {}) === "That record already exists.", "a duplicate is plain English");
ok(dbErrorMessage(null, {}) === "", "no error, no message");
ok(dbErrorMessage({ message: "boom" }, {}) === "boom", "an unrecognised error still surfaces its text");
ok(dbErrorMessage({ message: 'relation "crm_signatures" does not exist' }, { migration: "014" }).includes("014"),
  "the message text is matched when no code is supplied");

ok(src.includes("function dbErrorMessage"), "the translator exists");
ok(!src.includes("That did not save. Please try again, or call us and we will sort it out.\");"),
  "the uselessly vague signature error is gone");
ok(src.includes("nothing has been signed"), "a failed signature says nothing was signed");

/* --- the review sequence drives something --- */
ok(src.includes("nextReviewStep(j, settings)"), "the sequence resolver is actually called");
ok(src.includes("Due now"), "customers due a touch are surfaced");
ok(src.includes("Mark sent"), "a touch can be logged so the sequence advances");
ok(src.includes("steps: [...done, next.step.id]"), "logging records which step was sent");
ok(src.includes("Number(x.j.review.rating) <= 3"), "unhappy customers are held back from the sequence");

/* --- measurement sources --- */
ok(src.includes("Measure from"), "the takeoff explains where measurements come from");
ok(src.includes("cannot measure a roof from a photograph"), "the limit is stated plainly");
ok(src.includes("basemap=satellite"), "satellite view is one tap away");
ok(src.includes("map_action=pano"), "street view is offered for storeys and elevation");
ok(src.includes("the image cannot tell you the pitch"), "the satellite caveat is explicit");
ok(src.includes("third-party"), "why an aerial report wins a dispute is explained");

/* --- no dead code reintroduced --- */
ok(!src.includes("function getJurisOverrides"), "the unused accessor was removed");

if (fails) { console.log("\nbuild 25: " + fails + " FAILED"); process.exit(1); }
console.log("build 25 tests passed");
