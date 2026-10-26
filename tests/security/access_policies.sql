CREATE FUNCTION test_support.assert_equal(actual bigint, expected bigint, message text)
RETURNS text LANGUAGE plpgsql AS $$
BEGIN
  IF actual IS DISTINCT FROM expected THEN
    RAISE EXCEPTION '%: expected %, got %', message, expected, actual;
  END IF;
  RETURN 'ok - ' || message;
END;
$$;
CREATE FUNCTION test_support.expect_denied(statement text, message text)
RETURNS text LANGUAGE plpgsql AS $$
BEGIN
  BEGIN
    EXECUTE statement;
  EXCEPTION WHEN insufficient_privilege THEN
    RETURN 'ok - ' || message;
  END;
  RAISE EXCEPTION '%: the forbidden statement succeeded', message;
END;
$$;
CREATE FUNCTION test_support.expect_affected(statement text, expected bigint, message text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE affected bigint;
BEGIN
  EXECUTE statement;
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN test_support.assert_equal(affected, expected, message);
END;
$$;
CREATE FUNCTION test_support.expect_no_write(statement text, message text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE affected bigint;
BEGIN
  BEGIN
    EXECUTE statement;
    GET DIAGNOSTICS affected = ROW_COUNT;
  EXCEPTION WHEN insufficient_privilege THEN
    RETURN 'ok - ' || message;
  END;
  RETURN test_support.assert_equal(affected, 0, message);
END;
$$;

-- Configuration checks are separate from the tests executed as non-superusers.
SELECT test_support.assert_equal((SELECT count(*) FROM storage.buckets WHERE id = 'puppy-books' AND NOT public AND file_size_limit = 5242880), 1, 'puppy-book bucket is private with a 5 MiB upload limit');
SELECT test_support.assert_equal((SELECT count(*) FROM storage.buckets WHERE id IN ('food-images', 'blog-images') AND public), 2, 'public catalogue image buckets are unchanged');
SELECT test_support.assert_equal((SELECT count(*) FROM storage.buckets WHERE id = 'puppy-books' AND allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']), 1, 'private upload MIME allowlist is configured');

-- Public catalogue images must not depend on private-book table privileges.
REVOKE ALL ON public.puppy_books FROM anon;

BEGIN;
SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claims', '{"role":"anon"}', true);
DO $tests$
DECLARE table_name text; visible bigint;
BEGIN
  IF current_user <> 'anon' THEN RAISE EXCEPTION 'Not testing the anon database role'; END IF;
  FOREACH table_name IN ARRAY ARRAY['dog_foods','feeding_guidelines','food_ingredients','food_allergens','food_nutrition','food_manufacturers'] LOOP
    EXECUTE format('SELECT count(*) FROM public.%I', table_name) INTO visible;
    RAISE NOTICE '%', test_support.assert_equal(visible, 1, table_name || ': anon reading preserved');
    RAISE NOTICE '%', test_support.expect_denied(format('INSERT INTO public.%I(label) VALUES (''unauthorized'')', table_name), table_name || ': anon insert denied');
    RAISE NOTICE '%', test_support.expect_no_write(format('UPDATE public.%I SET label = ''unauthorized''', table_name), table_name || ': anon update denied');
    RAISE NOTICE '%', test_support.expect_no_write(format('DELETE FROM public.%I', table_name), table_name || ': anon delete denied');
  END LOOP;
END;
$tests$;
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE bucket_id = 'puppy-books'), 0, 'anon cannot read private image metadata');
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE bucket_id IN ('food-images','blog-images')), 2, 'anon can still read public catalogue image metadata');
SELECT test_support.expect_denied('INSERT INTO public.dog_foods(label) VALUES (''unauthorized'')', 'anon cannot insert a food');
ROLLBACK;

BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000001","is_anonymous":false,"user_metadata":{"role":"admin"}}', true);
DO $tests$
DECLARE table_name text; visible bigint;
BEGIN
  IF current_user <> 'authenticated' THEN RAISE EXCEPTION 'Not testing the authenticated database role'; END IF;
  FOREACH table_name IN ARRAY ARRAY['dog_foods','feeding_guidelines','food_ingredients','food_allergens','food_nutrition','food_manufacturers'] LOOP
    EXECUTE format('SELECT count(*) FROM public.%I', table_name) INTO visible;
    RAISE NOTICE '%', test_support.assert_equal(visible, 1, table_name || ': public reading preserved');
    RAISE NOTICE '%', test_support.expect_denied(format('INSERT INTO public.%I(label) VALUES (''unauthorized'')', table_name), table_name || ': ordinary user insert denied');
    RAISE NOTICE '%', test_support.expect_affected(format('UPDATE public.%I SET label = ''unauthorized''', table_name), 0, table_name || ': ordinary user update hidden');
    RAISE NOTICE '%', test_support.expect_affected(format('DELETE FROM public.%I', table_name), 0, table_name || ': ordinary user delete hidden');
  END LOOP;
