-- Drop existing function
DROP FUNCTION IF EXISTS create_profile_for_user(uuid);

-- Create function with proper security context and error handling
CREATE OR REPLACE FUNCTION create_profile_for_user(input_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Verify user exists in auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE id = input_user_id;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- First check if profile exists
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = input_user_id
  ) THEN
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
    );
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_profile_for_user(uuid) TO authenticated;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

-- Create policies with proper security context
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 
      FROM auth.users 
      WHERE id = user_id AND id = auth.uid()
    )
  );

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add comment explaining the changes
COMMENT ON FUNCTION create_profile_for_user(uuid) IS 
'Creates a user profile with proper security context and RLS policy handling';