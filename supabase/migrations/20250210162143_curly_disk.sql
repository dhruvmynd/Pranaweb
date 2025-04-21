-- Add notification_time column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN notification_time time;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_notification_time 
ON user_profiles(notification_time);

COMMENT ON COLUMN user_profiles.notification_time IS 
'The preferred time of day for receiving notifications, stored in UTC';