END;
$tests$;
SELECT test_support.expect_denied('INSERT INTO public.user_roles VALUES (''00000000-0000-4000-8000-000000000001'', ''admin'')', 'user cannot grant themselves the admin role');
SELECT test_support.assert_equal((SELECT count(*) FROM public.puppy_books), 1, 'A sees only their own book');
SELECT test_support.assert_equal((SELECT count(*) FROM public.memories), 1, 'A sees only memories in their own book');
SELECT test_support.expect_denied('INSERT INTO public.memories(book_id) VALUES (''10000000-0000-4000-8000-000000000002'')', 'A cannot attach a memory to B book');
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE bucket_id = 'puppy-books'), 2, 'A reads their own current and legacy image paths');
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE name LIKE '%legacy-b.jpg'), 0, 'A cannot read B legacy image');
SELECT test_support.expect_affected('INSERT INTO storage.objects(bucket_id,name) VALUES (''puppy-books'',''00000000-0000-4000-8000-000000000001/puppy-profile/new.jpg'')', 1, 'A can upload below their own user ID');
SELECT test_support.expect_affected('INSERT INTO storage.objects(bucket_id,name) VALUES (''puppy-books'',''00000000-0000-4000-8000-000000000001/books/10000000-0000-4000-8000-000000000001/new.jpg'')', 1, 'A can upload a memory in the new user/book path');
SELECT test_support.expect_denied('INSERT INTO storage.objects(bucket_id,name) VALUES (''puppy-books'',''00000000-0000-4000-8000-000000000001/ambiguous-root.jpg'')', 'new ambiguous user/book root paths are rejected');
SELECT test_support.expect_denied('INSERT INTO storage.objects(bucket_id,name) VALUES (''puppy-books'',''00000000-0000-4000-8000-000000000002/attack.jpg'')', 'A cannot upload under B user ID');
SELECT test_support.expect_denied('INSERT INTO storage.objects(bucket_id,name) VALUES (''puppy-books'',''10000000-0000-4000-8000-000000000001/new-legacy.jpg'')', 'new uploads cannot use book-ID-only paths');
SELECT test_support.expect_denied('INSERT INTO storage.objects(bucket_id,name) VALUES (''puppy-books'',''00000000-0000-4000-8000-000000000001/../escape.jpg'')', 'traversal paths are rejected');
SELECT test_support.expect_denied('UPDATE storage.objects SET name = ''00000000-0000-4000-8000-000000000002/puppy-profile/stolen.jpg'' WHERE name = ''00000000-0000-4000-8000-000000000001/puppy-profile/new.jpg''', 'A cannot reassign a private image to B');
SELECT test_support.expect_affected('DELETE FROM storage.objects WHERE name LIKE ''%legacy-b.jpg''', 0, 'A cannot delete B image');
SELECT test_support.expect_affected('DELETE FROM storage.objects WHERE name LIKE ''%legacy-a.jpg''', 1, 'A can delete their own legacy image');
ROLLBACK;

BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000002","is_anonymous":false}', true);
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE bucket_id = 'puppy-books'), 2, 'B sees only their own current and legacy images');
-- Book IDs and Auth user IDs share the UUID format and must not grant each other's files.
SELECT test_support.expect_affected('INSERT INTO public.puppy_books(id,owner_id) VALUES (''00000000-0000-4000-8000-000000000001'',''00000000-0000-4000-8000-000000000002'')', 1, 'B may create an own book whose ID equals A user ID');
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE name LIKE '%/a.jpg'), 0, 'claiming a book ID equal to A user ID cannot expose A profile image');
ROLLBACK;

