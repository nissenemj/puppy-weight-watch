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