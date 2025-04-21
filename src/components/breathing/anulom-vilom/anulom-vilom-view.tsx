import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { BreathingLayout } from '../layout/breathing-layout';
import { useBreathingSession } from '../hooks/use-breathing-session';

export function AnulomVilomView() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { 
    isBreathing,
    isSessionReady,
    sessionDuration,
    toggleBreathing
  } = useBreathingSession({
    technique: 'AnulomVilom',
    userId: user?.id,
    onError: (message) => setError(message)
  });

  return (
    <BreathingLayout
      title="Anulom Vilom Breathing"
      gradientColors={['from-green-600/80', 'to-emerald-500']}
      isBreathing={isBreathing}
      isReady={isSessionReady}
      duration={sessionDuration}
      error={error}
      onErrorDismiss={() => setError(null)}
      onToggle={toggleBreathing}
    />
  );
}