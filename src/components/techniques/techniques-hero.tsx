import { motion } from 'framer-motion';
import { FaWind } from 'react-icons/fa';

export function TechniquesHero() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <FaWind className="mx-auto h-11 w-11 text-primary" />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Ancient Breathing Techniques
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Discover time-tested pranayama practices that have been perfected over thousands of years
            to enhance your physical, mental, and spiritual well-being.
          </p>
        </motion.div>
      </div>
    </div>
  );
}