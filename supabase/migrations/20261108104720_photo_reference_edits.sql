-- Reference-photo edits supersede text-only creation. Existing completed results remain readable.
create table public.storybook_inputs (
  id uuid primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  path text not null unique, created_at timestamptz not null default now(),
  expires_at timestamptz not null default now()+interval '24 hours',
  check (path=owner_id::text||'/'||id::text||'.png')
);
create index storybook_inputs_owner_date on public.storybook_inputs(owner_id,created_at desc);
alter table public.storybook_inputs enable row level security;
revoke all on public.storybook_inputs from public,anon,authenticated;
grant select on public.storybook_inputs to authenticated;
grant all on public.storybook_inputs to service_role;
create policy storybook_inputs_owner_read on public.storybook_inputs for select to authenticated using(owner_id=(select auth.uid()));

do $$ declare c record; begin
  for c in select conname from pg_constraint where conrelid='public.image_jobs'::regclass and contype='c' and pg_get_constraintdef(oid) like '%nordic-watercolor-v1%' loop
    execute format('alter table public.image_jobs drop constraint %I',c.conname);
  end loop;
end $$;
alter table public.image_jobs add constraint image_jobs_supported_style
check(jsonb_typeof(spec)='object' and spec->>'style' in ('nordic-watercolor-v1','dog-photo-transform-v1'));

