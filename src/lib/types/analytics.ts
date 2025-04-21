export interface PracticeSession {
  id: string;
  user_id: string;
  technique: string;
  duration: number; // in seconds
  completed_at: string;
  created_at: string;
  average_heart_rate?: number;
  hrv?: number;
  heart_rate_data?: [number, number][]; // [timestamp, heart_rate][]
}

export interface DailyStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_practice_date: string;
  created_at: string;
  updated_at: string;
}

export interface HeartRateData {
  timestamp: number;
  rate: number;
}

export interface SessionHeartRate {
  average: number;
  data: HeartRateData[];
}

export interface HrvData {
  timestamp: number;
  value: number;
}

export interface UserAnalytics {
  total_sessions: number;
  total_minutes: number;
  avg_session_duration: number;
  avg_heart_rate: number;
  sessions_with_heart_rate: number;
  unique_techniques_used: number;
  last_practice_date: string | null;
  total_moods: number;
  unique_moods: number;
  most_common_mood: string | null;
  last_mood_date: string | null;
  current_streak: number;
  longest_streak: number;
  avg_hrv: number;
  sessions_with_hrv: number;
  technique_stats: Array<{
    technique: string;
    count: number;
    avg_duration: number;
    avg_heart_rate: number;
  }>;
}