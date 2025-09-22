-- Fix security issue: Prevent email harvesting from newsletter_subscriptions table
-- Replace existing policies with more restrictive ones that require authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.newsletter_subscriptions;

-- Create more secure SELECT policy that requires authentication
CREATE POLICY "Authenticated users can view their own subscriptions only"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (
  -- Users can only see subscriptions where they are the owner (user_id matches)
  -- OR where their authenticated email matches and no user_id is set (legacy subscriptions)
  (auth.uid() = user_id) 
  OR 
  (user_id IS NULL AND email = (
    SELECT users.email 
    FROM auth.users 
    WHERE users.id = auth.uid()
  )::text)
);

-- Create more secure UPDATE policy that requires authentication
CREATE POLICY "Authenticated users can update their own subscriptions only"
ON public.newsletter_subscriptions  
FOR UPDATE
TO authenticated
USING (
  -- Users can only update subscriptions where they are the owner (user_id matches)
  -- OR where their authenticated email matches and no user_id is set (legacy subscriptions)
  (auth.uid() = user_id)
  OR 
  (user_id IS NULL AND email = (
    SELECT users.email 
    FROM auth.users 
    WHERE users.id = auth.uid()
  )::text)
)
WITH CHECK (
  -- Ensure updated records maintain proper ownership
  (auth.uid() = user_id)
  OR 
  (user_id IS NULL AND email = (
    SELECT users.email 
    FROM auth.users 
    WHERE users.id = auth.uid()
  )::text)
);

-- Create DELETE policy for users to unsubscribe
CREATE POLICY "Authenticated users can delete their own subscriptions"
ON public.newsletter_subscriptions
FOR DELETE  
TO authenticated
USING (
  (auth.uid() = user_id)
  OR
  (user_id IS NULL AND email = (
    SELECT users.email 
    FROM auth.users 
    WHERE users.id = auth.uid()
  )::text)
);

-- Update INSERT policy to automatically set user_id for authenticated users
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;

CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscriptions
FOR INSERT
WITH CHECK (
  -- Allow anonymous subscriptions (user_id can be NULL)
  -- But if user is authenticated, user_id should be set correctly
  (auth.uid() IS NULL AND user_id IS NULL)
  OR
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Allow legacy case where authenticated user subscribes without user_id set
  (auth.uid() IS NOT NULL AND user_id IS NULL)
);