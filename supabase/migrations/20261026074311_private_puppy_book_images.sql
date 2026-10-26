-- Review candidate. Requires the signed-image frontend and approval of private images.
-- Does not rename or delete existing objects. Public food/blog images stay public.
BEGIN;

DO $storage$
DECLARE
  old_policy text;
  command_name text;
  policy_name text;
  safe_path constant text :=
    '(SELECT auth.uid()) IS NOT NULL
     AND name !~ ''(^|/)[.]{1,2}(/|$)''
     AND name !~ ''[[:cntrl:]]''
     AND position(chr(92) IN name) = 0
     AND position(''//'' IN name) = 0
     AND right(name, 1) <> ''/''';
  canonical_path constant text :=
    '(storage.foldername(name))[1] = (SELECT auth.uid())::text
     AND (
       (cardinality(storage.foldername(name)) = 2
        AND (storage.foldername(name))[2] = ''puppy-profile'')
       OR
       (cardinality(storage.foldername(name)) = 3
        AND (storage.foldername(name))[2] = ''books''
        AND (storage.foldername(name))[3] ~* ''^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'')
     )';
  legacy_path constant text :=
    'cardinality(storage.foldername(name)) = 1
     AND COALESCE(owner_id, owner::text) = (SELECT auth.uid())::text
     AND EXISTS (
         SELECT 1 FROM public.puppy_books book
         WHERE book.id::text = (storage.foldername(name))[1]
           AND book.owner_id = (SELECT auth.uid())
     )';
  own_new_path text;
  own_existing_path text;
BEGIN
  -- Distinguish user-folder paths from old book-folder paths. Book IDs are user-supplied
  -- UUIDs, so a book-ID lookup alone could claim another user's entire folder.
  own_new_path := format('(%s) AND (%s)', safe_path, canonical_path);
  own_existing_path := format('(%s) AND ((%s) OR (%s))', safe_path, canonical_path, legacy_path);
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'puppy-books') THEN
    RAISE EXCEPTION 'Missing puppy-books bucket; stop and review the target';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'storage' AND table_name = 'objects' AND column_name = 'owner_id' AND data_type = 'text'
  ) OR NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'storage' AND table_name = 'objects' AND column_name = 'owner' AND data_type = 'uuid'
  ) THEN
    RAISE EXCEPTION 'Expected Storage uploader metadata is missing; stop and review legacy ownership';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'storage' AND c.relname = 'objects' AND c.relrowsecurity
  ) THEN
    RAISE EXCEPTION 'Expected RLS on storage.objects; stop and review';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'puppy_books' AND column_name = 'owner_id'
  ) THEN
    RAISE EXCEPTION 'Missing puppy_books.owner_id; stop and review';
  END IF;

  -- A stricter SELECT policy cannot cancel an older permissive SELECT policy.
  FOREACH old_policy IN ARRAY ARRAY[
    'Users can view puppy book images',
    'Users can view images from puppy-books bucket',
    'Users can upload images to their puppy books',
    'Users can upload images to puppy-books bucket',
    'Users can update their puppy book images',
    'Users can update their images in puppy-books bucket',
    'Users can delete their puppy book images',
    'Users can delete their images from puppy-books bucket'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', old_policy);
  END LOOP;

  FOREACH command_name IN ARRAY ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE'] LOOP
    policy_name := 'puppy_book_owner_' || lower(command_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name || '_guard');
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name || '_anon_guard');

    -- An unauthenticated request must not need SELECT on the private books table.
    IF command_name = 'INSERT' THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR INSERT TO anon WITH CHECK (bucket_id <> ''puppy-books'')',
        policy_name || '_anon_guard');
    ELSIF command_name = 'UPDATE' THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon USING (bucket_id <> ''puppy-books'') WITH CHECK (bucket_id <> ''puppy-books'')',
        policy_name || '_anon_guard');
    ELSE
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR %s TO anon USING (bucket_id <> ''puppy-books'')',
        policy_name || '_anon_guard', command_name);
    END IF;

    IF command_name = 'INSERT' THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = ''puppy-books'' AND (%s))',
        policy_name, own_new_path);
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (bucket_id <> ''puppy-books'' OR (%s))',
        policy_name || '_guard', own_new_path);
    ELSIF command_name = 'UPDATE' THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = ''puppy-books'' AND (%s)) WITH CHECK (bucket_id = ''puppy-books'' AND (%s))',
        policy_name, own_existing_path, own_existing_path);
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR UPDATE TO authenticated USING (bucket_id <> ''puppy-books'' OR (%s)) WITH CHECK (bucket_id <> ''puppy-books'' OR (%s))',
        policy_name || '_guard', own_existing_path, own_existing_path);
    ELSE
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects FOR %s TO authenticated USING (bucket_id = ''puppy-books'' AND (%s))',
        policy_name, command_name, own_existing_path);
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR %s TO authenticated USING (bucket_id <> ''puppy-books'' OR (%s))',
        policy_name || '_guard', command_name, own_existing_path);
    END IF;
  END LOOP;

  UPDATE storage.buckets
  SET public = false,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
  WHERE id = 'puppy-books';
END;
$storage$;

COMMIT;
