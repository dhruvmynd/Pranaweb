/*
  # Add Practice Data with Enum Handling
  
  1. Changes
    - Add practice sessions with proper session_type enum casting
    - Add iOS app sessions with proper enum handling
    - Update analytics to trigger achievements
    
  2. Notes
    - Cast text values to session_type enum
    - Use proper type handling for all columns
*/

-- Add more practice sessions
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
    ('Bhastrika', 2400, 72, 75, NOW() - INTERVAL '1 day 4 hours'),
    ('Kapalbhati', 1500, 74, 70, NOW() - INTERVAL '2 days'),
    ('Anulom Vilom', 3000, 67, 88, NOW() - INTERVAL '2 days 6 hours'),
    ('Bhastrika', 2700, 71, 78, NOW() - INTERVAL '3 days'),
    ('Kapalbhati', 1800, 73, 72, NOW() - INTERVAL '3 days 5 hours'),
    ('Anulom Vilom', 2100, 69, 82, NOW() - INTERVAL '4 days'),
    ('Bhastrika', 2400, 70, 80, NOW() - INTERVAL '4 days 3 hours'),
    ('Kapalbhati', 1500, 72, 75, NOW() - INTERVAL '5 days'),
    ('Anulom Vilom', 2700, 68, 87, NOW() - INTERVAL '5 days 4 hours'),
    ('Bhastrika', 3000, 71, 79, NOW() - INTERVAL '6 days'),
    ('Kapalbhati', 1800, 73, 74, NOW() - INTERVAL '6 days 6 hours'),
    ('Anulom Vilom', 2400, 67, 86, NOW() - INTERVAL '7 days'),
    ('Bhastrika', 2700, 70, 81, NOW() - INTERVAL '7 days 5 hours'),
    ('Kapalbhati', 1500, 72, 76, NOW() - INTERVAL '8 days')
) AS v(technique, duration, heart_rate, hrv, completed_at);

-- Add iOS app sessions with proper enum casting
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
    ('curated'::session_type, 'Morning Bliss', 1800, 68, 70, 66, 85, NOW() - INTERVAL '1 day'),
    ('curated'::session_type, 'Evening Calm', 2400, 65, 68, 62, 90, NOW() - INTERVAL '2 days'),
    ('curated'::session_type, 'Daytime Focus', 1500, 72, 70, 74, 75, NOW() - INTERVAL '3 days'),
    ('curated'::session_type, 'Morning Bliss', 2100, 67, 69, 65, 88, NOW() - INTERVAL '4 days'),
    ('curated'::session_type, 'Evening Calm', 1800, 64, 67, 61, 92, NOW() - INTERVAL '5 days'),
    ('curated'::session_type, 'Daytime Focus', 2400, 71, 69, 73, 78, NOW() - INTERVAL '6 days'),
    ('curated'::session_type, 'Morning Bliss', 1500, 68, 70, 66, 86, NOW() - INTERVAL '7 days'),
    ('curated'::session_type, 'Evening Calm', 2700, 65, 68, 62, 89, NOW() - INTERVAL '8 days'),
    ('curated'::session_type, 'Daytime Focus', 1800, 72, 70, 74, 76, NOW() - INTERVAL '9 days'),
    ('curated'::session_type, 'Morning Bliss', 2400, 67, 69, 65, 87, NOW() - INTERVAL '10 days')
) AS v(session_type, session_name, duration, heart_rate_avg, heart_rate_start, heart_rate_end, hrv, completed_at);

-- Update analytics to trigger achievement checks
UPDATE user_analytics
SET updated_at = now()
WHERE user_id = 'c7f4752c-1955-4b80-ae92-268e946047df';

-- Add comment explaining the seeded data
COMMENT ON TABLE practice_sessions IS 
'Practice session records with additional data seeded on 2025-03-24 to demonstrate achievements.';