import { motion } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import type { Achievement } from '@/lib/types/achievements';
import { ACHIEVEMENTS } from '@/lib/types/achievements';

interface AchievementCardProps {
  achievements: Achievement[];
}

export function AchievementCard({ achievements }: AchievementCardProps) {
  // Filter to only show unlocked achievements
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);

  // If no achievements are unlocked, show a message
  if (unlockedAchievements.length === 0) {
    return (
      <motion.div
        className="h-full rounded-xl bg-white/50 backdrop-blur-sm p-6 shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTrophy className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Achievements</h3>
          <div className="ml-auto text-sm text-muted-foreground">
            0 / {ACHIEVEMENTS.length} unlocked
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)] text-center">
          <FaTrophy className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-muted-foreground">
            Complete practices to unlock achievements and earn badges
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="h-full rounded-xl bg-white/50 backdrop-blur-sm p-10 shadow-sm border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <FaTrophy className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Achievements</h3>
        <div className="ml-auto text-sm text-muted-foreground">
          {unlockedAchievements.length} / {ACHIEVEMENTS.length} unlocked
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 h-[calc(100%-4rem)] overflow-y-auto custom-scrollbar pr-2">
        {unlockedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className="relative rounded-lg p-10 pt-12 border bg-primary/5 border-primary/20 flex flex-col items-center text-center"
          >
            {/* Trophy icon */}
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
              <FaTrophy className="h-4 w-4" />
            </div>

            {/* Badge image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3">
              <img
                src={achievement.icon}
                alt={achievement.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h4 className="text-base font-medium text-primary mb-1">
                {achievement.name}
              </h4>
              
              <p className="text-xs text-muted-foreground mb-2">
                {achievement.description}
              </p>

              {achievement.unlockedAt && (
                <p className="text-xs text-primary">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}