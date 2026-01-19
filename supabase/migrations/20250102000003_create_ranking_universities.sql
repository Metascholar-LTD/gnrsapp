-- ============================================================================
-- CREATE INSTITUTIONS TABLE
-- ============================================================================
-- Table for institutions in the scholarly ranking system
-- Admin manages these in the "All Institutions" page
-- Scholars select from these institutions, and they are ranked based on articles
-- This is different from the general 'universities' table used for directory
-- ============================================================================

-- Create institutions table
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  name TEXT NOT NULL UNIQUE,
  abbreviation TEXT,
  region TEXT,
  type TEXT, -- 'Public' or 'Private'
  logo TEXT,
  description TEXT,
  website TEXT,
  city TEXT,
  country TEXT DEFAULT 'Ghana',
  founded_year INTEGER,
  
  -- Ranking Metrics (calculated from articles)
  total_articles INTEGER DEFAULT 0,
  articles_this_month INTEGER DEFAULT 0,
  current_rank INTEGER,
  previous_rank INTEGER,
  movement TEXT, -- 'up', 'down', 'same'
  
  -- Status
  verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for institutions
CREATE INDEX IF NOT EXISTS idx_institutions_name ON public.institutions(name);
CREATE INDEX IF NOT EXISTS idx_institutions_region ON public.institutions(region);
CREATE INDEX IF NOT EXISTS idx_institutions_current_rank ON public.institutions(current_rank);
CREATE INDEX IF NOT EXISTS idx_institutions_status ON public.institutions(status);

-- Trigger for updated_at
CREATE TRIGGER update_institutions_updated_at
BEFORE UPDATE ON public.institutions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for institutions
-- Anyone can view institutions
CREATE POLICY "Anyone can view institutions" 
ON public.institutions FOR SELECT 
USING (true);

-- Only admins can insert/update/delete (will be restricted later with proper auth)
CREATE POLICY "Allow all for institutions" 
ON public.institutions FOR ALL 
USING (true) WITH CHECK (true);

-- ============================================================================
-- INSERT INITIAL INSTITUTIONS (from ranking data)
-- ============================================================================

INSERT INTO public.institutions (
  name, abbreviation, region, type, logo, description, website, city, country, 
  founded_year, current_rank, previous_rank, movement, total_articles, 
  articles_this_month, verified, status
) VALUES
-- Rank 1
('University of Ghana', 'UG', 'Greater Accra', 'Public', 
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379495/46600902-ca9e-407d-9392-06a45b9d9b1a.png',
 'The oldest and largest university in Ghana, known for excellence in research and education across multiple disciplines.',
 'https://ug.edu.gh', 'Legon, Accra', 'Ghana', 1948, 1, 1, 'stable', 2341, 47, true, 'active'),

-- Rank 2
('Kwame Nkrumah University of Science and Technology', 'KNUST', 'Ashanti', 'Public',
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379648/e9c10d56-1f3e-4151-8123-93d77fefe7aa.png',
 'A leading science and technology university in Africa, specializing in engineering, applied sciences, and technology.',
 'https://knust.edu.gh', 'Kumasi', 'Ghana', 1952, 2, 2, 'stable', 2287, 31, true, 'active'),

-- Rank 3
('University of Cape Coast', 'UCC', 'Central', 'Public',
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379582/9c190837-92c2-4230-b205-4ab9f0c8c6a1.png',
 'A leading university in education and humanities research, known for producing quality teachers and researchers.',
 'https://ucc.edu.gh', 'Cape Coast', 'Ghana', 1962, 3, 3, 'stable', 2156, 38, true, 'active'),

-- Rank 4
('University of Education, Winneba', 'UEW', 'Central', 'Public',
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379251/673184a4-9fd7-433b-b33e-ab7871fa5a1b.png',
 'Specializes in teacher education and training, producing qualified educators for Ghana and beyond.',
 'https://uew.edu.gh', 'Winneba', 'Ghana', 1992, 4, 4, 'stable', 2089, 42, true, 'active'),

