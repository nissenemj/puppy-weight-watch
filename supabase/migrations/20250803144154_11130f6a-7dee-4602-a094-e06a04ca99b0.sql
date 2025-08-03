-- Create role-based admin system to replace hardcoded email checks
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper function to check if current user has role
CREATE OR REPLACE FUNCTION public.current_user_has_role(_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.has_role(auth.uid(), _role)
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.current_user_has_role('admin'));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.current_user_has_role('admin'))
WITH CHECK (public.current_user_has_role('admin'));

-- Assign admin role to existing admin user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'nissenemj@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Fix all existing database functions with proper security settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_onboarding_progress_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_milestone_timeline_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.create_weight_timeline_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.cleanup_weight_timeline_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Delete the corresponding timeline entry
  DELETE FROM timeline_entries
  WHERE metadata->>'weight_entry_id' = OLD.id::text
  AND entry_type = 'weight_measurement';
  
  RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_puppy_book_dog_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_dog_id UUID;
BEGIN
  -- If dog_id is null, create a new dog
  IF NEW.dog_id IS NULL THEN
    INSERT INTO public.dogs (user_id, name, created_at)
    VALUES (NEW.owner_id, 'Uusi pentu', now())
    RETURNING id INTO new_dog_id;
    
    NEW.dog_id = new_dog_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_socialization_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.check_category_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;