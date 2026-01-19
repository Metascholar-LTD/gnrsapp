# Scholar Database & Profile Integration Plan

## Investigation Summary

After thoroughly reviewing all scholar-related pages, here's what I found:

### Pages Analyzed:
1. **ScholarDashboard** - Shows stats, papers, university rankings
2. **SubmitPaper** - Multi-step paper submission form
3. **ScholarProfile** (Public) - Public scholar profile page
4. **CompleteProfile** - Profile completion form after signup
5. **ScholarLayout** - Has link to `/scholar/profile` (My Profile page - needs to be created)
6. **ArticleView** - Individual article display
7. **Articles** - Browse articles page

---

## Data Requirements

### 1. Scholar Profile Data (from CompleteProfile + SignUp)
- `user_id` (UUID, from Supabase auth)
- `role` = "scholar"
- `full_name` (from Google metadata or form)
- `email` (from auth)
- `university` (affiliation)
- `department`
- `academic_title` (lecturer, senior-lecturer, associate-professor, professor, researcher, independent)
- `research_interests` (array of strings)
- `orcid_id` (optional)
- `bio` (optional, for public profile)
- `profile_image_url` (optional)
- `created_at`
- `updated_at`

### 2. Paper/Article Data (from SubmitPaper form)
- `id` (UUID)
- `scholar_id` (user_id of submitter)
- `title`
- `abstract`
- `keywords` (array)
- `discipline_category_id` (reference to discipline)
- `discipline_id` (sub-discipline)
- `discipline_name` (text, for flexibility)
- `article_type` (research, review, case-study, commentary, letter)
- `university_id` (reference to universities table)
- `university_name` (text, for flexibility)
- `pdf_file_url` (stored in Supabase Storage)
- `status` (draft, under-review, published, rejected, retracted)
- `identifier_type` (doi, issn, isbn, other, null)
- `identifier_value` (the actual identifier)
- `identifier_url` (publication URL)
- `view_count` (default 0)
- `download_count` (default 0)
- `citation_count` (default 0)
- `submitted_at`
- `published_at` (nullable)
- `created_at`
- `updated_at`

### 3. Article Authors (many-to-many)
- `id` (UUID)
- `article_id` (UUID, foreign key)
- `author_name` (text)
- `author_email` (text)
- `author_affiliation` (text)
- `is_corresponding` (boolean)
- `author_order` (integer, for ordering)
- `created_at`

### 4. Article References
- `id` (UUID)
- `article_id` (UUID, foreign key)
- `citation_text` (text, the full reference)
- `reference_order` (integer, for ordering)
- `doi` (optional)
- `url` (optional)
- `created_at`

---

## Database Schema (SQL)

### Table 1: `profiles`
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'scholar' CHECK (role IN ('scholar', 'admin', 'employer')),
  full_name TEXT,
  email TEXT,
  university TEXT,
  department TEXT,
  academic_title TEXT CHECK (academic_title IN ('lecturer', 'senior-lecturer', 'associate-professor', 'professor', 'researcher', 'independent')),
  research_interests TEXT[] DEFAULT '{}',
  orcid_id TEXT,
  bio TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
```

### Table 2: `articles` (or `papers`)
```sql
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholar_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  abstract TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  discipline_category_id TEXT,
  discipline_id TEXT,
  discipline_name TEXT,
  article_type TEXT NOT NULL DEFAULT 'research' CHECK (article_type IN ('research', 'review', 'case-study', 'commentary', 'letter')),
  university_id TEXT,
  university_name TEXT,
  pdf_file_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'under-review', 'published', 'rejected', 'retracted')),
  identifier_type TEXT CHECK (identifier_type IN ('doi', 'issn', 'isbn', 'other')),
  identifier_value TEXT,
  identifier_url TEXT,
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  citation_count INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS articles_scholar_id_idx ON public.articles(scholar_id);
CREATE INDEX IF NOT EXISTS articles_status_idx ON public.articles(status);
CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles(slug);
CREATE INDEX IF NOT EXISTS articles_discipline_id_idx ON public.articles(discipline_id);
CREATE INDEX IF NOT EXISTS articles_university_id_idx ON public.articles(university_id);
```

### Table 3: `article_authors`
```sql
CREATE TABLE IF NOT EXISTS public.article_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_affiliation TEXT NOT NULL,
  is_corresponding BOOLEAN DEFAULT false,
  author_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS article_authors_article_id_idx ON public.article_authors(article_id);
