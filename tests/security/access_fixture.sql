-- Reduced, synthetic schema for real PostgreSQL RLS tests, not a production restore.
-- Policy names/conditions and admin helpers match the inspected production metadata.
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE SCHEMA auth;
CREATE SCHEMA storage;
CREATE SCHEMA test_support;
GRANT USAGE ON SCHEMA public, auth, storage, test_support TO anon, authenticated;

CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
$$;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT (auth.jwt() ->> 'sub')::uuid
$$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$
  SELECT auth.jwt() ->> 'role'
$$;
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TABLE public.user_roles (
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  PRIMARY KEY (user_id, role)
);
CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE FUNCTION public.current_user_has_role(_role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), _role)
$$;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.current_user_has_role('admin'))
  WITH CHECK (public.current_user_has_role('admin'));
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
INSERT INTO public.user_roles VALUES
  ('00000000-0000-4000-8000-000000000001', 'user'),
  ('00000000-0000-4000-8000-000000000002', 'user'),
  ('00000000-0000-4000-8000-000000000003', 'admin'),
  -- An anonymous Auth account must remain blocked even if a role is misassigned.
  ('00000000-0000-4000-8000-000000000004', 'admin');

DO $fixture$
DECLARE
  table_name text;
  insert_role text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'dog_foods', 'feeding_guidelines', 'food_ingredients',
    'food_allergens', 'food_nutrition', 'food_manufacturers'
  ] LOOP
    EXECUTE format('CREATE TABLE public.%I (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), label text NOT NULL)', table_name);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('INSERT INTO public.%I VALUES (''20000000-0000-4000-8000-000000000001'', ''Synthetic food'')', table_name);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING (true)',
      'Everyone can view ' || replace(table_name, '_', ' '), table_name);
    insert_role := CASE WHEN table_name IN ('dog_foods', 'feeding_guidelines')
      THEN 'authenticated' ELSE 'PUBLIC' END;
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO %s WITH CHECK (true)',
      'Authenticated users can create ' || replace(table_name, '_', ' '), table_name, insert_role);
  END LOOP;
END;
$fixture$;
CREATE POLICY "Admin can update dog foods" ON public.dog_foods FOR UPDATE TO authenticated
  USING (public.current_user_has_role('admin'));
CREATE POLICY "Admin can delete dog foods" ON public.dog_foods FOR DELETE TO authenticated
  USING (public.current_user_has_role('admin'));

CREATE TABLE public.puppy_books (id uuid PRIMARY KEY, owner_id uuid NOT NULL);
INSERT INTO public.puppy_books VALUES
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002');
ALTER TABLE public.puppy_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own puppy books" ON public.puppy_books FOR SELECT
  USING (auth.uid() = owner_id);
CREATE POLICY "Users can create their own puppy books" ON public.puppy_books FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own puppy books" ON public.puppy_books FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE TABLE public.memories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), book_id uuid REFERENCES public.puppy_books);
INSERT INTO public.memories (book_id) VALUES
  ('10000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000002');
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view memories for their books" ON public.memories FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.puppy_books b WHERE b.id = memories.book_id AND b.owner_id = auth.uid())
);
CREATE POLICY "Users can create memories for their books" ON public.memories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.puppy_books b WHERE b.id = memories.book_id AND b.owner_id = auth.uid())
);

CREATE TABLE storage.buckets (id text PRIMARY KEY, public boolean, file_size_limit bigint, allowed_mime_types text[]);
INSERT INTO storage.buckets (id, public) VALUES ('puppy-books', true), ('food-images', true), ('blog-images', true);
CREATE TABLE storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text REFERENCES storage.buckets,
  name text NOT NULL,
  owner_id text DEFAULT auth.uid()::text,
  owner uuid,
  UNIQUE (bucket_id, name)
);
CREATE FUNCTION storage.foldername(name text) RETURNS text[] LANGUAGE sql IMMUTABLE AS $$
  SELECT (string_to_array(name, '/'))[1:cardinality(string_to_array(name, '/')) - 1]
$$;
INSERT INTO storage.objects (bucket_id, name, owner_id) VALUES
  ('puppy-books', '00000000-0000-4000-8000-000000000001/puppy-profile/a.jpg', '00000000-0000-4000-8000-000000000001'),
  ('puppy-books', '00000000-0000-4000-8000-000000000002/puppy-profile/b.jpg', '00000000-0000-4000-8000-000000000002'),
  ('puppy-books', '10000000-0000-4000-8000-000000000001/legacy-a.jpg', '00000000-0000-4000-8000-000000000001'),
  ('puppy-books', '10000000-0000-4000-8000-000000000002/legacy-b.jpg', '00000000-0000-4000-8000-000000000002'),
  ('puppy-books', '10000000-0000-4000-8000-000000000099/orphan.jpg', NULL),
  ('food-images', 'catalog/food.jpg', NULL),
  ('blog-images', 'catalog/blog.jpg', NULL);
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view puppy book images" ON storage.objects FOR SELECT
  USING (bucket_id = 'puppy-books');
CREATE POLICY "Users can view images from puppy-books bucket" ON storage.objects FOR SELECT
  USING (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload images to puppy-books bucket" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their images in puppy-books bucket" ON storage.objects FOR UPDATE
  USING (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their images from puppy-books bucket" ON storage.objects FOR DELETE
  USING (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Anyone can view food images" ON storage.objects FOR SELECT USING (bucket_id = 'food-images');
CREATE POLICY "Anyone can view blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO anon, authenticated;
