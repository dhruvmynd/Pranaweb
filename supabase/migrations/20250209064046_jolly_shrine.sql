-- Drop existing check constraint
ALTER TABLE blog_notifications 
DROP CONSTRAINT IF EXISTS blog_notifications_status_check;

-- Add new check constraint with explicit text comparison
ALTER TABLE blog_notifications 
ADD CONSTRAINT blog_notifications_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'failed'));

-- Set default value for status column
ALTER TABLE blog_notifications
ALTER COLUMN status SET DEFAULT 'pending';

-- Update any invalid status values to 'pending'
UPDATE blog_notifications 
SET status = 'pending' 
WHERE status IS NULL OR status NOT IN ('pending', 'processing', 'completed', 'failed');