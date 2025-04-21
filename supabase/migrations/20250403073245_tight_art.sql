/*
  # Seed Data for info@vayu-prana.com User

  1. Purpose
    - Add practice sessions, moods, and other data for info@vayu-prana.com
    - Demonstrate app functionality with realistic data
    
  2. Data
    - Practice sessions with heart rate and HRV data
    - Mood entries over time
    - iOS app sessions
    - User streak data
*/

-- Add practice sessions
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
    ('Anulom Vilom', 1800, 68, 85, NOW() - INTERVAL '1 day'),
    ('Bhastrika', 2400, 72, 75, NOW() - INTERVAL '2 days'),
    ('Kapalbhati', 1500, 74, 70, NOW() - INTERVAL '3 days'),
    ('Anulom Vilom', 3000, 67, 88, NOW() - INTERVAL '4 days'),
    ('Bhastrika', 2700, 71, 78, NOW() - INTERVAL '5 days'),
    ('Kapalbhati', 1800, 73, 72, NOW() - INTERVAL '6 days'),
    ('Anulom Vilom', 2100, 69, 82, NOW() - INTERVAL '7 days')
) AS v(technique, duration, heart_rate, hrv, completed_at);

-- Add iOS app sessions
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
    ('curated', 'Morning Bliss', 1800, 68, 70, 66, 85, NOW() - INTERVAL '1 day'),
    ('curated', 'Evening Calm', 2400, 65, 68, 62, 90, NOW() - INTERVAL '2 days'),
    ('curated', 'Daytime Focus', 1500, 72, 70, 74, 75, NOW() - INTERVAL '3 days'),
    ('curated', 'Morning Bliss', 2100, 67, 69, 65, 88, NOW() - INTERVAL '4 days'),
    ('curated', 'Evening Calm', 1800, 64, 67, 61, 92, NOW() - INTERVAL '5 days')
) AS v(session_type, session_name, duration, heart_rate_avg, heart_rate_start, heart_rate_end, hrv, completed_at);

-- Add mood entries
INSERT INTO moods (
  user_id,
  mood,
  created_at
)
VALUES
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'focused',
    NOW() - INTERVAL '1 day'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'still',
    NOW() - INTERVAL '2 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'wavering',
    NOW() - INTERVAL '3 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'focused',
    NOW() - INTERVAL '4 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'still',
    NOW() - INTERVAL '5 days'
  );

-- Add or update streak data
INSERT INTO user_streaks (
  user_id,
  current_streak,
  longest_streak,
  last_practice_date
)
VALUES (
  'c7f4752c-1955-4b80-ae92-268e946047df',
  5,
  7,
  NOW()
)
ON CONFLICT (user_id)
DO UPDATE SET
  current_streak = EXCLUDED.current_streak,
  longest_streak = EXCLUDED.longest_streak,
  last_practice_date = EXCLUDED.last_practice_date;

-- Update analytics to trigger achievement checks
UPDATE user_analytics
SET updated_at = now()
WHERE user_id = 'c7f4752c-1955-4b80-ae92-268e946047df';

-- Add comment explaining the seeded data
COMMENT ON TABLE practice_sessions IS 
'Practice session records with additional data seeded for info@vayu-prana.com user.';