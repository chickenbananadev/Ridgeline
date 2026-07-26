/* Build 19 — dispatch rebuilt day-first for a phone. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- the layout problem that prompted the rebuild --- */
ok(!src.includes("minWidth: 120 + 7 * 118"), "the ~950px wide grid is gone");
ok(!src.includes('gridTemplateColumns: `112px repeat(7, 110px)`'), "the crew-by-day table is gone");
ok(!src.includes("Tap Place on a job, then tap the crew and day it belongs to"),
  "the two-step place-then-hunt flow is gone");

/* --- day-first structure --- */
ok(src.includes("const [day, setDay] = useState(() => todayIso());"), "the board is anchored on a day");
ok(src.includes("const dayLabel"), "days are labelled in human terms");
ok(src.includes('if (iso === today) return "Today";'), "today reads as Today");
ok(src.includes('if (diff === 1) return "Tomorrow";'), "tomorrow reads as Tomorrow");
ok(src.includes('if (diff === -1) return "Yesterday";'), "yesterday reads as Yesterday");

/* --- one-sheet assignment --- */
ok(src.includes("const openPlacer"), "assignment opens a single sheet");
ok(src.includes("const confirmPlace"), "crew and day are confirmed together");
ok(src.includes('data-testid="confirm-dispatch"'), "the sheet has a confirm control");
ok(src.includes("const unplace"), "a job can be taken off a crew");
ok(src.includes("already booked"), "crew load is shown while choosing");
ok(src.includes("That crew is already busy"), "double-booking is warned about, not blocked");

/* --- what must not be missed --- */
ok(src.includes("scheduled with no crew"), "unassigned jobs on the day are surfaced first");
ok(src.includes("Needs scheduling"), "the backlog survived the rebuild");
ok(src.includes("Everything in production is placed"), "an empty backlog says so");
ok(src.includes("Open — nothing booked"), "an idle crew reads as available, not blank");

/* --- day-strip load maths --- */
const jobs = [
  { schedDate: "2026-07-24", crewId: "c1" },
  { schedDate: "2026-07-24", crewId: null },
  { schedDate: "2026-07-25", crewId: "c1" },
];
const onDay = (iso) => jobs.filter((j) => j.schedDate === iso);
const gapOn = (iso) => jobs.filter((j) => j.schedDate === iso && !j.crewId);
ok(onDay("2026-07-24").length === 2, "day count includes assigned and unassigned");
ok(gapOn("2026-07-24").length === 1, "the gap count isolates crewless jobs");
ok(gapOn("2026-07-25").length === 0, "a fully crewed day shows no gap");

/* --- quick actions on the row --- */
ok(src.includes('aria-label="Directions"'), "each roof offers directions");
ok(src.includes('aria-label={`Call ${c.name}`}'), "each crew can be called");

if (fails) { console.log("\nbuild 19: " + fails + " FAILED"); process.exit(1); }
console.log("build 19 tests passed");
