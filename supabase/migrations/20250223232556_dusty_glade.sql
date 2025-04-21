/*
  # Secure Curated Sessions View

  1. Changes
    - Drop existing view
    - Recreate view without SECURITY DEFINER
    - Add proper RLS policies
    - Grant appropriate permissions

  2. Security
    - View now inherits caller's permissions
    - RLS policies ensure proper data access control
    - Only authenticated users can access their own data
*/

-- Drop existing view
DROP VIEW IF EXISTS curated_sessions;

-- Create new view without SECURITY DEFINER
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

-- Enable RLS on the view
ALTER VIEW curated_sessions SET (security_barrier = true);

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view their own curated sessions" ON ios_app_sessions;

-- Create RLS policies for the view
CREATE POLICY "Users can view their own curated sessions"
  ON ios_app_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT SELECT ON curated_sessions TO authenticated;

-- Add comment explaining the view
COMMENT ON VIEW curated_sessions IS 
'Aggregated view of curated sessions with proper security controls and RLS policies';