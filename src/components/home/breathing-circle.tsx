import { motion } from 'framer-motion';

export function BreathingCircle() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative w-[1200px] h-[1200px]">
        {/* Main breathing circle */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.15, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Inner pulsing ring */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/40 to-transparent blur-2xl"
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.4, 0.2, 0.4],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Outer energy field */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-bl from-accent/30 to-transparent blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Central energy core */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl"
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}