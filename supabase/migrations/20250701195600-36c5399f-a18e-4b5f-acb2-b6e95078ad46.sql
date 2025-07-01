
-- Koirien tiedot
CREATE TABLE public.dogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  breed TEXT,
  weight_kg DECIMAL(5,2),
  age_years INTEGER,
  activity_level TEXT CHECK (activity_level IN ('low', 'medium', 'high')),
  health_conditions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ruokaohjeet ja -tiedot
CREATE TABLE public.food_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  calories_per_100g INTEGER,
  protein_percentage DECIMAL(5,2),
  fat_percentage DECIMAL(5,2),
  carb_percentage DECIMAL(5,2),
  feeding_instructions JSONB,
  image_url TEXT,
  source TEXT CHECK (source IN ('manual', 'ocr', 'database')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ruokintasuunnitelmat
CREATE TABLE public.feeding_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_id UUID REFERENCES dogs(id) NOT NULL,
  recipe_id UUID REFERENCES food_recipes(id) NOT NULL,
  daily_amount_grams INTEGER NOT NULL,
  meals_per_day INTEGER NOT NULL DEFAULT 2,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Storage bucket kuville
INSERT INTO storage.buckets (id, name, public) VALUES ('food-images', 'food-images', true);

-- Row Level Security policies
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeding_plans ENABLE ROW LEVEL SECURITY;

-- Dogs policies
CREATE POLICY "Users can view their own dogs" ON public.dogs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own dogs" ON public.dogs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own dogs" ON public.dogs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own dogs" ON public.dogs FOR DELETE USING (auth.uid() = user_id);

-- Food recipes policies (public read, authenticated users can create)
CREATE POLICY "Everyone can view food recipes" ON public.food_recipes FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create food recipes" ON public.food_recipes FOR INSERT TO authenticated WITH CHECK (true);

-- Feeding plans policies
CREATE POLICY "Users can view feeding plans for their dogs" ON public.feeding_plans FOR SELECT USING (
  EXISTS (SELECT 1 FROM dogs WHERE dogs.id = feeding_plans.dog_id AND dogs.user_id = auth.uid())
);
CREATE POLICY "Users can create feeding plans for their dogs" ON public.feeding_plans FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM dogs WHERE dogs.id = feeding_plans.dog_id AND dogs.user_id = auth.uid())
);
CREATE POLICY "Users can update feeding plans for their dogs" ON public.feeding_plans FOR UPDATE USING (
  EXISTS (SELECT 1 FROM dogs WHERE dogs.id = feeding_plans.dog_id AND dogs.user_id = auth.uid())
);
CREATE POLICY "Users can delete feeding plans for their dogs" ON public.feeding_plans FOR DELETE USING (
  EXISTS (SELECT 1 FROM dogs WHERE dogs.id = feeding_plans.dog_id AND dogs.user_id = auth.uid())
);

-- Storage policies for food images
CREATE POLICY "Anyone can view food images" ON storage.objects FOR SELECT USING (bucket_id = 'food-images');
CREATE POLICY "Authenticated users can upload food images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'food-images' AND auth.role() = 'authenticated');
