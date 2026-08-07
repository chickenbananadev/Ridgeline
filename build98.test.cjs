/* Build 98 — tenant isolation hardening: 5 real cross-tenant/same-
   tenant privacy bugs found by a direct RLS audit, all live in
   production today despite migration 015's tenant-scoping pass:

   1. crm_brand SELECT was `using(true)` for anon+authenticated —
      any signed-in user at any tenant could read every other
      tenant's branding directly via the REST API.
   2. crm_chat's UPDATE/DELETE policies (migrations 011-013) never
      got tenant-scoped by 015's rewrite pass.
   3. crm_user_integrations regressed from per-user (migration 010)
      to per-tenant-only isolation — same-tenant teammates could
      read/overwrite each other's integration tokens.
   4. crm_signatures's no-delete guarantee (migration 014) was
      silently replaced by a permissive tenant-scoped ALL policy.
   5. The job-files Storage bucket had zero tenant scoping at all —
      any authenticated user from any tenant could write/update/
      delete any object.

   Fix: new migration 026_tenant_isolation_hardening.sql closes all
   5, plus a minor is_tenant_locked() cross-tenant enumeration issue.
   The Storage fix requires the app to prefix new upload keys with
   the tenant id (uploadJobFile), since storage.objects has no
   tenant_id column to key RLS off of — only the object path.
*/
const fs = require("fs");
const path = require("path");
const migPath = path.join(__dirname, "supabase/migrations/026_tenant_isolation_hardening.sql");
const mig = fs.readFileSync(migPath, "utf8");
const src = fs.readFileSync(path.join(__dirname, "ridgeline.jsx"), "utf8");
let fails = 0;
const ok = (c, l) => { if (!c) { fails++; console.log("FAIL: " + l); } };

/* ---------- static: migration 026 exists and closes all 5 gaps ---------- */
ok(fs.existsSync(migPath), "migration 026_tenant_isolation_hardening.sql exists");

ok(/create policy brand_read_public on crm_brand for select to authenticated\s*\n\s*using \(tenant_id = current_tenant_id\(\)\);/.test(mig),
  "crm_brand's SELECT policy is now tenant-scoped to authenticated only (anon dropped)");
ok(!/create policy brand_read_public on crm_brand for select to anon, authenticated using \(true\);/.test(mig),
  "the old crm_brand using(true)-to-anon policy is not re-created by this migration");

ok(/create policy chat_update_reactions on crm_chat for update to authenticated\s*\n\s*using \(tenant_id = current_tenant_id\(\)\) with check \(tenant_id = current_tenant_id\(\)\);/.test(mig),
  "crm_chat's reaction-update policy is now tenant-scoped");
ok(/create policy chat_update_own on crm_chat for update to authenticated\s*\n\s*using \(tenant_id = current_tenant_id\(\)\) with check \(tenant_id = current_tenant_id\(\)\);/.test(mig),
  "crm_chat's edit-update policy is now tenant-scoped");
ok(/create policy chat_delete on crm_chat for delete to authenticated\s*\n\s*using \(tenant_id = current_tenant_id\(\)\);/.test(mig),
  "crm_chat's delete policy is now tenant-scoped");

ok(/drop policy if exists crm_user_integrations_tenant_rw on crm_user_integrations;/.test(mig),
  "the tenant-only crm_user_integrations policy from migration 015 is dropped");
ok(/create policy user_integrations_own_select on crm_user_integrations\s*\n\s*for select to authenticated using \(auth\.uid\(\) = user_id\);/.test(mig),
  "crm_user_integrations read is restored to per-user scoping");
ok(/create policy user_integrations_own_update on crm_user_integrations\s*\n\s*for update to authenticated using \(auth\.uid\(\) = user_id\) with check \(auth\.uid\(\) = user_id\);/.test(mig),
  "crm_user_integrations write is restored to per-user scoping");

