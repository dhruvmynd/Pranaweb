-- Insert curated sessions data
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
  -- Morning Clarity sessions
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Morning Clarity',
    1200,
    68,
    70,
    66,
    NOW() - INTERVAL '1 day'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Morning Clarity',
    1200,
    67,
    69,
    65,
    NOW() - INTERVAL '2 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Morning Clarity',
    1200,
    69,
    71,
    67,
    NOW() - INTERVAL '3 days'
  ),
  -- Deep Relaxation sessions
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Deep Relaxation',
    1800,
    65,
    68,
    62,
    NOW() - INTERVAL '4 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Deep Relaxation',
    1800,
    64,
    67,
    61,
    NOW() - INTERVAL '5 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Deep Relaxation',
    1800,
    66,
    69,
    63,
    NOW() - INTERVAL '6 days'
  ),
  -- Energy Boost sessions
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Energy Boost',
    900,
    75,
    72,
    78,
    NOW() - INTERVAL '7 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Energy Boost',
    900,
    76,
    73,
    79,
    NOW() - INTERVAL '8 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Energy Boost',
    900,
    74,
    71,
    77,
    NOW() - INTERVAL '9 days'
  ),
  -- Focus Flow sessions
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Focus Flow',
    2100,
    72,
    70,
    74,
    NOW() - INTERVAL '10 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Focus Flow',
    2100,
    71,
    69,
    73,
    NOW() - INTERVAL '11 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Focus Flow',
    2100,
    73,
    71,
    75,
    NOW() - INTERVAL '12 days'
  ),
  -- Stress Relief sessions
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Stress Relief',
    1500,
    70,
    73,
    67,
    NOW() - INTERVAL '13 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Stress Relief',
    1500,
    69,
    72,
    66,
    NOW() - INTERVAL '14 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Stress Relief',
    1500,
    71,
    74,
    68,
    NOW() - INTERVAL '15 days'
  ),
  -- Sleep Preparation sessions
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Sleep Preparation',
    1200,
    63,
    66,
    60,
    NOW() - INTERVAL '16 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Sleep Preparation',
    1200,
    62,
    65,
    59,
    NOW() - INTERVAL '17 days'
  ),
  (
    'c7f4752c-1955-4b80-ae92-268e946047df',
    'curated',
    'Sleep Preparation',
    1200,
    64,
    67,
    61,
    NOW() - INTERVAL '18 days'
  );