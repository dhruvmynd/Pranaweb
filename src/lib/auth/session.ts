import { supabase } from '../supabase';
import { SUPABASE_KEY_PREFIX } from './constants';

export async function clearLocalSession() {
  try {
    // Get current session before clearing
    const { data: { session } } = await supabase.auth.getSession();
    
    // Clear session from Supabase
    await supabase.auth.signOut();

    // Clear all browser storage
    localStorage.clear();
    sessionStorage.clear();

    // If we had a session, invalidate it on the server
    if (session?.access_token) {
      try {
        await supabase.rpc('cleanup_user_session', {
          target_uid: session.user.id
        });
      } catch (cleanupError) {
        console.warn('Session cleanup warning:', cleanupError);
      }
    }

    // Broadcast session change to other tabs
    window.localStorage.setItem('auth_logout_event', Date.now().toString());
  } catch (error) {
    console.warn('Clear session warning:', error);
  }
}

export async function getSession() {
  try {
    // First check if we have a valid session in storage
    const storedSession = localStorage.getItem('sb-auth-token');
    
    if (!storedSession) {
      return null;
    }

    // Verify the session with Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (session?.access_token) {
      localStorage.setItem('sb-auth-token', session.access_token);
      return session;
    }

    // If no valid session, clear storage
    if (!session) {
      await clearLocalSession();
    }

    return null;
  } catch (error) {
    console.warn('Get session warning:', error);
    await clearLocalSession();
    return null;
  }
}

export async function refreshSession() {
  try {
    // Check if we should attempt refresh
    const lastRefresh = localStorage.getItem('last_session_refresh');
    const now = Date.now();
    
    if (lastRefresh && now - parseInt(lastRefresh) < 10000) { // 10 second cooldown
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }

    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;

    if (session?.access_token) {
      localStorage.setItem('sb-auth-token', session.access_token);
      localStorage.setItem('last_session_refresh', now.toString());
    }

    return session;
  } catch (error) {
    console.warn('Refresh session warning:', error);
    await clearLocalSession();
    return null;
  }
}

export async function handleAuthCallback() {
  try {
    // First try to get the session
    console.log('Handling auth callback');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth callback error:', error);
      throw error;
    }

    // If no session, try to exchange the code
    if (!session) {
      console.log('No session found, attempting to exchange code');
      const url = window.location.href;
      console.log('Current URL:', url);
      
      const { data: { session: newSession }, error: exchangeError } = 
        await supabase.auth.exchangeCodeForSession(url);
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        throw exchangeError;
      }

      if (newSession?.access_token) {
        console.log('New session obtained');
        localStorage.setItem('sb-auth-token', newSession.access_token);
      }

      return newSession;
    }

    console.log('Existing session found');
    return session;
  } catch (error) {
    console.warn('Auth callback warning:', error);
    throw error;
  }
}