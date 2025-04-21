-- Create a function to handle user deletion
CREATE OR REPLACE FUNCTION handle_user_deletion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user data when they are marked as deleted
  IF NEW.raw_user_meta_data->>'deleted' = 'true' THEN
    -- Delete user's profile and related data
    DELETE FROM user_profiles WHERE user_id = NEW.id;
    
    -- Note: Other tables will be cleaned up via CASCADE
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for user deletion
DROP TRIGGER IF EXISTS on_user_deletion ON auth.users;
CREATE TRIGGER on_user_deletion
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data->>'deleted' = 'true')
  EXECUTE FUNCTION handle_user_deletion();

-- Ensure RLS policies are in place
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to delete their own data
CREATE POLICY "Users can delete their own data"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to read their own data
CREATE POLICY "Users can read their own data"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);