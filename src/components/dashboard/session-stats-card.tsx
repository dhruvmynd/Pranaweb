import { motion } from 'framer-motion';
import { FaChartLine, FaHeart } from 'react-icons/fa';
import type { SessionStats } from '@/lib/types/ios-sessions';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface SessionStatsCardProps {
  stats: SessionStats[];
}

interface CuratedSession {
  session_name: string;
  count: number;
  avg_duration: number;
  avg_heart_rate: number;
  avg_hrv: number;
}

export function SessionStatsCard({ stats }: SessionStatsCardProps) {
  const { user } = useAuth();
  const [curatedStats, setCuratedStats] = useState<CuratedSession[]>([]);
  const totalSessions = stats.reduce((acc, stat) => acc + Number(stat.count), 0);
  const totalMinutes = Math.round(
    stats.reduce((acc, stat) => acc + Number(stat.avg_duration || 0), 0) / 60
  );

  useEffect(() => {
    if (!user) return;
    
    async function fetchCuratedStats() {
      try {
        const { data, error } = await supabase
          .from('user_analytics')
          .select('curated_session_stats')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching curated stats:', error);
          return;
        }
        
        if (data?.curated_session_stats) {
          setCuratedStats(data.curated_session_stats);
        }
      } catch (err) {
        console.error('Error in fetchCuratedStats:', err);
      }
    }
    
    fetchCuratedStats();
  }, [user]);

  // Separate curated and self-reflection sessions
  const curatedSessions = stats.filter(stat => stat.session_type === 'curated');

  if (stats.length === 0) {
    return (
      <motion.div
        className="h-full rounded-xl bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm p-6 shadow-sm border overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FaChartLine className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Curated Session Overview</h3>
        </div>

        <div className="flex items-center justify-center h-[calc(100%-4rem)]">
          <p className="text-muted-foreground text-center">
            No curated sessions recorded yet.<br />
            Start practicing to see your stats here.
          </p>
        </div>
      </motion.div>
    );
  }
  
  // Combine stats from both sources
  const combinedStats = [...stats];
  
  // Add curated stats if they exist and aren't already in the stats array
  if (curatedStats.length > 0) {
    curatedStats.forEach(curatedStat => {
      // Check if this session name already exists in the stats array
      const existingIndex = combinedStats.findIndex(
        stat => stat.session_name === curatedStat.session_name
      );
      
      if (existingIndex === -1) {
        // Add if not already present
        combinedStats.push({
          session_type: 'curated',
          session_name: curatedStat.session_name,
          count: curatedStat.count,
          avg_duration: curatedStat.avg_duration,
          avg_heart_rate: curatedStat.avg_heart_rate,
          sessions_count: curatedStat.count
        });
      }
    });
  }

  return (
    <motion.div
      className="h-full rounded-xl bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm p-6 shadow-sm border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Fixed header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaChartLine className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Curated Session Overview</h3>
        </div>
        <div className="drag-handle cursor-move">
          <FaChartLine className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Fixed stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium">Total Sessions</p>
          <p className="text-2xl font-bold mt-1 text-primary">{totalSessions}</p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium">Total Minutes</p>
          <p className="text-2xl font-bold mt-1 text-primary">{totalMinutes}</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="space-y-6 overflow-y-auto h-[calc(100%-12rem)] pr-2 custom-scrollbar">
        {/* Curated Sessions */}
        <div className="bg-gradient-to-br from-emerald-50/80 to-emerald-50/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-emerald-700 mb-4">
            Curated Sessions ({combinedStats.length})
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {combinedStats.map((stat) => (
              <div
                key={stat.session_name}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-emerald-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{stat.session_name}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 mt-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {stat.count} sessions
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-sm">
                      {Math.round(Number(stat.avg_duration || 0) / 60)}
                    </span>
                    <p className="text-xs text-muted-foreground">mins avg</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-emerald-100">
                  <div className="flex items-center gap-1">
                    <FaHeart className="h-3 w-3 text-emerald-600" />
                    <span>
                      Avg {Math.round(stat.avg_heart_rate || 0)} BPM
                      {curatedStats.some(cs => cs.session_name === stat.session_name && cs.avg_hrv > 0) && (
                        <span className="ml-2 text-emerald-700">
                          | HRV {Math.round(
                            curatedStats.find(cs => cs.session_name === stat.session_name)?.avg_hrv || 0
                          )} ms
                        </span>
                      )}
                    </span>
                  </div>
                  <span>{Math.round(Number(stat.sessions_count || 0))} total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}