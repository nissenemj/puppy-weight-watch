-- Add fields to puppy_milestones for rich monthly milestone data
ALTER TABLE public.puppy_milestones 
ADD COLUMN IF NOT EXISTS month_number integer,
ADD COLUMN IF NOT EXISTS completion_images text[],
ADD COLUMN IF NOT EXISTS completion_location jsonb,
ADD COLUMN IF NOT EXISTS completion_time time,
ADD COLUMN IF NOT EXISTS completion_notes text;

-- Create index for efficient querying by month
CREATE INDEX IF NOT EXISTS idx_puppy_milestones_month ON public.puppy_milestones(book_id, month_number);

-- Add function to automatically create timeline entry when milestone is completed
CREATE OR REPLACE FUNCTION public.create_milestone_timeline_entry()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create timeline entry when milestone is marked as completed
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    INSERT INTO public.timeline_entries (
      book_id,
      title,
      description,
      entry_type,
      entry_date,
      metadata,
      created_by
    ) VALUES (
      NEW.book_id,
      'Virstanpylväs saavutettu: ' || NEW.title,
      COALESCE(NEW.completion_notes, NEW.description),
      'milestone',
      COALESCE(NEW.completed_at::date, CURRENT_DATE),
      jsonb_build_object(
        'milestone_id', NEW.id,
        'month_number', NEW.month_number,
        'images', NEW.completion_images,
        'location', NEW.completion_location,
        'completion_time', NEW.completion_time
      ),
      NEW.completed_by
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timeline entry creation
DROP TRIGGER IF EXISTS milestone_completion_trigger ON public.puppy_milestones;
CREATE TRIGGER milestone_completion_trigger
  AFTER UPDATE ON public.puppy_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.create_milestone_timeline_entry();