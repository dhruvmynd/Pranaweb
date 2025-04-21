import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/animation-context';

export function EnergyField() {
  const { reduceMotion } = useAnimation();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-transparent hardware-accelerated"
        animate={reduceMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}