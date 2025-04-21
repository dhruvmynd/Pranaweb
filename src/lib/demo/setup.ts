import { supabase } from '../supabase';

// Demo account credentials
const DEMO_EMAIL = 'demo@ycombinator.com';
const DEMO_PASSWORD = 'demo123';

// Sample practice sessions data
const practiceSessions = [
  {
    technique: 'Anulom Vilom',
    duration: 600, // 10 minutes
    average_heart_rate: 68,
    completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // yesterday
  },
  {
    technique: 'Bhastrika',
    duration: 900, // 15 minutes
    average_heart_rate: 72,
    completed_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
  },
  {
    technique: 'Kapalbhati',
    duration: 1200, // 20 minutes
    average_heart_rate: 75,
    completed_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() // 3 days ago
  }
];

// Sample moods
const moods = [
  { mood: 'focused', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { mood: 'still', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { mood: 'wavering', created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() }
];

export async function createDemoAccount() {
  try {
    // First clear any existing session
    await supabase.auth.signOut();

    // Step 1: Create the account with direct signup
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/v1/ca`,
        data: {
          email_confirmed: true // Bypass email confirmation
        }
      }
    });

    if (signUpError) {
      throw new Error(signUpError.message);
    }

    if (!authData?.user?.id) {
      throw new Error('Failed to create user account');
    }

    const userId = authData.user.id;

    // Step 2: Directly confirm the email using admin API
    const { error: confirmError } = await supabase.rpc('confirm_demo_email', {
      user_id: userId,
      email: DEMO_EMAIL
    });

    if (confirmError) {
      throw new Error(`Failed to confirm email: ${confirmError.message}`);
    }

    // Step 3: Create profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        user_id: userId,
        first_name: 'Demo',
        last_name: 'User',
        avatar_url: '/defaultpic.webp',
        notification_time: '09:00'
      }]);

    if (profileError) {
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    // Step 4: Add practice sessions
    const { error: sessionsError } = await supabase
      .from('practice_sessions')
      .insert(practiceSessions.map(session => ({
        user_id: userId,
        ...session
      })));

    if (sessionsError) {
      throw new Error(`Failed to create practice sessions: ${sessionsError.message}`);
    }

    // Step 5: Add moods
    const { error: moodsError } = await supabase
      .from('moods')
      .insert(moods.map(mood => ({
        user_id: userId,
        ...mood
      })));

    if (moodsError) {
      throw new Error(`Failed to create moods: ${moodsError.message}`);
    }

    // Step 6: Initialize streak
    const { error: streakError } = await supabase
      .from('user_streaks')
      .insert([{
        user_id: userId,
        current_streak: 3,
        longest_streak: 5,
        last_practice_date: new Date().toISOString()
      }]);

    if (streakError) {
      throw new Error(`Failed to create streak: ${streakError.message}`);
    }

    // Wait for all data to be properly saved
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Demo account created successfully',
      userId
    };

  } catch (error) {
    // Ensure we always return a proper error message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
}