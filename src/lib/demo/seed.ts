import { supabase } from '../supabase';

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

export async function seedUserData(userId: string) {
  try {
    // Step 1: Create or update profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert([{
        user_id: userId,
        first_name: 'Vayu',
        last_name: 'Admin',
        avatar_url: '/defaultpic.webp',
        notification_time: '09:00'
      }]);

    if (profileError) {
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    // Step 2: Add practice sessions
    const { error: sessionsError } = await supabase
      .from('practice_sessions')
      .insert(practiceSessions.map(session => ({
        user_id: userId,
        ...session
      })));

    if (sessionsError) {
      throw new Error(`Failed to create practice sessions: ${sessionsError.message}`);
    }

    // Step 3: Add moods
    const { error: moodsError } = await supabase
      .from('moods')
      .insert(moods.map(mood => ({
        user_id: userId,
        ...mood
      })));

    if (moodsError) {
      throw new Error(`Failed to create moods: ${moodsError.message}`);
    }

    // Step 4: Initialize streak
    const { error: streakError } = await supabase
      .from('user_streaks')
      .insert([{
        user_id: userId,
        current_streak: 5,
        longest_streak: 7,
        last_practice_date: new Date().toISOString()
      }]);

    if (streakError) {
      throw new Error(`Failed to create streak: ${streakError.message}`);
    }

    // Wait for all data to be properly saved
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Account data seeded successfully'
    };

  } catch (error) {
    // Ensure we always return a proper error message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
}