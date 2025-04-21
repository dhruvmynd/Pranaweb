import { createContext, useContext, useState, useCallback } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoadingSpinner: (show: boolean) => void;
  isLoadingSpinnerVisible: boolean;
  resetLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSpinnerVisible, setIsLoadingSpinnerVisible] = useState(false);

  const showLoadingSpinner = useCallback((show: boolean) => {
    setIsLoadingSpinnerVisible(show);
  }, []);
  
  const resetLoading = useCallback(() => {
    setIsLoading(false);
    setIsLoadingSpinnerVisible(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      setIsLoading, 
      showLoadingSpinner,
      isLoadingSpinnerVisible,
      resetLoading
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}