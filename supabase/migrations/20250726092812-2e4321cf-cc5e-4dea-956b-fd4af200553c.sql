-- Add birth_date column to puppy_books table
ALTER TABLE public.puppy_books 
ADD COLUMN birth_date DATE;

-- Create RLS policies for puppy-books storage bucket
CREATE POLICY "Users can upload images to puppy-books bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view images from puppy-books bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their images in puppy-books bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their images from puppy-books bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);