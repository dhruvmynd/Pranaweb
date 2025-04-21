-- Drop existing function
DROP FUNCTION IF EXISTS cleanup_user_session(uuid);

-- Create improved session cleanup function
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
  SET last_sign_in_at = now(),
      raw_app_meta_data = 
        CASE 
          WHEN raw_app_meta_data IS NULL THEN '{}'::jsonb
          ELSE raw_app_meta_data
        END || 
        jsonb_build_object('last_sign_out', extract(epoch from now())::text)
  WHERE id = target_uid;

  -- Commit the transaction
  COMMIT;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't throw to ensure clean logout
    RAISE WARNING 'Error during session cleanup: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_user_session(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION cleanup_user_session(uuid) IS 
'Safely cleans up user session data during sign out with improved error handling';