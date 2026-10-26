-- Review candidate. Not part of the automatic migration chain.
-- Apply only after the SQL, role tests and production change have been approved.
BEGIN;

DO $catalog$
DECLARE
  table_name text;
  command_name text;
  policy_name text;
  admin_check constant text :=
    '(SELECT auth.uid()) IS NOT NULL
     AND NOT COALESCE(((SELECT auth.jwt()) ->> ''is_anonymous'')::boolean, false)
     AND public.current_user_has_role(''admin''::public.app_role)';
BEGIN
  IF to_regprocedure('public.current_user_has_role(public.app_role)') IS NULL THEN
    RAISE EXCEPTION 'Missing current_user_has_role(app_role); review the target schema';
  END IF;

  FOREACH table_name IN ARRAY ARRAY[
    'dog_foods', 'feeding_guidelines', 'food_ingredients',
    'food_allergens', 'food_nutrition', 'food_manufacturers'
  ] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = table_name AND c.relrowsecurity
    ) THEN
      RAISE EXCEPTION 'Expected RLS-enabled public.% is missing; stop and review', table_name;
    END IF;

    -- Remove the known permissive INSERT policy, including policies targeting PUBLIC.
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I',
      'Authenticated users can create ' || replace(table_name, '_', ' '), table_name);

    -- Public reading is unchanged. Table privileges alone cannot enforce admin access.
    EXECUTE format('REVOKE INSERT, UPDATE, DELETE ON public.%I FROM PUBLIC, anon', table_name);
    EXECUTE format('GRANT INSERT, UPDATE, DELETE ON public.%I TO authenticated', table_name);

    FOREACH command_name IN ARRAY ARRAY['INSERT', 'UPDATE', 'DELETE'] LOOP
      policy_name := 'catalog_admin_' || lower(command_name);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name || '_guard', table_name);

      IF command_name = 'INSERT' THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (%s)',
          policy_name, table_name, admin_check);
        EXECUTE format(
          'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (%s)',
          policy_name || '_guard', table_name, admin_check);
      ELSIF command_name = 'UPDATE' THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (%s) WITH CHECK (%s)',
          policy_name, table_name, admin_check, admin_check);
        EXECUTE format(
          'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (%s) WITH CHECK (%s)',
          policy_name || '_guard', table_name, admin_check, admin_check);
      ELSE
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (%s)',
          policy_name, table_name, admin_check);
        EXECUTE format(
          'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (%s)',
          policy_name || '_guard', table_name, admin_check);
      END IF;
    END LOOP;
  END LOOP;
END;
$catalog$;

COMMIT;
