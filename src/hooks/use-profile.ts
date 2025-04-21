import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useProfileContext } from '@/contexts/profile-context';
import { getProfile } from '@/lib/profile';

export function useProfile() {
  const { user } = useAuth();
  const { profile, loading, updateProfileData } = useProfileContext();

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!user) return;

      try {
        const data = await getProfile(user.id);
        if (mounted && data) {
          updateProfileData(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user, updateProfileData]);

  return { profile, loading, updateProfileData };
}