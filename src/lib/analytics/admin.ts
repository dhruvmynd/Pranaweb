import { supabase } from '../supabase';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
}

export interface HeartRateTrend {
  date: string;
  averageHeartRate: number;
  sessionCount: number;
}

export interface MoodDistribution {
  mood: string;
  count: number;
  percentage: number;
}

export interface MoodTrend {
  date: string;
  moods: Record<string, number>;
}

export interface SessionData {
  name: string;
  count: number;
  avgDuration: number;
  avgHeartRate: number | null;
}

export interface UserProgress {
  streakDistribution: {
    range: string;
    count: number;
  }[];
  techniqueProgression: {
    technique: string;
    beginnerCount: number;
    intermediateCount: number;
    advancedCount: number;
  }[];
  achievementStats: {
    milestone: string;
    count: number;
    percentage: number;
  }[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Call the RPC function to get accurate user stats
  const { data, error } = await supabase.rpc('get_admin_user_stats');
  
  if (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }

  return {
    totalUsers: data.total_users || 0,
    activeUsers: data.active_users || 0,
    newUsers: data.new_users || 0
  };
}

export async function getHeartRateTrends(days: number = 30): Promise<HeartRateTrend[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: sessions, error } = await supabase
    .from('practice_sessions')
    .select('completed_at, average_heart_rate')
    .gte('completed_at', startDate.toISOString())
    .not('average_heart_rate', 'eq', 0)
    .order('completed_at');

  if (error) throw error;

  // Group by date
  const dailyStats = sessions.reduce((acc: Record<string, { total: number, count: number }>, session) => {
    const date = new Date(session.completed_at).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { total: 0, count: 0 };
    }
    if (session.average_heart_rate) {
      acc[date].total += session.average_heart_rate;
      acc[date].count++;
    }
    return acc;
  }, {});

  return Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    averageHeartRate: Math.round(stats.total / stats.count),
    sessionCount: stats.count
  }));
}

export async function getMoodDistribution(days: number = 30): Promise<MoodDistribution[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: moods, error } = await supabase
    .from('moods')
    .select('mood')
    .gte('created_at', startDate.toISOString());

  if (error) throw error;

  const distribution = moods.reduce((acc: Record<string, number>, { mood }) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  const total = Object.values(distribution).reduce((a, b) => a + b, 0);

  return Object.entries(distribution).map(([mood, count]) => ({
    mood,
    count,
    percentage: (count / total) * 100
  }));
}

export async function getMoodTrends(days: number = 30): Promise<MoodTrend[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: moods, error } = await supabase
    .from('moods')
    .select('mood, created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at');

  if (error) throw error;

  const dailyMoods: Record<string, Record<string, number>> = {};

  moods.forEach(({ mood, created_at }) => {
    const date = new Date(created_at).toISOString().split('T')[0];
    if (!dailyMoods[date]) {
      dailyMoods[date] = {};
    }
    dailyMoods[date][mood] = (dailyMoods[date][mood] || 0) + 1;
  });

  return Object.entries(dailyMoods).map(([date, moods]) => ({
    date,
    moods
  }));
}

export async function getSessionDistribution(): Promise<SessionData[]> {
  // First get curated sessions
  const { data: curatedSessions, error: curatedError } = await supabase
    .from('curated_sessions')
    .select('*')
    .not('avg_heart_rate', 'eq', 0);

  if (curatedError) throw curatedError;

  // Then get practice sessions
  const { data: practiceSessions, error: practiceError } = await supabase
    .from('practice_sessions')
    .select('technique, duration, average_heart_rate')
    .not('average_heart_rate', 'eq', 0);

  if (practiceError) throw practiceError;

  // Process curated sessions
  const curatedStats = curatedSessions.map(session => ({
    name: session.session_name,
    count: session.sessions_count || 0,
    avgDuration: session.avg_duration || 0,
    avgHeartRate: session.avg_heart_rate
  }));

  // Process practice sessions
  const practiceStats = practiceSessions.reduce((acc: Record<string, SessionData>, session) => {
    if (!acc[session.technique]) {
      acc[session.technique] = {
        name: session.technique,
        count: 0,
        avgDuration: 0,
        avgHeartRate: 0
      };
    }
    acc[session.technique].count++;
    acc[session.technique].avgDuration += session.duration;
    if (session.average_heart_rate) {
      acc[session.technique].avgHeartRate = 
        (acc[session.technique].avgHeartRate || 0) + session.average_heart_rate;
    }
    return acc;
  }, {});

  // Calculate averages for practice sessions
  Object.values(practiceStats).forEach(stat => {
    stat.avgDuration = stat.avgDuration / stat.count;
    if (stat.avgHeartRate) {
      stat.avgHeartRate = stat.avgHeartRate / stat.count;
    }
  });

  return [...curatedStats, ...Object.values(practiceStats)];
}

