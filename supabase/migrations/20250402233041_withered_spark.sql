-- Drop existing function
DROP FUNCTION IF EXISTS create_profile_for_user(uuid);

-- Create function with proper error handling and retries
CREATE OR REPLACE FUNCTION create_profile_for_user(input_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  max_retries constant int := 3;
  current_retry int := 0;
  success boolean := false;
BEGIN
  -- Retry loop for handling race conditions
  WHILE current_retry < max_retries AND NOT success LOOP
    BEGIN
      -- First check if profile exists
      IF NOT EXISTS (
        SELECT 1 FROM user_profiles WHERE user_id = input_user_id
      ) THEN
        INSERT INTO user_profiles (
          user_id,
          first_name,
          last_name,
          avatar_url,
          created_at,
          updated_at
        )
        VALUES (
          input_user_id,
          '',
          '',
          '/default.png',
          now(),
          now()
        );
      END IF;
      
      success := true;
    EXCEPTION WHEN unique_violation THEN
      -- Profile was created by another transaction
      success := true;
    WHEN OTHERS THEN
      -- For other errors, retry if we haven't exceeded max retries
      IF current_retry >= max_retries - 1 THEN
        RAISE;
      END IF;
      current_retry := current_retry + 1;
      -- Small delay before retry
      PERFORM pg_sleep(0.1);
    END;
  END LOOP;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_profile_for_user(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION create_profile_for_user(uuid) IS 
'Creates a user profile if it does not exist, with retry logic and proper error handling';