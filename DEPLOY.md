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

## 2. Billing portal — "Manage subscription" / cancel on the backend

**Symptom in the app:** Team & seats, or More → **Billing** → **Manage
subscription**, says the portal isn't available.

**Fix:** deploy the portal function and set the Stripe secret.

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...   # Stripe → Developers → API keys
supabase secrets set APP_URL=https://roofstride.com
supabase functions deploy create-portal-session
```

Then, in the Stripe dashboard: **Settings → Billing → Customer portal**.
Everything below is one dashboard page — this is the entire configuration
that makes "Manage subscription" do what More → Billing's own screen already
tells the owner it does. Every one of these is **off by default** on a new
Stripe account:

| Toggle | Turn on | Why |
|---|---|---|
| **Customer information** → Update payment methods | On | "Change your card" |
| **Invoice history** | On | "View and download invoices" |
| **Customer information** → Update billing address / tax ID | On | "Update billing information" |
| **Cancellations** | On, timing = **"At the end of the billing period"** | "Cancel your subscription" — end-of-period keeps someone who cancels mid-trial in through the trial's end, and someone who cancels mid-subscription in through what they already paid for, instead of cutting them off immediately either way |
| **Subscriptions → Customers can switch plans** | On, with **both** real Prices (§8) added to the swappable group | "Switch between Base and Unlimited" — without both Prices listed here specifically, the portal only shows whichever one the customer is already on, with no upgrade/downgrade option at all |

Also on this page: set a **support email and business name** (shown on the
portal itself and on Stripe-generated invoices — this is the "RoofStride"
your customers actually see billing from), and a **default return URL**
matching `APP_URL` above, so "Return to RoofStride" inside the portal lands
back on the real app instead of a blank Stripe page.

**Save**, then click **"Preview"** on that same settings page — no test
card or live subscription needed for this check, it just renders the portal
UI so you can confirm all 5 rows actually appear before a real customer
depends on them.

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

**Seat allowance:** the "N of M seats" shown in Team & seats and More →
Billing comes from `my_tenant()` (migration `021`), enforced both client-side
and server-side (`invite-user`) against `tenants.plan`. The base plan is
capped at 10 seats; adding an 11th is blocked with a prompt to upgrade to
Unlimited (§8) — there is no per-seat quantity to raise instead, unlike an
older per-seat-priced model this app no longer uses.

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

## 7a. Where storm data comes from (nothing to configure)

Four sources answer "what hit this roof". All are free, keyless and
national — there is nothing to set up, and this section exists so you
know what you're looking at when a figure appears on screen.

| Tag | Source | What it's good for |
| --- | --- | --- |
| **Measured** | ASOS/AWOS airport instruments, via Iowa Environmental Mesonet | The most defensible wind number there is — an instrument reading, with the station and its distance |
| **Spotter** | NWS Local Storm Reports, via IEM | Best evidence of hail **size**: somebody held a stone against a ruler |
| **Radar** | NEXRAD Level-3 hail signatures, via [NCEI's Severe Weather Data Inventory](https://www.ncei.noaa.gov/products/severe-weather-data-inventory) | Best evidence of **coverage**: it saw every address, not just where someone was standing |
| **Modelled** | ERA5 reanalysis, via Open-Meteo | Rain and background context. Never a finding on its own |

**Why radar matters most.** Local Storm Reports only exist where a
human stood outside during a hailstorm and phoned it in — sparse, and
biased toward towns, roads and daylight. A roof two miles from the
nearest spotter can be destroyed while the lookup says "no hail found",
which is not "no hail happened" but reads exactly like it. Radar has no
such gap. It is the same underlying data the commercial hail-report
companies resell.

**Radar is an estimate and the app always says so.** The Hail Detection
Algorithm infers size from reflectivity above the freezing level. A
radar figure is shown as `2.5″ est · Radar` and a spotter's as
`1.75″ · Spotter`, and when both exist for a day **both are shown** —
they answer different questions and an adjuster conversation uses both.
Never quote a radar estimate as though it were measured.

If any source doesn't answer, the app names the one that failed rather
than quietly returning less evidence. "Couldn't check" and "nothing
happened" are different sentences, and only one of them should ever be
repeated to a homeowner.

---

## 7b. Storm watch — scheduled hail detection (optional)

**Everything here is optional.** Storm alerts already work with nothing
deployed: the app sweeps NOAA storm reports whenever somebody has it
open, and raises alerts from the areas set under **More → Storm watch**.

What this adds is *timing*. Hail lands at 9pm on a Saturday and the
useful window for knocking it is the next morning — not whenever a rep
next opens their phone. Deploy this and the alert is already waiting.

### Step 1 — deploy the function

```
supabase functions deploy storm-watch --no-verify-jwt
```

`--no-verify-jwt` is required because `pg_cron` calls this with no user
session. That means the function is reachable by anyone who finds the
URL, so it authenticates on a shared secret instead — it refuses to run
at all until that secret is set.

### Step 2 — set the secret

```
supabase secrets set STORM_WATCH_SECRET="$(openssl rand -hex 32)"
```

Keep the generated value; Step 3 needs it. `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` are provided by the platform — don't set them.

### Step 3 — schedule it

In the SQL editor, enable the two extensions and register the job.
Replace `YOUR-PROJECT-REF` and `YOUR-SECRET`:

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'storm-watch-hourly',
  '17 * * * *',                     -- hourly, off the hour to avoid the stampede
  $$
  select net.http_post(
    url     := 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/storm-watch',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-storm-watch-secret', 'YOUR-SECRET'
    ),
    body    := '{}'::jsonb
  );
  $$
);
```

