import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Wind } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SessionData {
  name: string;
  count: number;
  avgDuration: number;
  avgHeartRate: number | null;
}

interface PracticeSessionsChartProps {
  sessions: SessionData[];
}

export function PracticeSessionsChart({ sessions }: PracticeSessionsChartProps) {
  const data = {
    labels: sessions.map(s => s.name),
    datasets: [
      {
        label: 'Session Count',
        data: sessions.map(s => s.count),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        label: 'Average Duration (minutes)',
        data: sessions.map(s => Math.round(s.avgDuration / 60)), // Convert seconds to minutes
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          afterBody: (context: any) => {
            const index = context[0].dataIndex;
            const heartRate = sessions[index].avgHeartRate;
            return heartRate ? `Average Heart Rate: ${Math.round(heartRate)} BPM` : '';
          }
        }
      }
    }
  };

  // Calculate totals
  const totalSessions = sessions.reduce((acc, s) => acc + s.count, 0);
  const totalDuration = sessions.reduce((acc, s) => acc + (s.avgDuration * s.count), 0);
  const avgDuration = Math.round(totalDuration / totalSessions / 60); // in minutes

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wind className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Practice Sessions</h3>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-2xl font-bold">{totalSessions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Duration</p>
            <p className="text-2xl font-bold">{avgDuration} min</p>
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
}