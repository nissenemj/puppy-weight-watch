-- Expand dog_foods table with comprehensive puppy food information
ALTER TABLE public.dog_foods 
ADD COLUMN IF NOT EXISTS ingredients TEXT,
ADD COLUMN IF NOT EXISTS country_of_origin TEXT,
ADD COLUMN IF NOT EXISTS ingredient_origin TEXT,
ADD COLUMN IF NOT EXISTS protein_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS fat_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS special_features TEXT[],
ADD COLUMN IF NOT EXISTS feeding_schedule TEXT,
ADD COLUMN IF NOT EXISTS energy_content INTEGER,
ADD COLUMN IF NOT EXISTS price_range TEXT;

-- Add comprehensive Finnish puppy food data
INSERT INTO public.dog_foods (
  product_code, name, manufacturer, food_type, nutrition_type, dosage_method,
  ingredients, country_of_origin, ingredient_origin, protein_percentage, fat_percentage,
  special_features, feeding_schedule, energy_content, notes
) VALUES 
-- Kuivaruoat
('JV_PENTU', 'Jahti&Vahti Pentu', 'Jahti&Vahti', 'Kuiva', 'Täysravinto', 'Odotettu_Aikuispaino_Ja_Ikä',
 'Kananlihajauho, kaura, kananrasva, peruna, juurikasleike, hydrolysoitu panimohiiva (Progut®), vitamiinit ja kivennäisaineet',
 'Suomi', 'Kana kotimainen, muut raaka-aineet pääosin Suomesta', 28.0, 16.0,
 ARRAY['Vehnätön', 'Ei maissia/soijaa/kalaa', 'Hypoallergeeninen', 'Progut-suolistoparanne'],
 '2-4 ateriaa päivässä', 3800, 'Sopii pennuille 8-18 vk, tiineille/imettäville'),

('ESS_BEGIN_SMALL', 'ESSENTIAL the BEGINNING', 'Essential', 'Kuiva', 'Täysravinto', 'Odotettu_Aikuispaino_Ja_Ikä',
 'Tuore kana ja ankka (yli 85% eläinperäisiä), bataatti, herneet, lohi ja taimen, kananmuna, pellavansiemen',
 'Iso-Britannia', 'Kana, ankka, lohi brittiläisiltä maatiloilta', 35.0, 21.0,
 ARRAY['Viljaton', 'Hiivaton', 'Soijaton', 'Matala glykeeminen indeksi', 'DHA/Omega-3'],
 '3-4 ateriaa päivässä', 4200, 'Pienille roduille, alle 15kg aikuispainolle'),

('ESS_BEGIN_LARGE', 'ESSENTIAL the BEGINNING Large Breed', 'Essential', 'Kuiva', 'Täysravinto', 'Odotettu_Aikuispaino_Ja_Ikä',
 'Kana, ankka, lohi, bataatti, herneet - optimoitu suuremmille pennuille',
 'Iso-Britannia', 'Brittiläiset lähteet', 30.0, 16.0,
 ARRAY['Viljaton', 'Hidastaa kasvua suurilla roduille', 'Korkea lihapitoisuus 80%'],
 '3 ateriaa päivässä', 3900, 'Suurille roduille, yli 15kg aikuispainolle'),

('DM_VIMVELI', 'Dagsmark Vimveli', 'Dagsmark', 'Kuiva', 'Täysravinto', 'Nykyinen_Paino',
 'Kotimainen kana (60%), peruna, herneet, kananrasva, pellavansiemen, omenat, puolukat',
 'Suomi', 'Kana Suomesta, muut Suomesta/Pohjoismaista', 30.0, 18.0,
 ARRAY['Viljaton', 'Hypoallergeeninen', 'Ei sokeria/säilöntäaineita'],
 '2-4 ateriaa päivässä', 4000, 'Korkea lihapitoisuus, sopii kaikille roduille'),

