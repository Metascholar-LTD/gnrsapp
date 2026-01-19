# Institutions Setup for Ranking System

## ✅ Changes Made

### Terminology Update
- Changed from `ranking_universities` to `institutions` to match admin terminology
- Admin page calls them "institutions" in the "All Institutions" page
- These institutions are what scholars select and what get ranked

### Table Structure
- **`institutions`** table - for ranking system (managed by admin)
- **`universities`** table - for general directory (unchanged)

## 📋 Migration Files

### 1. `20250102000003_create_ranking_universities.sql` (RENAMED)
- Creates `institutions` table
- Includes ranking fields (total_articles, current_rank, etc.)
- Admin manages these institutions

### 2. `20250102000004_update_profiles_and_articles_to_ranking_universities.sql`
- Updates foreign keys from `universities` to `institutions`
- Updates `profiles.university_id` → references `institutions`
- Updates `articles.university_id` → references `institutions`

## 🔄 Code Files Updated

1. **`CompleteProfile.tsx`**
   - Now queries `institutions` table

2. **`MyProfile.tsx`**
   - Now queries `institutions` table
   - Joins with `institutions` for profile data

3. **`AllInstitutionsManager.tsx`** (Admin)
   - Now queries `institutions` table
   - Admin can manage institutions for ranking

## 🎯 Flow

1. **Admin** → Adds institutions in "All Institutions" page
2. **Scholar** → Selects institution during profile completion
3. **Scholar** → Submits articles (linked to their institution)
4. **System** → Ranks institutions based on approved articles

## ⚠️ Important

- The original migration (`20250102000000_create_scholar_tables.sql`) still references `universities` (since you already ran it)
- Migration `20250102000004` will update the foreign keys to `institutions`
- After running migrations, admin needs to add institutions in the admin panel

## 📝 Migration Order

1. ✅ `20250102000000_create_scholar_tables.sql` (already run)
2. ✅ `20250102000001_setup_storage_buckets.sql` (already run)
3. ✅ `20250102000002_fix_identifier_type_constraint.sql` (run this)
4. Run: `20250102000003_create_ranking_universities.sql` (creates `institutions` table)
5. Run: `20250102000004_update_profiles_and_articles_to_ranking_universities.sql` (updates foreign keys)
