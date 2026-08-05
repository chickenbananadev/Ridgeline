/* Build 47 — full audit round: regressions from the prior session (Gmail
   OAuth race, theme "follow the OS" persistence bug, a stale test), real
   functional bugs (export bypassing the security gate, fake/dead email
   buttons, a crash in the Report tab, crew-role money leak), and a dark-mode
   completion sweep of high-traffic shared components. Static assertions over
   the source + assets. */
const fs = require("fs");
const src = fs.readFileSync("./ridgeline.jsx", "utf8");
const html = fs.readFileSync("./index.html", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* Part 1 — regressions */
ok(/if \(!a \|\| !a\.gmailExchange\) \{ gmailCbDone\.current = true; clean\(\); return; \}/.test(src),
  "Gmail OAuth callback only latches done on a terminal outcome");
ok(/if \(!currentUser\) return; \/\/ wait/.test(src),
  "Gmail OAuth callback waits for currentUser to hydrate instead of giving up");
ok(/const themeExplicit = useRef\(false\)/.test(src) && /const setTheme = \(next\) => \{ themeExplicit\.current = true/.test(src),
  "theme only persists/stamps data-theme on an explicit user choice");
ok(/if \(!themeExplicit\.current\) return; \/\/ computed default/.test(src),
  "theme effect skips persistence for the computed OS-derived default");

/* Part 2 — functional bugs */
ok(/downloadCsv\("jobs-export\.csv", \[head, \.\.\.body\]\)/.test(src),
  "Job Board bulk export goes through the admin-gated downloadCsv");
ok(!/const blob = new Blob\(\[head\.join/.test(src),
  "Job Board export no longer builds/downloads a Blob directly");
ok(/async function sendClientEmail\(job, mut, currentUser, integrations, toast/.test(src),
  "shared sendClientEmail helper exists");
ok(!/toast\("Contract emailed to client"\)/.test(src), "Contract email button no longer fakes success");
ok(!/toast\("Invoice emailed to client"\)/.test(src), "Invoice email button no longer fakes success");
ok(/sendClientEmail\(job, mut, currentUser, integrations, toast, \{\s*subject: `Your contract is ready/.test(src),
  "Contract tab wires the real send");
ok(/sendClientEmail\(job, mut, currentUser, integrations, toast, \{\s*subject: `Invoice —/.test(src),
  "Invoice tab wires the real send");
ok(/function TabReport\(\{ job, brand, juris, mut, toast, currentUser = null, integrations = \{\} \}\)/.test(src),
  "TabReport receives mut/toast/currentUser/integrations (was missing all four)");
ok(!/workOrderDocHtml\(job, brand, crew\), toast\)\}><Printer size=\{15\} \/> Print \/ PDF<\/Btn>\s*<Btn kind="ghost"><Send/.test(src),
  "TabReport's bottom button no longer crashes on an undefined crew / prints the wrong document");
ok(/openDoc\(`Inspection report — \$\{job\.name\}`, brand, reportDocHtml\(job, brand\), toast\)\}><Printer size=\{15\} \/> Print \/ PDF<\/Btn>\s*<Btn kind="ghost" onClick=\{\(\) => sendClientEmail/.test(src),
  "TabReport's bottom row now prints the real inspection report and sends/shares for real");
ok(/function TabHandoff\(\{ job, mut, toast, isAdmin, currentUser, stages, onMoveStage, showMoney = true \}\)/.test(src),
  "TabHandoff accepts showMoney");
ok(/\{showMoney && <KV k="Contract price" v=\{money\(folder\.contractPrice\)\} strong \/>\}/.test(src),
  "TabHandoff hides contract price when showMoney is false");
ok(/function TabChangeOrders\(\{ job, mut, toast, currentUser, brand, showMoney = true \}\)/.test(src),
  "TabChangeOrders accepts showMoney");
ok(/Pricing on this change order isn't shown for your role/.test(src),
  "TabChangeOrders hides line pricing when showMoney is false");
ok(/if \(id === "handoff" \|\| id === "changeorders"\) return true;/.test(src),
  "handoff/changeorders sections still always render (now money-gated internally)");
ok(/case "handoff": return <TabHandoff job=\{job\} mut=\{mut\} toast=\{toast\} isAdmin=\{isAdmin\}\s*currentUser=\{currentUser\} stages=\{stages\} onMoveStage=\{onMoveStage\} showMoney=\{showMoney\}/.test(src),
  "JobDetail passes showMoney into TabHandoff");
ok(/case "changeorders": return <TabChangeOrders job=\{job\} mut=\{mut\} toast=\{toast\} currentUser=\{currentUser\} brand=\{brand\} showMoney=\{showMoney\}/.test(src),
  "JobDetail passes showMoney into TabChangeOrders");

/* Part 3 — dark-mode completion */
ok(/--rl-green-bg:#E8F6EE; --rl-green-fg:#177245;/.test(html) && /--rl-red-bg:#FDECEC; --rl-red-fg:#B42318;/.test(html),
  "index.html defines theme-aware tone variables");
ok(/--rl-green-bg:#123524; --rl-green-fg:#4ADE9A;/.test(html),
  "dark theme overrides the tone variables");
const calloutBlock = src.slice(src.indexOf("function Callout"), src.indexOf("function Callout") + 400);
ok(/var\(--rl-amber-bg\)/.test(calloutBlock) && /var\(--rl-red-bg\)/.test(calloutBlock) && /var\(--rl-green-bg\)/.test(calloutBlock),
  "Callout tones resolve to the theme-aware CSS variables");
const chipBlock = src.slice(src.indexOf("function Chip"), src.indexOf("function Chip") + 500);
ok(/var\(--rl-gray-bg\)/.test(chipBlock) && /var\(--rl-green-bg\)/.test(chipBlock) && /var\(--rl-red-bg\)/.test(chipBlock) && /var\(--rl-amber-bg\)/.test(chipBlock) && /var\(--rl-slate-bg\)/.test(chipBlock),
  "Chip tones resolve to the theme-aware CSS variables");
ok(/background: S\.soft, borderRadius: 999, width: 34, height: 34,/.test(src),
  "Sheet's own close button is theme-aware");
ok(/background: on \? T\.accentSoft : S\.card,\s*color: on \? T\.accent : S\.ink,\s*borderRadius: 999, padding: "8px 13px"/.test(src),
  "PillGroup's unselected background is theme-aware");
ok(/border: "none", background: isOpen \? S\.card : S\.bg, cursor: "pointer",/.test(src),
  "Job Detail's accordion section header is theme-aware");
ok(/const pill = \{\s*display: "flex", alignItems: "center", gap: 6, border: "none",\s*background: S\.soft,/.test(src),
  "Job Board toolbar pill const is theme-aware");
ok(/background: tab === id \? T\.primary : S\.card, color: tab === id \? "#fff" : S\.ink,/.test(src),
  "Insurance Hub tab bar is theme-aware");
ok(/background: kbSys === id \? T\.accentSoft : S\.card, color: kbSys === id \? T\.accent : S\.ink,/.test(src),
  "Insurance Hub search-system filter is theme-aware");
ok(/background: hi === i \? T\.accentSoft : S\.card,\s*borderTop: i \? `1px solid \$\{S\.line\}` : "none",/.test(src),
  "AddressAutocomplete dropdown rows are theme-aware");
ok(/background: "var\(--rl-green-bg\)", borderRadius: 10, padding: "9px 0", textAlign: "center" \}\}>\s*<div style=\{\{ fontSize: 18, fontWeight: 800, color: "var\(--rl-green-fg\)" \}\}>\{posted\}/.test(src),
  "Dashboard Reviews 'posted' tile is theme-aware");
ok(/background: "var\(--rl-amber-bg\)", borderRadius: 10, padding: "9px 0", textAlign: "center" \}\}>\s*<div style=\{\{ fontSize: 18, fontWeight: 800, color: "var\(--rl-amber-fg\)" \}\}>\{awaiting\}/.test(src),
  "Dashboard Reviews 'awaiting' tile is theme-aware");
ok(/height: 7, background: S\.soft, borderRadius: 99 \}\}>/.test(src), "Dashboard pipeline progress track is theme-aware");
ok(/flex: 1, height: 18, background: S\.soft, borderRadius: 6, overflow: "hidden" \}\}>/.test(src),
  "Performance stage-distribution progress track is theme-aware");
ok(/flex: 1, border: `1px solid \$\{S\.line\}`, background: S\.card,\s*borderRadius: 8, padding: "7px 0", fontSize: 13, fontWeight: 600, color: S\.sub, cursor: "pointer",\s*display: "flex", alignItems: "center", justifyContent: "center", gap: 6,\s*\}\}>\s*<ArrowUpDown size=\{13\} \/> Move/.test(src),
  "Job Board card 'Move' button is theme-aware");
ok(/background: disabled \? S\.soft : S\.card, color: disabled \? "#C7CBD1" : T\.accent,/.test(src),
  "Job Overview quick-action buttons (Call/Text/Directions/Upload) are theme-aware");

if (fails) { console.log("\nbuild 47: " + fails + " FAILED"); process.exit(1); }
console.log("build 47 tests passed");
