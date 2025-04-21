import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

interface PracticeChartProps {
  sessions: PracticeSession[];
}

interface PracticeSession {
  technique: string;
  duration: number;
  average_heart_rate?: number;
}

export function PracticeChart({ sessions }: PracticeChartProps) {
  // Group sessions by technique and calculate total minutes
  const techniqueStats = sessions.reduce((acc, session) => {
    const technique = session.technique;
    if (!acc[technique]) {
      acc[technique] = {
        totalMinutes: 0,
        averageHeartRate: 0,
        sessionsWithHeartRate: 0
      };
    }
    acc[technique].totalMinutes += session.duration / 60; // Convert seconds to minutes
    if (session.average_heart_rate) {
      acc[technique].averageHeartRate += session.average_heart_rate;
      acc[technique].sessionsWithHeartRate++;
    }
    return acc;
  }, {} as Record<string, { totalMinutes: number; averageHeartRate: number; sessionsWithHeartRate: number }>);

  // Convert to array and calculate final averages
  const techniqueData = Object.entries(techniqueStats).map(([technique, stats]) => ({
    technique,
    totalMinutes: Math.round(stats.totalMinutes),
    averageHeartRate: stats.sessionsWithHeartRate 
      ? Math.round(stats.averageHeartRate / stats.sessionsWithHeartRate)
      : 0
  }));

  // Sort by total minutes descending
  techniqueData.sort((a, b) => b.totalMinutes - a.totalMinutes);

  // Find the maximum minutes for scaling
  const maxMinutes = Math.max(...techniqueData.map(d => d.totalMinutes));

  return (
    <div className="rounded-xl bg-white/50 backdrop-blur-sm p-6 shadow-sm border h-full">
      <h3 className="text-lg font-semibold mb-6">Practice Distribution</h3>
      <div className="space-y-6">
        {techniqueData.map(({ technique, totalMinutes, averageHeartRate }, index) => (
          <motion.div
            key={technique}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{technique}</span>
              <div className="flex items-center gap-4">
                {averageHeartRate > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <FaHeart className="h-4 w-4 text-primary" />
                    <span>{averageHeartRate} BPM</span>
                  </div>
                )}
                <span className="text-sm text-muted-foreground w-20 text-right">
                  {totalMinutes} mins
                </span>
              </div>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 to-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(totalMinutes / maxMinutes) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}