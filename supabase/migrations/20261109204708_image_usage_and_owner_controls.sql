-- Keep billing and request counts when a user removes an image.
alter table public.image_jobs add column deleted_at timestamptz,
  add column purged_at timestamptz,
  add column feedback text check (feedback in ('keep','improve')),
  add constraint image_purge_requires_deletion check (purged_at is null or deleted_at is not null);
create index image_jobs_cleanup on public.image_jobs(deleted_at) where deleted_at is not null and purged_at is null;

create function public.storybook_usage(p_owner uuid) returns jsonb
language plpgsql stable security invoker set search_path='' as $$
declare cfg pentulaskuri_features.image_config; budget pentulaskuri_features.image_budgets;
  used integer; uploads integer; why text; day_start timestamptz:=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC';
begin
  select * into cfg from pentulaskuri_features.image_config where id;
  select * into budget from pentulaskuri_features.image_budgets where month=date_trunc('month',now() at time zone 'UTC')::date;
  select count(*) into used from public.image_jobs where owner_id=p_owner and created_at>=day_start;
  select count(*) into uploads from public.storybook_inputs where owner_id=p_owner and created_at>=day_start;
  why:=case
    when not coalesce(public.storybook_access(p_owner),false) then 'pilot_closed'
    when coalesce(budget.blocked,false) or coalesce(budget.spent_micros,0)+coalesce(budget.reserved_micros,0)+cfg.reserve_per_job_micros>cfg.monthly_budget_micros then 'budget_limit'
    when used>=cfg.daily_limit then 'daily_limit'
    when uploads>=4 then 'input_limit'
    when cfg.access_mode='allowlist' and (select count(*) from public.image_jobs)>=cfg.pilot_limit then 'pilot_limit'
    when exists(select 1 from public.image_jobs where owner_id=p_owner and status in ('queued','processing','delivery_pending')) then 'job_in_progress'
    else null end;
  return jsonb_build_object('daily_limit',cfg.daily_limit,'daily_used',used,'daily_remaining',greatest(0,cfg.daily_limit-used),'resets_at',day_start+interval '1 day','reason',why,
    'deletions_pending',(select count(*) from public.image_jobs where owner_id=p_owner and deleted_at is not null and purged_at is null));
end $$;

create function public.request_storybook_deletion(p_owner uuid,p_job uuid) returns void
language plpgsql security invoker set search_path='' as $$
declare job public.image_jobs;
begin
  select * into job from public.image_jobs where id=p_job and owner_id=p_owner for update;
  if not found then raise exception 'not_found'; end if;
  if job.deleted_at is not null then return; end if;
  if job.status not in ('ready','failed') or job.reserved_micros<>0 then raise exception 'image_busy'; end if;
  update public.image_jobs set deleted_at=now(),feedback=null,
    spec=case when spec->>'style'='dog-photo-transform-v1' then jsonb_set(spec,'{notes}','""'::jsonb) else spec end
    where id=p_job;
  delete from pentulaskuri_features.image_payloads where job_id=p_job;
end $$;

create function public.finish_storybook_deletion(p_job uuid) returns void
language sql security invoker set search_path='' as $$
  update public.image_jobs set purged_at=now(),object_path=null where id=p_job and deleted_at is not null and purged_at is null;
$$;

create function public.rate_storybook_image(p_owner uuid,p_job uuid,p_rating text) returns void
language plpgsql security invoker set search_path='' as $$
begin
  if p_rating not in ('keep','improve') or p_rating is null then raise exception 'invalid_request'; end if;
  update public.image_jobs set feedback=p_rating where id=p_job and owner_id=p_owner and status='ready' and deleted_at is null;
  if not found then raise exception 'not_found'; end if;
end $$;

-- No new signed URLs or direct owner reads after deletion. Existing signed
-- URLs expire in 60 seconds; storage removal is retried by the minute worker.
alter policy image_jobs_owner_read on public.image_jobs using (owner_id=(select auth.uid()) and deleted_at is null);
alter policy generated_storybook_read_guard on storage.objects using (
  bucket_id<>'generated-storybook' or exists(select 1 from public.image_jobs j
    where j.owner_id=(select auth.uid()) and name=j.owner_id::text||'/'||j.id::text||'.png' and j.deleted_at is null)
);

