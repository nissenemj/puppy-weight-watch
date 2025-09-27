create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone(''utc'', now());
  return new;
end;
$$ language plpgsql;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  display_name text,
  created_at timestamptz not null default timezone(''utc'', now()),
  updated_at timestamptz not null default timezone(''utc'', now())
);

drop trigger if exists set_timestamp_users on public.users;
create trigger set_timestamp_users
before update on public.users
for each row
execute function public.set_updated_at();

create table if not exists public.puppies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  breed text,
  size_category text,
  date_of_birth date,
  sex text check (sex in (''female'', ''male'', ''unknown'')),
  notes text,
  created_at timestamptz not null default timezone(''utc'', now()),
  updated_at timestamptz not null default timezone(''utc'', now())
);

drop trigger if exists set_timestamp_puppies on public.puppies;
create trigger set_timestamp_puppies
before update on public.puppies
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.puppies enable row level security;

drop policy if exists "Users select own profile" on public.users;
create policy "Users select own profile" on public.users
  for select using (auth.uid() = id);

drop policy if exists "Users manage own profile" on public.users;
create policy "Users manage own profile" on public.users
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Owners read puppies" on public.puppies;
create policy "Owners read puppies" on public.puppies
  for select using (auth.uid() = owner_id);

drop policy if exists "Owners manage puppies" on public.puppies;
create policy "Owners manage puppies" on public.puppies
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
