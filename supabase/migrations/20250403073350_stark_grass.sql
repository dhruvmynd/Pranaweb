/*
  # Add Recent Heart Rate and HRV Data

  1. Purpose
    - Add recent heart rate and HRV measurements
    - Show progression in cardiovascular health
    - Demonstrate HRV improvements over time
    
  2. Data
    - Practice sessions with detailed HR/HRV data
    - iOS app sessions with comprehensive biometrics
    - Data shows gradual improvement pattern
*/

-- Add recent practice sessions with HR/HRV data
INSERT INTO practice_sessions (
  user_id,
  technique,
  duration,
  average_heart_rate,
  hrv,
  completed_at
)
SELECT
  'c7f4752c-1955-4b80-ae92-268e946047df',
  technique,
  duration,
  heart_rate,
  hrv,
  completed_at
FROM (
  VALUES
    -- Most recent sessions showing improvement
    ('Anulom Vilom', 2400, 65, 92, NOW() - INTERVAL '2 hours'),
    ('Bhastrika', 1800, 68, 88, NOW() - INTERVAL '8 hours'),
    ('Kapalbhati', 2100, 70, 85, NOW() - INTERVAL '14 hours'),
    -- Yesterday's sessions
    ('Anulom Vilom', 2700, 67, 89, NOW() - INTERVAL '1 day 2 hours'),
    ('Bhastrika', 2400, 69, 86, NOW() - INTERVAL '1 day 8 hours'),
    -- Two days ago
    ('Kapalbhati', 1800, 71, 82, NOW() - INTERVAL '2 days 3 hours'),
    ('Anulom Vilom', 2100, 70, 84, NOW() - INTERVAL '2 days 9 hours')
) AS v(technique, duration, heart_rate, hrv, completed_at);

-- Add recent iOS app sessions with detailed biometrics
INSERT INTO ios_app_sessions (
  user_id,
  session_type,
  session_name,
  duration,
  heart_rate_avg,
  heart_rate_start,
  heart_rate_end,
  hrv,
  completed_at
)
SELECT
  'c7f4752c-1955-4b80-ae92-268e946047df',
  session_type::session_type,
  session_name,
  duration,
  heart_rate_avg,
  heart_rate_start,
  heart_rate_end,
  hrv,
  completed_at
FROM (
  VALUES
    -- Today's sessions
    ('curated', 'Morning Bliss', 1800, 64, 68, 62, 94, NOW() - INTERVAL '3 hours'),
    ('curated', 'Daytime Focus', 2400, 67, 70, 65, 90, NOW() - INTERVAL '6 hours'),
    -- Yesterday's sessions
    ('curated', 'Evening Calm', 2100, 65, 69, 63, 92, NOW() - INTERVAL '1 day 2 hours'),
    ('curated', 'Morning Bliss', 1800, 66, 70, 64, 89, NOW() - INTERVAL '1 day 8 hours'),
    -- Two days ago
    ('curated', 'Daytime Focus', 2400, 68, 71, 66, 87, NOW() - INTERVAL '2 days 4 hours')
) AS v(session_type, session_name, duration, heart_rate_avg, heart_rate_start, heart_rate_end, hrv, completed_at);

-- Update analytics to trigger achievement checks
UPDATE user_analytics
SET updated_at = now()
WHERE user_id = 'c7f4752c-1955-4b80-ae92-268e946047df';

-- Add comment explaining the data
COMMENT ON TABLE practice_sessions IS 
'Practice session records with recent HR/HRV data showing cardiovascular improvements.';