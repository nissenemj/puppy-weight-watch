-- Run only after an approved cloud release. No provider key belongs in this SQL.
-- Create Vault secrets privately beforehand:
-- pentulaskuri_feature_base_url = https://<project>.supabase.co/functions/v1
-- pentulaskuri_feature_refresh_secret = the same random secret as FEATURE_REFRESH_SECRET
-- OPENAI_API_KEY belongs only in Edge Function secrets. Image access defaults to closed.
begin;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
do $$
declare endpoint text; secret text;
begin
  select decrypted_secret into endpoint from vault.decrypted_secrets where name='pentulaskuri_feature_base_url';
  select decrypted_secret into secret from vault.decrypted_secrets where name='pentulaskuri_feature_refresh_secret';
  if endpoint is null or endpoint !~ '^https://[a-z0-9]+\.supabase\.co/functions/v1$'
    or secret is null or length(secret)<32 then
    raise exception 'Set the approved function base URL and refresh secret in Vault first';
  end if;
end $$;

-- Replace only these two task-owned schedules when applying again.
do $$ declare job record; begin
  for job in select jobid from cron.job where jobname in ('pentulaskuri-safety-refresh','pentulaskuri-image-delivery') loop
    perform cron.unschedule(job.jobid);
  end loop;
end $$;
select cron.schedule('pentulaskuri-safety-refresh','*/30 * * * *',$job$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='pentulaskuri_feature_base_url') || '/safety-news',
    headers := jsonb_build_object('Content-Type','application/json','x-refresh-secret',
      (select decrypted_secret from vault.decrypted_secrets where name='pentulaskuri_feature_refresh_secret')),
    body := '{}'::jsonb, timeout_milliseconds := 25000);
$job$);
select cron.schedule('pentulaskuri-image-delivery','* * * * *',$job$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='pentulaskuri_feature_base_url') || '/storybook-images/work',
    headers := jsonb_build_object('Content-Type','application/json','x-refresh-secret',
      (select decrypted_secret from vault.decrypted_secrets where name='pentulaskuri_feature_refresh_secret')),
    body := '{}'::jsonb, timeout_milliseconds := 150000);
$job$);
commit;
