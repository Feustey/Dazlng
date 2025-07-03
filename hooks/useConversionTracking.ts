import { useCallback } from 'react';

// Types pour le tracking
export interface TrackingEvent {
  eventName: string;
  stepName: string;
  action: string;
  location?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface FunnelStep {
  step: string;
  action: string;
  location?: string;
  metadata?: Record<string, any>;
}

// Déclaration globale pour umami
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

export interface TrackingHook {
  trackStep: (stepName: string, action: string, options?: {
    location?: string;
    metadata?: Record<string, any>;
    userId?: string;
  }) => void;
  trackCTAClick: (ctaType: 'primary' | 'secondary', location: string, metadata?: Record<string, any>) => void;
  trackPageView: (pageName: string, metadata?: Record<string, any>) => void;
  trackFormInteraction: (formName: string, action: 'start' | 'complete' | 'abandon', metadata?: Record<string, any>) => void;
  trackScrollDepth: (depth: number, location: string) => void;
  trackDemoInteraction: (action: 'start' | 'complete' | 'skip', metadata?: Record<string, any>) => void;
  trackProductInterest: (product: 'dazbox' | 'daznode' | 'dazpay', action: string, metadata?: Record<string, any>) => void;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  trackConversion: (conversionType: string, value?: number) => void;
  getLocalAnalytics: () => any;
  getFunnelMetrics: () => any;
  getSessionId: () => string;
}

export const useConversionTracking = (): TrackingHook => {
  // Fonction pour générer un ID de session unique
  const getSessionId = useCallback((): string => {
    if (typeof window === 'undefined') return 'ssr-session';
    
    try {
      let sessionId = sessionStorage.getItem('daz_session_id');
      if (!sessionId) {
        sessionId = `daz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('daz_session_id', sessionId);
      }
      return sessionId;
    } catch (error) {
      console.warn('Session storage error:', error);
      return `daz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  // Stockage local pour l'analyse du funnel
  const saveToLocalAnalytics = useCallback((event: TrackingEvent): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const existingData = localStorage.getItem('daz_analytics') || '[]';
      const analytics = JSON.parse(existingData);
      analytics.push(event);
      
      // Garder seulement les 1000 derniers événements
      if (analytics.length > 1000) {
        analytics.splice(0, analytics.length - 1000);
      }
      
      localStorage.setItem('daz_analytics', JSON.stringify(analytics));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde analytics:', error);
    }
  }, []);

  // Fonction principale de tracking
  const trackStep = useCallback((stepName: string, action: string, options: {
    location?: string;
    metadata?: Record<string, any>;
    userId?: string;
  } = {}): void => {
    const event: TrackingEvent = {
      eventName: `funnel_${stepName}`,
      stepName,
      action,
      location: options.location,
      metadata: options.metadata,
      timestamp: new Date().toISOString(),
      userId: options.userId,
      sessionId: getSessionId(),
    };

    // Tracking Umami si disponible
    if (typeof window !== 'undefined' && window.umami) {
      try {
        window.umami.track(event.eventName, {
          step: stepName,
          action,
          location: options.location,
          ...options.metadata
        });
      } catch (error) {
        console.warn('Erreur Umami tracking:', error);
      }
    }

    // Sauvegarde locale
    saveToLocalAnalytics(event);

    // Log pour le développement
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Tracking Event:', event);
    }
  }, [getSessionId, saveToLocalAnalytics]);

  // Fonctions spécialisées pour les différentes actions
  const trackCTAClick = useCallback((ctaType: 'primary' | 'secondary', location: string, metadata?: Record<string, any>): void => {
    trackStep('cta_click', ctaType, { location, metadata });
  }, [trackStep]);

  const trackPageView = useCallback((pageName: string, metadata?: Record<string, any>): void => {
    trackStep('page_view', 'view', { location: pageName, metadata });
  }, [trackStep]);

  const trackFormInteraction = useCallback((formName: string, action: 'start' | 'complete' | 'abandon', metadata?: Record<string, any>): void => {
    trackStep('form_interaction', action, { location: formName, metadata });
  }, [trackStep]);

  const trackScrollDepth = useCallback((depth: number, location: string): void => {
    trackStep('scroll_depth', 'scroll', { 
      location, 
      metadata: { depth: `${depth}%` }
    });
  }, [trackStep]);

  const trackDemoInteraction = useCallback((action: 'start' | 'complete' | 'skip', metadata?: Record<string, any>): void => {
    trackStep('demo_interaction', action, { location: 'demo_page', metadata });
  }, [trackStep]);

  const trackProductInterest = useCallback((product: 'dazbox' | 'daznode' | 'dazpay', action: string, metadata?: Record<string, any>): void => {
    trackStep('product_interest', action, { location: product, metadata });
  }, [trackStep]);

  // Fonction pour récupérer les analytics locales
  const getLocalAnalytics = useCallback((): TrackingEvent[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem('daz_analytics') || '[]';
      return JSON.parse(data);
    } catch (error) {
      console.warn('Erreur lors de la récupération des analytics:', error);
      return [];
    }
  }, []);

  // Fonction pour calculer les métriques du funnel
  const getFunnelMetrics = useCallback(() => {
    const events = getLocalAnalytics();
    const sessionId = getSessionId();
    
    const sessionEvents = events.filter(e => e.sessionId === sessionId);
    
    const funnelSteps = [
      'page_view',
      'cta_click',
      'form_interaction',
      'demo_interaction',
      'product_interest'
    ];

    const metrics = funnelSteps.reduce((acc, step) => {
      const stepEvents = sessionEvents.filter(e => e.stepName === step);
      acc[step] = {
        count: stepEvents.length,
        firstOccurrence: stepEvents[0]?.timestamp,
        lastOccurrence: stepEvents[stepEvents.length - 1]?.timestamp
      };
      return acc;
    }, {} as Record<string, any>);

    return {
      sessionId,
      totalEvents: sessionEvents.length,
      steps: metrics,
      sessionDuration: sessionEvents.length > 0 ? 
        new Date(sessionEvents[sessionEvents.length - 1].timestamp).getTime() - 
        new Date(sessionEvents[0].timestamp).getTime() : 0
    };
  }, [getLocalAnalytics, getSessionId]);

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    console.log('📊 Tracking event:', eventName, properties);
    // Implémentation de tracking
  }, []);

  const trackConversion = useCallback((conversionType: string, value?: number) => {
    console.log('📊 Conversion:', conversionType, value);
    // Implémentation de tracking
  }, []);

  return {
    trackStep,
    trackCTAClick,
    trackPageView,
    trackFormInteraction,
    trackScrollDepth,
    trackDemoInteraction,
    trackProductInterest,
    trackEvent,
    trackConversion,
    getLocalAnalytics,
    getFunnelMetrics,
    getSessionId
  };
};

export default useConversionTracking; 