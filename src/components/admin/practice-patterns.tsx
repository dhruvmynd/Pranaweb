import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Clock } from 'lucide-react';

interface PracticePatterns {
  hourlyDistribution: number[];
  weekdayDistribution: number[];
  completionRate: number;
}

interface PracticePatternsProps {
  data: PracticePatterns;
}

export function PracticePatterns({ data }: PracticePatternsProps) {
  const hourlyData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Sessions',
      data: data.hourlyDistribution,
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }]
  };

  const weekdayData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Sessions',
      data: data.weekdayDistribution,
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Practice Patterns</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Time of Day</h4>
          <div className="h-[300px]">
            <Bar data={hourlyData} options={options} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Day of Week</h4>
          <div className="h-[300px]">
            <Bar data={weekdayData} options={options} />
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-block bg-primary/10 rounded-lg px-4 py-2">
          <span className="text-sm text-gray-600">Session Completion Rate</span>
          <div className="text-2xl font-bold text-primary">
            {(data.completionRate * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}