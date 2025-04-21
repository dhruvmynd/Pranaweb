import { supabase } from '../supabase';

// Get the current origin for redirects
const origin = window.location.origin;

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
}

export async function signInWithApple() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          response_type: 'code id_token',
          response_mode: 'fragment'
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Apple auth error:', error);
    throw error;
  }
}

export async function signInWithFacebook() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Facebook auth error:', error);
    throw error;
  }
}