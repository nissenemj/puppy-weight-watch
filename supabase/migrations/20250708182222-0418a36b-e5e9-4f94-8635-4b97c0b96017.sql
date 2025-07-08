-- Insert comprehensive dog food data from research

-- Dry Foods (Kuivaruoka)
INSERT INTO dog_foods (name, manufacturer, product_code, food_type, nutrition_type, dosage_method, notes) VALUES
('Puppy', 'Royal Canin', 'RC-PUPPY', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Tukee kasvua ja vastustuskykyä'),
('Puppy', 'Eukanuba', 'EUK-PUPPY', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'DentaDefense-hammashoito, omega-3/6'),
('Science Plan Puppy', 'Hill''s', 'HILLS-PUPPY', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Pehmeä koostumus, tasapainotettu energia'),
('Pentu', 'Jahti&Vahti', 'JV-PENTU', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Herkälle vatsalle, ei lisäaineita'),
('HE', 'Farm Food', 'FF-HE', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Tuorelihapohjainen, EU-alkuperä'),
('Emo & Pentu', 'Werraton', 'WER-EP', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Viljaton, EPA & DHA krillistä'),
('Kids', 'Josera', 'JOS-KIDS', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Saksalainen, viljaton vaihtoehto saatavilla'),

-- Wet Foods (Märkäruoka)
('Puppy Beef Canned', 'Hill''s', 'HILLS-WET', 'Märkä', 'Täysravinto', 'Nykyinen_Paino', 'Korkea kosteuspitoisuus'),
('Vom Feinsten Junior', 'Animonda', 'ANI-VF', 'Märkä', 'Täysravinto', 'Nykyinen_Paino', 'Ei viljaa, helposti sulava'),
('Puppy Wet', 'Royal Canin', 'RC-WET', 'Märkä', 'Täysravinto', 'Nykyinen_Paino', 'Tukee ruoansulatusta'),

-- Raw/Fresh Foods (Raakaruoat ja tuoreruoat)
('Vaisto Puppy', 'MUSH', 'MUSH-VP', 'Raaka', 'Täysravinto', 'Nykyinen_Paino', 'Viljaton, maitohappobakteerit, omega-3'),
('VOM Puppy', 'VOM', 'VOM-PUPPY', 'Raaka', 'Täysravinto', 'Nykyinen_Paino', 'Vitaminoitu täysravinto'),
('Pentu', 'Best-In', 'BI-PENTU', 'Raaka', 'Täysravinto', 'Nykyinen_Paino', 'Ei viljaa, tuoreruoka'),
('Puppy', 'Neu', 'NEU-PUPPY', 'Raaka', 'Täysravinto', 'Nykyinen_Paino', 'Lajinomainen tuoreruoka');

-- Insert nutritional data
INSERT INTO food_nutrition (dog_food_id, protein_percentage, fat_percentage, grain_free, wheat_free, special_features)
SELECT 
  df.id,
  CASE 
    WHEN df.manufacturer = 'Royal Canin' AND df.name = 'Puppy' THEN 32
    WHEN df.manufacturer = 'Eukanuba' AND df.name = 'Puppy' THEN 30.5
    WHEN df.manufacturer = 'Hill''s' AND df.name = 'Science Plan Puppy' THEN 29
    WHEN df.manufacturer = 'Jahti&Vahti' AND df.name = 'Pentu' THEN 28
    WHEN df.manufacturer = 'Farm Food' AND df.name = 'HE' THEN 24
    WHEN df.manufacturer = 'Werraton' AND df.name = 'Emo & Pentu' THEN 32
    WHEN df.manufacturer = 'Josera' AND df.name = 'Kids' THEN 27.5
    WHEN df.manufacturer = 'Hill''s' AND df.name = 'Puppy Beef Canned' THEN 8.5
    WHEN df.manufacturer = 'Animonda' AND df.name = 'Vom Feinsten Junior' THEN 11
    WHEN df.manufacturer = 'Royal Canin' AND df.name = 'Puppy Wet' THEN 9
    WHEN df.manufacturer = 'MUSH' AND df.name = 'Vaisto Puppy' THEN 15.5
    WHEN df.manufacturer = 'VOM' AND df.name = 'VOM Puppy' THEN 16
    WHEN df.manufacturer = 'Best-In' AND df.name = 'Pentu' THEN 13
    ELSE NULL
  END,
  CASE 
    WHEN df.manufacturer = 'Royal Canin' AND df.name = 'Puppy' THEN 20
    WHEN df.manufacturer = 'Eukanuba' AND df.name = 'Puppy' THEN 19
    WHEN df.manufacturer = 'Hill''s' AND df.name = 'Science Plan Puppy' THEN 18.5
    WHEN df.manufacturer = 'Jahti&Vahti' AND df.name = 'Pentu' THEN 17
    WHEN df.manufacturer = 'Farm Food' AND df.name = 'HE' THEN 14
    WHEN df.manufacturer = 'Werraton' AND df.name = 'Emo & Pentu' THEN 20
    WHEN df.manufacturer = 'Josera' AND df.name = 'Kids' THEN 18
    WHEN df.manufacturer = 'Hill''s' AND df.name = 'Puppy Beef Canned' THEN 6
    WHEN df.manufacturer = 'Animonda' AND df.name = 'Vom Feinsten Junior' THEN 7
    WHEN df.manufacturer = 'Royal Canin' AND df.name = 'Puppy Wet' THEN 6
    WHEN df.manufacturer = 'MUSH' AND df.name = 'Vaisto Puppy' THEN 12.5
    WHEN df.manufacturer = 'VOM' AND df.name = 'VOM Puppy' THEN 15.5
    WHEN df.manufacturer = 'Best-In' AND df.name = 'Pentu' THEN 10
    ELSE NULL
  END,
  CASE 
    WHEN df.manufacturer IN ('Farm Food', 'Werraton', 'Animonda', 'MUSH', 'Best-In') THEN true
    WHEN df.manufacturer = 'Jahti&Vahti' THEN true
    ELSE false
  END,
  CASE 
    WHEN df.manufacturer = 'Jahti&Vahti' THEN true
    WHEN df.manufacturer IN ('Farm Food', 'Werraton', 'Animonda', 'MUSH', 'Best-In') THEN true
    ELSE false
  END,
  CASE 
    WHEN df.manufacturer = 'Royal Canin' AND df.name = 'Puppy' THEN ARRAY['DHA omega-3', 'Vastustuskyky']
    WHEN df.manufacturer = 'Eukanuba' AND df.name = 'Puppy' THEN ARRAY['DentaDefense', 'Omega-3/6', 'Prebiootit']
    WHEN df.manufacturer = 'Hill''s' AND df.name = 'Science Plan Puppy' THEN ARRAY['DHA', 'Tasapainotettu energia']
    WHEN df.manufacturer = 'Jahti&Vahti' AND df.name = 'Pentu' THEN ARRAY['Progut®-hiiva', 'Herkälle vatsalle']
    WHEN df.manufacturer = 'Farm Food' AND df.name = 'HE' THEN ARRAY['Tuorelihapohjainen', 'EU-alkuperä']
    WHEN df.manufacturer = 'Werraton' AND df.name = 'Emo & Pentu' THEN ARRAY['90% eläinproteiini', 'EPA & DHA krilli']
    WHEN df.manufacturer = 'Josera' AND df.name = 'Kids' THEN ARRAY['Saksalainen laatu']
    WHEN df.manufacturer = 'MUSH' AND df.name = 'Vaisto Puppy' THEN ARRAY['Maitohappobakteerit', 'Omega-3']
    WHEN df.manufacturer = 'VOM' AND df.name = 'VOM Puppy' THEN ARRAY['Vitaminoitu']
    WHEN df.manufacturer = 'Best-In' AND df.name = 'Pentu' THEN ARRAY['Tuoreruoka', 'Kotimainen']
    WHEN df.manufacturer = 'Neu' AND df.name = 'Puppy' THEN ARRAY['Lajinomainen', 'Tuoreruoka']
    ELSE ARRAY[]::text[]
  END
FROM dog_foods df
WHERE df.manufacturer IN ('Royal Canin', 'Eukanuba', 'Hill''s', 'Jahti&Vahti', 'Farm Food', 'Werraton', 'Josera', 'Animonda', 'MUSH', 'VOM', 'Best-In', 'Neu');

-- Insert ingredients data
INSERT INTO food_ingredients (dog_food_id, ingredient_name, ingredient_type, order_index)
SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Kala', 'protein' UNION ALL
  SELECT 'Riisi', 'carb' UNION ALL
  SELECT 'Maissi', 'carb' UNION ALL
  SELECT 'Eläinrasvat', 'fat'
) ingredients
WHERE df.manufacturer = 'Royal Canin' AND df.name = 'Puppy'

UNION ALL

SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Tuore kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Lammas', 'protein' UNION ALL
  SELECT 'Maissi', 'carb' UNION ALL
  SELECT 'Riisi', 'carb'
) ingredients
WHERE df.manufacturer = 'Eukanuba' AND df.name = 'Puppy'

UNION ALL

SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Kalaöljy', 'fat' UNION ALL
  SELECT 'Vehnä', 'carb' UNION ALL
  SELECT 'Maissi', 'carb'
) ingredients
WHERE df.manufacturer = 'Hill''s' AND df.name = 'Science Plan Puppy'

UNION ALL

SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kotimainen kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Kaura', 'carb' UNION ALL
  SELECT 'Peruna', 'carb'
) ingredients
WHERE df.manufacturer = 'Jahti&Vahti' AND df.name = 'Pentu'

UNION ALL

SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Naudanliha' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Naudansydän', 'protein' UNION ALL
  SELECT 'Lohiöljy', 'fat'
) ingredients
WHERE df.manufacturer = 'Farm Food' AND df.name = 'HE'

UNION ALL

SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kananmuna' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Siipikarja', 'protein' UNION ALL
  SELECT 'Peruna', 'carb' UNION ALL
  SELECT 'Pellava', 'carb'
) ingredients
WHERE df.manufacturer = 'Werraton' AND df.name = 'Emo & Pentu'

