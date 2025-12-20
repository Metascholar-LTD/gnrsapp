-- Create lecture_notes table
-- This table stores lecture notes, slides, and e-learning materials (PDF, PPTX, PPT)
-- The admin uploads files and fills in the metadata
CREATE TABLE public.lecture_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  title TEXT NOT NULL, -- Title of the lecture note/slide
  field TEXT NOT NULL, -- Field/Category (e.g., "Business", "Technology", "Engineering")
  lecturer TEXT NOT NULL, -- Lecturer/Author name
  
  -- University/Affiliation (Optional - for people not in listed universities)
  university TEXT, -- Full university name (e.g., "University of Ghana" or custom)
  university_short TEXT, -- University abbreviation (e.g., "UG" or auto-generated)
  
  -- File Information
  file_url TEXT NOT NULL, -- URL to the file in storage (PDF, PPTX, PPT)
  file_size BIGINT DEFAULT 0, -- File size in bytes
  file_type TEXT, -- File type: "PDF", "PPTX", "PPT"
  pages INTEGER DEFAULT 0, -- Number of pages/slides (auto-detected)
  
  -- Thumbnail
  image_url TEXT, -- URL to thumbnail image (uploaded or extracted from first page)
  
  -- Statistics (tracked automatically)
  downloads INTEGER DEFAULT 0, -- Number of downloads
  views INTEGER DEFAULT 0, -- Number of views/previews
  
  -- Status
  verified BOOLEAN DEFAULT false, -- Whether the note has been verified by admin
  
  -- Metadata
  upload_date DATE, -- Date when uploaded (for display)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_lecture_notes_field ON public.lecture_notes(field);
CREATE INDEX idx_lecture_notes_university ON public.lecture_notes(university_short);
CREATE INDEX idx_lecture_notes_lecturer ON public.lecture_notes(lecturer);
CREATE INDEX idx_lecture_notes_verified ON public.lecture_notes(verified);
CREATE INDEX idx_lecture_notes_created_at ON public.lecture_notes(created_at DESC);
CREATE INDEX idx_lecture_notes_downloads ON public.lecture_notes(downloads DESC);
CREATE INDEX idx_lecture_notes_views ON public.lecture_notes(views DESC);

-- Full-text search index for title, field, lecturer, and university
CREATE INDEX idx_lecture_notes_search ON public.lecture_notes USING gin(
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(field, '') || ' ' || 
    coalesce(lecturer, '') || ' ' ||
    coalesce(university, '')
  )
);

-- Enable Row Level Security
ALTER TABLE public.lecture_notes ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view lecture notes)
CREATE POLICY "Anyone can view lecture notes" 
ON public.lecture_notes FOR SELECT 
USING (true);

-- Admin write policies (will be restricted later with proper auth)
CREATE POLICY "Allow all for lecture notes" 
ON public.lecture_notes FOR ALL 
USING (true) WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_lecture_notes_updated_at
BEFORE UPDATE ON public.lecture_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for lecture notes files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lecture-notes',
  'lecture-notes',
  true, -- Public access for downloads
  104857600, -- 100MB limit
  ARRAY['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow', 'application/vnd.openxmlformats-officedocument.presentationml.template', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies for lecture-notes
-- Allow public read access (files need to be downloadable)
CREATE POLICY "Public read access for lecture notes"
ON storage.objects FOR SELECT
USING (bucket_id = 'lecture-notes');

-- Allow authenticated users to upload (will be restricted later with proper auth)
CREATE POLICY "Allow upload for lecture notes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lecture-notes');

-- Allow authenticated users to update (will be restricted later with proper auth)
CREATE POLICY "Allow update for lecture notes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lecture-notes');

-- Allow authenticated users to delete (will be restricted later with proper auth)
CREATE POLICY "Allow delete for lecture notes"
ON storage.objects FOR DELETE
USING (bucket_id = 'lecture-notes');

