/* Build 129 — the door itself: who lives here, what was said, what
   the weather did to this roof, and turning a good conversation into
   a job.

   Build 128 gave a rep a map and a disposition per door. That is the
   canvassing half. This is the selling half, and four decisions in it
   are deliberate:

   1. KNOCK HISTORY IS READ ONLY. It is the part of the record that
      has to be trustworthy — "she said come back after six" is worth
      more than the current status, and pins are shared, so an
      editable history would let one rep rewrite what a teammate
      reported. Rendered newest-first, with no edit control anywhere.

   2. STORM HISTORY IS THE SAME ENGINE AS THE CLAIM TAB. A hail size
      quoted on a doorstep has to be the same figure that backs the
      claim three weeks later; two implementations would eventually
      disagree, and the homeowner would be the one to notice.

   3. CONVERTING REUSES createLead. A canvassed lead has to be
      structurally identical to one typed into the intake form — same
      defaults, same commission rate off the seat, same seeded task —
      or half the app quietly mis-handles doors. So createLead gained
      an options argument rather than the pin path assembling its own
      job object.

   4. CONVERTING DOES NOT NAVIGATE AWAY, and does NOT fabricate
      consent. A rep converting a door wants to keep knocking, not be
      thrown onto the job screen mid-street. And standing on a porch
      is not a timestamped opt-in to text or email — recording one
      that never happened is what matters when a TCPA complaint
      arrives. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- the sheet exists and carries the door's record ---------- */
ok(/function CanvassPinSheet\(\{ pin, statuses, users, onClose, onSave, onConvert, onOpenJob, toast \}\)/.test(src),
  "CanvassPinSheet exists with the expected props");
ok(/placeholder="Best time to come back"/.test(src), "prospect details include when to come back");
ok(/onChange=\{\(e\) => set\("phone"\)\(formatPhone\(e\.target\.value\)\)\}/.test(src),
  "the phone field reuses the app's own formatter rather than storing raw keystrokes");
ok(/This is what the next person at this door reads\./.test(src),
  "the notes field says who it is actually for — pins are shared");

/* ---------- history is read-only, newest first ---------- */
ok(/const hist = \[\.\.\.\(pin\.history \|\| \[\]\)\]\.reverse\(\);/.test(src),
  "history renders newest-first, and copies before reversing rather than mutating the pin's own array");
const hStart = src.indexOf("<Field label={`Knock history (${hist.length})`}");
ok(hStart !== -1, "the knock history has its own section");
const hSrc = src.slice(hStart, src.indexOf("</Field>", hStart));
ok(!/<input|<textarea|onChange=/.test(hSrc),
  "there is NO edit control anywhere in the history — a rep cannot rewrite what a teammate reported");
ok(/it is the record of what people were actually told/.test(src),
  "and the hint says why it is not editable");
ok(/Nobody has knocked this door yet\./.test(src), "an unknocked door says so rather than rendering an empty box");

/* ---------- storm history reuses the claim engine ---------- */
ok(/<StormLookup job=\{\{ lat: pin\.lat, lng: pin\.lng, address: pin\.address, zip: "" \}\}/.test(src),
  "the pin's storm history is the same StormLookup the claim tab uses, not a second implementation");
ok(/dol=\{p\.stormDate \|\| ""\} onPick=\{\(d\) => set\("stormDate"\)\(d\)\}/.test(src),
  "picking a storm date records it on the pin, so the conversation is remembered");

