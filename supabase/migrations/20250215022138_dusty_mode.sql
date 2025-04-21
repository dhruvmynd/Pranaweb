-- First drop the existing function
DROP FUNCTION IF EXISTS delete_user(uuid);

-- Create the function with the new parameter name
CREATE FUNCTION delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Delete user analytics first
  DELETE FROM user_analytics WHERE user_id = target_user_id;
  
  -- Delete from auth.users (this will trigger cascading deletes)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- Add comment explaining the function
COMMENT ON FUNCTION delete_user(uuid) IS 
'Securely deletes a user and their associated data, including analytics';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user(uuid) TO authenticated;