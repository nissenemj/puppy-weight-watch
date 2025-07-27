-- Check current data first
SELECT 
  pb.id as book_id, 
  pb.title, 
  pb.dog_id as current_dog_id,
  d.name as current_dog_name
FROM puppy_books pb
LEFT JOIN dogs d ON pb.dog_id = d.id;

-- Check all dogs
SELECT id, name, user_id FROM dogs;

-- Check weight entries with dog names
SELECT 
  we.id,
  we.dog_id,
  we.weight,
  we.date,
  d.name as dog_name
FROM weight_entries we
LEFT JOIN dogs d ON we.dog_id = d.id
ORDER BY we.date;

-- Update puppy book to point to Frodo with weight data
UPDATE puppy_books 
SET dog_id = (
  SELECT DISTINCT we.dog_id 
  FROM weight_entries we 
  JOIN dogs d ON we.dog_id = d.id 
  WHERE d.name = 'Frodo'
  LIMIT 1
)
WHERE title LIKE '%Frodo%' OR id IN (
  SELECT pb.id FROM puppy_books pb 
  JOIN dogs d ON pb.dog_id = d.id 
  WHERE d.name IN ('Pennun nimi', 'Frodo')
);

-- Delete the duplicate dog (the one without weight data)
DELETE FROM dogs 
WHERE name = 'Pennun nimi' 
AND id NOT IN (
  SELECT DISTINCT dog_id 
  FROM weight_entries 
  WHERE dog_id IS NOT NULL
);