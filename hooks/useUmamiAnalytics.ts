import { useEffect, useState } from 'react';
import { umamiService, trackingEvents, UmamiAnalyticsResponse } from '@/lib/services/umami-service';

interface UseUmamiAnalyticsReturn {
  // État
  isUmamiLoaded: boolean;
  analyticsData: UmamiAnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  
  // Fonctions de tracking
  trackEvent: (eventName: string, eventData?: Record<string, any>) => void;
  trackPageView: (url?: string, referrer?: string) => void;
  trackConversion: (type: string, value?: number, currency?: string) => void;
  trackError: (type: string, message: string, stack?: string) => void;
  trackLightningEvent: (type: string, details: Record<string, any>) => void;
  
  // Fonctions prédéfinies
  events: typeof trackingEvents;
  
  // Fonctions de récupération de données
  loadAnalytics: (timeRange?: string) => Promise<void>;
  refreshAnalytics: () => Promise<void>;
}

export function useUmamiAnalytics(): UseUmamiAnalyticsReturn {
  const [isUmamiLoaded, setIsUmamiLoaded] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<UmamiAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier le chargement d'Umami
  useEffect(() => {
    const checkUmami = () => {
      if (typeof window !== 'undefined' && window.umami) {
        setIsUmamiLoaded(true);
        console.log('[UMAMI-HOOK] Script Umami chargé avec succès');
      } else {
        // Réessayer après un délai
        setTimeout(checkUmami, 1000);
      }
    };

    checkUmami();
  }, []);

  // Charger les données analytics
  const loadAnalytics = async (timeRange: string = '7d') => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      // Calculer les dates selon la période sélectionnée
      const endAt = new Date();
      const startAt = new Date();
      
      switch (timeRange) {
        case '24h':
          startAt.setDate(startAt.getDate() - 1);
          break;
        case '7d':
          startAt.setDate(startAt.getDate() - 7);
          break;
        case '30d':
          startAt.setDate(startAt.getDate() - 30);
          break;
        case '90d':
          startAt.setDate(startAt.getDate() - 90);
          break;
      }

      params.append('startAt', startAt.getTime().toString());
      params.append('endAt', endAt.getTime().toString());
      params.append('unit', timeRange === '24h' ? 'hour' : 'day');

      const response = await fetch(`/api/admin/umami-analytics?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const result: UmamiAnalyticsResponse = await response.json();
      
      if (result.success) {
        setAnalyticsData(result);
        console.log('[UMAMI-HOOK] Données analytics chargées:', result.source);
      } else {
        throw new Error('Erreur lors du chargement des analytics');
      }

    } catch (err) {
      console.error('[UMAMI-HOOK] Erreur chargement analytics:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Actualiser les données
  const refreshAnalytics = async () => {
    if (analyticsData) {
      await loadAnalytics();
    }
  };

  // Fonctions de tracking avec vérifications
  const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    if (isUmamiLoaded) {
      umamiService.trackEvent(eventName, eventData);
    } else {
      console.log('[UMAMI-HOOK] Event en attente du chargement:', eventName, eventData);
    }
  };

  const trackPageView = (url?: string, referrer?: string) => {
    if (isUmamiLoaded) {
      umamiService.trackPageView(url, referrer);
    } else {
      console.log('[UMAMI-HOOK] Page view en attente du chargement:', url);
    }
  };

  const trackConversion = (type: string, value?: number, currency?: string) => {
    if (isUmamiLoaded) {
      umamiService.trackConversion(type, value, currency);
    } else {
      console.log('[UMAMI-HOOK] Conversion en attente du chargement:', type, value);
    }
  };

  const trackError = (type: string, message: string, stack?: string) => {
    if (isUmamiLoaded) {
      umamiService.trackError(type, message, stack);
    } else {
      console.log('[UMAMI-HOOK] Erreur en attente du chargement:', type, message);
    }
  };

  const trackLightningEvent = (type: string, details: Record<string, any>) => {
    if (isUmamiLoaded) {
      umamiService.trackLightningEvent(type, details);
    } else {
      console.log('[UMAMI-HOOK] Lightning event en attente du chargement:', type, details);
    }
  };

  return {
    // État
    isUmamiLoaded,
    analyticsData,
    loading,
    error,
    
    // Fonctions de tracking
    trackEvent,
    trackPageView,
    trackConversion,
    trackError,
    trackLightningEvent,
    
    // Événements prédéfinis
    events: trackingEvents,
    
    // Fonctions de récupération de données
    loadAnalytics,
    refreshAnalytics
  };
}

// Hook spécialisé pour le tracking automatique de pages
export function useUmamiPageTracking(pathname: string) {
  const { trackPageView, isUmamiLoaded } = useUmamiAnalytics();

  useEffect(() => {
    if (isUmamiLoaded && pathname) {
      // Délai pour s'assurer que la page est bien chargée
      const timer = setTimeout(() => {
        trackPageView(pathname);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, isUmamiLoaded, trackPageView]);
}

// Hook pour tracker automatiquement les erreurs JavaScript
export function useUmamiErrorTracking() {
  const { trackError, isUmamiLoaded } = useUmamiAnalytics();

  useEffect(() => {
    if (!isUmamiLoaded) return;

    const handleError = (event: ErrorEvent) => {
      trackError('javascript', event.message, event.error?.stack);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError('promise_rejection', event.reason?.message || 'Unhandled promise rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [isUmamiLoaded, trackError]);
}

// Hook pour tracker les performances de page
export function useUmamiPerformanceTracking() {
  const { trackEvent, isUmamiLoaded } = useUmamiAnalytics();

  useEffect(() => {
    if (!isUmamiLoaded) return;

    const trackPerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 0;
          const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;

          trackEvent('page_performance', {
            load_time: Math.round(loadTime),
            dom_content_loaded: Math.round(domContentLoaded),
            first_paint: Math.round(firstPaint),
            first_contentful_paint: Math.round(firstContentfulPaint),
            url: window.location.pathname
          });
        }
      }
    };

    // Attendre que la page soit complètement chargée
    if (document.readyState === 'complete') {
      setTimeout(trackPerformance, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(trackPerformance, 1000);
      });
    }
  }, [isUmamiLoaded, trackEvent]);
}

export default useUmamiAnalytics; 