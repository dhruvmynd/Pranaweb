// Re-export everything from auth modules
export * from './auth-service';
export * from './types';
export * from './session';
export * from './constants';

// Export auth callback handler
export async function handleAuthCallback() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (session?.access_token) {
      localStorage.setItem('sb-auth-token', session.access_token);
    }
    
    return { session, error: null };
  } catch (error) {
    console.error('Auth callback error:', error);
    return { session: null, error };
  }
}

// Export auth context hook for convenience
export { useAuth } from '@/contexts/auth-context';