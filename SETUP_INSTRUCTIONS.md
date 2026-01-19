# Scholar Database Setup Instructions

## ✅ Step-by-Step Setup Guide

### Step 1: Run Database Migrations

1. **Apply the main schema migration:**
   ```sql
   -- Run this in Supabase SQL Editor or via CLI
   -- File: supabase/migrations/20250102000000_create_scholar_tables.sql
   ```

2. **Apply the storage buckets migration:**
   ```sql
   -- Run this in Supabase SQL Editor or via CLI
   -- File: supabase/migrations/20250102000001_setup_storage_buckets.sql
   ```

### Step 2: Verify Storage Buckets

After running the migrations, verify the buckets were created:

1. Go to **Supabase Dashboard** → **Storage**
2. Verify these buckets exist:
   - ✅ `profile-images` (Public)
   - ✅ `article-pdfs` (Public)

If buckets don't exist, create them manually:
- **Bucket Name**: `profile-images`
  - Public: ✅ Yes
  - File Size Limit: 5MB
  - Allowed MIME Types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

- **Bucket Name**: `article-pdfs`
  - Public: ✅ Yes
  - File Size Limit: 50MB
  - Allowed MIME Types: `application/pdf`

### Step 3: Verify RLS Policies

Check that Row Level Security is enabled and policies are created:

1. Go to **Supabase Dashboard** → **Table Editor**
2. Verify these tables exist:
   - ✅ `profiles`
   - ✅ `articles`
   - ✅ `article_authors`
   - ✅ `article_references`

3. For each table, verify:
   - RLS is enabled (toggle should be ON)
   - Policies are created (check the "Policies" tab)

### Step 4: Test the Flow

1. **Sign up as a scholar:**
   - Go to `/scholarly/auth/sign-up`
   - Create account with email/password or Google OAuth

2. **Complete profile:**
   - After sign-up, you'll be redirected to `/scholarly/auth/complete-profile`
   - Fill in university, department, title, research interests
   - Submit

3. **Upload profile image:**
   - Go to `/scholar/profile`
   - Click "Upload Image" or "Change Image"
   - Select an image (max 5MB)
   - Save

4. **Submit a paper:**
   - Go to `/scholar/submit-paper`
   - Fill in all required fields
   - Upload PDF (max 50MB)
   - Submit
   - Paper will be in "under-review" status

### Step 5: Verify Data

Check that data is being saved correctly:

1. **Check profiles table:**
   ```sql
   SELECT * FROM profiles WHERE role = 'scholar';
   ```

2. **Check articles table:**
   ```sql
   SELECT id, title, status, university_id, submitted_by 
   FROM articles 
   ORDER BY submitted_at DESC;
   ```

3. **Check storage:**
   - Go to **Storage** → `profile-images` → Check files are uploaded
   - Go to **Storage** → `article-pdfs` → Check PDFs are uploaded

## 🔧 Troubleshooting

### Issue: "Bucket does not exist"
**Solution**: Run the storage buckets migration or create buckets manually in Supabase Dashboard.

### Issue: "Permission denied" when uploading
**Solution**: 
1. Check storage policies are created
2. Verify bucket is public
3. Check RLS policies on storage.objects

### Issue: "Foreign key constraint violation"
**Solution**: 
1. Ensure `universities` table has data
2. Ensure user has completed profile with university_id set

### Issue: "Profile not found"
**Solution**: 
1. Check if profile was created during sign-up
2. If not, complete profile at `/scholarly/auth/complete-profile`

### Issue: "Cannot submit paper - no university"
**Solution**: 
1. Complete profile and set university affiliation
2. Go to `/scholar/profile` and update university

## 📋 Verification Checklist

- [ ] Database migrations applied successfully
- [ ] Storage buckets created (`profile-images`, `article-pdfs`)
- [ ] RLS policies enabled on all tables
- [ ] Storage policies created
- [ ] Can sign up as scholar
- [ ] Can complete profile
- [ ] Can upload profile image
- [ ] Can submit paper
- [ ] Data appears in database tables
- [ ] Files appear in storage buckets

## 🚀 Next Steps After Setup

1. **Admin Panel Integration:**
   - Connect admin panel to approve/reject articles
   - Update university rankings based on approved articles

2. **Dashboard Updates:**
   - Update ScholarDashboard to fetch real data
   - Show actual articles, metrics, rankings

3. **Paper Editing:**
   - Add edit functionality for approved papers (creates new version)
   - Add version history view

## 📝 Important Notes

- **Default Status**: All new submissions are `under-review`
- **University Linking**: Articles are automatically linked to scholar's university
- **Versioning**: Approved papers can be edited (creates new version)
- **Storage**: Files are organized by user_id in folders
- **RLS**: All tables have proper security policies

## 🆘 Support

If you encounter any issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify all migrations ran successfully
4. Ensure storage buckets are public
5. Verify RLS policies are correct
