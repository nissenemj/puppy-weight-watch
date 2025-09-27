-- Sprint 0 seed data
-- Creates a development user and sample puppy for local testing.

insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  role,
  aud,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'dev-owner@example.com',
  crypt('secret123', gen_salt('bf')),
  now(),
  now(),
  'authenticated',
  'authenticated',
  jsonb_build_object('provider', 'email'),
  '{}'::jsonb,
  now(),
  now()
)
on conflict (id) do nothing;

insert into public.users (id, email, display_name)
values (
  '11111111-1111-1111-1111-111111111111',
  'dev-owner@example.com',
  'Dev Owner'
)
on conflict (id) do update set email = excluded.email;

insert into public.puppies (
  id,
  owner_id,
  name,
  breed,
  size_category,
  date_of_birth,
  sex,
  notes
)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Muru',
  'Labrador Retriever',
  'large',
  current_date - interval '12 weeks',
  'female',
  'Seed data puppy for local development.'
)
on conflict (id) do update set name = excluded.name;
