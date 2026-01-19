-- ============================================================================
-- UPDATE PROFILES AND ARTICLES TO USE INSTITUTIONS
-- ============================================================================
-- This migration updates the foreign key references from 'universities' 
-- to 'institutions' for the scholarly ranking system
-- ============================================================================

-- Step 1: Drop existing foreign key constraints
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_university_id_fkey;

ALTER TABLE public.articles 
DROP CONSTRAINT IF EXISTS articles_university_id_fkey;

-- Step 2: Add new foreign key constraints to institutions
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_institution_id_fkey 
FOREIGN KEY (university_id) 
REFERENCES public.institutions(id) 
ON DELETE SET NULL;

ALTER TABLE public.articles 
ADD CONSTRAINT articles_institution_id_fkey 
FOREIGN KEY (university_id) 
REFERENCES public.institutions(id) 
ON DELETE RESTRICT;

-- Step 3: Update indexes (drop old, create new with same name)
DROP INDEX IF EXISTS idx_profiles_university_id;
CREATE INDEX IF NOT EXISTS idx_profiles_university_id ON public.profiles(university_id);

DROP INDEX IF EXISTS idx_articles_university_id;
CREATE INDEX IF NOT EXISTS idx_articles_university_id ON public.articles(university_id);

-- ============================================================================
-- NOTE: Existing data in university_id columns will need to be migrated
-- You may need to:
-- 1. Create corresponding entries in institutions table (via admin panel)
-- 2. Update university_id values in profiles and articles to match new IDs
-- ============================================================================

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
