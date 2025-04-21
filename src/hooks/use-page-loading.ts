import { useEffect, useRef } from 'react';
import { useLoading } from '@/contexts/loading-context';

export function usePageLoading(isLoading: boolean) {
  const { setIsLoading, resetLoading } = useLoading();
  const mountedRef = useRef(true);

  useEffect(() => {
    // Set loading state
    setIsLoading(isLoading);

    // Cleanup function to ensure loading state is reset
    return () => {
      if (mountedRef.current) {
        resetLoading();
      }
    };
  }, [isLoading, setIsLoading, resetLoading]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
}