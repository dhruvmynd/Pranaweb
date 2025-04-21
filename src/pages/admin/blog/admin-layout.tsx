import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export function AdminLayout() {
  const { user, isAdmin, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return;

    if (!user || !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, initialized, navigate]);

  if (!initialized || !user || !isAdmin) {
    return (
      <div className="min-h-screen flow-bg pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            {!initialized ? 'Loading...' : 'You need admin access to view this page.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flow-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}