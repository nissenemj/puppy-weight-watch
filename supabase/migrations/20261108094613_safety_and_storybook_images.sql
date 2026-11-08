-- Public read-only notices; private generation controls. No commerce is enabled here.
create schema if not exists pentulaskuri_features;
revoke all on schema pentulaskuri_features from public, anon, authenticated;
grant usage on schema pentulaskuri_features to service_role;

create table public.safety_source_checks (
  source_id text primary key check (source_id in ('ruokavirasto-rehut', 'ruokavirasto-elaimet')),
  last_attempt_at timestamptz, last_success_at timestamptz,
  status text not null default 'never' check (status in ('never', 'ok', 'error')),
  error_code text, etag text, last_modified text, item_count integer not null default 0 check (item_count >= 0)
);
insert into public.safety_source_checks(source_id) values ('ruokavirasto-rehut'), ('ruokavirasto-elaimet');
create table public.safety_news_items (
  id text primary key,
  source_id text not null references public.safety_source_checks(source_id),
  title text not null check (char_length(title) between 1 and 500),
  url text not null unique check (url ~ '^https://www\.ruokavirasto\.fi/elaimet/'),
  published_at timestamptz,
  kind text not null check (kind in ('recall', 'warning', 'disease', 'notice')),
  region text,
  first_seen_at timestamptz not null default now(), last_seen_at timestamptz not null default now()
);
create index safety_news_published on public.safety_news_items(published_at desc nulls last);
alter table public.safety_source_checks enable row level security;
alter table public.safety_news_items enable row level security;
revoke all on public.safety_source_checks, public.safety_news_items from public, anon, authenticated;
grant select on public.safety_source_checks, public.safety_news_items to anon, authenticated;
grant all on public.safety_source_checks, public.safety_news_items to service_role;
create policy safety_checks_public_read on public.safety_source_checks for select to anon, authenticated using (true);
create policy safety_items_public_read on public.safety_news_items for select to anon, authenticated using (true);

create table pentulaskuri_features.refresh_lease (id boolean primary key default true check (id), until_at timestamptz not null default '-infinity');
insert into pentulaskuri_features.refresh_lease(id) values (true);
create function public.claim_safety_refresh() returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  update pentulaskuri_features.refresh_lease set until_at = now() + interval '2 minutes' where id and until_at < now();
  return found;
end $$;

create function public.save_safety_source(p_source text, p_items jsonb, p_check jsonb) returns void
language plpgsql security invoker set search_path = '' as $$
declare item jsonb;
begin
  if p_source not in ('ruokavirasto-rehut', 'ruokavirasto-elaimet') then raise exception 'invalid_source'; end if;
  if p_items is not null then
    for item in select value from jsonb_array_elements(p_items) loop
      insert into public.safety_news_items(id, source_id, title, url, published_at, kind, region)
      values (item->>'id', p_source, item->>'title', item->>'url', (item->>'published_at')::timestamptz, item->>'kind', item->>'region')
      on conflict(id) do update set title=excluded.title, published_at=excluded.published_at, kind=excluded.kind, region=excluded.region, last_seen_at=now();
    end loop;
  end if;
  update public.safety_source_checks set
    last_attempt_at=(p_check->>'last_attempt_at')::timestamptz,
    last_success_at=(p_check->>'last_success_at')::timestamptz,
    status=p_check->>'status', error_code=p_check->>'error_code',
    etag=p_check->>'etag', last_modified=p_check->>'last_modified',
    item_count=coalesce((p_check->>'item_count')::integer, item_count)
  where source_id=p_source;
end $$;

