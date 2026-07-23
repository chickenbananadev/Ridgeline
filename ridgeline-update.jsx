import { useState, useMemo } from "react";
import {
  Shield, CheckCircle2, ChevronRight, ChevronLeft, Lock,
  DollarSign, Search, ExternalLink, Camera, Lightbulb,
  ClipboardList, AlertTriangle, Scale, LogOut, Landmark,
} from "lucide-react";

/* ================================================================
   SUPREME CRM — UPDATE MODULE
   Commission structures (role-gated) · Code Verify · Insurance Resources
   Merges into supreme-crm.jsx. Brand + style tokens match the master.
   ================================================================ */

const BRAND = {
  company: "Supreme Building Group",
  short: "SBG",
  slogan: "Committed to Supreme Quality and Results",
  primary: "#28373E",
  accent: "#1B6DE0",
  accentSoft: "#EAF2FD",
};

const S = {
  ink: "#111418",
  sub: "#5B6470",
  line: "#E6E8EC",
  bg: "#F5F6F8",
  green: "#177245",
  greenSoft: "#E9F5EE",
  red: "#B3261E",
  redSoft: "#FBEAE9",
  gold: "#8A6D1A",
  goldSoft: "#FBF6E7",
};

/* ---------------- users & roles ---------------- */
const USERS = [
  { id: "u1", name: "Jacob Henderson", role: "admin", title: "Owner / Admin" },
  { id: "u2", name: "Drew Klass", role: "rep", title: "Sales Rep" },
  { id: "u3", name: "Stephen Klein", role: "rep", title: "Sales Rep" },
  { id: "u4", name: "Steven Tatgenhorst", role: "rep", title: "Sales Rep" },
];

/* ---------------- commission structures ----------------
   Structure selection is ADMIN-ONLY. Reps see results, never the lever.
   - netProfit:   commission = rate% x (contract - COGS - overhead% x contract)
   - grossProfit: commission = rate% x (contract - COGS)
   - tenFiftyFifty: 10% of contract off the top to company overhead,
                    remaining profit split 50/50 rep / company
   - grossContract: commission = rate% x contract
--------------------------------------------------------- */
const STRUCTURES = [
  { id: "netProfit", label: "Net Profit", usesRate: true, usesOverhead: true,
    blurb: "Rate x (contract − COGS − overhead allocation). Overhead % of contract is set below." },
  { id: "grossProfit", label: "Gross Profit", usesRate: true, usesOverhead: false,
    blurb: "Rate x (contract − COGS). No overhead allocation before the split." },
  { id: "tenFiftyFifty", label: "10 / 50 / 50", usesRate: false, usesOverhead: false,
    blurb: "10% of contract off the top to company overhead, then remaining profit split 50/50 rep and company." },
  { id: "grossContract", label: "Gross Contract", usesRate: true, usesOverhead: false,
    blurb: "Rate x total contract value, regardless of job cost." },
];

const money = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct1 = (n) => `${n.toFixed(1)}%`;
const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

function computeCommission(fin) {
  const cogs = fin.materials + fin.labor + fin.other;
  const gross = fin.contract - cogs;
  const overheadAlloc = fin.contract * (fin.overheadPct / 100);
  const net = gross - overheadAlloc;
  let commission = 0, base = 0, baseLabel = "";
  switch (fin.structure) {
    case "grossProfit":
      base = gross; baseLabel = "Gross profit";
      commission = Math.max(0, gross) * (fin.rate / 100); break;
    case "netProfit":
      base = net; baseLabel = "Net profit";
      commission = Math.max(0, net) * (fin.rate / 100); break;
    case "tenFiftyFifty": {
      const top = fin.contract * 0.10;
      const remaining = fin.contract - cogs - top;
      base = remaining; baseLabel = "Profit after 10% overhead";
      commission = Math.max(0, remaining) * 0.5; break;
    }
    case "grossContract":
      base = fin.contract; baseLabel = "Contract value";
      commission = fin.contract * (fin.rate / 100); break;
    default: break;
  }
  const reimbTotal = fin.reimbursements.reduce((s, r) => s + r.amt, 0);
  return {
    cogs, gross, overheadAlloc, net, base, baseLabel, commission,
    netCompany: gross - commission,
    grossMargin: fin.contract ? (gross / fin.contract) * 100 : 0,
    reimbTotal, payout: commission + reimbTotal,
  };
}

/* what-if: same job under every structure (admin comparison) */
function compareStructures(fin) {
  return STRUCTURES.map((st) => {
    const f = computeCommission({ ...fin, structure: st.id });
    return { id: st.id, label: st.label, commission: f.commission, netCompany: f.netCompany };
  });
}

const DEMO_JOB = {
  name: "Roger Perry", address: "1428 Maple Grove Dr, Columbus, OH 43235",
  fin: {
    contract: 24800,
    materials: 8120, labor: 5900, other: 640,
    structure: "netProfit", rate: 50, overheadPct: 10,
    reimbursements: [{ id: "r1", label: "Permit fee (out of pocket)", amt: 185, status: "Needs paid" }],
  },
};

/* ================================================================
   CODE VERIFY — OneClickCode-style jurisdiction lookup with links
   to the actual official sources, verification status and dates.
   Production note: swap JURISDICTIONS for a live lookup (OneClickCode
   API or county GIS) — the screen contract stays the same.
   ================================================================ */
