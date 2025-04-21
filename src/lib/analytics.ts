import { supabase } from './supabase';
import type { PracticeSession } from './types/analytics';
import type { SessionStats } from './types/ios-sessions';

export async function getDailyStats(userId: string) {
  const { data, error } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error fetching practice sessions:', error);
    throw error;
  }

  return data as PracticeSession[];
}

export async function getAllStats(userId: string) {
  const { data, error } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error fetching practice sessions:', error);
    throw error;
  }

  return data as PracticeSession[];
}

export async function getSessionStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('curated_sessions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching curated sessions:', error);
      return [];
    }

    // Transform the data to match SessionStats interface
    return data.map(session => ({
      session_type: 'curated',
      session_name: session.session_name,
      count: session.sessions_count || 0,
      avg_duration: session.avg_duration || 0,
      avg_heart_rate: session.avg_heart_rate || 0,
      sessions_count: session.sessions_count || 0
    })) as SessionStats[];
  } catch (error) {
    console.error('Error in getSessionStats:', error);
    return [];
  }
}