-- ============================================================================
-- RENAME university_id TO institution_id IN ARTICLES AND PROFILES
-- ============================================================================
-- This migration renames the university_id column to institution_id
-- in both articles and profiles tables for consistency with the institutions table
-- ============================================================================

-- Step 1: Rename column in articles table
ALTER TABLE public.articles 
RENAME COLUMN university_id TO institution_id;

-- Step 2: Rename column in profiles table
ALTER TABLE public.profiles 
RENAME COLUMN university_id TO institution_id;

-- Step 3: Update indexes to use new column name
DROP INDEX IF EXISTS idx_articles_university_id;
CREATE INDEX IF NOT EXISTS idx_articles_institution_id ON public.articles(institution_id);

DROP INDEX IF EXISTS idx_profiles_university_id;
CREATE INDEX IF NOT EXISTS idx_profiles_institution_id ON public.profiles(institution_id);

-- Step 4: Update foreign key constraint names (drop old, create new)
ALTER TABLE public.articles 
DROP CONSTRAINT IF EXISTS articles_university_id_fkey,
DROP CONSTRAINT IF EXISTS articles_institution_id_fkey;

ALTER TABLE public.articles 
ADD CONSTRAINT articles_institution_id_fkey 
FOREIGN KEY (institution_id) 
REFERENCES public.institutions(id) 
ON DELETE RESTRICT;

ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_university_id_fkey,
DROP CONSTRAINT IF EXISTS profiles_institution_id_fkey;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_institution_id_fkey 
FOREIGN KEY (institution_id) 
REFERENCES public.institutions(id) 
ON DELETE SET NULL;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