ok(/drop policy if exists crm_signatures_tenant_rw on crm_signatures;/.test(mig),
  "the permissive tenant-scoped ALL policy on crm_signatures is dropped");
ok(/create policy sig_no_delete on crm_signatures for delete to authenticated\s*\n\s*using \(false\);/.test(mig),
  "crm_signatures's no-delete guarantee is restored");
ok(/create policy sig_team_select on crm_signatures for select to authenticated/.test(mig) &&
   /create policy sig_team_insert on crm_signatures for insert to authenticated/.test(mig) &&
   /create policy sig_team_update on crm_signatures for update to authenticated/.test(mig),
  "crm_signatures keeps working tenant-scoped select/insert/update, split out from the old ALL policy");

ok(/\(storage\.foldername\(name\)\)\[1\] = current_tenant_id\(\)::text/.test(mig),
  "the job-files Storage write/update/delete policies now check a tenant-id path prefix");
const storageWriteCount = (mig.match(/\(storage\.foldername\(name\)\)\[1\] = current_tenant_id\(\)::text/g) || []).length;
ok(storageWriteCount >= 4, "the tenant-prefix check appears on all of insert/update(using+check)/delete (>=4 occurrences)");
ok(!/(drop|create) policy .*job_files_public_read/.test(mig),
  "the public read policy (migration 024) is deliberately left untouched by this migration");

ok(/where t\.id = p_tenant_id and t\.id = current_tenant_id\(\)/.test(mig),
  "is_tenant_locked() now refuses to answer for any tenant other than the caller's own");

/* ---------- static: app-side tenant-id-prefixed upload keys ---------- */
ok(/const currentTenantId = \(\) => \(typeof window !== "undefined" \? window\.__TENANT_ID__ \|\| null : null\);/.test(src),
  "a currentTenantId() accessor exists, mirroring the AUTH()/DB() window-global pattern");
ok(/window\.__TENANT_ID__ = profile\.tenant_id \|\| null;/.test(src),
  "the boot-hydrate effect sets window.__TENANT_ID__ once the signed-in user's profile loads");
ok(/window\.__TENANT_ID__ = null; return; \}/.test(src),
  "signing out clears window.__TENANT_ID__ so it can't leak into a different account's session");
ok(/const tenantPrefix = currentTenantId\(\) \|\| "_shared";/.test(src),
  "uploadJobFile computes a tenant prefix for the storage key");
ok(/const key = `\$\{tenantPrefix\}\/\$\{jobId\}\/\$\{Date\.now\(\)\}_\$\{safe\}`;/.test(src),
  "uploadJobFile's storage key now leads with the tenant prefix, matching what the new Storage policies check");

/* ---------- behavioral: mirror the key-building + policy-check logic ---------- */
const buildKey = (tenantId, jobId, safe, now) => `${tenantId || "_shared"}/${jobId}/${now}_${safe}`;
const foldernameFirst = (key) => key.split("/")[0];

const keyA = buildKey("tenant-aaa", "job1", "photo.jpg", 1000);
ok(foldernameFirst(keyA) === "tenant-aaa", "a real tenant id ends up as the object key's first path segment, exactly what the SQL policy checks");

const keyNoTenant = buildKey(null, "job1", "photo.jpg", 1000);
ok(foldernameFirst(keyNoTenant) === "_shared", "with no known tenant (e.g. demo mode), the key falls back to a safe placeholder instead of a literal 'null'/'undefined' segment");

/* Mirror the policy's own logic: a write only passes when the key's
   first segment matches the caller's tenant. */
const policyAllows = (key, callerTenantId) => foldernameFirst(key) === callerTenantId;
ok(policyAllows(keyA, "tenant-aaa") === true, "a tenant writing under its own prefix passes the simulated policy check");
ok(policyAllows(keyA, "tenant-bbb") === false, "a different tenant's key is correctly rejected by the simulated policy check");

if (fails) { console.log("\nbuild 98: " + fails + " FAILED"); process.exit(1); }
console.log("build 98 tests passed");
