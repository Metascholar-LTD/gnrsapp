-- ============================================================================
-- EMPLOYERS TABLE
-- ============================================================================
-- Stores employer profile information linked to Supabase Auth users
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.employers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Information
  full_name TEXT,
  email TEXT,
  phone TEXT,
  profile_image TEXT, -- URL to Supabase Storage bucket
  
  -- Company Information
  company_name TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_employers_user_id ON public.employers(user_id);
CREATE INDEX IF NOT EXISTS idx_employers_company_id ON public.employers(company_id);
CREATE INDEX IF NOT EXISTS idx_employers_company_name ON public.employers(company_name);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_employers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_employers_updated_at ON public.employers;
CREATE TRIGGER trigger_update_employers_updated_at
  BEFORE UPDATE ON public.employers
  FOR EACH ROW
  EXECUTE FUNCTION update_employers_updated_at();

-- Disable Row Level Security (RLS) to match project pattern
-- RLS can be enabled later if needed
ALTER TABLE public.employers DISABLE ROW LEVEL SECURITY;
