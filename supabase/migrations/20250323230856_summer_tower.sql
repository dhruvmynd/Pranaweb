/*
  # Add User Achievements System

  1. New Tables
    - `user_achievements`
      - Tracks unlocked achievements for each user
      - Stores unlock date and progress
      - Links to user analytics for requirements

  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create user achievements table
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  progress numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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

  -- Check HRV achievement (simplified version)
  IF NEW.avg_heart_rate > 0 THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress)
    VALUES (NEW.user_id, 'hrv_improver', 100)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to check achievements on analytics update
CREATE TRIGGER check_user_achievements
  AFTER INSERT OR UPDATE ON user_analytics
  FOR EACH ROW
  EXECUTE FUNCTION check_achievements();

-- Add indexes for better performance
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Add comments
COMMENT ON TABLE user_achievements IS 'Stores user achievement progress and unlock status';
COMMENT ON FUNCTION check_achievements() IS 'Automatically checks and awards achievements based on user analytics';