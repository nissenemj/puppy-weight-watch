-- Create health_records table for puppy book health entries
CREATE TABLE public.health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL,
  entry_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vaccination', 'deworming', 'checkup', 'other')),
  description TEXT NOT NULL,
  notes TEXT,
  veterinarian TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view health records for their books" 
ON public.health_records 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE puppy_books.id = health_records.book_id 
  AND puppy_books.owner_id = auth.uid()
));

CREATE POLICY "Users can create health records for their books" 
ON public.health_records 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE puppy_books.id = health_records.book_id 
  AND puppy_books.owner_id = auth.uid()
));

CREATE POLICY "Users can update health records for their books" 
ON public.health_records 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE puppy_books.id = health_records.book_id 
  AND puppy_books.owner_id = auth.uid()
));

CREATE POLICY "Users can delete health records for their books" 
ON public.health_records 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE puppy_books.id = health_records.book_id 
  AND puppy_books.owner_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_health_records_updated_at
BEFORE UPDATE ON public.health_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();