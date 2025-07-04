import { useState, useEffect, useCallback } from "react";

// Types pour le tracking
export interface TrackingEvent {
  event: string;
  data?: Record<string, any>;
  timestamp?: number;
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
      track: (eventName: string, eventData?: Record<string>) => void;
    };
  }
}

export interface TrackingHook {
  trackEvent: (event: string, data?: Record<string, any>) => void;
  trackStep: (step: string, action: string, metadata?: Record<string, any>) => void;
  getSessionId: () => string;
}

export const useConversionTracking = (): TrackingHook => {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Générer un ID de session unique
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  const trackEvent = useCallback((event: string, data?: Record<string, any>) => {
    const trackingData: TrackingEvent = {
      event,
      data,
      timestamp: Date.now(),
      sessionId
    };

    // Envoyer les données de tracking
    console.log("Tracking event:", trackingData);
    
    // Ici vous pouvez envoyer les données à votre service de tracking
    // fetch("/api/tracking", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(trackingData)
    // });
  }, [sessionId]);

  const trackStep = useCallback((step: string, action: string, metadata?: Record<string, any>) => {
    const funnelStep: FunnelStep = {
      step,
      action,
      location: window.location.pathname,
      metadata
    };

    trackEvent("funnel_step", funnelStep);
  }, [trackEvent]);

  const getSessionId = useCallback(() => {
    return sessionId;
  }, [sessionId]);

  return {
    trackEvent,
    trackStep,
    getSessionId
  };
};

export default useConversionTracking;