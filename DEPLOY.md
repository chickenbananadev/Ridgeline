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
as a follow-up, wire the checkout quantity — see §6).

---

## 4. Everything else already in the repo

These functions exist and just need deploying if you haven't already:

```bash
supabase functions deploy create-checkout-session   # signup → Stripe Checkout
supabase functions deploy complete-signup           # verifies checkout, creates tenant
supabase functions deploy stripe-webhook            # keeps status/seats in sync
supabase functions deploy send-sms                  # Twilio text sending
supabase db push                                    # apply any pending migrations
```

Secrets used across these (set the ones you use):

| Secret | Used by | Where to get it |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | checkout, portal, webhook | Stripe → Developers → API keys |
| `STRIPE_PRICE_PER_SEAT` | checkout | Stripe → Products (Team price ID) |
| `STRIPE_PRICE_UNLIMITED` | checkout | Stripe → Products (Unlimited price ID) |
| `STRIPE_WEBHOOK_SECRET` | webhook | Stripe → Developers → Webhooks → signing secret |
| `APP_URL` | checkout, portal | your domain, no trailing slash |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM` | send-sms | Twilio console |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are
injected into every function automatically — don't set them by hand.

For the Stripe **webhook**, add an endpoint in the Stripe dashboard pointing at
`https://<project-ref>.functions.supabase.co/stripe-webhook` and subscribe to
`customer.subscription.updated`, `customer.subscription.deleted`, and
`checkout.session.completed`.

---

## 5. Front-end environment variables (Vercel)

Set these in the Vercel project (Project → Settings → Environment Variables),
then redeploy:

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_GEOAPIFY_KEY` | address autocomplete (optional but recommended) |
| `VITE_PROPERTY_KEY` | property-record auto-fill (optional) |

The app runs in demo mode (no backend) when the Supabase pair is absent, so a
missing key never white-screens the site.

---

## 6. Optional follow-up: sync Stripe seat quantity

`create-checkout-session` currently starts every subscription at
`quantity: 1`. To bill per active seat automatically, update the subscription
item quantity from `stripe-webhook` (or a small scheduled job) to match the
count of active seats for the tenant. Until then, seat quantity is managed in
the Stripe customer portal.
