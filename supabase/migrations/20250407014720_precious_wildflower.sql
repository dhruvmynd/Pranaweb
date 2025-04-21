/*
  # Fix iOS App Sessions RLS Policies

  1. Changes
    - Add INSERT policy for ios_app_sessions table
    - Ensure proper user_id check for authenticated users
    - Maintain existing policies
    
  2. Security
    - Enables users to insert their own sessions from Apple Watch
    - Maintains existing RLS policies for other operations
*/

-- First check if RLS is enabled
ALTER TABLE ios_app_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert their own iOS app sessions" ON ios_app_sessions;

-- Create INSERT policy for iOS app sessions
CREATE POLICY "Users can insert their own iOS app sessions"
  ON ios_app_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure other policies exist
DO $$ 
BEGIN
  -- Check if SELECT policy exists, create if not
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ios_app_sessions' 
    AND cmd = 'SELECT' 
    AND policyname = 'Users can view their own iOS app sessions'
  ) THEN
    CREATE POLICY "Users can view their own iOS app sessions"
      ON ios_app_sessions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  
  -- Check if UPDATE policy exists, create if not
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ios_app_sessions' 
    AND cmd = 'UPDATE' 
    AND policyname = 'Users can update their own iOS app sessions'
  ) THEN
    CREATE POLICY "Users can update their own iOS app sessions"
      ON ios_app_sessions
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  -- Check if DELETE policy exists, create if not
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ios_app_sessions' 
    AND cmd = 'DELETE' 
    AND policyname = 'Users can delete their own iOS app sessions'
  ) THEN
    CREATE POLICY "Users can delete their own iOS app sessions"
      ON ios_app_sessions
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Add comment explaining the table
COMMENT ON TABLE ios_app_sessions IS 
'iOS app session records with HRV data. Includes RLS policies for full CRUD operations by authenticated users.';