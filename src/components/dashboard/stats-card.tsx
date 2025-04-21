import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaGripVertical, FaInfoCircle } from 'react-icons/fa';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  highlight?: boolean;
  tooltip?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  highlight,
  tooltip
}: StatsCardProps) {
  return (
    <motion.div
      className={`rounded-xl p-6 shadow-sm border backdrop-blur-sm h-full ${
        highlight ? 'bg-primary/10' : 'bg-white/50'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${
          highlight ? 'bg-primary/20' : 'bg-primary/10'
        }`}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {tooltip && (
              <div className="group relative">
                <FaInfoCircle className="h-3 w-3 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
          <h3 className="text-2xl font-semibold text-foreground mt-1">{value}</h3>
        </div>
        <div className="ml-auto cursor-move">
          <FaGripVertical className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 border-t pt-4">
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          {trend && (
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}