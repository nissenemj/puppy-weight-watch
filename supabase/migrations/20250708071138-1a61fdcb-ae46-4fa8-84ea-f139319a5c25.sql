-- Lisää yhteys dog_foods ja dosage_images taulujen välille
ALTER TABLE dosage_images 
ADD COLUMN dog_food_id UUID;

-- Lisää foreign key constraint
ALTER TABLE dosage_images 
ADD CONSTRAINT fk_dosage_images_dog_food 
FOREIGN KEY (dog_food_id) REFERENCES dog_foods(id) ON DELETE CASCADE;

-- Luo indeksi suorituskyvyn parantamiseksi
CREATE INDEX idx_dosage_images_dog_food_id ON dosage_images(dog_food_id);

-- Päivitä olemassa olevat tiedot MUSH-ruoille
UPDATE dosage_images 
SET dog_food_id = (
  SELECT id FROM dog_foods 
  WHERE manufacturer = 'MUSH' 
  AND name LIKE '%Puppy%' 
  LIMIT 1
)
WHERE food_brand = 'MUSH';