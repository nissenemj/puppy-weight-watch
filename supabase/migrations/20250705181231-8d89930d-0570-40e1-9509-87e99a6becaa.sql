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