/* ---------- conversion ---------- */
ok(/const createLead = \(f, opts = \{\}\) => \{/.test(src),
  "createLead takes options — the canvass path needs to stay put and learn the new job's id");
ok(/if \(!opts\.stayPut\) \{ setOpenJobId\(id\); setNav\("jobs"\); \}/.test(src),
  "the navigation is opt-out, so the form path is unchanged and canvassing stays on the map");
ok(/if \(opts\.onCreated\) opts\.onCreated\(job\);/.test(src), "the caller learns which job was created");
const cvStart = src.indexOf("const createLeadFromCanvassPin = (pin) => new Promise((resolve) => {");
ok(cvStart !== -1, "createLeadFromCanvassPin exists at the root");
const cvSrc = src.slice(cvStart, src.indexOf("const deleteCrew", cvStart));
ok(/createLead\(\{/.test(cvSrc),
  "conversion goes through createLead, so a canvassed lead is structurally identical to a typed one");
ok(/leadSource: "Door knock",/.test(cvSrc), "the lead is attributed to door knocking, which is the point of tracking it");
ok(/smsConsent: false, emailConsent: false,/.test(cvSrc),
  "consent is NEVER fabricated from a doorstep conversation — a porch is not a timestamped opt-in");
ok(/lat: pin\.lat, lng: pin\.lng,/.test(cvSrc), "the pin's coordinates carry across, so the job knows where it is");
ok(/\{ stayPut: true, toast: "Lead created from the door", onCreated: resolve \}/.test(cvSrc),
  "conversion stays on the map and resolves with the job");
ok(/await onSave\(\{ prospect: p, notes \}\);\s*\n\s*await onConvert\(\);/.test(src),
  "the sheet saves before converting — otherwise a name just typed in would not reach the new lead");
ok(/const job = await onCreateLeadFromPin\(detailPin\);\s*\n\s*if \(job\) await savePin\(\{ \.\.\.detailPin, job_id: job\.id \}\);/.test(src),
  "the pin is pointed at the job it became, and only if a job was actually created");
ok(/\{pin\.job_id && <Chip tone="green">Became a job<\/Chip>\}/.test(src), "a converted pin says so");
ok(/\{onConvert && !pin\.job_id && \(/.test(src),
  "the convert control disappears once converted — no accidental duplicate jobs from the same door");

/* ================= behavioral: address splitting ================= */
/* The reverse geocoder returns one formatted line; the job wants
   street/city/state/zip as separate fields. */
function splitAddress(address) {
  const bits = String(address || "").split(",").map((s) => s.trim());
  const stateZip = (bits[2] || "").split(/\s+/);
  return { street: bits[0] || address || "", city: bits[1] || "", stateSel: stateZip[0] || "", zip: stateZip[1] || "" };
}
let a = splitAddress("412 Oak St, Naperville, IL 60540");
ok(a.street === "412 Oak St" && a.city === "Naperville" && a.stateSel === "IL" && a.zip === "60540",
  "a normal formatted address splits into the job's four fields");
a = splitAddress("412 Oak St");
ok(a.street === "412 Oak St" && a.city === "" && a.zip === "",
  "a bare street still populates street rather than losing it");
a = splitAddress("");
ok(a.street === "" && a.city === "", "a pin with no address at all doesn't crash the conversion");
a = splitAddress("1600 Pennsylvania Ave NW, Washington, DC 20500");
ok(a.stateSel === "DC" && a.zip === "20500", "state and zip separate correctly when both are present");

/* ================= behavioral: name splitting ================= */
function splitName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] || "", last: parts.slice(1).join(" ") || "" };
}
ok(splitName("Dana Reed").first === "Dana" && splitName("Dana Reed").last === "Reed", "a two-part name splits");
ok(splitName("Maria del Carmen Ruiz").last === "del Carmen Ruiz",
  "everything after the first word is the surname — never truncate someone's name to two parts");
ok(splitName("Dana").first === "Dana" && splitName("Dana").last === "",
  "a first name only is fine — a doorstep rarely gives you both");
ok(splitName("").first === "" && splitName(null).first === "",
  "no name at all still converts; the address is the job's identity anyway");
ok(splitName("  Dana   Reed  ").first === "Dana" && splitName("  Dana   Reed  ").last === "Reed",
  "stray whitespace from a phone keyboard doesn't produce empty name parts");

/* ================= behavioral: history ordering ================= */
function historyNewestFirst(pin) { return [...(pin.history || [])].reverse(); }
const PIN = { history: [
  { at: "2026-08-01T18:00:00Z", status: "not_home", by: "Jacob Henderson" },
  { at: "2026-08-04T23:10:00Z", status: "callback", by: "Drew Klass" },
  { at: "2026-08-07T17:30:00Z", status: "appointment", by: "Jacob Henderson" },
] };
const shown = historyNewestFirst(PIN);
ok(shown[0].status === "appointment" && shown[2].status === "not_home",
  "the most recent visit is at the top, where a rep about to knock will actually look");
ok(PIN.history[0].status === "not_home",
  "and the pin's own array is untouched — reverse() mutates, so the copy matters");
ok(historyNewestFirst({}).length === 0, "a pin with no history renders an empty list, not a crash");

/* ================= behavioral: the notes carried into a lead ================= */
function conversionNotes(pin) {
  const p = pin.prospect || {};
  return [pin.notes, p.bestTime ? `Best time: ${p.bestTime}` : "",
    p.stormDate ? `Storm date discussed: ${p.stormDate}` : ""].filter(Boolean).join("\n");
}
ok(conversionNotes({ notes: "Roof looks beat up", prospect: { bestTime: "after 6", stormDate: "2026-05-07" } })
  === "Roof looks beat up\nBest time: after 6\nStorm date discussed: 2026-05-07",
  "everything learned at the door travels into the lead's notes");
ok(conversionNotes({ prospect: {} }) === "", "a door with nothing recorded produces empty notes, not a wall of blank labels");
ok(conversionNotes({ notes: "", prospect: { stormDate: "2026-05-07" } }) === "Storm date discussed: 2026-05-07",
  "the storm date alone still carries — it is the whole reason the claim gets filed");

/* ================= behavioral: convert-once ================= */
function canConvert(pin, hasHandler) { return !!hasHandler && !pin.job_id; }
ok(canConvert({ job_id: null }, true) === true, "an unconverted pin offers conversion");
ok(canConvert({ job_id: "j1" }, true) === false,
  "a converted pin does NOT offer it again — two jobs from one door is a duplicate in the pipeline");
ok(canConvert({ job_id: null }, false) === false, "with no handler wired the control is absent rather than dead");

if (fails) { console.log("\nbuild 129: " + fails + " FAILED"); process.exit(1); }
console.log("build 129 tests passed");
