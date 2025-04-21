/*
  # Create curated_sessions view

  1. Changes
    - Create a view that aggregates curated session data
    - Only include non-zero heart rates in average calculations
    - Group sessions by type, name and user
  
  2. Benefits
    - More accurate heart rate averages
    - Consistent data aggregation
    - Better query performance
*/

-- First drop the view if it exists
DROP VIEW IF EXISTS curated_sessions;

-- Create the view
CREATE VIEW curated_sessions AS
SELECT 
  user_id,
  session_type,
  session_name,
  COUNT(*) as sessions_count,
  AVG(duration) as avg_duration,
  AVG(CASE WHEN heart_rate_avg > 0 THEN heart_rate_avg END) as avg_heart_rate
FROM ios_app_sessions
WHERE session_type = 'curated'
GROUP BY user_id, session_type, session_name;

-- Add comment explaining the view
COMMENT ON VIEW curated_sessions IS 
'Aggregated view of curated sessions with proper heart rate averaging (excluding zero values)';

-- Grant access to authenticated users
GRANT SELECT ON curated_sessions TO authenticated;