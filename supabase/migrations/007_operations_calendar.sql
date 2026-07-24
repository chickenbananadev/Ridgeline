-- Build 2: operational calendar metadata used for filtered views,
-- responsibility, conflict detection, and duration-aware scheduling.

alter table crm_appointments
  add column if not exists category text,
  add column if not exists assigned_to text,
  add column if not exists duration_min integer default 60,
  add column if not exists status text default 'Scheduled';

update crm_appointments
set
  category = coalesce(category, 'sales'),
  duration_min = coalesce(duration_min, 60),
  status = coalesce(status, 'Scheduled');

create index if not exists crm_appointments_date_assigned_idx
  on crm_appointments(date, assigned_to);
