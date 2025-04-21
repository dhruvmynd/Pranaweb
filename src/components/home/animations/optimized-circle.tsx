import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/animation-context';

export function OptimizedCircle() {
  const { reduceMotion } = useAnimation();

  const variants = {
    animate: {
      scale: reduceMotion ? 1 : [1, 1.1, 1],
      opacity: reduceMotion ? 0.3 : [0.3, 0.15, 0.3],
    }
  };

  return (
    <motion.div
      className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl hardware-accelerated"
      variants={variants}
      animate="animate"
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}