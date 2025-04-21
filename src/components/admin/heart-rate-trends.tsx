import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Heart, Activity } from 'lucide-react';
import type { HeartRateTrend } from '@/lib/analytics/admin';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HeartRateTrendsProps {
  data: HeartRateTrend[];
}

export function HeartRateTrends({ data }: HeartRateTrendsProps) {
  const [averageHeartRate, setAverageHeartRate] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    if (data.length > 0) {
      const total = data.reduce((acc, day) => acc + day.averageHeartRate, 0);
      const sessions = data.reduce((acc, day) => acc + day.sessionCount, 0);
      setAverageHeartRate(Math.round(total / data.length));
      setTotalSessions(sessions);
    }
  }, [data]);

  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Average Heart Rate',
        data: data.map(d => d.averageHeartRate),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            return new Date(data[context[0].dataIndex].date).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: (context: any) => {
            const dataPoint = data[context.dataIndex];
            return [
              `Average Heart Rate: ${dataPoint.averageHeartRate} BPM`,
              `Sessions: ${dataPoint.sessionCount}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Heart Rate Trends</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-red-500 p-2 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average BPM</p>
              <p className="font-semibold">{averageHeartRate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <p className="font-semibold">{totalSessions}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
}