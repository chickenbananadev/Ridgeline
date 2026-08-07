# Deploying the RoofStride backend

The app (Vercel) is already live and auto-deploys on merge to `main`. What
follows are the **server-side pieces** — Supabase Edge Functions, migrations,
and a couple of provider settings — that light up features the browser can't
do on its own. You can deploy them in any order; each section is independent
and the app degrades gracefully until its piece is in place.

Prerequisites, once:

```bash
npm i -g supabase          # the Supabase CLI
supabase login             # opens a browser to authorize
supabase link --project-ref <your-project-ref>   # from the project's URL
```

`<your-project-ref>` is the subdomain in your Supabase dashboard URL
(`https://supabase.com/dashboard/project/<ref>`).

---

## 0. Photo & file storage — fixes "Bucket not found"

**Symptom in the app:** uploading a photo anywhere — job photos, punch
list, company documents, contract attachments all share one upload path
— fails with a raw provider error like `{"statusCode":"404","error":
"Bucket not found"}`.

**Fix:** apply the migration that creates the bucket (idempotent, safe
to re-run):

```bash
supabase db push
```

No secrets needed. Until this is applied, uploads fall back to saving
the image inline in the database (capped at 3 MB) rather than failing
outright — real Storage removes that cap and is what production should
run on. If you'd rather set it up by hand instead: Storage → New bucket
→ name it exactly `job-files`, mark it **public** (the app calls
`getPublicUrl()` and stores that link directly — there's no signed-URL
path), then add the four policies in migration `024` (public read,
authenticated insert/update/delete).

---

## 0b. Customer signing — fixes "Could not sign... row-level security"

**Symptom in the app:** a homeowner opens their portal link and tries
to sign an estimate, contract, or change order, and gets "Could not
sign — That did not save... Check the row-level security policies for
signatures," no matter what device or doc type they try.

**Cause:** migration `018` closed a real enumeration hole by removing
direct anonymous read access to `crm_portal`, but `014`'s customer-
signing policies still validated a token by querying `crm_portal`
directly — a query that is itself subject to `crm_portal`'s RLS, and
so always returned nothing for an anonymous visitor after `018`. Every
customer signature was rejected as a result, already applied to this
project's live database directly (see migration `025`), but run
`supabase db push` too so a fresh environment picks it up the same way:

```bash
supabase db push
```

No secrets needed.

---

## 1. CompanyCam — fixes "the connection isn't working"

**Symptom in the app:** connecting CompanyCam shows *"Needs the CompanyCam
relay."* That's CORS — a browser can't call `api.companycam.com` directly.

**Fix:** deploy the relay function. Token storage (migration `010`) already
ships in the repo.

```bash
supabase functions deploy companycam-proxy
# make sure the token table exists (safe to re-run; it's idempotent):
supabase db push
```

No secrets are needed — the function uses the rep's own CompanyCam personal
access token, which is passed per-request and never stored server-side. Once
deployed, re-open Integrations → CompanyCam and paste the token again.

---

## 2. Billing portal — "Manage billing" / cancel on the backend

**Symptom in the app:** Team & seats → **Manage billing** says the portal
isn't available.

**Fix:** deploy the portal function and set the Stripe secret.

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...   # Stripe → Developers → API keys
supabase secrets set APP_URL=https://roofstride.com
supabase functions deploy create-portal-session
```

Then, once in the Stripe dashboard, enable the **Customer Portal**
(Settings → Billing → Customer portal) and turn on the actions you want owners
to have — update card, change plan, cancel subscription. That's the only place
a subscription can be cancelled, by design.

---

## 3. Seats & logins — "creating seats and logins doesn't work"

The app invites a seat two ways and uses whichever is available:

1. **Preferred — the invite function** (a proper "set your password" invite):

   ```bash
   supabase functions deploy invite-user
   ```

2. **Fallback — magic-link sign-up.** If `invite-user` isn't deployed, the app
   calls `signInWithOtp({ shouldCreateUser: true })`, which creates the account
   and emails a sign-in link using only the public anon key. For this to work,
   **email sign-ups must be enabled**: Supabase → Authentication → Providers →
   Email → *Enable Email provider* and allow new sign-ups.

Either way, add your app origin under **Authentication → URL Configuration →
Redirect URLs** (e.g. `https://roofstride.com`, plus any preview domains) so
the invite/reset links land back on the app.

