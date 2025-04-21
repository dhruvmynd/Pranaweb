-- Create function to check if email exists
CREATE OR REPLACE FUNCTION check_email_exists(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = email_to_check
  ) INTO user_exists;
  
  RETURN user_exists;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_email_exists(text) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION check_email_exists(text) IS 'Safely check if an email address is already registered';

-- Create trigger function to ensure profile exists
CREATE OR REPLACE FUNCTION ensure_user_profile_exists()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add delay to allow auth user creation to complete
  PERFORM pg_sleep(0.5);
  
  -- Create profile if it doesn't exist
  INSERT INTO public.user_profiles (
    user_id,
    first_name,
    last_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    '',
    '',
    '/default.png',
    now(),
    now()
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_profile_exists();