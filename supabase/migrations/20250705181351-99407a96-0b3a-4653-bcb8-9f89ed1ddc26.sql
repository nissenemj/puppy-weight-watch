-- Lisätään laskukaavoihin perustuvat annostelutiedot
INSERT INTO public.feeding_guidelines (dog_food_id, calculation_formula) 
SELECT 
    df.id,
    'Nykyinen_paino_kg × 1000 × (0.05-0.10)'
FROM public.dog_foods df WHERE df.product_code = 'MUSH_PUPPY_T2'
UNION ALL
SELECT 
    df.id,
    '10.5-42.5 g/kg/päivä'
FROM public.dog_foods df WHERE df.product_code = 'ESSENTIAL_BEGIN'
UNION ALL
SELECT 
    df.id,
    '8.0-33.3 g/kg/päivä'
FROM public.dog_foods df WHERE df.product_code = 'JV_PUPPY'
UNION ALL
SELECT 
    df.id,
    '22.0-42.0 g/kg/päivä'
FROM public.dog_foods df WHERE df.product_code = 'FF_HE_PUPPY';