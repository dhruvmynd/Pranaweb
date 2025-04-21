export interface SessionStats {
  session_type: string;
  session_name: string;
  count: number;
  avg_duration: number;
  avg_heart_rate: number;
  sessions_count: number;
  avg_hrv?: number;
}