const SOURCES = {
  RCO: { name: "Residential Code of Ohio (OAC 4101:8)", url: "https://codes.ohio.gov/ohio-administrative-code/4101:8", publisher: "Ohio Legislative Service Commission — official text" },
  OAC3901: { name: "OAC 3901-1-54 — Unfair Property/Casualty Claims", url: "https://codes.ohio.gov/ohio-administrative-code/rule-3901-1-54", publisher: "Ohio Administrative Code — official text" },
  ORC3951: { name: "ORC Chapter 3951 — Public Insurance Adjusters", url: "https://codes.ohio.gov/ohio-revised-code/chapter-3951", publisher: "Ohio Revised Code — official text" },
  ORC1345: { name: "ORC Chapter 1345 — Consumer Sales Practices (3-day rescission)", url: "https://codes.ohio.gov/ohio-revised-code/chapter-1345", publisher: "Ohio Revised Code — official text" },
  ICC: { name: "ICC Digital Codes (IRC / state editions)", url: "https://codes.iccsafe.org", publisher: "International Code Council" },
  KYDHBC: { name: "Kentucky Dept. of Housing, Buildings & Construction", url: "https://dhbc.ky.gov", publisher: "Commonwealth of Kentucky — code adoption authority" },
  MUNICODE: { name: "Municode Library (IL municipal ordinances)", url: "https://library.municode.com", publisher: "Municipal code hosting — verify adoption + edition" },
};

const PROVISION_TOPICS = [
  { topic: "Re-cover / layers", oh: "RCO R908.3", note: "2+ layers or deteriorated first layer — recover prohibited, full tear-off." , srcOH: "RCO" },
  { topic: "Ice barrier", oh: "RCO R905.1.2", note: "Eave edge to ≥24\" inside the exterior wall line, measured along the slope. 8:12+ slope: 36\" up-slope minimum.", srcOH: "RCO" },
  { topic: "Drip edge", oh: "RCO R905.2.8.5", note: "Required at eaves and rakes on shingle roofs.", srcOH: "RCO" },
  { topic: "Step / counter flashing", oh: "RCO R905.2.8", note: "Flashing sized and installed to prevent water intrusion — reuse of damaged flashing does not comply.", srcOH: "RCO" },
  { topic: "Ventilation", oh: "RCO R806", note: "1/150, or 1/300 balanced intake/exhaust. Reinstalling a non-compliant system on a code-triggered re-roof is a violation.", srcOH: "RCO" },
  { topic: "Underlayment (low slope)", oh: "RCO R905.1.1", note: "Double underlayment required below 4:12 slope.", srcOH: "RCO" },
  { topic: "Fastening", oh: "RCO R905.2.5", note: "4 nails per shingle, 6 in high-wind regions.", srcOH: "RCO" },
  { topic: "Sheathing", oh: "RCO R803", note: "Recovering over unsound sheathing prohibited — deteriorated decking must be replaced.", srcOH: "RCO" },
  { topic: "Matching (insurance reg)", oh: "OAC 3901-1-54(I)(1)(b)", note: "Replacement items must be of like kind and quality with reasonably comparable appearance.", srcOH: "OAC3901" },
];

const CODE_JURISDICTIONS = {
  "43235": { zip: "43235", city: "Columbus", county: "Franklin County", state: "OH",
    codeName: "Residential Code of Ohio (RCO)", codeEdition: "2024 edition", adoption: "Statewide residential code",
    permit: "City of Columbus permit required for re-roofing.",
    inspector: { office: "Columbus Building & Zoning Services", phone: "(614) 645-7433 — verify", address: "111 N Front St, Columbus, OH" },
    sources: ["RCO", "OAC3901"], verified: { status: true, date: "Jul 2026", by: "Office" } },
  "45240": { zip: "45240", city: "Forest Park", county: "Hamilton County", state: "OH",
    codeName: "Residential Code of Ohio (RCO)", codeEdition: "2024 edition", adoption: "Statewide residential code",
    permit: "Roofing permit required for full replacement; verify with the building department.",
    inspector: { office: "Forest Park Building Department", phone: "(513) 595-5200 — verify", address: "1201 W Kemper Rd, Forest Park, OH" },
    sources: ["RCO", "OAC3901"], verified: { status: true, date: "Jul 2026", by: "Office" } },
  "45410": { zip: "45410", city: "Dayton", county: "Montgomery County", state: "OH",
    codeName: "Residential Code of Ohio (RCO)", codeEdition: "2024 edition", adoption: "Statewide residential code",
    permit: "Permit required; Dayton routes residential through regional building services.",
    inspector: { office: "City of Dayton — Division of Building Inspection", phone: "(937) 333-3883 — verify", address: "371 W 2nd St, Dayton, OH" },
    sources: ["RCO", "OAC3901"], verified: { status: true, date: "Jul 2026", by: "Office" } },
  "41056": { zip: "41056", city: "Maysville", county: "Mason County", state: "KY",
    codeName: "Kentucky Residential Code (KRC)", codeEdition: "2018 KRC (2015 IRC-based) — confirm current", adoption: "Statewide residential code",
    permit: "Verify with the Maysville building official before tear-off.",
    inspector: { office: "Maysville Building Inspector", phone: "(606) 564-2504 — verify", address: "216 Bridge St, Maysville, KY" },
    sources: ["KYDHBC", "ICC"], verified: { status: false, date: null, by: null } },
  "60014": { zip: "60014", city: "Crystal Lake", county: "McHenry County", state: "IL",
    codeName: "Adopted by municipality — Crystal Lake ordinance", codeEdition: "Verify adopted IRC edition + local amendments", adoption: "Illinois has no statewide residential code — adoption is municipal",
    permit: "City of Crystal Lake permit required; confirm inspection sequence.",
    inspector: { office: "Crystal Lake Community Development", phone: "(815) 356-3605 — verify", address: "100 W Woodstock St, Crystal Lake, IL" },
    sources: ["MUNICODE", "ICC"], verified: { status: false, date: null, by: null } },
};

/* ================================================================
   INSURANCE RESOURCES — content ported from the Cardinal resource
   pages, rebranded for Supreme. Ohio content validated; the law
   summaries carry a verify-before-relying flag.
   ================================================================ */
