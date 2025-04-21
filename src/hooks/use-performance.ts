import { useEffect, useRef } from 'react';

export function usePerformance(threshold = 30) {
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    let rafId: number;

    const measure = (time: number) => {
      const delta = time - lastTimeRef.current;
      frameRef.current++;

      if (delta >= 1000) {
        const fps = (frameRef.current * 1000) / delta;
        frameRef.current = 0;
        lastTimeRef.current = time;

        document.documentElement.style.setProperty(
          '--reduce-motion', 
          fps < threshold ? '1' : '0'
        );
      }

      rafId = requestAnimationFrame(measure);
    };

    rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, [threshold]);
}