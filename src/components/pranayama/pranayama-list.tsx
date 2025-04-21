import { FaWind, FaStethoscope, FaBrain } from 'react-icons/fa';
import { PranayamaCard } from './pranayama-card';

const pranayamaTechniques = [
  {
    title: "Alternate Nostril Breathing (Anulom Vilom)",
    description: "Alternate nostril breathing technique that balances the left and right hemispheres of the brain, promoting mental clarity and emotional stability.",
    benefits: [
      "Reduces anxiety and stress",
      "Improves focus and concentration",
      "Balances hormones",
      "Enhances lung capacity"
    ],
    duration: "5-15 minutes",
    icon: FaStethoscope,
    blogSlug: "anulomvilom"
  },
  {
    title: "Bellows Breath (Bhastrika)",
    description: "Known as 'Bellows Breath,' this energizing technique increases vitality and mental clarity through rapid and forceful breathing.",
    benefits: [
      "Boosts energy levels",
      "Improves digestion",
      "Strengthens respiratory system",
      "Enhances oxygen delivery"
    ],
    duration: "5-10 minutes",
    icon: FaWind,
    blogSlug: "Bhastrika"
  },
  {
    title: "Skull Shining Breath (Kapalbhati)",
    description: "Known as 'Skull Shining Breath,' this powerful cleansing technique helps detoxify the body and stimulate the brain through rhythmic breathing patterns.",
    benefits: [
      "Cleanses respiratory system",
      "Reduces bloating",
      "Improves mental clarity",
      "Strengthens core muscles"
    ],
    duration: "5-40 minutes",
    icon: FaBrain,
    blogSlug: "kapalbhati"
  }
] as const;

export function PranayamaList() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pranayamaTechniques.map((technique, index) => (
            <PranayamaCard
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