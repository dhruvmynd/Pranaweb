-- Create function to safely delete a user and their data
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete user's auth data
  DELETE FROM auth.users WHERE id = user_id;
  
  -- Note: Other user data (profiles, sessions, etc.) will be deleted 
  -- via foreign key cascades and the deleteUserData function
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user(uuid) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION delete_user(uuid) IS 'Securely deletes a user and their associated data';