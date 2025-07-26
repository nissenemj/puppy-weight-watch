-- Add dog_id to weight_entries table to link entries to specific dogs
ALTER TABLE public.weight_entries 
ADD COLUMN dog_id UUID REFERENCES public.dogs(id) ON DELETE CASCADE;

-- Update weight_entries RLS policies to support dog-based access
DROP POLICY IF EXISTS "Users can view own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can insert own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can update own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can delete own weight entries" ON public.weight_entries;

-- Create new RLS policies that check both user_id and dog ownership
CREATE POLICY "Users can view weight entries for their dogs" 
ON public.weight_entries 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.dogs 
    WHERE dogs.id = weight_entries.dog_id 
    AND dogs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert weight entries for their dogs" 
ON public.weight_entries 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.dogs 
    WHERE dogs.id = weight_entries.dog_id 
    AND dogs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update weight entries for their dogs" 
ON public.weight_entries 
FOR UPDATE 
USING (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.dogs 
    WHERE dogs.id = weight_entries.dog_id 
    AND dogs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete weight entries for their dogs" 
ON public.weight_entries 
FOR DELETE 
USING (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.dogs 
    WHERE dogs.id = weight_entries.dog_id 
    AND dogs.user_id = auth.uid()
  )
);

-- Add dog_id to puppy_books if not already present (link puppy book to specific dog)
ALTER TABLE public.puppy_books 
ADD COLUMN IF NOT EXISTS dog_id UUID REFERENCES public.dogs(id) ON DELETE SET NULL;