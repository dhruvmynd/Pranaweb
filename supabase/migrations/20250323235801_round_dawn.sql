/*
  # Add More Practice Data
  
  1. Changes
    - Add more practice sessions to reach 1000+ minutes
    - Add corresponding iOS app sessions
    - Update analytics to trigger achievements
    
  2. Notes
    - Adds enough sessions to unlock all time-based achievements
    - Maintains realistic heart rate and HRV patterns
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
    -- Week 1 (high intensity)
    ('Bhastrika', 3600, 75, 70, NOW() - INTERVAL '1 day'),
    ('Kapalbhati', 2700, 73, 72, NOW() - INTERVAL '2 days'),
    ('Anulom Vilom', 3000, 70, 80, NOW() - INTERVAL '3 days'),
    ('Bhastrika', 3300, 74, 71, NOW() - INTERVAL '4 days'),
    ('Kapalbhati', 2400, 72, 73, NOW() - INTERVAL '5 days'),
    -- Week 2 (medium intensity)
    ('Anulom Vilom', 3600, 68, 85, NOW() - INTERVAL '8 days'),
    ('Bhastrika', 3000, 71, 75, NOW() - INTERVAL '9 days'),
    ('Kapalbhati', 2700, 70, 78, NOW() - INTERVAL '10 days'),
    ('Anulom Vilom', 3300, 67, 87, NOW() - INTERVAL '11 days'),
    ('Bhastrika', 2400, 69, 82, NOW() - INTERVAL '12 days'),
    -- Week 3 (longer sessions)
    ('Kapalbhati', 4200, 71, 76, NOW() - INTERVAL '15 days'),
    ('Anulom Vilom', 3900, 66, 89, NOW() - INTERVAL '16 days'),
    ('Bhastrika', 3600, 68, 84, NOW() - INTERVAL '17 days'),
    ('Kapalbhati', 3300, 70, 79, NOW() - INTERVAL '18 days'),
    ('Anulom Vilom', 3000, 65, 90, NOW() - INTERVAL '19 days')
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
    -- Week 1
    ('curated'::session_type, 'Morning Bliss', 3600, 68, 70, 66, 85, NOW() - INTERVAL '1 day'),
    ('curated'::session_type, 'Evening Calm', 3000, 65, 68, 62, 90, NOW() - INTERVAL '2 days'),
    ('curated'::session_type, 'Daytime Focus', 2700, 72, 74, 70, 75, NOW() - INTERVAL '3 days'),
    -- Week 2
    ('curated'::session_type, 'Morning Bliss', 3300, 67, 69, 65, 88, NOW() - INTERVAL '8 days'),
    ('curated'::session_type, 'Evening Calm', 3600, 64, 67, 61, 92, NOW() - INTERVAL '9 days'),
    ('curated'::session_type, 'Daytime Focus', 3000, 71, 73, 69, 78, NOW() - INTERVAL '10 days'),
    -- Week 3
    ('curated'::session_type, 'Morning Bliss', 4200, 66, 68, 64, 89, NOW() - INTERVAL '15 days'),
    ('curated'::session_type, 'Evening Calm', 3900, 63, 66, 60, 93, NOW() - INTERVAL '16 days'),
    ('curated'::session_type, 'Daytime Focus', 3600, 70, 72, 68, 80, NOW() - INTERVAL '17 days')
) AS v(session_type, session_name, duration, heart_rate_avg, heart_rate_start, heart_rate_end, hrv, completed_at);

-- Update analytics to trigger achievement checks
UPDATE user_analytics
SET updated_at = now()
WHERE user_id = 'c7f4752c-1955-4b80-ae92-268e946047df';

-- Add comment explaining the seeded data
COMMENT ON TABLE practice_sessions IS 
'Practice session records with additional data seeded on 2025-03-24 to demonstrate achievements.';