-- Add HRV data to practice sessions
UPDATE practice_sessions
SET hrv = CASE 
  WHEN average_heart_rate BETWEEN 65 AND 75 THEN floor(random() * (90 - 65 + 1) + 65)
  WHEN average_heart_rate > 75 THEN floor(random() * (75 - 55 + 1) + 55)
  ELSE floor(random() * (100 - 80 + 1) + 80)
END
WHERE user_id = 'c7f4752c-1955-4b80-ae92-268e946047df'
AND hrv IS NULL;

-- Add HRV data to iOS app sessions
UPDATE ios_app_sessions
SET hrv = CASE 
  WHEN heart_rate_avg BETWEEN 65 AND 75 THEN floor(random() * (90 - 65 + 1) + 65)
  WHEN heart_rate_avg > 75 THEN floor(random() * (75 - 55 + 1) + 55)
  ELSE floor(random() * (100 - 80 + 1) + 80)
END
WHERE user_id = 'c7f4752c-1955-4b80-ae92-268e946047df'
AND hrv IS NULL;

-- Add comment explaining the seeded data
COMMENT ON TABLE practice_sessions IS 
'Practice session records with HRV data seeded on 2025-02-24. HRV values are inversely correlated with heart rate.';

COMMENT ON TABLE ios_app_sessions IS 
'iOS app session records with HRV data seeded on 2025-02-24. HRV values are inversely correlated with heart rate.';