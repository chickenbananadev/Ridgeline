-- The "job-files" Storage bucket every upload in the app depends on
-- (job photos, punch-list photos, company documents, contract
-- attachments) was never created by a migration or documented in
-- DEPLOY.md — a real production project hits "Bucket not found" the
-- first time anyone uploads anything. uploadJobFile() already degrades
-- gracefully to an inline data URL when Storage isn't available, but a
-- real deployment should have working Storage, not the 3 MB inline cap.
--
-- Public read is required because the app calls getPublicUrl() and
-- stores that URL directly (no signed-URL scheme anywhere in the
-- client) — object keys embed the job's UUID and an upload timestamp,
-- so they aren't guessable, but they are not access-controlled per
-- tenant. Multi-tenant object-level isolation would need the upload
-- path itself to carry a tenant id and RLS keyed off it; that's a
-- larger change than "create the bucket" and out of scope here.
insert into storage.buckets (id, name, public)
values ('job-files', 'job-files', true)
on conflict (id) do nothing;

drop policy if exists job_files_public_read on storage.objects;
create policy job_files_public_read on storage.objects
  for select to public using (bucket_id = 'job-files');

drop policy if exists job_files_authenticated_write on storage.objects;
create policy job_files_authenticated_write on storage.objects
  for insert to authenticated with check (bucket_id = 'job-files');

drop policy if exists job_files_authenticated_update on storage.objects;
create policy job_files_authenticated_update on storage.objects
  for update to authenticated using (bucket_id = 'job-files') with check (bucket_id = 'job-files');

drop policy if exists job_files_authenticated_delete on storage.objects;
create policy job_files_authenticated_delete on storage.objects
  for delete to authenticated using (bucket_id = 'job-files');
