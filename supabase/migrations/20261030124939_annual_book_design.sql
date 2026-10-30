-- Local preparation only. Version 1 drafts remain readable and valid.
-- Cover choices and the optional private letter are stored in version 2.
BEGIN;
CREATE OR REPLACE FUNCTION private.valid_annual_book_draft(data jsonb)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  item jsonb;
  design jsonb;
  event_day text;
  ids text[] := ARRAY[]::text[];
  selected integer := 0;
BEGIN
  IF data IS NULL OR jsonb_typeof(data) <> 'object' OR octet_length(data::text) > 65536 THEN RETURN false; END IF;
  IF data->'version' = '2'::jsonb THEN
    design := data->'design';
    IF design IS NULL OR jsonb_typeof(design) <> 'object'
      OR NOT (design ?& ARRAY['title','palette','coverArt','letter'])
      OR design - ARRAY['title','palette','coverArt','letter'] <> '{}'::jsonb
      OR jsonb_typeof(design->'title') <> 'string' OR char_length(design->>'title') > 60
      OR jsonb_typeof(design->'letter') <> 'string' OR char_length(design->>'letter') > 1200
      OR jsonb_typeof(design->'palette') <> 'string' OR jsonb_typeof(design->'coverArt') <> 'string'
      OR design->>'palette' NOT IN ('forest','lake','berry')
      OR design->>'coverArt' NOT IN ('photo','illustration') THEN RETURN false; END IF;
    data := jsonb_set(data - 'design', '{version}', '1');
  END IF;
  IF NOT (data ?& ARRAY['version','puppyName','start','end','includeWeights','memories'])
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
GRANT EXECUTE ON FUNCTION private.valid_annual_book_draft(jsonb) TO authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
