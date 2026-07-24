var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ridgeline.jsx
var ridgeline_exports = {};
__export(ridgeline_exports, {
  default: () => SupremeCRM
});
module.exports = __toCommonJS(ridgeline_exports);
var import_react = __toESM(require("react"), 1);
var import_lucide_react = require("lucide-react");
var import_jsx_runtime = require("react/jsx-runtime");
var DEFAULT_BRAND = {
  company: "Supreme Building Group",
  short: "SBG",
  slogan: "Committed to Supreme Quality and Results",
  phone: "(847) 757-9890",
  email: "steven@supremebuildinggroup.com",
  website: "https://supremebuildinggroup.com",
  address: "333 Commerce Dr. Suite 250, Crystal Lake, IL 60014",
  license: "",
  primary: "#28373E",
  accent: "#1B6DE0",
  accentSoft: "#EAF2FD",
  googleReviewLink: "https://tinyurl.com/Supreme-Building-Group-Review"
};
var SOURCES = {
  RCO: { name: "Residential Code of Ohio (OAC 4101:8)", url: "https://codes.ohio.gov/ohio-administrative-code/4101:8", publisher: "Ohio Legislative Service Commission \u2014 official text" },
  OAC3901: { name: "OAC 3901-1-54 \u2014 Unfair Property/Casualty Claims", url: "https://codes.ohio.gov/ohio-administrative-code/rule-3901-1-54", publisher: "Ohio Administrative Code \u2014 official text" },
  ORC3951: { name: "ORC Chapter 3951 \u2014 Public Insurance Adjusters", url: "https://codes.ohio.gov/ohio-revised-code/chapter-3951", publisher: "Ohio Revised Code \u2014 official text" },
  ORC1345: { name: "ORC Chapter 1345 \u2014 Consumer Sales Practices (3-day rescission)", url: "https://codes.ohio.gov/ohio-revised-code/chapter-1345", publisher: "Ohio Revised Code \u2014 official text" },
  ICC: { name: "ICC Digital Codes (IRC / state editions)", url: "https://codes.iccsafe.org", publisher: "International Code Council" },
  KYDHBC: { name: "Kentucky Dept. of Housing, Buildings & Construction", url: "https://dhbc.ky.gov", publisher: "Commonwealth of Kentucky \u2014 code adoption authority" },
  MUNICODE: { name: "Municode Library (IL municipal ordinances)", url: "https://library.municode.com", publisher: "Municipal code hosting \u2014 verify adoption + edition" },
  ORC3901_20: { name: "ORC 3901.20 \u2014 Unfair and deceptive acts", url: "https://codes.ohio.gov/ohio-revised-code/section-3901.20", publisher: "Ohio Revised Code \u2014 official text" }
};
var JURISDICTIONS = {
  "45240": {
    zip: "45240",
    city: "Forest Park",
    county: "Hamilton County",
    state: "OH",
    codeName: "Residential Code of Ohio (RCO)",
    codeEdition: "2024 edition",
    adoption: "Statewide residential code",
    permit: "Roofing permit required for full replacement; verify with the building department.",
    inspector: { office: "Forest Park Building Department", phone: "(513) 555-0100 \u2014 sample, verify", address: "1201 W Kemper Rd, Forest Park, OH" },
    verified: true,
    sources: ["RCO", "OAC3901"],
    verifiedDetail: { date: "Jul 2026", by: "Office" }
  },
  "45410": {
    zip: "45410",
    city: "Dayton",
    county: "Montgomery County",
    state: "OH",
    codeName: "Residential Code of Ohio (RCO)",
    codeEdition: "2024 edition",
    adoption: "Statewide residential code",
    permit: "Permit required; verify regional building services handling for residential.",
    inspector: { office: "City of Dayton \u2014 Building Inspection", phone: "(937) 555-0100 \u2014 sample, verify", address: "371 W 2nd St, Dayton, OH" },
    verified: true,
    sources: ["RCO", "OAC3901"],
    verifiedDetail: { date: "Jul 2026", by: "Office" }
  },
  "45056": {
    zip: "45056",
    city: "Oxford",
    county: "Butler County",
    state: "OH",
    codeName: "Residential Code of Ohio (RCO)",
    codeEdition: "2024 edition",
    adoption: "Statewide residential code",
    permit: "Roofing permit required for tear-off and re-roof.",
    inspector: { office: "Butler County Building Department", phone: "(513) 555-0100 \u2014 sample, verify", address: "130 High St, Hamilton, OH" },
    verified: true,
    sources: ["RCO", "OAC3901"],
    verifiedDetail: { date: "Jul 2026", by: "Office" }
  },
  "43235": {
    zip: "43235",
    city: "Columbus",
    county: "Franklin County",
    state: "OH",
    codeName: "Residential Code of Ohio (RCO)",
    codeEdition: "2024 edition",
    adoption: "Statewide residential code",
    permit: "City of Columbus permit required for re-roofing.",
    inspector: { office: "Columbus Building & Zoning Services", phone: "(614) 555-0100 \u2014 sample, verify", address: "111 N Front St, Columbus, OH" },
    verified: true,
    sources: ["RCO", "OAC3901"],
    verifiedDetail: { date: "Jul 2026", by: "Office" }
  },
  "41179": {
    zip: "41179",
    city: "Vanceburg",
    county: "Lewis County",
    state: "KY",
    codeName: "Kentucky Residential Code (KRC)",
    codeEdition: "Current KRC \u2014 verify edition",
    adoption: "Statewide residential code",
    permit: "Verify permit handling with the county building official before tear-off.",
    inspector: { office: "Lewis County Building Official", phone: "(606) 555-0100 \u2014 sample, verify", address: "Vanceburg, KY" },
    verified: false,
    sources: ["KYDHBC", "ICC"],
    verifiedDetail: { date: null, by: null }
  },
  "41056": {
    zip: "41056",
    city: "Maysville",
    county: "Mason County",
    state: "KY",
    codeName: "Kentucky Residential Code (KRC)",
    codeEdition: "Current KRC \u2014 verify edition",
    adoption: "Statewide residential code",
    permit: "Verify with the Maysville building official before tear-off.",
    inspector: { office: "City of Maysville Building Inspector", phone: "(606) 555-0100 \u2014 sample, verify", address: "216 Bridge St, Maysville, KY" },
    verified: false,
    sources: ["KYDHBC", "ICC"],
    verifiedDetail: { date: null, by: null }
  },
  "60014": {
    zip: "60014",
    city: "Crystal Lake",
    county: "McHenry County",
    state: "IL",
    codeName: "Adopted IRC (local amendment)",
    codeEdition: "Locally adopted IRC \u2014 verify edition & amendments",
    adoption: "Illinois has no statewide residential code; adoption is municipal.",
    permit: "City roofing permit required; local amendments apply.",
    inspector: { office: "Crystal Lake Community Development", phone: "(815) 555-0100 \u2014 sample, verify", address: "100 W Woodstock St, Crystal Lake, IL" },
    verified: false,
    sources: ["MUNICODE", "ICC"],
    verifiedDetail: { date: null, by: null }
  }
};
var CODE_PROVISIONS = {
  OH: {
    iceBarrier: { cite: "RCO R905.1.2", note: "Ice barrier from eave edge to at least 24 in. inside the exterior wall line, measured along the slope.", verified: true },
    tearOff: { cite: "RCO R908.3", note: "Recover prohibited over two or more layers or water-soaked / deteriorated covering \u2014 full tear-off required.", verified: true },
    dripEdge: { cite: "RCO R905.2.8.5", note: "Drip edge required at eaves and rakes on shingle roofs.", verified: true },
    underlayment: { cite: "RCO R905.1.1", note: "Double-layer underlayment (or self-adhering membrane) on slopes 2:12 up to 4:12.", verified: true },
    ventilation: { cite: "RCO R806.2", note: "Default required ratio is 1/150. The 1/300 exception applies only with a balanced system \u2014 40 to 50 percent of net free area in the upper portion, balance at the eaves.", verified: true },
    fastening: { cite: "RCO R905.2.5", note: "4 nails per shingle minimum; 6-nail where manufacturer or wind zone requires.", verified: true },
    decking: { cite: "RCO R803 / R908.3", note: "Sheathing must be structurally sound; recover over unsound decking prohibited.", verified: true }
  },
  KY: {
    iceBarrier: { cite: "KRC R905.1.2 \u2014 verify edition", note: "Ice barrier to 24 in. inside exterior wall line (IRC-based; confirm KY amendments).", verified: false },
    tearOff: { cite: "KRC R908.3 \u2014 verify edition", note: "Recover prohibited over 2+ layers or deteriorated covering (confirm KY amendments).", verified: false },
    dripEdge: { cite: "KRC R905.2.8.5 \u2014 verify edition", note: "Drip edge at eaves and rakes (confirm KY amendments).", verified: false },
    underlayment: { cite: "KRC R905.1.1 \u2014 verify edition", note: "Low-slope double underlayment 2:12\u20134:12 (confirm KY amendments).", verified: false },
    ventilation: { cite: "KRC R806.2 \u2014 verify edition", note: "Balanced attic ventilation (confirm KY amendments).", verified: false },
    fastening: { cite: "KRC R905.2.5 \u2014 verify edition", note: "Fastening per code minimum and manufacturer spec (confirm).", verified: false },
    decking: { cite: "KRC R803 \u2014 verify edition", note: "Structurally sound sheathing required (confirm).", verified: false }
  },
  IL: {
    iceBarrier: { cite: "Adopted IRC R905.1.2 \u2014 verify municipality", note: "Ice barrier per the locally adopted IRC edition \u2014 Illinois adoption is municipal.", verified: false },
    tearOff: { cite: "Adopted IRC R908.3 \u2014 verify municipality", note: "Tear-off requirements per local adopted edition.", verified: false },
    dripEdge: { cite: "Adopted IRC R905.2.8.5 \u2014 verify municipality", note: "Drip edge per local adopted edition.", verified: false },
    underlayment: { cite: "Adopted IRC R905.1.1 \u2014 verify municipality", note: "Low-slope underlayment per local adopted edition.", verified: false },
    ventilation: { cite: "Adopted IRC R806.2 \u2014 verify municipality", note: "Ventilation per local adopted edition.", verified: false },
    fastening: { cite: "Adopted IRC R905.2.5 \u2014 verify municipality", note: "Fastening per local adopted edition and manufacturer spec.", verified: false },
    decking: { cite: "Adopted IRC R803 \u2014 verify municipality", note: "Sheathing requirements per local adopted edition.", verified: false }
  }
};
var PROVISION_TOPICS = [
  {
    topic: "Re-cover / maximum layers",
    oh: "RCO R908.3",
    srcOH: "RCO",
    note: "No third layer. Two existing layers means a full tear-off is required \u2014 the carrier owes tear-off scope, not a layover. Document the layer count before any mitigation."
  },
  {
    topic: "Ice barrier",
    oh: "RCO R905.1.2",
    srcOH: "RCO",
    note: "Ohio sits in IECC Climate Zones 4A and 5A, so ice barrier applies statewide. Required from the eave edge to at least 24 in. inside the warm wall line, measured along the slope. Must meet ASTM D1970. On 8:12 and steeper, 36 in. up-slope minimum."
  },
  {
    topic: "Drip edge",
    oh: "RCO R905.2.8.5",
    srcOH: "RCO",
    conflict: "Some field references cite R905.2.8.3 for drip edge. The subsection numbering shifts between IRC editions and Ohio adoptions \u2014 confirm against the edition your jurisdiction enforces before putting a number in a supplement letter.",
    note: "Required at BOTH eaves and rakes. Minimum 1/4 in. below the sheathing, extending 2 in. onto the deck. Underlayment laps over the drip edge at eaves and under it at rakes. Scope includes material, labor, and R&R."
  },
  {
    topic: "Step flashing",
    oh: "RCO R905.2.8.4",
    srcOH: "RCO",
    note: "Required where a sloped roof meets a vertical wall. Minimum 4 in. x 4 in. per piece, one per shingle course. Cannot be reused after tear-off \u2014 reinstalling damaged flashing does not comply."
  },
  {
    topic: "Kickout / diverter flashing",
    oh: "RCO R703.4",
    srcOH: "RCO",
    note: "Required where a roof edge terminates at a sidewall. Diverts runoff away from the wall assembly; without it water tracks behind the siding. One of the most commonly omitted line items in a carrier scope."
  },
  {
    topic: "Decking / sheathing",
    oh: "RCO R908.6 and R803",
    srcOH: "RCO",
    note: "Decking must be inspected at re-roof. Non-conforming sheathing (3/8 in. plank, skip sheathing) or rotted decking must be replaced \u2014 a re-cover over unsound decking is prohibited. Cost is owed under Ordinance & Law where the policy carries it."
  },
  {
    topic: "Underlayment (low slope)",
    oh: "RCO R905.1.1",
    srcOH: "RCO",
    note: "Two layers of underlayment required on slopes from 2:12 up to less than 4:12, or self-adhering membrane throughout. Catches porch roofs, dormers, and additions."
  },
  {
    topic: "Attic ventilation",
    oh: "RCO R806.2",
    srcOH: "RCO",
    note: "Default required ratio is 1/150 of the ventilated area. The 1/300 exception only applies with a balanced system \u2014 40 to 50 percent of the net free area in the upper portion with the balance at the eaves. Most older Ohio homes do not qualify, so 1/150 governs and the carrier owes the upgrade at re-roof. Inadequate ventilation also voids every major shingle warranty."
  },
  {
    topic: "Fastening",
    oh: "RCO R905.2.5",
    srcOH: "RCO",
    note: "Four nails per shingle minimum, six where the manufacturer or wind zone requires it. Installation must follow the manufacturer's instructions, which is itself a code requirement."
  },
  {
    topic: "Water-resistive barrier",
    oh: "RCO R703.2",
    srcOH: "RCO",
    note: "Required behind exterior veneer \u2014 minimum one layer of #15 felt or an approved WRB. On a siding replacement, damaged WRB must be replaced. A scope that pays for siding but not housewrap is short."
  },
  {
    topic: "Vinyl siding",
    oh: "RCO R703.11 / ASTM D3679",
    srcOH: "RCO",
    note: "Must comply with ASTM D3679 and be installed per ASTM D4756. Reusing removed vinyl is rarely feasible \u2014 UV embrittlement breaks the locking flange during removal. Document this for the matching argument."
  },
  {
    topic: "Matching (insurance regulation)",
    oh: "OAC 3901-1-54(I)(1)(b)",
    srcOH: "OAC3901",
    note: "Replacement items must be of like kind and quality with reasonably comparable appearance. This is the regulation behind full-slope and full-roof arguments when the shingle is discontinued."
  }
];
var SUPPLEMENT_TEMPLATES = [
  {
    id: "sup-ice",
    topic: "iceBarrier",
    category: "Code-required upgrades",
    title: "Ice barrier \u2014 extension to wall line",
    scenario: "Scope shows ice & water only at the drip edge (about 3 ft) instead of the code-required extension to 24 in. past the exterior wall line, measured along the slope.",
    lineItems: ["Ice & water shield \u2014 additional LF to extend coverage 24 in. past exterior wall line.", "On slopes 8:12 and steeper: minimum 36 in. up-slope from the eave."],
    docs: ["Photo of eave overhang with tape measure in frame.", "Slope measurement for the affected planes."],
    wording: "Per {CITE}, ice barrier is required to extend from the eave edge to a point at least 24 inches inside the exterior wall line, measured along the slope. The current scope provides only a 3-foot strip at the eave. The overhang on this property is [X inches], requiring [Y LF] of additional ice & water shield to bring the installation to code. Please add [Y LF] to the approved scope."
  },
  {
    id: "sup-tear",
    topic: "tearOff",
    category: "Code-required upgrades",
    title: "Full tear-off required by code",
    scenario: "Roof has two or more existing layers, or the first layer is deteriorated, and the adjuster's scope specifies a recover / overlay.",
    lineItems: ["Full tear-off labor (replacing overlay scope).", "Additional dumpster / disposal fees.", "Protection for landscaping, siding, and gutters during tear-off."],
    docs: ["Photo at the roof edge showing layer count.", "Close-ups of deteriorated first-layer areas."],
    wording: "Per {CITE}, roof recover is not permitted where the existing roof has two or more applications of covering, or where the existing covering is water-soaked or deteriorated. This property has [X layers / a deteriorated first layer, documented in the attached photos]. A recover is not code-compliant on this roof. Please update the approved scope from recover to full tear-off, adding [$X for tear-off labor and disposal]."
  },
  {
    id: "sup-drip",
    topic: "dripEdge",
    category: "Code-required upgrades",
    title: "Drip edge \u2014 all eaves and rakes",
    scenario: "Scope excludes new drip edge on a full re-roof, or includes it at eaves only and not rakes.",
    lineItems: ["Drip edge \u2014 total eave LF plus total rake LF.", "On homes without existing drip edge: mark as required-by-code addition."],
    docs: ["Measurement report showing eave and rake totals."],
    wording: "Per {CITE}, drip edge is required at both eaves and rakes of shingle roofs on new installations. The current scope [excludes drip edge / includes it only at eaves]. This property has [X LF of eaves] and [Y LF of rakes]; drip edge is required on all [X+Y] linear feet. Please add [X+Y LF] to the approved scope."
  },
  {
    id: "sup-under",
    topic: "underlayment",
    category: "Code-required upgrades",
    title: "Underlayment \u2014 double layer on low slope",
    scenario: "One or more slopes fall between 2:12 and 4:12 (porch roofs, dormers, additions) and the scope specs single-layer underlayment.",
    lineItems: ["Double-layer underlayment or self-adhering membrane for the low-slope squares.", "Additional labor for two-layer application."],
    docs: ["Pitch measurement of each affected slope.", "Photos identifying the low-slope planes."],
    wording: "Per {CITE}, asphalt shingle underlayment on slopes of 2:12 up to less than 4:12 must be installed in two layers (or self-adhering underlayment throughout). This property has [porch roof / dormer / addition] at a measured pitch of [X:12], below the 4:12 threshold. Please add double-layer underlayment for [X squares] of low-slope area to the approved scope."
  },
  {
    id: "sup-vent",
    topic: "ventilation",
    category: "Code-required upgrades",
    title: "Attic ventilation to code",
    scenario: "Existing ventilation is out of compliance (blocked soffit intake, gable-only, single-source, or insufficient net free area) and the adjuster excludes upgrades as betterment.",
    lineItems: ["Ridge vent LF (or box vent count) sized for the attic square footage.", "Soffit vent installation or reconditioning.", "Baffles at each rafter bay where required for airflow."],
    docs: ["Attic photos showing existing intake and exhaust.", "Attic square footage and net-free-area math."],
    wording: "Per {CITE}, attic ventilation must meet the required net-free-area ratio \u2014 1/150 by default, or 1/300 only where a balanced intake-and-exhaust system exists. The existing system on this property is [gable only / blocked soffit / undersized ridge], which does not meet the balanced requirement. Reinstalling the non-compliant system on the new roof would violate code. Please add [ridge vent LF, soffit intake, and baffles] to the approved scope. Ordinance & Law coverage applies if included in the policy."
  },
  {
    id: "sup-deck",
    topic: "decking",
    category: "Structural \u2014 discovered during work",
    title: "Decking replacement",
    scenario: "Deteriorated decking discovered during tear-off; adjuster wants to exclude it as maintenance or pre-existing.",
    lineItems: ["Deck replacement \u2014 SF of 7/16 in. or 1/2 in. OSB or plywood matching existing.", "Fasteners and labor for deck replacement.", "Dumpster surcharge if additional load."],
    docs: ["Photo of each failed section with a tape measure for scale.", "Total SF per replaced section.", "Attic view of the same area if accessible."],
    wording: "During tear-off on [date], we identified [X SF] of deteriorated roof sheathing that will not hold fasteners and cannot serve as an adequate base for new roofing. Per {CITE}, a recover over unsound decking is prohibited and sheathing must be structurally sound. This deck replacement is code-required, not maintenance. Please add [X SF] of decking replacement to the approved scope."
  },
  {
    id: "sup-fast",
    topic: "fastening",
    category: "Manufacturer requirements",
    title: "Enhanced fastening / high-wind installation",
    scenario: "The specified shingle line requires 6-nail installation for its wind warranty, and the adjuster's scope specifies standard 4-nail.",
    lineItems: ["Enhanced fastening / 6-nail installation labor rate (typically ~15% above standard).", "Additional fasteners."],
    docs: ["Manufacturer spec sheet for the specified shingle line.", "Wind-warranty tier documentation."],
    wording: "Per {CITE}, the code minimum is 4 nails per shingle in standard wind zones, with 6-nail installation required where manufacturer specifications require it. The specified shingle line, [product name], requires 6-nail installation to qualify for the [warranty tier] wind warranty. Please update the approved scope to include enhanced-fastening installation for the full roof area of [X squares]."
  }
];
var INSURANCE_DO = [
  ["Document everything, then document more", "Dated photos, test squares, layer counts, attic shots. The adjuster reads what's in the file \u2014 make sure the file says what you mean."],
  ["Cite the code, not your opinion", "Every scope argument ties to an RCO section or the OAC matching rule. Print the cite, hand it over, stay friendly."],
  ["Be present at the adjuster meeting", "Walk the roof together, point to the documented damage, agree on the test square counts on site."],
  ["Put supplements in writing with evidence attached", "Line items, code cites, dated photos, measurements. Follow the carrier's supplement channel and log every contact."]
];
var INSURANCE_DONT = [
  ["Don't negotiate coverage or settlement", "That is licensed public adjuster or attorney work under ORC Chapter 3951. Supreme documents damage and provides its own scope \u2014 nothing more."],
  ["Don't interpret the policy for the homeowner", "Point to the dec page and endorsements, suggest they ask their agent or a public adjuster. Never promise what the policy will pay."],
  ["Don't offer to absorb or rebate the deductible", "Deductible games are insurance fraud exposure for everyone involved, including the homeowner."],
  ["Don't promise claim outcomes to close a deal", "Sell the inspection and the documentation quality. The claim decision belongs to the carrier."]
];
var LAW_ITEMS = [
  {
    title: "Matching \u2014 OAC 3901-1-54(I)(1)(b)",
    src: "OAC3901",
    body: "Where replacing an item leaves a mismatch, the carrier owes replacement of items in the area so the result is like kind and quality with reasonably comparable appearance. This is the lever behind full-slope and full-roof arguments when the shingle line is discontinued or the field is heavily weathered."
  },
  {
    title: "Written matching explanation \u2014 OAC 3901-1-54(I)(2)",
    src: "OAC3901",
    body: "If a carrier limits matching, it must give the insured a written explanation of the policy provision it is relying on. Always demand that explanation in writing \u2014 it either produces a citable position you can rebut, or it produces silence you can escalate."
  },
  {
    title: "Claim handling deadlines \u2014 OAC 3901-1-54",
    src: "OAC3901",
    body: "The carrier must acknowledge a claim within 15 days, complete its investigation within 21 days, and decide within a reasonable time after. Missed deadlines are documentable and belong in any escalation letter or Department of Insurance complaint."
  },
  {
    title: "Insured's right to choose the contractor \u2014 R.C. 3901.20",
    src: "ORC3901_20",
    body: "The homeowner picks who does the work. A carrier steering the insured to a preferred vendor is an unfair practice. Tell homeowners this early \u2014 many assume they must use whoever the adjuster names."
  },
  {
    title: "Bad faith \u2014 Hoskins v. Aetna (Ohio 1983)",
    src: "OAC3901",
    body: "An insurer that denies or delays without reasonable justification commits a separate tort beyond breach of contract. Slow-pay, lowball scopes, and blanket refusal of code-required items are the evidence pattern. This is attorney territory \u2014 Supreme documents, counsel argues."
  },
  {
    title: "Appraisal \u2014 Schwartz v. Standard Fire (Ohio 2008)",
    src: "OAC3901",
    body: "Confirms the appraisal clause for amount-of-loss disputes. Each side names a competent, disinterested appraiser; the two select an umpire; any two of the three signing binds the award. Appraisal resolves amount, not coverage."
  },
  {
    title: "Public adjusters \u2014 ORC Chapter 3951",
    src: "ORC3951",
    body: "Negotiating coverage or settlement for the homeowner requires a public adjuster license, and a contractor cannot act as the public adjuster on the same loss. Supreme documents damage and provides its own scope \u2014 nothing beyond that."
  },
  {
    title: "Deductible rebating is a felony \u2014 R.C. 2913.47 / R.C. 3999.21",
    src: "ORC1345",
    body: "Waiving, rebating, absorbing, or offering to pay a homeowner's deductible on an insurance claim is insurance fraud in Ohio, chargeable as a felony. Do not offer it, do not imply it, do not build it into a price. This is the single fastest way to lose a license and a company."
  },
  {
    title: "Three-day right to cancel \u2014 R.C. 1345 (CSPA)",
    src: "ORC1345",
    body: "A contract signed at the home is a home solicitation sale and carries a three-business-day cancellation right, with the notice required in the contract itself. Do not start work or order materials inside the window without a documented, permitted waiver."
  },
  {
    title: "Large contract disclosures \u2014 R.C. 4722",
    src: "ORC1345",
    body: "Home construction service contracts above the statutory threshold (commonly cited at $25,000) carry additional written disclosure requirements. Confirm the current threshold and required language with counsel before using a contract form on larger jobs."
  },
  {
    title: "Statute of limitations \u2014 R.C. 2305.06",
    src: "ORC1345",
    body: "Six years on written contracts following the 2021 amendment. Policy suit-limitation clauses are frequently shorter than the statute, so the contractual deadline usually governs \u2014 read the policy, do not assume six years."
  },
  {
    title: "No statewide roofing license \u2014 R.C. 4740",
    src: "ORC1345",
    body: "Ohio licenses commercial trades but has no statewide residential roofing contractor license. Cities and counties may still require local registration, so confirm the jurisdiction before pulling a permit."
  }
];
var ESCALATION_LADDER = [
  ["Re-inspection", "Request in writing, inside the policy's time limit. Ask specifically for a senior adjuster or a second set of eyes, and attach the documentation the first inspection missed."],
  ["Appraisal", "Invoke the policy's appraisal clause for amount-of-loss disputes. Each side names an appraiser, the two pick an umpire, two of three signatures bind. Does not resolve coverage questions."],
  ["Public adjuster referral", "For coverage disputes rather than pricing. Must be an ORC 3951 licensed PA \u2014 and it cannot be Supreme."],
  ["Ohio Department of Insurance complaint", "Consumer Services, 1-800-686-1526. A complaint typically moves the file to a senior adjuster and creates a regulatory record of the handling."],
  ["Bad-faith referral", "Coverage counsel, on the Hoskins v. Aetna standard. Refer \u2014 do not argue bad faith yourself."]
];
var KEY_CONTACTS = [
  ["Ohio Dept. of Insurance \u2014 Consumer Services", "1-800-686-1526", "insurance.ohio.gov"],
  ["Ohio Board of Building Standards", "", "com.ohio.gov/divisions/dico/bbs"],
  ["GAF Technical Services", "1-800-ROOF-411", "gaf.com"],
  ["Owens Corning Technical Services", "1-800-GET-PINK", "owenscorning.com"],
  ["CertainTeed Technical Services", "1-800-233-8990", "certainteed.com"],
  ["NOAA Storm Prediction Center \u2014 hail reports", "", "spc.noaa.gov/climo/online/sps"],
  ["NOAA Storm Events database", "", "ncdc.noaa.gov/stormevents"]
];
var POLICY_CARDS = [
  {
    title: "Ordinance & Law Coverage",
    body: "Often listed as Coverage D or Increased Cost of Construction on HO-3 policies. Pays for costs incurred to bring the property into current code compliance as part of a covered loss. Without it, the carrier only owes the pre-loss condition \u2014 code-required upgrades come out of the homeowner's pocket.",
    callout: { label: "Check for", text: "percentage of Coverage A dwelling amount (10%, 25%, 50%), or a flat dollar limit. Some policies exclude it entirely, some include it automatically. If absent, decking replacement and ventilation upgrades required by code become the homeowner's cost." }
  },
  {
    title: "RCV vs ACV Settlement",
    body: "Replacement Cost Value: carrier pays the full cost to replace with like kind and quality, minus deductible. Depreciation is initially withheld and released upon completion of the work. Actual Cash Value: carrier pays RCV minus depreciation. Depreciation is not recoverable.",
    callout: { label: "Common trap", text: "A roof-age endorsement can convert an otherwise-RCV policy to ACV on the roof specifically after a certain roof age (often 15 or 20 years). Homeowner may not know this. Read the endorsement pages, not just the declarations." }
  },
  {
    title: "Roof Payment Schedule (RPS) endorsement",
    body: "An RPS (also sold as Roof Surface Payment Schedule, Roof Settlement Schedule, or Scheduled Roof Coverage) replaces normal RCV settlement on the roof with a fixed payout table based on roof age and material. A 15-year-old architectural shingle roof might settle at 50% or 40% of replacement cost \u2014 regardless of condition, regardless of how well it was maintained, and the shortfall is not recoverable depreciation. It is not depreciation and completing the work does not release it.",
    callout: { label: "How to spot it and what to do", text: "Look for a schedule table in the endorsement pages \u2014 rows of roof ages against payout percentages. If it's there, tell the homeowner the number before you write the contract, not after the check arrives. Their out-of-pocket is the deductible PLUS the scheduled shortfall. Two things still move: the schedule usually applies only to the roof surface, so gutters, flashing, vents, siding, and interior damage should still settle at normal RCV; and Ordinance & Law is a separate coverage that is not subject to the schedule. Scope those separately so they don't get swept into the reduced roof number." }
  },
  {
    title: "Cosmetic damage exclusion / cosmetic-only endorsement",
    body: "Excludes hail or wind damage that marks the surface without affecting the roof's ability to shed water. Increasingly common on renewals in hail-prone counties, and sometimes applied to metals (gutters, vents, caps) separately from shingles.",
    callout: { label: "Check for", text: '"cosmetic," "appearance only," "does not affect function" in the endorsement schedule. The counter is functional evidence: fractured mat under the impact, granule displacement exposing asphalt, broken seal strips, reduced service life. Document function separately from appearance \u2014 a spatter photo alone plays into the exclusion.' }
  },
  {
    title: "Wind/hail deductible \u2014 percentage vs. flat",
    body: "A separate, higher deductible applying only to wind and hail losses, often expressed as a percentage of Coverage A rather than a flat dollar amount. On a $400,000 dwelling, a 2% wind/hail deductible is $8,000 \u2014 not the $1,000 all-perils figure the homeowner remembers.",
    callout: { label: "Before you quote a job", text: "Read the deductible line on the dec page for a separate wind/hail entry and calculate the actual dollar figure off Coverage A. This is the single most common surprise that kills a signed job at check time. Never quote the homeowner's out-of-pocket from the all-perils deductible on a storm claim." }
  },
  {
    title: "ACV-only roof endorsement (roof age trigger)",
    body: "Converts an otherwise-RCV policy to ACV settlement on the roof once the roof passes a set age, commonly 15 or 20 years. Distinct from an RPS: ACV uses conventional depreciation rather than a fixed schedule, but the practical effect is the same \u2014 a large non-recoverable gap.",
    callout: { label: "Check for", text: `"actual cash value roof," "roof surfaces," or a roof-age condition in the endorsement pages. If the roof is near the trigger age, confirm the roof's documented age \u2014 an incorrect age on file has been corrected before with permit records or prior invoices.` }
  },
  {
    title: "Matching Endorsement",
    body: "Some carriers offer an optional endorsement that expands the state matching regulation and explicitly requires uniform-appearance repairs including full replacement of undamaged sections when necessary. Others explicitly limit matching to a single slope or single side of a wall.",
    callout: { label: "Check for", text: '"matching," "uniform appearance," "cosmetic" language in the policy schedule and any endorsements. Some carriers add a cosmetic-damage exclusion that specifically strips matching for hail spatter without functional damage.' }
  }
];
var DOC_GROUPS = [
  { title: "Roof photos", items: [
    "Wide shot of every slope from the ground \u2014 all four elevations.",
    "Two close-ups per slope showing the shingle field.",
    "Chalked test squares, 10 ft x 10 ft, minimum two per slope, hit count written in frame.",
    "Close-up of each individual impact with a ruler or coin for scale.",
    "Step flashing, valley, rake, and eave details.",
    "Two examples of clean undamaged shingle \u2014 needed for the matching argument.",
    "Back-of-shingle markings, plant code, and measured dimensions.",
    "Cellophane release strip.",
    "Layer count \u2014 probe at the gutter line or a vent penetration.",
    "Underlayment type where visible at a penetration."
  ] },
  { title: "Soft metals and collateral damage", items: [
    "Vent caps and range or kitchen vents.",
    "Gutter aprons, gutters, and downspouts.",
    "Plumbing boots.",
    "Satellite dish.",
    "AC condenser fins \u2014 hail dents show clearly on aluminum.",
    "Painted surfaces: doors, fascia, trim.",
    "Window screens \u2014 tears and splits.",
    "Wood elements: rake board splintering, fascia.",
    "Garage door \u2014 dents on raised panels.",
    "Each siding elevation, wide and detail."
  ] },
  { title: "Measurements", items: [
    "Pitch of every distinct slope.",
    "Square count per slope.",
    "Linear feet: valley, rake, eave, ridge, hip.",
    "Penetration count and type.",
    "Step flashing and wall flashing linear feet.",
    "Shingle width, height, and exposure \u2014 this drives the discontinued-product argument."
  ] },
  { title: "Paper trail", items: [
    "Policy declarations page \u2014 front, back, and all endorsement pages.",
    "Roof age: homeowner statement, MLS listing, or prior claim record.",
    "NOAA hail report for the address and loss date.",
    "NWS storm event report.",
    "Building permit history from the jurisdiction.",
    "Prior claim history (CLUE report where available).",
    "Carrier's loss summary.",
    "Adjuster name, license number, and claim phone.",
    "Signed contract with the three-day right-to-cancel notice.",
    "Manufacturer do-not-mix bulletin, printed."
  ] },
  { title: "Identification record", items: [
    "Shingle manufacturer, line, and approximate year.",
    "Plant code.",
    "Measured width, height, and exposure.",
    "Ridge, hip, and starter type and condition.",
    "Underlayment type where visible.",
    "Decking type and thickness \u2014 probe at a vent.",
    "Number of layers.",
    "Ventilation system: intake and exhaust, both.",
    "Skylight type and age.",
    "Chimney flashing condition."
  ] }
];
var SUPPLEMENT_TRIGGERS = [
  ["Drip edge \u2014 full perimeter", "RCO R905.2.8.5 (verify subsection)"],
  ["Ice barrier", "RCO R905.1.2"],
  ["Step flashing R&R", "RCO R905.2.8.4"],
  ["Kickout / diverter flashing", "RCO R703.4"],
  ["Decking R&R where rotted or non-conforming", "RCO R908.6"],
  ["Ventilation upgrade where below 1/150", "RCO R806.2"],
  ["Water-resistive barrier on siding R&R", "RCO R703.2"],
  ["Permit and inspection fee", "Jurisdiction"],
  ["Dump and disposal fee", "Scope"],
  ["Overhead & profit where multi-trade", "Typically 10/10 on larger losses"],
  ["Starter strip and ridge cap", "Manufacturer requirement"],
  ["Detach & reset \u2014 satellite, solar, lighting", "Scope"]
];
var DOC_TEMPLATES = [
  { type: "Hail", items: [
    "One overall of each slope from ground.",
    "One chalked 10x10 test square per slope with hit count written on chalk or paper card in frame.",
    "Close-up of representative impact showing fractured mat, granule displacement, and matted circular pattern \u2014 ruler in frame for scale.",
    "Ridge/hip cap close-up if impacted \u2014 hail rounds often show best on ridges.",
    "Soft metals for corroboration: gutter, downspout elbow, vent hood, cap flashing, HVAC fins, screens, garage door."
  ] },
  { type: "Wind", items: [
    "Missing shingle areas photographed with something for scale.",
    "Lifted/creased shingles \u2014 from the side showing the crease line.",
    "Seal strip failure \u2014 underside of lifted shingle showing broken seal.",
    "Ridge cap displacement patterns.",
    "Overall pattern shot showing directional damage consistent with wind vector."
  ] },
  { type: "Water intrusion (from a storm event)", items: [
    "Interior ceiling staining with dated photo.",
    "Attic sheathing staining, streak marks, mold.",
    "Insulation compression at leak locations.",
    "Corresponding exterior condition \u2014 failed flashing, missing shingle, damaged boot."
  ] }
];
var CLAIM_SCENARIOS = [
  {
    q: "\u201CWe'll only pay for the damaged slope\u201D",
    setup: "Adjuster acknowledges wind or hail damage but scopes only the affected slope, leaving the other slopes with the original shingles.",
    answer: [
      "If shingle line is discontinued or field is significantly weathered, cite OAC 3901-1-54(I)(1)(b) \u2014 reasonably comparable appearance.",
      "Document color-match failure with photos of a manufacturer sample vs field shingles under matched lighting.",
      "If the roof has 2+ layers, cite RCO R908.3 \u2014 recover is prohibited, so partial replacement on top of the existing bottom layer is not code-compliant either.",
      "Re-walk the slopes the adjuster called undamaged before conceding them \u2014 a lower hit count is not no damage. Even where the rear slope genuinely has fewer impacts, the matching regulation still drives toward uniform appearance."
    ]
  },
  {
    q: "\u201CJust layer new shingles over the existing\u201D",
    setup: "Adjuster proposes an overlay to save money.",
    answer: [
      "Count the layers. If two or more, cite RCO R908.3 \u2014 recover is not permitted.",
      "If first layer is water-damaged, cite same section \u2014 unsuitable base prohibits recover regardless of layer count.",
      "Point out that a code violation is a policy problem for the carrier: the homeowner would be occupying a non-code-compliant structure funded by the claim."
    ]
  },
  {
    q: "\u201CDecking replacement is not covered\u201D",
    setup: "Deteriorated decking is discovered during tear-off. Adjuster wants to exclude it as maintenance.",
    answer: [
      "If the policy has Ordinance & Law (Coverage D), deck replacement required by code is covered under that coverage even if not covered by dwelling coverage.",
      "Cite RCO R908.3 and R803 \u2014 recovering over unsound sheathing is prohibited.",
      "Photograph every replaced board with scale, log square footage, submit as supplement with dated photos.",
      "Check the policy declarations page before promising O&L coverage \u2014 not every homeowner has it."
    ]
  },
  {
    q: "\u201CA strip of ice & water at the eave is enough\u201D",
    setup: "Adjuster's scope includes ice & water at the drip edge only, not the full 24-inch-past-wall-line coverage.",
    answer: [
      "Cite RCO R905.1.2 \u2014 the barrier must extend from the eave edge to a point at least 24 inches inside the exterior wall line, measured along the slope.",
      "Measure the overhang depth: eave-to-wall distance plus 24 inches gives you the required coverage measured up the slope.",
      "Slope 8:12 or steeper needs 36 inches up the slope minimum."
    ]
  },
  {
    q: "\u201CReuse the existing flashings\u201D",
    setup: "Common on step flashings, chimney counter-flashings, and skylight kits.",
    answer: [
      "Cite RCO R905.2.8 \u2014 flashings must be sized and installed to prevent water intrusion. Reused flashings damaged during tear-off do not satisfy this requirement.",
      "Photograph the existing condition to preempt the argument: rust, caulk-sealed joints, missing counter-flashing on masonry, undersized step flashing.",
      "New skylight flashing kit is standard scope on any re-roof; the skylight manufacturer's warranty typically requires new flashing with any new roof."
    ]
  },
  {
    q: "\u201CVentilation upgrade is a betterment\u201D",
    setup: "Adjuster excludes new ridge vent, soffit intake, or box vent replacement as an improvement not caused by the loss.",
    answer: [
      "The default required ratio under RCO R806.2 is 1/150; the 1/300 exception applies only where a balanced intake-and-exhaust system exists. Most older homes do not qualify, so reinstalling the existing non-compliant system on a code-triggered re-roof is a violation.",
      "Ordinance & Law coverage applies if the policy includes it.",
      "If the existing system was itself damaged by the storm (ridge cap blown off, box vent housing hail-struck), that alone is covered damage regardless of code."
    ]
  },
  {
    q: "\u201CIt's just wear and tear\u201D",
    setup: "Adjuster denies hail damage as normal aging or wear, or claims granule loss is not impact-related.",
    answer: [
      "Document impact patterns with the HAAG-style test square (a chalked 10-foot square, count of hits per slope).",
      "Document circular, offset, or spatter patterns distinguishing hail from mechanical or manufacturing defects.",
      "For an aged roof that also has hail impact, granule loss at impact sites (fractured mat under the impact) is diagnostic of storm damage. Photograph in raking light.",
      "Brittleness test on a cool day is more reliable than on hot; document date and temperature.",
      "Request the carrier's engineer report if damage is denied on that basis.",
      "Where the carrier blames installation or age rather than the storm, Ohio applies efficient proximate cause: if the covered peril was the predominant cause, the loss is covered even with contributing factors. Pin the storm date with NWS wind data and NOAA hail reports, and document neighboring properties."
    ]
  },
  {
    q: "\u201CRoof is too old for full replacement value\u201D",
    setup: "Adjuster settles on Actual Cash Value only, or applies a roof-age depreciation schedule that reduces the payment significantly.",
    answer: [
      "Check the policy: does it pay Replacement Cost Value (RCV) with recoverable depreciation, or ACV only? If RCV, the homeowner recovers the withheld depreciation on completion of the work.",
      "Watch for a roof-age endorsement that converts RCV to ACV past a set age \u2014 read the endorsement pages.",
      "Document maintained, serviceable condition to push back on aggressive depreciation: no prior leaks, intact flashing, sound decking."
    ]
  }
];
var MORE_SCENARIOS = [
  {
    q: "\u201CCosmetic damage only \u2014 granule loss isn't functional\u201D",
    setup: "The carrier concedes hail struck the roof but treats the damage as appearance-only and declines replacement.",
    answer: [
      "Granules are the UV shield for the asphalt mat. Once impact displaces them the mat degrades faster and the manufacturer warranty is compromised \u2014 that is functional loss, not appearance.",
      "Document what a spatter photo alone will not show: fractured mat beneath the impact, and seal strips that have released and will not re-seal.",
      "Ask in writing whether the carrier is relying on a specific cosmetic-damage exclusion by endorsement. If there is no such endorsement, physical damage from a covered peril is covered \u2014 see Resources, Policy Provisions."
    ]
  },
  {
    q: "\u201CWe won't pay for drip edge or kickout \u2014 the house never had them\u201D",
    setup: "The carrier declines code-required components on the grounds that the pre-loss roof did not include them.",
    answer: [
      "Pre-loss absence is not the standard. The new installation has to pass inspection, and it cannot without these components.",
      "Cite the specific sections: drip edge RCO R905.2.8.5 (confirm the subsection against your jurisdiction's adopted edition), step flashing RCO R905.2.8.4, kickout RCO R703.4.",
      "Where the policy carries Ordinance & Law, code-driven upgrades fall under that coverage specifically. Check the declarations page before asserting it."
    ]
  },
  {
    q: "\u201CYour estimate is too high \u2014 our software says less\u201D",
    setup: "The carrier anchors to an estimating platform's price list and treats it as the ceiling.",
    answer: [
      "Estimating software is a pricing reference, not the policy. The obligation is the reasonable cost to repair at local market rates.",
      "Document what the price list misses: code-driven line items, R&R of metals, disposal, permit fees, and the actual local labor rate.",
      "On larger multi-trade losses, overhead and profit is a normal component of a general contractor's price and should be scoped as such."
    ]
  },
  {
    q: "\u201CACV now \u2014 you'll get the depreciation when the work is done\u201D",
    setup: "Standard on a recoverable-depreciation policy, but it becomes a problem when the release is slow or conditioned on paperwork nobody explained.",
    answer: [
      "Confirm first that the depreciation is actually recoverable. If a Roof Payment Schedule or ACV-roof endorsement applies, the shortfall is NOT recoverable and the homeowner needs to hear that before signing.",
      "Ask up front what the carrier requires to release it \u2014 typically a certificate of completion and the final invoice. Send it the day the job closes.",
      "Once submitted, OAC 3901-1-54 timelines apply. Persistent slow-pay after a complete submission is documentable and belongs in an escalation."
    ]
  }
];
var CARRIER_PATTERNS = [
  {
    title: "Allstate \u2014 Cosmetic Damage Endorsement",
    pattern: "Some Allstate HO-3 policies (increasingly, on renewals) include a cosmetic-damage exclusion for hail impact on roofing and metals when the damage does not affect functional performance. Under this endorsement, spatter marks on shingles, dented caps and vents, and minor bruising can be excluded even when clearly caused by hail.",
    answer: [
      "Read the declarations page carefully \u2014 the endorsement is often an add-on that's easy to miss.",
      "Document functional impact separately from cosmetic: granule loss, mat exposure, seal-strip failure, reduced service life.",
      "If the roof is otherwise near end of life, cosmetic exclusion + age depreciation can gut the claim; advise the homeowner honestly."
    ]
  },
  {
    title: "Third-Party Administrators & Preferred Networks",
    pattern: 'Some carriers (Erie, Nationwide, others) use third-party administrators or "preferred contractor" networks whose scopes tend to run below fair-market pricing and whose supplements go to a specific approver rather than the original adjuster. Contractors outside the network are asked to match TPA pricing.',
    answer: [
      "Homeowners are not obligated to use the preferred network. Supreme's price is Supreme's price.",
      "Document with local material and labor comparables. Regional RS Means, Xactimate published rates, and manufacturer MSRPs are all cite-able.",
      "If the TPA declines a supplement without inspection, that's a bad-faith foundation \u2014 escalate to the carrier direct."
    ]
  },
  {
    title: "Aggressive Depreciation Schedules",
    pattern: "Some carriers apply steep age-based depreciation to roofs at 10\u201315 years despite the roof being maintained and in serviceable condition. Recoverable-depreciation withholdings can approach 50% of RCV in extreme cases.",
    answer: [
      "Confirm whether depreciation is recoverable \u2014 if it is, completing the work releases it, and the homeowner should know that up front.",
      "Document condition evidence that argues against the schedule: maintenance history, intact granule coverage away from impacts, remaining service life.",
      "Request the depreciation basis in writing when the schedule looks disconnected from actual condition."
    ]
  }
];
var CHEAT_SHEET = {
  levers: [
    ["2+ layers", "RCO R908.3 forbids recover."],
    ["Deteriorated first layer", "RCO R908.3 forbids recover."],
    ["Shingle discontinued", "OAC 3901-1-54(I)(1)(b) requires reasonably comparable appearance."]
  ],
  scope: [
    ["Ice barrier 24 in. past wall line", "RCO R905.1.2"],
    ["New drip edge on all eaves/rakes", "RCO R905.2.8.5"],
    ["New step/counter flashing", "RCO R905.2.8"],
    ["Ventilation to code ratio \u2014 1/150 default", "RCO R806.2"],
    ["Double underlayment on < 4:12 slope", "RCO R905.1.1"],
    ["4-nail (or 6 in high-wind) fastening", "RCO R905.2.5"]
  ],
  ol: "Ordinance & Law coverage (Coverage D): check the declarations page. Percentage of Coverage A. Pays for code-driven upgrades. If it's not there, decking replacement is on the homeowner.",
  docs: "Documentation minimums: ground of all elevations, layer count at edge, test square per slope, damage close-ups with scale, ventilation type & condition, flashing condition, attic if accessible, dated on every photo.",
  line: "The line you don't cross: Supreme documents damage and provides its own scope. Supreme does not negotiate coverage under the policy. That's public adjuster or attorney work \u2014 ORC Chapter 3951."
};
var SHINGLE_RULES = [
  ["Laminate under 38 in. long", "Always discontinued. No current laminate is made below this size."],
  ["38 3/4 in. long", "Either CertainTeed Landmark (current) or one of four discontinued lines \u2014 old OC Oakridge Pro 30, old Elk 30, old Atlas, old Tamko. Back-of-shingle markings tell them apart."],
  ["39 3/8 in. long", "Current standard for most makers, BUT pre-2008 Owens Corning, pre-2008 GAF, pre-2010 OC Duration, and pre-2018 GAF Timberline HD are all discontinued at this size. Date the roof."],
  ["CertainTeed at 36 in. (English size)", "Pre-2005. CertainTeed's Ohio plant converted to metric in 2005 \u2014 anything English-size is discontinued."]
];
var SHINGLE_DB = [
  // GAF
  { mfr: "GAF", line: "Timberline HDZ", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "current", years: "2018\u2013present", note: "Current flagship. LayerLock nail zone is 1.6 in. wide vs about 1 in. on HD." },
  { mfr: "GAF", line: "Timberline HD", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "2007\u20132018", note: "Replaced by HDZ. Narrower nail zone \u2014 GAF states the two are not interchangeable." },
  { mfr: "GAF", line: "Timberline Ultra", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "~2005\u20132014", note: "Replaced by Ultra HD." },
  { mfr: "GAF", line: "Timberline 20 / 25 / 30 (organic)", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "1980s\u20132006", note: "Organic mat. Replaced by Natural Shadow. No fiberglass equivalent." },
  { mfr: "GAF", line: "Camelot I", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "2003\u20132017", note: "Replaced by Camelot II \u2014 different profile." },
  { mfr: "GAF", line: "Country Mansion", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "", note: "Replaced by Camelot / Grand Sequoia." },
  { mfr: "GAF", line: "Sentinel (3-tab)", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "phased out 2013\u20132025", note: "Confirm availability by color before promising a repair match." },
  // Owens Corning
  { mfr: "Owens Corning", line: "TruDefinition Duration", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "current", years: "2010\u2013present", note: "Current flagship. SureNail strip differs from the original Duration." },
  { mfr: "Owens Corning", line: "Duration (original)", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "pre-2010", note: "Different SureNail construction \u2014 not a match for TruDefinition." },
  { mfr: "Owens Corning", line: "Oakridge Pro 25 / 30", w: 13.25, l: 38.75, exp: 5.625, type: "Laminate", status: "disco", years: "pre-2008", note: "Became Oakridge AR at 39 3/8 in. in 2008. Different mat and bonding." },
  { mfr: "Owens Corning", line: "Oakridge Pro 40 / 50", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "pre-2008", note: "Consolidated into Oakridge AR in 2008." },
  { mfr: "Owens Corning", line: "Devonshire", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "\u20132020", note: "Slate-look laminate." },
  { mfr: "Owens Corning", line: "Supreme Deep Shadow", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "", note: "" },
  { mfr: "Owens Corning", line: "Prominence", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "\u20132008", note: "Faux-laminate 3-tab." },
  { mfr: "Owens Corning", line: "Classic (3-tab)", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "fully out 2018", note: "Limited availability from about 2010." },
  { mfr: "Owens Corning", line: "WeatherGuard IR", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "\u20132011", note: "Impact-rated predecessor to Duration FLEX." },
  // CertainTeed
  { mfr: "CertainTeed", line: "Landmark", w: 13.25, l: 38.75, exp: 5.625, type: "Laminate", status: "current", years: "2005\u2013present", note: "The ONLY current laminate at 38 3/4 in. Anything else that width is discontinued." },
  { mfr: "CertainTeed", line: "Landmark (English size)", w: 12, l: 36, exp: 5, type: "Laminate", status: "disco", years: "pre-2005", note: "Ohio plant converted to metric in 2005." },
  { mfr: "CertainTeed", line: "Hatteras", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "\u20132016", note: "Large 4-tab slate look. Slateline differs in profile and dimension \u2014 not a match." },
  { mfr: "CertainTeed", line: "Independence", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "\u20132017", note: "Designer 3-tab." },
  { mfr: "CertainTeed", line: "Horizon / New Horizon", w: 0, l: 0, exp: 0, type: "Laminate", status: "disco", years: "", note: "" },
  { mfr: "CertainTeed", line: "Patriot I / Patriot II", w: 0, l: 0, exp: 0, type: "Laminate", status: "disco", years: "", note: "" },
  { mfr: "CertainTeed", line: "Hallmark / Hearthstead / Centennial Slate", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "", note: "" },
  { mfr: "CertainTeed", line: "XT 25 / XT 30 (3-tab)", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "out by 2020", note: "" },
  { mfr: "CertainTeed", line: "Presidential Solaris / Shake IR", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "", note: "Presidential base line continues; these variants do not." },
  // Tamko
  { mfr: "Tamko", line: "Heritage", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "current", years: "2016\u2013present", note: "Tamko went metric in 2012 \u2014 last major maker to convert." },
  { mfr: "Tamko", line: "Heritage (Dallas / Joplin)", w: 13.25, l: 38.75, exp: 5.625, type: "Laminate", status: "disco", years: "pre-2016", note: "" },
  { mfr: "Tamko", line: "Heritage 25 / 30", w: 0, l: 36.5, exp: 0, type: "Laminate", status: "disco", years: "pre-2012", note: "English size." },
  { mfr: "Tamko", line: "Heritage XL", w: 0, l: 36.625, exp: 0, type: "Laminate", status: "disco", years: "", note: "" },
  { mfr: "Tamko", line: "Elite Glass Seal (3-tab)", w: 12.25, l: 36, exp: 5.125, type: "3-tab", status: "current", years: "", note: "Limited Lifetime added 2018." },
  { mfr: "Tamko", line: "Glass Seal 20-yr (3-tab)", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "", note: "" },
  // Atlas
  { mfr: "Atlas", line: "Pinnacle / StormMaster / Castlebrook", w: 14, l: 42, exp: 6, type: "Laminate", status: "current", years: "2017\u2013present", note: "Current size. Sealant is on the FRONT of the shingle, not the back." },
  { mfr: "Atlas", line: "Pinnacle / StormMaster (mid)", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "~2013\u20132017", note: "Different keyway and exposure than the 42 in. HP line \u2014 visible offset if mixed." },
  { mfr: "Atlas", line: "Pinnacle / StormMaster (early)", w: 0, l: 38.25, exp: 5.625, type: "Laminate", status: "disco", years: "~2013", note: "" },
  { mfr: "Atlas", line: "Castlebrook (early)", w: 0, l: 38.625, exp: 0, type: "Laminate", status: "disco", years: "~2013", note: "" },
  { mfr: "Atlas", line: "Stratford / Chalet", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "", note: "Faux-laminate 3-tabs. Atlas 3-tab production has ended." },
  // IKO
  { mfr: "IKO", line: "Cambridge", w: 13.75, l: 40.875, exp: 5.875, type: "Laminate", status: "current", years: "", note: "Current ArmourZone nail strike is wider than older Cambridge generations." },
  { mfr: "IKO", line: "Dynasty", w: 13.75, l: 40.875, exp: 5.875, type: "Laminate", status: "current", years: "", note: "ArmourZone. Class 3 IR upgrade in 2022." },
  { mfr: "IKO", line: "Marathon AR (3-tab)", w: 0, l: 0, exp: 0, type: "3-tab", status: "current", years: "", note: "Converted English to metric. Color range now limited." },
  { mfr: "IKO", line: "Skyline / Renaissance", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "", note: "Private labels (e.g. CRC Biltmore 35) also likely gone \u2014 call to confirm." },
  // Malarkey / Pabco
  { mfr: "Malarkey", line: "Vista / Highlander", w: 13.25, l: 39, exp: 5.625, type: "Laminate", status: "current", years: "", note: "SBS rubberized. Most flagship lines carry Class 4 impact rating as standard." },
  { mfr: "Malarkey", line: "Legacy", w: 13.25, l: 40, exp: 5.625, type: "Laminate", status: "current", years: "", note: "SBS, Class 4 standard." },
  { mfr: "Pabco", line: "Premier / Prestige / Radiance", w: 13.25, l: 40, exp: 5.625, type: "Laminate", status: "current", years: "", note: "Narrow tooth, bold shadow. Uncommon in the Ohio market." },
  // Elk — all discontinued
  { mfr: "Elk (legacy)", line: "Prestique 30", w: 13.25, l: 38.75, exp: 5.625, type: "Laminate", status: "disco", years: "mid-1990s\u20132009", note: "Closest current analogue is GAF Timberline 30 \u2014 not a match." },
  { mfr: "Elk (legacy)", line: "Raised Profile 30", w: 13.25, l: 38.75, exp: 5.625, type: "Laminate", status: "disco", years: "", note: "Analogue: GAF Natural Shadow." },
  { mfr: "Elk (legacy)", line: "Prestique I 40", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "", note: "Analogue: GAF Timberline 40." },
  { mfr: "Elk (legacy)", line: "Prestique Plus 50", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "", note: "Granules on the back of the shingle." },
  { mfr: "Elk (legacy)", line: "Capstone", w: 12.125, l: 39.5, exp: 5, type: "Designer", status: "disco", years: "", note: "" },
  { mfr: "Elk (legacy)", line: "Domain Winslow", w: 14.5, l: 40, exp: 5.625, type: "Designer", status: "disco", years: "", note: "Shake look." }
];
var MFR_IDENT = [
  {
    mfr: "GAF",
    mark: '"GAF" plus a plant code of two letters and four digits. Sealant is dashed, not solid.',
    plants: "MO Mt Vernon IN \xB7 MI Michigan City IN \xB7 TA Tampa \xB7 DA Dallas \xB7 NJ Mt Vernon NJ \xB7 SH Shafter CA \xB7 MN Minneapolis \xB7 TU Tuscaloosa \xB7 CD Cedar City UT \xB7 BA Baltimore \xB7 SS Statesboro GA \xB7 EN Ennis TX (legacy Elk plant)"
  },
  { mfr: "Owens Corning", mark: 'Cellophane reads "Do Not Remove" / "No Quitar" with year and plant letter codes. Multiple plastic strips; black SureNail strip on TruDefinition Duration.', plants: "" },
  { mfr: "CertainTeed", mark: 'Back almost always carries "certainteed" with the logo or "the roofing collection." Tapered tooth, medium shadow line.', plants: "" },
  { mfr: "Tamko", mark: 'Back reads "Tamko" or "Frederick" plus the plant name. Cellophane carries plant print.', plants: "" },
  { mfr: "Atlas", mark: "Five-digit code, sometimes with a Miami-Dade approval marking. Sealant is on the FRONT of the shingle.", plants: "" },
  { mfr: "IKO", mark: '"PX" plus a letter and five digits, e.g. PX A#####.', plants: "" },
  { mfr: "Elk (legacy)", mark: 'Brown paper or blank backing, "MYERSTOWN," a Texas outline with "ENNIS," or T1/T2/T3 and M1/M2/M3 codes with "DO NOT REMOVE" between them. All Elk product is discontinued.', plants: "" },
  { mfr: "Malarkey", mark: "Brand text on the back. Vista and Highlander at 39 in., Legacy at 40 in.", plants: "" }
];
var MFR_SPECS = [
  {
    mfr: "GAF",
    flagship: "Timberline HDZ",
    w: "13-1/4 in.",
    l: "39-3/8 in.",
    exp: "5-5/8 in.",
    wind: "130 mph with LayerLock plus StainGuard Plus",
    algae: "StainGuard Plus 25 yr / StainGuard 10 yr",
    warranty: "Lifetime limited, 10 yr non-prorated",
    class4: "Timberline AS II \xB7 Grand Sequoia IR \xB7 Camelot II IR (select markets)",
    dnm: "GAF technical bulletins state HD and HDZ are not interchangeable \u2014 different nail zone width, exposure, and sealant. Prior-generation Timberline is not acceptable repair material on an HDZ roof. A 2007\u20132018 HD roof cannot be repair-matched with current product."
  },
  {
    mfr: "Owens Corning",
    flagship: "TruDefinition Duration",
    w: "13-1/4 in.",
    l: "39-3/8 in.",
    exp: "5-5/8 in.",
    wind: "130 mph with SureNail, no special installation required",
    algae: "StreakGuard 10 yr",
    warranty: "Lifetime limited",
    class4: "Duration FLEX (polymer-modified)",
    dnm: "OC repair-versus-replace bulletins state Oakridge AR and the older Pro lines are not compatible \u2014 different mat and bonding. Same position on original Duration versus TruDefinition Duration."
  },
  {
    mfr: "CertainTeed",
    flagship: "Landmark",
    w: "13-1/4 in.",
    l: "38-3/4 in.",
    exp: "5-5/8 in.",
    wind: "110\u2013130 mph across Landmark / Pro / Premium",
    algae: "StreakFighter 15 yr",
    warranty: "Lifetime limited",
    class4: "Landmark IR \xB7 Belmont IR \xB7 Presidential IR",
    dnm: "CertainTeed publishes lot-to-lot color variation guidance and recommends running a roof from a single production lot. Do-not-mix language applies to Hatteras, since the replacement Slateline differs in profile and dimension."
  },
  {
    mfr: "Atlas",
    flagship: "Pinnacle / StormMaster / Castlebrook",
    w: "14 in.",
    l: "42 in.",
    exp: "6 in.",
    wind: "130 mph with HP and Scotchgard combination",
    algae: "Scotchgard",
    warranty: "Lifetime limited",
    class4: "StormMaster Slate / Shake / Shingle (SBS-modified)",
    dnm: "Atlas has confirmed in writing that the 42 in. HP line cannot be matched with prior 39-3/8 in. or 38 in. product \u2014 the keyway and exposure differ, producing a visible offset."
  },
  {
    mfr: "Tamko",
    flagship: "Heritage",
    w: "13-1/4 in.",
    l: "39-3/8 in.",
    exp: "5-5/8 in.",
    wind: "130 mph with correct starters and fastening",
    algae: "Available by series",
    warranty: "Limited Lifetime (added 2018)",
    class4: "Heritage IR (SBS)",
    dnm: "Modern fiberglass Heritage cannot be matched to the older organic Heritage \u2014 the mat composition differs. Tamko organic product also carries class-action history worth knowing before you discuss it with a homeowner."
  },
  {
    mfr: "IKO",
    flagship: "Cambridge / Dynasty",
    w: "13-3/4 in.",
    l: "40-7/8 in.",
    exp: "5-7/8 in.",
    wind: "110 mph Cambridge \xB7 130 mph Dynasty with ArmourZone",
    algae: "Available by series",
    warranty: "Limited Lifetime",
    class4: "Nordic \xB7 Cambridge IR \xB7 Dynasty IR (2022+)",
    dnm: "Cambridge generations differ in nail-zone marking \u2014 older Cambridge has a narrower nail strike than current ArmourZone Cambridge."
  }
];
var SIDING_MATCHING = {
  makers: "CertainTeed \xB7 Mastic / Ply Gem \xB7 Alside \xB7 Royal \xB7 Variform \xB7 Norandex",
  points: [
    "UV fade. ASTM D6864 permits up to 4 Delta-E of color shift across the warranty period. The naked eye detects a difference at about 2 \u2014 so a compliant, non-defective wall can still visibly mismatch new stock.",
    "Profile tooling changes. Manufacturers retire and revise profiles roughly every 5 to 10 years; embossing and lock geometry shift with them.",
    "Locking flange failure. Aged vinyl embrittles under UV and the locking flange typically breaks on removal, so salvaged panels usually cannot be reinstalled.",
    "Color SKU attrition. Individual colors are discontinued faster than the product lines that carry them."
  ],
  argument: "Partial replacement of vinyl siding produces a visible mismatch in nearly every case. Photograph the existing color and profile, request manufacturer color-match samples in writing, and pursue full-elevation replacement on matching grounds."
};
var LETTER_TEMPLATES = [
  {
    id: "lt-supp",
    title: "Supplement request",
    when: "The carrier's scope omits code-required or manufacturer-required line items.",
    body: `[Date]
[Carrier] \u2014 Claims Department
RE: Claim #[claim] \xB7 Insured: [name] \xB7 Date of loss: [date]
Property: [address]

We are the contractor of record on the above claim. Having reviewed the loss summary dated [date], we have identified the following items that were omitted or under-scoped. Each is required by the Residential Code of Ohio, by the manufacturer's published installation instructions, or by the loss settlement terms of the policy.

1. Drip edge, full perimeter \u2014 RCO R905.2.8.5. [LF] at [$].
2. Ice barrier at eaves and valleys \u2014 RCO R905.1.2. Ohio sits in IECC Climate Zones 4A and 5A; this applies statewide. [SQ] at [$].
3. Step flashing, remove and replace \u2014 RCO R905.2.8.4. Flashing cannot be reused after tear-off. [LF] at [$].
4. Kickout flashing \u2014 RCO R703.4. [EA] at [$].
5. Decking replacement where existing sheathing does not provide an adequate base \u2014 RCO R908.6. [SF] at [$].
6. Ventilation brought to the code-required ratio \u2014 RCO R806.2. [detail] at [$].
7. Permit and inspection fee. [$].
8. Disposal. [$].
9. Overhead and profit, where the loss requires coordination of multiple trades.

Please update the loss summary to reflect these items and reissue payment within the timeframe set by OAC 3901-1-54. Supporting photographs and measurements are attached.

[Rep name] \u2014 [Company] \u2014 [Phone]`
  },
  {
    id: "lt-match",
    title: "Matching argument",
    when: "The carrier authorized partial replacement and the existing shingle is discontinued.",
    body: `[Date]
[Carrier] \u2014 Attn: Claims Manager
RE: Claim #[claim] \xB7 Insured: [name] \xB7 Date of loss: [date]

The current authorization covers [x] slope(s). We respectfully request authorization for full replacement, on the following grounds.

1. The existing shingle is discontinued. The roof is identified as [manufacturer / line], measured at [width] x [length] with [exposure] exposure. That product has not been manufactured since [year]. Attached: photographs of the back-of-shingle markings, plant code, sealant pattern, and the measurements taken on site.

2. Current product is not interchangeable. [Manufacturer]'s technical bulletin dated [date] states that current product is not compatible with the discontinued line for installation, warranty, or appearance. Bulletin attached.

3. Partial replacement does not meet the policy's settlement standard. The policy provides for replacement with like kind and quality. A visible line between new and existing slopes does not satisfy that standard.

4. OAC 3901-1-54(I)(1)(b) requires that replacement items be of like kind and quality with reasonably comparable appearance. If the carrier intends to maintain the partial position, OAC 3901-1-54(I)(2) requires a written explanation of the provision relied upon. We request that explanation in writing.

We request re-inspection within fourteen days. If the partial position is maintained, we will advise the insured of their right to invoke the policy's appraisal clause.

[Rep name] \u2014 [Company] \u2014 [Phone]`
  },
  {
    id: "lt-cosmetic",
    title: "Cosmetic-only rebuttal",
    when: "The carrier denied hail damage as cosmetic rather than functional.",
    body: `[Date]
[Carrier] \u2014 Attn: Claims Manager
RE: Claim #[claim] \xB7 Insured: [name] \u2014 cosmetic-only determination

The letter dated [date] denies this claim on the basis that the hail damage is cosmetic and does not affect function. We respectfully disagree.

1. Granule loss is functional. The granule surface shields the asphalt mat from ultraviolet exposure. Where granules are displaced by impact, the mat is exposed, service life is shortened, and manufacturer warranty coverage is compromised. The published technical positions of GAF, Owens Corning, and CertainTeed all treat impact bruising as functional damage.

2. We have documented fractured mat and broken seal-down. The attached photographs show impacts where the mat is fractured beneath the surface and the seal strip has released and will not re-seal. Sample shingles are available for inspection.

3. If the carrier is relying on a cosmetic-damage exclusion by endorsement, we request that the endorsement be identified in writing. Absent a specific exclusion, physical damage from a covered peril is covered.

We request re-inspection by a senior adjuster within fourteen days.

[Rep name] \u2014 [Company] \u2014 [Phone]`
  },
  {
    id: "lt-appraisal",
    title: "Appraisal demand",
    when: "The dispute is over the amount of loss, not coverage, and negotiation has stalled.",
    body: `[Date]
[Carrier] \u2014 Attn: Claims Manager
RE: Claim #[claim] \xB7 Insured: [name]

Pursuant to the appraisal provision of the policy, the insured demands appraisal of the disputed amount of loss.

The insured names [appraiser name, address] as their competent and disinterested appraiser.

Please name the carrier's appraiser within the period required by the policy. The two appraisers will then select an umpire. An award agreed by any two of the three will be binding as to the amount of loss, consistent with Schwartz v. Standard Fire Insurance Co. (Ohio 2008).

[Insured name / Rep name] \u2014 [Company] \u2014 [Phone]`
  },
  {
    id: "lt-odi",
    title: "Department of Insurance complaint",
    when: "The carrier has missed handling deadlines or refused a written explanation. Escalates the file and creates a regulatory record.",
    body: `[Date]
Ohio Department of Insurance \u2014 Consumer Services Division
50 W. Town Street, Third Floor, Suite 300
Columbus, OH 43215

RE: Claim complaint \xB7 Insured: [name] \xB7 Carrier: [carrier] \xB7 Claim #[claim] \xB7 Date of loss: [date]

The insured submits this complaint regarding the handling of the above claim.

1. [Select: failure to acknowledge within 15 days per OAC 3901-1-54 / failure to complete investigation within 21 days / refusal to provide the written matching explanation required by OAC 3901-1-54(I)(2) / scope omitting code-required items / other].

2. The carrier has been given written notice regarding [drip edge / ice barrier / step flashing / kickout / decking / ventilation / matching] and has not updated the scope.

3. The carrier's most recent communication was dated [date] and stated [summary].

Enclosed: declarations page, the carrier's loss summary, our supplement request dated [date], photographs of the loss, and the manufacturer's do-not-mix bulletin.

The insured requests review.

[Insured name, address, phone]
cc: [Company], contractor of record`
  }
];
var RESOURCE_SECTIONS = [
  { id: "shingles", icon: import_lucide_react.Layers, title: "Shingle ID", blurb: "Width-first identification, discontinued lines by manufacturer, and back-of-shingle marks." },
  { id: "specs", icon: import_lucide_react.Package, title: "Manufacturer Specs", blurb: "Current flagship dimensions, do-not-mix positions, Class 4 options, and siding matching." },
  { id: "law", icon: import_lucide_react.Scale, title: "Ohio Insurance Law", blurb: "Matching, handling deadlines, bad faith, appraisal, deductible rules, and the escalation ladder." },
  { id: "policy", icon: import_lucide_react.CheckCircle2, title: "Policy Provisions", blurb: "Ordinance & Law, RCV vs ACV, RPS, cosmetic exclusions \u2014 what to check on the dec page." },
  { id: "docs", icon: import_lucide_react.Camera, title: "Documentation Checklist", blurb: "Every photo, measurement, and document that makes a claim file hold up." },
  { id: "tips", icon: import_lucide_react.Lightbulb, title: "Claim Playbook", blurb: "The common adjuster positions and the citation that answers each, plus carrier patterns." },
  { id: "letters", icon: import_lucide_react.ScrollText, title: "Letter Templates", blurb: "Supplement, matching, cosmetic rebuttal, appraisal demand, and ODI complaint." },
  { id: "dodont", icon: import_lucide_react.AlertTriangle, title: "Do & Don't", blurb: "Field practices on one side, ways this goes sideways on the other." },
  { id: "truck", icon: import_lucide_react.ClipboardList, title: "Truck Cheat Sheet", blurb: "One-page field summary. Print it for the truck." }
];
var TEAM = ["Jacob Henderson", "Drew Klass", "Stephen Klein", "Steven Tatgenhorst"];
var ROLES = [
  { id: "admin", label: "Admin", blurb: "Full access: commission structures, company splits, seats, branding." },
  { id: "manager", label: "Production manager", blurb: "All jobs and financials, but cannot change commission structures or seats." },
  { id: "rep", label: "Sales rep", blurb: "Own jobs and payout figures. Cannot see company splits or structure controls." },
  { id: "crew", label: "Crew / field", blurb: "Work orders, photos, and tasks only. No pricing, no financials." }
];
var SEED_USERS = [
  { id: "u1", name: "Jacob Henderson", email: "jacob@supremebuildinggroup.com", phone: "(847) 757-9890", role: "admin", title: "Owner / Admin", active: true, commissionRate: 60, addedAt: "2026-01-04" },
  { id: "u2", name: "Drew Klass", email: "drew@supremebuildinggroup.com", phone: "", role: "rep", title: "Sales Rep", active: true, commissionRate: 60, addedAt: "2026-02-11" },
  { id: "u3", name: "Stephen Klein", email: "stephen@supremebuildinggroup.com", phone: "", role: "rep", title: "Sales Rep", active: true, commissionRate: 55, addedAt: "2026-03-02" },
  { id: "u4", name: "Steven Tatgenhorst", email: "steven@supremebuildinggroup.com", phone: "", role: "rep", title: "Sales Rep", active: true, commissionRate: 60, addedAt: "2026-03-02" }
];
var canSeeMoney = (u) => u && u.role !== "crew";
var canEditStructure = (u) => u && u.role === "admin";
var canManageSeats = (u) => u && u.role === "admin";
var LEAD_SOURCES = ["Door knocking", "Customer referral", "Google", "Website", "Yard sign", "Facebook", "Call in", "Repeat customer", "Real-estate referral", "Billboard / print"];
var DEFAULT_STAGES = [
  { id: "s1", name: "New lead", cat: "Incoming" },
  { id: "s2", name: "Appointment scheduled", cat: "Qualified" },
  { id: "s3", name: "Estimate sent / Follow up", cat: "Qualified" },
  { id: "s4", name: "Claim filed", cat: "Qualified" },
  { id: "s5", name: "Job approved", cat: "Won" },
  { id: "s6", name: "Supplementing", cat: "Won" },
  { id: "s7", name: "Deposit paid \u2014 job scheduled", cat: "Won" },
  { id: "s8", name: "Production", cat: "Won" },
  { id: "s9", name: "Payments / Invoicing / Cap out", cat: "Won" },
  { id: "s10", name: "Job completed", cat: "Completed" },
  { id: "s11", name: "Lost", cat: "Lost" },
  { id: "s12", name: "Unqualified", cat: "Unqualified" }
];
var WON_STAGES = ["s5", "s6", "s7", "s8", "s9", "s10"];
var DEAD_STAGES = ["s11", "s12"];
var SEED_CREWS = [
  { id: "c1", name: "Hillwood Contractors", contact: "Luis Hernandez", phone: "(815) 555-0142", email: "info@hillwoodcontractors.com", trades: ["Roofing", "Gutters"], active: true },
  { id: "c2", name: "Northgate Exteriors", contact: "Danny Pruitt", phone: "(847) 555-0188", email: "dispatch@northgateext.com", trades: ["Roofing", "Siding"], active: true },
  { id: "c3", name: "Vasquez Sheet Metal", contact: "Ramon Vasquez", phone: "(606) 555-0175", email: "ramon@vasquezmetal.com", trades: ["Metal", "Flashing"], active: true }
];
var MERGE_FIELDS = [
  ["{{customer_name}}", "Customer's full name"],
  ["{{customer_first}}", "Customer's first name"],
  ["{{job_address}}", "Property address"],
  ["{{rep_name}}", "Assigned rep"],
  ["{{rep_phone}}", "Rep's direct phone (falls back to office)"],
  ["{{office_phone}}", "Rep's office phone"],
  ["{{office_address}}", "Rep's office address"],
  ["{{rep_email}}", "Rep's work email (falls back to office)"],
  ["{{office_email}}", "Rep's office email"],
  ["{{company}}", "Company name"],
  ["{{crew_name}}", "Assigned crew"],
  ["{{scheduled_date}}", "Scheduled production date"],
  ["{{contract_total}}", "Contract amount"],
  ["{{balance_due}}", "Outstanding balance"],
  ["{{claim_number}}", "Insurance claim number"],
  ["{{review_link}}", "Google review link"]
];
function mergeTemplate(text, ctx) {
  if (!text) return "";
  return text.replace(/\{\{(\w+)\}\}/g, (m, k) => ctx[k] != null && ctx[k] !== "" ? String(ctx[k]) : m);
}
function templateContext(job2, brand2, crew2, users) {
  const pay = paymentsSummary(job2);
  const first = (job2.name || "").split(" ")[0];
  const rep = (users || []).find((u) => u.name === job2.assignee);
  const loc = rep && rep.locationId && (brand2.locations || []).find((l) => l.id === rep.locationId);
  return {
    customer_name: job2.name,
    customer_first: first,
    job_address: job2.address,
    rep_name: job2.assignee,
    rep_phone: rep && rep.repPhone || loc && loc.phone || brand2.phone,
    rep_email: rep && (rep.workEmail || rep.email) || loc && loc.email || brand2.email,
    office_address: loc && loc.address || brand2.address,
    office_phone: loc && loc.phone || brand2.phone,
    office_email: loc && loc.email || brand2.email,
    company: brand2.company,
    crew_name: crew2 ? crew2.name : "",
    scheduled_date: job2.schedDate || "",
    contract_total: pay.contract ? money(pay.contract) : "",
    balance_due: pay.balance ? money(pay.balance) : "",
    claim_number: job2.insurance ? job2.insurance.claim : "",
    review_link: brand2.googleReviewLink
  };
}
var SEED_TEMPLATES = [
  {
    id: "t1",
    kind: "email",
    audience: "Customer",
    name: "Inspection scheduled",
    subject: "Your roof inspection \u2014 {{scheduled_date}}",
    body: `Hi {{customer_first}},

You're on the schedule for {{scheduled_date}} at {{job_address}}. {{rep_name}} will be out to walk the roof, take measurements and photos, and check the attic if it's accessible.

Plan on about an hour. You don't need to be home for the roof itself, but it helps if we can get a few minutes with you afterward to go over what we found.

Questions before then, call or text {{rep_phone}}.

{{rep_name}}
{{company}}`
  },
  {
    id: "t2",
    kind: "email",
    audience: "Customer",
    name: "Estimate sent \u2014 follow up",
    subject: "Your estimate from {{company}}",
    body: `Hi {{customer_first}},

Your estimate for {{job_address}} is attached. It covers everything we found on the inspection, with each line tied to what the roof actually needs.

A few things worth knowing:
\u2014 The price holds for 30 days.
\u2014 Anything we can't see until tear-off (decking, for example) is priced up front so there are no surprises.
\u2014 If this is going through insurance, we'll handle the supplement paperwork with your carrier.

Happy to walk through any line item. Call or text {{rep_phone}}.

{{rep_name}}
{{company}}`
  },
  {
    id: "t3",
    kind: "email",
    audience: "Customer",
    name: "Production scheduled",
    subject: "We're scheduled for {{scheduled_date}}",
    body: `Hi {{customer_first}},

{{job_address}} is scheduled for {{scheduled_date}}.

Before the crew arrives:
\u2014 Move vehicles out of the driveway.
\u2014 Take down anything hanging on walls that share a roof line \u2014 vibration knocks pictures loose.
\u2014 Keep pets inside for the day.
\u2014 Cover anything in the attic you'd rather not get dusty.

The crew starts early. We haul off all debris and run a magnet over the yard before we leave.

{{rep_name}}
{{company}} \u2014 {{rep_phone}}`
  },
  {
    id: "t4",
    kind: "email",
    audience: "Customer",
    name: "Job complete \u2014 review request",
    subject: "All finished at {{job_address}}",
    body: `Hi {{customer_first}},

We're wrapped up at {{job_address}}. Final walk-around is done, debris is hauled, and the yard has been swept with a magnet.

Your workmanship warranty runs five years from today, and the manufacturer warranty covers the materials. Both documents are in your portal.

If we earned it, a quick review helps us more than just about anything: {{review_link}}

Thanks for trusting us with the house.

{{rep_name}}
{{company}}`
  },
  {
    id: "t5",
    kind: "email",
    audience: "Crew",
    name: "New project assignment",
    subject: "{{company}} \u2014 new project assignment",
    body: `{{crew_name}},

A new project has been assigned to your crew for {{job_address}} on {{scheduled_date}}.

Attached is the full work order for this property. Please review the scope carefully before the crew rolls, and flag anything that doesn't match what you expect to find on site.

Materials are scheduled to land ahead of the start date. Call {{rep_phone}} if anything is missing or the delivery is short.

{{company}}`
  },
  {
    id: "t6",
    kind: "sms",
    audience: "Customer",
    name: "Appointment reminder",
    body: `{{company}}: Hi {{customer_first}}, reminder that {{rep_name}} is out to inspect {{job_address}} on {{scheduled_date}}. Questions? Call {{rep_phone}}. Reply STOP to opt out.`
  },
  {
    id: "t7",
    kind: "sms",
    audience: "Customer",
    name: "Crew on the way",
    body: `{{company}}: Our crew is headed to {{job_address}} this morning. Please move vehicles out of the driveway. Reply STOP to opt out.`
  },
  {
    id: "t8",
    kind: "sms",
    audience: "Customer",
    name: "Review request",
    body: `{{company}}: Thanks for letting us work on your home, {{customer_first}}. If we did right by you, a quick review means a lot: {{review_link}} Reply STOP to opt out.`
  },
  {
    id: "t9",
    kind: "sms",
    audience: "Crew",
    name: "Schedule confirmation",
    body: `{{company}}: {{crew_name}} \u2014 confirming {{job_address}} on {{scheduled_date}}. Work order is in your email. Reply to confirm.`
  }
];
var DOC_CATEGORIES = [
  "Contracts & agreements",
  "Insurance & bonding",
  "Licenses & registrations",
  "Warranties",
  "Safety & OSHA",
  "HR & onboarding",
  "Vendor & supplier",
  "Marketing",
  "Other"
];
var SEED_COMPANY_DOCS = [
  { id: "d1", name: "Master service agreement \u2014 template.pdf", cat: "Contracts & agreements", size: "182 KB", at: "2026-01-12", by: "Jacob Henderson", pinned: true, expires: null },
  { id: "d2", name: "General liability COI 2026.pdf", cat: "Insurance & bonding", size: "96 KB", at: "2026-01-04", by: "Jacob Henderson", pinned: true, expires: "2026-12-31" },
  { id: "d3", name: "Workers comp certificate.pdf", cat: "Insurance & bonding", size: "88 KB", at: "2026-01-04", by: "Jacob Henderson", pinned: false, expires: "2026-11-30" },
  { id: "d4", name: "Subcontractor agreement \u2014 blank.pdf", cat: "Contracts & agreements", size: "141 KB", at: "2026-02-20", by: "Jacob Henderson", pinned: false, expires: null },
  { id: "d5", name: "GAF workmanship warranty terms.pdf", cat: "Warranties", size: "204 KB", at: "2026-03-08", by: "Steven Tatgenhorst", pinned: false, expires: null },
  { id: "d6", name: "Fall protection plan.pdf", cat: "Safety & OSHA", size: "312 KB", at: "2026-02-02", by: "Jacob Henderson", pinned: false, expires: null }
];
var SEED_PRICE_LIST = [
  { id: "pl1", sku: "GAF-HDZ-BDL", item: "GAF Timberline HDZ \u2014 bundle", unit: "BDL", cost: 41.2, price: 58, supplier: "QXO", category: "Shingles" },
  { id: "pl2", sku: "GAF-RIDGE", item: "GAF Seal-A-Ridge \u2014 bundle", unit: "BDL", cost: 62.5, price: 88, supplier: "QXO", category: "Shingles" },
  { id: "pl3", sku: "SYN-UND-10", item: "Synthetic underlayment \u2014 10 SQ roll", unit: "ROLL", cost: 96, price: 138, supplier: "QXO", category: "Underlayment" },
  { id: "pl4", sku: "IWS-200", item: "Ice & water shield \u2014 200 SF roll", unit: "ROLL", cost: 108, price: 152, supplier: "SRS", category: "Underlayment" },
  { id: "pl5", sku: "DE-26-10", item: "Drip edge 26ga \u2014 10 ft stick", unit: "EA", cost: 11.4, price: 17.5, supplier: "SRS", category: "Metal" },
  { id: "pl6", sku: "RV-4", item: "Ridge vent \u2014 4 ft section", unit: "EA", cost: 14.8, price: 22, supplier: "QXO", category: "Ventilation" },
  { id: "pl7", sku: "PJ-3", item: 'Pipe jack 3"', unit: "EA", cost: 12, price: 24, supplier: "QXO", category: "Accessories" },
  { id: "pl8", sku: "NAIL-114", item: 'Coil nails 1-1/4" \u2014 box', unit: "BOX", cost: 52, price: 72, supplier: "SRS", category: "Fasteners" },
  { id: "pl9", sku: "OSB-716", item: '7/16" OSB sheathing 4x8', unit: "SHT", cost: 28.5, price: 48, supplier: "Menards", category: "Decking" },
  { id: "pl10", sku: "STARTER", item: "Starter strip \u2014 roll", unit: "ROLL", cost: 48, price: 68, supplier: "QXO", category: "Shingles" }
];
var BLANK_CHECKLIST = {
  complete: false,
  structure: "",
  roofAge: "",
  method: "",
  layers: "",
  roofType: "",
  deckingType: "",
  deckingCond: "",
  pitch: "",
  ventTypes: [],
  soffitIntake: "",
  ventCond: "",
  atticAccess: "",
  atticDecking: "",
  lightCheck: "",
  granuleLoss: "",
  windDamage: "",
  hailImpact: "",
  flashingFail: "",
  pipeBoots: "",
  overall: "",
  notes: ""
};
var BLANK_MEASURE = {
  squares: "",
  pitch: "",
  ridges: "",
  hips: "",
  valleys: "",
  eaves: "",
  rakes: "",
  stepFlash: "",
  wallFlash: "",
  penetrations: "",
  waste: 12
};
function mkEstimate(over = {}) {
  return {
    number: "",
    date: "",
    validThrough: "",
    status: "Draft",
    scope: "",
    notes: "",
    items: [],
    concealed: [
      { id: "c1", desc: 'Roof decking replacement (7/16" OSB)', unit: "per 4\xD78 sheet", price: 0 },
      { id: "c2", desc: "Plank decking replacement", unit: "per LF", price: 0 },
      { id: "c3", desc: "Rafter sistering / repair", unit: "per rafter", price: 0 },
      { id: "c4", desc: "Fascia replacement", unit: "per LF", price: 0 }
    ],
    clientSig: null,
    sigAt: null,
    ...over
  };
}
function mkContract(over = {}) {
  return {
    number: "",
    price: 0,
    depositPct: 50,
    status: "Not started",
    scope: "",
    terms: "Deposit on acceptance; balance on substantial completion. Workmanship warranted five (5) years from completion; manufacturer warranties apply to materials. Any change to scope or price is agreed in writing before changed work begins. Concealed conditions are billed as agreed change orders. Owner may cancel without penalty within three (3) business days of signing by written notice. Balances unpaid 30 days after completion accrue 1.5% monthly.",
    contractorSig: null,
    clientSig: null,
    signedAt: null,
    ...over
  };
}
var seedJobs = [
  {
    id: "j1",
    name: "Rob Kennard",
    address: "127 Market Street, Vanceburg, KY",
    zip: "41179",
    state: "KY",
    value: 16964.12,
    stageId: "s2",
    assignee: "Jacob Henderson",
    leadSource: "Door knocking",
    daysInStage: 12,
    updated: "13 days ago",
    claimType: "Insurance",
    schedDate: null,
    phone: "(606) 555-0136",
    email: "rob.k@example.com",
    consent: { sms: { granted: true, at: "2026-07-08 10:12", source: "New lead form" }, email: { granted: true, at: "2026-07-08 10:12", source: "New lead form" } },
    insurance: { carrier: "State Farm", policy: "SF-99-421", claim: "", adjusterName: "", adjusterPhone: "", adjusterEmail: "", deductible: "1500", coverage: "RCV", oLaw: true },
    checklist: { ...BLANK_CHECKLIST },
    measurements: { ...BLANK_MEASURE },
    estimate: mkEstimate(),
    contract: mkContract(),
    photos: [
      { id: "p1", label: "Ground shots \u2014 all elevations", at: "Jul 9, 9:41 AM" },
      { id: "p2", label: "Shingle layers at the edge", at: "Jul 9, 9:48 AM" },
      { id: "p3", label: "Hail impact \u2014 south slope", at: "Jul 9, 9:52 AM" }
    ],
    tasks: [
      { id: "t1", label: "Roofing inspection checklist", done: false },
      { id: "t2", label: "Enter measurements", done: false },
      { id: "t3", label: "Build estimate", done: false }
    ],
    files: [{ id: "f1", name: "Hail photos \u2014 insurer upload.zip", cat: "Photos", at: "Jul 9", by: "Jacob Henderson" }],
    payments: [],
    fin: { materials: [], labor: [], other: [], commissionRate: 60, reimbursements: [] },
    portal: { estimate: false, contract: false, photos: false, invoice: false },
    crewId: null,
    messages: [],
    workOrder: null,
    review: { sent: false, clicked: false, posted: false }
  },
  {
    id: "j2",
    name: "Omkar Hirekhan",
    address: "8259 Spruce Needle Court, Columbus, OH",
    zip: "43235",
    state: "OH",
    value: 12480,
    stageId: "s3",
    assignee: "Jacob Henderson",
    leadSource: "Google",
    daysInStage: 26,
    updated: "a month ago",
    claimType: "Retail",
    schedDate: null,
    phone: "(614) 555-0114",
    email: "omkar.h@example.com",
    consent: { sms: { granted: false, at: null, source: null }, email: { granted: true, at: "2026-06-20 14:02", source: "New lead form" } },
    insurance: null,
    checklist: { ...BLANK_CHECKLIST, complete: true, structure: "Single Family", roofAge: "17", method: "Visual, non-invasive; roof surface accessed directly", layers: "1 Layer", roofType: "Asphalt shingle", deckingType: "OSB", deckingCond: "Fair", pitch: "6/12", ventTypes: ["Ridge Vent"], soffitIntake: "Yes", ventCond: "Fair", atticAccess: "Yes", atticDecking: "Good", lightCheck: "No", granuleLoss: "Heavy", windDamage: "Yes", hailImpact: "No", flashingFail: "Yes", pipeBoots: "Yes", overall: "Poor", notes: "Homeowner reports ceiling stain in rear bedroom after spring storms." },
    measurements: { squares: "24.8", pitch: "6/12", ridges: "58", hips: "0", valleys: "34", eaves: "132", rakes: "88", stepFlash: "22", wallFlash: "14", penetrations: "5", waste: 12 },
    estimate: mkEstimate({
      number: "EST-2026-032",
      date: "Jun 24, 2026",
      validThrough: "Jul 24, 2026",
      status: "Sent",
      scope: "Remove existing roof covering to the deck (one layer). Inspect decking and report deterioration prior to dry-in. Install ice-and-water shield at eaves and valleys, synthetic underlayment over the remaining field, new drip edge at eaves and rakes, architectural asphalt shingles fastened per manufacturer specification, new pipe jacks at all penetrations, step and counterflashing where indicated, and hip-and-ridge cap with ridge ventilation. Haul off and dispose of all debris; magnetic sweep on completion.",
      items: [
        { id: "e1", desc: "Tear-off & disposal \u2014 1 layer", qty: 24.8, unit: "SQ", price: 92 },
        { id: "e2", desc: "Ice & water shield \u2014 eaves & valleys", qty: 5.5, unit: "SQ", price: 118 },
        { id: "e3", desc: "Synthetic underlayment \u2014 field", qty: 22, unit: "SQ", price: 34 },
        { id: "e4", desc: "Drip edge \u2014 eaves & rakes", qty: 220, unit: "LF", price: 3.1 },
        { id: "e5", desc: "Architectural shingles (incl. waste)", qty: 27.8, unit: "SQ", price: 262 },
        { id: "e6", desc: "Starter strip \u2014 eaves & rakes", qty: 220, unit: "LF", price: 2.2 },
        { id: "e7", desc: "Hip & ridge cap", qty: 58, unit: "LF", price: 5.4 },
        { id: "e8", desc: "Ridge ventilation", qty: 46, unit: "LF", price: 8.6 },
        { id: "e9", desc: "Pipe jacks at penetrations", qty: 5, unit: "EA", price: 42 }
      ]
    }),
    contract: mkContract(),
    photos: [{ id: "p1", label: "Front elevation", at: "Jun 22, 2:10 PM" }, { id: "p2", label: "Granule loss close-up", at: "Jun 22, 2:24 PM" }],
    tasks: [
      { id: "t1", label: "Roofing inspection checklist", done: true },
      { id: "t2", label: "Build estimate", done: true },
      { id: "t3", label: "Send estimate to client", done: true },
      { id: "t4", label: "Follow-up call", done: false }
    ],
    files: [{ id: "f1", name: "Measurement report.pdf", cat: "Measurements", at: "Jun 23", by: "Jacob Henderson" }],
    payments: [],
    fin: { materials: [], labor: [], other: [], commissionRate: 60, reimbursements: [] },
    portal: { estimate: true, contract: false, photos: true, invoice: false },
    crewId: null,
    messages: [],
    workOrder: null,
    review: { sent: false, clicked: false, posted: false }
  },
  {
    id: "j3",
    name: "Roger Perry",
    address: "810 South College Avenue, Oxford, OH",
    zip: "45056",
    state: "OH",
    value: 13031.16,
    stageId: "s9",
    assignee: "Jacob Henderson",
    leadSource: "Customer referral",
    daysInStage: 4,
    updated: "2 days ago",
    claimType: "Insurance",
    schedDate: "2026-07-18",
    phone: "(513) 555-0187",
    email: "roger.p@example.com",
    consent: { sms: { granted: true, at: "2026-06-02 09:30", source: "New lead form" }, email: { granted: true, at: "2026-06-02 09:30", source: "New lead form" } },
    insurance: { carrier: "Allstate", policy: "AL-77-2210", claim: "CLM-448190", adjusterName: "T. Marsh", adjusterPhone: "(800) 555-0122", adjusterEmail: "t.marsh@example.com", deductible: "1000", coverage: "RCV", oLaw: true },
    checklist: { ...BLANK_CHECKLIST, complete: true, structure: "Single Family", roofAge: "21", method: "Visual, non-invasive; roof surface accessed directly", layers: "1 Layer", roofType: "Asphalt shingle", deckingType: "Plywood", deckingCond: "Fair", pitch: "8/12", ventTypes: ["Box Vents / Turtles"], soffitIntake: "Yes", ventCond: "Poor", atticAccess: "Yes", atticDecking: "Stained / Tracked", lightCheck: "No", granuleLoss: "Heavy", windDamage: "Yes", hailImpact: "Yes", flashingFail: "Yes", pipeBoots: "Yes", overall: "Critical", notes: "Storm date matches carrier CAT event. Chimney counterflashing failed." },
    measurements: { squares: "27.1", pitch: "8/12", ridges: "64", hips: "38", valleys: "52", eaves: "148", rakes: "96", stepFlash: "24", wallFlash: "18", penetrations: "6", waste: 12 },
    estimate: mkEstimate({
      number: "EST-2026-041",
      date: "Jul 20, 2026",
      validThrough: "Aug 21, 2026",
      status: "Signed",
      scope: "Full replacement per inspection findings \u2014 tear-off to deck, ice & water at eaves and valleys, synthetic underlayment, drip edge at eaves and rakes, architectural shingles with 6-nail fastening, new flashings and accessories, ridge vent. Haul-off and magnetic sweep.",
      items: [
        { id: "e1", desc: "Tear-off & disposal \u2014 1 layer", qty: 27.1, unit: "SQ", price: 92 },
        { id: "e2", desc: "Ice & water shield \u2014 eaves & valleys", qty: 6.2, unit: "SQ", price: 118 },
        { id: "e3", desc: "Synthetic underlayment \u2014 field", qty: 24, unit: "SQ", price: 34 },
        { id: "e4", desc: "Drip edge \u2014 eaves & rakes", qty: 244, unit: "LF", price: 3.1 },
        { id: "e5", desc: "Architectural shingles (incl. waste)", qty: 30.4, unit: "SQ", price: 262 },
        { id: "e6", desc: "Hip & ridge cap", qty: 102, unit: "LF", price: 5.4 },
        { id: "e7", desc: "Ridge ventilation", qty: 52, unit: "LF", price: 8.6 },
        { id: "e8", desc: "Chimney counterflashing", qty: 12, unit: "LF", price: 21 },
        { id: "e9", desc: "Pipe jacks at penetrations", qty: 6, unit: "EA", price: 42 }
      ],
      clientSig: "signed",
      sigAt: "Jul 21, 2026"
    }),
    contract: mkContract({
      number: "CON-2026-041",
      price: 13031.16,
      status: "Signed",
      scope: "Full roof replacement per Estimate EST-2026-041 dated Jul 20, 2026: remove existing shingles, install synthetic underlayment, ice & water shield, architectural shingles, ridge vent, new flashing and accessories. Includes haul-off and magnetic sweep.",
      contractorSig: "signed",
      clientSig: "signed",
      signedAt: "Jul 21, 2026"
    }),
    photos: [
      { id: "p1", label: "Cover \u2014 front elevation", at: "Jul 12, 8:05 AM" },
      { id: "p2", label: "Hail impact w/ chalk circle", at: "Jul 12, 8:18 AM" },
      { id: "p3", label: "Chimney counterflashing failure", at: "Jul 12, 8:26 AM" },
      { id: "p4", label: "Attic \u2014 decking staining", at: "Jul 12, 8:40 AM" },
      { id: "p5", label: "Completion \u2014 ridge line", at: "Jul 19, 4:32 PM" }
    ],
    tasks: [
      { id: "t1", label: "Final walk-around", done: true },
      { id: "t2", label: "Collect final payment", done: false },
      { id: "t3", label: "Send review request", done: false }
    ],
    files: [
      { id: "f1", name: "Signed contract.pdf", cat: "Signed paperwork", at: "Jul 21", by: "Jacob Henderson" },
      { id: "f2", name: "QXO delivery ticket.pdf", cat: "Delivery tickets", at: "Jul 17", by: "Jacob Henderson" },
      { id: "f3", name: "Permit \u2014 Butler County.pdf", cat: "Permits", at: "Jul 15", by: "Jacob Henderson" }
    ],
    payments: [
      { id: "pay1", type: "Received", label: "Deposit \u2014 check 1042", amt: 6515.58, date: "Jul 21" },
      { id: "pay2", type: "Paid out", label: "Crew draw \u2014 WO #14", amt: 1500, date: "Jul 18" }
    ],
    fin: {
      materials: [
        { id: "m1", label: "QXO material order", amt: 3774.14, by: "Jacob Henderson" },
        { id: "m2", label: "QXO return", amt: -167.86, by: "Jacob Henderson" }
      ],
      labor: [
        { id: "l1", label: "Work order #14 labor", amt: 2575, by: "Jacob Henderson" },
        { id: "l2", label: "Labor to install wood / dump", amt: 145.5, by: "Jacob Henderson" }
      ],
      other: [
        { id: "o1", label: "Building permit", amt: 52.26, by: "Jacob Henderson" },
        { id: "o2", label: "Lowes", amt: 167.48, by: "Jacob Henderson" }
      ],
      commissionRate: 60,
      reimbursements: [
        { id: "r1", label: "Permit \u2014 out of pocket", amt: 52.26, status: "Reimbursed" },
        { id: "r2", label: "Lowes \u2014 out of pocket", amt: 167.48, status: "Needs paid" }
      ]
    },
    portal: { estimate: true, contract: true, photos: true, invoice: true },
    crewId: "c1",
    messages: [],
    workOrder: { number: "WO-014", sentAt: "Jul 17, 8:02 AM", status: "Sent", notes: "Dumpster on the north side of the drive. Dog in the back yard \u2014 keep the gate shut." },
    review: { sent: false, clicked: false, posted: false }
  },
  {
    id: "j4",
    name: "Jill Neitzel",
    address: "104 Illinois Avenue, Dayton, OH",
    zip: "45410",
    state: "OH",
    value: 17842.05,
    stageId: "s5",
    assignee: "Steven Tatgenhorst",
    leadSource: "Yard sign",
    daysInStage: 2,
    updated: "today",
    claimType: "Insurance",
    schedDate: "2026-07-29",
    phone: "(937) 555-0102",
    email: "jill.n@example.com",
    consent: { sms: { granted: true, at: "2026-07-01 16:40", source: "New lead form" }, email: { granted: true, at: "2026-07-01 16:40", source: "New lead form" } },
    insurance: { carrier: "Erie", policy: "ER-15-0092", claim: "CLM-002617", adjusterName: "K. Boyd", adjusterPhone: "(800) 555-0177", adjusterEmail: "k.boyd@example.com", deductible: "2000", coverage: "RCV", oLaw: false },
    checklist: { ...BLANK_CHECKLIST, complete: true, structure: "Single Family", roofAge: "19", method: "Drone-assisted visual inspection", layers: "2 Layers", roofType: "Asphalt shingle", deckingType: "1x6 Plank / Spaced Lumber", deckingCond: "Poor", pitch: "6/12", ventTypes: ["Gable Vents"], soffitIntake: "No", ventCond: "Critical", atticAccess: "Yes", atticDecking: "Active Rot / Mold", lightCheck: "Yes", granuleLoss: "Critical", windDamage: "Yes", hailImpact: "Yes", flashingFail: "Yes", pipeBoots: "Yes", overall: "Critical", notes: "Two layers \u2014 full tear-off supplement filed. Ventilation upgrade supplement pending." },
    measurements: { squares: "31.6", pitch: "6/12", ridges: "72", hips: "12", valleys: "40", eaves: "156", rakes: "104", stepFlash: "18", wallFlash: "22", penetrations: "7", waste: 15 },
    estimate: mkEstimate({ number: "EST-2026-044", date: "Jul 14, 2026", validThrough: "Aug 14, 2026", status: "Signed", scope: "Insurance scope plus approved supplements: full two-layer tear-off, decking allowance, code ventilation upgrade.", items: [{ id: "e1", desc: "Tear-off & disposal \u2014 2 layers", qty: 31.6, unit: "SQ", price: 128 }, { id: "e2", desc: "Architectural shingles (incl. waste)", qty: 36.3, unit: "SQ", price: 262 }, { id: "e3", desc: "Ridge ventilation + soffit intake", qty: 60, unit: "LF", price: 11.2 }], clientSig: "signed", sigAt: "Jul 15, 2026" }),
    contract: mkContract({ number: "CON-2026-044", price: 17842.05, status: "Signed", scope: "Per Estimate EST-2026-044 and approved insurance scope.", contractorSig: "signed", clientSig: "signed", signedAt: "Jul 15, 2026" }),
    photos: [{ id: "p1", label: "Layer count at edge", at: "Jul 10, 11:02 AM" }, { id: "p2", label: "Attic \u2014 daylight through decking", at: "Jul 10, 11:20 AM" }],
    tasks: [
      { id: "t1", label: "Order materials", done: true },
      { id: "t2", label: "Schedule crew", done: false },
      { id: "t3", label: "Confirm supplement approval", done: false }
    ],
    files: [{ id: "f1", name: "Carrier scope.pdf", cat: "Insurance", at: "Jul 11", by: "Steven Tatgenhorst" }],
    payments: [],
    fin: {
      materials: [
        { id: "m1", label: "QXO material invoice", amt: 5479.72, by: "Steven Tatgenhorst" },
        { id: "m2", label: "SRS siding", amt: 64.53, by: "Steven Tatgenhorst" }
      ],
      labor: [{ id: "l1", label: "Install labor", amt: 5e3, by: "Steven Tatgenhorst" }],
      other: [{ id: "o1", label: "Material dump", amt: 160.68, by: "Steven Tatgenhorst" }],
      commissionRate: 60,
      reimbursements: []
    },
    portal: { estimate: true, contract: true, photos: false, invoice: false },
    crewId: "c2",
    messages: [],
    workOrder: null,
    review: { sent: false, clicked: false, posted: false }
  },
  {
    id: "j5",
    name: "Marcy Templeton",
    address: "44 Birch Row, Crystal Lake, IL",
    zip: "60014",
    state: "IL",
    value: 0,
    stageId: "s1",
    assignee: "Drew Klass",
    leadSource: "Website",
    daysInStage: 1,
    updated: "1 hour ago",
    claimType: "Unknown",
    schedDate: null,
    phone: "(847) 555-0119",
    email: "marcy.t@example.com",
    consent: { sms: { granted: true, at: "2026-07-21 18:05", source: "Website form" }, email: { granted: true, at: "2026-07-21 18:05", source: "Website form" } },
    insurance: null,
    checklist: { ...BLANK_CHECKLIST },
    measurements: { ...BLANK_MEASURE },
    estimate: mkEstimate(),
    contract: mkContract(),
    photos: [],
    tasks: [{ id: "t1", label: "Schedule inspection", done: false }],
    files: [],
    payments: [],
    fin: { materials: [], labor: [], other: [], commissionRate: 60, reimbursements: [] },
    portal: { estimate: false, contract: false, photos: false, invoice: false },
    crewId: null,
    messages: [],
    workOrder: null,
    review: { sent: false, clicked: false, posted: false }
  },
  {
    id: "j6",
    name: "Dale Whitfield",
    address: "902 Ridgepoint Dr, Maysville, KY",
    zip: "41056",
    state: "KY",
    value: 9420,
    stageId: "s10",
    assignee: "Stephen Klein",
    leadSource: "Repeat customer",
    daysInStage: 3,
    updated: "yesterday",
    claimType: "Retail",
    schedDate: null,
    phone: "(606) 555-0161",
    email: "dale.w@example.com",
    consent: { sms: { granted: true, at: "2026-05-30 08:15", source: "New lead form" }, email: { granted: true, at: "2026-05-30 08:15", source: "New lead form" } },
    insurance: null,
    checklist: { ...BLANK_CHECKLIST, complete: true, overall: "Poor", structure: "Single Family", roofAge: "24", layers: "1 Layer", roofType: "Asphalt shingle", pitch: "5/12", method: "Visual, non-invasive; roof surface accessed directly" },
    measurements: { squares: "18.4", pitch: "5/12", ridges: "44", hips: "0", valleys: "20", eaves: "104", rakes: "70", stepFlash: "12", wallFlash: "8", penetrations: "4", waste: 10 },
    estimate: mkEstimate({ number: "EST-2026-029", date: "Jun 4, 2026", validThrough: "Jul 4, 2026", status: "Signed", scope: "Full replacement, retail.", items: [{ id: "e1", desc: "Full replacement package", qty: 1, unit: "JOB", price: 9420 }], clientSig: "signed", sigAt: "Jun 6, 2026" }),
    contract: mkContract({ number: "CON-2026-029", price: 9420, status: "Signed", scope: "Per Estimate EST-2026-029.", contractorSig: "signed", clientSig: "signed", signedAt: "Jun 6, 2026" }),
    photos: [{ id: "p1", label: "Completion \u2014 front", at: "Jul 19, 3:15 PM" }],
    tasks: [{ id: "t1", label: "Send review request", done: false }],
    files: [],
    payments: [{ id: "pay1", type: "Received", label: "Paid in full \u2014 card", amt: 9420, date: "Jul 20" }],
    fin: {
      materials: [{ id: "m1", label: "Material order", amt: 2610.4, by: "Stephen Klein" }],
      labor: [{ id: "l1", label: "Crew labor", amt: 2480, by: "Stephen Klein" }],
      other: [],
      commissionRate: 55,
      reimbursements: []
    },
    portal: { estimate: true, contract: true, photos: true, invoice: true },
    crewId: "c1",
    messages: [],
    workOrder: { number: "WO-014", sentAt: "Jul 17, 8:02 AM", status: "Sent", notes: "Dumpster on the north side of the drive. Dog in the back yard \u2014 keep the gate shut." },
    review: { sent: true, clicked: true, posted: true }
  }
];
var ZIP_PREFIX_STATE = [
  { lo: 430, hi: 459, state: "OH" },
  { lo: 400, hi: 427, state: "KY" },
  { lo: 600, hi: 629, state: "IL" }
];
var STATE_DEFAULTS = {
  OH: {
    codeName: "Residential Code of Ohio (RCO)",
    codeEdition: "Current RCO \u2014 confirm edition",
    adoption: "Statewide residential code (OAC 4101:8) \u2014 applies in all Ohio jurisdictions.",
    permit: "Roofing permit generally required for full replacement. Confirm with the local building department.",
    sources: ["RCO", "OAC3901"]
  },
  KY: {
    codeName: "Kentucky Residential Code (KRC)",
    codeEdition: "Current KRC \u2014 confirm edition",
    adoption: "Statewide residential code administered by KY DHBC \u2014 applies in all Kentucky jurisdictions.",
    permit: "Permit handling varies by county/city. Confirm with the local building official before tear-off.",
    sources: ["KYDHBC", "ICC"]
  },
  IL: {
    codeName: "Locally adopted IRC",
    codeEdition: "Varies by municipality \u2014 confirm adopted edition",
    adoption: "Illinois has NO statewide residential code. Each municipality adopts its own edition and amendments.",
    permit: "Permit rules are municipal. You must confirm the adopting ordinance for this address.",
    sources: ["MUNICODE", "ICC"]
  }
};
function stateForZip(zip) {
  const p = parseInt(String(zip).slice(0, 3), 10);
  if (isNaN(p)) return null;
  const hit = ZIP_PREFIX_STATE.find((r) => p >= r.lo && p <= r.hi);
  return hit ? hit.state : null;
}
function resolveJurisdiction(zip) {
  const z = String(zip || "").trim();
  if (z.length !== 5) return null;
  const exact = JURISDICTIONS[z];
  if (exact) return { ...exact, precision: "verified" };
  const st = stateForZip(z);
  if (!st) return null;
  const d = STATE_DEFAULTS[st];
  return {
    zip: z,
    city: "",
    county: "",
    state: st,
    codeName: d.codeName,
    codeEdition: d.codeEdition,
    adoption: d.adoption,
    permit: d.permit,
    inspector: { office: "Local building department \u2014 not yet on file", phone: "", address: "" },
    verified: false,
    sources: d.sources,
    verifiedDetail: { date: null, by: null },
    precision: "state"
  };
}
var GEO_PROVIDER = {
  name: "geoapify",
  apiKey: typeof window !== "undefined" && window.__GEOAPIFY_KEY__ || "d4895cd9d44b4229af2885ffa85e343e",
  base: "https://api.geoapify.com/v1/geocode",
  countries: "us"
};
var geoReady = () => !!(GEO_PROVIDER.apiKey && GEO_PROVIDER.name === "geoapify");
async function geoAutocomplete(text, signal) {
  if (!geoReady() || !text || text.trim().length < 3) return [];
  const url = `${GEO_PROVIDER.base}/autocomplete?text=${encodeURIComponent(text)}&filter=countrycode:${GEO_PROVIDER.countries}&limit=6&format=json&apiKey=${GEO_PROVIDER.apiKey}`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r) => ({
      id: r.place_id || `${r.lat},${r.lon}`,
      formatted: r.formatted || "",
      street: [r.housenumber, r.street].filter(Boolean).join(" ") || r.address_line1 || "",
      city: r.city || r.town || r.village || r.county || "",
      state: r.state_code || "",
      zip: r.postcode || "",
      lat: r.lat,
      lng: r.lon
    }));
  } catch {
    return [];
  }
}
async function geoReverse(lat, lng) {
  if (!geoReady() || lat == null || lng == null) return null;
  const url = `${GEO_PROVIDER.base}/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${GEO_PROVIDER.apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const r = (data.results || [])[0];
    if (!r) return null;
    return {
      formatted: r.formatted || "",
      street: [r.housenumber, r.street].filter(Boolean).join(" ") || r.address_line1 || "",
      city: r.city || r.town || r.village || "",
      state: r.state_code || "",
      zip: r.postcode || ""
    };
  } catch {
    return null;
  }
}
function captureLocation() {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ok: false, reason: "Geolocation not supported on this device." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        ok: true,
        lat: +pos.coords.latitude.toFixed(6),
        lng: +pos.coords.longitude.toFixed(6),
        accuracy: Math.round(pos.coords.accuracy),
        at: (/* @__PURE__ */ new Date()).toISOString()
      }),
      (err) => resolve({ ok: false, reason: err.code === 1 ? "Location permission denied." : "Could not get a location fix." }),
      { enableHighAccuracy: true, timeout: 1e4, maximumAge: 0 }
    );
  });
}
var fmtCoord = (lat, lng) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
var mapLinkForCoords = (lat, lng) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
var mapLinkForAddress = (addr) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
var directionsLink = (addr) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
var staticMapEmbed = (lat, lng) => {
  const d = 4e-3;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
};
var fmtStamp = (iso) => {
  try {
    return new Date(iso).toLocaleString(void 0, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  } catch {
    return iso;
  }
};
var money = (n) => (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
var pct1 = (n) => `${n.toFixed(2)}%`;
var num = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};
var uid = (p) => p + Math.random().toString(36).slice(2, 8);
var nowStamp = () => (/* @__PURE__ */ new Date()).toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
function estimateTotal(est) {
  return est.items.reduce((s, it) => s + num(it.qty) * num(it.price), 0);
}
function computeFin(fin) {
  const sum = (a) => a.reduce((s, x) => s + x.amt, 0);
  const materials = sum(fin.materials), labor = sum(fin.labor), other = sum(fin.other);
  return { materials, labor, other, cogs: materials + labor + other };
}
var STRUCTURES = [
  {
    id: "grossProfit",
    label: "Gross Profit",
    usesRate: true,
    usesOverhead: false,
    blurb: "Rate % of (contract \u2212 COGS). No overhead allocation before the split."
  },
  {
    id: "netProfit",
    label: "Net Profit",
    usesRate: true,
    usesOverhead: true,
    blurb: "Rate % of (contract \u2212 COGS \u2212 overhead allocation). Overhead % of contract is set below."
  },
  {
    id: "tenFiftyFifty",
    label: "10 / 50 / 50",
    usesRate: false,
    usesOverhead: false,
    blurb: "10% of contract off the top to company overhead, then remaining profit split 50/50 rep and company."
  },
  {
    id: "grossContract",
    label: "Gross Contract",
    usesRate: true,
    usesOverhead: false,
    blurb: "Rate % of total contract value, regardless of job cost."
  }
];
function computeCapOut(job2) {
  const { materials, labor, other, cogs } = computeFin(job2.fin);
  const contract = job2.contract.price || estimateTotal(job2.estimate) || job2.value || 0;
  const gross = contract - cogs;
  const structure = job2.fin.structure || "grossProfit";
  const rate = job2.fin.commissionRate;
  const overheadPct = job2.fin.overheadPct ?? 10;
  const overheadAlloc = contract * (overheadPct / 100);
  const net = gross - overheadAlloc;
  let commission = 0, base = 0, baseLabel = "";
  if (structure === "netProfit") {
    base = net;
    baseLabel = "Net profit";
    commission = Math.max(0, net) * (rate / 100);
  } else if (structure === "tenFiftyFifty") {
    const top = contract * 0.1;
    const remaining = gross - top;
    base = remaining;
    baseLabel = "Profit after 10% overhead";
    commission = Math.max(0, remaining) * 0.5;
  } else if (structure === "grossContract") {
    base = contract;
    baseLabel = "Contract value";
    commission = contract * (rate / 100);
  } else {
    base = gross;
    baseLabel = "Gross profit";
    commission = Math.max(0, gross) * (rate / 100);
  }
  const netCompany = gross - commission;
  const reimbTotal = job2.fin.reimbursements.reduce((s, r) => s + r.amt, 0);
  return {
    contract,
    materials,
    labor,
    other,
    cogs,
    gross,
    grossMargin: contract ? gross / contract * 100 : 0,
    structure,
    base,
    baseLabel,
    overheadAlloc,
    overheadPct,
    commission,
    netCompany,
    repPctGross: gross > 0 ? commission / gross * 100 : 0,
    coPctGross: gross > 0 ? netCompany / gross * 100 : 0,
    repPctJob: contract ? commission / contract * 100 : 0,
    coPctJob: contract ? netCompany / contract * 100 : 0,
    reimbTotal,
    payout: commission + reimbTotal
  };
}
function compareStructures(job2) {
  return STRUCTURES.map((st) => {
    const c = computeCapOut({ ...job2, fin: { ...job2.fin, structure: st.id } });
    return { id: st.id, label: st.label, commission: c.commission, netCompany: c.netCompany };
  });
}
function paymentsSummary(job2) {
  const received = job2.payments.filter((p) => p.type === "Received").reduce((s, p) => s + p.amt, 0);
  const paidOut = job2.payments.filter((p) => p.type !== "Received").reduce((s, p) => s + p.amt, 0);
  const contract = job2.contract.price || estimateTotal(job2.estimate) || job2.value || 0;
  return { received, paidOut, contract, balance: contract - received };
}
function downloadCsv(name, rows) {
  try {
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2e3);
    return true;
  } catch (e) {
    if (typeof window !== "undefined" && window.alert) window.alert("Download blocked in this preview. On the deployed site this saves a file.");
    return false;
  }
}
function jurisdictionForZip(zip) {
  return resolveJurisdiction(zip);
}
function citeFor(state, topic) {
  return CODE_PROVISIONS[state] && CODE_PROVISIONS[state][topic] || CODE_PROVISIONS.OH[topic];
}
function generateRoofingMaterials(m) {
  if (!num(m.squares)) return null;
  const sq = num(m.squares) * (1 + num(m.waste) / 100);
  const lfEavesRakes = num(m.eaves) + num(m.rakes);
  return [
    { item: "Architectural shingles", qty: Math.ceil(sq * 3), unit: "bundles", note: `${sq.toFixed(1)} SQ incl. ${m.waste}% waste` },
    { item: "Hip & ridge cap", qty: Math.max(1, Math.ceil((num(m.ridges) + num(m.hips)) / 25)), unit: "bundles", note: `${num(m.ridges) + num(m.hips)} LF ridge + hip` },
    { item: "Starter strip", qty: Math.max(1, Math.ceil(lfEavesRakes / 105)), unit: "rolls", note: `${lfEavesRakes} LF eaves + rakes` },
    { item: "Synthetic underlayment", qty: Math.max(1, Math.ceil(sq / 10)), unit: "rolls", note: "10 SQ per roll" },
    { item: "Ice & water shield", qty: Math.max(1, Math.ceil((num(m.eaves) + num(m.valleys)) / 65)), unit: "rolls", note: `${num(m.eaves) + num(m.valleys)} LF eaves + valleys` },
    { item: "Drip edge (10 ft sticks)", qty: Math.ceil(lfEavesRakes / 10), unit: "sticks", note: `${lfEavesRakes} LF` },
    { item: "Ridge vent", qty: Math.ceil(num(m.ridges) / 4), unit: "4 ft sections", note: `${m.ridges} LF ridge` },
    { item: "Step flashing", qty: Math.ceil(num(m.stepFlash) * 1.4), unit: "pieces", note: `${m.stepFlash} LF` },
    { item: "Pipe jacks", qty: num(m.penetrations), unit: "each", note: "one per penetration" },
    { item: "Coil nails 1-1/4 in.", qty: Math.max(1, Math.ceil(sq / 18)), unit: "boxes", note: "about 18 SQ per box" },
    { item: "Cap nails", qty: Math.max(1, Math.ceil(sq / 30)), unit: "boxes", note: "underlayment fastening" }
  ];
}
var AUTH = () => typeof window !== "undefined" ? window.__AUTH__ : null;
var liveAuth = () => !!AUTH();
var fromProfile = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone || "",
  role: row.role,
  title: row.title || "",
  active: row.active,
  commissionRate: row.commission_rate != null ? Number(row.commission_rate) : 60,
  addedAt: row.added_at || ""
});
var toProfile = (u) => ({
  name: u.name,
  email: u.email,
  phone: u.phone || null,
  role: u.role,
  title: u.title || null,
  commission_rate: u.commissionRate ?? 60,
  active: u.active
});
var S = { ink: "#111827", sub: "#6B7280", line: "#E5E7EB", bg: "#F7F8FA", soft: "#F3F4F6" };
var T = { primary: "#28373E", accent: "#1B6DE0", accentSoft: "#EAF2FD" };
function softOf(hex) {
  try {
    const n = parseInt(hex.slice(1), 16);
    const r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    const mix = (c) => Math.round(c + (255 - c) * 0.88);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  } catch {
    return "#EAF2FD";
  }
}
function Chip({ children, tone = "gray" }) {
  const tones = {
    gray: { bg: "#F3F4F6", fg: "#374151" },
    blue: { bg: T.accentSoft, fg: T.accent },
    green: { bg: "#E8F6EE", fg: "#177245" },
    red: { bg: "#FDECEC", fg: "#B42318" },
    amber: { bg: "#FDF4E3", fg: "#92600A" },
    slate: { bg: "#E9EDEF", fg: T.primary }
  };
  const t = tones[tone] || tones.gray;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
    background: t.bg,
    color: t.fg,
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 999,
    whiteSpace: "nowrap",
    display: "inline-block"
  }, children });
}
function Btn({ children, kind = "primary", onClick, style, small, disabled }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "1px solid transparent",
    borderRadius: 10,
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600,
    fontSize: small ? 13 : 15,
    padding: small ? "7px 12px" : "11px 18px",
    opacity: disabled ? 0.5 : 1
  };
  const kinds = {
    primary: { background: T.accent, color: "#fff" },
    dark: { background: T.primary, color: "#fff" },
    ghost: { background: "#fff", color: S.ink, border: `1px solid ${S.line}` },
    soft: { background: T.accentSoft, color: T.accent },
    danger: { background: "#fff", color: "#B42318", border: `1px solid ${S.line}` },
    green: { background: "#177245", color: "#fff" }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: disabled ? void 0 : onClick, style: { ...base, ...kinds[kind], ...style }, children });
}
function Field({ label, children, hint }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "block", marginBottom: 14 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 600, color: S.ink, marginBottom: 6 }, children: label }),
    children,
    hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 5 }, children: hint })
  ] });
}
var inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 13px",
  fontSize: 15,
  border: `1px solid ${S.line}`,
  borderRadius: 10,
  background: "#fff",
  color: S.ink,
  outline: "none",
  fontFamily: "inherit"
};
var selStyle = { ...inputStyle, appearance: "auto" };
function Card({ children, style, pad = 18, onClick }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { onClick, style: { background: "#fff", border: `1px solid ${S.line}`, borderRadius: 14, padding: pad, ...style }, children });
}
function CardTitle({ children, right }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700, color: S.ink }, children }),
    right
  ] });
}
function KV({ k, v, strong }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, color: S.sub }, children: k }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, fontWeight: strong ? 800 : 600, color: S.ink, textAlign: "right" }, children: v })
  ] });
}
function Callout({ label, children, tone = "amber" }) {
  const map = {
    amber: ["#FDF4E3", "#92600A"],
    red: ["#FDECEC", "#B42318"],
    green: ["#E8F6EE", "#177245"]
  };
  const [bg, fg] = map[tone] || map.amber;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: bg, borderLeft: `3px solid ${fg}`, borderRadius: 8, padding: "12px 14px", marginTop: 12 }, children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: fg, marginBottom: 6 }, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.55 }, children })
  ] });
}
function Bullets({ items }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { style: { margin: "6px 0 0", paddingLeft: 18 }, children: items.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { style: { fontSize: 14, color: S.ink, lineHeight: 1.55, marginBottom: 6 }, children: t }, i)) });
}
function SourceLink({ srcId }) {
  const s = SOURCES[srcId];
  if (!s) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", { href: s.url, target: "_blank", rel: "noreferrer", style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    textDecoration: "none",
    border: `1px solid ${S.line}`,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12.5,
    fontWeight: 700,
    color: T.accent,
    background: "#fff",
    marginTop: 8,
    marginRight: 8
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ExternalLink, { size: 13 }),
    " ",
    s.name
  ] });
}
function AddressAutocomplete({ value, onChange, onPick, placeholder }) {
  const [items, setItems] = (0, import_react.useState)([]);
  const [open, setOpen] = (0, import_react.useState)(false);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [hi, setHi] = (0, import_react.useState)(-1);
  const abortRef = (0, import_react.useRef)(null);
  const timerRef = (0, import_react.useRef)(null);
  const blurRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();
    if (blurRef.current) clearTimeout(blurRef.current);
  }, []);
  const query = (text) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!geoReady() || text.trim().length < 3) {
      setItems([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const ctl = new AbortController();
      abortRef.current = ctl;
      setBusy(true);
      const res = await geoAutocomplete(text, ctl.signal);
      setBusy(false);
      setItems(res);
      setHi(-1);
      setOpen(res.length > 0);
    }, 280);
  };
  const choose = (it) => {
    setOpen(false);
    setItems([]);
    onPick(it);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { position: "relative" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: { ...inputStyle, paddingRight: 36 },
          value,
          placeholder,
          autoComplete: "off",
          onChange: (e) => {
            onChange(e.target.value);
            query(e.target.value);
          },
          onFocus: () => items.length && setOpen(true),
          onBlur: () => {
            blurRef.current = setTimeout(() => setOpen(false), 160);
          },
          onKeyDown: (e) => {
            if (!open || !items.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHi((h) => (h + 1) % items.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHi((h) => (h - 1 + items.length) % items.length);
            } else if (e.key === "Enter" && hi >= 0) {
              e.preventDefault();
              choose(items[hi]);
            } else if (e.key === "Escape") setOpen(false);
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", display: "flex" }, children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.RefreshCw, { size: 15, color: "#9CA3AF" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 15, color: "#C7CBD1" }) })
    ] }),
    open && items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
      position: "absolute",
      top: "calc(100% + 4px)",
      left: 0,
      right: 0,
      zIndex: 30,
      background: "#fff",
      border: `1px solid ${S.line}`,
      borderRadius: 12,
      boxShadow: "0 10px 28px rgba(17,24,39,.14)",
      overflow: "hidden",
      maxHeight: 260,
      overflowY: "auto"
    }, children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        type: "button",
        onMouseDown: (e) => e.preventDefault(),
        onClick: () => choose(it),
        onMouseEnter: () => setHi(i),
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          width: "100%",
          textAlign: "left",
          border: "none",
          cursor: "pointer",
          padding: "11px 13px",
          background: hi === i ? T.accentSoft : "#fff",
          borderTop: i ? `1px solid ${S.line}` : "none"
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 14, color: T.accent, style: { flexShrink: 0, marginTop: 2 } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { display: "block", fontSize: 14, fontWeight: 600, color: S.ink }, children: it.street || it.formatted }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { display: "block", fontSize: 12, color: S.sub, marginTop: 2 }, children: [it.city, it.state, it.zip].filter(Boolean).join(", ") })
          ] })
        ]
      },
      it.id
    )) })
  ] });
}
function Sheet({ open, onClose, title, children, footer, wide }) {
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 60,
    background: "rgba(17,24,39,.45)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center"
  }, onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { onClick: (e) => e.stopPropagation(), style: {
    background: "#fff",
    width: "100%",
    maxWidth: wide ? 760 : 560,
    maxHeight: "90vh",
    borderRadius: "18px 18px 0 0",
    display: "flex",
    flexDirection: "column"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 12px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 20, fontWeight: 700, color: S.ink }, children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: onClose, style: {
        border: "none",
        background: "#F3F4F6",
        borderRadius: 999,
        width: 34,
        height: 34,
        display: "grid",
        placeItems: "center",
        cursor: "pointer"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 17 }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { overflowY: "auto", padding: "4px 20px 20px", flex: 1 }, children }),
    footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: "12px 20px 20px", borderTop: `1px solid ${S.line}` }, children: footer })
  ] }) });
}
function Toast({ msg }) {
  if (!msg) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
    position: "fixed",
    bottom: 96,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#111827",
    color: "#fff",
    borderRadius: 999,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    zIndex: 90,
    whiteSpace: "nowrap"
  }, children: msg });
}
function SignaturePad({ open, onClose, title, onApply }) {
  const ref = (0, import_react.useRef)(null);
  const drawing = (0, import_react.useRef)(false);
  const dirty = (0, import_react.useRef)(false);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    dirty.current = false;
  }, [open]);
  const pos = (e) => {
    const cv = ref.current, r = cv.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - r.left) / r.width * cv.width, y: (t.clientY - r.top) / r.height * cv.height };
  };
  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = ref.current.getContext("2d");
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = ref.current.getContext("2d");
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    dirty.current = true;
  };
  const end = () => {
    drawing.current = false;
  };
  const clear = () => {
    const cv = ref.current, ctx = cv.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cv.width, cv.height);
    dirty.current = false;
  };
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    Sheet,
    {
      open,
      onClose,
      title,
      footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: clear, children: "Clear" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { flex: 2 }, onClick: () => {
          if (!dirty.current) return;
          onApply(ref.current.toDataURL("image/png"), nowStamp());
          onClose();
        }, children: "Apply signature" })
      ] }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, marginBottom: 12 }, children: "Sign with a finger or stylus. The signature and today's date are placed on the acceptance line, and the document is locked against silent edits." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "canvas",
          {
            ref,
            width: 800,
            height: 300,
            onMouseDown: start,
            onMouseMove: move,
            onMouseUp: end,
            onMouseLeave: end,
            onTouchStart: start,
            onTouchMove: move,
            onTouchEnd: end,
            style: {
              width: "100%",
              height: 190,
              border: `1.5px dashed ${S.line}`,
              borderRadius: 12,
              touchAction: "none",
              background: "#fff",
              display: "block"
            }
          }
        )
      ]
    }
  );
}
function Login({ brand: brand2, users, onLogin }) {
  const [mode, setMode] = (0, import_react.useState)("login");
  const [email, setEmail] = (0, import_react.useState)("");
  const [pw, setPw] = (0, import_react.useState)("");
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [err, setErr] = (0, import_react.useState)("");
  const active = (users || []).filter((u) => u.active);
  const live = liveAuth();
  const submit = async () => {
    setErr("");
    setBusy(true);
    try {
      await AUTH().signIn(email.trim(), pw);
    } catch (e) {
      setErr(e && e.message ? e.message : "Could not sign in. Check the email and password.");
      setBusy(false);
    }
  };
  const reset = async () => {
    setErr("");
    setBusy(true);
    try {
      await AUTH().resetPassword(email.trim());
      setMode("sent");
    } catch (e) {
      setErr(e && e.message ? e.message : "Could not send the reset link.");
    }
    setBusy(false);
  };
  if (!live && mode === "account") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { minHeight: "100vh", background: brand2.primary, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { width: "100%", maxWidth: 420 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", marginBottom: 22 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 56, height: 56, borderRadius: 14, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Shield, { size: 28, color: brand2.primary }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 22, fontWeight: 800, color: "#fff" }, children: brand2.company }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }, children: brand2.slogan })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { padding: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: S.sub, padding: "4px 6px 10px" }, children: "Continue as" }),
        active.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => onLogin(u), style: {
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          textAlign: "left",
          border: "none",
          background: "none",
          cursor: "pointer",
          padding: "12px 6px",
          borderTop: i ? `1px solid ${S.line}` : "none"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
            width: 38,
            height: 38,
            borderRadius: 999,
            flexShrink: 0,
            background: u.role === "admin" ? brand2.primary : T.accentSoft,
            color: u.role === "admin" ? "#fff" : T.accent,
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 14
          }, children: u.name.split(" ").map((x) => x[0]).join("") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700, color: S.ink }, children: u.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub }, children: u.title })
          ] }),
          u.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "gray", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 10, style: { marginRight: 4, verticalAlign: -1 } }),
            "Admin"
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { size: 16, color: "#C7CBD1" })
        ] }, u.id))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 14 }, children: "Demo mode \u2014 no backend connected. Nothing you change here is saved." })
    ] }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
    minHeight: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    position: "relative"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { width: "100%", maxWidth: 400 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", marginBottom: 32 }, children: [
        brand2.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: brand2.logo, alt: brand2.company, style: { height: 72, maxWidth: 220, objectFit: "contain", margin: "0 auto 14px", display: "block" } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
          width: 64,
          height: 64,
          margin: "0 auto 14px",
          borderRadius: 16,
          background: brand2.primary,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: 1
        }, children: brand2.short }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 24, fontWeight: 800, color: S.ink }, children: brand2.company }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, marginTop: 6 }, children: brand2.slogan })
      ] }),
      mode === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Email", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: inputStyle,
            type: "email",
            autoComplete: "username",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "you@supremebuildinggroup.com"
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Password", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: inputStyle,
            type: "password",
            autoComplete: "current-password",
            value: pw,
            onChange: (e) => setPw(e.target.value),
            placeholder: "Enter your password",
            onKeyDown: (e) => {
              if (e.key === "Enter" && live && email && pw) submit();
            }
          }
        ) }),
        err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Sign-in failed", tone: "red", children: err }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Btn,
          {
            onClick: live ? submit : () => setMode("account"),
            disabled: busy || live && (!email.trim() || !pw),
            style: { width: "100%", marginTop: 4 },
            children: busy ? "Signing in\u2026" : "Sign in"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => {
          setErr("");
          setMode("forgot");
        }, style: {
          display: "block",
          margin: "16px auto 0",
          border: "none",
          background: "none",
          color: T.accent,
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer"
        }, children: "Forgot password?" }),
        !live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { textAlign: "center", fontSize: 12, color: S.sub, marginTop: 18, lineHeight: 1.5 }, children: "No backend connected \u2014 sign in opens the demo account picker." })
      ] }),
      mode === "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, color: S.sub, marginBottom: 18 }, children: "Enter your email and we'll send a link to set a new password." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Email", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "email", value: email, onChange: (e) => setEmail(e.target.value) }) }),
        err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Could not send", tone: "red", children: err }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: live ? reset : () => setMode("sent"), disabled: busy || !email.trim(), style: { width: "100%" }, children: busy ? "Sending\u2026" : "Send reset link" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => {
          setErr("");
          setMode("login");
        }, style: {
          display: "block",
          margin: "16px auto 0",
          border: "none",
          background: "none",
          color: S.sub,
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer"
        }, children: "Back to sign in" })
      ] }),
      mode === "sent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { size: 40, color: "#177245", style: { marginBottom: 12 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 16, fontWeight: 700, color: S.ink, marginBottom: 6 }, children: "Check your email" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14, color: S.sub, marginBottom: 20 }, children: [
          "If an account exists for ",
          email || "that address",
          ", a reset link is on its way."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", onClick: () => setMode("login"), style: { width: "100%" }, children: "Back to sign in" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { position: "absolute", bottom: 20, fontSize: 12, color: "#9CA3AF" }, children: [
      "\xA9 ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " ",
      brand2.company
    ] })
  ] });
}
function Dashboard({ jobs, stages, onOpenJob, userName, go, onNewLead, onQuickTask }) {
  const totalPipeline = jobs.filter((j) => !DEAD_STAGES.includes(j.stageId) && j.stageId !== "s10").reduce((s, j) => s + j.value, 0);
  const stale = jobs.filter((j) => j.daysInStage >= 14 && !["s10", "s11", "s12"].includes(j.stageId));
  const approvedPlus = jobs.filter((j) => WON_STAGES.includes(j.stageId));
  const signedValue = approvedPlus.reduce((s, j) => s + (j.contract.price || j.value), 0);
  const byStage = stages.map((s) => ({
    ...s,
    count: jobs.filter((j) => j.stageId === s.id).length,
    value: jobs.filter((j) => j.stageId === s.id).reduce((a, j) => a + j.value, 0)
  }));
  const reviewsSent = jobs.filter((j) => j.review.sent).length;
  const ar = jobs.map((j) => paymentsSummary(j)).filter((p) => p.balance > 0.01 && p.contract > 0);
  const arTotal = ar.reduce((s, p) => s + p.balance, 0);
  const openTasks = jobs.flatMap((j) => j.tasks.filter((t) => !t.done).map((t) => ({ job: j, t })));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "20px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 24, fontWeight: 800, color: S.ink }, children: [
      "Welcome back, ",
      userName.split(" ")[0]
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, marginTop: 4 }, children: (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }, children: [
      ["Pipeline value", money(totalPipeline), "Open jobs, all stages"],
      ["Signed value", money(signedValue), "Approved and beyond"],
      ["Accounts receivable", money(arTotal), `${ar.length} open balance${ar.length === 1 ? "" : "s"}`],
      ["Stale jobs", String(stale.length), "14+ days untouched"]
    ].map(([l, v, sub]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 16, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 20, fontWeight: 800, color: S.ink }, children: v }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: S.ink, marginTop: 4 }, children: l }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 2 }, children: sub })
    ] }, l)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => go("jobs"), style: { border: "none", background: "none", color: T.accent, fontWeight: 700, fontSize: 13, cursor: "pointer" }, children: "Open board" }), children: "Pipeline by stage" }),
      byStage.filter((s) => s.count > 0).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontWeight: 600, color: S.ink }, children: [
            s.name,
            " \xB7 ",
            s.count
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: S.sub }, children: money(s.value) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 7, background: "#EEF1F4", borderRadius: 99 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
          height: 7,
          borderRadius: 99,
          background: T.accent,
          width: `${Math.max(5, totalPipeline + signedValue ? s.value / Math.max(totalPipeline, signedValue) * 100 : 0)}%`,
          maxWidth: "100%"
        } }) })
      ] }, s.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "soft", small: true, onClick: onQuickTask, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 12 }),
          " Task"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "soft", small: true, onClick: onNewLead, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 12 }),
          " Lead"
        ] })
      ] }), children: "Needs attention" }),
      stale.length === 0 && openTasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "Nothing stale and no open tasks. Pipeline is moving." }),
      stale.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => onOpenJob(j.id), style: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "none",
        background: "none",
        cursor: "pointer",
        textAlign: "left",
        padding: "11px 0",
        borderBottom: `1px solid ${S.line}`
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700, color: S.ink }, children: j.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: j.address })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "red", children: [
          j.daysInStage,
          "d in stage"
        ] })
      ] }, j.id)),
      openTasks.slice(0, 5).map(({ job: job2, t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => onOpenJob(job2.id), style: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "none",
        background: "none",
        cursor: "pointer",
        textAlign: "left",
        padding: "11px 0",
        borderBottom: `1px solid ${S.line}`
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Circle, { size: 16, color: "#C7CBD1" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 600, color: S.ink }, children: t.label }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: job2.name })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { size: 16, color: "#C7CBD1" })
      ] }, job2.id + t.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "blue", children: [
        reviewsSent,
        " sent"
      ] }), children: "Reviews" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub }, children: "Completed jobs with SMS or email consent get an automatic Google review request. Manage settings under More \u2192 Review automation." })
    ] })
  ] });
}
function Performance({ jobs, stages, users, onBack, isAdmin, currentUser, toast: toast2 }) {
  const [scope, setScope] = (0, import_react.useState)(isAdmin ? "company" : currentUser.name);
  const [range, setRange] = (0, import_react.useState)("all");
  const [tab, setTab] = (0, import_react.useState)("summary");
  const scoped = (0, import_react.useMemo)(
    () => scope === "company" ? jobs : jobs.filter((j) => j.assignee === scope),
    [jobs, scope]
  );
  const stat = (0, import_react.useMemo)(() => {
    const won = scoped.filter((j) => WON_STAGES.includes(j.stageId));
    const lost = scoped.filter((j) => j.stageId === "s11");
    const unq = scoped.filter((j) => j.stageId === "s12");
    const done = scoped.filter((j) => j.stageId === "s10");
    const open = scoped.filter((j) => !WON_STAGES.includes(j.stageId) && !DEAD_STAGES.includes(j.stageId));
    const caps = scoped.map((j) => computeCapOut(j));
    const wonCaps = won.map((j) => computeCapOut(j));
    const revenue = wonCaps.reduce((x, c) => x + c.contract, 0);
    const cogs = wonCaps.reduce((x, c) => x + c.cogs, 0);
    const gross = wonCaps.reduce((x, c) => x + c.gross, 0);
    const commission = wonCaps.reduce((x, c) => x + c.commission, 0);
    const reimb = wonCaps.reduce((x, c) => x + c.reimbTotal, 0);
    const netCo = wonCaps.reduce((x, c) => x + c.netCompany, 0);
    const decided = won.length + lost.length;
    const pay = scoped.map((j) => paymentsSummary(j));
    return {
      total: scoped.length,
      won: won.length,
      lost: lost.length,
      unq: unq.length,
      done: done.length,
      open: open.length,
      openValue: open.reduce((x, j) => x + j.value, 0),
      revenue,
      cogs,
      gross,
      commission,
      reimb,
      netCo,
      payout: commission + reimb,
      margin: revenue ? gross / revenue * 100 : 0,
      closeRate: decided ? won.length / decided * 100 : 0,
      avgJob: won.length ? revenue / won.length : 0,
      ar: pay.reduce((x, p) => x + Math.max(0, p.balance), 0),
      collected: pay.reduce((x, p) => x + p.received, 0),
      insurance: scoped.filter((j) => j.claimType === "Insurance").length,
      retail: scoped.filter((j) => j.claimType === "Retail").length,
      reviews: scoped.filter((j) => j.review.posted).length,
      reviewsSent: scoped.filter((j) => j.review.sent).length,
      caps
    };
  }, [scoped]);
  const reps = (0, import_react.useMemo)(() => users.filter((u) => u.role !== "crew").map((u) => {
    const mine = jobs.filter((j) => j.assignee === u.name);
    const won = mine.filter((j) => WON_STAGES.includes(j.stageId));
    const lost = mine.filter((j) => j.stageId === "s11");
    const caps = won.map((j) => computeCapOut(j));
    const decided = won.length + lost.length;
    const revenue = caps.reduce((x, c) => x + c.contract, 0);
    const gross = caps.reduce((x, c) => x + c.gross, 0);
    const commission = caps.reduce((x, c) => x + c.commission, 0);
    const reimb = caps.reduce((x, c) => x + c.reimbTotal, 0);
    return {
      name: u.name,
      leads: mine.length,
      won: won.length,
      closeRate: decided ? won.length / decided * 100 : 0,
      revenue,
      gross,
      commission,
      reimb,
      payout: commission + reimb,
      margin: revenue ? gross / revenue * 100 : 0,
      avgJob: won.length ? revenue / won.length : 0
    };
  }).sort((a2, b2) => b2.revenue - a2.revenue), [jobs, users]);
  const sourceRows = (0, import_react.useMemo)(() => {
    const map = {};
    scoped.forEach((j) => {
      const k = j.leadSource || "Unattributed";
      if (!map[k]) map[k] = { source: k, leads: 0, won: 0, revenue: 0 };
      map[k].leads++;
      if (WON_STAGES.includes(j.stageId)) {
        map[k].won++;
        map[k].revenue += computeCapOut(j).contract;
      }
    });
    return Object.values(map).sort((a2, b2) => b2.revenue - a2.revenue || b2.leads - a2.leads);
  }, [scoped]);
  const commissionRows = (0, import_react.useMemo)(() => scoped.filter((j) => WON_STAGES.includes(j.stageId)).map((j) => ({ job: j, cap: computeCapOut(j) })).sort((a2, b2) => b2.cap.payout - a2.cap.payout), [scoped]);
  const Stat = ({ label, value, sub, tone }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 14, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 19, fontWeight: 800, color: tone || S.ink }, children: value }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, fontWeight: 700, color: S.ink, marginTop: 3 }, children: label }),
    sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11.5, color: S.sub, marginTop: 2 }, children: sub })
  ] });
  const exportCommission = () => {
    const rows = [
      [`Commission report \u2014 ${scope === "company" ? "Company-wide" : scope}`],
      [`Generated ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`],
      [],
      ["Job", "Address", "Rep", "Stage", "Contract", "COGS", "Gross profit", "Margin %", "Structure", "Commission", "Reimbursements", "Total payout"],
      ...commissionRows.map(({ job: job2, cap }) => [
        job2.name,
        job2.address,
        job2.assignee,
        (stages.find((x) => x.id === job2.stageId) || {}).name || "",
        cap.contract.toFixed(2),
        cap.cogs.toFixed(2),
        cap.gross.toFixed(2),
        cap.grossMargin.toFixed(2),
        cap.structure,
        cap.commission.toFixed(2),
        cap.reimbTotal.toFixed(2),
        cap.payout.toFixed(2)
      ]),
      [],
      [
        "TOTALS",
        "",
        "",
        "",
        stat.revenue.toFixed(2),
        stat.cogs.toFixed(2),
        stat.gross.toFixed(2),
        stat.margin.toFixed(2),
        "",
        stat.commission.toFixed(2),
        stat.reimb.toFixed(2),
        stat.payout.toFixed(2)
      ]
    ];
    downloadCsv(`commission-${scope === "company" ? "company" : scope.split(" ")[0].toLowerCase()}.csv`, rows);
    toast2("Commission report exported");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Performance", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, fontWeight: 700, color: S.sub, marginBottom: 8 }, children: "VIEWING" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
        isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setScope("company"), style: {
          border: `1.5px solid ${scope === "company" ? T.accent : S.line}`,
          background: scope === "company" ? T.accentSoft : "#fff",
          color: scope === "company" ? T.accent : S.ink,
          borderRadius: 999,
          padding: "8px 14px",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer"
        }, children: "Company-wide" }),
        users.filter((u) => u.role !== "crew" && (isAdmin || u.name === currentUser.name)).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setScope(u.name), style: {
          border: `1.5px solid ${scope === u.name ? T.accent : S.line}`,
          background: scope === u.name ? T.accentSoft : "#fff",
          color: scope === u.name ? T.accent : S.ink,
          borderRadius: 999,
          padding: "8px 14px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer"
        }, children: u.name.split(" ")[0] }, u.id))
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, marginTop: 12, overflowX: "auto" }, children: [["summary", "Summary"], ["commission", "Commission"], isAdmin && ["reps", "By rep"], ["sources", "Lead sources"], ["pipeline", "Pipeline"]].filter(Boolean).map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setTab(id), style: {
      border: "none",
      background: tab === id ? T.primary : "#fff",
      color: tab === id ? "#fff" : S.ink,
      borderRadius: 999,
      padding: "9px 15px",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      whiteSpace: "nowrap",
      flexShrink: 0
    }, children: label }, id)) }),
    tab === "summary" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, { label: "Signed revenue", value: money(stat.revenue), sub: `${stat.won} jobs won` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, { label: "Gross profit", value: money(stat.gross), sub: `${pct1(stat.margin)} margin`, tone: "#177245" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, { label: "Close rate", value: pct1(stat.closeRate), sub: `${stat.won} won / ${stat.lost} lost` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, { label: "Average job", value: money(stat.avgJob), sub: "Signed jobs only" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, { label: "Open pipeline", value: money(stat.openValue), sub: `${stat.open} active jobs` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, { label: "Receivable", value: money(stat.ar), sub: `${money(stat.collected)} collected`, tone: stat.ar > 0 ? "#B42318" : void 0 })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Job mix" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Insurance", v: `${stat.insurance} job${stat.insurance === 1 ? "" : "s"}` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Retail", v: `${stat.retail} job${stat.retail === 1 ? "" : "s"}` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Completed", v: String(stat.done) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Lost", v: String(stat.lost) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Unqualified", v: String(stat.unq) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Reviews" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Requests sent", v: String(stat.reviewsSent) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Reviews posted", v: String(stat.reviews) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Conversion", v: stat.reviewsSent ? pct1(stat.reviews / stat.reviewsSent * 100) : "\u2014" })
      ] })
    ] }),
    tab === "commission" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, onClick: exportCommission, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Download, { size: 13 }),
          " CSV"
        ] }), children: scope === "company" ? "All reps combined" : scope }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Jobs included", v: String(commissionRows.length) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Contract revenue", v: money(stat.revenue) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Total COGS", v: money(stat.cogs) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Gross profit", v: money(stat.gross), strong: true }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Gross margin", v: pct1(stat.margin) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 1, background: S.line, margin: "10px 0" } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Commission", v: money(stat.commission), strong: true }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Reimbursements", v: money(stat.reimb) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: T.accentSoft,
          borderRadius: 10,
          padding: "12px 14px",
          marginTop: 10
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 14, fontWeight: 700, color: T.primary }, children: "Total payout" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 19, fontWeight: 800, color: T.accent }, children: money(stat.payout) })
        ] }),
        isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Net to company", v: money(stat.netCo), strong: true })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, fontWeight: 700, color: S.sub, margin: "16px 0 8px" }, children: "PER JOB" }),
      commissionRows.map(({ job: job2, cap }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 15, style: { marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14.5, fontWeight: 700 }, children: job2.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 2 }, children: job2.address })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "right", flexShrink: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: T.accent }, children: money(cap.payout) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: S.sub }, children: "payout" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 10, paddingTop: 10, borderTop: `1px solid ${S.line}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Contract", v: money(cap.contract) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Gross profit", v: `${money(cap.gross)} \xB7 ${pct1(cap.grossMargin)}` }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Commission", v: money(cap.commission) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Reimbursements", v: money(cap.reimbTotal) })
        ] }),
        scope === "company" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: job2.assignee }) })
      ] }, job2.id)),
      commissionRows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { marginTop: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "No signed jobs in this view yet." }) })
    ] }),
    tab === "reps" && isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 12 }, children: reps.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 15, style: { marginTop: i ? 10 : 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700 }, children: r.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800 }, children: money(r.revenue) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }, children: [
        ["Jobs", r.leads],
        ["Won", r.won],
        ["Close", pct1(r.closeRate)],
        ["Gross", money(r.gross)],
        ["Margin", pct1(r.margin)],
        ["Avg job", money(r.avgJob)]
      ].map(([l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, fontWeight: 800, color: S.ink }, children: v }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: S.sub }, children: l })
      ] }, l)) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 10,
        borderTop: `1px solid ${S.line}`
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 13, color: S.sub }, children: [
          "Commission ",
          money(r.commission),
          " + reimb ",
          money(r.reimb)
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 14, fontWeight: 800, color: T.accent }, children: money(r.payout) })
      ] })
    ] }, r.name)) }),
    tab === "sources" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Lead source performance" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 380 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { style: { textAlign: "left", color: S.sub }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "8px 6px" }, children: "Source" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "8px 6px" }, children: "Leads" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "8px 6px" }, children: "Won" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "8px 6px" }, children: "Close" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "8px 6px" }, children: "Revenue" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: sourceRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { style: { borderTop: `1px solid ${S.line}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "10px 6px", fontWeight: 700 }, children: r.source }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "10px 6px" }, children: r.leads }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "10px 6px" }, children: r.won }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "10px 6px" }, children: r.leads ? pct1(r.won / r.leads * 100) : "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "10px 6px", fontWeight: 700 }, children: money(r.revenue) })
        ] }, r.source)) })
      ] }) })
    ] }),
    tab === "pipeline" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Stage distribution" }),
      stages.map((st) => {
        const inStage = scoped.filter((j) => j.stageId === st.id);
        const max = Math.max(1, ...stages.map((x) => scoped.filter((j) => j.stageId === x.id).length));
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 140, fontSize: 12, color: S.sub, flexShrink: 0 }, children: st.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, height: 18, background: "#EEF1F4", borderRadius: 6, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
            height: "100%",
            width: `${inStage.length / max * 100}%`,
            background: DEAD_STAGES.includes(st.id) ? "#B42318" : WON_STAGES.includes(st.id) ? "#177245" : T.primary,
            borderRadius: 6,
            minWidth: inStage.length ? 18 : 0
          } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 28, fontSize: 13, fontWeight: 700, textAlign: "right" }, children: inStage.length })
        ] }, st.id);
      })
    ] })
  ] });
}
function SubHeader({ title, onBack, right }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: onBack, style: {
        border: `1px solid ${S.line}`,
        background: "#fff",
        borderRadius: 999,
        width: 36,
        height: 36,
        display: "grid",
        placeItems: "center",
        cursor: "pointer"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronLeft, { size: 18 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 22, fontWeight: 800, color: S.ink }, children: title })
    ] }),
    right
  ] });
}
function CalendarView({ jobs, onBack, onOpenJob, appointments = [], setAppointments, apptTypes = [], setApptTypes, toast: toast2, onQueueMessage, onLog = () => {
} }) {
  const today = /* @__PURE__ */ new Date();
  const [month, setMonth] = (0, import_react.useState)(new Date(today.getFullYear(), today.getMonth(), 1));
  const [adding, setAdding] = (0, import_react.useState)(false);
  const [editingId, setEditingId] = (0, import_react.useState)(null);
  const [f, setF] = (0, import_react.useState)({ jobId: "", type: apptTypes[0] || "Inspection", date: "", time: "", notes: "" });
  const openAdd = (date) => {
    setEditingId(null);
    setF({ jobId: "", type: apptTypes[0] || "Inspection", date: date || "", time: "", notes: "" });
    setAdding(true);
  };
  const openEdit = (ap) => {
    setEditingId(ap.id);
    setF({ jobId: ap.jobId, type: ap.type, date: ap.date, time: ap.time || "", notes: ap.notes || "" });
    setAdding(true);
  };
  const [newType, setNewType] = (0, import_react.useState)("");
  const y = month.getFullYear(), m = month.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstDow = new Date(y, m, 1).getDay();
  const iso = (d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const jobsOn = (d) => jobs.filter((j) => j.schedDate === iso(d));
  const apptsOn = (d) => appointments.filter((ap) => ap.date === iso(d));
  const allTasks = jobs.flatMap((j) => (j.tasks || []).filter((t) => t.due && !t.done).map((t) => ({ job: j, task: t })));
  const tasksOn = (d) => allTasks.filter(({ task }) => task.due === iso(d));
  const monthTasks = allTasks.filter(({ task }) => task.due.startsWith(`${y}-${String(m + 1).padStart(2, "0")}`)).sort((a2, b2) => a2.task.due.localeCompare(b2.task.due));
  const monthAppts = appointments.filter((ap) => ap.date && ap.date.startsWith(`${y}-${String(m + 1).padStart(2, "0")}`)).sort((a2, b2) => (a2.date + (a2.time || "")).localeCompare(b2.date + (b2.time || "")));
  const monthJobs = jobs.filter((j) => j.schedDate && j.schedDate.startsWith(`${y}-${String(m + 1).padStart(2, "0")}`)).sort((a2, b2) => a2.schedDate.localeCompare(b2.schedDate));
  const save = () => {
    const jb = jobs.find((x) => x.id === f.jobId);
    if (editingId) {
      setAppointments(appointments.map((ap) => ap.id === editingId ? { ...ap, ...f } : ap));
      onLog({ kind: "appointment", jobId: f.jobId, jobName: jb ? jb.name : "", text: `updated ${f.type.toLowerCase()} for ${jb ? jb.name : "a customer"} on ${f.date}` });
      toast2("Appointment updated");
    } else {
      setAppointments([...appointments, { ...f, id: uid("ap") }]);
      onLog({ kind: "appointment", jobId: f.jobId, jobName: jb ? jb.name : "", text: `scheduled ${f.type.toLowerCase()} for ${jb ? jb.name : "a customer"} on ${f.date}` });
      toast2("Appointment added");
    }
    setAdding(false);
    setEditingId(null);
    setF({ jobId: "", type: apptTypes[0] || "Inspection", date: "", time: "", notes: "" });
  };
  const queueReminder = () => {
    const j = jobs.find((x) => x.id === f.jobId);
    if (!j) return;
    const channel = j.consent.sms.granted ? "sms" : j.consent.email.granted ? "email" : null;
    if (!channel) {
      toast2("No consent on file \u2014 can't message this customer");
      return;
    }
    const when = `${f.date}${f.time ? ` at ${f.time}` : ""}`;
    const body = `Hi ${j.name.split(" ")[0]}, this is a reminder of your ${f.type.toLowerCase()} with our team on ${when} at ${j.address}. Reply here with any questions.`;
    onQueueMessage(j.id, {
      kind: channel,
      audience: "Customer",
      to: channel === "sms" ? j.phone || j.name : j.email || j.name,
      subject: channel === "email" ? `Upcoming ${f.type.toLowerCase()} \u2014 ${when}` : "",
      body,
      status: "Queued",
      at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " ")
    });
    onLog({ kind: "message", jobId: j.id, jobName: j.name, text: `queued ${channel === "sms" ? "a text" : "an email"} reminder to ${j.name} for the ${f.type.toLowerCase()} on ${f.date}` });
    toast2(`${channel === "sms" ? "Text" : "Email"} reminder queued \u2014 see it in the Inbox`);
  };
  const addType = () => {
    const v = newType.trim();
    if (!v || apptTypes.some((t) => t.toLowerCase() === v.toLowerCase())) return;
    setApptTypes([...apptTypes, v]);
    setF({ ...f, type: v });
    setNewType("");
  };
  const jobOf = (id) => jobs.find((j) => j.id === id);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SubHeader,
      {
        title: "Calendar",
        onBack,
        right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, onClick: () => openAdd(null), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }),
          " Add"
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setMonth(new Date(y, m - 1, 1)), style: { border: "none", background: "none", cursor: "pointer" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronLeft, { size: 18 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 16, fontWeight: 800 }, children: month.toLocaleString("en-US", { month: "long", year: "numeric" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setMonth(new Date(y, m + 1, 1)), style: { border: "none", background: "none", cursor: "pointer" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { size: 18 }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }, children: [
        ["S", "M", "T", "W", "T", "F", "S"].map((d, i2) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { textAlign: "center", fontSize: 11, fontWeight: 700, color: S.sub, padding: "4px 0" }, children: d }, i2)),
        Array.from({ length: firstDow }).map((_, i2) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, `b${i2}`)),
        Array.from({ length: daysInMonth }).map((_, i2) => {
          const d = i2 + 1;
          const hasJob = jobsOn(d).length > 0;
          const hasAppt = apptsOn(d).length > 0;
          const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { onClick: () => openAdd(iso(d)), role: "button", style: {
            textAlign: "center",
            padding: "7px 0 4px",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
            background: isToday ? T.accentSoft : "transparent",
            fontWeight: isToday ? 800 : 500,
            color: isToday ? T.accent : S.ink
          }, children: [
            d,
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 3, justifyContent: "center", height: 6, marginTop: 2 }, children: [
              hasJob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: 5, height: 5, borderRadius: 99, background: T.accent } }),
              hasAppt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: 5, height: 5, borderRadius: 99, background: "#92600A" } }),
              tasksOn(d).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: 5, height: 5, borderRadius: 99, background: "#177245" } })
            ] })
          ] }, d);
        })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 14, marginTop: 10, fontSize: 11.5, color: S.sub }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { display: "inline-block", width: 6, height: 6, borderRadius: 99, background: T.accent, marginRight: 5 } }),
          "Production"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { display: "inline-block", width: 6, height: 6, borderRadius: 99, background: "#92600A", marginRight: 5 } }),
          "Appointment"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { display: "inline-block", width: 6, height: 6, borderRadius: 99, background: "#177245", marginRight: 5 } }),
          "Task due"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, fontWeight: 700, color: S.sub, margin: "16px 0 8px" }, children: "THIS MONTH" }),
    monthAppts.map((ap) => {
      const j = jobOf(ap.jobId);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pad: 14, style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => openEdit(ap), style: { border: "none", background: "none", cursor: "pointer", textAlign: "left", padding: 0, flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14.5, fontWeight: 700, color: S.ink }, children: [
            ap.type,
            j ? ` \u2014 ${j.name}` : ""
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 2 }, children: [
            ap.date,
            ap.time ? ` \xB7 ${ap.time}` : "",
            j ? ` \xB7 ${j.address}` : ""
          ] }),
          ap.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 4 }, children: ap.notes }),
          j && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { onClick: (e) => {
            e.stopPropagation();
            onOpenJob(j.id);
          }, style: { fontSize: 12, color: T.accent, fontWeight: 700 }, children: "Open job \u2192" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => setAppointments(appointments.filter((x) => x.id !== ap.id)),
            style: { border: "none", background: "none", cursor: "pointer", flexShrink: 0 },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 15, color: "#B42318" })
          }
        )
      ] }) }, ap.id);
    }),
    monthTasks.map(({ job: j2, task: t2 }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pad: 14, style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => onOpenJob(j2.id), style: { border: "none", background: "none", cursor: "pointer", textAlign: "left", padding: 0, width: "100%" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14.5, fontWeight: 700, color: S.ink }, children: [
        "Task \u2014 ",
        t2.label
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 2 }, children: [
        "Due ",
        t2.due,
        t2.time ? ` at ${t2.time}` : "",
        " \xB7 ",
        j2.name
      ] })
    ] }) }, t2.id)),
    monthJobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pad: 14, style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => onOpenJob(j.id), style: { border: "none", background: "none", cursor: "pointer", textAlign: "left", padding: 0, width: "100%" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14.5, fontWeight: 700, color: S.ink }, children: [
        "Production \u2014 ",
        j.name
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 2 }, children: [
        j.schedDate,
        " \xB7 ",
        j.address
      ] })
    ] }) }, j.id)),
    monthAppts.length === 0 && monthJobs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "Nothing scheduled this month." }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: adding,
        onClose: () => {
          setAdding(false);
          setEditingId(null);
        },
        title: editingId ? "Edit appointment" : "Add appointment",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
          editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", onClick: () => {
            setAppointments(appointments.filter((x) => x.id !== editingId));
            setAdding(false);
            setEditingId(null);
            toast2("Appointment deleted");
          }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 14 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", disabled: !f.jobId || !f.date, onClick: queueReminder, style: { flexShrink: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 13 }),
            " Remind"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { flex: 1 }, disabled: !f.jobId || !f.date, onClick: save, children: editingId ? "Save changes" : "Add to calendar" })
        ] }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Customer / job *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: f.jobId, onChange: (e) => setF({ ...f, jobId: e.target.value }), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Select\u2026" }),
            jobs.filter((j) => !DEAD_STAGES.includes(j.stageId)).map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: j.id, children: [
              j.name,
              " \u2014 ",
              j.address
            ] }, j.id))
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Type", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: selStyle, value: f.type, onChange: (e) => setF({ ...f, type: e.target.value }), children: apptTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: -6, marginBottom: 14 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                style: { ...inputStyle, flex: 1 },
                placeholder: "Add a custom type\u2026",
                value: newType,
                onChange: (e) => setNewType(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") addType();
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, onClick: addType, disabled: !newType.trim(), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 13 }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Date *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "date", value: f.date, onChange: (e) => setF({ ...f, date: e.target.value }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Time", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "time", value: f.time, onChange: (e) => setF({ ...f, time: e.target.value }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Notes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { style: { ...inputStyle, minHeight: 70, resize: "vertical", fontFamily: "inherit" }, value: f.notes, onChange: (e) => setF({ ...f, notes: e.target.value }) }) })
        ]
      }
    )
  ] });
}
function Contacts({ jobs, onBack, onOpenJob }) {
  const [q, setQ] = (0, import_react.useState)("");
  const list = jobs.filter((j) => (j.name + j.address + j.phone + j.email).toLowerCase().includes(q.toLowerCase()));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Contacts", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, placeholder: "Search name, address, phone, email", value: q, onChange: (e) => setQ(e.target.value) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 12 }, children: list.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pad: 16, style: { marginBottom: 10, cursor: "pointer" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { onClick: () => onOpenJob(j.id), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700 }, children: j.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "slate", children: j.state })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 3 }, children: j.address }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 16, marginTop: 8, fontSize: 13, color: S.sub, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Phone, { size: 13 }),
          " ",
          j.phone
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { size: 13 }),
          " ",
          j.email
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: j.consent.sms.granted ? "green" : "gray", children: [
          "SMS ",
          j.consent.sms.granted ? "consent on file" : "no consent"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: j.consent.email.granted ? "green" : "gray", children: [
          "Email ",
          j.consent.email.granted ? "consent" : "no consent"
        ] })
      ] })
    ] }) }, j.id)) })
  ] });
}
function NewLeadSheet({ open, onClose, onCreate, brand: brand2, leadSources = LEAD_SOURCES, users = [] }) {
  const blank = {
    first: "",
    last: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    stateSel: "OH",
    zip: "",
    lat: null,
    lng: null,
    leadSource: "",
    assignee: TEAM[0],
    claimType: "Insurance",
    carrier: "",
    policy: "",
    claim: "",
    adjusterName: "",
    adjusterPhone: "",
    deductible: "",
    coverage: "",
    oLaw: false,
    rps: false,
    cosmetic: false,
    windHailDed: false,
    acvRoof: false,
    matching: false,
    smsConsent: false,
    emailConsent: false,
    notes: ""
  };
  const [f, setF] = (0, import_react.useState)(blank);
  (0, import_react.useEffect)(() => {
    if (open) setF(blank);
  }, [open]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target ? e.target.type === "checkbox" ? e.target.checked : e.target.value : e });
  const juris = jurisdictionForZip(f.zip);
  const canCreate = f.first.trim() && f.last.trim() && f.street.trim() && f.zip.trim();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    Sheet,
    {
      open,
      onClose,
      title: "New lead",
      wide: true,
      footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { flex: 2 }, disabled: !canCreate || !f.leadSource, onClick: () => {
          onCreate(f);
          onClose();
        }, children: "Create lead" })
      ] }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: T.primary, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 10px" }, children: "Primary contact" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "First name *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.first, onChange: set("first") }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Last name *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.last, onChange: set("last") }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Phone", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.phone, inputMode: "tel", onChange: (e) => setF((p2) => ({ ...p2, phone: formatPhone(e.target.value) })), placeholder: "(555) 555-0100" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Email", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.email, onChange: set("email") }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: T.primary, textTransform: "uppercase", letterSpacing: 0.5, margin: "10px 0" }, children: "Location" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Street *", hint: geoReady() ? "Start typing \u2014 pick a suggestion to fill city, state, and zip." : void 0, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          AddressAutocomplete,
          {
            value: f.street,
            placeholder: "123 Main St",
            onChange: (v) => setF({ ...f, street: v }),
            onPick: (it) => setF((p) => ({
              ...p,
              street: it.street || it.formatted,
              city: it.city || p.city,
              stateSel: ["OH", "KY", "IL"].includes(it.state) ? it.state : p.stateSel,
              zip: it.zip || p.zip,
              lat: it.lat,
              lng: it.lng
            }))
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "City", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.city, onChange: set("city") }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "State", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: f.stateSel, onChange: set("stateSel"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "OH" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "KY" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "IL" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Zip *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.zip, onChange: set("zip") }) })
        ] }),
        juris && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: T.accentSoft, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 700, color: T.primary }, children: [
            juris.city ? `${juris.city}, ${juris.state}` : juris.state,
            " \u2014 ",
            juris.codeName
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: T.primary, marginTop: 3 }, children: [
            juris.codeEdition,
            juris.precision === "verified" ? ` \xB7 ${juris.inspector.office}` : " \xB7 statewide default, confirm locally"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: T.primary, textTransform: "uppercase", letterSpacing: 0.5, margin: "10px 0" }, children: "Job details" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Lead source *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: f.leadSource, onChange: set("leadSource"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\u2014 select \u2014" }),
            leadSources.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: l }, l))
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Assign to", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: selStyle, value: f.assignee, onChange: set("assignee"), children: TEAM.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t)) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Claim type *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: ["Insurance", "Retail", "Unknown"].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setF({ ...f, claimType: c }), style: {
          border: `1.5px solid ${f.claimType === c ? T.accent : S.line}`,
          background: f.claimType === c ? T.accentSoft : "#fff",
          color: f.claimType === c ? T.accent : S.ink,
          borderRadius: 999,
          padding: "9px 16px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer"
        }, children: c === "Unknown" ? "Don't know yet" : c }, c)) }) }),
        f.claimType === "Insurance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: "#FAFBFC", border: `1px solid ${S.line}`, borderRadius: 12, padding: 14, marginBottom: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700, color: S.ink, marginBottom: 10 }, children: "Insurance details" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Carrier", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.carrier, onChange: set("carrier"), placeholder: "State Farm, Allstate\u2026" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Policy number", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.policy, onChange: set("policy") }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Claim number", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.claim, onChange: set("claim") }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Deductible ($)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.deductible, onChange: set("deductible") }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Adjuster name", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.adjusterName, onChange: set("adjusterName") }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Adjuster phone", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.adjusterPhone, onChange: set("adjusterPhone") }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Coverage type", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: f.coverage, onChange: set("coverage"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\u2014 select \u2014" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "RCV" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ACV" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: S.ink }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: f.oLaw, onChange: set("oLaw"), style: { width: 18, height: 18 } }),
            "Ordinance & Law coverage present"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 800, color: T.primary, margin: "14px 0 8px" }, children: "ENDORSEMENTS FOUND ON THE DEC PAGE" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: [
            ["rps", "Roof Payment Schedule (RPS)"],
            ["cosmetic", "Cosmetic damage exclusion"],
            ["windHailDed", "Separate wind/hail deductible"],
            ["acvRoof", "ACV-only roof (age trigger)"],
            ["matching", "Matching endorsement"]
          ].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setF({ ...f, [k]: !f[k] }), style: {
            border: `1.5px solid ${f[k] ? "#92600A" : S.line}`,
            background: f[k] ? "#FDF4E3" : "#fff",
            color: f[k] ? "#92600A" : S.ink,
            borderRadius: 999,
            padding: "8px 13px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer"
          }, children: [
            f[k] ? "\u2713 " : "",
            label
          ] }, k)) }),
          (f.rps || f.acvRoof || f.windHailDed) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: "#FDF4E3", borderLeft: "3px solid #92600A", borderRadius: 8, padding: "11px 13px", marginTop: 10, fontSize: 13, color: S.ink, lineHeight: 1.5 }, children: "Tell the homeowner their real out-of-pocket before writing the contract. See Insurance \u2192 Resources \u2192 Policy Provisions for how each of these changes the settlement." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: T.primary, textTransform: "uppercase", letterSpacing: 0.5, margin: "10px 0" }, children: "Communication consent" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: `1px solid ${S.line}`, borderRadius: 12, padding: 14, marginBottom: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.55, color: S.ink, marginBottom: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: f.smsConsent, onChange: set("smsConsent"), style: { width: 19, height: 19, marginTop: 2, flexShrink: 0, accentColor: T.accent } }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Text messages." }),
              " I agree to receive texts about my project from ",
              brand2.company,
              ". Msg & data rates may apply. Reply STOP to opt out."
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.55, color: S.ink }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: f.emailConsent, onChange: set("emailConsent"), style: { width: 19, height: 19, marginTop: 2, flexShrink: 0, accentColor: T.accent } }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Email." }),
              " I agree to receive project updates and documents by email."
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 10 }, children: "Consent is stored with a timestamp and source. SMS and email consent are tracked separately; opting out of one does not affect the other." })
        ] })
      ]
    }
  );
}
function FiltersSheet({ open, onClose, stages, filters, setFilters }) {
  const [local, setLocal] = (0, import_react.useState)(filters);
  (0, import_react.useEffect)(() => {
    if (open) setLocal(filters);
  }, [open]);
  const toggle = (key, val) => {
    const cur = new Set(local[key]);
    cur.has(val) ? cur.delete(val) : cur.add(val);
    setLocal({ ...local, [key]: [...cur] });
  };
  const Section = ({ title, children, onAll, onNone }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderTop: `1px solid ${S.line}`, paddingTop: 16, marginTop: 16 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 16, fontWeight: 700, color: S.ink }, children: title }),
      onAll && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: onAll, style: linkBtn, children: "Select all" }),
      onNone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: onNone, style: { ...linkBtn, color: "#9CB8E8" }, children: "Select none" })
    ] }),
    children
  ] });
  const CheckRow = ({ checked, label, onClick }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick, style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "9px 0",
    border: "none",
    background: "none",
    cursor: "pointer",
    textAlign: "left"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
      width: 22,
      height: 22,
      borderRadius: 6,
      display: "grid",
      placeItems: "center",
      border: `1.5px solid ${checked ? T.accent : "#C7CBD1"}`,
      background: checked ? T.accent : "#fff",
      flexShrink: 0
    }, children: checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Check, { size: 14, color: "#fff" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 15, color: S.ink }, children: label })
  ] });
  const sorts = [
    ["updated", "Last updated (newest)"],
    ["value-hi", "Value (higher)"],
    ["value-lo", "Value (lower)"],
    ["stage-time", "Time in stage (oldest)"],
    ["name", "Name (alphabetical)"],
    ["address", "Address (alphabetical)"]
  ];
  const selected = [
    ...local.assignees,
    ...local.sources,
    ...local.stages.map((id) => stages.find((s) => s.id === id)?.name || id)
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    Sheet,
    {
      open,
      onClose,
      title: "Filters & sort",
      footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { width: "100%" }, onClick: () => {
        setFilters(local);
        onClose();
      }, children: "Apply filters" }),
      children: [
        selected.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: "#F3F4F6", borderRadius: 12, padding: "12px 14px", marginBottom: 4 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, fontWeight: 700 }, children: "Selected filters" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: linkBtn, onClick: () => setLocal({ ...local, assignees: [], stages: [], sources: [] }), children: "Reset" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: selected.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: s }, i)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { title: "Sort by", children: sorts.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setLocal({ ...local, sort: id }), style: {
          display: "block",
          width: "100%",
          textAlign: "left",
          padding: "8px 0",
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: 15,
          fontWeight: local.sort === id ? 700 : 400,
          color: local.sort === id ? T.accent : S.ink
        }, children: label }, id)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Section,
          {
            title: "Assignees & job owner",
            onAll: () => setLocal({ ...local, assignees: [...TEAM] }),
            onNone: () => setLocal({ ...local, assignees: [] }),
            children: TEAM.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckRow, { checked: local.assignees.includes(t), label: t, onClick: () => toggle("assignees", t) }, t))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Section,
          {
            title: "Stages",
            onAll: () => setLocal({ ...local, stages: stages.map((s) => s.id) }),
            onNone: () => setLocal({ ...local, stages: [] }),
            children: stages.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckRow, { checked: local.stages.includes(s.id), label: s.name, onClick: () => toggle("stages", s.id) }, s.id))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Section,
          {
            title: "Lead sources",
            onAll: () => setLocal({ ...local, sources: [...LEAD_SOURCES] }),
            onNone: () => setLocal({ ...local, sources: [] }),
            children: LEAD_SOURCES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckRow, { checked: local.sources.includes(l), label: l, onClick: () => toggle("sources", l) }, l))
          }
        )
      ]
    }
  );
}
var linkBtn = { border: "none", background: "none", color: T.accent, fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0 };
function WorkflowEditor({ open, onClose, stages, setStages }) {
  const [local, setLocal] = (0, import_react.useState)(stages);
  (0, import_react.useEffect)(() => {
    if (open) setLocal(stages.map((s) => ({ ...s })));
  }, [open]);
  const rename = (id, name) => setLocal(local.map((s) => s.id === id ? { ...s, name } : s));
  const remove = (id) => setLocal(local.filter((s) => s.id !== id));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= local.length) return;
    const next = [...local];
    [next[i], next[j]] = [next[j], next[i]];
    setLocal(next);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    Sheet,
    {
      open,
      onClose,
      title: "Customize workflow",
      footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { flex: 1 }, disabled: local.length === 0, onClick: () => {
          setStages(local);
          onClose();
        }, children: "Save workflow" })
      ] }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, marginBottom: 14 }, children: "Rename, reorder, add, or remove pipeline stages. Jobs in a removed stage move to the first stage." }),
        local.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 0",
          borderBottom: `1px solid ${S.line}`
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.GripVertical, { size: 16, color: "#C7CBD1" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              value: s.name,
              onChange: (e) => rename(s.id, e.target.value),
              style: { ...inputStyle, padding: "9px 12px", flex: 1 }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => move(i, -1), style: arrowBtn, "aria-label": "Move up", children: "\u2191" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => move(i, 1), style: arrowBtn, "aria-label": "Move down", children: "\u2193" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => remove(s.id), style: { border: "none", background: "none", cursor: "pointer", padding: 4 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 16, color: "#B42318" }) })
        ] }, s.id)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          Btn,
          {
            kind: "soft",
            small: true,
            style: { marginTop: 14 },
            onClick: () => setLocal([...local, { id: uid("s"), name: "New stage" }]),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }),
              " Add stage"
            ]
          }
        )
      ]
    }
  );
}
var arrowBtn = { border: "1px solid #E5E7EB", background: "#fff", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 14 };
function JobBoard({ jobs, stages, filters, onOpenFilters, onOpenWorkflow, onOpenJob, onMoveStage, onNewLead }) {
  const dragJob = (0, import_react.useRef)(null);
  const [view, setView] = (0, import_react.useState)("board");
  const [moveMenuFor, setMoveMenuFor] = (0, import_react.useState)(null);
  const [q, setQ] = (0, import_react.useState)("");
  const [showSearch, setShowSearch] = (0, import_react.useState)(false);
  const [dragOver, setDragOver] = (0, import_react.useState)(null);
  const filtered = (0, import_react.useMemo)(() => {
    let out = jobs.filter((j) => {
      if (q && !(j.name + " " + j.address).toLowerCase().includes(q.toLowerCase())) return false;
      if (filters.assignees.length && !filters.assignees.includes(j.assignee)) return false;
      if (filters.stages.length && !filters.stages.includes(j.stageId)) return false;
      if (filters.sources.length && !filters.sources.includes(j.leadSource)) return false;
      return true;
    });
    const s = filters.sort;
    if (s === "value-hi") out = [...out].sort((a, b) => b.value - a.value);
    else if (s === "value-lo") out = [...out].sort((a, b) => a.value - b.value);
    else if (s === "stage-time") out = [...out].sort((a, b) => b.daysInStage - a.daysInStage);
    else if (s === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    else if (s === "address") out = [...out].sort((a, b) => a.address.localeCompare(b.address));
    return out;
  }, [jobs, filters, q]);
  const activeFilterCount = filters.assignees.length + filters.stages.length + filters.sources.length;
  const JobCard = ({ job: job2 }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      draggable: true,
      onDragStart: () => dragJob.current = job2.id,
      onClick: () => onOpenJob(job2.id),
      style: {
        background: "#fff",
        border: `1px solid ${S.line}`,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        cursor: "pointer"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700, color: S.ink }, children: job2.name }),
          job2.value > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700, color: S.ink, whiteSpace: "nowrap" }, children: money(job2.value) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 3 }, children: job2.address }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: job2.claimType === "Insurance" ? "blue" : "gray", children: job2.claimType === "Unknown" ? "TBD" : job2.claimType }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "slate", children: job2.state }),
          job2.priority && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: job2.priority === "Urgent" ? "red" : job2.priority === "High" ? "amber" : "gray", children: job2.priority }),
          job2.leadQuality > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { display: "inline-flex", gap: 2 }, children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
            width: 7,
            height: 7,
            borderRadius: 2,
            background: job2.leadQuality >= n ? T.accent : S.line
          } }, n)) }),
          (job2.tags || []).slice(0, 2).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: t }, t))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          paddingTop: 10,
          borderTop: `1px solid ${S.line}`
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12, fontWeight: 700, color: job2.daysInStage > 10 ? "#B42318" : S.sub }, children: [
            "\u25CF ",
            job2.daysInStage,
            " days"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12, color: S.sub }, children: job2.updated }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
              width: 26,
              height: 26,
              borderRadius: 999,
              background: "#EEF1F4",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 700,
              color: S.sub
            }, children: job2.assignee.split(" ").map((w) => w[0]).join("") })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              setMoveMenuFor(moveMenuFor === job2.id ? null : job2.id);
            },
            style: {
              marginTop: 10,
              width: "100%",
              border: `1px solid ${S.line}`,
              background: "#FAFBFC",
              borderRadius: 8,
              padding: "7px 0",
              fontSize: 13,
              fontWeight: 600,
              color: S.sub,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowUpDown, { size: 13 }),
              " Move"
            ]
          }
        ),
        moveMenuFor === job2.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }, onClick: (e) => e.stopPropagation(), children: stages.filter((s) => s.id !== job2.stageId).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => {
              onMoveStage(job2.id, s.id);
              setMoveMenuFor(null);
            },
            style: {
              border: `1px solid ${S.line}`,
              background: "#fff",
              borderRadius: 999,
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              color: S.ink
            },
            children: s.name
          },
          s.id
        )) })
      ]
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { paddingBottom: 100 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 16px 0", background: "#fff" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 24, fontWeight: 800, color: S.ink }, children: "Jobs" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "button",
            {
              onClick: () => setView(view === "board" ? "list" : "board"),
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "none",
                background: "#F3F4F6",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                color: S.ink
              },
              children: [
                view === "board" ? "Board view" : "List view",
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronDown, { size: 15 })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, onClick: onNewLead, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 15 }),
          " New"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 14, paddingBottom: 14, overflowX: "auto", alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: pill, onClick: () => setShowSearch(!showSearch), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Search, { size: 16 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: onOpenFilters, style: { ...pill, color: T.accent, background: T.accentSoft }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.SlidersHorizontal, { size: 15 }),
          activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontWeight: 700 }, children: activeFilterCount })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: onOpenWorkflow, style: { ...pill, whiteSpace: "nowrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { size: 14 }),
          " Customize workflow"
        ] })
      ] }),
      showSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { paddingBottom: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { autoFocus: true, style: inputStyle, placeholder: "Search name or address", value: q, onChange: (e) => setQ(e.target.value) }) })
    ] }),
    view === "board" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
      display: "flex",
      gap: 14,
      overflowX: "auto",
      padding: 16,
      background: S.bg,
      alignItems: "flex-start",
      minHeight: "62vh"
    }, children: stages.map((stage) => {
      const inStage = filtered.filter((j) => j.stageId === stage.id);
      const total = inStage.reduce((s, j) => s + j.value, 0);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "div",
        {
          onDragOver: (e) => {
            e.preventDefault();
            setDragOver(stage.id);
          },
          onDragLeave: () => setDragOver(null),
          onDrop: () => {
            if (dragJob.current) {
              onMoveStage(dragJob.current, stage.id);
              dragJob.current = null;
            }
            setDragOver(null);
          },
          style: {
            minWidth: 296,
            maxWidth: 316,
            flexShrink: 0,
            borderRadius: 12,
            outline: dragOver === stage.id ? `2px solid ${T.accent}` : "none",
            outlineOffset: 4
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "0 2px 10px",
              borderBottom: `2px solid ${S.line}`,
              marginBottom: 12
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 15, fontWeight: 800, color: S.ink }, children: [
                stage.name,
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: S.sub, fontWeight: 600 }, children: [
                  "(",
                  inStage.length,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: S.sub }, children: money(total) })
            ] }),
            inStage.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, { job: j }, j.id)),
            inStage.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
              border: `1.5px dashed ${S.line}`,
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
              fontSize: 13,
              color: S.sub
            }, children: "Drop jobs here" })
          ]
        },
        stage.id
      );
    }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: 16, background: S.bg, minHeight: "62vh" }, children: [
      filtered.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, { job: j }, j.id)),
      filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { textAlign: "center", color: S.sub, fontSize: 14, padding: 40 }, children: "No jobs match the current filters." })
    ] })
  ] });
}
var pill = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  border: "none",
  background: "#F3F4F6",
  borderRadius: 999,
  padding: "9px 14px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  color: "#111827",
  flexShrink: 0
};
var JOB_TABS = [
  ["overview", "Overview"],
  ["checklist", "Checklist"],
  ["measure", "Measurements"],
  ["materials", "Materials"],
  ["estimate", "Estimate"],
  ["contract", "Contract"],
  ["report", "Report"],
  ["messages", "Messages"],
  ["photos", "Photos"],
  ["financials", "Financials"],
  ["payments", "Payments"],
  ["invoice", "Invoice"],
  ["workorder", "Work order"],
  ["tasks", "Tasks"],
  ["files", "Files"],
  ["portal", "Portal"]
];
function JobDetail({
  job: job2,
  stages,
  brand: brand2,
  onBack,
  onMoveStage,
  mut,
  toast: toast2,
  reviewSettings,
  currentUser,
  isAdmin,
  showMoney = true,
  crews = [],
  templates = [],
  integrations = { gmail: {}, sms: {} },
  users = [],
  estimateTemplates = [],
  setEstimateTemplates = () => {
  },
  setBrand = () => {
  },
  onLog = () => {
  },
  leadSources = LEAD_SOURCES,
  activity = []
}) {
  const [tab, setTab] = (0, import_react.useState)("overview");
  const MONEY_TABS = ["estimate", "contract", "financials", "payments", "invoice"];
  const visibleTabs = JOB_TABS.filter(([id]) => showMoney || !MONEY_TABS.includes(id));
  (0, import_react.useEffect)(() => {
    if (!showMoney && MONEY_TABS.includes(tab)) setTab("overview");
  }, [showMoney, tab]);
  const stage = stages.find((s) => s.id === job2.stageId);
  const juris = jurisdictionForZip(job2.zip);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: S.bg, minHeight: "100vh", paddingBottom: 110 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: "#fff", borderBottom: `1px solid ${S.line}` }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 0" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          SubHeader,
          {
            title: job2.name,
            onBack,
            right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: stage ? stage.name : "\u2014" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: S.sub, margin: "8px 0 2px", display: "flex", alignItems: "center", gap: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 13 }),
          " ",
          job2.address
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, margin: "10px 0 12px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: job2.claimType === "Insurance" ? "blue" : "gray", children: job2.claimType === "Unknown" ? "Claim TBD" : job2.claimType }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "slate", children: job2.state }),
          job2.value > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "green", children: money(job2.value) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: job2.assignee })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "select",
          {
            value: job2.stageId,
            onChange: (e) => onMoveStage(job2.id, e.target.value),
            style: { ...selStyle, width: "auto", padding: "8px 10px", fontSize: 13, fontWeight: 700 },
            children: stages.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: s.id, children: s.name }, s.id))
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 4, overflowX: "auto", padding: "0 12px" }, children: visibleTabs.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setTab(id), style: {
        border: "none",
        background: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
        padding: "10px 12px",
        fontSize: 14,
        fontWeight: 700,
        color: tab === id ? T.accent : S.sub,
        borderBottom: tab === id ? `2.5px solid ${T.accent}` : "2.5px solid transparent"
      }, children: label }, id)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: 16 }, children: [
      tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        TabOverview,
        {
          job: job2,
          juris,
          mut,
          toast: toast2,
          reviewSettings,
          brand: brand2,
          currentUser,
          onLog,
          leadSources,
          activity
        }
      ),
      tab === "checklist" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabChecklist, { job: job2, mut, toast: toast2 }),
      tab === "measure" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabMeasure, { job: job2, mut, toast: toast2 }),
      tab === "materials" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabMaterials, { job: job2, mut, toast: toast2 }),
      tab === "estimate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        TabEstimate,
        {
          job: job2,
          brand: brand2,
          mut,
          toast: toast2,
          estimateTemplates,
          setEstimateTemplates
        }
      ),
      tab === "contract" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabContract, { job: job2, brand: brand2, setBrand, mut, toast: toast2 }),
      tab === "report" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabReport, { job: job2, brand: brand2, juris }),
      tab === "messages" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        TabMessages,
        {
          job: job2,
          mut,
          toast: toast2,
          brand: brand2,
          templates,
          crews,
          integrations,
          currentUser,
          users
        }
      ),
      tab === "photos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabPhotos, { job: job2, mut, toast: toast2 }),
      tab === "financials" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabFinancials, { job: job2, mut, toast: toast2, isAdmin, currentUser, brand: brand2 }),
      tab === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabPayments, { job: job2, mut, toast: toast2 }),
      tab === "invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabInvoice, { job: job2, brand: brand2, mut, toast: toast2 }),
      tab === "workorder" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        TabWorkOrder,
        {
          job: job2,
          mut,
          toast: toast2,
          brand: brand2,
          crews,
          templates,
          currentUser,
          users
        }
      ),
      tab === "tasks" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabTasks, { job: job2, mut }),
      tab === "files" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabFiles, { job: job2, mut, toast: toast2 }),
      tab === "portal" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabPortal, { job: job2, brand: brand2, mut, toast: toast2 })
    ] })
  ] });
}
function TabOverview({ job: job2, juris, mut, toast: toast2, reviewSettings, brand: brand2, currentUser = { name: "Team" }, onLog = () => {
}, leadSources = LEAD_SOURCES, activity = [] }) {
  const notes = job2.notes || [];
  const [noteTxt, setNoteTxt] = (0, import_react.useState)("");
  const [noteVisible, setNoteVisible] = (0, import_react.useState)(false);
  const addNote = () => {
    const t = noteTxt.trim();
    if (!t) return;
    const n = {
      id: uid("n"),
      by: currentUser.name,
      at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " "),
      text: t,
      customerVisible: noteVisible
    };
    mut((j) => ({ ...j, notes: [n, ...j.notes || []] }));
    onLog({ kind: "note", jobId: job2.id, jobName: job2.name, text: `noted on ${job2.name}: "${t.slice(0, 70)}${t.length > 70 ? "\u2026" : ""}"${noteVisible ? " (customer-visible)" : ""}` });
    setNoteTxt("");
    setNoteVisible(false);
    toast2(noteVisible ? "Note added \u2014 customer can see this in their portal" : "Internal note added");
  };
  const toggleNoteVis = (id) => mut((j) => ({ ...j, notes: (j.notes || []).map((n) => n.id === id ? { ...n, customerVisible: !n.customerVisible } : n) }));
  const [editingNote, setEditingNote] = (0, import_react.useState)(null);
  const [editTxt, setEditTxt] = (0, import_react.useState)("");
  const startEditNote = (n) => {
    setEditingNote(n.id);
    setEditTxt(n.text);
  };
  const saveEditNote = (n) => {
    const t = editTxt.trim();
    if (!t || t === n.text) {
      setEditingNote(null);
      return;
    }
    mut((j) => ({ ...j, notes: (j.notes || []).map((x) => x.id === n.id ? { ...x, text: t, editedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " ") } : x) }));
    onLog({
      kind: "note",
      jobId: job2.id,
      jobName: job2.name,
      text: `edited a note on ${job2.name} \u2014 was: "${n.text.slice(0, 90)}${n.text.length > 90 ? "\u2026" : ""}" \u2192 now: "${t.slice(0, 90)}${t.length > 90 ? "\u2026" : ""}"`
    });
    setEditingNote(null);
    toast2("Note updated \u2014 the change is in the activity feed");
  };
  const deleteNote = (n) => {
    mut((j) => ({ ...j, notes: (j.notes || []).filter((x) => x.id !== n.id) }));
    onLog({
      kind: "note",
      jobId: job2.id,
      jobName: job2.name,
      text: `deleted a note on ${job2.name} \u2014 it said: "${n.text.slice(0, 120)}${n.text.length > 120 ? "\u2026" : ""}"`
    });
    toast2("Note deleted \u2014 its contents are preserved in the activity feed");
  };
  const cap = computeCapOut(job2);
  const pay = paymentsSummary(job2);
  const canReview = (job2.consent.sms.granted || job2.consent.email.granted) && !job2.review.sent;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Lead details" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Lead source", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: job2.leadSource || "", onChange: (e) => {
          mut((j) => ({ ...j, leadSource: e.target.value }));
          onLog({ kind: "lead", jobId: job2.id, jobName: job2.name, text: `changed ${job2.name}'s lead source to ${e.target.value}` });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Select\u2026" }),
          leadSources.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: l }, l))
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Referred by", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: inputStyle,
            value: job2.referredBy || "",
            placeholder: "Rob Theaton",
            onChange: (e) => mut((j) => ({ ...j, referredBy: e.target.value }))
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Priority", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: job2.priority || "", onChange: (e) => {
          mut((j) => ({ ...j, priority: e.target.value || null }));
          if (e.target.value) onLog({ kind: "lead", jobId: job2.id, jobName: job2.name, text: `set ${job2.name} to ${e.target.value} priority` });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "None" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Low" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Medium" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "High" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Urgent" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Lead quality", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 5, paddingTop: 8 }, children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => mut((j) => ({ ...j, leadQuality: j.leadQuality === n ? null : n })),
            style: {
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 800,
              fontSize: 13,
              border: `1.5px solid ${(job2.leadQuality || 0) >= n ? T.accent : S.line}`,
              background: (job2.leadQuality || 0) >= n ? T.accent : "#fff",
              color: (job2.leadQuality || 0) >= n ? "#fff" : S.sub
            },
            children: n
          },
          n
        )) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Tags", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }, children: [
        (job2.tags || []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "blue", children: [
          t,
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => mut((j) => ({ ...j, tags: (j.tags || []).filter((x) => x !== t) })),
              style: { border: "none", background: "none", cursor: "pointer", color: "inherit", fontWeight: 800, padding: 0 },
              children: "\xD7"
            }
          )
        ] }, t)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, width: 130, padding: "7px 10px", fontSize: 13 },
            placeholder: "Add tag \u21B5",
            onKeyDown: (e) => {
              const v = e.target.value.trim();
              if (e.key === "Enter" && v) {
                mut((j) => ({ ...j, tags: [.../* @__PURE__ */ new Set([...j.tags || [], v])] }));
                e.target.value = "";
              }
            }
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Notes & updates" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          style: { ...inputStyle, minHeight: 64, resize: "vertical", fontFamily: "inherit" },
          value: noteTxt,
          onChange: (e) => setNoteTxt(e.target.value),
          placeholder: "Log a call, a decision, a heads-up\u2026"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 9 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: S.ink, cursor: "pointer" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              type: "checkbox",
              checked: noteVisible,
              onChange: (e) => setNoteVisible(e.target.checked),
              style: { width: 17, height: 17, accentColor: T.accent }
            }
          ),
          "Visible to customer in their portal"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, onClick: addNote, disabled: !noteTxt.trim(), children: "Add note" })
      ] }),
      notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderTop: `1px solid ${S.line}`, padding: "11px 0", marginTop: 11 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11.5, color: S.sub }, children: [
            n.by,
            " \xB7 ",
            n.at,
            n.editedAt ? ` \xB7 edited ${n.editedAt}` : ""
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => toggleNoteVis(n.id), style: { border: "none", background: "none", cursor: "pointer", padding: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: n.customerVisible ? "green" : "gray", children: n.customerVisible ? "Customer can see" : "Internal only" }) })
        ] }),
        editingNote === n.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "textarea",
            {
              style: { ...inputStyle, minHeight: 60, resize: "vertical", fontFamily: "inherit" },
              value: editTxt,
              onChange: (e) => setEditTxt(e.target.value)
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 7 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, onClick: () => saveEditNote(n), disabled: !editTxt.trim(), children: "Save" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, kind: "ghost", onClick: () => setEditingNote(null), children: "Cancel" })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, lineHeight: 1.55, marginTop: 4, whiteSpace: "pre-wrap" }, children: n.text }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 12, marginTop: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: linkBtn, onClick: () => startEditNote(n), children: "Edit" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: { ...linkBtn, color: "#B42318" }, onClick: () => deleteNote(n), children: "Delete" })
          ] })
        ] })
      ] }, n.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Activity on this job" }),
      activity.filter((a) => a.jobId === job2.id).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub }, children: "Stage moves, notes, tasks, and messages on this job land here as they happen." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { maxHeight: 250, overflowY: "auto", marginRight: -4, paddingRight: 4 }, children: activity.filter((a) => a.jobId === job2.id).slice(0, 60).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderTop: `1px solid ${S.line}`, padding: "10px 0" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, lineHeight: 1.5 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: a.by }),
          " ",
          a.text
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11.5, color: S.sub, marginTop: 3 }, children: a.at })
      ] }, a.id)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Contact" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Phone", v: job2.phone }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Email", v: job2.email }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Lead source", v: job2.leadSource }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "SMS consent", v: job2.consent.sms.granted ? `Yes \u2014 ${job2.consent.sms.at} (${job2.consent.sms.source})` : "Not granted" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Email consent", v: job2.consent.email.granted ? `Yes \u2014 ${job2.consent.email.at}` : "Not granted" })
    ] }),
    job2.insurance && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: job2.insurance.coverage || "\u2014" }), children: "Insurance claim" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Carrier", v: job2.insurance.carrier || "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Policy #", v: job2.insurance.policy || "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Claim #", v: job2.insurance.claim || "Not filed yet" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Deductible", v: job2.insurance.deductible ? money(num(job2.insurance.deductible)) : "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Adjuster", v: job2.insurance.adjusterName ? `${job2.insurance.adjusterName} \xB7 ${job2.insurance.adjusterPhone}` : "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Ordinance & Law", v: job2.insurance.oLaw ? "Included" : "Not included" }),
      job2.insurance.endorsements && Object.values(job2.insurance.endorsements).some(Boolean) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 10, paddingTop: 10, borderTop: `1px solid ${S.line}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 800, color: "#92600A", marginBottom: 7 }, children: "ENDORSEMENTS THAT REDUCE THE SETTLEMENT" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: [
          job2.insurance.endorsements.rps && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "Roof Payment Schedule" }),
          job2.insurance.endorsements.acvRoof && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "ACV-only roof" }),
          job2.insurance.endorsements.windHailDed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "Wind/hail deductible" }),
          job2.insurance.endorsements.cosmetic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "Cosmetic exclusion" }),
          job2.insurance.endorsements.matching && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "green", children: "Matching endorsement" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "slate", children: job2.zip }), children: "Site location" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.5 }, children: job2.address }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: mapLinkForAddress(job2.address), target: "_blank", rel: "noreferrer", style: { flex: 1, textDecoration: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { width: "100%" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 13 }),
          " View map"
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: directionsLink(job2.address), target: "_blank", rel: "noreferrer", style: { flex: 1, textDecoration: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { width: "100%" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 13 }),
          " Directions"
        ] }) })
      ] })
    ] }),
    juris && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { right: juris.precision === "verified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "green", children: "Verified" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "State-level" }), children: [
        "Jurisdiction \u2014 ",
        juris.city ? `${juris.city}, ${juris.state}` : juris.state
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Building code", v: juris.codeName }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Edition", v: juris.codeEdition }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Permits", v: juris.permit }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Inspector office", v: juris.inspector.office }),
      juris.inspector.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Office phone", v: juris.inspector.phone }),
      juris.precision === "state" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Callout, { label: "Statewide guidance only", children: [
        "This zip isn't on file with a confirmed local record yet \u2014 the code shown is the ",
        juris.state,
        " default.",
        juris.state === "IL" ? " Illinois adoption is municipal, so the local ordinance must be confirmed before this goes in a supplement." : " Confirm the local building department and any amendments before relying on it."
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Job snapshot" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Estimate", v: `${job2.estimate.status}${job2.estimate.number ? " \xB7 " + job2.estimate.number : ""}` }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Contract", v: `${job2.contract.status}${job2.contract.signedAt ? " \xB7 " + job2.contract.signedAt : ""}` }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Checklist", v: job2.checklist.complete ? "Complete" : "Not complete" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Collected", v: `${money(pay.received)} of ${money(pay.contract)}` }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Balance due", v: money(pay.balance), strong: true }),
      cap.contract > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Gross profit", v: `${money(cap.gross)} (${pct1(cap.grossMargin)})` })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: job2.review.posted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "green", children: "Review posted" }) : job2.review.sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: "Request sent" }) : null, children: "Review request" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 12 }, children: job2.review.sent ? `Google review request sent${job2.review.clicked ? " and the link was opened" : ""}.` : job2.consent.sms.granted || job2.consent.email.granted ? `Sends the Google review link by ${[job2.consent.sms.granted && "text", job2.consent.email.granted && "email"].filter(Boolean).join(" and ")} (consent on file). Follow-up after ${reviewSettings.followUpDays} days if no click.` : "No SMS or email consent on file \u2014 review requests are blocked for this client." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        Btn,
        {
          small: true,
          kind: canReview ? "primary" : "ghost",
          disabled: !canReview,
          onClick: () => {
            mut((j) => ({ ...j, review: { ...j.review, sent: true } }));
            toast2("Review request queued");
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Star, { size: 14 }),
            " Send review request"
          ]
        }
      )
    ] })
  ] });
}
function formatPhone(raw) {
  const d = String(raw || "").replace(/\D/g, "").slice(0, 11);
  const n = d.length === 11 && d[0] === "1" ? d.slice(1) : d;
  if (n.length <= 3) return n;
  if (n.length <= 6) return `(${n.slice(0, 3)})${n.slice(3)}`;
  return `(${n.slice(0, 3)})${n.slice(3, 6)}-${n.slice(6, 10)}`;
}
var UNIT_TYPES = ["EA", "SQ", "LF", "SF", "Bundle", "Roll", "Box", "Piece", "Can", "Tube", "Gallon", "Pail", "Sheet", "Bag", "Pallet", "Hour", "Day", "Job"];
var SALES_VIBES = [
  "Every no is one call closer to a yes.",
  "The roof doesn't sell itself \u2014 you do.",
  "Fast follow-up wins the job. Every time.",
  "Storms pass. Reputations don't.",
  "Answer the phone. Half the competition won't.",
  "A homeowner remembers how you made them feel long after the shingle color.",
  "Set the appointment. The rest is details.",
  "Do it right the second time is expensive. Do it right the first time.",
  "The best lead is the neighbor of a happy customer.",
  "Nobody ever regretted documenting the damage too well."
];
function AnnouncementBar({ announcements = [] }) {
  const live = announcements.filter((a) => a.active !== false);
  const pool = live.length > 0 ? live.map((a) => ({ text: a.text, pinned: true })) : [{ text: SALES_VIBES[Math.floor(Date.now() / 864e5) % SALES_VIBES.length], pinned: false }];
  const [i, setI] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    if (pool.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % pool.length), 4500);
    return () => clearInterval(t);
  }, [pool.length]);
  const cur = pool[Math.min(i, pool.length - 1)];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
    margin: "0 16px 14px",
    background: cur.pinned ? T.accentSoft : S.soft,
    border: `1px solid ${cur.pinned ? T.accent : S.line}`,
    borderRadius: 12,
    padding: "12px 14px",
    display: "flex",
    gap: 10,
    alignItems: "center"
  }, children: [
    cur.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Megaphone, { size: 16, color: T.accent, style: { flexShrink: 0 } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Star, { size: 15, color: S.sub, style: { flexShrink: 0 } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, fontSize: 13.5, lineHeight: 1.5, color: cur.pinned ? T.accent : S.sub, fontWeight: cur.pinned ? 600 : 500 }, children: cur.text }),
    pool.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        onClick: () => setI((x) => (x + 1) % pool.length),
        style: { border: "none", background: "none", cursor: "pointer", flexShrink: 0, padding: 4 },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { size: 17, color: cur.pinned ? T.accent : S.sub })
      }
    )
  ] });
}
function AnnouncementManager({ announcements, setAnnouncements, currentUser, onBack, toast: toast2 }) {
  const canEdit = currentUser.role === "admin" || currentUser.role === "manager";
  const [draft, setDraft] = (0, import_react.useState)("");
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    setAnnouncements([{ id: uid("ann"), text: t, at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), by: currentUser.name, active: true }, ...announcements]);
    setDraft("");
    toast2("Announcement posted to everyone's home screen");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Company announcements", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 10, lineHeight: 1.5 }, children: "These show at the top of the home screen for everyone who signs in. Post more than one and they rotate every few seconds. With none posted, the team gets a rotating sales reminder instead." }),
      canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "textarea",
          {
            style: { ...inputStyle, minHeight: 70, resize: "vertical", fontFamily: "inherit" },
            value: draft,
            onChange: (e) => setDraft(e.target.value),
            placeholder: "Safety meeting Friday 7am \u2014 everyone on site by 6:45."
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { marginTop: 9 }, onClick: add, disabled: !draft.trim(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }),
          " Post announcement"
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub }, children: "Announcements are posted by the office." })
    ] }),
    announcements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 14, style: { marginTop: 8, opacity: a.active === false ? 0.55 : 1 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, lineHeight: 1.55 }, children: a.text }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, color: S.sub, marginTop: 6 }, children: [
        a.by,
        " \xB7 ",
        a.at
      ] }),
      canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Btn,
          {
            kind: "ghost",
            small: true,
            style: { flex: 1 },
            onClick: () => setAnnouncements(announcements.map((x) => x.id === a.id ? { ...x, active: x.active === false } : x)),
            children: a.active === false ? "Show again" : "Hide"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", small: true, onClick: () => {
          setAnnouncements(announcements.filter((x) => x.id !== a.id));
          toast2("Announcement removed");
        }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 13 }) })
      ] })
    ] }, a.id))
  ] });
}
function docShell(title, brand2, bodyHtml) {
  const esc2 = (x) => String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const logo = brand2.logo ? `<img src="${brand2.logo}" style="height:52px;object-fit:contain" alt="">` : `<div style="font:800 22px Georgia,serif;color:${brand2.primary}">${esc2(brand2.company)}</div>`;
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc2(title)}</title>
<style>
  @page { size: letter; margin: 0.6in; }
  * { box-sizing: border-box; }
  body { font: 13px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; color: #111827; margin: 0; padding: 22px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;
          border-bottom: 3px solid ${brand2.primary}; padding-bottom: 14px; margin-bottom: 20px; }
  .co { font-size: 11.5px; color: #6B7280; line-height: 1.5; margin-top: 6px; white-space: pre-line; }
  .title { font-size: 21px; font-weight: 800; text-align: right; color: ${brand2.primary}; }
  .meta { font-size: 11.5px; color: #6B7280; text-align: right; margin-top: 5px; line-height: 1.6; }
  h2 { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: #6B7280;
       margin: 22px 0 8px; font-weight: 800; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th { text-align: left; font-size: 10.5px; letter-spacing: .05em; text-transform: uppercase;
       color: #6B7280; border-bottom: 1.5px solid #E5E7EB; padding: 7px 6px; }
  td { padding: 8px 6px; border-bottom: 1px solid #F3F4F6; vertical-align: top; font-size: 12.5px; }
  td.r, th.r { text-align: right; white-space: nowrap; }
  .tot { display: flex; justify-content: space-between; padding: 7px 6px; font-size: 13px; }
  .tot.grand { font-weight: 800; font-size: 15px; border-top: 2px solid ${brand2.primary}; margin-top: 6px; padding-top: 10px; }
  .box { border: 1px solid #E5E7EB; border-radius: 9px; padding: 12px 14px; margin-top: 8px; }
  .muted { color: #6B7280; font-size: 11.5px; line-height: 1.6; white-space: pre-wrap; }
  .sig { display: flex; gap: 26px; margin-top: 26px; page-break-inside: avoid; }
  .sig > div { flex: 1; }
  .sigline { border-bottom: 1.5px solid #111827; height: 42px; }
  .siglbl { font-size: 10.5px; color: #6B7280; margin-top: 5px; }
  .foot { margin-top: 26px; padding-top: 12px; border-top: 1px solid #E5E7EB;
          font-size: 10.5px; color: #9CA3AF; text-align: center; }
  .cover { text-align: center; padding: 40px 0 30px; page-break-after: always; }
  .cover img.hero { width: 100%; border-radius: 12px; margin-bottom: 26px; }
  @media print { .noprint { display: none !important; } body { padding: 0; } }
  .bar { position: sticky; top: 0; background: #111827; color: #fff; padding: 11px 14px;
         display: flex; gap: 10px; align-items: center; margin: -22px -22px 20px; }
  .bar button { background: #fff; color: #111827; border: 0; border-radius: 7px;
                padding: 9px 15px; font-weight: 700; font-size: 13px; cursor: pointer; }
  .bar span { font-size: 12.5px; opacity: .85; }
</style></head><body>
<div class="bar noprint">
  <button onclick="window.print()">Save as PDF / Print</button>
  <span>Choose "Save to Files" or "Save as PDF" in the print dialog.</span>
</div>
<div class="head">
  <div>${logo}<div class="co">${esc2(brand2.address)}
${esc2(brand2.phone)}   ${esc2(brand2.email)}${brand2.license ? "\n" + esc2(brand2.license) : ""}</div></div>
  <div><div class="title">${esc2(title)}</div></div>
</div>
${bodyHtml}
<div class="foot">${esc2(brand2.company)} \xB7 ${esc2(brand2.slogan)}</div>
</body></html>`;
}
function openDoc(title, brand2, bodyHtml, toast2) {
  try {
    const w = window.open("", "_blank");
    if (!w) {
      toast2 && toast2("Allow pop-ups for this site to open documents");
      return false;
    }
    w.document.write(docShell(title, brand2, bodyHtml));
    w.document.close();
    return true;
  } catch (e) {
    toast2 && toast2("Couldn't open the document window");
    return false;
  }
}
var esc = (x) => String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function lineTable(items, opts = {}) {
  const rows = items.map((it) => `<tr>
    <td>${esc(it.desc)}</td>
    <td class="r">${esc(it.qty)} ${esc(it.unit || "")}</td>
    ${opts.hidePrice ? "" : `<td class="r">${money(num(it.price))}</td><td class="r">${money(num(it.qty) * num(it.price))}</td>`}
  </tr>`).join("");
  return `<table><thead><tr>
    <th>Description</th><th class="r">Qty</th>
    ${opts.hidePrice ? "" : '<th class="r">Unit</th><th class="r">Amount</th>'}
  </tr></thead><tbody>${rows}</tbody></table>`;
}
function estimateDocHtml(job2, brand2) {
  const est = job2.estimate;
  const doc = est.doc || {};
  const total = estimateTotal(est);
  const secs = doc.sections || ["cover", "items", "notes", "terms"];
  let out = "";
  for (const sec of secs) {
    if (sec === "cover" && (doc.coverImage || true)) {
      out += `<div class="cover">
        ${doc.coverImage ? `<img class="hero" src="${doc.coverImage}" alt="">` : ""}
        <div style="font-size:26px;font-weight:800;color:${brand2.primary}">Roofing Proposal</div>
        <div style="margin-top:18px;font-size:15px"><b>Prepared for ${esc(job2.name)}</b></div>
        <div class="muted" style="font-size:13px">${esc(job2.address)}</div>
        <div class="muted" style="margin-top:14px">${esc(est.number || "")} \xB7 ${esc(est.date || "")}</div>
      </div>`;
    }
    if (sec === "items") {
      out += `<h2>Scope of work</h2>`;
      if (est.scope) out += `<div class="muted">${esc(est.scope)}</div>`;
      out += lineTable(est.items || []);
      out += `<div class="tot grand"><span>Total</span><span>${money(total)}</span></div>`;
      if (est.validThrough) out += `<div class="muted" style="margin-top:10px">Valid through ${esc(est.validThrough)}</div>`;
    }
    if (sec === "notes" && doc.notes) out += `<h2>Special notes</h2><div class="muted">${esc(doc.notes)}</div>`;
    if (sec === "terms" && doc.terms) out += `<h2>Terms &amp; conditions</h2><div class="muted">${esc(doc.terms)}</div>`;
  }
  out += `<div class="sig">
    <div><div class="sigline"></div><div class="siglbl">Customer signature / date</div></div>
    <div><div class="sigline"></div><div class="siglbl">${esc(brand2.company)} representative</div></div>
  </div>`;
  return out;
}
function invoiceDocHtml(job2, brand2) {
  const pay = paymentsSummary(job2);
  const est = job2.estimate;
  const num2 = job2.invoiceNo || (job2.contract && job2.contract.number ? job2.contract.number.replace("CON", "INV") : "INV-DRAFT");
  let out = `<div style="display:flex;justify-content:space-between;gap:20px">
    <div><h2 style="margin-top:0">Bill to</h2>
      <div><b>${esc(job2.name)}</b></div><div class="muted">${esc(job2.address)}</div>
      ${job2.email ? `<div class="muted">${esc(job2.email)}</div>` : ""}
      ${job2.phone ? `<div class="muted">${esc(job2.phone)}</div>` : ""}
    </div>
    <div style="text-align:right">
      <div class="muted">Invoice ${esc(num2)}</div>
      ${job2.invoiceDue ? `<div class="muted">Due ${esc(job2.invoiceDue)}</div>` : ""}
      ${job2.invoicePo ? `<div class="muted">PO ${esc(job2.invoicePo)}</div>` : ""}
    </div>
  </div>`;
  out += `<h2>Work performed</h2>` + lineTable(est && est.items || []);
  const contractPrice = job2.contract && job2.contract.price || estimateTotal(est);
  out += `<div class="tot"><span>Contract total</span><span>${money(contractPrice)}</span></div>`;
  out += `<div class="tot"><span>Payments received</span><span>\u2212${money(pay.received)}</span></div>`;
  out += `<div class="tot grand"><span>Balance due</span><span>${money(contractPrice - pay.received)}</span></div>`;
  if ((job2.payments || []).length) {
    out += `<h2>Payment history</h2><table><thead><tr><th>Date</th><th>Method</th><th>Reference</th><th class="r">Amount</th></tr></thead><tbody>` + job2.payments.filter((x) => x.type === "Received").map((x) => `<tr><td>${esc(x.date || "")}</td><td>${esc(x.method || "")}</td><td>${esc(x.ref || "")}</td><td class="r">${money(num(x.amt))}</td></tr>`).join("") + `</tbody></table>`;
  }
  out += `<div class="box" style="margin-top:20px"><b>Remit to</b><div class="muted">${esc(brand2.company)}
${esc(brand2.address)}
${esc(brand2.phone)}</div></div>`;
  return out;
}
function workOrderDocHtml(job2, brand2, crew2) {
  const m = job2.measurements || {};
  const wo = job2.workOrder || {};
  let out = `<div style="display:flex;justify-content:space-between;gap:20px">
    <div><h2 style="margin-top:0">Job site</h2>
      <div><b>${esc(job2.name)}</b></div><div class="muted">${esc(job2.address)}</div>
    </div>
    <div style="text-align:right">
      ${wo.number ? `<div class="muted">WO ${esc(wo.number)}</div>` : ""}
      ${wo.po ? `<div class="muted">PO ${esc(wo.po)}</div>` : ""}
      ${job2.schedDate ? `<div class="muted">Scheduled ${esc(job2.schedDate)}</div>` : ""}
      ${crew2 ? `<div class="muted">Crew: ${esc(crew2.name)}</div>` : ""}
    </div>
  </div>`;
  out += `<h2>Roof measurements</h2><table><tbody>` + [
    ["Squares", m.squares],
    ["Pitch", m.pitch],
    ["Layers", m.layers],
    ["Stories", m.stories],
    ["Ridges", m.ridges && m.ridges + " LF"],
    ["Hips", m.hips && m.hips + " LF"],
    ["Valleys", m.valleys && m.valleys + " LF"],
    ["Eaves", m.eaves && m.eaves + " LF"],
    ["Rakes", m.rakes && m.rakes + " LF"],
    ["Penetrations", m.penetrations]
  ].filter(([, v]) => v).map(([k, v]) => `<tr><td>${esc(k)}</td><td class="r">${esc(v)}</td></tr>`).join("") + `</tbody></table>`;
  const mats = generateRoofingMaterials(m);
  if (mats && mats.length) {
    out += `<h2>Materials</h2>` + lineTable(mats.map((x) => ({ desc: x.item, qty: x.qty, unit: x.unit })), { hidePrice: true });
  }
  if (wo.notes) out += `<h2>Instructions</h2><div class="muted">${esc(wo.notes)}</div>`;
  out += `<div class="box" style="margin-top:18px"><b>Pricing is intentionally omitted from work orders.</b>
    <div class="muted">Questions on scope go to the office at ${esc(brand2.phone)}.</div></div>`;
  return out;
}
function contractDocHtml(job2, brand2) {
  const con = job2.contract || {};
  const mode = con.depositMode || "pct";
  const deposit = mode === "fixed" ? num(con.depositFixed) : (con.price || 0) * ((con.depositPct || 0) / 100);
  let out = `<div style="display:flex;justify-content:space-between;gap:20px">
    <div><h2 style="margin-top:0">Customer</h2>
      <div><b>${esc(job2.name)}</b></div><div class="muted">${esc(job2.address)}</div></div>
    <div style="text-align:right">${con.number ? `<div class="muted">${esc(con.number)}</div>` : ""}
      ${con.date ? `<div class="muted">${esc(con.date)}</div>` : ""}</div>
  </div>`;
  if (con.scope) out += `<h2>Scope of work</h2><div class="muted">${esc(con.scope)}</div>`;
  out += `<h2>Price &amp; payment schedule</h2>
    <div class="tot"><span>Contract price</span><span>${money(con.price || 0)}</span></div>
    <div class="tot"><span>Due at signing${mode === "pct" ? ` (${con.depositPct}%)` : ""}</span><span>${money(deposit)}</span></div>
    <div class="tot grand"><span>Due on substantial completion</span><span>${money((con.price || 0) - deposit)}</span></div>`;
  if (con.terms) out += `<h2>Terms &amp; conditions</h2><div class="muted">${esc(con.terms)}</div>`;
  out += `<div class="sig">
    <div><div class="sigline"></div><div class="siglbl">Customer signature / date</div></div>
    <div><div class="sigline"></div><div class="siglbl">${esc(brand2.company)} representative / date</div></div>
  </div>`;
  return out;
}
function PublicPortal({ token }) {
  const [state, setState] = (0, import_react.useState)({ loading: true, data: null, err: "" });
  (0, import_react.useEffect)(() => {
    const db = DB();
    if (!db) {
      setState({ loading: false, data: null, err: "This link needs a live connection." });
      return;
    }
    db.from("crm_portal").select("data, revoked").eq("token", token).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        setState({ loading: false, data: null, err: "This link isn't valid or has been turned off." });
        return;
      }
      setState({ loading: false, data: data.data, err: "" });
    });
  }, [token]);
  if (state.loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { minHeight: "100vh", display: "grid", placeItems: "center", background: S.bg, fontFamily: "'Inter',system-ui,sans-serif", color: S.sub }, children: "Loading\u2026" });
  }
  if (!state.data) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { minHeight: "100vh", display: "grid", placeItems: "center", background: S.bg, padding: 24, fontFamily: "'Inter',system-ui,sans-serif" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", maxWidth: 340 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 16, fontWeight: 700, color: S.ink }, children: "Link unavailable" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14, color: S.sub, marginTop: 8, lineHeight: 1.55 }, children: [
        state.err,
        " Please contact your contractor for a new one."
      ] })
    ] }) });
  }
  const d = state.data;
  const prim = d.primary || "#28373E";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minHeight: "100vh", background: S.bg, fontFamily: "'Inter','SF Pro Text',system-ui,sans-serif" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: prim, color: "#fff", padding: "22px 18px 26px" }, children: [
      d.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: d.logo, alt: "", style: { height: 44, objectFit: "contain", marginBottom: 10, display: "block" } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, opacity: 0.8 }, children: d.company }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 21, fontWeight: 800, marginTop: 4 }, children: "Your roofing project" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, opacity: 0.85, marginTop: 3 }, children: d.address })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 60px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Project status" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: d.stageLabel || "In progress" }),
        d.schedDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13.5, color: S.ink, marginTop: 10 }, children: [
          "Installation scheduled for ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: d.schedDate })
        ] })
      ] }),
      (d.notes || []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Updates from your team" }),
        d.notes.map((n, i2) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderTop: i2 ? `1px solid ${S.line}` : "none", padding: "10px 0" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11.5, color: S.sub }, children: n.at }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, lineHeight: 1.55, marginTop: 3, whiteSpace: "pre-wrap" }, children: n.text })
        ] }, i2))
      ] }),
      d.estimate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontWeight: 800 }, children: money(d.estimate.total) }), children: "Your estimate" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, color: S.sub, marginBottom: 8 }, children: [
          d.estimate.number,
          " \xB7 ",
          d.estimate.date
        ] }),
        (d.estimate.items || []).map((it, i2) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13.5, padding: "7px 0", borderTop: `1px solid ${S.line}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            it.desc,
            " \u2014 ",
            it.qty,
            " ",
            it.unit
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontWeight: 600, whiteSpace: "nowrap" }, children: money(num(it.qty) * num(it.price)) })
        ] }, i2))
      ] }),
      d.contract && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: d.contract.status === "Signed" ? "green" : "gray", children: d.contract.status }), children: "Your contract" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Contract", v: d.contract.number || "\u2014" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Price", v: money(d.contract.price || 0), strong: true })
      ] }),
      (d.photos || []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Project photos" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }, children: d.photos.map((ph, i2) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: ph.url, alt: "", style: { width: "100%", borderRadius: 9, display: "block" } }),
          ph.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11.5, color: S.sub, marginTop: 3 }, children: ph.label })
        ] }, i2)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Questions?" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14, lineHeight: 1.6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: d.company }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { color: S.sub }, children: d.slogan }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: `tel:${String(d.phone || "").replace(/\D/g, "")}`, style: { color: prim, fontWeight: 700 }, children: d.phone }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: `mailto:${d.email}`, style: { color: prim }, children: d.email }) })
        ] })
      ] })
    ] })
  ] });
}
function PillGroup({ options, value, onPick, multi = false }) {
  const vals = multi ? Array.isArray(value) ? value : [] : [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 7 }, children: options.map((o) => {
    const on = multi ? vals.includes(o) : value === o;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => {
      if (multi) onPick(on ? vals.filter((x) => x !== o) : [...vals, o]);
      else onPick(on ? "" : o);
    }, style: {
      border: `1.5px solid ${on ? T.accent : S.line}`,
      background: on ? T.accentSoft : "#fff",
      color: on ? T.accent : S.ink,
      borderRadius: 999,
      padding: "8px 13px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      touchAction: "manipulation"
    }, children: o }, o);
  }) });
}
function TabChecklist({ job: job2, mut, toast: toast2 }) {
  const c = job2.checklist;
  const set = (k) => (v) => mut((j) => ({ ...j, checklist: { ...j.checklist, [k]: v } }));
  const required = ["structure", "roofAge", "layers", "roofType", "pitch", "overall"];
  const missing = required.filter((k) => !c[k]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: c.complete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "green", children: "Complete" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "In progress" }), children: "Roofing inspection checklist" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 6 }, children: "Filled in the field. Once marked complete, it feeds the inspection report and unlocks report sending." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Structure & history" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Structure type", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Single Family", "Multi-Family", "Detached Garage", "Commercial"], value: c.structure, onPick: set("structure") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Approximate roof age (years)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: c.roofAge, onChange: (e) => set("roofAge")(e.target.value) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Inspection method", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Visual, non-invasive; roof surface accessed directly", "Drone-assisted visual inspection", "Ground + ladder at eave only"], value: c.method, onPick: set("method") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Layers", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["1 Layer", "2 Layers", "3+ Layers"], value: c.layers, onPick: set("layers") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Roof covering", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Asphalt shingle", "Metal", "Flat / membrane", "Tile", "Wood shake"], value: c.roofType, onPick: set("roofType") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Pitch (primary)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12+"], value: c.pitch, onPick: set("pitch") }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Decking & ventilation" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Decking type", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["OSB", "Plywood", "1x6 Plank / Spaced Lumber", "Unknown"], value: c.deckingType, onPick: set("deckingType") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Decking condition", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Good", "Fair", "Poor", "Critical"], value: c.deckingCond, onPick: set("deckingCond") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Ventilation present", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { multi: true, options: ["Ridge Vent", "Box Vents / Turtles", "Gable Vents", "Power Vent", "Turbines", "None visible"], value: c.ventTypes, onPick: set("ventTypes") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Soffit intake present", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Yes", "No", "Blocked"], value: c.soffitIntake, onPick: set("soffitIntake") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Ventilation condition", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Good", "Fair", "Poor", "Critical"], value: c.ventCond, onPick: set("ventCond") }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: "Required" }), children: "Attic" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Attic accessible", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Yes", "No \u2014 note reason in notes"], value: c.atticAccess, onPick: set("atticAccess") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Decking from below", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Good", "Stained / Tracked", "Active Rot / Mold", "Not visible"], value: c.atticDecking, onPick: set("atticDecking") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Daylight visible through decking", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Yes", "No"], value: c.lightCheck, onPick: set("lightCheck") }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Damage indicators" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Granule loss", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Minimal", "Moderate", "Heavy", "Critical"], value: c.granuleLoss, onPick: set("granuleLoss") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Wind damage (creased / missing tabs)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Yes", "No"], value: c.windDamage, onPick: set("windDamage") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Hail impact evidence", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Yes", "No"], value: c.hailImpact, onPick: set("hailImpact") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Flashing failures", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Yes", "No"], value: c.flashingFail, onPick: set("flashingFail") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Pipe boots cracked / failed", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Yes", "No"], value: c.pipeBoots, onPick: set("pipeBoots") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Overall roof condition", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillGroup, { options: ["Good", "Fair", "Poor", "Critical"], value: c.overall, onPick: set("overall") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Field notes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { style: { ...inputStyle, minHeight: 90 }, value: c.notes, onChange: (e) => set("notes")(e.target.value) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 14, display: "flex", gap: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { flex: 1 }, disabled: missing.length > 0, onClick: () => {
      mut((j) => ({ ...j, checklist: { ...j.checklist, complete: true } }));
      toast2("Checklist complete \u2014 report unlocked");
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { size: 16 }),
      " Mark checklist complete"
    ] }) }),
    missing.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: "#B42318", marginTop: 10 }, children: [
      "Still needed: ",
      missing.join(", ")
    ] })
  ] });
}
function TabMeasure({ job: job2, mut, toast: toast2 }) {
  const m = job2.measurements;
  const set = (k) => (e) => mut((j) => ({ ...j, measurements: { ...j.measurements, [k]: e.target.value } }));
  const rows = [
    ["squares", "Total roof area", "SQ"],
    ["pitch", "Predominant pitch", "x/12"],
    ["ridges", "Ridges", "LF"],
    ["hips", "Hips", "LF"],
    ["valleys", "Valleys", "LF"],
    ["eaves", "Eaves", "LF"],
    ["rakes", "Rakes", "LF"],
    ["stepFlash", "Step flashing", "LF"],
    ["wallFlash", "Wall / headwall flashing", "LF"],
    ["penetrations", "Penetrations", "count"]
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Roof measurements" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 14 }, children: "Enter manually or from an aerial measurement report (Roofr / EagleView PDF upload attaches under Files). These drive the material list and estimate quantities." }),
      rows.map(([k, label, unit]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, fontSize: 14, color: S.ink }, children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: { ...inputStyle, width: 110, textAlign: "right" }, value: m[k], onChange: set(k), inputMode: "decimal" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 44, fontSize: 12, color: S.sub }, children: unit })
      ] }, k)),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4, paddingTop: 8, borderTop: `1px solid ${S.line}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, fontSize: 14, fontWeight: 700 }, children: "Waste factor" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: { ...inputStyle, width: 110, textAlign: "right" }, value: m.waste, onChange: set("waste"), inputMode: "decimal" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 44, fontSize: 12, color: S.sub }, children: "%" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: () => toast2("Attach the measurement PDF under Files"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { size: 15 }),
        " Upload report"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { flex: 1 }, onClick: () => toast2("Measurements saved"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Check, { size: 15 }),
        " Save"
      ] })
    ] })
  ] });
}
function TabMaterials({ job: job2, mut, toast: toast2 }) {
  const list = generateRoofingMaterials(job2.measurements);
  const copyText = () => {
    if (!list) return;
    const txt = [
      `MATERIAL ORDER \u2014 ${job2.name}`,
      job2.address,
      "",
      ...list.map((r) => `${r.qty} ${r.unit} \u2014 ${r.item} (${r.note})`)
    ].join("\n");
    if (navigator.clipboard) navigator.clipboard.writeText(txt);
    toast2("Material list copied");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "PO number (optional)", hint: "Goes on the material order to the supplier.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: inputStyle,
          value: job2.materialsPo || "",
          placeholder: "PO-2026-0148",
          onChange: (e) => mut((j) => ({ ...j, materialsPo: e.target.value }))
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: list && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "blue", children: [
        job2.measurements.waste,
        "% waste"
      ] }), children: "Roofing material order" }),
      !list ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "Enter measurements first \u2014 quantities generate automatically from squares, linear footage, and the waste factor." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { style: { textAlign: "left", color: S.sub }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "8px 6px" }, children: "Item" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "8px 6px", textAlign: "right" }, children: "Qty" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "8px 6px" }, children: "Unit" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { padding: "8px 6px" }, children: "Basis" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { style: { borderTop: `1px solid ${S.line}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "9px 6px", fontWeight: 600, color: S.ink }, children: r.item }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "9px 6px", textAlign: "right", fontWeight: 700 }, children: r.qty }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "9px 6px", color: S.sub }, children: r.unit }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "9px 6px", color: S.sub }, children: r.note })
        ] }, r.item)) })
      ] }) })
    ] }),
    list && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: copyText, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Copy, { size: 15 }),
        " Copy list"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: () => openDoc(`Material order \u2014 ${job2.name}`, brand, workOrderDocHtml(job2, brand, null), toast2), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Printer, { size: 15 }),
        " Print / PDF"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Other trades" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub }, children: "Siding, gutter, and window order lists follow the same pattern \u2014 import trade measurements and generate. Wired for roofing in this prototype; the other three use the same generator with their own item tables." })
    ] })
  ] });
}
function TabEstimate({ job: job2, brand: brand2, mut, toast: toast2, estimateTemplates = [], setEstimateTemplates = () => {
} }) {
  const est = job2.estimate;
  const [sigOpen, setSigOpen] = (0, import_react.useState)(false);
  const locked = est.status === "Signed";
  const setEst = (patch) => mut((j) => ({ ...j, estimate: { ...j.estimate, ...patch } }));
  const setItem = (id, k, v) => setEst({ items: est.items.map((it) => it.id === id ? { ...it, [k]: v } : it) });
  const total = estimateTotal(est);
  const [adjMode, setAdjMode] = (0, import_react.useState)("margin");
  const [adjPct, setAdjPct] = (0, import_react.useState)("");
  const applyPricing = () => {
    const pct = num(adjPct);
    if (!pct) {
      toast2("Enter a percentage first");
      return;
    }
    setEst({
      items: est.items.map((it) => {
        const cost = num(it.cost);
        const base = cost > 0 ? cost : num(it.price);
        if (!base) return it;
        const price = adjMode === "margin" ? pct < 100 ? base / (1 - pct / 100) : base : base * (1 + pct / 100);
        return { ...it, price: +price.toFixed(2) };
      })
    });
    toast2(`${adjMode === "margin" ? "Margin" : "Markup"} of ${pct}% applied`);
  };
  const lineMargin = (it) => {
    const cost = num(it.cost), price = num(it.price);
    return price > 0 && cost > 0 ? ((price - cost) / price * 100).toFixed(0) : null;
  };
  const [tplSheet, setTplSheet] = (0, import_react.useState)(false);
  const [tplName, setTplName] = (0, import_react.useState)("");
  const saveTemplate = () => {
    const name = tplName.trim();
    if (!name || est.items.length === 0) return;
    setEstimateTemplates([
      ...estimateTemplates.filter((t) => t.name.toLowerCase() !== name.toLowerCase()),
      { id: uid("etpl"), name, items: est.items.map(({ id, ...rest }) => rest) }
    ]);
    setTplName("");
    setTplSheet(false);
    toast2(`Template "${name}" saved`);
  };
  const applyTemplate = (t) => {
    setEst({ items: [...est.items, ...t.items.map((it) => ({ ...it, id: uid("e") }))] });
    setTplSheet(false);
    toast2(`"${t.name}" added \u2014 ${t.items.length} lines`);
  };
  const doc = est.doc || { sections: ["cover", "items", "notes", "terms"], coverImage: null, notes: "", terms: "" };
  const setDoc = (patch) => setEst({ doc: { ...doc, ...patch } });
  const [docSheet, setDocSheet] = (0, import_react.useState)(false);
  const [previewOpen, setPreviewOpen] = (0, import_react.useState)(false);
  const coverRef = (0, import_react.useRef)(null);
  const onCover = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = () => {
      setDoc({ coverImage: String(r.result) });
      toast2("Cover image set");
    };
    r.readAsDataURL(file);
    e.target.value = "";
  };
  const moveSection = (idx, dir) => {
    const arr = [...doc.sections];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    setDoc({ sections: arr });
  };
  const SECTION_LABELS = { cover: "Cover page", items: "Line items & pricing", notes: "Special notes", terms: "Terms & conditions" };
  const m = job2.measurements;
  const prefillFromMeasurements = () => {
    if (!num(m.squares)) {
      toast2("Enter measurements first");
      return;
    }
    const sqW = (num(m.squares) * (1 + num(m.waste) / 100)).toFixed(1);
    setEst({
      number: est.number || `EST-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
      date: est.date || (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" }),
      items: [
        { id: uid("e"), desc: `Tear-off & disposal \u2014 ${job2.checklist.layers || "1 layer"}`, qty: num(m.squares), unit: "SQ", price: 0 },
        { id: uid("e"), desc: "Ice & water shield \u2014 eaves & valleys", qty: Math.round((num(m.eaves) + num(m.valleys)) * 3 / 100 * 10) / 10, unit: "SQ", price: 0 },
        { id: uid("e"), desc: "Synthetic underlayment \u2014 field", qty: num(m.squares), unit: "SQ", price: 0 },
        { id: uid("e"), desc: "Drip edge \u2014 eaves & rakes", qty: num(m.eaves) + num(m.rakes), unit: "LF", price: 0 },
        { id: uid("e"), desc: "Architectural shingles (incl. waste)", qty: num(sqW), unit: "SQ", price: 0 },
        { id: uid("e"), desc: "Hip & ridge cap", qty: num(m.ridges) + num(m.hips), unit: "LF", price: 0 },
        { id: uid("e"), desc: "Ridge ventilation", qty: num(m.ridges), unit: "LF", price: 0 },
        { id: uid("e"), desc: "Pipe jacks at penetrations", qty: num(m.penetrations), unit: "EA", price: 0 }
      ]
    });
    toast2("Line items generated from measurements");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: locked ? "green" : est.status === "Sent" ? "blue" : "gray", children: est.status }), children: [
        "Estimate ",
        est.number && `\xB7 ${est.number}`
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Estimate #", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: est.number, disabled: locked, onChange: (e) => setEst({ number: e.target.value }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Date", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: inputStyle,
            value: est.date || (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" }),
            disabled: locked,
            onChange: (e) => setEst({ date: e.target.value })
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Valid through", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: est.validThrough, disabled: locked, onChange: (e) => setEst({ validThrough: e.target.value }) }) })
    ] }),
    num(m.squares) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Roof measurements (reference)" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }, children: [
        ["Area", `${m.squares} SQ`],
        ["Pitch", m.pitch],
        ["Ridges", `${m.ridges} LF`],
        ["Valleys", `${m.valleys} LF`],
        ["Eaves", `${m.eaves} LF`],
        ["Rakes", `${m.rakes} LF`]
      ].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: "#FAFBFC", border: `1px solid ${S.line}`, borderRadius: 10, padding: "8px 10px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: S.sub }, children: k }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700 }, children: v || "\u2014" })
      ] }, k)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Pricing controls" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 10, lineHeight: 1.5 }, children: "Set profit across every line at once. Margin is profit as a share of the sell price; markup is a percentage added on top of cost. Lines with a unit cost are computed from cost; lines without one scale from their current price." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: { ...selStyle, flex: 1 }, value: adjMode, disabled: locked, onChange: (e) => setAdjMode(e.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "margin", children: "Profit margin" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "markup", children: "Markup" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, width: 80, textAlign: "right" },
            value: adjPct,
            disabled: locked,
            inputMode: "decimal",
            placeholder: "30",
            onChange: (e) => setAdjPct(e.target.value)
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: S.sub, fontSize: 13 }, children: "%" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, onClick: applyPricing, disabled: locked, children: "Apply" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "soft", small: true, onClick: () => setTplSheet(true), children: "Open" }), children: "Estimate templates" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.5 }, children: `Save this estimate's lines under a name \u2014 "Full replacement \u2014 architectural", "Repair minimum" \u2014 and drop them into any future estimate in one tap.` })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "soft", small: true, onClick: () => setDocSheet(true), children: "Layout" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "soft", small: true, onClick: () => setPreviewOpen(true), children: "Preview" })
      ] }), children: "Estimate document" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.5 }, children: "The customer-facing document: cover page with your logo, a photo, and their info, then sections in the order you choose \u2014 line items, notes, terms." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Scope of work" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          style: { ...inputStyle, minHeight: 110 },
          disabled: locked,
          value: est.scope,
          onChange: (e) => setEst({ scope: e.target.value }),
          placeholder: "Describe the work \u2014 tear-off, dry-in, install, flashings, cleanup\u2026"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: linkBtn, onClick: prefillFromMeasurements, children: "Generate from measurements" }), children: "Pricing" }),
      est.items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 10 }, children: "No line items yet." }),
      est.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderBottom: `1px solid ${S.line}`, padding: "10px 0" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, marginBottom: 8, fontWeight: 600 },
            value: it.desc,
            disabled: locked,
            onChange: (e) => setItem(it.id, "desc", e.target.value)
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              style: { ...inputStyle, width: 84, textAlign: "right" },
              value: it.qty,
              disabled: locked,
              inputMode: "decimal",
              onChange: (e) => setItem(it.id, "qty", e.target.value)
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              style: { ...inputStyle, width: 62 },
              value: it.unit,
              disabled: locked,
              onChange: (e) => setItem(it.id, "unit", e.target.value)
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: S.sub }, children: "\xD7" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              style: { ...inputStyle, width: 92, textAlign: "right" },
              value: it.price,
              disabled: locked,
              inputMode: "decimal",
              onChange: (e) => setItem(it.id, "price", e.target.value)
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginLeft: "auto", fontWeight: 800, fontSize: 14 }, children: money(num(it.qty) * num(it.price)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11.5, color: S.sub }, children: "Unit cost" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              style: { ...inputStyle, width: 92, textAlign: "right", padding: "7px 9px", fontSize: 13 },
              value: it.cost ?? "",
              disabled: locked,
              inputMode: "decimal",
              placeholder: "\u2014",
              onChange: (e) => setItem(it.id, "cost", e.target.value)
            }
          ),
          lineMargin(it) != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: num(lineMargin(it)) >= 30 ? "green" : num(lineMargin(it)) >= 15 ? "amber" : "red", children: [
            lineMargin(it),
            "% margin"
          ] }),
          !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => setEst({ items: est.items.filter((x) => x.id !== it.id) }),
              style: { border: "none", background: "none", cursor: "pointer" },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 15, color: "#B42318" })
            }
          )
        ] })
      ] }, it.id)),
      !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        Btn,
        {
          kind: "soft",
          small: true,
          style: { marginTop: 12 },
          onClick: () => setEst({ items: [...est.items, { id: uid("e"), desc: "", qty: 1, unit: "EA", price: 0 }] }),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }),
            " Add line item"
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: 14,
        marginTop: 8,
        borderTop: `2px solid ${S.ink}`
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 15, fontWeight: 800 }, children: "Total investment" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 18, fontWeight: 800 }, children: money(total) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Concealed conditions \u2014 unit pricing" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 10 }, children: "Pre-agreed pricing for conditions found after tear-off. Billed as change orders only when found and documented." }),
      est.concealed.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, fontSize: 13, color: S.ink }, children: [
          c.desc,
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: S.sub }, children: [
            "(",
            c.unit,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: S.sub, fontSize: 13 }, children: "$" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, width: 90, textAlign: "right" },
            value: c.price,
            disabled: locked,
            inputMode: "decimal",
            onChange: (e) => setEst({ concealed: est.concealed.map((x) => x.id === c.id ? { ...x, price: e.target.value } : x) })
          }
        )
      ] }, c.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Acceptance" }),
      est.clientSig ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14, color: S.ink, marginBottom: 8 }, children: [
          "Signed by client \u2014 ",
          est.sigAt,
          ". Document locked."
        ] }),
        est.clientSig !== "signed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: est.clientSig, alt: "Client signature", style: { maxWidth: 260, border: `1px solid ${S.line}`, borderRadius: 10 } })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub }, children: "Client signs on-screen at the kitchen table, or through the shared portal link." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", onClick: () => openDoc(`Estimate \u2014 ${job2.name}`, brand2, estimateDocHtml(job2, brand2), toast2), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Printer, { size: 15 }),
        " PDF"
      ] }),
      !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", onClick: () => {
          setEst({ status: "Sent" });
          toast2("Estimate emailed to client");
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 15 }),
          " Send"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { onClick: () => setSigOpen(true), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.PenLine, { size: 15 }),
          " Client signature"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SignaturePad,
      {
        open: sigOpen,
        onClose: () => setSigOpen(false),
        title: "Client acceptance \u2014 estimate",
        onApply: (dataUrl, at) => {
          setEst({ clientSig: dataUrl, sigAt: at, status: "Signed" });
          toast2("Estimate signed and locked");
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, { open: tplSheet, onClose: () => setTplSheet(false), title: "Estimate templates", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Save current lines as", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, flex: 1 },
            value: tplName,
            placeholder: "Full replacement \u2014 architectural",
            onChange: (e) => setTplName(e.target.value)
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: saveTemplate, disabled: !tplName.trim() || est.items.length === 0, children: "Save" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, fontWeight: 700, color: S.sub, margin: "14px 0 6px" }, children: "SAVED TEMPLATES" }),
      estimateTemplates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub }, children: "None yet \u2014 build an estimate you like and save it above." }),
      estimateTemplates.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderTop: `1px solid ${S.line}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14.5, fontWeight: 700 }, children: t.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub }, children: [
            t.items.length,
            " line",
            t.items.length === 1 ? "" : "s"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, onClick: () => applyTemplate(t), disabled: locked, children: "Add" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => setEstimateTemplates(estimateTemplates.filter((x) => x.id !== t.id)),
              style: { border: "none", background: "none", cursor: "pointer" },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 15, color: "#B42318" })
            }
          )
        ] })
      ] }, t.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, { open: docSheet, onClose: () => setDocSheet(false), title: "Document layout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ref: coverRef, type: "file", accept: "image/*", onChange: onCover, style: { display: "none" } }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, fontWeight: 700, color: S.sub, marginBottom: 6 }, children: "SECTION ORDER" }),
      doc.sections.map((sec, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderTop: idx ? `1px solid ${S.line}` : "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, fontSize: 14, fontWeight: 600 }, children: SECTION_LABELS[sec] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, onClick: () => moveSection(idx, -1), disabled: idx === 0, children: "\u2191" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, onClick: () => moveSection(idx, 1), disabled: idx === doc.sections.length - 1, children: "\u2193" })
      ] }, sec)),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, fontWeight: 700, color: S.sub, margin: "16px 0 6px" }, children: "COVER PAGE" }),
      doc.coverImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: doc.coverImage, alt: "Cover", style: { width: "100%", borderRadius: 10, marginBottom: 8 } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 8 }, children: "No photo yet \u2014 the house photo works great here." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, onClick: () => coverRef.current && coverRef.current.click(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { size: 13 }),
          " ",
          doc.coverImage ? "Replace photo" : "Add photo"
        ] }),
        doc.coverImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", small: true, onClick: () => setDoc({ coverImage: null }), children: "Remove" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Special notes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "textarea",
          {
            style: { ...inputStyle, minHeight: 70, resize: "vertical", fontFamily: "inherit" },
            value: doc.notes,
            onChange: (e) => setDoc({ notes: e.target.value }),
            placeholder: "Color selections, access notes, exclusions\u2026"
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Terms & conditions", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "textarea",
          {
            style: { ...inputStyle, minHeight: 110, resize: "vertical", fontFamily: "inherit" },
            value: doc.terms,
            onChange: (e) => setDoc({ terms: e.target.value }),
            placeholder: "Payment terms, warranty, change orders\u2026"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, { open: previewOpen, onClose: () => setPreviewOpen(false), title: "Estimate preview", children: doc.sections.map((sec) => {
      if (sec === "cover") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: `1px solid ${S.line}`, borderRadius: 14, overflow: "hidden", marginBottom: 14 }, children: [
        doc.coverImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: doc.coverImage, alt: "", style: { width: "100%", display: "block" } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: 18, background: T.primary, color: "#fff" }, children: [
          brand2.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: brand2.logo, alt: "", style: { height: 40, objectFit: "contain", marginBottom: 10, display: "block" } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontWeight: 800, fontSize: 18, marginBottom: 6 }, children: brand2.company }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, opacity: 0.85 }, children: brand2.slogan }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 14, fontSize: 14 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontWeight: 700 }, children: [
              "Prepared for ",
              job2.name
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { opacity: 0.85 }, children: job2.address }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { opacity: 0.85, marginTop: 5 }, children: [
              est.number,
              " \xB7 ",
              est.date
            ] })
          ] })
        ] })
      ] }, sec);
      if (sec === "items") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: S.sub, marginBottom: 6 }, children: "SCOPE & PRICING" }),
        est.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13.5, padding: "6px 0", borderBottom: `1px solid ${S.soft}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { flex: 1 }, children: [
            it.desc,
            " \u2014 ",
            it.qty,
            " ",
            it.unit
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontWeight: 600 }, children: money(num(it.qty) * num(it.price)) })
        ] }, it.id)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, marginTop: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(total) })
        ] })
      ] }, sec);
      if (sec === "notes" && doc.notes) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: S.sub, marginBottom: 6 }, children: "SPECIAL NOTES" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, lineHeight: 1.6, whiteSpace: "pre-wrap" }, children: doc.notes })
      ] }, sec);
      if (sec === "terms" && doc.terms) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: S.sub, marginBottom: 6 }, children: "TERMS & CONDITIONS" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, lineHeight: 1.6, whiteSpace: "pre-wrap", color: S.sub }, children: doc.terms })
      ] }, sec);
      return null;
    }) })
  ] });
}
function TabContract({ job: job2, brand: brand2, setBrand = () => {
}, mut, toast: toast2 }) {
  const con = job2.contract;
  const [sigFor, setSigFor] = (0, import_react.useState)(null);
  const locked = con.status === "Signed";
  const setCon = (patch) => mut((j) => ({ ...j, contract: { ...j.contract, ...patch } }));
  const estTotal = estimateTotal(job2.estimate);
  const depositMode = con.depositMode || "pct";
  const deposit = depositMode === "fixed" ? num(con.depositFixed) : (con.price || 0) * (con.depositPct / 100);
  const SigLine = ({ label, value, onSign }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, minWidth: 220 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
      height: 74,
      border: `1.5px dashed ${S.line}`,
      borderRadius: 10,
      display: "grid",
      placeItems: "center",
      background: "#FAFBFC",
      overflow: "hidden"
    }, children: value ? value === "signed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontFamily: "cursive", fontSize: 22 }, children: label === "Client" ? job2.name : "Supreme Building Group" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: value, alt: `${label} signature`, style: { maxHeight: 66 } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, kind: "soft", onClick: onSign, disabled: locked, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.PenLine, { size: 13 }),
      " Sign here"
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub, marginTop: 6 }, children: [
      label,
      " ",
      con.signedAt && value ? `\xB7 ${con.signedAt}` : ""
    ] })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: locked ? "green" : "gray", children: con.status }), children: [
        "Service contract ",
        con.number && `\xB7 ${con.number}`
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.55 }, children: [
        "This agreement is between ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: brand2.company }),
        ", ",
        brand2.address,
        ", ",
        brand2.phone,
        ", and",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
          " ",
          job2.name
        ] }),
        ", ",
        job2.address,
        "."
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Scope of work" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          style: { ...inputStyle, minHeight: 100 },
          disabled: locked,
          value: con.scope,
          placeholder: "References the accepted estimate\u2026",
          onChange: (e) => setCon({ scope: e.target.value })
        }
      ),
      estTotal > 0 && !con.scope && !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: { ...linkBtn, marginTop: 8 }, onClick: () => setCon({ scope: `Per Estimate ${job2.estimate.number || ""} dated ${job2.estimate.date || ""}: ${job2.estimate.scope}` }), children: "Pull scope from estimate" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Price & payment schedule" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, fontSize: 14 }, children: "Contract price" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: S.sub }, children: "$" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, width: 130, textAlign: "right" },
            value: con.price,
            disabled: locked,
            inputMode: "decimal",
            onChange: (e) => setCon({ price: num(e.target.value) })
          }
        )
      ] }),
      !con.price && estTotal > 0 && !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { style: { ...linkBtn, marginBottom: 10 }, onClick: () => setCon({ price: estTotal }), children: [
        "Use estimate total \u2014 ",
        money(estTotal)
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, marginBottom: 7 }, children: "Deposit" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }, children: [["50%", 50], ["1/3", 33.33], ["25%", 25], ["10%", 10]].map(([label, pct]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            disabled: locked,
            onClick: () => setCon({ depositMode: "pct", depositPct: pct }),
            style: {
              border: `1.5px solid ${depositMode === "pct" && Math.abs(con.depositPct - pct) < 0.01 ? T.accent : S.line}`,
              background: depositMode === "pct" && Math.abs(con.depositPct - pct) < 0.01 ? T.accentSoft : "#fff",
              color: depositMode === "pct" && Math.abs(con.depositPct - pct) < 0.01 ? T.accent : S.ink,
              borderRadius: 999,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer"
            },
            children: label
          },
          label
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "select",
            {
              style: { ...selStyle, width: 130 },
              value: depositMode,
              disabled: locked,
              onChange: (e) => setCon({ depositMode: e.target.value }),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "pct", children: "Custom %" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "fixed", children: "Fixed $" })
              ]
            }
          ),
          depositMode === "fixed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: S.sub }, children: "$" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                style: { ...inputStyle, width: 110, textAlign: "right" },
                value: con.depositFixed ?? "",
                disabled: locked,
                inputMode: "decimal",
                onChange: (e) => setCon({ depositFixed: num(e.target.value) })
              }
            )
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                style: { ...inputStyle, width: 84, textAlign: "right" },
                value: con.depositPct,
                disabled: locked,
                inputMode: "decimal",
                onChange: (e) => setCon({ depositPct: num(e.target.value) })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: S.sub, fontSize: 13 }, children: "%" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: depositMode === "fixed" ? "Due at signing (fixed)" : `Due at signing (${con.depositPct}%)`, v: money(deposit) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Due on substantial completion", v: money((con.price || 0) - deposit), strong: true })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Terms" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          style: { ...inputStyle, minHeight: 130, resize: "vertical", fontFamily: "inherit", fontSize: 13, lineHeight: 1.6 },
          value: con.terms,
          disabled: locked,
          onChange: (e) => setCon({ terms: e.target.value })
        }
      ),
      !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, onClick: () => {
          setBrand({ ...brand2, contractTerms: con.terms });
          toast2("Saved as your default terms for new contracts");
        }, children: "Save as company default" }),
        brand2.contractTerms && brand2.contractTerms !== con.terms && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, onClick: () => setCon({ terms: brand2.contractTerms }), children: "Load company default" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Signatures" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 14, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SigLine, { label: "Client", value: con.clientSig, onSign: () => setSigFor("client") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SigLine, { label: `${brand2.company} representative`, value: con.contractorSig, onSign: () => setSigFor("contractor") })
      ] }),
      con.clientSig && con.contractorSig && !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "green", style: { marginTop: 14, width: "100%" }, onClick: () => {
        setCon({ status: "Signed", signedAt: nowStamp() });
        toast2("Contract executed and locked");
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { size: 16 }),
        " Execute contract"
      ] }),
      locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: "#177245", marginTop: 12, fontWeight: 600 }, children: [
        "Executed ",
        con.signedAt,
        ". Changes require a written change order."
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", onClick: () => openDoc(`Contract \u2014 ${job2.name}`, brand2, contractDocHtml(job2, brand2), toast2), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Printer, { size: 15 }),
        " PDF"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", onClick: () => toast2("Contract emailed to client"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 15 }),
        " Email to client"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SignaturePad,
      {
        open: !!sigFor,
        onClose: () => setSigFor(null),
        title: sigFor === "client" ? "Client signature" : "Company signature",
        onApply: (dataUrl, at) => {
          setCon(sigFor === "client" ? { clientSig: dataUrl } : { contractorSig: dataUrl });
          toast2("Signature captured");
        }
      }
    )
  ] });
}
function TabReport({ job: job2, brand: brand2, juris }) {
  const c = job2.checklist;
  if (!c.complete) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Inspection report" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { size: 18, color: "#92600A", style: { flexShrink: 0, marginTop: 2 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink }, children: "The report unlocks when the roofing inspection checklist is complete. Checklist answers auto-fill the report so nothing gets written twice." })
      ] })
    ] });
  }
  const findings = [];
  if (c.granuleLoss === "Heavy" || c.granuleLoss === "Critical")
    findings.push({ p: "HIGH", t: "Granule loss", d: `${c.granuleLoss} granule loss across field shingles \u2014 mat exposure accelerates failure.` });
  if (c.windDamage === "Yes") findings.push({ p: "HIGH", t: "Wind damage", d: "Creased and/or displaced tabs consistent with wind events." });
  if (c.hailImpact === "Yes") findings.push({ p: "HIGH", t: "Hail impact", d: "Impact bruising documented in the photo set; storm-related damage indicated." });
  if (c.flashingFail === "Yes") findings.push({ p: "MODERATE", t: "Flashing failures", d: "Failed or improperly lapped flashings at walls / chimney / penetrations." });
  if (c.pipeBoots === "Yes") findings.push({ p: "MODERATE", t: "Pipe boots", d: "Cracked neoprene pipe boots \u2014 an active leak path." });
  if (c.ventCond === "Poor" || c.ventCond === "Critical")
    findings.push({ p: "MODERATE", t: "Ventilation", d: `Ventilation condition rated ${c.ventCond}; system is unbalanced or insufficient.` });
  if (c.atticDecking === "Active Rot / Mold" || c.lightCheck === "Yes")
    findings.push({ p: "HIGH", t: "Decking (attic)", d: "Attic inspection shows compromised decking (staining, rot, or daylight)." });
  if (findings.length === 0) findings.push({ p: "MONITOR", t: "General wear", d: "No acute failures documented; monitor at annual intervals." });
  const pTone = { HIGH: "red", MODERATE: "amber", MONITOR: "blue" };
  const Section = ({ n, title, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, fontWeight: 800, letterSpacing: 1, color: T.accent, marginBottom: 4 }, children: [
      "SECTION ",
      n
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 16, fontWeight: 800, marginBottom: 10 }, children: title }),
    children
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { background: T.primary, border: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { color: "#fff" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, letterSpacing: 1.5, opacity: 0.75, fontWeight: 700 }, children: "ROOF INSPECTION REPORT" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 20, fontWeight: 800, margin: "6px 0 2px" }, children: job2.name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, opacity: 0.85 }, children: job2.address }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, opacity: 0.7, marginTop: 10 }, children: [
        brand2.company,
        " \xB7 ",
        brand2.phone
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { n: 1, title: "Overview & property facts", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Structure", v: c.structure }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Roof covering", v: c.roofType }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Approximate age", v: `${c.roofAge} years` }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Layers", v: c.layers }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Predominant pitch", v: c.pitch }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Method", v: c.method || "Visual, non-invasive" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { n: 2, title: "Summary of findings", children: findings.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${S.line}` }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: pTone[f.p], children: f.p }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700 }, children: f.t }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 2 }, children: f.d })
      ] })
    ] }, i)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { n: 3, title: "Decking & structure", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Decking type", v: c.deckingType || "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Condition (surface)", v: c.deckingCond || "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Condition (attic view)", v: c.atticDecking || "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Daylight through decking", v: c.lightCheck || "\u2014" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { n: 4, title: "Ventilation", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Systems present", v: c.ventTypes.join(", ") || "None documented" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Soffit intake", v: c.soffitIntake || "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Condition", v: c.ventCond || "\u2014" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { n: 5, title: "Photo documentation", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }, children: job2.photos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: `1px solid ${S.line}`, borderRadius: 10, overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 74, background: "#EEF1F4", display: "grid", placeItems: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Image, { size: 22, color: "#9CA3AF" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "7px 9px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 600 }, children: p.label }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: S.sub }, children: p.at })
      ] })
    ] }, p.id)) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { n: 6, title: "Recommendations", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.6 }, children: [
      c.overall === "Critical" || c.overall === "Poor" ? "Based on the documented condition, full replacement is the recommended course. Repair would address individual symptoms without restoring the system, and the documented conditions above will continue to progress." : "The roof is serviceable. Address the moderate findings above and re-inspect in 12 months.",
      job2.claimType === "Insurance" && " Storm-related findings support an insurance claim; this report and the photo set serve as claim documentation."
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { n: 7, title: "Limitations", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.6 }, children: [
      "This report reflects conditions visible and accessible on the inspection date using the method stated in Section 1. Concealed conditions (under-covering decking condition, hidden flashing detail) can only be verified at tear-off. ",
      c.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { color: S.ink }, children: "Inspector notes:" }),
        " ",
        c.notes
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", onClick: () => openDoc(`Work order \u2014 ${job2.name}`, brand2, workOrderDocHtml(job2, brand2, crew), toast), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Printer, { size: 15 }),
        " Print / PDF"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 15 }),
        " Email to client"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Share2, { size: 15 }),
        " Share link"
      ] })
    ] })
  ] });
}
var SHOT_LIST = [
  "Ground shots \u2014 all elevations",
  "Roof overview from ladder",
  "Shingle layers at the edge",
  "Granule loss close-up",
  "Hail impact w/ chalk circle",
  "Wind-creased tabs",
  "Flashing at walls / chimney",
  "Pipe boots",
  "Gutters \u2014 granules",
  "Attic \u2014 decking underside"
];
function TabMessages({ job: job2, mut, toast: toast2, brand: brand2, templates, crews, integrations, currentUser, users }) {
  const [compose, setCompose] = (0, import_react.useState)(null);
  const [to, setTo] = (0, import_react.useState)("Customer");
  const [subject, setSubject] = (0, import_react.useState)("");
  const [body, setBody] = (0, import_react.useState)("");
  const crew2 = crews.find((c) => c.id === job2.crewId) || null;
  const ctx = templateContext(job2, brand2, crew2, users);
  const thread = job2.messages || [];
  const consentOk = (channel, audience) => {
    if (audience === "Crew") return true;
    return channel === "sms" ? job2.consent.sms.granted : job2.consent.email.granted;
  };
  const recipient = (audience) => {
    if (audience === "Crew") return crew2 ? compose === "sms" ? crew2.phone : crew2.email : "";
    return compose === "sms" ? job2.phone : job2.email;
  };
  const openCompose = (kind) => {
    setCompose(kind);
    setTo("Customer");
    setSubject("");
    setBody("");
  };
  const applyTemplate = (t) => {
    setSubject(mergeTemplate(t.subject || "", ctx));
    setBody(mergeTemplate(t.body, ctx));
    setTo(t.audience);
  };
  const send = () => {
    const audience = to;
    if (!consentOk(compose, audience)) {
      toast2("No consent on file \u2014 cannot send");
      return;
    }
    const addr = recipient(audience);
    if (!addr) {
      toast2(audience === "Crew" ? "Assign a crew first" : "No contact on file");
      return;
    }
    const myGmail = (integrations.gmailByUser || {})[currentUser.id] || { connected: false };
    const live = compose === "sms" ? integrations.sms.connected : myGmail.connected;
    mut((j) => ({
      ...j,
      messages: [...j.messages || [], {
        id: uid("msg"),
        kind: compose,
        audience,
        to: addr,
        subject: compose === "email" ? subject : "",
        body,
        at: nowStamp(),
        by: currentUser.name,
        status: live ? "Sent" : "Queued \u2014 no provider connected"
      }]
    }));
    setCompose(null);
    toast2(live ? "Message sent" : "Saved to thread \u2014 connect a provider to deliver");
  };
  const available = templates.filter((t) => t.kind === compose);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Send a message" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: () => openCompose("email"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { size: 15 }),
          " Email"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: () => openCompose("sms"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageCircle, { size: 15 }),
          " Text"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: job2.consent.email.granted ? "green" : "red", children: [
          "Email ",
          job2.consent.email.granted ? "consent" : "no consent"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: job2.consent.sms.granted ? "green" : "red", children: [
          "SMS ",
          job2.consent.sms.granted ? "consent" : "no consent"
        ] }),
        !((integrations.gmailByUser || {})[currentUser.id] || {}).connected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "Your Gmail isn't connected" }),
        !integrations.sms.connected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "SMS not connected" })
      ] }),
      (!job2.consent.email.granted || !job2.consent.sms.granted) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 10, lineHeight: 1.5 }, children: "Sending is blocked on any channel without consent on file. Consent is captured at intake and can be updated from the customer's contact record." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: thread.length }), children: "Thread" }),
      thread.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "Nothing sent on this job yet." }),
      thread.slice().reverse().map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "12px 0", borderTop: `1px solid ${S.line}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 7, alignItems: "center", minWidth: 0 }, children: [
            m.kind === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { size: 14, color: T.accent }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageCircle, { size: 14, color: T.accent }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, fontWeight: 700, color: S.ink }, children: m.audience }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12, color: S.sub, overflow: "hidden", textOverflow: "ellipsis" }, children: m.to })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: m.status === "Sent" ? "green" : "amber", children: m.status === "Sent" ? "Sent" : "Queued" })
        ] }),
        m.subject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, fontWeight: 700, marginTop: 6 }, children: m.subject }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 4, whiteSpace: "pre-wrap", lineHeight: 1.5 }, children: m.body }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, color: S.sub, marginTop: 6 }, children: [
          m.at,
          " \xB7 ",
          m.by
        ] })
      ] }, m.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: !!compose,
        onClose: () => setCompose(null),
        wide: true,
        title: compose === "email" ? "New email" : "New text",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: () => setCompose(null), children: "Cancel" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { flex: 2 }, disabled: !body.trim() || !consentOk(compose, to), onClick: send, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 14 }),
            " ",
            consentOk(compose, to) ? "Send" : "No consent"
          ] })
        ] }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "To", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: to, onChange: (e) => setTo(e.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Customer" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Crew" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: -8, marginBottom: 14 }, children: recipient(to) || (to === "Crew" ? "No crew assigned to this job yet." : "No contact on file.") }),
          !consentOk(compose, to) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Callout, { label: "Blocked", tone: "red", children: [
            "This customer has not given ",
            compose === "sms" ? "text" : "email",
            " consent. Sending anyway is a legal exposure, so the send button stays disabled."
          ] }),
          available.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: T.primary, margin: "8px 0" }, children: "START FROM A TEMPLATE" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }, children: available.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", onClick: () => applyTemplate(t), style: {
              border: `1px solid ${S.line}`,
              background: "#fff",
              borderRadius: 999,
              padding: "7px 12px",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              color: S.ink
            }, children: [
              t.name,
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: S.sub }, children: [
                "\xB7 ",
                t.audience
              ] })
            ] }, t.id)) })
          ] }),
          compose === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Subject", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: subject, onChange: (e) => setSubject(e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Message", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "textarea",
            {
              style: { ...inputStyle, minHeight: 180, resize: "vertical", fontFamily: "inherit" },
              value: body,
              onChange: (e) => setBody(e.target.value)
            }
          ) }),
          compose === "sms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub }, children: [
            body.length,
            " characters \xB7 ",
            Math.max(1, Math.ceil(body.length / 160)),
            " segment(s)"
          ] })
        ]
      }
    )
  ] });
}
function TabPhotos({ job: job2, mut, toast: toast2 }) {
  const [custom, setCustom] = (0, import_react.useState)("");
  const [geo, setGeo] = (0, import_react.useState)(null);
  const [locating, setLocating] = (0, import_react.useState)(false);
  const [geoErr, setGeoErr] = (0, import_react.useState)("");
  const fileRef = (0, import_react.useRef)(null);
  const pendingLabel = (0, import_react.useRef)("");
  const getFix = async () => {
    setLocating(true);
    setGeoErr("");
    const r = await captureLocation();
    if (r.ok) {
      const addr = await geoReverse(r.lat, r.lng);
      const fix = { ...r, address: addr ? addr.formatted : null };
      setGeo(fix);
      setLocating(false);
      toast2(addr ? `Located \u2014 ${addr.street || addr.formatted}` : `Location locked \u2014 \xB1${r.accuracy}m`);
      return fix;
    }
    setLocating(false);
    setGeoErr(r.reason);
    return r;
  };
  const addPhoto = async (label, file) => {
    let fix = geo;
    if (!fix) {
      const r = await getFix();
      fix = r.ok ? r : null;
    }
    const iso = (/* @__PURE__ */ new Date()).toISOString();
    const url = file ? URL.createObjectURL(file) : null;
    mut((j) => ({
      ...j,
      photos: [...j.photos, {
        id: uid("p"),
        label,
        at: fmtStamp(iso),
        iso,
        url,
        fileName: file ? file.name : null,
        lat: fix ? fix.lat : null,
        lng: fix ? fix.lng : null,
        accuracy: fix ? fix.accuracy : null,
        address: fix && fix.address ? fix.address : null
      }]
    }));
    toast2(fix ? "Photo stamped with time + location" : "Photo saved \u2014 no location fix");
  };
  const pickFile = (label) => {
    pendingLabel.current = label;
    fileRef.current && fileRef.current.click();
  };
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) addPhoto(pendingLabel.current || "Untitled shot", file);
    e.target.value = "";
  };
  const shotsDone = new Set(job2.photos.map((p) => p.label));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "input",
      {
        ref: fileRef,
        type: "file",
        accept: "image/*",
        capture: "environment",
        onChange: onFile,
        style: { display: "none" }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: geo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "green", children: [
        "\xB1",
        geo.accuracy,
        "m"
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "No fix" }), children: "Location" }),
      geo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        geo.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Address", v: geo.address }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Coordinates", v: fmtCoord(geo.lat, geo.lng) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Fix taken", v: fmtStamp(geo.at) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "iframe",
          {
            title: "Job site map",
            src: staticMapEmbed(geo.lat, geo.lng),
            style: { width: "100%", height: 180, border: `1px solid ${S.line}`, borderRadius: 12, marginTop: 10 }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { flex: 1 }, onClick: getFix, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.RefreshCw, { size: 13 }),
            " Re-fix"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: mapLinkForCoords(geo.lat, geo.lng), target: "_blank", rel: "noreferrer", style: { flex: 1, textDecoration: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { width: "100%" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 13 }),
            " Open in Maps"
          ] }) })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.5 }, children: "Lock a GPS fix before shooting and every photo carries the same verified coordinates and timestamp \u2014 that's what makes the album hold up in a claim file." }),
        geoErr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Callout, { label: "Location unavailable", tone: "red", children: [
          geoErr,
          " Photos will still save with a timestamp."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { width: "100%", marginTop: 12 }, onClick: getFix, disabled: locating, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 15 }),
          " ",
          locating ? "Locating\u2026" : "Lock GPS location"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "gray", children: [
        shotsDone.size,
        "/",
        SHOT_LIST.length
      ] }), children: "Quick inspection capture" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 12 }, children: "Tap a shot to open the camera. Photos are time and location stamped and land on this client's profile." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: SHOT_LIST.map((s) => {
        const done = shotsDone.has(s);
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => pickFile(s), style: {
          display: "flex",
          alignItems: "center",
          gap: 6,
          border: `1px solid ${done ? "#177245" : S.line}`,
          background: done ? "#E8F6EE" : "#fff",
          color: done ? "#177245" : S.ink,
          borderRadius: 999,
          padding: "8px 13px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer"
        }, children: [
          done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Check, { size: 13 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Camera, { size: 13 }),
          " ",
          s
        ] }, s);
      }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, flex: 1 },
            placeholder: "Custom shot label",
            value: custom,
            onChange: (e) => setCustom(e.target.value)
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, disabled: !custom.trim(), onClick: () => {
          pickFile(custom.trim());
          setCustom("");
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Camera, { size: 14 }),
          " Capture"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: job2.photos.length }), children: "Photo album" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }, children: job2.photos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: `1px solid ${S.line}`, borderRadius: 12, overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 96, background: "#EEF1F4", display: "grid", placeItems: "center", overflow: "hidden" }, children: p.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: p.url, alt: p.label, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Image, { size: 24, color: "#9CA3AF" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "8px 10px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 700 }, children: p.label }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: S.sub, marginTop: 2 }, children: p.at }),
          p.lat != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", { href: mapLinkForCoords(p.lat, p.lng), target: "_blank", rel: "noreferrer", style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginTop: 5,
            fontSize: 10.5,
            fontWeight: 700,
            color: T.accent,
            textDecoration: "none"
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 10 }),
            " ",
            fmtCoord(p.lat, p.lng)
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10.5, color: "#92600A", marginTop: 5 }, children: "No location" })
        ] })
      ] }, p.id)) }),
      job2.photos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "No photos yet." }),
      job2.photos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { marginTop: 12 }, onClick: () => {
        downloadCsv(`photo-log-${job2.name.replace(/\s+/g, "-").toLowerCase()}.csv`, [
          ["Label", "Timestamp", "Address", "Latitude", "Longitude", "Accuracy (m)", "File"],
          ...job2.photos.map((p) => [p.label, p.at, p.address ?? "", p.lat ?? "", p.lng ?? "", p.accuracy ?? "", p.fileName ?? ""])
        ]);
        toast2("Photo log exported");
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Download, { size: 13 }),
        " Export photo log (CSV)"
      ] })
    ] })
  ] });
}
function FinBucket({ title, lines, total, onEdit, onDelete, onAdd }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontWeight: 800 }, children: money(total) }), children: title }),
    lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: { ...inputStyle, flex: 1, padding: "9px 11px" },
          value: l.label,
          onChange: (e) => onEdit(l.id, "label", e.target.value)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: S.sub, fontSize: 13 }, children: "$" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: { ...inputStyle, width: 100, textAlign: "right", padding: "9px 11px" },
          value: l.amt,
          inputMode: "decimal",
          onChange: (e) => onEdit(l.id, "amt", e.target.value)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => onDelete(l.id), style: { border: "none", background: "none", cursor: "pointer" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 15, color: "#B42318" }) })
    ] }, l.id)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "soft", small: true, onClick: onAdd, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 13 }),
      " Add"
    ] })
  ] });
}
function TabFinancials({ job: job2, mut, toast: toast2, isAdmin, currentUser, brand: brand2 = DEFAULT_BRAND }) {
  const cap = computeCapOut(job2);
  const fin = job2.fin;
  const structure = fin.structure || "grossProfit";
  const st = STRUCTURES.find((x) => x.id === structure);
  const comparison = (0, import_react.useMemo)(() => compareStructures(job2), [job2]);
  const setStructureField = (k, v) => mut((j) => ({ ...j, fin: { ...j.fin, [k]: v } }));
  const addLine = (bucket) => mut((j) => ({
    ...j,
    fin: { ...j.fin, [bucket]: [...j.fin[bucket], { id: uid("x"), label: "New line", amt: 0, by: j.assignee }] }
  }));
  const setLine = (bucket, id, k, v) => mut((j) => ({
    ...j,
    fin: { ...j.fin, [bucket]: j.fin[bucket].map((l) => l.id === id ? { ...l, [k]: k === "amt" ? num(v) : v } : l) }
  }));
  const delLine = (bucket, id) => mut((j) => ({
    ...j,
    fin: { ...j.fin, [bucket]: j.fin[bucket].filter((l) => l.id !== id) }
  }));
  const printCapOut = () => {
    const row = (k, v, bold) => `<div class="tot${bold ? " grand" : ""}"><span>${esc(k)}</span><span>${esc(v)}</span></div>`;
    const sec = (title, lines, total) => `<h2>${esc(title)}</h2><table><thead><tr><th>Item</th><th>Paid to / by</th><th class="r">Amount</th></tr></thead><tbody>` + lines.map((l) => `<tr><td>${esc(l.label)}</td><td>${esc(l.by || "")}</td><td class="r">${money(num(l.amt))}</td></tr>`).join("") + `</tbody></table>` + row(`${title} total`, money(total));
    let html = `<div style="display:flex;justify-content:space-between;gap:20px">
        <div><h2 style="margin-top:0">Job</h2><div><b>${esc(job2.name)}</b></div>
          <div class="muted">${esc(job2.address)}</div></div>
        <div style="text-align:right"><div class="muted">Rep: ${esc(job2.assignee || "")}</div>
          <div class="muted">${esc((/* @__PURE__ */ new Date()).toLocaleDateString())}</div></div>
      </div>`;
    html += `<h2>Contract</h2>` + row("Contract price", money(cap.contract), true);
    html += sec("Material costs", fin.materials, cap.materials);
    html += sec("Labor costs", fin.labor, cap.labor);
    html += sec("Other costs", fin.other, cap.other);
    html += `<h2>Profit</h2>` + row("Total job costs", money(cap.cogs)) + row("Gross profit", money(cap.gross)) + row("Gross margin", cap.grossMargin.toFixed(1) + "%");
    html += `<h2>Commission \u2014 ${esc(st.label)}</h2>` + row(cap.baseLabel, money(cap.base)) + row("Rep commission", money(cap.commission), true) + row("Net to company", money(cap.netCompany));
    if (fin.reimbursements.length) {
      html += sec("Reimbursements", fin.reimbursements, cap.reimbTotal);
    }
    html += `<div class="tot grand" style="margin-top:14px"><span>Total payout to rep</span><span>${money(cap.payout)}</span></div>`;
    html += `<div class="sig">
      <div><div class="sigline"></div><div class="siglbl">Rep signature / date</div></div>
      <div><div class="sigline"></div><div class="siglbl">Approved by / date</div></div>
    </div>`;
    openDoc(`Cap out \u2014 ${job2.name}`, brand2, html, toast2);
  };
  const exportCsv = () => {
    downloadCsv(`capout-${job2.name.replace(/\s+/g, "-").toLowerCase()}.csv`, [
      ["Job", job2.name],
      ["Address", job2.address],
      [],
      ["Contract price", cap.contract.toFixed(2)],
      [],
      ["MATERIAL COSTS"],
      ...fin.materials.map((l) => [l.label, l.amt.toFixed(2), l.by]),
      ["Materials total", cap.materials.toFixed(2)],
      [],
      ["LABOR COSTS"],
      ...fin.labor.map((l) => [l.label, l.amt.toFixed(2), l.by]),
      ["Labor total", cap.labor.toFixed(2)],
      [],
      ["OTHER COSTS"],
      ...fin.other.map((l) => [l.label, l.amt.toFixed(2), l.by]),
      ["Other total", cap.other.toFixed(2)],
      [],
      ["Total COGS", cap.cogs.toFixed(2)],
      ["Gross profit", cap.gross.toFixed(2)],
      ["Gross margin %", cap.grossMargin.toFixed(2)],
      ["Commission structure", st.label],
      [`${cap.baseLabel}`, cap.base.toFixed(2)],
      ["Rep commission", cap.commission.toFixed(2)],
      ["Net to company", cap.netCompany.toFixed(2)],
      [],
      ["REIMBURSEMENTS"],
      ...fin.reimbursements.map((r) => [r.label, r.amt.toFixed(2), r.status]),
      ["Reimbursement total", cap.reimbTotal.toFixed(2)],
      ["TOTAL REP PAYOUT", cap.payout.toFixed(2)]
    ]);
    toast2("Cap-out CSV downloaded");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { background: T.primary, border: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { color: "#fff" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", opacity: 0.85, fontSize: 13 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Contract price" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(cap.contract) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", opacity: 0.85, fontSize: 13, marginTop: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total COGS" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          "\u2212",
          money(cap.cogs)
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 10,
        paddingTop: 10,
        borderTop: "1px solid rgba(255,255,255,.25)",
        fontSize: 17,
        fontWeight: 800
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gross profit" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(cap.gross) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, opacity: 0.7, marginTop: 3 }, children: [
        pct1(cap.grossMargin),
        " margin"
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinBucket, { title: "Material costs", lines: fin.materials, total: cap.materials, onEdit: (id, k, v) => setLine("materials", id, k, v), onDelete: (id) => delLine("materials", id), onAdd: () => addLine("materials") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinBucket, { title: "Labor costs", lines: fin.labor, total: cap.labor, onEdit: (id, k, v) => setLine("labor", id, k, v), onDelete: (id) => delLine("labor", id), onAdd: () => addLine("labor") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinBucket, { title: "Other costs (permits, dump, misc.)", lines: fin.other, total: cap.other, onEdit: (id, k, v) => setLine("other", id, k, v), onDelete: (id) => delLine("other", id), onAdd: () => addLine("other") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Commission structure" }),
        !isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "gray", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 10, style: { marginRight: 4, verticalAlign: -1 } }),
          "Set by admin"
        ] })
      ] }),
      isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "select",
          {
            value: structure,
            onChange: (e) => setStructureField("structure", e.target.value),
            style: { ...selStyle, fontWeight: 700 },
            children: STRUCTURES.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: x.id, children: x.label }, x.id))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 8, lineHeight: 1.5 }, children: st.blurb }),
        st.usesRate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginTop: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              style: { ...inputStyle, width: 90, textAlign: "right" },
              value: fin.commissionRate,
              inputMode: "decimal",
              onChange: (e) => setStructureField("commissionRate", num(e.target.value))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 14, color: S.sub }, children: [
            "% of ",
            st.label.toLowerCase()
          ] })
        ] }),
        st.usesOverhead && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginTop: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              style: { ...inputStyle, width: 90, textAlign: "right" },
              value: fin.overheadPct ?? 10,
              inputMode: "decimal",
              onChange: (e) => setStructureField("overheadPct", num(e.target.value))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 14, color: S.sub }, children: "% of contract allocated to company overhead" })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14, color: S.ink }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontWeight: 800 }, children: st.label }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 4 }, children: "How commission is calculated is managed by the office. Your numbers below are live for this job." })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Payout" }),
      structure === "netProfit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Overhead allocation", v: `${money(cap.overheadAlloc)} (${cap.overheadPct}% of contract)` }),
      structure === "tenFiftyFifty" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Company overhead (10%)", v: money(cap.contract * 0.1) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: cap.baseLabel, v: money(cap.base) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Rep commission", v: money(cap.commission), strong: true }),
      isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Net to company", v: money(cap.netCompany), strong: true }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { height: 10, borderRadius: 99, overflow: "hidden", display: "flex", margin: "10px 0" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: `${cap.repPctGross}%`, background: T.accent } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: `${cap.coPctGross}%`, background: T.primary } })
      ] }),
      isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Rep \u2014 % of gross / % of job", v: `${pct1(cap.repPctGross)} / ${pct1(cap.repPctJob)}` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Company \u2014 % of gross / % of job", v: `${pct1(cap.coPctGross)} / ${pct1(cap.coPctJob)}` })
      ] })
    ] }),
    isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Structure comparison" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: -6, marginBottom: 6 }, children: "Same job under each model. Admin-only." }),
      comparison.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: `${c.label}${c.id === structure ? " (current)" : ""}`, v: money(c.commission), strong: c.id === structure }, c.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Rep reimbursements (out-of-pocket)" }),
      fin.reimbursements.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, flex: 1, padding: "9px 11px" },
            value: r.label,
            onChange: (e) => mut((j) => ({ ...j, fin: { ...j.fin, reimbursements: j.fin.reimbursements.map((x) => x.id === r.id ? { ...x, label: e.target.value } : x) } }))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, width: 86, textAlign: "right", padding: "9px 11px" },
            value: r.amt,
            inputMode: "decimal",
            onChange: (e) => mut((j) => ({ ...j, fin: { ...j.fin, reimbursements: j.fin.reimbursements.map((x) => x.id === r.id ? { ...x, amt: num(e.target.value) } : x) } }))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => mut((j) => ({ ...j, fin: { ...j.fin, reimbursements: j.fin.reimbursements.map((x) => x.id === r.id ? { ...x, status: x.status === "Reimbursed" ? "Needs paid" : "Reimbursed" } : x) } })),
            style: { border: "none", background: "none", cursor: "pointer", padding: 0 },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: r.status === "Reimbursed" ? "green" : "red", children: r.status })
          }
        )
      ] }, r.id)),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "soft", small: true, onClick: () => mut((j) => ({ ...j, fin: { ...j.fin, reimbursements: [...j.fin.reimbursements, { id: uid("r"), label: "Out-of-pocket item", amt: 0, status: "Needs paid" }] } })), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 13 }),
        " Add reimbursement"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Reimbursement total", v: money(cap.reimbTotal) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Total rep payout (commission + reimbursements)", v: money(cap.payout), strong: true })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: exportCsv, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Download, { size: 15 }),
        " Export cap-out CSV"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: printCapOut, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Printer, { size: 15 }),
        " Cap-out PDF"
      ] })
    ] })
  ] });
}
function TabPayments({ job: job2, mut, toast: toast2 }) {
  const [editPay, setEditPay] = (0, import_react.useState)(null);
  const [ef2, setEf2] = (0, import_react.useState)(null);
  const checkRef = (0, import_react.useRef)(null);
  const openPayEdit = (p2) => {
    setEditPay(p2.id);
    setEf2({ ...p2 });
  };
  const savePayEdit = () => {
    mut((j) => ({ ...j, payments: j.payments.map((x) => x.id === editPay ? { ...x, ...ef2, amt: num(ef2.amt) } : x) }));
    setEditPay(null);
    toast2("Payment updated");
  };
  const deletePay = () => {
    mut((j) => ({ ...j, payments: j.payments.filter((x) => x.id !== editPay) }));
    setEditPay(null);
    toast2("Payment removed");
  };
  const attachCheck = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setEf2((prev) => ({ ...prev, checkImage: String(r.result) }));
    r.readAsDataURL(file);
    e.target.value = "";
  };
  const pay = paymentsSummary(job2);
  const [form, setForm] = (0, import_react.useState)({ type: "Received", label: "", amt: "" });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Payment summary" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Contract price", v: money(pay.contract) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Received to date", v: money(pay.received) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Paid out (draws / expenses)", v: money(pay.paidOut) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Balance due from client", v: money(pay.balance), strong: true })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Log a payment" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8, marginBottom: 10 }, children: ["Received", "Paid out"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setForm({ ...form, type: t }), style: {
        flex: 1,
        border: `1.5px solid ${form.type === t ? T.accent : S.line}`,
        background: form.type === t ? T.accentSoft : "#fff",
        color: form.type === t ? T.accent : S.ink,
        borderRadius: 10,
        padding: "10px 0",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer"
      }, children: t }, t)) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Description", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: inputStyle,
          value: form.label,
          placeholder: "Deposit \u2014 check #, crew draw\u2026",
          onChange: (e) => setForm({ ...form, label: e.target.value })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Amount ($)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: inputStyle,
          value: form.amt,
          inputMode: "decimal",
          onChange: (e) => setForm({ ...form, amt: e.target.value })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { width: "100%" }, disabled: !form.label.trim() || !num(form.amt), onClick: () => {
        mut((j) => ({ ...j, payments: [...j.payments, { id: uid("pay"), type: form.type, label: form.label, amt: num(form.amt), date: nowStamp() }] }));
        setForm({ type: "Received", label: "", amt: "" });
        toast2("Payment logged");
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 15 }),
        " Log payment"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "History" }),
      job2.payments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "No payments logged." }),
      job2.payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${S.line}` }, onClick: () => openPayEdit(p), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 600 }, children: p.label }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: p.date })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontWeight: 800, color: p.type === "Received" ? "#177245" : "#B42318" }, children: [
          p.type === "Received" ? "+" : "\u2212",
          money(p.amt)
        ] })
      ] }, p.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ref: checkRef, type: "file", accept: "image/*", capture: "environment", onChange: attachCheck, style: { display: "none" } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Sheet,
      {
        open: !!editPay,
        onClose: () => setEditPay(null),
        title: "Edit payment",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", onClick: deletePay, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 14 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { flex: 1 }, onClick: savePayEdit, children: "Save changes" })
        ] }),
        children: ef2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginBottom: 12, lineHeight: 1.5 }, children: "Corrections are fine \u2014 every edit is written to the activity feed with the old values, so the record stays honest." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Amount", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                style: inputStyle,
                value: ef2.amt,
                inputMode: "decimal",
                onChange: (e) => setEf2({ ...ef2, amt: e.target.value })
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Date", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                style: inputStyle,
                type: "date",
                value: ef2.date || "",
                onChange: (e) => setEf2({ ...ef2, date: e.target.value })
              }
            ) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Method", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: selStyle, value: ef2.method || "Check", onChange: (e) => setEf2({ ...ef2, method: e.target.value }), children: ["Check", "Cash", "Card", "ACH / transfer", "Insurance draft", "Financing"].map((mm) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: mm }, mm)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Reference / check number", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: ef2.ref || "", onChange: (e) => setEf2({ ...ef2, ref: e.target.value }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, { label: "Check photo", hint: "Photograph the check for your records before depositing.", children: [
            ef2.checkImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: ef2.checkImage, alt: "Check", style: { width: "100%", borderRadius: 10, marginBottom: 8, border: `1px solid ${S.line}` } }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, onClick: () => checkRef.current && checkRef.current.click(), children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Camera, { size: 13 }),
                " ",
                ef2.checkImage ? "Retake" : "Take photo"
              ] }),
              ef2.checkImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", small: true, onClick: () => setEf2({ ...ef2, checkImage: null }), children: "Remove" })
            ] })
          ] })
        ] })
      }
    )
  ] });
}
function TabInvoice({ job: job2, brand: brand2, mut, toast: toast2 }) {
  const pay = paymentsSummary(job2);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Invoice number", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: inputStyle,
            value: job2.invoiceNo || "",
            placeholder: `INV-${(/* @__PURE__ */ new Date()).getFullYear()}-001`,
            onChange: (e) => mut((j) => ({ ...j, invoiceNo: e.target.value }))
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Due date", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: inputStyle,
            type: "date",
            value: job2.invoiceDue || "",
            onChange: (e) => mut((j) => ({ ...j, invoiceDue: e.target.value }))
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "PO number (optional)", hint: "Shown on the invoice \u2014 some insurers and commercial clients require one.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: inputStyle,
          value: job2.invoicePo || "",
          placeholder: "PO-2026-0148",
          onChange: (e) => mut((j) => ({ ...j, invoicePo: e.target.value }))
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 18, fontWeight: 800 }, children: brand2.company }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub, marginTop: 3, whiteSpace: "pre-line" }, children: [
            brand2.address,
            "\n",
            brand2.phone
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "right" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, letterSpacing: 2, color: S.sub, fontWeight: 800 }, children: "INVOICE" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, marginTop: 4 }, children: job2.invoiceNo || (job2.contract.number ? job2.contract.number.replace("CON", "INV") : "INV-DRAFT") })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderTop: `1px solid ${S.line}`, paddingTop: 12, marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, fontWeight: 700 }, children: "BILL TO" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700, marginTop: 3 }, children: job2.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub }, children: job2.address })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Contract amount", v: money(pay.contract) }),
      job2.payments.filter((p) => p.type === "Received").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: `Less: ${p.label} (${p.date})`, v: `\u2212${money(p.amt)}` }, p.id)),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", paddingTop: 12, marginTop: 8, borderTop: `2px solid ${S.ink}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 15, fontWeight: 800 }, children: "Balance due" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 18, fontWeight: 800 }, children: money(pay.balance) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 12 }, children: "Balances unpaid 30 days after completion accrue 1.5% monthly. Thank you for your business." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: () => openDoc(`Invoice \u2014 ${job2.name}`, brand2, invoiceDocHtml(job2, brand2), toast2), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Printer, { size: 15 }),
        " PDF"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { flex: 1 }, onClick: () => toast2("Invoice emailed to client"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 15 }),
        " Send invoice"
      ] })
    ] })
  ] });
}
function TabWorkOrder({ job: job2, mut, toast: toast2, brand: brand2, crews, templates, currentUser, users }) {
  const [picking, setPicking] = (0, import_react.useState)(false);
  const [sending, setSending] = (0, import_react.useState)(false);
  const [notes, setNotes] = (0, import_react.useState)(job2.workOrder ? job2.workOrder.notes : "");
  const [subject, setSubject] = (0, import_react.useState)("");
  const [body, setBody] = (0, import_react.useState)("");
  const crew2 = crews.find((c) => c.id === job2.crewId) || null;
  const m = job2.measurements;
  const mats = generateRoofingMaterials(m);
  const wo = job2.workOrder || { number: "", sentAt: null, status: "Draft", notes: "" };
  const assign = (c) => {
    mut((j) => ({ ...j, crewId: c.id }));
    setPicking(false);
    toast2(`${c.name} assigned`);
  };
  const openSend = () => {
    const ctx = templateContext(job2, brand2, crew2, users);
    const t = templates.find((x) => x.kind === "email" && x.audience === "Crew");
    setSubject(t ? mergeTemplate(t.subject, ctx) : `${brand2.company} \u2014 work order for ${job2.address}`);
    setBody(t ? mergeTemplate(t.body, ctx) : "");
    setSending(true);
  };
  const send = () => {
    const stamp = nowStamp();
    mut((j) => ({
      ...j,
      workOrder: { ...wo, number: wo.number || `WO-${String(Math.floor(Math.random() * 900) + 100)}`, sentAt: stamp, status: "Sent", notes },
      messages: [...j.messages || [], {
        id: uid("msg"),
        kind: "email",
        audience: "Crew",
        to: crew2.email,
        subject,
        body,
        at: stamp,
        by: currentUser.name,
        status: "Queued \u2014 no provider connected"
      }]
    }));
    setSending(false);
    toast2("Work order sent to crew");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "PO number (optional)", hint: "Prints on the work order the crew receives.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: inputStyle,
          value: job2.workOrder && job2.workOrder.po || "",
          placeholder: "PO-2026-0148",
          onChange: (e) => mut((j) => ({ ...j, workOrder: { ...j.workOrder || {}, po: e.target.value } }))
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: wo.status === "Sent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "green", children: [
        "Sent ",
        wo.sentAt
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: "Draft" }), children: "Crew assignment" }),
      crew2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700, color: S.ink }, children: crew2.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 3 }, children: crew2.contact }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap", fontSize: 12.5, color: S.sub }, children: [
          crew2.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 5, alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Phone, { size: 12 }),
            " ",
            crew2.phone
          ] }),
          crew2.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 5, alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { size: 12 }),
            " ",
            crew2.email
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, style: { flex: 1 }, onClick: () => setPicking(true), children: "Change crew" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, style: { flex: 2 }, disabled: !crew2.email, onClick: openSend, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 13 }),
            " ",
            wo.status === "Sent" ? "Resend work order" : "Send work order"
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, lineHeight: 1.5 }, children: "No crew assigned. Pick one to dispatch this work order." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { width: "100%", marginTop: 12 }, onClick: () => setPicking(true), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.HardHat, { size: 15 }),
          " Select crew"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: "No pricing" }), children: [
        "Work order \u2014 ",
        wo.number || "unassigned"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginBottom: 10, lineHeight: 1.5 }, children: "Everything the crew needs and nothing they don't. Pricing never appears on this document." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Customer", v: job2.name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Address", v: job2.address }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Customer phone", v: job2.phone }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Scheduled", v: job2.schedDate || "Not scheduled" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Squares", v: m.squares || "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Pitch", v: m.pitch || "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Layers to remove", v: job2.checklist.layers || "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Decking", v: job2.checklist.deckingType || "\u2014" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: directionsLink(job2.address), target: "_blank", rel: "noreferrer", style: { textDecoration: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { width: "100%", marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 13 }),
        " Directions to site"
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Scope of work" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.ink, lineHeight: 1.6, whiteSpace: "pre-wrap" }, children: job2.estimate.scope || "No scope written yet \u2014 build the estimate first." })
    ] }),
    mats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Materials on site" }),
      mats.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, color: S.ink }, children: x.item }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 13, fontWeight: 700 }, children: [
          x.qty,
          " ",
          x.unit
        ] })
      ] }, i))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Notes for the crew" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          style: { ...inputStyle, minHeight: 110, resize: "vertical", fontFamily: "inherit" },
          placeholder: "Access notes, dog on site, where to stage the dumpster, anything the crew needs to know before they roll.",
          value: notes,
          onChange: (e) => setNotes(e.target.value)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Btn,
        {
          kind: "ghost",
          small: true,
          style: { marginTop: 10 },
          onClick: () => {
            mut((j) => ({ ...j, workOrder: { ...wo, notes } }));
            toast2("Notes saved");
          },
          children: "Save notes"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, { open: picking, onClose: () => setPicking(false), title: "Select crew", children: [
      crews.filter((c) => c.active).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => assign(c), style: {
        width: "100%",
        textAlign: "left",
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: "13px 4px",
        borderTop: i ? `1px solid ${S.line}` : "none"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700, color: S.ink }, children: c.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 3 }, children: [
          c.contact,
          " \xB7 ",
          c.phone
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, marginTop: 7, flexWrap: "wrap" }, children: c.trades.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: t }, t)) })
      ] }, c.id)),
      crews.filter((c) => c.active).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "No active crews. Add one under More \u2192 Crews." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: sending,
        onClose: () => setSending(false),
        wide: true,
        title: "Email work order",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: () => setSending(false), children: "Cancel" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { flex: 2 }, disabled: !body.trim(), onClick: send, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 14 }),
            " Send"
          ] })
        ] }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "To", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: crew2 ? crew2.email : "", readOnly: true }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Subject", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: subject, onChange: (e) => setSubject(e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Message", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "textarea",
            {
              style: { ...inputStyle, minHeight: 200, resize: "vertical", fontFamily: "inherit" },
              value: body,
              onChange: (e) => setBody(e.target.value)
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "What gets attached", children: "The work order above \u2014 scope, measurements, materials, site notes, and directions. No pricing." })
        ]
      }
    )
  ] });
}
function TaskRow({ t, today, onToggle }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "button",
    {
      onClick: onToggle,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "11px 0",
        border: "none",
        background: "none",
        cursor: "pointer",
        textAlign: "left",
        borderBottom: `1px solid ${S.line}`,
        touchAction: "manipulation"
      },
      children: [
        t.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { size: 20, color: "#177245" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Circle, { size: 20, color: "#C7CBD1" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
            fontSize: 15,
            color: t.done ? S.sub : S.ink,
            textDecoration: t.done ? "line-through" : "none",
            display: "block"
          }, children: t.label }),
          t.due && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: t.done ? "gray" : t.due < today ? "red" : "blue", children: [
            t.due < today && !t.done ? "Overdue \xB7 " : "Due ",
            t.due,
            t.time ? ` at ${t.time}` : ""
          ] })
        ] })
      ]
    }
  );
}
function TabTasks({ job: job2, mut }) {
  const [txt, setTxt] = (0, import_react.useState)("");
  const [due, setDue] = (0, import_react.useState)("");
  const [time, setTime] = (0, import_react.useState)("");
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const openTasks = job2.tasks.filter((t) => !t.done);
  const doneTasks = job2.tasks.filter((t) => t.done);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Project tasks" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, fontWeight: 700, color: S.sub, marginTop: 4 }, children: [
      "OPEN (",
      openTasks.length,
      ")"
    ] }),
    openTasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, padding: "10px 0" }, children: "Nothing open." }),
    openTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, { t, today, onToggle: () => mut((j) => ({ ...j, tasks: j.tasks.map((x) => x.id === t.id ? { ...x, done: !x.done } : x) })) }, t.id)),
    doneTasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, fontWeight: 700, color: S.sub, marginTop: 16 }, children: [
        "COMPLETED (",
        doneTasks.length,
        ")"
      ] }),
      doneTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, { t, today, onToggle: () => mut((j) => ({ ...j, tasks: j.tasks.map((x) => x.id === t.id ? { ...x, done: !x.done } : x) })) }, t.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: { ...inputStyle, flex: 1, minWidth: 160 },
          placeholder: "Add a task",
          value: txt,
          onChange: (e) => setTxt(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && txt.trim()) {
              mut((j) => ({ ...j, tasks: [...j.tasks, { id: uid("t"), label: txt.trim(), done: false, due: due || null, time: time || null }] }));
              setTxt("");
              setDue("");
              setTime("");
            }
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: { ...inputStyle, width: 138 }, type: "date", value: due, onChange: (e) => setDue(e.target.value) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: { ...inputStyle, width: 108 }, type: "time", value: time, onChange: (e) => setTime(e.target.value) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, disabled: !txt.trim(), onClick: () => {
        mut((j) => ({ ...j, tasks: [...j.tasks, { id: uid("t"), label: txt.trim(), done: false, due: due || null, time: time || null }] }));
        setTxt("");
        setDue("");
        setTime("");
      }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }) })
    ] })
  ] });
}
var FILE_CATS = ["Signed paperwork", "Insurance", "Permits", "Delivery tickets", "Receipts", "Measurements", "Photos", "Other"];
function TabFiles({ job: job2, mut, toast: toast2 }) {
  const [cat, setCat] = (0, import_react.useState)(FILE_CATS[0]);
  const [name, setName] = (0, import_react.useState)("");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Upload a file" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "File name", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: inputStyle,
          value: name,
          placeholder: "e.g. Signed contract.pdf",
          onChange: (e) => setName(e.target.value)
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Category", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: selStyle, value: cat, onChange: (e) => setCat(e.target.value), children: FILE_CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c)) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { width: "100%" }, disabled: !name.trim(), onClick: () => {
        mut((j) => ({ ...j, files: [...j.files, { id: uid("f"), name: name.trim(), cat, at: nowStamp(), by: j.assignee }] }));
        setName("");
        toast2("File attached to job");
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { size: 15 }),
        " Upload"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: job2.files.length }), children: "Job files" }),
      job2.files.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "No files yet." }),
      job2.files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${S.line}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FileText, { size: 18, color: T.accent, style: { flexShrink: 0 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 600 }, children: f.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub }, children: [
            f.cat,
            " \xB7 ",
            f.at,
            " \xB7 ",
            f.by
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => mut((j) => ({ ...j, files: j.files.filter((x) => x.id !== f.id) })),
            style: { border: "none", background: "none", cursor: "pointer" },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 15, color: "#B42318" })
          }
        )
      ] }, f.id))
    ] })
  ] });
}
function TabPortal({ job: job2, brand: brand2, mut, toast: toast2 }) {
  const [busy, setBusy] = (0, import_react.useState)(false);
  const portalUrl = (tok) => `${window.location.origin}/?portal=${tok}`;
  const snapshot = (tok) => ({
    token: tok,
    job_id: job2.id,
    data: {
      company: brand2.company,
      logo: brand2.logo || null,
      primary: brand2.primary,
      slogan: brand2.slogan,
      phone: brand2.phone,
      email: brand2.email,
      name: job2.name,
      address: job2.address,
      stageLabel: job2.stageLabel || "",
      portal: job2.portal,
      notes: (job2.notes || []).filter((n) => n.customerVisible).map((n) => ({ at: n.at, text: n.text })),
      photos: job2.portal.photos ? (job2.photos || []).filter((ph) => ph.shared).map((ph) => ({ url: ph.url || ph.dataUrl, label: ph.label || "" })) : [],
      estimate: job2.portal.estimate ? { number: job2.estimate.number, date: job2.estimate.date, total: estimateTotal(job2.estimate), items: job2.estimate.items } : null,
      contract: job2.portal.contract ? { number: job2.contract.number, price: job2.contract.price, status: job2.contract.status } : null,
      schedDate: job2.schedDate || null,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  });
  const publishPortal = async () => {
    const db = DB();
    const tok = job2.portalToken || uid("p") + Math.random().toString(36).slice(2, 10);
    if (!db) {
      mut((j) => ({ ...j, portalToken: tok }));
      toast2("Link created \u2014 it goes live once the app is connected to the database");
      return;
    }
    setBusy(true);
    try {
      const row = snapshot(tok);
      const { error } = await db.from("crm_portal").upsert({ ...row, revoked: false });
      if (error) throw error;
      mut((j) => ({ ...j, portalToken: tok }));
      const url = portalUrl(tok);
      if (navigator.clipboard) await navigator.clipboard.writeText(url);
      toast2("Portal link copied \u2014 send it to the customer");
    } catch (e) {
      toast2("Couldn't publish: " + (e && e.message ? e.message : "unknown error"));
    }
    setBusy(false);
  };
  const revokePortal = async () => {
    const db = DB();
    setBusy(true);
    try {
      if (db && job2.portalToken) await db.from("crm_portal").update({ revoked: true }).eq("token", job2.portalToken);
      mut((j) => ({ ...j, portalToken: null }));
      toast2("Link revoked \u2014 it no longer opens");
    } catch (e) {
      toast2("Couldn't revoke that link");
    }
    setBusy(false);
  };
  const rows = [
    ["estimate", "Estimate", job2.estimate.number || "No estimate yet"],
    ["contract", "Contract", job2.contract.number || "No contract yet"],
    ["photos", "Photo album", `${job2.photos.length} photos`],
    ["invoice", "Invoice & balance", ""]
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Updates from your team" }),
      (job2.notes || []).filter((n) => n.customerVisible).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub }, children: "Updates your team shares will appear here." }) : (job2.notes || []).filter((n) => n.customerVisible).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderTop: `1px solid ${S.line}`, padding: "10px 0" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11.5, color: S.sub }, children: n.at }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, lineHeight: 1.55, marginTop: 3, whiteSpace: "pre-wrap" }, children: n.text })
      ] }, n.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Client portal" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 14 }, children: "The client sees their project at a private link: current stage, shared documents, and shared photos \u2014 nothing else. Toggle what's visible." }),
      rows.map(([k, label, sub]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${S.line}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 600 }, children: label }),
          sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: sub })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => mut((j) => ({ ...j, portal: { ...j.portal, [k]: !j.portal[k] } })), style: {
          width: 46,
          height: 27,
          borderRadius: 99,
          border: "none",
          cursor: "pointer",
          background: job2.portal[k] ? T.accent : "#D6D9DE",
          position: "relative",
          transition: "background .15s"
        }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
          position: "absolute",
          top: 3,
          left: job2.portal[k] ? 22 : 3,
          width: 21,
          height: 21,
          borderRadius: 99,
          background: "#fff",
          transition: "left .15s"
        } }) })
      ] }, k)),
      job2.portalToken && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 14, background: S.soft, borderRadius: 10, padding: "10px 12px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11.5, color: S.sub, marginBottom: 3 }, children: "LIVE LINK" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, wordBreak: "break-all", color: T.accent }, children: portalUrl(job2.portalToken) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { flex: 1 }, disabled: busy, onClick: publishPortal, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Share2, { size: 15 }),
          " ",
          job2.portalToken ? "Update & copy link" : "Create portal link"
        ] }),
        job2.portalToken && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", disabled: busy, onClick: revokePortal, children: "Revoke" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 9, lineHeight: 1.5 }, children: "The link works without a login \u2014 send it by text or email. Revoking it stops it working immediately. Re-publish after changing what's shared so the client sees the update." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: "Client view" }), children: "Portal preview" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: `1px solid ${S.line}`, borderRadius: 14, overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { background: T.primary, padding: "16px 16px 14px", color: "#fff" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, opacity: 0.75 }, children: brand2.company }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 17, fontWeight: 800, marginTop: 3 }, children: "Your roofing project" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, opacity: 0.75, marginTop: 2 }, children: job2.address })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "Project status" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: "In progress" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 14, fontSize: 13, fontWeight: 700 }, children: "Shared with you" }),
          rows.filter(([k]) => job2.portal[k]).map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${S.line}` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FileText, { size: 15, color: T.accent }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 14 }, children: label })
          ] }, k)),
          rows.every(([k]) => !job2.portal[k]) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 8 }, children: "Nothing shared yet." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub, marginTop: 14 }, children: [
            "Questions? ",
            brand2.phone,
            " \xB7 ",
            brand2.email
          ] })
        ] })
      ] })
    ] })
  ] });
}
function ShingleFinder() {
  const [q, setQ] = (0, import_react.useState)("");
  const [mfr, setMfr] = (0, import_react.useState)("All");
  const [status, setStatus] = (0, import_react.useState)("All");
  const [type, setType] = (0, import_react.useState)("All");
  const makers = (0, import_react.useMemo)(() => ["All", ...Array.from(new Set(SHINGLE_DB.map((x) => x.mfr)))], []);
  const list = (0, import_react.useMemo)(() => SHINGLE_DB.filter((x) => {
    if (mfr !== "All" && x.mfr !== mfr) return false;
    if (status !== "All" && x.status !== status) return false;
    if (type !== "All" && x.type !== type) return false;
    if (q.trim()) {
      const hay = `${x.mfr} ${x.line} ${x.type} ${x.years} ${x.note} ${x.l} ${x.w} ${x.exp}`.toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  }), [q, mfr, status, type]);
  const dim = (n) => n ? String(n).replace(/\.0$/, "") + '"' : "\u2014";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Width tells you almost everything" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.5, marginBottom: 10 }, children: "Measure the shingle length on the roof before anything else, then confirm with the back-of-shingle marks." }),
      SHINGLE_RULES.map(([k, v], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, fontWeight: 800, color: S.ink }, children: k }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 3 }, children: v })
      ] }, i))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: list.length }), children: "Search" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, placeholder: "Manufacturer, line, size, year\u2026", value: q, onChange: (e) => setQ(e.target.value) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, { val: status, set: setStatus, opts: [{ v: "All", l: "All" }, { v: "disco", l: "Discontinued" }, { v: "current", l: "Current" }] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, { val: type, set: setType, opts: [{ v: "All", l: "All types" }, { v: "Laminate", l: "Laminate" }, { v: "3-tab", l: "3-tab" }, { v: "Designer", l: "Designer" }] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: { ...selStyle, marginTop: 10 }, value: mfr, onChange: (e) => setMfr(e.target.value), children: makers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: m }, m)) })
    ] }),
    list.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 15, style: { marginTop: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: S.ink }, children: x.line }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 2 }, children: [
            x.mfr,
            x.years ? ` \xB7 ${x.years}` : ""
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: x.status === "current" ? "green" : "red", children: x.status === "current" ? "Current" : "Discontinued" })
      ] }),
      x.l || x.w || x.exp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12.5, color: S.sub }, children: [
          "Length ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { color: S.ink }, children: dim(x.l) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12.5, color: S.sub }, children: [
          "Width ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { color: S.ink }, children: dim(x.w) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12.5, color: S.sub }, children: [
          "Exposure ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { color: S.ink }, children: dim(x.exp) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: x.type })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: x.type }) }),
      x.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 9 }, children: x.note })
    ] }, i)),
    list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { marginTop: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "No match. Try the length alone, or clear the filters." }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Back-of-shingle marks" }),
      MFR_IDENT.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "11px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: S.ink }, children: m.mfr }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 4 }, children: m.mark }),
        m.plants && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub, lineHeight: 1.5, marginTop: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Plant codes:" }),
          " ",
          m.plants
        ] })
      ] }, i))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Verify before it goes in writing", children: "Dimensions and dates here are a field reference compiled from manufacturer data and industry sources. Before attaching any of it to a supplement, confirm against the manufacturer's own current literature or their tech services line \u2014 their document is the evidence, this screen is the shortcut to finding it." })
  ] });
}
function LetterTemplates() {
  const [open, setOpen] = (0, import_react.useState)(null);
  const [copied, setCopied] = (0, import_react.useState)(null);
  const copy = async (t) => {
    try {
      await navigator.clipboard.writeText(t.body);
      setCopied(t.id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied("fail");
      setTimeout(() => setCopied(null), 1800);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }, children: "Put it in writing. Verbal approvals and denials disappear when a claim gets contested \u2014 written ones do not. Copy a template, fill the bracketed fields, send it from your work email so there's a timestamp." }),
    LETTER_TEMPLATES.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: i ? 12 : 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minWidth: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: S.ink }, children: t.title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 4 }, children: t.when })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { flex: 1 }, onClick: () => setOpen(open === t.id ? null : t.id), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Eye, { size: 13 }),
          " ",
          open === t.id ? "Hide" : "Read"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, style: { flex: 1 }, onClick: () => copy(t), children: copied === t.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Check, { size: 13 }),
          " Copied"
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Copy, { size: 13 }),
          " Copy"
        ] }) })
      ] }),
      open === t.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { style: {
        whiteSpace: "pre-wrap",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 12.5,
        lineHeight: 1.6,
        color: S.ink,
        background: "#FAFBFC",
        border: `1px solid ${S.line}`,
        borderRadius: 10,
        padding: 13,
        marginTop: 12,
        overflowX: "auto"
      }, children: t.body })
    ] }, t.id)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Before sending", children: "Replace every bracketed field \u2014 an unfilled placeholder in front of an adjuster costs credibility on the whole letter. Attach the photos, measurements, and manufacturer bulletin you reference. Keep a copy in the job's Files tab." })
  ] });
}
function InsuranceHub({ jobs, onBack, onOpenJob, toast: toast2 }) {
  const [tab, setTab] = (0, import_react.useState)("clients");
  const [zip, setZip] = (0, import_react.useState)("");
  const [tplState, setTplState] = (0, import_react.useState)("OH");
  const [openTpl, setOpenTpl] = (0, import_react.useState)(null);
  const [resourcePage, setResourcePage] = (0, import_react.useState)(null);
  const insJobs = jobs.filter((j) => j.claimType === "Insurance");
  const juris = jurisdictionForZip(zip.trim());
  const tabs = [["clients", "Clients"], ["supplements", "Supplements"], ["codes", "Code lookup"], ["resources", "Resources"]];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Insurance", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, marginTop: 14, overflowX: "auto" }, children: tabs.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setTab(id), style: {
      border: "none",
      borderRadius: 999,
      padding: "9px 16px",
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer",
      whiteSpace: "nowrap",
      background: tab === id ? T.primary : "#fff",
      color: tab === id ? "#fff" : S.ink
    }, children: label }, id)) }),
    tab === "clients" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 14 }, children: [
      insJobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pad: 16, style: { marginBottom: 10, cursor: "pointer" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { onClick: () => onOpenJob(j.id), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700 }, children: j.name }),
          j.value > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontWeight: 700 }, children: money(j.value) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 2 }, children: j.address }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: j.insurance?.carrier || "Carrier TBD" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: j.insurance?.claim ? "green" : "amber", children: j.insurance?.claim ? "Claim filed" : "Claim not filed" }),
          j.insurance?.coverage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: j.insurance.coverage }),
          j.insurance?.oLaw && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "slate", children: "O&L" })
        ] })
      ] }) }, j.id)),
      insJobs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, marginTop: 8 }, children: "No insurance jobs yet." })
    ] }),
    tab === "supplements" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 14, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 10 }, children: "One template library, three jurisdictions \u2014 pick the job's state and every template renders with the right code citation." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8 }, children: ["OH", "KY", "IL"].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setTplState(st), style: {
          flex: 1,
          border: `1.5px solid ${tplState === st ? T.accent : S.line}`,
          background: tplState === st ? T.accentSoft : "#fff",
          color: tplState === st ? T.accent : S.ink,
          borderRadius: 10,
          padding: "10px 0",
          fontWeight: 800,
          cursor: "pointer"
        }, children: st }, st)) }),
        tplState !== "OH" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 10, alignItems: "flex-start" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { size: 15, color: "#92600A", style: { flexShrink: 0, marginTop: 1 } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: "#92600A" }, children: tplState === "KY" ? "Kentucky cites are IRC-based \u2014 verify the current KRC edition before sending." : "Illinois has no statewide code \u2014 verify the municipality's adopted edition and amendments before sending." })
        ] })
      ] }),
      SUPPLEMENT_TEMPLATES.map((t) => {
        const prov = citeFor(tplState, t.topic);
        const isOpen = openTpl === t.id;
        const wording = t.wording.replaceAll("{CITE}", prov.cite);
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 16, style: { marginTop: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setOpenTpl(isOpen ? null : t.id), style: {
            width: "100%",
            border: "none",
            background: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: 0
          }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: t.category }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700, marginTop: 2 }, children: t.title }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 6 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: prov.verified ? "blue" : "amber", children: prov.cite }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronDown, { size: 17, style: { transform: isOpen ? "rotate(180deg)" : "none", flexShrink: 0 } })
          ] }) }),
          isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 12, borderTop: `1px solid ${S.line}`, paddingTop: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 800, color: T.primary, marginBottom: 5 }, children: "WHEN TO USE" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.ink, lineHeight: 1.55 }, children: t.scenario }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 800, color: T.primary, margin: "12px 0 5px" }, children: "CODE BASIS" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.ink, lineHeight: 1.55 }, children: prov.note }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 800, color: T.primary, margin: "12px 0 5px" }, children: "LINE ITEMS TO ADD" }),
            t.lineItems.map((li, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: S.ink, lineHeight: 1.55, marginBottom: 3 }, children: [
              "\u2022 ",
              li
            ] }, i)),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 800, color: T.primary, margin: "12px 0 5px" }, children: "DOCUMENTATION" }),
            t.docs.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: S.ink, lineHeight: 1.55, marginBottom: 3 }, children: [
              "\u2022 ",
              d
            ] }, i)),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 800, color: T.primary, margin: "12px 0 5px" }, children: "SUPPLEMENT WORDING" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
              fontSize: 13,
              color: S.ink,
              lineHeight: 1.6,
              background: "#FAFBFC",
              border: `1px solid ${S.line}`,
              borderRadius: 10,
              padding: 12
            }, children: wording }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, kind: "soft", style: { marginTop: 12 }, onClick: () => {
              if (navigator.clipboard) navigator.clipboard.writeText(wording);
              toast2("Wording copied \u2014 fill the [brackets]");
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Copy, { size: 13 }),
              " Copy wording"
            ] })
          ] })
        ] }, t.id);
      })
    ] }),
    tab === "codes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Jurisdiction lookup by zip" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 10 }, children: "Enter a job-site zip to pull the adopted code, permit requirements, and building department contact." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: inputStyle,
            placeholder: "Zip code \u2014 try 45240, 41179, 60014",
            value: zip,
            inputMode: "numeric",
            onChange: (e) => setZip(e.target.value)
          }
        )
      ] }),
      zip.trim().length === 5 && !juris && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { marginTop: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14, color: S.sub, lineHeight: 1.55 }, children: [
        zip,
        " is outside Supreme's OH / KY / IL markets, so there's no code guidance on file for it. Add the jurisdiction from the county or municipal source to bring it in."
      ] }) }),
      juris && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: juris.precision === "verified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "green", children: [
            "Verified ",
            juris.verifiedDetail?.date
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "State-level \u2014 verify locally" }), children: juris.city ? `${juris.city}, ${juris.state}` : `${juris.state} \u2014 zip ${juris.zip}` }),
          juris.county && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "County", v: juris.county }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Building code", v: juris.codeName }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Edition", v: juris.codeEdition }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Adoption", v: juris.adoption }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Permits", v: juris.permit }),
          juris.sources && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 8 }, children: juris.sources.map((sid) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceLink, { srcId: sid }, sid)) }),
          !juris.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Before field use", children: "Open the official source above, confirm the adopted edition and local amendments, and have the office mark this jurisdiction verified with a date and initials." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Building department" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Office", v: juris.inspector.office }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Phone", v: juris.inspector.phone }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Address", v: juris.inspector.address })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
            "Key roofing provisions \u2014 ",
            juris.state
          ] }),
          Object.entries(CODE_PROVISIONS[juris.state]).map(([topic, p]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "10px 0", borderBottom: `1px solid ${S.line}` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: p.verified ? "blue" : "amber", children: p.cite }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.ink, marginTop: 6, lineHeight: 1.5 }, children: p.note })
          ] }, topic))
        ] }),
        juris.state === "OH" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Full provision reference" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 8 }, children: "Tap a source chip to open the official text \u2014 includes the matching-insurance-regulation tie-in." }),
          PROVISION_TOPICS.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderTop: i ? `1px solid ${S.line}` : "none", padding: "12px 0" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: S.ink }, children: p.topic }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: p.srcOH === "RCO" ? "blue" : "amber", children: p.oh })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 5, lineHeight: 1.5 }, children: p.note }),
            p.conflict && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Check the section number", children: p.conflict }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceLink, { srcId: p.srcOH })
          ] }, i))
        ] })
      ] })
    ] }),
    tab === "resources" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 14 }, children: !resourcePage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: RESOURCE_SECTIONS.map((sec) => {
      const Icon = sec.icon;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setResourcePage(sec.id), style: {
        textAlign: "left",
        background: "#fff",
        border: `1px solid ${S.line}`,
        borderRadius: 14,
        padding: 16,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 8
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 36, height: 36, borderRadius: 10, background: T.accentSoft, display: "grid", placeItems: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18, color: T.accent }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: S.ink }, children: sec.title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, lineHeight: 1.45 }, children: sec.blurb }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 800, color: T.accent, display: "flex", alignItems: "center", gap: 4 }, children: [
          "Open ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { size: 14 })
        ] })
      ] }, sec.id);
    }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setResourcePage(null), style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        border: "none",
        background: "none",
        color: T.accent,
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        padding: "4px 0 12px"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronLeft, { size: 16 }),
        " Resources"
      ] }),
      resourcePage === "shingles" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShingleFinder, {}),
      resourcePage === "specs" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }, children: "Used to show that current product is not equivalent to what's on the roof. Pull the manufacturer's own bulletin from their tech services line and attach it to the supplement \u2014 your summary is not the evidence, theirs is." }),
        MFR_SPECS.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: i ? 14 : 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: m.mfr }), children: m.flagship }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Width", v: m.w }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Length", v: m.l }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Exposure", v: m.exp }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Wind warranty", v: m.wind }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Algae warranty", v: m.algae }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Limited warranty", v: m.warranty }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Class 4 (UL 2218)", v: m.class4 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Do not mix", children: m.dnm })
        ] }, i)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Vinyl siding \u2014 the matching reality" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 8 }, children: [
            "Major makers: ",
            SIDING_MATCHING.makers
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.55 }, children: "Even with a current SKU in a current color, a ten-year-old wall will not match new stock. Four reasons:" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: SIDING_MATCHING.points }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "The argument", tone: "green", children: SIDING_MATCHING.argument })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Technical services lines" }),
          KEY_CONTACTS.map(([name, phone, web], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, fontWeight: 700, color: S.ink }, children: name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 2 }, children: [phone, web].filter(Boolean).join("  \xB7  ") })
          ] }, i))
        ] })
      ] }),
      resourcePage === "letters" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterTemplates, {}),
      resourcePage === "law" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        LAW_ITEMS.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: i ? 14 : 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: S.ink }, children: it.title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 8 }, children: it.body }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceLink, { srcId: it.src })
        ] }, i)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Who to call" }),
          KEY_CONTACTS.slice(0, 2).map(([name, phone, web], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, fontWeight: 700, color: S.ink }, children: name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 2 }, children: [phone, web].filter(Boolean).join("  \xB7  ") })
          ] }, i))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Guidance, not legal advice", children: "Summaries for field use, current as compiled. Confirm the text at the linked official source before relying on any of it in a dispute, and route anything adversarial to counsel." })
      ] }),
      resourcePage === "policy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }, children: "Three coverages that turn a partial claim into a full one. Check the declarations page and endorsements before making any promises." }),
        POLICY_CARDS.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: i ? 14 : 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: S.ink }, children: c.title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 8 }, children: c.body }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: c.callout.label, children: c.callout.text })
        ] }, i))
      ] }),
      resourcePage === "docs" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }, children: "If it wasn't photographed and measured, it didn't happen. The adjuster reads the file, not your memory." }),
        DOC_GROUPS.map((g, gi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: gi ? 14 : 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: g.title }),
          g.items.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, padding: "7px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { size: 16, color: "#177245", style: { flexShrink: 0, marginTop: 2 } }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, lineHeight: 1.5, color: S.ink }, children: t })
          ] }, i))
        ] }, gi)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Photo templates by damage type" }),
          DOC_TEMPLATES.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: i ? 12 : 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: S.ink }, children: t.type }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: t.items })
          ] }, i))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Scope items to check on every carrier estimate" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 8 }, children: "Run this list against the loss summary before you sign off on scope." }),
          SUPPLEMENT_TRIGGERS.map(([item, cite], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13.5, color: S.ink, fontWeight: 600 }, children: item }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12, color: S.sub, textAlign: "right", flexShrink: 0 }, children: cite })
          ] }, i))
        ] })
      ] }),
      resourcePage === "tips" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }, children: "The most common adjuster shortcuts and the code cite that answers each. Plus patterns we see from specific carriers \u2014 not accusations, just field observations to prepare for." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: T.accent, marginBottom: 10 }, children: "CLAIM SCENARIOS" }),
        CLAIM_SCENARIOS.map((sc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: i ? 14 : 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15.5, fontWeight: 800, color: S.ink }, children: sc.q }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.55, marginTop: 6 }, children: sc.setup }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Answer", tone: "green", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: sc.answer }) })
        ] }, i)),
        MORE_SCENARIOS.map((sc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15.5, fontWeight: 800, color: S.ink }, children: sc.q }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.55, marginTop: 6 }, children: sc.setup }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Answer", tone: "green", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: sc.answer }) })
        ] }, `m${i}`)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: T.accent, margin: "20px 0 10px" }, children: "WHEN THE ADJUSTER SAYS FINAL" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, marginBottom: 10 }, children: "Escalate in order. Each step creates a record the next one relies on." }),
          ESCALATION_LADDER.map(([t, d], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 12, padding: "10px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
              width: 24,
              height: 24,
              borderRadius: 999,
              background: T.accentSoft,
              color: T.accent,
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              fontWeight: 800,
              flexShrink: 0
            }, children: i + 1 }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: S.ink }, children: t }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 3 }, children: d })
            ] })
          ] }, i))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: T.accent, margin: "20px 0 10px" }, children: "CARRIER PATTERNS" }),
        CARRIER_PATTERNS.map((cp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: i ? 14 : 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15.5, fontWeight: 800, color: S.ink }, children: cp.title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.55, marginTop: 6 }, children: [
            "Pattern: ",
            cp.pattern
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Answer", tone: "green", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: cp.answer }) })
        ] }, i))
      ] }),
      resourcePage === "dodont" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { borderTop: "3px solid #177245" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: "#177245", marginBottom: 6 }, children: "DO" }),
          INSURANCE_DO.map(([t, d], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: S.ink }, children: t }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, lineHeight: 1.5, marginTop: 3 }, children: d })
          ] }, i))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14, borderTop: "3px solid #B42318" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: "#B42318", marginBottom: 6 }, children: "DON'T" }),
          INSURANCE_DONT.map(([t, d], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: S.ink }, children: t }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, lineHeight: 1.5, marginTop: 3 }, children: d })
          ] }, i))
        ] })
      ] }),
      resourcePage === "truck" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }, children: "One-card summary for the field. Prints on a single page. Take it in the truck." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 16, fontWeight: 800, color: S.ink, marginBottom: 8 }, children: "Supreme one-page field card" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: S.ink, marginTop: 6 }, children: "The three levers for full replacement:" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: CHEAT_SHEET.levers.map(([a, b]) => `${a} \u2014 ${b}`) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: S.ink, marginTop: 14 }, children: "Code-required scope adjusters try to strip out:" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: CHEAT_SHEET.scope.map(([a, b]) => `${a} \u2014 ${b}`) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 14 }, children: CHEAT_SHEET.ol }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 12 }, children: CHEAT_SHEET.docs }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "The line you don't cross", tone: "red", children: CHEAT_SHEET.line.replace("The line you don't cross: ", "") })
        ] })
      ] })
    ] }) })
  ] });
}
function Seg({ opts, val, set }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: opts.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => set(o.v), style: {
    border: `1.5px solid ${val === o.v ? T.accent : S.line}`,
    background: val === o.v ? T.accentSoft : "#fff",
    color: val === o.v ? T.accent : S.ink,
    borderRadius: 999,
    padding: "7px 13px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer"
  }, children: o.l }, o.v)) });
}
function Toggle({ on, onClick }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick, style: {
    width: 46,
    height: 27,
    borderRadius: 99,
    border: "none",
    cursor: "pointer",
    background: on ? T.accent : "#D6D9DE",
    position: "relative",
    flexShrink: 0
  }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { position: "absolute", top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: 99, background: "#fff", transition: "left .15s" } }) });
}
function ReviewSettings({ settings, setSettings, jobs, onBack, brand: brand2, setBrandFromReviews, mut, toast: toast2 }) {
  const [rating, setRating] = (0, import_react.useState)({});
  const [fbOpen, setFbOpen] = (0, import_react.useState)(null);
  const [fbText, setFbText] = (0, import_react.useState)("");
  const completed = jobs.filter((j) => j.stageId === "s10");
  const setReview = (j, patch) => mut(j.id, (x) => ({ ...x, review: { ...x.review, ...patch } }));
  const saveFeedback = (j) => {
    setReview(j, { rating: rating[j.id], feedback: fbText.trim(), feedbackAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) });
    setFbOpen(null);
    setFbText("");
    toast2("Feedback saved to the job \u2014 follow up before they post anywhere");
  };
  const sent = jobs.filter((j) => j.review.sent);
  const posted = jobs.filter((j) => j.review.posted);
  const set = (k) => (v) => setSettings({ ...settings, [k]: v });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Review automation", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { marginTop: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700 }, children: "Automatic review requests" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 3 }, children: "When a job moves to Job completed, send the Google review link." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, { on: settings.enabled, onClick: () => set("enabled")(!settings.enabled) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "blue", children: [
        completed.length,
        " completed"
      ] }), children: "Review requests" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Your Google review link", hint: "Where 5-star customers get sent. Every company's is different \u2014 paste yours here or in Company branding; they're the same setting.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          style: inputStyle,
          value: brand2.googleReviewLink,
          onChange: (e) => setBrandFromReviews && setBrandFromReviews({ ...brand2, googleReviewLink: e.target.value })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 6, lineHeight: 1.5 }, children: `Every job in "Job completed." Toggle what's been sent and what's posted. Log the customer's rating when they answer the "how did we do?" message \u2014 anything under 5 opens the internal feedback form so you can make it right first.` }),
      completed.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.sub, marginTop: 8 }, children: "No completed jobs yet." }),
      completed.map((j) => {
        const hasConsent = j.consent.sms.granted || j.consent.email.granted;
        const r = rating[j.id] || j.review.rating || 0;
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderTop: `1px solid ${S.line}`, padding: "12px 0" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minWidth: 0 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14.5, fontWeight: 700 }, children: j.name }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 2 }, children: j.address }),
              !hasConsent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "amber", children: "No consent \u2014 can't send" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end", flexShrink: 0 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", gap: 7, alignItems: "center", fontSize: 12.5, color: S.sub }, children: [
                "Sent",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    checked: !!j.review.sent,
                    disabled: !hasConsent,
                    onChange: (e) => setReview(j, { sent: e.target.checked, sentAt: e.target.checked ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : null }),
                    style: { width: 17, height: 17, accentColor: T.accent }
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", gap: 7, alignItems: "center", fontSize: 12.5, color: S.sub }, children: [
                "Posted",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    checked: !!j.review.posted,
                    onChange: (e) => setReview(j, { posted: e.target.checked }),
                    style: { width: 17, height: 17, accentColor: T.accent }
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 4, marginTop: 8, alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12.5, color: S.sub, marginRight: 4 }, children: "Rating:" }),
            [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => {
              setRating({ ...rating, [j.id]: n });
              if (n === 5) {
                setReview(j, { rating: 5 });
                toast2("5 stars \u2014 send them the Google link");
                setFbOpen(null);
              } else {
                setFbOpen(j.id);
                setFbText(j.review.feedback || "");
              }
            }, style: { border: "none", background: "none", cursor: "pointer", padding: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Star, { size: 19, color: n <= r ? "#D3860A" : "#D6D9DE", fill: n <= r ? "#D3860A" : "none" }) }, n)),
            r === 5 && brand2.googleReviewLink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "a",
              {
                href: brand2.googleReviewLink,
                target: "_blank",
                rel: "noreferrer",
                style: { fontSize: 12.5, color: T.accent, fontWeight: 700, marginLeft: 6 },
                children: "Google link \u2192"
              }
            )
          ] }),
          j.review.feedback && fbOpen !== j.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 8, background: "#FDF6EC", border: "1px solid #F0DFC5", borderRadius: 10, padding: "9px 12px", fontSize: 12.5, color: "#92600A" }, children: [
            "Internal feedback (",
            j.review.feedbackAt,
            "): ",
            j.review.feedback
          ] }),
          fbOpen === j.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginBottom: 6 }, children: "Under 5 stars \u2014 capture what went wrong. This stays internal so the team can fix it and follow up." }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "textarea",
              {
                style: { ...inputStyle, minHeight: 70, resize: "vertical", fontFamily: "inherit" },
                value: fbText,
                onChange: (e) => setFbText(e.target.value),
                placeholder: "What happened, and who's following up\u2026"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, onClick: () => saveFeedback(j), disabled: !fbText.trim(), children: "Save feedback" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { small: true, kind: "ghost", onClick: () => setFbOpen(null), children: "Cancel" })
            ] })
          ] })
        ] }, j.id);
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 12, background: "#FDF6EC", border: "1px solid #F0DFC5", borderRadius: 10, padding: "10px 13px", fontSize: 12.5, color: "#92600A", lineHeight: 1.55 }, children: `Two honest limits. Reviews can't auto-post to Google \u2014 Google has no API for posting reviews, so a 5-star customer still has to tap the link and write it themselves. And asking only happy customers for Google reviews while diverting unhappy ones is "review gating," which Google's policy prohibits and can get reviews filtered. The safe version is what this does: ask everyone how it went, resolve problems privately first, and make the Google link available to all.` })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Rules" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, fontSize: 14 }, children: "Delay after completion" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, width: 70, textAlign: "right" },
            value: settings.delayHours,
            inputMode: "numeric",
            onChange: (e) => set("delayHours")(num(e.target.value))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: S.sub, fontSize: 13 }, children: "hours" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, fontSize: 14 }, children: "One follow-up if no click, after" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, width: 70, textAlign: "right" },
            value: settings.followUpDays,
            inputMode: "numeric",
            onChange: (e) => set("followUpDays")(num(e.target.value))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: S.sub, fontSize: 13 }, children: "days" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Send window (quiet hours respected)", v: "9:00 AM \u2013 8:00 PM local" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Consent", v: "SMS requires SMS consent; email requires email consent. No consent, no send." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Opt-out", v: "STOP in any text halts all future SMS to that client." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Message template" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          style: { ...inputStyle, minHeight: 110 },
          value: settings.template,
          onChange: (e) => set("template")(e.target.value)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub, marginTop: 8 }, children: [
        "Variables: ",
        "{first_name}",
        ", ",
        "{company}",
        ", ",
        "{review_link}",
        ". Review link: ",
        brand2.googleReviewLink
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Tracking" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Requests sent", v: String(sent.length) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Links clicked", v: String(jobs.filter((j) => j.review.clicked).length) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Reviews posted", v: String(posted.length), strong: true }),
      posted.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center", padding: "9px 0", borderTop: `1px solid ${S.line}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Star, { size: 15, color: "#D97706", fill: "#D97706" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 14, fontWeight: 600 }, children: j.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 12, color: S.sub, marginLeft: "auto" }, children: j.assignee })
      ] }, j.id))
    ] })
  ] });
}
function ActivityFeed({ activity, currentUser, onOpenJob, onBack }) {
  const isMgr = currentUser.role === "admin" || currentUser.role === "manager";
  const [kind, setKind] = (0, import_react.useState)("All");
  const mine = isMgr ? activity : activity.filter((a) => a.by === currentUser.name);
  const KINDS = ["All", "lead", "stage", "task", "note", "message", "appointment"];
  const list = mine.filter((a) => kind === "All" || a.kind === kind);
  const initials = (n) => n.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Activity feed", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, margin: "10px 0 12px" }, children: isMgr ? "Everything anyone has done, newest first." : "Your activity, newest first. Admins and managers see the whole team's." }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }, children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setKind(k), style: {
      border: `1.5px solid ${kind === k ? T.accent : S.line}`,
      background: kind === k ? T.accentSoft : "#fff",
      color: kind === k ? T.accent : S.ink,
      borderRadius: 999,
      padding: "6px 12px",
      fontSize: 12.5,
      fontWeight: 600,
      cursor: "pointer",
      textTransform: "capitalize"
    }, children: k }, k)) }),
    list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, lineHeight: 1.55 }, children: "Nothing yet. Stage moves, new leads, tasks, notes, and queued messages all land here as they happen." }) }),
    list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pad: 13, style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 11, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
        width: 36,
        height: 36,
        borderRadius: 99,
        background: T.accentSoft,
        color: T.accent,
        display: "grid",
        placeItems: "center",
        fontSize: 12.5,
        fontWeight: 800,
        flexShrink: 0
      }, children: initials(a.by) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minWidth: 0, flex: 1 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13.5, lineHeight: 1.5 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: a.by }),
          " ",
          a.text
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 4 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11.5, color: S.sub }, children: a.at }),
          a.jobId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => onOpenJob(a.jobId), style: { ...linkBtn, fontSize: 12 }, children: [
            a.jobName || "Open job",
            " \u2192"
          ] })
        ] })
      ] })
    ] }) }, a.id))
  ] });
}
function TeamChat({ msgs, setMsgs, users, jobs, currentUser, onOpenJob, onBack }) {
  const [txt, setTxt] = (0, import_react.useState)("");
  const [mentionOpen, setMentionOpen] = (0, import_react.useState)(false);
  const [tagOpen, setTagOpen] = (0, import_react.useState)(false);
  const [tagged, setTagged] = (0, import_react.useState)(null);
  const inputRef = (0, import_react.useRef)(null);
  const send = () => {
    const t = txt.trim();
    if (!t) return;
    const mentions = users.filter((u) => t.includes(`@${u.name}`)).map((u) => u.name);
    setMsgs([...msgs, {
      id: uid("cm"),
      by: currentUser.name,
      at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " "),
      text: t,
      mentions,
      jobId: tagged
    }]);
    setTxt("");
    setTagged(null);
  };
  const insert = (frag) => {
    setTxt((prev) => {
      const at = prev.lastIndexOf("@");
      if (at >= 0 && !prev.slice(at + 1).includes(" ")) return prev.slice(0, at) + frag + " ";
      return (prev ? prev.replace(/\s?$/, " ") : "") + frag + " ";
    });
    if (inputRef.current) inputRef.current.focus();
  };
  const renderText = (t) => t.split(/(@[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+)/g).map((part, i2) => part.startsWith("@") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { color: T.accent }, children: part }, i2) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i2));
  const jobOf = (id) => jobs.find((j) => j.id === id);
  const initials = (n) => n.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 190px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Team chat", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, margin: "10px 0 12px", lineHeight: 1.5 }, children: "One channel for the whole company. @ someone when a customer calls in for them; tag the job so the thread is one tap away. Messages sync across everyone's devices once the app is wired to the database." }),
    msgs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "No messages yet \u2014 say something." }) }),
    msgs.map((m) => {
      const j = m.jobId ? jobOf(m.jobId) : null;
      const me = m.by === currentUser.name;
      const mentioned = m.mentions.includes(currentUser.name);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, marginTop: 10, flexDirection: me ? "row-reverse" : "row" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
          width: 34,
          height: 34,
          borderRadius: 99,
          background: me ? T.primary : T.accentSoft,
          color: me ? "#fff" : T.accent,
          display: "grid",
          placeItems: "center",
          fontSize: 12,
          fontWeight: 800,
          flexShrink: 0
        }, children: initials(m.by) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
          maxWidth: "78%",
          background: mentioned ? "#FDF6EC" : "#fff",
          border: `1px solid ${mentioned ? "#F0DFC5" : S.line}`,
          borderRadius: 14,
          padding: "10px 13px"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, color: S.sub, marginBottom: 3 }, children: [
            m.by,
            " \xB7 ",
            m.at
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, lineHeight: 1.5 }, children: renderText(m.text) }),
          j && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => onOpenJob(j.id), style: {
            marginTop: 7,
            border: `1px solid ${S.line}`,
            background: S.bg,
            borderRadius: 9,
            padding: "6px 10px",
            fontSize: 12.5,
            cursor: "pointer",
            display: "flex",
            gap: 6,
            alignItems: "center"
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Home, { size: 12, color: T.accent }),
            " ",
            j.name,
            " \u2014 ",
            j.address
          ] })
        ] })
      ] }, m.id);
    }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 86,
      background: "#fff",
      borderTop: `1px solid ${S.line}`,
      padding: "10px 16px"
    }, children: [
      tagged && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginBottom: 7 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "blue", children: [
        "Tagged: ",
        (jobOf(tagged) || {}).name,
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setTagged(null), style: { border: "none", background: "none", cursor: "pointer", color: "inherit", fontWeight: 800 }, children: "\xD7" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "flex-end" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, onClick: () => {
          setMentionOpen(true);
        }, children: "@" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, onClick: () => {
          setTagOpen(true);
        }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Home, { size: 13 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "textarea",
          {
            ref: inputRef,
            style: { ...inputStyle, flex: 1, minHeight: 42, maxHeight: 110, resize: "none", fontFamily: "inherit" },
            value: txt,
            placeholder: "Message the team\u2026",
            onChange: (e) => {
              const v = e.target.value;
              setTxt(v);
              const tail = v.slice(v.lastIndexOf("@") + 1);
              setMentionOpen(v.includes("@") && !tail.includes(" ") && v.lastIndexOf("@") >= v.length - 20);
            },
            onKeyDown: (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: send, disabled: !txt.trim(), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { size: 15 }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, { open: mentionOpen, onClose: () => setMentionOpen(false), title: "Mention someone", children: users.filter((u) => u.active !== false && u.name !== currentUser.name).map((u, i2) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => {
      insert(`@${u.name}`);
      setMentionOpen(false);
    }, style: {
      width: "100%",
      textAlign: "left",
      border: "none",
      background: "none",
      cursor: "pointer",
      padding: "12px 4px",
      borderTop: i2 ? `1px solid ${S.line}` : "none",
      fontSize: 14.5,
      fontWeight: 600
    }, children: [
      "@",
      u.name,
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12, color: S.sub, fontWeight: 400 }, children: [
        "\xB7 ",
        u.title
      ] })
    ] }, u.id)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, { open: tagOpen, onClose: () => setTagOpen(false), title: "Tag a job", children: jobs.filter((j) => !DEAD_STAGES.includes(j.stageId)).map((j, i2) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => {
      setTagged(j.id);
      setTagOpen(false);
    }, style: {
      width: "100%",
      textAlign: "left",
      border: "none",
      background: "none",
      cursor: "pointer",
      padding: "12px 4px",
      borderTop: i2 ? `1px solid ${S.line}` : "none"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14.5, fontWeight: 700 }, children: j.name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub }, children: j.address })
    ] }, j.id)) })
  ] });
}
function VendorManager({ vendors, setVendors, currentUser, onBack, toast: toast2 }) {
  const canEdit = currentUser.role === "admin" || currentUser.role === "manager";
  const blank = { name: "", contact: "", phone: "", email: "", account: "", notes: "", active: true };
  const [editing, setEditing] = (0, import_react.useState)(null);
  const [f, setF] = (0, import_react.useState)(blank);
  const open = (v) => {
    setEditing(v || "new");
    setF(v ? { ...v } : blank);
  };
  const save = () => {
    if (editing === "new") setVendors([...vendors, { ...f, id: uid("v") }]);
    else setVendors(vendors.map((v) => v.id === editing.id ? { ...v, ...f } : v));
    setEditing(null);
    toast2("Vendor saved");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SubHeader,
      {
        title: "Vendors & suppliers",
        onBack,
        right: canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, onClick: () => open(null), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }),
          " Add vendor"
        ] })
      }
    ),
    vendors.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 15, style: { marginTop: 10, opacity: v.active ? 1 : 0.6 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700 }, children: v.name }),
          v.contact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 2 }, children: v.contact })
        ] }),
        !v.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: "Inactive" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 14, marginTop: 9, flexWrap: "wrap", fontSize: 12.5, color: S.sub }, children: [
        v.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 5, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Phone, { size: 12 }),
          " ",
          v.phone
        ] }),
        v.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 5, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { size: 12 }),
          " ",
          v.email
        ] }),
        v.account && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          "Acct #",
          v.account
        ] })
      ] }),
      v.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 8, lineHeight: 1.5 }, children: v.notes }),
      canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { flex: 1 }, onClick: () => open(v), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { size: 13 }),
          " Edit"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Btn,
          {
            kind: "ghost",
            small: true,
            style: { flex: 1 },
            onClick: () => setVendors(vendors.map((x) => x.id === v.id ? { ...x, active: !x.active } : x)),
            children: v.active ? "Deactivate" : "Reactivate"
          }
        )
      ] })
    ] }, v.id)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: !!editing,
        onClose: () => setEditing(null),
        title: editing === "new" ? "Add vendor" : "Edit vendor",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { width: "100%" }, disabled: !f.name.trim(), onClick: save, children: "Save vendor" }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Company name *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.name, onChange: (e) => setF({ ...f, name: e.target.value }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Rep / contact", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.contact, onChange: (e) => setF({ ...f, contact: e.target.value }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Phone", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.phone, inputMode: "tel", onChange: (e) => setF({ ...f, phone: formatPhone(e.target.value) }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Email", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "email", value: f.email, onChange: (e) => setF({ ...f, email: e.target.value }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Account number", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.account, onChange: (e) => setF({ ...f, account: e.target.value }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Notes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { style: { ...inputStyle, minHeight: 60, resize: "vertical", fontFamily: "inherit" }, value: f.notes, onChange: (e) => setF({ ...f, notes: e.target.value }) }) })
        ]
      }
    )
  ] });
}
function LeadSourceManager({ sources, setSources, jobs, onBack, toast: toast2 }) {
  const [draft, setDraft] = (0, import_react.useState)("");
  const usage = (src) => jobs.filter((j) => j.leadSource === src).length;
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (sources.some((x) => x.toLowerCase() === v.toLowerCase())) {
      toast2("Already in the list");
      return;
    }
    setSources([...sources, v]);
    setDraft("");
    toast2("Source added");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Lead sources", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 12, lineHeight: 1.5 }, children: "These are the options reps pick from on a new lead, and what Performance groups by. Removing a source doesn't touch jobs already tagged with it." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: { ...inputStyle, flex: 1 },
            value: draft,
            placeholder: "Add a source \u2014 Home show, Yard sign\u2026",
            onChange: (e) => setDraft(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") add();
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { onClick: add, disabled: !draft.trim(), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 10, lineHeight: 1.5 }, children: "Use the arrows to set the order reps see. Lead source is required on every new lead \u2014 the form won't submit without one, so your Performance numbers stay honest." })
    ] }),
    sources.map((src, i2) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pad: 13, style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14.5, fontWeight: 700 }, children: src }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub, marginTop: 2 }, children: [
          usage(src),
          " job",
          usage(src) === 1 ? "" : "s",
          " tagged"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Btn,
          {
            kind: "ghost",
            small: true,
            disabled: i2 === 0,
            onClick: () => {
              const a = [...sources];
              [a[i2 - 1], a[i2]] = [a[i2], a[i2 - 1]];
              setSources(a);
            },
            children: "\u2191"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Btn,
          {
            kind: "ghost",
            small: true,
            disabled: i2 === sources.length - 1,
            onClick: () => {
              const a = [...sources];
              [a[i2 + 1], a[i2]] = [a[i2], a[i2 + 1]];
              setSources(a);
            },
            children: "\u2193"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => {
              setSources(sources.filter((x) => x !== src));
              toast2("Source removed");
            },
            style: { border: "none", background: "none", cursor: "pointer" },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 16, color: "#B42318" })
          }
        )
      ] })
    ] }) }, src))
  ] });
}
function BrandingEditor({ brand: brand2, setBrand, onBack, toast: toast2 }) {
  const set = (k) => (e) => setBrand({ ...brand2, [k]: e.target.value });
  const logoRef = (0, import_react.useRef)(null);
  const onLogo = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast2("That file isn't an image");
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      setBrand({ ...brand2, logo: String(r.result) });
      toast2("Logo updated");
    };
    r.readAsDataURL(file);
    e.target.value = "";
  };
  const locations = brand2.locations || [];
  const setLoc = (i, k, v) => {
    const next = locations.map((l, x) => x === i ? { ...l, [k]: v } : l);
    setBrand({ ...brand2, locations: next });
  };
  const addLoc = () => setBrand({ ...brand2, locations: [...locations, { id: uid("loc"), label: "", phone: "", address: "" }] });
  const rmLoc = (i) => setBrand({ ...brand2, locations: locations.filter((_, x) => x !== i) });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ref: logoRef, type: "file", accept: "image/*", onChange: onLogo, style: { display: "none" } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Company branding", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 14 }, children: "One place for company identity. Login, documents, the client portal, and review messages all read from here \u2014 colors repaint the whole app the moment you change them." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Logo", hint: "Shows on the login screen, the loading screen, and document headers. PNG with a transparent background works best.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 14 }, children: [
        brand2.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: brand2.logo, alt: "Company logo", style: { height: 56, maxWidth: 160, objectFit: "contain", borderRadius: 8, border: `1px solid ${S.line}`, padding: 4, background: "#fff" } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 56, height: 56, borderRadius: 14, background: T.primary, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800 }, children: brand2.short }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, onClick: () => logoRef.current && logoRef.current.click(), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { size: 13 }),
            " ",
            brand2.logo ? "Replace" : "Upload"
          ] }),
          brand2.logo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", small: true, onClick: () => setBrand({ ...brand2, logo: null }), children: "Remove" })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Company name", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: brand2.company, onChange: set("company") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Short mark (fallback when no logo)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: brand2.short, onChange: set("short") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Slogan", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: brand2.slogan, onChange: set("slogan") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Main phone", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: brand2.phone, onChange: set("phone") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Email", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: brand2.email, onChange: set("email") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Head office address", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: brand2.address, onChange: set("address") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Google review link", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: brand2.googleReviewLink, onChange: set("googleReviewLink") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Primary color", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "color", value: brand2.primary, onChange: set("primary"), style: { ...inputStyle, height: 46, padding: 4 } }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Accent color", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "color", value: brand2.accent, onChange: set("accent"), style: { ...inputStyle, height: 46, padding: 4 } }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: "The soft accent (chips, highlights) is derived from the accent automatically." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "soft", small: true, onClick: addLoc, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 13 }),
        " Add location"
      ] }), children: "Locations" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 6, lineHeight: 1.5 }, children: "Each office gets its own phone and address. A rep picks their location on their seat, and documents and messages for their jobs show that office's contact info instead of head office." }),
      locations.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 8 }, children: "No additional locations \u2014 everything uses the head office above." }),
      locations.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: `1px solid ${S.line}`, borderRadius: 12, padding: 13, marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 800, color: S.sub }, children: [
            "LOCATION ",
            i + 1
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => rmLoc(i), style: { border: "none", background: "none", cursor: "pointer" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 15, color: "#B42318" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Label", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: l.label, onChange: (e) => setLoc(i, "label", e.target.value), placeholder: "Cincinnati office" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Office phone", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: l.phone, inputMode: "tel", onChange: (e) => setLoc(i, "phone", formatPhone(e.target.value)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Office email", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "email", value: l.email || "", onChange: (e) => setLoc(i, "email", e.target.value) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Address", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: l.address, onChange: (e) => setLoc(i, "address", e.target.value) }) })
      ] }, l.id))
    ] })
  ] });
}
function CompanyDocs({ docs, setDocs, currentUser, onBack, toast: toast2 }) {
  const [cat, setCat] = (0, import_react.useState)("All");
  const [q, setQ] = (0, import_react.useState)("");
  const [adding, setAdding] = (0, import_react.useState)(false);
  const [f, setF] = (0, import_react.useState)({ name: "", cat: DOC_CATEGORIES[0], expires: "" });
  const fileRef = (0, import_react.useRef)(null);
  const canEdit = currentUser.role === "admin" || currentUser.role === "manager";
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const soon = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10);
  const expiring = docs.filter((d) => d.expires && d.expires <= soon);
  const [viewing, setViewing] = (0, import_react.useState)(null);
  const list = docs.filter((d) => {
    if (cat !== "All" && d.cat !== cat) return false;
    if (q && !(d.name + d.cat).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (a.order ?? 999) - (b.order ?? 999) || b.at.localeCompare(a.at));
  const move = (id, dir) => {
    const ordered = [...list];
    const idx = ordered.findIndex((d) => d.id === id);
    const swap = idx + dir;
    if (swap < 0 || swap >= ordered.length) return;
    [ordered[idx], ordered[swap]] = [ordered[swap], ordered[idx]];
    const orderMap = Object.fromEntries(ordered.map((d, i2) => [d.id, i2]));
    setDocs(docs.map((d) => ({ ...d, order: orderMap[d.id] ?? d.order })));
  };
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setF({ name: file.name, cat: f.cat, expires: "" });
    setAdding(true);
    e.target.value = "";
  };
  const save = () => {
    setDocs([...docs, {
      id: uid("d"),
      name: f.name.trim(),
      cat: f.cat,
      size: "\u2014",
      at: today,
      by: currentUser.name,
      pinned: false,
      expires: f.expires || null
    }]);
    setAdding(false);
    setF({ name: "", cat: DOC_CATEGORIES[0], expires: "" });
    toast2("Document added");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ref: fileRef, type: "file", onChange: onFile, style: { display: "none" } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SubHeader,
      {
        title: "Documents",
        onBack,
        right: canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, onClick: () => fileRef.current && fileRef.current.click(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { size: 14 }),
          " Upload"
        ] })
      }
    ),
    expiring.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14, borderLeft: "3px solid #92600A" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: "#92600A", marginBottom: 6 }, children: "Expiring soon" }),
      expiring.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, color: S.ink }, children: d.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: d.expires <= today ? "red" : "amber", children: d.expires <= today ? "Expired" : d.expires })
      ] }, d.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, placeholder: "Search documents", value: q, onChange: (e) => setQ(e.target.value) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, marginTop: 10, overflowX: "auto", paddingBottom: 4 }, children: ["All", ...DOC_CATEGORIES].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setCat(c), style: {
      border: `1.5px solid ${cat === c ? T.accent : S.line}`,
      background: cat === c ? T.accentSoft : "#fff",
      color: cat === c ? T.accent : S.ink,
      borderRadius: 999,
      padding: "7px 13px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      whiteSpace: "nowrap",
      flexShrink: 0
    }, children: c }, c)) }),
    list.map((d, di) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 15, style: { marginTop: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "div",
        {
          style: { display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" },
          onClick: () => setViewing(d),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FileText, { size: 20, color: T.accent, style: { flexShrink: 0, marginTop: 2 } }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14.5, fontWeight: 700, color: S.ink }, children: d.name }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub, marginTop: 3 }, children: [
                d.cat,
                " \xB7 ",
                d.size,
                " \xB7 added ",
                d.at,
                " by ",
                d.by.split(" ")[0]
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }, children: [
                d.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: "Pinned" }),
                d.expires && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: d.expires <= today ? "red" : d.expires <= soon ? "amber" : "gray", children: [
                  "Expires ",
                  d.expires
                ] })
              ] })
            ] })
          ]
        }
      ),
      canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, onClick: () => move(d.id, -1), disabled: di === 0, children: "\u2191" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, onClick: () => move(d.id, 1), disabled: di === list.length - 1, children: "\u2193" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Btn,
          {
            kind: "ghost",
            small: true,
            style: { flex: 1 },
            onClick: () => setDocs(docs.map((x) => x.id === d.id ? { ...x, pinned: !x.pinned } : x)),
            children: d.pinned ? "Unpin" : "Pin"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", small: true, onClick: () => {
          setDocs(docs.filter((x) => x.id !== d.id));
          toast2("Document removed");
        }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 13 }) })
      ] })
    ] }, d.id)),
    list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { marginTop: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "No documents here yet." }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, { open: !!viewing, onClose: () => setViewing(null), title: viewing ? viewing.name : "", children: viewing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Category", v: viewing.cat }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Added", v: `${viewing.at} by ${viewing.by}` }),
      viewing.expires && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Expires", v: viewing.expires }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
        marginTop: 14,
        border: `1.5px dashed ${S.line}`,
        borderRadius: 12,
        padding: "34px 16px",
        textAlign: "center",
        color: S.sub,
        fontSize: 13.5,
        lineHeight: 1.6
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FileText, { size: 28, color: "#C7CBD1", style: { marginBottom: 8 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Preview isn't available yet \u2014 files aren't stored anywhere while the app runs on in-memory data. Once documents are wired to Supabase Storage, this opens the actual PDF." })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: adding,
        onClose: () => setAdding(false),
        title: "Add document",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { width: "100%" }, disabled: !f.name.trim(), onClick: save, children: "Save document" }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "File name", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.name, onChange: (e) => setF({ ...f, name: e.target.value }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Category", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: selStyle, value: f.cat, onChange: (e) => setF({ ...f, cat: e.target.value }), children: DOC_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Expiration date", hint: "Optional. Certificates and licenses get an expiry warning 60 days out.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "date", value: f.expires, onChange: (e) => setF({ ...f, expires: e.target.value }) }) })
        ]
      }
    )
  ] });
}
function PriceListManager({ list, setList, currentUser, onBack, toast: toast2 }) {
  const [q, setQ] = (0, import_react.useState)("");
  const [importing, setImporting] = (0, import_react.useState)(null);
  const fileRef = (0, import_react.useRef)(null);
  const canEdit = currentUser.role === "admin" || currentUser.role === "manager";
  const parseCsv = (text) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (!lines.length) return { rows: [], error: "File is empty." };
    const split = (l) => {
      const out = [];
      let cur = "", inQ = false;
      for (let i = 0; i < l.length; i++) {
        const ch = l[i];
        if (ch === '"') {
          if (inQ && l[i + 1] === '"') {
            cur += '"';
            i++;
          } else inQ = !inQ;
        } else if (ch === "," && !inQ) {
          out.push(cur);
          cur = "";
        } else cur += ch;
      }
      out.push(cur);
      return out.map((x) => x.trim());
    };
    const head = split(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
    const idx = (names) => {
      for (const n of names) {
        const k = head.indexOf(n);
        if (k >= 0) return k;
      }
      return -1;
    };
    const cItem = idx(["item", "description", "product", "name"]);
    if (cItem < 0) return { rows: [], error: "No item/description column found. Expected a header row with at least an item column." };
    const cSku = idx(["sku", "code", "itemnumber", "partnumber"]);
    const cUnit = idx(["unit", "uom"]);
    const cCost = idx(["cost", "ourcost", "unitcost"]);
    const cPrice = idx(["price", "sellprice", "retail", "unitprice"]);
    const cSup = idx(["supplier", "vendor"]);
    const cCat = idx(["category", "type", "group"]);
    const rows = lines.slice(1).map((l) => {
      const c = split(l);
      return {
        id: uid("pl"),
        sku: cSku >= 0 ? c[cSku] : "",
        item: c[cItem] || "",
        unit: cUnit >= 0 ? c[cUnit] : "EA",
        cost: cCost >= 0 ? num(String(c[cCost]).replace(/[$,]/g, "")) : 0,
        price: cPrice >= 0 ? num(String(c[cPrice]).replace(/[$,]/g, "")) : 0,
        supplier: cSup >= 0 ? c[cSup] : "",
        category: cCat >= 0 ? c[cCat] : "Uncategorized"
      };
    }).filter((r) => r.item);
    return { rows, error: rows.length ? null : "No data rows found below the header." };
  };
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImporting({ ...parseCsv(String(reader.result)), fileName: file.name, mode: "replace" });
    reader.readAsText(file);
    e.target.value = "";
  };
  const filtered = list.filter((r) => !q || (r.item + r.sku + r.supplier + r.category).toLowerCase().includes(q.toLowerCase()));
  const margin = (r) => r.price > 0 ? (r.price - r.cost) / r.price * 100 : 0;
  const [editing, setEditing] = (0, import_react.useState)(null);
  const [ef, setEf] = (0, import_react.useState)(null);
  const openEdit = (r) => {
    setEditing(r ? r.id : "new");
    setEf(r ? { ...r, marginPct: margin(r).toFixed(1) } : { sku: "", item: "", unit: "EA", cost: 0, price: 0, supplier: "", category: "", marginPct: "30" });
  };
  const efSet = (k) => (e) => {
    const v = e.target.value;
    setEf((prev) => {
      const next = { ...prev, [k]: v };
      const cost = num(next.cost), price = num(next.price), m = num(next.marginPct);
      if (k === "marginPct" && cost > 0 && m < 100) next.price = +(cost / (1 - m / 100)).toFixed(2);
      else if ((k === "price" || k === "cost") && price > 0) next.marginPct = ((price - cost) / price * 100).toFixed(1);
      return next;
    });
  };
  const saveEdit = () => {
    const row = { ...ef, cost: num(ef.cost), price: num(ef.price) };
    delete row.marginPct;
    if (editing === "new") setList([...list, { ...row, id: uid("pl") }]);
    else setList(list.map((r) => r.id === editing ? { ...r, ...row } : r));
    setEditing(null);
    toast2("Line item saved");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ref: fileRef, type: "file", accept: ".csv,text/csv", onChange: onFile, style: { display: "none" } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SubHeader,
      {
        title: "Price list",
        onBack,
        right: canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, onClick: () => fileRef.current && fileRef.current.click(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { size: 14 }),
          " Import CSV"
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.55 }, children: [
        "Import a supplier price list as CSV. The header row is matched loosely \u2014 ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "item" }),
        " is required, and",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: " sku, unit, cost, price, supplier, category" }),
        " are picked up if present. Column order doesn't matter."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 16, marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 20, fontWeight: 800 }, children: list.length }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: "Line items" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 20, fontWeight: 800 }, children: list.length ? pct1(list.reduce((s2, r) => s2 + margin(r), 0) / list.length) : "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: "Average margin" })
        ] })
      ] }),
      list.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { marginTop: 12 }, onClick: () => {
        downloadCsv("price-list.csv", [
          ["sku", "item", "unit", "cost", "price", "supplier", "category"],
          ...list.map((r) => [r.sku, r.item, r.unit, r.cost, r.price, r.supplier, r.category])
        ]);
        toast2("Price list exported");
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Download, { size: 13 }),
        " Export CSV"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, placeholder: "Search items, SKU, supplier", value: q, onChange: (e) => setQ(e.target.value) }) }),
    filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Card,
      {
        pad: 14,
        style: { marginTop: 10, cursor: canEdit ? "pointer" : "default" },
        onClick: canEdit ? () => openEdit(r) : void 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minWidth: 0 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14.5, fontWeight: 700, color: S.ink }, children: r.item }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 3 }, children: [r.sku, r.supplier, r.category].filter(Boolean).join(" \xB7 ") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "right", flexShrink: 0 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800 }, children: money(r.price) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, color: S.sub }, children: [
                "per ",
                r.unit
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 14, marginTop: 9, paddingTop: 9, borderTop: `1px solid ${S.line}` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12, color: S.sub }, children: [
              "Cost ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { color: S.ink }, children: money(r.cost) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12, color: S.sub }, children: [
              "Margin ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { color: margin(r) < 25 ? "#B42318" : "#177245" }, children: pct1(margin(r)) })
            ] })
          ] })
        ]
      },
      r.id
    )),
    filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { marginTop: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "No items match." }) }),
    canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { width: "100%", marginTop: 12 }, onClick: () => openEdit(null), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }),
      " Add line item"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Sheet,
      {
        open: !!editing,
        onClose: () => setEditing(null),
        title: editing === "new" ? "Add line item" : "Edit line item",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
          editing !== "new" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", onClick: () => {
            setList(list.filter((r) => r.id !== editing));
            setEditing(null);
            toast2("Line item deleted");
          }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 14 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { flex: 1 }, disabled: !ef || !ef.item.trim(), onClick: saveEdit, children: "Save" })
        ] }),
        children: ef && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Item *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: ef.item, onChange: efSet("item") }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "SKU", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: ef.sku, onChange: efSet("sku") }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Unit", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: selStyle, value: ef.unit, onChange: efSet("unit"), children: UNIT_TYPES.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: u }, u)) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Cost", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "number", step: "0.01", value: ef.cost, onChange: efSet("cost") }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Price", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "number", step: "0.01", value: ef.price, onChange: efSet("price") }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Margin %", hint: "Changing this recomputes price from cost.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "number", step: "0.1", value: ef.marginPct, onChange: efSet("marginPct") }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Supplier", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: ef.supplier, onChange: efSet("supplier") }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Category", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: ef.category, onChange: efSet("category") }) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: !!importing,
        onClose: () => setImporting(null),
        title: "Import price list",
        footer: importing && !importing.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: () => {
            setList([...list, ...importing.rows]);
            setImporting(null);
            toast2(`${importing.rows.length} items appended`);
          }, children: "Append" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { flex: 1 }, onClick: () => {
            setList(importing.rows);
            setImporting(null);
            toast2(`Price list replaced \u2014 ${importing.rows.length} items`);
          }, children: "Replace list" })
        ] }),
        children: [
          importing && importing.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Could not read that file", tone: "red", children: importing.error }),
          importing && !importing.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.ink, marginBottom: 4 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: importing.fileName }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 12 }, children: [
              importing.rows.length,
              " rows parsed. First five shown \u2014 check the columns landed in the right place before importing."
            ] }),
            importing.rows.slice(0, 5).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "9px 0", borderTop: `1px solid ${S.line}` }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, fontWeight: 700 }, children: r.item }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub, marginTop: 2 }, children: [
                r.sku && `${r.sku} \xB7 `,
                "cost ",
                money(r.cost),
                " \xB7 price ",
                money(r.price),
                " \xB7 per ",
                r.unit
              ] })
            ] }, r.id))
          ] })
        ]
      }
    )
  ] });
}
function TemplateManager({ templates, setTemplates, currentUser, onBack, toast: toast2, brand: brand2 }) {
  const [kind, setKind] = (0, import_react.useState)("email");
  const [aud, setAud] = (0, import_react.useState)("All");
  const [editing, setEditing] = (0, import_react.useState)(null);
  const [f, setF] = (0, import_react.useState)({ kind: "email", audience: "Customer", name: "", subject: "", body: "" });
  const fileRef = (0, import_react.useRef)(null);
  const bodyRef = (0, import_react.useRef)(null);
  const canEdit = currentUser.role === "admin" || currentUser.role === "manager";
  const list = templates.filter((t) => t.kind === kind && (aud === "All" || t.audience === aud));
  const open = (t) => {
    setEditing(t || "new");
    setF(t ? { ...t } : { kind, audience: aud === "All" ? "Customer" : aud, name: "", subject: "", body: "" });
  };
  const save = () => {
    if (editing === "new") setTemplates([...templates, { ...f, id: uid("t") }]);
    else setTemplates(templates.map((t) => t.id === editing.id ? { ...t, ...f } : t));
    setEditing(null);
    toast2("Template saved");
  };
  const insertField = (token) => {
    setF((p2) => ({ ...p2, body: (p2.body || "") + token }));
  };
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      const name = file.name.replace(/\.[^.]+$/, "");
      const lines = text.split(/\r?\n/);
      let subject = "", body = text;
      const m = lines[0] && lines[0].match(/^subject\s*:\s*(.+)$/i);
      if (m) {
        subject = m[1].trim();
        body = lines.slice(1).join("\n").trim();
      }
      setEditing("new");
      setF({ kind, audience: "Customer", name, subject, body });
      toast2("Template loaded \u2014 review and save");
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ref: fileRef, type: "file", accept: ".txt,.md,.html,text/plain", onChange: onFile, style: { display: "none" } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SubHeader,
      {
        title: "Message templates",
        onBack,
        right: canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, onClick: () => open(null), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }),
          " New"
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.55 }, children: "Templates fill themselves in from the job when you send. Every SMS template to a customer must keep the STOP opt-out line \u2014 it's a legal requirement, not a style choice." }),
      canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { marginTop: 12 }, onClick: () => fileRef.current && fileRef.current.click(), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { size: 13 }),
        " Upload a .txt template"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, marginTop: 14 }, children: [["email", "Email"], ["sms", "Text"]].map(([k, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setKind(k), style: {
      flex: 1,
      border: `1.5px solid ${kind === k ? T.accent : S.line}`,
      background: kind === k ? T.accentSoft : "#fff",
      color: kind === k ? T.accent : S.ink,
      borderRadius: 10,
      padding: "10px 0",
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer"
    }, children: l }, k)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, marginTop: 8 }, children: ["All", "Customer", "Crew"].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setAud(a), style: {
      border: `1.5px solid ${aud === a ? T.accent : S.line}`,
      background: aud === a ? T.accentSoft : "#fff",
      color: aud === a ? T.accent : S.ink,
      borderRadius: 999,
      padding: "7px 14px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer"
    }, children: a }, a)) }),
    list.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 15, style: { marginTop: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14.5, fontWeight: 700, color: S.ink }, children: t.name }),
          t.subject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 3 }, children: t.subject })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: t.audience === "Crew" ? "slate" : "blue", children: t.audience })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
        fontSize: 12.5,
        color: S.sub,
        marginTop: 9,
        lineHeight: 1.5,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }, children: t.body }),
      canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { flex: 1 }, onClick: () => open(t), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { size: 13 }),
          " Edit"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", small: true, onClick: () => {
          setTemplates(templates.filter((x) => x.id !== t.id));
          toast2("Template deleted");
        }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 13 }) })
      ] })
    ] }, t.id)),
    list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { marginTop: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "No templates in this group yet." }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: !!editing,
        onClose: () => setEditing(null),
        wide: true,
        title: editing === "new" ? "New template" : "Edit template",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { width: "100%" }, disabled: !f.name.trim() || !f.body.trim(), onClick: save, children: "Save template" }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Type", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: f.kind, onChange: (e) => setF({ ...f, kind: e.target.value }), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "email", children: "Email" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "sms", children: "Text" })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Audience", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: f.audience, onChange: (e) => setF({ ...f, audience: e.target.value }), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Customer" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Crew" })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Template name", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.name, onChange: (e) => setF({ ...f, name: e.target.value }) }) }),
          f.kind === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Subject", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.subject, onChange: (e) => setF({ ...f, subject: e.target.value }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Message", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "textarea",
            {
              ref: bodyRef,
              style: { ...inputStyle, minHeight: 200, resize: "vertical", fontFamily: "inherit" },
              value: f.body,
              onChange: (e) => setF({ ...f, body: e.target.value })
            }
          ) }),
          f.kind === "sms" && f.audience === "Customer" && !/stop/i.test(f.body) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Missing opt-out", tone: "red", children: 'Customer texts need a visible opt-out. Add "Reply STOP to opt out." before saving.' }),
          f.kind === "sms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: S.sub, marginBottom: 12 }, children: [
            f.body.length,
            " characters \u2014 texts over 160 send as multiple segments."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: T.primary, marginBottom: 8 }, children: "INSERT A MERGE FIELD" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: MERGE_FIELDS.map(([token, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", title: label, onClick: () => insertField(token), style: {
            border: `1px solid ${S.line}`,
            background: "#fff",
            borderRadius: 999,
            padding: "6px 11px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            color: T.accent
          }, children: token }, token)) })
        ]
      }
    )
  ] });
}
function CrewManager({ crews, setCrews, currentUser, jobs, onBack, toast: toast2 }) {
  const [editing, setEditing] = (0, import_react.useState)(null);
  const blank = { name: "", contact: "", phone: "", email: "", trades: [], active: true };
  const [f, setF] = (0, import_react.useState)(blank);
  const canEdit = currentUser.role === "admin" || currentUser.role === "manager";
  const TRADES = ["Roofing", "Siding", "Gutters", "Metal", "Flashing", "Windows", "Carpentry"];
  const [customTrade, setCustomTrade] = (0, import_react.useState)("");
  const [range, setRange] = (0, import_react.useState)("all");
  const docRef = (0, import_react.useRef)(null);
  const paidFor = (crewId) => {
    const cutoff = range === "all" ? 0 : Date.now() - (range === "30" ? 30 : range === "90" ? 90 : 365) * 864e5;
    return jobs.filter((j) => j.crewId === crewId).reduce((sum, j) => {
      const lines = j.financials && j.financials.costLines || [];
      return sum + lines.filter((l) => /labor|crew|install|sub/i.test(l.label || "")).filter((l) => !l.at || new Date(l.at).getTime() >= cutoff).reduce((t, l) => t + num(l.amt), 0);
    }, 0);
  };
  const open = (c) => {
    setEditing(c || "new");
    setF(c ? { ...c } : blank);
  };
  const save = () => {
    if (editing === "new") setCrews([...crews, { ...f, id: uid("c") }]);
    else setCrews(crews.map((c) => c.id === editing.id ? { ...c, ...f } : c));
    setEditing(null);
    toast2("Crew saved");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SubHeader,
      {
        title: "Crews",
        onBack,
        right: canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, onClick: () => open(null), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }),
          " Add crew"
        ] })
      }
    ),
    canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, pad: 13, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, color: S.sub }, children: "Paid totals:" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: { ...selStyle, flex: 1 }, value: range, onChange: (e) => setRange(e.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "all", children: "All time" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "30", children: "Last 30 days" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "90", children: "Last 90 days" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "365", children: "Last 12 months" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 7, lineHeight: 1.5 }, children: "Totals come from labor and subcontractor lines on each crew's jobs in the Financials tab." })
    ] }),
    crews.map((c) => {
      const assigned = jobs.filter((j) => j.crewId === c.id).length;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 15, style: { marginTop: 10, opacity: c.active ? 1 : 0.6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700 }, children: c.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 2 }, children: c.contact })
          ] }),
          !c.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: "Inactive" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 14, marginTop: 9, flexWrap: "wrap", fontSize: 12.5, color: S.sub }, children: [
          c.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 5, alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Phone, { size: 12 }),
            " ",
            c.phone
          ] }),
          c.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 5, alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { size: 12 }),
            " ",
            c.email
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }, children: [
          c.trades.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: t }, t)),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "blue", children: [
            assigned,
            " job",
            assigned === 1 ? "" : "s"
          ] }),
          canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "green", children: [
            money(paidFor(c.id)),
            " paid"
          ] }),
          (c.docs || []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "gray", children: [
            (c.docs || []).length,
            " doc",
            (c.docs || []).length === 1 ? "" : "s"
          ] })
        ] }),
        canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { flex: 1 }, onClick: () => open(c), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { size: 13 }),
            " Edit"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Btn,
            {
              kind: "ghost",
              small: true,
              style: { flex: 1 },
              onClick: () => setCrews(crews.map((x) => x.id === c.id ? { ...x, active: !x.active } : x)),
              children: c.active ? "Deactivate" : "Reactivate"
            }
          )
        ] })
      ] }, c.id);
    }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: !!editing,
        onClose: () => setEditing(null),
        title: editing === "new" ? "Add crew" : "Edit crew",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { width: "100%" }, disabled: !f.name.trim(), onClick: save, children: "Save crew" }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Crew / company name *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.name, onChange: (e) => setF({ ...f, name: e.target.value }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Primary contact", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.contact, onChange: (e) => setF({ ...f, contact: e.target.value }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Phone", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.phone, inputMode: "tel", onChange: (e) => setF({ ...f, phone: formatPhone(e.target.value) }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Email", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "email", value: f.email, onChange: (e) => setF({ ...f, email: e.target.value }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, { label: "Documents", hint: "Certificates of insurance, W-9s, licenses \u2014 anything you need on file.", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                ref: docRef,
                type: "file",
                style: { display: "none" },
                onChange: (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  setF({ ...f, docs: [...f.docs || [], { id: uid("cd"), name: file.name, at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) }] });
                  e.target.value = "";
                }
              }
            ),
            (f.docs || []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${S.line}` }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 13.5 }, children: [
                d.name,
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: S.sub, fontSize: 12 }, children: [
                  "\xB7 ",
                  d.at
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  onClick: () => setF({ ...f, docs: (f.docs || []).filter((x) => x.id !== d.id) }),
                  style: { border: "none", background: "none", cursor: "pointer" },
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 14, color: "#B42318" })
                }
              )
            ] }, d.id)),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { marginTop: 8 }, onClick: () => docRef.current && docRef.current.click(), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { size: 13 }),
              " Add document"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, { label: "Trades", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginBottom: 9 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "input",
                {
                  style: { ...inputStyle, flex: 1 },
                  value: customTrade,
                  placeholder: "Add a custom trade\u2026",
                  onChange: (e) => setCustomTrade(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && customTrade.trim()) {
                      setF({ ...f, trades: [.../* @__PURE__ */ new Set([...f.trades, customTrade.trim()])] });
                      setCustomTrade("");
                    }
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Btn,
                {
                  kind: "ghost",
                  small: true,
                  disabled: !customTrade.trim(),
                  onClick: () => {
                    setF({ ...f, trades: [.../* @__PURE__ */ new Set([...f.trades, customTrade.trim()])] });
                    setCustomTrade("");
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 13 })
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 7 }, children: [.../* @__PURE__ */ new Set([...TRADES, ...f.trades])].map((t) => {
              const on = f.trades.includes(t);
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: () => setF({ ...f, trades: on ? f.trades.filter((x) => x !== t) : [...f.trades, t] }),
                  style: {
                    border: `1.5px solid ${on ? T.accent : S.line}`,
                    background: on ? T.accentSoft : "#fff",
                    color: on ? T.accent : S.ink,
                    borderRadius: 999,
                    padding: "7px 13px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer"
                  },
                  children: [
                    on ? "\u2713 " : "",
                    t
                  ]
                },
                t
              );
            }) })
          ] })
        ]
      }
    )
  ] });
}
function Integrations({ integrations, setIntegrations, currentUser, users = [], onBack, toast: toast2 }) {
  const isAdmin = currentUser.role === "admin";
  const byUser = integrations.gmailByUser || {};
  const mine = byUser[currentUser.id] || { connected: false };
  const sms = integrations.sms;
  const [connecting, setConnecting] = (0, import_react.useState)(null);
  const [addr, setAddr] = (0, import_react.useState)("");
  const setMyGmail = (val) => setIntegrations({ ...integrations, gmailByUser: { ...byUser, [currentUser.id]: val } });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Integrations", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: mine.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "green", children: "Connected" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: "Not connected" }), children: "Your Gmail" }),
      mine.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Account", v: mine.email }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Connected", v: mine.at }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 8 }, children: "Emails you send from a job go out as you, from this mailbox, and replies come back to your inbox with the thread intact. Every rep connects their own \u2014 there's no shared company sender." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Btn,
          {
            kind: "danger",
            small: true,
            style: { marginTop: 12 },
            onClick: () => {
              setMyGmail({ connected: false });
              toast2("Gmail disconnected");
            },
            children: "Disconnect"
          }
        )
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.ink, lineHeight: 1.55 }, children: "Connect your own mailbox. Your customers get email from you, not a generic office address, and replies land where you'll actually see them." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "How connecting works", children: "Two parts. The office does a one-time setup; after that every rep just taps Connect and signs in with Google like any other app." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 12, fontSize: 13, lineHeight: 1.65, color: S.ink }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontWeight: 800, fontSize: 12.5, color: S.sub, marginBottom: 6 }, children: "ONE-TIME, BY THE OFFICE" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "1." }),
            " Go to console.cloud.google.com and create a project named Ridgeline."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "2." }),
            ' APIs & Services \u2192 Library \u2192 search "Gmail API" \u2192 Enable.'
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "3." }),
            " OAuth consent screen \u2192 choose Internal if you use Google Workspace (recommended \u2014 no Google review needed), otherwise External. Fill in the app name and your support email."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "4." }),
            " Credentials \u2192 Create credentials \u2192 OAuth client ID \u2192 Web application. Under Authorized redirect URIs, add this app's address followed by ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "/auth/gmail" }),
            "."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "5." }),
            " Copy the Client ID and Client Secret, then send them over so the token-exchange function can be deployed. The secret must live on the server \u2014 never in the app."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontWeight: 800, fontSize: 12.5, color: S.sub, margin: "12px 0 6px" }, children: "THEN, EACH REP" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "6." }),
            " Open this screen and tap Connect my Gmail."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "7." }),
            ' Pick your work Google account and approve the "send email on your behalf" permission.'
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "That's it \u2014 customer emails then send from your address and replies land in your own inbox." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { width: "100%", marginTop: 12 }, onClick: () => setConnecting("gmail"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { size: 15 }),
          " Connect my Gmail"
        ] })
      ] })
    ] }),
    isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Team connections" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 6 }, children: "Who's connected their mailbox. Reps without a connection can compose but their email shows as queued." }),
      users.filter((u) => u.active !== false).map((u) => {
        const g = byUser[u.id];
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderTop: `1px solid ${S.line}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 600 }, children: u.name }),
            g && g.connected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: g.email })
          ] }),
          g && g.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "green", children: "Connected" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: "Not yet" })
        ] }, u.id);
      })
    ] }),
    isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { right: sms.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "green", children: "Connected" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: "Not connected" }), children: "Text messaging (company-wide)" }),
      sms.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Provider", v: sms.provider }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, { k: "Sending number", v: sms.number }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Btn,
          {
            kind: "danger",
            small: true,
            style: { marginTop: 12 },
            onClick: () => {
              setIntegrations({ ...integrations, sms: { connected: false, provider: "", number: "" } });
              toast2("SMS disconnected");
            },
            children: "Disconnect"
          }
        )
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, color: S.ink, lineHeight: 1.55 }, children: "One provider account (Twilio or similar) with a dedicated number for the whole company \u2014 texting registration is per business, so this one stays shared. Consent is tracked per customer and sends are blocked without it." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Before your first send", children: "US carriers require 10DLC brand and campaign registration for business texting. Unregistered traffic gets filtered or blocked outright. Registration takes a few days \u2014 start it before you need it." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { width: "100%", marginTop: 12 }, onClick: () => setConnecting("sms"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageCircle, { size: 15 }),
          " Connect SMS provider"
        ] })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { marginTop: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 18, color: S.sub, style: { flexShrink: 0, marginTop: 2 } }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, lineHeight: 1.55 }, children: "Text messaging runs through one company number and is managed by the office." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Sheet,
      {
        open: !!connecting,
        onClose: () => {
          setConnecting(null);
          setAddr("");
        },
        title: connecting === "gmail" ? "Connect your Gmail" : "Connect SMS",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { width: "100%" }, disabled: !addr.trim(), onClick: () => {
          if (connecting === "gmail") {
            setMyGmail({ connected: true, email: addr.trim(), at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) });
            toast2("Your Gmail account is recorded");
          } else {
            setIntegrations({ ...integrations, sms: { connected: true, provider: "Twilio", number: addr.trim() } });
            toast2("SMS number recorded");
          }
          setConnecting(null);
          setAddr("");
        }, children: "Save connection" }),
        children: connecting === "gmail" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Your email address", hint: "The mailbox your customer emails should send from and receive replies to.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "email", value: addr, onChange: (e) => setAddr(e.target.value), placeholder: currentUser.email || "you@supremebuildinggroup.com" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "This records the account only", children: "The real Google sign-in runs server-side once the OAuth function is deployed. This saves which account is yours so the composer is configured and ready the moment that lands." })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Sending number", hint: "The number customers will see and can reply to.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: addr, onChange: (e) => setAddr(e.target.value), placeholder: "(847) 555-0100" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Registration required", children: "This number must be 10DLC registered to your business before carriers will deliver to it reliably." })
        ] })
      }
    )
  ] });
}
function JobImport({ jobs, setJobs, stages, users, onBack, toast: toast2, currentUser }) {
  const [parsed, setParsed] = (0, import_react.useState)(null);
  const fileRef = (0, import_react.useRef)(null);
  const isAdmin = currentUser.role === "admin";
  const splitLine = (l) => {
    const out = [];
    let cur = "", inQ = false;
    for (let i2 = 0; i2 < l.length; i2++) {
      const ch = l[i2];
      if (ch === '"') {
        if (inQ && l[i2 + 1] === '"') {
          cur += '"';
          i2++;
        } else inQ = !inQ;
      } else if (ch === "," && !inQ) {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out.map((x) => x.trim());
  };
  const matchStage = (stageName, category) => {
    const n = (stageName || "").toLowerCase();
    const hit = stages.find((st) => st.name.toLowerCase() === n) || stages.find((st) => n && st.name.toLowerCase().includes(n.split(" ")[0]));
    if (hit) return hit.id;
    const cat = (category || "").toLowerCase();
    if (cat === "lost") return "s11";
    if (cat === "unqualified") return "s12";
    if (cat === "completed") return "s10";
    if (cat === "won") return "s5";
    return stages[0].id;
  };
  const parse = (text, fileName) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return { error: "That file has no data rows." };
    const head = splitLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
    const col = (names) => {
      for (const n of names) {
        const k = head.indexOf(n);
        if (k >= 0) return k;
      }
      return -1;
    };
    const cAddr = col(["jobaddress", "address", "propertyaddress"]);
    if (cAddr < 0) return { error: "No job address column found. Expected a header row containing a job address column." };
    const cName = col(["customername", "customer", "name"]);
    const cZip = col(["zipcode", "zip", "postalcode"]);
    const cOwner = col(["jobowner", "owner", "assignee", "salesrep"]);
    const cValue = col(["jobvalue", "value", "amount"]);
    const cStage = col(["stage"]);
    const cCat = col(["stagecategory", "category"]);
    const cSource = col(["leadsource", "source"]);
    const cEmail = col(["customeremail", "email"]);
    const cPhone = col(["customerphone", "phone"]);
    const cCreated = col(["datecreated", "created"]);
    const known = users.map((u) => u.name);
    const rows = lines.slice(1).map((l) => {
      const c = splitLine(l);
      const addr = c[cAddr] || "";
      if (!addr) return null;
      const owner = cOwner >= 0 ? c[cOwner] : "";
      const zip = cZip >= 0 ? String(c[cZip]).padStart(5, "0").slice(0, 5) : "";
      const j = jurisdictionForZip(zip);
      return {
        name: cName >= 0 && c[cName] ? c[cName] : "(no customer name)",
        address: addr,
        zip,
        state: j ? j.state : "",
        assignee: known.includes(owner) ? owner : known[0] || "",
        ownerRaw: owner,
        value: cValue >= 0 ? num(String(c[cValue]).replace(/[$,]/g, "")) : 0,
        stageId: matchStage(cStage >= 0 ? c[cStage] : "", cCat >= 0 ? c[cCat] : ""),
        leadSource: cSource >= 0 ? c[cSource] : "",
        email: cEmail >= 0 ? c[cEmail] : "",
        phone: cPhone >= 0 ? c[cPhone] : "",
        created: cCreated >= 0 ? c[cCreated] : ""
      };
    }).filter(Boolean);
    const dupes = rows.filter((r) => jobs.some((j) => j.address.toLowerCase() === r.address.toLowerCase()));
    const unknownOwners = Array.from(new Set(rows.filter((r) => r.ownerRaw && !known.includes(r.ownerRaw)).map((r) => r.ownerRaw)));
    return { rows, dupes: dupes.length, unknownOwners, fileName };
  };
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setParsed(parse(String(r.result), file.name));
    r.readAsText(file);
    e.target.value = "";
  };
  const doImport = (skipDupes) => {
    const rows = skipDupes ? parsed.rows.filter((r) => !jobs.some((j) => j.address.toLowerCase() === r.address.toLowerCase())) : parsed.rows;
    const built = rows.map((r) => ({
      id: uid("j"),
      name: r.name,
      address: r.address,
      zip: r.zip,
      state: r.state,
      lat: null,
      lng: null,
      value: r.value,
      stageId: r.stageId,
      assignee: r.assignee,
      leadSource: r.leadSource,
      daysInStage: 0,
      updated: "imported",
      claimType: "Unknown",
      schedDate: null,
      phone: r.phone,
      email: r.email,
      consent: { sms: { granted: false, at: null, source: null }, email: { granted: false, at: null, source: null } },
      insurance: null,
      checklist: { ...BLANK_CHECKLIST },
      measurements: { ...BLANK_MEASURE },
      estimate: mkEstimate(),
      contract: mkContract(),
      photos: [],
      tasks: [],
      files: [],
      payments: [],
      messages: [],
      crewId: null,
      workOrder: null,
      fin: { materials: [], labor: [], other: [], commissionRate: 60, structure: "grossProfit", overheadPct: 10, reimbursements: [] },
      portal: { estimate: false, contract: false, photos: false, invoice: false },
      review: { sent: false, clicked: false, posted: false }
    }));
    setJobs([...jobs, ...built]);
    setParsed(null);
    toast2(`${built.length} jobs imported`);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ref: fileRef, type: "file", accept: ".csv,text/csv", onChange: onFile, style: { display: "none" } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Import jobs", onBack }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13.5, color: S.ink, lineHeight: 1.55 }, children: [
        "Bring an existing pipeline in from a CSV export. The header row is matched loosely \u2014 a",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: " job address" }),
        " column is required; customer name, zip, job owner, job value, stage, lead source, email, and phone are picked up when present."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "What imports and what doesn't", children: "Contact details, stage, value, and lead source come across. Consent does not \u2014 imported customers start with no SMS or email consent on file, because consent has to be collected, not inherited. Photos, estimates, and financials also stay behind; those live in whatever system produced the export." }),
      isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { width: "100%", marginTop: 12 }, onClick: () => fileRef.current && fileRef.current.click(), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { size: 15 }),
        " Choose CSV"
      ] }),
      !isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginTop: 12 }, children: "Importing is admin-only." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: !!parsed,
        onClose: () => setParsed(null),
        title: "Review import",
        footer: parsed && !parsed.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
          parsed.dupes > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: () => doImport(true), children: [
            "Skip ",
            parsed.dupes,
            " dupes"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { style: { flex: 1 }, onClick: () => doImport(false), children: [
            "Import all ",
            parsed.rows.length
          ] })
        ] }),
        children: [
          parsed && parsed.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Could not read that file", tone: "red", children: parsed.error }),
          parsed && !parsed.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700, marginBottom: 4 }, children: parsed.fileName }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 12 }, children: [
              parsed.rows.length,
              " rows parsed",
              parsed.dupes > 0 ? `, ${parsed.dupes} match an address already in the system` : "",
              "."
            ] }),
            parsed.unknownOwners.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Callout, { label: "Unrecognized job owners", children: [
              parsed.unknownOwners.join(", "),
              " ",
              parsed.unknownOwners.length === 1 ? "does" : "do",
              " not match a seat. Those jobs will be assigned to ",
              users[0] ? users[0].name : "the first seat",
              " \u2014 add the seats first if you want the assignments to land correctly."
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, fontWeight: 700, color: S.sub, margin: "14px 0 6px" }, children: "FIRST FIVE ROWS" }),
            parsed.rows.slice(0, 5).map((r, i2) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "9px 0", borderTop: `1px solid ${S.line}` }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, fontWeight: 700 }, children: r.name }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 2 }, children: r.address }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: (stages.find((st) => st.id === r.stageId) || {}).name }),
                r.value > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "blue", children: money(r.value) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: r.assignee.split(" ")[0] })
              ] })
            ] }, i2))
          ] })
        ]
      }
    )
  ] });
}
function TeamManager({ users, setUsers, currentUser, jobs, onBack, toast: toast2, brand: brand2 }) {
  const [editing, setEditing] = (0, import_react.useState)(null);
  const isAdmin = canManageSeats(currentUser);
  const blank = { name: "", email: "", phone: "", role: "rep", title: "Sales Rep", commissionRate: 60, active: true };
  const [f, setF] = (0, import_react.useState)(blank);
  const open = (u) => {
    setEditing(u || "new");
    setF(u ? { ...u } : blank);
  };
  const set = (k) => (e) => {
    const v = e && e.target ? e.target.type === "checkbox" ? e.target.checked : e.target.value : e;
    setF((p) => ({ ...p, [k]: v }));
  };
  const emailTaken = users.some((u) => u.email.toLowerCase() === f.email.trim().toLowerCase() && u.id !== (editing !== "new" && editing ? editing.id : null));
  const valid = f.name.trim() && /\S+@\S+\.\S+/.test(f.email.trim()) && !emailTaken;
  const [saving, setSaving] = (0, import_react.useState)(false);
  const [seatErr, setSeatErr] = (0, import_react.useState)("");
  const save = async () => {
    const auth = AUTH();
    setSeatErr("");
    setSaving(true);
    try {
      if (editing === "new") {
        if (auth) {
          await auth.inviteSeat({
            name: f.name.trim(),
            email: f.email.trim(),
            role: f.role,
            title: f.title,
            commission_rate: f.commissionRate
          });
          const all = await auth.listProfiles();
          setUsers(all.map(fromProfile));
          toast2(`Invite sent to ${f.email.trim()}`);
        } else {
          setUsers([...users, { ...f, id: uid("u"), email: f.email.trim(), name: f.name.trim(), addedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) }]);
          toast2("Seat created (demo mode \u2014 no invite sent)");
        }
      } else {
        const next = { ...editing, ...f, name: f.name.trim(), email: f.email.trim() };
        if (auth) await auth.updateProfile(editing.id, toProfile(next));
        setUsers(users.map((u) => u.id === editing.id ? next : u));
        toast2("Seat updated");
      }
      setEditing(null);
    } catch (e) {
      const msg = e && e.message ? e.message : "Could not save the seat.";
      const hint = /Failed to send a request|FunctionsFetchError|not found|Failed to fetch/i.test(msg) ? " \u2014 The invite-user Edge Function isn't deployed yet. Run `supabase functions deploy invite-user`, or add the user from the Supabase dashboard (Authentication \u2192 Users) for now." : "";
      setSeatErr(msg + hint);
    }
    setSaving(false);
  };
  const toggleActive = async (u) => {
    const auth = AUTH();
    const next = { ...u, active: !u.active };
    try {
      if (auth) await auth.updateProfile(u.id, toProfile(next));
      setUsers(users.map((x) => x.id === u.id ? next : x));
      toast2(u.active ? `${u.name} deactivated \u2014 login disabled` : `${u.name} reactivated`);
    } catch (e) {
      toast2(e && e.message ? e.message : "Could not update the seat.");
    }
  };
  const remove = (u) => {
    const assigned = jobs.filter((j) => j.assignee === u.name).length;
    if (assigned > 0) {
      toast2(`${u.name} has ${assigned} assigned job${assigned === 1 ? "" : "s"} \u2014 reassign first`);
      return;
    }
    setUsers(users.filter((x) => x.id !== u.id));
    toast2("Seat removed");
  };
  if (!isAdmin) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHeader, { title: "Team", onBack }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { style: { marginTop: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 18, color: S.sub, style: { flexShrink: 0, marginTop: 2 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, lineHeight: 1.55 }, children: "Seat management is admin-only. Ask the office to add, change, or deactivate a login." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Who's on the team" }),
        users.filter((u) => u.active).map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i ? `1px solid ${S.line}` : "none" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: 34, height: 34, borderRadius: 999, background: "#EEF1F4", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, color: S.sub }, children: u.name.split(" ").map((p) => p[0]).join("") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700 }, children: u.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: u.title })
          ] })
        ] }, u.id))
      ] })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SubHeader,
      {
        title: "Team & seats",
        onBack,
        right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, onClick: () => open(null), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }),
          " Add seat"
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, color: S.sub, lineHeight: 1.55 }, children: [
        "Every active seat is a login for ",
        brand2.company,
        ". Adding a seat emails an invite to set a password. Deactivating keeps the person's job history intact but blocks sign-in immediately.",
        !liveAuth() && " Demo mode \u2014 no backend connected, so invites are not actually sent."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 16, marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 20, fontWeight: 800 }, children: users.filter((u) => u.active).length }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: "Active seats" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 20, fontWeight: 800 }, children: users.filter((u) => !u.active).length }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub }, children: "Deactivated" })
        ] })
      ] })
    ] }),
    users.map((u) => {
      const assigned = jobs.filter((j) => j.assignee === u.name).length;
      const role = ROLES.find((r) => r.id === u.role);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pad: 16, style: { marginTop: 10, opacity: u.active ? 1 : 0.6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
            width: 40,
            height: 40,
            borderRadius: 999,
            flexShrink: 0,
            background: u.role === "admin" ? T.primary : T.accentSoft,
            color: u.role === "admin" ? "#fff" : T.accent,
            display: "grid",
            placeItems: "center",
            fontSize: 13,
            fontWeight: 800
          }, children: u.name.split(" ").map((p) => p[0]).join("") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700 }, children: u.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, overflow: "hidden", textOverflow: "ellipsis" }, children: u.email })
          ] }),
          !u.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "gray", children: "Disabled" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: u.role === "admin" ? "slate" : "blue", children: role ? role.label : u.role }),
          canSeeMoney(u) && u.role !== "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "gray", children: [
            u.commissionRate,
            "% rate"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: "gray", children: [
            assigned,
            " job",
            assigned === 1 ? "" : "s"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "ghost", small: true, style: { flex: 1 }, onClick: () => open(u), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { size: 13 }),
            " Edit"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", small: true, style: { flex: 1 }, onClick: () => toggleActive(u), children: u.active ? "Deactivate" : "Reactivate" }),
          u.id !== currentUser.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "danger", small: true, onClick: () => remove(u), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 13 }) })
        ] })
      ] }, u.id);
    }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: !!editing,
        onClose: () => setEditing(null),
        title: editing === "new" ? "Add a seat" : "Edit seat",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", style: { flex: 1 }, onClick: () => setEditing(null), children: "Cancel" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { flex: 2 }, disabled: !valid || saving, onClick: save, children: saving ? "Saving\u2026" : editing === "new" ? "Create seat & send invite" : "Save changes" })
        ] }),
        children: [
          seatErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { label: "Could not save", tone: "red", children: seatErr }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Full name *", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.name, onChange: set("name") }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Work email *", hint: emailTaken ? "That email already has a seat." : "This is their login. An invite to set a password goes here.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: { ...inputStyle, borderColor: emailTaken ? "#B42318" : S.line }, type: "email", value: f.email, onChange: set("email") }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Mobile", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.phone, inputMode: "tel", onChange: (e) => setF((p2) => ({ ...p2, phone: formatPhone(e.target.value) })) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Role", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: selStyle, value: f.role, onChange: (e) => {
            const r = ROLES.find((x) => x.id === e.target.value);
            setF((p) => ({ ...p, role: r.id, title: r.label }));
          }, children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: r.id, children: r.label }, r.id)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { background: T.accentSoft, borderRadius: 10, padding: "11px 13px", fontSize: 13, color: T.primary, marginBottom: 14, lineHeight: 1.5 }, children: (ROLES.find((r) => r.id === f.role) || {}).blurb }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Job title (shown in the app)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.title, onChange: set("title") }) }),
          (brand2.locations || []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Location", hint: "Documents and messages for this rep's jobs show this office's phone and address.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: f.locationId || "", onChange: (e) => setF((p2) => ({ ...p2, locationId: e.target.value || null })), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Head office" }),
            (brand2.locations || []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: l.id, children: l.label || l.address }, l.id))
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Direct phone", hint: "Shows on this rep's documents.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: f.repPhone || "", inputMode: "tel", onChange: (e) => setF((p2) => ({ ...p2, repPhone: formatPhone(e.target.value) })) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Work email", hint: "Used on their documents; falls back to the office address.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, type: "email", value: f.workEmail || "", onChange: (e) => setF((p2) => ({ ...p2, workEmail: e.target.value })) }) })
          ] }),
          f.role !== "crew" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Default commission rate (%)", hint: "Starting rate on new jobs. Can be changed per job by an admin.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              style: inputStyle,
              inputMode: "decimal",
              value: f.commissionRate,
              onChange: (e) => setF((p) => ({ ...p, commissionRate: num(e.target.value) }))
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", gap: 10, alignItems: "center", fontSize: 14 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: f.active, onChange: set("active"), style: { width: 18, height: 18 } }),
            "Seat active (can sign in)"
          ] })
        ]
      }
    )
  ] });
}
function MoreMenu({ onNav, onLogout, brand: brand2, currentUser }) {
  const items = [
    ["announcements", import_lucide_react.Megaphone, "Company announcements", "Posted to everyone's home screen"],
    ["activity", import_lucide_react.ClipboardList, "Activity feed", currentUser && (currentUser.role === "admin" || currentUser.role === "manager") ? "Everything the whole team has done" : "Everything you've done"],
    ["chat", import_lucide_react.MessageCircle, "Team chat", "Talk to the team \u2014 @ someone, tag a job"],
    ["insurance", import_lucide_react.Shield, "Insurance", "Clients, supplements, code lookup"],
    ["performance", import_lucide_react.PieChart, "Performance", "Rep scoreboard & funnel"],
    ["calendar", import_lucide_react.Calendar, "Calendar", "Schedule & material drops"],
    ["contacts", import_lucide_react.Users, "Contacts", "Every client, with consent status"],
    ["team", import_lucide_react.HardHat, "Team & seats", canManageSeats(currentUser) ? "Add users, roles, logins" : "Who's on the team"],
    ["crews", import_lucide_react.Wrench, "Crews", "Dispatch directory for work orders"],
    ["documents", import_lucide_react.FileText, "Documents", "Contracts, COIs, licenses, warranties"],
    ["pricelist", import_lucide_react.Package, "Price list", "Material costs and margins \u2014 CSV import"],
    ["templates", import_lucide_react.ScrollText, "Message templates", "Email and text, customer and crew"],
    ["integrations", import_lucide_react.Share2, "Integrations", "Gmail and text messaging"],
    ["import", import_lucide_react.Upload, "Import jobs", "Bring a pipeline in from CSV"],
    ["leadsources", import_lucide_react.Filter, "Lead sources", "Add or remove the options reps pick from"],
    ["vendors", import_lucide_react.Building2, "Vendors & suppliers", "Material suppliers and their account details"],
    ["reviews", import_lucide_react.Star, "Review automation", "Google review requests"],
    ["branding", import_lucide_react.Settings, "Company branding", "Name, colors, review link"]
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "20px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 24, fontWeight: 800, color: S.ink, marginBottom: 4 }, children: "More" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 4 }, children: brand2.company }),
    currentUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 13, fontWeight: 700, color: S.ink }, children: currentUser.name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: currentUser.role === "admin" ? "slate" : "blue", children: currentUser.title })
    ] }),
    items.map(([id, Icon, label, sub]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pad: 16, style: { marginBottom: 10, cursor: "pointer" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => onNav(id), style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      width: "100%",
      border: "none",
      background: "none",
      cursor: "pointer",
      textAlign: "left",
      padding: 0
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: 40, height: 40, borderRadius: 12, background: T.accentSoft, display: "grid", placeItems: "center", flexShrink: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 19, color: T.accent }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { flex: 1 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700, color: S.ink }, children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 2 }, children: sub })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { size: 17, color: "#C7CBD1" })
    ] }) }, id)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { kind: "danger", style: { width: "100%", marginTop: 8 }, onClick: onLogout, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.LogOut, { size: 15 }),
      " Sign out"
    ] })
  ] });
}
function Inbox({ jobs, onOpenJob, onCompose }) {
  const [filter, setFilter] = (0, import_react.useState)("All");
  const all = jobs.flatMap((j) => (j.messages || []).map((msg) => ({ job: j, msg }))).sort((x, y2) => (y2.msg.at || "").localeCompare(x.msg.at || ""));
  const list = all.filter(({ msg }) => {
    if (filter === "All") return true;
    if (filter === "Sent") return msg.status === "Sent";
    if (filter === "Queued") return msg.status !== "Sent";
    if (filter === "Viewed") return !!msg.viewed;
    return true;
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 16px 110px", background: S.bg, minHeight: "100vh" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 24, fontWeight: 800, color: S.ink }, children: "Inbox" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { small: true, onClick: onCompose, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 14 }),
        " New message"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, marginBottom: 12 }, children: ["All", "Sent", "Queued", "Viewed"].map((fl) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setFilter(fl), style: {
      border: `1.5px solid ${filter === fl ? T.accent : S.line}`,
      background: filter === fl ? T.accentSoft : "#fff",
      color: filter === fl ? T.accent : S.ink,
      borderRadius: 999,
      padding: "7px 14px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer"
    }, children: fl }, fl)) }),
    list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, lineHeight: 1.55 }, children: all.length === 0 ? "No messages yet. Send one from a job's Messages tab, or start with New message." : "Nothing matches this filter." }) }),
    list.map(({ job: job2, msg }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pad: 14, style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => onOpenJob(job2.id), style: { border: "none", background: "none", cursor: "pointer", textAlign: "left", padding: 0, width: "100%" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 7, alignItems: "center", minWidth: 0 }, children: [
          msg.kind === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { size: 14, color: T.accent }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageCircle, { size: 14, color: T.accent }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 14, fontWeight: 700, color: S.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: job2.name })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", gap: 5, flexShrink: 0 }, children: [
          msg.viewed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: "green", children: "Viewed" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { tone: msg.status === "Sent" ? "blue" : "amber", children: msg.status === "Sent" ? "Sent" : "Queued" })
        ] })
      ] }),
      msg.subject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13.5, fontWeight: 700, marginTop: 5 }, children: msg.subject }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
        fontSize: 13,
        color: S.sub,
        marginTop: 3,
        lineHeight: 1.5,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }, children: msg.body }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, color: S.sub, marginTop: 5 }, children: [
        msg.audience,
        " \xB7 ",
        msg.to,
        " \xB7 ",
        msg.at
      ] })
    ] }) }, msg.id)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: S.sub, marginTop: 16, lineHeight: 1.55 }, children: '"Viewed" tracking needs the email backend \u2014 it works by embedding a tiny pixel that fires when the recipient opens the message. It arrives with the Gmail integration, not before.' })
  ] });
}
var DB = () => typeof window !== "undefined" ? window.__SUPABASE__ || null : null;
var liveDb = () => !!DB();
var EMPTY_FIN = () => ({ costLines: [], reimbursements: [] });
function useBrandSync(brand2, setBrand, hasSession) {
  const lastSaved = (0, import_react.useRef)(null);
  const loadedOnce = (0, import_react.useRef)(false);
  const timer = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const db = DB();
    if (!db) return;
    let alive = true;
    db.from("crm_brand").select("data").eq("id", 1).maybeSingle().then(({ data, error }) => {
      if (!alive) return;
      if (!error && data && data.data && Object.keys(data.data).length) {
        lastSaved.current = data.data;
        setBrand((prev) => ({ ...prev, ...data.data }));
      }
      loadedOnce.current = true;
    });
    return () => {
      alive = false;
    };
  }, []);
  (0, import_react.useEffect)(() => {
    const db = DB();
    if (!db || !hasSession || !loadedOnce.current) return;
    if (JSON.stringify(brand2) === JSON.stringify(lastSaved.current)) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      lastSaved.current = brand2;
      db.from("crm_brand").upsert({ id: 1, data: brand2, updated_at: (/* @__PURE__ */ new Date()).toISOString() });
    }, 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [brand2, hasSession]);
}
function useDbSync(st) {
  const {
    ready,
    isCrew,
    userName,
    jobs,
    setJobs,
    appointments,
    setAppointments,
    activity,
    setActivity,
    chatMsgs,
    setChatMsgs,
    orgPack,
    unpackOrg
  } = st;
  const [hydrated, setHydrated] = (0, import_react.useState)(!liveDb());
  const [syncErr, setSyncErr] = (0, import_react.useState)("");
  const jobRefs = (0, import_react.useRef)(/* @__PURE__ */ new Map());
  const apptRefs = (0, import_react.useRef)(/* @__PURE__ */ new Map());
  const persistedActivity = (0, import_react.useRef)(/* @__PURE__ */ new Set());
  const persistedChat = (0, import_react.useRef)(/* @__PURE__ */ new Set());
  const orgTimer = (0, import_react.useRef)(null);
  const jobTimer = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const db = DB();
    if (!db || !ready) return;
    let alive = true;
    (async () => {
      try {
        const { data: orgRow, error: orgErr } = await db.from("crm_org").select("data").eq("id", 1).maybeSingle();
        if (orgErr) throw orgErr;
        if (!alive) return;
        if (orgRow && orgRow.data && Object.keys(orgRow.data).length) {
          unpackOrg(orgRow.data);
        } else {
          await db.from("crm_org").upsert({ id: 1, data: orgPack(), updated_at: (/* @__PURE__ */ new Date()).toISOString() });
        }
        const { data: jobRows, error: jErr } = await db.from("crm_jobs").select("id, data");
        if (jErr) throw jErr;
        let finMap = {};
        if (!isCrew) {
          const { data: finRows } = await db.from("crm_financials").select("job_id, data");
          (finRows || []).forEach((r) => {
            finMap[r.job_id] = r.data || {};
          });
        }
        const loadedJobs = (jobRows || []).map((r) => {
          const base = r.data || {};
          const fin = finMap[r.id] || {};
          return {
            ...base,
            id: r.id,
            financials: fin.financials || base.financials || EMPTY_FIN(),
            payments: fin.payments || base.payments || []
          };
        });
        if (!alive) return;
        loadedJobs.forEach((j) => jobRefs.current.set(j.id, j));
        setJobs(loadedJobs);
        const { data: apRows } = await db.from("crm_appointments").select("*");
        if (alive && apRows) {
          const aps = apRows.map((r) => ({ id: r.id, jobId: r.job_id, type: r.type, date: r.date, time: r.time || "", notes: r.notes || "" }));
          aps.forEach((a) => apptRefs.current.set(a.id, a));
          setAppointments(aps);
        }
        const { data: actRows } = await db.from("crm_activity").select("*").order("at", { ascending: false }).limit(300);
        if (alive && actRows) {
          const acts = actRows.map((r) => ({ id: r.id, at: String(r.at).slice(0, 16).replace("T", " "), by: r.by_name, kind: r.kind, jobId: r.job_id, jobName: r.job_name, text: r.body }));
          acts.forEach((a) => persistedActivity.current.add(a.id));
          setActivity(acts);
        }
        const { data: chatRows } = await db.from("crm_chat").select("*").order("at", { ascending: true }).limit(300);
        if (alive && chatRows) {
          const msgs = chatRows.map((r) => ({ id: r.id, at: String(r.at).slice(0, 16).replace("T", " "), by: r.by_name, text: r.body, mentions: r.mentions || [], jobId: r.job_id }));
          msgs.forEach((m) => persistedChat.current.add(m.id));
          setChatMsgs(msgs);
        }
        setSyncErr("");
      } catch (e) {
        if (alive) setSyncErr("Couldn't load saved data \u2014 check that the persistence migration has been run. " + (e && e.message ? e.message : ""));
      }
      if (alive) setHydrated(true);
    })();
    return () => {
      alive = false;
    };
  }, [ready]);
  (0, import_react.useEffect)(() => {
    const db = DB();
    if (!db || !ready) return;
    const ch = db.channel("crm-stream").on("postgres_changes", { event: "INSERT", schema: "public", table: "crm_chat" }, (payload) => {
      const r = payload.new;
      if (persistedChat.current.has(r.id)) return;
      persistedChat.current.add(r.id);
      setChatMsgs((prev) => prev.some((m) => m.id === r.id) ? prev : [...prev, { id: r.id, at: String(r.at).slice(0, 16).replace("T", " "), by: r.by_name, text: r.body, mentions: r.mentions || [], jobId: r.job_id }]);
    }).on("postgres_changes", { event: "INSERT", schema: "public", table: "crm_activity" }, (payload) => {
      const r = payload.new;
      if (persistedActivity.current.has(r.id)) return;
      persistedActivity.current.add(r.id);
      setActivity((prev) => prev.some((a) => a.id === r.id) ? prev : [{ id: r.id, at: String(r.at).slice(0, 16).replace("T", " "), by: r.by_name, kind: r.kind, jobId: r.job_id, jobName: r.job_name, text: r.body }, ...prev]);
    }).subscribe();
    return () => {
      db.removeChannel(ch);
    };
  }, [ready]);
  (0, import_react.useEffect)(() => {
    const db = DB();
    if (!db || !ready || !hydrated) return;
    if (jobTimer.current) clearTimeout(jobTimer.current);
    jobTimer.current = setTimeout(async () => {
      try {
        const current = new Map(jobs.map((j) => [j.id, j]));
        const changed = jobs.filter((j) => jobRefs.current.get(j.id) !== j);
        const removed = [...jobRefs.current.keys()].filter((id) => !current.has(id));
        if (changed.length) {
          const rows = changed.map((j) => {
            const { financials, payments, ...rest } = j;
            return { id: j.id, name: j.name, stage_id: j.stageId, assignee: j.assignee, data: rest, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
          });
          const { error } = await db.from("crm_jobs").upsert(rows);
          if (error) throw error;
          if (!isCrew) {
            const finRows = changed.map((j) => ({ job_id: j.id, data: { financials: j.financials, payments: j.payments }, updated_at: (/* @__PURE__ */ new Date()).toISOString() }));
            await db.from("crm_financials").upsert(finRows);
          }
          changed.forEach((j) => jobRefs.current.set(j.id, j));
        }
        if (removed.length) {
          await db.from("crm_jobs").delete().in("id", removed);
          removed.forEach((id) => jobRefs.current.delete(id));
        }
        setSyncErr("");
      } catch (e) {
        setSyncErr("Save failed \u2014 changes are on this device only. " + (e && e.message ? e.message : ""));
      }
    }, 1100);
    return () => {
      if (jobTimer.current) clearTimeout(jobTimer.current);
    };
  }, [jobs, ready, hydrated]);
  (0, import_react.useEffect)(() => {
    const db = DB();
    if (!db || !ready || !hydrated) return;
    const t = setTimeout(async () => {
      try {
        const current = new Map(appointments.map((a) => [a.id, a]));
        const changed = appointments.filter((a) => apptRefs.current.get(a.id) !== a);
        const removed = [...apptRefs.current.keys()].filter((id) => !current.has(id));
        if (changed.length) {
          await db.from("crm_appointments").upsert(changed.map((a) => ({
            id: a.id,
            job_id: a.jobId,
            type: a.type,
            date: a.date,
            time: a.time || null,
            notes: a.notes || null,
            created_by: userName
          })));
          changed.forEach((a) => apptRefs.current.set(a.id, a));
        }
        if (removed.length) {
          await db.from("crm_appointments").delete().in("id", removed);
          removed.forEach((id) => apptRefs.current.delete(id));
        }
      } catch {
      }
    }, 800);
    return () => clearTimeout(t);
  }, [appointments, ready, hydrated]);
  (0, import_react.useEffect)(() => {
    const db = DB();
    if (!db || !ready || !hydrated) return;
    const fresh = activity.filter((a) => !persistedActivity.current.has(a.id));
    if (!fresh.length) return;
    fresh.forEach((a) => persistedActivity.current.add(a.id));
    db.from("crm_activity").insert(fresh.map((a) => ({
      id: a.id,
      by_name: a.by,
      kind: a.kind,
      job_id: a.jobId || null,
      job_name: a.jobName || null,
      body: a.text
    }))).then(({ error }) => {
      if (error) fresh.forEach((a) => persistedActivity.current.delete(a.id));
    });
  }, [activity, ready, hydrated]);
  (0, import_react.useEffect)(() => {
    const db = DB();
    if (!db || !ready || !hydrated) return;
    const fresh = chatMsgs.filter((m) => !persistedChat.current.has(m.id) && m.by === userName);
    if (!fresh.length) return;
    fresh.forEach((m) => persistedChat.current.add(m.id));
    db.from("crm_chat").insert(fresh.map((m) => ({
      id: m.id,
      by_name: m.by,
      body: m.text,
      mentions: m.mentions || [],
      job_id: m.jobId || null
    }))).then(({ error }) => {
      if (error) fresh.forEach((m) => persistedChat.current.delete(m.id));
    });
  }, [chatMsgs, ready, hydrated]);
  const packStr = JSON.stringify(st.orgDeps);
  (0, import_react.useEffect)(() => {
    const db = DB();
    if (!db || !ready || !hydrated) return;
    if (orgTimer.current) clearTimeout(orgTimer.current);
    orgTimer.current = setTimeout(() => {
      db.from("crm_org").upsert({ id: 1, data: orgPack(), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).then(({ error }) => {
        if (error) setSyncErr("Settings save failed. " + error.message);
      });
    }, 1400);
    return () => {
      if (orgTimer.current) clearTimeout(orgTimer.current);
    };
  }, [packStr, ready, hydrated]);
  return { hydrated, syncErr };
}
function SupremeCRM() {
  const portalToken = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("portal") : null;
  if (portalToken) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicPortal, { token: portalToken });
  const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
  const [users, setUsers] = (0, import_react.useState)(SEED_USERS);
  const [booting, setBooting] = (0, import_react.useState)(liveAuth());
  const [authError, setAuthError] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    const auth = AUTH();
    if (!auth) return;
    let alive = true;
    const hydrate = async (session) => {
      if (!alive) return;
      if (!session) {
        setCurrentUser(null);
        setBooting(false);
        return;
      }
      try {
        const profile = await auth.loadProfile(session.user.id);
        if (!alive) return;
        setCurrentUser(fromProfile(profile));
        try {
          const all = await auth.listProfiles();
          if (alive && all) setUsers(all.map(fromProfile));
        } catch {
        }
        setAuthError("");
      } catch (e) {
        if (!alive) return;
        setAuthError("Signed in, but no profile exists for this account. An admin needs to create the seat.");
        setCurrentUser(null);
      }
      setBooting(false);
    };
    auth.getSession().then(hydrate);
    const off = auth.onChange(hydrate);
    return () => {
      alive = false;
      if (off) off();
    };
  }, []);
  const [crews, setCrews] = (0, import_react.useState)(SEED_CREWS);
  const [templates, setTemplates] = (0, import_react.useState)(SEED_TEMPLATES);
  const [companyDocs, setCompanyDocs] = (0, import_react.useState)(SEED_COMPANY_DOCS);
  const [priceList, setPriceList] = (0, import_react.useState)(SEED_PRICE_LIST);
  const [leadSources, setLeadSources] = (0, import_react.useState)([...LEAD_SOURCES]);
  const [vendors, setVendors] = (0, import_react.useState)([
    { id: "v1", name: "ABC Supply", contact: "", phone: "", email: "", account: "", notes: "", active: true },
    { id: "v2", name: "SRS Distribution", contact: "", phone: "", email: "", account: "", notes: "", active: true }
  ]);
  const [appointments, setAppointments] = (0, import_react.useState)([]);
  const [estimateTemplates, setEstimateTemplates] = (0, import_react.useState)([]);
  const [activity, setActivity] = (0, import_react.useState)([]);
  const [chatMsgs, setChatMsgs] = (0, import_react.useState)([]);
  const [announcements, setAnnouncements] = (0, import_react.useState)([]);
  const [chatSeenCount, setChatSeenCount] = (0, import_react.useState)(0);
  const [apptTypes, setApptTypes] = (0, import_react.useState)(["Inspection", "Adjuster meeting", "Estimate presentation", "Production start", "Final walkthrough"]);
  const [integrations, setIntegrations] = (0, import_react.useState)({
    /* Gmail is per-user: each rep connects their own mailbox so email
       goes out under their name and replies land in their inbox.
       SMS stays company-wide — 10DLC registration is per business. */
    gmailByUser: {},
    sms: { connected: false, provider: "", number: "" }
  });
  const [brand2, setBrand] = (0, import_react.useState)(DEFAULT_BRAND);
  const [stages, setStages] = (0, import_react.useState)(DEFAULT_STAGES);
  const [jobs, setJobs] = (0, import_react.useState)(() => liveDb() ? [] : seedJobs);
  const [nav, setNav] = (0, import_react.useState)("home");
  const [openJobId, setOpenJobId] = (0, import_react.useState)(null);
  const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
  const [workflowOpen, setWorkflowOpen] = (0, import_react.useState)(false);
  const [newLeadOpen, setNewLeadOpen] = (0, import_react.useState)(false);
  const [quickTaskOpen, setQuickTaskOpen] = (0, import_react.useState)(false);
  const [inboxPick, setInboxPick] = (0, import_react.useState)(false);
  const [qt, setQt] = (0, import_react.useState)({ jobId: "", label: "", due: "", time: "" });
  const [toastMsg, setToastMsg] = (0, import_react.useState)("");
  const [filters, setFilters] = (0, import_react.useState)({ sort: "updated", assignees: [], stages: [], sources: [] });
  const [reviewSettings, setReviewSettings] = (0, import_react.useState)({
    enabled: true,
    delayHours: 24,
    followUpDays: 3,
    template: "Hi {first_name}, thank you for trusting {company} with your home! If we earned it, a quick Google review means the world to our small team: {review_link}"
  });
  const orgDeps = [announcements, stages, leadSources, apptTypes, templates, estimateTemplates, priceList, companyDocs, crews, vendors, reviewSettings];
  const orgPack = () => ({
    announcements,
    stages,
    leadSources,
    apptTypes,
    templates,
    estimateTemplates,
    priceList,
    companyDocs,
    crews,
    vendors,
    reviewSettings,
    version: 1
  });
  const unpackOrg = (d) => {
    if (d.announcements) setAnnouncements(d.announcements);
    if (d.stages) setStages(d.stages);
    if (d.leadSources) setLeadSources(d.leadSources);
    if (d.apptTypes) setApptTypes(d.apptTypes);
    if (d.templates) setTemplates(d.templates);
    if (d.estimateTemplates) setEstimateTemplates(d.estimateTemplates);
    if (d.priceList) setPriceList(d.priceList);
    if (d.companyDocs) setCompanyDocs(d.companyDocs);
    if (d.crews) setCrews(d.crews);
    if (d.vendors) setVendors(d.vendors);
    if (d.reviewSettings) setReviewSettings(d.reviewSettings);
  };
  const syncUserName = currentUser ? currentUser.name : "Demo";
  useBrandSync(brand2, setBrand, liveAuth() ? !!currentUser : true);
  const { hydrated, syncErr } = useDbSync({
    ready: liveAuth() ? !!currentUser : true,
    isCrew: !!(currentUser && currentUser.role === "crew"),
    userName: syncUserName,
    jobs,
    setJobs,
    appointments,
    setAppointments,
    activity,
    setActivity,
    chatMsgs,
    setChatMsgs,
    orgPack,
    unpackOrg,
    orgDeps
  });
  T.primary = brand2.primary || "#28373E";
  T.accent = brand2.accent || "#1B6DE0";
  T.accentSoft = brand2.accentSoft && brand2.accentSoftCustom ? brand2.accentSoft : softOf(T.accent);
  const logAct = (entry) => setActivity((prev) => [{
    id: uid("act"),
    at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " "),
    by: userName,
    ...entry
  }, ...prev].slice(0, 500));
  const unreadMentions = chatMsgs.slice(chatSeenCount).filter((m2) => m2.mentions && m2.mentions.includes(userName)).length;
  const prevChatLen = (0, import_react.useRef)(0);
  (0, import_react.useEffect)(() => {
    const fresh = chatMsgs.slice(prevChatLen.current);
    const forMe = fresh.filter((m2) => m2.mentions && m2.mentions.includes(userName) && m2.by !== userName);
    if (forMe.length > 0) toast2(`${forMe[forMe.length - 1].by} mentioned you in team chat`);
    prevChatLen.current = chatMsgs.length;
  }, [chatMsgs]);
  const toast2 = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2200);
  };
  const applyJob = (id, fn) => setJobs((prev) => prev.map((j) => j.id === id ? { ...fn(j), updated: "just now", touchedAt: Date.now() } : j));
  const mutJob = (id, fn) => fn ? applyJob(id, fn) : (f2) => applyJob(id, f2);
  const moveStage = (jobId, stageId) => {
    const jb = jobs.find((x) => x.id === jobId);
    const stage = stages.find((x) => x.id === stageId);
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, stageId, daysInStage: 0, updated: "just now" } : j));
    if (jb && stage) {
      logAct({ kind: "stage", jobId, jobName: jb.name, text: `moved ${jb.name} to "${stage.label}"` });
      toast2(`Moved to ${stage.label}`);
    }
  };
  const applyRemovedStages = (nextStages) => {
    const ids = new Set(nextStages.map((s) => s.id));
    setJobs((prev) => prev.map((j) => ids.has(j.stageId) ? j : { ...j, stageId: nextStages[0].id }));
    setStages(nextStages);
  };
  const createLead = (f) => {
    const id = uid("j");
    const at = nowStamp();
    const repSeat = users.find((u) => u.name === f.assignee);
    const rate = repSeat && repSeat.commissionRate != null ? repSeat.commissionRate : 60;
    setJobs((prev) => [{
      id,
      name: `${f.first} ${f.last}`.trim(),
      address: [f.street, f.city, f.stateSel].filter(Boolean).join(", "),
      zip: f.zip.trim(),
      state: f.stateSel,
      lat: f.lat ?? null,
      lng: f.lng ?? null,
      value: 0,
      stageId: stages[0].id,
      assignee: f.assignee,
      leadSource: f.leadSource || "\u2014",
      daysInStage: 0,
      updated: "just now",
      claimType: f.claimType,
      schedDate: null,
      phone: f.phone,
      email: f.email,
      consent: {
        sms: { granted: f.smsConsent, at: f.smsConsent ? at : null, source: f.smsConsent ? "New lead form" : null },
        email: { granted: f.emailConsent, at: f.emailConsent ? at : null, source: f.emailConsent ? "New lead form" : null }
      },
      insurance: f.claimType === "Insurance" ? {
        carrier: f.carrier,
        policy: f.policy,
        claim: f.claim,
        adjusterName: f.adjusterName,
        adjusterPhone: f.adjusterPhone,
        adjusterEmail: "",
        deductible: f.deductible,
        coverage: f.coverage,
        oLaw: f.oLaw,
        endorsements: { rps: f.rps, cosmetic: f.cosmetic, windHailDed: f.windHailDed, acvRoof: f.acvRoof, matching: f.matching }
      } : null,
      checklist: { ...BLANK_CHECKLIST },
      measurements: { ...BLANK_MEASURE },
      estimate: mkEstimate(),
      contract: mkContract(),
      photos: [],
      tasks: [{ id: uid("t"), label: "Schedule inspection", done: false }],
      files: [],
      payments: [],
      fin: { materials: [], labor: [], other: [], commissionRate: rate, structure: "grossProfit", overheadPct: 10, reimbursements: [] },
      portal: { estimate: false, contract: false, photos: false, invoice: false },
      crewId: null,
      messages: [],
      workOrder: null,
      review: { sent: false, clicked: false, posted: false }
    }, ...prev]);
    logAct({ kind: "lead", jobId: job.id, jobName: job.name, text: `created new lead ${job.name} (${job.leadSource})` });
    toast2("Lead created");
    setOpenJobId(id);
    setNav("jobs");
  };
  if (booting || liveAuth() && currentUser && !hydrated) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#fff" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center" }, children: [
      brand2.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: brand2.logo, alt: brand2.company, style: { height: 64, maxWidth: 200, objectFit: "contain", margin: "0 auto 14px", display: "block" } }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
        width: 56,
        height: 56,
        borderRadius: 14,
        background: brand2.primary,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontWeight: 800,
        margin: "0 auto 14px"
      }, children: brand2.short }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub }, children: "Loading\u2026" })
    ] }) });
  }
  if (!currentUser) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Login, { brand: brand2, users, onLogin: setCurrentUser }),
      authError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        maxWidth: 420,
        margin: "0 auto",
        background: "#FDECEC",
        border: "1px solid #F3C7C3",
        borderRadius: 12,
        padding: "12px 14px",
        fontSize: 13,
        color: "#B42318",
        lineHeight: 1.5,
        zIndex: 80
      }, children: authError })
    ] });
  }
  const liveUser = users.find((u) => u.id === currentUser.id) || currentUser;
  if (!liveUser.active) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: S.bg }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { maxWidth: 380, textAlign: "center" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 28, color: S.sub }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 16, fontWeight: 700, marginTop: 10 }, children: "This seat has been deactivated" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: S.sub, marginTop: 6 }, children: "Contact the office to restore access." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { kind: "ghost", style: { width: "100%", marginTop: 16 }, onClick: async () => {
        const a = AUTH();
        if (a) {
          try {
            await a.signOut();
          } catch (e) {
          }
        }
        setCurrentUser(null);
      }, children: "Back to sign in" })
    ] }) });
  }
  const userName = liveUser.name;
  const isAdmin = canEditStructure(liveUser);
  const showMoney = canSeeMoney(liveUser);
  const openJob = openJobId ? jobs.find((j) => j.id === openJobId) : null;
  const openJobScreen = (id) => {
    setOpenJobId(id);
    setNav("jobs");
  };
  const backToBoard = () => setOpenJobId(null);
  const NavBtn = ({ id, icon: Icon, label, badge = 0 }) => {
    const active = nav === id && !openJob;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => {
      setNav(id);
      setOpenJobId(null);
    }, style: {
      flex: 1,
      border: "none",
      background: "none",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
      padding: "8px 0"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { position: "relative", display: "inline-grid" }, children: [
        badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
          position: "absolute",
          top: -5,
          right: -9,
          minWidth: 16,
          height: 16,
          borderRadius: 99,
          background: "#B42318",
          color: "#fff",
          fontSize: 10,
          fontWeight: 800,
          display: "grid",
          placeItems: "center",
          padding: "0 4px",
          zIndex: 1
        }, children: badge }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 21, color: active ? T.accent : "#9CA3AF", strokeWidth: active ? 2.4 : 2 })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, fontWeight: active ? 700 : 500, color: active ? T.accent : "#9CA3AF" }, children: label })
    ] });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontFamily: "'Inter','SF Pro Text',system-ui,-apple-system,sans-serif", background: S.bg, minHeight: "100vh" }, children: [
    openJob ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      JobDetail,
      {
        job: openJob,
        stages,
        brand: brand2,
        onBack: backToBoard,
        onMoveStage: moveStage,
        mut: mutJob(openJob.id),
        toast: toast2,
        reviewSettings,
        currentUser: liveUser,
        showMoney,
        isAdmin,
        crews,
        setCrews,
        templates,
        integrations,
        users,
        estimateTemplates,
        setEstimateTemplates,
        setBrand,
        onLog: logAct,
        leadSources,
        activity
      }
    ) : nav === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      liveDb() && jobs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { margin: "14px 16px 0", background: "#EAF6EE", border: "1px solid #CDE8D6", borderRadius: 12, padding: "12px 14px", fontSize: 13, color: "#177245", lineHeight: 1.5 }, children: "Fresh database \u2014 no demo customers here. Everything you create now saves for real. Have a Roofr export? More \u2192 Import jobs pulls your whole pipeline in." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { paddingTop: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementBar, { announcements }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Dashboard,
        {
          jobs,
          stages,
          onOpenJob: openJobScreen,
          userName,
          go: setNav,
          onNewLead: () => setNewLeadOpen(true),
          onQuickTask: () => setQuickTaskOpen(true)
        }
      )
    ] }) : nav === "jobs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      JobBoard,
      {
        jobs,
        stages,
        filters,
        onOpenFilters: () => setFiltersOpen(true),
        onOpenWorkflow: () => setWorkflowOpen(true),
        onOpenJob: openJobScreen,
        onMoveStage: moveStage,
        onNewLead: () => setNewLeadOpen(true)
      }
    ) : nav === "inbox" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { jobs, onOpenJob: openJobScreen, onCompose: () => setInboxPick(true) }) : nav === "more" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreMenu, { brand: brand2, onNav: setNav, onLogout: async () => {
      const a = AUTH();
      if (a) {
        try {
          await a.signOut();
        } catch (e) {
        }
      }
      setCurrentUser(null);
    }, currentUser: liveUser }) : nav === "insurance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsuranceHub, { jobs, onBack: () => setNav("more"), onOpenJob: openJobScreen, toast: toast2 }) : nav === "performance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Performance,
      {
        jobs,
        stages,
        users,
        onBack: () => setNav("more"),
        isAdmin,
        currentUser: liveUser,
        toast: toast2
      }
    ) : nav === "calendar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      CalendarView,
      {
        jobs,
        onBack: () => setNav("more"),
        onOpenJob: openJobScreen,
        appointments,
        setAppointments,
        apptTypes,
        setApptTypes,
        toast: toast2,
        onLog: logAct,
        onQueueMessage: (jobId, msg) => mutJob(jobId, (j) => ({ ...j, messages: [...j.messages, { ...msg, id: uid("m") }] }))
      }
    ) : nav === "contacts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contacts, { jobs, onBack: () => setNav("more"), onOpenJob: openJobScreen }) : nav === "reviews" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      ReviewSettings,
      {
        settings: reviewSettings,
        setSettings: setReviewSettings,
        jobs,
        onBack: () => setNav("more"),
        brand: brand2,
        setBrandFromReviews: setBrand,
        mut: mutJob,
        toast: toast2
      }
    ) : nav === "announcements" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      AnnouncementManager,
      {
        announcements,
        setAnnouncements,
        currentUser: liveUser,
        onBack: () => setNav("more"),
        toast: toast2
      }
    ) : nav === "activity" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityFeed, { activity, currentUser: liveUser, onOpenJob: openJobScreen, onBack: () => setNav("more") }) : nav === "chat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      TeamChat,
      {
        msgs: chatMsgs,
        setMsgs: setChatMsgs,
        users,
        jobs,
        currentUser: liveUser,
        onOpenJob: openJobScreen,
        onBack: () => {
          setChatSeenCount(chatMsgs.length);
          setNav("more");
        }
      }
    ) : nav === "vendors" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      VendorManager,
      {
        vendors,
        setVendors,
        currentUser: liveUser,
        onBack: () => setNav("more"),
        toast: toast2
      }
    ) : nav === "leadsources" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      LeadSourceManager,
      {
        sources: leadSources,
        setSources: setLeadSources,
        jobs,
        onBack: () => setNav("more"),
        toast: toast2
      }
    ) : nav === "import" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      JobImport,
      {
        jobs,
        setJobs,
        stages,
        users,
        onBack: () => setNav("more"),
        toast: toast2,
        currentUser: liveUser
      }
    ) : nav === "documents" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      CompanyDocs,
      {
        docs: companyDocs,
        setDocs: setCompanyDocs,
        currentUser: liveUser,
        onBack: () => setNav("more"),
        toast: toast2
      }
    ) : nav === "pricelist" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      PriceListManager,
      {
        list: priceList,
        setList: setPriceList,
        currentUser: liveUser,
        onBack: () => setNav("more"),
        toast: toast2
      }
    ) : nav === "templates" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      TemplateManager,
      {
        templates,
        setTemplates,
        currentUser: liveUser,
        onBack: () => setNav("more"),
        toast: toast2,
        brand: brand2
      }
    ) : nav === "crews" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      CrewManager,
      {
        crews,
        setCrews,
        currentUser: liveUser,
        jobs,
        onBack: () => setNav("more"),
        toast: toast2
      }
    ) : nav === "integrations" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Integrations,
      {
        integrations,
        setIntegrations,
        currentUser: liveUser,
        users,
        onBack: () => setNav("more"),
        toast: toast2
      }
    ) : nav === "team" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      TeamManager,
      {
        users,
        setUsers,
        currentUser: liveUser,
        jobs,
        onBack: () => setNav("more"),
        toast: toast2,
        brand: brand2
      }
    ) : nav === "branding" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandingEditor, { brand: brand2, setBrand, onBack: () => setNav("more"), toast: toast2 }) : null,
    syncErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 90,
      background: "#7A1D12",
      color: "#fff",
      fontSize: 12.5,
      lineHeight: 1.45,
      padding: "9px 14px",
      textAlign: "center"
    }, children: syncErr }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: "#fff",
      borderTop: `1px solid ${S.line}`,
      display: "flex",
      alignItems: "center",
      paddingBottom: "env(safe-area-inset-bottom)"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBtn, { id: "home", icon: import_lucide_react.Home, label: "Home" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBtn, { id: "jobs", icon: import_lucide_react.Briefcase, label: "Jobs" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setNewLeadOpen(true), style: {
        border: "none",
        cursor: "pointer",
        background: T.accent,
        color: "#fff",
        width: 52,
        height: 52,
        borderRadius: 999,
        display: "grid",
        placeItems: "center",
        margin: "0 10px",
        transform: "translateY(-12px)",
        boxShadow: "0 6px 16px rgba(27,109,224,.35)",
        flexShrink: 0
      }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 25 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBtn, { id: "inbox", icon: import_lucide_react.MessageCircle, label: "Inbox" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBtn, { id: "more", icon: import_lucide_react.Menu, label: "More", badge: unreadMentions })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewLeadSheet, { open: newLeadOpen, onClose: () => setNewLeadOpen(false), onCreate: createLead, brand: brand2, leadSources, users }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, { open: inboxPick, onClose: () => setInboxPick(false), title: "Message a customer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: S.sub, marginBottom: 10 }, children: "Pick who this is going to \u2014 the composer opens on their job with templates ready." }),
      jobs.filter((j) => !DEAD_STAGES.includes(j.stageId)).map((j, i2) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => {
        setInboxPick(false);
        openJobScreen(j.id);
      }, style: {
        width: "100%",
        textAlign: "left",
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: "12px 4px",
        borderTop: i2 ? `1px solid ${S.line}` : "none"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14.5, fontWeight: 700, color: S.ink }, children: j.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: S.sub, marginTop: 2 }, children: j.address }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, marginTop: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: j.consent.email.granted ? "green" : "gray", children: [
            "email ",
            j.consent.email.granted ? "\u2713" : "\u2014"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { tone: j.consent.sms.granted ? "green" : "gray", children: [
            "sms ",
            j.consent.sms.granted ? "\u2713" : "\u2014"
          ] })
        ] })
      ] }, j.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Sheet,
      {
        open: quickTaskOpen,
        onClose: () => setQuickTaskOpen(false),
        title: "Quick task",
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { style: { width: "100%" }, disabled: !qt.jobId || !qt.label.trim(), onClick: () => {
          const target = jobs.find((j) => j.id === qt.jobId);
          mutJob(qt.jobId, (j) => ({ ...j, tasks: [...j.tasks, { id: uid("t"), label: qt.label.trim(), done: false, due: qt.due || null, time: qt.time || null }] }));
          logAct({ kind: "task", jobId: qt.jobId, jobName: target ? target.name : "", text: `added task "${qt.label.trim()}"${qt.due ? ` due ${qt.due}` : ""}${target ? ` on ${target.name}` : ""}` });
          setQuickTaskOpen(false);
          setQt({ jobId: "", label: "", due: "", time: "" });
          toast2("Task added");
        }, children: "Add task" }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Customer / job", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: selStyle, value: qt.jobId, onChange: (e) => setQt({ ...qt, jobId: e.target.value }), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "Select\u2026" }),
            jobs.filter((j) => !DEAD_STAGES.includes(j.stageId)).map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: j.id, children: [
              j.name,
              " \u2014 ",
              j.address
            ] }, j.id))
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Task", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle, value: qt.label, onChange: (e) => setQt({ ...qt, label: e.target.value }), placeholder: "Call adjuster back, order materials\u2026" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Deadline (optional)", hint: "Tasks with deadlines show on the calendar.", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: { ...inputStyle, flex: 1 }, type: "date", value: qt.due, onChange: (e) => setQt({ ...qt, due: e.target.value }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: { ...inputStyle, width: 110 }, type: "time", value: qt.time || "", onChange: (e) => setQt({ ...qt, time: e.target.value }) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      FiltersSheet,
      {
        open: filtersOpen,
        onClose: () => setFiltersOpen(false),
        stages,
        filters,
        setFilters
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      WorkflowEditor,
      {
        open: workflowOpen,
        onClose: () => setWorkflowOpen(false),
        stages,
        setStages: applyRemovedStages
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toast, { msg: toastMsg })
  ] });
}