UNION ALL

SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Lohiöljy', 'fat' UNION ALL
  SELECT 'Riisi', 'carb' UNION ALL
  SELECT 'Maissi', 'carb'
) ingredients
WHERE df.manufacturer = 'Josera' AND df.name = 'Kids'

UNION ALL

SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Nauta' as ingredient_name, 'protein' UNION ALL
  SELECT 'Lohi' as ingredient_name, 'protein' UNION ALL
  SELECT 'Sisäelimet' as ingredient_name, 'protein' UNION ALL
  SELECT 'Vihannekset' as ingredient_name, 'carb'
) ingredients
WHERE df.manufacturer = 'MUSH' AND df.name = 'Vaisto Puppy'

UNION ALL

SELECT df.id, ingredient_name, ingredient_type, row_number() OVER (PARTITION BY df.id ORDER BY ingredient_name) - 1
FROM dog_foods df
CROSS JOIN (
  SELECT 'Kana' as ingredient_name, 'protein' as ingredient_type UNION ALL
  SELECT 'Naudan maha' as ingredient_name, 'protein' UNION ALL
  SELECT 'Lohi' as ingredient_name, 'protein' UNION ALL
  SELECT 'Muna' as ingredient_name, 'protein' UNION ALL
  SELECT 'Maksa' as ingredient_name, 'protein'
) ingredients
WHERE df.manufacturer = 'VOM' AND df.name = 'VOM Puppy';

