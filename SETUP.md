# Getting Ridgeline live with real logins

Four steps. Budget about 30 minutes for the first three; the Edge Function
in step 4 can wait until you actually need to invite someone.

---

## 1. Create the database

Supabase dashboard → **SQL Editor** → **New query** → paste the whole of
`supabase/schema.sql` → **Run**.

This creates the tables, turns on Row Level Security, creates the private
storage buckets, and seeds the pipeline stages.

**Why RLS matters:** the publishable key ships inside the app, where anyone
can read it out of the JavaScript. That is fine — it is designed to be public
— but *only* because RLS decides what each signed-in user may see. Crew
accounts are blocked from cost lines, reimbursements, and payments at the
database, not just hidden in the interface. If RLS is ever switched off, that
key reads everything.

Verify: **Table Editor** should list `profiles`, `jobs`, `stages`,
`job_photos`, `job_cost_lines`, and the rest. **Authentication → Policies**
should show policies on every one.

---

## 2. Create the first admin

This one is done by hand, on purpose. If the app could create its own first
admin, anyone who signed up could promote themselves.

1. **Authentication → Users → Add user**
2. Enter your email and a password. Tick **Auto Confirm User** so you can
   sign in immediately.
3. Back in **SQL Editor**, run this with your email:

```sql
update profiles
   set role = 'admin', title = 'Owner / Admin'
 where email = 'you@supremebuildinggroup.com';
```

Confirm it worked:

```sql
select name, email, role, active from profiles;
```

You should see one row, role `admin`, active `true`.

---

## 3. Deploy

1. Go to **vercel.com** and sign in with GitHub.
2. **Add New → Project → Import** `chickenbananadev/Ridgeline`.
3. Vercel detects Vite on its own. Before clicking Deploy, open
   **Environment Variables** and add three:

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://YOUR-PROJECT.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | your publishable key |
| `VITE_GEOAPIFY_KEY` | your Geoapify key |

4. **Deploy.** You get an HTTPS URL.

HTTPS is not optional here — browsers refuse geolocation and camera access on
plain HTTP, so GPS-stamped photos only work on the deployed site.

Then go back and lock down the keys:

- **Supabase → Authentication → URL Configuration** → set Site URL to your
  Vercel URL and add it under Redirect URLs, so password-reset links land in
  the right place.
- **Geoapify console → Allowed Origins** → add your Vercel domain, so nobody
  else can spend your daily request quota.

---

## 4. Turn on seat invites (when you need it)

Adding a seat from inside the app creates a real auth user, which requires the
service-role key. That key must never reach the browser — it bypasses RLS
entirely. So it lives in an Edge Function instead.

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase functions deploy invite-user
```

The function verifies the *caller* is an admin before it creates anything, so
a rep who found the endpoint still cannot mint accounts.

Until this is deployed, everything else works — you just add users through
**Authentication → Users** in the Supabase dashboard and set their role with
the SQL from step 2.

---

## What is live, and what is not

**Live after these steps**

- Real email/password login, session persistence, password reset
- Roles enforced in the database: admin, production manager, sales rep, crew
- Deactivating a seat blocks sign-in immediately
- Address autocomplete and reverse geocoding
- GPS + timestamp on photos (on the HTTPS URL)

**Still in memory, resets on refresh**

Jobs, photos, financials, documents, price list, templates, and messages.
The schema and storage buckets exist and are waiting; the app has not been
switched over to read and write them yet. That is the next chunk of work, and
it is best done in stages — jobs first, then photos, then documents.

**Needs outside accounts**

- **Gmail sending** — Google Cloud project, Gmail API enabled, OAuth consent
  screen, token exchange in an Edge Function. The client secret cannot live in
  the browser.
- **Text messaging** — a provider account plus 10DLC brand and campaign
  registration. Unregistered business texting gets filtered by carriers.
  Registration takes a few days, so start it before you need it.

---

## Costs

| | Free tier | When you outgrow it |
| --- | --- | --- |
| Vercel | Generous for this | Unlikely soon |
| Supabase | 500 MB database, 1 GB storage | **$25/mo Pro** — 1 GB of roof photos is only a handful of jobs, and free projects pause after 7 days idle |
| Geoapify | 3,000 requests/day | Not close |

Plan on the Supabase Pro upgrade before the crew depends on this daily. The
project pausing on a Monday morning is not a failure mode you want.

## Vercel deployment notes

- Environment variables must be prefixed `VITE_` or Vite will not expose them
  to the browser build: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
  `VITE_GEOAPIFY_KEY`. Variables only apply to builds created after they are
  added, so add them first and then redeploy.
- Vercel blocks deployments whose git commit author email is not a real
  address attached to a GitHub account. Commits must be authored with a
  valid email or every build is marked "Blocked" before it starts.
