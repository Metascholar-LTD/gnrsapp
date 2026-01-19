-- ============================================================================
-- SCHOLAR DATABASE SCHEMA
-- ============================================================================
-- Comprehensive tables for scholar profiles, articles, and university rankings
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
-- Stores scholar profile information linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('scholar', 'admin')),
  
  -- Personal Information
  full_name TEXT,
  profile_image TEXT, -- URL to Supabase Storage bucket
  bio TEXT,
  orcid_id TEXT,
  
  -- Academic Information
  university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
  department TEXT,
  title TEXT, -- e.g., "Professor", "PhD Student", "Researcher"
  research_interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metrics (calculated from articles)
  total_articles INTEGER DEFAULT 0,
  total_citations INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  h_index INTEGER DEFAULT 0,
  i10_index INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_university_id ON public.profiles(university_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================================================
-- 2. ARTICLES TABLE
-- ============================================================================
-- Stores research articles/papers submitted by scholars
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Article Information
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  discipline_category TEXT,
  discipline TEXT,
  article_type TEXT NOT NULL CHECK (article_type IN ('research', 'review', 'case-study', 'methodology', 'other')),
  
  -- File Storage
  pdf_url TEXT, -- URL to Supabase Storage bucket
  
  -- Publication Identifiers
  identifier_type TEXT,
  identifier_value TEXT,
  identifier_url TEXT,
  
  -- Status and Approval
  status TEXT NOT NULL DEFAULT 'under-review' CHECK (status IN ('under-review', 'approved', 'rejected', 'revision-requested')),
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE RESTRICT,
  
  -- Admin Review
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  revision_notes TEXT,
  
  -- Metrics
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  citations INTEGER DEFAULT 0,
  
  -- Version Control (for editing approved papers)
  version INTEGER DEFAULT 1,
  parent_article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL, -- For versioning
  is_current_version BOOLEAN DEFAULT true,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for articles
CREATE INDEX IF NOT EXISTS idx_articles_submitted_by ON public.articles(submitted_by);
CREATE INDEX IF NOT EXISTS idx_articles_university_id ON public.articles(university_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_discipline ON public.articles(discipline);
CREATE INDEX IF NOT EXISTS idx_articles_submitted_at ON public.articles(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_parent_article_id ON public.articles(parent_article_id);
CREATE INDEX IF NOT EXISTS idx_articles_is_current_version ON public.articles(is_current_version);

-- ============================================================================
-- 3. ARTICLE_AUTHORS TABLE
-- ============================================================================
-- Many-to-many relationship between articles and authors
CREATE TABLE IF NOT EXISTS public.article_authors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  
  -- Author Information
  name TEXT NOT NULL,
  email TEXT,
  affiliation TEXT,
  is_corresponding BOOLEAN DEFAULT false,
  author_order INTEGER NOT NULL DEFAULT 1, -- Order of authors (1 = first author)
  
  -- Link to profile if author is a registered scholar
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for article_authors
CREATE INDEX IF NOT EXISTS idx_article_authors_article_id ON public.article_authors(article_id);
CREATE INDEX IF NOT EXISTS idx_article_authors_profile_id ON public.article_authors(profile_id);
CREATE INDEX IF NOT EXISTS idx_article_authors_email ON public.article_authors(email);

-- ============================================================================
-- 4. ARTICLE_REFERENCES TABLE
-- ============================================================================
-- Stores references/citations for each article
CREATE TABLE IF NOT EXISTS public.article_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  reference_text TEXT NOT NULL,
  reference_order INTEGER NOT NULL DEFAULT 1, -- Order of references
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for article_references
CREATE INDEX IF NOT EXISTS idx_article_references_article_id ON public.article_references(article_id);

-- Add constraint for identifier_type (must be done after table creation)
ALTER TABLE public.articles 
ADD CONSTRAINT articles_identifier_type_check 
CHECK (identifier_type IS NULL OR identifier_type IN ('doi', 'issn', 'isbn', 'other'));

-- ============================================================================
-- 5. TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update scholar metrics when article status changes
CREATE OR REPLACE FUNCTION public.update_scholar_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update metrics when article is approved
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Increment total_articles for the submitting scholar
    UPDATE public.profiles
    SET total_articles = COALESCE(total_articles, 0) + 1
    WHERE user_id = NEW.submitted_by;
    
    -- Update university article count (if needed for rankings)
    -- This can be calculated via views or functions
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update metrics on article approval
CREATE TRIGGER update_metrics_on_approval
AFTER UPDATE OF status ON public.articles
FOR EACH ROW
WHEN (NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved'))
EXECUTE FUNCTION public.update_scholar_metrics();

-- Function to handle article versioning when editing approved papers
CREATE OR REPLACE FUNCTION public.create_article_version()
RETURNS TRIGGER AS $$
BEGIN
  -- When editing an approved article, mark old version as not current
  IF NEW.parent_article_id IS NOT NULL AND NEW.is_current_version = true THEN
    UPDATE public.articles
    SET is_current_version = false
    WHERE id = NEW.parent_article_id AND is_current_version = true;
    
    -- Set version number
    SELECT COALESCE(MAX(version), 0) + 1
    INTO NEW.version
    FROM public.articles
    WHERE parent_article_id = NEW.parent_article_id OR id = NEW.parent_article_id;
    
    -- Reset status to under-review for new version
    NEW.status = 'under-review';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for article versioning
CREATE TRIGGER handle_article_versioning
BEFORE INSERT ON public.articles
FOR EACH ROW
WHEN (NEW.parent_article_id IS NOT NULL)
EXECUTE FUNCTION public.create_article_version();

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_references ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
-- Users can view all profiles
CREATE POLICY "Anyone can view profiles" 
ON public.profiles FOR SELECT 
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Articles Policies
-- Anyone can view approved articles
CREATE POLICY "Anyone can view approved articles" 
ON public.articles FOR SELECT 
USING (status = 'approved' AND is_current_version = true);

-- Scholars can view their own articles (all statuses)
CREATE POLICY "Scholars can view own articles" 
ON public.articles FOR SELECT 
USING (auth.uid() = submitted_by);

-- Scholars can insert their own articles
CREATE POLICY "Scholars can insert own articles" 
ON public.articles FOR INSERT 
WITH CHECK (auth.uid() = submitted_by);

-- Scholars can update their own articles (only if under-review or revision-requested)
CREATE POLICY "Scholars can update own articles" 
ON public.articles FOR UPDATE 
USING (
  auth.uid() = submitted_by 
  AND (status = 'under-review' OR status = 'revision-requested')
);

-- Scholars can create new versions of approved articles (editing approved papers)
CREATE POLICY "Scholars can create article versions" 
ON public.articles FOR INSERT 
WITH CHECK (
  auth.uid() = submitted_by 
  AND parent_article_id IS NOT NULL
);

-- Article Authors Policies
-- Anyone can view authors of approved articles
CREATE POLICY "Anyone can view authors of approved articles" 
ON public.article_authors FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.articles 
    WHERE articles.id = article_authors.article_id 
    AND articles.status = 'approved' 
    AND articles.is_current_version = true
  )
);

-- Scholars can view authors of their own articles
CREATE POLICY "Scholars can view own article authors" 
ON public.article_authors FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.articles 
    WHERE articles.id = article_authors.article_id 
    AND articles.submitted_by = auth.uid()
  )
);

