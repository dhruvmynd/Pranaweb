/*
  # Add Apple OAuth Configuration

  1. Changes
    - Add Apple OAuth configuration to app_settings table
    - Record Apple OAuth client ID and team ID
    
  2. Security
    - Uses SECURITY DEFINER function to ensure proper access control
*/

-- Create a function to configure Apple OAuth
CREATE OR REPLACE FUNCTION configure_apple_oauth()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add Apple OAuth configuration to app_settings
  INSERT INTO app_settings (key, value, description)
  VALUES (
    'apple_oauth_enabled', 
    'true', 
    'Apple OAuth is enabled with client ID: com.prana-vayu.web.signin,com.vayuprana.app and team ID: 9MZKWHVB56'
  )
  ON CONFLICT (key) 
  DO UPDATE SET 
    value = 'true',
    description = 'Apple OAuth is enabled with client ID: com.prana-vayu.web.signin,com.vayuprana.app and team ID: 9MZKWHVB56',
    updated_at = now();
END;
$$;

-- Execute the function
SELECT configure_apple_oauth();

-- Drop the function as it's only needed once
DROP FUNCTION configure_apple_oauth();

-- Add comment explaining what was done
COMMENT ON TABLE app_settings IS 'Stores application-wide settings including OAuth configuration';