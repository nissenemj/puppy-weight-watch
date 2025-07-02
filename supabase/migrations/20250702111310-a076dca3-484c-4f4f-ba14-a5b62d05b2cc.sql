
-- Luo taulukko koiranruoille
CREATE TABLE public.dog_foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  food_type TEXT NOT NULL CHECK (food_type IN ('Kuiva', 'Märkä', 'Raaka')),
  nutrition_type TEXT NOT NULL CHECK (nutrition_type IN ('Täysravinto', 'Täydennysravinto', 'Täysravinto/Täydennysravinto')),
  dosage_method TEXT NOT NULL CHECK (dosage_method IN ('Odotettu_Aikuispaino_Ja_Ikä', 'Nykyinen_Paino', 'Prosentti_Nykyisestä_Painosta', 'Kokoluokka', 'Ei_Tietoa')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Luo taulukko annosteluohjeille
CREATE TABLE public.feeding_guidelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_food_id UUID REFERENCES dog_foods(id) ON DELETE CASCADE NOT NULL,
  adult_weight_kg DECIMAL(5,1),
  age_months TEXT,
  current_weight_kg DECIMAL(5,1),
  size_category TEXT,
  daily_amount_min INTEGER,
  daily_amount_max INTEGER,
  calculation_formula TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dog_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeding_guidelines ENABLE ROW LEVEL SECURITY;

-- Luo julkiset lukukäytännöt (kaikki voivat lukea)
CREATE POLICY "Everyone can view dog foods" ON public.dog_foods FOR SELECT TO public USING (true);
CREATE POLICY "Everyone can view feeding guidelines" ON public.feeding_guidelines FOR SELECT TO public USING (true);

-- Vain kirjautuneet käyttäjät voivat lisätä tietoja
CREATE POLICY "Authenticated users can create dog foods" ON public.dog_foods FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can create feeding guidelines" ON public.feeding_guidelines FOR INSERT TO authenticated WITH CHECK (true);

-- Lisää indeksit suorituskyvyn parantamiseksi
CREATE INDEX idx_dog_foods_manufacturer ON public.dog_foods(manufacturer);
CREATE INDEX idx_dog_foods_food_type ON public.dog_foods(food_type);
CREATE INDEX idx_feeding_guidelines_dog_food_id ON public.feeding_guidelines(dog_food_id);
