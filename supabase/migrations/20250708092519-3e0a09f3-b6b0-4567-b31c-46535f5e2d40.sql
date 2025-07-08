-- Create food_ingredients table for detailed ingredient information
CREATE TABLE public.food_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_food_id UUID NOT NULL REFERENCES public.dog_foods(id) ON DELETE CASCADE,
  ingredient_type VARCHAR NOT NULL CHECK (ingredient_type IN ('primary', 'protein', 'carb', 'fat', 'additive')),
  ingredient_name VARCHAR NOT NULL,
  percentage DECIMAL(5,2), -- Optional percentage if known
  order_index INTEGER NOT NULL DEFAULT 0, -- Order in ingredient list
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_allergens table for allergen information
CREATE TABLE public.food_allergens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_food_id UUID NOT NULL REFERENCES public.dog_foods(id) ON DELETE CASCADE,
  allergen_type VARCHAR NOT NULL CHECK (allergen_type IN ('contains', 'free_from')),
  allergen_name VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_nutrition table for nutritional information
CREATE TABLE public.food_nutrition (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_food_id UUID NOT NULL REFERENCES public.dog_foods(id) ON DELETE CASCADE UNIQUE,
  protein_percentage DECIMAL(5,2),
  fat_percentage DECIMAL(5,2),
  fiber_percentage DECIMAL(5,2),
  moisture_percentage DECIMAL(5,2),
  grain_free BOOLEAN DEFAULT FALSE,
  wheat_free BOOLEAN DEFAULT FALSE,
  gluten_free BOOLEAN DEFAULT FALSE,
  special_features TEXT[], -- Array of special features
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_manufacturers table for manufacturer information
CREATE TABLE public.food_manufacturers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_food_id UUID NOT NULL REFERENCES public.dog_foods(id) ON DELETE CASCADE UNIQUE,
  country_of_origin VARCHAR,
  website_url VARCHAR,
  feeding_guide_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.food_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_manufacturers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since dog food data is public)
CREATE POLICY "Everyone can view food ingredients" ON public.food_ingredients FOR SELECT USING (true);
CREATE POLICY "Everyone can view food allergens" ON public.food_allergens FOR SELECT USING (true);
CREATE POLICY "Everyone can view food nutrition" ON public.food_nutrition FOR SELECT USING (true);
CREATE POLICY "Everyone can view food manufacturers" ON public.food_manufacturers FOR SELECT USING (true);

-- Create policies for authenticated users to create data
CREATE POLICY "Authenticated users can create food ingredients" ON public.food_ingredients FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can create food allergens" ON public.food_allergens FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can create food nutrition" ON public.food_nutrition FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can create food manufacturers" ON public.food_manufacturers FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_food_ingredients_dog_food_id ON public.food_ingredients(dog_food_id);
CREATE INDEX idx_food_allergens_dog_food_id ON public.food_allergens(dog_food_id);
CREATE INDEX idx_food_nutrition_dog_food_id ON public.food_nutrition(dog_food_id);
CREATE INDEX idx_food_manufacturers_dog_food_id ON public.food_manufacturers(dog_food_id);