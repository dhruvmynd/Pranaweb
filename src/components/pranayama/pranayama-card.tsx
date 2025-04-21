import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PranayamaCardProps {
  title: string;
  description: string;
  benefits: string[];
  duration: string;
  icon: IconType;
  index: number;
  blogSlug?: string;
}

export function PranayamaCard({ 
  title, 
  description, 
  benefits, 
  duration, 
  icon: Icon,
  index,
  blogSlug 
}: PranayamaCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border bg-white/50 backdrop-blur-sm h-full flex flex-col hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-6 flex flex-col flex-1 relative">
        <div className="flex items-center gap-x-3">
          <div className="rounded-xl bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </div>
        
        <p className="mt-4 text-muted-foreground">{description}</p>
        
        <div className="mt-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Duration: </span>
            <span className="font-medium text-foreground">{duration}</span>
          </div>
        </div>

        <div className="mt-4 flex-1">
          <h4 className="text-sm font-medium text-foreground">Benefits:</h4>
          <ul className="mt-2 space-y-1">
            {benefits.map((benefit, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary/60" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {blogSlug && (
          <div className="mt-6">
            <Button 
              as={Link} 
              to={`/vidhya/${blogSlug}`}
              className="w-full bg-primary/90 hover:bg-primary text-white transition-colors duration-300"
            >
              Learn More
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}