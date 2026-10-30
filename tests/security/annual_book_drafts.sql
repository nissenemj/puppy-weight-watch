-- Real PostgreSQL checks against the new migration in an isolated synthetic database.
CREATE FUNCTION test_support.expect_invalid_draft(statement text, message text)
RETURNS text LANGUAGE plpgsql AS $$
BEGIN
  BEGIN EXECUTE statement;
  EXCEPTION WHEN check_violation THEN RETURN 'ok - ' || message; END;
  RAISE EXCEPTION '%: invalid draft was accepted', message;
END;
$$;
CREATE FUNCTION test_support.draft_payload(book uuid)
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object('version', 1, 'puppyName', 'Nuppu', 'start', '2026-04-01',
    'end', '2027-03-31', 'includeWeights', true, 'memories',
    COALESCE(jsonb_agg(jsonb_build_object('id', id, 'date', '2026-06-03', 'included', true, 'mishap', false)), '[]'::jsonb))
  FROM public.memories WHERE book_id = book
$$;
SELECT test_support.assert_equal((SELECT (relrowsecurity AND relforcerowsecurity)::int FROM pg_class WHERE oid = 'public.annual_book_drafts'::regclass), 1, 'annual drafts always use RLS');
SELECT test_support.assert_equal(has_table_privilege('anon', 'public.annual_book_drafts', 'SELECT')::int, 0, 'anon has no draft table access');
SELECT test_support.assert_equal((SELECT count(*) FROM pg_proc WHERE oid IN ('private.guard_annual_book_draft()'::regprocedure, 'private.valid_annual_book_draft(jsonb)'::regprocedure) AND NOT prosecdef), 2, 'draft functions do not bypass RLS');
SELECT set_config('test_support.foreign_memory', (SELECT id::text FROM public.memories WHERE book_id = '10000000-0000-4000-8000-000000000002' LIMIT 1), false);
INSERT INTO public.puppy_books VALUES ('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001');

BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000001"}', true);
INSERT INTO public.annual_book_drafts(book_id, owner_id, payload) VALUES (
  '10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001',
  test_support.draft_payload('10000000-0000-4000-8000-000000000001')
);
SELECT test_support.assert_equal((SELECT count(*) FROM public.annual_book_drafts WHERE revision = 1 AND payload #>> '{memories,0,date}' = '2026-06-03'), 1, 'owner can create and read a confirmed event date');
SELECT test_support.expect_affected($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{memories,0,date}', '"2026-07-12"'), revision = 2
  WHERE book_id = '10000000-0000-4000-8000-000000000001' AND revision = 1
$sql$, 1, 'owner updates current revision');
SELECT test_support.expect_affected($sql$
  UPDATE public.annual_book_drafts SET revision = 2 WHERE revision = 1
$sql$, 0, 'a stale revision never overwrites a newer draft');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET revision = 2
$sql$, 'revision must advance even when a client skips its revision filter');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET book_id = '10000000-0000-4000-8000-000000000003', revision = 3
$sql$, 'a draft cannot be moved to another book');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET owner_id = '00000000-0000-4000-8000-000000000002', revision = 3
$sql$, 'a draft cannot be transferred to another owner');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{memories,0,id}', to_jsonb(current_setting('test_support.foreign_memory'))), revision = 3
$sql$, 'a private draft cannot reference another book memory');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{memories,0,date}', '"2026-02-30"'), revision = 3
$sql$, 'invalid calendar days are rejected');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = payload || '{"caption":"private source copy"}', revision = 3
$sql$, 'draft cannot silently store source text or URL fields');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{version}', '2'), revision = 3
$sql$, 'unknown format versions are rejected');
SELECT test_support.expect_denied('DELETE FROM public.annual_book_drafts', 'client has no implicit draft deletion permission');
UPDATE public.annual_book_drafts SET payload = jsonb_set(jsonb_set(payload, '{memories,0,included}', 'false'), '{puppyName}', '""'), revision = 3;
SELECT test_support.assert_equal((SELECT count(*) FROM public.annual_book_drafts WHERE payload #>> '{memories,0,date}' = '2026-07-12' AND payload #>> '{memories,0,included}' = 'false' AND payload->>'puppyName' = ''), 1, 'deselected dates and unfinished names survive together');
COMMIT;

-- Even if a book can be read publicly in a future feature, its draft stays private.
CREATE POLICY "Synthetic public book read" ON public.puppy_books FOR SELECT USING (true);
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000002"}', true);
SELECT test_support.assert_equal((SELECT count(*) FROM public.annual_book_drafts), 0, 'another owner cannot read private drafts');
SELECT test_support.expect_affected('UPDATE public.annual_book_drafts SET revision = 4', 0, 'another owner cannot update drafts');
SELECT test_support.expect_denied($sql$
  INSERT INTO public.annual_book_drafts(book_id, owner_id, payload) VALUES (
    '10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000002',
    '{"version":1,"puppyName":"Fake","start":"","end":"","includeWeights":false,"memories":[]}'
  )
$sql$, 'cannot insert a draft into another owners book');
INSERT INTO public.annual_book_drafts(book_id, owner_id, payload) VALUES (
  '10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002',
  test_support.draft_payload('10000000-0000-4000-8000-000000000002')
);
SELECT test_support.assert_equal((SELECT count(*) FROM public.annual_book_drafts), 1, 'a second owner can still create and read their own draft');
COMMIT;

BEGIN;
SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claims', '{"role":"anon"}', true);
SELECT test_support.expect_denied('SELECT * FROM public.annual_book_drafts', 'anonymous draft reads are denied');
SELECT test_support.expect_denied('UPDATE public.annual_book_drafts SET revision = 9', 'anonymous draft writes are denied');
ROLLBACK;
