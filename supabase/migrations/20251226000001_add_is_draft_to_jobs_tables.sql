-- ============================================================================
-- ADD is_draft COLUMN TO JOB-RELATED TABLES
-- ============================================================================
-- Adds the is_draft column to jobs, internships, nss_programs, and graduate_programs
-- ============================================================================

-- Add is_draft to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- Add is_draft to internships table
ALTER TABLE public.internships 
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- Add is_draft to nss_programs table
ALTER TABLE public.nss_programs 
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- Add is_draft to graduate_programs table
ALTER TABLE public.graduate_programs 
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_is_draft ON public.jobs(is_draft);
CREATE INDEX IF NOT EXISTS idx_internships_is_draft ON public.internships(is_draft);
CREATE INDEX IF NOT EXISTS idx_nss_programs_is_draft ON public.nss_programs(is_draft);
CREATE INDEX IF NOT EXISTS idx_graduate_programs_is_draft ON public.graduate_programs(is_draft);
