/*
  # Populate User Analytics
  
  1. Purpose
    - Populates user_analytics table with data for all existing users
    - Ensures all current users have analytics entries
    
  2. Process
    - Gets all users from auth.users
    - Calculates analytics for each user
*/

-- Function to populate analytics for all users
CREATE OR REPLACE FUNCTION populate_all_user_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Loop through all users in auth.users
  FOR user_record IN 
    SELECT id 
    FROM auth.users 
    WHERE deleted_at IS NULL
  LOOP
    -- Calculate analytics for each user
    PERFORM calculate_user_analytics(user_record.id);
  END LOOP;
END;
$$;

-- Execute the population function
SELECT populate_all_user_analytics();

-- Drop the function since we only need it once
DROP FUNCTION populate_all_user_analytics();

-- Add comment explaining what was done
COMMENT ON TABLE user_analytics IS 
'Consolidated analytics data for users including practice sessions, moods, and streaks. Initially populated on 2025-02-14.';