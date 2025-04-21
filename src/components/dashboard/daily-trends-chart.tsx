import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { FaHeart, FaClock, FaGripVertical, FaChartLine } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import type { PracticeSession } from '@/lib/types/analytics';

interface DailyTrendsChartProps {
  sessions: PracticeSession[];
}

type TimeRange = '1m' | '3m' | '6m';
type DataFilter = 'practice' | 'heart' | 'hrv';

export function DailyTrendsChart({ sessions }: DailyTrendsChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [activeFilters, setActiveFilters] = useState<Set<DataFilter>>(new Set(['practice', 'heart', 'hrv']));

  // Calculate the date range based on selected time range
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    switch (timeRange) {
      case '1m':
        start.setMonth(end.getMonth() - 1);
        break;
      case '3m':
        start.setMonth(end.getMonth() - 3);
        break;
      case '6m':
        start.setMonth(end.getMonth() - 6);
        break;
    }
    return { start, end };
  }, [timeRange]);

  // Filter and sort sessions based on selected date range
  const filteredSessions = useMemo(() => {
    return sessions
      .filter(session => {
        const sessionDate = new Date(session.completed_at);
        return sessionDate >= dateRange.start && sessionDate <= dateRange.end;
      })
      .sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime());
  }, [sessions, dateRange]);

  // Group sessions by date
  const dailyData = useMemo(() => {
    const data: Record<string, { 
      minutes: number; 
      heartRates: number[]; 
      hrvValues: number[];
    }> = {};
    
    // Create entries for all dates in range
    let currentDate = new Date(dateRange.start);
    while (currentDate <= dateRange.end) {
      const dateStr = currentDate.toLocaleDateString();
      data[dateStr] = { minutes: 0, heartRates: [], hrvValues: [] };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in actual session data
    filteredSessions.forEach(session => {
      const date = new Date(session.completed_at).toLocaleDateString();
      if (!data[date]) {
        data[date] = { minutes: 0, heartRates: [], hrvValues: [] };
      }
      data[date].minutes += session.duration / 60;
      if (session.average_heart_rate) {
        data[date].heartRates.push(session.average_heart_rate);
      }
      if (session.hrv && session.hrv > 0) {
        data[date].hrvValues.push(session.hrv);
      }
    });

    return data;
  }, [filteredSessions, dateRange]);

  // Get dates and corresponding data
  const dates = Object.keys(dailyData);
  const minutes = dates.map(date => Math.round(dailyData[date].minutes));
  const heartRates = dates.map(date => {
    const rates = dailyData[date].heartRates;
    return rates.length ? Math.round(rates.reduce((a, b) => a + b) / rates.length) : null;
  });
  const hrvValues = dates.map(date => {
    const values = dailyData[date].hrvValues;
    return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;
  });

  // Calculate moving averages for smoother lines
  const movingAverage = (data: (number | null)[], window: number) => {
    return data.map((_, idx) => {
      const start = Math.max(0, idx - window + 1);
      const values = data.slice(start, idx + 1).filter((v): v is number => v !== null);
      return values.length ? values.reduce((a, b) => a + b) / values.length : null;
    });
  };

  const smoothedHeartRates = movingAverage(heartRates, 3);
  const smoothedHrvValues = movingAverage(hrvValues, 3);

  const toggleFilter = (filter: DataFilter) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
    });
  };

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Practice Minutes',
        data: minutes,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        yAxisID: 'y',
        fill: true,
        tension: 0.4,
        hidden: !activeFilters.has('practice')
      },
      {
        label: 'Average Heart Rate',
        data: smoothedHeartRates,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        yAxisID: 'y1',
        fill: true,
        tension: 0.4,
        hidden: !activeFilters.has('heart')
      },
      {
        label: 'HRV',
        data: smoothedHrvValues,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y2',
        fill: true,
        tension: 0.4,
        hidden: !activeFilters.has('hrv')
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
          callback: (value: any) => {
            const date = new Date(dates[value]);
            return date.toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric' 
            });
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: activeFilters.has('practice'),
        position: 'left' as const,
        title: {
          display: true,
          text: 'Minutes',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        min: 0,
      },
      y1: {
        type: 'linear' as const,
        display: activeFilters.has('heart'),
        position: 'right' as const,
        title: {
          display: true,
          text: 'BPM',
        },
        grid: {
          display: false,
        },
        min: Math.min(...heartRates.filter((v): v is number => v !== null)) - 5,
        max: Math.max(...heartRates.filter((v): v is number => v !== null)) + 5,
      },
      y2: {
        type: 'linear' as const,
        display: activeFilters.has('hrv'),
        position: 'right' as const,
        title: {
          display: true,
          text: 'HRV (ms)',
        },
        grid: {
          display: false,
        },
        min: Math.min(...hrvValues.filter((v): v is number => v !== null)) - 5,
        max: Math.max(...hrvValues.filter((v): v is number => v !== null)) + 5,
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const date = new Date(context[0].label);
            return date.toLocaleDateString(undefined, { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
      }
    },
  };

  return (
    <motion.div
      className="h-full rounded-xl bg-white/50 backdrop-blur-sm p-6 shadow-sm border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="drag-handle cursor-move">
            <FaGripVertical className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold">Daily Practice Trends</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleFilter('practice')}
              className={`flex items-center gap-2 transition-colors ${
                activeFilters.has('practice')
                  ? 'text-indigo-600'
                  : 'text-gray-400'
              }`}
            >
              <FaClock className="h-4 w-4" />
              <span className="text-sm">Practice Time</span>
            </button>
            <button
              onClick={() => toggleFilter('heart')}
              className={`flex items-center gap-2 transition-colors ${
                activeFilters.has('heart')
                  ? 'text-red-600'
                  : 'text-gray-400'
              }`}
            >
              <FaHeart className="h-4 w-4" />
              <span className="text-sm">Heart Rate</span>
            </button>
            <button
              onClick={() => toggleFilter('hrv')}
              className={`flex items-center gap-2 transition-colors ${
                activeFilters.has('hrv')
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <FaChartLine className="h-4 w-4" />
              <span className="text-sm">HRV</span>
            </button>
          </div>
        </div>
        
        {/* Time range selector */}
        <div className="pointer-events-auto z-10">
          <div className="flex gap-2">
            <Button
              variant={timeRange === '1m' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('1m')}
              className="min-w-[3rem]"
            >
              1M
            </Button>
            <Button
              variant={timeRange === '3m' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('3m')}
              className="min-w-[3rem]"
            >
              3M
            </Button>
            <Button
              variant={timeRange === '6m' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('6m')}
              className="min-w-[3rem]"
            >
              6M
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[calc(100%-4rem)]">
        <Line data={data} options={options} />
      </div>
    </motion.div>
  );
}