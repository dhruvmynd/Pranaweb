import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getSession, refreshSession } from '@/lib/auth/session';
import { useLoading } from '@/contexts/loading-context';
import type { AuthContextType } from '@/lib/auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'hello@dhruvaryan.com';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [initialized, setInitialized] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { showLoadingSpinner } = useLoading();
  const navigate = useNavigate();

  function checkAdminStatus(email: string | undefined) {
    setIsAdmin(email === ADMIN_EMAIL);
  }

  useEffect(() => {
    let mounted = true;
    let sessionCheckTimeout: NodeJS.Timeout;
    let sessionCheckInterval: NodeJS.Timeout;
    
    // Handle recovery flow
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      console.log('Recovery flow detected');
      // Get the full hash without the leading #
      const fullToken = hash.substring(1);
      sessionStorage.setItem('recovery_token', fullToken);
      window.location.hash = '';
      navigate('/auth/reset-password');
      return;
    }

    async function initSession() {
      if (sessionChecking) return;
      setSessionChecking(true);
      
      try {
        // Handle access token in hash (OAuth flow)
        if (hash && hash.includes('access_token=')) {
          console.log('OAuth flow detected with access token in hash');
          try {
            // Extract the access token
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            
            if (accessToken) {
              // Set the session with the tokens
              const { data: { session }, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || ''
              });
              
              if (error) throw error;
              
              if (session) {
                setUser(session.user);
                checkAdminStatus(session.user?.email);
                localStorage.setItem('sb-auth-token', session.access_token);
                setInitialized(true);
                showLoadingSpinner(false);
                return; // Early return if OAuth flow is handled
              }
            }
          } catch (hashError) {
            console.warn('Hash processing error:', hashError);
            // Continue with normal session initialization
          }
        }

        // Check local storage for existing session
        const existingSession = localStorage.getItem('sb-auth-token');
        if (existingSession) {
          if (mounted) showLoadingSpinner(true);
        }

        const session = await getSession();
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        if (mounted) {
          setUser(currentUser);
          checkAdminStatus(currentUser?.email);
          setInitialized(true);
          showLoadingSpinner(false);
        }

        // Set up periodic session check
        sessionCheckTimeout = setInterval(async () => {
          try {
            if (!mounted) return;
            const refreshedSession = await refreshSession();
            if (mounted) {
              setUser(refreshedSession?.user ?? null);
              checkAdminStatus(refreshedSession?.user?.email);
            }
          } catch (error) {
            console.warn('Session refresh warning:', error);
            if (mounted) {
              setUser(null);
              setIsAdmin(false);
            }
          }
        }, 60000); // Check every minute
      } catch (error) {
        console.warn('Session initialization warning:', error);
        if (mounted) {
          setUser(null);
          await clearLocalSession();
          setIsAdmin(false);
          setInitialized(true);
          showLoadingSpinner(false);
        }
      }
      if (mounted) setSessionChecking(false);
    }

    initSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state change:', event);
      
      switch (event) {
        case 'SIGNED_OUT':
          setUser(null);
          setIsAdmin(false);
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed');
          try {
            const refreshedSession = await refreshSession();
            const refreshedUser = refreshedSession?.user ?? null;
            setUser(refreshedUser);
            checkAdminStatus(refreshedUser?.email);
          } catch (error) {
            console.warn('Token refresh error:', error);
          }
          break;
        case 'SIGNED_IN':
          console.log('Signed in');
          // Add a small delay to allow the session to be properly established
          try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const newUser = session?.user ?? null;
            setUser(newUser);
            checkAdminStatus(newUser?.email);
            if (session?.access_token) {
              localStorage.setItem('sb-auth-token', session.access_token);
            }
          } catch (error) {
            console.warn('Sign in processing error:', error);
          }
          break;
      }
    });

    // Listen for logout events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_logout_event' && mounted) {
        setUser(null);
        setIsAdmin(false);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (sessionCheckTimeout) {
        clearInterval(sessionCheckTimeout);
      }
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [showLoadingSpinner, navigate]);

  if (!initialized) {
    return null;
  }
  return (
    <AuthContext.Provider value={{ user, loading: false, initialized, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}