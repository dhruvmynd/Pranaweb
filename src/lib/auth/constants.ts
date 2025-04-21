// src/lib/auth/constants.ts
export const AUTH_CONFIG = {
  REDIRECT_PATH: '/auth/v1/callback',
  SITE_URL: window.location.origin,
  GOOGLE_CONFIG: {
    client_id: '155665520591-kon4bb7tlf9or2du0rtm3hd1qo6dbv42.apps.googleusercontent.com',
    client_secret: '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'
  },
  APPLE_CONFIG: {
    client_id: 'com.prana-vayu.web.signin,com.vayuprana.app',
    team_id: '9MZKWHVB56',
    key_id: 'NCFXW6DPM4',
    scope: 'email name',
    redirect_uri: `${window.location.origin}/auth/callback`
  }
} as const;

// Local storage keys
export const SUPABASE_KEY_PREFIX = 'sb-';