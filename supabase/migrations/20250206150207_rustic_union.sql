/*
  # Fix Blog Notifications Schema

  1. Changes
    - Drop existing notifications table and recreate with text status field
    - Recreate admin policy
    - Recreate trigger function and trigger
  
  2. Security
    - Enable RLS
    - Add admin-only policy
*/

-- Drop existing objects
DROP TRIGGER IF EXISTS on_blog_post_publish ON blog_posts;
DROP FUNCTION IF EXISTS handle_blog_post_publish();
DROP TABLE IF EXISTS blog_notifications;

-- Create notifications table with text status
CREATE TABLE blog_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz,
  recipient_count int,
  error_message text,
  retry_count int DEFAULT 0
);

-- Enable RLS
ALTER TABLE blog_notifications ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins have full access to blog notifications"
  ON blog_notifications
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');

-- Create function to handle blog post publishing
CREATE OR REPLACE FUNCTION handle_blog_post_publish()
RETURNS TRIGGER AS $$
BEGIN
  -- If post is being published for the first time
  IF NEW.published = true AND (OLD IS NULL OR OLD.published = false) THEN
    -- Create notification record
    INSERT INTO blog_notifications (blog_post_id)
    VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for blog post publishing
CREATE TRIGGER on_blog_post_publish
  AFTER INSERT OR UPDATE OF published
  ON blog_posts
  FOR EACH ROW
  WHEN (NEW.published = true)
  EXECUTE FUNCTION handle_blog_post_publish();