**Seat allowance:** the "N of M seats" shown in Team & seats comes from
`my_tenant()` (migration `021`). Adding a seat past the plan's allowance is
blocked with a prompt to add seats in Manage billing. To actually bill for the
extra seat, raise the subscription quantity in the Stripe customer portal (or,
as a follow-up, wire the checkout quantity — see §10).

---

## 3b. Transactional email — custom SMTP

**Do this before relying on §3.** Every invite in §3 is an email, and by
default Supabase sends it through its own built-in sender. That sender is
rate-limited to a handful of messages per hour and sends from a generic
Supabase address, so invites either throttle or land in spam. Since seats are
invite-only — a rep can never self-signup into a company — a seat that never
receives its invite is a rep who cannot get in at all.

This is a **dashboard setting, not code**. Nothing in this repo changes.

**1. Get an app password from your mail provider.** For Zoho: Zoho Mail →
Settings → Security → App Passwords → generate one for "Supabase." Use that,
never the account's login password. Note that some providers gate outbound
SMTP behind a paid plan — confirm your plan allows it before wiring this up,
or the settings will save and every send will silently fail.

**2. Publish SPF and DKIM for the domain first.** Sending as
`@roofstride.com` without them is filtered as aggressively as the default
sender was, so skipping this step buys nothing. Your mail provider issues both
records; add them at whoever hosts the domain's DNS (Vercel → Domains →
roofstride.com → DNS Records for this project). SPF is a single TXT at the
apex — if another service already sends as this domain, merge into the
existing record rather than adding a second one; two SPF records on the same
name breaks SPF outright.

**3. Supabase → Project Settings → Authentication → SMTP Settings → Enable
Custom SMTP:**

| Field | Value |
|---|---|
| Host | `smtp.zoho.com` |
| Port | `465` (SSL) or `587` (TLS) |
| Username | `support@roofstride.com` |
| Password | the app password from step 1 |
| Sender email | `support@roofstride.com` |
| Sender name | `RoofStride` |

Confirm the host against your provider's own docs — regional accounts differ
(`smtp.zoho.eu`, `smtp.zoho.in`).

**4. Verify it actually sends.** Invite a real seat from Team & seats, then
check **Supabase → Logs → Auth**. A working send logs the invite with no
error; a rejected one logs the SMTP failure verbatim (bad credentials, plan
doesn't permit SMTP, unverified sender). Confirm the invite landed:

```sql
select email, invited_at, confirmation_sent_at, email_confirmed_at
from auth.users order by created_at desc limit 5;
```

`invited_at` set means the invite was issued; `email_confirmed_at` set means
the person actually received it and followed the link. If `invited_at` is null
across every row, no invite has ever been issued and the problem is upstream
of SMTP — check that `invite-user` is deployed (§3).

Note this is separate from §5. Custom SMTP covers **platform** mail — invites,
password resets, email confirmations — sent by RoofStride to its own users.
Rep-to-homeowner mail deliberately goes out through each rep's own Gmail so a
homeowner replies to the person who knocked on their door.

---

## 4. Calendar sync — appointments on iPhone / Google Calendar

Reps subscribe their phone calendar to a personal RoofStride feed under
**More → Integrations → Calendar sync**. Read-only and one-way; the phone
refreshes on its own (about hourly).

```bash
supabase functions deploy calendar-feed --no-verify-jwt
```

The `--no-verify-jwt` is required — calendar apps can't send an auth header, so
the feed is public and gated by a long per-seat token in the URL (stored in
`crm_user_integrations`). No secrets needed. `supabase/config.toml` already
records the `verify_jwt = false` setting for CLI/CI deploys.

## 5. Email sending — per-rep Gmail (and outbound Google Calendar sync)

Each rep sends from their **own** Gmail; there's no shared company sender.
One Google Cloud OAuth client serves everyone. The same connection now also
covers a one-way outbound sync — a newly booked appointment gets pushed to
the rep's own Google Calendar — since both use the same Google account
connection and refresh token.

**One-time (office):**
1. console.cloud.google.com → new project → enable the **Gmail API** and the
   **Google Calendar API**.
2. **OAuth consent screen** → Internal (if you use Google Workspace) or External; add the `gmail.send` and `calendar.events` scopes.
3. **Credentials → OAuth client ID → Web application.** Add your app origin **with a trailing slash** as an Authorized redirect URI (e.g. `https://roofstride.com/`, plus preview origins).
4. Set the Client ID and Secret:
   ```bash
   # Vercel env var (client redirect):
   #   VITE_GOOGLE_CLIENT_ID = <client id>
   supabase secrets set GOOGLE_CLIENT_ID=<client id> GOOGLE_CLIENT_SECRET=<client secret>
   supabase functions deploy gmail-oauth
   supabase functions deploy gmail-send
   supabase functions deploy calendar-push
   ```

**Then each rep:** Integrations → **Connect my Gmail** → pick their account →
approve. Messages composed on a job then send from their address; replies land
in their inbox; new appointments booked from a job or the calendar screen get
pushed to that rep's own Google Calendar. Until this is deployed, email is
saved to the job thread rather than sent, and the calendar push silently does
nothing (SMS via EZ Texting is unaffected either way).

> A rep who connected **before** `calendar.events` was added to the scope has
> a Gmail-only token — the calendar push for them fails with a message
> telling them to reconnect from Integrations, rather than failing silently
> or against the wrong permission. Reconnecting re-runs the same consent
> screen with both scopes and replaces their stored token.

> Note: *immediate* emails send now. Scheduled day-before reminders are still
> queued in the thread — delivering those on a timer needs a small scheduled
> function (a follow-up), since a schedule has to run server-side. Calendar
> sync is one-way (app → Google) only; edits made in Google Calendar don't
> come back.

## 6. Roofing assistant — optional, and optional on purpose

The assistant works with no key: it searches the app's own library (building
code, manufacturer install specs and warranty terms, NRCA best practice, policy
provisions, carrier patterns, the claim playbook) and shows the matching
entries with their citations. That is the baseline and it is offline.

