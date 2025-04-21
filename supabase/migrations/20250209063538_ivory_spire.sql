/*
  # Fix blog notifications schema

  1. Changes
    - Add proper status enum type
    - Update status column with correct check constraint
    - Add default status value
    - Add indexes for better query performance

  2. Security
    - Maintains existing RLS policies
*/

-- Create status type if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'notification_status'
  ) THEN
    CREATE TYPE notification_status AS ENUM (
      'pending',
      'processing', 
      'completed',
      'failed'
    );
  END IF;
END $$;

-- Update status column
ALTER TABLE blog_notifications 
  ALTER COLUMN status SET DEFAULT 'pending',
  ALTER COLUMN status SET NOT NULL;

-- Drop existing check constraint if it exists
ALTER TABLE blog_notifications 
  DROP CONSTRAINT IF EXISTS blog_notifications_status_check;

-- Add new check constraint
ALTER TABLE blog_notifications 
  ADD CONSTRAINT blog_notifications_status_check 
  CHECK (status IN ('pending', 'processing', 'completed', 'failed'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_notifications_status 
  ON blog_notifications(status);

CREATE INDEX IF NOT EXISTS idx_blog_notifications_created_at 
  ON blog_notifications(created_at);