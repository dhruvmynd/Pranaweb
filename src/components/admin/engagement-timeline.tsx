import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Users, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TimelineData {
  date: string;
  activeUsers: number;
  averageSessionDuration: number;
}

interface EngagementTimelineProps {
  data: TimelineData[];
}

export function EngagementTimeline({ data }: EngagementTimelineProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<string[]>(['practice', 'hrv']);

  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh - in a real app, this would fetch new data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Active Users',
        data: data.map(d => d.activeUsers),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Avg Session Duration (min)',
        data: data.map(d => Math.round(d.averageSessionDuration / 60)),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        yAxisID: 'y1',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Active Users'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Minutes'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    }
  };

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">User Engagement</h3>
          <Button
            size="sm"
            variant="outline"
            className="ml-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleFilter('practice')}
              className={`flex items-center gap-2 ${
                filters.includes('practice') ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <span className="text-sm">Practice</span>
            </button>
            <button
              onClick={() => toggleFilter('hrv')}
              className={`flex items-center gap-2 ${
                filters.includes('hrv') ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <span className="text-sm">HRV</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Time range selector */}
      <div className="flex justify-end mb-4">
        <div className="pointer-events-auto z-10">
          <div className="flex gap-2">
            <Button
              variant={timeframe === '1m' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('1m')}
            >
              1M
            </Button>
            <Button
              variant={timeframe === '3m' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('3m')}
            >
              3M
            </Button>
            <Button
              variant={timeframe === '6m' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('6m')}
            >
              6M
            </Button>
          </div>
        </div>
      </div>
      
      <div className="h-[calc(100%-4rem)]">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
}