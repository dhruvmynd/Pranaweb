import { motion } from 'framer-motion';
import { FaHeart, FaBrain } from 'react-icons/fa';
import { IoMdBatteryFull } from 'react-icons/io';
import { IoFlash } from 'react-icons/io5';

export function BenefitsSection() {
  const benefits = [
    {
      icon: FaHeart,
      title: "Heart Rate Variability",
      description: "Improve your cardiovascular health and stress resilience through optimized breathing patterns."
    },
    {
      icon: FaBrain,
      title: "Mental Clarity",
      description: "Enhance focus, memory, and cognitive performance through increased oxygen efficiency."
    },
    {
      icon: IoMdBatteryFull,
      title: "Energy Management",
      description: "Learn to regulate your energy levels throughout the day using breath as a natural tool."
    },
    {
      icon: IoFlash,
      title: "Stress Reduction",
      description: "Activate your body's natural relaxation response through guided breathing practices."
    }
  ];

  return (
    <div className="py-24 sm:py-32 bg-primary/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl lg:text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Transform Your Well-being
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Experience profound benefits that extend beyond the practice session,
            enhancing every aspect of your daily life.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="flex gap-x-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}