-- Update RLS policies to use role-based system instead of hardcoded emails

-- Update socialization_categories policies
DROP POLICY IF EXISTS "Admin can manage socialization categories" ON public.socialization_categories;
CREATE POLICY "Admin can manage socialization categories"
ON public.socialization_categories
FOR ALL
TO authenticated
USING (public.current_user_has_role('admin'))
WITH CHECK (public.current_user_has_role('admin'));

-- Update socialization_items policies  
DROP POLICY IF EXISTS "Admin can manage socialization items" ON public.socialization_items;
CREATE POLICY "Admin can manage socialization items"
ON public.socialization_items
FOR ALL
TO authenticated
USING (public.current_user_has_role('admin'))
WITH CHECK (public.current_user_has_role('admin'));

-- Update socialization_weekly_tasks policies
DROP POLICY IF EXISTS "Admin can manage weekly tasks" ON public.socialization_weekly_tasks;
CREATE POLICY "Admin can manage weekly tasks"
ON public.socialization_weekly_tasks
FOR ALL
TO authenticated
USING (public.current_user_has_role('admin'))
WITH CHECK (public.current_user_has_role('admin'));

-- Update vaccination_templates policies
DROP POLICY IF EXISTS "Admin can manage vaccination templates" ON public.vaccination_templates;
CREATE POLICY "Admin can manage vaccination templates"
ON public.vaccination_templates
FOR ALL
TO authenticated
USING (public.current_user_has_role('admin'))
WITH CHECK (public.current_user_has_role('admin'));

-- Update dog_foods policies
DROP POLICY IF EXISTS "Admin can delete dog foods" ON public.dog_foods;
DROP POLICY IF EXISTS "Admin can update dog foods" ON public.dog_foods;

CREATE POLICY "Admin can delete dog foods"
ON public.dog_foods
FOR DELETE
TO authenticated
USING (public.current_user_has_role('admin'));

CREATE POLICY "Admin can update dog foods"
ON public.dog_foods
FOR UPDATE
TO authenticated
USING (public.current_user_has_role('admin'));

-- Update dosage_images policies
DROP POLICY IF EXISTS "Users can delete their own dosage images or admin can delete an" ON public.dosage_images;
DROP POLICY IF EXISTS "Users can view their own dosage images or admin can view all" ON public.dosage_images;

CREATE POLICY "Users can delete their own dosage images or admin can delete any"
ON public.dosage_images
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.current_user_has_role('admin'));

CREATE POLICY "Users can view their own dosage images or admin can view all"
ON public.dosage_images
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.current_user_has_role('admin'));

-- Update dosage_table_data policies
DROP POLICY IF EXISTS "Users can create dosage table data for their images or admin ca" ON public.dosage_table_data;
DROP POLICY IF EXISTS "Users can delete dosage table data for their images or admin ca" ON public.dosage_table_data;
DROP POLICY IF EXISTS "Users can update dosage table data for their images or admin ca" ON public.dosage_table_data;
DROP POLICY IF EXISTS "Users can view dosage table data for their images or admin can " ON public.dosage_table_data;

CREATE POLICY "Users can create dosage table data for their images or admin can create any"
ON public.dosage_table_data
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM dosage_images 
    WHERE dosage_images.id = dosage_table_data.dosage_image_id 
    AND dosage_images.user_id = auth.uid()
  ) OR public.current_user_has_role('admin')
);

CREATE POLICY "Users can delete dosage table data for their images or admin can delete any"
ON public.dosage_table_data
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM dosage_images 
    WHERE dosage_images.id = dosage_table_data.dosage_image_id 
    AND dosage_images.user_id = auth.uid()
  ) OR public.current_user_has_role('admin')
);

CREATE POLICY "Users can update dosage table data for their images or admin can update any"
ON public.dosage_table_data
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM dosage_images 
    WHERE dosage_images.id = dosage_table_data.dosage_image_id 
    AND dosage_images.user_id = auth.uid()
  ) OR public.current_user_has_role('admin')
);

CREATE POLICY "Users can view dosage table data for their images or admin can view all"
ON public.dosage_table_data
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM dosage_images 
    WHERE dosage_images.id = dosage_table_data.dosage_image_id 
    AND dosage_images.user_id = auth.uid()
  ) OR public.current_user_has_role('admin')
);

-- Update general_dosage_guidelines policies
DROP POLICY IF EXISTS "Users can create their own guidelines or admin can create any" ON public.general_dosage_guidelines;
DROP POLICY IF EXISTS "Users can delete their own guidelines or admin can delete any" ON public.general_dosage_guidelines;
DROP POLICY IF EXISTS "Users can update their own guidelines or admin can update any" ON public.general_dosage_guidelines;
DROP POLICY IF EXISTS "Users can view their own guidelines or admin can view all" ON public.general_dosage_guidelines;

CREATE POLICY "Users can create their own guidelines or admin can create any"
ON public.general_dosage_guidelines
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.current_user_has_role('admin'));

CREATE POLICY "Users can delete their own guidelines or admin can delete any"
ON public.general_dosage_guidelines
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.current_user_has_role('admin'));

CREATE POLICY "Users can update their own guidelines or admin can update any"
ON public.general_dosage_guidelines
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.current_user_has_role('admin'));

CREATE POLICY "Users can view their own guidelines or admin can view all"
ON public.general_dosage_guidelines
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.current_user_has_role('admin'));

-- Update general_dosage_table_rows policies
DROP POLICY IF EXISTS "Users can create table rows for their guidelines or admin can c" ON public.general_dosage_table_rows;
DROP POLICY IF EXISTS "Users can delete table rows for their guidelines or admin can d" ON public.general_dosage_table_rows;
DROP POLICY IF EXISTS "Users can update table rows for their guidelines or admin can u" ON public.general_dosage_table_rows;
DROP POLICY IF EXISTS "Users can view table rows for their guidelines or admin can vie" ON public.general_dosage_table_rows;

CREATE POLICY "Users can create table rows for their guidelines or admin can create any"
ON public.general_dosage_table_rows
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM general_dosage_guidelines 
    WHERE general_dosage_guidelines.id = general_dosage_table_rows.guideline_id 
    AND general_dosage_guidelines.user_id = auth.uid()
  ) OR public.current_user_has_role('admin')
);

CREATE POLICY "Users can delete table rows for their guidelines or admin can delete any"
ON public.general_dosage_table_rows
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM general_dosage_guidelines 
    WHERE general_dosage_guidelines.id = general_dosage_table_rows.guideline_id 
    AND general_dosage_guidelines.user_id = auth.uid()
  ) OR public.current_user_has_role('admin')
);

CREATE POLICY "Users can update table rows for their guidelines or admin can update any"
ON public.general_dosage_table_rows
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM general_dosage_guidelines 
    WHERE general_dosage_guidelines.id = general_dosage_table_rows.guideline_id 
    AND general_dosage_guidelines.user_id = auth.uid()
  ) OR public.current_user_has_role('admin')
);

CREATE POLICY "Users can view table rows for their guidelines or admin can view all"
ON public.general_dosage_table_rows
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM general_dosage_guidelines 
    WHERE general_dosage_guidelines.id = general_dosage_table_rows.guideline_id 
    AND general_dosage_guidelines.user_id = auth.uid()
  ) OR public.current_user_has_role('admin')
);

-- Update onboarding_progress policies
DROP POLICY IF EXISTS "Admin can view all onboarding progress" ON public.onboarding_progress;
CREATE POLICY "Admin can view all onboarding progress"
ON public.onboarding_progress
FOR SELECT
TO authenticated
USING (public.current_user_has_role('admin'));