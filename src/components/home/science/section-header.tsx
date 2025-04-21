import { motion } from 'framer-motion';

export function SectionHeader() {
  return (
    <motion.div 
      className="mx-auto max-w-2xl lg:text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-base font-semibold leading-7 text-primary">
        The Science
      </h2>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Backed by Research and Innovation
      </p>
      <p className="mt-6 text-lg leading-8 text-muted-foreground">
        Our unique approach combines ancient wisdom with cutting-edge technology. Research shows that controlled breathing techniques can increase Heart Rate Variability by up to 40% and reduce stress hormones by 23% in just 8 weeks of regular practice.
      </p>
    </motion.div>
  );
}