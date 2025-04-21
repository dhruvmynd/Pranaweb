import { FaWind, FaStethoscope, FaBrain, FaMoon } from 'react-icons/fa';
import { TechniqueCard } from './technique-card';

const techniques = [
  {
    title: "Anulom Vilom",
    description: "Alternate nostril breathing technique that balances the left and right hemispheres of the brain, promoting mental clarity and emotional stability.",
    benefits: [
      "Reduces anxiety and stress",
      "Improves focus and concentration",
      "Balances hormones",
      "Enhances lung capacity"
    ],
    duration: "5-15 minutes",
    level: "Beginner",
    icon: FaStethoscope
  },
  {
    title: "Bhastrika",
    description: "Known as 'Bellows Breath,' this energizing technique increases vitality and mental clarity through rapid and forceful breathing.",
    benefits: [
      "Boosts energy levels",
      "Improves digestion",
      "Strengthens respiratory system",
      "Enhances oxygen delivery"
    ],
    duration: "5-10 minutes",
    level: "Intermediate",
    icon: FaWind
  },
  {
    title: "Kapalbhati",
    description: "A powerful cleansing technique that helps detoxify the body and stimulate the brain through rhythmic breathing patterns.",
    benefits: [
      "Cleanses respiratory system",
      "Reduces bloating",
      "Improves mental clarity",
      "Strengthens core muscles"
    ],
    duration: "3-7 minutes",
    level: "Intermediate",
    icon: FaBrain
  },
  {
    title: "Chandra Bhedana",
    description: "Moon piercing breath that activates the ida nadi (moon channel), promoting calmness and reducing stress through left-nostril breathing.",
    benefits: [
      "Calms nervous system",
      "Improves sleep quality",
      "Reduces blood pressure",
      "Balances emotions"
    ],
    duration: "5-10 minutes",
    level: "Beginner",
    icon: FaMoon
  }
] as const;

export function TechniquesList() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {techniques.map((technique, index) => (
            <TechniqueCard
              key={technique.title}
              {...technique}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}