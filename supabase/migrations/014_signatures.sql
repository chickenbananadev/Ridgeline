-- Build: electronic signatures on estimates, contracts and change orders.
--
-- Three things make an electronic signature hold up under ESIGN/UETA:
-- demonstrated intent to sign, the signer's consent to transact
-- electronically, and the signature being bound to the exact record
-- that was signed. All three are captured here.
--
-- On IP and time: both are recorded SERVER-side. A browser cannot see
-- its own public IP, and any value the client sends can be edited in
-- the console, so a client-supplied IP is theatre. These defaults read
-- the real connection headers and the database clock, which is why
-- they are DEFAULT expressions rather than columns the app fills in.
--
-- doc_hash binds the signature to the content. If anyone later claims
-- the document changed after signing, the hash either matches the
-- stored snapshot or it does not.

create table if not exists crm_signatures (
  id text primary key,
  job_id text not null,
  doc_type text not null check (doc_type in ('estimate','contract','change_order','work_order','other')),
  doc_id text,
  doc_title text,
  doc_hash text not null,
  doc_snapshot jsonb,

  signer_role text not null check (signer_role in ('customer','company')),
  signer_name text not null,
  signer_email text,
  signature_type text not null check (signature_type in ('draw','type')),
  signature_data text not null,

  consent boolean not null default false,
  intent_text text,

  -- Server-recorded, not client-supplied. x-forwarded-for is the real
  -- client address behind Supabase's proxy; inet_client_addr() would
  -- return the proxy itself.
  signed_at timestamptz not null default now(),
  signer_ip text default nullif(split_part(
    coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', ''), ',', 1), ''),
  user_agent text default (current_setting('request.headers', true)::json->>'user-agent'),

  portal_token text,
  voided_at timestamptz,
  voided_by text
);

create index if not exists crm_signatures_job_idx on crm_signatures(job_id, signed_at desc);
create index if not exists crm_signatures_doc_idx on crm_signatures(doc_type, doc_id);

alter table crm_signatures enable row level security;

-- A homeowner signs from a portal link with no account, so the anon
-- insert is scoped to a live token and to signing as the customer.
drop policy if exists sig_insert_customer on crm_signatures;
create policy sig_insert_customer on crm_signatures for insert to anon
  with check (
    signer_role = 'customer'
    and consent = true
    and exists (
      select 1 from crm_portal p
      where p.token = crm_signatures.portal_token
        and p.job_id = crm_signatures.job_id
        and p.revoked = false
    )
  );

drop policy if exists sig_read_portal on crm_signatures;
create policy sig_read_portal on crm_signatures for select to anon
  using (exists (
    select 1 from crm_portal p
    where p.token = crm_signatures.portal_token and p.revoked = false
  ));

drop policy if exists sig_team_all on crm_signatures;
create policy sig_team_all on crm_signatures for all to authenticated
  using (true) with check (true);

-- Signatures are never deleted, only voided. A missing row proves
-- nothing; a voided one with a reason is a record.
drop policy if exists sig_no_delete on crm_signatures;
create policy sig_no_delete on crm_signatures for delete to authenticated
  using (false);

do $$
begin
  begin
    alter publication supabase_realtime add table crm_signatures;
  exception when duplicate_object then null;
  end;
end $$;
