// src/components/home/backgrounds/mountain-background.tsx
import { motion, useScroll, useTransform } from 'framer-motion';

export function MountainBackground() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ y }}
      >
        {/* Mountain background */}
        <div 
          style={{ 
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/mountain.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            willChange: 'transform'
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />
      </motion.div>
    </div>
  );
}
