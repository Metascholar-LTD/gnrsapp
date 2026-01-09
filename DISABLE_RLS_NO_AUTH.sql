-- ============================================
-- DISABLE RLS - NO AUTHENTICATION REQUIRED
-- ============================================
-- Run this in Supabase SQL Editor NOW

-- DISABLE RLS ON ALL TABLES
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE nss_programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE graduate_programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE yea_programs DISABLE ROW LEVEL SECURITY;

-- DROP ALL POLICIES (they're not needed)
DROP POLICY IF EXISTS "Public can read companies" ON companies;
DROP POLICY IF EXISTS "Public can read jobs" ON jobs;
DROP POLICY IF EXISTS "Public can read internships" ON internships;
DROP POLICY IF EXISTS "Public can read nss_programs" ON nss_programs;
DROP POLICY IF EXISTS "Public can read graduate_programs" ON graduate_programs;
DROP POLICY IF EXISTS "Public can read yea_programs" ON yea_programs;

DROP POLICY IF EXISTS "Authenticated users can manage companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can manage jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can manage internships" ON internships;
DROP POLICY IF EXISTS "Authenticated users can manage nss_programs" ON nss_programs;
DROP POLICY IF EXISTS "Authenticated users can manage graduate_programs" ON graduate_programs;
DROP POLICY IF EXISTS "Authenticated users can manage yea_programs" ON yea_programs;

-- DROP ANY OTHER POLICIES THAT MIGHT EXIST
DROP POLICY IF EXISTS "Authenticated users can insert companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can update companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can delete companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can update jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can delete jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can insert internships" ON internships;
DROP POLICY IF EXISTS "Authenticated users can update internships" ON internships;
DROP POLICY IF EXISTS "Authenticated users can delete internships" ON internships;
DROP POLICY IF EXISTS "Authenticated users can insert nss_programs" ON nss_programs;
DROP POLICY IF EXISTS "Authenticated users can update nss_programs" ON nss_programs;
DROP POLICY IF EXISTS "Authenticated users can delete nss_programs" ON nss_programs;
DROP POLICY IF EXISTS "Authenticated users can insert graduate_programs" ON graduate_programs;
DROP POLICY IF EXISTS "Authenticated users can update graduate_programs" ON graduate_programs;
DROP POLICY IF EXISTS "Authenticated users can delete graduate_programs" ON graduate_programs;
DROP POLICY IF EXISTS "Authenticated users can insert yea_programs" ON yea_programs;
DROP POLICY IF EXISTS "Authenticated users can update yea_programs" ON yea_programs;
DROP POLICY IF EXISTS "Authenticated users can delete yea_programs" ON yea_programs;

-- NOW EVERYTHING WORKS WITHOUT AUTH!