const INS_SECTIONS = [
  { id: "law", icon: Scale, title: "Ohio Insurance Law", blurb: "Matching regulation, unfair claims practices, public adjuster rules, and the 3-day rescission." },
  { id: "policy", icon: CheckCircle2, title: "Policy Provisions", blurb: "Ordinance & Law, RCV vs. ACV, matching endorsements — what to check on the dec page." },
  { id: "docs", icon: Camera, title: "Documentation Checklist", blurb: "Per-inspection photo standard, damage-type templates, and the paper trail every claim file needs." },
  { id: "tips", icon: Lightbulb, title: "Claim Tips", blurb: "Scenario playbook — the adjuster shortcut and the code cite that answers it. Plus carrier-specific patterns." },
  { id: "dodont", icon: AlertTriangle, title: "Do & Don't", blurb: "Field practices on one side, ways this goes sideways on the other. Split-screen reference." },
  { id: "truck", icon: ClipboardList, title: "Truck Cheat Sheet", blurb: "One-page summary of the three levers, code cites, and the line you don't cross. Print for the truck." },
];

const LAW_ITEMS = [
  { title: "Matching — OAC 3901-1-54(I)(1)(b)", body: "When replacement of an item results in a mismatch, the carrier owes replacement of items in the area so the result is of like kind and quality with reasonably comparable appearance. This is the lever behind full-slope and full-roof arguments when the shingle is discontinued or the field is heavily weathered.", src: "OAC3901" },
  { title: "Unfair claims practices — OAC 3901-1-54", body: "Carriers must acknowledge communications promptly, conduct a reasonable investigation before denying, and pay undisputed amounts timely. A supplement declined without inspection or a denial without documented basis runs against this rule — cite it in escalation letters, not in driveway arguments.", src: "OAC3901" },
  { title: "Public adjusters — ORC Chapter 3951", body: "Negotiating coverage or settlement on the homeowner's behalf requires a public adjuster license. Supreme documents damage and provides its own scope — it does not negotiate the claim. That work belongs to a licensed public adjuster or an attorney.", src: "ORC3951" },
  { title: "3-day right of rescission — ORC Chapter 1345", body: "A contract signed at the home (a home solicitation sale) carries a 3-business-day cancellation right, and the notice must appear in the contract. Don't start work or order materials inside the window without a documented waiver where permitted.", src: "ORC1345" },
];

const POLICY_CARDS = [
  { title: "Ordinance & Law Coverage", body: "Often listed as Coverage D or Increased Cost of Construction on HO-3 policies. Pays for costs incurred to bring the property into current code compliance as part of a covered loss. Without it, the carrier only owes the pre-loss condition — code-required upgrades come out of the homeowner's pocket.",
    callout: { label: "Check for", text: "percentage of Coverage A dwelling amount (10%, 25%, 50%), or a flat dollar limit. Some policies exclude it entirely, some include it automatically. If absent, decking replacement and ventilation upgrades required by code become the homeowner's cost." } },
  { title: "RCV vs ACV Settlement", body: "Replacement Cost Value: carrier pays the full cost to replace with like kind and quality, minus deductible. Depreciation is initially withheld and released upon completion of the work. Actual Cash Value: carrier pays RCV minus depreciation. Depreciation is not recoverable.",
    callout: { label: "Common trap", text: "A roof-age endorsement can convert an otherwise-RCV policy to ACV on the roof specifically after a certain roof age (often 15 or 20 years). Homeowner may not know this. Read the endorsement pages, not just the declarations." } },
  { title: "Matching Endorsement", body: "Some carriers offer an optional endorsement that expands the state matching regulation and explicitly requires uniform-appearance repairs including full replacement of undamaged sections when necessary. Others explicitly limit matching to a single slope or single side of a wall.",
    callout: { label: "Check for", text: "\"matching,\" \"uniform appearance,\" \"cosmetic\" language in the policy schedule and any endorsements. Some carriers add a cosmetic-damage exclusion that specifically strips matching for hail spatter without functional damage." } },
];

const DOC_STANDARD = [
  ["Ground shots of all elevations", "establishes property identity, general condition."],
  ["Shingle layer count", "edge photo showing visible layers."],
  ["Test square", "chalked 10x10 for hail, hit count per slope."],
  ["Damage close-ups", "ruler or coin in frame for scale."],
  ["Ventilation type & condition", "ridge, box, gable, power. Soffit intake status."],
  ["Flashing condition", "step, wall, chimney, skylight, pipe boots."],
  ["Gutter line", "downspouts for granule accumulation."],
  ["Attic access", "decking from below, insulation depth, ventilation from inside, active leaks."],
  ["Related property damage", "siding, screens, HVAC, gutters, fascia, soffit, downspouts. Photograph even if not this claim's scope."],
  ["Date & time stamp", "on all photos."],
];

const DOC_TEMPLATES = [
  { type: "Hail", items: [
    "One overall of each slope from ground.",
    "One chalked 10x10 test square per slope with hit count written on chalk or paper card in frame.",
    "Close-up of representative impact showing fractured mat, granule displacement, and matted circular pattern — ruler in frame for scale.",
    "Ridge/hip cap close-up if impacted — hail rounds often show best on ridges.",
    "Soft metals for corroboration: gutter, downspout elbow, vent hood, cap flashing, HVAC fins, screens, garage door.",
  ]},
  { type: "Wind", items: [
    "Missing shingle areas photographed with something for scale.",
    "Lifted/creased shingles — from the side showing the crease line.",
    "Seal strip failure — underside of lifted shingle showing broken seal.",
    "Ridge cap displacement patterns.",
    "Overall pattern shot showing directional damage consistent with wind vector.",
  ]},
  { type: "Water intrusion (from a storm event)", items: [
    "Interior ceiling staining with dated photo.",
    "Attic sheathing staining, streak marks, mold.",
    "Insulation compression at leak locations.",
    "Corresponding exterior condition — failed flashing, missing shingle, damaged boot.",
  ]},
];

