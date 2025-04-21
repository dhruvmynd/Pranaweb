/*
  # Add RLS policies for practice sessions

  1. Security
    - Enable RLS on practice_sessions table if not already enabled
    - Add policy for users to insert their own sessions
    - Add policy for users to read their own sessions
    - Add policy for users to update their own sessions
    - Add policy for admins to have full access
*/

-- Enable RLS
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own sessions
CREATE POLICY "Users can insert their own sessions"
ON practice_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own sessions
CREATE POLICY "Users can read their own sessions"
ON practice_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to update their own sessions
CREATE POLICY "Users can update their own sessions"
ON practice_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow admin full access
CREATE POLICY "Admin has full access to practice sessions"
ON practice_sessions
TO authenticated
USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');