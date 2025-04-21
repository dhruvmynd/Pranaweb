/*
  # Add HRV column to practice sessions tables

  1. Changes
    - Add hrv column to practice_sessions table
    - Add hrv column to ios_app_sessions table
    
  2. Notes
    - HRV values are stored as numeric with 2 decimal places
    - Default value is null since not all sessions will have HRV data
*/

-- Add HRV column to practice_sessions
ALTER TABLE practice_sessions
ADD COLUMN hrv numeric(10,2);

-- Add HRV column to ios_app_sessions
ALTER TABLE ios_app_sessions
ADD COLUMN hrv numeric(10,2);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_practice_sessions_hrv 
ON practice_sessions(hrv);

CREATE INDEX IF NOT EXISTS idx_ios_app_sessions_hrv 
ON ios_app_sessions(hrv);

-- Add comments explaining the columns
COMMENT ON COLUMN practice_sessions.hrv IS 
'Heart Rate Variability during the practice session in milliseconds';

COMMENT ON COLUMN ios_app_sessions.hrv IS 
'Heart Rate Variability during the session in milliseconds';