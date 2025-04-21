/*
  # Blog Notification System

  1. New Tables
    - `blog_notifications`
      - Tracks notification status for blog posts
      - Links to blog posts and stores notification metadata
      - Records recipient counts and error tracking

  2. Functions & Triggers
    - Automatically creates notification record when blog post is published
    - Handles notification status tracking

  3. Security
    - RLS policies for admin access
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS blog_notifications (
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
DROP TRIGGER IF EXISTS on_blog_post_publish ON blog_posts;
CREATE TRIGGER on_blog_post_publish
  AFTER INSERT OR UPDATE OF published
  ON blog_posts
  FOR EACH ROW
  WHEN (NEW.published = true)
  EXECUTE FUNCTION handle_blog_post_publish();