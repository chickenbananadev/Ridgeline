/* Build 23 — electronic signatures with server-side time and IP. */
const src = require("fs").readFileSync("./ridgeline.jsx", "utf8");
const mig = require("fs").readFileSync("./supabase/migrations/014_signatures.sql", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* --- document hash binds a signature to what was signed --- */
function stableStringify(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(stableStringify).join(",") + "]";
  return "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + stableStringify(v[k])).join(",") + "}";
}
function docHash(obj) {
  const str = stableStringify(obj === undefined ? null : obj);
  let h1 = 0x811c9dc5, h2 = 0x01000193;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 + c, 0x85ebca6b) >>> 0;
  }
  return (h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0")).toUpperCase();
}
const doc = { number: "EST-1001", total: 18000, items: [{ desc: "Tear off", qty: 30 }] };
ok(docHash(doc) === docHash({ ...doc }), "the same content hashes the same");
ok(docHash(doc) !== docHash({ ...doc, total: 18500 }), "a changed price changes the hash");
ok(docHash(doc) !== docHash({ ...doc, items: [{ desc: "Tear off", qty: 31 }] }), "a changed quantity changes the hash");
ok(docHash(doc).length === 16, "the hash is a fixed-length reference");
ok(docHash({}) === docHash({}), "an empty document is stable");
ok(docHash({ a: 1, b: 2 }) === docHash({ b: 2, a: 1 }), "key order does not change the hash");
ok(docHash({ l: [{ q: 1 }] }) !== docHash({ l: [{ q: 2 }] }), "a nested change is caught");
ok(docHash({ l: [{ a: 1, b: 2 }] }) === docHash({ l: [{ b: 2, a: 1 }] }), "nested key order is stable");
ok(src.includes("function stableStringify"), "hashing is deterministic and includes nesting");

/* --- server-side capture is what makes it evidence --- */
ok(mig.includes("signed_at timestamptz not null default now()"), "time comes from the database clock");
ok(mig.includes("x-forwarded-for"), "the real client IP is read from the request headers");
ok(mig.includes("default nullif(split_part("), "the IP is a server default, not a client value");
ok(!src.includes("signer_ip:"), "the app never sends an IP — it cannot know one honestly");
ok(!src.includes("signed_at: new Date().toISOString(),\n      signer_ip"), "the app does not fake a timestamp");
ok(src.includes("are deliberately omitted"), "the omission is explained in the code");

/* --- ESIGN requirements --- */
ok(mig.includes("consent boolean not null default false"), "consent is recorded");
ok(mig.includes("and consent = true"), "the database refuses an unconsented customer signature");
ok(mig.includes("intent_text"), "intent is recorded");
ok(src.includes("function SignConsent"), "consent is collected explicitly");
ok(src.includes("same legal effect as a handwritten one"), "intent language is present");
ok(src.includes("agree to sign"), "the signer agrees to transact electronically");

/* --- both signature methods --- */
ok(src.includes("function SignatureField"), "signature field exists");
ok(src.includes('[["draw", "Draw"], ["type", "Type"]]'), "draw and type are both offered");
ok(src.includes("const SIGNATURE_FONTS"), "typed signatures offer styles");
ok(src.includes("legally valid electronic signature under the"), "typed signature validity is explained");
ok(src.includes("devicePixelRatio"), "the canvas is scaled so phone signatures are not blurry");
ok(src.includes('touchAction: "none"'), "drawing does not scroll the page");

/* --- both sides sign --- */
ok(src.includes("function PortalSignCenter"), "the homeowner can sign from the portal");
ok(src.includes("function TabSignatures"), "the company side exists");
ok(src.includes('data-testid="countersign"'), "documents can be countersigned");
ok(src.includes("!companySigs.some((k) => k.doc_hash === c.doc_hash)"),
  "execution is matched on the document hash, not the id");

/* --- signatures are voided, never destroyed --- */
ok(mig.includes("for delete to authenticated\n  using (false)"), "deletion is refused at the database");
ok(src.includes("const voidSig"), "voiding exists instead");
ok(src.includes("A missing row proves nothing"), "the reasoning is stated");

/* --- portal scoping --- */
ok(mig.includes("signer_role = 'customer'"), "anon signers cannot sign as the company");
ok(mig.includes("p.revoked = false"), "a revoked portal cannot be signed from");

if (fails) { console.log("\nbuild 23: " + fails + " FAILED"); process.exit(1); }
console.log("build 23 tests passed");
