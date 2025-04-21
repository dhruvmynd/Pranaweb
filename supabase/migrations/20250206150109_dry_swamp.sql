/*
  # Blog Notifications System Update

  1. Changes
    - Drop existing policy before recreating
    - Ensure clean policy creation
*/

-- Drop existing policy first
DROP POLICY IF EXISTS "Admins have full access to blog notifications" ON blog_notifications;

-- Create policy
CREATE POLICY "Admins have full access to blog notifications"
  ON blog_notifications
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');