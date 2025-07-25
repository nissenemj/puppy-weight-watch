-- Add new fields to health_records table for enhanced functionality
ALTER TABLE public.health_records 
ADD COLUMN weight_kg NUMERIC(5,2),
ADD COLUMN time TIME,
ADD COLUMN medication_name TEXT,
ADD COLUMN dosage TEXT;

-- Create index for better performance on medication queries
CREATE INDEX idx_health_records_medication ON public.health_records(medication_name);

-- Create vaccination templates table for pre-defined vaccines
CREATE TABLE public.vaccination_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'vaccination' or 'deworming'
  description TEXT,
  recommended_age_weeks INTEGER[],
  manufacturer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vaccination templates
ALTER TABLE public.vaccination_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for vaccination templates (read-only for all authenticated users)
CREATE POLICY "Everyone can view vaccination templates" 
ON public.vaccination_templates 
FOR SELECT 
USING (true);

-- Create policy for admins to manage templates
CREATE POLICY "Admin can manage vaccination templates" 
ON public.vaccination_templates 
FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'nissenemj@gmail.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'nissenemj@gmail.com'::text);

-- Insert common vaccination templates
INSERT INTO public.vaccination_templates (name, type, description, recommended_age_weeks, manufacturer) VALUES
('DHPP-rokotus', 'vaccination', 'Koiran perustaudit: nuha, hepatiitti, parvovirustaudin ja kopparisutaudin rokotus', ARRAY[8, 12, 16], 'Useita valmistajia'),
('Rabies-rokotus', 'vaccination', 'Rabiesrokotus', ARRAY[12, 52], 'Useita valmistajia'),
('Kennel Cough', 'vaccination', 'Kennelkköhärokotus', ARRAY[8, 12], 'Useita valmistajia'),
('Nobivac DHPPi', 'vaccination', 'Nobivac DHPP + Parainfluenza', ARRAY[8, 12, 16], 'MSD Animal Health'),
('Eurican DHPPi2-L', 'vaccination', 'Eurooppalainen yhdistelmärokotus', ARRAY[8, 12, 16], 'Boehringer Ingelheim'),
('Milbemax', 'deworming', 'Yleinen madotuskuuri', ARRAY[4, 8, 12, 16, 20, 24], 'Novartis'),
('Advocate', 'deworming', 'Loppeis ja sisäloisten esto', ARRAY[8, 12, 16, 20], 'Bayer'),
('Drontal Plus', 'deworming', 'Hekilmadot ja sukkulamadot', ARRAY[6, 10, 14, 18], 'Bayer'),
('Bravecto', 'deworming', 'Kirppu- ja punkkivalmiste', ARRAY[12, 24, 36], 'MSD Animal Health');