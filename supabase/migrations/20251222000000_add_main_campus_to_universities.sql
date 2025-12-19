-- Add main_campus column to universities table
ALTER TABLE public.universities
ADD COLUMN IF NOT EXISTS main_campus TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.universities.main_campus IS 'The main campus location for the university. This should match one of the values in the campus array.';

