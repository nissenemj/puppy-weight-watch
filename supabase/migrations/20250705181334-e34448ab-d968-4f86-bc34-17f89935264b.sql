-- Lisätään Brit märkäruokien kokoluokkaperusteiset tiedot (täysravinto ja täydennysravinto)
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
FROM public.dog_foods df WHERE df.product_code = 'BP_WET_BEEF_FULL'
UNION ALL
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