create table pentulaskuri_features.image_config (
  id boolean primary key default true check (id), enabled boolean not null default false,
  monthly_budget_micros bigint not null default 20000000 check (monthly_budget_micros between 0 and 20000000),
  reserve_per_job_micros bigint not null default 1000000 check (reserve_per_job_micros >= 1000000),
  daily_limit integer not null default 2 check (daily_limit between 1 and 2),
  pilot_limit integer not null default 10 check (pilot_limit between 1 and 10)
);
insert into pentulaskuri_features.image_config(id) values (true);
create table pentulaskuri_features.image_access (user_id uuid primary key references auth.users(id) on delete cascade);
create table pentulaskuri_features.image_budgets (
  month date primary key, reserved_micros bigint not null default 0 check (reserved_micros >= 0),
  spent_micros bigint not null default 0 check (spent_micros >= 0), blocked boolean not null default false
);
create table public.image_jobs (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null, spec jsonb not null,
  status text not null default 'queued' check (status in ('queued','processing','delivery_pending','delivery_failed','ready','failed','unknown')),
  budget_month date not null references pentulaskuri_features.image_budgets(month),
  reserved_micros bigint not null check (reserved_micros >= 0), cost_micros bigint,
  cost_is_estimate boolean not null default false,
  created_at timestamptz not null default now(), started_at timestamptz, finished_at timestamptz,
  object_path text, error_code text, provider_request_id text,
  delivery_attempts integer not null default 0, next_delivery_at timestamptz not null default now(),
  unique(owner_id, request_id),
  check (jsonb_typeof(spec) = 'object' and spec->>'style' = 'nordic-watercolor-v1')
);
create index image_jobs_owner_date on public.image_jobs(owner_id, created_at desc);
create index image_jobs_pending on public.image_jobs(created_at) where status in ('queued','processing','delivery_pending','delivery_failed');
alter table public.image_jobs enable row level security;
revoke all on public.image_jobs from public, anon, authenticated;
grant select on public.image_jobs to authenticated;
grant all on public.image_jobs to service_role;
create policy image_jobs_owner_read on public.image_jobs for select to authenticated using (owner_id=(select auth.uid()));
create table pentulaskuri_features.image_payloads (
  job_id uuid primary key references public.image_jobs(id) on delete cascade,
  png_base64 text not null check (char_length(png_base64) between 40 and 7000000),
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$')
);
create table pentulaskuri_features.image_book_copies (
  job_id uuid not null references public.image_jobs(id) on delete cascade,
  book_id uuid not null references public.puppy_books(id) on delete cascade,
  memory_id uuid not null references public.memories(id) on delete cascade,
  primary key(job_id, book_id)
);

-- Private tables have no client policies. Only the existing service role can use them.
-- Keep RLS enabled in addition to revoking client access to the entire schema.
alter table pentulaskuri_features.refresh_lease enable row level security;
alter table pentulaskuri_features.image_config enable row level security;
alter table pentulaskuri_features.image_access enable row level security;
alter table pentulaskuri_features.image_budgets enable row level security;
alter table pentulaskuri_features.image_payloads enable row level security;
alter table pentulaskuri_features.image_book_copies enable row level security;

create function public.storybook_access(p_owner uuid) returns boolean
language sql stable security invoker set search_path = '' as $$
  select c.enabled and exists(select 1 from pentulaskuri_features.image_access a where a.user_id=p_owner)
  from pentulaskuri_features.image_config c where c.id;
$$;

