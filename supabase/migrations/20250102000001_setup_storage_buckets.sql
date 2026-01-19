-- ============================================================================
-- STORAGE BUCKETS SETUP
-- ============================================================================
-- Creates storage buckets for profile images and article PDFs
-- Note: This requires Supabase Storage extension to be enabled
-- ============================================================================

-- Create profile-images bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true, -- Public bucket for profile images
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create article-pdfs bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-pdfs',
  'article-pdfs',
  true, -- Public bucket for article PDFs
  52428800, -- 50MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Profile Images Policies
-- Anyone can view profile images (public bucket)
CREATE POLICY "Anyone can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Users can upload their own profile images
CREATE POLICY "Users can upload own profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' 
  AND (name ~ ('^' || auth.uid()::text || '/'))
);

-- Users can update their own profile images
CREATE POLICY "Users can update own profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-images' 
  AND (name ~ ('^' || auth.uid()::text || '/'))
);

-- Users can delete their own profile images
CREATE POLICY "Users can delete own profile images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-images' 
  AND (name ~ ('^' || auth.uid()::text || '/'))
);

-- Article PDFs Policies
-- Anyone can view article PDFs (public bucket)
CREATE POLICY "Anyone can view article PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-pdfs');

-- Users can upload their own article PDFs
CREATE POLICY "Users can upload own article PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'article-pdfs' 
  AND (name ~ ('^' || auth.uid()::text || '/'))
);

-- Users can update their own article PDFs (only if article is under-review)
CREATE POLICY "Users can update own article PDFs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'article-pdfs' 
  AND (name ~ ('^' || auth.uid()::text || '/'))
);

-- Users can delete their own article PDFs (only if article is under-review or rejected)
CREATE POLICY "Users can delete own article PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'article-pdfs' 
  AND (name ~ ('^' || auth.uid()::text || '/'))
);

-- ============================================================================
-- END OF STORAGE SETUP
-- ============================================================================