BEGIN;
-- Reverse collision and historical metadata are inserted only by the synthetic fixture owner.
INSERT INTO public.puppy_books(id,owner_id) VALUES ('00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001');
INSERT INTO storage.objects(bucket_id,name,owner_id,owner) VALUES
  ('puppy-books','00000000-0000-4000-8000-000000000002/collision-legacy-a.jpg','00000000-0000-4000-8000-000000000001',NULL),
  ('puppy-books','10000000-0000-4000-8000-000000000001/unattributed.jpg',NULL,NULL),
  ('puppy-books','10000000-0000-4000-8000-000000000001/old-owner-field.jpg',NULL,'00000000-0000-4000-8000-000000000001');
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000002","is_anonymous":false}', true);
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE name LIKE '%collision-legacy-a.jpg'), 0, 'B user-ID prefix cannot expose A legacy image');
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000001","is_anonymous":false}', true);
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE name LIKE '%collision-legacy-a.jpg'), 1, 'A retains an own legacy image despite the ID collision');
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE name LIKE '%unattributed.jpg'), 0, 'a book ID alone does not claim an image with unknown uploader');
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE name LIKE '%old-owner-field.jpg'), 1, 'verified deprecated uploader metadata remains compatible');
ROLLBACK;

BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000004","is_anonymous":true}', true);
DO $tests$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['dog_foods','feeding_guidelines','food_ingredients','food_allergens','food_nutrition','food_manufacturers'] LOOP
    RAISE NOTICE '%', test_support.expect_denied(format('INSERT INTO public.%I(label) VALUES (''unauthorized'')', table_name), table_name || ': anonymous Auth account cannot write');
    RAISE NOTICE '%', test_support.expect_affected(format('UPDATE public.%I SET label = ''unauthorized''', table_name), 0, table_name || ': anonymous Auth update denied');
    RAISE NOTICE '%', test_support.expect_affected(format('DELETE FROM public.%I', table_name), 0, table_name || ': anonymous Auth delete denied');
  END LOOP;
END;
$tests$;
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE bucket_id = 'puppy-books'), 0, 'an anonymous Auth account cannot read other owners images');
ROLLBACK;

BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000003","is_anonymous":false}', true);
DO $tests$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['dog_foods','feeding_guidelines','food_ingredients','food_allergens','food_nutrition','food_manufacturers'] LOOP
    RAISE NOTICE '%', test_support.expect_affected(format('INSERT INTO public.%I(id,label) VALUES (''20000000-0000-4000-8000-000000000002'',''Admin food'')', table_name), 1, table_name || ': admin insert works');
    RAISE NOTICE '%', test_support.expect_affected(format('UPDATE public.%I SET label = ''Admin edit'' WHERE id = ''20000000-0000-4000-8000-000000000002''', table_name), 1, table_name || ': admin update works');
    RAISE NOTICE '%', test_support.expect_affected(format('DELETE FROM public.%I WHERE id = ''20000000-0000-4000-8000-000000000002''', table_name), 1, table_name || ': admin delete works');
  END LOOP;
END;
$tests$;
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE bucket_id = 'puppy-books'), 0, 'catalogue admin has no blanket access to private images');
ROLLBACK;

-- Regression: an additional permissive policy must not reopen the protected writes.
DO $fixture$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['dog_foods','feeding_guidelines','food_ingredients','food_allergens','food_nutrition','food_manufacturers'] LOOP
    EXECUTE format('CREATE POLICY deliberately_broad_test_policy ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)', table_name);
    EXECUTE format('GRANT INSERT, UPDATE, DELETE ON public.%I TO anon', table_name);
  END LOOP;
END;
$fixture$;
CREATE POLICY deliberately_broad_test_policy ON storage.objects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000001","is_anonymous":false}', true);
SELECT test_support.expect_denied('INSERT INTO public.dog_foods(label) VALUES (''unauthorized'')', 'restrictive guard overrides a permissive catalogue policy');
SELECT test_support.expect_affected('UPDATE public.dog_foods SET label = ''unauthorized''', 0, 'restrictive guard also protects UPDATE');
SELECT test_support.expect_affected('DELETE FROM public.dog_foods', 0, 'restrictive guard also protects DELETE');
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE bucket_id = 'puppy-books'), 2, 'permissive storage policy cannot expose another owner images');
SELECT test_support.expect_denied('INSERT INTO storage.objects(bucket_id,name) VALUES (''puppy-books'',''00000000-0000-4000-8000-000000000002/bypass.jpg'')', 'permissive storage policy cannot bypass owner path');
ROLLBACK;
BEGIN;
SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claims', '{"role":"anon"}', true);
SELECT test_support.expect_denied('INSERT INTO public.food_ingredients(label) VALUES (''unauthorized'')', 'guard protects anon even if INSERT privilege is restored');
SELECT test_support.assert_equal((SELECT count(*) FROM storage.objects WHERE bucket_id = 'puppy-books'), 0, 'permissive storage policy cannot expose private images to anon');
ROLLBACK;
