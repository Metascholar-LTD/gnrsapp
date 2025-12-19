-- Create shs_bece_questions table
CREATE TABLE IF NOT EXISTS public.shs_bece_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  year INTEGER NOT NULL,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('BECE', 'SHS')),
  file_url TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  upload_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shs_bece_questions_subject ON public.shs_bece_questions(subject);
CREATE INDEX IF NOT EXISTS idx_shs_bece_questions_subject_code ON public.shs_bece_questions(subject_code);
CREATE INDEX IF NOT EXISTS idx_shs_bece_questions_year ON public.shs_bece_questions(year);
CREATE INDEX IF NOT EXISTS idx_shs_bece_questions_exam_type ON public.shs_bece_questions(exam_type);
CREATE INDEX IF NOT EXISTS idx_shs_bece_questions_verified ON public.shs_bece_questions(verified);
CREATE INDEX IF NOT EXISTS idx_shs_bece_questions_created_at ON public.shs_bece_questions(created_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_shs_bece_questions_search ON public.shs_bece_questions USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(subject, '') || ' ' || coalesce(subject_code, ''))
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_shs_bece_questions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_shs_bece_questions_updated_at
BEFORE UPDATE ON public.shs_bece_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_shs_bece_questions_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.shs_bece_questions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Public read access for shs_bece_questions"
ON public.shs_bece_questions FOR SELECT
USING (true);

-- Policy: Allow authenticated users to insert (will be restricted later with proper auth)
CREATE POLICY "Allow insert for shs_bece_questions"
ON public.shs_bece_questions FOR INSERT
WITH CHECK (true);

-- Policy: Allow authenticated users to update (will be restricted later with proper auth)
CREATE POLICY "Allow update for shs_bece_questions"
ON public.shs_bece_questions FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete (will be restricted later with proper auth)
CREATE POLICY "Allow delete for shs_bece_questions"
ON public.shs_bece_questions FOR DELETE
USING (true);

-- Create storage bucket for SHS/BECE questions PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'shs-bece-questions',
  'shs-bece-questions',
  true, -- Public access for downloads
  52428800, -- 50MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies for shs-bece-questions
-- Allow public read access (PDFs need to be downloadable)
CREATE POLICY "Public read access for shs-bece-questions"
ON storage.objects FOR SELECT
USING (bucket_id = 'shs-bece-questions');

-- Allow authenticated users to upload (will be restricted later with proper auth)
CREATE POLICY "Allow upload for shs-bece-questions"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'shs-bece-questions');

-- Allow authenticated users to delete (will be restricted later with proper auth)
CREATE POLICY "Allow delete for shs-bece-questions"
ON storage.objects FOR DELETE
USING (bucket_id = 'shs-bece-questions');