Adding an Anthropic key lets it write the answer in plain English on top of
those same sources, and answer for the specific roof you have open.

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy ai-assistant
```

**Never give this key a `VITE_` prefix and never put it in Vercel.** `VITE_`
variables are compiled into the browser bundle and would be public to anyone
who views source. The key lives only in the Edge Function — which is the whole
reason the app calls a server function instead of the API directly.

The function is a sandbox: it has no database access and no tools, and it only
ever sees the handful of library records the app already matched locally, plus
(if the rep leaves the box ticked) a roof summary with no name, address, phone
or dollar figures in it. Its system prompt confines answers to those records,
requires a citation, and refuses legal advice.

If the key is missing, the provider is down, or the phone is offline, the
function returns a soft failure and the app falls back to the cited entries it
always showed. Nothing in the UI reports an error, because there is nothing
the rep could do about it.

## 6b. AI damage detection on photos — shares the assistant's key

Every photo with real image data (uploaded through the app, not a legacy
record) gets a **Scan for damage** button in the album. It sends that one
photo to the model and gets back what's visibly documented — hail impact,
wind/lifted shingles, granule loss, cracking, flashing damage — each with a
confidence and a one-line description. A finding a rep trusts becomes the
same photo evidence tag the manual "Tag a photo" flow already writes, so it
feeds straight into the supplement checker.

```bash
supabase functions deploy photo-damage-detect
```

Uses the same `ANTHROPIC_API_KEY` secret as the roofing assistant above — no
separate key to provision. With no key deployed, the **Scan for damage**
button still appears (any photo can be scanned) but tapping it tells the rep
plainly that detection isn't available yet, rather than failing silently.

Same sandbox as the assistant: the model sees exactly one photo's bytes and
nothing else about the job or tenant. The prompt is explicit that this
assists a rep who verifies in person — it never estimates damage that isn't
visibly in the frame, and it never states a dollar value or a claim
determination.

## 7. Texting — EZ Texting

**Symptom in the app:** texting a customer (a job's Messages tab, an
appointment-confirmation text, the "share ETA" en-route text, or any
automated stage-change text) either does nothing or shows *"Texting
isn't set up on this project yet — saved to the thread."*

**Fix:** generate an API key and deploy the function.

```bash
supabase secrets set EZTEXTING_API_KEY=...   # app.eztexting.com → Settings → Integrations / Developer API
supabase functions deploy send-sms
```

Then send one real test text — a job's Messages tab, to a recipient
who has SMS consent on file — before relying on this for real
customers. The exact request EZ Texting's REST API expects (endpoint,
auth header, body field names) is built into
`supabase/functions/send-sms/index.ts` from cross-checked third-party
integration guides, **not** a direct read of EZ Texting's own
reference docs — this environment's network policy blocked outbound
access to `developers.eztexting.com` while writing it (see the comment
at the top of that file). If EZ Texting has a different shape, the
test send fails with EZ Texting's own error message surfaced back into
the app's toast, and
`https://www.eztexting.com/developers/sms-api-documentation/rest` —
reachable from your own machine, not from this build environment — is
where to reconcile it.

