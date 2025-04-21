import { motion } from 'framer-motion';
import { useBreathingState } from './use-breathing-state';

export function InteractiveCircle() {
  const { phase } = useBreathingState();

  const circleVariants = {
    inhale: {
      scale: 1.3,
      opacity: 0.8,
    },
    hold: {
      scale: 1.3,
      opacity: 0.8,
    },
    exhale: {
      scale: 1,
      opacity: 0.3,
    },
    rest: {
      scale: 1,
      opacity: 0.3,
    },
  };

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-3xl"
          variants={circleVariants}
          animate={phase}
          transition={{
            duration: phase === 'inhale' || phase === 'exhale' ? 4 : 0.1,
            ease: "easeInOut"
          }}
        />
        
        {/* Ambient circles */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-transparent"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-bl from-accent/10 to-transparent"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}