-- Scholars can insert authors for their own articles
CREATE POLICY "Scholars can insert own article authors" 
ON public.article_authors FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.articles 
    WHERE articles.id = article_authors.article_id 
    AND articles.submitted_by = auth.uid()
  )
);

-- Article References Policies
-- Anyone can view references of approved articles
CREATE POLICY "Anyone can view references of approved articles" 
ON public.article_references FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.articles 
    WHERE articles.id = article_references.article_id 
    AND articles.status = 'approved' 
    AND articles.is_current_version = true
  )
);

-- Scholars can view references of their own articles
CREATE POLICY "Scholars can view own article references" 
ON public.article_references FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.articles 
    WHERE articles.id = article_references.article_id 
    AND articles.submitted_by = auth.uid()
  )
);

-- Scholars can insert references for their own articles
CREATE POLICY "Scholars can insert own article references" 
ON public.article_references FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.articles 
    WHERE articles.id = article_references.article_id 
    AND articles.submitted_by = auth.uid()
  )
);

-- ============================================================================
-- 7. STORAGE BUCKETS (for PDFs and profile images)
-- ============================================================================

-- Create storage buckets if they don't exist
-- Note: These need to be created in Supabase Dashboard or via API
-- Bucket: 'article-pdfs' - for research paper PDFs
-- Bucket: 'profile-images' - for scholar profile images

-- Storage policies will be set up separately via Supabase Dashboard
-- or via additional migration files

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
