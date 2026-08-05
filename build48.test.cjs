/* Build 48 — the workflow round.

   Three things land together here: stage age becomes real data instead of a
   field nothing ever wrote to, a stage becomes a container of work (SLA,
   entry gate, seeded tasks) enforced at the one chokepoint every transition
   already funnels through, and the home page stops repeating itself and
   leads with what is actually broken.

   Static assertions over the source, plus a live render of the demo app so a
   crash in the rebuilt Dashboard can't ship green. */
const fs = require("fs");
const src = fs.readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- Step 0: stage age ---------- */
ok(/function stageDays\(job\) \{/.test(src), "stageDays helper exists");
ok(/return num\(job\.daysInStage\);/.test(src),
  "stageDays falls back to the legacy field for jobs saved before stageAt");
ok(/if \(job\.stageAt\) \{/.test(src), "stageDays derives from the stamped entry date");
ok(/function stageAge\(job, rules\)/.test(src), "stageAge turns days + SLA into a board signal");
ok(!/num\(job\.daysInStage\) *;[\s\S]{0,40}const days/.test(src) && /const days = stageDays\(job\);/.test(src),
  "focusScore reads the derived age");
ok(/stageDays\(j\) >= 14/.test(src), "stale-job filter reads the derived age");
ok(/open\.reduce\(\(x, j\) => x \+ stageDays\(j\), 0\)/.test(src), "average age reads the derived age");
ok(/sort\(\(a, b\) => stageDays\(b\) - stageDays\(a\)\)/.test(src), "stage-time sort reads the derived age");
ok(/stageId, stageAt: todayIso\(\), daysInStage: 0/.test(src), "moveStage stamps the entry date");
ok(/daysInStage: 0, stageAt: todayIso\(\), updated: "imported"/.test(src), "import stamps the entry date");
ok(/daysInStage: 0, stageAt: todayIso\(\), updated: "just now", claimType: f\.claimType/.test(src),
  "lead creation stamps the entry date");
/* A hydration-time backfill would rewrite the customer's whole jobs table on
   first open through the debounced upsert. It must not exist. */
ok(!/setJobs\([^)]*stageAt: todayIso\(\)[^)]*\)\s*\)?;?\s*\}, \[hydrated\]/.test(src),
  "no stageAt backfill on hydration");

