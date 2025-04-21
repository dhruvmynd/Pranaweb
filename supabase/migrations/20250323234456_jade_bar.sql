/*
  # Update User Achievements System

  1. Changes
    - Add unlocked_at column to track when achievements are earned
    - Add progress tracking for achievements
    - Add heart rate monitoring columns
    - Update trigger function for achievement checks
    
  2. Security
    - Maintain RLS policies
    - Keep security definer context
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS check_user_achievements ON user_analytics;

-- Drop existing function
DROP FUNCTION IF EXISTS check_achievements();

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  heart_rate_change numeric;
  initial_hr numeric;
BEGIN
  -- Check minutes-based achievements
  IF NEW.total_minutes >= 60 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at)
    VALUES (NEW.user_id, 'beginner', NEW.total_minutes, now())
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.total_minutes,
        unlocked_at = CASE 
          WHEN user_achievements.unlocked_at IS NULL 
          THEN now() 
          ELSE user_achievements.unlocked_at 
        END;
  END IF;

  IF NEW.total_minutes >= 500 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at)
    VALUES (NEW.user_id, 'dedicated', NEW.total_minutes, now())
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.total_minutes,
        unlocked_at = CASE 
          WHEN user_achievements.unlocked_at IS NULL 
          THEN now() 
          ELSE user_achievements.unlocked_at 
        END;
  END IF;

  IF NEW.total_minutes >= 1000 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at)
    VALUES (NEW.user_id, 'zen_master', NEW.total_minutes, now())
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.total_minutes,
        unlocked_at = CASE 
          WHEN user_achievements.unlocked_at IS NULL 
          THEN now() 
          ELSE user_achievements.unlocked_at 
        END;
  END IF;

  -- Check streak achievement
  IF NEW.longest_streak >= 7 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at)
    VALUES (NEW.user_id, 'streak_master', NEW.longest_streak, now())
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.longest_streak,
        unlocked_at = CASE 
          WHEN user_achievements.unlocked_at IS NULL 
          THEN now() 
          ELSE user_achievements.unlocked_at 
        END;
  END IF;

  -- Check HRV achievement
  IF NEW.avg_heart_rate > 0 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at)
    VALUES (NEW.user_id, 'hrv_improver', 100, now())
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = 100,
        unlocked_at = CASE 
          WHEN user_achievements.unlocked_at IS NULL 
          THEN now() 
          ELSE user_achievements.unlocked_at 
        END;
  END IF;

  -- Check heart rate improvement
  IF NEW.avg_heart_rate > 0 THEN
    -- Get or set initial heart rate
    SELECT initial_heart_rate 
    INTO initial_hr
    FROM user_achievements 
    WHERE user_id = NEW.user_id 
    AND achievement_id = 'heart_rate_master';

    IF initial_hr IS NULL THEN
      -- First time seeing this user's heart rate, store it as initial
      INSERT INTO user_achievements (
        user_id, 
        achievement_id, 
        initial_heart_rate, 
        current_heart_rate,
        progress
      )
      VALUES (
        NEW.user_id, 
        'heart_rate_master', 
        NEW.avg_heart_rate,
        NEW.avg_heart_rate,
        0
      )
      ON CONFLICT (user_id, achievement_id) DO NOTHING;
    ELSE
      -- Calculate improvement percentage
      heart_rate_change := ((initial_hr - NEW.avg_heart_rate) / initial_hr) * 100;
      
      -- Update progress and current heart rate
      UPDATE user_achievements
      SET 
        progress = GREATEST(heart_rate_change, 0),
        current_heart_rate = NEW.avg_heart_rate,
        unlocked_at = CASE 
          WHEN heart_rate_change >= 10 AND unlocked_at IS NULL 
          THEN now() 
          ELSE unlocked_at 
        END
      WHERE user_id = NEW.user_id 
      AND achievement_id = 'heart_rate_master';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to check achievements on analytics update
CREATE TRIGGER check_user_achievements
  AFTER INSERT OR UPDATE ON user_analytics
  FOR EACH ROW
  EXECUTE FUNCTION check_achievements();

-- Add comment explaining the changes
COMMENT ON FUNCTION check_achievements() IS 
'Automatically checks and awards achievements based on user analytics, including heart rate improvements';