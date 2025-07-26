-- Update existing weight entries with NULL dog_id to link them to Frodo
UPDATE weight_entries 
SET dog_id = 'cd4ac0b0-9d5d-4dae-beb3-3be4b6f78887'
WHERE user_id = 'cf7cd220-b6fb-4dfb-94c2-820aa84442b9' 
AND dog_id IS NULL;