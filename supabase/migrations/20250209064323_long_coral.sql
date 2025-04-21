/*
  # Remove Blog Notifications System
  
  1. Changes
    - Drop blog notifications table and related objects
    - Remove trigger and function for blog post publishing
    - Clean up any remaining constraints
  
  This migration removes the notifications tracking system since we're now using
  Brevo for email delivery without needing to track status in the database.
*/

-- Drop trigger first
DROP TRIGGER IF EXISTS on_blog_post_publish ON blog_posts;

-- Drop function
DROP FUNCTION IF EXISTS handle_blog_post_publish();

-- Drop notifications table and all its dependencies
DROP TABLE IF EXISTS blog_notifications CASCADE;