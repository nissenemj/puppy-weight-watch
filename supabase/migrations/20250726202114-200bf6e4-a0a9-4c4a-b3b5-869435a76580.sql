-- Fix the Frodo puppy book to link to the correct dog
UPDATE puppy_books 
SET dog_id = 'cd4ac0b0-9d5d-4dae-beb3-3be4b6f78887'
WHERE title = 'Frodo' 
AND owner_id IN (
  SELECT auth.uid() FROM auth.users WHERE email = 'mjnissen@gmail.com'
);

-- Link the unlinked weight entries to the Frodo dog
UPDATE weight_entries 
SET dog_id = 'cd4ac0b0-9d5d-4dae-beb3-3be4b6f78887'
WHERE dog_id IS NULL 
AND user_id IN (
  SELECT auth.uid() FROM auth.users WHERE email = 'mjnissen@gmail.com'
);