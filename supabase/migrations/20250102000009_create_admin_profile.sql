-- ============================================================================
-- CREATE ADMIN PROFILE FOR USER
-- ============================================================================
-- This creates an admin profile for the specified user
-- ============================================================================

-- Create admin profile for user: kyiewu Bernard (demokofi25@gmail.com)
INSERT INTO public.profiles (user_id, role, full_name)
VALUES ('a2a72136-53fc-4fd5-9f27-ebb962f7a6a0', 'admin', 'Admin User')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';
