import { useEffect } from 'react';

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
}

export function useWebVitals(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Import web-vitals de manière dynamique
    import('web-vitals').then((webVitals) => {
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = webVitals;
      
      const reportWebVital = (metric: WebVitalsMetric): void => {
        // Log en développement
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Web Vitals] ${metric.name}:`, metric.value);
        }

        // Envoi des métriques en production (optionnel)
        if (process.env.NODE_ENV === 'production') {
          // Vous pouvez envoyer à votre service d'analytics ici
          // analytics.track('Web Vitals', {
          //   metric: metric.name,
          //   value: metric.value,
          //   id: metric.id
          // });
        }
      };

      onCLS(reportWebVital);
      onINP(reportWebVital); // Remplace FID
      onFCP(reportWebVital);
      onLCP(reportWebVital);
      onTTFB(reportWebVital);
    }).catch(error => {
      console.warn('Web Vitals failed to load:', error);
    });
  }, []);
} 