create or replace function public.attach_storybook_image(p_owner uuid,p_job uuid,p_book uuid) returns uuid
language plpgsql security invoker set search_path='' as $$
declare memory uuid; path text; job public.image_jobs;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_job::text||p_book::text,0));
  select * into job from public.image_jobs where id=p_job and owner_id=p_owner and status='ready' and deleted_at is null for update;
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

revoke all on function public.storybook_usage(uuid),public.request_storybook_deletion(uuid,uuid),public.finish_storybook_deletion(uuid),public.rate_storybook_image(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.storybook_usage(uuid),public.request_storybook_deletion(uuid,uuid),public.finish_storybook_deletion(uuid),public.rate_storybook_image(uuid,uuid,text) to service_role;

-- An attachment already in flight can finish its upload after deletion.
-- Never remove a committed book memory or an independently referenced copy.
create function public.orphaned_storybook_copies() returns table(path text)
language sql stable security invoker set search_path='' as $$
  select o.name from public.image_jobs j
  join public.puppy_books b on b.owner_id=j.owner_id
  join storage.objects o on o.bucket_id='puppy-books' and o.name=j.owner_id::text||'/books/'||b.id::text||'/satukuva-'||j.id::text||'.png'
  where j.deleted_at is not null
    and not exists(select 1 from pentulaskuri_features.image_book_copies c where c.job_id=j.id and c.book_id=b.id)
    and not exists(select 1 from public.memories m where m.content_url=o.name)
  limit 20;
$$;
revoke all on function public.orphaned_storybook_copies() from public,anon,authenticated;
grant execute on function public.orphaned_storybook_copies() to service_role;

-- A deleted request remains counted and must never be replayed.
create or replace function public.reserve_storybook_image(p_owner uuid,p_request uuid,p_spec jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare old public.image_jobs; cfg pentulaskuri_features.image_config; budget pentulaskuri_features.image_budgets; m date:=date_trunc('month',now() at time zone 'UTC')::date;
begin
  perform pg_advisory_xact_lock(8418337012);
  select * into old from public.image_jobs where owner_id=p_owner and request_id=p_request;
  if found then
    if old.deleted_at is not null then raise exception 'not_found'; end if;
    if old.spec<>p_spec then raise exception 'request_conflict'; end if;
    return to_jsonb(old);
  end if;
  select * into cfg from pentulaskuri_features.image_config where id;
  if not coalesce(public.storybook_access(p_owner),false) then raise exception 'pilot_closed'; end if;
  if p_spec->>'style' is distinct from 'dog-photo-transform-v1' then raise exception 'invalid_request'; end if;
  if not exists(select 1 from public.storybook_inputs i join storage.objects o on o.bucket_id='storybook-inputs' and o.name=i.path
    where i.owner_id=p_owner and i.path=p_spec->>'inputPath' and i.expires_at>now()) then raise exception 'input_missing'; end if;
  if (select count(*) from public.image_jobs where owner_id=p_owner and created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')>=cfg.daily_limit then raise exception 'daily_limit'; end if;
  if cfg.access_mode='allowlist' and (select count(*) from public.image_jobs)>=cfg.pilot_limit then raise exception 'pilot_limit'; end if;
  if exists(select 1 from public.image_jobs where owner_id=p_owner and status in ('queued','processing')) then raise exception 'job_in_progress'; end if;
  insert into pentulaskuri_features.image_budgets(month) values(m) on conflict do nothing;
  select * into budget from pentulaskuri_features.image_budgets where month=m for update;
  if budget.blocked or budget.reserved_micros+budget.spent_micros+cfg.reserve_per_job_micros>cfg.monthly_budget_micros then raise exception 'budget_limit'; end if;
  insert into public.image_jobs(owner_id,request_id,spec,budget_month,reserved_micros) values(p_owner,p_request,p_spec,m,cfg.reserve_per_job_micros) returning * into old;
  update pentulaskuri_features.image_budgets set reserved_micros=reserved_micros+cfg.reserve_per_job_micros where month=m;
  return to_jsonb(old);
end $$;
