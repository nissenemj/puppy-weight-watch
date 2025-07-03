-- Update policies for dosage_table_data to allow admin to edit all data
DROP POLICY IF EXISTS "Users can update dosage table data for their images" ON public.dosage_table_data;
DROP POLICY IF EXISTS "Users can create dosage table data for their images" ON public.dosage_table_data;

-- Allow admin to create dosage table data for any image
CREATE POLICY "Users can create dosage table data for their images or admin can create any" 
ON public.dosage_table_data 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.dosage_images 
    WHERE id = dosage_table_data.dosage_image_id 
    AND user_id = auth.uid()
  ) OR
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

-- Allow admin to update dosage table data for any image
CREATE POLICY "Users can update dosage table data for their images or admin can update any" 
ON public.dosage_table_data 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.dosage_images 
    WHERE id = dosage_table_data.dosage_image_id 
    AND user_id = auth.uid()
  ) OR
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

-- Update view policy to allow admin to see all dosage table data
DROP POLICY IF EXISTS "Users can view dosage table data for their images" ON public.dosage_table_data;

CREATE POLICY "Users can view dosage table data for their images or admin can view all" 
ON public.dosage_table_data 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.dosage_images 
    WHERE id = dosage_table_data.dosage_image_id 
    AND user_id = auth.uid()
  ) OR
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

-- Update dosage_images view policy to allow admin to see all images
DROP POLICY IF EXISTS "Users can view their own dosage images" ON public.dosage_images;

CREATE POLICY "Users can view their own dosage images or admin can view all" 
ON public.dosage_images 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);