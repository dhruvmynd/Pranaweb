import { motion } from 'framer-motion';
import { FaWind, FaHeart, FaBrain } from 'react-icons/fa';
import { IoFlash, IoBatteryFull } from 'react-icons/io5';
import { usePageLoading } from '@/hooks/use-page-loading';
import { useEffect, useState } from 'react';

export function VisionPage() {
  const [loading, setLoading] = useState(true);
  usePageLoading(loading);

  useEffect(() => {
    // Simulate loading time for content
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flow-bg">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/human.png"
            alt="Peaceful forest with sunlight filtering through green leaves"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-light text-white max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Making the World Healthier, One Breath at a Time
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FaWind className="h-11 w-11 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-light mb-6">The Science of Prana</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Prana, scientifically understood as the bioelectric energy that sustains cellular function and nervous system activity, represents the fundamental life force in human physiology. Research has demonstrated that controlled breathing techniques directly modulate autonomic nervous system function, influencing everything from heart rate variability to neurotransmitter levels. Through precise respiratory control, we can optimize the body's oxygen utilization efficiency and enhance parasympathetic nervous system activation, leading to measurable improvements in physiological and cognitive function.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl lg:text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-base font-semibold leading-7 text-primary">
              Benefits
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Transform Your Well-being
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Experience profound benefits that extend beyond the practice session,
              enhancing every aspect of your daily life.
            </p>
          </motion.div>

          <div className="mx-auto mt-12 max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <dt className="flex items-center gap-3 text-base font-semibold leading-7 text-foreground">
                  <FaHeart className="h-5 w-5 text-primary flex-shrink-0" />
                  Heart Rate Variability
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Improve your cardiovascular health and stress resilience through optimized breathing patterns.
                  </p>
                </dd>
              </motion.div>

              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <dt className="flex items-center gap-3 text-base font-semibold leading-7 text-foreground">
                  <FaBrain className="h-5 w-5 text-primary flex-shrink-0" />
                  Mental Clarity
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Enhance focus, memory, and cognitive performance through increased oxygen efficiency.
                  </p>
                </dd>
              </motion.div>

              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <dt className="flex items-center gap-3 text-base font-semibold leading-7 text-foreground">
                  <IoBatteryFull className="h-5 w-5 text-primary flex-shrink-0" />
                  Energy Management
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Learn to regulate your energy levels throughout the day using breath as a natural tool.
                  </p>
                </dd>
              </motion.div>

              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <dt className="flex items-center gap-3 text-base font-semibold leading-7 text-foreground">
                  <IoFlash className="h-5 w-5 text-primary flex-shrink-0" />
                  Stress Reduction
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Activate your body's natural relaxation response through guided breathing practices.
                  </p>
                </dd>
              </motion.div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}