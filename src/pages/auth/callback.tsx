import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { handleAuthCallback } from '@/lib/auth/session';
import { useLoading } from '@/contexts/loading-context';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoadingSpinner } = useLoading();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Clear any existing sessions first to avoid conflicts
        localStorage.removeItem('sb-auth-token');
        
        showLoadingSpinner(true);
        console.log('Auth callback page started');

        // Check for hash parameters (OAuth or recovery flow)
        const hash = window.location.hash;
        if (hash && hash.includes('type=recovery')) {
          // Get the full hash without the leading #
          const fullToken = hash.substring(1);
          sessionStorage.setItem('recovery_token', fullToken);
          window.location.hash = '';
          navigate('/auth/reset-password');
          return;
        }

        // First try to handle with our helper function
        // Handle OAuth callback with hash
        if (hash && (hash.includes('access_token') || hash.includes('error'))) {
          console.log('Processing OAuth callback with hash');
          try {
            // Exchange the code for a session
            const { data, error } = await supabase.auth.getSession();

            console.log('Session data:', data ? 'exists' : 'null');
            if (error) throw error;
            
            if (data.session) {
              localStorage.setItem('sb-auth-token', data.session.access_token);
              // Broadcast login to other tabs
              localStorage.setItem('auth_login_event', Date.now().toString());
              navigate('/dashboard', { replace: true });
              return;
            }
          } catch (hashError) {
            console.error('Hash processing error:', hashError);
            // Continue to try other methods
          }
        }

        // Try using the handleAuthCallback helper
        try {
          console.log('Attempting to use handleAuthCallback');
          const session = await handleAuthCallback();
          
          if (session) {
            localStorage.setItem('sb-auth-token', session.access_token);
            // Broadcast login to other tabs
            localStorage.setItem('auth_login_event', Date.now().toString());
            navigate('/dashboard', { replace: true });
            return;
          }
        } catch (callbackError) {
          console.error('Auth callback helper error:', callbackError);
        }
        // Try to get the session directly (for email login or if hash processing failed)
        try {
          console.log('Attempting to get session directly');
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          console.log('Session retrieved:', session ? 'exists' : 'null');
          if (session) {
            // Clear any existing tokens first
            localStorage.removeItem('sb-auth-token');
            localStorage.setItem('sb-auth-token', session.access_token);
            // Broadcast login to other tabs
            localStorage.setItem('auth_login_event', Date.now().toString());
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/login', {
              replace: true,
              state: { error: 'Authentication failed. Please try again.' }
            });
          }
        } catch (sessionError) {
          console.error('Session retrieval error:', sessionError);
          throw sessionError;
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
        navigate('/login', {
          replace: true,
          state: { error: 'Authentication failed. Please try again.' }
        });
      } finally {
        showLoadingSpinner(false);
      }
    };

    handleCallback();
  }, [navigate, location, showLoadingSpinner]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Completing Sign In</h2>
        <p className="text-gray-600">Please wait while we verify your credentials...</p>
      </div>
    </div>
  );
}