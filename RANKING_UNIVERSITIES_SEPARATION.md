# Ranking Universities Separation

## ✅ Changes Made

### Problem
- Scholar profiles and articles were linked to the general `universities` table
- The general `universities` table is for the directory (used by all users)
- Ranking universities should be separate and only for the scholarly ranking system

### Solution
1. Created new `ranking_universities` table specifically for rankings
2. Updated `profiles` table to reference `ranking_universities` instead of `universities`
3. Updated `articles` table to reference `ranking_universities` instead of `universities`
4. Updated code files to use `ranking_universities`

## 📋 Migration Files

### 1. `20250102000003_create_ranking_universities.sql`
- Creates the new `ranking_universities` table
- Includes ranking-specific fields (total_articles, current_rank, etc.)
- Separate from general universities directory

### 2. `20250102000004_update_profiles_and_articles_to_ranking_universities.sql`
- Drops old foreign key constraints to `universities`
- Adds new foreign key constraints to `ranking_universities`
- Updates indexes

## 🔄 Code Files Updated

1. **`CompleteProfile.tsx`**
   - Changed from `from('universities')` to `from('ranking_universities')`

2. **`MyProfile.tsx`**
   - Changed from `from('universities')` to `from('ranking_universities')`
   - Updated profile query to join with `ranking_universities`

3. **`SubmitPaper.tsx`**
   - No changes needed (gets university_id from profile)

## ⚠️ Important Notes

### Data Migration Required
After running the migrations, you'll need to:

1. **Create ranking universities entries:**
   - Copy or create universities in `ranking_universities` table
   - These are separate from the general `universities` table

2. **Update existing data:**
   - If you have existing profiles/articles with `university_id`:
   - Map old `universities.id` to new `ranking_universities.id`
   - Update `university_id` in `profiles` and `articles` tables

### Example Data Migration SQL:
```sql
-- Step 1: Create ranking universities from existing universities (if needed)
INSERT INTO ranking_universities (name, abbreviation, region, type, logo, description, website, city, country)
SELECT name, abbreviation, region, type, logo, description, website, 
       (contact->>'address')::text as city, 'Ghana' as country
FROM universities
WHERE id IN (SELECT DISTINCT university_id FROM profiles WHERE university_id IS NOT NULL);

-- Step 2: Update profiles to use ranking_universities IDs
-- (You'll need to map old IDs to new IDs based on name matching)
UPDATE profiles p
SET university_id = (
  SELECT ru.id 
  FROM ranking_universities ru 
  WHERE ru.name = (SELECT u.name FROM universities u WHERE u.id = p.university_id)
)
WHERE university_id IS NOT NULL;

-- Step 3: Update articles similarly
UPDATE articles a
SET university_id = (
  SELECT ru.id 
  FROM ranking_universities ru 
  WHERE ru.name = (SELECT u.name FROM universities u WHERE u.id = a.university_id)
)
WHERE university_id IS NOT NULL;
```

## 🎯 Result

- ✅ General `universities` table remains for directory/listing
- ✅ `ranking_universities` table is separate for scholarly rankings
- ✅ Scholar profiles link to `ranking_universities`
- ✅ Articles link to `ranking_universities` (for rankings)
- ✅ Rankings are calculated based on articles from ranking universities

## 📝 Next Steps

1. Run migration `20250102000003_create_ranking_universities.sql`
2. Run migration `20250102000004_update_profiles_and_articles_to_ranking_universities.sql`
3. Populate `ranking_universities` table with universities for ranking
4. Migrate existing data (if any) from `universities` to `ranking_universities`
5. Test the flow: Sign up → Select ranking university → Submit article
