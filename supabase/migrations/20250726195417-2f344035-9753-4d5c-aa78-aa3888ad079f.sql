-- Remove duplicate foreign key constraint from puppy_books table
-- Check existing constraints first
SELECT constraint_name, table_name, column_name 
FROM information_schema.key_column_usage 
WHERE table_name = 'puppy_books' AND column_name = 'dog_id';

-- Drop the manually created constraint to avoid duplicates
ALTER TABLE public.puppy_books 
DROP CONSTRAINT IF EXISTS fk_puppy_books_dog_id;

-- The system-generated constraint puppy_books_dog_id_fkey should remain