-- Create table for general dosage guidelines (not tied to images)
CREATE TABLE public.general_dosage_guidelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  food_brand TEXT,
  food_name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for general dosage guidelines
ALTER TABLE public.general_dosage_guidelines ENABLE ROW LEVEL SECURITY;

-- Create policies for general dosage guidelines
CREATE POLICY "Users can view their own guidelines or admin can view all" 
ON public.general_dosage_guidelines 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

CREATE POLICY "Users can create their own guidelines or admin can create any" 
ON public.general_dosage_guidelines 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

CREATE POLICY "Users can update their own guidelines or admin can update any" 
ON public.general_dosage_guidelines 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

CREATE POLICY "Users can delete their own guidelines or admin can delete any" 
ON public.general_dosage_guidelines 
FOR DELETE 
USING (
  auth.uid() = user_id OR 
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

-- Create table for general dosage table rows
CREATE TABLE public.general_dosage_table_rows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guideline_id UUID NOT NULL REFERENCES public.general_dosage_guidelines(id) ON DELETE CASCADE,
  weight_range TEXT,
  age_range TEXT,
  daily_amount TEXT,
  notes TEXT,
  row_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for general dosage table rows
ALTER TABLE public.general_dosage_table_rows ENABLE ROW LEVEL SECURITY;

-- Create policies for general dosage table rows
CREATE POLICY "Users can view table rows for their guidelines or admin can view all" 
ON public.general_dosage_table_rows 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.general_dosage_guidelines 
    WHERE id = general_dosage_table_rows.guideline_id 
    AND user_id = auth.uid()
  ) OR
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

CREATE POLICY "Users can create table rows for their guidelines or admin can create any" 
ON public.general_dosage_table_rows 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.general_dosage_guidelines 
    WHERE id = general_dosage_table_rows.guideline_id 
    AND user_id = auth.uid()
  ) OR
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

CREATE POLICY "Users can update table rows for their guidelines or admin can update any" 
ON public.general_dosage_table_rows 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.general_dosage_guidelines 
    WHERE id = general_dosage_table_rows.guideline_id 
    AND user_id = auth.uid()
  ) OR
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

CREATE POLICY "Users can delete table rows for their guidelines or admin can delete any" 
ON public.general_dosage_table_rows 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.general_dosage_guidelines 
    WHERE id = general_dosage_table_rows.guideline_id 
    AND user_id = auth.uid()
  ) OR
  (auth.jwt() ->> 'email')::text = 'nissenemj@gmail.com'
);

-- Create trigger for automatic timestamp updates on general dosage guidelines
CREATE TRIGGER update_general_dosage_guidelines_updated_at
BEFORE UPDATE ON public.general_dosage_guidelines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();