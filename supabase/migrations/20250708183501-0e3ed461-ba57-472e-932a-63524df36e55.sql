-- Insert additional Finnish dry dog food data for puppies

-- New Dry Foods (additional Finnish brands)
INSERT INTO dog_foods (name, manufacturer, product_code, food_type, nutrition_type, dosage_method, notes) VALUES
('LAPPI', 'Dagsmark', 'DAG-LAPPI', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Kana, peruna, camelinaöljy, viljaton, kotimainen'),
('HÄME', 'Dagsmark', 'DAG-HAME', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Kala-peruna, viljaton vaihtoehto'),
('Puppy', 'Kaisa', 'KAI-PUPPY', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', '88% kanaa, kalaa ja kananmunaa, norjalainen, täyteaineeton'),
('Viljaton Kanaa & Perunaa', 'Hau-Hau', 'HH-VILJATON', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Viljaton, kana ja peruna pohjainen'),
('Maxi Puppy', 'Royal Canin', 'RC-MAXI', 'Kuiva', 'Täysravinto', 'Odotettu_Aikuispaino_Ja_Ikä', 'Suurille roduille, kasvun tuki, DHA-rasvahappoja'),
('Puppy Light', 'Eukanuba', 'EUK-LIGHT', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Vähäkalorinen, ylipainoisille pennuille, viljaton');

-- Insert nutritional data for new foods
INSERT INTO food_nutrition (dog_food_id, protein_percentage, fat_percentage, grain_free, wheat_free, special_features)
SELECT 
  df.id,
  CASE 
    WHEN df.manufacturer = 'Dagsmark' AND df.name = 'LAPPI' THEN 28
    WHEN df.manufacturer = 'Dagsmark' AND df.name = 'HÄME' THEN 26
    WHEN df.manufacturer = 'Kaisa' AND df.name = 'Puppy' THEN 25
    WHEN df.manufacturer = 'Hau-Hau' AND df.name = 'Viljaton Kanaa & Perunaa' THEN 27
    WHEN df.manufacturer = 'Royal Canin' AND df.name = 'Maxi Puppy' THEN 30
    WHEN df.manufacturer = 'Eukanuba' AND df.name = 'Puppy Light' THEN 28
    ELSE NULL
  END,
  CASE 
    WHEN df.manufacturer = 'Dagsmark' AND df.name = 'LAPPI' THEN 13
    WHEN df.manufacturer = 'Dagsmark' AND df.name = 'HÄME' THEN 12
    WHEN df.manufacturer = 'Kaisa' AND df.name = 'Puppy' THEN 14
    WHEN df.manufacturer = 'Hau-Hau' AND df.name = 'Viljaton Kanaa & Perunaa' THEN 15
    WHEN df.manufacturer = 'Royal Canin' AND df.name = 'Maxi Puppy' THEN 18
    WHEN df.manufacturer = 'Eukanuba' AND df.name = 'Puppy Light' THEN 14
    ELSE NULL
  END,
  CASE 
    WHEN df.manufacturer = 'Dagsmark' THEN true
    WHEN df.manufacturer = 'Kaisa' THEN true
    WHEN df.manufacturer = 'Hau-Hau' THEN true
    WHEN df.manufacturer = 'Eukanuba' AND df.name = 'Puppy Light' THEN true
    ELSE false
  END,
  CASE 
    WHEN df.manufacturer = 'Dagsmark' THEN true
    WHEN df.manufacturer = 'Kaisa' THEN true
    WHEN df.manufacturer = 'Hau-Hau' THEN true
    WHEN df.manufacturer = 'Eukanuba' AND df.name = 'Puppy Light' THEN true
    ELSE false
  END,
  CASE 
    WHEN df.manufacturer = 'Dagsmark' AND df.name = 'LAPPI' THEN ARRAY['Camelinaöljy', 'Kotimainen', 'Nivelravinteita']
    WHEN df.manufacturer = 'Dagsmark' AND df.name = 'HÄME' THEN ARRAY['Kala-peruna', 'Viljaton vaihtoehto']
    WHEN df.manufacturer = 'Kaisa' AND df.name = 'Puppy' THEN ARRAY['88% kanaa/kalaa/munaa', 'Norjalainen', 'Täyteaineeton']
    WHEN df.manufacturer = 'Hau-Hau' AND df.name = 'Viljaton Kanaa & Perunaa' THEN ARRAY['Viljaton', 'Kana ja peruna']
    WHEN df.manufacturer = 'Royal Canin' AND df.name = 'Maxi Puppy' THEN ARRAY['Suurille roduille', 'Kasvun tuki', 'DHA-rasvahappoja']
    WHEN df.manufacturer = 'Eukanuba' AND df.name = 'Puppy Light' THEN ARRAY['Vähäkalorinen', 'Ylipainoisille']
    ELSE ARRAY[]::text[]
  END
FROM dog_foods df
WHERE df.manufacturer IN ('Dagsmark', 'Kaisa', 'Hau-Hau', 'Royal Canin', 'Eukanuba')
AND (
  (df.manufacturer = 'Dagsmark' AND df.name IN ('LAPPI', 'HÄME')) OR
  (df.manufacturer = 'Kaisa' AND df.name = 'Puppy') OR
  (df.manufacturer = 'Hau-Hau' AND df.name = 'Viljaton Kanaa & Perunaa') OR
  (df.manufacturer = 'Royal Canin' AND df.name = 'Maxi Puppy') OR
  (df.manufacturer = 'Eukanuba' AND df.name = 'Puppy Light')
);

-- Insert ingredients for new foods
INSERT INTO food_ingredients (dog_food_id, ingredient_name, ingredient_type, order_index)
-- Dagsmark LAPPI
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Peruna', 'carb' UNION ALL
  SELECT 'Camelinaöljy', 'fat'
) ingredients
WHERE df.manufacturer = 'Dagsmark' AND df.name = 'LAPPI'

UNION ALL

-- Dagsmark HÄME
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kala' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Peruna', 'carb'
) ingredients
WHERE df.manufacturer = 'Dagsmark' AND df.name = 'HÄME'

UNION ALL

-- Kaisa Puppy
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Kala', 'protein' UNION ALL
  SELECT 'Kananmuna', 'protein'
) ingredients
WHERE df.manufacturer = 'Kaisa' AND df.name = 'Puppy'

UNION ALL

-- Hau-Hau Viljaton
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Peruna', 'carb'
) ingredients
WHERE df.manufacturer = 'Hau-Hau' AND df.name = 'Viljaton Kanaa & Perunaa'

UNION ALL

-- Royal Canin Maxi Puppy
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Kala', 'protein' UNION ALL
  SELECT 'Riisi', 'carb' UNION ALL
  SELECT 'Maissi', 'carb' UNION ALL
  SELECT 'Eläinrasvat', 'fat'
) ingredients
WHERE df.manufacturer = 'Royal Canin' AND df.name = 'Maxi Puppy'

