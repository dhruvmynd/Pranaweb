import { useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { PenSquare, Bot, BarChart, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const { user, isAdmin, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flow-bg pt-24">
      <div className="flex h-[calc(100vh-6rem)]">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 p-4 bg-white/50 backdrop-blur-sm border-r">
          <nav className="space-y-2">
            <Link
              to="/admin/analytics"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-gray-700 hover:bg-primary/5 transition-colors",
                currentPath === '/admin/analytics' && "bg-primary/10 text-primary"
              )}
            >
              <BarChart className="h-5 w-5" />
              Analytics
            </Link>
            <Link
              to="/admin/google-analytics"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-gray-700 hover:bg-primary/5 transition-colors",
                currentPath === '/admin/google-analytics' && "bg-primary/10 text-primary"
              )}
            >
              <LineChart className="h-5 w-5" />
              Google Analytics
            </Link>
            <Link
              to="/admin/blog"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-gray-700 hover:bg-primary/5 transition-colors",
                currentPath.startsWith('/admin/blog') && "bg-primary/10 text-primary"
              )}
            >
              <PenSquare className="h-5 w-5" />
              Blog Posts
            </Link>
            <Link
              to="/admin/ai"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-gray-700 hover:bg-primary/5 transition-colors",
                currentPath === '/admin/ai' && "bg-primary/10 text-primary"
              )}
            >
              <Bot className="h-5 w-5" />
              AI Chat
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {currentPath === '/admin/ai' ? (
            <div className="h-full">
              <iframe
                src="https://flowise-i7wm.onrender.com"
                className="w-full h-full border-0"
                title="AI Chat Interface"
                allow="microphone"
              />
            </div>
          ) : (
            <div className="p-6">
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}