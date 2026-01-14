-- Local Job Gigs Table Schema
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS local_job_gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  
  -- Employer Information
  employer_name TEXT NOT NULL,
  employer_phone TEXT NOT NULL,
  employer_email TEXT,
  
  -- Payment Information
  payment_type TEXT NOT NULL CHECK (payment_type IN ('daily', 'weekly', 'monthly', 'fixed', 'hourly', 'negotiable')),
  payment_amount NUMERIC(10, 2),
  
  -- Dates
  start_date DATE,
  end_date DATE,
  
  -- Additional Details
  requirements TEXT, -- Stored as newline-separated string
  what_to_expect TEXT,
  
  -- Status and Metadata
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  verified BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  applications INTEGER DEFAULT 0,
  
  -- Approval Workflow
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  rejected_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_local_job_gigs_status ON local_job_gigs(status);
CREATE INDEX IF NOT EXISTS idx_local_job_gigs_location ON local_job_gigs(location);
CREATE INDEX IF NOT EXISTS idx_local_job_gigs_created_at ON local_job_gigs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_local_job_gigs_verified ON local_job_gigs(verified) WHERE verified = true;

-- Enable Row Level Security (disabled for now - can add auth policies later)
ALTER TABLE local_job_gigs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read all gigs (temporary - add auth later)
CREATE POLICY "Anyone can view gigs"
  ON local_job_gigs
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert gigs (temporary - add auth later)
CREATE POLICY "Anyone can insert gigs"
  ON local_job_gigs
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can update gigs (temporary - add auth later)
CREATE POLICY "Anyone can update gigs"
  ON local_job_gigs
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Anyone can delete gigs (temporary - add auth later)
CREATE POLICY "Anyone can delete gigs"
  ON local_job_gigs
  FOR DELETE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_local_job_gigs_updated_at
  BEFORE UPDATE ON local_job_gigs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample gig for testing
INSERT INTO local_job_gigs (
  title,
  description,
  location,
  employer_name,
  employer_phone,
  employer_email,
  payment_type,
  payment_amount,
  start_date,
  requirements,
  what_to_expect,
  status,
  verified,
  views,
  applications
) VALUES (
  'Event Setup Assistant',
  'Help set up for a community event. Need someone to help with tables, chairs, and decorations. This is a great opportunity to earn extra income while helping your local community.',
  'Accra, Greater Accra',
  'Community Events Ltd',
  '+233 24 123 4567',
  'contact@communityevents.gh',
  'fixed',
  150.00,
  '2026-02-15',
  'Ability to work in a team
Physical stamina for setup and breakdown
Available for the full event duration',
  'This is a one-time opportunity that offers flexible work hours. You''ll be working directly with the client to complete the task. Payment will be made upon completion of the work. This is a great opportunity to earn extra income while helping your local community.',
  'active',
  true,
  45,
  8
);
