-- Insert additional raw/fresh and wet dog food data

-- Raw/Fresh Foods (Raakaruoat ja tuoreruoat)
INSERT INTO dog_foods (name, manufacturer, product_code, food_type, nutrition_type, dosage_method, notes) VALUES
('Kennelpakaste', 'Kennelpakaste', 'KP-RAW', 'Raaka', 'Täysravinto', 'Nykyinen_Paino', 'Jauhettu tuore liha ja sisäelimet, ei lisäaineita'),
('Raaka Täysravinto', 'SMAAK', 'SMAAK-RAW', 'Raaka', 'Täysravinto', 'Nykyinen_Paino', 'Kotimaiset raaka-aineet, sopii 7 vk ikäisistä'),
('Puppy', 'Nutriment by RAUH!', 'NUT-PUPPY', 'Raaka', 'Täysravinto', 'Nykyinen_Paino', 'Tasapainoinen ravinto 6 kuukauden ikään asti'),

-- Additional Wet Foods (Märkäruoka)
('Puppy', 'Dagsmark', 'DAG-PUPPY', 'Märkä', 'Täysravinto', 'Nykyinen_Paino', 'Kotimainen kana ja Itämeren kala, kastikkeessa tai pateena'),
('Puppy', 'Monster Dog', 'MON-PUPPY', 'Märkä', 'Täysravinto', 'Nykyinen_Paino', 'Viljaton, 100% lihaa, sisältää kivennäisaineita');

-- Insert nutritional data for the new foods
INSERT INTO food_nutrition (dog_food_id, protein_percentage, fat_percentage, grain_free, wheat_free, special_features)
SELECT 
  df.id,
  CASE 
    WHEN df.manufacturer = 'Kennelpakaste' THEN 15
    WHEN df.manufacturer = 'SMAAK' THEN 16
    WHEN df.manufacturer = 'Nutriment by RAUH!' THEN 14
    WHEN df.manufacturer = 'Dagsmark' THEN 11
    WHEN df.manufacturer = 'Monster Dog' THEN 11
    ELSE NULL
  END,
  CASE 
    WHEN df.manufacturer = 'Kennelpakaste' THEN 12
    WHEN df.manufacturer = 'SMAAK' THEN 13
    WHEN df.manufacturer = 'Nutriment by RAUH!' THEN 11
    WHEN df.manufacturer = 'Dagsmark' THEN 7
    WHEN df.manufacturer = 'Monster Dog' THEN 6.5
    ELSE NULL
  END,
  CASE 
    WHEN df.manufacturer IN ('Monster Dog') THEN true
    ELSE false
  END,
  CASE 
    WHEN df.manufacturer IN ('Monster Dog') THEN true
    ELSE false
  END,
  CASE 
    WHEN df.manufacturer = 'Kennelpakaste' THEN ARRAY['Ei lisäaineita', 'Ei säilöntäaineita', 'Ikaalisten tehdas']
    WHEN df.manufacturer = 'SMAAK' THEN ARRAY['Kotimaiset raaka-aineet', '7 vk ikäisistä']
    WHEN df.manufacturer = 'Nutriment by RAUH!' THEN ARRAY['Tasapainoinen ravinto', '6 kk ikään asti']
    WHEN df.manufacturer = 'Dagsmark' THEN ARRAY['Kotimainen kana', 'Itämeren kala', 'Kastikkeessa/pateena']
    WHEN df.manufacturer = 'Monster Dog' THEN ARRAY['100% lihaa', 'Viljaton', 'Kivennäisaineet']
    ELSE ARRAY[]::text[]
  END
FROM dog_foods df
WHERE df.manufacturer IN ('Kennelpakaste', 'SMAAK', 'Nutriment by RAUH!', 'Dagsmark', 'Monster Dog')
AND (df.name = 'Puppy' OR (df.manufacturer = 'Kennelpakaste' AND df.name = 'Kennelpakaste') OR (df.manufacturer = 'SMAAK' AND df.name = 'Raaka Täysravinto'));

-- Insert ingredients for new foods
INSERT INTO food_ingredients (dog_food_id, ingredient_name, ingredient_type, order_index)
-- Kennelpakaste
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Jauhettu tuore liha' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Sisäelimet', 'protein'
) ingredients
WHERE df.manufacturer = 'Kennelpakaste' AND df.name = 'Kennelpakaste'

UNION ALL

-- SMAAK
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Sika', 'protein' UNION ALL
  SELECT 'Lohi', 'protein'
) ingredients
WHERE df.manufacturer = 'SMAAK' AND df.name = 'Raaka Täysravinto'

UNION ALL

-- Nutriment by RAUH!
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Nauta' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Kana', 'protein' UNION ALL
  SELECT 'Kasvikset', 'carb'
) ingredients
WHERE df.manufacturer = 'Nutriment by RAUH!' AND df.name = 'Puppy'

UNION ALL

-- Dagsmark
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kotimainen kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Itämeren kala', 'protein'
) ingredients
WHERE df.manufacturer = 'Dagsmark' AND df.name = 'Puppy'

