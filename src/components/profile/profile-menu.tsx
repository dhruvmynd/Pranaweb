import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiLayout, FiShield } from 'react-icons/fi';
import { useAuth } from '@/contexts/auth-context';
import { signOut } from '@/lib/auth';
import { useProfile } from '@/hooks/use-profile';

export function ProfileMenu() {
  const { user, isAdmin } = useAuth();
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <img
            src="/default.png"
            alt="Default Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <FiLayout className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin/blog"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FiShield className="mr-2 h-4 w-4" />
                Admin
              </Link>
            )}

            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <FiSettings className="mr-2 h-4 w-4" />
              Profile Settings
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                handleSignOut();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
