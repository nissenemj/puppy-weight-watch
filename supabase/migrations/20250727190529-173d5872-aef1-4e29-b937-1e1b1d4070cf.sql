-- Create friends table for puppy book friend registry
CREATE TABLE public.friends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL,
  name TEXT NOT NULL,
  friend_type TEXT NOT NULL CHECK (friend_type IN ('dog', 'human')),
  breed TEXT,
  description TEXT,
  meeting_location TEXT,
  activities TEXT[],
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Create policies for friends
CREATE POLICY "Users can view friends for their books" 
ON public.friends 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM puppy_books 
  WHERE puppy_books.id = friends.book_id 
  AND puppy_books.owner_id = auth.uid()
));

CREATE POLICY "Users can create friends for their books" 
ON public.friends 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM puppy_books 
  WHERE puppy_books.id = friends.book_id 
  AND puppy_books.owner_id = auth.uid()
));

CREATE POLICY "Users can update friends for their books" 
ON public.friends 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM puppy_books 
  WHERE puppy_books.id = friends.book_id 
  AND puppy_books.owner_id = auth.uid()
));

CREATE POLICY "Users can delete friends for their books" 
ON public.friends 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM puppy_books 
  WHERE puppy_books.id = friends.book_id 
  AND puppy_books.owner_id = auth.uid()
));

-- Add trigger for updated_at
CREATE TRIGGER update_friends_updated_at
BEFORE UPDATE ON public.friends
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();