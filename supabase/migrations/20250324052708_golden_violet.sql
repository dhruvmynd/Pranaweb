/*
  # Add Badge Unlocked Column to User Achievements

  1. Changes
    - Add badge_unlocked column to user_achievements table
    - Set default value to false
    - Update existing records to have badge_unlocked true if unlocked_at is not null
    - Add index for better query performance
  
  2. Security
    - Maintains existing RLS policies
*/

-- Add badge_unlocked column
ALTER TABLE user_achievements
ADD COLUMN badge_unlocked boolean DEFAULT false;

-- Update existing records - set badge_unlocked to true for achievements that are already unlocked
UPDATE user_achievements
SET badge_unlocked = true
WHERE unlocked_at IS NOT NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_badge_unlocked 
ON user_achievements(badge_unlocked);

-- Update the award_getting_started_achievement function
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
    unlocked_at,
    badge_unlocked
  )
  VALUES (
    NEW.user_id,
    'getting_started',
    100,
    now(),
    true
  )
  ON CONFLICT (user_id, achievement_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Update the check_achievements function
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
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at, badge_unlocked)
    VALUES (NEW.user_id, 'beginner', NEW.total_minutes, now(), true)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.total_minutes,
        unlocked_at = CASE 
          WHEN user_achievements.unlocked_at IS NULL 
          THEN now() 
          ELSE user_achievements.unlocked_at 
        END,
        badge_unlocked = true;
  END IF;

  IF NEW.total_minutes >= 500 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at, badge_unlocked)
    VALUES (NEW.user_id, 'dedicated', NEW.total_minutes, now(), true)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.total_minutes,
        unlocked_at = CASE 
          WHEN user_achievements.unlocked_at IS NULL 
          THEN now() 
          ELSE user_achievements.unlocked_at 
        END,
        badge_unlocked = true;
  END IF;

  IF NEW.total_minutes >= 1000 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at, badge_unlocked)
    VALUES (NEW.user_id, 'zen_master', NEW.total_minutes, now(), true)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.total_minutes,
        unlocked_at = CASE 
          WHEN user_achievements.unlocked_at IS NULL 
          THEN now() 
          ELSE user_achievements.unlocked_at 
        END,
        badge_unlocked = true;
  END IF;

  -- Check streak achievement
  IF NEW.longest_streak >= 7 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at, badge_unlocked)
    VALUES (NEW.user_id, 'streak_master', NEW.longest_streak, now(), true)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = NEW.longest_streak,
        unlocked_at = CASE 
          WHEN user_achievements.unlocked_at IS NULL 
          THEN now() 
          ELSE user_achievements.unlocked_at 
        END,
        badge_unlocked = true;
  END IF;

  -- Check HRV achievement
  IF NEW.avg_heart_rate > 0 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at, badge_unlocked)
    VALUES (NEW.user_id, 'hrv_improver', 100, now(), true)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET progress = 100,
        unlocked_at = CASE 
          WHEN user_achievements.unlocked_at IS NULL 
          THEN now() 
          ELSE user_achievements.unlocked_at 
        END,
        badge_unlocked = true;
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
        progress,
        badge_unlocked
      )
      VALUES (
        NEW.user_id, 
        'heart_rate_master', 
        NEW.avg_heart_rate,
        NEW.avg_heart_rate,
        0,
        false
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
        END,
        badge_unlocked = CASE
          WHEN heart_rate_change >= 10
          THEN true
          ELSE badge_unlocked
        END
      WHERE user_id = NEW.user_id 
      AND achievement_id = 'heart_rate_master';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Add comment explaining the changes
COMMENT ON COLUMN user_achievements.badge_unlocked IS 
'Indicates whether the achievement badge has been unlocked and can be displayed';