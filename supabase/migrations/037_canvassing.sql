-- ============================================================
-- 037 — canvassing / door knocking
--
-- Reps working a storm neighborhood get a real place to work: a pin
-- per door, a disposition, the prospect's details, and the knock
-- history behind it.
--
-- WHY A TABLE, not another key in crm_org.data
--
-- Crews, stages and price lists ride inside the crm_org blob because
-- there are a dozen of each and the whole array is rewritten on every
-- save. Canvassing is thousands of rows per company, mutated by
-- several reps at once while they stand on the same street. A
-- whole-array rewrite per knock would lose writes to last-writer-wins
-- the moment two people work the same block, which is the normal
-- case, not the edge case.
--
-- VISIBILITY is company-wide, deliberately. A pin only one rep can
-- see does not stop a second rep knocking the same door twenty
-- minutes later — preventing that is most of the point. Attribution
-- lives in created_by / assigned_to and in each history entry, so who
-- did what stays clear without hiding rows from anyone.
--
-- HISTORY is append-only in a jsonb array. A door knocked three times
-- over a season is one pin with three entries, never one pin whose
-- earlier visits were overwritten by the latest status.
--
-- job_id is null until a knock becomes real work. A pin is not a job:
-- putting every "not home" on the pipeline board would wreck the
-- board, the close rate and every stage-age alert that reads it.
--
-- Mirrors 015's tenant machinery exactly — tenant_id column, the
-- shared set_tenant_id() insert trigger, and the same for-all policy
-- shape as jobs_rw.
--
-- Idempotent. Safe to re-run.
-- ============================================================

create table if not exists crm_canvass (
  id text primary key,
  lat double precision not null,
  lng double precision not null,
  address text default '',
  status text not null default 'new',
  prospect jsonb not null default '{}'::jsonb,   -- name, phone, email, bestTime
  notes text default '',
  history jsonb not null default '[]'::jsonb,    -- [{at, by, byId, status, note}]
  assigned_to uuid,
  created_by uuid default auth.uid(),
  job_id text,
  knocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- tenant scoping, same shape as every other table ----------
alter table crm_canvass add column if not exists tenant_id uuid references tenants(id);
create index if not exists crm_canvass_tenant_idx on crm_canvass(tenant_id);

-- The map asks for "pins inside these bounds" on every pan, so the
-- index that matters is tenant + position, not tenant alone.
create index if not exists crm_canvass_bbox_idx on crm_canvass(tenant_id, lat, lng);
-- The list view and the scoreboard both read recent-first per tenant.
create index if not exists crm_canvass_knocked_idx on crm_canvass(tenant_id, knocked_at desc);

drop trigger if exists stamp_tenant on crm_canvass;
create trigger stamp_tenant before insert on crm_canvass
  for each row execute function set_tenant_id();

-- ---------- RLS: identical to jobs_rw (015) ----------
alter table crm_canvass enable row level security;
drop policy if exists canvass_rw on crm_canvass;
create policy canvass_rw on crm_canvass for all to authenticated
  using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id());

-- ---------- realtime ----------
-- Two reps on one street need to see each other's pins appear without
-- reloading; that is the whole reason this is shared data.
do $$ begin
  alter publication supabase_realtime add table crm_canvass;
exception when duplicate_object then null; end $$;
