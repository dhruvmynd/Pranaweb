/*
  # Create User Analytics System
  
  1. Tables
    - Creates user_analytics table with RLS
    - Stores consolidated analytics data
    
  2. Functions
    - Creates functions to calculate and update analytics
    - Implements efficient refresh mechanism
    
  3. Triggers
    - Adds triggers to keep analytics in sync
    - Updates on practice sessions, moods, and streaks changes
*/

-- Create user analytics table
CREATE TABLE user_analytics (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_sessions integer DEFAULT 0,
  total_minutes numeric(10,2) DEFAULT 0,
  avg_session_duration numeric(10,2) DEFAULT 0,
  avg_heart_rate numeric(10,2) DEFAULT 0,
  sessions_with_heart_rate integer DEFAULT 0,
  unique_techniques_used integer DEFAULT 0,
  last_practice_date timestamptz,
  total_moods integer DEFAULT 0,
  unique_moods integer DEFAULT 0,
  most_common_mood text,
  last_mood_date timestamptz,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  technique_stats jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own analytics"
  ON user_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin has full access to user analytics"
  ON user_analytics
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');

-- Create function to calculate user analytics
CREATE OR REPLACE FUNCTION calculate_user_analytics(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  practice_data record;
  mood_data record;
  streak_data record;
  technique_stats jsonb;
BEGIN
  -- Calculate practice statistics
  SELECT 
    COUNT(*) as total_sessions,
    COALESCE(SUM(duration) / 60.0, 0) as total_minutes,
    COALESCE(AVG(duration) / 60.0, 0) as avg_session_duration,
    COALESCE(AVG(CASE WHEN average_heart_rate > 0 THEN average_heart_rate END), 0) as avg_heart_rate,
    COUNT(CASE WHEN average_heart_rate > 0 THEN 1 END) as sessions_with_heart_rate,
    COUNT(DISTINCT technique) as unique_techniques_used,
    MAX(completed_at) as last_practice_date
  INTO practice_data
  FROM practice_sessions
  WHERE user_id = user_id_param;

  -- Calculate mood statistics
  SELECT 
    COUNT(*) as total_moods,
    COUNT(DISTINCT mood) as unique_moods,
    MODE() WITHIN GROUP (ORDER BY mood) as most_common_mood,
    MAX(created_at) as last_mood_date
  INTO mood_data
  FROM moods
  WHERE user_id = user_id_param;

  -- Get streak data
  SELECT 
    current_streak,
    longest_streak
  INTO streak_data
  FROM user_streaks
  WHERE user_id = user_id_param;

  -- Calculate technique breakdown
  SELECT jsonb_agg(technique_data)
  INTO technique_stats
  FROM (
    SELECT 
      jsonb_build_object(
        'technique', technique,
        'count', COUNT(*),
        'avg_duration', COALESCE(AVG(duration) / 60.0, 0),
        'avg_heart_rate', COALESCE(AVG(CASE WHEN average_heart_rate > 0 THEN average_heart_rate END), 0)
      ) as technique_data
    FROM practice_sessions
    WHERE user_id = user_id_param
    GROUP BY technique
  ) t;

  -- Insert or update analytics
  INSERT INTO user_analytics (
    user_id,
    total_sessions,
    total_minutes,
    avg_session_duration,
    avg_heart_rate,
    sessions_with_heart_rate,
    unique_techniques_used,
    last_practice_date,
    total_moods,
    unique_moods,
    most_common_mood,
    last_mood_date,
    current_streak,
    longest_streak,
    technique_stats,
    updated_at
  )
  VALUES (
    user_id_param,
    COALESCE(practice_data.total_sessions, 0),
    COALESCE(practice_data.total_minutes, 0),
    COALESCE(practice_data.avg_session_duration, 0),
    COALESCE(practice_data.avg_heart_rate, 0),
    COALESCE(practice_data.sessions_with_heart_rate, 0),
    COALESCE(practice_data.unique_techniques_used, 0),
    practice_data.last_practice_date,
    COALESCE(mood_data.total_moods, 0),
    COALESCE(mood_data.unique_moods, 0),
    mood_data.most_common_mood,
    mood_data.last_mood_date,
    COALESCE(streak_data.current_streak, 0),
    COALESCE(streak_data.longest_streak, 0),
    COALESCE(technique_stats, '[]'::jsonb),
    now()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_sessions = EXCLUDED.total_sessions,
    total_minutes = EXCLUDED.total_minutes,
    avg_session_duration = EXCLUDED.avg_session_duration,
    avg_heart_rate = EXCLUDED.avg_heart_rate,
    sessions_with_heart_rate = EXCLUDED.sessions_with_heart_rate,
    unique_techniques_used = EXCLUDED.unique_techniques_used,
    last_practice_date = EXCLUDED.last_practice_date,
    total_moods = EXCLUDED.total_moods,
    unique_moods = EXCLUDED.unique_moods,
    most_common_mood = EXCLUDED.most_common_mood,
    last_mood_date = EXCLUDED.last_mood_date,
    current_streak = EXCLUDED.current_streak,
    longest_streak = EXCLUDED.longest_streak,
    technique_stats = EXCLUDED.technique_stats,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- Create trigger function to update analytics
CREATE OR REPLACE FUNCTION update_user_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Get the user_id based on the table being updated
  CASE TG_TABLE_NAME
    WHEN 'practice_sessions' THEN
      PERFORM calculate_user_analytics(NEW.user_id);
    WHEN 'moods' THEN
      PERFORM calculate_user_analytics(NEW.user_id);
    WHEN 'user_streaks' THEN
      PERFORM calculate_user_analytics(NEW.user_id);
  END CASE;
  
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER update_analytics_practice
  AFTER INSERT OR UPDATE OR DELETE ON practice_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_analytics();

CREATE TRIGGER update_analytics_moods
  AFTER INSERT OR UPDATE OR DELETE ON moods
  FOR EACH ROW
  EXECUTE FUNCTION update_user_analytics();

CREATE TRIGGER update_analytics_streaks
  AFTER INSERT OR UPDATE OR DELETE ON user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_user_analytics();

-- Create indexes
CREATE INDEX idx_user_analytics_updated_at ON user_analytics(updated_at);

-- Add comments
COMMENT ON TABLE user_analytics IS 
'Consolidated analytics data for users including practice sessions, moods, and streaks';

COMMENT ON FUNCTION calculate_user_analytics(uuid) IS 
'Calculates and updates analytics for a specific user';

COMMENT ON FUNCTION update_user_analytics() IS 
'Trigger function to automatically update user analytics when related data changes';