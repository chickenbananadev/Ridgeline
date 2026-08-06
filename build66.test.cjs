/* Build 66 — one-way outbound push of new appointments to Google Calendar,
   the last of the eight quick wins from the competitive gap analysis.

   This one needed real scoping before it could be called "quick": the
   existing Gmail OAuth connection only requests gmail.send, and pushing
   to Calendar needs calendar.events too — which means every already-
   connected rep needs to reconnect to grant it, and the actual event-
   insert call needs new server-side code (the refresh token never leaves
   the edge function). Per the user's explicit choice, the code ships now;
   deploying the new edge function and re-consenting existing reps is a
   manual step, same as the seat-invite and ai-assistant functions already
   waiting on that in this environment.

   Sync is one-way (app -> Google) and best-effort only: a rep who hasn't
   connected Google, or connected before this scope existed, never sees a
   booking fail because the nice-to-have sync couldn't fire — same silent-
   degrade contract askAssistant already uses.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
const mainSrc = fs.readFileSync(path.join(__dirname, "src/main.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };
const has = (p) => fs.existsSync(path.join(__dirname, p));

/* ---------- OAuth scope + client method ---------- */
ok(/scope: "https:\/\/www\.googleapis\.com\/auth\/gmail\.send https:\/\/www\.googleapis\.com\/auth\/calendar\.events"/.test(mainSrc),
  "the consent screen now requests calendar.events alongside gmail.send in one grant");
ok(/async pushToCalendar\(\{ summary, description, location, start, end, timeZone \}\) \{/.test(mainSrc),
  "a dedicated client method exists for the calendar push, separate from sendGmail");
ok(/if \(error \|\| !data \|\| data\.error\) return null;/.test(mainSrc) && /\} catch \{\s*\n\s*return null;/.test(mainSrc),
  "pushToCalendar never throws — every failure path resolves to null, same contract as askAssistant");

/* ---------- edge function ---------- */
ok(has("supabase/functions/calendar-push/index.ts"), "calendar-push edge function exists");
const fnSrc = fs.readFileSync(path.join(__dirname, "supabase/functions/calendar-push/index.ts"), "utf8");
ok(/crm_user_integrations.*select\("data"\)\.eq\("user_id", user\.id\)/.test(fnSrc),
  "reuses the same stored refresh token gmail-oauth already wrote, not a separate connection");
ok(/https:\/\/www\.googleapis\.com\/calendar\/v3\/calendars\/primary\/events/.test(fnSrc),
  "actually calls the Calendar API to insert an event, not a stub");
ok(/needsRescope/.test(fnSrc) && /reconnect your Google account|reconnect from Integrations/.test(fnSrc),
  "a rep with a Gmail-only token (connected before this shipped) gets a distinct, actionable error instead of an opaque 403");

/* ---------- client wiring: both appointment-creation paths ---------- */
ok(/function apptWindowISO\(date, time, durationMin\) \{/.test(src),
  "start/end windows are built by one shared helper, not duplicated math at each call site");
ok(/const end = new Date\(start\.getTime\(\) \+ \(Number\(durationMin\) \|\| 60\) \* 60000\);/.test(src),
  "the end time is real Date arithmetic so a late appointment with a long duration rolls into the next day correctly");

const calendarViewBody = src.slice(src.indexOf("function CalendarView("), src.indexOf("function CalendarView(") + 9000);
ok(/const newId = uid\("ap"\);\s*\n\s*setAppointments\(\[\.\.\.appointments, \{ \.\.\.payload, id: newId \}\]\);/.test(calendarViewBody),
  "the main booking sheet keeps a handle on the new appointment's id so a later successful push can attach the Google event id");
ok(/const auth = AUTH\(\);\s*\n\s*const win = apptWindowISO\(f\.date, f\.time, payload\.durationMin\);\s*\n\s*if \(auth && auth\.pushToCalendar && win\) \{/.test(calendarViewBody),
  "the main booking sheet actually calls pushToCalendar for a newly created appointment");

const quickPanelBody = src.slice(src.indexOf("function JobQuickPanel("), src.indexOf("function JobQuickPanel(") + 6000);
ok(/const auth = AUTH\(\);\s*\n\s*const win = apptWindowISO\(appt\.date, appt\.time, durationMin\);\s*\n\s*if \(auth && auth\.pushToCalendar && win\) \{/.test(quickPanelBody),
  "the job-screen Quick Add panel's appointment path pushes too — a rep gets the same behavior regardless of which of the two booking flows they used");

ok(/if \(res && res\.eventId\) \{\s*\n\s*setAppointments\(\(prev\) => prev\.map\(\(ap\) => ap\.id === newId \? \{ \.\.\.ap, googleEventId: res\.eventId \} : ap\)\);/.test(src),
  "a successful push records the Google event id on the appointment (functional setState, safe against the async gap since the booking sheet)");

/* ---------- DEPLOY.md ---------- */
const deploySrc = fs.readFileSync(path.join(__dirname, "DEPLOY.md"), "utf8");
ok(/supabase functions deploy calendar-push/.test(deploySrc), "DEPLOY.md documents deploying the new function");
ok(/calendar\.events.*scope|calendar-events? scope/.test(deploySrc) || /calendar\.events/.test(deploySrc),
  "DEPLOY.md documents the new scope requirement");
ok(/reconnect/.test(deploySrc) && /calendar/i.test(deploySrc),
  "DEPLOY.md explains that already-connected reps need to reconnect for calendar access");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_b66.jsx");
const bundle = path.join(__dirname, "_b66.cjs");
fs.writeFileSync(scratch, src + "\nexport { apptWindowISO };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b66.cjs");

ok(m.apptWindowISO(null, "14:00", 60) === null, "no date returns null rather than a garbage window");
ok(m.apptWindowISO("2026-08-06", "", 60) === null, "no time returns null rather than a garbage window");

const win = m.apptWindowISO("2026-08-06", "14:00", 90);
ok(win && win.start === "2026-08-06T14:00:00", "a normal window starts exactly where the appointment was booked");
ok(win && win.end === "2026-08-06T15:30:00", "a 90-minute appointment ends 90 real minutes later");

/* The actual case the real-Date-arithmetic comment promises: a duration
   long enough to cross midnight has to roll the end date forward, not
   just add ":90" worth of minutes to an hour field. */
const overnight = m.apptWindowISO("2026-08-06", "23:00", 120);
ok(overnight && overnight.end === "2026-08-07T01:00:00", "a duration crossing midnight correctly rolls the end date to the next day");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 66: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 66 tests passed");
