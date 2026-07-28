/* Build 46 — fine-tuning round: PWA print fallback, insurance overflow,
   Municode + storm depth, concealed toggle/custom, notes/terms/scope
   templates, contract attachments, PDF filler, SEO, seats/billing, and the
   two new Edge Functions. Static assertions over the source + assets. */
const fs = require("fs");
const src = fs.readFileSync("./ridgeline.jsx", "utf8");
const html = fs.readFileSync("./index.html", "utf8");
const main = fs.readFileSync("./src/main.jsx", "utf8");
const pkg = fs.readFileSync("./package.json", "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };
const has = (p) => fs.existsSync(p);

/* P1a — print/PDF works in a standalone PWA */
ok(/frame\.contentWindow\.print\(\)/.test(src), "openDoc prints via a hidden iframe");
ok(/a\.download = `\$\{String\(title/.test(src), "openDoc falls back to a Blob download");

/* P1b — insurance code-lookup no longer overflows */
const chip = src.slice(src.indexOf("function Chip"), src.indexOf("function Btn"));
ok(/wordBreak: "break-word"/.test(chip) && !/whiteSpace: "nowrap"/.test(chip), "Chip wraps long text");
ok(/const verifyLine = `Per \$\{label\}/.test(src), "citeFor keeps the badge cite short");

/* P2 — Municode + building dept + storm */
ok(/function municodeUrl\(state, city\)/.test(src), "municodeUrl helper exists");
ok(/sources: \["ICC", "MUNICODE"\]/.test(src), "Municode injected into fallback sources");
ok(/function deptSearchUrl\(city, state\)/.test(src), "building-department search helper");
ok(/function enrichStormDay\(/.test(src) && /lsr\.geojson/.test(src), "storm days enriched from NOAA/IEM LSR");
ok(/Hail — \{r\.hailIn/.test(src), "storm chip labels real hail size");
ok(/function StormScout\(/.test(src) && /\["storm", "Storm"\]/.test(src), "standalone Storm tab");

/* P3 — concealed toggle/custom, doc templates, attachments, PDF filler */
ok(/const toggleConcealed = /.test(src) && /const addConcealed = /.test(src), "concealed toggle + add custom");
ok(/function concealedTableHtml\(est\)/.test(src), "concealed conditions render in the document");
ok(/function TemplateBar\(/.test(src), "reusable template picker");
ok(/if \(d\.docTemplates\) setDocTemplates/.test(src), "docTemplates persisted");
ok(/label="Notes"[\s\S]{0,220}docTemplates\.notes/.test(src), "notes template bar wired");
ok(/label="Scope"[\s\S]{0,220}docTemplates\.scope/.test(src), "scope template bar wired");
ok(/const addAttachment = /.test(src) && /con\.attachments/.test(src), "contract PDF attachments");
ok(/function PdfFiller\(/.test(src) && /import\("pdf-lib"\)/.test(src), "PDF form-filler exports via pdf-lib");
ok(/function renderPdfPages\(/.test(src), "PDF pages render to canvas");
ok(/"pdf-lib"/.test(pkg), "pdf-lib is a dependency");
ok(/--external:pdf-lib/.test(pkg), "pdf-lib externalized in the test bundle");

/* P4 — SEO */
ok(has("./public/robots.txt") && has("./public/sitemap.xml"), "robots.txt + sitemap.xml");
ok(/rel="canonical"/.test(html) && /name="robots"/.test(html), "canonical + robots meta");
ok(/"@type": "SoftwareApplication"/.test(html) && /"price": "169.99"/.test(html), "JSON-LD with pricing offers");
ok(/roofing CRM built for the field/.test(html), "crawlable marketing fallback in #root");

/* P5 — seats + billing */
ok(/auth\.myTenant/.test(src) && /seatsIncluded/.test(src), "TeamManager reads plan and seat allowance");
ok(/if \(atLimit\)/.test(src), "seat-add blocked past the allowance");
ok(/const manageBilling = /.test(src), "Manage billing button");
ok(/async manageBilling\(\)/.test(main), "manageBilling wired to create-portal-session");

/* P6 — Edge Functions + deploy guide */
ok(has("./supabase/functions/companycam-proxy/index.ts"), "companycam-proxy function");
ok(has("./supabase/functions/create-portal-session/index.ts"), "create-portal-session function");
ok(/companycam-proxy/.test(src), "ccFetch routes through the proxy");
ok(has("./DEPLOY.md"), "DEPLOY.md checklist");

/* P7 — calendar sync + per-rep Gmail send (follow-up round) */
ok(has("./supabase/functions/calendar-feed/index.ts"), "calendar-feed function");
ok(/BEGIN:VCALENDAR/.test(fs.readFileSync("./supabase/functions/calendar-feed/index.ts", "utf8")), "calendar feed emits iCalendar");
ok(has("./supabase/config.toml") && /verify_jwt = false/.test(fs.readFileSync("./supabase/config.toml", "utf8")), "calendar-feed is public (config.toml)");
ok(/function CalendarSync\(/.test(src) && /function calFeedUrl\(/.test(src), "in-app Calendar sync card + feed URL");
ok(/function calSaveToken\(/.test(src), "per-seat calendar token stored");
ok(has("./supabase/functions/gmail-oauth/index.ts") && has("./supabase/functions/gmail-send/index.ts"), "Gmail OAuth + send functions");
ok(/gmailConnect\(\)/.test(main) && /async sendGmail\(/.test(main), "auth wires gmailConnect + sendGmail");
ok(/state=gmail&code|qs\.get\("state"\) !== "gmail"/.test(src) || /state.*gmail/.test(src), "app handles the Gmail OAuth callback");
ok(/auth\.sendGmail\(\{ to: addr, subject, body \}\)/.test(src), "composer sends email via the rep's Gmail");
ok(/__GOOGLE_CLIENT_ID__/.test(main), "Google client id exposed for the redirect");

/* P8 — System-check probe fix + dark/light theme */
ok(/\.upsert\(\{ tenant_id: currentUser\.tenantId, updated_at/.test(src), "settings probe upserts on tenant_id (no raw random-id insert)");
ok(!/id: probeId, data: \{ _probe/.test(src), "old colliding probe insert removed");
ok(/--rl-bg:/.test(html) && /--rl-card:/.test(html) && /\[data-theme="dark"\]/.test(html), "theme CSS variables + dark override in index.html");
ok(/ink: "var\(--rl-ink\)"/.test(src) && /card: "var\(--rl-card\)"/.test(src), "S tokens resolve to CSS variables");
ok(/localStorage\.getItem\("rl_theme"\)/.test(src) && /document\.documentElement\.dataset\.theme = theme/.test(src), "theme persists + flips data-theme");
ok(/setTheme\(id\)/.test(src) && /Appearance/.test(src), "MoreMenu has an appearance toggle");
ok(/data-theme="light"[\s\S]{0,120}<PublicPortal/.test(src), "client portal pinned light");
ok(/rl_theme/.test(main), "main.jsx applies saved theme pre-mount");

/* P9 — proposal cover: constrained image + visual layout picker (no crash) */
ok(/function ProposalBuilder\(\{[^}]*docTemplates/.test(src), "ProposalBuilder receives docTemplates (no ReferenceError)");
ok(/<ProposalBuilder[\s\S]{0,220}docTemplates=\{docTemplates\}/.test(src), "docTemplates passed into ProposalBuilder");
ok(/function CoverThumb\(/.test(src) && /<CoverThumb style=\{s\.id\}/.test(src), "visual cover-layout thumbnails");
ok(/\.cover img\.hero \{[^}]*object-fit: cover/.test(src), "print cover image is height-constrained");
ok(/height: 240, objectFit: "cover"/.test(src), "builder cover image is height-constrained");

if (fails) { console.log("\nbuild 46: " + fails + " FAILED"); process.exit(1); }
console.log("build 46 tests passed");
