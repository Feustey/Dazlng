import React from 'react';
'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useWebVitals } from '@/hooks/useWebVitals';
import { useCache } from '@/hooks/useCache';

export interface PerformanceProviderProps {
  children: React.ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const webVitalsRef = useRef<any>(null);
  
  // Monitorer les Web Vitals
  useWebVitals((metric: any) => {
    webVitalsRef.current = {
      ...webVitalsRef.current,
      [metric.name]: metric.value
    };
  });

  // Optimisation du cache
  const { initCache } = useCache();
  
  useEffect(() => {
    // Initialiser le cache
    initCache();

    // Précharger les ressources critiques
    const preloadCriticalResources = () => {
      const criticalUrls = [
        '/api/user',
        '/api/network/stats',
        // Ajoutez d'autres URLs critiques ici
      ];

      criticalUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'fetch';
        link.href = url;
        document.head.appendChild(link);
      });
    };

    // Optimiser les images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
          if (img.getBoundingClientRect().top < window.innerHeight) {
            img.loading = 'eager';
          }
        });
      }
    };

    // Optimiser les polices
    const optimizeFonts = () => {
      if ('fonts' in document) {
        // Précharger les polices principales
        const fontUrls = [
          '/fonts/inter-var.woff2',
          // Ajoutez d'autres polices ici
        ];

        fontUrls.forEach(url => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = 'anonymous';
          link.href = url;
          document.head.appendChild(link);
        });
      }
    };

    // Optimiser la navigation
    const optimizeNavigation = () => {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        if (link.hostname === window.location.hostname) {
          link.addEventListener('mouseover', () => {
            const href = link.getAttribute('href');
            if (href) {
              const prefetchLink = document.createElement('link');
              prefetchLink.rel = 'prefetch';
              prefetchLink.href = href;
              document.head.appendChild(prefetchLink);
            }
          });
        }
      });
    };

    // Exécuter les optimisations
    preloadCriticalResources();
    optimizeImages();
    optimizeFonts();
    optimizeNavigation();

    // Nettoyer
    return () => {
      document.querySelectorAll('link[rel="preload"]').forEach(el => el.remove());
      document.querySelectorAll('link[rel="prefetch"]').forEach(el => el.remove());
    };
  }, []);

  return <>{children}</>;
}
