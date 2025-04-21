-- Seed data for info@vayu-prana.com (UID: c7f4752c-1955-4b80-ae92-268e946047df)

-- Create or update profile
INSERT INTO user_profiles (user_id, first_name, last_name, avatar_url, notification_time)
VALUES (
  'c7f4752c-1955-4b80-ae92-268e946047df',
  'Vayu',
  'Admin',
  '/defaultpic.webp',
  '09:00:00'
)
ON CONFLICT (user_id) 
DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  avatar_url = EXCLUDED.avatar_url,
  notification_time = EXCLUDED.notification_time;

-- Add practice sessions
INSERT INTO practice_sessions (user_id, technique, duration, average_heart_rate, completed_at)
VALUES
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Anulom Vilom',
    600, -- 10 minutes
    68,
    NOW() - INTERVAL '1 day'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Bhastrika',
    900, -- 15 minutes
    72,
    NOW() - INTERVAL '2 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Kapalbhati',
    1200, -- 20 minutes
    75,
    NOW() - INTERVAL '3 days'
  );

-- Add mood entries
INSERT INTO moods (user_id, mood, created_at)
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
  );

-- Add streak data
INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_practice_date)
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