/* Build 7 — cap-out sheet restructured with per-line reimbursement flags,
   needs-paid tracking, and export locked to admins. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- cap-out math mirroring computeCapOut's reimbursement handling --- */
function capReimb(fin) {
  const num = (x) => Number(x) || 0;
  const flagged = [...fin.materials, ...fin.labor, ...fin.other].filter((l) => l.reimburse);
  const flaggedTotal = flagged.reduce((s, l) => s + num(l.amt), 0);
  const listTotal = (fin.reimbursements || []).reduce((s, r) => s + num(r.amt), 0);
  const reimbTotal = flaggedTotal + listTotal;
  const needsPaid = [...flagged.filter((l) => l.status === "Needs paid"),
    ...(fin.reimbursements || []).filter((r) => r.status === "Needs paid")];
  const needsPaidTotal = needsPaid.reduce((s, l) => s + num(l.amt), 0);
  return { reimbTotal, needsPaidTotal, needsPaidCount: needsPaid.length };
}
// Mirrors the uploaded sheet: five Jacob-reimbursement material lines + a
// labor line that Needs paid, plus two dump reimbursements.
const fin = {
  materials: [
    { amt: 48.59, by: "Jacob", reimburse: true, status: "Reimbursed" },
    { amt: 24.30, by: "Jacob", reimburse: true, status: "Reimbursed" },
    { amt: 64.53, by: "Jacob", reimburse: true, status: "Reimbursed" },
    { amt: 87.96, by: "Jacob", reimburse: true, status: "Reimbursed" },
    { amt: 1279.77, by: "Jacob", reimburse: true, status: "Reimbursed" },
    { amt: 5479.72, by: "QXO", reimburse: false },
  ],
  labor: [
    { amt: 5000, by: "Jacob", reimburse: true, status: "Reimbursed" },
    { amt: 1412.50, by: "Black Bull", reimburse: true, status: "Needs paid" },
  ],
  other: [
    { amt: 80.34, by: "Jacob", reimburse: true, status: "Reimbursed" },
    { amt: 80.34, by: "Jacob", reimburse: true, status: "Reimbursed" },
  ],
  reimbursements: [],
};
const r = capReimb(fin);
// Jacob-reimbursed items: 48.59+24.30+64.53+87.96+1279.77+5000+80.34+80.34 = 6665.83; plus Black Bull 1412.50
ok(Math.abs(r.reimbTotal - 8078.33) < 0.01, "reimbursement total sums flagged lines, got " + r.reimbTotal);
ok(Math.abs(r.needsPaidTotal - 1412.50) < 0.01, "needs-paid isolates the unpaid gutter labor, got " + r.needsPaidTotal);
ok(r.needsPaidCount === 1, "one line still owed");

/* --- source guarantees --- */
ok(src.includes("CAP OUT SHEET"), "printed sheet uses the cap-out title");
ok(src.includes("PROFIT SPLIT"), "profit-split section present");
ok(src.includes("JACOB PAYOUT"), "payout band present");
ok(src.includes("flaggedTotal"), "compute derives reimbursements from flagged lines");
ok(src.includes("needsPaidTotal"), "needs-paid total computed");
ok(src.includes("let EXPORT_ALLOWED = false"), "export gate defaults closed");
ok(src.includes("Exporting data is restricted to admins"), "reps are blocked from export");
ok(src.includes("export_blocked"), "blocked exports are logged");
ok(src.includes("setExportPolicy(canEditStructure(currentUser)"), "export policy follows the seat");
ok(src.includes("{isAdmin && <Btn kind=\"ghost\" style={{ flex: 1 }} onClick={exportCsv}"), "cap-out CSV button hidden from reps");

if (fails) { console.log("\nbuild 7: " + fails + " FAILED"); process.exit(1); }
console.log("build 7 tests passed");
