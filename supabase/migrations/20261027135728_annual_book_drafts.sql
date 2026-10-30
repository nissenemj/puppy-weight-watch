-- Local preparation only. Apply to an approved test environment before release.
BEGIN;
CREATE SCHEMA IF NOT EXISTS private;

CREATE FUNCTION private.valid_annual_book_draft(data jsonb)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  item jsonb;
  event_day text;
  ids text[] := ARRAY[]::text[];
  selected integer := 0;
BEGIN
  IF data IS NULL OR jsonb_typeof(data) <> 'object' OR octet_length(data::text) > 65536
    OR NOT (data ?& ARRAY['version','puppyName','start','end','includeWeights','memories'])
    OR data - ARRAY['version','puppyName','start','end','includeWeights','memories'] <> '{}'::jsonb
    OR data->'version' IS DISTINCT FROM '1'::jsonb
    OR jsonb_typeof(data->'puppyName') <> 'string' OR char_length(data->>'puppyName') > 40
    OR jsonb_typeof(data->'includeWeights') <> 'boolean'
    OR jsonb_typeof(data->'memories') <> 'array' THEN RETURN false; END IF;
  IF jsonb_array_length(data->'memories') > 200 THEN RETURN false; END IF;
  FOREACH event_day IN ARRAY ARRAY[data->>'start', data->>'end'] LOOP
    IF event_day IS NULL OR jsonb_typeof(data->'start') <> 'string'
      OR jsonb_typeof(data->'end') <> 'string' THEN RETURN false; END IF;
    IF event_day <> '' AND (event_day !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
      OR to_char(event_day::date, 'YYYY-MM-DD') <> event_day) THEN RETURN false; END IF;
  END LOOP;
  FOR item IN SELECT value FROM jsonb_array_elements(data->'memories') LOOP
    IF jsonb_typeof(item) <> 'object'
      OR NOT (item ?& ARRAY['id','date','included','mishap'])
      OR item - ARRAY['id','date','included','mishap'] <> '{}'::jsonb
      OR jsonb_typeof(item->'id') <> 'string'
      OR item->>'id' !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      OR jsonb_typeof(item->'date') <> 'string'
      OR jsonb_typeof(item->'included') <> 'boolean' OR jsonb_typeof(item->'mishap') <> 'boolean'
      OR (item->>'id') = ANY(ids) THEN RETURN false; END IF;
    ids := array_append(ids, item->>'id');
    event_day := item->>'date';
    IF event_day <> '' AND (event_day !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
      OR to_char(event_day::date, 'YYYY-MM-DD') <> event_day) THEN RETURN false; END IF;
    IF (item->>'included')::boolean THEN selected := selected + 1; END IF;
  END LOOP;
  RETURN selected <= 24;
EXCEPTION WHEN invalid_datetime_format OR datetime_field_overflow THEN RETURN false;
END;
$$;
REVOKE ALL ON FUNCTION private.valid_annual_book_draft(jsonb) FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.valid_annual_book_draft(jsonb) TO authenticated;

CREATE TABLE public.annual_book_drafts (
  book_id uuid PRIMARY KEY REFERENCES public.puppy_books(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payload jsonb NOT NULL CHECK (private.valid_annual_book_draft(payload)),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX annual_book_drafts_owner_idx ON public.annual_book_drafts(owner_id);
ALTER TABLE public.annual_book_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_book_drafts FORCE ROW LEVEL SECURITY;
REVOKE ALL ON public.annual_book_drafts FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.annual_book_drafts TO authenticated;

CREATE POLICY "Owner can read annual draft" ON public.annual_book_drafts
FOR SELECT TO authenticated USING (
  owner_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.puppy_books b WHERE b.id = book_id AND b.owner_id = (SELECT auth.uid())
  )
);
CREATE POLICY "Owner can create annual draft" ON public.annual_book_drafts
FOR INSERT TO authenticated WITH CHECK (
  owner_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.puppy_books b WHERE b.id = book_id AND b.owner_id = (SELECT auth.uid())
  )
);
CREATE POLICY "Owner can update annual draft" ON public.annual_book_drafts
FOR UPDATE TO authenticated USING (
  owner_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.puppy_books b WHERE b.id = book_id AND b.owner_id = (SELECT auth.uid())
  )
) WITH CHECK (
  owner_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.puppy_books b WHERE b.id = book_id AND b.owner_id = (SELECT auth.uid())
  )
);

CREATE FUNCTION private.guard_annual_book_draft()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.revision <> 1 THEN RAISE check_violation USING MESSAGE = 'A new draft must start at revision 1'; END IF;
  ELSE
    IF NEW.book_id IS DISTINCT FROM OLD.book_id OR NEW.owner_id IS DISTINCT FROM OLD.owner_id
      OR NEW.revision <> OLD.revision + 1 THEN
      RAISE check_violation USING MESSAGE = 'Draft identity and revision cannot be overwritten';
    END IF;
  END IF;
  IF NOT private.valid_annual_book_draft(NEW.payload) THEN
    RAISE check_violation USING MESSAGE = 'Invalid annual draft data';
  END IF;
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(NEW.payload->'memories') choice
    WHERE NOT EXISTS (
      SELECT 1 FROM public.memories m WHERE m.id = (choice->>'id')::uuid AND m.book_id = NEW.book_id
    )
  ) THEN RAISE check_violation USING MESSAGE = 'Draft memories must belong to the selected book'; END IF;
  NEW.updated_at := clock_timestamp();
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.guard_annual_book_draft() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER guard_annual_book_draft BEFORE INSERT OR UPDATE ON public.annual_book_drafts
FOR EACH ROW EXECUTE FUNCTION private.guard_annual_book_draft();
NOTIFY pgrst, 'reload schema';
COMMIT;
