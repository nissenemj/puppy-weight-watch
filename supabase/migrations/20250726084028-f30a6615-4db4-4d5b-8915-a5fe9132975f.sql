-- Add AEFI and clinical fields to health_records
ALTER TABLE public.health_records
  ADD COLUMN IF NOT EXISTS vaccine_brand TEXT,
  ADD COLUMN IF NOT EXISTS lot_number TEXT,
  ADD COLUMN IF NOT EXISTS dose TEXT,
  ADD COLUMN IF NOT EXISTS reaction_observed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reaction_description TEXT;

-- Create growth centiles table for Waltham-based charts
CREATE TABLE IF NOT EXISTS public.growth_centiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  size_class TEXT NOT NULL CHECK (size_class IN ('toy_small', 'medium', 'large_giant')),
  age_weeks INTEGER NOT NULL,
  p3 DECIMAL(5,2) NOT NULL,
  p10 DECIMAL(5,2) NOT NULL,
  p50 DECIMAL(5,2) NOT NULL,
  p90 DECIMAL(5,2) NOT NULL,
  p97 DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on growth_centiles
ALTER TABLE public.growth_centiles ENABLE ROW LEVEL SECURITY;

-- Everyone can view growth centiles (reference data)
CREATE POLICY "Everyone can view growth centiles"
ON public.growth_centiles
FOR SELECT
USING (true);

-- Insert sample Waltham-based centile data
INSERT INTO public.growth_centiles (size_class, age_weeks, p3, p10, p50, p90, p97) VALUES
-- Toy/Small breeds (adult weight 2-10kg)
('toy_small', 8, 0.8, 1.0, 1.3, 1.7, 2.0),
('toy_small', 12, 1.3, 1.6, 2.1, 2.7, 3.1),
('toy_small', 16, 1.7, 2.1, 2.8, 3.7, 4.1),
('toy_small', 20, 2.1, 2.6, 3.4, 4.5, 5.1),
('toy_small', 24, 2.4, 3.0, 3.9, 5.1, 5.8),
('toy_small', 32, 2.8, 3.4, 4.4, 5.8, 6.6),
('toy_small', 40, 3.0, 3.6, 4.7, 6.1, 7.0),
('toy_small', 48, 3.2, 3.8, 5.0, 6.4, 7.3),

-- Medium breeds (adult weight 10-25kg)
('medium', 8, 1.4, 1.7, 2.3, 3.1, 3.6),
('medium', 12, 3.0, 3.6, 4.9, 6.5, 7.5),
('medium', 16, 4.6, 5.5, 7.4, 9.9, 11.5),
('medium', 20, 6.1, 7.3, 9.7, 13.0, 15.0),
('medium', 24, 7.4, 8.8, 11.6, 15.6, 18.0),
('medium', 32, 9.4, 11.1, 14.5, 19.4, 22.5),
('medium', 40, 10.6, 12.5, 16.3, 21.7, 25.1),
('medium', 48, 11.6, 13.6, 17.9, 23.6, 27.3),

-- Large/Giant breeds (adult weight 25-70kg+)
('large_giant', 8, 2.0, 2.4, 3.2, 4.4, 5.1),
('large_giant', 12, 4.7, 5.6, 7.5, 10.4, 12.0),
('large_giant', 16, 7.8, 9.2, 12.3, 16.9, 19.5),
('large_giant', 20, 10.8, 12.7, 17.1, 23.5, 27.3),
('large_giant', 24, 13.5, 15.9, 21.4, 29.5, 34.2),
('large_giant', 32, 18.1, 21.2, 28.5, 39.3, 45.5),
('large_giant', 40, 21.4, 25.2, 33.7, 46.6, 54.2),
('large_giant', 48, 24.8, 29.2, 39.3, 54.3, 63.4);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_growth_centiles_size_age 
ON public.growth_centiles(size_class, age_weeks);