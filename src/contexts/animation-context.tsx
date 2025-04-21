import { createContext, useContext, useState } from 'react';
import { usePerformance } from '@/hooks/use-performance';

interface AnimationContextType {
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  usePerformance();

  return (
    <AnimationContext.Provider value={{ reduceMotion, setReduceMotion }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
}