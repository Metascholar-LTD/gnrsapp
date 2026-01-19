-- ============================================================================
-- ADD THUMBNAIL_URL TO ARTICLES TABLE
-- ============================================================================
-- Add thumbnail_url field to store generated PDF thumbnail images
-- ============================================================================

ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_thumbnail_url ON public.articles(thumbnail_url) WHERE thumbnail_url IS NOT NULL;

-- Add comment
COMMENT ON COLUMN public.articles.thumbnail_url IS 'URL to auto-generated thumbnail image from first page of PDF';
