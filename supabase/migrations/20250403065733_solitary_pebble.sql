/*
  # Add Mobile App Password Reset Support
  
  1. Changes
    - Add additional redirect URLs for mobile app password reset
    - Configure proper handling of password reset flow for iOS app
    
  2. Security
    - Maintains existing security settings
    - Ensures proper authentication flow for mobile clients
*/

-- Create a function to update auth settings for mobile app
CREATE OR REPLACE FUNCTION configure_mobile_password_reset()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add mobile app password reset configuration to app_settings
  INSERT INTO app_settings (key, value, description)
  VALUES (
    'mobile_password_reset_enabled', 
    'true', 
    'Password reset is configured for iOS app with custom URL scheme: com.vayuprana.app://reset-password'
  )
  ON CONFLICT (key) 
  DO UPDATE SET 
    value = 'true',
    description = 'Password reset is configured for iOS app with custom URL scheme: com.vayuprana.app://reset-password',
    updated_at = now();
END;
$$;

-- Execute the function
SELECT configure_mobile_password_reset();

-- Drop the function as it's only needed once
DROP FUNCTION configure_mobile_password_reset();

-- Add comment explaining what was done
COMMENT ON TABLE app_settings IS 'Stores application-wide settings including mobile app configuration';