UNION ALL

-- Eukanuba Puppy Light
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Lammas', 'protein' UNION ALL
  SELECT 'Peruna', 'carb'
) ingredients
WHERE df.manufacturer = 'Eukanuba' AND df.name = 'Puppy Light';

-- Insert feeding guidelines for new foods
INSERT INTO feeding_guidelines (dog_food_id, current_weight_kg, daily_amount_min, daily_amount_max, calculation_formula)
-- General guidelines for most new dry foods (25-100g for 1-5kg puppy)
SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 25 as min_amount, 32 as max_amount, '14-32 g/kg/pv, jaetaan 3-4 ateriaan' as formula UNION ALL
  SELECT 2.0, 28, 64, '14-32 g/kg/pv, jaetaan 3-4 ateriaan' UNION ALL
  SELECT 5.0, 70, 160, '14-32 g/kg/pv, jaetaan 3-4 ateriaan' UNION ALL
  SELECT 10.0, 130, 260, '13-26 g/kg/pv, jaetaan 3-4 ateriaan'
) weights
WHERE df.manufacturer IN ('Dagsmark', 'Kaisa', 'Hau-Hau') 
AND df.name IN ('LAPPI', 'HÄME', 'Puppy', 'Viljaton Kanaa & Perunaa')

UNION ALL

-- Royal Canin Maxi Puppy (for large breeds)
SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 5.0 as weight_kg, 55 as min_amount, 90 as max_amount, '11-18 g/kg/pv, suurille roduille' as formula UNION ALL
  SELECT 10.0, 110, 180, '11-18 g/kg/pv, suurille roduille' UNION ALL
  SELECT 20.0, 200, 320, '10-16 g/kg/pv, suurille roduille' UNION ALL
  SELECT 30.0, 330, 480, '11-16 g/kg/pv, suurille roduille'
) weights
WHERE df.manufacturer = 'Royal Canin' AND df.name = 'Maxi Puppy'

UNION ALL

-- Eukanuba Puppy Light (reduced calorie)
SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 10 as min_amount, 16 as max_amount, '10-16 g/kg/pv, vähäkalorinen' as formula UNION ALL
  SELECT 2.0, 20, 32, '10-16 g/kg/pv, vähäkalorinen' UNION ALL
  SELECT 5.0, 50, 80, '10-16 g/kg/pv, vähäkalorinen' UNION ALL
  SELECT 10.0, 100, 160, '10-16 g/kg/pv, vähäkalorinen'
) weights
WHERE df.manufacturer = 'Eukanuba' AND df.name = 'Puppy Light';

-- Insert allergen information
INSERT INTO food_allergens (dog_food_id, allergen_name, allergen_type)
-- Grain-free foods
SELECT df.id, 'Vilja', 'free_from'
FROM dog_foods df
WHERE df.manufacturer IN ('Dagsmark', 'Kaisa', 'Hau-Hau') 
AND df.name IN ('LAPPI', 'HÄME', 'Puppy', 'Viljaton Kanaa & Perunaa')

UNION ALL

SELECT df.id, 'Vehnä', 'free_from'
FROM dog_foods df
WHERE df.manufacturer IN ('Dagsmark', 'Kaisa', 'Hau-Hau') 
AND df.name IN ('LAPPI', 'HÄME', 'Puppy', 'Viljaton Kanaa & Perunaa')

UNION ALL

-- Eukanuba Puppy Light is grain-free too
SELECT df.id, 'Vilja', 'free_from'
FROM dog_foods df
WHERE df.manufacturer = 'Eukanuba' AND df.name = 'Puppy Light'

UNION ALL

SELECT df.id, 'Vehnä', 'free_from'
FROM dog_foods df
WHERE df.manufacturer = 'Eukanuba' AND df.name = 'Puppy Light'

UNION ALL

-- Kaisa is also additive-free
SELECT df.id, 'Täyteaineet', 'free_from'
FROM dog_foods df
WHERE df.manufacturer = 'Kaisa' AND df.name = 'Puppy';