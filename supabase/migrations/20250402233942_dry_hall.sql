-- Drop existing function
DROP FUNCTION IF EXISTS create_profile_for_user(uuid);

-- Create function with proper security context, error handling, and return value
CREATE OR REPLACE FUNCTION create_profile_for_user(input_user_id uuid)
RETURNS user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_profile user_profiles;
BEGIN
  -- Verify user exists in auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE id = input_user_id;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- First check if profile exists
  SELECT * INTO v_profile
  FROM user_profiles 
  WHERE user_id = input_user_id;

  IF v_profile.id IS NOT NULL THEN
    RETURN v_profile;
  END IF;

  -- Insert profile with security definer context
  INSERT INTO user_profiles (
    user_id,
    first_name,
    last_name,
    avatar_url,
    created_at,
    updated_at,
    notification_time
  )
  VALUES (
    input_user_id,
    '',
    '',
    '/default.png',
    now(),
    now(),
    null
  )
  RETURNING * INTO v_profile;

  IF v_profile.id IS NULL THEN
    RAISE EXCEPTION 'Failed to create profile';
  END IF;

  RETURN v_profile;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_profile_for_user(uuid) TO authenticated;

-- Add comment explaining the changes
COMMENT ON FUNCTION create_profile_for_user(uuid) IS 
'Creates a user profile and returns the created/existing profile record';