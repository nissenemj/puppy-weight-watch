-- Lisätään uusia koiranruokia ja niiden annostelutietoja

-- Ensin lisätään koiranruoat
INSERT INTO public.dog_foods (product_code, name, manufacturer, food_type, nutrition_type, dosage_method, notes) VALUES
-- Brit Care
('BC_PUPPY_LAMB', 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice', 'Brit', 'Kuiva', 'Täysravinto', 'Odotettu_Aikuispaino_Ja_Ikä', 'Sopii tiineille ja imettäville'),

-- Hau-Hau Champion
('HHC_PUPPY', 'Hau-Hau Champion Pentu & Emo', 'Hau-Hau Champion', 'Kuiva', 'Täysravinto', 'Odotettu_Aikuispaino_Ja_Ikä', 'Sopii myös emolle'),

-- Essential
('ESSENTIAL_BEGIN', 'ESSENTIAL The Beginning', 'Essential', 'Kuiva', 'Täysravinto', 'Odotettu_Aikuispaino_Ja_Ikä', 'Viljaton, ankka+kana, pienille roduille'),

-- Royal Canin Mini Puppy
('RC_MINI_PUPPY', 'Royal Canin Mini Puppy', 'Royal Canin', 'Kuiva', 'Täysravinto', 'Ei_Tietoa', 'Annostelutaulukkoa ei saatavilla'),

-- Acana
('ACANA_PUPPY', 'Acana Puppy & Junior', 'Acana', 'Kuiva', 'Täysravinto', 'Ei_Tietoa', 'Annostelutaulukkoa ei saatavilla'),

-- Purenational
('PN_PUPPY', 'Purenational Puppy', 'Purenational', 'Kuiva', 'Täysravinto', 'Ei_Tietoa', 'Annostelutaulukkoa ei saatavilla'),

-- Jahti & Vahti
('JV_PUPPY', 'Jahti&Vahti Pentu', 'Jahti&Vahti', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', '29% proteiinia, 17% rasvaa'),

-- Farm Food
('FF_HE_PUPPY', 'Farm Food HE', 'Farm Food', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino', 'Tarkat laskukaavat'),

-- MUSH raakaruoat
('MUSH_PUPPY_T1', 'MUSH Vaisto Puppy (nauta-poro-lohi)', 'MUSH', 'Raaka', 'Täysravinto', 'Odotettu_Aikuispaino_Ja_Ikä', 'Taulukko antaa tarkat arvot'),

('MUSH_PUPPY_T2', 'MUSH Vaisto Puppy (yleisohje)', 'MUSH', 'Raaka', 'Täysravinto', 'Prosentti_Nykyisestä_Painosta', '5-10% pennun nykyisestä painosta'),

-- SMAAK
('SMAAK_PUPPY', 'SMAAK Raaka täysravinto', 'SMAAK', 'Raaka', 'Täysravinto', 'Nykyinen_Paino', 'Laaja vaihteluväli'),

-- Brit märkäruoat
('BP_WET_BEEF_FULL', 'Brit Premium by Nature Beef with Tripe', 'Brit', 'Märkä', 'Täysravinto', 'Kokoluokka', 'Annos täysravintona'),

('BP_WET_BEEF_COMP', 'Brit Premium by Nature Beef with Tripe', 'Brit', 'Märkä', 'Täydennysravinto', 'Kokoluokka', '50% täydennysravintona'),

-- Royal Canin märkäruoka
('RC_MINI_PUPPY_WET', 'Royal Canin Mini Puppy (märkäruoka)', 'Royal Canin', 'Märkä', 'Täysravinto', 'Ei_Tietoa', 'Annostelutaulukkoa ei saatavilla')

ON CONFLICT (product_code) DO UPDATE SET
name = EXCLUDED.name,
manufacturer = EXCLUDED.manufacturer,
food_type = EXCLUDED.food_type,
nutrition_type = EXCLUDED.nutrition_type,
dosage_method = EXCLUDED.dosage_method,
notes = EXCLUDED.notes;

-- Lisätään annostelutiedot Brit Care Puppy Lamb & Rice:lle
INSERT INTO public.feeding_guidelines (dog_food_id, adult_weight_kg, age_months, daily_amount_min, daily_amount_max) 
SELECT 
    df.id,
    5, '1-3', 50, 70
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    5, '3-4', 75, 90
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    5, '4-6', 75, 85
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    5, '6-12', 70, 80
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    10, '1-3', 85, 100
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    10, '3-4', 120, 140
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    10, '4-6', 130, 150
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    10, '6-12', 120, 140
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    15, '1-3', 115, 135
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    15, '3-4', 160, 180
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    15, '4-6', 175, 195
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    15, '6-12', 170, 190
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    20, '1-3', 140, 160
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    20, '3-4', 180, 200
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    20, '4-6', 220, 240
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    20, '6-12', 210, 230
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB'
UNION ALL
SELECT 
    df.id,
    25, '1-3', 150, 170
FROM public.dog_foods df WHERE df.product_code = 'BC_PUPPY_LAMB';

-- Lisätään annostelutiedot Hau-Hau Champion:lle
INSERT INTO public.feeding_guidelines (dog_food_id, adult_weight_kg, age_months, daily_amount_min, daily_amount_max) 
SELECT 
    df.id,
    5, '1-2', 70, 80
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    5, '3-4', 90, 100
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    5, '5-6', 90, 100
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    5, '7-12', 80, 90
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    10, '1-2', 100, 120
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    10, '3-4', 140, 160
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    10, '5-6', 140, 160
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    15, '1-2', 130, 150
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    15, '3-4', 170, 190
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    15, '5-6', 190, 210
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    20, '1-2', 160, 180
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    20, '3-4', 200, 220
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY'
UNION ALL
SELECT 
    df.id,
    20, '5-6', 230, 250
FROM public.dog_foods df WHERE df.product_code = 'HHC_PUPPY';

-- Lisätään MUSH raakaruoan annostelutiedot
INSERT INTO public.feeding_guidelines (dog_food_id, adult_weight_kg, age_months, calculation_formula) 
SELECT 
    df.id,
    NULL, '1-2', 'Aikuispaino_kg × 100'
FROM public.dog_foods df WHERE df.product_code = 'MUSH_PUPPY_T1'
UNION ALL
SELECT 
    df.id,
    NULL, '2-4', 'Aikuispaino_kg × 75'
FROM public.dog_foods df WHERE df.product_code = 'MUSH_PUPPY_T1'
UNION ALL
SELECT 
    df.id,
    NULL, '4-6', 'Aikuispaino_kg × 50'
FROM public.dog_foods df WHERE df.product_code = 'MUSH_PUPPY_T1'
UNION ALL
SELECT 
    df.id,
    NULL, '6-9', 'Aikuispaino_kg × 30'
FROM public.dog_foods df WHERE df.product_code = 'MUSH_PUPPY_T1'
UNION ALL
SELECT 
    df.id,
    NULL, '9+', 'Aikuispaino_kg × 25'
FROM public.dog_foods df WHERE df.product_code = 'MUSH_PUPPY_T1';

-- Lisätään MUSH yleisohje
INSERT INTO public.feeding_guidelines (dog_food_id, calculation_formula) 
SELECT 
    df.id,
    'Nykyinen_paino_kg × 1000 × (0.05-0.10)'
FROM public.dog_foods df WHERE df.product_code = 'MUSH_PUPPY_T2';

-- Lisätään SMAAK painoperusteiset tiedot
INSERT INTO public.feeding_guidelines (dog_food_id, current_weight_kg, daily_amount_min, daily_amount_max) 
SELECT 
    df.id,
    5, 75, 150
FROM public.dog_foods df WHERE df.product_code = 'SMAAK_PUPPY'
UNION ALL
SELECT 
    df.id,
    10, 150, 300
FROM public.dog_foods df WHERE df.product_code = 'SMAAK_PUPPY'
UNION ALL
SELECT 
    df.id,
    15, 225, 450
FROM public.dog_foods df WHERE df.product_code = 'SMAAK_PUPPY'
UNION ALL
SELECT 
    df.id,
    20, 300, 600
FROM public.dog_foods df WHERE df.product_code = 'SMAAK_PUPPY'
UNION ALL
SELECT 
    df.id,
    25, 375, 750
FROM public.dog_foods df WHERE df.product_code = 'SMAAK_PUPPY';

-- Lisätään Brit märkäruokien kokoluokkaperusteiset tiedot (täysravinto)
INSERT INTO public.feeding_guidelines (dog_food_id, size_category, daily_amount_min, daily_amount_max) 
SELECT 
    df.id,
    'Pieni (1-10 kg)', 200, 400
FROM public.dog_foods df WHERE df.product_code = 'BP_WET_BEEF_FULL'
UNION ALL
SELECT 
    df.id,
    'Keski (10-25 kg)', 400, 800
FROM public.dog_foods df WHERE df.product_code = 'BP_WET_BEEF_FULL'
UNION ALL
SELECT 
    df.id,
    'Suuri (25-50 kg)', 800, 1200
FROM public.dog_foods df WHERE df.product_code = 'BP_WET_BEEF_FULL';

-- Lisätään Brit märkäruokien kokoluokkaperusteiset tiedot (täydennysravinto)
INSERT INTO public.feeding_guidelines (dog_food_id, size_category, daily_amount_min, daily_amount_max) 
SELECT 
    df.id,
    'Pieni (1-10 kg)', 100, 200
FROM public.dog_foods df WHERE df.product_code = 'BP_WET_BEEF_COMP'
UNION ALL
SELECT 
    df.id,
    'Keski (10-25 kg)', 200, 400
FROM public.dog_foods df WHERE df.product_code = 'BP_WET_BEEF_COMP'
UNION ALL
SELECT 
    df.id,
    'Suuri (25-50 kg)', 400, 600
FROM public.dog_foods df WHERE df.product_code = 'BP_WET_BEEF_COMP';

-- Lisätään Essential The Beginning vaihtelevin arvoin
INSERT INTO public.feeding_guidelines (dog_food_id, adult_weight_kg, calculation_formula) 
SELECT 
    df.id,
    15, '10.5-42.5 g/kg/päivä'
FROM public.dog_foods df WHERE df.product_code = 'ESSENTIAL_BEGIN';

-- Lisätään Jahti&Vahti painoperusteiset tiedot
INSERT INTO public.feeding_guidelines (dog_food_id, calculation_formula) 
SELECT 
    df.id,
    '8.0-33.3 g/kg/päivä'
FROM public.dog_foods df WHERE df.product_code = 'JV_PUPPY';

-- Lisätään Farm Food HE painoperusteiset tiedot  
INSERT INTO public.feeding_guidelines (dog_food_id, calculation_formula) 
SELECT 
    df.id,
    '22.0-42.0 g/kg/päivä'
FROM public.dog_foods df WHERE df.product_code = 'FF_HE_PUPPY';