create function public.reserve_storybook_input(p_owner uuid,p_id uuid) returns text
language plpgsql security invoker set search_path='' as $$
declare item public.storybook_inputs; cfg pentulaskuri_features.image_config; m date:=date_trunc('month',now() at time zone 'UTC')::date;
begin
  perform pg_advisory_xact_lock(8418337012);
  select * into cfg from pentulaskuri_features.image_config where id;
  if not cfg.enabled or not exists(select 1 from pentulaskuri_features.image_access where user_id=p_owner) then raise exception 'pilot_closed'; end if;
  select * into item from public.storybook_inputs where id=p_id;
  if found then
    if item.owner_id<>p_owner then raise exception 'input_missing'; end if;
    if item.expires_at<=now() then raise exception 'input_expired'; end if;
    return item.path;
  end if;
  if (select count(*) from public.storybook_inputs where owner_id=p_owner and created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')>=4 then raise exception 'input_limit'; end if;
  if (select count(*) from public.image_jobs where owner_id=p_owner and created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')>=cfg.daily_limit then raise exception 'daily_limit'; end if;
  if (select count(*) from public.image_jobs)>=cfg.pilot_limit then raise exception 'pilot_limit'; end if;
  if exists(select 1 from pentulaskuri_features.image_budgets where month=m and (blocked or spent_micros+reserved_micros+cfg.reserve_per_job_micros>cfg.monthly_budget_micros)) then raise exception 'budget_limit'; end if;
  insert into public.storybook_inputs(id,owner_id,path) values(p_id,p_owner,p_owner::text||'/'||p_id::text||'.png') returning * into item;
  return item.path;
end $$;

create or replace function public.reserve_storybook_image(p_owner uuid,p_request uuid,p_spec jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare old public.image_jobs; cfg pentulaskuri_features.image_config; budget pentulaskuri_features.image_budgets; m date:=date_trunc('month',now() at time zone 'UTC')::date;
begin
  perform pg_advisory_xact_lock(8418337012);
  select * into old from public.image_jobs where owner_id=p_owner and request_id=p_request;
  if found then
    if old.spec<>p_spec then raise exception 'request_conflict'; end if;
    return to_jsonb(old);
  end if;
  select * into cfg from pentulaskuri_features.image_config where id;
  if not cfg.enabled or not exists(select 1 from pentulaskuri_features.image_access where user_id=p_owner) then raise exception 'pilot_closed'; end if;
  if p_spec->>'style' is distinct from 'dog-photo-transform-v1' then raise exception 'invalid_request'; end if;
  if not exists(select 1 from public.storybook_inputs i join storage.objects o on o.bucket_id='storybook-inputs' and o.name=i.path
    where i.owner_id=p_owner and i.path=p_spec->>'inputPath' and i.expires_at>now()) then raise exception 'input_missing'; end if;
  if (select count(*) from public.image_jobs where owner_id=p_owner and created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')>=cfg.daily_limit then raise exception 'daily_limit'; end if;
  if (select count(*) from public.image_jobs)>=cfg.pilot_limit then raise exception 'pilot_limit'; end if;
  if exists(select 1 from public.image_jobs where owner_id=p_owner and status in ('queued','processing')) then raise exception 'job_in_progress'; end if;
  insert into pentulaskuri_features.image_budgets(month) values(m) on conflict do nothing;
  select * into budget from pentulaskuri_features.image_budgets where month=m for update;
  if budget.blocked or budget.reserved_micros+budget.spent_micros+cfg.reserve_per_job_micros>cfg.monthly_budget_micros then raise exception 'budget_limit'; end if;
  insert into public.image_jobs(owner_id,request_id,spec,budget_month,reserved_micros) values(p_owner,p_request,p_spec,m,cfg.reserve_per_job_micros) returning * into old;
  update pentulaskuri_features.image_budgets set reserved_micros=reserved_micros+cfg.reserve_per_job_micros where month=m;
  return to_jsonb(old);
end $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('storybook-inputs','storybook-inputs',false,5242880,array['image/png']) on conflict(id) do nothing;
do $$ begin if exists(select 1 from storage.buckets where id='storybook-inputs' and public) then raise exception 'Input bucket must be private'; end if; end $$;
create policy storybook_input_read on storage.objects for select to authenticated
using(bucket_id='storybook-inputs' and exists(select 1 from public.storybook_inputs i where i.path=name and i.owner_id=(select auth.uid()) and i.expires_at>now()));
create policy storybook_input_insert on storage.objects for insert to authenticated
with check(bucket_id='storybook-inputs' and exists(select 1 from public.storybook_inputs i where i.path=name and i.owner_id=(select auth.uid()) and i.expires_at>now()));
create policy storybook_input_delete on storage.objects for delete to authenticated
using(bucket_id='storybook-inputs' and exists(select 1 from public.storybook_inputs i where i.path=name and i.owner_id=(select auth.uid())));
create policy storybook_input_read_guard on storage.objects as restrictive for select to authenticated
using(bucket_id<>'storybook-inputs' or exists(select 1 from public.storybook_inputs i where i.path=name and i.owner_id=(select auth.uid()) and i.expires_at>now()));
create policy storybook_input_anon_read_guard on storage.objects as restrictive for select to anon using(bucket_id<>'storybook-inputs');
create policy storybook_input_insert_guard on storage.objects as restrictive for insert to authenticated
with check(bucket_id<>'storybook-inputs' or exists(select 1 from public.storybook_inputs i where i.path=name and i.owner_id=(select auth.uid()) and i.expires_at>now()));
create policy storybook_input_anon_insert_guard on storage.objects as restrictive for insert to anon with check(bucket_id<>'storybook-inputs');
create policy storybook_input_update_guard on storage.objects as restrictive for update to anon,authenticated using(bucket_id<>'storybook-inputs') with check(bucket_id<>'storybook-inputs');
create policy storybook_input_delete_guard on storage.objects as restrictive for delete to authenticated
using(bucket_id<>'storybook-inputs' or exists(select 1 from public.storybook_inputs i where i.path=name and i.owner_id=(select auth.uid())));
create policy storybook_input_anon_delete_guard on storage.objects as restrictive for delete to anon using(bucket_id<>'storybook-inputs');

create function public.expired_storybook_inputs() returns table(path text)
language sql stable security invoker set search_path='' as $$
  select candidates.path from (
    select i.path from public.storybook_inputs i where i.expires_at<now()
    union
    select o.name from storage.objects o where o.bucket_id='storybook-inputs' and o.created_at<now()-interval '24 hours'
      and not exists(select 1 from public.storybook_inputs i where i.path=o.name)
  ) candidates where not exists(select 1 from public.image_jobs j where j.spec->>'inputPath'=candidates.path and j.status in ('queued','processing')) limit 20;
$$;
create function public.finish_storybook_input_cleanup(p_paths text[]) returns void
language sql security invoker set search_path='' as $$
  delete from public.storybook_inputs i where i.path=any(p_paths) and i.expires_at<now()
    and not exists(select 1 from public.image_jobs j where j.spec->>'inputPath'=i.path and j.status in ('queued','processing'));
$$;
revoke all on function public.reserve_storybook_input(uuid,uuid),public.expired_storybook_inputs(),public.finish_storybook_input_cleanup(text[]) from public,anon,authenticated;
grant execute on function public.reserve_storybook_input(uuid,uuid),public.expired_storybook_inputs(),public.finish_storybook_input_cleanup(text[]) to service_role;
