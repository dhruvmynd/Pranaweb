import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { ProfileMenu } from '@/components/profile/profile-menu';
import { signOut } from '@/lib/auth';

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClasses = (path: string) => `
    relative text-muted-foreground hover:text-foreground transition-colors
    after:absolute after:left-0 after:right-0 after:bottom-[-4px] 
    after:h-[2px] after:bg-primary after:origin-left
    after:transition-transform after:duration-300
    ${isActive(path) 
      ? 'text-foreground after:scale-x-100' 
      : 'after:scale-x-0 hover:after:scale-x-100'
    }
  `;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/x.png" alt="Prana" className="h-8 w-auto" />
            <span className="text-xl font-bold text-foreground">Prana</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
          
          <div className="hidden sm:flex items-center space-x-8">
            <Link to="/vision" className={navLinkClasses('/vision')}>
              Vision
            </Link>
            <Link to="/app" className={`${navLinkClasses('/app')} px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800`}>
              Vayu
            </Link>
            <Link to="/leadership" className={navLinkClasses('/leadership')}>
              Leadership
            </Link>
            <Link to="/pranayama" className={navLinkClasses('/pranayama')}>
              Breathwork
            </Link>
            <Link to="/vidhya" className={navLinkClasses('/vidhya')}>
              Knowledge
            </Link>
            <Link to="/faq" className={navLinkClasses('/faq')}>
              FAQ
            </Link>
            <Link to="/contact" className={navLinkClasses('/contact')}>
              Contact
            </Link>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            {user ? (
              <ProfileMenu />
            ) : (
              <>
                <Button variant="outline" size="sm" as={Link} to="/login">
                  Log in
                </Button>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white" 
                  size="sm" 
                  as={Link} 
                  to="/register"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {user && (
                <div className="pb-4 mb-4 border-b">
                  <div className="flex items-center space-x-3 px-2">
                    {user.email && (
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Link 
                to="/vision" 
                className={navLinkClasses('/vision')}
                onClick={() => setIsMenuOpen(false)}
              >
                Vision
              </Link>
              <Link 
                to="/app" 
                className={`${navLinkClasses('/app')} px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800`}
                onClick={() => setIsMenuOpen(false)}
              >
                Vayu
              </Link>
              <Link 
                to="/leadership" 
                className={navLinkClasses('/leadership')}
                onClick={() => setIsMenuOpen(false)}
              >
                Leadership
              </Link>
              <Link 
                to="/pranayama" 
                className={navLinkClasses('/pranayama')}
                onClick={() => setIsMenuOpen(false)}
              >
                Breathwork
              </Link>
              <Link 
                to="/vidhya" 
                className={navLinkClasses('/vidhya')}
                onClick={() => setIsMenuOpen(false)}
              >
                Knowledge
              </Link>
              <Link 
                to="/faq" 
                className={navLinkClasses('/faq')}
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                to="/contact" 
                className={navLinkClasses('/contact')}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {user ? (
                <div className="pt-4 border-t space-y-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors w-full"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    as={Link} 
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white" 
                    size="sm" 
                    as={Link} 
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
