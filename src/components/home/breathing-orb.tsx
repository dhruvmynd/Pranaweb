import { motion } from 'framer-motion';

export function BreathingOrb() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Core breathing orb */}
        <motion.div
          className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Inner energy rings */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/5 to-transparent"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1, 0.8],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Outer energy field */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-bl from-accent/5 to-transparent"
          animate={{
            rotate: [360, 0],
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  );
}