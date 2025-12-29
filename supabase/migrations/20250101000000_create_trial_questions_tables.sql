-- Create trial_questions table
-- This table stores trial question sets (main metadata)
CREATE TABLE public.trial_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  title TEXT NOT NULL, -- Title (e.g., "Mathematics Practice Set 1")
  course_code TEXT NOT NULL, -- Course Code (e.g., "MATH 101")
  course_name TEXT NOT NULL, -- Course Name (e.g., "Basic Mathematics")
  faculty TEXT NOT NULL, -- Faculty/Department (e.g., "Engineering")
  year INTEGER NOT NULL, -- Year (e.g., 2024)
  semester TEXT NOT NULL CHECK (semester IN ('1st', '2nd')), -- Semester
  university TEXT NOT NULL, -- Full university name (e.g., "University of Ghana")
  university_short TEXT NOT NULL, -- University abbreviation (e.g., "UG")
  
  -- Image
  image_url TEXT, -- URL to cover image
  
  -- Statistics (tracked automatically)
  questions INTEGER DEFAULT 0, -- Number of MCQs (auto-calculated from trial_question_mcqs)
  downloads INTEGER DEFAULT 0, -- Total downloads (from Section B documents)
  views INTEGER DEFAULT 0, -- Number of views
  
  -- Status
  verified BOOLEAN DEFAULT false, -- Whether the question set has been verified by admin
  
  -- Metadata
  upload_date DATE, -- Date when uploaded (for display)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trial_question_mcqs table
