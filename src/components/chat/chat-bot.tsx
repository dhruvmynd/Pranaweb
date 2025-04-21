import { useEffect, useState } from 'react';
import { BubbleChat } from 'flowise-embed-react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';

interface UserAnalytics {
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

export function ChatBot() {
  const { user } = useAuth();
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);

  useEffect(() => {
    async function fetchUserAnalytics() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_analytics')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          // Only log the error if it's not a "no rows returned" error
          if (!error.message.includes('no rows returned')) {
            console.error('Error fetching user analytics:', error);
          }
          return;
        }

        if (data) {
          setUserAnalytics(data);
        }
      } catch (error) {
        // Only log unexpected errors
        if (error instanceof Error && !error.message.includes('Failed to fetch')) {
          console.error('Error fetching user analytics:', error);
        }
      }
    }

    fetchUserAnalytics();
  }, [user]);

  // Format technique stats for better readability
  const formatTechniqueStats = (stats: UserAnalytics['technique_stats']) => {
    return stats.map(stat => 
      `${stat.technique}: ${stat.count} sessions (Avg Duration: ${stat.avg_duration.toFixed(1)} min, Avg Heart Rate: ${stat.avg_heart_rate.toFixed(1)} BPM)`
    ).join('\n- ');
  };

  // Prepare the initial context for the chatbot
  const initialContext = {
    question: "",
    user_analytics: user && userAnalytics ? {
      total_sessions: userAnalytics.total_sessions,
      total_minutes: userAnalytics.total_minutes,
      avg_session_duration: userAnalytics.avg_session_duration,
      avg_heart_rate: userAnalytics.avg_heart_rate,
      last_practice_date: userAnalytics.last_practice_date,
      most_common_mood: userAnalytics.most_common_mood,
      current_streak: userAnalytics.current_streak,
      longest_streak: userAnalytics.longest_streak,
      technique_stats: userAnalytics.technique_stats,
      enriched_context: `
User Analytics Context:
- Total Sessions: ${userAnalytics.total_sessions}
- Total Minutes Practiced: ${userAnalytics.total_minutes.toFixed(1)}
- Average Session Duration: ${userAnalytics.avg_session_duration.toFixed(1)} min
- Average Heart Rate: ${userAnalytics.avg_heart_rate.toFixed(1)} BPM
- Average HRV: ${userAnalytics.avg_hrv.toFixed(1)} ms
- Last Practice Date: ${userAnalytics.last_practice_date || 'N/A'}
- Most Common Mood: ${userAnalytics.most_common_mood || 'N/A'}
- Current Streak: ${userAnalytics.current_streak} days
- Longest Streak: ${userAnalytics.longest_streak} days
- Breathing Techniques Used:
  - ${formatTechniqueStats(userAnalytics.technique_stats)}
      `.trim()
    } : {
      is_logged_in: false,
      message: "Please log in to access your personalized analytics and get tailored guidance."
    }
  };

  return (
    <BubbleChat
      chatflowid="c9e2a8e4-dc4d-4c37-abff-6d7154739df4"
      apiHost="https://flowise-i7wm.onrender.com"
      theme={{
        button: {
          backgroundColor: "#10b981",
          right: 20,
          bottom: 20,
        }
      }}
      initialContext={initialContext}
    />
  );
}