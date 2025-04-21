-- Create function to delete user and all their data
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  auth_user_id uuid;
BEGIN
  -- Get auth user ID
  SELECT id INTO auth_user_id
  FROM auth.users
  WHERE id = user_id;

  IF auth_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Delete from auth.users (this will trigger cascading deletes)
  DELETE FROM auth.users WHERE id = auth_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION delete_user(uuid) IS 'Securely deletes a user and all their associated data';