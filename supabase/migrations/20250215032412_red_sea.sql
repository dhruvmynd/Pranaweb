-- Update existing sessions with new names
UPDATE ios_app_sessions
SET session_name = 
  CASE session_name
    WHEN 'Morning Clarity' THEN 'Morning Bliss'
    WHEN 'Deep Relaxation' THEN 'Evening Calm'
    WHEN 'Energy Boost' THEN 'Morning Bliss'
    WHEN 'Focus Flow' THEN 'Daytime Focus'
    WHEN 'Stress Relief' THEN 'Evening Calm'
    WHEN 'Sleep Preparation' THEN 'Nighttime Relax'
  END
WHERE session_type = 'curated';

-- Delete old sessions to avoid duplicates
DELETE FROM ios_app_sessions 
WHERE session_type = 'curated';

-- Insert fresh data with new session names
INSERT INTO ios_app_sessions (
  user_id,
  session_type,
  session_name,
  duration,
  heart_rate_avg,
  heart_rate_start,
  heart_rate_end,
  completed_at
)
VALUES
  -- Morning Bliss sessions
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Morning Bliss',
    1200,
    68,
    70,
    66,
    NOW() - INTERVAL '1 day'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Morning Bliss',
    1200,
    67,
    69,
    65,
    NOW() - INTERVAL '2 days'
  ),
  -- Daytime Focus sessions
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Daytime Focus',
    2100,
    72,
    70,
    74,
    NOW() - INTERVAL '4 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Daytime Focus',
    2100,
    71,
    69,
    73,
    NOW() - INTERVAL '5 days'
  ),
  -- Evening Calm sessions
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Evening Calm',
    1800,
    65,
    68,
    62,
    NOW() - INTERVAL '7 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Evening Calm',
    1800,
    64,
    67,
    61,
    NOW() - INTERVAL '8 days'
  ),
  -- Nighttime Relax sessions
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Nighttime Relax',
    1200,
    63,
    66,
    60,
    NOW() - INTERVAL '10 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Nighttime Relax',
    1200,
    62,
    65,
    59,
    NOW() - INTERVAL '11 days'
  );