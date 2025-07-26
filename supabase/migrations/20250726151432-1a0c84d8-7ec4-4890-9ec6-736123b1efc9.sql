-- Create function to automatically create timeline entries for weight entries
CREATE OR REPLACE FUNCTION create_weight_timeline_entry()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create timeline entry if the weight entry has a dog_id
  IF NEW.dog_id IS NOT NULL THEN
    INSERT INTO timeline_entries (
      book_id,
      entry_type,
      title,
      description,
      entry_date,
      metadata,
      is_highlight,
      created_by
    )
    SELECT 
      pb.id as book_id,
      'weight_measurement' as entry_type,
      'Painomittaus: ' || NEW.weight || 'kg' as title,
      'Pentu painoi ' || NEW.weight || 'kg' as description,
      NEW.date as entry_date,
      jsonb_build_object(
        'weight_kg', NEW.weight,
        'weight_entry_id', NEW.id,
        'auto_generated', true
      ) as metadata,
      false as is_highlight,
      NEW.user_id as created_by
    FROM puppy_books pb
    WHERE pb.dog_id = NEW.dog_id
    AND pb.owner_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on weight_entries table
DROP TRIGGER IF EXISTS weight_entry_timeline_trigger ON weight_entries;
CREATE TRIGGER weight_entry_timeline_trigger
  AFTER INSERT ON weight_entries
  FOR EACH ROW
  EXECUTE FUNCTION create_weight_timeline_entry();

-- Create function to clean up timeline entries when weight entries are deleted
CREATE OR REPLACE FUNCTION cleanup_weight_timeline_entry()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete the corresponding timeline entry
  DELETE FROM timeline_entries
  WHERE metadata->>'weight_entry_id' = OLD.id::text
  AND entry_type = 'weight_measurement';
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cleanup on delete
DROP TRIGGER IF EXISTS weight_entry_cleanup_trigger ON weight_entries;
CREATE TRIGGER weight_entry_cleanup_trigger
  AFTER DELETE ON weight_entries
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_weight_timeline_entry();