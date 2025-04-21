import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Users, Clock, Globe, Monitor, Download,
  MousePointer, ArrowUpRight, Timer, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAnalyticsData, getRealTimeUsers } from '@/lib/analytics/google/api';
import { usePageLoading } from '@/hooks/use-page-loading';

export function GoogleAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [realTimeUsers, setRealTimeUsers] = useState<number>(0);
  const [dateRange, setDateRange] = useState({
    startDate: '30daysAgo',
    endDate: 'today',
  });

  usePageLoading(loading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, realTimeData] = await Promise.all([
          getAnalyticsData(dateRange),
          getRealTimeUsers(),
        ]);
        setData(analyticsData);
        setRealTimeUsers(realTimeData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh real-time data every 5 minutes
    const interval = setInterval(() => {
      getRealTimeUsers()
        .then(setRealTimeUsers)
        .catch(console.error);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dateRange]);

  const handleExport = () => {
    if (!data) return;
    
    // Create CSV content
    const csvContent = [
      ['Metric', 'Value'],
      ['Active Users', data.activeUsers],
      ['Sessions', data.sessions],
      ['Bounce Rate', `${data.bounceRate}%`],
      ['Average Session Duration', `${Math.round(data.averageSessionDuration / 60)} minutes`],
      ['Page Views', data.pageViews],
      ['', ''],
      ['Device Categories', ''],
      ['Desktop', data.deviceCategories.desktop],
      ['Mobile', data.deviceCategories.mobile],
      ['Tablet', data.deviceCategories.tablet],
    ].map(row => row.join(',')).join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Google Analytics</h1>
          <p className="text-muted-foreground">
            Website traffic and user engagement metrics
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            className="rounded-md border px-3 py-2"
            value={`${dateRange.startDate}-${dateRange.endDate}`}
            onChange={(e) => {
              const [start, end] = e.target.value.split('-');
              setDateRange({ startDate: start, endDate: end });
            }}
          >
            <option value="7daysAgo-today">Last 7 days</option>
            <option value="30daysAgo-today">Last 30 days</option>
            <option value="90daysAgo-today">Last 90 days</option>
          </select>

          <Button 
            onClick={handleExport} 
            className="flex items-center gap-2"
            disabled={!data}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Real-time users card */}
      <motion.div
        className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">Real-time Users</h2>
        </div>
        <div className="text-3xl font-bold">{realTimeUsers}</div>
        <p className="text-sm text-muted-foreground mt-1">Currently active on the site</p>
      </motion.div>

      {/* Main metrics grid */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <MousePointer className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Sessions</h3>
            </div>
            <div className="text-2xl font-bold">{data.sessions}</div>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <ArrowUpRight className="h-5 w-5 text-red-500" />
              <h3 className="font-medium">Bounce Rate</h3>
            </div>
            <div className="text-2xl font-bold">{data.bounceRate}%</div>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Timer className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Avg. Session</h3>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(data.averageSessionDuration / 60)}m
            </div>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-5 w-5 text-purple-500" />
              <h3 className="font-medium">Page Views</h3>
            </div>
            <div className="text-2xl font-bold">{data.pageViews}</div>
          </motion.div>
        </div>
      )}

      {/* Detailed statistics */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Categories */}
          <motion.div
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Device Categories</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(data.deviceCategories).map(([device, count]) => (
                <div key={device} className="flex justify-between items-center">
                  <span className="capitalize">{device}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Countries */}
          <motion.div
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Top Countries</h3>
            </div>
            <div className="space-y-4">
              {data.countries.map(({ country, users }) => (
                <div key={country} className="flex justify-between items-center">
                  <span>{country}</span>
                  <span className="font-medium">{users}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Traffic Sources */}
          <motion.div
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Traffic Sources</h3>
            </div>
            <div className="space-y-4">
              {data.sources.map(({ source, users }) => (
                <div key={source} className="flex justify-between items-center">
                  <span>{source}</span>
                  <span className="font-medium">{users}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}