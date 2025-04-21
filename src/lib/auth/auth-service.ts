import { supabase } from '../supabase';
import { clearLocalSession } from './session';
import { createProfile } from '../profile';
import { deleteUserData } from '../profile';

export async function signOut() {
  try {
    // Get current user before signing out
    let userId = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch (userError) {
      console.warn('User retrieval warning:', userError);
    }
    
    // Clear local session first
    await clearLocalSession();
    
    if (userId) {
      try {
        // Call cleanup function with renamed parameter
        await supabase.rpc('cleanup_user_session', {
          target_uid: userId
        });
      } catch (cleanupError) {
        // Log but don't throw - we still want to complete sign out
        console.warn('Session cleanup warning:', cleanupError);
      }
    }

    // Force a page reload to clear any remaining state
    setTimeout(() => window.location.href = '/', 100);
  } catch (error) {
    console.warn('Sign out warning:', error);
    // Still redirect even if there's an error
    window.location.href = '/';
  }
}

export async function signIn(email: string, password: string) {
  try {
    // First clear any existing session
    await clearLocalSession();

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;

    if (!data?.session) {
      throw new Error('No session returned from authentication');
    }

    // Store session token
    localStorage.setItem('sb-auth-token', data.session.access_token);

    // Wait for session to be established
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { data, error: null };
  } catch (error) {
    // Clear session on error
    await clearLocalSession();
    throw error;
  }
}

// Re-export other auth functions
export { signUp, updatePassword, deleteUser } from './auth';