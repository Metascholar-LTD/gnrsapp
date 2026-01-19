-- Create trial_question_attempts table
-- This table stores user attempts/results for trial question sets
CREATE TABLE public.trial_question_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- References
  trial_question_id UUID NOT NULL REFERENCES public.trial_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional: if user is logged in
  
  -- Answers (stored as JSON)
  answers JSONB NOT NULL DEFAULT '{}'::JSONB, -- { question_id: selected_answer }
  
  -- Scoring
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  incorrect_answers INTEGER NOT NULL DEFAULT 0,
  score_percentage DECIMAL(5, 2) NOT NULL, -- e.g., 85.50
  
  -- Status
  passed BOOLEAN NOT NULL DEFAULT false, -- true if score >= 50%
  forced_retake BOOLEAN NOT NULL DEFAULT false, -- true if score < 40% (abysmally poor)
  
  -- Metadata
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_trial_question_attempts_trial_question_id ON public.trial_question_attempts(trial_question_id);
CREATE INDEX idx_trial_question_attempts_user_id ON public.trial_question_attempts(user_id);
CREATE INDEX idx_trial_question_attempts_completed_at ON public.trial_question_attempts(completed_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.trial_question_attempts ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own attempts
CREATE POLICY "Users can read their own attempts"
ON public.trial_question_attempts
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to insert their own attempts
CREATE POLICY "Users can insert their own attempts"
ON public.trial_question_attempts
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow public read access for anonymous users
CREATE POLICY "Public read access for anonymous attempts"
ON public.trial_question_attempts
FOR SELECT
USING (user_id IS NULL);

-- Allow public insert access for anonymous users
CREATE POLICY "Public insert access for anonymous attempts"
ON public.trial_question_attempts
FOR INSERT
WITH CHECK (user_id IS NULL);
