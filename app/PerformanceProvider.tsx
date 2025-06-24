import React from 'react';
'use client';

import { useWebVitals } from '../hooks/useWebVitals';
import { PageLoader } from '../components/shared/ui/PageLoader';

export interface PerformanceProviderProps {
  children: React.ReactNode;
}

export default function PerformanceProvider({ children }: PerformanceProviderProps): JSX.Element {
  // Initialize Web Vitals
  useWebVitals();

  return (
    <>
      {/* Global page loader */}
      <PageLoader />
      
      {children}
    </>
};
}
