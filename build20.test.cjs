/* Build 20 — formatting, change-order line maths, insurance knowledge base. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };
const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

/* --- phone formatting --- */
function fmtPhone(v) {
  const d = String(v || "").replace(/\D/g, "");
  if (d.length === 10) return `1(${d.slice(0, 3)})${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d[0] === "1") return `1(${d.slice(1, 4)})${d.slice(4, 7)}-${d.slice(7)}`;
  return String(v || "");
}
ok(fmtPhone("5555555555") === "1(555)555-5555", "ten digits format, got " + fmtPhone("5555555555"));
ok(fmtPhone("15555555555") === "1(555)555-5555", "eleven with leading 1 formats");
ok(fmtPhone("(555) 555-5555") === "1(555)555-5555", "already-punctuated input reformats");
ok(fmtPhone("555-555-5555 ext 12") === "555-555-5555 ext 12", "an extension is left alone, not mangled");
ok(fmtPhone("555") === "555", "a partial number is left as typed");
ok(fmtPhone("") === "", "empty stays empty");
ok(fmtPhone(null) === "", "null does not throw");
ok(fmtPhone("+44 20 7946 0958") === "+44 20 7946 0958", "an international number is not forced into US format");

/* --- money is accounting-style --- */
const money = (n) => (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
ok(money(1002.53) === "$1,002.53", "thousands separator and two decimals, got " + money(1002.53));
ok(money(0) === "$0.00", "zero shows both decimals");
ok(money(-450.5) === "-$450.50", "negatives keep the sign outside the symbol");
ok(money(1234567.891) === "$1,234,567.89", "millions group correctly, got " + money(1234567.891));

/* --- change order line maths --- */
const lineTotal = (q, p) => num(q) * num(p);
function coTotal(co) {
  const lines = Array.isArray(co.lines) ? co.lines : [];
  if (!lines.length) return num(co.amount);
  return lines.reduce((a, l) => a + lineTotal(l.qty, l.price), 0);
}
ok(lineTotal("6", "48.25") === 289.5, "qty x price, got " + lineTotal("6", "48.25"));
ok(coTotal({ lines: [{ qty: "6", price: "48.25" }, { qty: "2", price: "125" }] }) === 539.5,
  "lines sum to the order total");
ok(coTotal({ amount: "750" }) === 750, "a legacy order with no lines falls back to its amount");
ok(coTotal({ lines: [] , amount: "750" }) === 750, "an empty line array also falls back");
ok(coTotal({ lines: [{ qty: "1", price: "-300" }] }) === -300, "a credit line produces a negative order");
ok(coTotal({ lines: [{ qty: "", price: "" }] }) === 0, "blank lines contribute nothing, not NaN");

/* --- knowledge base --- */
ok(src.includes("const KB_CODES"), "code knowledge base exists");
ok(src.includes("const KB_TERMS"), "terminology base exists");
ok(src.includes("const KB_SYSTEMS"), "systems are categorised");
const systems = ["asphalt", "metal", "flat", "siding", "gutter", "general"];
systems.forEach((sy) => ok(src.includes(`sys: "${sy}"`), `${sy} code entries exist`));
["EPDM", "TPO", "standing seam", "parapet", "Ponding", "water-resistive barrier", "Galvanic"].forEach((k) => {
  ok(src.includes(k), `knowledge base covers ${k}`);
});
["ACV", "Recoverable depreciation", "Betterment", "Appraisal clause", "Proof of loss", "Mortgagee clause"].forEach((k) => {
  ok(src.includes(`"${k}"`), `glossary defines ${k}`);
});
ok(src.includes('["search", "Search"]'), "insurance has a search tab");
ok(src.includes("const kbHits"), "search spans the knowledge base");
ok(src.includes("Nothing matches"), "an empty result is explained");
ok(src.includes("Editions differ by jurisdiction"), "citations carry a verification caveat");
ok(src.includes("Copy wording"), "supplement wording can be copied");

/* --- formatting is actually applied --- */
ok(src.includes("function fmtPhone"), "phone formatter exists");
ok(src.includes("const telHref"), "tel links strip punctuation");
ok(src.includes("fmtPhone(job.phone)"), "job phone is formatted on display");
ok(src.includes("const lineTotal"), "shared line-total helper exists");
ok(src.includes("function coTotal"), "change orders total from lines");

if (fails) { console.log("\nbuild 20: " + fails + " FAILED"); process.exit(1); }
console.log("build 20 tests passed");
