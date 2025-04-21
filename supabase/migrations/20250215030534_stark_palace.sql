-- Create function to confirm demo account email
CREATE OR REPLACE FUNCTION confirm_demo_email(user_id uuid, email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
BEGIN
  -- Only allow confirmation for demo@ycombinator.com
  IF email != 'demo@ycombinator.com' THEN
    RAISE EXCEPTION 'This function can only be used for the demo account';
  END IF;

  -- Update email_confirmed_at for the demo user
  UPDATE auth.users
  SET email_confirmed_at = now(),
      updated_at = now()
  WHERE id = user_id
  AND email = 'demo@ycombinator.com'
  AND email_confirmed_at IS NULL;

  -- If no rows were updated, the user wasn't found or already confirmed
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found or email already confirmed';
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION confirm_demo_email(uuid, text) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION confirm_demo_email(uuid, text) IS 
'Confirms email for demo account (demo@ycombinator.com) only. This is a special function for testing purposes.';