-- Fix the function security warning by setting search_path
DROP FUNCTION IF EXISTS public.handle_puppy_book_dog_creation() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_puppy_book_dog_creation()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_dog_id UUID;
BEGIN
  -- If dog_id is null, create a new dog
  IF NEW.dog_id IS NULL THEN
    INSERT INTO public.dogs (user_id, name, created_at)
    VALUES (NEW.owner_id, 'Uusi pentu', now())
    RETURNING id INTO new_dog_id;
    
    NEW.dog_id = new_dog_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trigger_puppy_book_dog_creation
  BEFORE INSERT ON public.puppy_books
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_puppy_book_dog_creation();