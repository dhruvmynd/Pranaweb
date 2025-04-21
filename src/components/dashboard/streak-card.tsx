import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <motion.div
      className="h-full rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-6 shadow-sm border backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <FaFire className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Practice Streak</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Current</p>
          <p className="text-3xl font-bold mt-1">{currentStreak}</p>
          <p className="text-sm text-muted-foreground">days</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Longest</p>
          <p className="text-3xl font-bold mt-1">{longestStreak}</p>
          <p className="text-sm text-muted-foreground">days</p>
        </div>
      </div>
    </motion.div>
  );
}