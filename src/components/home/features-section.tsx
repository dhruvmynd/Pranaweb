import { motion } from 'framer-motion';
import { FaWind, FaBrain } from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';
import { FeatureCard } from './feature-card';

const features = [
  {
    icon: FaWind,
    title: "Bhastrika Pranayama",
    description: 'Known as "Bellows Breath," this energizing technique increases vitality and mental clarity through rapid and forceful breathing.'
  },
  {
    icon: GiSparkles,
    title: "Kapalbhati",
    description: "A powerful cleansing technique that helps detoxify the body and stimulate the brain through rhythmic breathing patterns."
  },
  {
    icon: FaBrain,
    title: "Guided Sessions",
    description: "Expert-led breathing sessions that help you master techniques and track your progress across devices."
  }
];

export function FeaturesSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl lg:text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-base font-semibold leading-7 text-primary">
            Breathing Techniques
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ancient Wisdom Meets Modern Science
          </p>
        </motion.div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}