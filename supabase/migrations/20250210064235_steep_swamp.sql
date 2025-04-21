/*
  # Update Messages RLS Policy

  1. Changes
    - Update admin read policy to use email check instead of user_roles table
  
  2. Security
    - Maintains admin-only access
    - Uses direct email check for better performance
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Admins can read messages" ON messages;

-- Create new policy using email check
CREATE POLICY "Admins can read messages"
ON messages
TO authenticated
USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');