-- Insert feeding guidelines with dosage ranges
INSERT INTO feeding_guidelines (dog_food_id, current_weight_kg, daily_amount_min, daily_amount_max, calculation_formula)
SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 11 as min_amount, 18 as max_amount, '11-18 g/kg/pv, jaetaan 3-4 ateriaan' as formula UNION ALL
  SELECT 2.0, 22, 36, '11-18 g/kg/pv, jaetaan 3-4 ateriaan' UNION ALL
  SELECT 5.0, 55, 90, '11-18 g/kg/pv, jaetaan 3-4 ateriaan' UNION ALL
  SELECT 10.0, 110, 180, '11-18 g/kg/pv, jaetaan 3-4 ateriaan'
) weights
WHERE df.manufacturer = 'Royal Canin' AND df.name = 'Puppy'

UNION ALL

SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 12 as min_amount, 20 as max_amount, '12-20 g/kg/pv, jaetaan 3-4 ateriaan' as formula UNION ALL
  SELECT 2.0, 24, 40, '12-20 g/kg/pv, jaetaan 3-4 ateriaan' UNION ALL
  SELECT 5.0, 60, 100, '12-20 g/kg/pv, jaetaan 3-4 ateriaan' UNION ALL
  SELECT 10.0, 120, 200, '12-20 g/kg/pv, jaetaan 3-4 ateriaan'
) weights
WHERE df.manufacturer = 'Eukanuba' AND df.name = 'Puppy'

