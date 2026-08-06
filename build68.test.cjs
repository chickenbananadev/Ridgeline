/* Build 68 — configurable BI dashboard, the second of the six "bigger bets"
   from the competitive gap analysis. The gap-analysis doc itself flagged
   this as "build only if actually requested" since real widget-level
   customization is open-ended scope; asked directly, the owner wants a
   real widget board: add/remove, reorder, resize, saved per seat.

   Scope decision: true pointer drag-and-drop uses the HTML5 DnD API, which
   does not fire on touch devices at all — and this app is mobile-first
   (bottom tab bar, phone-shaped screens throughout). Reorder/resize/remove
   controls follow the same up/down-arrow convention already used for the
   Workflow editor's stage reordering (arrowBtn, move(i, delta)) instead,
   so "configurable" actually works on the surface reps use it from.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

ok(/const WIDGET_DEFS = \[/.test(src),
  "the widget catalog is a single registry, not scattered literals");
ok(/const DEFAULT_DASHBOARD_LAYOUT = \[/.test(src),
  "a rep who never customizes anything gets a sensible default, not a blank board");
ok(/\{ id: "revenue", w: 1 \}, \{ id: "gross", w: 1 \}, \{ id: "closeRate", w: 1 \},/.test(src),
  "the default board mirrors the fixed Summary tab, so nobody's numbers change just because this shipped");

ok(/async function dashLoadLayout\(userId\) \{/.test(src) && /async function dashSaveLayout\(userId, value\) \{/.test(src),
  "layout persistence exists as standalone load/save functions");
ok(/crm_user_integrations.*dashLayout|dashLayout.*crm_user_integrations/s.test(src.slice(src.indexOf("async function dashLoadLayout"), src.indexOf("async function dashSaveLayout") + 800)),
  "the layout rides in the existing crm_user_integrations JSON column — no new table or migration needed");

ok(/const \[layout, setLayout\] = useState\(DEFAULT_DASHBOARD_LAYOUT\);/.test(src),
  "the board state starts from the shared default");
ok(/const \[editingBoard, setEditingBoard\] = useState\(false\);/.test(src),
  "the board opens in view mode, not mid-edit");
ok(/if \(!currentUser \|\| !currentUser\.id\) return;\s*\n\s*const saved = await dashLoadLayout\(currentUser\.id\);/.test(src),
  "on mount, this seat's own saved layout is loaded rather than always showing the default");
ok(/const moveWidget = \(i, dir\) => \{/.test(src),
  "reordering is a real function, not inlined per-button logic that would drift between the up and down buttons");
ok(/const toggleWidgetWidth = \(id\) => saveLayout\(layout\.map\(\(w\) => \(w\.id === id \? \{ \.\.\.w, w: w\.w === 2 \? 1 : 2 \} : w\)\)\);/.test(src),
  "resizing flips exactly the one widget touched, leaving every other widget's width untouched");
ok(/const removeWidget = \(id\) => saveLayout\(layout\.filter\(\(w\) => w\.id !== id\)\);/.test(src),
  "removing a widget takes it off the board rather than merely hiding it (so it reappears in the add-picker)");
ok(/const addWidget = \(id\) => \{/.test(src) && /if \(!def \|\| layout\.some\(\(w\) => w\.id === id\)\) return;/.test(src),
  "adding an already-present widget is a no-op instead of duplicating it on the board");

ok(/\["summary", "Summary"\], \["dashboard", "My dashboard"\],/.test(src),
  "the customizable board is its own tab, sitting next to the fixed Summary rather than replacing it");
ok(/\{tab === "dashboard" && \(/.test(src),
  "the tab actually renders something");
ok(/const renderWidget = \(id\) => \{/.test(src) && /switch \(id\) \{/.test(src),
  "widget rendering is centralized so the catalog and the renderer can't silently drift apart");
ok(/const visibleLayout = layout\.filter\(\(w\) => \{/.test(src) && /return def && \(!def\.adminOnly \|\| isAdmin\);/.test(src),
  "a rep never sees an admin-only widget even if it's sitting in a stale saved layout from when they had that role");
ok(/const availableWidgets = WIDGET_DEFS\.filter\(\(d\) => \(!d\.adminOnly \|\| isAdmin\) && !layout\.some\(\(w\) => w\.id === d\.id\)\);/.test(src),
  "the add-widget picker never offers a widget that's already on the board, or an admin widget to a rep");

/* ---------- behavioural ---------- */
const scratch = path.join(__dirname, "_b68.jsx");
const bundle = path.join(__dirname, "_b68.cjs");
fs.writeFileSync(scratch, src + "\nexport { WIDGET_DEFS, DEFAULT_DASHBOARD_LAYOUT };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b68.cjs");

ok(Array.isArray(m.WIDGET_DEFS) && m.WIDGET_DEFS.length >= 10,
  "the catalog has a real number of widgets, not a token one or two");
ok(m.WIDGET_DEFS.every((d) => d.id && d.title && (d.w === 1 || d.w === 2)),
  "every catalog entry is fully specified — an incomplete entry would render blank or crash the switch");
ok(new Set(m.WIDGET_DEFS.map((d) => d.id)).size === m.WIDGET_DEFS.length,
  "no duplicate widget ids in the catalog — a duplicate would make the add-picker and remove button ambiguous");

ok(Array.isArray(m.DEFAULT_DASHBOARD_LAYOUT) && m.DEFAULT_DASHBOARD_LAYOUT.length > 0,
  "the default layout is non-empty");
const catalogIds = new Set(m.WIDGET_DEFS.map((d) => d.id));
ok(m.DEFAULT_DASHBOARD_LAYOUT.every((w) => catalogIds.has(w.id)),
  "every widget in the default layout actually exists in the catalog — a stale id would silently render nothing");
ok(!m.DEFAULT_DASHBOARD_LAYOUT.some((w) => {
  const def = m.WIDGET_DEFS.find((d) => d.id === w.id);
  return def && def.adminOnly;
}), "the default board a fresh rep sees never includes an admin-only widget");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 68: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 68 tests passed");