const CLAIM_SCENARIOS = [
  { q: "\u201CWe'll only pay for the damaged slope\u201D",
    setup: "Adjuster acknowledges wind or hail damage but scopes only the affected slope, leaving the other slopes with the original shingles.",
    answer: [
      "If shingle line is discontinued or field is significantly weathered, cite OAC 3901-1-54(I)(1)(b) — reasonably comparable appearance.",
      "Document color-match failure with photos of a manufacturer sample vs field shingles under matched lighting.",
      "If the roof has 2+ layers, cite RCO R908.3 — recover is prohibited, so partial replacement on top of the existing bottom layer is not code-compliant either.",
    ]},
  { q: "\u201CJust layer new shingles over the existing\u201D",
    setup: "Adjuster proposes an overlay to save money.",
    answer: [
      "Count the layers. If two or more, cite RCO R908.3 — recover is not permitted.",
      "If first layer is water-damaged, cite same section — unsuitable base prohibits recover regardless of layer count.",
      "Point out that a code violation is a policy problem for the carrier: the homeowner would be occupying a non-code-compliant structure funded by the claim.",
    ]},
  { q: "\u201CDecking replacement is not covered\u201D",
    setup: "Deteriorated decking is discovered during tear-off. Adjuster wants to exclude it as maintenance.",
    answer: [
      "If the policy has Ordinance & Law (Coverage D), deck replacement required by code is covered under that coverage even if not covered by dwelling coverage.",
      "Cite RCO R908.3 and R803 — recovering over unsound sheathing is prohibited.",
      "Photograph every replaced board with scale, log square footage, submit as supplement with dated photos.",
      "Check the policy declarations page before promising O&L coverage — not every homeowner has it.",
    ]},
  { q: "\u201CA strip of ice & water at the eave is enough\u201D",
    setup: "Adjuster's scope includes ice & water at the drip edge only, not the full 24-inch-past-wall-line coverage.",
    answer: [
      "Cite RCO R905.1.2 — the barrier must extend from the eave edge to a point at least 24 inches inside the exterior wall line, measured along the slope.",
      "Measure the overhang depth: eave-to-wall distance plus 24 inches gives you the required coverage measured up the slope.",
      "Slope 8:12 or steeper needs 36 inches up the slope minimum.",
    ]},
  { q: "\u201CReuse the existing flashings\u201D",
    setup: "Common on step flashings, chimney counter-flashings, and skylight kits.",
    answer: [
      "Cite RCO R905.2.8 — flashings must be sized and installed to prevent water intrusion. Reused flashings damaged during tear-off do not satisfy this requirement.",
      "Photograph the existing condition to preempt the argument: rust, caulk-sealed joints, missing counter-flashing on masonry, undersized step flashing.",
      "New skylight flashing kit is standard scope on any re-roof; the skylight manufacturer's warranty typically requires new flashing with any new roof.",
    ]},
  { q: "\u201CVentilation upgrade is a betterment\u201D",
    setup: "Adjuster excludes new ridge vent, soffit intake, or box vent replacement as an improvement not caused by the loss.",
    answer: [
      "If the existing ventilation is out of compliance with RCO R806 (1/150 or 1/300 balanced), reinstalling the same non-compliant system on a code-triggered re-roof is a code violation.",
      "Ordinance & Law coverage applies if the policy includes it.",
      "If the existing system was itself damaged by the storm (ridge cap blown off, box vent housing hail-struck), that alone is covered damage regardless of code.",
    ]},
  { q: "\u201CIt's just wear and tear\u201D",
    setup: "Adjuster denies hail damage as normal aging or wear, or claims granule loss is not impact-related.",
    answer: [
      "Document impact patterns with the HAAG-style test square (a chalked 10-foot square, count of hits per slope).",
      "Document circular, offset, or spatter patterns distinguishing hail from mechanical or manufacturing defects.",
      "For an aged roof that also has hail impact, granule loss at impact sites (fractured mat under the impact) is diagnostic of storm damage. Photograph in raking light.",
      "Brittleness test on a cool day is more reliable than on hot; document date and temperature.",
      "Request the carrier's engineer report if damage is denied on that basis.",
    ]},
  { q: "\u201CRoof is too old for full replacement value\u201D",
    setup: "Adjuster settles on Actual Cash Value only, or applies a roof-age depreciation schedule that reduces the payment significantly.",
    answer: [
      "Check the policy: does it pay Replacement Cost Value (RCV) with recoverable depreciation, or ACV only? If RCV, the homeowner recovers the withheld depreciation on completion of the work.",
      "Watch for a roof-age endorsement that converts RCV to ACV past a set age — read the endorsement pages.",
      "Document maintained, serviceable condition to push back on aggressive depreciation: no prior leaks, intact flashing, sound decking.",
    ]},
];

const CARRIER_PATTERNS = [
  { title: "Allstate — Cosmetic Damage Endorsement",
    pattern: "Some Allstate HO-3 policies (increasingly, on renewals) include a cosmetic-damage exclusion for hail impact on roofing and metals when the damage does not affect functional performance. Under this endorsement, spatter marks on shingles, dented caps and vents, and minor bruising can be excluded even when clearly caused by hail.",
    answer: [
      "Read the declarations page carefully — the endorsement is often an add-on that's easy to miss.",
      "Document functional impact separately from cosmetic: granule loss, mat exposure, seal-strip failure, reduced service life.",
      "If the roof is otherwise near end of life, cosmetic exclusion + age depreciation can gut the claim; advise the homeowner honestly.",
    ]},
  { title: "Third-Party Administrators & Preferred Networks",
    pattern: "Some carriers (Erie, Nationwide, others) use third-party administrators or \"preferred contractor\" networks whose scopes tend to run below fair-market pricing and whose supplements go to a specific approver rather than the original adjuster. Contractors outside the network are asked to match TPA pricing.",
    answer: [
      "Homeowners are not obligated to use the preferred network. Supreme's price is Supreme's price.",
      "Document with local material and labor comparables. Regional RS Means, Xactimate published rates, and manufacturer MSRPs are all cite-able.",
      "If the TPA declines a supplement without inspection, that's a bad-faith foundation — escalate to the carrier direct.",
    ]},
  { title: "Aggressive Depreciation Schedules",
    pattern: "Some carriers apply steep age-based depreciation to roofs at 10–15 years despite the roof being maintained and in serviceable condition. Recoverable-depreciation withholdings can approach 50% of RCV in extreme cases.",
    answer: [
      "Confirm whether depreciation is recoverable — if it is, completing the work releases it, and the homeowner should know that up front.",
      "Document condition evidence that argues against the schedule: maintenance history, intact granule coverage away from impacts, remaining service life.",
      "Request the depreciation basis in writing when the schedule looks disconnected from actual condition.",
    ]},
];

