/* Build 78 — two document-engine bugs from the site audit.

   1. TabMaterials's Print/PDF button called openDoc(..., brand, ...)
      but TabMaterials never received a `brand` prop — a hard
      ReferenceError, confirmed live via page.on('pageerror'), that
      silently produced no document at all. Every sibling Tab in
      JobDetail's switch already receives brand; TabMaterials was the
      one outlier.
   2. The crew-facing Work Order document (workOrderDocHtml) had
      exactly one caller in the whole file — the Materials tab, which
      calls it under the misleading title "Material order" and passes
      crew as null. The Work Order tab itself, which is what actually
      shows this document's data on screen, had no Print/PDF control
      at all despite in-app help text claiming one exists.
*/
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static ---------- */
ok(/function TabMaterials\(\{ job, mut, toast, brand \}\)/.test(src),
  "TabMaterials now declares a brand prop");
ok(/case "materials": return <TabMaterials job=\{job\} mut=\{mut\} toast=\{toast\} brand=\{brand\} \/>;/.test(src),
  "the materials tab's render call site passes brand");

const woStart = src.indexOf('function TabWorkOrder(');
const woEnd = src.indexOf('\nfunction ', woStart + 10);
const woSrc = src.slice(woStart, woEnd > 0 ? woEnd : woStart + 8000);
ok(/Print \/ PDF/.test(woSrc), "TabWorkOrder now has its own Print/PDF control");
ok(/openDoc\(`Work order — \$\{job\.name\}`, brand, workOrderDocHtml\(job, brand, crew\), toast\)/.test(woSrc),
  "it calls openDoc with the real title, brand, and the tab's own crew — not null");

/* Every other Tab component that renders a document already threads
   brand through — confirm TabMaterials matches that convention rather
   than being a special case. */
ok(/case "contract": return \(<>\s*<TabContract job=\{job\} brand=\{brand\}/.test(src), "TabContract passes brand (sanity check on the convention)");
ok(/case "changeorders": return <TabChangeOrders job=\{job\} mut=\{mut\} toast=\{toast\} currentUser=\{currentUser\} brand=\{brand\}/.test(src),
  "TabChangeOrders passes brand (sanity check on the convention)");

/* ---------- behavioral ---------- */
const scratch = path.join(__dirname, "_b78.jsx");
const bundle = path.join(__dirname, "_b78.cjs");
fs.writeFileSync(scratch, src + "\nexport { workOrderDocHtml };\n");
const { execSync } = require("child_process");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);
const m = require("./_b78.cjs");

const job = {
  name: "Rob Kennard", address: "123 Main St", schedDate: "Aug 10",
  measurements: { squares: "24", pitch: "6/12" }, workOrder: { number: "WO-104" },
};
const brand = { phone: "555-0100" };
const withCrew = m.workOrderDocHtml(job, brand, { name: "Hillwood Contractors" });
ok(withCrew.includes("Hillwood Contractors"), `passing a real crew renders its name on the document (got: ${withCrew.slice(0, 300)})`);
const withoutCrew = m.workOrderDocHtml(job, brand, null);
ok(!withoutCrew.includes("Crew:"), "a null crew (unassigned job) omits the Crew line rather than crashing");
ok(withCrew.includes("Rob Kennard") && withCrew.includes("WO-104"), "job name and WO number still render");

if (fails) { fs.unlinkSync(bundle); console.log("\nbuild 78: " + fails + " FAILED"); process.exit(1); }
fs.unlinkSync(bundle);
console.log("build 78 tests passed");
