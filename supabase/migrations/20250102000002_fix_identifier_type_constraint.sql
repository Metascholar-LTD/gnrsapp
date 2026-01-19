-- ============================================================================
-- FIX IDENTIFIER_TYPE CONSTRAINT
-- ============================================================================
-- This migration fixes the identifier_type constraint on articles table
-- Run this AFTER the main schema migration if you already ran it
-- ============================================================================

-- Drop the existing constraint if it exists (in case it was created incorrectly)
DO $$ 
BEGIN
    -- Try to drop constraint if it exists
    ALTER TABLE public.articles DROP CONSTRAINT IF EXISTS articles_identifier_type_check;
EXCEPTION
    WHEN undefined_object THEN
        -- Constraint doesn't exist, that's fine
        NULL;
END $$;

-- Add the correct constraint
ALTER TABLE public.articles 
ADD CONSTRAINT articles_identifier_type_check 
CHECK (identifier_type IS NULL OR identifier_type IN ('doi', 'issn', 'isbn', 'other'));

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