('WER_PUPPY', 'Werraton Puppy', 'Rovio Pet Foods', 'Kuiva', 'Täysravinto', 'Odotettu_Aikuispaino_Ja_Ikä',
 'Kana, kananmuna, kaura, ohra, pellava, härkäpapu, peruna, puolukat',
 'Suomi', 'Liha/kala/kananmuna 100% suomalaisia, muut ≥95% Suomesta', 28.0, 16.0,
 ARRAY['Hyvää Suomesta -merkki', 'Lähituotanto', 'Matala hiilijalanjälki'],
 '3-4 ateriaa päivässä', 3700, 'Edullinen, kotimainen vaihtoehto'),

-- Raakaruoat
('MUSH_PUPPY_IB', 'MUSH Vaisto Puppy Ice Blue', 'MUSH', 'Raaka', 'Täysravinto', 'Prosentti_Nykyisestä_Painosta',
 'Naudanliha, poro, lohi (liha, luut, elimet 90-95%), vihannekset (porkkana, parsakaali), kalaöljy',
 'Suomi', 'Liha Suomesta, Norjasta, Ruotsista; vihannekset paikallisia', 15.0, 14.0,
 ARRAY['Raaka', 'Viljaton', 'Lisäaineeton', 'BARF-periaate', 'DHA'],
 '2-3 ateriaa päivässä', 1800, '5-10% painosta, tukee luustoa ja aivoja'),

('OSCAR_PUPPY', 'Oscar Pennun nauta-kana-kasvispullat', 'Oscar', 'Raaka', 'Täysravinto', 'Prosentti_Nykyisestä_Painosta',
 'Suomalainen nauta (liha, elimet), kana (liha, luu), kananmuna, soseutetut kasvikset',
 'Suomi', 'Kaikki raaka-aineet 100% suomalaisia', 16.0, 12.0,
 ARRAY['Raaka', 'Viljaton', '100% kotimainen', 'Helppo annostella'],
 '2-3 ateriaa päivässä', 1900, '4-8% painosta, korkea lihapitoisuus'),

('VOM_PUPPY', 'VOM Puppy', 'VOM', 'Raaka', 'Täysravinto', 'Prosentti_Nykyisestä_Painosta',
 'Kana, naudan maha, lohi, kananmunat, naudan maksa',
 'Norja', 'Liha ja kala Norjasta/Suomesta', 14.0, 12.0,
 ARRAY['Raaka', 'Kehitetty pennuille', 'Omega-3 lohesta', 'Viljaton'],
 '3 ateriaa päivässä', 1850, '6-8% painosta, tukee aivoja ja luustoa'),

-- Märkäruoat  
('HH_WET_PUPPY', 'Hau-Hau Wet Puppy Kana', 'Hau-Hau', 'Märkä', 'Täydennysravinto', 'Nykyinen_Paino',
 'Kana, riisi, vitamiinit',
 'Suomi', 'Kana Suomesta', 9.0, 6.0,
 ARRAY['Edullinen', 'Maistuva', 'Nesteyttävä'],
 'Sekoitettuna kuivaruokaan', 1200, 'Täydennysravinto, 3-5% painosta'),

('SMAAK_WET_FISH', 'SMAAK Wet Puppy Fish', 'SMAAK', 'Märkä', 'Täydennysravinto', 'Nykyinen_Paino',
 'Kala (lohi, silakka), peruna, vitamiinit',
 'Suomi', 'Kala Suomesta (Itämeri)', 10.0, 7.0,
 ARRAY['Viljaton', 'Omega-rikas', 'Tukee turkkia'],
 'Täydennys', 1300, '3-5% painosta, tukee ihoa ja turkkia')

ON CONFLICT (product_code) DO UPDATE SET
name = EXCLUDED.name,
manufacturer = EXCLUDED.manufacturer,
food_type = EXCLUDED.food_type,
nutrition_type = EXCLUDED.nutrition_type,
dosage_method = EXCLUDED.dosage_method,
ingredients = EXCLUDED.ingredients,
country_of_origin = EXCLUDED.country_of_origin,
ingredient_origin = EXCLUDED.ingredient_origin,
protein_percentage = EXCLUDED.protein_percentage,
fat_percentage = EXCLUDED.fat_percentage,
special_features = EXCLUDED.special_features,
feeding_schedule = EXCLUDED.feeding_schedule,
energy_content = EXCLUDED.energy_content,
notes = EXCLUDED.notes;