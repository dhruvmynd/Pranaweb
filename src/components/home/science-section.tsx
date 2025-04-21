import { SectionHeader } from './science/section-header';
import { motion } from 'framer-motion';
import { FaBrain, FaChartBar, FaHeartbeat, FaClock } from 'react-icons/fa';
import { GiLungs } from 'react-icons/gi';
import { IoFlash } from 'react-icons/io5';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { Vibrate } from 'lucide-react';

export function ScienceSection() {
  const categories = [
    {
      title: "Cognitive Benefits",
      icon: FaBrain,
      color: "from-blue-500 to-blue-600",
      stats: [
        { value: "28%", label: "Cognitive Performance" },
        { value: "40%", label: "Focus Duration" },
        { value: "35%", label: "Stress Reduction" }
      ]
    },
    {
      title: "Physiological Impact",
      icon: GiLungs,
      color: "from-emerald-500 to-emerald-600",
      stats: [
        { value: "20%", label: "Oxygen Saturation" },
        { value: "31%", label: "Breathing Rate ↓" },
        { value: "25%", label: "Respiratory Efficiency" }
      ]
    },
    {
      title: "Wellness Metrics",
      icon: TbActivityHeartbeat,
      color: "from-purple-500 to-purple-600",
      stats: [
        { value: "45%", label: "Sleep Quality" },
        { value: "29%", label: "Anxiety Reduction" },
        { value: "33%", label: "Recovery Time" }
      ]
    }
  ];

  const features = [
    {
      icon: FaChartBar,
      title: "Informed Analytics",
      description: "Advanced biometric tracking and analysis provides personalized insights into your breathing patterns, heart rate variability, and overall practice effectiveness."
    },
    {
      icon: Vibrate,
      title: "Vibrational Guidance",
      description: "Precisely calibrated vibrations help you maintain optimal breathing rhythm, enhancing oxygen uptake and nervous system balance."
    },
    {
      icon: FaBrain,
      title: "Performance Metrics",
      description: "Track your progress with detailed metrics including session duration, breathing consistency, and physiological responses to different techniques."
    }
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader />
        
        {/* Enhanced Stats Overview */}
        <motion.div 
          className="mt-16 mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid gap-8 lg:grid-cols-3">
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>

                <div className="grid gap-4">
                  {category.stats.map((stat, statIndex) => (
                    <motion.div
                      key={stat.label}
                      className="relative"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (categoryIndex * 0.2) + (statIndex * 0.1) }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">{stat.label}</span>
                        <span className="text-lg font-bold text-primary">{stat.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${category.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: stat.value }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: (categoryIndex * 0.2) + (statIndex * 0.1) }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}