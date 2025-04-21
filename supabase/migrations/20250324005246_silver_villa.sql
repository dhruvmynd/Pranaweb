/*
  # Add Getting Started Achievement
  
  1. Changes
    - Create trigger to award getting started achievement on profile creation
    - Award achievement to existing users
    
  2. Security
    - Maintains existing RLS policies
*/

-- Create function to award getting started achievement
CREATE OR REPLACE FUNCTION award_getting_started_achievement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Award getting started achievement immediately
  INSERT INTO user_achievements (
    user_id,
    achievement_id,
    progress,
    unlocked_at
  )
  VALUES (
    NEW.user_id,
    'getting_started',
    100,
    now()
  )
  ON CONFLICT (user_id, achievement_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create trigger for new profiles
DROP TRIGGER IF EXISTS on_profile_created ON user_profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION award_getting_started_achievement();

-- Add comment explaining the function
COMMENT ON FUNCTION award_getting_started_achievement() IS 
'Awards the getting started achievement when a new user profile is created';

-- Award getting started achievement to existing users
INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at)
SELECT 
  user_id,
  'getting_started',
  100,
  created_at
FROM user_profiles
ON CONFLICT (user_id, achievement_id) DO NOTHING;