const DO_ITEMS = [
  ["Document everything, then document more", "Dated photos, test squares, layer counts, attic shots. The adjuster reads what's in the file — make sure the file says what you mean."],
  ["Cite the code, not your opinion", "Every scope argument ties to an RCO section or the OAC matching rule. Print the cite, hand it over, stay friendly."],
  ["Be present at the adjuster meeting", "Walk the roof together, point to the documented damage, agree on the test square counts on site."],
  ["Put supplements in writing with evidence attached", "Line items, code cites, dated photos, measurements. Follow the carrier's supplement channel and log every contact."],
];

const DONT_ITEMS = [
  ["Don't negotiate coverage or settlement", "That is licensed public adjuster or attorney work under ORC Chapter 3951. Supreme documents damage and provides its own scope — nothing more."],
  ["Don't interpret the policy for the homeowner", "Point to the dec page and endorsements, suggest they ask their agent or a public adjuster. Never promise what the policy will pay."],
  ["Don't offer to absorb or rebate the deductible", "Deductible games are insurance fraud exposure for everyone involved, including the homeowner."],
  ["Don't promise claim outcomes to close a deal", "Sell the inspection and the documentation quality. The claim decision belongs to the carrier."],
];

const CHEAT_SHEET = {
  levers: [
    ["2+ layers", "RCO R908.3 forbids recover."],
    ["Deteriorated first layer", "RCO R908.3 forbids recover."],
    ["Shingle discontinued", "OAC 3901-1-54(I)(1)(b) requires reasonably comparable appearance."],
  ],
  scope: [
    ["Ice barrier 24\u2033 past wall line", "RCO R905.1.2"],
    ["New drip edge on all eaves/rakes", "RCO R905.2.8.5"],
    ["New step/counter flashing", "RCO R905.2.8"],
    ["Ventilation to 1/300 balanced", "RCO R806"],
    ["Double underlayment on < 4:12 slope", "RCO R905.1.1"],
    ["4-nail (or 6 in high-wind) fastening", "RCO R905.2.5"],
  ],
  ol: "Ordinance & Law coverage (Coverage D): check the declarations page. Percentage of Coverage A. Pays for code-driven upgrades. If it's not there, decking replacement is on the homeowner.",
  docs: "Documentation minimums: ground of all elevations, layer count at edge, test square per slope, damage close-ups with scale, ventilation type & condition, flashing condition, attic if accessible, dated on every photo.",
  line: "The line you don't cross: Supreme documents damage and provides its own scope. Supreme does not negotiate coverage under the policy. That's public adjuster or attorney work — ORC Chapter 3951.",
};

/* ================================================================
   UI PRIMITIVES
   ================================================================ */
const inputStyle = {
  border: `1px solid ${S.line}`, borderRadius: 10, padding: "10px 12px",
  fontSize: 15, color: S.ink, outline: "none", background: "#fff", width: "100%",
  boxSizing: "border-box", fontFamily: "inherit",
};

