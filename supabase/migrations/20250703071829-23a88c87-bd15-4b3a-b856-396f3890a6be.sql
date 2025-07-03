-- Update delete policy for dosage images to allow owner and specific admin
DROP POLICY IF EXISTS "Users can delete their own dosage images" ON public.dosage_images;

CREATE POLICY "Users can delete their own dosage images or admin can delete any" 
ON public.dosage_images 
FOR DELETE 
USING (
  auth.uid() = user_id OR 
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

-- Update storage delete policy similarly
DROP POLICY IF EXISTS "Users can delete their own dosage images in storage" ON storage.objects;

CREATE POLICY "Users can delete their own dosage images in storage or admin can delete any" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'food-images' AND 
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
  )
);

-- Add table for parsing dosage table data from images
CREATE TABLE public.dosage_table_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dosage_image_id UUID NOT NULL REFERENCES public.dosage_images(id) ON DELETE CASCADE,
  weight_range TEXT,
  age_range TEXT,
  daily_amount TEXT,
  notes TEXT,
  row_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for dosage table data
ALTER TABLE public.dosage_table_data ENABLE ROW LEVEL SECURITY;

-- Create policies for dosage table data
CREATE POLICY "Users can view dosage table data for their images" 
ON public.dosage_table_data 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.dosage_images 
    WHERE id = dosage_table_data.dosage_image_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create dosage table data for their images" 
ON public.dosage_table_data 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.dosage_images 
    WHERE id = dosage_table_data.dosage_image_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update dosage table data for their images" 
ON public.dosage_table_data 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.dosage_images 
    WHERE id = dosage_table_data.dosage_image_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete dosage table data for their images or admin can delete any" 
ON public.dosage_table_data 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.dosage_images 
    WHERE id = dosage_table_data.dosage_image_id 
    AND user_id = auth.uid()
  ) OR
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);