create function public.reserve_storybook_image(p_owner uuid, p_request uuid, p_spec jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare old public.image_jobs; cfg pentulaskuri_features.image_config; budget pentulaskuri_features.image_budgets; m date:=date_trunc('month', now() at time zone 'UTC')::date;
begin
  -- One transaction serializes global, daily and monthly reservations, including retries.
  perform pg_advisory_xact_lock(8418337012);
  select * into old from public.image_jobs where owner_id=p_owner and request_id=p_request;
  if found then
    if old.spec <> p_spec then raise exception 'request_conflict'; end if;
    return to_jsonb(old);
  end if;
  select * into cfg from pentulaskuri_features.image_config where id;
  if not cfg.enabled or not exists(select 1 from pentulaskuri_features.image_access where user_id=p_owner) then raise exception 'pilot_closed'; end if;
  -- The service-only HTTP handler checks the fresh Auth user and confirmed email.
  -- Do not grant the Data API role access to the private Auth users table.
  if (select count(*) from public.image_jobs where owner_id=p_owner and created_at >= date_trunc('day',now() at time zone 'UTC') at time zone 'UTC') >= cfg.daily_limit then raise exception 'daily_limit'; end if;
  if (select count(*) from public.image_jobs) >= cfg.pilot_limit then raise exception 'pilot_limit'; end if;
  if exists(select 1 from public.image_jobs where owner_id=p_owner and status in ('queued','processing')) then raise exception 'job_in_progress'; end if;
  insert into pentulaskuri_features.image_budgets(month) values(m) on conflict do nothing;
  select * into budget from pentulaskuri_features.image_budgets where month=m for update;
  if budget.blocked or budget.reserved_micros + budget.spent_micros + cfg.reserve_per_job_micros > cfg.monthly_budget_micros then raise exception 'budget_limit'; end if;
  insert into public.image_jobs(owner_id,request_id,spec,budget_month,reserved_micros)
  values(p_owner,p_request,p_spec,m,cfg.reserve_per_job_micros) returning * into old;
  update pentulaskuri_features.image_budgets set reserved_micros=reserved_micros+cfg.reserve_per_job_micros where month=m;
  return to_jsonb(old);
end $$;

create function public.claim_storybook_image(p_id uuid) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare job public.image_jobs;
begin
  update public.image_jobs set status='processing', started_at=now() where id=p_id and status='queued' returning * into job;
  if not found then return null; end if;
  return to_jsonb(job);
end $$;

create function public.fail_storybook_image(p_id uuid, p_code text, p_uncertain boolean) returns void
language plpgsql security invoker set search_path = '' as $$
declare job public.image_jobs;
begin
  select * into job from public.image_jobs where id=p_id for update;
  if not found or job.status not in ('queued','processing') then return; end if;
  if p_uncertain then
    -- Keep the full reservation and stop spending until an ambiguous provider result is reviewed.
    update pentulaskuri_features.image_budgets set blocked=true where month=job.budget_month;
  else
    update pentulaskuri_features.image_budgets set reserved_micros=reserved_micros-job.reserved_micros where month=job.budget_month;
  end if;
  update public.image_jobs set status=case when p_uncertain then 'unknown' else 'failed' end,
    reserved_micros=case when p_uncertain then reserved_micros else 0 end,
    error_code=p_code, finished_at=now() where id=p_id;
end $$;

create function public.store_storybook_result(p_id uuid,p_png text,p_sha256 text,p_cost bigint,p_provider_request text) returns void
language plpgsql security invoker set search_path = '' as $$
declare job public.image_jobs; billed bigint;
begin
  select * into job from public.image_jobs where id=p_id for update;
  if not found then raise exception 'job_not_found'; end if;
  if job.status in ('delivery_pending','delivery_failed','ready') then return; end if;
  if job.status <> 'processing' or p_cost < 0 then raise exception 'invalid_job_state'; end if;
  billed:=coalesce(p_cost,job.reserved_micros);
  insert into pentulaskuri_features.image_payloads(job_id,png_base64,sha256) values(p_id,p_png,p_sha256);
  update pentulaskuri_features.image_budgets set reserved_micros=reserved_micros-job.reserved_micros,
    spent_micros=spent_micros+billed, blocked=blocked or billed>job.reserved_micros where month=job.budget_month;
  update public.image_jobs set status='delivery_pending', cost_micros=billed,cost_is_estimate=p_cost is null,
    reserved_micros=0,provider_request_id=p_provider_request where id=p_id;
end $$;

create function public.storybook_payload(p_id uuid) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select to_jsonb(p) from pentulaskuri_features.image_payloads p where p.job_id=p_id;
$$;

create function public.finish_storybook_delivery(p_id uuid, p_path text, p_success boolean) returns void
language plpgsql security invoker set search_path = '' as $$
declare job public.image_jobs;
begin
  select * into job from public.image_jobs where id=p_id for update;
  if not found or job.status not in ('delivery_pending','delivery_failed') then return; end if;
  if p_success then
    if p_path <> job.owner_id::text||'/'||job.id::text||'.png' or not exists(select 1 from storage.objects where bucket_id='generated-storybook' and name=p_path) then raise exception 'image_missing'; end if;
    update public.image_jobs set status='ready',object_path=p_path,error_code=null,finished_at=now() where id=p_id;
    delete from pentulaskuri_features.image_payloads where job_id=p_id;
  else
    update public.image_jobs set status='delivery_failed',error_code='storage_delivery_failed',
      delivery_attempts=delivery_attempts+1,next_delivery_at=now()+least(30,power(2,least(delivery_attempts,5))::integer)*interval '1 minute' where id=p_id;
  end if;
end $$;

create function public.attach_storybook_image(p_owner uuid,p_job uuid,p_book uuid) returns uuid
language plpgsql security invoker set search_path = '' as $$
declare memory uuid; path text; job public.image_jobs;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_job::text||p_book::text,0));
  select * into job from public.image_jobs where id=p_job and owner_id=p_owner and status='ready';
  if not found or not exists(select 1 from public.puppy_books where id=p_book and owner_id=p_owner) then raise exception 'book_or_image_not_found'; end if;
  select memory_id into memory from pentulaskuri_features.image_book_copies where job_id=p_job and book_id=p_book;
  if found then return memory; end if;
  path:=p_owner::text||'/books/'||p_book::text||'/satukuva-'||p_job::text||'.png';
  if not exists(select 1 from storage.objects where bucket_id='puppy-books' and name=path) then raise exception 'book_image_missing'; end if;
  insert into public.memories(book_id,created_by,content_type,content_url,caption,tags)
  values(p_book,p_owner,'image',path,'Tekoälyllä luotu satukuva',array['satukuva','tekoälykuvitus']) returning id into memory;
  insert into pentulaskuri_features.image_book_copies(job_id,book_id,memory_id) values(p_job,p_book,memory);
  return memory;
