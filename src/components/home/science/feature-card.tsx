import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
  stats: string[];
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, stats, index }: FeatureCardProps) {
  return (
    <motion.div
      className="relative pl-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
    >
      <dt className="flex flex-col">
        <div className="absolute left-0 top-1 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/5 backdrop-blur-sm">
          <Icon className="h-7 w-7 text-primary/70" />
        </div>
        <div className="text-xl font-semibold text-foreground">
          {title}
        </div>
      </dt>
      <dd className="mt-3">
        <p className="text-base text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
        <div className="space-y-2">
          {stats.map((stat, i) => (
            <p key={i} className="text-sm text-emerald-600">
              {stat}
            </p>
          ))}
        </div>
      </dd>
    </motion.div>
  );
}