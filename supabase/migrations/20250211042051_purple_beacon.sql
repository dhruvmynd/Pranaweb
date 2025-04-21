-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_user_deletion ON auth.users;
DROP FUNCTION IF EXISTS handle_user_deletion();
DROP FUNCTION IF EXISTS delete_user(uuid);

-- Create RLS policies for all user-related tables
DO $$ 
DECLARE 
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('user_profiles', 'practice_sessions', 'moods', 'user_streaks', 'ios_app_sessions')
  LOOP
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    
    -- Drop existing policies if they exist
    EXECUTE format('DROP POLICY IF EXISTS "Users can delete their own data" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can read their own data" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can update their own data" ON %I', t);
    
    -- Create delete policy
    EXECUTE format(
      'CREATE POLICY "Users can delete their own data" ON %I FOR DELETE TO authenticated USING (auth.uid() = user_id)',
      t
    );
    
    -- Create select policy
    EXECUTE format(
      'CREATE POLICY "Users can read their own data" ON %I FOR SELECT TO authenticated USING (auth.uid() = user_id)',
      t
    );
    
    -- Create update policy
    EXECUTE format(
      'CREATE POLICY "Users can update their own data" ON %I FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
      t
    );
  END LOOP;
END $$;

-- Add cascade delete triggers for user data cleanup
CREATE OR REPLACE FUNCTION cleanup_user_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete all related data
  DELETE FROM user_profiles WHERE user_id = OLD.id;
  -- Other tables will be cleaned up via CASCADE
  RETURN OLD;
END;
$$;

-- Create trigger for user deletion cleanup
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_user_data();

-- Add comments for documentation
COMMENT ON FUNCTION cleanup_user_data() IS 'Automatically cleans up user data when a user is deleted';
COMMENT ON TRIGGER on_auth_user_deleted ON auth.users IS 'Triggers cleanup of user data before user deletion';