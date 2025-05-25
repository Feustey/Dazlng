import { useEffect, useRef } from 'react';
import { useConversionTracking } from './useConversionTracking';

interface ScrollTrackingOptions {
  pageName: string;
  thresholds?: number[]; // Pourcentages de scroll à tracker (par défaut : [25, 50, 75, 100])
  debounceMs?: number; // Délai de debounce en ms (par défaut : 500)
}

export const useScrollTracking = ({
  pageName,
  thresholds = [25, 50, 75, 100],
  debounceMs = 500
}: ScrollTrackingOptions): { resetTrackedThresholds: () => void } => {
  const { trackScrollDepth } = useConversionTracking();
  const trackedThresholds = useRef<Set<number>>(new Set());
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let ticking = false;

    const handleScroll = (): void => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = Math.round((scrollTop / docHeight) * 100);

          // Clear previous debounce timer
          if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
          }

          // Debounce the tracking
          debounceTimer.current = setTimeout(() => {
            thresholds.forEach(threshold => {
              if (scrollPercent >= threshold && !trackedThresholds.current.has(threshold)) {
                trackedThresholds.current.add(threshold);
                trackScrollDepth(threshold, pageName);
              }
            });
          }, debounceMs);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [pageName, thresholds, debounceMs, trackScrollDepth]);

  // Fonction pour reset les seuils trackés (utile pour les SPA)
  const resetTrackedThresholds = (): void => {
    trackedThresholds.current.clear();
  };

  return { resetTrackedThresholds };
};

export default useScrollTracking; 