import { BarChart3, Brain, Vibrate } from 'lucide-react';
import { FeatureCard } from './feature-card';

const features = [
  {
    icon: BarChart3,
    title: "Informed Analytics",
    description: "Advanced biometric tracking and analysis provides personalized insights into your breathing patterns, heart rate variability, and overall practice effectiveness.",
    stats: [
      "↑ 28% improvement in cognitive performance",
      "↓ 35% reduction in perceived stress levels",
      "↑ 40% increase in focus duration"
    ]
  },
  {
    icon: Vibrate,
    title: "Vibrational Guidance",
    description: "Precisely calibrated vibrations help you maintain optimal breathing rhythm, enhancing oxygen uptake and nervous system balance.",
    stats: [
      "↑ 15-20% increase in oxygen saturation",
      "↓ 31% reduction in breathing rate",
      "↑ 25% improvement in respiratory efficiency"
    ]
  },
  {
    icon: Brain,
    title: "Performance Metrics",
    description: "Track your progress with detailed metrics including session duration, breathing consistency, and physiological responses to different techniques.",
    stats: [
      "↑ 45% better sleep quality scores",
      "↓ 29% decrease in anxiety markers",
      "↑ 33% improvement in recovery time"
    ]
  }
];

export function FeatureList() {
  return (
    <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
      {features.map((feature, index) => (
        <FeatureCard key={feature.title} {...feature} index={index} />
      ))}
    </dl>
  );
}