import { InteractiveCircle } from './interactive-circle';
import { BreathingGuide } from './breathing-guide';
import { AmbientParticles } from './ambient-particles';

export function BreathingSection() {
  return (
    <div className="relative min-h-screen">
      <InteractiveCircle />
      <BreathingGuide />
      <AmbientParticles />
    </div>
  );
}