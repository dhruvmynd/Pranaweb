import { supabase } from './supabase';
import type { Profile } from './types/profile';

export async function createProfile(userId: string): Promise<Profile> {
  try {
    // Call RPC function to create profile with proper security context
    const { data: profile, error: rpcError } = await supabase.rpc(
      'create_profile_for_user',
      { input_user_id: userId }
    );

    if (rpcError) {
      throw rpcError;
    }

    if (!profile) {
      throw new Error('Failed to create profile');
    }

    return profile;
  } catch (error) {
    console.error('Error in createProfile:', error);
    throw error;
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching profile:', error);
      return null;
    }

    if (!data) {
      // Try to create profile if it doesn't exist
      try {
        return await createProfile(userId);
      } catch (createError) {
        console.error('Error creating profile:', createError);
        return null;
      }
    }

    return data;
  } catch (error) {
    console.error('Error in getProfile:', error);
    return null;
  }
}

export async function updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update profile error:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No profile returned after update');
    }

    return data;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
}

export async function deleteUserData(userId: string): Promise<void> {
  try {
    // Delete all user data in order of dependencies
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    if (profileError) {
      console.warn('Error deleting profile:', profileError);
    }
  } catch (error) {
    console.error('Error in deleteUserData:', error);
    throw error;
  }
}