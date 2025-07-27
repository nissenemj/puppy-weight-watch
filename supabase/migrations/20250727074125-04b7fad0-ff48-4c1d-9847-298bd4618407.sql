-- Create socialization categories table
CREATE TABLE public.socialization_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create socialization items table
CREATE TABLE public.socialization_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES socialization_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  why_important TEXT,
  min_age_weeks INTEGER,
  max_age_weeks INTEGER,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  duration_minutes INTEGER,
  distance_guidance TEXT,
  tips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create socialization experiences table
CREATE TABLE public.socialization_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES puppy_books(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES socialization_items(id) ON DELETE CASCADE,
  experience_date DATE NOT NULL,
  experience_time TIME,
  puppy_reaction TEXT CHECK (puppy_reaction IN ('relaxed', 'hesitant', 'fearful')),
  distance_meters NUMERIC,
  duration_minutes INTEGER,
  notes TEXT,
  images TEXT[],
  treats_given BOOLEAN DEFAULT false,
  rest_after BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create socialization progress table
CREATE TABLE public.socialization_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES puppy_books(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES socialization_categories(id) ON DELETE CASCADE,
  positive_experiences INTEGER DEFAULT 0,
  negative_experiences INTEGER DEFAULT 0,
  last_activity_date DATE,
  stamp_earned BOOLEAN DEFAULT false,
  stamp_earned_date DATE,
  achievements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(book_id, category_id)
);

-- Enable RLS on all tables
ALTER TABLE public.socialization_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socialization_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socialization_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socialization_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories (public read, admin manage)
CREATE POLICY "Everyone can view socialization categories"
  ON public.socialization_categories FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage socialization categories"
  ON public.socialization_categories FOR ALL
  USING ((auth.jwt() ->> 'email') = 'nissenemj@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'nissenemj@gmail.com');

-- RLS policies for items (public read, admin manage)
CREATE POLICY "Everyone can view socialization items"
  ON public.socialization_items FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage socialization items"
  ON public.socialization_items FOR ALL
  USING ((auth.jwt() ->> 'email') = 'nissenemj@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'nissenemj@gmail.com');

-- RLS policies for experiences (user owns book)
CREATE POLICY "Users can create experiences for their books"
  ON public.socialization_experiences FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM puppy_books 
    WHERE id = book_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Users can view experiences for their books"
  ON public.socialization_experiences FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM puppy_books 
    WHERE id = book_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Users can update experiences for their books"
  ON public.socialization_experiences FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM puppy_books 
    WHERE id = book_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete experiences for their books"
  ON public.socialization_experiences FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM puppy_books 
    WHERE id = book_id AND owner_id = auth.uid()
  ));

-- RLS policies for progress (user owns book)
CREATE POLICY "Users can manage progress for their books"
  ON public.socialization_progress FOR ALL
  USING (EXISTS (
    SELECT 1 FROM puppy_books 
    WHERE id = book_id AND owner_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM puppy_books 
    WHERE id = book_id AND owner_id = auth.uid()
  ));

-- Create trigger for updating progress
CREATE OR REPLACE FUNCTION update_socialization_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert progress for the category
  INSERT INTO public.socialization_progress (book_id, category_id, positive_experiences, negative_experiences, last_activity_date)
  SELECT 
    NEW.book_id,
    si.category_id,
    CASE WHEN NEW.puppy_reaction = 'relaxed' THEN 1 ELSE 0 END,
    CASE WHEN NEW.puppy_reaction = 'fearful' THEN 1 ELSE 0 END,
    NEW.experience_date
  FROM socialization_items si 
  WHERE si.id = NEW.item_id
  ON CONFLICT (book_id, category_id) 
  DO UPDATE SET
    positive_experiences = socialization_progress.positive_experiences + 
      CASE WHEN NEW.puppy_reaction = 'relaxed' THEN 1 ELSE 0 END,
    negative_experiences = socialization_progress.negative_experiences + 
      CASE WHEN NEW.puppy_reaction = 'fearful' THEN 1 ELSE 0 END,
    last_activity_date = NEW.experience_date,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_socialization_progress_trigger
  AFTER INSERT ON public.socialization_experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_socialization_progress();

-- Insert default categories
INSERT INTO public.socialization_categories (name, description, icon, display_order) VALUES
('Ihmiset', 'Erilaiset ihmiset ja ikäryhmät', '👥', 1),
('Eläimet', 'Muut koirat, kissat ja eläimet', '🐕', 2),
('Ympäristöt', 'Erilaiset paikat ja pinnat', '🌍', 3),
('Äänet', 'Kodin ja kaupungin äänet', '🔊', 4),
('Esineet', 'Apuvälineet ja tavarat', '🧳', 5),
('Liikenne', 'Ajoneuvot ja kulkuvälineet', '🚗', 6);

-- Insert sample socialization items for each category
INSERT INTO public.socialization_items (category_id, name, description, why_important, min_age_weeks, max_age_weeks, difficulty_level, duration_minutes, distance_guidance, tips) 
SELECT 
  c.id,
  items.name,
  items.description,
  items.why_important,
  items.min_age_weeks,
  items.max_age_weeks,
  items.difficulty_level,
  items.duration_minutes,
  items.distance_guidance,
  items.tips
FROM socialization_categories c,
(VALUES 
  -- Ihmiset
  ('Ihmiset', 'Rauhallinen aikuinen', 'Tutustuminen ystävälliseen aikuiseen', 'Luo perustan ihmisluottamukseen kriittisellä jaksolla', 5, 16, 1, 5, 'Aloita 2-3 metrin etäisyydeltä', ARRAY['Anna ihmisen antaa herkkuja', 'Pysy itse rauhallisena', 'Älä pakota kontaktia']),
  ('Ihmiset', 'Lapsi', 'Tutustuminen rauhalliseen lapseen', 'Ehkäisee pelkoja lapsia kohtaan', 6, 14, 2, 3, 'Varmista että lapsi osaa käyttäytyä', ARRAY['Opeta lasta liikkumaan hitaasti', 'Valvo tilannetta tarkasti']),
  ('Ihmiset', 'Henkilö hattu päässä', 'Ihminen erilaisella ulkonäöllä', 'Auttaa tunnistamaan ihmiset vaatteista huolimatta', 7, 16, 2, 5, 'Aloita ilman hattua, lisää se vähitellen', ARRAY['Käytä samaa henkilöä', 'Palkitse rauhallisesta käyttäytymisestä']),
  ('Ihmiset', 'Pyörätuolia käyttävä', 'Apuvälineitä käyttävä henkilö', 'Välttää pelkoja liikuntarajoitteisia kohtaan', 8, 16, 3, 5, 'Pyörätuoli paikallaan aluksi', ARRAY['Anna pyörätuolin käyttäjän tarjota herkkuja', 'Siirry liikkeeseen vasta kun pentu on rento']),
  
  -- Eläimet  
  ('Eläimet', 'Rauhallinen aikuiskoira', 'Tutustuminen toiseen koiraan', 'Kehittää sosiaalisia taitoja muiden koirien kanssa', 9, 16, 2, 10, 'Pidä riittävä etäisyys hihnassa', ARRAY['Varmista että toinen koira on ystävällinen', 'Älä pakota kohtaamista', 'Lopeta positiiviseen hetkeen']),
  ('Eläimet', 'Kissa', 'Tutustuminen kissaan', 'Ehkäisee kisojen jahtaamista', 8, 14, 2, 5, 'Kissa korkealla/turvassa', ARRAY['Älä anna pennun jahtaa', 'Palkitse rauhallisesta tarkkailusta']),
  ('Eläimet', 'Linnut pihalla', 'Villieläinten havainnointi', 'Opettaa olemaan reagoimatta kaikkeen liikkeeseen', 6, 12, 1, 10, 'Salli tarkkailu, estä takaa-ajo', ARRAY['Palkitse rauhallisesta käyttäytymisestä', 'Käytä herkkuja huomion ohjaamiseen']),
  
  -- Ympäristöt
  ('Ympäristöt', 'Nurmikenttä', 'Pehmeä luonnollinen pinta', 'Peruspinta turvallisessa ympäristössä', 5, 8, 1, 15, 'Anna pennun tutkia vapaasti', ARRAY['Valvo ettei syö mitään vaarallista', 'Anna nuuskia ja tutkia']),
  ('Ympäristöt', 'Asfaltti', 'Kova kaupunkipinta', 'Tärkeä taito kaupunkiympäristössä', 7, 12, 2, 10, 'Lyhyet kävelyt aluksi', ARRAY['Tarkista ettei ole liian kuuma', 'Aloita hiljaissa paikoissa']),
  ('Ympäristöt', 'Metalliritilä', 'Ääntelevä ja tuntuva pinta', 'Kehittää varmuutta erilaisilla pinnoilla', 8, 14, 3, 5, 'Kanna yli ensimmäisellä kerralla', ARRAY['Mene itse ensin esimerkiksi', 'Palkitse rohkeudesta', 'Älä pakota']),
  
  -- Äänet
  ('Äänet', 'Imuri', 'Tavallinen kotitalouskone', 'Ehkäisee pelkoja arkiäänille', 6, 12, 2, 10, 'Imuri toisessa huoneessa aluksi', ARRAY['Aloita hiljaa ja etäältä', 'Yhdistä herkkuihin', 'Lähesty vähitellen']),
  ('Äänet', 'Ovikello', 'Yllättävä äkillinen ääni', 'Valmistaa vieraiden saapumiseen', 7, 14, 2, 5, 'Soita hiljaa ensimmäisellä kerralla', ARRAY['Palkitse rauhallisesta reaktiosta', 'Toista usein lyhyesti']),
  ('Äänet', 'Liikenne', 'Autojen ja kaupungin äänet', 'Välttämätön taito kaupunkielämään', 8, 16, 3, 15, 'Aloita hiljaisen kadun varrelta', ARRAY['Istu putoavan paikan ääressä', 'Älä mene liian lähelle aluksi', 'Käytä herkkuja rauhoittamiseen']),
  
  -- Esineet
  ('Esineet', 'Sateenvarjo', 'Äkillisesti avautuva esine', 'Kehittää varmuutta yllättäville esineille', 8, 14, 3, 5, 'Avaa hitaasti ja etäältä', ARRAY['Näytä ensin suljettuna', 'Avaa vähitellen', 'Palkitse rohkeudesta']),
  ('Esineet', 'Rullalaukku', 'Ääntelevä liikkuva esine', 'Valmistaa matkalaukkujen ääniin', 7, 12, 2, 5, 'Vedä hitaasti etäällä', ARRAY['Aloita paikallaan olevasta', 'Siirry hitaaseen liikkeeseen']),
  
  -- Liikenne  
  ('Liikenne', 'Auto pihassa', 'Tutustuminen ajoneuvoon', 'Perusta myöhemmille automatkoille', 8, 14, 2, 10, 'Käy läpi auto sammutettuna', ARRAY['Anna tutkia ulkopuolta ensin', 'Istu aluksi vain hetki sisällä', 'Tee ensimmäiset matkat lyhyiksi']),
  ('Liikenne', 'Bussi pysäkillä', 'Iso julkinen kulkuväline', 'Valmistaa julkisen liikenteen käyttöön', 10, 16, 4, 10, 'Tarkkaile turvallisen matkan päästä', ARRAY['Älä mene liian lähelle', 'Keskity rauhoittamiseen', 'Käytä paljon herkkuja'])
) AS items(category_name, name, description, why_important, min_age_weeks, max_age_weeks, difficulty_level, duration_minutes, distance_guidance, tips)
WHERE c.name = items.category_name;