To check it later: `select * from cron.job;` lists schedules and
`select * from cron.job_run_details order by start_time desc limit 10;`
shows recent runs. To remove it: `select cron.unschedule('storm-watch-hourly');`

### Step 4 — verify

Call it by hand and read the counts:

```
curl -s -X POST https://YOUR-PROJECT-REF.supabase.co/functions/v1/storm-watch \
  -H "x-storm-watch-secret: YOUR-SECRET"
```

It returns `{ok, tenants, areas, inserted, raised, skipped, lookupFailed}`.
On a quiet week `inserted` is 0 and that is correct — no storms is the
normal answer. `tenants: 0` means no company has storm watch switched on
with at least one area, which is a settings problem, not a deploy one.
A non-zero `lookupFailed` means NOAA didn't answer; those areas are
skipped rather than recorded as an all-clear, and the next run retries.

### Why it can't double-announce a storm

Both sweeps read the same NOAA feed and will see the same hail. Each
alert carries a `report_key` — the watched area, the kind of weather,
and the day — which migration 038 makes unique per tenant. Whichever
sweep arrives second either does nothing, or raises the recorded size if
its reports were bigger. One storm, one alert, however many times either
sweep runs.

### One implementation note, if you ever edit the function

The detection code inside `supabase/functions/storm-watch/index.ts` is a
deliberate copy of the functions in `ridgeline.jsx` (`lsrKind`,
`lsrWindMph`, `fetchStormReports`, `detectStormAlerts`, `stormAlertKey`).
If they drift, the two sweeps will disagree about what counts as a
storm. Change one, change both.

The function also sets `tenant_id` explicitly on every insert. It runs
on the service role, where `auth.uid()` is null, so migration 015's
`set_tenant_id()` trigger cannot fill it — and a row with a null
`tenant_id` is invisible to every user, because the RLS policy compares
against `current_tenant_id()`. The alert would be written and never
seen.

---

## 8. Signup & checkout — Stripe

These three functions run the marketing site's "Start your free trial"
flow end to end: Checkout → verify → create the tenant, then keep
subscription status and seat count in sync afterward. **This section is
the complete answer to "how do we connect the real Stripe products so
checkout and the trial actually work" — follow it in order.**

### Step 1 — find the two real Price IDs (not Product IDs)

