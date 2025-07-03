-- Create table for dosage images
CREATE TABLE public.dosage_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_path TEXT NOT NULL,
  food_brand TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dosage_images ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own dosage images" 
ON public.dosage_images 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dosage images" 
ON public.dosage_images 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dosage images" 
ON public.dosage_images 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dosage images" 
ON public.dosage_images 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dosage_images_updated_at
BEFORE UPDATE ON public.dosage_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage policies for dosage images
CREATE POLICY "Users can view their own dosage images in storage" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own dosage images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own dosage images in storage" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own dosage images in storage" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);