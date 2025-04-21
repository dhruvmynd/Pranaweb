-- Drop existing function if it exists
DROP FUNCTION IF EXISTS cleanup_user_session(uuid);

-- Create function to handle session cleanup with renamed parameter
CREATE OR REPLACE FUNCTION cleanup_user_session(target_uid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Invalidate any existing sessions
  UPDATE auth.sessions
  SET not_after = now()
  WHERE user_id = target_uid
  AND not_after > now();
  
  -- Update user's last sign out time
  UPDATE auth.users
  SET last_sign_in_at = now()
  WHERE id = target_uid;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_user_session(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION cleanup_user_session(uuid) IS 
'Safely cleans up user session data during sign out. Takes target_uid as parameter to avoid column name conflicts.';