export async function getUserProgressMetrics(): Promise<UserProgress> {
  // Get streak distribution
  const { data: streaks } = await supabase
    .from('user_streaks')
    .select('current_streak, longest_streak');

  const streakRanges = [
    { min: 0, max: 7, label: '0-7 days' },
    { min: 8, max: 14, label: '8-14 days' },
    { min: 15, max: 30, label: '15-30 days' },
    { min: 31, max: 60, label: '31-60 days' },
    { min: 61, max: Infinity, label: '60+ days' }
  ];

  const streakDistribution = streakRanges.map(range => ({
    range: range.label,
    count: streaks?.filter(s => 
      s.current_streak >= range.min && 
      s.current_streak <= range.max
    ).length || 0
  }));

  // Get technique progression
  const { data: sessions } = await supabase
    .from('practice_sessions')
    .select('user_id, technique, duration')
    .not('average_heart_rate', 'eq', 0);

  const userTechniqueStats = sessions?.reduce((acc, session) => {
    if (!acc[session.user_id]) {
      acc[session.user_id] = {};
    }
    if (!acc[session.user_id][session.technique]) {
      acc[session.user_id][session.technique] = {
        totalDuration: 0,
        sessionCount: 0
      };
    }
    acc[session.user_id][session.technique].totalDuration += session.duration;
    acc[session.user_id][session.technique].sessionCount++;
    return acc;
  }, {} as Record<string, Record<string, { totalDuration: number; sessionCount: number }>>);

  const techniqueProgression = Object.entries(
    sessions?.reduce((acc, session) => {
      if (!acc[session.technique]) {
        acc[session.technique] = { beginner: 0, intermediate: 0, advanced: 0 };
      }
      const stats = userTechniqueStats?.[session.user_id]?.[session.technique];
      if (stats) {
        if (stats.totalDuration < 3600) { // Less than 1 hour total
          acc[session.technique].beginner++;
        } else if (stats.totalDuration < 18000) { // Less than 5 hours total
          acc[session.technique].intermediate++;
        } else {
          acc[session.technique].advanced++;
        }
      }
      return acc;
    }, {} as Record<string, { beginner: number; intermediate: number; advanced: number }>) || {}
  ).map(([technique, counts]) => ({
    technique,
    beginnerCount: counts.beginner,
    intermediateCount: counts.intermediate,
    advancedCount: counts.advanced
  }));

  // Calculate achievement stats
  const totalUsers = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });

  const achievementStats = [
    {
      milestone: '5+ Sessions',
      count: Object.values(userTechniqueStats || {}).filter(
        user => Object.values(user).reduce((sum, t) => sum + t.sessionCount, 0) >= 5
      ).length
    },
    {
      milestone: '30+ Minutes Total',
      count: Object.values(userTechniqueStats || {}).filter(
        user => Object.values(user).reduce((sum, t) => sum + t.totalDuration, 0) >= 1800
      ).length
    },
    {
      milestone: '7+ Day Streak',
      count: streaks?.filter(s => s.current_streak >= 7).length || 0
    }
  ].map(stat => ({
    ...stat,
    percentage: totalUsers.count ? (stat.count / totalUsers.count) * 100 : 0
  }));

  return {
    streakDistribution,
    techniqueProgression,
    achievementStats
  };
}