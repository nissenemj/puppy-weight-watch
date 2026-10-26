-- Storage evaluates permissions in all applicable policies, even for another bucket.
-- Preserve the existing blog admin predicate without granting clients auth.users access.
BEGIN;
DO $migration$
DECLARE
  predicate text;
  update_predicate text;
  delete_predicate text;
  update_check text;
BEGIN
  SELECT pg_get_expr(polwithcheck, polrelid) INTO predicate
  FROM pg_policy WHERE polrelid = 'storage.objects'::regclass
    AND polname = 'Admins can upload blog images' AND polcmd = 'a' AND polpermissive;
  SELECT pg_get_expr(polqual, polrelid), pg_get_expr(polwithcheck, polrelid)
    INTO update_predicate, update_check
  FROM pg_policy WHERE polrelid = 'storage.objects'::regclass
    AND polname = 'Admins can update blog images' AND polcmd = 'w' AND polpermissive;
  SELECT pg_get_expr(polqual, polrelid) INTO delete_predicate
  FROM pg_policy WHERE polrelid = 'storage.objects'::regclass
    AND polname = 'Admins can delete blog images' AND polcmd = 'd' AND polpermissive;

  IF predicate IS NULL OR update_predicate IS DISTINCT FROM predicate
    OR delete_predicate IS DISTINCT FROM predicate
    OR (update_check IS NOT NULL AND update_check IS DISTINCT FROM predicate) THEN
    RAISE EXCEPTION 'Blog write policies differ from the reviewed structure; stop';
  END IF;

  IF predicate ~ '^\(?private[.]can_write_blog_images\(bucket_id\)\)?$' THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_proc
      WHERE oid = to_regprocedure('private.can_write_blog_images(text)') AND prosecdef
    ) THEN
      RAISE EXCEPTION 'Expected private blog lookup is missing';
    END IF;
  ELSE
    IF position('auth.users' IN predicate) = 0
      OR position('users.id = auth.uid()' IN predicate) = 0
      OR position('bucket_id = ''blog-images''::text' IN predicate) = 0 THEN
      RAISE EXCEPTION 'Unexpected blog admin predicate; stop without changing access';
    END IF;
    CREATE SCHEMA IF NOT EXISTS private;
    -- The function has no user-ID argument. It can only evaluate the caller's
    -- existing, database-backed admin predicate and returns one boolean.
    EXECUTE format(
      'CREATE FUNCTION private.can_write_blog_images(_bucket_id text)
       RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''''
       AS %L',
      'SELECT (SELECT auth.uid()) IS NOT NULL AND (' ||
      regexp_replace(predicate, '\mbucket_id\M', '_bucket_id', 'g') || ')'
    );
  END IF;

  REVOKE ALL ON FUNCTION private.can_write_blog_images(text) FROM PUBLIC, anon;
  GRANT USAGE ON SCHEMA private TO authenticated;
  GRANT EXECUTE ON FUNCTION private.can_write_blog_images(text) TO authenticated;
  ALTER POLICY "Admins can upload blog images" ON storage.objects TO authenticated
    WITH CHECK (private.can_write_blog_images(bucket_id));
  ALTER POLICY "Admins can update blog images" ON storage.objects TO authenticated
    USING (private.can_write_blog_images(bucket_id))
    WITH CHECK (private.can_write_blog_images(bucket_id));
  ALTER POLICY "Admins can delete blog images" ON storage.objects TO authenticated
    USING (private.can_write_blog_images(bucket_id));
END;
$migration$;
COMMIT;
