import { supabase } from './supabase';
import { ACHIEVEMENTS } from './types/achievements';
import type { Achievement } from './types/achievements';

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  try {
    // Get unlocked achievements from database
    const { data: unlockedAchievements, error } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at, progress, initial_heart_rate, current_heart_rate, badge_unlocked')
      .eq('user_id', userId)
      .eq('badge_unlocked', true); // Only get achievements with unlocked badges

    if (error) throw error;

    // Map database achievements to full achievement objects
    return unlockedAchievements.map(ua => {
      const achievement = ACHIEVEMENTS.find(a => a.id === ua.achievement_id);
      if (!achievement) return null;

      return {
        ...achievement,
        unlockedAt: ua.unlocked_at,
        progress: ua.progress,
        initialHeartRate: ua.initial_heart_rate,
        currentHeartRate: ua.current_heart_rate,
        badgeUnlocked: ua.badge_unlocked
      };
    }).filter((a): a is Achievement => a !== null);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
}