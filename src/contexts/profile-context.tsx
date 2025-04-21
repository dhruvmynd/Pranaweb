import { createContext, useContext, useState, useCallback } from 'react';
import type { Profile } from '@/lib/types/profile';

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  updateProfileData: (newProfile: Profile) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const updateProfileData = useCallback((newProfile: Profile) => {
    setProfile(newProfile);
    setLoading(false);
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setLoading(true);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfileData, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within ProfileProvider');
  }
  return context;
}