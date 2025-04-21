-- Create function to handle session cleanup
CREATE OR REPLACE FUNCTION cleanup_user_session(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Invalidate any existing sessions
  UPDATE auth.sessions
  SET not_after = now()
  WHERE user_id = user_id
  AND not_after > now();
  
  -- Update user's last sign out time
  UPDATE auth.users
  SET last_sign_in_at = now()
  WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_user_session(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION cleanup_user_session(uuid) IS 
'Safely cleans up user session data during sign out';