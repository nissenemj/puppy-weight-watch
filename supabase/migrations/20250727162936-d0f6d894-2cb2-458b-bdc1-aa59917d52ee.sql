-- Create table for socialization achievements
CREATE TABLE public.socialization_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL,
  category_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.socialization_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements
CREATE POLICY "Users can view achievements for their books" 
ON public.socialization_achievements 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM puppy_books 
  WHERE puppy_books.id = socialization_achievements.book_id 
  AND puppy_books.owner_id = auth.uid()
));

CREATE POLICY "Users can create achievements for their books" 
ON public.socialization_achievements 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM puppy_books 
  WHERE puppy_books.id = socialization_achievements.book_id 
  AND puppy_books.owner_id = auth.uid()
));

CREATE POLICY "Users can delete achievements for their books" 
ON public.socialization_achievements 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM puppy_books 
  WHERE puppy_books.id = socialization_achievements.book_id 
  AND puppy_books.owner_id = auth.uid()
));

-- Create table for weekly socialization tasks
CREATE TABLE public.socialization_weekly_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES socialization_items(id),
  week_number INTEGER NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.socialization_weekly_tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing weekly tasks (everyone can see them)
CREATE POLICY "Everyone can view weekly tasks" 
ON public.socialization_weekly_tasks 
FOR SELECT 
USING (true);

-- Admin can manage weekly tasks
CREATE POLICY "Admin can manage weekly tasks" 
ON public.socialization_weekly_tasks 
FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'nissenemj@gmail.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'nissenemj@gmail.com'::text);

-- Add index for better performance
CREATE INDEX idx_weekly_tasks_week ON socialization_weekly_tasks(week_number);
CREATE INDEX idx_weekly_tasks_item ON socialization_weekly_tasks(item_id);

-- Function to automatically award achievements when category is completed
CREATE OR REPLACE FUNCTION public.check_category_completion()
RETURNS TRIGGER AS $$
DECLARE
  category_complete BOOLEAN;
  category_name TEXT;
BEGIN
  -- Check if category has enough positive experiences (at least 3)
  SELECT 
    NEW.positive_experiences >= 3,
    sc.name
  INTO category_complete, category_name
  FROM socialization_categories sc
  WHERE sc.id = NEW.category_id;
  
  -- Award achievement if category is completed and stamp not yet earned
  IF category_complete AND NOT OLD.stamp_earned AND NOT NEW.stamp_earned THEN
    -- Mark stamp as earned
    NEW.stamp_earned = true;
    NEW.stamp_earned_date = CURRENT_DATE;
    
    -- Insert achievement record
    INSERT INTO public.socialization_achievements (book_id, category_id, name, description)
    VALUES (
      NEW.book_id,
      NEW.category_id,
      'Kategoria suoritettu: ' || category_name,
      'Ansaittu keräämällä vähintään 3 positiivista kokemusta kategoriasta ' || category_name
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic achievement awarding
CREATE TRIGGER trigger_check_category_completion
  BEFORE UPDATE ON public.socialization_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.check_category_completion();