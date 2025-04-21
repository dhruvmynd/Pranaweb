-- Drop existing check constraint
ALTER TABLE blog_notifications 
DROP CONSTRAINT IF EXISTS blog_notifications_status_check;

-- Add new check constraint with correct values
ALTER TABLE blog_notifications 
ADD CONSTRAINT blog_notifications_status_check 
CHECK (status::text IN ('pending', 'processing', 'completed', 'failed'));

-- Update any existing rows with invalid status
UPDATE blog_notifications 
SET status = 'pending' 
WHERE status NOT IN ('pending', 'processing', 'completed', 'failed');