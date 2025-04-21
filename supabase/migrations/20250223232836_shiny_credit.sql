-- Drop existing function
DROP FUNCTION IF EXISTS cleanup_user_session(uuid);

-- Create improved session cleanup function with better error handling
CREATE OR REPLACE FUNCTION cleanup_user_session(target_uid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_session_count int;
BEGIN
  -- Start an autonomous transaction
  CREATE TEMPORARY TABLE IF NOT EXISTS temp_sessions (
    session_id uuid
  ) ON COMMIT DROP;

  -- Get sessions to invalidate
  INSERT INTO temp_sessions (session_id)
  SELECT id
  FROM auth.sessions
  WHERE user_id = target_uid
  AND not_after > now();

  GET DIAGNOSTICS v_session_count = ROW_COUNT;

  -- Invalidate sessions if any exist
  IF v_session_count > 0 THEN
    UPDATE auth.sessions
    SET not_after = now()
    WHERE id IN (SELECT session_id FROM temp_sessions);
  END IF;

  -- Update user's last sign out time
  UPDATE auth.users
  SET last_sign_in_at = now(),
      raw_app_meta_data = 
        COALESCE(raw_app_meta_data, '{}'::jsonb) || 
        jsonb_build_object(
          'last_sign_out', extract(epoch from now())::text,
          'sessions_invalidated', v_session_count
        )
  WHERE id = target_uid;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error details but continue execution
    RAISE WARNING 'Session cleanup warning for user %: %', target_uid, SQLERRM;
    -- Ensure temporary table is cleaned up
    DROP TABLE IF EXISTS temp_sessions;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_user_session(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION cleanup_user_session(uuid) IS 
'Safely cleans up user session data during sign out with improved error handling and autonomous transaction support';