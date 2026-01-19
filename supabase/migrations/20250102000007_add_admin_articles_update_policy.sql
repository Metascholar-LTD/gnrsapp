-- ============================================================================
-- ADD ADMIN UPDATE POLICY FOR ARTICLES
-- ============================================================================
-- This migration adds RLS policies to allow admins to update articles
-- for approval/rejection purposes
-- ============================================================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Admins can update articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON public.articles;

-- Policy: Admins can update any article (for approval/rejection)
CREATE POLICY "Admins can update articles" 
ON public.articles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy: Admins can view all articles (for review purposes)
CREATE POLICY "Admins can view all articles" 
ON public.articles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
