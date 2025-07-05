-- Lisätään uusia koiranruokia ja niiden annostelutietoja (korjattu versio)

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