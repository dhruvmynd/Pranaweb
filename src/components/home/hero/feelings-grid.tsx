import { motion } from 'framer-motion';

const feelings = [
  { text: 'Calm', position: 'bg-[0_0]' },
  { text: 'Bliss', position: 'bg-[33.33%_0]' },
  { text: 'Focus', position: 'bg-[66.66%_0]' },
  { text: 'Asanas', position: 'bg-[100%_0]' }
];

export function FeelingsGrid() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {feelings.map((feeling, index) => (
        <motion.div
          key={feeling.text}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="w-12 h-12 rounded-2xl bg-green-50 mb-2 flex items-center justify-center">
            <div 
              className={`w-8 h-8 bg-[url('/Feelings.png')] bg-cover ${feeling.position}`}
              role="img"
              aria-label={feeling.text}
            />
          </div>
          <span className="text-xs text-gray-600">{feeling.text}</span>
        </motion.div>
      ))}
    </div>
  );
}