UNION ALL

-- Monster Dog
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Nauta', 'protein' UNION ALL
  SELECT 'Porkkana', 'carb'
) ingredients
WHERE df.manufacturer = 'Monster Dog' AND df.name = 'Puppy';

-- Insert feeding guidelines for new foods
INSERT INTO feeding_guidelines (dog_food_id, current_weight_kg, daily_amount_min, daily_amount_max, calculation_formula)
-- Kennelpakaste (raw food)
SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 20 as min_amount, 30 as max_amount, '20-30 g/kg/pv, jaetaan 3-4 ateriaan, raakaliha' as formula UNION ALL
  SELECT 2.0, 40, 60, '20-30 g/kg/pv, jaetaan 3-4 ateriaan, raakaliha' UNION ALL
  SELECT 5.0, 100, 150, '20-30 g/kg/pv, jaetaan 3-4 ateriaan, raakaliha' UNION ALL
  SELECT 10.0, 200, 300, '20-30 g/kg/pv, jaetaan 3-4 ateriaan, raakaliha'
) weights
WHERE df.manufacturer = 'Kennelpakaste' AND df.name = 'Kennelpakaste'

UNION ALL

-- SMAAK (raw food)
SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 25 as min_amount, 35 as max_amount, '25-35 g/kg/pv, tuoreruoka, 7 vk ikäisistä' as formula UNION ALL
  SELECT 2.0, 50, 70, '25-35 g/kg/pv, tuoreruoka, 7 vk ikäisistä' UNION ALL
  SELECT 5.0, 125, 175, '25-35 g/kg/pv, tuoreruoka, 7 vk ikäisistä' UNION ALL
  SELECT 10.0, 250, 350, '25-35 g/kg/pv, tuoreruoka, 7 vk ikäisistä'
) weights
WHERE df.manufacturer = 'SMAAK' AND df.name = 'Raaka Täysravinto'

UNION ALL

-- Nutriment by RAUH! (raw food)
SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 20 as min_amount, 30 as max_amount, '20-30 g/kg/pv, tasapainoinen 6 kk ikään asti' as formula UNION ALL
  SELECT 2.0, 40, 60, '20-30 g/kg/pv, tasapainoinen 6 kk ikään asti' UNION ALL
  SELECT 5.0, 100, 150, '20-30 g/kg/pv, tasapainoinen 6 kk ikään asti' UNION ALL
  SELECT 10.0, 200, 300, '20-30 g/kg/pv, tasapainoinen 6 kk ikään asti'
) weights
WHERE df.manufacturer = 'Nutriment by RAUH!' AND df.name = 'Puppy'

UNION ALL

-- Dagsmark (wet food - cans per kg)
SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 1 as min_amount, 1 as max_amount, '1-1,5 purkkia/5 kg/pv, kastikkeessa tai pateena' as formula UNION ALL
  SELECT 2.0, 1, 2, '1-1,5 purkkia/5 kg/pv, kastikkeessa tai pateena' UNION ALL
  SELECT 5.0, 1, 2, '1-1,5 purkkia/5 kg/pv, kastikkeessa tai pateena' UNION ALL
  SELECT 10.0, 2, 3, '1-1,5 purkkia/5 kg/pv, kastikkeessa tai pateena'
) weights
WHERE df.manufacturer = 'Dagsmark' AND df.name = 'Puppy'

UNION ALL

-- Monster Dog (wet food - cans per kg)
SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 1 as min_amount, 1 as max_amount, '1-1,5 purkkia/5 kg/pv, viljaton täysravinto' as formula UNION ALL
  SELECT 2.0, 1, 2, '1-1,5 purkkia/5 kg/pv, viljaton täysravinto' UNION ALL
  SELECT 5.0, 1, 2, '1-1,5 purkkia/5 kg/pv, viljaton täysravinto' UNION ALL
  SELECT 10.0, 2, 3, '1-1,5 purkkia/5 kg/pv, viljaton täysravinto'
) weights
WHERE df.manufacturer = 'Monster Dog' AND df.name = 'Puppy';

-- Insert allergen information for new foods
INSERT INTO food_allergens (dog_food_id, allergen_name, allergen_type)
SELECT df.id, 'Vilja', 'free_from'
FROM dog_foods df
WHERE df.manufacturer = 'Monster Dog' AND df.name = 'Puppy'

UNION ALL

SELECT df.id, 'Vehnä', 'free_from'
FROM dog_foods df
WHERE df.manufacturer = 'Monster Dog' AND df.name = 'Puppy'

UNION ALL

SELECT df.id, 'Lisäaineet', 'free_from'
FROM dog_foods df
WHERE df.manufacturer = 'Kennelpakaste' AND df.name = 'Kennelpakaste'

UNION ALL

SELECT df.id, 'Säilöntäaineet', 'free_from'
FROM dog_foods df
WHERE df.manufacturer = 'Kennelpakaste' AND df.name = 'Kennelpakaste';