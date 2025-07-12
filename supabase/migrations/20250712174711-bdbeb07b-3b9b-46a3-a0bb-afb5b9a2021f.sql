-- Pentukirjat
CREATE TABLE public.puppy_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID, -- Voi olla NULL jos ei liity tiettyyn pentuun
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'Pennun elämäntarina',
  cover_image_url TEXT,
  theme JSONB DEFAULT '{"colorScheme": "warm", "fontFamily": "sans-serif"}',
  privacy_settings JSONB DEFAULT '{"visibility": "private", "allowComments": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aikajanan merkinnät
CREATE TABLE public.timeline_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.puppy_books(id) ON DELETE CASCADE NOT NULL,
  entry_type VARCHAR(50) NOT NULL, -- 'weight', 'health', 'milestone', 'memory'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  entry_date DATE NOT NULL,
  metadata JSONB DEFAULT '{}', -- Tyyppikohtaista dataa
  is_highlight BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Muistot
CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_entry_id UUID REFERENCES public.timeline_entries(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.puppy_books(id) ON DELETE CASCADE NOT NULL,
  content_type VARCHAR(20) NOT NULL DEFAULT 'text', -- 'text', 'image', 'video'
  content_url TEXT, -- Kuva/video URL storage bucketista
  caption TEXT,
  tags TEXT[] DEFAULT '{}',
  location JSONB, -- {"lat": 60.1699, "lng": 24.9384, "name": "Helsinki"}
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reaktiot muistoihin
CREATE TABLE public.memory_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction_type VARCHAR(20) NOT NULL DEFAULT 'heart',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(memory_id, user_id, reaction_type)
);

-- Kommentit muistoihin
CREATE TABLE public.memory_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Virstanpylväät
CREATE TABLE public.puppy_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.puppy_books(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_age_weeks INTEGER, -- Tavoite-ikä viikoissa
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies

-- Pentukirjat
ALTER TABLE public.puppy_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own puppy books"
ON public.puppy_books
FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own puppy books"
ON public.puppy_books
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own puppy books"
ON public.puppy_books
FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own puppy books"
ON public.puppy_books
FOR DELETE
USING (auth.uid() = owner_id);

-- Aikajanan merkinnät
ALTER TABLE public.timeline_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view timeline entries for their books"
ON public.timeline_entries
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = timeline_entries.book_id 
  AND owner_id = auth.uid()
));

CREATE POLICY "Users can create timeline entries for their books"
ON public.timeline_entries
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = timeline_entries.book_id 
  AND owner_id = auth.uid()
));

CREATE POLICY "Users can update timeline entries for their books"
ON public.timeline_entries
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = timeline_entries.book_id 
  AND owner_id = auth.uid()
));

CREATE POLICY "Users can delete timeline entries for their books"
ON public.timeline_entries
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = timeline_entries.book_id 
  AND owner_id = auth.uid()
));

-- Muistot
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view memories for their books"
ON public.memories
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = memories.book_id 
  AND owner_id = auth.uid()
));

CREATE POLICY "Users can create memories for their books"
ON public.memories
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = memories.book_id 
  AND owner_id = auth.uid()
));

CREATE POLICY "Users can update memories for their books"
ON public.memories
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = memories.book_id 
  AND owner_id = auth.uid()
));

CREATE POLICY "Users can delete memories for their books"
ON public.memories
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = memories.book_id 
  AND owner_id = auth.uid()
));

-- Reaktiot
ALTER TABLE public.memory_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reactions for memories in their books"
ON public.memory_reactions
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.memories m
  JOIN public.puppy_books pb ON m.book_id = pb.id
  WHERE m.id = memory_reactions.memory_id 
  AND pb.owner_id = auth.uid()
));

CREATE POLICY "Users can create reactions for memories in their books"
ON public.memory_reactions
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.memories m
  JOIN public.puppy_books pb ON m.book_id = pb.id
  WHERE m.id = memory_reactions.memory_id 
  AND pb.owner_id = auth.uid()
) AND auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
ON public.memory_reactions
FOR DELETE
USING (auth.uid() = user_id);

-- Kommentit
ALTER TABLE public.memory_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments for memories in their books"
ON public.memory_comments
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.memories m
  JOIN public.puppy_books pb ON m.book_id = pb.id
  WHERE m.id = memory_comments.memory_id 
  AND pb.owner_id = auth.uid()
));

CREATE POLICY "Users can create comments for memories in their books"
ON public.memory_comments
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.memories m
  JOIN public.puppy_books pb ON m.book_id = pb.id
  WHERE m.id = memory_comments.memory_id 
  AND pb.owner_id = auth.uid()
) AND auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.memory_comments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.memory_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Virstanpylväät
ALTER TABLE public.puppy_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view milestones for their books"
ON public.puppy_milestones
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = puppy_milestones.book_id 
  AND owner_id = auth.uid()
));

CREATE POLICY "Users can create milestones for their books"
ON public.puppy_milestones
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = puppy_milestones.book_id 
  AND owner_id = auth.uid()
));

CREATE POLICY "Users can update milestones for their books"
ON public.puppy_milestones
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = puppy_milestones.book_id 
  AND owner_id = auth.uid()
));

CREATE POLICY "Users can delete milestones for their books"
ON public.puppy_milestones
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.puppy_books 
  WHERE id = puppy_milestones.book_id 
  AND owner_id = auth.uid()
));

-- Triggerit päivitetyille aikaleimoille
CREATE TRIGGER update_puppy_books_updated_at
BEFORE UPDATE ON public.puppy_books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timeline_entries_updated_at
BEFORE UPDATE ON public.timeline_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memories_updated_at
BEFORE UPDATE ON public.memories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memory_comments_updated_at
BEFORE UPDATE ON public.memory_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_puppy_milestones_updated_at
BEFORE UPDATE ON public.puppy_milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indeksit suorituskyvyn parantamiseksi
CREATE INDEX idx_puppy_books_owner_id ON public.puppy_books(owner_id);
CREATE INDEX idx_timeline_entries_book_id ON public.timeline_entries(book_id);
CREATE INDEX idx_timeline_entries_date ON public.timeline_entries(entry_date DESC);
CREATE INDEX idx_memories_book_id ON public.memories(book_id);
CREATE INDEX idx_memories_timeline_entry_id ON public.memories(timeline_entry_id);
CREATE INDEX idx_memory_reactions_memory_id ON public.memory_reactions(memory_id);
CREATE INDEX idx_memory_comments_memory_id ON public.memory_comments(memory_id);
CREATE INDEX idx_puppy_milestones_book_id ON public.puppy_milestones(book_id);

-- Storage bucket pentukirjan kuville
INSERT INTO storage.buckets (id, name, public) 
VALUES ('puppy-books', 'puppy-books', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can view puppy book images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'puppy-books');

CREATE POLICY "Users can upload images to their puppy books"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'puppy-books' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their puppy book images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'puppy-books' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their puppy book images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'puppy-books' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);