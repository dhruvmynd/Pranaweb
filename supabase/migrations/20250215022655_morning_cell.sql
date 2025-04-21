-- Drop existing function
DROP FUNCTION IF EXISTS delete_user(uuid);

-- Create a new version that accepts either parameter name
CREATE OR REPLACE FUNCTION delete_user(user_id uuid DEFAULT NULL, target_user_id uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  actual_user_id uuid;
  auth_user_id uuid;
BEGIN
  -- Determine which parameter to use
  actual_user_id := COALESCE(target_user_id, user_id);
  
  IF actual_user_id IS NULL THEN
    RAISE EXCEPTION 'No user ID provided';
  END IF;

  -- Get auth user ID and verify it exists
  SELECT id INTO auth_user_id
  FROM auth.users
  WHERE id = actual_user_id;

  IF auth_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Delete user data in the correct order to avoid constraint violations
  
  -- First delete analytics
  DELETE FROM user_analytics 
  WHERE user_id = actual_user_id;
  
  -- Then delete practice data
  DELETE FROM practice_sessions 
  WHERE user_id = actual_user_id;
  
  -- Delete mood data
  DELETE FROM moods 
  WHERE user_id = actual_user_id;
  
  -- Delete streak data
  DELETE FROM user_streaks 
  WHERE user_id = actual_user_id;
  
  -- Delete profile
  DELETE FROM user_profiles 
  WHERE user_id = actual_user_id;
  
  -- Finally delete the auth user
  DELETE FROM auth.users 
  WHERE id = actual_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user(uuid, uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION delete_user(uuid, uuid) IS 
'Securely deletes a user and all their associated data. Accepts either user_id or target_user_id parameter for compatibility.';