CREATE INDEX IF NOT EXISTS article_authors_email_idx ON public.article_authors(author_email);
```

### Table 4: `article_references`
```sql
CREATE TABLE IF NOT EXISTS public.article_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  citation_text TEXT NOT NULL,
  reference_order INTEGER NOT NULL DEFAULT 0,
  doi TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS article_references_article_id_idx ON public.article_references(article_id);
```

---

## Implementation Tasks

### Phase 1: Database Setup
1. ✅ Create SQL migration file with all 4 tables
2. ✅ Add RLS policies (basic - allow users to read their own data, public read for published articles)
3. ✅ Update Supabase types file (or create migration)

### Phase 2: Profile Integration
1. ✅ Update `CompleteProfile.tsx` to save data to `profiles` table
2. ✅ Update `SignUp.tsx` profile creation to include all fields
3. ✅ Create/Update `MyProfile.tsx` page at `/scholar/profile` route
   - Display current profile data
   - Allow editing of profile fields
   - Show stats (articles count, citations, etc.)

### Phase 3: Paper Submission Integration
1. ✅ Update `SubmitPaper.tsx` to save to `articles` table
2. ✅ Save PDF to Supabase Storage
3. ✅ Save authors to `article_authors` table
4. ✅ Save references to `article_references` table
5. ✅ Generate slug from title
6. ✅ Set initial status to 'under-review' or 'draft'

### Phase 4: Dashboard Integration
1. ✅ Update `ScholarDashboard.tsx` to fetch real data from database
2. ✅ Show actual paper counts, citations, views from database
3. ✅ Display actual papers from database

### Phase 5: Public Profile Integration
1. ✅ Update `ScholarProfile.tsx` to fetch from database
2. ✅ Show real stats and publications

---

## Files to Create/Modify

### New Files:
1. `supabase/migrations/[timestamp]_create_scholar_tables.sql` - Database migration
2. `src/pages/scholarly/MyProfile.tsx` - My Profile page (edit/view)

### Files to Modify:
1. `src/pages/scholarly/auth/CompleteProfile.tsx` - Save to database
2. `src/pages/scholarly/auth/SignUp.tsx` - Already has profile creation, may need updates
3. `src/pages/scholarly/SubmitPaper.tsx` - Save paper to database
4. `src/pages/scholarly/ScholarDashboard.tsx` - Fetch real data
5. `src/pages/scholarly/ScholarProfile.tsx` - Fetch from database
6. `src/App.tsx` - Add route for `/scholar/profile`

---

## Notes & Considerations

1. **File Storage**: PDF files will be stored in Supabase Storage bucket `article-pdfs`
2. **Slug Generation**: Create unique slugs from article titles (handle duplicates)
3. **RLS Policies**: 
   - Scholars can read/write their own profiles
   - Public can read published articles
   - Scholars can read their own articles (all statuses)
4. **Profile Image**: Can be stored in Supabase Storage or Cloudinary (already used in project)
5. **University Matching**: May need to match university names to existing `universities` table
6. **Status Workflow**: draft → under-review → published/rejected

---

## Questions to Confirm:

1. Should profile images be stored in Supabase Storage or Cloudinary?
2. Should we link articles to the existing `universities` table or keep as text?
3. What should be the default status for new submissions? ('under-review' or 'draft'?)
4. Should scholars be able to edit their submitted papers, or only drafts?
5. Do we need approval workflow now, or just save as 'published'?

---

## Ready to Proceed?

Once you confirm this plan, I will:
1. Create the SQL migration file
2. Update all the components to connect to the database
3. Create the My Profile page
4. Test the integration

Please review and confirm if this looks good! 🚀
