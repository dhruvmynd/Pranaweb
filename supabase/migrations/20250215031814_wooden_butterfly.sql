-- Add more practice sessions over the past month
INSERT INTO practice_sessions (user_id, technique, duration, average_heart_rate, completed_at)
VALUES
  -- Last week
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Anulom Vilom',
    1200, -- 20 minutes
    71,
    NOW() - INTERVAL '4 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Bhastrika',
    900, -- 15 minutes
    74,
    NOW() - INTERVAL '5 days'
  ),
  -- Two weeks ago
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Kapalbhati',
    1500, -- 25 minutes
    76,
    NOW() - INTERVAL '8 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Anulom Vilom',
    1800, -- 30 minutes
    69,
    NOW() - INTERVAL '9 days'
  ),
  -- Three weeks ago
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Bhastrika',
    1200, -- 20 minutes
    73,
    NOW() - INTERVAL '15 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Kapalbhati',
    1800, -- 30 minutes
    75,
    NOW() - INTERVAL '16 days'
  ),
  -- Four weeks ago
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Anulom Vilom',
    1500, -- 25 minutes
    70,
    NOW() - INTERVAL '22 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'Bhastrika',
    2100, -- 35 minutes
    72,
    NOW() - INTERVAL '23 days'
  );

-- Add more mood entries
INSERT INTO moods (user_id, mood, created_at)
VALUES
  -- Last week
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'still',
    NOW() - INTERVAL '4 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'focused',
    NOW() - INTERVAL '5 days'
  ),
  -- Two weeks ago
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'still',
    NOW() - INTERVAL '8 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'focused',
    NOW() - INTERVAL '9 days'
  ),
  -- Three weeks ago
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'wavering',
    NOW() - INTERVAL '15 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'still',
    NOW() - INTERVAL '16 days'
  ),
  -- Four weeks ago
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'focused',
    NOW() - INTERVAL '22 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'still',
    NOW() - INTERVAL '23 days'
  );