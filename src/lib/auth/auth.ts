import { supabase } from '../supabase';
import { createProfile } from '../profile';

export async function signUp(email: string, password: string) {
  try {
    // Clear any existing session first
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) console.warn('Sign out warning:', signOutError);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/v1/callback`
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    // Create profile with default avatar
    try {
      await createProfile(data.user.id);
    } catch (profileError) {
      console.error('Profile creation error:', profileError);
      // Continue with signup even if profile creation fails
    }

    return {
      success: true,
      message: 'Please check your email for verification link'
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data?.session) throw new Error('No session returned');

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/';
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
}

export async function deleteUser() {
  try {
    const { error } = await supabase.auth.admin.deleteUser(
      (await supabase.auth.getUser()).data.user?.id || ''
    );
    
    if (error) throw error;

    // Clear session and storage
    await signOut();
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}