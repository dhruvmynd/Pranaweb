import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { Button } from '@/components/ui/button';

interface TechniqueCardProps {
  title: string;
  description: string;
  benefits: string[];
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: IconType;
  index: number;
}

export function TechniqueCard({ 
  title, 
  description, 
  benefits, 
  duration, 
  level, 
  icon: Icon,
  index 
}: TechniqueCardProps) {
  return (
    <motion.div
      className="technique-card overflow-hidden rounded-2xl border bg-white/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
    >
      <div className="p-6">
        <div className="flex items-center gap-x-3">
          <Icon className="h-8 w-8 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </div>
        
        <p className="mt-4 text-muted-foreground">{description}</p>
        
        <div className="mt-4 flex gap-x-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Duration: </span>
            <span className="font-medium text-foreground">{duration}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Level: </span>
            <span className="font-medium text-foreground">{level}</span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-foreground">Benefits:</h4>
          <ul className="mt-2 space-y-1">
            {benefits.map((benefit, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                • {benefit}
              </li>
            ))}
          </ul>
        </div>

        <Button className="mt-6 w-full">Learn More</Button>
      </div>
    </motion.div>
  );
}