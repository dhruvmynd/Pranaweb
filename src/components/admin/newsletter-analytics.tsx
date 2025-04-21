import { useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Mail, Users, UserMinus, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NewsletterStats } from '@/lib/analytics/newsletter';

interface NewsletterAnalyticsProps {
  data: NewsletterStats;
  onRefresh?: () => Promise<void>;
}

export function NewsletterAnalytics({ data, onRefresh }: NewsletterAnalyticsProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const chartData = {
    labels: data.dailyStats.map(stat => 
      new Date(stat.date).toLocaleDateString()
    ).reverse(),
    datasets: [
      {
        label: 'New Subscribers',
        data: data.dailyStats.map(stat => stat.newSubscribers).reverse(),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Unsubscribed',
        data: data.dailyStats.map(stat => stat.unsubscribed).reverse(),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const stats = [
    {
      title: 'Total Subscribers',
      value: data.totalSubscribers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Subscribers',
      value: data.activeSubscribers,
      icon: Mail,
      color: 'bg-green-500'
    },
    {
      title: 'Unsubscribed',
      value: data.unsubscribedCount,
      icon: UserMinus,
      color: 'bg-red-500'
    },
    {
      title: 'GDPR Consent Rate',
      value: `${data.gdprConsentRate.toFixed(1)}%`,
      icon: ShieldCheck,
      color: 'bg-purple-500'
    }
  ];

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Newsletter Analytics</h3>
        </div>
        {onRefresh && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(stat => (
          <div key={stat.title} className="bg-white/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
          <span className="font-medium">Retention Rate:</span>
          <span>{data.retentionRate.toFixed(1)}%</span>
        </div>
      </div>
    </motion.div>
  );
}