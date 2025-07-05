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