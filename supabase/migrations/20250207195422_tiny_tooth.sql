/*
  # Add Unique Constraint to Blog Notifications

  1. Changes
    - Add unique constraint on blog_post_id column in blog_notifications table
    - This ensures we can use ON CONFLICT in upsert operations
*/

-- Add unique constraint to blog_post_id
DO $$ BEGIN
  -- Check if the constraint doesn't already exist
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'blog_notifications_blog_post_id_key'
  ) THEN
    ALTER TABLE blog_notifications
    ADD CONSTRAINT blog_notifications_blog_post_id_key
    UNIQUE (blog_post_id);
  END IF;
END $$;