UNION ALL

SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 8 as min_amount, 33 as max_amount, '8-33 g/kg/pv, riippuu iästä ja painosta' as formula UNION ALL
  SELECT 2.0, 16, 66, '8-33 g/kg/pv, riippuu iästä ja painosta' UNION ALL
  SELECT 5.0, 40, 165, '8-33 g/kg/pv, riippuu iästä ja painosta' UNION ALL
  SELECT 10.0, 80, 330, '8-33 g/kg/pv, riippuu iästä ja painosta'
) weights
WHERE df.manufacturer = 'Jahti&Vahti' AND df.name = 'Pentu'

UNION ALL

SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 22 as min_amount, 42 as max_amount, '22-42 g/kg/pv, määrää pienennetään kasvun myötä' as formula UNION ALL
  SELECT 2.0, 44, 84, '22-42 g/kg/pv, määrää pienennetään kasvun myötä' UNION ALL
  SELECT 5.0, 110, 210, '22-42 g/kg/pv, määrää pienennetään kasvun myötä' UNION ALL
  SELECT 10.0, 220, 420, '22-42 g/kg/pv, määrää pienennetään kasvun myötä'
) weights
WHERE df.manufacturer = 'Farm Food' AND df.name = 'HE'

UNION ALL

SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 20 as min_amount, 30 as max_amount, '20-30 g/kg/pv, 3-4 ateriaa, viljaton' as formula UNION ALL
  SELECT 2.0, 40, 60, '20-30 g/kg/pv, 3-4 ateriaa, viljaton' UNION ALL
  SELECT 5.0, 100, 150, '20-30 g/kg/pv, 3-4 ateriaa, viljaton' UNION ALL
  SELECT 10.0, 200, 300, '20-30 g/kg/pv, 3-4 ateriaa, viljaton'
) weights
WHERE df.manufacturer = 'MUSH' AND df.name = 'Vaisto Puppy'

UNION ALL

SELECT df.id, weight_kg, min_amount, max_amount, formula
FROM dog_foods df
CROSS JOIN (
  SELECT 1.0 as weight_kg, 24 as min_amount, 50 as max_amount, '24-50 g/kg/pv, 3-4 ateriaa, vitaminoitu' as formula UNION ALL
  SELECT 2.0, 48, 100, '24-50 g/kg/pv, 3-4 ateriaa, vitaminoitu' UNION ALL
  SELECT 5.0, 120, 250, '24-50 g/kg/pv, 3-4 ateriaa, vitaminoitu' UNION ALL
  SELECT 10.0, 240, 500, '24-50 g/kg/pv, 3-4 ateriaa, vitaminoitu'
) weights
WHERE df.manufacturer = 'VOM' AND df.name = 'VOM Puppy';

-- Insert allergen information
INSERT INTO food_allergens (dog_food_id, allergen_name, allergen_type)
SELECT df.id, 'Vehnä', 'free_from'
FROM dog_foods df
WHERE df.manufacturer IN ('Jahti&Vahti', 'Farm Food', 'Werraton', 'Animonda', 'MUSH', 'Best-In')

UNION ALL

SELECT df.id, 'Vilja', 'free_from'
FROM dog_foods df
WHERE df.manufacturer IN ('Farm Food', 'Werraton', 'Animonda', 'MUSH', 'Best-In')

UNION ALL

SELECT df.id, 'Kala', 'free_from'
FROM dog_foods df
WHERE df.manufacturer = 'Jahti&Vahti' AND df.name = 'Pentu'

UNION ALL

SELECT df.id, 'Lisäaineet', 'free_from'
FROM dog_foods df
WHERE df.manufacturer IN ('Jahti&Vahti', 'Best-In');