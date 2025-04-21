/*
  # Fix Profile Creation Function

  1. Changes
    - Drop existing function first to avoid parameter name conflicts
    - Recreate function with proper parameter naming
    - Maintain security context and permissions
    
  2. Security
    - Keep SECURITY DEFINER context
    - Maintain proper schema search path
*/

-- First drop the existing function
DROP FUNCTION IF EXISTS create_profile_for_user(uuid);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION create_profile_for_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    first_name,
    last_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    user_id,
    '',
    '',
    '/default.png',
    now(),
    now()
  )
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_profile_for_user(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION create_profile_for_user(uuid) IS 
'Creates a user profile with proper security context';