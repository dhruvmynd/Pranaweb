import { motion } from 'framer-motion';

export function AmbientOverlay() {
  return (
    <div className="absolute inset-0 -z-5 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[1px]"></div>
    </div>
  );
}