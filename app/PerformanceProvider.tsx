'use client';

import { useEffect } from 'react';
import { useWebVitals } from '../hooks/useWebVitals';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { PageLoader } from '../components/shared/ui/PageLoader';

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export default function PerformanceProvider({ children }: PerformanceProviderProps): JSX.Element {
  // Initialiser les Web Vitals
  useWebVitals();
  
  // Initialiser le Service Worker
  const { register } = useServiceWorker();

  useEffect(() => {
    // Enregistrer le service worker en production
    if (process.env.NODE_ENV === 'production') {
      register();
    }
  }, [register]);

  return (
    <>
      {/* Loader de page global */}
      <PageLoader />
      
      {children}
      
      {/* Script pour le reporting des erreurs et performances */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Reporting des erreurs JavaScript
            window.addEventListener('error', function(e) {
              console.error('JavaScript Error:', e.error);
              // Vous pouvez envoyer à votre service d'analytics ici
            });
            
            // Reporting des erreurs de ressources
            window.addEventListener('unhandledrejection', function(e) {
              console.error('Unhandled Promise Rejection:', e.reason);
              // Vous pouvez envoyer à votre service d'analytics ici
            });
          `
        }}
      />
    </>
  );
} 