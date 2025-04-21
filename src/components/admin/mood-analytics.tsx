import { motion } from 'framer-motion';
import { Doughnut, Line } from 'react-chartjs-2';
import { Brain } from 'lucide-react';
import type { MoodDistribution, MoodTrend } from '@/lib/analytics/admin';

interface MoodAnalyticsProps {
  distribution: MoodDistribution[];
  trends: MoodTrend[];
}

export function MoodAnalytics({ distribution, trends }: MoodAnalyticsProps) {
  const moodColors = {
    still: 'rgb(52, 211, 153)',
    focused: 'rgb(96, 165, 250)',
    wavering: 'rgb(251, 146, 60)',
    scattered: 'rgb(248, 113, 113)',
    sluggish: 'rgb(167, 139, 250)'
  };

  const distributionData = {
    labels: distribution.map(d => d.mood),
    datasets: [{
      data: distribution.map(d => d.count),
      backgroundColor: distribution.map(d => moodColors[d.mood as keyof typeof moodColors]),
      borderWidth: 0
    }]
  };

  const trendData = {
    labels: trends.map(t => new Date(t.date).toLocaleDateString()),
    datasets: Object.keys(moodColors).map(mood => ({
      label: mood,
      data: trends.map(t => t.moods[mood] || 0),
      borderColor: moodColors[mood as keyof typeof moodColors],
      fill: false,
      tension: 0.4
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Mood Analytics</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Distribution</h4>
          <div className="h-[300px] relative">
            <Doughnut data={distributionData} options={options} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Trends</h4>
          <div className="h-[300px] relative">
            <Line data={trendData} options={options} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
        {distribution.map(({ mood, count, percentage }) => (
          <div key={mood} className="text-center">
            <div className="text-sm font-medium capitalize">{mood}</div>
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}