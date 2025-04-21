/*
  # Fix Profile Creation Function

  1. Changes
    - Drop existing function
    - Recreate with renamed parameter to avoid ambiguity
    - Fix ON CONFLICT clause syntax
    - Maintain security context and permissions
*/

-- Drop existing function
DROP FUNCTION IF EXISTS create_profile_for_user(uuid);

-- Create function with explicit table references
CREATE OR REPLACE FUNCTION create_profile_for_user(input_user_id uuid)
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
    input_user_id,
    '',
    '',
    '/default.png',
    now(),
    now()
  )
  ON CONFLICT ON CONSTRAINT user_profiles_user_id_key DO NOTHING;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_profile_for_user(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION create_profile_for_user(uuid) IS 
'Creates a user profile with explicit table references to avoid column ambiguity';