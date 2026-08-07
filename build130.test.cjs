/* Build 130 — working the territory: filters, a list view, a
   scoreboard that counts honestly, rep ownership, and the
   company-editable disposition list the owner asked for.

   The decision that matters most here is the DENOMINATOR.

   Doors knocked and doors ANSWERED are different numbers. Quote an
   appointment rate against doors knocked and every rep looks bad on a
   street where nobody was home — which is a property of the street and
   the hour, not of the rep. So contacts are counted off the status
   flags, the appointment rate is measured against contacts, and doors
   are reported alongside rather than divided into. A scoreboard that
   makes good work look bad is a scoreboard people learn to game.

   Second: the leaderboard reads WHO ACTUALLY KNOCKED, out of each
   history entry, not the pin's current owner. Reassigning a door must
   never move yesterday's work onto somebody else's total.

   Third: deleting a disposition is allowed but never silently. Pins
   already carrying it keep their real name and flags through
   canvassStatus's fallback — build 128 established that, and it is
   what makes the list safely editable at all. */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: the three pure functions exist ---------- */
ok(/function filterCanvassPins\(pins, f, meId\)/.test(src), "filterCanvassPins exists");
ok(/function canvassStats\(pins, statuses\)/.test(src), "canvassStats exists");
ok(/function canvassLeaderboard\(pins, statuses, users\)/.test(src), "canvassLeaderboard exists");
ok(/const apptRate = 0;|apptRate: pct\(appointments\.length, contacts\.length\),/.test(src),
  "the appointment rate is measured against CONTACTS, not doors knocked");
ok(/contactRate: pct\(contacts\.length, knocked\.length\),/.test(src),
  "the contact rate is answered-per-knocked, which is the honest thing that number means");
