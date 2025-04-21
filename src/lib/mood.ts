import { supabase } from './supabase';
import type { MoodType, Mood } from './types/mood';

export async function recordMood(userId: string, mood: MoodType) {
  const { data, error } = await supabase
    .from('moods')
    .insert([
      {
        user_id: userId,
        mood
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Mood;
}

export async function getUserMoods(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Mood[];
}