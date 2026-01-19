-- ============================================================================
-- FIX ADMIN ARTICLES UPDATE POLICY
-- ============================================================================
-- This migration fixes the admin update policy to handle edge cases
-- and ensures it works correctly
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can update articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON public.articles;

-- Policy: Admins can update any article (for approval/rejection)
-- This policy checks if the user has a profile with role='admin'
CREATE POLICY "Admins can update articles" 
ON public.articles FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
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
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================================================
-- DIAGNOSTIC QUERY (run this separately to check your admin status)
-- ============================================================================
-- Run this query in Supabase SQL Editor to check if your user has admin role:
-- 
-- SELECT 
--   auth.uid() as current_user_id,
--   p.id as profile_id,
--   p.user_id,
--   p.role,
--   p.full_name
-- FROM public.profiles p
-- WHERE p.user_id = auth.uid();
--
-- If this returns no rows, you need to create a profile with role='admin'
-- If it returns a row but role != 'admin', you need to update it:
-- UPDATE public.profiles SET role = 'admin' WHERE user_id = auth.uid();
-- ============================================================================
