import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { getAllStats, getSessionStats } from '@/lib/analytics';
import { getUserMoods } from '@/lib/mood';
import { getUserAchievements } from '@/lib/achievements';
import { FaClock, FaChartLine, FaHeart, FaSignInAlt, FaArrowRight, FaWaveSquare } from 'react-icons/fa';
import { StatsCard } from '@/components/dashboard/stats-card';
import { DailyTrendsChart } from '@/components/dashboard/daily-trends-chart';
import { StreakCard } from '@/components/dashboard/streak-card';
import { MoodChart } from '@/components/dashboard/mood-chart';
import { SessionStatsCard } from '@/components/dashboard/session-stats-card';
import { AchievementCard } from '@/components/dashboard/achievement-card';
import { Button } from '@/components/ui/button';
import { usePageLoading } from '@/hooks/use-page-loading';
import type { PracticeSession, DailyStreak } from '@/lib/types/analytics';
import type { Mood } from '@/lib/types/mood';
import type { SessionStats } from '@/lib/types/ios-sessions';
import type { Achievement } from '@/lib/types/achievements';
import { supabase } from '@/lib/supabase';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: 'mood', x: 0, y: 0, w: 8, h: 4 },
    { i: 'streak', x: 8, y: 0, w: 4, h: 4 },
    { i: 'practice-time', x: 0, y: 4, w: 4, h: 2 },
    { i: 'heart-rate', x: 4, y: 4, w: 4, h: 2 },
    { i: 'hrv', x: 8, y: 4, w: 4, h: 2 },
    { i: 'daily-trends', x: 0, y: 6, w: 12, h: 4 },
    { i: 'sessions', x: 0, y: 10, w: 12, h: 4 },
    { i: 'achievements', x: 0, y: 14, w: 12, h: 8 }
  ],
  md: [
    { i: 'mood', x: 0, y: 0, w: 6, h: 4 },
    { i: 'streak', x: 6, y: 0, w: 6, h: 4 },
    { i: 'practice-time', x: 0, y: 4, w: 4, h: 2 },
    { i: 'heart-rate', x: 4, y: 4, w: 4, h: 2 },
    { i: 'hrv', x: 8, y: 4, w: 4, h: 2 },
    { i: 'daily-trends', x: 0, y: 6, w: 12, h: 4 },
    { i: 'sessions', x: 0, y: 10, w: 12, h: 4 },
    { i: 'achievements', x: 0, y: 14, w: 12, h: 8 }
  ],
  sm: [
    { i: 'mood', x: 0, y: 0, w: 12, h: 4 },
    { i: 'streak', x: 0, y: 4, w: 12, h: 4 },
    { i: 'practice-time', x: 0, y: 8, w: 6, h: 2 },
    { i: 'heart-rate', x: 6, y: 8, w: 6, h: 2 },
    { i: 'hrv', x: 0, y: 10, w: 12, h: 2 },
    { i: 'daily-trends', x: 0, y: 12, w: 12, h: 4 },
    { i: 'sessions', x: 0, y: 16, w: 12, h: 4 },
    { i: 'achievements', x: 0, y: 20, w: 12, h: 10 }
  ]
};

export function DashboardPage() {
  const { user, initialized } = useAuth();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [streak, setStreak] = useState<DailyStreak | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLayouts, setCurrentLayouts] = useState(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const savedLayouts = localStorage.getItem(`dashboardLayout-${user.id}`);
      return savedLayouts ? JSON.parse(savedLayouts) : defaultLayouts;
    }
    return defaultLayouts;
  });

  usePageLoading(loading);

  useEffect(() => {
    if (!initialized) return;
    if (!user) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [sessionsData, moodsData, statsData, achievementsData] = await Promise.all([
          getAllStats(user.id),
          getUserMoods(user.id),
          getSessionStats(user.id),
          getUserAchievements(user.id)
        ]);
        
        setSessions(sessionsData);
        setMoods(moodsData);
        setSessionStats(statsData);
        setAchievements(achievementsData);

        const { data: streakData } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        setStreak(streakData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, initialized]);

  useEffect(() => {
    if (user?.id) {
      const savedLayouts = localStorage.getItem(`dashboardLayout-${user.id}`);
      if (savedLayouts) {
        setCurrentLayouts(JSON.parse(savedLayouts));
      }
    }
  }, [user?.id]);

  if (initialized && !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLayoutChange = (_layout: any, layouts: any) => {
    setCurrentLayouts(layouts);
    if (user?.id) {
      localStorage.setItem(`dashboardLayout-${user.id}`, JSON.stringify(layouts));
    }
  };

  const totalMinutes = Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60);
  const sessionsWithHeartRate = sessions.filter(s => s.average_heart_rate);
  const averageHeartRate = sessionsWithHeartRate.length
    ? Math.round(
        sessionsWithHeartRate.reduce((acc, s) => acc + (s.average_heart_rate || 0), 0) / 
        sessionsWithHeartRate.length
      )
    : 0;
  
  // Calculate average HRV
  const sessionsWithHrv = sessions.filter(s => s.hrv && s.hrv > 0);
  const averageHrv = sessionsWithHrv.length
    ? Math.round(
        sessionsWithHrv.reduce((acc, s) => acc + (s.hrv || 0), 0) / 
        sessionsWithHrv.length
      )
    : 0;

  return (
    <div className="min-h-screen flow-bg pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Practice Dashboard</h1>

        <div className="overflow-x-hidden">
          <ResponsiveGridLayout
            className="layout"
            layouts={currentLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768 }}
            cols={{ lg: 12, md: 12, sm: 12 }}
            rowHeight={100}
            onLayoutChange={handleLayoutChange}
            isDraggable={true}
            isResizable={true}
            margin={[16, 16]}
            draggableHandle=".drag-handle"
            containerPadding={[0, 0]}
            useCSSTransforms={true}
          >
            <div key="mood" className="overflow-hidden">
              <MoodChart moods={moods} />
            </div>
            
            <div key="streak" className="overflow-hidden">
              <StreakCard 
                currentStreak={streak?.current_streak || 0} 
                longestStreak={streak?.longest_streak || 0} 
              />
            </div>

            <div key="practice-time" className="overflow-hidden">
              <StatsCard
                title="Total Practice Time"
                value={`${totalMinutes} mins`}
                icon={FaClock}
                description="Your total practice time"
              />
            </div>

            <div key="heart-rate" className="overflow-hidden">
              <StatsCard
                title="Average Heart Rate"
                value={averageHeartRate ? `${averageHeartRate} BPM` : 'No data'}
                icon={FaHeart}
                description="Your average heart rate during practice"
                highlight
              />
            </div>
            
            <div key="hrv" className="overflow-hidden">
              <StatsCard
                title="Heart Rate Variability"
                value={averageHrv ? `${averageHrv} ms` : 'No data'}
                icon={FaWaveSquare}
                description="Your average HRV during practice"
                highlight
                tooltip="Heart Rate Variability (HRV) is the variation in time between heartbeats. Higher values indicate better cardiovascular health and stress resilience."
              />
            </div>

            <div key="daily-trends" className="overflow-hidden">
              <DailyTrendsChart sessions={sessions} />
            </div>

            <div key="sessions" className="overflow-hidden">
              <SessionStatsCard stats={sessionStats} />
            </div>

            <div key="achievements" className="overflow-hidden">
              <AchievementCard achievements={achievements} />
            </div>
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  );
}