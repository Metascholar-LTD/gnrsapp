-- ============================================================================
-- HELPER FUNCTION: Create or Update Admin Profile
-- ============================================================================
-- This creates a function that can be called to create/update admin profiles
-- ============================================================================

-- Function to create or update admin profile for a user
CREATE OR REPLACE FUNCTION public.create_admin_profile(user_uuid UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, full_name)
  VALUES (user_uuid, 'admin', 'Admin User')
  ON CONFLICT (user_id) 
  DO UPDATE SET role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_admin_profile(UUID) TO authenticated;

-- ============================================================================
-- USAGE:
-- ============================================================================
-- Option A: Call from SQL Editor with your user UUID
-- SELECT public.create_admin_profile('YOUR_USER_UUID_HERE');
--
-- Option B: Call from your app (JavaScript/TypeScript)
-- const { data: { user } } = await supabase.auth.getUser();
-- if (user?.id) {
--   const { error } = await supabase.rpc('create_admin_profile', {
--     user_uuid: user.id
--   });
-- }
-- ============================================================================
