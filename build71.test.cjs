/* Build 71 — the print/PDF pipeline and the customer-signature integrity
   fix. Two very different bugs that both came out of the same batch of
   live feedback: (5) the contract PDF, and every other document in the
   app, silently failed to print because the iframe fallback tier called
   print() after an arbitrary delay that broke the browser's
   user-activation window; (8/9) a rep could sign a contract or estimate
   on the customer's behalf from inside the app, with none of the
   consent/IP/timestamp provenance the already-built portal signing path
   (PortalSignCenter -> crm_signatures) has always had. */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- Fix 5: print/PDF timing ---------- */
ok(!/setTimeout\(done, 400\);/.test(src),
  "the blind 400ms delay before print() is gone — that's what broke the browser's user-activation window");
ok(/frame\.addEventListener\("load", done, \{ once: true \}\);/.test(src),
  "print() now fires off the iframe's own load event — the earliest real signal the written document is ready, not a guessed delay");
ok((() => {
  const idx = src.indexOf('frame.addEventListener("load", done, { once: true });');
  if (idx < 0) return false;
  const nearby = src.slice(idx, idx + 200);
  return /doc\.open\(\); doc\.write\(html\); doc\.close\(\);/.test(nearby);
})(), "the load listener is attached before the document is written/closed, so it can't miss the load event firing");

/* ---------- Fix 8: no internal client-signing ---------- */
ok(!/setSigFor\("client"\)/.test(src),
  "nothing in TabContract can open the signature pad for the Client line anymore");
ok(!/setSigOpen\(true\)/.test(src) && !/\[sigOpen, setSigOpen\]/.test(src),
  "TabEstimate's internal 'Client signature' button and its state are both gone, not just hidden");
ok(/onSign \? \(/.test(src) && /portalPrompt/.test(src),
  "SigLine falls back to a portal-pointing message when no onSign handler is passed, instead of always rendering a clickable Sign-here button");
ok(/const \[sigFor, setSigFor\] = useState\(null\); \/\/ "contractor" — the client line signs via the portal now/.test(src),
  "sigFor's own comment reflects that it's contractor-only now, so a future reader isn't misled by stale documentation");
ok(/title="Company signature"/.test(src) && !/title=\{sigFor === "client" \? "Client signature" : "Company signature"\}/.test(src),
  "the remaining SignaturePad is unconditionally titled for the company side — it never had a client mode to begin with anymore");

/* ---------- Fix 9: acknowledgment initials carry real provenance ---------- */
ok(/const \[initials, setInitials\] = useState\(\{ owner: "", hoa: "", cancel: "" \}\);/.test(src),
  "PortalSignCenter collects the three acknowledgment initials as real state, not an afterthought");
ok(/needsInitials: con\.form === "agreement",/.test(src),
  "the initials fields only appear for the construction-agreement form — the plain contract never had these paragraphs to acknowledge");
ok(/openDoc\.needsInitials[\s\S]{0,40}\{ \.\.\.openDoc\.snapshot, initials: \{ owner: initials\.owner\.trim\(\), hoa: initials\.hoa\.trim\(\), cancel: initials\.cancel\.trim\(\) \} \}/.test(src),
  "a customer's typed initials travel inside the SAME signed snapshot as their signature — one provenance record, not a second unverified one");
ok(/const custInitials = \(signing\.doc_snapshot && signing\.doc_snapshot\.initials\) \|\| null;/.test(src),
  "the countersign step reads the initials back out of the customer's own signed snapshot");
ok(/ownerInit1: custInitials\.owner \|\| \(j\.agreement \|\| \{\}\)\.ownerInit1 \|\| "",/.test(src),
  "countersigning writes the portal-verified initials onto job.agreement — the exact field agreementDocHtml already prints from");
ok(/const InitialsStatus = \(\{ value \}\) => /.test(src),
  "the internal Contract screen shows initials status via a dedicated component rather than an inline editable input");
ok(!/onChange=\{\(e\) => set\("ownerInit1", e\.target\.value\)\}/.test(src) &&
   !/onChange=\{\(e\) => set\("ownerInit2", e\.target\.value\)\}/.test(src) &&
   !/onChange=\{\(e\) => set\("cancelInit", e\.target\.value\)\}/.test(src),
  "none of the three initials fields are directly rep-editable in AgreementForm anymore");

/* ---------- behavioural: print's activation-safe wiring ---------- */
const scratch = path.join(__dirname, "_b71.jsx");
const bundle = path.join(__dirname, "_b71.cjs");
fs.writeFileSync(scratch, src + "\nexport { openDoc };\n");
execSync(`npx esbuild ${scratch} --loader:.jsx=jsx --jsx=automatic --bundle --external:react --external:react-dom ` +
  `--external:lucide-react --external:pdfjs-dist/* --external:pdf-lib --format=cjs --outfile=${bundle}`, { stdio: "pipe" });
fs.unlinkSync(scratch);

/* A minimal DOM stub: window.open always fails (forcing the iframe
   tier), and the iframe's load event fires print() synchronously off
   document.close() the same way real browsers do for document.write. */
const calls = [];
global.window = {
  open: () => null,
};
global.document = {
  body: {
    appendChild(el) {
      // Simulate the browser: writing + closing the document fires load.
      queueMicrotask(() => el.dispatchEvent({ type: "load" }));
    },
    removeChild() {},
  },
  createElement(tag) {
    const listeners = {};
    const el = {
      tagName: tag,
      style: {},
      setAttribute() {},
      addEventListener(type, cb) { (listeners[type] = listeners[type] || []).push(cb); },
      dispatchEvent(evt) { (listeners[evt.type] || []).forEach((cb) => cb(evt)); },
      contentWindow: {
        document: {
          open() {}, write() {}, close() {},
        },
        focus() { calls.push("focus"); },
        print() { calls.push("print"); },
      },
    };
    return el;
  },
};
global.setTimeout = (fn, ms) => { if (ms >= 1000) return 0; fn(); return 0; }; // let the 60s cleanup timer no-op in this stub, run everything else
global.Blob = function () {};
global.URL = { createObjectURL: () => "" };

const m = require("./_b71.cjs");
m.openDoc("Test", { company: "Co" }, "<p>x</p>", () => {}, {});
/* Give the queued microtask (the simulated load event) a chance to run. */
setImmediate(() => {
  ok(calls.includes("print"), "print() is actually invoked once the iframe's document finishes loading");
  fs.unlinkSync(bundle);
  if (fails) { console.log("\nbuild 71: " + fails + " FAILED"); process.exit(1); }
  console.log("build 71 tests passed");
});
