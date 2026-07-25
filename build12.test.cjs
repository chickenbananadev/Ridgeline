/* Build 12 — job detail as collapsible sections, activity behind the
   clock, CompanyCam connection footer. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

ok(src.includes("const JOB_SECTIONS"), "section registry exists");
ok(src.includes('["overview", "Overview"'), "overview is the first section");
ok(src.includes('["files", "Attachments"'), "files reads as Attachments");
ok(src.includes('["portal", "Client portal"'), "portal reads as Client portal");
ok(src.includes('["checklist", "Inspection checklist"'), "checklist is named plainly");

/* the old horizontal tab strip is gone */
ok(!src.includes("const activeGroup = (groups.find"), "grouped tab strip removed");
ok(!src.includes('borderBottom: tab === id ? `2.5px solid ${T.accent}`'), "tab underline styling removed");

/* accordion behaviour */
ok(src.includes("const [open, setOpen] = useState(() => ({ overview: true"), "overview opens by default");
ok(src.includes("setOpen((o) => ({ ...o, [id]: !o[id] }))"), "sections toggle independently");
ok(src.includes("Expand all"), "expand-all control exists");

/* activity behind the clock */
ok(src.includes("const [activityOpen, setActivityOpen]"), "activity sheet state exists");
ok(src.includes('aria-label="Activity log"'), "activity has its own header control");
ok(src.includes("(activity || []).filter((a) => a.jobId === job.id)"), "activity is scoped to this job");

/* CompanyCam connection footer */
ok(src.includes("View project in CC"), "CompanyCam footer links out");
ok(src.includes('KV k="Connected to" v="CompanyCam"'), "footer names the connection");
ok(src.includes("Not connected to CompanyCam"), "unconnected state is explained");

/* delete stays admin-only, now in the footer */
ok(src.includes("Removes every note, photo, estimate and message on it."), "delete carries an explanation");
ok(src.includes("{isAdmin && onDelete && ("), "footer delete is admin-gated");

/* deep links still land on real content */
ok(src.includes("setOpen((o) => ({ ...o, [openTab]: true }))"), "a deep link expands its section");

if (fails) { console.log("\nbuild 12: " + fails + " FAILED"); process.exit(1); }
console.log("build 12 tests passed");
