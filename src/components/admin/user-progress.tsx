import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Trophy, Award, Target } from 'lucide-react';
import type { UserProgress } from '@/lib/analytics/admin';

interface UserProgressProps {
  data: UserProgress;
}

export function UserProgress({ data }: UserProgressProps) {
  const streakData = {
    labels: data.streakDistribution.map(d => d.range),
    datasets: [{
      data: data.streakDistribution.map(d => d.count),
      backgroundColor: [
        'rgba(52, 211, 153, 0.8)',
        'rgba(96, 165, 250, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(248, 113, 113, 0.8)',
        'rgba(167, 139, 250, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  const progressionData = {
    labels: data.techniqueProgression.map(d => d.technique),
    datasets: [
      {
        label: 'Beginner',
        data: data.techniqueProgression.map(d => d.beginnerCount),
        backgroundColor: 'rgba(52, 211, 153, 0.8)',
      },
      {
        label: 'Intermediate',
        data: data.techniqueProgression.map(d => d.intermediateCount),
        backgroundColor: 'rgba(96, 165, 250, 0.8)',
      },
      {
        label: 'Advanced',
        data: data.techniqueProgression.map(d => d.advancedCount),
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
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
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
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
        <Trophy className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">User Progress</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Streak Distribution</h4>
          <div className="h-[300px] relative">
            <Doughnut data={streakData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Technique Progression</h4>
          <div className="h-[300px] relative">
            <Bar data={progressionData} options={options} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {data.achievementStats.map(stat => (
          <div key={stat.milestone} className="bg-primary/5 rounded-lg p-4 text-center">
            <h5 className="text-sm font-medium text-gray-700 mb-2">{stat.milestone}</h5>
            <div className="text-2xl font-bold text-primary">{stat.count}</div>
            <div className="text-sm text-gray-500">{stat.percentage.toFixed(1)}% of users</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}