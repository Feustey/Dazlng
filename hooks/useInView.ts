'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

interface UseInViewReturn {
  ref: React.RefObject<HTMLElement | null>;
  inView: boolean;
  entry?: IntersectionObserverEntry;
}

export function useInView(options: UseInViewOptions = {}): UseInViewReturn {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const ref = useRef<HTMLElement | null>(null);

  const { 
    threshold = 0.1, 
    rootMargin = '0px', 
    triggerOnce = true,
    delay = 0
  } = options;

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [observerEntry] = entries;
    setEntry(observerEntry);
    
    if (observerEntry.isIntersecting) {
      if (delay > 0) {
        setTimeout(() => {
          setInView(true);
        }, delay);
      } else {
        setInView(true);
      }
      
      if (triggerOnce && ref.current) {
        observer?.unobserve(ref.current);
      }
    } else if (!triggerOnce) {
      setInView(false);
    }
  }, [delay, triggerOnce]);

  let observer: IntersectionObserver | undefined;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if we're in the browser and support IntersectionObserver
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      // Fallback: considérer comme visible immédiatement
      setInView(true);
      return;
    }

    observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    observer.observe(element);

    return () => {
      if (observer && element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, handleIntersection]);

  return { ref, inView, entry };
}

// Hook pour animations avec classe CSS
export function useInViewAnimation(
  animationClass = 'animate-fade-in',
  options: UseInViewOptions = {}
) {
  const { ref, inView } = useInView(options);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (inView) {
      element.classList.add(animationClass);
    } else if (!options.triggerOnce) {
      element.classList.remove(animationClass);
    }
  }, [inView, animationClass, options.triggerOnce]);

  return { ref, inView };
}

// Hook pour multiple éléments
export function useInViewList(
  count: number,
  options: UseInViewOptions = {}
) {
  const [inViewStates, setInViewStates] = useState<boolean[]>(
    new Array(count).fill(false)
  );
  
  const refs = useRef<(HTMLElement | null)[]>(new Array(count).fill(null));

  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      // Fallback: tout visible
      setInViewStates(new Array(count).fill(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = refs.current.findIndex(ref => ref === entry.target);
          if (index !== -1) {
            setInViewStates(prev => {
              const newStates = [...prev];
              newStates[index] = entry.isIntersecting;
              return newStates;
            });
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    );

    refs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [count, options.threshold, options.rootMargin]);

  const setRef = useCallback((index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  }, []);

  return { inViewStates, setRef };
}

// Utilitaires pour les animations CSS
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  zoomIn: 'animate-zoom-in',
  zoomOut: 'animate-zoom-out'
} as const;

export type AnimationClass = typeof animationClasses[keyof typeof animationClasses]; 