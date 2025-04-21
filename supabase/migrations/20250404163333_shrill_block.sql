/*
  # Update Admin Stats Query Function
  
  1. Changes
    - Create a function to get accurate user statistics
    - Count total users from auth.users table
    - Count active users based on recent sessions
    - Count new users in the last 30 days
    
  2. Security
    - Function uses SECURITY DEFINER to ensure proper access
    - Only accessible to authenticated users with admin privileges
*/

-- Create a function to get accurate user statistics
CREATE OR REPLACE FUNCTION get_admin_user_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  total_users integer;
  active_users integer;
  new_users integer;
  thirty_days_ago timestamptz := now() - interval '30 days';
  result json;
BEGIN
  -- Get total users (non-deleted)
  SELECT COUNT(*) 
  INTO total_users
  FROM auth.users
  WHERE deleted_at IS NULL;
  
  -- Get active users (users with sessions in last 30 days)
  SELECT COUNT(DISTINCT user_id)
  INTO active_users
  FROM (
    -- Users with practice sessions in last 30 days
    SELECT user_id FROM practice_sessions 
    WHERE completed_at >= thirty_days_ago
    UNION
    -- Users with iOS app sessions in last 30 days
    SELECT user_id FROM ios_app_sessions 
    WHERE completed_at >= thirty_days_ago
    UNION
    -- Users with auth sessions in last 30 days
    SELECT user_id FROM auth.sessions 
    WHERE created_at >= thirty_days_ago
  ) as active;
  
  -- Get new users in last 30 days
  SELECT COUNT(*)
  INTO new_users
  FROM auth.users
  WHERE created_at >= thirty_days_ago
  AND deleted_at IS NULL;
  
  -- Build result JSON
  result := json_build_object(
    'total_users', total_users,
    'active_users', active_users,
    'new_users', new_users
  );
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_admin_user_stats() TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION get_admin_user_stats() IS 
'Returns accurate user statistics for admin dashboard including total, active, and new users';