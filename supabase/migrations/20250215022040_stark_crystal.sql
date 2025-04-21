-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_analytics_practice ON practice_sessions;
DROP TRIGGER IF EXISTS update_analytics_moods ON moods;
DROP TRIGGER IF EXISTS update_analytics_streaks ON user_streaks;

-- Modify the update_user_analytics function to handle null user_id
CREATE OR REPLACE FUNCTION update_user_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_val uuid;
BEGIN
  -- Get the user_id based on the table being updated
  CASE TG_TABLE_NAME
    WHEN 'practice_sessions' THEN
      user_id_val := NEW.user_id;
    WHEN 'moods' THEN
      user_id_val := NEW.user_id;
    WHEN 'user_streaks' THEN
      user_id_val := NEW.user_id;
  END CASE;

  -- Only proceed if we have a valid user_id
  IF user_id_val IS NOT NULL THEN
    PERFORM calculate_user_analytics(user_id_val);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate triggers with proper conditions
CREATE TRIGGER update_analytics_practice
  AFTER INSERT OR UPDATE ON practice_sessions
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION update_user_analytics();

CREATE TRIGGER update_analytics_moods
  AFTER INSERT OR UPDATE ON moods
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION update_user_analytics();

CREATE TRIGGER update_analytics_streaks
  AFTER INSERT OR UPDATE ON user_streaks
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION update_user_analytics();

-- Modify the delete_user function to handle analytics properly
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Delete user analytics first
  DELETE FROM user_analytics WHERE user_id = user_id;
  
  -- Delete from auth.users (this will trigger cascading deletes)
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Add comment explaining the changes
COMMENT ON FUNCTION update_user_analytics() IS 
'Trigger function to update user analytics, with null user_id protection';