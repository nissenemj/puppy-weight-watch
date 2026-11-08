-- The HTTP service still verifies the current Auth user, confirmed email and
-- non-anonymous identity before accepting input or generation. These RPCs
-- remain service-only; this switch never grants access to another user's data.
alter table pentulaskuri_features.image_config
  add column access_mode text not null default 'allowlist'
  check (access_mode in ('allowlist', 'verified_users'));

create or replace function public.storybook_access(p_owner uuid) returns boolean
language sql stable security invoker set search_path = '' as $$
  select c.enabled and p_owner is not null and
    (c.access_mode='verified_users' or exists(
      select 1 from pentulaskuri_features.image_access a where a.user_id=p_owner
    ))
  from pentulaskuri_features.image_config c where c.id;
$$;

create or replace function public.reserve_storybook_input(p_owner uuid,p_id uuid) returns text
language plpgsql security invoker set search_path='' as $$
declare item public.storybook_inputs; cfg pentulaskuri_features.image_config; m date:=date_trunc('month',now() at time zone 'UTC')::date;
begin
  perform pg_advisory_xact_lock(8418337012);
  select * into cfg from pentulaskuri_features.image_config where id;
  if not coalesce(public.storybook_access(p_owner),false) then raise exception 'pilot_closed'; end if;
  select * into item from public.storybook_inputs where id=p_id;
  if found then
    if item.owner_id<>p_owner then raise exception 'input_missing'; end if;
    if item.expires_at<=now() then raise exception 'input_expired'; end if;
    return item.path;
  end if;
  if (select count(*) from public.storybook_inputs where owner_id=p_owner and created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')>=4 then raise exception 'input_limit'; end if;
  if (select count(*) from public.image_jobs where owner_id=p_owner and created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')>=cfg.daily_limit then raise exception 'daily_limit'; end if;
  if cfg.access_mode='allowlist' and (select count(*) from public.image_jobs)>=cfg.pilot_limit then raise exception 'pilot_limit'; end if;
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

revoke all on function public.storybook_access(uuid), public.reserve_storybook_input(uuid,uuid), public.reserve_storybook_image(uuid,uuid,jsonb) from public, anon, authenticated;
grant execute on function public.storybook_access(uuid), public.reserve_storybook_input(uuid,uuid), public.reserve_storybook_image(uuid,uuid,jsonb) to service_role;

-- Default remains allowlist. Open with a separately verified configuration
-- update after rollout; preserve enabled, budget, daily quota and spent costs.
