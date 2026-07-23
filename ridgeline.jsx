import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Home, Briefcase, Plus, MessageCircle, Menu, Search, SlidersHorizontal,
  ChevronDown, ChevronRight, ChevronLeft, X, Check, GripVertical, Camera,
  FileText, DollarSign, ClipboardList, Settings, Star, Phone, Mail,
  MapPin, Download, LogOut, Users, Calendar as CalIcon, PieChart, Pencil, Trash2,
  ArrowUpDown, Image as ImageIcon, CheckCircle2, Circle, Send, Eye, Shield,
  BookOpen, Printer, Copy, PenLine, Landmark, Package, Receipt, HardHat,
  Share2, Upload, AlertTriangle, RefreshCw, Building2, ScrollText, Wrench,
  Scale, Lightbulb, ExternalLink, Lock, Layers
} from "lucide-react";

/* ================================================================
   BRANDING — single source of company identity. Everything company-
   specific (login, documents, portal, review sends) reads from here.
   ================================================================ */
const DEFAULT_BRAND = {
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
  googleReviewLink: "https://g.page/r/your-review-link/review",
};

/* ================================================================
   JURISDICTIONS — zip-driven. Sample records for the markets Supreme
   works (OH / KY / IL). Inspector contacts are placeholders to be
   verified and completed by the office before field use.
   ================================================================ */
/* Official source links — merged from the Ridgeline repo, so every cite in
   the app can be checked against the actual published text before it's used
   in a supplement. */
const SOURCES = {
  RCO: { name: "Residential Code of Ohio (OAC 4101:8)", url: "https://codes.ohio.gov/ohio-administrative-code/4101:8", publisher: "Ohio Legislative Service Commission — official text" },
  OAC3901: { name: "OAC 3901-1-54 — Unfair Property/Casualty Claims", url: "https://codes.ohio.gov/ohio-administrative-code/rule-3901-1-54", publisher: "Ohio Administrative Code — official text" },
  ORC3951: { name: "ORC Chapter 3951 — Public Insurance Adjusters", url: "https://codes.ohio.gov/ohio-revised-code/chapter-3951", publisher: "Ohio Revised Code — official text" },
  ORC1345: { name: "ORC Chapter 1345 — Consumer Sales Practices (3-day rescission)", url: "https://codes.ohio.gov/ohio-revised-code/chapter-1345", publisher: "Ohio Revised Code — official text" },
  ICC: { name: "ICC Digital Codes (IRC / state editions)", url: "https://codes.iccsafe.org", publisher: "International Code Council" },
  KYDHBC: { name: "Kentucky Dept. of Housing, Buildings & Construction", url: "https://dhbc.ky.gov", publisher: "Commonwealth of Kentucky — code adoption authority" },
  MUNICODE: { name: "Municode Library (IL municipal ordinances)", url: "https://library.municode.com", publisher: "Municipal code hosting — verify adoption + edition" },
  ORC3901_20: { name: "ORC 3901.20 — Unfair and deceptive acts", url: "https://codes.ohio.gov/ohio-revised-code/section-3901.20", publisher: "Ohio Revised Code — official text" },
};

const JURISDICTIONS = {
  "45240": {
    zip: "45240", city: "Forest Park", county: "Hamilton County", state: "OH",
    codeName: "Residential Code of Ohio (RCO)", codeEdition: "2024 edition",
    adoption: "Statewide residential code",
    permit: "Roofing permit required for full replacement; verify with the building department.",
    inspector: { office: "Forest Park Building Department", phone: "(513) 555-0100 — sample, verify", address: "1201 W Kemper Rd, Forest Park, OH" },
    verified: true, sources: ["RCO", "OAC3901"], verifiedDetail: { date: "Jul 2026", by: "Office" },
  },
  "45410": {
    zip: "45410", city: "Dayton", county: "Montgomery County", state: "OH",
    codeName: "Residential Code of Ohio (RCO)", codeEdition: "2024 edition",
    adoption: "Statewide residential code",
    permit: "Permit required; verify regional building services handling for residential.",
    inspector: { office: "City of Dayton — Building Inspection", phone: "(937) 555-0100 — sample, verify", address: "371 W 2nd St, Dayton, OH" },
    verified: true, sources: ["RCO", "OAC3901"], verifiedDetail: { date: "Jul 2026", by: "Office" },
  },
  "45056": {
    zip: "45056", city: "Oxford", county: "Butler County", state: "OH",
    codeName: "Residential Code of Ohio (RCO)", codeEdition: "2024 edition",
    adoption: "Statewide residential code",
    permit: "Roofing permit required for tear-off and re-roof.",
    inspector: { office: "Butler County Building Department", phone: "(513) 555-0100 — sample, verify", address: "130 High St, Hamilton, OH" },
    verified: true, sources: ["RCO", "OAC3901"], verifiedDetail: { date: "Jul 2026", by: "Office" },
  },
  "43235": {
    zip: "43235", city: "Columbus", county: "Franklin County", state: "OH",
    codeName: "Residential Code of Ohio (RCO)", codeEdition: "2024 edition",
    adoption: "Statewide residential code",
    permit: "City of Columbus permit required for re-roofing.",
    inspector: { office: "Columbus Building & Zoning Services", phone: "(614) 555-0100 — sample, verify", address: "111 N Front St, Columbus, OH" },
    verified: true, sources: ["RCO", "OAC3901"], verifiedDetail: { date: "Jul 2026", by: "Office" },
  },
  "41179": {
    zip: "41179", city: "Vanceburg", county: "Lewis County", state: "KY",
    codeName: "Kentucky Residential Code (KRC)", codeEdition: "Current KRC — verify edition",
    adoption: "Statewide residential code",
    permit: "Verify permit handling with the county building official before tear-off.",
    inspector: { office: "Lewis County Building Official", phone: "(606) 555-0100 — sample, verify", address: "Vanceburg, KY" },
    verified: false, sources: ["KYDHBC", "ICC"], verifiedDetail: { date: null, by: null },
  },
  "41056": {
    zip: "41056", city: "Maysville", county: "Mason County", state: "KY",
    codeName: "Kentucky Residential Code (KRC)", codeEdition: "Current KRC — verify edition",
    adoption: "Statewide residential code",
    permit: "Verify with the Maysville building official before tear-off.",
    inspector: { office: "City of Maysville Building Inspector", phone: "(606) 555-0100 — sample, verify", address: "216 Bridge St, Maysville, KY" },
    verified: false, sources: ["KYDHBC", "ICC"], verifiedDetail: { date: null, by: null },
  },
  "60014": {
    zip: "60014", city: "Crystal Lake", county: "McHenry County", state: "IL",
    codeName: "Adopted IRC (local amendment)", codeEdition: "Locally adopted IRC — verify edition & amendments",
    adoption: "Illinois has no statewide residential code; adoption is municipal.",
    permit: "City roofing permit required; local amendments apply.",
    inspector: { office: "Crystal Lake Community Development", phone: "(815) 555-0100 — sample, verify", address: "100 W Woodstock St, Crystal Lake, IL" },
    verified: false, sources: ["MUNICODE", "ICC"], verifiedDetail: { date: null, by: null },
  },
};

/* Code provisions by state + topic. OH cites are Supreme's validated
   library; KY & IL are structured but flagged for verification
   against the locally adopted edition before sending. */
const CODE_PROVISIONS = {
  OH: {
    iceBarrier: { cite: "RCO R905.1.2", note: "Ice barrier from eave edge to at least 24 in. inside the exterior wall line, measured along the slope.", verified: true },
    tearOff: { cite: "RCO R908.3", note: "Recover prohibited over two or more layers or water-soaked / deteriorated covering — full tear-off required.", verified: true },
    dripEdge: { cite: "RCO R905.2.8.5", note: "Drip edge required at eaves and rakes on shingle roofs.", verified: true },
    underlayment: { cite: "RCO R905.1.1", note: "Double-layer underlayment (or self-adhering membrane) on slopes 2:12 up to 4:12.", verified: true },
    ventilation: { cite: "RCO R806.2", note: "Default required ratio is 1/150. The 1/300 exception applies only with a balanced system — 40 to 50 percent of net free area in the upper portion, balance at the eaves.", verified: true },
    fastening: { cite: "RCO R905.2.5", note: "4 nails per shingle minimum; 6-nail where manufacturer or wind zone requires.", verified: true },
    decking: { cite: "RCO R803 / R908.3", note: "Sheathing must be structurally sound; recover over unsound decking prohibited.", verified: true },
  },
  KY: {
    iceBarrier: { cite: "KRC R905.1.2 — verify edition", note: "Ice barrier to 24 in. inside exterior wall line (IRC-based; confirm KY amendments).", verified: false },
    tearOff: { cite: "KRC R908.3 — verify edition", note: "Recover prohibited over 2+ layers or deteriorated covering (confirm KY amendments).", verified: false },
    dripEdge: { cite: "KRC R905.2.8.5 — verify edition", note: "Drip edge at eaves and rakes (confirm KY amendments).", verified: false },
    underlayment: { cite: "KRC R905.1.1 — verify edition", note: "Low-slope double underlayment 2:12–4:12 (confirm KY amendments).", verified: false },
    ventilation: { cite: "KRC R806.2 — verify edition", note: "Balanced attic ventilation (confirm KY amendments).", verified: false },
    fastening: { cite: "KRC R905.2.5 — verify edition", note: "Fastening per code minimum and manufacturer spec (confirm).", verified: false },
    decking: { cite: "KRC R803 — verify edition", note: "Structurally sound sheathing required (confirm).", verified: false },
  },
  IL: {
    iceBarrier: { cite: "Adopted IRC R905.1.2 — verify municipality", note: "Ice barrier per the locally adopted IRC edition — Illinois adoption is municipal.", verified: false },
    tearOff: { cite: "Adopted IRC R908.3 — verify municipality", note: "Tear-off requirements per local adopted edition.", verified: false },
    dripEdge: { cite: "Adopted IRC R905.2.8.5 — verify municipality", note: "Drip edge per local adopted edition.", verified: false },
    underlayment: { cite: "Adopted IRC R905.1.1 — verify municipality", note: "Low-slope underlayment per local adopted edition.", verified: false },
    ventilation: { cite: "Adopted IRC R806.2 — verify municipality", note: "Ventilation per local adopted edition.", verified: false },
    fastening: { cite: "Adopted IRC R905.2.5 — verify municipality", note: "Fastening per local adopted edition and manufacturer spec.", verified: false },
    decking: { cite: "Adopted IRC R803 — verify municipality", note: "Sheathing requirements per local adopted edition.", verified: false },
  },
};

/* ================================================================
   OHIO CODE PROVISIONS — canonical list.
   One entry per requirement. Where sources disagree on a section
   number, `conflict` records the alternate so nobody quotes a cite
   in writing without checking it first.
   ================================================================ */
const PROVISION_TOPICS = [
  { topic: "Re-cover / maximum layers", oh: "RCO R908.3", srcOH: "RCO",
    note: "No third layer. Two existing layers means a full tear-off is required — the carrier owes tear-off scope, not a layover. Document the layer count before any mitigation." },
  { topic: "Ice barrier", oh: "RCO R905.1.2", srcOH: "RCO",
    note: "Ohio sits in IECC Climate Zones 4A and 5A, so ice barrier applies statewide. Required from the eave edge to at least 24 in. inside the warm wall line, measured along the slope. Must meet ASTM D1970. On 8:12 and steeper, 36 in. up-slope minimum." },
  { topic: "Drip edge", oh: "RCO R905.2.8.5", srcOH: "RCO",
    conflict: "Some field references cite R905.2.8.3 for drip edge. The subsection numbering shifts between IRC editions and Ohio adoptions — confirm against the edition your jurisdiction enforces before putting a number in a supplement letter.",
    note: "Required at BOTH eaves and rakes. Minimum 1/4 in. below the sheathing, extending 2 in. onto the deck. Underlayment laps over the drip edge at eaves and under it at rakes. Scope includes material, labor, and R&R." },
  { topic: "Step flashing", oh: "RCO R905.2.8.4", srcOH: "RCO",
    note: "Required where a sloped roof meets a vertical wall. Minimum 4 in. x 4 in. per piece, one per shingle course. Cannot be reused after tear-off — reinstalling damaged flashing does not comply." },
  { topic: "Kickout / diverter flashing", oh: "RCO R703.4", srcOH: "RCO",
    note: "Required where a roof edge terminates at a sidewall. Diverts runoff away from the wall assembly; without it water tracks behind the siding. One of the most commonly omitted line items in a carrier scope." },
  { topic: "Decking / sheathing", oh: "RCO R908.6 and R803", srcOH: "RCO",
    note: "Decking must be inspected at re-roof. Non-conforming sheathing (3/8 in. plank, skip sheathing) or rotted decking must be replaced — a re-cover over unsound decking is prohibited. Cost is owed under Ordinance & Law where the policy carries it." },
  { topic: "Underlayment (low slope)", oh: "RCO R905.1.1", srcOH: "RCO",
    note: "Two layers of underlayment required on slopes from 2:12 up to less than 4:12, or self-adhering membrane throughout. Catches porch roofs, dormers, and additions." },
  { topic: "Attic ventilation", oh: "RCO R806.2", srcOH: "RCO",
    note: "Default required ratio is 1/150 of the ventilated area. The 1/300 exception only applies with a balanced system — 40 to 50 percent of the net free area in the upper portion with the balance at the eaves. Most older Ohio homes do not qualify, so 1/150 governs and the carrier owes the upgrade at re-roof. Inadequate ventilation also voids every major shingle warranty." },
  { topic: "Fastening", oh: "RCO R905.2.5", srcOH: "RCO",
    note: "Four nails per shingle minimum, six where the manufacturer or wind zone requires it. Installation must follow the manufacturer's instructions, which is itself a code requirement." },
  { topic: "Water-resistive barrier", oh: "RCO R703.2", srcOH: "RCO",
    note: "Required behind exterior veneer — minimum one layer of #15 felt or an approved WRB. On a siding replacement, damaged WRB must be replaced. A scope that pays for siding but not housewrap is short." },
  { topic: "Vinyl siding", oh: "RCO R703.11 / ASTM D3679", srcOH: "RCO",
    note: "Must comply with ASTM D3679 and be installed per ASTM D4756. Reusing removed vinyl is rarely feasible — UV embrittlement breaks the locking flange during removal. Document this for the matching argument." },
  { topic: "Matching (insurance regulation)", oh: "OAC 3901-1-54(I)(1)(b)", srcOH: "OAC3901",
    note: "Replacement items must be of like kind and quality with reasonably comparable appearance. This is the regulation behind full-slope and full-roof arguments when the shingle is discontinued." },
];

/* Supplement templates reference a TOPIC and render with the cite for
   the job's state — one template library, three jurisdictions. */
const SUPPLEMENT_TEMPLATES = [
  {
    id: "sup-ice", topic: "iceBarrier", category: "Code-required upgrades",
    title: "Ice barrier — extension to wall line",
    scenario: "Scope shows ice & water only at the drip edge (about 3 ft) instead of the code-required extension to 24 in. past the exterior wall line, measured along the slope.",
    lineItems: ["Ice & water shield — additional LF to extend coverage 24 in. past exterior wall line.", "On slopes 8:12 and steeper: minimum 36 in. up-slope from the eave."],
    docs: ["Photo of eave overhang with tape measure in frame.", "Slope measurement for the affected planes."],
    wording: "Per {CITE}, ice barrier is required to extend from the eave edge to a point at least 24 inches inside the exterior wall line, measured along the slope. The current scope provides only a 3-foot strip at the eave. The overhang on this property is [X inches], requiring [Y LF] of additional ice & water shield to bring the installation to code. Please add [Y LF] to the approved scope.",
  },
  {
    id: "sup-tear", topic: "tearOff", category: "Code-required upgrades",
    title: "Full tear-off required by code",
    scenario: "Roof has two or more existing layers, or the first layer is deteriorated, and the adjuster's scope specifies a recover / overlay.",
    lineItems: ["Full tear-off labor (replacing overlay scope).", "Additional dumpster / disposal fees.", "Protection for landscaping, siding, and gutters during tear-off."],
    docs: ["Photo at the roof edge showing layer count.", "Close-ups of deteriorated first-layer areas."],
    wording: "Per {CITE}, roof recover is not permitted where the existing roof has two or more applications of covering, or where the existing covering is water-soaked or deteriorated. This property has [X layers / a deteriorated first layer, documented in the attached photos]. A recover is not code-compliant on this roof. Please update the approved scope from recover to full tear-off, adding [$X for tear-off labor and disposal].",
  },
  {
    id: "sup-drip", topic: "dripEdge", category: "Code-required upgrades",
    title: "Drip edge — all eaves and rakes",
    scenario: "Scope excludes new drip edge on a full re-roof, or includes it at eaves only and not rakes.",
    lineItems: ["Drip edge — total eave LF plus total rake LF.", "On homes without existing drip edge: mark as required-by-code addition."],
    docs: ["Measurement report showing eave and rake totals."],
    wording: "Per {CITE}, drip edge is required at both eaves and rakes of shingle roofs on new installations. The current scope [excludes drip edge / includes it only at eaves]. This property has [X LF of eaves] and [Y LF of rakes]; drip edge is required on all [X+Y] linear feet. Please add [X+Y LF] to the approved scope.",
  },
  {
    id: "sup-under", topic: "underlayment", category: "Code-required upgrades",
    title: "Underlayment — double layer on low slope",
    scenario: "One or more slopes fall between 2:12 and 4:12 (porch roofs, dormers, additions) and the scope specs single-layer underlayment.",
    lineItems: ["Double-layer underlayment or self-adhering membrane for the low-slope squares.", "Additional labor for two-layer application."],
    docs: ["Pitch measurement of each affected slope.", "Photos identifying the low-slope planes."],
    wording: "Per {CITE}, asphalt shingle underlayment on slopes of 2:12 up to less than 4:12 must be installed in two layers (or self-adhering underlayment throughout). This property has [porch roof / dormer / addition] at a measured pitch of [X:12], below the 4:12 threshold. Please add double-layer underlayment for [X squares] of low-slope area to the approved scope.",
  },
  {
    id: "sup-vent", topic: "ventilation", category: "Code-required upgrades",
    title: "Attic ventilation to code",
    scenario: "Existing ventilation is out of compliance (blocked soffit intake, gable-only, single-source, or insufficient net free area) and the adjuster excludes upgrades as betterment.",
    lineItems: ["Ridge vent LF (or box vent count) sized for the attic square footage.", "Soffit vent installation or reconditioning.", "Baffles at each rafter bay where required for airflow."],
    docs: ["Attic photos showing existing intake and exhaust.", "Attic square footage and net-free-area math."],
    wording: "Per {CITE}, attic ventilation must meet the required net-free-area ratio — 1/150 by default, or 1/300 only where a balanced intake-and-exhaust system exists. The existing system on this property is [gable only / blocked soffit / undersized ridge], which does not meet the balanced requirement. Reinstalling the non-compliant system on the new roof would violate code. Please add [ridge vent LF, soffit intake, and baffles] to the approved scope. Ordinance & Law coverage applies if included in the policy.",
  },
  {
    id: "sup-deck", topic: "decking", category: "Structural — discovered during work",
    title: "Decking replacement",
    scenario: "Deteriorated decking discovered during tear-off; adjuster wants to exclude it as maintenance or pre-existing.",
    lineItems: ["Deck replacement — SF of 7/16 in. or 1/2 in. OSB or plywood matching existing.", "Fasteners and labor for deck replacement.", "Dumpster surcharge if additional load."],
    docs: ["Photo of each failed section with a tape measure for scale.", "Total SF per replaced section.", "Attic view of the same area if accessible."],
    wording: "During tear-off on [date], we identified [X SF] of deteriorated roof sheathing that will not hold fasteners and cannot serve as an adequate base for new roofing. Per {CITE}, a recover over unsound decking is prohibited and sheathing must be structurally sound. This deck replacement is code-required, not maintenance. Please add [X SF] of decking replacement to the approved scope.",
  },
  {
    id: "sup-fast", topic: "fastening", category: "Manufacturer requirements",
    title: "Enhanced fastening / high-wind installation",
    scenario: "The specified shingle line requires 6-nail installation for its wind warranty, and the adjuster's scope specifies standard 4-nail.",
    lineItems: ["Enhanced fastening / 6-nail installation labor rate (typically ~15% above standard).", "Additional fasteners."],
    docs: ["Manufacturer spec sheet for the specified shingle line.", "Wind-warranty tier documentation."],
    wording: "Per {CITE}, the code minimum is 4 nails per shingle in standard wind zones, with 6-nail installation required where manufacturer specifications require it. The specified shingle line, [product name], requires 6-nail installation to qualify for the [warranty tier] wind warranty. Please update the approved scope to include enhanced-fastening installation for the full roof area of [X squares].",
  },
];

/* Do / Don't — merged from the Ridgeline repo (fuller field-tested version,
   replaces the earlier placeholder pair). */
const INSURANCE_DO = [
  ["Document everything, then document more", "Dated photos, test squares, layer counts, attic shots. The adjuster reads what's in the file — make sure the file says what you mean."],
  ["Cite the code, not your opinion", "Every scope argument ties to an RCO section or the OAC matching rule. Print the cite, hand it over, stay friendly."],
  ["Be present at the adjuster meeting", "Walk the roof together, point to the documented damage, agree on the test square counts on site."],
  ["Put supplements in writing with evidence attached", "Line items, code cites, dated photos, measurements. Follow the carrier's supplement channel and log every contact."],
];
const INSURANCE_DONT = [
  ["Don't negotiate coverage or settlement", "That is licensed public adjuster or attorney work under ORC Chapter 3951. Supreme documents damage and provides its own scope — nothing more."],
  ["Don't interpret the policy for the homeowner", "Point to the dec page and endorsements, suggest they ask their agent or a public adjuster. Never promise what the policy will pay."],
  ["Don't offer to absorb or rebate the deductible", "Deductible games are insurance fraud exposure for everyone involved, including the homeowner."],
  ["Don't promise claim outcomes to close a deal", "Sell the inspection and the documentation quality. The claim decision belongs to the carrier."],
];

/* Ohio Insurance Law summaries — guidance, not legal advice; confirm current
   text at the linked official source before relying on it in a dispute. */
const LAW_ITEMS = [
  { title: "Matching — OAC 3901-1-54(I)(1)(b)", src: "OAC3901",
    body: "Where replacing an item leaves a mismatch, the carrier owes replacement of items in the area so the result is like kind and quality with reasonably comparable appearance. This is the lever behind full-slope and full-roof arguments when the shingle line is discontinued or the field is heavily weathered." },
  { title: "Written matching explanation — OAC 3901-1-54(I)(2)", src: "OAC3901",
    body: "If a carrier limits matching, it must give the insured a written explanation of the policy provision it is relying on. Always demand that explanation in writing — it either produces a citable position you can rebut, or it produces silence you can escalate." },
  { title: "Claim handling deadlines — OAC 3901-1-54", src: "OAC3901",
    body: "The carrier must acknowledge a claim within 15 days, complete its investigation within 21 days, and decide within a reasonable time after. Missed deadlines are documentable and belong in any escalation letter or Department of Insurance complaint." },
  { title: "Insured's right to choose the contractor — R.C. 3901.20", src: "ORC3901_20",
    body: "The homeowner picks who does the work. A carrier steering the insured to a preferred vendor is an unfair practice. Tell homeowners this early — many assume they must use whoever the adjuster names." },
  { title: "Bad faith — Hoskins v. Aetna (Ohio 1983)", src: "OAC3901",
    body: "An insurer that denies or delays without reasonable justification commits a separate tort beyond breach of contract. Slow-pay, lowball scopes, and blanket refusal of code-required items are the evidence pattern. This is attorney territory — Supreme documents, counsel argues." },
  { title: "Appraisal — Schwartz v. Standard Fire (Ohio 2008)", src: "OAC3901",
    body: "Confirms the appraisal clause for amount-of-loss disputes. Each side names a competent, disinterested appraiser; the two select an umpire; any two of the three signing binds the award. Appraisal resolves amount, not coverage." },
  { title: "Public adjusters — ORC Chapter 3951", src: "ORC3951",
    body: "Negotiating coverage or settlement for the homeowner requires a public adjuster license, and a contractor cannot act as the public adjuster on the same loss. Supreme documents damage and provides its own scope — nothing beyond that." },
  { title: "Deductible rebating is a felony — R.C. 2913.47 / R.C. 3999.21", src: "ORC1345",
    body: "Waiving, rebating, absorbing, or offering to pay a homeowner's deductible on an insurance claim is insurance fraud in Ohio, chargeable as a felony. Do not offer it, do not imply it, do not build it into a price. This is the single fastest way to lose a license and a company." },
  { title: "Three-day right to cancel — R.C. 1345 (CSPA)", src: "ORC1345",
    body: "A contract signed at the home is a home solicitation sale and carries a three-business-day cancellation right, with the notice required in the contract itself. Do not start work or order materials inside the window without a documented, permitted waiver." },
  { title: "Large contract disclosures — R.C. 4722", src: "ORC1345",
    body: "Home construction service contracts above the statutory threshold (commonly cited at $25,000) carry additional written disclosure requirements. Confirm the current threshold and required language with counsel before using a contract form on larger jobs." },
  { title: "Statute of limitations — R.C. 2305.06", src: "ORC1345",
    body: "Six years on written contracts following the 2021 amendment. Policy suit-limitation clauses are frequently shorter than the statute, so the contractual deadline usually governs — read the policy, do not assume six years." },
  { title: "No statewide roofing license — R.C. 4740", src: "ORC1345",
    body: "Ohio licenses commercial trades but has no statewide residential roofing contractor license. Cities and counties may still require local registration, so confirm the jurisdiction before pulling a permit." },
];

const ESCALATION_LADDER = [
  ["Re-inspection", "Request in writing, inside the policy's time limit. Ask specifically for a senior adjuster or a second set of eyes, and attach the documentation the first inspection missed."],
  ["Appraisal", "Invoke the policy's appraisal clause for amount-of-loss disputes. Each side names an appraiser, the two pick an umpire, two of three signatures bind. Does not resolve coverage questions."],
  ["Public adjuster referral", "For coverage disputes rather than pricing. Must be an ORC 3951 licensed PA — and it cannot be Supreme."],
  ["Ohio Department of Insurance complaint", "Consumer Services, 1-800-686-1526. A complaint typically moves the file to a senior adjuster and creates a regulatory record of the handling."],
  ["Bad-faith referral", "Coverage counsel, on the Hoskins v. Aetna standard. Refer — do not argue bad faith yourself."],
];

const KEY_CONTACTS = [
  ["Ohio Dept. of Insurance — Consumer Services", "1-800-686-1526", "insurance.ohio.gov"],
  ["Ohio Board of Building Standards", "", "com.ohio.gov/divisions/dico/bbs"],
  ["GAF Technical Services", "1-800-ROOF-411", "gaf.com"],
  ["Owens Corning Technical Services", "1-800-GET-PINK", "owenscorning.com"],
  ["CertainTeed Technical Services", "1-800-233-8990", "certainteed.com"],
  ["NOAA Storm Prediction Center — hail reports", "", "spc.noaa.gov/climo/online/sps"],
  ["NOAA Storm Events database", "", "ncdc.noaa.gov/stormevents"],
];


const POLICY_CARDS = [
  { title: "Ordinance & Law Coverage", body: "Often listed as Coverage D or Increased Cost of Construction on HO-3 policies. Pays for costs incurred to bring the property into current code compliance as part of a covered loss. Without it, the carrier only owes the pre-loss condition — code-required upgrades come out of the homeowner's pocket.",
    callout: { label: "Check for", text: "percentage of Coverage A dwelling amount (10%, 25%, 50%), or a flat dollar limit. Some policies exclude it entirely, some include it automatically. If absent, decking replacement and ventilation upgrades required by code become the homeowner's cost." } },
  { title: "RCV vs ACV Settlement", body: "Replacement Cost Value: carrier pays the full cost to replace with like kind and quality, minus deductible. Depreciation is initially withheld and released upon completion of the work. Actual Cash Value: carrier pays RCV minus depreciation. Depreciation is not recoverable.",
    callout: { label: "Common trap", text: "A roof-age endorsement can convert an otherwise-RCV policy to ACV on the roof specifically after a certain roof age (often 15 or 20 years). Homeowner may not know this. Read the endorsement pages, not just the declarations." } },
  { title: "Roof Payment Schedule (RPS) endorsement", body: "An RPS (also sold as Roof Surface Payment Schedule, Roof Settlement Schedule, or Scheduled Roof Coverage) replaces normal RCV settlement on the roof with a fixed payout table based on roof age and material. A 15-year-old architectural shingle roof might settle at 50% or 40% of replacement cost — regardless of condition, regardless of how well it was maintained, and the shortfall is not recoverable depreciation. It is not depreciation and completing the work does not release it.",
    callout: { label: "How to spot it and what to do", text: "Look for a schedule table in the endorsement pages — rows of roof ages against payout percentages. If it's there, tell the homeowner the number before you write the contract, not after the check arrives. Their out-of-pocket is the deductible PLUS the scheduled shortfall. Two things still move: the schedule usually applies only to the roof surface, so gutters, flashing, vents, siding, and interior damage should still settle at normal RCV; and Ordinance & Law is a separate coverage that is not subject to the schedule. Scope those separately so they don't get swept into the reduced roof number." } },
  { title: "Cosmetic damage exclusion / cosmetic-only endorsement", body: "Excludes hail or wind damage that marks the surface without affecting the roof's ability to shed water. Increasingly common on renewals in hail-prone counties, and sometimes applied to metals (gutters, vents, caps) separately from shingles.",
    callout: { label: "Check for", text: "\"cosmetic,\" \"appearance only,\" \"does not affect function\" in the endorsement schedule. The counter is functional evidence: fractured mat under the impact, granule displacement exposing asphalt, broken seal strips, reduced service life. Document function separately from appearance — a spatter photo alone plays into the exclusion." } },
  { title: "Wind/hail deductible — percentage vs. flat", body: "A separate, higher deductible applying only to wind and hail losses, often expressed as a percentage of Coverage A rather than a flat dollar amount. On a $400,000 dwelling, a 2% wind/hail deductible is $8,000 — not the $1,000 all-perils figure the homeowner remembers.",
    callout: { label: "Before you quote a job", text: "Read the deductible line on the dec page for a separate wind/hail entry and calculate the actual dollar figure off Coverage A. This is the single most common surprise that kills a signed job at check time. Never quote the homeowner's out-of-pocket from the all-perils deductible on a storm claim." } },
  { title: "ACV-only roof endorsement (roof age trigger)", body: "Converts an otherwise-RCV policy to ACV settlement on the roof once the roof passes a set age, commonly 15 or 20 years. Distinct from an RPS: ACV uses conventional depreciation rather than a fixed schedule, but the practical effect is the same — a large non-recoverable gap.",
    callout: { label: "Check for", text: "\"actual cash value roof,\" \"roof surfaces,\" or a roof-age condition in the endorsement pages. If the roof is near the trigger age, confirm the roof's documented age — an incorrect age on file has been corrected before with permit records or prior invoices." } },
  { title: "Matching Endorsement", body: "Some carriers offer an optional endorsement that expands the state matching regulation and explicitly requires uniform-appearance repairs including full replacement of undamaged sections when necessary. Others explicitly limit matching to a single slope or single side of a wall.",
    callout: { label: "Check for", text: "\"matching,\" \"uniform appearance,\" \"cosmetic\" language in the policy schedule and any endorsements. Some carriers add a cosmetic-damage exclusion that specifically strips matching for hail spatter without functional damage." } },
];

const DOC_GROUPS = [
  { title: "Roof photos", items: [
    "Wide shot of every slope from the ground — all four elevations.",
    "Two close-ups per slope showing the shingle field.",
    "Chalked test squares, 10 ft x 10 ft, minimum two per slope, hit count written in frame.",
    "Close-up of each individual impact with a ruler or coin for scale.",
    "Step flashing, valley, rake, and eave details.",
    "Two examples of clean undamaged shingle — needed for the matching argument.",
    "Back-of-shingle markings, plant code, and measured dimensions.",
    "Cellophane release strip.",
    "Layer count — probe at the gutter line or a vent penetration.",
    "Underlayment type where visible at a penetration.",
  ]},
  { title: "Soft metals and collateral damage", items: [
    "Vent caps and range or kitchen vents.",
    "Gutter aprons, gutters, and downspouts.",
    "Plumbing boots.",
    "Satellite dish.",
    "AC condenser fins — hail dents show clearly on aluminum.",
    "Painted surfaces: doors, fascia, trim.",
    "Window screens — tears and splits.",
    "Wood elements: rake board splintering, fascia.",
    "Garage door — dents on raised panels.",
    "Each siding elevation, wide and detail.",
  ]},
  { title: "Measurements", items: [
    "Pitch of every distinct slope.",
    "Square count per slope.",
    "Linear feet: valley, rake, eave, ridge, hip.",
    "Penetration count and type.",
    "Step flashing and wall flashing linear feet.",
    "Shingle width, height, and exposure — this drives the discontinued-product argument.",
  ]},
  { title: "Paper trail", items: [
    "Policy declarations page — front, back, and all endorsement pages.",
    "Roof age: homeowner statement, MLS listing, or prior claim record.",
    "NOAA hail report for the address and loss date.",
    "NWS storm event report.",
    "Building permit history from the jurisdiction.",
    "Prior claim history (CLUE report where available).",
    "Carrier's loss summary.",
    "Adjuster name, license number, and claim phone.",
    "Signed contract with the three-day right-to-cancel notice.",
    "Manufacturer do-not-mix bulletin, printed.",
  ]},
  { title: "Identification record", items: [
    "Shingle manufacturer, line, and approximate year.",
    "Plant code.",
    "Measured width, height, and exposure.",
    "Ridge, hip, and starter type and condition.",
    "Underlayment type where visible.",
    "Decking type and thickness — probe at a vent.",
    "Number of layers.",
    "Ventilation system: intake and exhaust, both.",
    "Skylight type and age.",
    "Chimney flashing condition.",
  ]},
];

/* Line items to check for on every insurance scope before signing off. */
const SUPPLEMENT_TRIGGERS = [
  ["Drip edge — full perimeter", "RCO R905.2.8.5 (verify subsection)"],
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
  ["Detach & reset — satellite, solar, lighting", "Scope"],
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
  { q: "“We'll only pay for the damaged slope”",
    setup: "Adjuster acknowledges wind or hail damage but scopes only the affected slope, leaving the other slopes with the original shingles.",
    answer: [
      "If shingle line is discontinued or field is significantly weathered, cite OAC 3901-1-54(I)(1)(b) — reasonably comparable appearance.",
      "Document color-match failure with photos of a manufacturer sample vs field shingles under matched lighting.",
      "If the roof has 2+ layers, cite RCO R908.3 — recover is prohibited, so partial replacement on top of the existing bottom layer is not code-compliant either.",
      "Re-walk the slopes the adjuster called undamaged before conceding them — a lower hit count is not no damage. Even where the rear slope genuinely has fewer impacts, the matching regulation still drives toward uniform appearance.",
    ]},
  { q: "“Just layer new shingles over the existing”",
    setup: "Adjuster proposes an overlay to save money.",
    answer: [
      "Count the layers. If two or more, cite RCO R908.3 — recover is not permitted.",
      "If first layer is water-damaged, cite same section — unsuitable base prohibits recover regardless of layer count.",
      "Point out that a code violation is a policy problem for the carrier: the homeowner would be occupying a non-code-compliant structure funded by the claim.",
    ]},
  { q: "“Decking replacement is not covered”",
    setup: "Deteriorated decking is discovered during tear-off. Adjuster wants to exclude it as maintenance.",
    answer: [
      "If the policy has Ordinance & Law (Coverage D), deck replacement required by code is covered under that coverage even if not covered by dwelling coverage.",
      "Cite RCO R908.3 and R803 — recovering over unsound sheathing is prohibited.",
      "Photograph every replaced board with scale, log square footage, submit as supplement with dated photos.",
      "Check the policy declarations page before promising O&L coverage — not every homeowner has it.",
    ]},
  { q: "“A strip of ice & water at the eave is enough”",
    setup: "Adjuster's scope includes ice & water at the drip edge only, not the full 24-inch-past-wall-line coverage.",
    answer: [
      "Cite RCO R905.1.2 — the barrier must extend from the eave edge to a point at least 24 inches inside the exterior wall line, measured along the slope.",
      "Measure the overhang depth: eave-to-wall distance plus 24 inches gives you the required coverage measured up the slope.",
      "Slope 8:12 or steeper needs 36 inches up the slope minimum.",
    ]},
  { q: "“Reuse the existing flashings”",
    setup: "Common on step flashings, chimney counter-flashings, and skylight kits.",
    answer: [
      "Cite RCO R905.2.8 — flashings must be sized and installed to prevent water intrusion. Reused flashings damaged during tear-off do not satisfy this requirement.",
      "Photograph the existing condition to preempt the argument: rust, caulk-sealed joints, missing counter-flashing on masonry, undersized step flashing.",
      "New skylight flashing kit is standard scope on any re-roof; the skylight manufacturer's warranty typically requires new flashing with any new roof.",
    ]},
  { q: "“Ventilation upgrade is a betterment”",
    setup: "Adjuster excludes new ridge vent, soffit intake, or box vent replacement as an improvement not caused by the loss.",
    answer: [
      "The default required ratio under RCO R806.2 is 1/150; the 1/300 exception applies only where a balanced intake-and-exhaust system exists. Most older homes do not qualify, so reinstalling the existing non-compliant system on a code-triggered re-roof is a violation.",
      "Ordinance & Law coverage applies if the policy includes it.",
      "If the existing system was itself damaged by the storm (ridge cap blown off, box vent housing hail-struck), that alone is covered damage regardless of code.",
    ]},
  { q: "“It's just wear and tear”",
    setup: "Adjuster denies hail damage as normal aging or wear, or claims granule loss is not impact-related.",
    answer: [
      "Document impact patterns with the HAAG-style test square (a chalked 10-foot square, count of hits per slope).",
      "Document circular, offset, or spatter patterns distinguishing hail from mechanical or manufacturing defects.",
      "For an aged roof that also has hail impact, granule loss at impact sites (fractured mat under the impact) is diagnostic of storm damage. Photograph in raking light.",
      "Brittleness test on a cool day is more reliable than on hot; document date and temperature.",
      "Request the carrier's engineer report if damage is denied on that basis.",
      "Where the carrier blames installation or age rather than the storm, Ohio applies efficient proximate cause: if the covered peril was the predominant cause, the loss is covered even with contributing factors. Pin the storm date with NWS wind data and NOAA hail reports, and document neighboring properties.",
    ]},
  { q: "“Roof is too old for full replacement value”",
    setup: "Adjuster settles on Actual Cash Value only, or applies a roof-age depreciation schedule that reduces the payment significantly.",
    answer: [
      "Check the policy: does it pay Replacement Cost Value (RCV) with recoverable depreciation, or ACV only? If RCV, the homeowner recovers the withheld depreciation on completion of the work.",
      "Watch for a roof-age endorsement that converts RCV to ACV past a set age — read the endorsement pages.",
      "Document maintained, serviceable condition to push back on aggressive depreciation: no prior leaks, intact flashing, sound decking.",
    ]},
];

const MORE_SCENARIOS = [
  { q: "“Cosmetic damage only — granule loss isn't functional”",
    setup: "The carrier concedes hail struck the roof but treats the damage as appearance-only and declines replacement.",
    answer: [
      "Granules are the UV shield for the asphalt mat. Once impact displaces them the mat degrades faster and the manufacturer warranty is compromised — that is functional loss, not appearance.",
      "Document what a spatter photo alone will not show: fractured mat beneath the impact, and seal strips that have released and will not re-seal.",
      "Ask in writing whether the carrier is relying on a specific cosmetic-damage exclusion by endorsement. If there is no such endorsement, physical damage from a covered peril is covered — see Resources, Policy Provisions.",
    ]},
  { q: "“We won't pay for drip edge or kickout — the house never had them”",
    setup: "The carrier declines code-required components on the grounds that the pre-loss roof did not include them.",
    answer: [
      "Pre-loss absence is not the standard. The new installation has to pass inspection, and it cannot without these components.",
      "Cite the specific sections: drip edge RCO R905.2.8.5 (confirm the subsection against your jurisdiction's adopted edition), step flashing RCO R905.2.8.4, kickout RCO R703.4.",
      "Where the policy carries Ordinance & Law, code-driven upgrades fall under that coverage specifically. Check the declarations page before asserting it.",
    ]},
  { q: "“Your estimate is too high — our software says less”",
    setup: "The carrier anchors to an estimating platform's price list and treats it as the ceiling.",
    answer: [
      "Estimating software is a pricing reference, not the policy. The obligation is the reasonable cost to repair at local market rates.",
      "Document what the price list misses: code-driven line items, R&R of metals, disposal, permit fees, and the actual local labor rate.",
      "On larger multi-trade losses, overhead and profit is a normal component of a general contractor's price and should be scoped as such.",
    ]},
  { q: "“ACV now — you'll get the depreciation when the work is done”",
    setup: "Standard on a recoverable-depreciation policy, but it becomes a problem when the release is slow or conditioned on paperwork nobody explained.",
    answer: [
      "Confirm first that the depreciation is actually recoverable. If a Roof Payment Schedule or ACV-roof endorsement applies, the shortfall is NOT recoverable and the homeowner needs to hear that before signing.",
      "Ask up front what the carrier requires to release it — typically a certificate of completion and the final invoice. Send it the day the job closes.",
      "Once submitted, OAC 3901-1-54 timelines apply. Persistent slow-pay after a complete submission is documentable and belongs in an escalation.",
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

const CHEAT_SHEET = {
  levers: [
    ["2+ layers", "RCO R908.3 forbids recover."],
    ["Deteriorated first layer", "RCO R908.3 forbids recover."],
    ["Shingle discontinued", "OAC 3901-1-54(I)(1)(b) requires reasonably comparable appearance."],
  ],
  scope: [
    ["Ice barrier 24 in. past wall line", "RCO R905.1.2"],
    ["New drip edge on all eaves/rakes", "RCO R905.2.8.5"],
    ["New step/counter flashing", "RCO R905.2.8"],
    ["Ventilation to code ratio — 1/150 default", "RCO R806.2"],
    ["Double underlayment on < 4:12 slope", "RCO R905.1.1"],
    ["4-nail (or 6 in high-wind) fastening", "RCO R905.2.5"],
  ],
  ol: "Ordinance & Law coverage (Coverage D): check the declarations page. Percentage of Coverage A. Pays for code-driven upgrades. If it's not there, decking replacement is on the homeowner.",
  docs: "Documentation minimums: ground of all elevations, layer count at edge, test square per slope, damage close-ups with scale, ventilation type & condition, flashing condition, attic if accessible, dated on every photo.",
  line: "The line you don't cross: Supreme documents damage and provides its own scope. Supreme does not negotiate coverage under the policy. That's public adjuster or attorney work — ORC Chapter 3951.",
};

/* ================================================================
   SHINGLE IDENTIFICATION — the backbone of the matching argument.
   Width is the fastest discriminator in the field. Dimensions in
   inches: w = width (course height), l = length, exp = exposure.
   Verify against the manufacturer's current literature before
   attaching any of it to a supplement.
   ================================================================ */
const SHINGLE_RULES = [
  ["Laminate under 38 in. long", "Always discontinued. No current laminate is made below this size."],
  ["38 3/4 in. long", "Either CertainTeed Landmark (current) or one of four discontinued lines — old OC Oakridge Pro 30, old Elk 30, old Atlas, old Tamko. Back-of-shingle markings tell them apart."],
  ["39 3/8 in. long", "Current standard for most makers, BUT pre-2008 Owens Corning, pre-2008 GAF, pre-2010 OC Duration, and pre-2018 GAF Timberline HD are all discontinued at this size. Date the roof."],
  ["CertainTeed at 36 in. (English size)", "Pre-2005. CertainTeed's Ohio plant converted to metric in 2005 — anything English-size is discontinued."],
];

const SHINGLE_DB = [
  // GAF
  { mfr: "GAF", line: "Timberline HDZ", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "current", years: "2018–present", note: "Current flagship. LayerLock nail zone is 1.6 in. wide vs about 1 in. on HD." },
  { mfr: "GAF", line: "Timberline HD", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "2007–2018", note: "Replaced by HDZ. Narrower nail zone — GAF states the two are not interchangeable." },
  { mfr: "GAF", line: "Timberline Ultra", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "~2005–2014", note: "Replaced by Ultra HD." },
  { mfr: "GAF", line: "Timberline 20 / 25 / 30 (organic)", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "1980s–2006", note: "Organic mat. Replaced by Natural Shadow. No fiberglass equivalent." },
  { mfr: "GAF", line: "Camelot I", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "2003–2017", note: "Replaced by Camelot II — different profile." },
  { mfr: "GAF", line: "Country Mansion", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "", note: "Replaced by Camelot / Grand Sequoia." },
  { mfr: "GAF", line: "Sentinel (3-tab)", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "phased out 2013–2025", note: "Confirm availability by color before promising a repair match." },
  // Owens Corning
  { mfr: "Owens Corning", line: "TruDefinition Duration", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "current", years: "2010–present", note: "Current flagship. SureNail strip differs from the original Duration." },
  { mfr: "Owens Corning", line: "Duration (original)", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "pre-2010", note: "Different SureNail construction — not a match for TruDefinition." },
  { mfr: "Owens Corning", line: "Oakridge Pro 25 / 30", w: 13.25, l: 38.75, exp: 5.625, type: "Laminate", status: "disco", years: "pre-2008", note: "Became Oakridge AR at 39 3/8 in. in 2008. Different mat and bonding." },
  { mfr: "Owens Corning", line: "Oakridge Pro 40 / 50", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "pre-2008", note: "Consolidated into Oakridge AR in 2008." },
  { mfr: "Owens Corning", line: "Devonshire", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "–2020", note: "Slate-look laminate." },
  { mfr: "Owens Corning", line: "Supreme Deep Shadow", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "", note: "" },
  { mfr: "Owens Corning", line: "Prominence", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "–2008", note: "Faux-laminate 3-tab." },
  { mfr: "Owens Corning", line: "Classic (3-tab)", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "fully out 2018", note: "Limited availability from about 2010." },
  { mfr: "Owens Corning", line: "WeatherGuard IR", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "–2011", note: "Impact-rated predecessor to Duration FLEX." },
  // CertainTeed
  { mfr: "CertainTeed", line: "Landmark", w: 13.25, l: 38.75, exp: 5.625, type: "Laminate", status: "current", years: "2005–present", note: "The ONLY current laminate at 38 3/4 in. Anything else that width is discontinued." },
  { mfr: "CertainTeed", line: "Landmark (English size)", w: 12, l: 36, exp: 5, type: "Laminate", status: "disco", years: "pre-2005", note: "Ohio plant converted to metric in 2005." },
  { mfr: "CertainTeed", line: "Hatteras", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "–2016", note: "Large 4-tab slate look. Slateline differs in profile and dimension — not a match." },
  { mfr: "CertainTeed", line: "Independence", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "–2017", note: "Designer 3-tab." },
  { mfr: "CertainTeed", line: "Horizon / New Horizon", w: 0, l: 0, exp: 0, type: "Laminate", status: "disco", years: "", note: "" },
  { mfr: "CertainTeed", line: "Patriot I / Patriot II", w: 0, l: 0, exp: 0, type: "Laminate", status: "disco", years: "", note: "" },
  { mfr: "CertainTeed", line: "Hallmark / Hearthstead / Centennial Slate", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "", note: "" },
  { mfr: "CertainTeed", line: "XT 25 / XT 30 (3-tab)", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "out by 2020", note: "" },
  { mfr: "CertainTeed", line: "Presidential Solaris / Shake IR", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "", note: "Presidential base line continues; these variants do not." },
  // Tamko
  { mfr: "Tamko", line: "Heritage", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "current", years: "2016–present", note: "Tamko went metric in 2012 — last major maker to convert." },
  { mfr: "Tamko", line: "Heritage (Dallas / Joplin)", w: 13.25, l: 38.75, exp: 5.625, type: "Laminate", status: "disco", years: "pre-2016", note: "" },
  { mfr: "Tamko", line: "Heritage 25 / 30", w: 0, l: 36.5, exp: 0, type: "Laminate", status: "disco", years: "pre-2012", note: "English size." },
  { mfr: "Tamko", line: "Heritage XL", w: 0, l: 36.625, exp: 0, type: "Laminate", status: "disco", years: "", note: "" },
  { mfr: "Tamko", line: "Elite Glass Seal (3-tab)", w: 12.25, l: 36, exp: 5.125, type: "3-tab", status: "current", years: "", note: "Limited Lifetime added 2018." },
  { mfr: "Tamko", line: "Glass Seal 20-yr (3-tab)", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "", note: "" },
  // Atlas
  { mfr: "Atlas", line: "Pinnacle / StormMaster / Castlebrook", w: 14, l: 42, exp: 6, type: "Laminate", status: "current", years: "2017–present", note: "Current size. Sealant is on the FRONT of the shingle, not the back." },
  { mfr: "Atlas", line: "Pinnacle / StormMaster (mid)", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "~2013–2017", note: "Different keyway and exposure than the 42 in. HP line — visible offset if mixed." },
  { mfr: "Atlas", line: "Pinnacle / StormMaster (early)", w: 0, l: 38.25, exp: 5.625, type: "Laminate", status: "disco", years: "~2013", note: "" },
  { mfr: "Atlas", line: "Castlebrook (early)", w: 0, l: 38.625, exp: 0, type: "Laminate", status: "disco", years: "~2013", note: "" },
  { mfr: "Atlas", line: "Stratford / Chalet", w: 0, l: 0, exp: 0, type: "3-tab", status: "disco", years: "", note: "Faux-laminate 3-tabs. Atlas 3-tab production has ended." },
  // IKO
  { mfr: "IKO", line: "Cambridge", w: 13.75, l: 40.875, exp: 5.875, type: "Laminate", status: "current", years: "", note: "Current ArmourZone nail strike is wider than older Cambridge generations." },
  { mfr: "IKO", line: "Dynasty", w: 13.75, l: 40.875, exp: 5.875, type: "Laminate", status: "current", years: "", note: "ArmourZone. Class 3 IR upgrade in 2022." },
  { mfr: "IKO", line: "Marathon AR (3-tab)", w: 0, l: 0, exp: 0, type: "3-tab", status: "current", years: "", note: "Converted English to metric. Color range now limited." },
  { mfr: "IKO", line: "Skyline / Renaissance", w: 0, l: 0, exp: 0, type: "Designer", status: "disco", years: "", note: "Private labels (e.g. CRC Biltmore 35) also likely gone — call to confirm." },
  // Malarkey / Pabco
  { mfr: "Malarkey", line: "Vista / Highlander", w: 13.25, l: 39, exp: 5.625, type: "Laminate", status: "current", years: "", note: "SBS rubberized. Most flagship lines carry Class 4 impact rating as standard." },
  { mfr: "Malarkey", line: "Legacy", w: 13.25, l: 40, exp: 5.625, type: "Laminate", status: "current", years: "", note: "SBS, Class 4 standard." },
  { mfr: "Pabco", line: "Premier / Prestige / Radiance", w: 13.25, l: 40, exp: 5.625, type: "Laminate", status: "current", years: "", note: "Narrow tooth, bold shadow. Uncommon in the Ohio market." },
  // Elk — all discontinued
  { mfr: "Elk (legacy)", line: "Prestique 30", w: 13.25, l: 38.75, exp: 5.625, type: "Laminate", status: "disco", years: "mid-1990s–2009", note: "Closest current analogue is GAF Timberline 30 — not a match." },
  { mfr: "Elk (legacy)", line: "Raised Profile 30", w: 13.25, l: 38.75, exp: 5.625, type: "Laminate", status: "disco", years: "", note: "Analogue: GAF Natural Shadow." },
  { mfr: "Elk (legacy)", line: "Prestique I 40", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "", note: "Analogue: GAF Timberline 40." },
  { mfr: "Elk (legacy)", line: "Prestique Plus 50", w: 13.25, l: 39.375, exp: 5.625, type: "Laminate", status: "disco", years: "", note: "Granules on the back of the shingle." },
  { mfr: "Elk (legacy)", line: "Capstone", w: 12.125, l: 39.5, exp: 5, type: "Designer", status: "disco", years: "", note: "" },
  { mfr: "Elk (legacy)", line: "Domain Winslow", w: 14.5, l: 40, exp: 5.625, type: "Designer", status: "disco", years: "", note: "Shake look." },
];

/* Back-of-shingle identification marks — how to tell makers apart on the roof. */
const MFR_IDENT = [
  { mfr: "GAF", mark: "\"GAF\" plus a plant code of two letters and four digits. Sealant is dashed, not solid.",
    plants: "MO Mt Vernon IN · MI Michigan City IN · TA Tampa · DA Dallas · NJ Mt Vernon NJ · SH Shafter CA · MN Minneapolis · TU Tuscaloosa · CD Cedar City UT · BA Baltimore · SS Statesboro GA · EN Ennis TX (legacy Elk plant)" },
  { mfr: "Owens Corning", mark: "Cellophane reads \"Do Not Remove\" / \"No Quitar\" with year and plant letter codes. Multiple plastic strips; black SureNail strip on TruDefinition Duration.", plants: "" },
  { mfr: "CertainTeed", mark: "Back almost always carries \"certainteed\" with the logo or \"the roofing collection.\" Tapered tooth, medium shadow line.", plants: "" },
  { mfr: "Tamko", mark: "Back reads \"Tamko\" or \"Frederick\" plus the plant name. Cellophane carries plant print.", plants: "" },
  { mfr: "Atlas", mark: "Five-digit code, sometimes with a Miami-Dade approval marking. Sealant is on the FRONT of the shingle.", plants: "" },
  { mfr: "IKO", mark: "\"PX\" plus a letter and five digits, e.g. PX A#####.", plants: "" },
  { mfr: "Elk (legacy)", mark: "Brown paper or blank backing, \"MYERSTOWN,\" a Texas outline with \"ENNIS,\" or T1/T2/T3 and M1/M2/M3 codes with \"DO NOT REMOVE\" between them. All Elk product is discontinued.", plants: "" },
  { mfr: "Malarkey", mark: "Brand text on the back. Vista and Highlander at 39 in., Legacy at 40 in.", plants: "" },
];

/* Current flagship specs — used to show current product is not equivalent. */
const MFR_SPECS = [
  { mfr: "GAF", flagship: "Timberline HDZ", w: "13-1/4 in.", l: "39-3/8 in.", exp: "5-5/8 in.",
    wind: "130 mph with LayerLock plus StainGuard Plus", algae: "StainGuard Plus 25 yr / StainGuard 10 yr",
    warranty: "Lifetime limited, 10 yr non-prorated", class4: "Timberline AS II · Grand Sequoia IR · Camelot II IR (select markets)",
    dnm: "GAF technical bulletins state HD and HDZ are not interchangeable — different nail zone width, exposure, and sealant. Prior-generation Timberline is not acceptable repair material on an HDZ roof. A 2007–2018 HD roof cannot be repair-matched with current product." },
  { mfr: "Owens Corning", flagship: "TruDefinition Duration", w: "13-1/4 in.", l: "39-3/8 in.", exp: "5-5/8 in.",
    wind: "130 mph with SureNail, no special installation required", algae: "StreakGuard 10 yr",
    warranty: "Lifetime limited", class4: "Duration FLEX (polymer-modified)",
    dnm: "OC repair-versus-replace bulletins state Oakridge AR and the older Pro lines are not compatible — different mat and bonding. Same position on original Duration versus TruDefinition Duration." },
  { mfr: "CertainTeed", flagship: "Landmark", w: "13-1/4 in.", l: "38-3/4 in.", exp: "5-5/8 in.",
    wind: "110–130 mph across Landmark / Pro / Premium", algae: "StreakFighter 15 yr",
    warranty: "Lifetime limited", class4: "Landmark IR · Belmont IR · Presidential IR",
    dnm: "CertainTeed publishes lot-to-lot color variation guidance and recommends running a roof from a single production lot. Do-not-mix language applies to Hatteras, since the replacement Slateline differs in profile and dimension." },
  { mfr: "Atlas", flagship: "Pinnacle / StormMaster / Castlebrook", w: "14 in.", l: "42 in.", exp: "6 in.",
    wind: "130 mph with HP and Scotchgard combination", algae: "Scotchgard", warranty: "Lifetime limited",
    class4: "StormMaster Slate / Shake / Shingle (SBS-modified)",
    dnm: "Atlas has confirmed in writing that the 42 in. HP line cannot be matched with prior 39-3/8 in. or 38 in. product — the keyway and exposure differ, producing a visible offset." },
  { mfr: "Tamko", flagship: "Heritage", w: "13-1/4 in.", l: "39-3/8 in.", exp: "5-5/8 in.",
    wind: "130 mph with correct starters and fastening", algae: "Available by series", warranty: "Limited Lifetime (added 2018)",
    class4: "Heritage IR (SBS)",
    dnm: "Modern fiberglass Heritage cannot be matched to the older organic Heritage — the mat composition differs. Tamko organic product also carries class-action history worth knowing before you discuss it with a homeowner." },
  { mfr: "IKO", flagship: "Cambridge / Dynasty", w: "13-3/4 in.", l: "40-7/8 in.", exp: "5-7/8 in.",
    wind: "110 mph Cambridge · 130 mph Dynasty with ArmourZone", algae: "Available by series", warranty: "Limited Lifetime",
    class4: "Nordic · Cambridge IR · Dynasty IR (2022+)",
    dnm: "Cambridge generations differ in nail-zone marking — older Cambridge has a narrower nail strike than current ArmourZone Cambridge." },
];

/* Vinyl siding matching — the parallel argument to shingle matching. */
const SIDING_MATCHING = {
  makers: "CertainTeed · Mastic / Ply Gem · Alside · Royal · Variform · Norandex",
  points: [
    "UV fade. ASTM D6864 permits up to 4 Delta-E of color shift across the warranty period. The naked eye detects a difference at about 2 — so a compliant, non-defective wall can still visibly mismatch new stock.",
    "Profile tooling changes. Manufacturers retire and revise profiles roughly every 5 to 10 years; embossing and lock geometry shift with them.",
    "Locking flange failure. Aged vinyl embrittles under UV and the locking flange typically breaks on removal, so salvaged panels usually cannot be reinstalled.",
    "Color SKU attrition. Individual colors are discontinued faster than the product lines that carry them.",
  ],
  argument: "Partial replacement of vinyl siding produces a visible mismatch in nearly every case. Photograph the existing color and profile, request manufacturer color-match samples in writing, and pursue full-elevation replacement on matching grounds.",
};

/* ================================================================
   LETTER TEMPLATES — fill the bracketed fields, send in writing.
   Written communication is what survives a contested claim.
   ================================================================ */
const LETTER_TEMPLATES = [
  { id: "lt-supp", title: "Supplement request", when: "The carrier's scope omits code-required or manufacturer-required line items.",
    body: `[Date]
[Carrier] — Claims Department
RE: Claim #[claim] · Insured: [name] · Date of loss: [date]
Property: [address]

We are the contractor of record on the above claim. Having reviewed the loss summary dated [date], we have identified the following items that were omitted or under-scoped. Each is required by the Residential Code of Ohio, by the manufacturer's published installation instructions, or by the loss settlement terms of the policy.

1. Drip edge, full perimeter — RCO R905.2.8.5. [LF] at [$].
2. Ice barrier at eaves and valleys — RCO R905.1.2. Ohio sits in IECC Climate Zones 4A and 5A; this applies statewide. [SQ] at [$].
3. Step flashing, remove and replace — RCO R905.2.8.4. Flashing cannot be reused after tear-off. [LF] at [$].
4. Kickout flashing — RCO R703.4. [EA] at [$].
5. Decking replacement where existing sheathing does not provide an adequate base — RCO R908.6. [SF] at [$].
6. Ventilation brought to the code-required ratio — RCO R806.2. [detail] at [$].
7. Permit and inspection fee. [$].
8. Disposal. [$].
9. Overhead and profit, where the loss requires coordination of multiple trades.

Please update the loss summary to reflect these items and reissue payment within the timeframe set by OAC 3901-1-54. Supporting photographs and measurements are attached.

[Rep name] — [Company] — [Phone]` },

  { id: "lt-match", title: "Matching argument", when: "The carrier authorized partial replacement and the existing shingle is discontinued.",
    body: `[Date]
[Carrier] — Attn: Claims Manager
RE: Claim #[claim] · Insured: [name] · Date of loss: [date]

The current authorization covers [x] slope(s). We respectfully request authorization for full replacement, on the following grounds.

1. The existing shingle is discontinued. The roof is identified as [manufacturer / line], measured at [width] x [length] with [exposure] exposure. That product has not been manufactured since [year]. Attached: photographs of the back-of-shingle markings, plant code, sealant pattern, and the measurements taken on site.

2. Current product is not interchangeable. [Manufacturer]'s technical bulletin dated [date] states that current product is not compatible with the discontinued line for installation, warranty, or appearance. Bulletin attached.

3. Partial replacement does not meet the policy's settlement standard. The policy provides for replacement with like kind and quality. A visible line between new and existing slopes does not satisfy that standard.

4. OAC 3901-1-54(I)(1)(b) requires that replacement items be of like kind and quality with reasonably comparable appearance. If the carrier intends to maintain the partial position, OAC 3901-1-54(I)(2) requires a written explanation of the provision relied upon. We request that explanation in writing.

We request re-inspection within fourteen days. If the partial position is maintained, we will advise the insured of their right to invoke the policy's appraisal clause.

[Rep name] — [Company] — [Phone]` },

  { id: "lt-cosmetic", title: "Cosmetic-only rebuttal", when: "The carrier denied hail damage as cosmetic rather than functional.",
    body: `[Date]
[Carrier] — Attn: Claims Manager
RE: Claim #[claim] · Insured: [name] — cosmetic-only determination

The letter dated [date] denies this claim on the basis that the hail damage is cosmetic and does not affect function. We respectfully disagree.

1. Granule loss is functional. The granule surface shields the asphalt mat from ultraviolet exposure. Where granules are displaced by impact, the mat is exposed, service life is shortened, and manufacturer warranty coverage is compromised. The published technical positions of GAF, Owens Corning, and CertainTeed all treat impact bruising as functional damage.

2. We have documented fractured mat and broken seal-down. The attached photographs show impacts where the mat is fractured beneath the surface and the seal strip has released and will not re-seal. Sample shingles are available for inspection.

3. If the carrier is relying on a cosmetic-damage exclusion by endorsement, we request that the endorsement be identified in writing. Absent a specific exclusion, physical damage from a covered peril is covered.

We request re-inspection by a senior adjuster within fourteen days.

[Rep name] — [Company] — [Phone]` },

  { id: "lt-appraisal", title: "Appraisal demand", when: "The dispute is over the amount of loss, not coverage, and negotiation has stalled.",
    body: `[Date]
[Carrier] — Attn: Claims Manager
RE: Claim #[claim] · Insured: [name]

Pursuant to the appraisal provision of the policy, the insured demands appraisal of the disputed amount of loss.

The insured names [appraiser name, address] as their competent and disinterested appraiser.

Please name the carrier's appraiser within the period required by the policy. The two appraisers will then select an umpire. An award agreed by any two of the three will be binding as to the amount of loss, consistent with Schwartz v. Standard Fire Insurance Co. (Ohio 2008).

[Insured name / Rep name] — [Company] — [Phone]` },

  { id: "lt-odi", title: "Department of Insurance complaint",
    when: "The carrier has missed handling deadlines or refused a written explanation. Escalates the file and creates a regulatory record.",
    body: `[Date]
Ohio Department of Insurance — Consumer Services Division
50 W. Town Street, Third Floor, Suite 300
Columbus, OH 43215

RE: Claim complaint · Insured: [name] · Carrier: [carrier] · Claim #[claim] · Date of loss: [date]

The insured submits this complaint regarding the handling of the above claim.

1. [Select: failure to acknowledge within 15 days per OAC 3901-1-54 / failure to complete investigation within 21 days / refusal to provide the written matching explanation required by OAC 3901-1-54(I)(2) / scope omitting code-required items / other].

2. The carrier has been given written notice regarding [drip edge / ice barrier / step flashing / kickout / decking / ventilation / matching] and has not updated the scope.

3. The carrier's most recent communication was dated [date] and stated [summary].

Enclosed: declarations page, the carrier's loss summary, our supplement request dated [date], photographs of the loss, and the manufacturer's do-not-mix bulletin.

The insured requests review.

[Insured name, address, phone]
cc: [Company], contractor of record` },
];

const RESOURCE_SECTIONS = [
  { id: "shingles", icon: Layers, title: "Shingle ID", blurb: "Width-first identification, discontinued lines by manufacturer, and back-of-shingle marks." },
  { id: "specs", icon: Package, title: "Manufacturer Specs", blurb: "Current flagship dimensions, do-not-mix positions, Class 4 options, and siding matching." },
  { id: "law", icon: Scale, title: "Ohio Insurance Law", blurb: "Matching, handling deadlines, bad faith, appraisal, deductible rules, and the escalation ladder." },
  { id: "policy", icon: CheckCircle2, title: "Policy Provisions", blurb: "Ordinance & Law, RCV vs ACV, RPS, cosmetic exclusions — what to check on the dec page." },
  { id: "docs", icon: Camera, title: "Documentation Checklist", blurb: "Every photo, measurement, and document that makes a claim file hold up." },
  { id: "tips", icon: Lightbulb, title: "Claim Playbook", blurb: "The common adjuster positions and the citation that answers each, plus carrier patterns." },
  { id: "letters", icon: ScrollText, title: "Letter Templates", blurb: "Supplement, matching, cosmetic rebuttal, appraisal demand, and ODI complaint." },
  { id: "dodont", icon: AlertTriangle, title: "Do & Don't", blurb: "Field practices on one side, ways this goes sideways on the other." },
  { id: "truck", icon: ClipboardList, title: "Truck Cheat Sheet", blurb: "One-page field summary. Print it for the truck." },
];


/* ================================================================
   PIPELINE + SEED DATA
   ================================================================ */
const TEAM = ["Jacob Henderson", "Drew Klass", "Stephen Klein", "Steven Tatgenhorst"];
/* Seats. Admins can add, edit, deactivate, and remove users; every active
   seat is a login. Role drives what a signed-in user can see — only an
   admin can change how commission is calculated. */
const ROLES = [
  { id: "admin", label: "Admin", blurb: "Full access: commission structures, company splits, seats, branding." },
  { id: "manager", label: "Production manager", blurb: "All jobs and financials, but cannot change commission structures or seats." },
  { id: "rep", label: "Sales rep", blurb: "Own jobs and payout figures. Cannot see company splits or structure controls." },
  { id: "crew", label: "Crew / field", blurb: "Work orders, photos, and tasks only. No pricing, no financials." },
];
const SEED_USERS = [
  { id: "u1", name: "Jacob Henderson", email: "jacob@supremebuildinggroup.com", phone: "(847) 757-9890", role: "admin", title: "Owner / Admin", active: true, commissionRate: 60, addedAt: "2026-01-04" },
  { id: "u2", name: "Drew Klass", email: "drew@supremebuildinggroup.com", phone: "", role: "rep", title: "Sales Rep", active: true, commissionRate: 60, addedAt: "2026-02-11" },
  { id: "u3", name: "Stephen Klein", email: "stephen@supremebuildinggroup.com", phone: "", role: "rep", title: "Sales Rep", active: true, commissionRate: 55, addedAt: "2026-03-02" },
  { id: "u4", name: "Steven Tatgenhorst", email: "steven@supremebuildinggroup.com", phone: "", role: "rep", title: "Sales Rep", active: true, commissionRate: 60, addedAt: "2026-03-02" },
];
const canSeeMoney = (u) => u && u.role !== "crew";
const canEditStructure = (u) => u && u.role === "admin";
const canManageSeats = (u) => u && u.role === "admin";
const LEAD_SOURCES = ["Door knocking", "Customer referral", "Google", "Website", "Yard sign", "Facebook", "Call in", "Repeat customer", "Real-estate referral", "Billboard / print"];

const DEFAULT_STAGES = [
  { id: "s1", name: "New lead", cat: "Incoming" },
  { id: "s2", name: "Appointment scheduled", cat: "Qualified" },
  { id: "s3", name: "Estimate sent / Follow up", cat: "Qualified" },
  { id: "s4", name: "Claim filed", cat: "Qualified" },
  { id: "s5", name: "Job approved", cat: "Won" },
  { id: "s6", name: "Supplementing", cat: "Won" },
  { id: "s7", name: "Deposit paid — job scheduled", cat: "Won" },
  { id: "s8", name: "Production", cat: "Won" },
  { id: "s9", name: "Payments / Invoicing / Cap out", cat: "Won" },
  { id: "s10", name: "Job completed", cat: "Completed" },
  { id: "s11", name: "Lost", cat: "Lost" },
  { id: "s12", name: "Unqualified", cat: "Unqualified" },
];
const WON_STAGES = ["s5", "s6", "s7", "s8", "s9", "s10"];
const DEAD_STAGES = ["s11", "s12"];


/* ================================================================
   CREWS — work orders are sent to a crew, not an individual.
   ================================================================ */
const SEED_CREWS = [
  { id: "c1", name: "Hillwood Contractors", contact: "Luis Hernandez", phone: "(815) 555-0142", email: "info@hillwoodcontractors.com", trades: ["Roofing", "Gutters"], active: true },
  { id: "c2", name: "Northgate Exteriors", contact: "Danny Pruitt", phone: "(847) 555-0188", email: "dispatch@northgateext.com", trades: ["Roofing", "Siding"], active: true },
  { id: "c3", name: "Vasquez Sheet Metal", contact: "Ramon Vasquez", phone: "(606) 555-0175", email: "ramon@vasquezmetal.com", trades: ["Metal", "Flashing"], active: true },
];

/* ================================================================
   MERGE FIELDS — shared by email and SMS templates.
   ================================================================ */
const MERGE_FIELDS = [
  ["{{customer_name}}", "Customer's full name"],
  ["{{customer_first}}", "Customer's first name"],
  ["{{job_address}}", "Property address"],
  ["{{rep_name}}", "Assigned rep"],
  ["{{rep_phone}}", "Company phone"],
  ["{{company}}", "Company name"],
  ["{{crew_name}}", "Assigned crew"],
  ["{{scheduled_date}}", "Scheduled production date"],
  ["{{contract_total}}", "Contract amount"],
  ["{{balance_due}}", "Outstanding balance"],
  ["{{claim_number}}", "Insurance claim number"],
  ["{{review_link}}", "Google review link"],
];

function mergeTemplate(text, ctx) {
  if (!text) return "";
  return text.replace(/\{\{(\w+)\}\}/g, (m, k) => (ctx[k] != null && ctx[k] !== "" ? String(ctx[k]) : m));
}
function templateContext(job, brand, crew) {
  const pay = paymentsSummary(job);
  const first = (job.name || "").split(" ")[0];
  return {
    customer_name: job.name, customer_first: first, job_address: job.address,
    rep_name: job.assignee, rep_phone: brand.phone, company: brand.company,
    crew_name: crew ? crew.name : "", scheduled_date: job.schedDate || "",
    contract_total: pay.contract ? money(pay.contract) : "",
    balance_due: pay.balance ? money(pay.balance) : "",
    claim_number: job.insurance ? job.insurance.claim : "",
    review_link: brand.googleReviewLink,
  };
}

const SEED_TEMPLATES = [
  { id: "t1", kind: "email", audience: "Customer", name: "Inspection scheduled",
    subject: "Your roof inspection — {{scheduled_date}}",
    body: `Hi {{customer_first}},

You're on the schedule for {{scheduled_date}} at {{job_address}}. {{rep_name}} will be out to walk the roof, take measurements and photos, and check the attic if it's accessible.

Plan on about an hour. You don't need to be home for the roof itself, but it helps if we can get a few minutes with you afterward to go over what we found.

Questions before then, call or text {{rep_phone}}.

{{rep_name}}
{{company}}` },
  { id: "t2", kind: "email", audience: "Customer", name: "Estimate sent — follow up",
    subject: "Your estimate from {{company}}",
    body: `Hi {{customer_first}},

Your estimate for {{job_address}} is attached. It covers everything we found on the inspection, with each line tied to what the roof actually needs.

A few things worth knowing:
— The price holds for 30 days.
— Anything we can't see until tear-off (decking, for example) is priced up front so there are no surprises.
— If this is going through insurance, we'll handle the supplement paperwork with your carrier.

Happy to walk through any line item. Call or text {{rep_phone}}.

{{rep_name}}
{{company}}` },
  { id: "t3", kind: "email", audience: "Customer", name: "Production scheduled",
    subject: "We're scheduled for {{scheduled_date}}",
    body: `Hi {{customer_first}},

{{job_address}} is scheduled for {{scheduled_date}}.

Before the crew arrives:
— Move vehicles out of the driveway.
— Take down anything hanging on walls that share a roof line — vibration knocks pictures loose.
— Keep pets inside for the day.
— Cover anything in the attic you'd rather not get dusty.

The crew starts early. We haul off all debris and run a magnet over the yard before we leave.

{{rep_name}}
{{company}} — {{rep_phone}}` },
  { id: "t4", kind: "email", audience: "Customer", name: "Job complete — review request",
    subject: "All finished at {{job_address}}",
    body: `Hi {{customer_first}},

We're wrapped up at {{job_address}}. Final walk-around is done, debris is hauled, and the yard has been swept with a magnet.

Your workmanship warranty runs five years from today, and the manufacturer warranty covers the materials. Both documents are in your portal.

If we earned it, a quick review helps us more than just about anything: {{review_link}}

Thanks for trusting us with the house.

{{rep_name}}
{{company}}` },
  { id: "t5", kind: "email", audience: "Crew", name: "New project assignment",
    subject: "{{company}} — new project assignment",
    body: `{{crew_name}},

A new project has been assigned to your crew for {{job_address}} on {{scheduled_date}}.

Attached is the full work order for this property. Please review the scope carefully before the crew rolls, and flag anything that doesn't match what you expect to find on site.

Materials are scheduled to land ahead of the start date. Call {{rep_phone}} if anything is missing or the delivery is short.

{{company}}` },
  { id: "t6", kind: "sms", audience: "Customer", name: "Appointment reminder",
    body: `{{company}}: Hi {{customer_first}}, reminder that {{rep_name}} is out to inspect {{job_address}} on {{scheduled_date}}. Questions? Call {{rep_phone}}. Reply STOP to opt out.` },
  { id: "t7", kind: "sms", audience: "Customer", name: "Crew on the way",
    body: `{{company}}: Our crew is headed to {{job_address}} this morning. Please move vehicles out of the driveway. Reply STOP to opt out.` },
  { id: "t8", kind: "sms", audience: "Customer", name: "Review request",
    body: `{{company}}: Thanks for letting us work on your home, {{customer_first}}. If we did right by you, a quick review means a lot: {{review_link}} Reply STOP to opt out.` },
  { id: "t9", kind: "sms", audience: "Crew", name: "Schedule confirmation",
    body: `{{company}}: {{crew_name}} — confirming {{job_address}} on {{scheduled_date}}. Work order is in your email. Reply to confirm.` },
];

/* ================================================================
   COMPANY DOCUMENTS — not tied to a job. Contracts, insurance
   certificates, licenses, warranties, safety, HR.
   ================================================================ */
const DOC_CATEGORIES = [
  "Contracts & agreements", "Insurance & bonding", "Licenses & registrations",
  "Warranties", "Safety & OSHA", "HR & onboarding", "Vendor & supplier", "Marketing", "Other",
];
const SEED_COMPANY_DOCS = [
  { id: "d1", name: "Master service agreement — template.pdf", cat: "Contracts & agreements", size: "182 KB", at: "2026-01-12", by: "Jacob Henderson", pinned: true, expires: null },
  { id: "d2", name: "General liability COI 2026.pdf", cat: "Insurance & bonding", size: "96 KB", at: "2026-01-04", by: "Jacob Henderson", pinned: true, expires: "2026-12-31" },
  { id: "d3", name: "Workers comp certificate.pdf", cat: "Insurance & bonding", size: "88 KB", at: "2026-01-04", by: "Jacob Henderson", pinned: false, expires: "2026-11-30" },
  { id: "d4", name: "Subcontractor agreement — blank.pdf", cat: "Contracts & agreements", size: "141 KB", at: "2026-02-20", by: "Jacob Henderson", pinned: false, expires: null },
  { id: "d5", name: "GAF workmanship warranty terms.pdf", cat: "Warranties", size: "204 KB", at: "2026-03-08", by: "Steven Tatgenhorst", pinned: false, expires: null },
  { id: "d6", name: "Fall protection plan.pdf", cat: "Safety & OSHA", size: "312 KB", at: "2026-02-02", by: "Jacob Henderson", pinned: false, expires: null },
];

/* ================================================================
   MATERIAL PRICE LIST — imported from a supplier CSV.
   Columns accepted: sku, item, unit, cost, price, supplier, category
   ================================================================ */
const SEED_PRICE_LIST = [
  { id: "pl1", sku: "GAF-HDZ-BDL", item: "GAF Timberline HDZ — bundle", unit: "BDL", cost: 41.2, price: 58.0, supplier: "QXO", category: "Shingles" },
  { id: "pl2", sku: "GAF-RIDGE", item: "GAF Seal-A-Ridge — bundle", unit: "BDL", cost: 62.5, price: 88.0, supplier: "QXO", category: "Shingles" },
  { id: "pl3", sku: "SYN-UND-10", item: "Synthetic underlayment — 10 SQ roll", unit: "ROLL", cost: 96.0, price: 138.0, supplier: "QXO", category: "Underlayment" },
  { id: "pl4", sku: "IWS-200", item: "Ice & water shield — 200 SF roll", unit: "ROLL", cost: 108.0, price: 152.0, supplier: "SRS", category: "Underlayment" },
  { id: "pl5", sku: "DE-26-10", item: "Drip edge 26ga — 10 ft stick", unit: "EA", cost: 11.4, price: 17.5, supplier: "SRS", category: "Metal" },
  { id: "pl6", sku: "RV-4", item: "Ridge vent — 4 ft section", unit: "EA", cost: 14.8, price: 22.0, supplier: "QXO", category: "Ventilation" },
  { id: "pl7", sku: "PJ-3", item: 'Pipe jack 3"', unit: "EA", cost: 12.0, price: 24.0, supplier: "QXO", category: "Accessories" },
  { id: "pl8", sku: "NAIL-114", item: 'Coil nails 1-1/4" — box', unit: "BOX", cost: 52.0, price: 72.0, supplier: "SRS", category: "Fasteners" },
  { id: "pl9", sku: "OSB-716", item: '7/16" OSB sheathing 4x8', unit: "SHT", cost: 28.5, price: 48.0, supplier: "Menards", category: "Decking" },
  { id: "pl10", sku: "STARTER", item: "Starter strip — roll", unit: "ROLL", cost: 48.0, price: 68.0, supplier: "QXO", category: "Shingles" },
];

const BLANK_CHECKLIST = {
  complete: false, structure: "", roofAge: "", method: "", layers: "", roofType: "",
  deckingType: "", deckingCond: "", pitch: "", ventTypes: [], soffitIntake: "",
  ventCond: "", atticAccess: "", atticDecking: "", lightCheck: "", granuleLoss: "",
  windDamage: "", hailImpact: "", flashingFail: "", pipeBoots: "", overall: "", notes: "",
};

const BLANK_MEASURE = {
  squares: "", pitch: "", ridges: "", hips: "", valleys: "", eaves: "", rakes: "",
  stepFlash: "", wallFlash: "", penetrations: "", waste: 12,
};

function mkEstimate(over = {}) {
  return {
    number: "", date: "", validThrough: "", status: "Draft",
    scope: "", notes: "",
    items: [],
    concealed: [
      { id: "c1", desc: "Roof decking replacement (7/16\" OSB)", unit: "per 4×8 sheet", price: 0 },
      { id: "c2", desc: "Plank decking replacement", unit: "per LF", price: 0 },
      { id: "c3", desc: "Rafter sistering / repair", unit: "per rafter", price: 0 },
      { id: "c4", desc: "Fascia replacement", unit: "per LF", price: 0 },
    ],
    clientSig: null, sigAt: null, ...over,
  };
}
function mkContract(over = {}) {
  return {
    number: "", price: 0, depositPct: 50, status: "Not started",
    scope: "",
    terms: "Deposit on acceptance; balance on substantial completion. Workmanship warranted five (5) years from completion; manufacturer warranties apply to materials. Any change to scope or price is agreed in writing before changed work begins. Concealed conditions are billed as agreed change orders. Owner may cancel without penalty within three (3) business days of signing by written notice. Balances unpaid 30 days after completion accrue 1.5% monthly.",
    contractorSig: null, clientSig: null, signedAt: null, ...over,
  };
}

const seedJobs = [
  {
    id: "j1", name: "Rob Kennard", address: "127 Market Street, Vanceburg, KY", zip: "41179", state: "KY",
    value: 16964.12, stageId: "s2", assignee: "Jacob Henderson", leadSource: "Door knocking",
    daysInStage: 12, updated: "13 days ago", claimType: "Insurance", schedDate: null,
    phone: "(606) 555-0136", email: "rob.k@example.com",
    consent: { sms: { granted: true, at: "2026-07-08 10:12", source: "New lead form" }, email: { granted: true, at: "2026-07-08 10:12", source: "New lead form" } },
    insurance: { carrier: "State Farm", policy: "SF-99-421", claim: "", adjusterName: "", adjusterPhone: "", adjusterEmail: "", deductible: "1500", coverage: "RCV", oLaw: true },
    checklist: { ...BLANK_CHECKLIST },
    measurements: { ...BLANK_MEASURE },
    estimate: mkEstimate(),
    contract: mkContract(),
    photos: [
      { id: "p1", label: "Ground shots — all elevations", at: "Jul 9, 9:41 AM" },
      { id: "p2", label: "Shingle layers at the edge", at: "Jul 9, 9:48 AM" },
      { id: "p3", label: "Hail impact — south slope", at: "Jul 9, 9:52 AM" },
    ],
    tasks: [
      { id: "t1", label: "Roofing inspection checklist", done: false },
      { id: "t2", label: "Enter measurements", done: false },
      { id: "t3", label: "Build estimate", done: false },
    ],
    files: [{ id: "f1", name: "Hail photos — insurer upload.zip", cat: "Photos", at: "Jul 9", by: "Jacob Henderson" }],
    payments: [],
    fin: { materials: [], labor: [], other: [], commissionRate: 60, reimbursements: [] },
    portal: { estimate: false, contract: false, photos: false, invoice: false }, crewId: null, messages: [], workOrder: null,
    review: { sent: false, clicked: false, posted: false },
  },
  {
    id: "j2", name: "Omkar Hirekhan", address: "8259 Spruce Needle Court, Columbus, OH", zip: "43235", state: "OH",
    value: 12480.0, stageId: "s3", assignee: "Jacob Henderson", leadSource: "Google",
    daysInStage: 26, updated: "a month ago", claimType: "Retail", schedDate: null,
    phone: "(614) 555-0114", email: "omkar.h@example.com",
    consent: { sms: { granted: false, at: null, source: null }, email: { granted: true, at: "2026-06-20 14:02", source: "New lead form" } },
    insurance: null,
    checklist: { ...BLANK_CHECKLIST, complete: true, structure: "Single Family", roofAge: "17", method: "Visual, non-invasive; roof surface accessed directly", layers: "1 Layer", roofType: "Asphalt shingle", deckingType: "OSB", deckingCond: "Fair", pitch: "6/12", ventTypes: ["Ridge Vent"], soffitIntake: "Yes", ventCond: "Fair", atticAccess: "Yes", atticDecking: "Good", lightCheck: "No", granuleLoss: "Heavy", windDamage: "Yes", hailImpact: "No", flashingFail: "Yes", pipeBoots: "Yes", overall: "Poor", notes: "Homeowner reports ceiling stain in rear bedroom after spring storms." },
    measurements: { squares: "24.8", pitch: "6/12", ridges: "58", hips: "0", valleys: "34", eaves: "132", rakes: "88", stepFlash: "22", wallFlash: "14", penetrations: "5", waste: 12 },
    estimate: mkEstimate({
      number: "EST-2026-032", date: "Jun 24, 2026", validThrough: "Jul 24, 2026", status: "Sent",
      scope: "Remove existing roof covering to the deck (one layer). Inspect decking and report deterioration prior to dry-in. Install ice-and-water shield at eaves and valleys, synthetic underlayment over the remaining field, new drip edge at eaves and rakes, architectural asphalt shingles fastened per manufacturer specification, new pipe jacks at all penetrations, step and counterflashing where indicated, and hip-and-ridge cap with ridge ventilation. Haul off and dispose of all debris; magnetic sweep on completion.",
      items: [
        { id: "e1", desc: "Tear-off & disposal — 1 layer", qty: 24.8, unit: "SQ", price: 92 },
        { id: "e2", desc: "Ice & water shield — eaves & valleys", qty: 5.5, unit: "SQ", price: 118 },
        { id: "e3", desc: "Synthetic underlayment — field", qty: 22, unit: "SQ", price: 34 },
        { id: "e4", desc: "Drip edge — eaves & rakes", qty: 220, unit: "LF", price: 3.1 },
        { id: "e5", desc: "Architectural shingles (incl. waste)", qty: 27.8, unit: "SQ", price: 262 },
        { id: "e6", desc: "Starter strip — eaves & rakes", qty: 220, unit: "LF", price: 2.2 },
        { id: "e7", desc: "Hip & ridge cap", qty: 58, unit: "LF", price: 5.4 },
        { id: "e8", desc: "Ridge ventilation", qty: 46, unit: "LF", price: 8.6 },
        { id: "e9", desc: "Pipe jacks at penetrations", qty: 5, unit: "EA", price: 42 },
      ],
    }),
    contract: mkContract(),
    photos: [{ id: "p1", label: "Front elevation", at: "Jun 22, 2:10 PM" }, { id: "p2", label: "Granule loss close-up", at: "Jun 22, 2:24 PM" }],
    tasks: [
      { id: "t1", label: "Roofing inspection checklist", done: true },
      { id: "t2", label: "Build estimate", done: true },
      { id: "t3", label: "Send estimate to client", done: true },
      { id: "t4", label: "Follow-up call", done: false },
    ],
    files: [{ id: "f1", name: "Measurement report.pdf", cat: "Measurements", at: "Jun 23", by: "Jacob Henderson" }],
    payments: [],
    fin: { materials: [], labor: [], other: [], commissionRate: 60, reimbursements: [] },
    portal: { estimate: true, contract: false, photos: true, invoice: false }, crewId: null, messages: [], workOrder: null,
    review: { sent: false, clicked: false, posted: false },
  },
  {
    id: "j3", name: "Roger Perry", address: "810 South College Avenue, Oxford, OH", zip: "45056", state: "OH",
    value: 13031.16, stageId: "s9", assignee: "Jacob Henderson", leadSource: "Customer referral",
    daysInStage: 4, updated: "2 days ago", claimType: "Insurance", schedDate: "2026-07-18",
    phone: "(513) 555-0187", email: "roger.p@example.com",
    consent: { sms: { granted: true, at: "2026-06-02 09:30", source: "New lead form" }, email: { granted: true, at: "2026-06-02 09:30", source: "New lead form" } },
    insurance: { carrier: "Allstate", policy: "AL-77-2210", claim: "CLM-448190", adjusterName: "T. Marsh", adjusterPhone: "(800) 555-0122", adjusterEmail: "t.marsh@example.com", deductible: "1000", coverage: "RCV", oLaw: true },
    checklist: { ...BLANK_CHECKLIST, complete: true, structure: "Single Family", roofAge: "21", method: "Visual, non-invasive; roof surface accessed directly", layers: "1 Layer", roofType: "Asphalt shingle", deckingType: "Plywood", deckingCond: "Fair", pitch: "8/12", ventTypes: ["Box Vents / Turtles"], soffitIntake: "Yes", ventCond: "Poor", atticAccess: "Yes", atticDecking: "Stained / Tracked", lightCheck: "No", granuleLoss: "Heavy", windDamage: "Yes", hailImpact: "Yes", flashingFail: "Yes", pipeBoots: "Yes", overall: "Critical", notes: "Storm date matches carrier CAT event. Chimney counterflashing failed." },
    measurements: { squares: "27.1", pitch: "8/12", ridges: "64", hips: "38", valleys: "52", eaves: "148", rakes: "96", stepFlash: "24", wallFlash: "18", penetrations: "6", waste: 12 },
    estimate: mkEstimate({
      number: "EST-2026-041", date: "Jul 20, 2026", validThrough: "Aug 21, 2026", status: "Signed",
      scope: "Full replacement per inspection findings — tear-off to deck, ice & water at eaves and valleys, synthetic underlayment, drip edge at eaves and rakes, architectural shingles with 6-nail fastening, new flashings and accessories, ridge vent. Haul-off and magnetic sweep.",
      items: [
        { id: "e1", desc: "Tear-off & disposal — 1 layer", qty: 27.1, unit: "SQ", price: 92 },
        { id: "e2", desc: "Ice & water shield — eaves & valleys", qty: 6.2, unit: "SQ", price: 118 },
        { id: "e3", desc: "Synthetic underlayment — field", qty: 24, unit: "SQ", price: 34 },
        { id: "e4", desc: "Drip edge — eaves & rakes", qty: 244, unit: "LF", price: 3.1 },
        { id: "e5", desc: "Architectural shingles (incl. waste)", qty: 30.4, unit: "SQ", price: 262 },
        { id: "e6", desc: "Hip & ridge cap", qty: 102, unit: "LF", price: 5.4 },
        { id: "e7", desc: "Ridge ventilation", qty: 52, unit: "LF", price: 8.6 },
        { id: "e8", desc: "Chimney counterflashing", qty: 12, unit: "LF", price: 21 },
        { id: "e9", desc: "Pipe jacks at penetrations", qty: 6, unit: "EA", price: 42 },
      ],
      clientSig: "signed", sigAt: "Jul 21, 2026",
    }),
    contract: mkContract({
      number: "CON-2026-041", price: 13031.16, status: "Signed",
      scope: "Full roof replacement per Estimate EST-2026-041 dated Jul 20, 2026: remove existing shingles, install synthetic underlayment, ice & water shield, architectural shingles, ridge vent, new flashing and accessories. Includes haul-off and magnetic sweep.",
      contractorSig: "signed", clientSig: "signed", signedAt: "Jul 21, 2026",
    }),
    photos: [
      { id: "p1", label: "Cover — front elevation", at: "Jul 12, 8:05 AM" },
      { id: "p2", label: "Hail impact w/ chalk circle", at: "Jul 12, 8:18 AM" },
      { id: "p3", label: "Chimney counterflashing failure", at: "Jul 12, 8:26 AM" },
      { id: "p4", label: "Attic — decking staining", at: "Jul 12, 8:40 AM" },
      { id: "p5", label: "Completion — ridge line", at: "Jul 19, 4:32 PM" },
    ],
    tasks: [
      { id: "t1", label: "Final walk-around", done: true },
      { id: "t2", label: "Collect final payment", done: false },
      { id: "t3", label: "Send review request", done: false },
    ],
    files: [
      { id: "f1", name: "Signed contract.pdf", cat: "Signed paperwork", at: "Jul 21", by: "Jacob Henderson" },
      { id: "f2", name: "QXO delivery ticket.pdf", cat: "Delivery tickets", at: "Jul 17", by: "Jacob Henderson" },
      { id: "f3", name: "Permit — Butler County.pdf", cat: "Permits", at: "Jul 15", by: "Jacob Henderson" },
    ],
    payments: [
      { id: "pay1", type: "Received", label: "Deposit — check 1042", amt: 6515.58, date: "Jul 21" },
      { id: "pay2", type: "Paid out", label: "Crew draw — WO #14", amt: 1500.0, date: "Jul 18" },
    ],
    fin: {
      materials: [
        { id: "m1", label: "QXO material order", amt: 3774.14, by: "Jacob Henderson" },
        { id: "m2", label: "QXO return", amt: -167.86, by: "Jacob Henderson" },
      ],
      labor: [
        { id: "l1", label: "Work order #14 labor", amt: 2575.0, by: "Jacob Henderson" },
        { id: "l2", label: "Labor to install wood / dump", amt: 145.5, by: "Jacob Henderson" },
      ],
      other: [
        { id: "o1", label: "Building permit", amt: 52.26, by: "Jacob Henderson" },
        { id: "o2", label: "Lowes", amt: 167.48, by: "Jacob Henderson" },
      ],
      commissionRate: 60,
      reimbursements: [
        { id: "r1", label: "Permit — out of pocket", amt: 52.26, status: "Reimbursed" },
        { id: "r2", label: "Lowes — out of pocket", amt: 167.48, status: "Needs paid" },
      ],
    },
    portal: { estimate: true, contract: true, photos: true, invoice: true }, crewId: "c1", messages: [], workOrder: { number: "WO-014", sentAt: "Jul 17, 8:02 AM", status: "Sent", notes: "Dumpster on the north side of the drive. Dog in the back yard — keep the gate shut." },
    review: { sent: false, clicked: false, posted: false },
  },
  {
    id: "j4", name: "Jill Neitzel", address: "104 Illinois Avenue, Dayton, OH", zip: "45410", state: "OH",
    value: 17842.05, stageId: "s5", assignee: "Steven Tatgenhorst", leadSource: "Yard sign",
    daysInStage: 2, updated: "today", claimType: "Insurance", schedDate: "2026-07-29",
    phone: "(937) 555-0102", email: "jill.n@example.com",
    consent: { sms: { granted: true, at: "2026-07-01 16:40", source: "New lead form" }, email: { granted: true, at: "2026-07-01 16:40", source: "New lead form" } },
    insurance: { carrier: "Erie", policy: "ER-15-0092", claim: "CLM-002617", adjusterName: "K. Boyd", adjusterPhone: "(800) 555-0177", adjusterEmail: "k.boyd@example.com", deductible: "2000", coverage: "RCV", oLaw: false },
    checklist: { ...BLANK_CHECKLIST, complete: true, structure: "Single Family", roofAge: "19", method: "Drone-assisted visual inspection", layers: "2 Layers", roofType: "Asphalt shingle", deckingType: "1x6 Plank / Spaced Lumber", deckingCond: "Poor", pitch: "6/12", ventTypes: ["Gable Vents"], soffitIntake: "No", ventCond: "Critical", atticAccess: "Yes", atticDecking: "Active Rot / Mold", lightCheck: "Yes", granuleLoss: "Critical", windDamage: "Yes", hailImpact: "Yes", flashingFail: "Yes", pipeBoots: "Yes", overall: "Critical", notes: "Two layers — full tear-off supplement filed. Ventilation upgrade supplement pending." },
    measurements: { squares: "31.6", pitch: "6/12", ridges: "72", hips: "12", valleys: "40", eaves: "156", rakes: "104", stepFlash: "18", wallFlash: "22", penetrations: "7", waste: 15 },
    estimate: mkEstimate({ number: "EST-2026-044", date: "Jul 14, 2026", validThrough: "Aug 14, 2026", status: "Signed", scope: "Insurance scope plus approved supplements: full two-layer tear-off, decking allowance, code ventilation upgrade.", items: [{ id: "e1", desc: "Tear-off & disposal — 2 layers", qty: 31.6, unit: "SQ", price: 128 }, { id: "e2", desc: "Architectural shingles (incl. waste)", qty: 36.3, unit: "SQ", price: 262 }, { id: "e3", desc: "Ridge ventilation + soffit intake", qty: 60, unit: "LF", price: 11.2 }], clientSig: "signed", sigAt: "Jul 15, 2026" }),
    contract: mkContract({ number: "CON-2026-044", price: 17842.05, status: "Signed", scope: "Per Estimate EST-2026-044 and approved insurance scope.", contractorSig: "signed", clientSig: "signed", signedAt: "Jul 15, 2026" }),
    photos: [{ id: "p1", label: "Layer count at edge", at: "Jul 10, 11:02 AM" }, { id: "p2", label: "Attic — daylight through decking", at: "Jul 10, 11:20 AM" }],
    tasks: [
      { id: "t1", label: "Order materials", done: true },
      { id: "t2", label: "Schedule crew", done: false },
      { id: "t3", label: "Confirm supplement approval", done: false },
    ],
    files: [{ id: "f1", name: "Carrier scope.pdf", cat: "Insurance", at: "Jul 11", by: "Steven Tatgenhorst" }],
    payments: [],
    fin: {
      materials: [
        { id: "m1", label: "QXO material invoice", amt: 5479.72, by: "Steven Tatgenhorst" },
        { id: "m2", label: "SRS siding", amt: 64.53, by: "Steven Tatgenhorst" },
      ],
      labor: [{ id: "l1", label: "Install labor", amt: 5000.0, by: "Steven Tatgenhorst" }],
      other: [{ id: "o1", label: "Material dump", amt: 160.68, by: "Steven Tatgenhorst" }],
      commissionRate: 60, reimbursements: [],
    },
    portal: { estimate: true, contract: true, photos: false, invoice: false }, crewId: "c2", messages: [], workOrder: null,
    review: { sent: false, clicked: false, posted: false },
  },
  {
    id: "j5", name: "Marcy Templeton", address: "44 Birch Row, Crystal Lake, IL", zip: "60014", state: "IL",
    value: 0, stageId: "s1", assignee: "Drew Klass", leadSource: "Website",
    daysInStage: 1, updated: "1 hour ago", claimType: "Unknown", schedDate: null,
    phone: "(847) 555-0119", email: "marcy.t@example.com",
    consent: { sms: { granted: true, at: "2026-07-21 18:05", source: "Website form" }, email: { granted: true, at: "2026-07-21 18:05", source: "Website form" } },
    insurance: null,
    checklist: { ...BLANK_CHECKLIST },
    measurements: { ...BLANK_MEASURE },
    estimate: mkEstimate(),
    contract: mkContract(),
    photos: [], tasks: [{ id: "t1", label: "Schedule inspection", done: false }],
    files: [], payments: [],
    fin: { materials: [], labor: [], other: [], commissionRate: 60, reimbursements: [] },
    portal: { estimate: false, contract: false, photos: false, invoice: false }, crewId: null, messages: [], workOrder: null,
    review: { sent: false, clicked: false, posted: false },
  },
  {
    id: "j6", name: "Dale Whitfield", address: "902 Ridgepoint Dr, Maysville, KY", zip: "41056", state: "KY",
    value: 9420.0, stageId: "s10", assignee: "Stephen Klein", leadSource: "Repeat customer",
    daysInStage: 3, updated: "yesterday", claimType: "Retail", schedDate: null,
    phone: "(606) 555-0161", email: "dale.w@example.com",
    consent: { sms: { granted: true, at: "2026-05-30 08:15", source: "New lead form" }, email: { granted: true, at: "2026-05-30 08:15", source: "New lead form" } },
    insurance: null,
    checklist: { ...BLANK_CHECKLIST, complete: true, overall: "Poor", structure: "Single Family", roofAge: "24", layers: "1 Layer", roofType: "Asphalt shingle", pitch: "5/12", method: "Visual, non-invasive; roof surface accessed directly" },
    measurements: { squares: "18.4", pitch: "5/12", ridges: "44", hips: "0", valleys: "20", eaves: "104", rakes: "70", stepFlash: "12", wallFlash: "8", penetrations: "4", waste: 10 },
    estimate: mkEstimate({ number: "EST-2026-029", date: "Jun 4, 2026", validThrough: "Jul 4, 2026", status: "Signed", scope: "Full replacement, retail.", items: [{ id: "e1", desc: "Full replacement package", qty: 1, unit: "JOB", price: 9420 }], clientSig: "signed", sigAt: "Jun 6, 2026" }),
    contract: mkContract({ number: "CON-2026-029", price: 9420, status: "Signed", scope: "Per Estimate EST-2026-029.", contractorSig: "signed", clientSig: "signed", signedAt: "Jun 6, 2026" }),
    photos: [{ id: "p1", label: "Completion — front", at: "Jul 19, 3:15 PM" }],
    tasks: [{ id: "t1", label: "Send review request", done: false }],
    files: [], payments: [{ id: "pay1", type: "Received", label: "Paid in full — card", amt: 9420, date: "Jul 20" }],
    fin: {
      materials: [{ id: "m1", label: "Material order", amt: 2610.4, by: "Stephen Klein" }],
      labor: [{ id: "l1", label: "Crew labor", amt: 2480.0, by: "Stephen Klein" }],
      other: [], commissionRate: 55, reimbursements: [],
    },
    portal: { estimate: true, contract: true, photos: true, invoice: true }, crewId: "c1", messages: [], workOrder: { number: "WO-014", sentAt: "Jul 17, 8:02 AM", status: "Sent", notes: "Dumpster on the north side of the drive. Dog in the back yard — keep the gate shut." },
    review: { sent: true, clicked: true, posted: true },
  },
];

/* ================================================================
   HELPERS
   ================================================================ */
/* ================================================================
   ZIP → JURISDICTION RESOLUTION
   Curated records above are authoritative (office-verified). Any other
   zip falls back to a state-level record derived from the zip prefix,
   so a lookup ALWAYS returns usable code guidance instead of a dead end.
   Production: point resolveJurisdiction() at a live code-data service
   (OneClickCode / county GIS) — the screen contract stays identical.
   ================================================================ */
const ZIP_PREFIX_STATE = [
  { lo: 430, hi: 459, state: "OH" },
  { lo: 400, hi: 427, state: "KY" },
  { lo: 600, hi: 629, state: "IL" },
];
const STATE_DEFAULTS = {
  OH: {
    codeName: "Residential Code of Ohio (RCO)", codeEdition: "Current RCO — confirm edition",
    adoption: "Statewide residential code (OAC 4101:8) — applies in all Ohio jurisdictions.",
    permit: "Roofing permit generally required for full replacement. Confirm with the local building department.",
    sources: ["RCO", "OAC3901"],
  },
  KY: {
    codeName: "Kentucky Residential Code (KRC)", codeEdition: "Current KRC — confirm edition",
    adoption: "Statewide residential code administered by KY DHBC — applies in all Kentucky jurisdictions.",
    permit: "Permit handling varies by county/city. Confirm with the local building official before tear-off.",
    sources: ["KYDHBC", "ICC"],
  },
  IL: {
    codeName: "Locally adopted IRC", codeEdition: "Varies by municipality — confirm adopted edition",
    adoption: "Illinois has NO statewide residential code. Each municipality adopts its own edition and amendments.",
    permit: "Permit rules are municipal. You must confirm the adopting ordinance for this address.",
    sources: ["MUNICODE", "ICC"],
  },
};
function stateForZip(zip) {
  const p = parseInt(String(zip).slice(0, 3), 10);
  if (isNaN(p)) return null;
  const hit = ZIP_PREFIX_STATE.find((r) => p >= r.lo && p <= r.hi);
  return hit ? hit.state : null;
}
/* Returns { ...record, precision } — "verified" | "state" | null */
function resolveJurisdiction(zip) {
  const z = String(zip || "").trim();
  if (z.length !== 5) return null;
  const exact = JURISDICTIONS[z];
  if (exact) return { ...exact, precision: "verified" };
  const st = stateForZip(z);
  if (!st) return null;
  const d = STATE_DEFAULTS[st];
  return {
    zip: z, city: "", county: "", state: st,
    codeName: d.codeName, codeEdition: d.codeEdition, adoption: d.adoption, permit: d.permit,
    inspector: { office: "Local building department — not yet on file", phone: "", address: "" },
    verified: false, sources: d.sources, verifiedDetail: { date: null, by: null },
    precision: "state",
  };
}

/* Geoapify — address autocomplete + reverse geocoding.
   Free tier: 3,000 requests/day, commercial use permitted, no attribution
   required, results may be stored. Swap the key for an env var at deploy
   and lock it to your domain under Allowed Origins in the Geoapify console. */
const GEO_PROVIDER = {
  name: "geoapify",
  apiKey: (typeof window !== "undefined" && window.__GEOAPIFY_KEY__) || "d4895cd9d44b4229af2885ffa85e343e",
  base: "https://api.geoapify.com/v1/geocode",
  countries: "us",
};
const geoReady = () => !!(GEO_PROVIDER.apiKey && GEO_PROVIDER.name === "geoapify");

/* Type-ahead address suggestions. Returns [] on any failure so the form
   always stays usable — a dead API must never block writing a lead. */
async function geoAutocomplete(text, signal) {
  if (!geoReady() || !text || text.trim().length < 3) return [];
  const url = `${GEO_PROVIDER.base}/autocomplete?text=${encodeURIComponent(text)}`
    + `&filter=countrycode:${GEO_PROVIDER.countries}&limit=6&format=json&apiKey=${GEO_PROVIDER.apiKey}`;
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
      lat: r.lat, lng: r.lon,
    }));
  } catch { return []; }
}

/* Coordinates -> street address. Used to stamp photos with a real address
   alongside the GPS fix. */
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
      zip: r.postcode || "",
    };
  } catch { return null; }
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
        at: new Date().toISOString(),
      }),
      (err) => resolve({ ok: false, reason: err.code === 1 ? "Location permission denied." : "Could not get a location fix." }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}
const fmtCoord = (lat, lng) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
/* Provider-neutral links — work with no API key, open in the user's map app. */
const mapLinkForCoords = (lat, lng) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
const mapLinkForAddress = (addr) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
const directionsLink = (addr) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
const staticMapEmbed = (lat, lng) => {
  const d = 0.004;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
};
const fmtStamp = (iso) => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
  } catch { return iso; }
};

const money = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct1 = (n) => `${n.toFixed(2)}%`;
const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
const uid = (p) => p + Math.random().toString(36).slice(2, 8);
const nowStamp = () =>
  new Date().toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function estimateTotal(est) {
  return est.items.reduce((s, it) => s + num(it.qty) * num(it.price), 0);
}
function computeFin(fin) {
  const sum = (a) => a.reduce((s, x) => s + x.amt, 0);
  const materials = sum(fin.materials), labor = sum(fin.labor), other = sum(fin.other);
  return { materials, labor, other, cogs: materials + labor + other };
}
/* Commission structures — merged from the Ridgeline repo. Structure choice is
   admin-only; reps see the resulting numbers, never the lever. Defaults to
   "grossProfit" (rate% of gross) so existing jobs behave exactly as before. */
const STRUCTURES = [
  { id: "grossProfit", label: "Gross Profit", usesRate: true, usesOverhead: false,
    blurb: "Rate % of (contract − COGS). No overhead allocation before the split." },
  { id: "netProfit", label: "Net Profit", usesRate: true, usesOverhead: true,
    blurb: "Rate % of (contract − COGS − overhead allocation). Overhead % of contract is set below." },
  { id: "tenFiftyFifty", label: "10 / 50 / 50", usesRate: false, usesOverhead: false,
    blurb: "10% of contract off the top to company overhead, then remaining profit split 50/50 rep and company." },
  { id: "grossContract", label: "Gross Contract", usesRate: true, usesOverhead: false,
    blurb: "Rate % of total contract value, regardless of job cost." },
];
function computeCapOut(job) {
  const { materials, labor, other, cogs } = computeFin(job.fin);
  const contract = job.contract.price || estimateTotal(job.estimate) || job.value || 0;
  const gross = contract - cogs;
  const structure = job.fin.structure || "grossProfit";
  const rate = job.fin.commissionRate;
  const overheadPct = job.fin.overheadPct ?? 10;
  const overheadAlloc = contract * (overheadPct / 100);
  const net = gross - overheadAlloc;

  let commission = 0, base = 0, baseLabel = "";
  if (structure === "netProfit") {
    base = net; baseLabel = "Net profit";
    commission = Math.max(0, net) * (rate / 100);
  } else if (structure === "tenFiftyFifty") {
    const top = contract * 0.10;
    const remaining = gross - top;
    base = remaining; baseLabel = "Profit after 10% overhead";
    commission = Math.max(0, remaining) * 0.5;
  } else if (structure === "grossContract") {
    base = contract; baseLabel = "Contract value";
    commission = contract * (rate / 100);
  } else {
    base = gross; baseLabel = "Gross profit";
    commission = Math.max(0, gross) * (rate / 100);
  }
  const netCompany = gross - commission;
  const reimbTotal = job.fin.reimbursements.reduce((s, r) => s + r.amt, 0);
  return {
    contract, materials, labor, other, cogs, gross,
    grossMargin: contract ? (gross / contract) * 100 : 0,
    structure, base, baseLabel, overheadAlloc, overheadPct,
    commission, netCompany,
    repPctGross: gross > 0 ? (commission / gross) * 100 : 0,
    coPctGross: gross > 0 ? (netCompany / gross) * 100 : 0,
    repPctJob: contract ? (commission / contract) * 100 : 0,
    coPctJob: contract ? (netCompany / contract) * 100 : 0,
    reimbTotal, payout: commission + reimbTotal,
  };
}
/* Same job under every structure — admin-only what-if comparison. */
function compareStructures(job) {
  return STRUCTURES.map((st) => {
    const c = computeCapOut({ ...job, fin: { ...job.fin, structure: st.id } });
    return { id: st.id, label: st.label, commission: c.commission, netCompany: c.netCompany };
  });
}
function paymentsSummary(job) {
  const received = job.payments.filter((p) => p.type === "Received").reduce((s, p) => s + p.amt, 0);
  const paidOut = job.payments.filter((p) => p.type !== "Received").reduce((s, p) => s + p.amt, 0);
  const contract = job.contract.price || estimateTotal(job.estimate) || job.value || 0;
  return { received, paidOut, contract, balance: contract - received };
}
function downloadCsv(name, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  URL.revokeObjectURL(a.href);
}
function jurisdictionForZip(zip) { return resolveJurisdiction(zip); }
function citeFor(state, topic) {
  return (CODE_PROVISIONS[state] && CODE_PROVISIONS[state][topic]) || CODE_PROVISIONS.OH[topic];
}

/* Material list generator — quantities from measurements + waste. */
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
    { item: "Cap nails", qty: Math.max(1, Math.ceil(sq / 30)), unit: "boxes", note: "underlayment fastening" },
  ];
}

/* ================================================================
   AUTH ADAPTER
   When the app is deployed with Supabase credentials, src/main.jsx
   puts a real auth client on window.__AUTH__ and everything below
   runs against it. With no backend present the app falls back to the
   demo account picker so it still previews and demos.
   ================================================================ */
const AUTH = () => (typeof window !== "undefined" ? window.__AUTH__ : null);
const liveAuth = () => !!AUTH();
/* Map a database profile row onto the shape the UI already uses. */
const fromProfile = (row) => ({
  id: row.id, name: row.name, email: row.email, phone: row.phone || "",
  role: row.role, title: row.title || "", active: row.active,
  commissionRate: row.commission_rate != null ? Number(row.commission_rate) : 60,
  addedAt: row.added_at || "",
});
const toProfile = (u) => ({
  name: u.name, email: u.email, phone: u.phone || null, role: u.role,
  title: u.title || null, commission_rate: u.commissionRate ?? 60, active: u.active,
});

/* ================================================================
   SHARED UI
   ================================================================ */
const S = { ink: "#111827", sub: "#6B7280", line: "#E5E7EB", bg: "#F7F8FA", soft: "#F3F4F6" };

function Chip({ children, tone = "gray" }) {
  const tones = {
    gray: { bg: "#F3F4F6", fg: "#374151" },
    blue: { bg: "#EAF2FD", fg: "#1B6DE0" },
    green: { bg: "#E8F6EE", fg: "#177245" },
    red: { bg: "#FDECEC", fg: "#B42318" },
    amber: { bg: "#FDF4E3", fg: "#92600A" },
    slate: { bg: "#E9EDEF", fg: "#28373E" },
  };
  const t = tones[tone] || tones.gray;
  return (
    <span style={{
      background: t.bg, color: t.fg, fontSize: 12, fontWeight: 600,
      padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap", display: "inline-block",
    }}>{children}</span>
  );
}

function Btn({ children, kind = "primary", onClick, style, small, disabled }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    border: "1px solid transparent", borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600, fontSize: small ? 13 : 15,
    padding: small ? "7px 12px" : "11px 18px",
    opacity: disabled ? 0.5 : 1,
  };
  const kinds = {
    primary: { background: "#1B6DE0", color: "#fff" },
    dark: { background: "#28373E", color: "#fff" },
    ghost: { background: "#fff", color: S.ink, border: `1px solid ${S.line}` },
    soft: { background: "#EAF2FD", color: "#1B6DE0" },
    danger: { background: "#fff", color: "#B42318", border: `1px solid ${S.line}` },
    green: { background: "#177245", color: "#fff" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...kinds[kind], ...style }}>
      {children}
    </button>
  );
}

function Field({ label, children, hint }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: S.ink, marginBottom: 6 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 12, color: S.sub, marginTop: 5 }}>{hint}</div>}
    </label>
  );
}
const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "11px 13px", fontSize: 15,
  border: `1px solid ${S.line}`, borderRadius: 10, background: "#fff", color: S.ink, outline: "none",
  fontFamily: "inherit",
};
const selStyle = { ...inputStyle, appearance: "auto" };

function Card({ children, style, pad = 18 }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${S.line}`, borderRadius: 14, padding: pad, ...style }}>
      {children}
    </div>
  );
}
function CardTitle({ children, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: S.ink }}>{children}</div>
      {right}
    </div>
  );
}
function KV({ k, v, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0" }}>
      <span style={{ fontSize: 13, color: S.sub }}>{k}</span>
      <span style={{ fontSize: 13, fontWeight: strong ? 800 : 600, color: S.ink, textAlign: "right" }}>{v}</span>
    </div>
  );
}

/* Merged from the Ridgeline repo. */
function Callout({ label, children, tone = "amber" }) {
  const map = {
    amber: ["#FDF4E3", "#92600A"], red: ["#FDECEC", "#B42318"], green: ["#E8F6EE", "#177245"],
  };
  const [bg, fg] = map[tone] || map.amber;
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
function SourceLink({ srcId }) {
  const s = SOURCES[srcId];
  if (!s) return null;
  return (
    <a href={s.url} target="_blank" rel="noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none",
      border: `1px solid ${S.line}`, borderRadius: 999, padding: "6px 12px",
      fontSize: 12.5, fontWeight: 700, color: "#1B6DE0", background: "#fff", marginTop: 8, marginRight: 8,
    }}>
      <ExternalLink size={13} /> {s.name}
    </a>
  );
}

/* ================================================================
   ADDRESS AUTOCOMPLETE — debounced Geoapify typeahead.
   Degrades to a plain text field if the API is unreachable, so a
   lead can always be written.
   ================================================================ */
function AddressAutocomplete({ value, onChange, onPick, placeholder }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hi, setHi] = useState(-1);
  const abortRef = useRef(null);
  const timerRef = useRef(null);
  const blurRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();
    if (blurRef.current) clearTimeout(blurRef.current);
  }, []);

  const query = (text) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!geoReady() || text.trim().length < 3) { setItems([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const ctl = new AbortController();
      abortRef.current = ctl;
      setBusy(true);
      const res = await geoAutocomplete(text, ctl.signal);
      setBusy(false);
      setItems(res); setHi(-1);
      setOpen(res.length > 0);
    }, 280);
  };

  const choose = (it) => {
    setOpen(false); setItems([]);
    onPick(it);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input
          style={{ ...inputStyle, paddingRight: 36 }}
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => { onChange(e.target.value); query(e.target.value); }}
          onFocus={() => items.length && setOpen(true)}
          onBlur={() => { blurRef.current = setTimeout(() => setOpen(false), 160); }}
          onKeyDown={(e) => {
            if (!open || !items.length) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % items.length); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h - 1 + items.length) % items.length); }
            else if (e.key === "Enter" && hi >= 0) { e.preventDefault(); choose(items[hi]); }
            else if (e.key === "Escape") setOpen(false);
          }}
        />
        <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
          {busy ? <RefreshCw size={15} color="#9CA3AF" /> : <MapPin size={15} color="#C7CBD1" />}
        </span>
      </div>
      {open && items.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 30,
          background: "#fff", border: `1px solid ${S.line}`, borderRadius: 12,
          boxShadow: "0 10px 28px rgba(17,24,39,.14)", overflow: "hidden", maxHeight: 260, overflowY: "auto",
        }}>
          {items.map((it, i) => (
            <button key={it.id} type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(it)}
              onMouseEnter={() => setHi(i)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 10, width: "100%", textAlign: "left",
                border: "none", cursor: "pointer", padding: "11px 13px",
                background: hi === i ? "#EAF2FD" : "#fff",
                borderTop: i ? `1px solid ${S.line}` : "none",
              }}>
              <MapPin size={14} color="#1B6DE0" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: S.ink }}>
                  {it.street || it.formatted}
                </span>
                <span style={{ display: "block", fontSize: 12, color: S.sub, marginTop: 2 }}>
                  {[it.city, it.state, it.zip].filter(Boolean).join(", ")}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Sheet({ open, onClose, title, children, footer, wide }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 60, background: "rgba(17,24,39,.45)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", width: "100%", maxWidth: wide ? 760 : 560, maxHeight: "90vh",
        borderRadius: "18px 18px 0 0", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 12px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: S.ink }}>{title}</div>
          <button onClick={onClose} style={{
            border: "none", background: "#F3F4F6", borderRadius: 999, width: 34, height: 34,
            display: "grid", placeItems: "center", cursor: "pointer",
          }}><X size={17} /></button>
        </div>
        <div style={{ overflowY: "auto", padding: "4px 20px 20px", flex: 1 }}>{children}</div>
        {footer && <div style={{ padding: "12px 20px 20px", borderTop: `1px solid ${S.line}` }}>{footer}</div>}
      </div>
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)",
      background: "#111827", color: "#fff", borderRadius: 999, padding: "10px 18px",
      fontSize: 14, fontWeight: 600, zIndex: 90, whiteSpace: "nowrap",
    }}>{msg}</div>
  );
}

/* ================================================================
   SIGNATURE PAD — canvas capture, stored as data URL with timestamp
   ================================================================ */
function SignaturePad({ open, onClose, title, onApply }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  useEffect(() => {
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
    return { x: ((t.clientX - r.left) / r.width) * cv.width, y: ((t.clientY - r.top) / r.height) * cv.height };
  };
  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = ref.current.getContext("2d");
    const p = pos(e);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
  };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = ref.current.getContext("2d");
    const p = pos(e);
    ctx.lineTo(p.x, p.y); ctx.stroke();
    dirty.current = true;
  };
  const end = () => { drawing.current = false; };
  const clear = () => {
    const cv = ref.current, ctx = cv.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
    dirty.current = false;
  };
  if (!open) return null;
  return (
    <Sheet open={open} onClose={onClose} title={title}
      footer={
        <div style={{ display: "flex", gap: 10 }}>
          <Btn kind="ghost" style={{ flex: 1 }} onClick={clear}>Clear</Btn>
          <Btn style={{ flex: 2 }} onClick={() => {
            if (!dirty.current) return;
            onApply(ref.current.toDataURL("image/png"), nowStamp());
            onClose();
          }}>Apply signature</Btn>
        </div>
      }>
      <div style={{ fontSize: 14, color: S.sub, marginBottom: 12 }}>
        Sign with a finger or stylus. The signature and today's date are placed on the acceptance line, and the
        document is locked against silent edits.
      </div>
      <canvas
        ref={ref} width={800} height={300}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
        style={{
          width: "100%", height: 190, border: `1.5px dashed ${S.line}`, borderRadius: 12,
          touchAction: "none", background: "#fff", display: "block",
        }}
      />
    </Sheet>
  );
}

/* ================================================================
   LOGIN
   ================================================================ */
function Login({ brand, users, onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const active = (users || []).filter((u) => u.active);
  const live = liveAuth();

  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      await AUTH().signIn(email.trim(), pw);
      // The session listener in the root component takes it from here.
    } catch (e) {
      setErr(e && e.message ? e.message : "Could not sign in. Check the email and password.");
      setBusy(false);
    }
  };
  const reset = async () => {
    setErr(""); setBusy(true);
    try { await AUTH().resetPassword(email.trim()); setMode("sent"); }
    catch (e) { setErr(e && e.message ? e.message : "Could not send the reset link."); }
    setBusy(false);
  };

  /* Demo picker — only when no backend is configured. */
  if (!live && mode === "account") {
    return (
      <div style={{ minHeight: "100vh", background: brand.primary, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Shield size={28} color={brand.primary} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{brand.company}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{brand.slogan}</div>
          </div>
          <Card style={{ padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.sub, padding: "4px 6px 10px" }}>Continue as</div>
            {active.map((u, i) => (
              <button key={u.id} onClick={() => onLogin(u)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                border: "none", background: "none", cursor: "pointer", padding: "12px 6px",
                borderTop: i ? `1px solid ${S.line}` : "none",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 999, flexShrink: 0,
                  background: u.role === "admin" ? brand.primary : "#EAF2FD",
                  color: u.role === "admin" ? "#fff" : "#1B6DE0",
                  display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14,
                }}>{u.name.split(" ").map((x) => x[0]).join("")}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: S.ink }}>{u.name}</div>
                  <div style={{ fontSize: 12.5, color: S.sub }}>{u.title}</div>
                </div>
                {u.role === "admin"
                  ? <Chip tone="gray"><Lock size={10} style={{ marginRight: 4, verticalAlign: -1 }} />Admin</Chip>
                  : <ChevronRight size={16} color="#C7CBD1" />}
              </button>
            ))}
          </Card>
          <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 14 }}>
            Demo mode — no backend connected. Nothing you change here is saved.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24, position: "relative",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, margin: "0 auto 14px", borderRadius: 16,
            background: brand.primary, color: "#fff", display: "grid", placeItems: "center",
            fontWeight: 800, fontSize: 20, letterSpacing: 1,
          }}>{brand.short}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: S.ink }}>{brand.company}</div>
          <div style={{ fontSize: 14, color: S.sub, marginTop: 6 }}>{brand.slogan}</div>
        </div>

        {mode === "login" && (
          <>
            <Field label="Email">
              <input style={inputStyle} type="email" autoComplete="username" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@supremebuildinggroup.com" />
            </Field>
            <Field label="Password">
              <input style={inputStyle} type="password" autoComplete="current-password" value={pw}
                onChange={(e) => setPw(e.target.value)} placeholder="••••••••"
                onKeyDown={(e) => { if (e.key === "Enter" && live && email && pw) submit(); }} />
            </Field>
            {err && <Callout label="Sign-in failed" tone="red">{err}</Callout>}
            <Btn
              onClick={live ? submit : () => setMode("account")}
              disabled={busy || (live && (!email.trim() || !pw))}
              style={{ width: "100%", marginTop: 4 }}>
              {busy ? "Signing in…" : "Sign in"}
            </Btn>
            <button onClick={() => { setErr(""); setMode("forgot"); }} style={{
              display: "block", margin: "16px auto 0", border: "none", background: "none",
              color: "#1B6DE0", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}>Forgot password?</button>
            {!live && (
              <div style={{ textAlign: "center", fontSize: 12, color: S.sub, marginTop: 18, lineHeight: 1.5 }}>
                No backend connected — sign in opens the demo account picker.
              </div>
            )}
          </>
        )}

        {mode === "forgot" && (
          <>
            <div style={{ fontSize: 15, color: S.sub, marginBottom: 18 }}>
              Enter your email and we'll send a link to set a new password.
            </div>
            <Field label="Email">
              <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            {err && <Callout label="Could not send" tone="red">{err}</Callout>}
            <Btn onClick={live ? reset : () => setMode("sent")} disabled={busy || !email.trim()} style={{ width: "100%" }}>
              {busy ? "Sending…" : "Send reset link"}
            </Btn>
            <button onClick={() => { setErr(""); setMode("login"); }} style={{
              display: "block", margin: "16px auto 0", border: "none", background: "none",
              color: S.sub, fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}>Back to sign in</button>
          </>
        )}

        {mode === "sent" && (
          <div style={{ textAlign: "center" }}>
            <CheckCircle2 size={40} color="#177245" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: S.ink, marginBottom: 6 }}>Check your email</div>
            <div style={{ fontSize: 14, color: S.sub, marginBottom: 20 }}>
              If an account exists for {email || "that address"}, a reset link is on its way.
            </div>
            <Btn kind="ghost" onClick={() => setMode("login")} style={{ width: "100%" }}>Back to sign in</Btn>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", bottom: 20, fontSize: 12, color: "#9CA3AF" }}>
        © {new Date().getFullYear()} {brand.company}
      </div>
    </div>
  );
}

/* ================================================================
   DASHBOARD
   ================================================================ */
function Dashboard({ jobs, stages, onOpenJob, userName, go }) {
  const totalPipeline = jobs.filter((j) => !DEAD_STAGES.includes(j.stageId) && j.stageId !== "s10").reduce((s, j) => s + j.value, 0);
  const stale = jobs.filter((j) => j.daysInStage >= 14 && !["s10","s11","s12"].includes(j.stageId));
  const approvedPlus = jobs.filter((j) => WON_STAGES.includes(j.stageId));
  const signedValue = approvedPlus.reduce((s, j) => s + (j.contract.price || j.value), 0);
  const byStage = stages.map((s) => ({
    ...s,
    count: jobs.filter((j) => j.stageId === s.id).length,
    value: jobs.filter((j) => j.stageId === s.id).reduce((a, j) => a + j.value, 0),
  }));
  const reviewsSent = jobs.filter((j) => j.review.sent).length;
  const ar = jobs.map((j) => paymentsSummary(j)).filter((p) => p.balance > 0.01 && p.contract > 0);
  const arTotal = ar.reduce((s, p) => s + p.balance, 0);
  const openTasks = jobs.flatMap((j) => j.tasks.filter((t) => !t.done).map((t) => ({ job: j, t })));

  return (
    <div style={{ padding: "20px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: S.ink }}>
        Welcome back, {userName.split(" ")[0]}
      </div>
      <div style={{ fontSize: 14, color: S.sub, marginTop: 4 }}>
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
        {[
          ["Pipeline value", money(totalPipeline), "Open jobs, all stages"],
          ["Signed value", money(signedValue), "Approved and beyond"],
          ["Accounts receivable", money(arTotal), `${ar.length} open balance${ar.length === 1 ? "" : "s"}`],
          ["Stale jobs", String(stale.length), "14+ days untouched"],
        ].map(([l, v, sub]) => (
          <Card key={l} pad={16}>
            <div style={{ fontSize: 20, fontWeight: 800, color: S.ink }}>{v}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.ink, marginTop: 4 }}>{l}</div>
            <div style={{ fontSize: 12, color: S.sub, marginTop: 2 }}>{sub}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginTop: 14 }}>
        <CardTitle right={
          <button onClick={() => go("jobs")} style={{ border: "none", background: "none", color: "#1B6DE0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Open board
          </button>
        }>Pipeline by stage</CardTitle>
        {byStage.filter((s) => s.count > 0).map((s) => (
          <div key={s.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
              <span style={{ fontWeight: 600, color: S.ink }}>{s.name} · {s.count}</span>
              <span style={{ color: S.sub }}>{money(s.value)}</span>
            </div>
            <div style={{ height: 7, background: "#EEF1F4", borderRadius: 99 }}>
              <div style={{
                height: 7, borderRadius: 99, background: "#1B6DE0",
                width: `${Math.max(5, totalPipeline + signedValue ? (s.value / Math.max(totalPipeline, signedValue)) * 100 : 0)}%`,
                maxWidth: "100%",
              }} />
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ marginTop: 14 }}>
        <CardTitle>Needs attention</CardTitle>
        {stale.length === 0 && openTasks.length === 0 && (
          <div style={{ fontSize: 14, color: S.sub }}>Nothing stale and no open tasks. Pipeline is moving.</div>
        )}
        {stale.map((j) => (
          <button key={j.id} onClick={() => onOpenJob(j.id)} style={{
            width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
            border: "none", background: "none", cursor: "pointer", textAlign: "left",
            padding: "11px 0", borderBottom: `1px solid ${S.line}`,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: S.ink }}>{j.name}</div>
              <div style={{ fontSize: 12, color: S.sub }}>{j.address}</div>
            </div>
            <Chip tone="red">{j.daysInStage}d in stage</Chip>
          </button>
        ))}
        {openTasks.slice(0, 5).map(({ job, t }) => (
          <button key={job.id + t.id} onClick={() => onOpenJob(job.id)} style={{
            width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
            border: "none", background: "none", cursor: "pointer", textAlign: "left",
            padding: "11px 0", borderBottom: `1px solid ${S.line}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Circle size={16} color="#C7CBD1" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: S.ink }}>{t.label}</div>
                <div style={{ fontSize: 12, color: S.sub }}>{job.name}</div>
              </div>
            </div>
            <ChevronRight size={16} color="#C7CBD1" />
          </button>
        ))}
      </Card>

      <Card style={{ marginTop: 14 }}>
        <CardTitle right={<Chip tone="blue">{reviewsSent} sent</Chip>}>Reviews</CardTitle>
        <div style={{ fontSize: 13, color: S.sub }}>
          Completed jobs with SMS or email consent get an automatic Google review request. Manage settings under
          More → Review automation.
        </div>
      </Card>
    </div>
  );
}

/* ================================================================
   PERFORMANCE — rep scoreboard + funnel, computed from live jobs
   ================================================================ */
function Performance({ jobs, stages, users, onBack, isAdmin, currentUser, toast }) {
  const [scope, setScope] = useState(isAdmin ? "company" : currentUser.name);
  const [range, setRange] = useState("all");
  const [tab, setTab] = useState("summary");

  const scoped = useMemo(
    () => (scope === "company" ? jobs : jobs.filter((j) => j.assignee === scope)),
    [jobs, scope]);

  const stat = useMemo(() => {
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
      total: scoped.length, won: won.length, lost: lost.length, unq: unq.length,
      done: done.length, open: open.length,
      openValue: open.reduce((x, j) => x + j.value, 0),
      revenue, cogs, gross, commission, reimb, netCo,
      payout: commission + reimb,
      margin: revenue ? (gross / revenue) * 100 : 0,
      closeRate: decided ? (won.length / decided) * 100 : 0,
      avgJob: won.length ? revenue / won.length : 0,
      ar: pay.reduce((x, p) => x + Math.max(0, p.balance), 0),
      collected: pay.reduce((x, p) => x + p.received, 0),
      insurance: scoped.filter((j) => j.claimType === "Insurance").length,
      retail: scoped.filter((j) => j.claimType === "Retail").length,
      reviews: scoped.filter((j) => j.review.posted).length,
      reviewsSent: scoped.filter((j) => j.review.sent).length,
      caps,
    };
  }, [scoped]);

  const reps = useMemo(() => users.filter((u) => u.role !== "crew").map((u) => {
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
      name: u.name, leads: mine.length, won: won.length,
      closeRate: decided ? (won.length / decided) * 100 : 0,
      revenue, gross, commission, reimb, payout: commission + reimb,
      margin: revenue ? (gross / revenue) * 100 : 0,
      avgJob: won.length ? revenue / won.length : 0,
    };
  }).sort((a2, b2) => b2.revenue - a2.revenue), [jobs, users]);

  const sourceRows = useMemo(() => {
    const map = {};
    scoped.forEach((j) => {
      const k = j.leadSource || "Unattributed";
      if (!map[k]) map[k] = { source: k, leads: 0, won: 0, revenue: 0 };
      map[k].leads++;
      if (WON_STAGES.includes(j.stageId)) { map[k].won++; map[k].revenue += computeCapOut(j).contract; }
    });
    return Object.values(map).sort((a2, b2) => b2.revenue - a2.revenue || b2.leads - a2.leads);
  }, [scoped]);

  const commissionRows = useMemo(() => scoped
    .filter((j) => WON_STAGES.includes(j.stageId))
    .map((j) => ({ job: j, cap: computeCapOut(j) }))
    .sort((a2, b2) => b2.cap.payout - a2.cap.payout), [scoped]);

  const Stat = ({ label, value, sub, tone }) => (
    <Card pad={14}>
      <div style={{ fontSize: 19, fontWeight: 800, color: tone || S.ink }}>{value}</div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: S.ink, marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, color: S.sub, marginTop: 2 }}>{sub}</div>}
    </Card>
  );

  const exportCommission = () => {
    const rows = [
      [`Commission report — ${scope === "company" ? "Company-wide" : scope}`],
      [`Generated ${new Date().toLocaleDateString()}`], [],
      ["Job", "Address", "Rep", "Stage", "Contract", "COGS", "Gross profit", "Margin %", "Structure", "Commission", "Reimbursements", "Total payout"],
      ...commissionRows.map(({ job, cap }) => [
        job.name, job.address, job.assignee,
        (stages.find((x) => x.id === job.stageId) || {}).name || "",
        cap.contract.toFixed(2), cap.cogs.toFixed(2), cap.gross.toFixed(2),
        cap.grossMargin.toFixed(2), cap.structure,
        cap.commission.toFixed(2), cap.reimbTotal.toFixed(2), cap.payout.toFixed(2),
      ]),
      [],
      ["TOTALS", "", "", "",
        stat.revenue.toFixed(2), stat.cogs.toFixed(2), stat.gross.toFixed(2),
        stat.margin.toFixed(2), "",
        stat.commission.toFixed(2), stat.reimb.toFixed(2), stat.payout.toFixed(2)],
    ];
    downloadCsv(`commission-${scope === "company" ? "company" : scope.split(" ")[0].toLowerCase()}.csv`, rows);
    toast("Commission report exported");
  };

  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <SubHeader title="Performance" onBack={onBack} />

      <Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: S.sub, marginBottom: 8 }}>VIEWING</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {isAdmin && (
            <button onClick={() => setScope("company")} style={{
              border: `1.5px solid ${scope === "company" ? "#1B6DE0" : S.line}`,
              background: scope === "company" ? "#EAF2FD" : "#fff",
              color: scope === "company" ? "#1B6DE0" : S.ink,
              borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>Company-wide</button>
          )}
          {users.filter((u) => u.role !== "crew" && (isAdmin || u.name === currentUser.name)).map((u) => (
            <button key={u.id} onClick={() => setScope(u.name)} style={{
              border: `1.5px solid ${scope === u.name ? "#1B6DE0" : S.line}`,
              background: scope === u.name ? "#EAF2FD" : "#fff",
              color: scope === u.name ? "#1B6DE0" : S.ink,
              borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>{u.name.split(" ")[0]}</button>
          ))}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 6, marginTop: 12, overflowX: "auto" }}>
        {[["summary", "Summary"], ["commission", "Commission"], isAdmin && ["reps", "By rep"], ["sources", "Lead sources"], ["pipeline", "Pipeline"]]
          .filter(Boolean).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              border: "none", background: tab === id ? "#28373E" : "#fff",
              color: tab === id ? "#fff" : S.ink, borderRadius: 999,
              padding: "9px 15px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              whiteSpace: "nowrap", flexShrink: 0,
            }}>{label}</button>
          ))}
      </div>

      {tab === "summary" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Stat label="Signed revenue" value={money(stat.revenue)} sub={`${stat.won} jobs won`} />
            <Stat label="Gross profit" value={money(stat.gross)} sub={`${pct1(stat.margin)} margin`} tone="#177245" />
            <Stat label="Close rate" value={pct1(stat.closeRate)} sub={`${stat.won} won / ${stat.lost} lost`} />
            <Stat label="Average job" value={money(stat.avgJob)} sub="Signed jobs only" />
            <Stat label="Open pipeline" value={money(stat.openValue)} sub={`${stat.open} active jobs`} />
            <Stat label="Receivable" value={money(stat.ar)} sub={`${money(stat.collected)} collected`} tone={stat.ar > 0 ? "#B42318" : undefined} />
          </div>
          <Card style={{ marginTop: 12 }}>
            <CardTitle>Job mix</CardTitle>
            <KV k="Insurance" v={`${stat.insurance} job${stat.insurance === 1 ? "" : "s"}`} />
            <KV k="Retail" v={`${stat.retail} job${stat.retail === 1 ? "" : "s"}`} />
            <KV k="Completed" v={String(stat.done)} />
            <KV k="Lost" v={String(stat.lost)} />
            <KV k="Unqualified" v={String(stat.unq)} />
          </Card>
          <Card style={{ marginTop: 12 }}>
            <CardTitle>Reviews</CardTitle>
            <KV k="Requests sent" v={String(stat.reviewsSent)} />
            <KV k="Reviews posted" v={String(stat.reviews)} />
            <KV k="Conversion" v={stat.reviewsSent ? pct1((stat.reviews / stat.reviewsSent) * 100) : "—"} />
          </Card>
        </div>
      )}

      {tab === "commission" && (
        <div style={{ marginTop: 12 }}>
          <Card>
            <CardTitle right={<Btn kind="ghost" small onClick={exportCommission}><Download size={13} /> CSV</Btn>}>
              {scope === "company" ? "All reps combined" : scope}
            </CardTitle>
            <KV k="Jobs included" v={String(commissionRows.length)} />
            <KV k="Contract revenue" v={money(stat.revenue)} />
            <KV k="Total COGS" v={money(stat.cogs)} />
            <KV k="Gross profit" v={money(stat.gross)} strong />
            <KV k="Gross margin" v={pct1(stat.margin)} />
            <div style={{ height: 1, background: S.line, margin: "10px 0" }} />
            <KV k="Commission" v={money(stat.commission)} strong />
            <KV k="Reimbursements" v={money(stat.reimb)} />
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#EAF2FD", borderRadius: 10, padding: "12px 14px", marginTop: 10,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#28373E" }}>Total payout</span>
              <span style={{ fontSize: 19, fontWeight: 800, color: "#1B6DE0" }}>{money(stat.payout)}</span>
            </div>
            {isAdmin && <KV k="Net to company" v={money(stat.netCo)} strong />}
          </Card>

          <div style={{ fontSize: 12.5, fontWeight: 700, color: S.sub, margin: "16px 0 8px" }}>PER JOB</div>
          {commissionRows.map(({ job, cap }) => (
            <Card key={job.id} pad={15} style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{job.name}</div>
                  <div style={{ fontSize: 12, color: S.sub, marginTop: 2 }}>{job.address}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1B6DE0" }}>{money(cap.payout)}</div>
                  <div style={{ fontSize: 11, color: S.sub }}>payout</div>
                </div>
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${S.line}` }}>
                <KV k="Contract" v={money(cap.contract)} />
                <KV k="Gross profit" v={`${money(cap.gross)} · ${pct1(cap.grossMargin)}`} />
                <KV k="Commission" v={money(cap.commission)} />
                <KV k="Reimbursements" v={money(cap.reimbTotal)} />
              </div>
              {scope === "company" && (
                <div style={{ marginTop: 8 }}><Chip tone="gray">{job.assignee}</Chip></div>
              )}
            </Card>
          ))}
          {commissionRows.length === 0 && (
            <Card style={{ marginTop: 10 }}><div style={{ fontSize: 14, color: S.sub }}>No signed jobs in this view yet.</div></Card>
          )}
        </div>
      )}

      {tab === "reps" && isAdmin && (
        <div style={{ marginTop: 12 }}>
          {reps.map((r, i) => (
            <Card key={r.name} pad={15} style={{ marginTop: i ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{money(r.revenue)}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
                {[["Jobs", r.leads], ["Won", r.won], ["Close", pct1(r.closeRate)],
                  ["Gross", money(r.gross)], ["Margin", pct1(r.margin)], ["Avg job", money(r.avgJob)]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: S.ink }}>{v}</div>
                    <div style={{ fontSize: 11, color: S.sub }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 10,
                borderTop: `1px solid ${S.line}`,
              }}>
                <span style={{ fontSize: 13, color: S.sub }}>Commission {money(r.commission)} + reimb {money(r.reimb)}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#1B6DE0" }}>{money(r.payout)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "sources" && (
        <Card style={{ marginTop: 12 }}>
          <CardTitle>Lead source performance</CardTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 380 }}>
              <thead>
                <tr style={{ textAlign: "left", color: S.sub }}>
                  <th style={{ padding: "8px 6px" }}>Source</th>
                  <th style={{ padding: "8px 6px" }}>Leads</th>
                  <th style={{ padding: "8px 6px" }}>Won</th>
                  <th style={{ padding: "8px 6px" }}>Close</th>
                  <th style={{ padding: "8px 6px" }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {sourceRows.map((r) => (
                  <tr key={r.source} style={{ borderTop: `1px solid ${S.line}` }}>
                    <td style={{ padding: "10px 6px", fontWeight: 700 }}>{r.source}</td>
                    <td style={{ padding: "10px 6px" }}>{r.leads}</td>
                    <td style={{ padding: "10px 6px" }}>{r.won}</td>
                    <td style={{ padding: "10px 6px" }}>{r.leads ? pct1((r.won / r.leads) * 100) : "—"}</td>
                    <td style={{ padding: "10px 6px", fontWeight: 700 }}>{money(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "pipeline" && (
        <Card style={{ marginTop: 12 }}>
          <CardTitle>Stage distribution</CardTitle>
          {stages.map((st) => {
            const inStage = scoped.filter((j) => j.stageId === st.id);
            const max = Math.max(1, ...stages.map((x) => scoped.filter((j) => j.stageId === x.id).length));
            return (
              <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                <div style={{ width: 140, fontSize: 12, color: S.sub, flexShrink: 0 }}>{st.name}</div>
                <div style={{ flex: 1, height: 18, background: "#EEF1F4", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${(inStage.length / max) * 100}%`,
                    background: DEAD_STAGES.includes(st.id) ? "#B42318" : WON_STAGES.includes(st.id) ? "#177245" : "#28373E",
                    borderRadius: 6, minWidth: inStage.length ? 18 : 0,
                  }} />
                </div>
                <div style={{ width: 28, fontSize: 13, fontWeight: 700, textAlign: "right" }}>{inStage.length}</div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

function SubHeader({ title, onBack, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{
          border: `1px solid ${S.line}`, background: "#fff", borderRadius: 999,
          width: 36, height: 36, display: "grid", placeItems: "center", cursor: "pointer",
        }}><ChevronLeft size={18} /></button>
        <div style={{ fontSize: 22, fontWeight: 800, color: S.ink }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

/* ================================================================
   CALENDAR — month grid; jobs with a scheduled date appear as dots
   ================================================================ */
function CalendarView({ jobs, onBack, onOpenJob }) {
  const [ym, setYm] = useState(() => {
    const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() };
  });
  const first = new Date(ym.y, ym.m, 1);
  const startDow = first.getDay();
  const daysIn = new Date(ym.y, ym.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(d);
  const monthName = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const jobsOn = (d) => {
    const key = `${ym.y}-${String(ym.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return jobs.filter((j) => j.schedDate === key);
  };
  const scheduled = jobs.filter((j) => j.schedDate).sort((a, b) => a.schedDate.localeCompare(b.schedDate));
  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <SubHeader title="Calendar" onBack={onBack} />
      <Card style={{ marginTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button onClick={() => setYm(ym.m === 0 ? { y: ym.y - 1, m: 11 } : { y: ym.y, m: ym.m - 1 })} style={pillIcon}><ChevronLeft size={16} /></button>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{monthName}</div>
          <button onClick={() => setYm(ym.m === 11 ? { y: ym.y + 1, m: 0 } : { y: ym.y, m: ym.m + 1 })} style={pillIcon}><ChevronRight size={16} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: S.sub, padding: "4px 0" }}>{d}</div>
          ))}
          {cells.map((d, i) => {
            const dayJobs = d ? jobsOn(d) : [];
            const isToday = d && ym.y === new Date().getFullYear() && ym.m === new Date().getMonth() && d === new Date().getDate();
            return (
              <div key={i} style={{
                minHeight: 44, borderRadius: 8, padding: 4, textAlign: "center",
                background: isToday ? "#28373E" : d ? "#FAFBFC" : "transparent",
                border: d ? `1px solid ${S.line}` : "none",
              }}>
                {d && <div style={{ fontSize: 12, fontWeight: 700, color: isToday ? "#fff" : S.ink }}>{d}</div>}
                <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 3 }}>
                  {dayJobs.slice(0, 3).map((j) => (
                    <span key={j.id} style={{ width: 6, height: 6, borderRadius: 99, background: "#1B6DE0", display: "inline-block" }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: S.sub, marginTop: 10 }}>● scheduled jobs and material drops</div>
      </Card>
      <Card style={{ marginTop: 14 }}>
        <CardTitle>Scheduled</CardTitle>
        {scheduled.length === 0 && <div style={{ fontSize: 14, color: S.sub }}>Nothing on the calendar yet.</div>}
        {scheduled.map((j) => (
          <button key={j.id} onClick={() => onOpenJob(j.id)} style={{
            width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
            border: "none", background: "none", cursor: "pointer", textAlign: "left",
            padding: "11px 0", borderBottom: `1px solid ${S.line}`,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{j.name}</div>
              <div style={{ fontSize: 12, color: S.sub }}>{j.address}</div>
            </div>
            <Chip tone="blue">{j.schedDate}</Chip>
          </button>
        ))}
      </Card>
    </div>
  );
}
const pillIcon = {
  border: `1px solid #E5E7EB`, background: "#fff", borderRadius: 999,
  width: 32, height: 32, display: "grid", placeItems: "center", cursor: "pointer",
};

/* ================================================================
   CONTACTS
   ================================================================ */
function Contacts({ jobs, onBack, onOpenJob }) {
  const [q, setQ] = useState("");
  const list = jobs.filter((j) =>
    (j.name + j.address + j.phone + j.email).toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <SubHeader title="Contacts" onBack={onBack} />
      <div style={{ marginTop: 14 }}>
        <input style={inputStyle} placeholder="Search name, address, phone, email" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        {list.map((j) => (
          <Card key={j.id} pad={16} style={{ marginBottom: 10, cursor: "pointer" }}>
            <div onClick={() => onOpenJob(j.id)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{j.name}</div>
                <Chip tone="slate">{j.state}</Chip>
              </div>
              <div style={{ fontSize: 13, color: S.sub, marginTop: 3 }}>{j.address}</div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 13, color: S.sub, flexWrap: "wrap" }}>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Phone size={13} /> {j.phone}</span>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Mail size={13} /> {j.email}</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <Chip tone={j.consent.sms.granted ? "green" : "gray"}>
                  SMS {j.consent.sms.granted ? "consent on file" : "no consent"}
                </Chip>
                <Chip tone={j.consent.email.granted ? "green" : "gray"}>
                  Email {j.consent.email.granted ? "consent" : "no consent"}
                </Chip>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   NEW LEAD — intake with claim type, insurance details, and
   timestamped SMS/email consent captured at the point of collection
   ================================================================ */
function NewLeadSheet({ open, onClose, onCreate, brand }) {
  const blank = {
    first: "", last: "", phone: "", email: "", street: "", city: "", stateSel: "OH", zip: "",
    lat: null, lng: null,
    leadSource: "", assignee: TEAM[0], claimType: "Insurance",
    carrier: "", policy: "", claim: "", adjusterName: "", adjusterPhone: "", deductible: "", coverage: "", oLaw: false,
    rps: false, cosmetic: false, windHailDed: false, acvRoof: false, matching: false,
    smsConsent: false, emailConsent: false, notes: "",
  };
  const [f, setF] = useState(blank);
  useEffect(() => { if (open) setF(blank); }, [open]); // eslint-disable-line
  const set = (k) => (e) => setF({ ...f, [k]: e.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e });
  const juris = jurisdictionForZip(f.zip);
  const canCreate = f.first.trim() && f.last.trim() && f.street.trim() && f.zip.trim();
  return (
    <Sheet open={open} onClose={onClose} title="New lead" wide
      footer={
        <div style={{ display: "flex", gap: 10 }}>
          <Btn kind="ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</Btn>
          <Btn style={{ flex: 2 }} disabled={!canCreate} onClick={() => { onCreate(f); onClose(); }}>Create lead</Btn>
        </div>
      }>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#28373E", textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 10px" }}>Primary contact</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="First name *"><input style={inputStyle} value={f.first} onChange={set("first")} /></Field>
        <Field label="Last name *"><input style={inputStyle} value={f.last} onChange={set("last")} /></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Phone"><input style={inputStyle} value={f.phone} onChange={set("phone")} placeholder="(555) 555-0100" /></Field>
        <Field label="Email"><input style={inputStyle} value={f.email} onChange={set("email")} /></Field>
      </div>

      <div style={{ fontSize: 13, fontWeight: 800, color: "#28373E", textTransform: "uppercase", letterSpacing: 0.5, margin: "10px 0" }}>Location</div>
      <Field label="Street *" hint={geoReady() ? "Start typing — pick a suggestion to fill city, state, and zip." : undefined}>
        <AddressAutocomplete
          value={f.street}
          placeholder="123 Main St"
          onChange={(v) => setF({ ...f, street: v })}
          onPick={(it) => setF((p) => ({
            ...p,
            street: it.street || it.formatted,
            city: it.city || p.city,
            stateSel: ["OH", "KY", "IL"].includes(it.state) ? it.state : p.stateSel,
            zip: it.zip || p.zip,
            lat: it.lat, lng: it.lng,
          }))}
        />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
        <Field label="City"><input style={inputStyle} value={f.city} onChange={set("city")} /></Field>
        <Field label="State">
          <select style={selStyle} value={f.stateSel} onChange={set("stateSel")}>
            <option>OH</option><option>KY</option><option>IL</option>
          </select>
        </Field>
        <Field label="Zip *"><input style={inputStyle} value={f.zip} onChange={set("zip")} /></Field>
      </div>
      {juris && (
        <div style={{ background: "#EAF2FD", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#28373E" }}>
            {juris.city ? `${juris.city}, ${juris.state}` : juris.state} — {juris.codeName}
          </div>
          <div style={{ fontSize: 12, color: "#28373E", marginTop: 3 }}>
            {juris.codeEdition}
            {juris.precision === "verified" ? ` · ${juris.inspector.office}` : " · statewide default, confirm locally"}
          </div>
        </div>
      )}

      <div style={{ fontSize: 13, fontWeight: 800, color: "#28373E", textTransform: "uppercase", letterSpacing: 0.5, margin: "10px 0" }}>Job details</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Lead source">
          <select style={selStyle} value={f.leadSource} onChange={set("leadSource")}>
            <option value="">— select —</option>
            {LEAD_SOURCES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Assign to">
          <select style={selStyle} value={f.assignee} onChange={set("assignee")}>
            {TEAM.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Claim type *">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Insurance", "Retail", "Unknown"].map((c) => (
            <button key={c} onClick={() => setF({ ...f, claimType: c })} style={{
              border: `1.5px solid ${f.claimType === c ? "#1B6DE0" : S.line}`,
              background: f.claimType === c ? "#EAF2FD" : "#fff",
              color: f.claimType === c ? "#1B6DE0" : S.ink,
              borderRadius: 999, padding: "9px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>{c === "Unknown" ? "Don't know yet" : c}</button>
          ))}
        </div>
      </Field>

      {f.claimType === "Insurance" && (
        <div style={{ background: "#FAFBFC", border: `1px solid ${S.line}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: S.ink, marginBottom: 10 }}>Insurance details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Carrier"><input style={inputStyle} value={f.carrier} onChange={set("carrier")} placeholder="State Farm, Allstate…" /></Field>
            <Field label="Policy number"><input style={inputStyle} value={f.policy} onChange={set("policy")} /></Field>
            <Field label="Claim number"><input style={inputStyle} value={f.claim} onChange={set("claim")} /></Field>
            <Field label="Deductible ($)"><input style={inputStyle} value={f.deductible} onChange={set("deductible")} /></Field>
            <Field label="Adjuster name"><input style={inputStyle} value={f.adjusterName} onChange={set("adjusterName")} /></Field>
            <Field label="Adjuster phone"><input style={inputStyle} value={f.adjusterPhone} onChange={set("adjusterPhone")} /></Field>
          </div>
          <Field label="Coverage type">
            <select style={selStyle} value={f.coverage} onChange={set("coverage")}>
              <option value="">— select —</option><option>RCV</option><option>ACV</option>
            </select>
          </Field>
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: S.ink }}>
            <input type="checkbox" checked={f.oLaw} onChange={set("oLaw")} style={{ width: 18, height: 18 }} />
            Ordinance & Law coverage present
          </label>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#28373E", margin: "14px 0 8px" }}>
            ENDORSEMENTS FOUND ON THE DEC PAGE
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              ["rps", "Roof Payment Schedule (RPS)"],
              ["cosmetic", "Cosmetic damage exclusion"],
              ["windHailDed", "Separate wind/hail deductible"],
              ["acvRoof", "ACV-only roof (age trigger)"],
              ["matching", "Matching endorsement"],
            ].map(([k, label]) => (
              <button key={k} onClick={() => setF({ ...f, [k]: !f[k] })} style={{
                border: `1.5px solid ${f[k] ? "#92600A" : S.line}`,
                background: f[k] ? "#FDF4E3" : "#fff",
                color: f[k] ? "#92600A" : S.ink,
                borderRadius: 999, padding: "8px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>{f[k] ? "✓ " : ""}{label}</button>
            ))}
          </div>
          {(f.rps || f.acvRoof || f.windHailDed) && (
            <div style={{ background: "#FDF4E3", borderLeft: "3px solid #92600A", borderRadius: 8, padding: "11px 13px", marginTop: 10, fontSize: 13, color: S.ink, lineHeight: 1.5 }}>
              Tell the homeowner their real out-of-pocket before writing the contract. See Insurance → Resources →
              Policy Provisions for how each of these changes the settlement.
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: 13, fontWeight: 800, color: "#28373E", textTransform: "uppercase", letterSpacing: 0.5, margin: "10px 0" }}>Communication consent</div>
      <div style={{ border: `1px solid ${S.line}`, borderRadius: 12, padding: 14, marginBottom: 6 }}>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: S.ink, marginBottom: 10 }}>
          <input type="checkbox" checked={f.smsConsent} onChange={set("smsConsent")} style={{ width: 18, height: 18, marginTop: 2 }} />
          <span>
            <b>Text messages.</b> I agree to receive texts about my project from {brand.company}. Msg & data rates
            may apply. Reply STOP to opt out.
          </span>
        </label>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: S.ink }}>
          <input type="checkbox" checked={f.emailConsent} onChange={set("emailConsent")} style={{ width: 18, height: 18, marginTop: 2 }} />
          <span><b>Email.</b> I agree to receive project updates and documents by email.</span>
        </label>
        <div style={{ fontSize: 12, color: S.sub, marginTop: 10 }}>
          Consent is stored with a timestamp and source. SMS and email consent are tracked separately; opting out of
          one does not affect the other.
        </div>
      </div>
    </Sheet>
  );
}

/* ================================================================
   FILTERS SHEET
   ================================================================ */
function FiltersSheet({ open, onClose, stages, filters, setFilters }) {
  const [local, setLocal] = useState(filters);
  useEffect(() => { if (open) setLocal(filters); }, [open]); // eslint-disable-line
  const toggle = (key, val) => {
    const cur = new Set(local[key]);
    cur.has(val) ? cur.delete(val) : cur.add(val);
    setLocal({ ...local, [key]: [...cur] });
  };
  const Section = ({ title, children, onAll, onNone }) => (
    <div style={{ borderTop: `1px solid ${S.line}`, paddingTop: 16, marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: S.ink }}>{title}</div>
        {onAll && <button onClick={onAll} style={linkBtn}>Select all</button>}
        {onNone && <button onClick={onNone} style={{ ...linkBtn, color: "#9CB8E8" }}>Select none</button>}
      </div>
      {children}
    </div>
  );
  const CheckRow = ({ checked, label, onClick }) => (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "9px 0",
      border: "none", background: "none", cursor: "pointer", textAlign: "left",
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: 6, display: "grid", placeItems: "center",
        border: `1.5px solid ${checked ? "#1B6DE0" : "#C7CBD1"}`,
        background: checked ? "#1B6DE0" : "#fff", flexShrink: 0,
      }}>{checked && <Check size={14} color="#fff" />}</span>
      <span style={{ fontSize: 15, color: S.ink }}>{label}</span>
    </button>
  );
  const sorts = [
    ["updated", "Last updated (newest)"], ["value-hi", "Value (higher)"],
    ["value-lo", "Value (lower)"], ["stage-time", "Time in stage (oldest)"],
    ["name", "Name (alphabetical)"], ["address", "Address (alphabetical)"],
  ];
  const selected = [
    ...local.assignees, ...local.sources,
    ...local.stages.map((id) => stages.find((s) => s.id === id)?.name || id),
  ];
  return (
    <Sheet open={open} onClose={onClose} title="Filters & sort"
      footer={<Btn style={{ width: "100%" }} onClick={() => { setFilters(local); onClose(); }}>Apply filters</Btn>}>
      {selected.length > 0 && (
        <div style={{ background: "#F3F4F6", borderRadius: 12, padding: "12px 14px", marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Selected filters</span>
            <button style={linkBtn} onClick={() => setLocal({ ...local, assignees: [], stages: [], sources: [] })}>Reset</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {selected.map((s, i) => <Chip key={i} tone="blue">{s}</Chip>)}
          </div>
        </div>
      )}
      <Section title="Sort by">
        {sorts.map(([id, label]) => (
          <button key={id} onClick={() => setLocal({ ...local, sort: id })} style={{
            display: "block", width: "100%", textAlign: "left", padding: "8px 0",
            border: "none", background: "none", cursor: "pointer",
            fontSize: 15, fontWeight: local.sort === id ? 700 : 400,
            color: local.sort === id ? "#1B6DE0" : S.ink,
          }}>{label}</button>
        ))}
      </Section>
      <Section title="Assignees & job owner"
        onAll={() => setLocal({ ...local, assignees: [...TEAM] })}
        onNone={() => setLocal({ ...local, assignees: [] })}>
        {TEAM.map((t) => (
          <CheckRow key={t} checked={local.assignees.includes(t)} label={t} onClick={() => toggle("assignees", t)} />
        ))}
      </Section>
      <Section title="Stages"
        onAll={() => setLocal({ ...local, stages: stages.map((s) => s.id) })}
        onNone={() => setLocal({ ...local, stages: [] })}>
        {stages.map((s) => (
          <CheckRow key={s.id} checked={local.stages.includes(s.id)} label={s.name} onClick={() => toggle("stages", s.id)} />
        ))}
      </Section>
      <Section title="Lead sources"
        onAll={() => setLocal({ ...local, sources: [...LEAD_SOURCES] })}
        onNone={() => setLocal({ ...local, sources: [] })}>
        {LEAD_SOURCES.map((l) => (
          <CheckRow key={l} checked={local.sources.includes(l)} label={l} onClick={() => toggle("sources", l)} />
        ))}
      </Section>
    </Sheet>
  );
}
const linkBtn = { border: "none", background: "none", color: "#1B6DE0", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0 };

/* ================================================================
   WORKFLOW EDITOR — rename / reorder / add / remove stages
   ================================================================ */
function WorkflowEditor({ open, onClose, stages, setStages }) {
  const [local, setLocal] = useState(stages);
  useEffect(() => { if (open) setLocal(stages.map((s) => ({ ...s }))); }, [open]); // eslint-disable-line
  const rename = (id, name) => setLocal(local.map((s) => (s.id === id ? { ...s, name } : s)));
  const remove = (id) => setLocal(local.filter((s) => s.id !== id));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= local.length) return;
    const next = [...local];
    [next[i], next[j]] = [next[j], next[i]];
    setLocal(next);
  };
  return (
    <Sheet open={open} onClose={onClose} title="Customize workflow"
      footer={
        <div style={{ display: "flex", gap: 10 }}>
          <Btn kind="ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</Btn>
          <Btn style={{ flex: 1 }} disabled={local.length === 0} onClick={() => { setStages(local); onClose(); }}>Save workflow</Btn>
        </div>
      }>
      <div style={{ fontSize: 14, color: S.sub, marginBottom: 14 }}>
        Rename, reorder, add, or remove pipeline stages. Jobs in a removed stage move to the first stage.
      </div>
      {local.map((s, i) => (
        <div key={s.id} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
          borderBottom: `1px solid ${S.line}`,
        }}>
          <GripVertical size={16} color="#C7CBD1" />
          <input value={s.name} onChange={(e) => rename(s.id, e.target.value)}
            style={{ ...inputStyle, padding: "9px 12px", flex: 1 }} />
          <button onClick={() => move(i, -1)} style={arrowBtn} aria-label="Move up">↑</button>
          <button onClick={() => move(i, 1)} style={arrowBtn} aria-label="Move down">↓</button>
          <button onClick={() => remove(s.id)} style={{ border: "none", background: "none", cursor: "pointer", padding: 4 }}>
            <Trash2 size={16} color="#B42318" />
          </button>
        </div>
      ))}
      <Btn kind="soft" small style={{ marginTop: 14 }}
        onClick={() => setLocal([...local, { id: uid("s"), name: "New stage" }])}>
        <Plus size={14} /> Add stage
      </Btn>
    </Sheet>
  );
}
const arrowBtn = { border: "1px solid #E5E7EB", background: "#fff", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 14 };

/* ================================================================
   JOB BOARD — kanban with drag between stages + tap-to-move
   ================================================================ */
function JobBoard({ jobs, stages, filters, onOpenFilters, onOpenWorkflow, onOpenJob, onMoveStage, onNewLead }) {
  const dragJob = useRef(null);
  const [view, setView] = useState("board");
  const [moveMenuFor, setMoveMenuFor] = useState(null);
  const [q, setQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [dragOver, setDragOver] = useState(null);

  const filtered = useMemo(() => {
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

  const JobCard = ({ job }) => (
    <div
      draggable
      onDragStart={() => (dragJob.current = job.id)}
      onClick={() => onOpenJob(job.id)}
      style={{
        background: "#fff", border: `1px solid ${S.line}`, borderRadius: 12,
        padding: 14, marginBottom: 10, cursor: "pointer",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: S.ink }}>{job.name}</div>
        {job.value > 0 && <div style={{ fontSize: 14, fontWeight: 700, color: S.ink, whiteSpace: "nowrap" }}>{money(job.value)}</div>}
      </div>
      <div style={{ fontSize: 13, color: S.sub, marginTop: 3 }}>{job.address}</div>
      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
        <Chip tone={job.claimType === "Insurance" ? "blue" : "gray"}>{job.claimType === "Unknown" ? "TBD" : job.claimType}</Chip>
        <Chip tone="slate">{job.state}</Chip>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 10, paddingTop: 10, borderTop: `1px solid ${S.line}`,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: job.daysInStage > 10 ? "#B42318" : S.sub }}>
          ● {job.daysInStage} days
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: S.sub }}>{job.updated}</span>
          <span style={{
            width: 26, height: 26, borderRadius: 999, background: "#EEF1F4",
            display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: S.sub,
          }}>{job.assignee.split(" ").map((w) => w[0]).join("")}</span>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); setMoveMenuFor(moveMenuFor === job.id ? null : job.id); }}
        style={{
          marginTop: 10, width: "100%", border: `1px solid ${S.line}`, background: "#FAFBFC",
          borderRadius: 8, padding: "7px 0", fontSize: 13, fontWeight: 600, color: S.sub, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
        <ArrowUpDown size={13} /> Move
      </button>
      {moveMenuFor === job.id && (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }} onClick={(e) => e.stopPropagation()}>
          {stages.filter((s) => s.id !== job.stageId).map((s) => (
            <button key={s.id}
              onClick={() => { onMoveStage(job.id, s.id); setMoveMenuFor(null); }}
              style={{
                border: `1px solid ${S.line}`, background: "#fff", borderRadius: 999,
                padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: S.ink,
              }}>{s.name}</button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: "18px 16px 0", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: S.ink }}>Jobs</div>
            <button
              onClick={() => setView(view === "board" ? "list" : "board")}
              style={{
                display: "flex", alignItems: "center", gap: 6, border: "none",
                background: "#F3F4F6", borderRadius: 10, padding: "8px 12px",
                fontSize: 14, fontWeight: 700, cursor: "pointer", color: S.ink,
              }}>
              {view === "board" ? "Board view" : "List view"} <ChevronDown size={15} />
            </button>
          </div>
          <Btn small onClick={onNewLead}><Plus size={15} /> New</Btn>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14, paddingBottom: 14, overflowX: "auto", alignItems: "center" }}>
          <button style={pill} onClick={() => setShowSearch(!showSearch)}><Search size={16} /></button>
          <button onClick={onOpenFilters} style={{ ...pill, color: "#1B6DE0", background: "#EAF2FD" }}>
            <SlidersHorizontal size={15} />{activeFilterCount > 0 && <span style={{ fontWeight: 700 }}>{activeFilterCount}</span>}
          </button>
          <button onClick={onOpenWorkflow} style={{ ...pill, whiteSpace: "nowrap" }}>
            <Pencil size={14} /> Customize workflow
          </button>
        </div>
        {showSearch && (
          <div style={{ paddingBottom: 12 }}>
            <input autoFocus style={inputStyle} placeholder="Search name or address" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        )}
      </div>

      {view === "board" ? (
        <div style={{
          display: "flex", gap: 14, overflowX: "auto", padding: 16,
          background: S.bg, alignItems: "flex-start", minHeight: "62vh",
        }}>
          {stages.map((stage) => {
            const inStage = filtered.filter((j) => j.stageId === stage.id);
            const total = inStage.reduce((s, j) => s + j.value, 0);
            return (
              <div key={stage.id}
                onDragOver={(e) => { e.preventDefault(); setDragOver(stage.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => {
                  if (dragJob.current) { onMoveStage(dragJob.current, stage.id); dragJob.current = null; }
                  setDragOver(null);
                }}
                style={{
                  minWidth: 296, maxWidth: 316, flexShrink: 0, borderRadius: 12,
                  outline: dragOver === stage.id ? `2px solid #1B6DE0` : "none", outlineOffset: 4,
                }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  padding: "0 2px 10px", borderBottom: `2px solid ${S.line}`, marginBottom: 12,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>
                    {stage.name} <span style={{ color: S.sub, fontWeight: 600 }}>({inStage.length})</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: S.sub }}>{money(total)}</div>
                </div>
                {inStage.map((j) => <JobCard key={j.id} job={j} />)}
                {inStage.length === 0 && (
                  <div style={{
                    border: `1.5px dashed ${S.line}`, borderRadius: 12, padding: 20,
                    textAlign: "center", fontSize: 13, color: S.sub,
                  }}>Drop jobs here</div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: 16, background: S.bg, minHeight: "62vh" }}>
          {filtered.map((j) => <JobCard key={j.id} job={j} />)}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: S.sub, fontSize: 14, padding: 40 }}>
              No jobs match the current filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
const pill = {
  display: "flex", alignItems: "center", gap: 6, border: "none",
  background: "#F3F4F6", borderRadius: 999, padding: "9px 14px",
  fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#111827", flexShrink: 0,
};

/* ================================================================
   JOB DETAIL — tabbed workspace for a single job
   ================================================================ */
const JOB_TABS = [
  ["overview", "Overview"], ["checklist", "Checklist"], ["measure", "Measurements"],
  ["materials", "Materials"], ["estimate", "Estimate"], ["contract", "Contract"],
  ["report", "Report"], ["messages", "Messages"],
  ["photos", "Photos"], ["financials", "Financials"],
  ["payments", "Payments"], ["invoice", "Invoice"], ["workorder", "Work order"],
  ["tasks", "Tasks"], ["files", "Files"], ["portal", "Portal"],
];

function JobDetail({ job, stages, brand, onBack, onMoveStage, mut, toast, reviewSettings, currentUser, isAdmin, showMoney = true, crews = [], templates = [], integrations = { gmail: {}, sms: {} } }) {
  const [tab, setTab] = useState("overview");
  const MONEY_TABS = ["estimate", "contract", "financials", "payments", "invoice"];
  const visibleTabs = JOB_TABS.filter(([id]) => showMoney || !MONEY_TABS.includes(id));
  useEffect(() => {
    if (!showMoney && MONEY_TABS.includes(tab)) setTab("overview");
  }, [showMoney, tab]);
  const stage = stages.find((s) => s.id === job.stageId);
  const juris = jurisdictionForZip(job.zip);
  return (
    <div style={{ background: S.bg, minHeight: "100vh", paddingBottom: 110 }}>
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.line}` }}>
        <div style={{ padding: "16px 16px 0" }}>
          <SubHeader title={job.name} onBack={onBack}
            right={<Chip tone="blue">{stage ? stage.name : "—"}</Chip>} />
          <div style={{ fontSize: 13, color: S.sub, margin: "8px 0 2px", display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={13} /> {job.address}
          </div>
          <div style={{ display: "flex", gap: 8, margin: "10px 0 12px", flexWrap: "wrap" }}>
            <Chip tone={job.claimType === "Insurance" ? "blue" : "gray"}>{job.claimType === "Unknown" ? "Claim TBD" : job.claimType}</Chip>
            <Chip tone="slate">{job.state}</Chip>
            {job.value > 0 && <Chip tone="green">{money(job.value)}</Chip>}
            <Chip tone="gray">{job.assignee}</Chip>
          </div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }}>
            <select value={job.stageId} onChange={(e) => onMoveStage(job.id, e.target.value)}
              style={{ ...selStyle, width: "auto", padding: "8px 10px", fontSize: 13, fontWeight: 700 }}>
              {stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, overflowX: "auto", padding: "0 12px" }}>
          {visibleTabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              border: "none", background: "none", cursor: "pointer", whiteSpace: "nowrap",
              padding: "10px 12px", fontSize: 14, fontWeight: 700,
              color: tab === id ? "#1B6DE0" : S.sub,
              borderBottom: tab === id ? "2.5px solid #1B6DE0" : "2.5px solid transparent",
            }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: 16 }}>
        {tab === "overview" && <TabOverview job={job} juris={juris} mut={mut} toast={toast} reviewSettings={reviewSettings} brand={brand} />}
        {tab === "checklist" && <TabChecklist job={job} mut={mut} toast={toast} />}
        {tab === "measure" && <TabMeasure job={job} mut={mut} toast={toast} />}
        {tab === "materials" && <TabMaterials job={job} toast={toast} />}
        {tab === "estimate" && <TabEstimate job={job} brand={brand} mut={mut} toast={toast} />}
        {tab === "contract" && <TabContract job={job} brand={brand} mut={mut} toast={toast} />}
        {tab === "report" && <TabReport job={job} brand={brand} juris={juris} />}
        {tab === "messages" && <TabMessages job={job} mut={mut} toast={toast} brand={brand}
          templates={templates} crews={crews} integrations={integrations} currentUser={currentUser} />}
        {tab === "photos" && <TabPhotos job={job} mut={mut} toast={toast} />}
        {tab === "financials" && <TabFinancials job={job} mut={mut} toast={toast} isAdmin={isAdmin} currentUser={currentUser} />}
        {tab === "payments" && <TabPayments job={job} mut={mut} toast={toast} />}
        {tab === "invoice" && <TabInvoice job={job} brand={brand} toast={toast} />}
        {tab === "workorder" && <TabWorkOrder job={job} mut={mut} toast={toast} brand={brand}
          crews={crews} templates={templates} currentUser={currentUser} />} brand={brand} toast={toast} />}
        {tab === "tasks" && <TabTasks job={job} mut={mut} />}
        {tab === "files" && <TabFiles job={job} mut={mut} toast={toast} />}
        {tab === "portal" && <TabPortal job={job} brand={brand} mut={mut} toast={toast} />}
      </div>
    </div>
  );
}

/* ---------- Overview ---------- */
function TabOverview({ job, juris, mut, toast, reviewSettings, brand }) {
  const cap = computeCapOut(job);
  const pay = paymentsSummary(job);
  const canReview = (job.consent.sms.granted || job.consent.email.granted) && !job.review.sent;
  return (
    <>
      <Card>
        <CardTitle>Contact</CardTitle>
        <KV k="Phone" v={job.phone} />
        <KV k="Email" v={job.email} />
        <KV k="Lead source" v={job.leadSource} />
        <KV k="SMS consent" v={job.consent.sms.granted ? `Yes — ${job.consent.sms.at} (${job.consent.sms.source})` : "Not granted"} />
        <KV k="Email consent" v={job.consent.email.granted ? `Yes — ${job.consent.email.at}` : "Not granted"} />
      </Card>

      {job.insurance && (
        <Card style={{ marginTop: 12 }}>
          <CardTitle right={<Chip tone="blue">{job.insurance.coverage || "—"}</Chip>}>Insurance claim</CardTitle>
          <KV k="Carrier" v={job.insurance.carrier || "—"} />
          <KV k="Policy #" v={job.insurance.policy || "—"} />
          <KV k="Claim #" v={job.insurance.claim || "Not filed yet"} />
          <KV k="Deductible" v={job.insurance.deductible ? money(num(job.insurance.deductible)) : "—"} />
          <KV k="Adjuster" v={job.insurance.adjusterName ? `${job.insurance.adjusterName} · ${job.insurance.adjusterPhone}` : "—"} />
          <KV k="Ordinance & Law" v={job.insurance.oLaw ? "Included" : "Not included"} />
          {job.insurance.endorsements && Object.values(job.insurance.endorsements).some(Boolean) && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${S.line}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#92600A", marginBottom: 7 }}>ENDORSEMENTS THAT REDUCE THE SETTLEMENT</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {job.insurance.endorsements.rps && <Chip tone="amber">Roof Payment Schedule</Chip>}
                {job.insurance.endorsements.acvRoof && <Chip tone="amber">ACV-only roof</Chip>}
                {job.insurance.endorsements.windHailDed && <Chip tone="amber">Wind/hail deductible</Chip>}
                {job.insurance.endorsements.cosmetic && <Chip tone="amber">Cosmetic exclusion</Chip>}
                {job.insurance.endorsements.matching && <Chip tone="green">Matching endorsement</Chip>}
              </div>
            </div>
          )}
        </Card>
      )}

      <Card style={{ marginTop: 12 }}>
        <CardTitle right={<Chip tone="slate">{job.zip}</Chip>}>Site location</CardTitle>
        <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.5 }}>{job.address}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <a href={mapLinkForAddress(job.address)} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: "none" }}>
            <Btn kind="ghost" small style={{ width: "100%" }}><MapPin size={13} /> View map</Btn>
          </a>
          <a href={directionsLink(job.address)} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: "none" }}>
            <Btn kind="ghost" small style={{ width: "100%" }}><Send size={13} /> Directions</Btn>
          </a>
        </div>
      </Card>

      {juris && (
        <Card style={{ marginTop: 12 }}>
          <CardTitle right={juris.precision === "verified"
            ? <Chip tone="green">Verified</Chip>
            : <Chip tone="amber">State-level</Chip>}>
            Jurisdiction — {juris.city ? `${juris.city}, ${juris.state}` : juris.state}
          </CardTitle>
          <KV k="Building code" v={juris.codeName} />
          <KV k="Edition" v={juris.codeEdition} />
          <KV k="Permits" v={juris.permit} />
          <KV k="Inspector office" v={juris.inspector.office} />
          {juris.inspector.phone && <KV k="Office phone" v={juris.inspector.phone} />}
          {juris.precision === "state" && (
            <Callout label="Statewide guidance only">
              This zip isn't on file with a confirmed local record yet — the code shown is the {juris.state} default.
              {juris.state === "IL" ? " Illinois adoption is municipal, so the local ordinance must be confirmed before this goes in a supplement." : " Confirm the local building department and any amendments before relying on it."}
            </Callout>
          )}
        </Card>
      )}

      <Card style={{ marginTop: 12 }}>
        <CardTitle>Job snapshot</CardTitle>
        <KV k="Estimate" v={`${job.estimate.status}${job.estimate.number ? " · " + job.estimate.number : ""}`} />
        <KV k="Contract" v={`${job.contract.status}${job.contract.signedAt ? " · " + job.contract.signedAt : ""}`} />
        <KV k="Checklist" v={job.checklist.complete ? "Complete" : "Not complete"} />
        <KV k="Collected" v={`${money(pay.received)} of ${money(pay.contract)}`} />
        <KV k="Balance due" v={money(pay.balance)} strong />
        {cap.contract > 0 && <KV k="Gross profit" v={`${money(cap.gross)} (${pct1(cap.grossMargin)})`} />}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle right={
          job.review.posted ? <Chip tone="green">Review posted</Chip> :
          job.review.sent ? <Chip tone="blue">Request sent</Chip> : null
        }>Review request</CardTitle>
        <div style={{ fontSize: 13, color: S.sub, marginBottom: 12 }}>
          {job.review.sent
            ? `Google review request sent${job.review.clicked ? " and the link was opened" : ""}.`
            : job.consent.sms.granted || job.consent.email.granted
              ? `Sends the Google review link by ${[job.consent.sms.granted && "text", job.consent.email.granted && "email"].filter(Boolean).join(" and ")} (consent on file). Follow-up after ${reviewSettings.followUpDays} days if no click.`
              : "No SMS or email consent on file — review requests are blocked for this client."}
        </div>
        <Btn small kind={canReview ? "primary" : "ghost"} disabled={!canReview}
          onClick={() => {
            mut((j) => ({ ...j, review: { ...j.review, sent: true } }));
            toast("Review request queued");
          }}>
          <Star size={14} /> Send review request
        </Btn>
      </Card>
    </>
  );
}

/* ---------- Roofing inspection checklist ---------- */
function TabChecklist({ job, mut, toast }) {
  const c = job.checklist;
  const set = (k) => (v) => mut((j) => ({ ...j, checklist: { ...j.checklist, [k]: v } }));
  const Opt = ({ k, options }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {options.map((o) => (
        <button key={o} onClick={() => set(k)(o)} style={{
          border: `1.5px solid ${c[k] === o ? "#1B6DE0" : S.line}`,
          background: c[k] === o ? "#EAF2FD" : "#fff",
          color: c[k] === o ? "#1B6DE0" : S.ink,
          borderRadius: 999, padding: "8px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>{o}</button>
      ))}
    </div>
  );
  const Multi = ({ k, options }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {options.map((o) => {
        const on = c[k].includes(o);
        return (
          <button key={o} onClick={() => set(k)(on ? c[k].filter((x) => x !== o) : [...c[k], o])} style={{
            border: `1.5px solid ${on ? "#1B6DE0" : S.line}`,
            background: on ? "#EAF2FD" : "#fff", color: on ? "#1B6DE0" : S.ink,
            borderRadius: 999, padding: "8px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>{o}</button>
        );
      })}
    </div>
  );
  const required = ["structure", "roofAge", "layers", "roofType", "pitch", "overall"];
  const missing = required.filter((k) => !c[k]);
  return (
    <>
      <Card>
        <CardTitle right={c.complete ? <Chip tone="green">Complete</Chip> : <Chip tone="amber">In progress</Chip>}>
          Roofing inspection checklist
        </CardTitle>
        <div style={{ fontSize: 13, color: S.sub, marginBottom: 6 }}>
          Filled in the field. Once marked complete, it feeds the inspection report and unlocks report sending.
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Structure & history</CardTitle>
        <Field label="Structure type"><Opt k="structure" options={["Single Family", "Multi-Family", "Detached Garage", "Commercial"]} /></Field>
        <Field label="Approximate roof age (years)"><input style={inputStyle} value={c.roofAge} onChange={(e) => set("roofAge")(e.target.value)} /></Field>
        <Field label="Inspection method"><Opt k="method" options={["Visual, non-invasive; roof surface accessed directly", "Drone-assisted visual inspection", "Ground + ladder at eave only"]} /></Field>
        <Field label="Layers"><Opt k="layers" options={["1 Layer", "2 Layers", "3+ Layers"]} /></Field>
        <Field label="Roof covering"><Opt k="roofType" options={["Asphalt shingle", "Metal", "Flat / membrane", "Tile", "Wood shake"]} /></Field>
        <Field label="Pitch (primary)"><Opt k="pitch" options={["3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12+"]} /></Field>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Decking & ventilation</CardTitle>
        <Field label="Decking type"><Opt k="deckingType" options={["OSB", "Plywood", "1x6 Plank / Spaced Lumber", "Unknown"]} /></Field>
        <Field label="Decking condition"><Opt k="deckingCond" options={["Good", "Fair", "Poor", "Critical"]} /></Field>
        <Field label="Ventilation present"><Multi k="ventTypes" options={["Ridge Vent", "Box Vents / Turtles", "Gable Vents", "Power Vent", "Turbines", "None visible"]} /></Field>
        <Field label="Soffit intake present"><Opt k="soffitIntake" options={["Yes", "No", "Blocked"]} /></Field>
        <Field label="Ventilation condition"><Opt k="ventCond" options={["Good", "Fair", "Poor", "Critical"]} /></Field>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle right={<Chip tone="blue">Required</Chip>}>Attic</CardTitle>
        <Field label="Attic accessible"><Opt k="atticAccess" options={["Yes", "No — note reason in notes"]} /></Field>
        <Field label="Decking from below"><Opt k="atticDecking" options={["Good", "Stained / Tracked", "Active Rot / Mold", "Not visible"]} /></Field>
        <Field label="Daylight visible through decking"><Opt k="lightCheck" options={["Yes", "No"]} /></Field>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Damage indicators</CardTitle>
        <Field label="Granule loss"><Opt k="granuleLoss" options={["Minimal", "Moderate", "Heavy", "Critical"]} /></Field>
        <Field label="Wind damage (creased / missing tabs)"><Opt k="windDamage" options={["Yes", "No"]} /></Field>
        <Field label="Hail impact evidence"><Opt k="hailImpact" options={["Yes", "No"]} /></Field>
        <Field label="Flashing failures"><Opt k="flashingFail" options={["Yes", "No"]} /></Field>
        <Field label="Pipe boots cracked / failed"><Opt k="pipeBoots" options={["Yes", "No"]} /></Field>
        <Field label="Overall roof condition"><Opt k="overall" options={["Good", "Fair", "Poor", "Critical"]} /></Field>
        <Field label="Field notes">
          <textarea style={{ ...inputStyle, minHeight: 90 }} value={c.notes} onChange={(e) => set("notes")(e.target.value)} />
        </Field>
      </Card>
      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
        <Btn style={{ flex: 1 }} disabled={missing.length > 0} onClick={() => {
          mut((j) => ({ ...j, checklist: { ...j.checklist, complete: true } }));
          toast("Checklist complete — report unlocked");
        }}>
          <CheckCircle2 size={16} /> Mark checklist complete
        </Btn>
      </div>
      {missing.length > 0 && (
        <div style={{ fontSize: 13, color: "#B42318", marginTop: 10 }}>
          Still needed: {missing.join(", ")}
        </div>
      )}
    </>
  );
}

/* ---------- Measurements ---------- */
function TabMeasure({ job, mut, toast }) {
  const m = job.measurements;
  const set = (k) => (e) => mut((j) => ({ ...j, measurements: { ...j.measurements, [k]: e.target.value } }));
  const rows = [
    ["squares", "Total roof area", "SQ"], ["pitch", "Predominant pitch", "x/12"],
    ["ridges", "Ridges", "LF"], ["hips", "Hips", "LF"], ["valleys", "Valleys", "LF"],
    ["eaves", "Eaves", "LF"], ["rakes", "Rakes", "LF"], ["stepFlash", "Step flashing", "LF"],
    ["wallFlash", "Wall / headwall flashing", "LF"], ["penetrations", "Penetrations", "count"],
  ];
  return (
    <>
      <Card>
        <CardTitle>Roof measurements</CardTitle>
        <div style={{ fontSize: 13, color: S.sub, marginBottom: 14 }}>
          Enter manually or from an aerial measurement report (Roofr / EagleView PDF upload attaches under Files).
          These drive the material list and estimate quantities.
        </div>
        {rows.map(([k, label, unit]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, fontSize: 14, color: S.ink }}>{label}</div>
            <input style={{ ...inputStyle, width: 110, textAlign: "right" }} value={m[k]} onChange={set(k)} inputMode="decimal" />
            <div style={{ width: 44, fontSize: 12, color: S.sub }}>{unit}</div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, paddingTop: 8, borderTop: `1px solid ${S.line}` }}>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>Waste factor</div>
          <input style={{ ...inputStyle, width: 110, textAlign: "right" }} value={m.waste} onChange={set("waste")} inputMode="decimal" />
          <div style={{ width: 44, fontSize: 12, color: S.sub }}>%</div>
        </div>
      </Card>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <Btn kind="ghost" style={{ flex: 1 }} onClick={() => toast("Attach the measurement PDF under Files")}>
          <Upload size={15} /> Upload report
        </Btn>
        <Btn style={{ flex: 1 }} onClick={() => toast("Measurements saved")}>
          <Check size={15} /> Save
        </Btn>
      </div>
    </>
  );
}

/* ---------- Materials ---------- */
function TabMaterials({ job, toast }) {
  const list = generateRoofingMaterials(job.measurements);
  const copyText = () => {
    if (!list) return;
    const txt = [
      `MATERIAL ORDER — ${job.name}`, job.address, "",
      ...list.map((r) => `${r.qty} ${r.unit} — ${r.item} (${r.note})`),
    ].join("\n");
    if (navigator.clipboard) navigator.clipboard.writeText(txt);
    toast("Material list copied");
  };
  return (
    <>
      <Card>
        <CardTitle right={list && <Chip tone="blue">{job.measurements.waste}% waste</Chip>}>Roofing material order</CardTitle>
        {!list ? (
          <div style={{ fontSize: 14, color: S.sub }}>
            Enter measurements first — quantities generate automatically from squares, linear footage, and the waste factor.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: S.sub }}>
                  <th style={{ padding: "8px 6px" }}>Item</th>
                  <th style={{ padding: "8px 6px", textAlign: "right" }}>Qty</th>
                  <th style={{ padding: "8px 6px" }}>Unit</th>
                  <th style={{ padding: "8px 6px" }}>Basis</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.item} style={{ borderTop: `1px solid ${S.line}` }}>
                    <td style={{ padding: "9px 6px", fontWeight: 600, color: S.ink }}>{r.item}</td>
                    <td style={{ padding: "9px 6px", textAlign: "right", fontWeight: 700 }}>{r.qty}</td>
                    <td style={{ padding: "9px 6px", color: S.sub }}>{r.unit}</td>
                    <td style={{ padding: "9px 6px", color: S.sub }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {list && (
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <Btn kind="ghost" style={{ flex: 1 }} onClick={copyText}><Copy size={15} /> Copy list</Btn>
          <Btn kind="ghost" style={{ flex: 1 }} onClick={() => toast("Sent to printer / PDF")}><Printer size={15} /> Print</Btn>
        </div>
      )}
      <Card style={{ marginTop: 14 }}>
        <CardTitle>Other trades</CardTitle>
        <div style={{ fontSize: 13, color: S.sub }}>
          Siding, gutter, and window order lists follow the same pattern — import trade measurements and generate.
          Wired for roofing in this prototype; the other three use the same generator with their own item tables.
        </div>
      </Card>
    </>
  );
}

/* ---------- Estimate builder ---------- */
function TabEstimate({ job, brand, mut, toast }) {
  const est = job.estimate;
  const [sigOpen, setSigOpen] = useState(false);
  const locked = est.status === "Signed";
  const setEst = (patch) => mut((j) => ({ ...j, estimate: { ...j.estimate, ...patch } }));
  const setItem = (id, k, v) =>
    setEst({ items: est.items.map((it) => (it.id === id ? { ...it, [k]: v } : it)) });
  const total = estimateTotal(est);
  const m = job.measurements;
  const prefillFromMeasurements = () => {
    if (!num(m.squares)) { toast("Enter measurements first"); return; }
    const sqW = (num(m.squares) * (1 + num(m.waste) / 100)).toFixed(1);
    setEst({
      number: est.number || `EST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
      date: est.date || new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      items: [
        { id: uid("e"), desc: `Tear-off & disposal — ${job.checklist.layers || "1 layer"}`, qty: num(m.squares), unit: "SQ", price: 0 },
        { id: uid("e"), desc: "Ice & water shield — eaves & valleys", qty: Math.round(((num(m.eaves) + num(m.valleys)) * 3) / 100 * 10) / 10, unit: "SQ", price: 0 },
        { id: uid("e"), desc: "Synthetic underlayment — field", qty: num(m.squares), unit: "SQ", price: 0 },
        { id: uid("e"), desc: "Drip edge — eaves & rakes", qty: num(m.eaves) + num(m.rakes), unit: "LF", price: 0 },
        { id: uid("e"), desc: "Architectural shingles (incl. waste)", qty: num(sqW), unit: "SQ", price: 0 },
        { id: uid("e"), desc: "Hip & ridge cap", qty: num(m.ridges) + num(m.hips), unit: "LF", price: 0 },
        { id: uid("e"), desc: "Ridge ventilation", qty: num(m.ridges), unit: "LF", price: 0 },
        { id: uid("e"), desc: "Pipe jacks at penetrations", qty: num(m.penetrations), unit: "EA", price: 0 },
      ],
    });
    toast("Line items generated from measurements");
  };
  return (
    <>
      <Card>
        <CardTitle right={<Chip tone={locked ? "green" : est.status === "Sent" ? "blue" : "gray"}>{est.status}</Chip>}>
          Estimate {est.number && `· ${est.number}`}
        </CardTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Estimate #"><input style={inputStyle} value={est.number} disabled={locked} onChange={(e) => setEst({ number: e.target.value })} /></Field>
          <Field label="Date"><input style={inputStyle} value={est.date} disabled={locked} onChange={(e) => setEst({ date: e.target.value })} /></Field>
        </div>
        <Field label="Valid through"><input style={inputStyle} value={est.validThrough} disabled={locked} onChange={(e) => setEst({ validThrough: e.target.value })} /></Field>
      </Card>

      {num(m.squares) > 0 && (
        <Card style={{ marginTop: 12 }}>
          <CardTitle>Roof measurements (reference)</CardTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[["Area", `${m.squares} SQ`], ["Pitch", m.pitch], ["Ridges", `${m.ridges} LF`],
              ["Valleys", `${m.valleys} LF`], ["Eaves", `${m.eaves} LF`], ["Rakes", `${m.rakes} LF`]].map(([k, v]) => (
              <div key={k} style={{ background: "#FAFBFC", border: `1px solid ${S.line}`, borderRadius: 10, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: S.sub }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{v || "—"}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card style={{ marginTop: 12 }}>
        <CardTitle>Scope of work</CardTitle>
        <textarea style={{ ...inputStyle, minHeight: 110 }} disabled={locked} value={est.scope}
          onChange={(e) => setEst({ scope: e.target.value })}
          placeholder="Describe the work — tear-off, dry-in, install, flashings, cleanup…" />
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle right={!locked && (
          <button style={linkBtn} onClick={prefillFromMeasurements}>Generate from measurements</button>
        )}>Pricing</CardTitle>
        {est.items.length === 0 && (
          <div style={{ fontSize: 13, color: S.sub, marginBottom: 10 }}>No line items yet.</div>
        )}
        {est.items.map((it) => (
          <div key={it.id} style={{ borderBottom: `1px solid ${S.line}`, padding: "10px 0" }}>
            <input style={{ ...inputStyle, marginBottom: 8, fontWeight: 600 }} value={it.desc} disabled={locked}
              onChange={(e) => setItem(it.id, "desc", e.target.value)} />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input style={{ ...inputStyle, width: 84, textAlign: "right" }} value={it.qty} disabled={locked}
                inputMode="decimal" onChange={(e) => setItem(it.id, "qty", e.target.value)} />
              <input style={{ ...inputStyle, width: 62 }} value={it.unit} disabled={locked}
                onChange={(e) => setItem(it.id, "unit", e.target.value)} />
              <span style={{ color: S.sub }}>×</span>
              <input style={{ ...inputStyle, width: 92, textAlign: "right" }} value={it.price} disabled={locked}
                inputMode="decimal" onChange={(e) => setItem(it.id, "price", e.target.value)} />
              <div style={{ marginLeft: "auto", fontWeight: 800, fontSize: 14 }}>{money(num(it.qty) * num(it.price))}</div>
              {!locked && (
                <button onClick={() => setEst({ items: est.items.filter((x) => x.id !== it.id) })}
                  style={{ border: "none", background: "none", cursor: "pointer" }}>
                  <Trash2 size={15} color="#B42318" />
                </button>
              )}
            </div>
          </div>
        ))}
        {!locked && (
          <Btn kind="soft" small style={{ marginTop: 12 }}
            onClick={() => setEst({ items: [...est.items, { id: uid("e"), desc: "", qty: 1, unit: "EA", price: 0 }] })}>
            <Plus size={14} /> Add line item
          </Btn>
        )}
        <div style={{
          display: "flex", justifyContent: "space-between", paddingTop: 14, marginTop: 8,
          borderTop: `2px solid ${S.ink}`,
        }}>
          <span style={{ fontSize: 15, fontWeight: 800 }}>Total investment</span>
          <span style={{ fontSize: 18, fontWeight: 800 }}>{money(total)}</span>
        </div>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle>Concealed conditions — unit pricing</CardTitle>
        <div style={{ fontSize: 13, color: S.sub, marginBottom: 10 }}>
          Pre-agreed pricing for conditions found after tear-off. Billed as change orders only when found and documented.
        </div>
        {est.concealed.map((c) => (
          <div key={c.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <div style={{ flex: 1, fontSize: 13, color: S.ink }}>{c.desc} <span style={{ color: S.sub }}>({c.unit})</span></div>
            <span style={{ color: S.sub, fontSize: 13 }}>$</span>
            <input style={{ ...inputStyle, width: 90, textAlign: "right" }} value={c.price} disabled={locked}
              inputMode="decimal"
              onChange={(e) => setEst({ concealed: est.concealed.map((x) => x.id === c.id ? { ...x, price: e.target.value } : x) })} />
          </div>
        ))}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle>Acceptance</CardTitle>
        {est.clientSig ? (
          <>
            <div style={{ fontSize: 14, color: S.ink, marginBottom: 8 }}>
              Signed by client — {est.sigAt}. Document locked.
            </div>
            {est.clientSig !== "signed" && (
              <img src={est.clientSig} alt="Client signature" style={{ maxWidth: 260, border: `1px solid ${S.line}`, borderRadius: 10 }} />
            )}
          </>
        ) : (
          <div style={{ fontSize: 13, color: S.sub }}>
            Client signs on-screen at the kitchen table, or through the shared portal link.
          </div>
        )}
      </Card>

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <Btn kind="ghost" onClick={() => toast("Estimate PDF generated")}><Printer size={15} /> PDF</Btn>
        {!locked && (
          <>
            <Btn kind="ghost" onClick={() => { setEst({ status: "Sent" }); toast("Estimate emailed to client"); }}>
              <Send size={15} /> Send
            </Btn>
            <Btn onClick={() => setSigOpen(true)}><PenLine size={15} /> Client signature</Btn>
          </>
        )}
      </div>
      <SignaturePad open={sigOpen} onClose={() => setSigOpen(false)} title="Client acceptance — estimate"
        onApply={(dataUrl, at) => {
          setEst({ clientSig: dataUrl, sigAt: at, status: "Signed" });
          toast("Estimate signed and locked");
        }} />
    </>
  );
}

/* ---------- Contract ---------- */
function TabContract({ job, brand, mut, toast }) {
  const con = job.contract;
  const [sigFor, setSigFor] = useState(null); // "client" | "contractor"
  const locked = con.status === "Signed";
  const setCon = (patch) => mut((j) => ({ ...j, contract: { ...j.contract, ...patch } }));
  const estTotal = estimateTotal(job.estimate);
  const deposit = (con.price || 0) * (con.depositPct / 100);
  const SigLine = ({ label, value, onSign }) => (
    <div style={{ flex: 1, minWidth: 220 }}>
      <div style={{
        height: 74, border: `1.5px dashed ${S.line}`, borderRadius: 10,
        display: "grid", placeItems: "center", background: "#FAFBFC", overflow: "hidden",
      }}>
        {value ? (
          value === "signed"
            ? <span style={{ fontFamily: "cursive", fontSize: 22 }}>{label === "Client" ? job.name : "Supreme Building Group"}</span>
            : <img src={value} alt={`${label} signature`} style={{ maxHeight: 66 }} />
        ) : (
          <Btn small kind="soft" onClick={onSign} disabled={locked}><PenLine size={13} /> Sign here</Btn>
        )}
      </div>
      <div style={{ fontSize: 12, color: S.sub, marginTop: 6 }}>{label} {con.signedAt && value ? `· ${con.signedAt}` : ""}</div>
    </div>
  );
  return (
    <>
      <Card>
        <CardTitle right={<Chip tone={locked ? "green" : "gray"}>{con.status}</Chip>}>
          Service contract {con.number && `· ${con.number}`}
        </CardTitle>
        <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.55 }}>
          This agreement is between <b>{brand.company}</b>, {brand.address}, {brand.phone}, and
          <b> {job.name}</b>, {job.address}.
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Scope of work</CardTitle>
        <textarea style={{ ...inputStyle, minHeight: 100 }} disabled={locked} value={con.scope}
          placeholder="References the accepted estimate…"
          onChange={(e) => setCon({ scope: e.target.value })} />
        {estTotal > 0 && !con.scope && !locked && (
          <button style={{ ...linkBtn, marginTop: 8 }} onClick={() =>
            setCon({ scope: `Per Estimate ${job.estimate.number || ""} dated ${job.estimate.date || ""}: ${job.estimate.scope}` })}>
            Pull scope from estimate
          </button>
        )}
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Price & payment schedule</CardTitle>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <div style={{ flex: 1, fontSize: 14 }}>Contract price</div>
          <span style={{ color: S.sub }}>$</span>
          <input style={{ ...inputStyle, width: 130, textAlign: "right" }} value={con.price} disabled={locked}
            inputMode="decimal" onChange={(e) => setCon({ price: num(e.target.value) })} />
        </div>
        {!con.price && estTotal > 0 && !locked && (
          <button style={{ ...linkBtn, marginBottom: 10 }} onClick={() => setCon({ price: estTotal })}>
            Use estimate total — {money(estTotal)}
          </button>
        )}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <div style={{ flex: 1, fontSize: 14 }}>Deposit</div>
          <input style={{ ...inputStyle, width: 72, textAlign: "right" }} value={con.depositPct} disabled={locked}
            inputMode="decimal" onChange={(e) => setCon({ depositPct: num(e.target.value) })} />
          <span style={{ color: S.sub, fontSize: 13 }}>%</span>
        </div>
        <KV k={`Due at signing (${con.depositPct}%)`} v={money(deposit)} />
        <KV k="Due on substantial completion" v={money((con.price || 0) - deposit)} strong />
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Terms</CardTitle>
        <div style={{ fontSize: 13, color: S.ink, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{con.terms}</div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Signatures</CardTitle>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <SigLine label="Client" value={con.clientSig} onSign={() => setSigFor("client")} />
          <SigLine label={`${brand.company} representative`} value={con.contractorSig} onSign={() => setSigFor("contractor")} />
        </div>
        {con.clientSig && con.contractorSig && !locked && (
          <Btn kind="green" style={{ marginTop: 14, width: "100%" }} onClick={() => {
            setCon({ status: "Signed", signedAt: nowStamp() });
            toast("Contract executed and locked");
          }}>
            <CheckCircle2 size={16} /> Execute contract
          </Btn>
        )}
        {locked && <div style={{ fontSize: 13, color: "#177245", marginTop: 12, fontWeight: 600 }}>Executed {con.signedAt}. Changes require a written change order.</div>}
      </Card>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <Btn kind="ghost" onClick={() => toast("Contract PDF generated")}><Printer size={15} /> PDF</Btn>
        <Btn kind="ghost" onClick={() => toast("Contract emailed to client")}><Send size={15} /> Email to client</Btn>
      </div>
      <SignaturePad open={!!sigFor} onClose={() => setSigFor(null)}
        title={sigFor === "client" ? "Client signature" : "Company signature"}
        onApply={(dataUrl, at) => {
          setCon(sigFor === "client" ? { clientSig: dataUrl } : { contractorSig: dataUrl });
          toast("Signature captured");
        }} />
    </>
  );
}

/* ---------- Inspection report (fed from checklist) ---------- */
function TabReport({ job, brand, juris }) {
  const c = job.checklist;
  if (!c.complete) {
    return (
      <Card>
        <CardTitle>Inspection report</CardTitle>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <AlertTriangle size={18} color="#92600A" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 14, color: S.ink }}>
            The report unlocks when the roofing inspection checklist is complete. Checklist answers auto-fill the
            report so nothing gets written twice.
          </div>
        </div>
      </Card>
    );
  }
  const findings = [];
  if (c.granuleLoss === "Heavy" || c.granuleLoss === "Critical")
    findings.push({ p: "HIGH", t: "Granule loss", d: `${c.granuleLoss} granule loss across field shingles — mat exposure accelerates failure.` });
  if (c.windDamage === "Yes") findings.push({ p: "HIGH", t: "Wind damage", d: "Creased and/or displaced tabs consistent with wind events." });
  if (c.hailImpact === "Yes") findings.push({ p: "HIGH", t: "Hail impact", d: "Impact bruising documented in the photo set; storm-related damage indicated." });
  if (c.flashingFail === "Yes") findings.push({ p: "MODERATE", t: "Flashing failures", d: "Failed or improperly lapped flashings at walls / chimney / penetrations." });
  if (c.pipeBoots === "Yes") findings.push({ p: "MODERATE", t: "Pipe boots", d: "Cracked neoprene pipe boots — an active leak path." });
  if (c.ventCond === "Poor" || c.ventCond === "Critical")
    findings.push({ p: "MODERATE", t: "Ventilation", d: `Ventilation condition rated ${c.ventCond}; system is unbalanced or insufficient.` });
  if (c.atticDecking === "Active Rot / Mold" || c.lightCheck === "Yes")
    findings.push({ p: "HIGH", t: "Decking (attic)", d: "Attic inspection shows compromised decking (staining, rot, or daylight)." });
  if (findings.length === 0) findings.push({ p: "MONITOR", t: "General wear", d: "No acute failures documented; monitor at annual intervals." });
  const pTone = { HIGH: "red", MODERATE: "amber", MONITOR: "blue" };
  const Section = ({ n, title, children }) => (
    <Card style={{ marginTop: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "#1B6DE0", marginBottom: 4 }}>SECTION {n}</div>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>{title}</div>
      {children}
    </Card>
  );
  return (
    <>
      <Card style={{ background: "#28373E", border: "none" }}>
        <div style={{ color: "#fff" }}>
          <div style={{ fontSize: 12, letterSpacing: 1.5, opacity: 0.75, fontWeight: 700 }}>ROOF INSPECTION REPORT</div>
          <div style={{ fontSize: 20, fontWeight: 800, margin: "6px 0 2px" }}>{job.name}</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{job.address}</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 10 }}>{brand.company} · {brand.phone}</div>
        </div>
      </Card>
      <Section n={1} title="Overview & property facts">
        <KV k="Structure" v={c.structure} />
        <KV k="Roof covering" v={c.roofType} />
        <KV k="Approximate age" v={`${c.roofAge} years`} />
        <KV k="Layers" v={c.layers} />
        <KV k="Predominant pitch" v={c.pitch} />
        <KV k="Method" v={c.method || "Visual, non-invasive"} />
      </Section>
      <Section n={2} title="Summary of findings">
        {findings.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${S.line}` }}>
            <Chip tone={pTone[f.p]}>{f.p}</Chip>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{f.t}</div>
              <div style={{ fontSize: 13, color: S.sub, marginTop: 2 }}>{f.d}</div>
            </div>
          </div>
        ))}
      </Section>
      <Section n={3} title="Decking & structure">
        <KV k="Decking type" v={c.deckingType || "—"} />
        <KV k="Condition (surface)" v={c.deckingCond || "—"} />
        <KV k="Condition (attic view)" v={c.atticDecking || "—"} />
        <KV k="Daylight through decking" v={c.lightCheck || "—"} />
      </Section>
      <Section n={4} title="Ventilation">
        <KV k="Systems present" v={c.ventTypes.join(", ") || "None documented"} />
        <KV k="Soffit intake" v={c.soffitIntake || "—"} />
        <KV k="Condition" v={c.ventCond || "—"} />
      </Section>
      <Section n={5} title="Photo documentation">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {job.photos.map((p) => (
            <div key={p.id} style={{ border: `1px solid ${S.line}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: 74, background: "#EEF1F4", display: "grid", placeItems: "center" }}>
                <ImageIcon size={22} color="#9CA3AF" />
              </div>
              <div style={{ padding: "7px 9px" }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: S.sub }}>{p.at}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section n={6} title="Recommendations">
        <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.6 }}>
          {c.overall === "Critical" || c.overall === "Poor"
            ? "Based on the documented condition, full replacement is the recommended course. Repair would address individual symptoms without restoring the system, and the documented conditions above will continue to progress."
            : "The roof is serviceable. Address the moderate findings above and re-inspect in 12 months."}
          {job.claimType === "Insurance" && " Storm-related findings support an insurance claim; this report and the photo set serve as claim documentation."}
        </div>
      </Section>
      <Section n={7} title="Limitations">
        <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.6 }}>
          This report reflects conditions visible and accessible on the inspection date using the method stated in
          Section 1. Concealed conditions (under-covering decking condition, hidden flashing detail) can only be
          verified at tear-off. {c.notes && <><br /><br /><b style={{ color: S.ink }}>Inspector notes:</b> {c.notes}</>}
        </div>
      </Section>
      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <Btn kind="ghost"><Printer size={15} /> Print / PDF</Btn>
        <Btn kind="ghost"><Send size={15} /> Email to client</Btn>
        <Btn kind="ghost"><Share2 size={15} /> Share link</Btn>
      </div>
    </>
  );
}

/* ---------- Photos & quick inspection ---------- */
const SHOT_LIST = [
  "Ground shots — all elevations", "Roof overview from ladder", "Shingle layers at the edge",
  "Granule loss close-up", "Hail impact w/ chalk circle", "Wind-creased tabs",
  "Flashing at walls / chimney", "Pipe boots", "Gutters — granules", "Attic — decking underside",
];
/* ================================================================
   MESSAGES — send email or SMS to the customer or crew from the job,
   with the thread kept on the job record.
   ================================================================ */
function TabMessages({ job, mut, toast, brand, templates, crews, integrations, currentUser }) {
  const [compose, setCompose] = useState(null); // 'email' | 'sms'
  const [to, setTo] = useState("Customer");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const crew = crews.find((c) => c.id === job.crewId) || null;
  const ctx = templateContext(job, brand, crew);
  const thread = job.messages || [];

  const consentOk = (channel, audience) => {
    if (audience === "Crew") return true;
    return channel === "sms" ? job.consent.sms.granted : job.consent.email.granted;
  };
  const recipient = (audience) => {
    if (audience === "Crew") return crew ? (compose === "sms" ? crew.phone : crew.email) : "";
    return compose === "sms" ? job.phone : job.email;
  };

  const openCompose = (kind) => {
    setCompose(kind); setTo("Customer"); setSubject(""); setBody("");
  };
  const applyTemplate = (t) => {
    setSubject(mergeTemplate(t.subject || "", ctx));
    setBody(mergeTemplate(t.body, ctx));
    setTo(t.audience);
  };
  const send = () => {
    const audience = to;
    if (!consentOk(compose, audience)) { toast("No consent on file — cannot send"); return; }
    const addr = recipient(audience);
    if (!addr) { toast(audience === "Crew" ? "Assign a crew first" : "No contact on file"); return; }
    const live = compose === "sms" ? integrations.sms.connected : integrations.gmail.connected;
    mut((j) => ({
      ...j,
      messages: [...(j.messages || []), {
        id: uid("msg"), kind: compose, audience, to: addr,
        subject: compose === "email" ? subject : "",
        body, at: nowStamp(), by: currentUser.name,
        status: live ? "Sent" : "Queued — no provider connected",
      }],
    }));
    setCompose(null);
    toast(live ? "Message sent" : "Saved to thread — connect a provider to deliver");
  };

  const available = templates.filter((t) => t.kind === compose);

  return (
    <>
      <Card>
        <CardTitle>Send a message</CardTitle>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn kind="ghost" style={{ flex: 1 }} onClick={() => openCompose("email")}><Mail size={15} /> Email</Btn>
          <Btn kind="ghost" style={{ flex: 1 }} onClick={() => openCompose("sms")}><MessageCircle size={15} /> Text</Btn>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <Chip tone={job.consent.email.granted ? "green" : "red"}>
            Email {job.consent.email.granted ? "consent" : "no consent"}
          </Chip>
          <Chip tone={job.consent.sms.granted ? "green" : "red"}>
            SMS {job.consent.sms.granted ? "consent" : "no consent"}
          </Chip>
          {!integrations.gmail.connected && <Chip tone="amber">Gmail not connected</Chip>}
          {!integrations.sms.connected && <Chip tone="amber">SMS not connected</Chip>}
        </div>
        {(!job.consent.email.granted || !job.consent.sms.granted) && (
          <div style={{ fontSize: 12.5, color: S.sub, marginTop: 10, lineHeight: 1.5 }}>
            Sending is blocked on any channel without consent on file. Consent is captured at intake and can be
            updated from the customer's contact record.
          </div>
        )}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle right={<Chip tone="blue">{thread.length}</Chip>}>Thread</CardTitle>
        {thread.length === 0 && <div style={{ fontSize: 14, color: S.sub }}>Nothing sent on this job yet.</div>}
        {thread.slice().reverse().map((m) => (
          <div key={m.id} style={{ padding: "12px 0", borderTop: `1px solid ${S.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 7, alignItems: "center", minWidth: 0 }}>
                {m.kind === "email" ? <Mail size={14} color="#1B6DE0" /> : <MessageCircle size={14} color="#1B6DE0" />}
                <span style={{ fontSize: 13, fontWeight: 700, color: S.ink }}>{m.audience}</span>
                <span style={{ fontSize: 12, color: S.sub, overflow: "hidden", textOverflow: "ellipsis" }}>{m.to}</span>
              </div>
              <Chip tone={m.status === "Sent" ? "green" : "amber"}>{m.status === "Sent" ? "Sent" : "Queued"}</Chip>
            </div>
            {m.subject && <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 6 }}>{m.subject}</div>}
            <div style={{ fontSize: 13, color: S.sub, marginTop: 4, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{m.body}</div>
            <div style={{ fontSize: 11.5, color: S.sub, marginTop: 6 }}>{m.at} · {m.by}</div>
          </div>
        ))}
      </Card>

      <Sheet open={!!compose} onClose={() => setCompose(null)} wide
        title={compose === "email" ? "New email" : "New text"}
        footer={
          <div style={{ display: "flex", gap: 10 }}>
            <Btn kind="ghost" style={{ flex: 1 }} onClick={() => setCompose(null)}>Cancel</Btn>
            <Btn style={{ flex: 2 }} disabled={!body.trim() || !consentOk(compose, to)} onClick={send}>
              <Send size={14} /> {consentOk(compose, to) ? "Send" : "No consent"}
            </Btn>
          </div>
        }>
        <Field label="To">
          <select style={selStyle} value={to} onChange={(e) => setTo(e.target.value)}>
            <option>Customer</option><option>Crew</option>
          </select>
        </Field>
        <div style={{ fontSize: 13, color: S.sub, marginTop: -8, marginBottom: 14 }}>
          {recipient(to) || (to === "Crew" ? "No crew assigned to this job yet." : "No contact on file.")}
        </div>
        {!consentOk(compose, to) && (
          <Callout label="Blocked" tone="red">
            This customer has not given {compose === "sms" ? "text" : "email"} consent. Sending anyway is a legal
            exposure, so the send button stays disabled.
          </Callout>
        )}
        {available.length > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#28373E", margin: "8px 0" }}>START FROM A TEMPLATE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
              {available.map((t) => (
                <button key={t.id} type="button" onClick={() => applyTemplate(t)} style={{
                  border: `1px solid ${S.line}`, background: "#fff", borderRadius: 999,
                  padding: "7px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: S.ink,
                }}>{t.name} <span style={{ color: S.sub }}>· {t.audience}</span></button>
              ))}
            </div>
          </>
        )}
        {compose === "email" && (
          <Field label="Subject"><input style={inputStyle} value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
        )}
        <Field label="Message">
          <textarea style={{ ...inputStyle, minHeight: 180, resize: "vertical", fontFamily: "inherit" }}
            value={body} onChange={(e) => setBody(e.target.value)} />
        </Field>
        {compose === "sms" && (
          <div style={{ fontSize: 12, color: S.sub }}>{body.length} characters · {Math.max(1, Math.ceil(body.length / 160))} segment(s)</div>
        )}
      </Sheet>
    </>
  );
}

function TabPhotos({ job, mut, toast }) {
  const [custom, setCustom] = useState("");
  const [geo, setGeo] = useState(null);       // last fix
  const [locating, setLocating] = useState(false);
  const [geoErr, setGeoErr] = useState("");
  const fileRef = useRef(null);
  const pendingLabel = useRef("");

  const getFix = async () => {
    setLocating(true); setGeoErr("");
    const r = await captureLocation();
    if (r.ok) {
      const addr = await geoReverse(r.lat, r.lng);
      const fix = { ...r, address: addr ? addr.formatted : null };
      setGeo(fix); setLocating(false);
      toast(addr ? `Located — ${addr.street || addr.formatted}` : `Location locked — ±${r.accuracy}m`);
      return fix;
    }
    setLocating(false);
    setGeoErr(r.reason);
    return r;
  };

  const addPhoto = async (label, file) => {
    let fix = geo;
    if (!fix) { const r = await getFix(); fix = r.ok ? r : null; }
    const iso = new Date().toISOString();
    const url = file ? URL.createObjectURL(file) : null;
    mut((j) => ({
      ...j,
      photos: [...j.photos, {
        id: uid("p"), label, at: fmtStamp(iso), iso, url,
        fileName: file ? file.name : null,
        lat: fix ? fix.lat : null, lng: fix ? fix.lng : null,
        accuracy: fix ? fix.accuracy : null,
        address: fix && fix.address ? fix.address : null,
      }],
    }));
    toast(fix ? "Photo stamped with time + location" : "Photo saved — no location fix");
  };

  const pickFile = (label) => { pendingLabel.current = label; fileRef.current && fileRef.current.click(); };
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) addPhoto(pendingLabel.current || "Untitled shot", file);
    e.target.value = "";
  };

  const shotsDone = new Set(job.photos.map((p) => p.label));

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        onChange={onFile} style={{ display: "none" }} />

      <Card>
        <CardTitle right={geo
          ? <Chip tone="green">±{geo.accuracy}m</Chip>
          : <Chip tone="amber">No fix</Chip>}>Location</CardTitle>
        {geo ? (
          <>
            {geo.address && <KV k="Address" v={geo.address} />}
            <KV k="Coordinates" v={fmtCoord(geo.lat, geo.lng)} />
            <KV k="Fix taken" v={fmtStamp(geo.at)} />
            <iframe title="Job site map" src={staticMapEmbed(geo.lat, geo.lng)}
              style={{ width: "100%", height: 180, border: `1px solid ${S.line}`, borderRadius: 12, marginTop: 10 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Btn kind="ghost" small style={{ flex: 1 }} onClick={getFix}><RefreshCw size={13} /> Re-fix</Btn>
              <a href={mapLinkForCoords(geo.lat, geo.lng)} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: "none" }}>
                <Btn kind="ghost" small style={{ width: "100%" }}><MapPin size={13} /> Open in Maps</Btn>
              </a>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.5 }}>
              Lock a GPS fix before shooting and every photo carries the same verified coordinates and timestamp —
              that's what makes the album hold up in a claim file.
            </div>
            {geoErr && <Callout label="Location unavailable" tone="red">{geoErr} Photos will still save with a timestamp.</Callout>}
            <Btn style={{ width: "100%", marginTop: 12 }} onClick={getFix} disabled={locating}>
              <MapPin size={15} /> {locating ? "Locating…" : "Lock GPS location"}
            </Btn>
          </>
        )}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle right={<Chip tone="gray">{shotsDone.size}/{SHOT_LIST.length}</Chip>}>Quick inspection capture</CardTitle>
        <div style={{ fontSize: 13, color: S.sub, marginBottom: 12 }}>
          Tap a shot to open the camera. Photos are time and location stamped and land on this client's profile.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SHOT_LIST.map((s) => {
            const done = shotsDone.has(s);
            return (
              <button key={s} onClick={() => pickFile(s)} style={{
                display: "flex", alignItems: "center", gap: 6,
                border: `1px solid ${done ? "#177245" : S.line}`,
                background: done ? "#E8F6EE" : "#fff",
                color: done ? "#177245" : S.ink,
                borderRadius: 999, padding: "8px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>{done ? <Check size={13} /> : <Camera size={13} />} {s}</button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input style={{ ...inputStyle, flex: 1 }} placeholder="Custom shot label" value={custom}
            onChange={(e) => setCustom(e.target.value)} />
          <Btn small disabled={!custom.trim()} onClick={() => { pickFile(custom.trim()); setCustom(""); }}>
            <Camera size={14} /> Capture
          </Btn>
        </div>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle right={<Chip tone="blue">{job.photos.length}</Chip>}>Photo album</CardTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {job.photos.map((p) => (
            <div key={p.id} style={{ border: `1px solid ${S.line}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ height: 96, background: "#EEF1F4", display: "grid", placeItems: "center", overflow: "hidden" }}>
                {p.url
                  ? <img src={p.url} alt={p.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <ImageIcon size={24} color="#9CA3AF" />}
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: S.sub, marginTop: 2 }}>{p.at}</div>
                {p.lat != null ? (
                  <a href={mapLinkForCoords(p.lat, p.lng)} target="_blank" rel="noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 4, marginTop: 5,
                    fontSize: 10.5, fontWeight: 700, color: "#1B6DE0", textDecoration: "none",
                  }}><MapPin size={10} /> {fmtCoord(p.lat, p.lng)}</a>
                ) : (
                  <div style={{ fontSize: 10.5, color: "#92600A", marginTop: 5 }}>No location</div>
                )}
              </div>
            </div>
          ))}
        </div>
        {job.photos.length === 0 && <div style={{ fontSize: 14, color: S.sub }}>No photos yet.</div>}
        {job.photos.length > 0 && (
          <Btn kind="ghost" small style={{ marginTop: 12 }} onClick={() => {
            downloadCsv(`photo-log-${job.name.replace(/\s+/g, "-").toLowerCase()}.csv`, [
              ["Label", "Timestamp", "Address", "Latitude", "Longitude", "Accuracy (m)", "File"],
              ...job.photos.map((p) => [p.label, p.at, p.address ?? "", p.lat ?? "", p.lng ?? "", p.accuracy ?? "", p.fileName ?? ""]),
            ]);
            toast("Photo log exported");
          }}><Download size={13} /> Export photo log (CSV)</Btn>
        )}
      </Card>
    </>
  );
}

/* ---------- Financials / cap-out ---------- */
function TabFinancials({ job, mut, toast, isAdmin, currentUser }) {
  const cap = computeCapOut(job);
  const fin = job.fin;
  const structure = fin.structure || "grossProfit";
  const st = STRUCTURES.find((x) => x.id === structure);
  const comparison = useMemo(() => compareStructures(job), [job]);
  const setStructureField = (k, v) => mut((j) => ({ ...j, fin: { ...j.fin, [k]: v } }));
  const addLine = (bucket) => mut((j) => ({
    ...j, fin: { ...j.fin, [bucket]: [...j.fin[bucket], { id: uid("x"), label: "New line", amt: 0, by: j.assignee }] },
  }));
  const setLine = (bucket, id, k, v) => mut((j) => ({
    ...j, fin: { ...j.fin, [bucket]: j.fin[bucket].map((l) => (l.id === id ? { ...l, [k]: k === "amt" ? num(v) : v } : l)) },
  }));
  const delLine = (bucket, id) => mut((j) => ({
    ...j, fin: { ...j.fin, [bucket]: j.fin[bucket].filter((l) => l.id !== id) },
  }));
  const exportCsv = () => {
    downloadCsv(`capout-${job.name.replace(/\s+/g, "-").toLowerCase()}.csv`, [
      ["Job", job.name], ["Address", job.address], [],
      ["Contract price", cap.contract.toFixed(2)], [],
      ["MATERIAL COSTS"], ...fin.materials.map((l) => [l.label, l.amt.toFixed(2), l.by]),
      ["Materials total", cap.materials.toFixed(2)], [],
      ["LABOR COSTS"], ...fin.labor.map((l) => [l.label, l.amt.toFixed(2), l.by]),
      ["Labor total", cap.labor.toFixed(2)], [],
      ["OTHER COSTS"], ...fin.other.map((l) => [l.label, l.amt.toFixed(2), l.by]),
      ["Other total", cap.other.toFixed(2)], [],
      ["Total COGS", cap.cogs.toFixed(2)],
      ["Gross profit", cap.gross.toFixed(2)], ["Gross margin %", cap.grossMargin.toFixed(2)],
      ["Commission structure", st.label],
      [`${cap.baseLabel}`, cap.base.toFixed(2)],
      ["Rep commission", cap.commission.toFixed(2)],
      ["Net to company", cap.netCompany.toFixed(2)], [],
      ["REIMBURSEMENTS"], ...fin.reimbursements.map((r) => [r.label, r.amt.toFixed(2), r.status]),
      ["Reimbursement total", cap.reimbTotal.toFixed(2)],
      ["TOTAL REP PAYOUT", cap.payout.toFixed(2)],
    ]);
    toast("Cap-out CSV downloaded");
  };
  const Bucket = ({ title, bucket, total }) => (
    <Card style={{ marginTop: 12 }}>
      <CardTitle right={<span style={{ fontWeight: 800 }}>{money(total)}</span>}>{title}</CardTitle>
      {fin[bucket].map((l) => (
        <div key={l.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <input style={{ ...inputStyle, flex: 1, padding: "9px 11px" }} value={l.label}
            onChange={(e) => setLine(bucket, l.id, "label", e.target.value)} />
          <span style={{ color: S.sub, fontSize: 13 }}>$</span>
          <input style={{ ...inputStyle, width: 100, textAlign: "right", padding: "9px 11px" }} value={l.amt}
            inputMode="decimal" onChange={(e) => setLine(bucket, l.id, "amt", e.target.value)} />
          <button onClick={() => delLine(bucket, l.id)} style={{ border: "none", background: "none", cursor: "pointer" }}>
            <Trash2 size={15} color="#B42318" />
          </button>
        </div>
      ))}
      <Btn kind="soft" small onClick={() => addLine(bucket)}><Plus size={13} /> Add</Btn>
    </Card>
  );
  return (
    <>
      <Card style={{ background: "#28373E", border: "none" }}>
        <div style={{ color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.85, fontSize: 13 }}>
            <span>Contract price</span><span>{money(cap.contract)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.85, fontSize: 13, marginTop: 6 }}>
            <span>Total COGS</span><span>−{money(cap.cogs)}</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10,
            borderTop: "1px solid rgba(255,255,255,.25)", fontSize: 17, fontWeight: 800,
          }}>
            <span>Gross profit</span><span>{money(cap.gross)}</span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 3 }}>{pct1(cap.grossMargin)} margin</div>
        </div>
      </Card>
      <Bucket title="Material costs" bucket="materials" total={cap.materials} />
      <Bucket title="Labor costs" bucket="labor" total={cap.labor} />
      <Bucket title="Other costs (permits, dump, misc.)" bucket="other" total={cap.other} />
      <Card style={{ marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <CardTitle>Commission structure</CardTitle>
          {!isAdmin && <Chip tone="gray"><Lock size={10} style={{ marginRight: 4, verticalAlign: -1 }} />Set by admin</Chip>}
        </div>
        {isAdmin ? (
          <>
            <select value={structure} onChange={(e) => setStructureField("structure", e.target.value)}
              style={{ ...selStyle, fontWeight: 700 }}>
              {STRUCTURES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
            </select>
            <div style={{ fontSize: 13, color: S.sub, marginTop: 8, lineHeight: 1.5 }}>{st.blurb}</div>
            {st.usesRate && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <input style={{ ...inputStyle, width: 90, textAlign: "right" }} value={fin.commissionRate}
                  inputMode="decimal" onChange={(e) => setStructureField("commissionRate", num(e.target.value))} />
                <span style={{ fontSize: 14, color: S.sub }}>% of {st.label.toLowerCase()}</span>
              </div>
            )}
            {st.usesOverhead && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <input style={{ ...inputStyle, width: 90, textAlign: "right" }} value={fin.overheadPct ?? 10}
                  inputMode="decimal" onChange={(e) => setStructureField("overheadPct", num(e.target.value))} />
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

      <Card style={{ marginTop: 12 }}>
        <CardTitle>Payout</CardTitle>
        {structure === "netProfit" && <KV k="Overhead allocation" v={`${money(cap.overheadAlloc)} (${cap.overheadPct}% of contract)`} />}
        {structure === "tenFiftyFifty" && <KV k="Company overhead (10%)" v={money(cap.contract * 0.10)} />}
        <KV k={cap.baseLabel} v={money(cap.base)} />
        <KV k="Rep commission" v={money(cap.commission)} strong />
        {isAdmin && <KV k="Net to company" v={money(cap.netCompany)} strong />}
        <div style={{ height: 10, borderRadius: 99, overflow: "hidden", display: "flex", margin: "10px 0" }}>
          <div style={{ width: `${cap.repPctGross}%`, background: "#1B6DE0" }} />
          <div style={{ width: `${cap.coPctGross}%`, background: "#28373E" }} />
        </div>
        {isAdmin && (
          <>
            <KV k="Rep — % of gross / % of job" v={`${pct1(cap.repPctGross)} / ${pct1(cap.repPctJob)}`} />
            <KV k="Company — % of gross / % of job" v={`${pct1(cap.coPctGross)} / ${pct1(cap.coPctJob)}`} />
          </>
        )}
      </Card>

      {isAdmin && (
        <Card style={{ marginTop: 12 }}>
          <CardTitle>Structure comparison</CardTitle>
          <div style={{ fontSize: 13, color: S.sub, marginTop: -6, marginBottom: 6 }}>Same job under each model. Admin-only.</div>
          {comparison.map((c) => (
            <KV key={c.id} k={`${c.label}${c.id === structure ? " (current)" : ""}`} v={money(c.commission)} strong={c.id === structure} />
          ))}
        </Card>
      )}
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Rep reimbursements (out-of-pocket)</CardTitle>
        {fin.reimbursements.map((r) => (
          <div key={r.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input style={{ ...inputStyle, flex: 1, padding: "9px 11px" }} value={r.label}
              onChange={(e) => mut((j) => ({ ...j, fin: { ...j.fin, reimbursements: j.fin.reimbursements.map((x) => x.id === r.id ? { ...x, label: e.target.value } : x) } }))} />
            <input style={{ ...inputStyle, width: 86, textAlign: "right", padding: "9px 11px" }} value={r.amt}
              inputMode="decimal"
              onChange={(e) => mut((j) => ({ ...j, fin: { ...j.fin, reimbursements: j.fin.reimbursements.map((x) => x.id === r.id ? { ...x, amt: num(e.target.value) } : x) } }))} />
            <button onClick={() => mut((j) => ({ ...j, fin: { ...j.fin, reimbursements: j.fin.reimbursements.map((x) => x.id === r.id ? { ...x, status: x.status === "Reimbursed" ? "Needs paid" : "Reimbursed" } : x) } }))}
              style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}>
              <Chip tone={r.status === "Reimbursed" ? "green" : "red"}>{r.status}</Chip>
            </button>
          </div>
        ))}
        <Btn kind="soft" small onClick={() => mut((j) => ({ ...j, fin: { ...j.fin, reimbursements: [...j.fin.reimbursements, { id: uid("r"), label: "Out-of-pocket item", amt: 0, status: "Needs paid" }] } }))}>
          <Plus size={13} /> Add reimbursement
        </Btn>
        <div style={{ marginTop: 10 }}>
          <KV k="Reimbursement total" v={money(cap.reimbTotal)} />
          <KV k="Total rep payout (commission + reimbursements)" v={money(cap.payout)} strong />
        </div>
      </Card>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <Btn kind="ghost" style={{ flex: 1 }} onClick={exportCsv}><Download size={15} /> Export cap-out CSV</Btn>
      </div>
    </>
  );
}

/* ---------- Payments ---------- */
function TabPayments({ job, mut, toast }) {
  const pay = paymentsSummary(job);
  const [form, setForm] = useState({ type: "Received", label: "", amt: "" });
  return (
    <>
      <Card>
        <CardTitle>Payment summary</CardTitle>
        <KV k="Contract price" v={money(pay.contract)} />
        <KV k="Received to date" v={money(pay.received)} />
        <KV k="Paid out (draws / expenses)" v={money(pay.paidOut)} />
        <KV k="Balance due from client" v={money(pay.balance)} strong />
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Log a payment</CardTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {["Received", "Paid out"].map((t) => (
            <button key={t} onClick={() => setForm({ ...form, type: t })} style={{
              flex: 1, border: `1.5px solid ${form.type === t ? "#1B6DE0" : S.line}`,
              background: form.type === t ? "#EAF2FD" : "#fff",
              color: form.type === t ? "#1B6DE0" : S.ink,
              borderRadius: 10, padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>{t}</button>
          ))}
        </div>
        <Field label="Description"><input style={inputStyle} value={form.label} placeholder="Deposit — check #, crew draw…"
          onChange={(e) => setForm({ ...form, label: e.target.value })} /></Field>
        <Field label="Amount ($)"><input style={inputStyle} value={form.amt} inputMode="decimal"
          onChange={(e) => setForm({ ...form, amt: e.target.value })} /></Field>
        <Btn style={{ width: "100%" }} disabled={!form.label.trim() || !num(form.amt)} onClick={() => {
          mut((j) => ({ ...j, payments: [...j.payments, { id: uid("pay"), type: form.type, label: form.label, amt: num(form.amt), date: nowStamp() }] }));
          setForm({ type: "Received", label: "", amt: "" });
          toast("Payment logged");
        }}><Plus size={15} /> Log payment</Btn>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>History</CardTitle>
        {job.payments.length === 0 && <div style={{ fontSize: 14, color: S.sub }}>No payments logged.</div>}
        {job.payments.map((p) => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${S.line}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: S.sub }}>{p.date}</div>
            </div>
            <div style={{ fontWeight: 800, color: p.type === "Received" ? "#177245" : "#B42318" }}>
              {p.type === "Received" ? "+" : "−"}{money(p.amt)}
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

/* ---------- Invoice ---------- */
function TabInvoice({ job, brand, toast }) {
  const pay = paymentsSummary(job);
  return (
    <>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{brand.company}</div>
            <div style={{ fontSize: 12, color: S.sub, marginTop: 3, whiteSpace: "pre-line" }}>
              {brand.address}{"\n"}{brand.phone}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, letterSpacing: 2, color: S.sub, fontWeight: 800 }}>INVOICE</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>{job.contract.number ? job.contract.number.replace("CON", "INV") : "INV-DRAFT"}</div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${S.line}`, paddingTop: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: S.sub, fontWeight: 700 }}>BILL TO</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3 }}>{job.name}</div>
          <div style={{ fontSize: 13, color: S.sub }}>{job.address}</div>
        </div>
        <KV k="Contract amount" v={money(pay.contract)} />
        {job.payments.filter((p) => p.type === "Received").map((p) => (
          <KV key={p.id} k={`Less: ${p.label} (${p.date})`} v={`−${money(p.amt)}`} />
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, marginTop: 8, borderTop: `2px solid ${S.ink}` }}>
          <span style={{ fontSize: 15, fontWeight: 800 }}>Balance due</span>
          <span style={{ fontSize: 18, fontWeight: 800 }}>{money(pay.balance)}</span>
        </div>
        <div style={{ fontSize: 12, color: S.sub, marginTop: 12 }}>
          Balances unpaid 30 days after completion accrue 1.5% monthly. Thank you for your business.
        </div>
      </Card>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <Btn kind="ghost" style={{ flex: 1 }} onClick={() => toast("Invoice PDF generated")}><Printer size={15} /> PDF</Btn>
        <Btn style={{ flex: 1 }} onClick={() => toast("Invoice emailed to client")}><Send size={15} /> Send invoice</Btn>
      </div>
    </>
  );
}

/* ---------- Work order — crew view, no pricing ---------- */
function TabWorkOrder({ job, mut, toast, brand, crews, templates, currentUser }) {
  const [picking, setPicking] = useState(false);
  const [sending, setSending] = useState(false);
  const [notes, setNotes] = useState(job.workOrder ? job.workOrder.notes : "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const crew = crews.find((c) => c.id === job.crewId) || null;
  const m = job.measurements;
  const mats = generateRoofingMaterials(m);
  const wo = job.workOrder || { number: "", sentAt: null, status: "Draft", notes: "" };

  const assign = (c) => {
    mut((j) => ({ ...j, crewId: c.id }));
    setPicking(false);
    toast(`${c.name} assigned`);
  };
  const openSend = () => {
    const ctx = templateContext(job, brand, crew);
    const t = templates.find((x) => x.kind === "email" && x.audience === "Crew");
    setSubject(t ? mergeTemplate(t.subject, ctx) : `${brand.company} — work order for ${job.address}`);
    setBody(t ? mergeTemplate(t.body, ctx) : "");
    setSending(true);
  };
  const send = () => {
    const stamp = nowStamp();
    mut((j) => ({
      ...j,
      workOrder: { ...wo, number: wo.number || `WO-${String(Math.floor(Math.random() * 900) + 100)}`, sentAt: stamp, status: "Sent", notes },
      messages: [...(j.messages || []), {
        id: uid("msg"), kind: "email", audience: "Crew", to: crew.email,
        subject, body, at: stamp, by: currentUser.name, status: "Queued — no provider connected",
      }],
    }));
    setSending(false);
    toast("Work order sent to crew");
  };

  return (
    <>
      <Card>
        <CardTitle right={wo.status === "Sent" ? <Chip tone="green">Sent {wo.sentAt}</Chip> : <Chip tone="gray">Draft</Chip>}>
          Crew assignment
        </CardTitle>
        {crew ? (
          <>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.ink }}>{crew.name}</div>
            <div style={{ fontSize: 13, color: S.sub, marginTop: 3 }}>{crew.contact}</div>
            <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap", fontSize: 12.5, color: S.sub }}>
              {crew.phone && <span style={{ display: "flex", gap: 5, alignItems: "center" }}><Phone size={12} /> {crew.phone}</span>}
              {crew.email && <span style={{ display: "flex", gap: 5, alignItems: "center" }}><Mail size={12} /> {crew.email}</span>}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn kind="ghost" small style={{ flex: 1 }} onClick={() => setPicking(true)}>Change crew</Btn>
              <Btn small style={{ flex: 2 }} disabled={!crew.email} onClick={openSend}>
                <Send size={13} /> {wo.status === "Sent" ? "Resend work order" : "Send work order"}
              </Btn>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 14, color: S.sub, lineHeight: 1.5 }}>
              No crew assigned. Pick one to dispatch this work order.
            </div>
            <Btn style={{ width: "100%", marginTop: 12 }} onClick={() => setPicking(true)}>
              <HardHat size={15} /> Select crew
            </Btn>
          </>
        )}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle right={<Chip tone="gray">No pricing</Chip>}>Work order — {wo.number || "unassigned"}</CardTitle>
        <div style={{ fontSize: 12.5, color: S.sub, marginBottom: 10, lineHeight: 1.5 }}>
          Everything the crew needs and nothing they don't. Pricing never appears on this document.
        </div>
        <KV k="Customer" v={job.name} />
        <KV k="Address" v={job.address} />
        <KV k="Customer phone" v={job.phone} />
        <KV k="Scheduled" v={job.schedDate || "Not scheduled"} />
        <KV k="Squares" v={m.squares || "—"} />
        <KV k="Pitch" v={m.pitch || "—"} />
        <KV k="Layers to remove" v={job.checklist.layers || "—"} />
        <KV k="Decking" v={job.checklist.deckingType || "—"} />
        <a href={directionsLink(job.address)} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          <Btn kind="ghost" small style={{ width: "100%", marginTop: 10 }}><MapPin size={13} /> Directions to site</Btn>
        </a>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle>Scope of work</CardTitle>
        <div style={{ fontSize: 13.5, color: S.ink, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {job.estimate.scope || "No scope written yet — build the estimate first."}
        </div>
      </Card>

      {mats && (
        <Card style={{ marginTop: 12 }}>
          <CardTitle>Materials on site</CardTitle>
          {mats.map((x, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
              <span style={{ fontSize: 13, color: S.ink }}>{x.item}</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{x.qty} {x.unit}</span>
            </div>
          ))}
        </Card>
      )}

      <Card style={{ marginTop: 12 }}>
        <CardTitle>Notes for the crew</CardTitle>
        <textarea style={{ ...inputStyle, minHeight: 110, resize: "vertical", fontFamily: "inherit" }}
          placeholder="Access notes, dog on site, where to stage the dumpster, anything the crew needs to know before they roll."
          value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Btn kind="ghost" small style={{ marginTop: 10 }}
          onClick={() => { mut((j) => ({ ...j, workOrder: { ...wo, notes } })); toast("Notes saved"); }}>
          Save notes
        </Btn>
      </Card>

      <Sheet open={picking} onClose={() => setPicking(false)} title="Select crew">
        {crews.filter((c) => c.active).map((c, i) => (
          <button key={c.id} onClick={() => assign(c)} style={{
            width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer",
            padding: "13px 4px", borderTop: i ? `1px solid ${S.line}` : "none",
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.ink }}>{c.name}</div>
            <div style={{ fontSize: 12.5, color: S.sub, marginTop: 3 }}>{c.contact} · {c.phone}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
              {c.trades.map((t) => <Chip key={t} tone="gray">{t}</Chip>)}
            </div>
          </button>
        ))}
        {crews.filter((c) => c.active).length === 0 && (
          <div style={{ fontSize: 14, color: S.sub }}>No active crews. Add one under More → Crews.</div>
        )}
      </Sheet>

      <Sheet open={sending} onClose={() => setSending(false)} wide title="Email work order"
        footer={
          <div style={{ display: "flex", gap: 10 }}>
            <Btn kind="ghost" style={{ flex: 1 }} onClick={() => setSending(false)}>Cancel</Btn>
            <Btn style={{ flex: 2 }} disabled={!body.trim()} onClick={send}><Send size={14} /> Send</Btn>
          </div>
        }>
        <Field label="To"><input style={inputStyle} value={crew ? crew.email : ""} readOnly /></Field>
        <Field label="Subject"><input style={inputStyle} value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
        <Field label="Message">
          <textarea style={{ ...inputStyle, minHeight: 200, resize: "vertical", fontFamily: "inherit" }}
            value={body} onChange={(e) => setBody(e.target.value)} />
        </Field>
        <Callout label="What gets attached">
          The work order above — scope, measurements, materials, site notes, and directions. No pricing.
        </Callout>
      </Sheet>
    </>
  );
}

function TabTasks({ job, mut }) {
  const [txt, setTxt] = useState("");
  return (
    <Card>
      <CardTitle>Project tasks</CardTitle>
      {job.tasks.map((t) => (
        <button key={t.id} onClick={() => mut((j) => ({ ...j, tasks: j.tasks.map((x) => x.id === t.id ? { ...x, done: !x.done } : x) }))}
          style={{
            display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 0",
            border: "none", background: "none", cursor: "pointer", textAlign: "left",
            borderBottom: `1px solid ${S.line}`,
          }}>
          {t.done ? <CheckCircle2 size={20} color="#177245" /> : <Circle size={20} color="#C7CBD1" />}
          <span style={{
            fontSize: 15, color: t.done ? S.sub : S.ink,
            textDecoration: t.done ? "line-through" : "none",
          }}>{t.label}</span>
        </button>
      ))}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <input style={{ ...inputStyle, flex: 1 }} placeholder="Add a task" value={txt}
          onChange={(e) => setTxt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && txt.trim()) { mut((j) => ({ ...j, tasks: [...j.tasks, { id: uid("t"), label: txt.trim(), done: false }] })); setTxt(""); } }} />
        <Btn small disabled={!txt.trim()} onClick={() => { mut((j) => ({ ...j, tasks: [...j.tasks, { id: uid("t"), label: txt.trim(), done: false }] })); setTxt(""); }}>
          <Plus size={14} />
        </Btn>
      </div>
    </Card>
  );
}

/* ---------- Files ---------- */
const FILE_CATS = ["Signed paperwork", "Insurance", "Permits", "Delivery tickets", "Receipts", "Measurements", "Photos", "Other"];
function TabFiles({ job, mut, toast }) {
  const [cat, setCat] = useState(FILE_CATS[0]);
  const [name, setName] = useState("");
  return (
    <>
      <Card>
        <CardTitle>Upload a file</CardTitle>
        <Field label="File name"><input style={inputStyle} value={name} placeholder="e.g. Signed contract.pdf"
          onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Category">
          <select style={selStyle} value={cat} onChange={(e) => setCat(e.target.value)}>
            {FILE_CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Btn style={{ width: "100%" }} disabled={!name.trim()} onClick={() => {
          mut((j) => ({ ...j, files: [...j.files, { id: uid("f"), name: name.trim(), cat, at: nowStamp(), by: j.assignee }] }));
          setName(""); toast("File attached to job");
        }}><Upload size={15} /> Upload</Btn>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle right={<Chip tone="blue">{job.files.length}</Chip>}>Job files</CardTitle>
        {job.files.length === 0 && <div style={{ fontSize: 14, color: S.sub }}>No files yet.</div>}
        {job.files.map((f) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${S.line}` }}>
            <FileText size={18} color="#1B6DE0" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: S.sub }}>{f.cat} · {f.at} · {f.by}</div>
            </div>
            <button onClick={() => mut((j) => ({ ...j, files: j.files.filter((x) => x.id !== f.id) }))}
              style={{ border: "none", background: "none", cursor: "pointer" }}>
              <Trash2 size={15} color="#B42318" />
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}

/* ---------- Client portal sharing ---------- */
function TabPortal({ job, brand, mut, toast }) {
  const rows = [
    ["estimate", "Estimate", job.estimate.number || "No estimate yet"],
    ["contract", "Contract", job.contract.number || "No contract yet"],
    ["photos", "Photo album", `${job.photos.length} photos`],
    ["invoice", "Invoice & balance", ""],
  ];
  return (
    <>
      <Card>
        <CardTitle>Client portal</CardTitle>
        <div style={{ fontSize: 13, color: S.sub, marginBottom: 14 }}>
          The client sees their project at a private link: current stage, shared documents, and shared photos —
          nothing else. Toggle what's visible.
        </div>
        {rows.map(([k, label, sub]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${S.line}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
              {sub && <div style={{ fontSize: 12, color: S.sub }}>{sub}</div>}
            </div>
            <button onClick={() => mut((j) => ({ ...j, portal: { ...j.portal, [k]: !j.portal[k] } }))} style={{
              width: 46, height: 27, borderRadius: 99, border: "none", cursor: "pointer",
              background: job.portal[k] ? "#1B6DE0" : "#D6D9DE", position: "relative", transition: "background .15s",
            }}>
              <span style={{
                position: "absolute", top: 3, left: job.portal[k] ? 22 : 3,
                width: 21, height: 21, borderRadius: 99, background: "#fff", transition: "left .15s",
              }} />
            </button>
          </div>
        ))}
        <Btn kind="ghost" style={{ marginTop: 14, width: "100%" }} onClick={() => toast("Portal link copied")}>
          <Share2 size={15} /> Copy portal link
        </Btn>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle right={<Chip tone="blue">Client view</Chip>}>Portal preview</CardTitle>
        <div style={{ border: `1px solid ${S.line}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ background: "#28373E", padding: "16px 16px 14px", color: "#fff" }}>
            <div style={{ fontSize: 12, opacity: 0.75 }}>{brand.company}</div>
            <div style={{ fontSize: 17, fontWeight: 800, marginTop: 3 }}>Your roofing project</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{job.address}</div>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Project status</div>
            <Chip tone="blue">In progress</Chip>
            <div style={{ marginTop: 14, fontSize: 13, fontWeight: 700 }}>Shared with you</div>
            {rows.filter(([k]) => job.portal[k]).map(([k, label]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${S.line}` }}>
                <FileText size={15} color="#1B6DE0" /><span style={{ fontSize: 14 }}>{label}</span>
              </div>
            ))}
            {rows.every(([k]) => !job.portal[k]) && (
              <div style={{ fontSize: 13, color: S.sub, marginTop: 8 }}>Nothing shared yet.</div>
            )}
            <div style={{ fontSize: 12, color: S.sub, marginTop: 14 }}>
              Questions? {brand.phone} · {brand.email}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   INSURANCE MODULE
   ================================================================ */
/* ================================================================
   SHINGLE FINDER — search the identification database by any field.
   Width is the fastest discriminator on a roof, so it leads.
   ================================================================ */
function ShingleFinder() {
  const [q, setQ] = useState("");
  const [mfr, setMfr] = useState("All");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");

  const makers = useMemo(() => ["All", ...Array.from(new Set(SHINGLE_DB.map((x) => x.mfr)))], []);
  const list = useMemo(() => SHINGLE_DB.filter((x) => {
    if (mfr !== "All" && x.mfr !== mfr) return false;
    if (status !== "All" && x.status !== status) return false;
    if (type !== "All" && x.type !== type) return false;
    if (q.trim()) {
      const hay = `${x.mfr} ${x.line} ${x.type} ${x.years} ${x.note} ${x.l} ${x.w} ${x.exp}`.toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  }), [q, mfr, status, type]);

  const dim = (n) => (n ? String(n).replace(/\.0$/, "") + '"' : "—");
  const Seg = ({ opts, val, set }) => (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {opts.map((o) => (
        <button key={o.v} onClick={() => set(o.v)} style={{
          border: `1.5px solid ${val === o.v ? "#1B6DE0" : S.line}`,
          background: val === o.v ? "#EAF2FD" : "#fff",
          color: val === o.v ? "#1B6DE0" : S.ink,
          borderRadius: 999, padding: "7px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>{o.l}</button>
      ))}
    </div>
  );

  return (
    <div>
      <Card>
        <CardTitle>Width tells you almost everything</CardTitle>
        <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.5, marginBottom: 10 }}>
          Measure the shingle length on the roof before anything else, then confirm with the back-of-shingle marks.
        </div>
        {SHINGLE_RULES.map(([k, v], i) => (
          <div key={i} style={{ padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: S.ink }}>{k}</div>
            <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </Card>

      <Card style={{ marginTop: 14 }}>
        <CardTitle right={<Chip tone="blue">{list.length}</Chip>}>Search</CardTitle>
        <input style={inputStyle} placeholder="Manufacturer, line, size, year…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div style={{ marginTop: 10 }}>
          <Seg val={status} set={setStatus} opts={[{ v: "All", l: "All" }, { v: "disco", l: "Discontinued" }, { v: "current", l: "Current" }]} />
        </div>
        <div style={{ marginTop: 8 }}>
          <Seg val={type} set={setType} opts={[{ v: "All", l: "All types" }, { v: "Laminate", l: "Laminate" }, { v: "3-tab", l: "3-tab" }, { v: "Designer", l: "Designer" }]} />
        </div>
        <select style={{ ...selStyle, marginTop: 10 }} value={mfr} onChange={(e) => setMfr(e.target.value)}>
          {makers.map((m) => <option key={m}>{m}</option>)}
        </select>
      </Card>

      {list.map((x, i) => (
        <Card key={i} pad={15} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>{x.line}</div>
              <div style={{ fontSize: 12.5, color: S.sub, marginTop: 2 }}>{x.mfr}{x.years ? ` · ${x.years}` : ""}</div>
            </div>
            <Chip tone={x.status === "current" ? "green" : "red"}>{x.status === "current" ? "Current" : "Discontinued"}</Chip>
          </div>
          {(x.l || x.w || x.exp) ? (
            <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12.5, color: S.sub }}>Length <b style={{ color: S.ink }}>{dim(x.l)}</b></span>
              <span style={{ fontSize: 12.5, color: S.sub }}>Width <b style={{ color: S.ink }}>{dim(x.w)}</b></span>
              <span style={{ fontSize: 12.5, color: S.sub }}>Exposure <b style={{ color: S.ink }}>{dim(x.exp)}</b></span>
              <Chip tone="gray">{x.type}</Chip>
            </div>
          ) : (
            <div style={{ marginTop: 10 }}><Chip tone="gray">{x.type}</Chip></div>
          )}
          {x.note && <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 9 }}>{x.note}</div>}
        </Card>
      ))}
      {list.length === 0 && (
        <Card style={{ marginTop: 10 }}>
          <div style={{ fontSize: 14, color: S.sub }}>No match. Try the length alone, or clear the filters.</div>
        </Card>
      )}

      <Card style={{ marginTop: 14 }}>
        <CardTitle>Back-of-shingle marks</CardTitle>
        {MFR_IDENT.map((m, i) => (
          <div key={i} style={{ padding: "11px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: S.ink }}>{m.mfr}</div>
            <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 4 }}>{m.mark}</div>
            {m.plants && <div style={{ fontSize: 12, color: S.sub, lineHeight: 1.5, marginTop: 6 }}><b>Plant codes:</b> {m.plants}</div>}
          </div>
        ))}
      </Card>
      <Callout label="Verify before it goes in writing">
        Dimensions and dates here are a field reference compiled from manufacturer data and industry sources. Before
        attaching any of it to a supplement, confirm against the manufacturer's own current literature or their tech
        services line — their document is the evidence, this screen is the shortcut to finding it.
      </Callout>
    </div>
  );
}

/* ================================================================
   LETTER TEMPLATES — copy, fill the brackets, send.
   ================================================================ */
function LetterTemplates() {
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(null);
  const copy = async (t) => {
    try {
      await navigator.clipboard.writeText(t.body);
      setCopied(t.id);
      setTimeout(() => setCopied(null), 1800);
    } catch { setCopied("fail"); setTimeout(() => setCopied(null), 1800); }
  };
  return (
    <div>
      <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }}>
        Put it in writing. Verbal approvals and denials disappear when a claim gets contested — written ones do not.
        Copy a template, fill the bracketed fields, send it from your work email so there's a timestamp.
      </div>
      {LETTER_TEMPLATES.map((t, i) => (
        <Card key={t.id} style={{ marginTop: i ? 12 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>{t.title}</div>
              <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 4 }}>{t.when}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Btn kind="ghost" small style={{ flex: 1 }} onClick={() => setOpen(open === t.id ? null : t.id)}>
              <Eye size={13} /> {open === t.id ? "Hide" : "Read"}
            </Btn>
            <Btn small style={{ flex: 1 }} onClick={() => copy(t)}>
              {copied === t.id ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
            </Btn>
          </div>
          {open === t.id && (
            <pre style={{
              whiteSpace: "pre-wrap", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12.5, lineHeight: 1.6, color: S.ink, background: "#FAFBFC",
              border: `1px solid ${S.line}`, borderRadius: 10, padding: 13, marginTop: 12, overflowX: "auto",
            }}>{t.body}</pre>
          )}
        </Card>
      ))}
      <Callout label="Before sending">
        Replace every bracketed field — an unfilled placeholder in front of an adjuster costs credibility on the whole
        letter. Attach the photos, measurements, and manufacturer bulletin you reference. Keep a copy in the job's Files tab.
      </Callout>
    </div>
  );
}

function InsuranceHub({ jobs, onBack, onOpenJob, toast }) {
  const [tab, setTab] = useState("clients");
  const [zip, setZip] = useState("");
  const [tplState, setTplState] = useState("OH");
  const [openTpl, setOpenTpl] = useState(null);
  const [resourcePage, setResourcePage] = useState(null);
  const insJobs = jobs.filter((j) => j.claimType === "Insurance");
  const juris = jurisdictionForZip(zip.trim());
  const tabs = [["clients", "Clients"], ["supplements", "Supplements"], ["codes", "Code lookup"], ["resources", "Resources"]];
  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <SubHeader title="Insurance" onBack={onBack} />
      <div style={{ display: "flex", gap: 6, marginTop: 14, overflowX: "auto" }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            border: "none", borderRadius: 999, padding: "9px 16px", fontSize: 14, fontWeight: 700,
            cursor: "pointer", whiteSpace: "nowrap",
            background: tab === id ? "#28373E" : "#fff", color: tab === id ? "#fff" : S.ink,
          }}>{label}</button>
        ))}
      </div>

      {tab === "clients" && (
        <div style={{ marginTop: 14 }}>
          {insJobs.map((j) => (
            <Card key={j.id} pad={16} style={{ marginBottom: 10, cursor: "pointer" }}>
              <div onClick={() => onOpenJob(j.id)}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{j.name}</div>
                  {j.value > 0 && <div style={{ fontWeight: 700 }}>{money(j.value)}</div>}
                </div>
                <div style={{ fontSize: 13, color: S.sub, marginTop: 2 }}>{j.address}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
                  <Chip tone="blue">{j.insurance?.carrier || "Carrier TBD"}</Chip>
                  <Chip tone={j.insurance?.claim ? "green" : "amber"}>{j.insurance?.claim ? "Claim filed" : "Claim not filed"}</Chip>
                  {j.insurance?.coverage && <Chip tone="gray">{j.insurance.coverage}</Chip>}
                  {j.insurance?.oLaw && <Chip tone="slate">O&L</Chip>}
                </div>
              </div>
            </Card>
          ))}
          {insJobs.length === 0 && <div style={{ fontSize: 14, color: S.sub, marginTop: 8 }}>No insurance jobs yet.</div>}
        </div>
      )}

      {tab === "supplements" && (
        <div style={{ marginTop: 14 }}>
          <Card pad={14}>
            <div style={{ fontSize: 13, color: S.sub, marginBottom: 10 }}>
              One template library, three jurisdictions — pick the job's state and every template renders with the
              right code citation.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["OH", "KY", "IL"].map((st) => (
                <button key={st} onClick={() => setTplState(st)} style={{
                  flex: 1, border: `1.5px solid ${tplState === st ? "#1B6DE0" : S.line}`,
                  background: tplState === st ? "#EAF2FD" : "#fff",
                  color: tplState === st ? "#1B6DE0" : S.ink,
                  borderRadius: 10, padding: "10px 0", fontWeight: 800, cursor: "pointer",
                }}>{st}</button>
              ))}
            </div>
            {tplState !== "OH" && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "flex-start" }}>
                <AlertTriangle size={15} color="#92600A" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 12, color: "#92600A" }}>
                  {tplState === "KY" ? "Kentucky cites are IRC-based — verify the current KRC edition before sending."
                    : "Illinois has no statewide code — verify the municipality's adopted edition and amendments before sending."}
                </div>
              </div>
            )}
          </Card>
          {SUPPLEMENT_TEMPLATES.map((t) => {
            const prov = citeFor(tplState, t.topic);
            const isOpen = openTpl === t.id;
            const wording = t.wording.replaceAll("{CITE}", prov.cite);
            return (
              <Card key={t.id} pad={16} style={{ marginTop: 10 }}>
                <button onClick={() => setOpenTpl(isOpen ? null : t.id)} style={{
                  width: "100%", border: "none", background: "none", cursor: "pointer",
                  textAlign: "left", padding: 0,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, color: S.sub }}>{t.category}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{t.title}</div>
                      <div style={{ marginTop: 6 }}><Chip tone={prov.verified ? "blue" : "amber"}>{prov.cite}</Chip></div>
                    </div>
                    <ChevronDown size={17} style={{ transform: isOpen ? "rotate(180deg)" : "none", flexShrink: 0 }} />
                  </div>
                </button>
                {isOpen && (
                  <div style={{ marginTop: 12, borderTop: `1px solid ${S.line}`, paddingTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#28373E", marginBottom: 5 }}>WHEN TO USE</div>
                    <div style={{ fontSize: 13, color: S.ink, lineHeight: 1.55 }}>{t.scenario}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#28373E", margin: "12px 0 5px" }}>CODE BASIS</div>
                    <div style={{ fontSize: 13, color: S.ink, lineHeight: 1.55 }}>{prov.note}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#28373E", margin: "12px 0 5px" }}>LINE ITEMS TO ADD</div>
                    {t.lineItems.map((li, i) => (
                      <div key={i} style={{ fontSize: 13, color: S.ink, lineHeight: 1.55, marginBottom: 3 }}>• {li}</div>
                    ))}
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#28373E", margin: "12px 0 5px" }}>DOCUMENTATION</div>
                    {t.docs.map((d, i) => (
                      <div key={i} style={{ fontSize: 13, color: S.ink, lineHeight: 1.55, marginBottom: 3 }}>• {d}</div>
                    ))}
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#28373E", margin: "12px 0 5px" }}>SUPPLEMENT WORDING</div>
                    <div style={{
                      fontSize: 13, color: S.ink, lineHeight: 1.6, background: "#FAFBFC",
                      border: `1px solid ${S.line}`, borderRadius: 10, padding: 12,
                    }}>{wording}</div>
                    <Btn small kind="soft" style={{ marginTop: 12 }} onClick={() => {
                      if (navigator.clipboard) navigator.clipboard.writeText(wording);
                      toast("Wording copied — fill the [brackets]");
                    }}><Copy size={13} /> Copy wording</Btn>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {tab === "codes" && (
        <div style={{ marginTop: 14 }}>
          <Card>
            <CardTitle>Jurisdiction lookup by zip</CardTitle>
            <div style={{ fontSize: 13, color: S.sub, marginBottom: 10 }}>
              Enter a job-site zip to pull the adopted code, permit requirements, and building department contact.
            </div>
            <input style={inputStyle} placeholder="Zip code — try 45240, 41179, 60014" value={zip}
              inputMode="numeric" onChange={(e) => setZip(e.target.value)} />
          </Card>
          {zip.trim().length === 5 && !juris && (
            <Card style={{ marginTop: 12 }}>
              <div style={{ fontSize: 14, color: S.sub, lineHeight: 1.55 }}>
                {zip} is outside Supreme's OH / KY / IL markets, so there's no code guidance on file for it.
                Add the jurisdiction from the county or municipal source to bring it in.
              </div>
            </Card>
          )}
          {juris && (
            <>
              <Card style={{ marginTop: 12 }}>
                <CardTitle right={juris.precision === "verified"
                  ? <Chip tone="green">Verified {juris.verifiedDetail?.date}</Chip>
                  : <Chip tone="amber">State-level — verify locally</Chip>}>
                  {juris.city ? `${juris.city}, ${juris.state}` : `${juris.state} — zip ${juris.zip}`}
                </CardTitle>
                {juris.county && <KV k="County" v={juris.county} />}
                <KV k="Building code" v={juris.codeName} />
                <KV k="Edition" v={juris.codeEdition} />
                <KV k="Adoption" v={juris.adoption} />
                <KV k="Permits" v={juris.permit} />
                {juris.sources && (
                  <div style={{ marginTop: 8 }}>
                    {juris.sources.map((sid) => <SourceLink key={sid} srcId={sid} />)}
                  </div>
                )}
                {!juris.verified && (
                  <Callout label="Before field use">
                    Open the official source above, confirm the adopted edition and local amendments, and have the
                    office mark this jurisdiction verified with a date and initials.
                  </Callout>
                )}
              </Card>
              <Card style={{ marginTop: 12 }}>
                <CardTitle>Building department</CardTitle>
                <KV k="Office" v={juris.inspector.office} />
                <KV k="Phone" v={juris.inspector.phone} />
                <KV k="Address" v={juris.inspector.address} />
              </Card>
              <Card style={{ marginTop: 12 }}>
                <CardTitle>Key roofing provisions — {juris.state}</CardTitle>
                {Object.entries(CODE_PROVISIONS[juris.state]).map(([topic, p]) => (
                  <div key={topic} style={{ padding: "10px 0", borderBottom: `1px solid ${S.line}` }}>
                    <Chip tone={p.verified ? "blue" : "amber"}>{p.cite}</Chip>
                    <div style={{ fontSize: 13, color: S.ink, marginTop: 6, lineHeight: 1.5 }}>{p.note}</div>
                  </div>
                ))}
              </Card>
              {juris.state === "OH" && (
                <Card style={{ marginTop: 12 }}>
                  <CardTitle>Full provision reference</CardTitle>
                  <div style={{ fontSize: 13, color: S.sub, marginBottom: 8 }}>Tap a source chip to open the official text — includes the matching-insurance-regulation tie-in.</div>
                  {PROVISION_TOPICS.map((p, i) => (
                    <div key={i} style={{ borderTop: i ? `1px solid ${S.line}` : "none", padding: "12px 0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: S.ink }}>{p.topic}</div>
                        <Chip tone={p.srcOH === "RCO" ? "blue" : "amber"}>{p.oh}</Chip>
                      </div>
                      <div style={{ fontSize: 13, color: S.sub, marginTop: 5, lineHeight: 1.5 }}>{p.note}</div>
                      {p.conflict && <Callout label="Check the section number">{p.conflict}</Callout>}
                      <SourceLink srcId={p.srcOH} />
                    </div>
                  ))}
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {tab === "resources" && (
        <div style={{ marginTop: 14 }}>
          {!resourcePage ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {RESOURCE_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button key={sec.id} onClick={() => setResourcePage(sec.id)} style={{
                    textAlign: "left", background: "#fff", border: `1px solid ${S.line}`, borderRadius: 14,
                    padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EAF2FD", display: "grid", placeItems: "center" }}>
                      <Icon size={18} color="#1B6DE0" />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>{sec.title}</div>
                    <div style={{ fontSize: 12.5, color: S.sub, lineHeight: 1.45 }}>{sec.blurb}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1B6DE0", display: "flex", alignItems: "center", gap: 4 }}>
                      Open <ChevronRight size={14} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <button onClick={() => setResourcePage(null)} style={{
                display: "flex", alignItems: "center", gap: 6, border: "none", background: "none",
                color: "#1B6DE0", fontWeight: 700, fontSize: 14, cursor: "pointer", padding: "4px 0 12px",
              }}><ChevronLeft size={16} /> Resources</button>
              {resourcePage === "shingles" && <ShingleFinder />}
              {resourcePage === "specs" && (
                <div>
                  <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }}>
                    Used to show that current product is not equivalent to what's on the roof. Pull the manufacturer's own
                    bulletin from their tech services line and attach it to the supplement — your summary is not the evidence, theirs is.
                  </div>
                  {MFR_SPECS.map((m, i) => (
                    <Card key={i} style={{ marginTop: i ? 14 : 0 }}>
                      <CardTitle right={<Chip tone="blue">{m.mfr}</Chip>}>{m.flagship}</CardTitle>
                      <KV k="Width" v={m.w} />
                      <KV k="Length" v={m.l} />
                      <KV k="Exposure" v={m.exp} />
                      <KV k="Wind warranty" v={m.wind} />
                      <KV k="Algae warranty" v={m.algae} />
                      <KV k="Limited warranty" v={m.warranty} />
                      <KV k="Class 4 (UL 2218)" v={m.class4} />
                      <Callout label="Do not mix">{m.dnm}</Callout>
                    </Card>
                  ))}
                  <Card style={{ marginTop: 14 }}>
                    <CardTitle>Vinyl siding — the matching reality</CardTitle>
                    <div style={{ fontSize: 13, color: S.sub, marginBottom: 8 }}>Major makers: {SIDING_MATCHING.makers}</div>
                    <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.55 }}>
                      Even with a current SKU in a current color, a ten-year-old wall will not match new stock. Four reasons:
                    </div>
                    <Bullets items={SIDING_MATCHING.points} />
                    <Callout label="The argument" tone="green">{SIDING_MATCHING.argument}</Callout>
                  </Card>
                  <Card style={{ marginTop: 14 }}>
                    <CardTitle>Technical services lines</CardTitle>
                    {KEY_CONTACTS.map(([name, phone, web], i) => (
                      <div key={i} style={{ padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: S.ink }}>{name}</div>
                        <div style={{ fontSize: 12.5, color: S.sub, marginTop: 2 }}>
                          {[phone, web].filter(Boolean).join("  ·  ")}
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              )}
              {resourcePage === "letters" && <LetterTemplates />}
              {resourcePage === "law" && (
                <div>
                  {LAW_ITEMS.map((it, i) => (
                    <Card key={i} style={{ marginTop: i ? 14 : 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>{it.title}</div>
                      <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 8 }}>{it.body}</div>
                      <SourceLink srcId={it.src} />
                    </Card>
                  ))}
                  <Card style={{ marginTop: 14 }}>
                    <CardTitle>Who to call</CardTitle>
                    {KEY_CONTACTS.slice(0, 2).map(([name, phone, web], i) => (
                      <div key={i} style={{ padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: S.ink }}>{name}</div>
                        <div style={{ fontSize: 12.5, color: S.sub, marginTop: 2 }}>{[phone, web].filter(Boolean).join("  ·  ")}</div>
                      </div>
                    ))}
                  </Card>
                  <Callout label="Guidance, not legal advice">
                    Summaries for field use, current as compiled. Confirm the text at the linked official source before
                    relying on any of it in a dispute, and route anything adversarial to counsel.
                  </Callout>
                </div>
              )}
              {resourcePage === "policy" && (
                <div>
                  <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }}>
                    Three coverages that turn a partial claim into a full one. Check the declarations page and endorsements before making any promises.
                  </div>
                  {POLICY_CARDS.map((c, i) => (
                    <Card key={i} style={{ marginTop: i ? 14 : 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: S.ink }}>{c.title}</div>
                      <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 8 }}>{c.body}</div>
                      <Callout label={c.callout.label}>{c.callout.text}</Callout>
                    </Card>
                  ))}
                </div>
              )}
              {resourcePage === "docs" && (
                <div>
                  <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }}>
                    If it wasn't photographed and measured, it didn't happen. The adjuster reads the file, not your memory.
                  </div>
                  {DOC_GROUPS.map((g, gi) => (
                    <Card key={gi} style={{ marginTop: gi ? 14 : 0 }}>
                      <CardTitle>{g.title}</CardTitle>
                      {g.items.map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
                          <CheckCircle2 size={16} color="#177245" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: S.ink }}>{t}</div>
                        </div>
                      ))}
                    </Card>
                  ))}
                  <Card style={{ marginTop: 14 }}>
                    <CardTitle>Photo templates by damage type</CardTitle>
                    {DOC_TEMPLATES.map((t, i) => (
                      <div key={i} style={{ marginTop: i ? 12 : 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: S.ink }}>{t.type}</div>
                        <Bullets items={t.items} />
                      </div>
                    ))}
                  </Card>
                  <Card style={{ marginTop: 14 }}>
                    <CardTitle>Scope items to check on every carrier estimate</CardTitle>
                    <div style={{ fontSize: 13, color: S.sub, marginBottom: 8 }}>Run this list against the loss summary before you sign off on scope.</div>
                    {SUPPLEMENT_TRIGGERS.map(([item, cite], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
                        <span style={{ fontSize: 13.5, color: S.ink, fontWeight: 600 }}>{item}</span>
                        <span style={{ fontSize: 12, color: S.sub, textAlign: "right", flexShrink: 0 }}>{cite}</span>
                      </div>
                    ))}
                  </Card>
                </div>
              )}
              {resourcePage === "tips" && (
                <div>
                  <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }}>
                    The most common adjuster shortcuts and the code cite that answers each. Plus patterns we see from specific carriers — not accusations, just field observations to prepare for.
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: "#1B6DE0", marginBottom: 10 }}>CLAIM SCENARIOS</div>
                  {CLAIM_SCENARIOS.map((sc, i) => (
                    <Card key={i} style={{ marginTop: i ? 14 : 0 }}>
                      <div style={{ fontSize: 15.5, fontWeight: 800, color: S.ink }}>{sc.q}</div>
                      <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.55, marginTop: 6 }}>{sc.setup}</div>
                      <Callout label="Answer" tone="green"><Bullets items={sc.answer} /></Callout>
                    </Card>
                  ))}
                  {MORE_SCENARIOS.map((sc, i) => (
                    <Card key={`m${i}`} style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 15.5, fontWeight: 800, color: S.ink }}>{sc.q}</div>
                      <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.55, marginTop: 6 }}>{sc.setup}</div>
                      <Callout label="Answer" tone="green"><Bullets items={sc.answer} /></Callout>
                    </Card>
                  ))}
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: "#1B6DE0", margin: "20px 0 10px" }}>WHEN THE ADJUSTER SAYS FINAL</div>
                  <Card>
                    <div style={{ fontSize: 13.5, color: S.sub, marginBottom: 10 }}>Escalate in order. Each step creates a record the next one relies on.</div>
                    {ESCALATION_LADDER.map(([t, d], i) => (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
                        <span style={{
                          width: 24, height: 24, borderRadius: 999, background: "#EAF2FD", color: "#1B6DE0",
                          display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, flexShrink: 0,
                        }}>{i + 1}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: S.ink }}>{t}</div>
                          <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 3 }}>{d}</div>
                        </div>
                      </div>
                    ))}
                  </Card>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: "#1B6DE0", margin: "20px 0 10px" }}>CARRIER PATTERNS</div>
                  {CARRIER_PATTERNS.map((cp, i) => (
                    <Card key={i} style={{ marginTop: i ? 14 : 0 }}>
                      <div style={{ fontSize: 15.5, fontWeight: 800, color: S.ink }}>{cp.title}</div>
                      <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.55, marginTop: 6 }}>Pattern: {cp.pattern}</div>
                      <Callout label="Answer" tone="green"><Bullets items={cp.answer} /></Callout>
                    </Card>
                  ))}
                </div>
              )}
              {resourcePage === "dodont" && (
                <div>
                  <Card style={{ borderTop: "3px solid #177245" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#177245", marginBottom: 6 }}>DO</div>
                    {INSURANCE_DO.map(([t, d], i) => (
                      <div key={i} style={{ padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: S.ink }}>{t}</div>
                        <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.5, marginTop: 3 }}>{d}</div>
                      </div>
                    ))}
                  </Card>
                  <Card style={{ marginTop: 14, borderTop: "3px solid #B42318" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#B42318", marginBottom: 6 }}>DON'T</div>
                    {INSURANCE_DONT.map(([t, d], i) => (
                      <div key={i} style={{ padding: "9px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: S.ink }}>{t}</div>
                        <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.5, marginTop: 3 }}>{d}</div>
                      </div>
                    ))}
                  </Card>
                </div>
              )}
              {resourcePage === "truck" && (
                <div>
                  <div style={{ fontSize: 13.5, color: S.sub, lineHeight: 1.55, marginBottom: 14 }}>
                    One-card summary for the field. Prints on a single page. Take it in the truck.
                  </div>
                  <Card>
                    <div style={{ fontSize: 16, fontWeight: 800, color: S.ink, marginBottom: 8 }}>Supreme one-page field card</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: S.ink, marginTop: 6 }}>The three levers for full replacement:</div>
                    <Bullets items={CHEAT_SHEET.levers.map(([a, b]) => `${a} — ${b}`)} />
                    <div style={{ fontSize: 14, fontWeight: 800, color: S.ink, marginTop: 14 }}>Code-required scope adjusters try to strip out:</div>
                    <Bullets items={CHEAT_SHEET.scope.map(([a, b]) => `${a} — ${b}`)} />
                    <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 14 }}>{CHEAT_SHEET.ol}</div>
                    <div style={{ fontSize: 14, color: S.ink, lineHeight: 1.6, marginTop: 12 }}>{CHEAT_SHEET.docs}</div>
                    <Callout label="The line you don't cross" tone="red">{CHEAT_SHEET.line.replace("The line you don't cross: ", "")}</Callout>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   REVIEW AUTOMATION SETTINGS
   ================================================================ */
function ReviewSettings({ settings, setSettings, jobs, onBack, brand }) {
  const sent = jobs.filter((j) => j.review.sent);
  const posted = jobs.filter((j) => j.review.posted);
  const set = (k) => (v) => setSettings({ ...settings, [k]: v });
  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} style={{
      width: 46, height: 27, borderRadius: 99, border: "none", cursor: "pointer",
      background: on ? "#1B6DE0" : "#D6D9DE", position: "relative", flexShrink: 0,
    }}>
      <span style={{ position: "absolute", top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: 99, background: "#fff", transition: "left .15s" }} />
    </button>
  );
  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <SubHeader title="Review automation" onBack={onBack} />
      <Card style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Automatic review requests</div>
            <div style={{ fontSize: 13, color: S.sub, marginTop: 3 }}>
              When a job moves to Job completed, send the Google review link.
            </div>
          </div>
          <Toggle on={settings.enabled} onClick={() => set("enabled")(!settings.enabled)} />
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Rules</CardTitle>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <div style={{ flex: 1, fontSize: 14 }}>Delay after completion</div>
          <input style={{ ...inputStyle, width: 70, textAlign: "right" }} value={settings.delayHours}
            inputMode="numeric" onChange={(e) => set("delayHours")(num(e.target.value))} />
          <span style={{ color: S.sub, fontSize: 13 }}>hours</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <div style={{ flex: 1, fontSize: 14 }}>One follow-up if no click, after</div>
          <input style={{ ...inputStyle, width: 70, textAlign: "right" }} value={settings.followUpDays}
            inputMode="numeric" onChange={(e) => set("followUpDays")(num(e.target.value))} />
          <span style={{ color: S.sub, fontSize: 13 }}>days</span>
        </div>
        <KV k="Send window (quiet hours respected)" v="9:00 AM – 8:00 PM local" />
        <KV k="Consent" v="SMS requires SMS consent; email requires email consent. No consent, no send." />
        <KV k="Opt-out" v="STOP in any text halts all future SMS to that client." />
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Message template</CardTitle>
        <textarea style={{ ...inputStyle, minHeight: 110 }} value={settings.template}
          onChange={(e) => set("template")(e.target.value)} />
        <div style={{ fontSize: 12, color: S.sub, marginTop: 8 }}>
          Variables: {"{first_name}"}, {"{company}"}, {"{review_link}"}. Review link: {brand.googleReviewLink}
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <CardTitle>Tracking</CardTitle>
        <KV k="Requests sent" v={String(sent.length)} />
        <KV k="Links clicked" v={String(jobs.filter((j) => j.review.clicked).length)} />
        <KV k="Reviews posted" v={String(posted.length)} strong />
        {posted.map((j) => (
          <div key={j.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "9px 0", borderTop: `1px solid ${S.line}` }}>
            <Star size={15} color="#D97706" fill="#D97706" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{j.name}</span>
            <span style={{ fontSize: 12, color: S.sub, marginLeft: "auto" }}>{j.assignee}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ================================================================
   BRANDING EDITOR + MORE MENU + INBOX
   ================================================================ */
function BrandingEditor({ brand, setBrand, onBack }) {
  const set = (k) => (e) => setBrand({ ...brand, [k]: e.target.value });
  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <SubHeader title="Company branding" onBack={onBack} />
      <Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: S.sub, marginBottom: 14 }}>
          One place for company identity. Login, documents, the client portal, and review messages all read from here —
          rebranding the app is editing this page.
        </div>
        <Field label="Company name"><input style={inputStyle} value={brand.company} onChange={set("company")} /></Field>
        <Field label="Short mark (logo block)"><input style={inputStyle} value={brand.short} onChange={set("short")} /></Field>
        <Field label="Slogan"><input style={inputStyle} value={brand.slogan} onChange={set("slogan")} /></Field>
        <Field label="Phone"><input style={inputStyle} value={brand.phone} onChange={set("phone")} /></Field>
        <Field label="Email"><input style={inputStyle} value={brand.email} onChange={set("email")} /></Field>
        <Field label="Address"><input style={inputStyle} value={brand.address} onChange={set("address")} /></Field>
        <Field label="Google review link"><input style={inputStyle} value={brand.googleReviewLink} onChange={set("googleReviewLink")} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Primary color">
            <input type="color" value={brand.primary} onChange={set("primary")} style={{ ...inputStyle, height: 46, padding: 4 }} />
          </Field>
          <Field label="Accent color">
            <input type="color" value={brand.accent} onChange={set("accent")} style={{ ...inputStyle, height: 46, padding: 4 }} />
          </Field>
        </div>
      </Card>
    </div>
  );
}

/* ================================================================
   TEAM & SEATS — admin adds users, each active seat is a login
   ================================================================ */
/* ================================================================
   COMPANY DOCUMENTS — company-wide file manager, not job files.
   ================================================================ */
function CompanyDocs({ docs, setDocs, currentUser, onBack, toast }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ name: "", cat: DOC_CATEGORIES[0], expires: "" });
  const fileRef = useRef(null);
  const canEdit = currentUser.role === "admin" || currentUser.role === "manager";

  const today = new Date().toISOString().slice(0, 10);
  const soon = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10);
  const expiring = docs.filter((d) => d.expires && d.expires <= soon);

  const list = docs.filter((d) => {
    if (cat !== "All" && d.cat !== cat) return false;
    if (q && !(d.name + d.cat).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.at.localeCompare(a.at));

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setF({ name: file.name, cat: f.cat, expires: "" });
    setAdding(true);
    e.target.value = "";
  };
  const save = () => {
    setDocs([...docs, {
      id: uid("d"), name: f.name.trim(), cat: f.cat, size: "—",
      at: today, by: currentUser.name, pinned: false, expires: f.expires || null,
    }]);
    setAdding(false); setF({ name: "", cat: DOC_CATEGORIES[0], expires: "" });
    toast("Document added");
  };

  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <input ref={fileRef} type="file" onChange={onFile} style={{ display: "none" }} />
      <SubHeader title="Documents" onBack={onBack}
        right={canEdit && <Btn small onClick={() => fileRef.current && fileRef.current.click()}><Upload size={14} /> Upload</Btn>} />

      {expiring.length > 0 && (
        <Card style={{ marginTop: 14, borderLeft: "3px solid #92600A" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#92600A", marginBottom: 6 }}>Expiring soon</div>
          {expiring.map((d) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0" }}>
              <span style={{ fontSize: 13, color: S.ink }}>{d.name}</span>
              <Chip tone={d.expires <= today ? "red" : "amber"}>{d.expires <= today ? "Expired" : d.expires}</Chip>
            </div>
          ))}
        </Card>
      )}

      <div style={{ marginTop: 14 }}>
        <input style={inputStyle} placeholder="Search documents" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
        {["All", ...DOC_CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{
            border: `1.5px solid ${cat === c ? "#1B6DE0" : S.line}`,
            background: cat === c ? "#EAF2FD" : "#fff", color: cat === c ? "#1B6DE0" : S.ink,
            borderRadius: 999, padding: "7px 13px", fontSize: 13, fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          }}>{c}</button>
        ))}
      </div>

      {list.map((d) => (
        <Card key={d.id} pad={15} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <FileText size={20} color="#1B6DE0" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: S.ink }}>{d.name}</div>
              <div style={{ fontSize: 12, color: S.sub, marginTop: 3 }}>
                {d.cat} · {d.size} · added {d.at} by {d.by.split(" ")[0]}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {d.pinned && <Chip tone="blue">Pinned</Chip>}
                {d.expires && <Chip tone={d.expires <= today ? "red" : d.expires <= soon ? "amber" : "gray"}>Expires {d.expires}</Chip>}
              </div>
            </div>
          </div>
          {canEdit && (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn kind="ghost" small style={{ flex: 1 }}
                onClick={() => setDocs(docs.map((x) => (x.id === d.id ? { ...x, pinned: !x.pinned } : x)))}>
                {d.pinned ? "Unpin" : "Pin"}
              </Btn>
              <Btn kind="danger" small onClick={() => { setDocs(docs.filter((x) => x.id !== d.id)); toast("Document removed"); }}>
                <Trash2 size={13} />
              </Btn>
            </div>
          )}
        </Card>
      ))}
      {list.length === 0 && <Card style={{ marginTop: 10 }}><div style={{ fontSize: 14, color: S.sub }}>No documents here yet.</div></Card>}

      <Sheet open={adding} onClose={() => setAdding(false)} title="Add document"
        footer={<Btn style={{ width: "100%" }} disabled={!f.name.trim()} onClick={save}>Save document</Btn>}>
        <Field label="File name"><input style={inputStyle} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Category">
          <select style={selStyle} value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>
            {DOC_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Expiration date" hint="Optional. Certificates and licenses get an expiry warning 60 days out.">
          <input style={inputStyle} type="date" value={f.expires} onChange={(e) => setF({ ...f, expires: e.target.value })} />
        </Field>
      </Sheet>
    </div>
  );
}

/* ================================================================
   MATERIAL PRICE LIST — CSV import, margin visible per line.
   ================================================================ */
function PriceListManager({ list, setList, currentUser, onBack, toast }) {
  const [q, setQ] = useState("");
  const [importing, setImporting] = useState(null);
  const fileRef = useRef(null);
  const canEdit = currentUser.role === "admin" || currentUser.role === "manager";

  const parseCsv = (text) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (!lines.length) return { rows: [], error: "File is empty." };
    const split = (l) => {
      const out = []; let cur = "", inQ = false;
      for (let i = 0; i < l.length; i++) {
        const ch = l[i];
        if (ch === '"') { if (inQ && l[i + 1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
        else if (ch === "," && !inQ) { out.push(cur); cur = ""; }
        else cur += ch;
      }
      out.push(cur); return out.map((x) => x.trim());
    };
    const head = split(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
    const idx = (names) => { for (const n of names) { const k = head.indexOf(n); if (k >= 0) return k; } return -1; };
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
        category: cCat >= 0 ? c[cCat] : "Uncategorized",
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

  const filtered = list.filter((r) =>
    !q || (r.item + r.sku + r.supplier + r.category).toLowerCase().includes(q.toLowerCase()));
  const margin = (r) => (r.price > 0 ? ((r.price - r.cost) / r.price) * 100 : 0);

  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} style={{ display: "none" }} />
      <SubHeader title="Price list" onBack={onBack}
        right={canEdit && <Btn small onClick={() => fileRef.current && fileRef.current.click()}><Upload size={14} /> Import CSV</Btn>} />

      <Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.55 }}>
          Import a supplier price list as CSV. The header row is matched loosely — <b>item</b> is required, and
          <b> sku, unit, cost, price, supplier, category</b> are picked up if present. Column order doesn't matter.
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <div><div style={{ fontSize: 20, fontWeight: 800 }}>{list.length}</div><div style={{ fontSize: 12, color: S.sub }}>Line items</div></div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {list.length ? pct1(list.reduce((s2, r) => s2 + margin(r), 0) / list.length) : "—"}
            </div>
            <div style={{ fontSize: 12, color: S.sub }}>Average margin</div>
          </div>
        </div>
        {list.length > 0 && (
          <Btn kind="ghost" small style={{ marginTop: 12 }} onClick={() => {
            downloadCsv("price-list.csv", [
              ["sku", "item", "unit", "cost", "price", "supplier", "category"],
              ...list.map((r) => [r.sku, r.item, r.unit, r.cost, r.price, r.supplier, r.category]),
            ]);
            toast("Price list exported");
          }}><Download size={13} /> Export CSV</Btn>
        )}
      </Card>

      <div style={{ marginTop: 14 }}>
        <input style={inputStyle} placeholder="Search items, SKU, supplier" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {filtered.map((r) => (
        <Card key={r.id} pad={14} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: S.ink }}>{r.item}</div>
              <div style={{ fontSize: 12, color: S.sub, marginTop: 3 }}>
                {[r.sku, r.supplier, r.category].filter(Boolean).join(" · ")}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{money(r.price)}</div>
              <div style={{ fontSize: 11.5, color: S.sub }}>per {r.unit}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 9, paddingTop: 9, borderTop: `1px solid ${S.line}` }}>
            <span style={{ fontSize: 12, color: S.sub }}>Cost <b style={{ color: S.ink }}>{money(r.cost)}</b></span>
            <span style={{ fontSize: 12, color: S.sub }}>Margin <b style={{ color: margin(r) < 25 ? "#B42318" : "#177245" }}>{pct1(margin(r))}</b></span>
          </div>
        </Card>
      ))}
      {filtered.length === 0 && <Card style={{ marginTop: 10 }}><div style={{ fontSize: 14, color: S.sub }}>No items match.</div></Card>}

      <Sheet open={!!importing} onClose={() => setImporting(null)} title="Import price list"
        footer={importing && !importing.error && (
          <div style={{ display: "flex", gap: 10 }}>
            <Btn kind="ghost" style={{ flex: 1 }} onClick={() => { setList([...list, ...importing.rows]); setImporting(null); toast(`${importing.rows.length} items appended`); }}>
              Append
            </Btn>
            <Btn style={{ flex: 1 }} onClick={() => { setList(importing.rows); setImporting(null); toast(`Price list replaced — ${importing.rows.length} items`); }}>
              Replace list
            </Btn>
          </div>
        )}>
        {importing && importing.error && <Callout label="Could not read that file" tone="red">{importing.error}</Callout>}
        {importing && !importing.error && (
          <>
            <div style={{ fontSize: 14, color: S.ink, marginBottom: 4 }}>
              <b>{importing.fileName}</b>
            </div>
            <div style={{ fontSize: 13, color: S.sub, marginBottom: 12 }}>
              {importing.rows.length} rows parsed. First five shown — check the columns landed in the right place before importing.
            </div>
            {importing.rows.slice(0, 5).map((r) => (
              <div key={r.id} style={{ padding: "9px 0", borderTop: `1px solid ${S.line}` }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{r.item}</div>
                <div style={{ fontSize: 12, color: S.sub, marginTop: 2 }}>
                  {r.sku && `${r.sku} · `}cost {money(r.cost)} · price {money(r.price)} · per {r.unit}
                </div>
              </div>
            ))}
          </>
        )}
      </Sheet>
    </div>
  );
}

/* ================================================================
   TEMPLATE MANAGER — email + SMS, customer + crew, with merge fields
   ================================================================ */
function TemplateManager({ templates, setTemplates, currentUser, onBack, toast, brand }) {
  const [kind, setKind] = useState("email");
  const [aud, setAud] = useState("All");
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState({ kind: "email", audience: "Customer", name: "", subject: "", body: "" });
  const fileRef = useRef(null);
  const bodyRef = useRef(null);
  const canEdit = currentUser.role === "admin" || currentUser.role === "manager";

  const list = templates.filter((t) => t.kind === kind && (aud === "All" || t.audience === aud));
  const open = (t) => { setEditing(t || "new"); setF(t ? { ...t } : { kind, audience: aud === "All" ? "Customer" : aud, name: "", subject: "", body: "" }); };
  const save = () => {
    if (editing === "new") setTemplates([...templates, { ...f, id: uid("t") }]);
    else setTemplates(templates.map((t) => (t.id === editing.id ? { ...t, ...f } : t)));
    setEditing(null); toast("Template saved");
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
      if (m) { subject = m[1].trim(); body = lines.slice(1).join("\n").trim(); }
      setEditing("new");
      setF({ kind, audience: "Customer", name, subject, body });
      toast("Template loaded — review and save");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <input ref={fileRef} type="file" accept=".txt,.md,.html,text/plain" onChange={onFile} style={{ display: "none" }} />
      <SubHeader title="Message templates" onBack={onBack}
        right={canEdit && <Btn small onClick={() => open(null)}><Plus size={14} /> New</Btn>} />

      <Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.55 }}>
          Templates fill themselves in from the job when you send. Every SMS template to a customer must keep the
          STOP opt-out line — it's a legal requirement, not a style choice.
        </div>
        {canEdit && (
          <Btn kind="ghost" small style={{ marginTop: 12 }} onClick={() => fileRef.current && fileRef.current.click()}>
            <Upload size={13} /> Upload a .txt template
          </Btn>
        )}
      </Card>

      <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
        {[["email", "Email"], ["sms", "Text"]].map(([k, l]) => (
          <button key={k} onClick={() => setKind(k)} style={{
            flex: 1, border: `1.5px solid ${kind === k ? "#1B6DE0" : S.line}`,
            background: kind === k ? "#EAF2FD" : "#fff", color: kind === k ? "#1B6DE0" : S.ink,
            borderRadius: 10, padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {["All", "Customer", "Crew"].map((a) => (
          <button key={a} onClick={() => setAud(a)} style={{
            border: `1.5px solid ${aud === a ? "#1B6DE0" : S.line}`,
            background: aud === a ? "#EAF2FD" : "#fff", color: aud === a ? "#1B6DE0" : S.ink,
            borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>{a}</button>
        ))}
      </div>

      {list.map((t) => (
        <Card key={t.id} pad={15} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: S.ink }}>{t.name}</div>
              {t.subject && <div style={{ fontSize: 12.5, color: S.sub, marginTop: 3 }}>{t.subject}</div>}
            </div>
            <Chip tone={t.audience === "Crew" ? "slate" : "blue"}>{t.audience}</Chip>
          </div>
          <div style={{
            fontSize: 12.5, color: S.sub, marginTop: 9, lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{t.body}</div>
          {canEdit && (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn kind="ghost" small style={{ flex: 1 }} onClick={() => open(t)}><Pencil size={13} /> Edit</Btn>
              <Btn kind="danger" small onClick={() => { setTemplates(templates.filter((x) => x.id !== t.id)); toast("Template deleted"); }}>
                <Trash2 size={13} />
              </Btn>
            </div>
          )}
        </Card>
      ))}
      {list.length === 0 && <Card style={{ marginTop: 10 }}><div style={{ fontSize: 14, color: S.sub }}>No templates in this group yet.</div></Card>}

      <Sheet open={!!editing} onClose={() => setEditing(null)} wide
        title={editing === "new" ? "New template" : "Edit template"}
        footer={<Btn style={{ width: "100%" }} disabled={!f.name.trim() || !f.body.trim()} onClick={save}>Save template</Btn>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Type">
            <select style={selStyle} value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>
              <option value="email">Email</option><option value="sms">Text</option>
            </select>
          </Field>
          <Field label="Audience">
            <select style={selStyle} value={f.audience} onChange={(e) => setF({ ...f, audience: e.target.value })}>
              <option>Customer</option><option>Crew</option>
            </select>
          </Field>
        </div>
        <Field label="Template name"><input style={inputStyle} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        {f.kind === "email" && (
          <Field label="Subject"><input style={inputStyle} value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} /></Field>
        )}
        <Field label="Message">
          <textarea ref={bodyRef} style={{ ...inputStyle, minHeight: 200, resize: "vertical", fontFamily: "inherit" }}
            value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
        </Field>
        {f.kind === "sms" && f.audience === "Customer" && !/stop/i.test(f.body) && (
          <Callout label="Missing opt-out" tone="red">
            Customer texts need a visible opt-out. Add "Reply STOP to opt out." before saving.
          </Callout>
        )}
        {f.kind === "sms" && (
          <div style={{ fontSize: 12, color: S.sub, marginBottom: 12 }}>
            {f.body.length} characters — texts over 160 send as multiple segments.
          </div>
        )}
        <div style={{ fontSize: 13, fontWeight: 800, color: "#28373E", marginBottom: 8 }}>INSERT A MERGE FIELD</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {MERGE_FIELDS.map(([token, label]) => (
            <button key={token} type="button" title={label} onClick={() => insertField(token)} style={{
              border: `1px solid ${S.line}`, background: "#fff", borderRadius: 999,
              padding: "6px 11px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#1B6DE0",
            }}>{token}</button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

/* ================================================================
   CREWS — the directory work orders are dispatched to.
   ================================================================ */
function CrewManager({ crews, setCrews, currentUser, jobs, onBack, toast }) {
  const [editing, setEditing] = useState(null);
  const blank = { name: "", contact: "", phone: "", email: "", trades: [], active: true };
  const [f, setF] = useState(blank);
  const canEdit = currentUser.role === "admin" || currentUser.role === "manager";
  const TRADES = ["Roofing", "Siding", "Gutters", "Metal", "Flashing", "Windows", "Carpentry"];
  const open = (c) => { setEditing(c || "new"); setF(c ? { ...c } : blank); };
  const save = () => {
    if (editing === "new") setCrews([...crews, { ...f, id: uid("c") }]);
    else setCrews(crews.map((c) => (c.id === editing.id ? { ...c, ...f } : c)));
    setEditing(null); toast("Crew saved");
  };
  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <SubHeader title="Crews" onBack={onBack}
        right={canEdit && <Btn small onClick={() => open(null)}><Plus size={14} /> Add crew</Btn>} />
      {crews.map((c) => {
        const assigned = jobs.filter((j) => j.crewId === c.id).length;
        return (
          <Card key={c.id} pad={15} style={{ marginTop: 10, opacity: c.active ? 1 : 0.6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: S.sub, marginTop: 2 }}>{c.contact}</div>
              </div>
              {!c.active && <Chip tone="gray">Inactive</Chip>}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 9, flexWrap: "wrap", fontSize: 12.5, color: S.sub }}>
              {c.phone && <span style={{ display: "flex", gap: 5, alignItems: "center" }}><Phone size={12} /> {c.phone}</span>}
              {c.email && <span style={{ display: "flex", gap: 5, alignItems: "center" }}><Mail size={12} /> {c.email}</span>}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
              {c.trades.map((t) => <Chip key={t} tone="gray">{t}</Chip>)}
              <Chip tone="blue">{assigned} job{assigned === 1 ? "" : "s"}</Chip>
            </div>
            {canEdit && (
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Btn kind="ghost" small style={{ flex: 1 }} onClick={() => open(c)}><Pencil size={13} /> Edit</Btn>
                <Btn kind="ghost" small style={{ flex: 1 }}
                  onClick={() => setCrews(crews.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)))}>
                  {c.active ? "Deactivate" : "Reactivate"}
                </Btn>
              </div>
            )}
          </Card>
        );
      })}
      <Sheet open={!!editing} onClose={() => setEditing(null)} title={editing === "new" ? "Add crew" : "Edit crew"}
        footer={<Btn style={{ width: "100%" }} disabled={!f.name.trim()} onClick={save}>Save crew</Btn>}>
        <Field label="Crew / company name *"><input style={inputStyle} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Primary contact"><input style={inputStyle} value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Phone"><input style={inputStyle} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <Field label="Email"><input style={inputStyle} type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        </div>
        <Field label="Trades">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {TRADES.map((t) => {
              const on = f.trades.includes(t);
              return (
                <button key={t} type="button" onClick={() => setF({ ...f, trades: on ? f.trades.filter((x) => x !== t) : [...f.trades, t] })}
                  style={{
                    border: `1.5px solid ${on ? "#1B6DE0" : S.line}`, background: on ? "#EAF2FD" : "#fff",
                    color: on ? "#1B6DE0" : S.ink, borderRadius: 999, padding: "7px 13px",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>{on ? "✓ " : ""}{t}</button>
              );
            })}
          </div>
        </Field>
      </Sheet>
    </div>
  );
}

/* ================================================================
   INTEGRATIONS — Gmail / SMS provider connection.
   Sending real mail requires OAuth against a backend that holds the
   client secret; the browser cannot hold it safely. This screen owns
   the connection state and is honest about what isn't live yet.
   ================================================================ */
function Integrations({ integrations, setIntegrations, currentUser, onBack, toast }) {
  const isAdmin = currentUser.role === "admin";
  const g = integrations.gmail;
  const sms = integrations.sms;
  const [connecting, setConnecting] = useState(null);
  const [addr, setAddr] = useState("");

  if (!isAdmin) {
    return (
      <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
        <SubHeader title="Integrations" onBack={onBack} />
        <Card style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Lock size={18} color={S.sub} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 14, color: S.sub, lineHeight: 1.55 }}>
              Connected accounts are managed by the office. Messages you send go out from the company account.
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <SubHeader title="Integrations" onBack={onBack} />

      <Card style={{ marginTop: 14 }}>
        <CardTitle right={g.connected ? <Chip tone="green">Connected</Chip> : <Chip tone="gray">Not connected</Chip>}>
          Gmail
        </CardTitle>
        {g.connected ? (
          <>
            <KV k="Account" v={g.email} />
            <KV k="Connected" v={g.at} />
            <KV k="Sends as" v={g.sendAs || g.email} />
            <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.5, marginTop: 8 }}>
              Emails sent from a job go out through this account and land in its Sent folder, so replies come back to
              the same inbox the team already watches.
            </div>
            <Btn kind="danger" small style={{ marginTop: 12 }}
              onClick={() => { setIntegrations({ ...integrations, gmail: { connected: false, email: "", at: null } }); toast("Gmail disconnected"); }}>
              Disconnect
            </Btn>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13.5, color: S.ink, lineHeight: 1.55 }}>
              Connect a Google Workspace account so email goes out under your own domain rather than a generic sender.
              Replies land in that mailbox and threads stay intact.
            </div>
            <Callout label="What this needs to go live">
              Google OAuth requires a client secret, which cannot live in the browser. Create a Google Cloud project,
              enable the Gmail API, add an OAuth consent screen, then run the token exchange in a Supabase Edge
              Function. Until that's deployed, connecting here records the account and composes the message — it does
              not put mail on the wire.
            </Callout>
            <Btn style={{ width: "100%", marginTop: 12 }} onClick={() => setConnecting("gmail")}>
              <Mail size={15} /> Connect Gmail
            </Btn>
          </>
        )}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <CardTitle right={sms.connected ? <Chip tone="green">Connected</Chip> : <Chip tone="gray">Not connected</Chip>}>
          Text messaging
        </CardTitle>
        {sms.connected ? (
          <>
            <KV k="Provider" v={sms.provider} />
            <KV k="Sending number" v={sms.number} />
            <Btn kind="danger" small style={{ marginTop: 12 }}
              onClick={() => { setIntegrations({ ...integrations, sms: { connected: false, provider: "", number: "" } }); toast("SMS disconnected"); }}>
              Disconnect
            </Btn>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13.5, color: S.ink, lineHeight: 1.55 }}>
              A provider account (Twilio or similar) with a dedicated number. Consent is already tracked per customer,
              and sends are blocked without it.
            </div>
            <Callout label="Before your first send">
              US carriers require 10DLC brand and campaign registration for business texting. Unregistered traffic gets
              filtered or blocked outright. Registration takes a few days — start it before you need it.
            </Callout>
            <Btn style={{ width: "100%", marginTop: 12 }} onClick={() => setConnecting("sms")}>
              <MessageCircle size={15} /> Connect SMS provider
            </Btn>
          </>
        )}
      </Card>

      <Sheet open={!!connecting} onClose={() => { setConnecting(null); setAddr(""); }}
        title={connecting === "gmail" ? "Connect Gmail" : "Connect SMS"}
        footer={
          <Btn style={{ width: "100%" }} disabled={!addr.trim()} onClick={() => {
            if (connecting === "gmail") {
              setIntegrations({ ...integrations, gmail: { connected: true, email: addr.trim(), at: new Date().toISOString().slice(0, 10), sendAs: addr.trim() } });
              toast("Gmail account recorded");
            } else {
              setIntegrations({ ...integrations, sms: { connected: true, provider: "Twilio", number: addr.trim() } });
              toast("SMS number recorded");
            }
            setConnecting(null); setAddr("");
          }}>Save connection</Btn>
        }>
        {connecting === "gmail" ? (
          <>
            <Field label="Google Workspace address" hint="The mailbox company email should send from and receive replies to.">
              <input style={inputStyle} type="email" value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="office@supremebuildinggroup.com" />
            </Field>
            <Callout label="This records the account only">
              The real OAuth handshake runs server-side. This saves which account to use so the composer and templates
              are configured and ready the moment the backend function is deployed.
            </Callout>
          </>
        ) : (
          <>
            <Field label="Sending number" hint="The number customers will see and can reply to.">
              <input style={inputStyle} value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="(847) 555-0100" />
            </Field>
            <Callout label="Registration required">
              This number must be 10DLC registered to your business before carriers will deliver to it reliably.
            </Callout>
          </>
        )}
      </Sheet>
    </div>
  );
}

/* ================================================================
   JOB IMPORT — bring an existing pipeline in from a CSV export.
   Maps the Roofr job report columns; unmatched stages fall back to
   the first stage rather than dropping the row.
   ================================================================ */
function JobImport({ jobs, setJobs, stages, users, onBack, toast, currentUser }) {
  const [parsed, setParsed] = useState(null);
  const fileRef = useRef(null);
  const isAdmin = currentUser.role === "admin";

  const splitLine = (l) => {
    const out = []; let cur = "", inQ = false;
    for (let i2 = 0; i2 < l.length; i2++) {
      const ch = l[i2];
      if (ch === '"') { if (inQ && l[i2 + 1] === '"') { cur += '"'; i2++; } else inQ = !inQ; }
      else if (ch === "," && !inQ) { out.push(cur); cur = ""; }
      else cur += ch;
    }
    out.push(cur); return out.map((x) => x.trim());
  };

  const matchStage = (stageName, category) => {
    const n = (stageName || "").toLowerCase();
    const hit = stages.find((st) => st.name.toLowerCase() === n)
      || stages.find((st) => n && st.name.toLowerCase().includes(n.split(" ")[0]));
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
    const col = (names) => { for (const n of names) { const k = head.indexOf(n); if (k >= 0) return k; } return -1; };
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
        name: (cName >= 0 && c[cName]) ? c[cName] : "(no customer name)",
        address: addr,
        zip,
        state: j ? j.state : "",
        assignee: known.includes(owner) ? owner : (known[0] || ""),
        ownerRaw: owner,
        value: cValue >= 0 ? num(String(c[cValue]).replace(/[$,]/g, "")) : 0,
        stageId: matchStage(cStage >= 0 ? c[cStage] : "", cCat >= 0 ? c[cCat] : ""),
        leadSource: cSource >= 0 ? c[cSource] : "",
        email: cEmail >= 0 ? c[cEmail] : "",
        phone: cPhone >= 0 ? c[cPhone] : "",
        created: cCreated >= 0 ? c[cCreated] : "",
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
    const rows = skipDupes
      ? parsed.rows.filter((r) => !jobs.some((j) => j.address.toLowerCase() === r.address.toLowerCase()))
      : parsed.rows;
    const built = rows.map((r) => ({
      id: uid("j"), name: r.name, address: r.address, zip: r.zip, state: r.state,
      lat: null, lng: null,
      value: r.value, stageId: r.stageId, assignee: r.assignee, leadSource: r.leadSource,
      daysInStage: 0, updated: "imported", claimType: "Unknown", schedDate: null,
      phone: r.phone, email: r.email,
      consent: { sms: { granted: false, at: null, source: null }, email: { granted: false, at: null, source: null } },
      insurance: null, checklist: { ...BLANK_CHECKLIST }, measurements: { ...BLANK_MEASURE },
      estimate: mkEstimate(), contract: mkContract(),
      photos: [], tasks: [], files: [], payments: [], messages: [], crewId: null, workOrder: null,
      fin: { materials: [], labor: [], other: [], commissionRate: 60, structure: "grossProfit", overheadPct: 10, reimbursements: [] },
      portal: { estimate: false, contract: false, photos: false, invoice: false },
      review: { sent: false, clicked: false, posted: false },
    }));
    setJobs([...jobs, ...built]);
    setParsed(null);
    toast(`${built.length} jobs imported`);
  };

  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} style={{ display: "none" }} />
      <SubHeader title="Import jobs" onBack={onBack} />
      <Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13.5, color: S.ink, lineHeight: 1.55 }}>
          Bring an existing pipeline in from a CSV export. The header row is matched loosely — a
          <b> job address</b> column is required; customer name, zip, job owner, job value, stage, lead source,
          email, and phone are picked up when present.
        </div>
        <Callout label="What imports and what doesn't">
          Contact details, stage, value, and lead source come across. Consent does not — imported customers start with
          no SMS or email consent on file, because consent has to be collected, not inherited. Photos, estimates, and
          financials also stay behind; those live in whatever system produced the export.
        </Callout>
        {isAdmin && (
          <Btn style={{ width: "100%", marginTop: 12 }} onClick={() => fileRef.current && fileRef.current.click()}>
            <Upload size={15} /> Choose CSV
          </Btn>
        )}
        {!isAdmin && <div style={{ fontSize: 13, color: S.sub, marginTop: 12 }}>Importing is admin-only.</div>}
      </Card>

      <Sheet open={!!parsed} onClose={() => setParsed(null)} title="Review import"
        footer={parsed && !parsed.error && (
          <div style={{ display: "flex", gap: 10 }}>
            {parsed.dupes > 0 && (
              <Btn kind="ghost" style={{ flex: 1 }} onClick={() => doImport(true)}>Skip {parsed.dupes} dupes</Btn>
            )}
            <Btn style={{ flex: 1 }} onClick={() => doImport(false)}>Import all {parsed.rows.length}</Btn>
          </div>
        )}>
        {parsed && parsed.error && <Callout label="Could not read that file" tone="red">{parsed.error}</Callout>}
        {parsed && !parsed.error && (
          <>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{parsed.fileName}</div>
            <div style={{ fontSize: 13, color: S.sub, marginBottom: 12 }}>
              {parsed.rows.length} rows parsed{parsed.dupes > 0 ? `, ${parsed.dupes} match an address already in the system` : ""}.
            </div>
            {parsed.unknownOwners.length > 0 && (
              <Callout label="Unrecognized job owners">
                {parsed.unknownOwners.join(", ")} {parsed.unknownOwners.length === 1 ? "does" : "do"} not match a seat.
                Those jobs will be assigned to {users[0] ? users[0].name : "the first seat"} — add the seats first if
                you want the assignments to land correctly.
              </Callout>
            )}
            <div style={{ fontSize: 12.5, fontWeight: 700, color: S.sub, margin: "14px 0 6px" }}>FIRST FIVE ROWS</div>
            {parsed.rows.slice(0, 5).map((r, i2) => (
              <div key={i2} style={{ padding: "9px 0", borderTop: `1px solid ${S.line}` }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: S.sub, marginTop: 2 }}>{r.address}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                  <Chip tone="gray">{(stages.find((st) => st.id === r.stageId) || {}).name}</Chip>
                  {r.value > 0 && <Chip tone="blue">{money(r.value)}</Chip>}
                  <Chip tone="gray">{r.assignee.split(" ")[0]}</Chip>
                </div>
              </div>
            ))}
          </>
        )}
      </Sheet>
    </div>
  );
}

function TeamManager({ users, setUsers, currentUser, jobs, onBack, toast, brand }) {
  const [editing, setEditing] = useState(null); // user object or "new"
  const isAdmin = canManageSeats(currentUser);
  const blank = { name: "", email: "", phone: "", role: "rep", title: "Sales Rep", commissionRate: 60, active: true };
  const [f, setF] = useState(blank);
  const open = (u) => { setEditing(u || "new"); setF(u ? { ...u } : blank); };
  const set = (k) => (e) => {
    const v = e && e.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e;
    setF((p) => ({ ...p, [k]: v }));
  };
  const emailTaken = users.some((u) => u.email.toLowerCase() === f.email.trim().toLowerCase() && u.id !== (editing !== "new" && editing ? editing.id : null));
  const valid = f.name.trim() && /\S+@\S+\.\S+/.test(f.email.trim()) && !emailTaken;

  const [saving, setSaving] = useState(false);
  const [seatErr, setSeatErr] = useState("");

  const save = async () => {
    const auth = AUTH();
    setSeatErr(""); setSaving(true);
    try {
      if (editing === "new") {
        if (auth) {
          await auth.inviteSeat({
            name: f.name.trim(), email: f.email.trim(), role: f.role,
            title: f.title, commission_rate: f.commissionRate,
          });
          const all = await auth.listProfiles();
          setUsers(all.map(fromProfile));
          toast(`Invite sent to ${f.email.trim()}`);
        } else {
          setUsers([...users, { ...f, id: uid("u"), email: f.email.trim(), name: f.name.trim(), addedAt: new Date().toISOString().slice(0, 10) }]);
          toast("Seat created (demo mode — no invite sent)");
        }
      } else {
        const next = { ...editing, ...f, name: f.name.trim(), email: f.email.trim() };
        if (auth) await auth.updateProfile(editing.id, toProfile(next));
        setUsers(users.map((u) => (u.id === editing.id ? next : u)));
        toast("Seat updated");
      }
      setEditing(null);
    } catch (e) {
      setSeatErr(e && e.message ? e.message : "Could not save the seat.");
    }
    setSaving(false);
  };

  const toggleActive = async (u) => {
    const auth = AUTH();
    const next = { ...u, active: !u.active };
    try {
      if (auth) await auth.updateProfile(u.id, toProfile(next));
      setUsers(users.map((x) => (x.id === u.id ? next : x)));
      toast(u.active ? `${u.name} deactivated — login disabled` : `${u.name} reactivated`);
    } catch (e) {
      toast(e && e.message ? e.message : "Could not update the seat.");
    }
  };
  const remove = (u) => {
    const assigned = jobs.filter((j) => j.assignee === u.name).length;
    if (assigned > 0) { toast(`${u.name} has ${assigned} assigned job${assigned === 1 ? "" : "s"} — reassign first`); return; }
    setUsers(users.filter((x) => x.id !== u.id));
    toast("Seat removed");
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
        <SubHeader title="Team" onBack={onBack} />
        <Card style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Lock size={18} color={S.sub} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 14, color: S.sub, lineHeight: 1.55 }}>
              Seat management is admin-only. Ask the office to add, change, or deactivate a login.
            </div>
          </div>
        </Card>
        <Card style={{ marginTop: 12 }}>
          <CardTitle>Who's on the team</CardTitle>
          {users.filter((u) => u.active).map((u, i) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i ? `1px solid ${S.line}` : "none" }}>
              <span style={{ width: 34, height: 34, borderRadius: 999, background: "#EEF1F4", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, color: S.sub }}>
                {u.name.split(" ").map((p) => p[0]).join("")}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: S.sub }}>{u.title}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <SubHeader title="Team & seats" onBack={onBack}
        right={<Btn small onClick={() => open(null)}><Plus size={14} /> Add seat</Btn>} />
      <Card style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: S.sub, lineHeight: 1.55 }}>
          Every active seat is a login for {brand.company}. Adding a seat emails an invite to set a password.
          Deactivating keeps the person's job history intact but blocks sign-in immediately.
          {!liveAuth() && " Demo mode — no backend connected, so invites are not actually sent."}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <div><div style={{ fontSize: 20, fontWeight: 800 }}>{users.filter((u) => u.active).length}</div><div style={{ fontSize: 12, color: S.sub }}>Active seats</div></div>
          <div><div style={{ fontSize: 20, fontWeight: 800 }}>{users.filter((u) => !u.active).length}</div><div style={{ fontSize: 12, color: S.sub }}>Deactivated</div></div>
        </div>
      </Card>

      {users.map((u) => {
        const assigned = jobs.filter((j) => j.assignee === u.name).length;
        const role = ROLES.find((r) => r.id === u.role);
        return (
          <Card key={u.id} pad={16} style={{ marginTop: 10, opacity: u.active ? 1 : 0.6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                width: 40, height: 40, borderRadius: 999, flexShrink: 0,
                background: u.role === "admin" ? "#28373E" : "#EAF2FD",
                color: u.role === "admin" ? "#fff" : "#1B6DE0",
                display: "grid", placeItems: "center", fontSize: 13, fontWeight: 800,
              }}>{u.name.split(" ").map((p) => p[0]).join("")}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{u.name}</div>
                <div style={{ fontSize: 12.5, color: S.sub, overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</div>
              </div>
              {!u.active && <Chip tone="gray">Disabled</Chip>}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              <Chip tone={u.role === "admin" ? "slate" : "blue"}>{role ? role.label : u.role}</Chip>
              {canSeeMoney(u) && u.role !== "admin" && <Chip tone="gray">{u.commissionRate}% rate</Chip>}
              <Chip tone="gray">{assigned} job{assigned === 1 ? "" : "s"}</Chip>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn kind="ghost" small style={{ flex: 1 }} onClick={() => open(u)}><Pencil size={13} /> Edit</Btn>
              <Btn kind="ghost" small style={{ flex: 1 }} onClick={() => toggleActive(u)}>
                {u.active ? "Deactivate" : "Reactivate"}
              </Btn>
              {u.id !== currentUser.id && (
                <Btn kind="danger" small onClick={() => remove(u)}><Trash2 size={13} /></Btn>
              )}
            </div>
          </Card>
        );
      })}

      <Sheet open={!!editing} onClose={() => setEditing(null)}
        title={editing === "new" ? "Add a seat" : "Edit seat"}
        footer={
          <div style={{ display: "flex", gap: 10 }}>
            <Btn kind="ghost" style={{ flex: 1 }} onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn style={{ flex: 2 }} disabled={!valid || saving} onClick={save}>
              {saving ? "Saving…" : editing === "new" ? "Create seat & send invite" : "Save changes"}
            </Btn>
          </div>
        }>
        {seatErr && <Callout label="Could not save" tone="red">{seatErr}</Callout>}
        <Field label="Full name *"><input style={inputStyle} value={f.name} onChange={set("name")} /></Field>
        <Field label="Work email *" hint={emailTaken ? "That email already has a seat." : "This is their login. An invite to set a password goes here."}>
          <input style={{ ...inputStyle, borderColor: emailTaken ? "#B42318" : S.line }} type="email" value={f.email} onChange={set("email")} />
        </Field>
        <Field label="Mobile"><input style={inputStyle} value={f.phone} onChange={set("phone")} /></Field>
        <Field label="Role">
          <select style={selStyle} value={f.role} onChange={(e) => {
            const r = ROLES.find((x) => x.id === e.target.value);
            setF((p) => ({ ...p, role: r.id, title: r.label }));
          }}>
            {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </Field>
        <div style={{ background: "#EAF2FD", borderRadius: 10, padding: "11px 13px", fontSize: 13, color: "#28373E", marginBottom: 14, lineHeight: 1.5 }}>
          {(ROLES.find((r) => r.id === f.role) || {}).blurb}
        </div>
        <Field label="Job title (shown in the app)"><input style={inputStyle} value={f.title} onChange={set("title")} /></Field>
        {f.role !== "crew" && (
          <Field label="Default commission rate (%)" hint="Starting rate on new jobs. Can be changed per job by an admin.">
            <input style={inputStyle} inputMode="decimal" value={f.commissionRate}
              onChange={(e) => setF((p) => ({ ...p, commissionRate: num(e.target.value) }))} />
          </Field>
        )}
        <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
          <input type="checkbox" checked={f.active} onChange={set("active")} style={{ width: 18, height: 18 }} />
          Seat active (can sign in)
        </label>
      </Sheet>
    </div>
  );
}

function MoreMenu({ onNav, onLogout, brand, currentUser }) {
  const items = [
    ["insurance", Shield, "Insurance", "Clients, supplements, code lookup"],
    ["performance", PieChart, "Performance", "Rep scoreboard & funnel"],
    ["calendar", CalIcon, "Calendar", "Schedule & material drops"],
    ["contacts", Users, "Contacts", "Every client, with consent status"],
    ["team", HardHat, "Team & seats", canManageSeats(currentUser) ? "Add users, roles, logins" : "Who's on the team"],
    ["crews", Wrench, "Crews", "Dispatch directory for work orders"],
    ["documents", FileText, "Documents", "Contracts, COIs, licenses, warranties"],
    ["pricelist", Package, "Price list", "Material costs and margins — CSV import"],
    ["templates", ScrollText, "Message templates", "Email and text, customer and crew"],
    ["integrations", Share2, "Integrations", "Gmail and text messaging"],
    ["import", Upload, "Import jobs", "Bring a pipeline in from CSV"],
    ["reviews", Star, "Review automation", "Google review requests"],
    ["branding", Settings, "Company branding", "Name, colors, review link"],
  ];
  return (
    <div style={{ padding: "20px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: S.ink, marginBottom: 4 }}>More</div>
      <div style={{ fontSize: 13, color: S.sub, marginBottom: 4 }}>{brand.company}</div>
      {currentUser && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: S.ink }}>{currentUser.name}</span>
          <Chip tone={currentUser.role === "admin" ? "slate" : "blue"}>{currentUser.title}</Chip>
        </div>
      )}
      {items.map(([id, Icon, label, sub]) => (
        <Card key={id} pad={16} style={{ marginBottom: 10, cursor: "pointer" }}>
          <button onClick={() => onNav(id)} style={{
            display: "flex", alignItems: "center", gap: 14, width: "100%",
            border: "none", background: "none", cursor: "pointer", textAlign: "left", padding: 0,
          }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: "#EAF2FD", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon size={19} color="#1B6DE0" />
            </span>
            <span style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: S.ink }}>{label}</div>
              <div style={{ fontSize: 12, color: S.sub, marginTop: 2 }}>{sub}</div>
            </span>
            <ChevronRight size={17} color="#C7CBD1" />
          </button>
        </Card>
      ))}
      <Btn kind="danger" style={{ width: "100%", marginTop: 8 }} onClick={onLogout}><LogOut size={15} /> Sign out</Btn>
    </div>
  );
}

function Inbox({ jobs, onOpenJob }) {
  const threads = jobs.slice(0, 4).map((j, i) => ({
    job: j,
    last: [
      "Sounds good — see you then.",
      "Just checking in on the estimate you sent over.",
      "The adjuster confirmed Thursday at 10.",
      "Thank you!! The crew left it spotless.",
    ][i],
    at: ["9:14 AM", "Yesterday", "Mon", "Jul 19"][i],
  }));
  return (
    <div style={{ padding: "20px 16px 110px", background: S.bg, minHeight: "100vh" }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: S.ink, marginBottom: 16 }}>Inbox</div>
      {threads.map((t) => (
        <Card key={t.job.id} pad={16} style={{ marginBottom: 10, cursor: "pointer" }}>
          <button onClick={() => onOpenJob(t.job.id)} style={{
            display: "flex", gap: 12, width: "100%", border: "none", background: "none",
            cursor: "pointer", textAlign: "left", padding: 0, alignItems: "center",
          }}>
            <span style={{
              width: 42, height: 42, borderRadius: 999, background: "#28373E", color: "#fff",
              display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14, flexShrink: 0,
            }}>{t.job.name.split(" ").map((w) => w[0]).join("")}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: S.ink }}>{t.job.name}</span>
                <span style={{ fontSize: 12, color: S.sub }}>{t.at}</span>
              </span>
              <span style={{ display: "block", fontSize: 13, color: S.sub, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.last}
              </span>
            </span>
          </button>
        </Card>
      ))}
      <div style={{ fontSize: 12, color: S.sub, textAlign: "center", marginTop: 8 }}>
        Texts send from the company number; SMS consent is enforced per client.
      </div>
    </div>
  );
}

/* ================================================================
   ROOT APP
   ================================================================ */
export default function SupremeCRM() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(SEED_USERS);
  const [booting, setBooting] = useState(liveAuth());
  const [authError, setAuthError] = useState("");

  /* With a backend connected, restore the session on load and follow
     sign-in / sign-out. Without one, this does nothing and the demo
     account picker handles it. */
  useEffect(() => {
    const auth = AUTH();
    if (!auth) return;
    let alive = true;

    const hydrate = async (session) => {
      if (!alive) return;
      if (!session) { setCurrentUser(null); setBooting(false); return; }
      try {
        const profile = await auth.loadProfile(session.user.id);
        if (!alive) return;
        setCurrentUser(fromProfile(profile));
        try {
          const all = await auth.listProfiles();
          if (alive && all) setUsers(all.map(fromProfile));
        } catch { /* rep-level accounts may not list everyone; not fatal */ }
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
    return () => { alive = false; if (off) off(); };
  }, []);
  const [crews, setCrews] = useState(SEED_CREWS);
  const [templates, setTemplates] = useState(SEED_TEMPLATES);
  const [companyDocs, setCompanyDocs] = useState(SEED_COMPANY_DOCS);
  const [priceList, setPriceList] = useState(SEED_PRICE_LIST);
  const [integrations, setIntegrations] = useState({
    gmail: { connected: false, email: "", at: null },
    sms: { connected: false, provider: "", number: "" },
  });
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [stages, setStages] = useState(DEFAULT_STAGES);
  const [jobs, setJobs] = useState(seedJobs);
  const [nav, setNav] = useState("home");        // home | jobs | inbox | more | sub-screens
  const [openJobId, setOpenJobId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [filters, setFilters] = useState({ sort: "updated", assignees: [], stages: [], sources: [] });
  const [reviewSettings, setReviewSettings] = useState({
    enabled: true, delayHours: 24, followUpDays: 3,
    template: "Hi {first_name}, thank you for trusting {company} with your home! If we earned it, a quick Google review means the world to our small team: {review_link}",
  });
  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 2200); };

  const mutJob = (id) => (fn) => setJobs((prev) => prev.map((j) => (j.id === id ? fn(j) : j)));

  const moveStage = (jobId, stageId) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, stageId, daysInStage: 0, updated: "just now" } : j)));
    const stage = stages.find((s) => s.id === stageId);
    if (stage && /completed/i.test(stage.name)) {
      const j = jobs.find((x) => x.id === jobId);
      if (reviewSettings.enabled && j && (j.consent.sms.granted || j.consent.email.granted) && !j.review.sent) {
        setJobs((prev) => prev.map((x) => (x.id === jobId ? { ...x, review: { ...x.review, sent: true } } : x)));
        toast(`Job completed — review request queued (${reviewSettings.delayHours}h delay)`);
        return;
      }
    }
    toast(stage ? `Moved to ${stage.name}` : "Moved");
  };

  const applyRemovedStages = (nextStages) => {
    const ids = new Set(nextStages.map((s) => s.id));
    setJobs((prev) => prev.map((j) => (ids.has(j.stageId) ? j : { ...j, stageId: nextStages[0].id })));
    setStages(nextStages);
  };

  const createLead = (f) => {
    const id = uid("j");
    const at = nowStamp();
    const repSeat = users.find((u) => u.name === f.assignee);
    const rate = repSeat && repSeat.commissionRate != null ? repSeat.commissionRate : 60;
    setJobs((prev) => [{
      id, name: `${f.first} ${f.last}`.trim(),
      address: [f.street, f.city, f.stateSel].filter(Boolean).join(", "),
      zip: f.zip.trim(), state: f.stateSel,
      lat: f.lat ?? null, lng: f.lng ?? null,
      value: 0, stageId: stages[0].id, assignee: f.assignee, leadSource: f.leadSource || "—",
      daysInStage: 0, updated: "just now", claimType: f.claimType, schedDate: null,
      phone: f.phone, email: f.email,
      consent: {
        sms: { granted: f.smsConsent, at: f.smsConsent ? at : null, source: f.smsConsent ? "New lead form" : null },
        email: { granted: f.emailConsent, at: f.emailConsent ? at : null, source: f.emailConsent ? "New lead form" : null },
      },
      insurance: f.claimType === "Insurance" ? {
        carrier: f.carrier, policy: f.policy, claim: f.claim,
        adjusterName: f.adjusterName, adjusterPhone: f.adjusterPhone, adjusterEmail: "",
        deductible: f.deductible, coverage: f.coverage, oLaw: f.oLaw,
        endorsements: { rps: f.rps, cosmetic: f.cosmetic, windHailDed: f.windHailDed, acvRoof: f.acvRoof, matching: f.matching },
      } : null,
      checklist: { ...BLANK_CHECKLIST }, measurements: { ...BLANK_MEASURE },
      estimate: mkEstimate(), contract: mkContract(),
      photos: [], tasks: [{ id: uid("t"), label: "Schedule inspection", done: false }],
      files: [], payments: [],
      fin: { materials: [], labor: [], other: [], commissionRate: rate, structure: "grossProfit", overheadPct: 10, reimbursements: [] },
      portal: { estimate: false, contract: false, photos: false, invoice: false }, crewId: null, messages: [], workOrder: null,
      review: { sent: false, clicked: false, posted: false },
    }, ...prev]);
    toast("Lead created");
    setOpenJobId(id); setNav("jobs");
  };

  if (booting) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: brand.primary, color: "#fff",
            display: "grid", placeItems: "center", fontWeight: 800, margin: "0 auto 14px",
          }}>{brand.short}</div>
          <div style={{ fontSize: 14, color: S.sub }}>Loading…</div>
        </div>
      </div>
    );
  }
  if (!currentUser) {
    return (
      <>
        <Login brand={brand} users={users} onLogin={setCurrentUser} />
        {authError && (
          <div style={{
            position: "fixed", bottom: 20, left: 20, right: 20, maxWidth: 420, margin: "0 auto",
            background: "#FDECEC", border: "1px solid #F3C7C3", borderRadius: 12, padding: "12px 14px",
            fontSize: 13, color: "#B42318", lineHeight: 1.5, zIndex: 80,
          }}>{authError}</div>
        )}
      </>
    );
  }
  const liveUser = users.find((u) => u.id === currentUser.id) || currentUser;
  if (!liveUser.active) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: S.bg }}>
        <Card style={{ maxWidth: 380, textAlign: "center" }}>
          <Lock size={28} color={S.sub} />
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 10 }}>This seat has been deactivated</div>
          <div style={{ fontSize: 14, color: S.sub, marginTop: 6 }}>Contact the office to restore access.</div>
          <Btn kind="ghost" style={{ width: "100%", marginTop: 16 }} onClick={async () => { const a = AUTH(); if (a) { try { await a.signOut(); } catch (e) { /* ignore */ } } setCurrentUser(null); }}>Back to sign in</Btn>
        </Card>
      </div>
    );
  }
  const userName = liveUser.name;
  const isAdmin = canEditStructure(liveUser);
  const showMoney = canSeeMoney(liveUser);

  const openJob = openJobId ? jobs.find((j) => j.id === openJobId) : null;
  const openJobScreen = (id) => { setOpenJobId(id); setNav("jobs"); };
  const backToBoard = () => setOpenJobId(null);

  const NavBtn = ({ id, icon: Icon, label }) => {
    const active = nav === id && !openJob;
    return (
      <button onClick={() => { setNav(id); setOpenJobId(null); }} style={{
        flex: 1, border: "none", background: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 0",
      }}>
        <Icon size={21} color={active ? "#1B6DE0" : "#9CA3AF"} strokeWidth={active ? 2.4 : 2} />
        <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "#1B6DE0" : "#9CA3AF" }}>{label}</span>
      </button>
    );
  };

  return (
    <div style={{ fontFamily: "'Inter','SF Pro Text',system-ui,-apple-system,sans-serif", background: S.bg, minHeight: "100vh" }}>
      {openJob ? (
        <JobDetail job={openJob} stages={stages} brand={brand} onBack={backToBoard}
          onMoveStage={moveStage} mut={mutJob(openJob.id)} toast={toast} reviewSettings={reviewSettings}
currentUser={liveUser} showMoney={showMoney} isAdmin={isAdmin}
          crews={crews} setCrews={setCrews} templates={templates} integrations={integrations} />
      ) : nav === "home" ? (
        <Dashboard jobs={jobs} stages={stages} onOpenJob={openJobScreen} userName={userName} go={setNav} />
      ) : nav === "jobs" ? (
        <JobBoard jobs={jobs} stages={stages} filters={filters}
          onOpenFilters={() => setFiltersOpen(true)} onOpenWorkflow={() => setWorkflowOpen(true)}
          onOpenJob={openJobScreen} onMoveStage={moveStage} onNewLead={() => setNewLeadOpen(true)} />
      ) : nav === "inbox" ? (
        <Inbox jobs={jobs} onOpenJob={openJobScreen} />
      ) : nav === "more" ? (
        <MoreMenu brand={brand} onNav={setNav} onLogout={async () => { const a = AUTH(); if (a) { try { await a.signOut(); } catch (e) { /* clear locally regardless */ } } setCurrentUser(null); }} currentUser={liveUser} />
      ) : nav === "insurance" ? (
        <InsuranceHub jobs={jobs} onBack={() => setNav("more")} onOpenJob={openJobScreen} toast={toast} />
      ) : nav === "performance" ? (
        <Performance jobs={jobs} stages={stages} users={users} onBack={() => setNav("more")}
          isAdmin={isAdmin} currentUser={liveUser} toast={toast} />
      ) : nav === "calendar" ? (
        <CalendarView jobs={jobs} onBack={() => setNav("more")} onOpenJob={openJobScreen} />
      ) : nav === "contacts" ? (
        <Contacts jobs={jobs} onBack={() => setNav("more")} onOpenJob={openJobScreen} />
      ) : nav === "reviews" ? (
        <ReviewSettings settings={reviewSettings} setSettings={setReviewSettings} jobs={jobs}
          onBack={() => setNav("more")} brand={brand} />
      ) : nav === "import" ? (
        <JobImport jobs={jobs} setJobs={setJobs} stages={stages} users={users}
          onBack={() => setNav("more")} toast={toast} currentUser={liveUser} />
      ) : nav === "documents" ? (
        <CompanyDocs docs={companyDocs} setDocs={setCompanyDocs} currentUser={liveUser}
          onBack={() => setNav("more")} toast={toast} />
      ) : nav === "pricelist" ? (
        <PriceListManager list={priceList} setList={setPriceList} currentUser={liveUser}
          onBack={() => setNav("more")} toast={toast} />
      ) : nav === "templates" ? (
        <TemplateManager templates={templates} setTemplates={setTemplates} currentUser={liveUser}
          onBack={() => setNav("more")} toast={toast} brand={brand} />
      ) : nav === "crews" ? (
        <CrewManager crews={crews} setCrews={setCrews} currentUser={liveUser} jobs={jobs}
          onBack={() => setNav("more")} toast={toast} />
      ) : nav === "integrations" ? (
        <Integrations integrations={integrations} setIntegrations={setIntegrations}
          currentUser={liveUser} onBack={() => setNav("more")} toast={toast} />
      ) : nav === "team" ? (
        <TeamManager users={users} setUsers={setUsers} currentUser={liveUser} jobs={jobs}
          onBack={() => setNav("more")} toast={toast} brand={brand} />
      ) : nav === "branding" ? (
        <BrandingEditor brand={brand} setBrand={setBrand} onBack={() => setNav("more")} />
      ) : null}

      {/* Bottom navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "#fff", borderTop: `1px solid ${S.line}`,
        display: "flex", alignItems: "center", paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        <NavBtn id="home" icon={Home} label="Home" />
        <NavBtn id="jobs" icon={Briefcase} label="Jobs" />
        <button onClick={() => setNewLeadOpen(true)} style={{
          border: "none", cursor: "pointer", background: "#1B6DE0", color: "#fff",
          width: 52, height: 52, borderRadius: 999, display: "grid", placeItems: "center",
          margin: "0 10px", transform: "translateY(-12px)", boxShadow: "0 6px 16px rgba(27,109,224,.35)",
          flexShrink: 0,
        }}><Plus size={25} /></button>
        <NavBtn id="inbox" icon={MessageCircle} label="Inbox" />
        <NavBtn id="more" icon={Menu} label="More" />
      </div>

      <NewLeadSheet open={newLeadOpen} onClose={() => setNewLeadOpen(false)} onCreate={createLead} brand={brand} />
      <FiltersSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} stages={stages}
        filters={filters} setFilters={setFilters} />
      <WorkflowEditor open={workflowOpen} onClose={() => setWorkflowOpen(false)} stages={stages}
        setStages={applyRemovedStages} />
      <Toast msg={toastMsg} />
    </div>
  );
}
