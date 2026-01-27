-- AI Study Tutor Tables

-- Learning sessions table
CREATE TABLE public.tutor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  material_type TEXT, -- 'pdf', 'docx', 'pptx', 'text'
  material_content TEXT, -- Extracted text content
  material_url TEXT, -- Optional file URL
  topics JSONB DEFAULT '[]'::jsonb, -- Extracted topics and subtopics
  difficulty_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  learning_style TEXT DEFAULT 'balanced', -- 'simple', 'exam_focused', 'deep_conceptual', 'balanced'
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused'
  total_lessons INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  mastery_score DECIMAL(5,2) DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Lessons within a session
CREATE TABLE public.tutor_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.tutor_sessions(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT,
  content_summary TEXT,
  lesson_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'locked', -- 'locked', 'available', 'in_progress', 'completed', 'mastered'
  difficulty TEXT DEFAULT 'easy', -- 'easy', 'medium', 'hard'
  questions_total INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  mastery_percentage DECIMAL(5,2) DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Chat messages within a session
CREATE TABLE public.tutor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.tutor_sessions(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.tutor_lessons(id) ON DELETE SET NULL,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'chat', -- 'chat', 'question', 'answer', 'explanation', 'feedback', 'summary'
  metadata JSONB DEFAULT '{}'::jsonb, -- Store question options, correct answers, etc.
  is_correct BOOLEAN, -- For answer messages
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Progress tracking for concepts
CREATE TABLE public.tutor_concept_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.tutor_sessions(id) ON DELETE CASCADE NOT NULL,
  concept_name TEXT NOT NULL,
  understanding_level INTEGER DEFAULT 0, -- 0-100
  times_reviewed INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_incorrect INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  needs_review BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(session_id, concept_name)
);

-- Daily streak tracking
CREATE TABLE public.tutor_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  study_date DATE NOT NULL,
  minutes_studied INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, study_date)
);

-- Enable RLS
ALTER TABLE public.tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_concept_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tutor_sessions
CREATE POLICY "Users can view own sessions" ON public.tutor_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.tutor_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.tutor_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.tutor_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tutor_lessons
CREATE POLICY "Users can view own lessons" ON public.tutor_lessons
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.tutor_sessions 
    WHERE tutor_sessions.id = tutor_lessons.session_id 
    AND tutor_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own lessons" ON public.tutor_lessons
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.tutor_sessions 
    WHERE tutor_sessions.id = tutor_lessons.session_id 
    AND tutor_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own lessons" ON public.tutor_lessons
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.tutor_sessions 
    WHERE tutor_sessions.id = tutor_lessons.session_id 
    AND tutor_sessions.user_id = auth.uid()
  ));

-- RLS Policies for tutor_messages
CREATE POLICY "Users can view own messages" ON public.tutor_messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.tutor_sessions 
    WHERE tutor_sessions.id = tutor_messages.session_id 
    AND tutor_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own messages" ON public.tutor_messages
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.tutor_sessions 
    WHERE tutor_sessions.id = tutor_messages.session_id 
    AND tutor_sessions.user_id = auth.uid()
  ));

-- RLS Policies for tutor_concept_progress
CREATE POLICY "Users can view own concept progress" ON public.tutor_concept_progress
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.tutor_sessions 
    WHERE tutor_sessions.id = tutor_concept_progress.session_id 
    AND tutor_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own concept progress" ON public.tutor_concept_progress
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.tutor_sessions 
    WHERE tutor_sessions.id = tutor_concept_progress.session_id 
    AND tutor_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own concept progress" ON public.tutor_concept_progress
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.tutor_sessions 
    WHERE tutor_sessions.id = tutor_concept_progress.session_id 
    AND tutor_sessions.user_id = auth.uid()
  ));

-- RLS Policies for tutor_streaks
CREATE POLICY "Users can view own streaks" ON public.tutor_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON public.tutor_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON public.tutor_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_tutor_sessions_updated_at
  BEFORE UPDATE ON public.tutor_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutor_lessons_updated_at
  BEFORE UPDATE ON public.tutor_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutor_concept_progress_updated_at
  BEFORE UPDATE ON public.tutor_concept_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for learning materials
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tutor-materials', 'tutor-materials', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for tutor materials
CREATE POLICY "Users can upload own materials"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tutor-materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own materials"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'tutor-materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own materials"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tutor-materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);