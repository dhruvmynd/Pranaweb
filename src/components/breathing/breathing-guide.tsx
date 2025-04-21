import { motion } from 'framer-motion';
import { useBreathingState } from './use-breathing-state';

export function BreathingGuide() {
  const { phase } = useBreathingState();
  
  return (
    <motion.div
      className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-medium text-primary/80 backdrop-blur-sm px-4 py-2 rounded-full bg-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {phase === 'inhale' && 'Breathe In'}
      {phase === 'hold' && 'Hold'}
      {phase === 'exhale' && 'Breathe Out'}
      {phase === 'rest' && 'Rest'}
    </motion.div>
  );
}