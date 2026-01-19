-- ============================================================================
-- ADD DELETE POLICY FOR SCHOLARS TO DELETE THEIR OWN ARTICLES
-- ============================================================================
-- Allows scholars to delete their own articles (only if they submitted them)
-- ============================================================================

-- Drop policy if exists (for idempotency)
DROP POLICY IF EXISTS "Scholars can delete own articles" ON public.articles;

-- Create policy for scholars to delete their own articles
CREATE POLICY "Scholars can delete own articles"
ON public.articles FOR DELETE
USING (
  -- User must be authenticated
  auth.uid() IS NOT NULL
  AND
  -- User must be the one who submitted the article
  submitted_by = auth.uid()
);

-- Add comment
COMMENT ON POLICY "Scholars can delete own articles" ON public.articles IS 
'Allows scholars to delete articles they submitted. Related records (authors, references) are automatically deleted via CASCADE.';
