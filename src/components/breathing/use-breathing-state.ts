import { useState, useEffect } from 'react';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export function useBreathingState() {
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const durations = {
      inhale: 4000,
      hold: 4000,
      exhale: 4000,
      rest: 2000,
    };

    const nextPhase: Record<BreathingPhase, BreathingPhase> = {
      inhale: 'hold',
      hold: 'exhale',
      exhale: 'rest',
      rest: 'inhale',
    };

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / durations[phase]);
        if (next >= 100) {
          setPhase(nextPhase[phase]);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [phase]);

  return { phase, progress };
}