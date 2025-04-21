import { motion } from 'framer-motion';

export function HeroBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <motion.div 
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div 
          className="absolute inset-0 bg-[url('/mountain.webp')] bg-cover bg-center"
          style={{ willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
      </motion.div>
    </div>
  );
}