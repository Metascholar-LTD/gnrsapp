-- Create past_questions table
-- This table stores university past question papers (PDFs)
-- The admin uploads PDFs and fills in the metadata
CREATE TABLE public.past_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  title TEXT NOT NULL, -- Title/Course Name (e.g., "Advanced Engineering Mathematics")
  course_code TEXT NOT NULL, -- Course Code (e.g., "MATH 253")
  faculty TEXT NOT NULL, -- Faculty/Department (e.g., "Engineering")
  year INTEGER NOT NULL, -- Year (e.g., 2023)
  semester TEXT NOT NULL CHECK (semester IN ('1st', '2nd')), -- Semester
  university TEXT NOT NULL, -- Full university name (e.g., "University of Ghana")
  university_short TEXT NOT NULL, -- University abbreviation (e.g., "UG")
  exam_type TEXT NOT NULL DEFAULT 'End of Semester', -- Exam type (e.g., "End of Semester", "Mid Semester", "Quiz")
  
  -- File Information
  file_url TEXT NOT NULL, -- URL to the PDF file in storage
  file_size BIGINT DEFAULT 0, -- File size in bytes
  
  -- Statistics (tracked automatically)
  downloads INTEGER DEFAULT 0, -- Number of downloads
  views INTEGER DEFAULT 0, -- Number of views/previews
  
  -- Status
  verified BOOLEAN DEFAULT false, -- Whether the paper has been verified by admin
  
  -- Metadata
  upload_date DATE, -- Date when uploaded (for display)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_past_questions_university ON public.past_questions(university_short);
CREATE INDEX idx_past_questions_faculty ON public.past_questions(faculty);
CREATE INDEX idx_past_questions_year ON public.past_questions(year);
CREATE INDEX idx_past_questions_semester ON public.past_questions(semester);
CREATE INDEX idx_past_questions_verified ON public.past_questions(verified);
CREATE INDEX idx_past_questions_course_code ON public.past_questions(course_code);
CREATE INDEX idx_past_questions_created_at ON public.past_questions(created_at DESC);

-- Full-text search index for title, course_code, and university
CREATE INDEX idx_past_questions_search ON public.past_questions USING gin(
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(course_code, '') || ' ' || 
    coalesce(university, '') || ' ' ||
    coalesce(faculty, '')
  )
);

-- Enable Row Level Security
ALTER TABLE public.past_questions ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view past questions)
CREATE POLICY "Anyone can view past questions" 
ON public.past_questions FOR SELECT 
USING (true);

-- Admin write policies (will be restricted later with proper auth)
CREATE POLICY "Allow all for past questions" 
ON public.past_questions FOR ALL 
USING (true) WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_past_questions_updated_at
BEFORE UPDATE ON public.past_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for past questions PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'past-questions',
  'past-questions',
  true, -- Public access for downloads
  52428800, -- 50MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies for past-questions
-- Allow public read access (PDFs need to be downloadable)
CREATE POLICY "Public read access for past questions"
ON storage.objects FOR SELECT
USING (bucket_id = 'past-questions');

-- Allow authenticated users to upload (will be restricted later with proper auth)
CREATE POLICY "Allow upload for past questions"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'past-questions');

-- Allow authenticated users to delete (will be restricted later with proper auth)
CREATE POLICY "Allow delete for past questions"
ON storage.objects FOR DELETE
USING (bucket_id = 'past-questions');

