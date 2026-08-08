-- ============================================================
-- 038 — storm watch alerts
--
-- Hail lands in the company's territory and nobody hears about it
-- until a homeowner calls. This table is the record of what fell,
-- where, and whether anyone has looked at it yet — so a storm turns
-- into reps on doorsteps the same day instead of a week later.
--
-- WHERE THE SETTINGS LIVE, and why not here
--
-- The watched areas, radii and thresholds ride in the crm_org blob
-- beside pipeline stages and canvassing dispositions: there are a
-- handful of them, they are rewritten whole on every save, and one
-- person edits them at a time. The ALERTS are different — written by
-- a background job nobody is watching, read by everyone, and
-- accumulating forever — so they get a real table.
--
-- report_key IS THE ANTI-NOISE MECHANISM
--
-- Detection runs twice: in-app when someone opens the app, and on a
-- schedule via an Edge Function. Both read the same NOAA reports, so
-- both will see the same storm. report_key is a stable identity for
-- "this kind of weather, in this watched area, on this day", unique
-- across the table, so the second one to arrive updates the first
-- rather than raising a duplicate. Without it the two detectors would
-- fight and every storm would be announced twice.
--
-- It is deliberately one alert per area per kind per day rather than
-- one per NOAA report. A single hailstorm generates dozens of spotter
-- reports as it tracks across a county; forty notifications for one
-- storm is not an alert system, it is a reason to turn alerts off.
-- The magnitude carried is the worst seen, and a later, bigger report
-- raises it — see the greatest() on conflict in the sweep.
--
-- ACKNOWLEDGED vs DISMISSED are different answers and both are kept.
-- Acknowledged means someone has seen it and it is being worked;
-- dismissed means it is not worth working. Collapsing them would lose
-- the distinction between "handled" and "ignored", which is exactly
-- the thing an owner wants to look back at.
--
-- Mirrors 015's tenant machinery exactly — tenant_id column, the
-- shared set_tenant_id() insert trigger, and the same for-all policy
-- shape as jobs_rw.
--
-- Idempotent. Safe to re-run.
-- ============================================================

create table if not exists crm_storm_alerts (
  id text primary key,
  watch_id text,                                 -- the watched area's id in the org blob
  watch_name text default '',                    -- denormalised: the area may be renamed or deleted later
  kind text not null,                            -- 'hail' | 'wind'
  lat double precision,
  lng double precision,
  radius_miles numeric,                          -- the radius in force when this was raised
  occurred_on date not null,
  magnitude numeric,                             -- inches for hail, mph for wind
  unit text default '',
  place text default '',                         -- "Naperville, DuPage IL"
  report_count int default 1,
  report_key text not null,
  acknowledged_by uuid,
  acknowledged_at timestamptz,
  dismissed boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- tenant scoping, same shape as every other table ----------
alter table crm_storm_alerts add column if not exists tenant_id uuid references tenants(id);
create index if not exists crm_storm_alerts_tenant_idx on crm_storm_alerts(tenant_id);
-- The banner and the badge both ask "anything unhandled, newest first".
create index if not exists crm_storm_alerts_recent_idx
  on crm_storm_alerts(tenant_id, occurred_on desc);

-- Scoped to the tenant, not global: two companies watching the same
-- county must each get their own alert for the same storm. A bare
-- unique(report_key) would let whichever tenant detected it first
-- silently suppress it for everyone else.
create unique index if not exists crm_storm_alerts_key_idx
  on crm_storm_alerts(tenant_id, report_key);

drop trigger if exists stamp_tenant on crm_storm_alerts;
create trigger stamp_tenant before insert on crm_storm_alerts
  for each row execute function set_tenant_id();

-- ---------- RLS: identical to jobs_rw (015) ----------
alter table crm_storm_alerts enable row level security;
drop policy if exists storm_alerts_rw on crm_storm_alerts;
create policy storm_alerts_rw on crm_storm_alerts for all to authenticated
  using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id());

-- ---------- realtime ----------
-- A storm raised by the scheduled function should reach a rep who
-- already has the app open, without them reloading to find out.
do $$ begin
  alter publication supabase_realtime add table crm_storm_alerts;
exception when duplicate_object then null; end $$;
