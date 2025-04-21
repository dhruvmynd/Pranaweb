-- Enable RLS on user_profiles if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to delete their own profiles
CREATE POLICY "Users can delete their own profiles"
ON user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add comment explaining the policy
COMMENT ON POLICY "Users can delete their own profiles" ON user_profiles IS 
'Allow users to delete their own profile data';