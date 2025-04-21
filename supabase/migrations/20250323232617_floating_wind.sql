/*
  # Add Heart Rate Achievement Support

  1. Changes
    - Add heart rate tracking to achievements system
    - Update achievement check function to monitor heart rate improvements
    
  2. Security
    - Maintains existing RLS policies
    - Secure function execution
*/

-- Add heart rate tracking columns to user achievements
ALTER TABLE user_achievements
ADD COLUMN IF NOT EXISTS initial_heart_rate numeric(10,2),
ADD COLUMN IF NOT EXISTS current_heart_rate numeric(10,2);

-- Update achievement check function to include heart rate monitoring
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
    INSERT INTO user_achievements (user_id, achievement_id, progress)
    VALUES (NEW.user_id, 'beginner', NEW.total_minutes)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.total_minutes;
  END IF;

  IF NEW.total_minutes >= 500 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress)
    VALUES (NEW.user_id, 'dedicated', NEW.total_minutes)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.total_minutes;
  END IF;

  IF NEW.total_minutes >= 1000 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress)
    VALUES (NEW.user_id, 'zen_master', NEW.total_minutes)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.total_minutes;
  END IF;

  -- Check streak achievement
  IF NEW.longest_streak >= 7 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress)
    VALUES (NEW.user_id, 'streak_master', NEW.longest_streak)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.longest_streak;
  END IF;

  -- Check HRV achievement
  IF NEW.avg_heart_rate > 0 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress)
    VALUES (NEW.user_id, 'hrv_improver', 100)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
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

-- Add comment explaining the changes
COMMENT ON FUNCTION check_achievements() IS 
'Automatically checks and awards achievements based on user analytics, including heart rate improvements';