ok(/\(p\.history \|\| \[\]\)\.forEach\(\(h\) => \{/.test(src),
  "the leaderboard walks the knock history rather than the pin's current owner");
ok(/the scoreboard reads\s*\n\s*who actually knocked, not who owns the pin today/.test(src),
  "and the reassignment note says why");

/* ---------- static: list view and filters ---------- */
ok(/data-testid="canvass-view-toggle"/.test(src), "there is a map/list toggle");
ok(/function Card\(\{ children, style, pad = 18, onClick, testId \}\)/.test(src),
  "Card forwards testId — it silently swallowed every unnamed prop, so a data-testid on a Card never reached the DOM");
ok(/testId="canvass-list"/.test(src), "the list view exists");
ok(/It is what a rep uses in a\s*\n\s*moving truck, on a bad signal/.test(src),
  "the list is justified as a real surface, not a lesser map");
ok(/\.sort\(\(a, b\) => String\(b\.knocked_at \|\| ""\)\.localeCompare\(String\(a\.knocked_at \|\| ""\)\)\)/.test(src),
  "the list is ordered by most recently knocked — what a rep working callbacks needs");
ok(/data-testid="canvass-filters"/.test(src) && /data-testid="clear-filters"/.test(src),
  "filters open and can be cleared in one tap");
ok(/pins=\{shown\}/.test(src), "the MAP honours the filters too, not just the list");
ok(/Filters are hiding some pins right now\./.test(src),
  "and says so — a filtered map that looks empty is otherwise indistinguishable from an unworked street");

/* ---------- static: assignment ---------- */
ok(/data-testid="assign-pin"/.test(src), "a pin can be assigned to a rep");
ok(/Past knocks stay credited to whoever made them\./.test(src),
  "and the UI states that reassigning doesn't move past knocks");

/* ---------- static: the disposition editor ---------- */
ok(/function CanvassStatusEditor\(\{ statuses, setStatuses, onBack, toast, currentUser \}\)/.test(src),
  "the editor exists");
ok(/const canEdit = canManageCompanyConfig\(currentUser\);/.test(src),
  "it is gated the same way every other company-config editor is");
ok(/\) : nav === "canvassstatuses" \? \(/.test(src), "reachable from the nav switch");
ok(/\["canvassstatuses", MapPin, "Canvassing dispositions", "What reps mark at a door, and the map colors"\]/.test(src),
  "and listed under Setup beside pipeline stages");
ok(/const id = name\.toLowerCase\(\)\.replace\(\/\[\^a-z0-9\]\+\/g, "_"\)\.replace\(\/\^_\|_\$\/g, ""\)/.test(src),
  "a new disposition gets a stable slug id, because the id is what pins store");
ok(/Counts as contact/.test(src) && /Do not knock/.test(src) && /Still worth revisiting/.test(src),
  "the three behaviour flags are editable, not just the label and color");
ok(/doors already marked with it keep their label/.test(src),
  "deleting says what happens to pins already using it");

/* ================= behavioral: filtering ================= */
function filterCanvassPins(pins, f, meId) {
  const from = f.from ? f.from : null, to = f.to ? f.to : null;
  return (pins || []).filter((p) => {
    if (f.statuses && f.statuses.length && !f.statuses.includes(p.status)) return false;
    if (f.mineOnly && p.assigned_to !== meId && p.created_by !== meId) return false;
    if (f.rep && p.assigned_to !== f.rep) return false;
    if (from || to) {
      if (!p.knocked_at) return false;
      const d = String(p.knocked_at).slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
    }
    if (f.q) {
      const hay = [p.address, (p.prospect || {}).name, (p.prospect || {}).phone, p.notes]
        .filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(f.q.toLowerCase())) return false;
    }
    return true;
  });
}
const NONE = { statuses: [], rep: "", mineOnly: false, from: "", to: "", q: "" };
const PINS = [
  { id: "a", status: "not_home", address: "412 Oak St", assigned_to: "u1", created_by: "u1",
    knocked_at: "2026-08-01T18:00:00Z", prospect: {}, notes: "" },
  { id: "b", status: "appointment", address: "88 Pine Ave", assigned_to: "u2", created_by: "u2",
    knocked_at: "2026-08-05T14:00:00Z", prospect: { name: "Dana Reed", phone: "(815)555-0142" }, notes: "dog in yard" },
  { id: "c", status: "sold", address: "9 Cedar Ct", assigned_to: "u1", created_by: "u2",
    knocked_at: "2026-08-07T17:00:00Z", prospect: {}, notes: "" },
  { id: "d", status: "new", address: "1 Elm Rd", assigned_to: null, created_by: "u1",
    knocked_at: null, prospect: {}, notes: "" },
];
ok(filterCanvassPins(PINS, NONE, "u1").length === 4, "no filters shows everything");
ok(filterCanvassPins(PINS, { ...NONE, statuses: ["sold"] }, "u1").map((p) => p.id).join() === "c",
  "filtering by status works");
ok(filterCanvassPins(PINS, { ...NONE, statuses: ["sold", "appointment"] }, "u1").map((p) => p.id).join() === "b,c",
  "status filtering is a multi-select union, not one-at-a-time");
ok(filterCanvassPins(PINS, { ...NONE, rep: "u2" }, "u1").map((p) => p.id).join() === "b",
  "filtering by rep reads the pin's owner");
ok(filterCanvassPins(PINS, { ...NONE, mineOnly: true }, "u1").map((p) => p.id).join() === "a,c,d",
  "only-mine includes doors I own OR dropped — a rep who dropped a pin someone else now owns still sees their own work");
ok(filterCanvassPins(PINS, { ...NONE, q: "dana" }, "u1").map((p) => p.id).join() === "b",
  "search matches the prospect's name, case-insensitively");
ok(filterCanvassPins(PINS, { ...NONE, q: "dog" }, "u1").map((p) => p.id).join() === "b",
  "search matches the notes — where the useful detail actually lives");
ok(filterCanvassPins(PINS, { ...NONE, q: "oak" }, "u1").map((p) => p.id).join() === "a", "search matches the address");
ok(filterCanvassPins(PINS, { ...NONE, from: "2026-08-05" }, "u1").map((p) => p.id).join() === "b,c",
  "a from-date filters by the day knocked");
ok(filterCanvassPins(PINS, { ...NONE, from: "2026-08-01", to: "2026-08-05" }, "u1").map((p) => p.id).join() === "a,b",
  "a date range is inclusive at both ends");
ok(filterCanvassPins(PINS, { ...NONE, from: "2026-08-01" }, "u1").every((p) => p.id !== "d"),
  "an un-knocked door has no date, so a date range excludes it rather than pretending it was knocked today");
ok(filterCanvassPins(PINS, { ...NONE, statuses: ["sold"], rep: "u2" }, "u1").length === 0,
  "filters compose — sold AND owned by u2 is nobody here");
ok(filterCanvassPins(null, NONE, "u1").length === 0, "no pins doesn't crash the filter");

/* ================= behavioral: the scoreboard ================= */
const CANVASS_STATUSES = [
  { id: "new", name: "Not knocked", contact: false, open: true, terminal: false },
  { id: "not_home", name: "Not home", contact: false, open: true, terminal: false },
  { id: "callback", name: "Come back", contact: true, open: true, terminal: false },
  { id: "not_interested", name: "Not interested", contact: true, open: false, terminal: false },
  { id: "appointment", name: "Appointment set", contact: true, open: true, terminal: false },
  { id: "inspected", name: "Inspected", contact: true, open: true, terminal: false },
  { id: "sold", name: "Sold", contact: true, open: false, terminal: false },
  { id: "dnk", name: "Do not knock", contact: false, open: false, terminal: true },
];
function canvassStatusList(saved) {
  const list = Array.isArray(saved) && saved.length ? saved : CANVASS_STATUSES;
  return list.map((s) => ({ ...CANVASS_STATUSES.find((d) => d.id === s.id), ...s }));
}
function canvassStatus(saved, id) {
  const list = canvassStatusList(saved);
  return list.find((s) => s.id === id) || CANVASS_STATUSES.find((s) => s.id === id)
    || { id, name: id, contact: false, open: true, terminal: false };
}
function canvassStats(pins, statuses) {
  const st = (id) => canvassStatus(statuses, id);
  const knocked = (pins || []).filter((p) => p.knocked_at);
  const contacts = knocked.filter((p) => st(p.status).contact);
  const appointments = knocked.filter((p) => p.status === "appointment");
  const sold = knocked.filter((p) => p.status === "sold");
  const converted = (pins || []).filter((p) => p.job_id);
  const pct = (n, d) => (d > 0 ? Math.round((n / d) * 100) : 0);
  return { doors: knocked.length, contacts: contacts.length, appointments: appointments.length,
    sold: sold.length, converted: converted.length,
    contactRate: pct(contacts.length, knocked.length), apptRate: pct(appointments.length, contacts.length) };
}
/* Ten doors, three answered, one appointment — a normal afternoon. */
const DAY = [
  ...Array.from({ length: 7 }, (_, i) => ({ id: `n${i}`, status: "not_home", knocked_at: "2026-08-07T17:00:00Z" })),
  { id: "c1", status: "callback", knocked_at: "2026-08-07T17:10:00Z" },
  { id: "c2", status: "not_interested", knocked_at: "2026-08-07T17:20:00Z" },
  { id: "c3", status: "appointment", knocked_at: "2026-08-07T17:30:00Z", job_id: "j1" },
  { id: "u", status: "new", knocked_at: null },
];
let s = canvassStats(DAY, null);
ok(s.doors === 10, "an un-knocked pin is not a door knocked");
ok(s.contacts === 3, "only statuses flagged as contact count as someone answering");
ok(s.appointments === 1 && s.converted === 1, "appointments and conversions are counted separately");
ok(s.contactRate === 30, "30% of doors were answered");
ok(s.apptRate === 33,
  "the appointment rate is 1 of 3 ANSWERED = 33%, not 1 of 10 knocked = 10% — the difference is the whole point");
s = canvassStats([], null);
ok(s.doors === 0 && s.contactRate === 0 && s.apptRate === 0,
  "an empty day divides by zero safely rather than showing NaN%");
s = canvassStats([{ id: "x", status: "not_home", knocked_at: "2026-08-07T17:00:00Z" }], null);
ok(s.contacts === 0 && s.apptRate === 0, "a street where nobody answered reports 0%, not NaN");
/* A company that renamed a status keeps its contact flag, so the maths holds. */
s = canvassStats([{ id: "y", status: "callback", knocked_at: "2026-08-07T17:00:00Z" }],
  [{ id: "callback", name: "Swing back" }]);
ok(s.contacts === 1, "a renamed contact status still counts as someone answering");

/* ================= behavioral: the leaderboard ================= */
function canvassLeaderboard(pins, statuses, users) {
  const byRep = new Map();
  (pins || []).forEach((p) => {
    (p.history || []).forEach((h) => {
      const key = h.byId || h.by || "—";
      const row = byRep.get(key) || { id: h.byId, name: h.by || "", doors: 0, contacts: 0, appointments: 0 };
      row.doors++;
      if (canvassStatus(statuses, h.status).contact) row.contacts++;
      if (h.status === "appointment") row.appointments++;
      if (!row.name && h.byId) {
        const u = (users || []).find((x) => x.id === h.byId);
        if (u) row.name = u.name;
      }
      byRep.set(key, row);
    });
  });
  return [...byRep.values()].sort((a, b) => b.doors - a.doors);
}
/* Jacob knocked it twice; Drew knocked it once and set the appointment.
   The pin is now OWNED by Jacob — which must not steal Drew's work. */
const SHARED = [{
  id: "p1", assigned_to: "u1",
  history: [
    { byId: "u1", by: "Jacob Henderson", status: "not_home" },
    { byId: "u2", by: "Drew Klass", status: "appointment" },
    { byId: "u1", by: "Jacob Henderson", status: "callback" },
  ],
}];
const lb = canvassLeaderboard(SHARED, null, []);
ok(lb.length === 2, "both reps appear, even though only one owns the pin");
ok(lb[0].name === "Jacob Henderson" && lb[0].doors === 2, "Jacob is credited with the two knocks he made");
const drew = lb.find((r) => r.name === "Drew Klass");
ok(drew.doors === 1 && drew.appointments === 1,
  "Drew keeps the appointment he set on a door somebody else now owns — reassignment never moves past work");
ok(lb[0].contacts === 1, "Jacob's 'not home' is not counted as a contact, but his 'come back' is");
ok(canvassLeaderboard([{ id: "x", history: [{ byId: "u9", status: "sold" }] }], null,
  [{ id: "u9", name: "Ty Miller" }])[0].name === "Ty Miller",
  "a history entry with an id but no stored name resolves the name from the roster");
ok(canvassLeaderboard([{ id: "x" }], null, []).length === 0, "a pin with no history contributes nobody");
ok(canvassLeaderboard(null, null, []).length === 0, "no pins doesn't crash the leaderboard");

/* ================= behavioral: editing dispositions ================= */
function slugFor(name, list) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || `s_${list.length}`;
  return list.some((x) => x.id === id) ? null : id;
}
ok(slugFor("Renter", CANVASS_STATUSES) === "renter", "a new disposition gets a readable slug");
ok(slugFor("Dog — aggressive!", CANVASS_STATUSES) === "dog_aggressive",
  "punctuation and spacing collapse to a safe id");
ok(slugFor("Sold", CANVASS_STATUSES) === null, "a duplicate name is refused rather than colliding with an existing id");
/* Renaming keeps the id, which is what every pin stores. */
function rename(list, id, name) { return list.map((s) => (s.id === id ? { ...s, name } : s)); }
const renamed = rename(canvassStatusList(null), "sold", "Signed");
ok(renamed.find((s) => s.id === "sold").name === "Signed", "renaming changes the label");
ok(canvassStatus(renamed, "sold").contact === true,
  "and the pins pointing at that id are unaffected — the id never moves");
/* Deleting leaves existing pins intact. */
const pruned = canvassStatusList(null).filter((s) => s.id !== "dnk");
ok(canvassStatus(pruned, "dnk").name === "Do not knock",
  "a deleted disposition still renders for doors already marked with it");
ok(canvassStatus(pruned, "dnk").terminal === true,
  "and keeps terminal=true — deleting the label must never make a do-not-knock door knockable again");

if (fails) { console.log("\nbuild 130: " + fails + " FAILED"); process.exit(1); }
console.log("build 130 tests passed");
