import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FaHeart } from 'react-icons/fa';
import type { Mood } from '@/lib/types/mood';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MoodChartProps {
  moods: Mood[];
}

export function MoodChart({ moods }: MoodChartProps) {
  // Count moods
  const moodCounts = moods.reduce((acc, { mood }) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: ['Still', 'Focused', 'Wavering', 'Scattered', 'Sluggish'],
    datasets: [
      {
        data: [
          moodCounts['still'] || 0,
          moodCounts['focused'] || 0,
          moodCounts['wavering'] || 0,
          moodCounts['scattered'] || 0,
          moodCounts['sluggish'] || 0,
        ],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',  // still - green
          'rgba(96, 165, 250, 0.8)',  // focused - blue
          'rgba(251, 146, 60, 0.8)',  // wavering - orange
          'rgba(248, 113, 113, 0.8)', // scattered - red
          'rgba(167, 139, 250, 0.8)', // sluggish - purple
        ],
        borderColor: [
          'rgba(52, 211, 153, 1)',
          'rgba(96, 165, 250, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(248, 113, 113, 1)',
          'rgba(167, 139, 250, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      className="h-full rounded-xl bg-white/50 backdrop-blur-sm p-6 shadow-sm border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <FaHeart className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Mood Distribution</h3>
      </div>
      
      <div className="h-[calc(100%-4rem)] flex items-center justify-center">
        {totalMoods > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <div className="text-muted-foreground">
            No mood data available
          </div>
        )}
      </div>
    </motion.div>
  );
}