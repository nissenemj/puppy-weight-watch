-- Local synthetic database only. Exercise the existing owner policies with v2 data.
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000001"}', true);
SELECT test_support.assert_equal((SELECT count(*) FROM public.annual_book_drafts WHERE payload->'version' = '1'::jsonb), 1, 'design migration preserves the existing v1 draft');
UPDATE public.annual_book_drafts SET payload = payload || '{"version":2,"design":{"title":"Nupun oma vuosi","palette":"lake","coverArt":"illustration","letter":"Pieni ystäväni, muistan sinusta tämän."}}'::jsonb, revision = revision + 1;
SELECT test_support.assert_equal((SELECT count(*) FROM public.annual_book_drafts WHERE revision = 4 AND payload #>> '{design,palette}' = 'lake' AND payload #>> '{memories,0,date}' = '2026-07-12' AND payload #>> '{design,letter}' = 'Pieni ystäväni, muistan sinusta tämän.'), 1, 'v2 stores design and a private letter while retaining the event date');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{design,palette}', '"neon"'), revision = 5
$sql$, 'unknown palettes are rejected');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{design,palette}', 'null'), revision = 5
$sql$, 'a JSON null palette is rejected');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{design,coverArt}', 'null'), revision = 5
$sql$, 'a JSON null cover art is rejected');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{design,letter}', to_jsonb(repeat('a', 1201))), revision = 5
$sql$, 'the letter length is bounded');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{design,title}', to_jsonb(repeat('a', 61))), revision = 5
$sql$, 'the custom title length is bounded');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{design,imageUrl}', '"https://external.invalid/private"'), revision = 5
$sql$, 'design cannot store an arbitrary image URL');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = payload - 'design', revision = 5
$sql$, 'version 2 requires its complete design');
SELECT test_support.expect_invalid_draft($sql$
  UPDATE public.annual_book_drafts SET payload = jsonb_set(payload, '{version}', '3'), revision = 5
$sql$, 'future format versions are rejected');
COMMIT;
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000002"}', true);
SELECT test_support.assert_equal((SELECT count(*) FROM public.annual_book_drafts WHERE book_id = '10000000-0000-4000-8000-000000000001'), 0, 'a second owner cannot read the private letter or cover choices');
ROLLBACK;
