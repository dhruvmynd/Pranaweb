-- Drop existing function first
DROP FUNCTION IF EXISTS delete_user(uuid);

-- Create a new version of the delete_user function that handles analytics properly
CREATE OR REPLACE FUNCTION delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  auth_user_id uuid;
BEGIN
  -- Get auth user ID and verify it exists
  SELECT id INTO auth_user_id
  FROM auth.users
  WHERE id = target_user_id;

  IF auth_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Delete user data in the correct order to avoid constraint violations
  
  -- First delete analytics
  DELETE FROM user_analytics 
  WHERE user_id = target_user_id;
  
  -- Then delete practice data
  DELETE FROM practice_sessions 
  WHERE user_id = target_user_id;
  
  -- Delete mood data
  DELETE FROM moods 
  WHERE user_id = target_user_id;
  
  -- Delete streak data
  DELETE FROM user_streaks 
  WHERE user_id = target_user_id;
  
  -- Delete profile
  DELETE FROM user_profiles 
  WHERE user_id = target_user_id;
  
  -- Finally delete the auth user
  DELETE FROM auth.users 
  WHERE id = target_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION delete_user(uuid) IS 
'Securely deletes a user and all their associated data in the correct order to avoid constraint violations';

-- Modify the analytics trigger function to be more robust
CREATE OR REPLACE FUNCTION update_user_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_val uuid;
BEGIN
  -- Get the user_id based on the table being updated
  CASE TG_TABLE_NAME
    WHEN 'practice_sessions' THEN
      user_id_val := NEW.user_id;
    WHEN 'moods' THEN
      user_id_val := NEW.user_id;
    WHEN 'user_streaks' THEN
      user_id_val := NEW.user_id;
  END CASE;

  -- Only proceed if we have a valid user_id
  IF user_id_val IS NOT NULL THEN
    -- Insert or update analytics record
    INSERT INTO user_analytics (user_id)
    VALUES (user_id_val)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Then calculate analytics
    PERFORM calculate_user_analytics(user_id_val);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add comment explaining the changes
COMMENT ON FUNCTION update_user_analytics() IS 
'Trigger function to update user analytics with improved error handling and initialization';