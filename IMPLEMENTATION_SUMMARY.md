# Scholar Database Implementation Summary

## ✅ Completed Tasks

### 1. Database Schema (SQL Migration)
- **File**: `supabase/migrations/20250102000000_create_scholar_tables.sql`
- **Tables Created**:
  - `profiles` - Scholar profile information with metrics
  - `articles` - Research papers with versioning support
  - `article_authors` - Many-to-many relationship for authors
  - `article_references` - References/citations for articles
- **Features**:
  - Versioning system for editing approved papers (`parent_article_id`, `version`, `is_current_version`)
  - Default status: `under-review` for new submissions
  - Automatic metrics updates via triggers
  - Row Level Security (RLS) policies
  - Storage bucket support for PDFs and profile images

### 2. Profile Completion (`CompleteProfile.tsx`)
- ✅ Saves university, department, title, research interests, ORCID to `profiles` table
- ✅ Loads universities from database
- ✅ Creates/updates profile on submit

### 3. My Profile Page (`MyProfile.tsx`)
- ✅ Full profile editing interface
- ✅ **Profile image upload to Supabase Storage bucket** (`profile-images`)
- ✅ Edit all profile fields (name, bio, university, department, title, research interests, ORCID)
- ✅ Real-time image preview
- ✅ Image validation (type, size)

### 4. Paper Submission (`SubmitPaper.tsx`)
- ✅ Saves articles to `articles` table
- ✅ **PDF upload to Supabase Storage bucket** (`article-pdfs`)
- ✅ Links articles to scholar's university (`university_id`)
- ✅ Creates `article_authors` records
- ✅ Creates `article_references` records
- ✅ Default status: `under-review` (as per requirements)
- ✅ Validates university affiliation before submission

### 5. Routing
- ✅ Added `/scholar/profile` route in `App.tsx`
- ✅ Integrated with `ScholarLayout`

## 🔄 Pending Tasks

### 6. Paper Editing (Versioning)
- Need to create `EditPaper.tsx` component
- When editing approved papers, create new version
- New version goes back to `under-review` status
- Old version marked as `is_current_version = false`

### 7. Scholar Dashboard
- Update to fetch real data from database
- Show actual articles, metrics, university rankings
- Add edit buttons for papers

## 📋 Database Tables Structure

### `profiles`
- `user_id` (FK to auth.users)
- `role` ('scholar' | 'admin')
- `full_name`, `profile_image`, `bio`, `orcid_id`
- `university_id` (FK to universities)
- `department`, `title`, `research_interests[]`
- Metrics: `total_articles`, `total_citations`, `total_views`, `total_downloads`, `h_index`, `i10_index`

### `articles`
- `title`, `abstract`, `keywords[]`
- `discipline_category`, `discipline`
- `article_type` ('research' | 'review' | 'case-study' | 'methodology' | 'other')
- `pdf_url` (Supabase Storage)
- `identifier_type`, `identifier_value`, `identifier_url`
- `status` ('under-review' | 'approved' | 'rejected' | 'revision-requested')
- `submitted_by` (FK to auth.users)
- `university_id` (FK to universities) - **Used for rankings**
- `version`, `parent_article_id`, `is_current_version` (for versioning)
- Metrics: `views`, `downloads`, `citations`

### `article_authors`
- `article_id` (FK to articles)
- `name`, `email`, `affiliation`
- `is_corresponding`, `author_order`
- `profile_id` (optional FK to profiles if author is registered)

### `article_references`
- `article_id` (FK to articles)
- `reference_text`, `reference_order`

## 🎯 Key Features Implemented

1. **Profile Images in Supabase Storage** ✅
   - Bucket: `profile-images`
   - Path: `profile-images/{user_id}/{timestamp}-{random}.{ext}`
   - Old images are deleted when new one is uploaded

2. **Articles Linked to Universities** ✅
   - Each article has `university_id` from scholar's profile
   - Used for university rankings calculation
   - Articles must be approved to count toward rankings

3. **Default Status: Under Review** ✅
   - All new submissions default to `under-review`
   - Admin must approve from admin panel

4. **Smart Paper Editing (Versioning)** ⏳
   - Database schema supports versioning
   - Need to implement UI component
   - When approved paper is edited:
     - Create new article record with `parent_article_id`
     - Set `is_current_version = true` for new version
     - Set `is_current_version = false` for old version
     - New version status: `under-review`
     - Increment version number

## 📝 Storage Buckets Required

Create these buckets in Supabase Dashboard:
1. **`profile-images`** - For scholar profile images
2. **`article-pdfs`** - For research paper PDFs

Set public read access for both buckets.

## 🔐 RLS Policies

- Scholars can view/edit their own profiles
- Scholars can view their own articles (all statuses)
- Public can view approved articles only
- Scholars can create new versions of approved articles
- Scholars can only update articles in `under-review` or `revision-requested` status

## 🚀 Next Steps

1. Create `EditPaper.tsx` component for editing papers
2. Update `ScholarDashboard.tsx` to fetch real data
3. Add edit buttons/links in dashboard
4. Test the complete flow end-to-end
5. Set up storage buckets in Supabase Dashboard
