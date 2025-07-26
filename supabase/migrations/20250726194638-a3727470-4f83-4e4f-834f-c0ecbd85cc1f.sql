-- First, add proper foreign key constraint to puppy_books.dog_id
ALTER TABLE public.puppy_books 
ADD CONSTRAINT fk_puppy_books_dog_id 
FOREIGN KEY (dog_id) REFERENCES public.dogs(id) ON DELETE CASCADE;

-- Create function to automatically create a dog when puppy book is created without dog_id
CREATE OR REPLACE FUNCTION public.handle_puppy_book_dog_creation()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for automatic dog creation
CREATE TRIGGER trigger_puppy_book_dog_creation
  BEFORE INSERT ON public.puppy_books
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_puppy_book_dog_creation();

-- Update existing puppy books that don't have a dog_id
DO $$
DECLARE
  book_record RECORD;
  new_dog_id UUID;
BEGIN
  FOR book_record IN SELECT id, owner_id FROM public.puppy_books WHERE dog_id IS NULL
  LOOP
    -- Create a new dog for each orphaned puppy book
    INSERT INTO public.dogs (user_id, name, created_at)
    VALUES (book_record.owner_id, 'Pennun nimi', now())
    RETURNING id INTO new_dog_id;
    
    -- Link the puppy book to the new dog
    UPDATE public.puppy_books 
    SET dog_id = new_dog_id 
    WHERE id = book_record.id;
  END LOOP;
END $$;