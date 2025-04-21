/*
  # Fix HRV Calculation in User Analytics
  
  1. Changes
    - Fix the HRV calculation in the calculate_user_analytics function
    - Ensure proper weighted average calculation for HRV values
    - Update existing user analytics with correct HRV data
    
  2. Benefits
    - Correctly displays non-zero HRV values for users with HRV data
    - Properly aggregates HRV data from both practice sessions and iOS app sessions
    - Ensures accurate HRV metrics in the dashboard
*/

-- Update the calculate_user_analytics function to fix HRV calculation
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
  
  -- HRV data from practice sessions
  practice_hrv numeric;
  practice_hrv_count integer;
  
  -- HRV data from iOS app sessions
  ios_hrv numeric;
  ios_hrv_count integer;
  
  -- Combined HRV data
  total_hrv numeric;
  total_hrv_count integer;
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
  
  -- Calculate HRV from practice sessions - FIXED to handle NULL values properly
  SELECT 
    AVG(hrv) as avg_hrv,
    COUNT(*) as hrv_count
  INTO practice_hrv, practice_hrv_count
  FROM practice_sessions
  WHERE user_id = user_id_param AND hrv IS NOT NULL AND hrv > 0;
  
  -- Calculate HRV from iOS app sessions - FIXED to handle NULL values properly
  SELECT 
    AVG(hrv) as avg_hrv,
    COUNT(*) as hrv_count
  INTO ios_hrv, ios_hrv_count
  FROM ios_app_sessions
  WHERE user_id = user_id_param AND hrv IS NOT NULL AND hrv > 0;
  
  -- Calculate combined weighted average HRV - FIXED calculation
  total_hrv_count := COALESCE(practice_hrv_count, 0) + COALESCE(ios_hrv_count, 0);
  
  IF total_hrv_count > 0 THEN
    total_hrv := (
      (COALESCE(practice_hrv, 0) * COALESCE(practice_hrv_count, 0)) + 
      (COALESCE(ios_hrv, 0) * COALESCE(ios_hrv_count, 0))
    ) / total_hrv_count;
  ELSE
    total_hrv := 0;
  END IF;

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
    avg_hrv,
    sessions_with_hrv,
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
    COALESCE(total_hrv, 0),
    COALESCE(total_hrv_count, 0),
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
    avg_hrv = EXCLUDED.avg_hrv,
    sessions_with_hrv = EXCLUDED.sessions_with_hrv,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- Force update of all user analytics to recalculate HRV values
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT user_id 
    FROM (
      SELECT user_id FROM practice_sessions
      UNION
      SELECT user_id FROM ios_app_sessions
    ) AS users
  LOOP
    PERFORM calculate_user_analytics(user_record.user_id);
  END LOOP;
END $$;

-- Add comment explaining the changes
COMMENT ON FUNCTION calculate_user_analytics(uuid) IS 
'Calculates and updates analytics for a specific user with fixed HRV calculation';