Every automated text and every rep-composed text funnels through this
one function, so nothing above it needs to change if the provider
changes again later.

**Why EZ Texting instead of a standard 10-digit business number:** a
standard long code needs the carriers' A2P 10DLC campaign
registration — a self-service process that can take days and doesn't
always clear on the first attempt (this project's original Twilio
number never cleared review). EZ Texting sends over a shared short
code by default, a different carrier category that skips 10DLC review
entirely, which is the main reason it was faster to stand up.

**Consent is enforced server-side, not just in the UI:** the function
checks `crm_jobs.data.consent.sms.granted` before sending anything
tied to a job and refuses with `403` if it isn't set — a rep can't
bypass this by editing the request from the browser.

---

## 8. Signup & checkout — Stripe

These three functions run the marketing site's "Start your free trial"
flow end to end: Checkout → verify → create the tenant, then keep
subscription status and seat count in sync afterward.

```bash
supabase functions deploy create-checkout-session   # signup → Stripe Checkout
supabase functions deploy complete-signup           # verifies checkout, creates tenant
supabase functions deploy stripe-webhook            # keeps status/seats in sync
supabase db push                                    # apply any pending migrations
```

Two plans — create both as real Stripe Prices before setting the
secrets below:
- **Base plan**: recurring, $119.99/mo, no metering, capped at 10 seats
  by the app (`STRIPE_PRICE_PER_SEAT`, the name is a holdover from an
  earlier per-seat model). This is what a signup uses when they click
  the base-plan card on the pricing section.
- **Unlimited plan**: recurring, $199.99/mo, no metering, no seat cap
  (`STRIPE_PRICE_UNLIMITED`). Used when a signup clicks the
  Unlimited card instead.

Both are offered at signup — `create-checkout-session` reads
`{ plan: "per_seat" | "unlimited" }` from the client and picks the
matching Price ID. To let an existing customer switch plans later
without contacting support, add both Prices to the Stripe dashboard's
**Billing Portal configuration** (Settings → Billing → Customer portal
→ Products) as a swappable group — `stripe-webhook` watches
`customer.subscription.updated` for whichever price is actually on the
subscription and syncs `tenants.plan` accordingly. Without both secrets
below set, the webhook leaves `plan` untouched rather than guessing, so
a self-service upgrade would charge the card but never actually lift
the app's own 10-seat cap.

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...          # Stripe → Developers → API keys
supabase secrets set STRIPE_PRICE_PER_SEAT=price_...         # Stripe → Products → base plan ($119.99/mo, 10 seats)
supabase secrets set STRIPE_PRICE_UNLIMITED=price_...        # Stripe → Products → Unlimited plan ($199.99/mo, no cap)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...          # set after creating the webhook endpoint below
supabase secrets set APP_URL=https://roofstride.com          # your domain, no trailing slash
```

Then, in the Stripe dashboard: **Developers → Webhooks → Add endpoint**,
pointing at `https://<project-ref>.functions.supabase.co/stripe-webhook`,
subscribed to `customer.subscription.updated`,
`customer.subscription.deleted`, and `checkout.session.completed`. Stripe
shows the signing secret once the endpoint is created — that's the
`STRIPE_WEBHOOK_SECRET` value above.

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are
injected into every function automatically — don't set them by hand.
`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (§5) and `ANTHROPIC_API_KEY`
(§6) are documented in their own sections above, not repeated here.

---

## 9. Front-end environment variables (Vercel)

Set these in the Vercel project (Project → Settings → Environment Variables),
then redeploy:

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_GEOAPIFY_KEY` | address autocomplete (optional but recommended) |
| `VITE_PROPERTY_KEY` | property-record auto-fill (optional) |
| `VITE_GOOGLE_CLIENT_ID` | per-rep Gmail sending (optional; pairs with the `GOOGLE_*` secrets) |

The app runs in demo mode (no backend) when the Supabase pair is absent, so a
missing key never white-screens the site.

---

## 10. Optional follow-up: sync Stripe seat quantity

`create-checkout-session` currently starts every subscription at
`quantity: 1`. To bill per active seat automatically, update the subscription
item quantity from `stripe-webhook` (or a small scheduled job) to match the
count of active seats for the tenant. Until then, seat quantity is managed in
the Stripe customer portal.
