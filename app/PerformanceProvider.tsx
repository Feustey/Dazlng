'use client';
import React, { useEffect, useState } from 'react';
import { useWebVitals } from '../hooks/useWebVitals';

export interface PerformanceProviderProps {
  children: React.ReactNode;
}

export default function PerformanceProvider({ children }: PerformanceProviderProps): JSX.Element {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Initialize Web Vitals
  useWebVitals();

  useEffect(() => {
    // Marquer le chargement initial comme terminé
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);

    // Optimisations de performance
    const optimizePerformance = () => {
      // Préchargement des ressources critiques
      const criticalResources = [
        '/assets/images/logo-daznode.svg',
        '/assets/images/dazia-illustration.png',
        '/api/user',
        '/api/network/stats'
      ];

      criticalResources.forEach(url => {
        if (url.startsWith('/assets/')) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = url;
          document.head.appendChild(link);
        } else {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'fetch';
          link.href = url;
          document.head.appendChild(link);
        }
      });

      // Optimisation des polices
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          document.body.classList.add('fonts-loaded');
        });
      }

      // Optimisation des images lazy loading
      if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.loading = 'eager';
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      }
    };

    // Exécuter les optimisations après un délai
    const optimizationTimer = setTimeout(optimizePerformance, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(optimizationTimer);
    };
  }, []);

  return (
    <div className={`performance-provider ${isInitialLoad ? 'loading' : 'loaded'}`}>
      {children}
    </div>
  );
}
export const dynamic = "force-dynamic";
