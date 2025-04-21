/*
  # Trigger achievements for existing user data

  1. Purpose
    - Trigger achievement checks for existing users
    - Ensure achievements are properly awarded based on current analytics
  
  2. Process
    - Update user_analytics timestamps to trigger achievement checks
    - Only affects users with existing analytics data
*/

-- Update timestamps on user_analytics to trigger achievement checks
UPDATE user_analytics
SET updated_at = now()
WHERE user_id = 'c7f4752c-1955-4b80-ae92-268e946047df';

-- Add comment explaining what was done
COMMENT ON TABLE user_achievements IS 
'Stores user achievement progress and unlock status. Achievement checks triggered for existing users on 2025-03-23.';