function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${S.line}`, borderRadius: 14, padding: 18, ...style }}>
      {children}
    </div>
  );
}
function Chip({ children, tone = "blue" }) {
  const map = {
    blue: [BRAND.accentSoft, BRAND.accent], green: [S.greenSoft, S.green],
    red: [S.redSoft, S.red], gold: [S.goldSoft, S.gold], gray: ["#F0F1F3", S.sub],
  };
  const [bg, fg] = map[tone] || map.blue;
  return (
    <span style={{ background: bg, color: fg, borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
      {children}
    </span>
  );
}
function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: S.ink, letterSpacing: -0.3 }}>{children}</div>
      {sub && <div style={{ fontSize: 13.5, color: S.sub, marginTop: 4, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}
function Row({ label, value, strong, subLabel }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${S.line}` }}>
      <div style={{ paddingRight: 12 }}>
        <div style={{ fontSize: 14, fontWeight: strong ? 800 : 600, color: S.ink }}>{label}</div>
        {subLabel && <div style={{ fontSize: 12, color: S.sub, marginTop: 2 }}>{subLabel}</div>}
      </div>
      <div style={{ fontSize: 14.5, fontWeight: strong ? 800 : 700, color: strong ? BRAND.accent : S.ink, whiteSpace: "nowrap" }}>{value}</div>
    </div>
  );
}
function Callout({ label, children, tone = "gold" }) {
  const fg = tone === "gold" ? S.gold : tone === "red" ? S.red : S.green;
  const bg = tone === "gold" ? S.goldSoft : tone === "red" ? S.redSoft : S.greenSoft;
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${fg}`, borderRadius: 8, padding: "12px 14px", marginTop: 12 }}>
      {label && <div style={{ fontSize: 13, fontWeight: 800, color: fg, marginBottom: 6 }}>{label}</div>}
      <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}
function Bullets({ items }) {
  return (
    <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
      {items.map((t, i) => (
        <li key={i} style={{ fontSize: 14, color: S.ink, lineHeight: 1.55, marginBottom: 6 }}>{t}</li>
      ))}
    </ul>
  );
}
function BackBar({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <button onClick={onBack} style={{
        border: `1px solid ${S.line}`, background: "#fff", borderRadius: 10, width: 36, height: 36,
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      }}><ChevronLeft size={18} color={S.ink} /></button>
      <div style={{ fontSize: 17, fontWeight: 800, color: S.ink }}>{title}</div>
    </div>
  );
}
function SourceLink({ srcId }) {
  const s = SOURCES[srcId];
  if (!s) return null;
  return (
    <a href={s.url} target="_blank" rel="noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
      border: `1px solid ${S.line}`, borderRadius: 999, padding: "6px 12px",
      fontSize: 12.5, fontWeight: 700, color: BRAND.accent, background: "#fff", marginTop: 8, marginRight: 8,
    }}>
      <ExternalLink size={13} /> {s.name}
    </a>
  );
}

/* ================================================================
   LOGIN — pick a user; role drives what the app exposes
   ================================================================ */
function Login({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: BRAND.primary, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Shield size={28} color={BRAND.primary} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.3 }}>{BRAND.company}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{BRAND.slogan}</div>
        </div>
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.sub, padding: "4px 6px 10px" }}>Sign in as</div>
          {USERS.map((u) => (
            <button key={u.id} onClick={() => onLogin(u)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              border: "none", background: "none", cursor: "pointer", padding: "12px 6px",
              borderTop: `1px solid ${S.line}`,
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 999, background: u.role === "admin" ? BRAND.primary : BRAND.accentSoft, color: u.role === "admin" ? "#fff" : BRAND.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>
                {u.name.split(" ").map((p) => p[0]).join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: S.ink }}>{u.name}</div>
                <div style={{ fontSize: 12.5, color: S.sub }}>{u.title}</div>
              </div>
              {u.role === "admin" ? <Chip tone="gray"><Lock size={10} style={{ marginRight: 4, verticalAlign: -1 }} />Admin</Chip> : <ChevronRight size={16} color="#C7CBD1" />}
            </button>
          ))}
        </Card>
        <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 14 }}>
          Role decides what you see. Commission structure controls are admin-only.
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   FINANCIALS — commission structure gated by role
   ================================================================ */
function Financials({ user, fin, setFin }) {
  const isAdmin = user.role === "admin";
  const f = computeCommission(fin);
  const st = STRUCTURES.find((x) => x.id === fin.structure);
  const comparison = useMemo(() => compareStructures(fin), [fin]);

  return (
    <div>
      <SectionTitle sub={`${DEMO_JOB.name} · ${DEMO_JOB.address}`}>Financials</SectionTitle>

      <Card>
        <div style={{ fontSize: 15, fontWeight: 800, color: S.ink, marginBottom: 4 }}>Job numbers</div>
        <Row label="Contract value" value={money(fin.contract)} />
        <Row label="Materials" value={money(fin.materials)} />
        <Row label="Labor" value={money(fin.labor)} />
        <Row label="Other costs" value={money(fin.other)} />
        <Row label="Total COGS" value={money(f.cogs)} />
        <Row label="Gross profit" value={money(f.gross)} subLabel={`Margin ${pct1(f.grossMargin)}`} strong />
      </Card>

      <Card style={{ marginTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>Commission structure</div>
          {!isAdmin && <Chip tone="gray"><Lock size={10} style={{ marginRight: 4, verticalAlign: -1 }} />Set by admin</Chip>}
        </div>

        {isAdmin ? (
          <>
            <select
              value={fin.structure}
              onChange={(e) => setFin({ ...fin, structure: e.target.value })}
              style={{ ...inputStyle, fontWeight: 700, appearance: "auto" }}
            >
              {STRUCTURES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
            </select>
            <div style={{ fontSize: 13, color: S.sub, marginTop: 8, lineHeight: 1.5 }}>{st.blurb}</div>

            {st.usesRate && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <input type="number" value={fin.rate}
                  onChange={(e) => setFin({ ...fin, rate: num(e.target.value) })}
                  style={{ ...inputStyle, width: 90, textAlign: "right" }} />
                <span style={{ fontSize: 14, color: S.sub }}>% of {st.label.toLowerCase()}</span>
              </div>
            )}
            {st.usesOverhead && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <input type="number" value={fin.overheadPct}
                  onChange={(e) => setFin({ ...fin, overheadPct: num(e.target.value) })}
                  style={{ ...inputStyle, width: 90, textAlign: "right" }} />
                <span style={{ fontSize: 14, color: S.sub }}>% of contract allocated to company overhead</span>
              </div>
            )}
          </>
        ) : (
          <div style={{ fontSize: 14, color: S.ink }}>
            <span style={{ fontWeight: 800 }}>{st.label}</span>
            <div style={{ fontSize: 13, color: S.sub, marginTop: 4 }}>
              How commission is calculated is managed by the office. Your numbers below are live for this job.
            </div>
          </div>
        )}
      </Card>

      <Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: S.ink, marginBottom: 4 }}>Payout</div>
        {fin.structure === "netProfit" && (
          <Row label="Overhead allocation" value={money(f.overheadAlloc)} subLabel={`${fin.overheadPct}% of contract`} />
        )}
        {fin.structure === "tenFiftyFifty" && (
          <Row label="Company overhead (10%)" value={money(fin.contract * 0.10)} subLabel="Off the top of contract" />
        )}
        <Row label={f.baseLabel} value={money(f.base)} />
        <Row label="Rep commission" value={money(f.commission)} strong
          subLabel={fin.structure === "tenFiftyFifty" ? "50% of remaining profit" : `${fin.rate}% of ${f.baseLabel.toLowerCase()}`} />
        {isAdmin && <Row label="Net to company" value={money(f.netCompany)} subLabel="Gross profit less commission" />}
        <Row label="Reimbursements" value={money(f.reimbTotal)} subLabel={fin.reimbursements.map((r) => `${r.label} — ${r.status}`).join(" · ")} />
        <Row label="Rep payout" value={money(f.payout)} strong subLabel="Commission + reimbursements" />
      </Card>

      {isAdmin && (
        <Card style={{ marginTop: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>Structure comparison</div>
          <div style={{ fontSize: 13, color: S.sub, marginTop: 2, marginBottom: 6 }}>
            Same job under each model. Admin-only.
          </div>
          {comparison.map((c) => (
            <Row key={c.id} label={c.label} value={money(c.commission)}
              subLabel={`Company keeps ${money(c.netCompany)}`} strong={c.id === fin.structure} />
          ))}
        </Card>
      )}
    </div>
  );
}

/* ================================================================
   CODE VERIFY — zip lookup, official sources, verification status
   ================================================================ */
function CodeVerify() {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const lookup = () => {
    setResult(CODE_JURISDICTIONS[zip.trim()] || null);
    setSearched(true);
  };

  return (
    <div>
      <SectionTitle sub="Look up the adopted code, permit rules, and inspector for a job zip — every citation links to the official source text so it can be verified before it goes in a supplement.">
        Code Verify
      </SectionTitle>

      <Card>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={zip} onChange={(e) => setZip(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="Job zip code" inputMode="numeric"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={lookup} style={{
            background: BRAND.accent, color: "#fff", border: "none", borderRadius: 10,
            padding: "0 18px", fontSize: 14.5, fontWeight: 800, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}><Search size={16} /> Look up</button>
        </div>
        <div style={{ fontSize: 12.5, color: S.sub, marginTop: 10 }}>
          Try 43235, 45240, 45410 (OH) · 41056 (KY) · 60014 (IL)
        </div>
      </Card>

      {searched && !result && (
        <Card style={{ marginTop: 14 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: S.ink }}>No record for that zip yet.</div>
          <div style={{ fontSize: 13.5, color: S.sub, marginTop: 4, lineHeight: 1.5 }}>
            Add the jurisdiction from the county or municipal source, then mark it verified. In production this lookup connects to a live code-data service so any zip resolves automatically.
          </div>
        </Card>
      )}

      {result && (
        <>
          <Card style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: S.ink }}>{result.city}, {result.state} {result.zip}</div>
                <div style={{ fontSize: 13, color: S.sub, marginTop: 2 }}>{result.county} · {result.adoption}</div>
              </div>
              {result.verified.status
                ? <Chip tone="green">Verified {result.verified.date}</Chip>
                : <Chip tone="gold">Needs verification</Chip>}
            </div>
            <div style={{ marginTop: 12 }}>
              <Row label="Adopted code" value="" subLabel={`${result.codeName} — ${result.codeEdition}`} />
              <Row label="Permit" value="" subLabel={result.permit} />
              <Row label="Inspector" value="" subLabel={`${result.inspector.office} · ${result.inspector.phone} · ${result.inspector.address}`} />
            </div>
            <div style={{ marginTop: 6 }}>
              {result.sources.map((sid) => <SourceLink key={sid} srcId={sid} />)}
            </div>
            {!result.verified.status && (
              <Callout label="Before field use" tone="gold">
                Open the official source above, confirm the adopted edition and local amendments, and have the office mark this jurisdiction verified with a date and initials.
              </Callout>
            )}
          </Card>

          {result.state === "OH" && (
            <Card style={{ marginTop: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: S.ink, marginBottom: 2 }}>Provisions for this jurisdiction</div>
              <div style={{ fontSize: 13, color: S.sub, marginBottom: 8 }}>Tap a source chip to open the official text.</div>
              {PROVISION_TOPICS.map((p, i) => (
                <div key={i} style={{ borderTop: `1px solid ${S.line}`, padding: "12px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: S.ink }}>{p.topic}</div>
                    <Chip tone={p.srcOH === "RCO" ? "blue" : "gold"}>{p.oh}</Chip>
                  </div>
                  <div style={{ fontSize: 13.5, color: S.sub, marginTop: 5, lineHeight: 1.5 }}>{p.note}</div>
                  <SourceLink srcId={p.srcOH} />
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
}

/* ================================================================
   INSURANCE RESOURCES — hub + six detail pages
   ================================================================ */
function InsuranceHub({ onOpen }) {
  return (
    <div>
      <SectionTitle sub="Field-ready reference for insurance work in Supreme's markets. Ohio content is validated; law summaries are guidance, not legal advice.">
        Insurance Resources
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {INS_SECTIONS.map((sec) => {
          const Icon = sec.icon;
          return (
            <button key={sec.id} onClick={() => onOpen(sec.id)} style={{
              textAlign: "left", background: "#fff", border: `1px solid ${S.line}`, borderRadius: 14,
              padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: BRAND.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={BRAND.accent} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>{sec.title}</div>
              <div style={{ fontSize: 12.5, color: S.sub, lineHeight: 1.45 }}>{sec.blurb}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: BRAND.accent, display: "flex", alignItems: "center", gap: 4 }}>
                Open <ChevronRight size={14} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LawPage() {
  return (
    <div>
      {LAW_ITEMS.map((it, i) => (
        <Card key={i} style={{ marginTop: i ? 14 : 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>{it.title}</div>
          <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 8 }}>{it.body}</div>
          <SourceLink srcId={it.src} />
        </Card>
      ))}
      <Callout label="Guidance, not legal advice" tone="gold">
        Summaries for field use. Confirm current text at the linked official sources before relying on any of it in a dispute.
      </Callout>
    </div>
  );
}

function PolicyPage() {
  return (
    <div>
      <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }}>
        Three coverages that turn a partial claim into a full one. Check the declarations page and endorsements before making any promises.
      </div>
      {POLICY_CARDS.map((c, i) => (
        <Card key={i} style={{ marginTop: i ? 14 : 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>{c.title}</div>
          <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 8, whiteSpace: "pre-line" }}>{c.body}</div>
          <Callout label={c.callout.label}>{c.callout.text}</Callout>
        </Card>
      ))}
    </div>
  );
}

function DocsPage() {
  return (
    <div>
      <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }}>
        Photos, notes, and paper that make or break a claim. The adjuster reads what's in the file — make sure the file says what you mean.
      </div>
      <Card>
        <div style={{ fontSize: 15, fontWeight: 800, color: S.ink, marginBottom: 8 }}>Per-Inspection Documentation Standard</div>
        {DOC_STANDARD.map(([t, d], i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
            <CheckCircle2 size={17} color={S.green} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 14, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 800, color: S.ink }}>{t}</span>
              <span style={{ color: S.sub }}> — {d}</span>
            </div>
          </div>
        ))}
      </Card>
      <Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: S.ink, marginBottom: 4 }}>Photo Templates by Damage Type</div>
        {DOC_TEMPLATES.map((t, i) => (
          <div key={i} style={{ marginTop: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: S.ink }}>{t.type}</div>
            <Bullets items={t.items} />
          </div>
        ))}
      </Card>
    </div>
  );
}

function TipsPage() {
  return (
    <div>
      <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }}>
        The most common adjuster shortcuts and the code cite that answers each. Plus patterns we see from specific carriers — not accusations, just field observations to prepare for.
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: BRAND.accent, marginBottom: 10 }}>CLAIM SCENARIOS</div>
      {CLAIM_SCENARIOS.map((sc, i) => (
        <Card key={i} style={{ marginTop: i ? 14 : 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: S.ink }}>{sc.q}</div>
          <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.55, marginTop: 6 }}>{sc.setup}</div>
          <Callout label="Answer"><Bullets items={sc.answer} /></Callout>
        </Card>
      ))}
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: BRAND.accent, margin: "20px 0 10px" }}>CARRIER PATTERNS</div>
      {CARRIER_PATTERNS.map((cp, i) => (
        <Card key={i} style={{ marginTop: i ? 14 : 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: S.ink }}>{cp.title}</div>
          <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.55, marginTop: 6 }}>Pattern: {cp.pattern}</div>
          <Callout label="Answer"><Bullets items={cp.answer} /></Callout>
        </Card>
      ))}
    </div>
  );
}

function DoDontPage() {
  return (
    <div>
      <Card style={{ borderTop: `3px solid ${S.green}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: S.green, marginBottom: 6 }}>DO</div>
        {DO_ITEMS.map(([t, d], i) => (
          <div key={i} style={{ padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: S.ink }}>{t}</div>
            <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.5, marginTop: 3 }}>{d}</div>
          </div>
        ))}
      </Card>
      <Card style={{ marginTop: 14, borderTop: `3px solid ${S.red}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: S.red, marginBottom: 6 }}>DON'T</div>
        {DONT_ITEMS.map(([t, d], i) => (
          <div key={i} style={{ padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: S.ink }}>{t}</div>
            <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.5, marginTop: 3 }}>{d}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function TruckPage() {
  return (
    <div>
      <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }}>
        One-card summary for the field. Prints on a single page. Take it in the truck.
      </div>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 800, color: S.ink, marginBottom: 8 }}>Supreme One-Page Field Card</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: S.ink, marginTop: 6 }}>The three levers for full replacement:</div>
        <Bullets items={CHEAT_SHEET.levers.map(([a, b]) => `${a} — ${b}`)} />
        <div style={{ fontSize: 14, fontWeight: 800, color: S.ink, marginTop: 14 }}>Code-required scope adjusters try to strip out:</div>
        <Bullets items={CHEAT_SHEET.scope.map(([a, b]) => `${a} — ${b}`)} />
        <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 14 }}>{CHEAT_SHEET.ol}</div>
        <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 12 }}>{CHEAT_SHEET.docs}</div>
        <Callout label="The line you don't cross" tone="red">{CHEAT_SHEET.line.replace("The line you don't cross: ", "")}</Callout>
      </Card>
    </div>
  );
}

function Insurance() {
  const [page, setPage] = useState(null);
  const sec = INS_SECTIONS.find((s) => s.id === page);
  if (!page) return <InsuranceHub onOpen={setPage} />;
  return (
    <div>
      <BackBar title={sec.title} onBack={() => setPage(null)} />
      {page === "law" && <LawPage />}
      {page === "policy" && <PolicyPage />}
      {page === "docs" && <DocsPage />}
      {page === "tips" && <TipsPage />}
      {page === "dodont" && <DoDontPage />}
      {page === "truck" && <TruckPage />}
    </div>
  );
}

/* ================================================================
   APP SHELL
   ================================================================ */
const NAV = [
  { id: "fin", label: "Financials", icon: DollarSign },
  { id: "code", label: "Code Verify", icon: Landmark },
  { id: "ins", label: "Insurance", icon: Shield },
];

export default function SupremeUpdate() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("fin");
  const [fin, setFin] = useState(DEMO_JOB.fin);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.line}`, position: "sticky", top: 0, zIndex: 5 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: BRAND.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: S.ink }}>{BRAND.short} · Update Module</div>
              <div style={{ fontSize: 11.5, color: S.sub }}>{user.name} · {user.role === "admin" ? "Admin" : "Sales Rep"}</div>
            </div>
          </div>
          <button onClick={() => setUser(null)} style={{
            border: `1px solid ${S.line}`, background: "#fff", borderRadius: 10, padding: "7px 12px",
            fontSize: 12.5, fontWeight: 700, color: S.sub, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}><LogOut size={13} /> Switch</button>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "18px 16px 96px" }}>
        {view === "fin" && <Financials user={user} fin={fin} setFin={setFin} />}
        {view === "code" && <CodeVerify />}
        {view === "ins" && <Insurance />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${S.line}` }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex" }}>
          {NAV.map((n) => {
            const Icon = n.icon; const active = view === n.id;
            return (
              <button key={n.id} onClick={() => setView(n.id)} style={{
                flex: 1, background: "none", border: "none", cursor: "pointer", padding: "10px 0 12px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              }}>
                <Icon size={20} color={active ? BRAND.accent : "#9AA1AB"} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: active ? BRAND.accent : "#9AA1AB" }}>{n.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