You already created both products in Stripe (shown as **Pro** and
**Unlimited** on the marketing graphics — the app's own internal name
for the first one is "Base plan," same product, just a different label
in two different places, don't go looking for one named "Base"). What
this app needs from each isn't the *Product* — it's the **Price**
attached to it, since a Product can carry more than one Price (e.g. a
monthly and an annual one) and Stripe needs to know exactly which.

In the Stripe dashboard: **Products** → open **Pro** → under
**Pricing**, click the `$119.99 / month` row → copy the ID at the top,
which starts with `price_...` (NOT the Product ID, which starts with
`prod_...` and won't work here). Repeat for **Unlimited** →
`$199.99 / month` → its own `price_...` ID.

### Step 2 — set both as secrets, plus everything else Checkout needs

```bash
supabase functions deploy create-checkout-session   # signup → Stripe Checkout
supabase functions deploy complete-signup           # verifies checkout, creates tenant
supabase functions deploy stripe-webhook            # keeps status/seats in sync
supabase db push                                    # apply any pending migrations
```

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...          # Stripe → Developers → API keys
supabase secrets set STRIPE_PRICE_PER_SEAT=price_...         # Stripe → Products → base plan ($119.99/mo, 10 seats)
supabase secrets set STRIPE_PRICE_UNLIMITED=price_...        # Stripe → Products → Unlimited plan ($199.99/mo, no cap)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...          # set after creating the webhook endpoint below
supabase secrets set APP_URL=https://roofstride.com          # your domain, no trailing slash
```

### Step 3 — the webhook, which is what makes conversion and cancellation actually show up in the app

In the Stripe dashboard: **Developers → Webhooks → Add endpoint**,
pointing at `https://<project-ref>.functions.supabase.co/stripe-webhook`,
subscribed to exactly the 4 events the function's own `switch` handles —
`customer.subscription.updated`, `customer.subscription.deleted`,
`invoice.payment_failed`, and `invoice.paid`. (Not
`checkout.session.completed` — that step is handled separately, by the
browser calling `complete-signup` directly right after Checkout
redirects back; the webhook doesn't listen for it and would silently
ignore it if subscribed.) Stripe shows the signing secret once the
endpoint is created — that's the `STRIPE_WEBHOOK_SECRET` value above.

- Stripe itself auto-charges the card on file the moment the 7-day
  trial ends — nothing in this codebase drives that, Checkout's
  `trial_period_days: 7` plus `payment_method_collection: "always"`
  are what make it automatic. This webhook's job is only to mirror the
  *result* back into `tenants.status`: `invoice.paid` confirms the
  charge succeeded (and clears any prior `past_due` lock),
  `invoice.payment_failed` catches a declined card and sets
  `past_due`, and `customer.subscription.updated` is the fallback that
  independently reflects whatever status Stripe settles on regardless
  of which invoice event landed first.
- Canceling (via More → Billing → "Manage subscription" → the Stripe
  Billing Portal, see §2) fires `customer.subscription.deleted` once
  the subscription actually ends, which is what sets
  `tenants.status = 'canceled'` — and, since migration 030, is the
  exact moment the app itself locks the company out.
- Without this webhook correctly configured, Stripe still bills (or
  stops billing) the customer's card exactly the same either way — but
  `tenants.status` inside this app silently stops updating, so a
  canceled or payment-failed company keeps showing as if nothing
  happened.

### Step 4 — let customers switch Pro ↔ Unlimited themselves

Both plans are already offered at signup — `create-checkout-session`
reads `{ plan: "per_seat" | "unlimited" }` from the client and picks the
matching Price ID from Step 1/2 automatically, no further setup needed
there. Switching *after* signup is a separate, dashboard-only step: add
both real Prices to the Customer Portal's "Customers can switch plans"
group (§2's table above) — without that, More → Billing's own "Switch
between Base and Unlimited" bullet is a promise the Stripe side isn't
actually configured to keep yet.

### Step 5 — verify it end to end

No code changes needed to check this — a real signup, in Stripe test
mode with a test card (`4242 4242 4242 4242`, any future expiry/CVC),
proves every piece above at once:
1. **Start free trial** on either pricing card → land on Stripe
   Checkout showing the right plan's real price → complete with the
   test card.
2. Redirected back to the app, signed in, with a working company (this
   is `complete-signup` + `create_tenant` succeeding).
3. In the Stripe dashboard, find the new subscription and use **"Advance
   to next billing cycle"** (Stripe's built-in trial fast-forward,
   under the subscription's own menu — no waiting 7 real days) → the
   test card gets charged → `stripe-webhook` fires →
   `tenants.status` flips to `active` (confirm via More → Billing,
   which now reads live off `my_tenant()`).
4. From More → Billing → **Manage subscription**, cancel → Stripe sets
   `cancel_at_period_end` → status stays `active` until the period
   Step 3 just advanced actually ends → **advance the cycle once more**
   → `customer.subscription.deleted` fires → the app locks the company
   out behind the "Subscription canceled" screen (build 107) with a
   working "Reactivate billing" button for whoever ran this test.

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
| `VITE_MAP_TILE_URL` | canvassing street tiles (optional — see below) |
| `VITE_MAPBOX_TOKEN` | canvassing satellite imagery (optional — see below) |
| `VITE_SATELLITE_TILE_URL` | satellite from a non-Mapbox provider (optional) |
| `VITE_SATELLITE_ATTRIBUTION` | required alongside `VITE_SATELLITE_TILE_URL` |

The app runs in demo mode (no backend) when the Supabase pair is absent, so a
missing key never white-screens the site.

### Canvassing map tiles

Without `VITE_MAP_TILE_URL` the canvassing map draws Geoapify street tiles on
`VITE_GEOAPIFY_KEY`. That works with nothing extra to set up, but it spends the
**same daily quota address autocomplete depends on** — and a rep panning a map
requests tiles far faster than anyone types an address, so a heavy canvassing
day can starve address lookup for the whole company.

Set `VITE_MAP_TILE_URL` to a dedicated tile endpoint to separate the two. The
`{z}`, `{x}` and `{y}` placeholders are substituted per tile:

```
VITE_MAP_TILE_URL=https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=SEPARATE_KEY
```

### Satellite imagery

The canvassing map has a **Street / Satellite** toggle. Aerial is most of the
point of a map for roofing — you can count facets and see the ridge line before
you knock — but satellite stays greyed out, with an explanation when tapped,
until an imagery key is set. There is no free option to default to: every
aerial basemap that looks free bars commercial use, and Esri's World Imagery is
explicit that it requires an ArcGIS licence and is not licensed for commercial
use.

**Mapbox is wired in. One value turns it on.**

1. Sign up at [mapbox.com](https://account.mapbox.com/auth/signup/). No card is
   required to get a token.
2. Copy the **Default public token** from your account page (it starts `pk.`).
   A public token is the right kind — it ships in the browser bundle, which is
   how all tile providers work. Restrict it to your domain under
   Account → Tokens → URL restrictions.
3. In Vercel, set `VITE_MAPBOX_TOKEN` to that value and redeploy.

Satellite lights up on the next load. The free tier covers **200,000 tile
requests a month**, which is a lot of canvassing — a rep working a
neighbourhood for an hour is on the order of a few hundred. Past that it's
metered per thousand; check current rates on Mapbox's pricing page before
committing a large team.

**Using a different provider instead.** Set `VITE_SATELLITE_TILE_URL` to a full
`{z}/{x}/{y}` template — it takes precedence over the Mapbox token, so a
company already paying for Google or MapTiler never needs one. **Set
`VITE_SATELLITE_ATTRIBUTION` alongside it**: whoever's imagery it is must be
credited over the tiles, and the app deliberately will not print Mapbox's name
over someone else's imagery. Without it the corner reads a neutral "Satellite
imagery", which is unlikely to satisfy your provider's terms.

```
VITE_SATELLITE_TILE_URL=https://example-provider.com/tiles/{z}/{x}/{y}.jpg?key=YOUR_KEY
VITE_SATELLITE_ATTRIBUTION=© Example Provider
```

Google's Map Tiles API has the best imagery in most US suburbs and the most
setup (Cloud billing account + API enablement), and bills from the first tile.
MapTiler sits between the two on both price and imagery.

If tiles fail to load for any reason — key missing, quota hit, provider down —
the map says so plainly and keeps working: pins, dispositions, the list and the
scoreboard are all unaffected.

---

## 10. (Retired) Syncing a per-seat Stripe quantity

This section used to describe billing per active seat via the Checkout
line item's `quantity`, from an earlier per-seat-priced model. Pricing
is now two flat plans — $119.99/mo for up to 10 seats, $199.99/mo
Unlimited (§8) — with no variable seat quantity in Stripe to sync at
all; `create-checkout-session`'s `quantity: 1` is fixed on purpose, not
a placeholder waiting on this follow-up. Left here only so a future
per-seat-priced tier, if one is ever added, isn't designed from
scratch.