/* ---------- Part 1: the check registry and stage rules ---------- */
ok(/const STAGE_CHECKS = \{/.test(src), "keyed STAGE_CHECKS registry exists");
ok(/const HANDOFF_CHECKS = HANDOFF_CHECK_IDS\.map\(\(id\) => \(\{ id, \.\.\.STAGE_CHECKS\[id\] \}\)\);/.test(src),
  "the sold→approval gate is derived from the registry, not duplicated");
ok(/const HANDOFF_CHECK_IDS = \["contract", "price", "deposit", "measure", "materials", "claim"\];/.test(src),
  "the handoff subset is unchanged");
ok(/function handoffReadiness\(job, ctx\)/.test(src), "handoffReadiness threads context to the checks");
ok(/const DEFAULT_STAGE_RULES = \{/.test(src) && /const EMPTY_RULE = /.test(src), "per-stage rules with a sparse default");
ok(!/gate: \{ mode: "block"/.test(src.slice(src.indexOf("const DEFAULT_STAGE_RULES"), src.indexOf("/* Automation is shipped as a menu"))),
  "no shipped default blocks a move — an upgrade must not strand live jobs");
ok(/function stageGate\(job, stageId, rules, ctx\)/.test(src), "stageGate exists");
ok(/return \{ mode: on \? g\.mode : "off", results, failed, ready: failed\.length === 0 \};/.test(src),
  "stageGate returns the same shape handoffReadiness does");
ok(/const ruleApplies = \(item, job\) =>/.test(src) && /item\.when/.test(src),
  "a rule can be scoped to one job type (the cheap 80% of separate pipelines)");
ok(/stageRules, leadSources/.test(src), "stageRules is packed into the org blob");
ok(/if \(d\.stageRules\) setStageRules\(d\.stageRules\);/.test(src), "stageRules round-trips out of the org blob");

/* ---------- Part 1b: the gate at the chokepoint ---------- */
ok(/const moveStage = \(jobId, stageId, opts = \{\}\) => \{/.test(src), "moveStage takes opts");
ok(/if \(!opts\.force && gate\.mode === "block" && !gate\.ready\)/.test(src), "a block gate stops the move");
ok(/if \(prod && onMoveStage\) onMoveStage\(job\.id, prod\.id, \{ force: true \}\);/.test(src),
  "admin approval forces past the gate — otherwise the folder is created and the job never moves");
ok(/const bulkMoveStage = \(ids, stageId\) => \{/.test(src), "bulk move partitions instead of looping into a dialog");
ok(/onBulkMoveStage\(\[\.\.\.selected\], st\.id\)/.test(src), "the board's bulk menu uses it");
ok(/if \(!seeded\[stageId\]\) \{/.test(src) && /next\.stageSeeded = seeded;/.test(src),
  "stage tasks seed exactly once per stage");
ok(/!have\.has\(String\(t\.label \|\| ""\)\.toLowerCase\(\)\)/.test(src),
  "seeding never duplicates a label the rep already has");
ok(/function StageGateSheet\(\{ prompt, onClose, onConfirm, isAdmin, currentUser \}\)/.test(src),
  "the blocked move opens a dialog that says what is missing");
ok(/Moving it anyway is allowed — it is recorded against your name\./.test(src),
  "the override follows the existing recorded-override precedent");

/* ---------- Part 2: the exception feed and the home rebuild ---------- */
ok(/function jobExceptions\(job, ctx\)/.test(src) && /function exceptionFeed\(jobs, ctx\)/.test(src),
  "exception feed exists");
ok(/a\.tone === "red" \? -1 : 1/.test(src), "red sorts before amber");
ok(/Scheduled \$\{job\.schedDate\} with no crew assigned/.test(src), "scheduled-without-a-crew is a blocker");
ok(/in recoverable depreciation not yet requested/.test(src), "held depreciation is a blocker");
ok(/call before asking for anything public/.test(src), "a sub-3★ review is a blocker");
ok(/function Dashboard\(\{ jobs: allJobs,/.test(src),
  "Dashboard shadows the jobs prop so every card scopes at once");
ok(/<FocusList jobs=\{jobs\} onOpenJob=\{onOpenJob\} \/>/.test(src),
  "FocusList is unchanged and now reads the scoped list for free");
/* The three duplicate cards are gone. These are the assertions that keep
   them gone — a future edit that re-adds one fails here. */
ok(!/>Pipeline by stage</.test(src), "the duplicate 'Pipeline by stage' card is gone");
ok(!/>Needs attention</.test(src), "the duplicate 'Needs attention' card is gone");
/* One Reviews card on the dashboard. The other match is the reviews screen's
   own title, which is a different component. */
ok((src.match(/>Reviews<\/CardTitle>/g) || []).length === 2, "only one Reviews card remains on the dashboard");
ok((src.match(/<FocusList jobs=\{jobs\} onOpenJob=\{onOpenJob\} \/>/g) || []).length === 1,
  "FocusList renders exactly once");
ok(/{showMoney && \(<>/.test(src), "the money tiles are hidden from a crew seat");

/* ---------- Part C: aging, locked stages, recipes ---------- */
ok(/const age = stageAge\(job, stageRules\);/.test(src), "job cards color by stage age");
ok(/borderLeft: age\.late \? "3px solid var\(--rl-red-fg\)"/.test(src), "an overdue card is marked down its edge");
ok(/const LOCKED_STAGES = \["s1", "s10", "s11", "s12"\];/.test(src), "terminal stages are named");
ok(/const locked = LOCKED_STAGES\.includes\(s\.id\);/.test(src) && /Reporting depends on this stage/.test(src),
  "the workflow editor refuses to delete a stage reporting depends on");
ok(/const STAGE_RECIPES = \[/.test(src), "automation ships as a recipe menu, not a blank canvas");
ok(/Applied to \$\{n\} \$\{n === 1 \? "stage" : "stages"\}/.test(src), "recipes show how widely they are already used");
ok(/setStages\(local\); setStageRules\(rules\);/.test(src), "the editor saves stages and rules together");

/* ---------- Part 3: the sandboxed assistant ---------- */
const fnPath = "./supabase/functions/ai-assistant/index.ts";
ok(fs.existsSync(fnPath), "ai-assistant Edge Function exists");
const fn = fs.existsSync(fnPath) ? fs.readFileSync(fnPath, "utf8") : "";
ok(/Deno\.env\.get\("ANTHROPIC_API_KEY"\)/.test(fn), "the function reads the key server-side");
/* The only VITE_ mentions allowed here are the comments explaining why the
   prefix must never be used — never an actual env read. */
ok(!/Deno\.env\.get\("VITE_/.test(fn) && !/process\.env\.VITE_/.test(fn),
  "the key is never read from a VITE_ variable (that would ship it to the browser)");
ok(/if \(!key\) return json\(\{ ok: false, reason: "unconfigured" \}\);/.test(fn),
  "no key deployed is a soft failure, not an error");
ok(/const \{ data: \{ user \} \} = await caller\.auth\.getUser\(\);/.test(fn) && /if \(!user\) return json/.test(fn),
  "only signed-in seats can reach the provider");
ok(/return json\(\{ ok: false, reason: "no-context" \}\);/.test(fn),
  "with nothing retrieved it refuses rather than answering from memory");
ok(/Do not fill the gap from memory/.test(fn), "the system prompt forbids ungrounded code cites");
ok(/not a lawyer and this is not legal advice/.test(fn), "the system prompt refuses legal advice");
const mainJs = fs.readFileSync("./src/main.jsx", "utf8");
ok(/async askAssistant\(\{ question, records, job \}\)/.test(mainJs), "auth.askAssistant is wired");
ok(/if \(error \|\| !data \|\| !data\.ok \|\| !data\.answer\) return null;/.test(mainJs),
  "askAssistant never throws — every failure falls back to local retrieval");
ok(!/VITE_ANTHROPIC/.test(mainJs) && !/ANTHROPIC_API_KEY/.test(fs.readFileSync("./ridgeline.jsx", "utf8").replace(/keyName: "ANTHROPIC_API_KEY"|Add ANTHROPIC_API_KEY|ANTHROPIC_API_KEY with that value/g, "")),
  "the API key never appears in client code except as setup instructions");
ok(/function claimCorpus\(\)/.test(src) && /_claimCorpus = buildClaimCorpus\(\)/.test(src),
  "the corpus builds lazily — it now reaches constants declared later in the file");
ok(/const INSTALL_SPECS = \[/.test(src) && /const NRCA_PRACTICE = \[/.test(src) && /const IRC_DEEP = \[/.test(src),
  "manufacturer install specs, NRCA practice and deeper IRC provisions were authored");
ok(/source: "NRCA best practice"/.test(src) && /source: "Manufacturer install spec"/.test(src),
  "the new knowledge is wired into the corpus");
ok(/HELP_ARTICLES : \[\]\)\.forEach/.test(src), "the app's own help articles are answerable too");
ok(/function assistantJobContext\(job\)/.test(src), "the assistant can answer for the open roof");
const ctx = src.slice(src.indexOf("function assistantJobContext"), src.indexOf("function ClaimAssistant"));
ok(!/job\.name|job\.address|job\.phone|job\.email/.test(ctx),
  "the job context carries the roof, not the customer's file");
ok(/function ClaimAssistant\(\{ job = null \}\)/.test(src), "ClaimAssistant takes the open job (it took no props at all)");
ok(/case "assistant": return <ClaimAssistant job=\{job\} \/>;/.test(src), "the assistant is reachable from inside a job");
/* A job section only renders if its id is in JOB_TABS too — the render
   filter derives the allowed set from there, so adding it to JOB_SECTIONS
   alone silently shows nothing. */
ok(/\["assistant", "Ask the assistant"\]/.test(src), "the assistant is in JOB_TABS, so the section actually renders");
ok(/\["Build", \["workorder", "tasks", "files", "assistant"\]\]/.test(src), "it sits in the Build group");
ok(/"insurance:ask", MessageCircle, "Roofing assistant"/.test(src), "it is also reachable globally, not only from a claim");
ok(/score \+= covered \* covered \* 2;/.test(src), "retrieval ranks by how much of the question a record covers");

/* ---------- live render: the rebuilt home must not crash ---------- */
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>",
  { url: "https://example.com/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
global.Blob = dom.window.Blob; global.URL = dom.window.URL;
window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
global.fetch = () => Promise.reject(new Error("no network in tests"));

const errs = [];
const realErr = console.error;
console.error = (...a) => { errs.push(a.join(" ")); };

const React = require("react");
const { act } = require("react");
const { createRoot } = require("react-dom/client");
global.IS_REACT_ACT_ENVIRONMENT = true;
const App = require("./app.test.cjs").default;

/* The demo account picker rows are clickable divs, not buttons, so this has
   to look wider than button/a — same approach the older render tests use. */
function clickText(txt) {
  const els = [...document.querySelectorAll("button, a, div, span")];
  const btn = els.filter((e) => e.textContent && e.textContent.trim().startsWith(txt))
    .sort((a, b) => a.textContent.length - b.textContent.length)[0];
  if (!btn) return false;
  act(() => { btn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  return true;
}

const root = createRoot(document.getElementById("root"));
act(() => { root.render(React.createElement(App)); });
clickText("Sign in");            // marketing page -> auth screen
clickText("Sign in");            // auth screen -> demo account picker
clickText("Jacob Henderson");    // owner seat -> home

const body = () => document.body.textContent || "";
ok(/Blockers/.test(body()), "the Blockers card renders on the demo home page");
ok(/Welcome back/.test(body()), "the home page rendered at all");
ok((body().match(/Business at a glance/g) || []).length <= 1, "the money header renders at most once");
/* The demo book has jobs sitting well past their stage clock, so the feed
   should not be empty — an always-empty feed would pass the render check
   while being useless. */
ok(!/Nothing is stuck/.test(body()), "the demo book surfaces real blockers rather than an empty state");

console.error = realErr;
const realErrs = errs.filter((e) => !/not wrapped in act/.test(e));
if (realErrs.length) { console.log("console errors:\n" + realErrs.slice(0, 5).join("\n")); fails++; }

if (fails) { console.log("\nbuild 48: " + fails + " FAILED"); process.exit(1); }
console.log("build 48 tests passed");