-- This table stores individual MCQ questions for each trial question set
CREATE TABLE public.trial_question_mcqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trial_question_id UUID NOT NULL REFERENCES public.trial_questions(id) ON DELETE CASCADE,
  
  -- Question Information
  question TEXT NOT NULL, -- The question text
  options JSONB NOT NULL DEFAULT '[]'::JSONB, -- Array of options: [{"id": "A", "label": "A", "text": "Option A"}, ...]
  correct_answer TEXT NOT NULL, -- The correct answer (e.g., "A", "B", "C", "D")
  explanation TEXT, -- Explanation for the answer
  
  -- Order
  display_order INTEGER DEFAULT 0, -- Order in which questions appear
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trial_question_section_b table
-- This table stores Section B documents (PDFs) for each trial question set
CREATE TABLE public.trial_question_section_b (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trial_question_id UUID NOT NULL REFERENCES public.trial_questions(id) ON DELETE CASCADE,
  
  -- Document Information
  title TEXT NOT NULL, -- Document title (e.g., "Section B - Set 1")
  description TEXT, -- Description of the document
  file_url TEXT NOT NULL, -- URL to the PDF file in storage
  file_size TEXT DEFAULT '0 MB', -- File size as string (e.g., "2.4 MB")
  
  -- Statistics (tracked automatically)
  downloads INTEGER DEFAULT 0, -- Number of downloads
  download_count INTEGER DEFAULT 0, -- Alternative field name (for compatibility)
  
  -- Metadata
  upload_date DATE, -- Date when uploaded (for display)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_trial_questions_university ON public.trial_questions(university_short);
CREATE INDEX idx_trial_questions_faculty ON public.trial_questions(faculty);
CREATE INDEX idx_trial_questions_year ON public.trial_questions(year);
CREATE INDEX idx_trial_questions_semester ON public.trial_questions(semester);
CREATE INDEX idx_trial_questions_verified ON public.trial_questions(verified);
CREATE INDEX idx_trial_questions_course_code ON public.trial_questions(course_code);
CREATE INDEX idx_trial_questions_created_at ON public.trial_questions(created_at DESC);

CREATE INDEX idx_trial_question_mcqs_trial_question_id ON public.trial_question_mcqs(trial_question_id);
CREATE INDEX idx_trial_question_mcqs_display_order ON public.trial_question_mcqs(trial_question_id, display_order);

CREATE INDEX idx_trial_question_section_b_trial_question_id ON public.trial_question_section_b(trial_question_id);
CREATE INDEX idx_trial_question_section_b_created_at ON public.trial_question_section_b(created_at DESC);

-- Enable RLS
ALTER TABLE public.trial_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_question_mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_question_section_b ENABLE ROW LEVEL SECURITY;

-- Public read access for trial questions (displayed on public pages)
CREATE POLICY "Anyone can view trial questions" 
ON public.trial_questions FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view trial question MCQs" 
ON public.trial_question_mcqs FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view trial question section b" 
ON public.trial_question_section_b FOR SELECT 
USING (true);

-- Admin write policies (will be restricted later with proper auth)
CREATE POLICY "Allow all for trial questions" 
ON public.trial_questions FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for trial question MCQs" 
ON public.trial_question_mcqs FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for trial question section b" 
ON public.trial_question_section_b FOR ALL 
USING (true) WITH CHECK (true);

-- Create trigger for updated_at on trial_questions
CREATE TRIGGER update_trial_questions_updated_at
BEFORE UPDATE ON public.trial_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on trial_question_mcqs
CREATE TRIGGER update_trial_question_mcqs_updated_at
BEFORE UPDATE ON public.trial_question_mcqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on trial_question_section_b
CREATE TRIGGER update_trial_question_section_b_updated_at
BEFORE UPDATE ON public.trial_question_section_b
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update questions count in trial_questions when MCQs are added/removed
CREATE OR REPLACE FUNCTION update_trial_questions_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.trial_questions
    SET questions = (
      SELECT COUNT(*) 
      FROM public.trial_question_mcqs 
      WHERE trial_question_id = NEW.trial_question_id
    )
    WHERE id = NEW.trial_question_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.trial_questions
    SET questions = (
      SELECT COUNT(*) 
      FROM public.trial_question_mcqs 
      WHERE trial_question_id = OLD.trial_question_id
    )
    WHERE id = OLD.trial_question_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update questions count
CREATE TRIGGER update_trial_questions_mcq_count
AFTER INSERT OR DELETE ON public.trial_question_mcqs
FOR EACH ROW
EXECUTE FUNCTION update_trial_questions_count();

-- Insert sample trial question with MCQs for testing
DO $$
DECLARE
  trial_question_id UUID;
BEGIN
  -- Insert the trial question and get its ID
  INSERT INTO public.trial_questions (
    title,
    course_code,
    course_name,
    faculty,
    year,
    semester,
    university,
    university_short,
    image_url,
    verified,
    upload_date
  ) VALUES (
    'Mathematics Practice Set 1',
    'MATH 101',
    'Basic Mathematics',
    'Engineering',
    2024,
    '1st',
    'University of Ghana',
    'UG',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    true,
    CURRENT_DATE
  ) RETURNING id INTO trial_question_id;
  
  -- Insert MCQs (Section A questions)
  INSERT INTO public.trial_question_mcqs (trial_question_id, question, options, correct_answer, explanation, display_order) VALUES
  (
    trial_question_id,
    'What is the derivative of f(x) = x² + 3x + 2?',
    '[
      {"id": "A", "label": "A", "text": "2x + 3"},
      {"id": "B", "label": "B", "text": "x² + 3"},
      {"id": "C", "label": "C", "text": "2x + 2"},
      {"id": "D", "label": "D", "text": "x + 3"}
    ]'::JSONB,
    'A',
    'The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant (2) is 0. Therefore, f''(x) = 2x + 3.',
    1
  ),
  (
    trial_question_id,
    'Which of the following is a prime number?',
    '[
      {"id": "A", "label": "A", "text": "15"},
      {"id": "B", "label": "B", "text": "17"},
      {"id": "C", "label": "C", "text": "21"},
      {"id": "D", "label": "D", "text": "25"}
    ]'::JSONB,
    'B',
    'A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. 17 is the only prime number among the options.',
    2
  ),
  (
    trial_question_id,
    'What is the value of sin(90°)?',
    '[
      {"id": "A", "label": "A", "text": "0"},
      {"id": "B", "label": "B", "text": "1"},
      {"id": "C", "label": "C", "text": "0.5"},
      {"id": "D", "label": "D", "text": "√2/2"}
    ]'::JSONB,
    'B',
    'The sine of 90 degrees is 1. This is a fundamental trigonometric value.',
    3
  ),
  (
    trial_question_id,
    'Solve for x: 2x + 5 = 13',
    '[
      {"id": "A", "label": "A", "text": "x = 4"},
      {"id": "B", "label": "B", "text": "x = 5"},
      {"id": "C", "label": "C", "text": "x = 6"},
      {"id": "D", "label": "D", "text": "x = 7"}
    ]'::JSONB,
    'A',
    'Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4.',
    4
  ),
  (
    trial_question_id,
    'What is the area of a circle with radius 5 units?',
    '[
      {"id": "A", "label": "A", "text": "10π"},
      {"id": "B", "label": "B", "text": "25π"},
      {"id": "C", "label": "C", "text": "50π"},
      {"id": "D", "label": "D", "text": "100π"}
    ]'::JSONB,
    'B',
    'The area of a circle is πr². With radius 5, the area is π(5)² = 25π.',
    5
  ),
  (
    trial_question_id,
    'What is the integral of 2x?',
    '[
      {"id": "A", "label": "A", "text": "x²"},
      {"id": "B", "label": "B", "text": "x² + C"},
      {"id": "C", "label": "C", "text": "2x²"},
      {"id": "D", "label": "D", "text": "x"}
    ]'::JSONB,
    'B',
    'The integral of 2x is x² + C, where C is the constant of integration.',
    6
  ),
  (
    trial_question_id,
    'What is the limit of (x² - 1)/(x - 1) as x approaches 1?',
    '[
      {"id": "A", "label": "A", "text": "0"},
      {"id": "B", "label": "B", "text": "1"},
      {"id": "C", "label": "C", "text": "2"},
      {"id": "D", "label": "D", "text": "Undefined"}
    ]'::JSONB,
    'C',
    'Using L''Hôpital''s rule or factoring, the limit simplifies to x + 1, which equals 2 when x = 1.',
    7
  ),
  (
    trial_question_id,
    'What is the derivative of ln(x)?',
    '[
      {"id": "A", "label": "A", "text": "1/x"},
      {"id": "B", "label": "B", "text": "x"},
      {"id": "C", "label": "C", "text": "e^x"},
      {"id": "D", "label": "D", "text": "ln(x)"}
    ]'::JSONB,
    'A',
    'The derivative of ln(x) is 1/x. This is a fundamental result in calculus.',
    8
  ),
  (
    trial_question_id,
    'What is the value of cos(0°)?',
    '[
      {"id": "A", "label": "A", "text": "0"},
      {"id": "B", "label": "B", "text": "1"},
      {"id": "C", "label": "C", "text": "0.5"},
      {"id": "D", "label": "D", "text": "√2/2"}
    ]'::JSONB,
    'B',
    'The cosine of 0 degrees is 1. This is a fundamental trigonometric value.',
    9
  ),
  (
    trial_question_id,
    'What is the quadratic formula?',
    '[
      {"id": "A", "label": "A", "text": "x = (-b ± √(b² - 4ac)) / 2a"},
      {"id": "B", "label": "B", "text": "x = (-b ± √(b² + 4ac)) / 2a"},
      {"id": "C", "label": "C", "text": "x = (b ± √(b² - 4ac)) / 2a"},
      {"id": "D", "label": "D", "text": "x = (-b ± √(b² - 4ac)) / a"}
    ]'::JSONB,
    'A',
    'The quadratic formula for solving ax² + bx + c = 0 is x = (-b ± √(b² - 4ac)) / 2a.',
    10
  ),
  (
    trial_question_id,
    'What is the derivative of e^x?',
    '[
      {"id": "A", "label": "A", "text": "e^x"},
      {"id": "B", "label": "B", "text": "xe^x"},
      {"id": "C", "label": "C", "text": "ln(x)"},
      {"id": "D", "label": "D", "text": "1/x"}
    ]'::JSONB,
    'A',
    'The derivative of e^x is e^x itself. This is a unique property of the exponential function.',
    11
  ),
  (
    trial_question_id,
    'What is the sum of angles in a triangle?',
    '[
      {"id": "A", "label": "A", "text": "90°"},
      {"id": "B", "label": "B", "text": "180°"},
      {"id": "C", "label": "C", "text": "270°"},
      {"id": "D", "label": "D", "text": "360°"}
    ]'::JSONB,
    'B',
    'The sum of angles in any triangle is always 180 degrees.',
    12
  );
  
  -- Update the questions count (trigger should handle this automatically, but we'll do it manually to be sure)
  UPDATE public.trial_questions tq
  SET questions = (
    SELECT COUNT(*) 
    FROM public.trial_question_mcqs 
    WHERE trial_question_mcqs.trial_question_id = tq.id
  )
  WHERE tq.id = trial_question_id;
END $$;

-- Create storage bucket for trial questions (Section B PDFs and images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trial-questions',
  'trial-questions',
  true, -- Public access for downloads
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies for trial-questions
-- Allow public read access (PDFs and images need to be accessible)
CREATE POLICY "Public read access for trial questions"
ON storage.objects FOR SELECT
USING (bucket_id = 'trial-questions');

-- Allow authenticated users to upload (will be restricted later with proper auth)
CREATE POLICY "Allow upload for trial questions"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'trial-questions');

-- Allow authenticated users to update (will be restricted later with proper auth)
CREATE POLICY "Allow update for trial questions"
ON storage.objects FOR UPDATE
USING (bucket_id = 'trial-questions')
WITH CHECK (bucket_id = 'trial-questions');

-- Allow authenticated users to delete (will be restricted later with proper auth)
CREATE POLICY "Allow delete for trial questions"
ON storage.objects FOR DELETE
USING (bucket_id = 'trial-questions');

