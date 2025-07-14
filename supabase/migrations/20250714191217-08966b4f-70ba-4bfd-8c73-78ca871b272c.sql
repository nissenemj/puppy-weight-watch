-- Add UPDATE and DELETE policies for dog_foods table for admin user
CREATE POLICY "Admin can update dog foods" 
ON public.dog_foods 
FOR UPDATE 
USING ((auth.jwt() ->> 'email'::text) = 'nissenemj@gmail.com'::text);

CREATE POLICY "Admin can delete dog foods" 
ON public.dog_foods 
FOR DELETE 
USING ((auth.jwt() ->> 'email'::text) = 'nissenemj@gmail.com'::text);

-- Update dosage_images policies to ensure admin can see all images
DROP POLICY IF EXISTS "Users can view their own dosage images or admin can view all" ON public.dosage_images;
CREATE POLICY "Users can view their own dosage images or admin can view all" 
ON public.dosage_images 
FOR SELECT 
USING ((auth.uid() = user_id) OR ((auth.jwt() ->> 'email'::text) = 'nissenemj@gmail.com'::text));