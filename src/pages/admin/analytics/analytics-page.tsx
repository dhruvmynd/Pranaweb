import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserPlus } from 'lucide-react';
import { 
  getAdminStats, 
  getHeartRateTrends,
  getMoodDistribution,
  getMoodTrends,
  getSessionDistribution,
  getUserProgressMetrics,
  type AdminStats, 
  type HeartRateTrend,
  type MoodDistribution,
  type MoodTrend,
  type SessionData,
  type UserProgress
} from '@/lib/analytics/admin';
import { getNewsletterStats, type NewsletterStats } from '@/lib/analytics/newsletter';
import { HeartRateTrends } from '@/components/admin/heart-rate-trends';
import { MoodAnalytics } from '@/components/admin/mood-analytics';
import { PracticeSessionsChart } from '@/components/admin/practice-sessions-chart';
import { UserProgress as UserProgressChart } from '@/components/admin/user-progress';
import { NewsletterAnalytics } from '@/components/admin/newsletter-analytics';
import { EmailTest } from '@/components/admin/email-test';

export function AnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [heartRateTrends, setHeartRateTrends] = useState<HeartRateTrend[]>([]);
  const [moodDistribution, setMoodDistribution] = useState<MoodDistribution[]>([]);
  const [moodTrends, setMoodTrends] = useState<MoodTrend[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionData[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [newsletterStats, setNewsletterStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          statsData, 
          trendsData, 
          moodDist, 
          moodTr, 
          sessionDist, 
          progressData,
          newsletterData
        ] = await Promise.all([
          getAdminStats(),
          getHeartRateTrends(30),
          getMoodDistribution(30),
          getMoodTrends(30),
          getSessionDistribution(),
          getUserProgressMetrics(),
          getNewsletterStats()
        ]);
        
        setStats(statsData);
        setHeartRateTrends(trendsData);
        setMoodDistribution(moodDist);
        setMoodTrends(moodTr);
        setSessionStats(sessionDist);
        setUserProgress(progressData);
        setNewsletterStats(newsletterData);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const statsData = await getAdminStats();
      setStats(statsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error refreshing admin stats:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const refreshNewsletterStats = async () => {
    try {
      const newsletterData = await getNewsletterStats();
      setNewsletterStats(newsletterData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error refreshing newsletter stats:', err);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      subtitle: 'Last 30 days',
      value: stats.activeUsers,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'New Users',
      subtitle: 'Last 30 days',
      value: stats.newUsers,
      icon: UserPlus,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of user statistics and platform metrics
        </p>
        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{card.title}</h3>
                {card.subtitle && (
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                )}
              </div>
            </div>
            <p className="text-3xl font-bold mt-4">{card.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {newsletterStats && <NewsletterAnalytics data={newsletterStats} onRefresh={refreshNewsletterStats} />}

      {userProgress && <UserProgressChart data={userProgress} />}

      <PracticeSessionsChart sessions={sessionStats} />
      
      <HeartRateTrends data={heartRateTrends} />
      
      <MoodAnalytics 
        distribution={moodDistribution}
        trends={moodTrends}
      />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Email Testing</h2>
        <EmailTest />
      </div>
    </div>
  );
}