-- Rank 5
('University of Mines and Technology', 'UMaT', 'Western', 'Public',
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1759428982/WhatsApp_Image_2025-10-02_at_15.46.11_f720a723_lzrtfp.jpg',
 'Specializes in mining, petroleum, and engineering education, producing skilled professionals for the extractive industries.',
 'https://umat.edu.gh', 'Tarkwa', 'Ghana', 2004, 5, 5, 'stable', 1934, 29, true, 'active'),

-- Rank 6
('University for Development Studies', 'UDS', 'Northern', 'Public',
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379766/0a0d9027-8f25-4d2f-a291-8fae7914dec3.png',
 'Focuses on development-oriented education and research, addressing challenges in northern Ghana and beyond.',
 'https://uds.edu.gh', 'Tamale', 'Ghana', 1992, 6, 6, 'stable', 1876, 44, true, 'active'),

-- Rank 7
('Ghana Institute of Management and Public Administration', 'GIMPA', 'Greater Accra', 'Public',
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379384/9c8b41be-3e40-4ee3-8ae5-8951832cd82c.png',
 'Specializes in management, public administration, and governance education for public and private sectors.',
 'https://gimpa.edu.gh', 'Accra', 'Ghana', 1961, 7, 7, 'stable', 1798, 26, true, 'active'),

-- Rank 8
('University of Energy and Natural Resources', 'UENR', 'Bono', 'Public',
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1758510525/download_uxkc4q.jpg',
 'Focuses on energy, natural resources, and environmental studies, addressing sustainability challenges.',
 'https://uenr.edu.gh', 'Sunyani', 'Ghana', 2011, 8, 8, 'stable', 1654, 28, true, 'active'),

-- Rank 9
('Ashesi University', 'Ashesi', 'Eastern', 'Private',
 NULL,
 'A private liberal arts university known for ethical leadership, innovation, and entrepreneurship education.',
 'https://ashesi.edu.gh', 'Berekuso', 'Ghana', 2002, 9, 9, 'stable', 1587, 35, true, 'active'),

-- Rank 10
('University of Professional Studies', 'UPSA', 'Greater Accra', 'Public',
 NULL,
 'Focuses on professional studies including accounting, finance, marketing, and management.',
 'https://upsa.edu.gh', 'Accra', 'Ghana', 1965, 10, 10, 'stable', 1521, 24, true, 'active'),

-- Rank 11
('Catholic University of Ghana', 'CUG', 'Bono', 'Private',
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1756722559/catholic-university-ghana-logo_onhrgj.jpg',
 'A private Catholic university offering programs grounded in Catholic values and academic excellence.',
 'https://cug.edu.gh', 'Fiapre, Sunyani', 'Ghana', 2003, 11, 11, 'stable', 1487, 33, true, 'active'),

-- Rank 12
('Pentecost University College', 'PUC', 'Greater Accra', 'Private',
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1756722725/OIP_czwzp0.webp',
 'A private Christian university focusing on business, technology, and theology education.',
 'https://pentvars.edu.gh', 'Sowutuom, Accra', 'Ghana', 2003, 12, 12, 'stable', 1423, 39, true, 'active'),

-- Rank 13
('Accra Institute of Technology', 'AIT', 'Greater Accra', 'Private',
 'https://res.cloudinary.com/dsypclqxk/image/upload/v1759428988/WhatsApp_Image_2025-10-02_at_15.47.06_33dd4bda_pj0a6t.jpg',
 'A private university focusing on technology, engineering, and business education with practical industry relevance.',
 'https://ait.edu.gh', 'Accra', 'Ghana', 2009, 13, 13, 'stable', 1387, 45, true, 'active'),

-- Rank 14
('Central University', 'CU', 'Greater Accra', 'Private',
 NULL,
 'A private Christian university offering programs with a focus on Christian values and academic excellence.',
 'https://central.edu.gh', 'Miotso', 'Ghana', 1988, 14, 14, 'stable', 1234, 28, true, 'active'),

-- Rank 15
('Regent University College of Science and Technology', 'Regent', 'Greater Accra', 'Private',
 NULL,
 'A private university focusing on science, technology, and innovation education with practical industry training.',
 'https://regent.edu.gh', 'Accra', 'Ghana', 2003, 15, 15, 'stable', 1123, 22, true, 'active')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
