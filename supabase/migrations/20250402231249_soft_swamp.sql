-- Drop existing function
DROP FUNCTION IF EXISTS create_profile_for_user(uuid);

-- Create function with proper conflict handling
CREATE OR REPLACE FUNCTION create_profile_for_user(input_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First check if profile exists to avoid race conditions
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = input_user_id
  ) THEN
    INSERT INTO user_profiles (
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
    );
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_profile_for_user(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION create_profile_for_user(uuid) IS 
'Creates a user profile if it does not exist, with proper conflict handling';