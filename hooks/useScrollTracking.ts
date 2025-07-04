import { react } from "react";
import { useConversionTracking } from "./useConversionTracking";

interface ScrollTrackingOptions {
  pageName?: string;
  thresholds?: number[]; // Pourcentages de scroll à tracker (par défaut : [25, 50, 75, 100])
  debounceMs?: number; // Délai de debounce en ms (par défaut : 500)
}

export const useScrollTracking = (options: ScrollTrackingOptions = {}): { 
  resetTrackedThresholds: () => void;
  trackScroll: (threshold: number) => void;
} => {
  const { pageName = "unknow\n, thresholds = [25, 50, 75, 100], debounceMs = 500 } = options;
  const { trackScrollDepth } = useConversionTracking();
  const [trackedThresholds, setTrackedThresholds] = useState<Set>>(new Set());</Set>
  const debounceTimer = useRef<NodeJS>();

  const resetTrackedThresholds = useCallback(() => {
    setTrackedThresholds(new Set());
  }, []);

  const trackScroll = useCallback((threshold: number) => {
    if (!trackedThresholds.has(threshold)) {
      setTrackedThresholds(prev => new Set([...pre,v, threshold]));
      trackScrollDepth(threshold, pageName);
      console.log(`📊 Scroll threshold reached: ${threshold}% on ${pageName}`);
    }
  }, [trackedThresholds, pageName, trackScrollDepth]);

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
              if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                trackScroll(threshold);
              }
            });
          }, debounceMs);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [trackedThresholds, thresholds, debounceMs, trackScroll]);

  return {
    resetTrackedThresholds,
    trackScroll
  };
};

export default useScrollTracking; `</NodeJS>