end $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('generated-storybook','generated-storybook',false,5242880,array['image/png']) on conflict(id) do nothing;
do $$ begin
  if exists(select 1 from storage.buckets where id='generated-storybook' and public) then raise exception 'Generated image bucket must be private'; end if;
end $$;
create policy generated_storybook_owner_read on storage.objects for select to authenticated
using(bucket_id='generated-storybook' and (storage.foldername(name))[1]=(select auth.uid())::text);
-- Restrictive guards also protect this bucket when older unrelated policies are permissive.
create policy generated_storybook_read_guard on storage.objects as restrictive for select to authenticated
using(bucket_id<>'generated-storybook' or (storage.foldername(name))[1]=(select auth.uid())::text);
create policy generated_storybook_anon_read_guard on storage.objects as restrictive for select to anon
using(bucket_id<>'generated-storybook');
do $$ declare command_name text; begin
  foreach command_name in array array['INSERT','UPDATE','DELETE'] loop
    if command_name='INSERT' then
      execute 'create policy generated_storybook_insert_guard on storage.objects as restrictive for insert to anon, authenticated with check (bucket_id<>''generated-storybook'')';
    elsif command_name='UPDATE' then
      execute 'create policy generated_storybook_update_guard on storage.objects as restrictive for update to anon, authenticated using (bucket_id<>''generated-storybook'') with check (bucket_id<>''generated-storybook'')';
    else
      execute 'create policy generated_storybook_delete_guard on storage.objects as restrictive for delete to anon, authenticated using (bucket_id<>''generated-storybook'')';
    end if;
  end loop;
end $$;

-- Only the service role can mutate quotas/jobs or call privileged entry points.
grant all on all tables in schema pentulaskuri_features to service_role;
do $$ declare t record; f record; begin
  for t in select tablename from pg_tables where schemaname='pentulaskuri_features' loop
    execute format('alter table pentulaskuri_features.%I enable row level security',t.tablename);
  end loop;
  for f in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname=any(array['claim_safety_refresh','save_safety_source','storybook_access','reserve_storybook_image','claim_storybook_image','fail_storybook_image','store_storybook_result','storybook_payload','finish_storybook_delivery','attach_storybook_image']) loop
    execute format('revoke all on function %s from public, anon, authenticated',f.signature);
    execute format('grant execute on function %s to service_role',f.signature);
  end loop;
end $$;
