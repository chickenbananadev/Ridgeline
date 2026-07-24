-- ============================================================
-- Ridgeline (005) — make user invites work without an Edge Function
--
-- Adding a seat previously required a deployed Edge Function. This
-- replaces that dependency: whenever Supabase creates an auth user
-- (from a dashboard invite, or any signup), a matching profile row
-- appears automatically, so the person can sign in and shows up in
-- Team & Seats immediately. Role and commission can then be set in
-- the app like any other seat.
-- ============================================================

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, title, active, commission_rate)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'rep'),
    coalesce(new.raw_user_meta_data->>'title', 'Sales Rep'),
    true,
    coalesce((new.raw_user_meta_data->>'commission_rate')::numeric, 60)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Backfill: anyone who already has a login but no profile row.
insert into public.profiles (id, name, email, role, title, active, commission_rate)
select u.id,
       coalesce(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
       u.email,
       coalesce(u.raw_user_meta_data->>'role', 'rep'),
       coalesce(u.raw_user_meta_data->>'title', 'Sales Rep'),
       true,
       60
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
