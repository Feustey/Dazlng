// Service côté client pour Umami Analytics
class UmamiService {
  private websiteId: string | null = null;
  private isEnabled: boolean | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || null;
      this.isEnabled = !!this.websiteId;
    }
  }

  /**
   * Track un événement personnalisé
   */
  trackEvent(eventName: string, eventData?: Record<string, any>): void {
    if (!this.isEnabled) {
      console.log("[UMAMI] Événement simulé:", eventName, eventData);
      return;
    }

    try {
      if (window.umami) {
        window.umami.track(eventName, eventData);
        console.log("[UMAMI] Événement tracké:", eventName, eventData);
      }
    } catch (error) {
      console.error("[UMAMI] Erreur tracking événement:", error);
    }
  }

  /**
   * Track une page vue
   */
  trackPageView(url?: string, referrer?: string): void {
    if (!this.isEnabled) {
      console.log("[UMAMI] Page vue simulée:", url);
      return;
    }

    try {
      if (window.umami) {
        window.umami.track(url || window.location.pathname, {
          referrer: referrer || document.referrer
        });
        console.log("[UMAMI] Page vue trackée:", url || window.location.pathname);
      }
    } catch (error) {
      console.error("[UMAMI] Erreur tracking page vue:", error);
    }
  }

  /**
   * Track une conversion
   */
  trackConversion(conversionType: string, value?: number, currency?: string): void {
    this.trackEvent("conversion", {
      type: conversionType,
      value,
      currency: currency || "EUR"
    });
  }

  /**
   * Track une interaction utilisateur
   */
  trackUserInteraction(action: string, element: string, details?: Record<string, any>): void {
    this.trackEvent("user_interaction", {
      action,
      element,
      ...details
    });
  }

  /**
   * Track les erreurs
   */
  trackError(errorType: string, errorMessage: string, errorStack?: string): void {
    this.trackEvent("error", {
      type: errorType,
      message: errorMessage,
      stack: errorStack
    });
  }

  /**
   * Track les performances
   */
  trackPerformance(metric: string, value: number, unit: string = "ms"): void {
    this.trackEvent("performance", {
      metric,
      value,
      unit
    });
  }

  /**
   * Track les événements Lightning Network
   */
  trackLightningEvent(eventType: string, details: Record<string, any>): void {
    this.trackEvent("lightning_network", {
      type: eventType,
      ...details
    });
  }

  /**
   * Track les événements d'authentification
   */
  trackAuthEvent(eventType: "login" | "logout" | "register" | "failed_login", method?: string): void {
    this.trackEvent("auth", {
      type: eventType,
      method: method || "unknown"
    });
  }

  /**
   * Track les événements premium/subscription
   */
  trackSubscriptionEvent(eventType: string, plan?: string, amount?: number): void {
    this.trackEvent("subscription", {
      type: eventType,
      plan,
      amount
    });
  }

  /**
   * Vérifier si Umami est disponible
   */
  isAvailable(): boolean {
    return this.isEnabled ?? false;
  }

  /**
   * Obtenir l'ID du site
   */
  getWebsiteId(): string {
    return this.websiteId ?? "";
  }
}

// Déclaration des types pour window.umami
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, any>) => void;
    };
  }
}

// Instance singleton
export const umamiService = new UmamiService();

// Types pour l'API Analytics
export interface UmamiAnalyticsResponse {
  success: boolean;
  data: {
    stats: {
      pageviews: { value: number };
      visitors: { value: number };
      visits: { value: number };
      bounces: { value: number };
      totaltime: { value: number };
    };
    pageviews: {
      pageviews: Array<{ x: string; y: number }>;
    };
    metrics: {
      browsers: Array<{ x: string; y: number }>;
      os: Array<{ x: string; y: number }>;
      devices: Array<{ x: string; y: number }>;
      countries: Array<{ x: string; y: number }>;
    };
    events: Array<{ x: string; y: number }>;
    realtime: {
      timestamp: string;
      active_visitors: number;
      active_sessions: number;
      current_pageviews: number;
    };
  };
  source: "mock" | "umami" | "mock_fallback";
  timestamp: string;
  error?: string;
}

// Utilitaires pour les événements prédéfinis
export const trackingEvents = {
  // Navigation
  pageView: (page: string) => umamiService.trackPageView(page),
  // Authentification
  login: (method: string) => umamiService.trackAuthEvent("login", method),
  logout: () => umamiService.trackAuthEvent("logout"),
  register: (method: string) => umamiService.trackAuthEvent("register", method),
  loginFailed: (method: string) => umamiService.trackAuthEvent("failed_login", method),
  // Lightning Network
  nodeConnected: (nodeId: string) => umamiService.trackLightningEvent("node_connected", { nodeId }),
  channelOpened: (capacity: number) => umamiService.trackLightningEvent("channel_opened", { capacity }),
  invoiceGenerated: (amount: number) => umamiService.trackLightningEvent("invoice_generated", { amount }),
  paymentReceived: (amount: number) => umamiService.trackLightningEvent("payment_received", { amount }),
  // Conversions
  upgradeToBasic: (amount: number) => umamiService.trackSubscriptionEvent("upgrade_basic", "basic", amount),
  upgradeToPremium: (amount: number) => umamiService.trackSubscriptionEvent("upgrade_premium", "premium", amount),
  upgradeToEnterprise: (amount: number) => umamiService.trackSubscriptionEvent("upgrade_enterprise", "enterprise", amount),
  // Interactions
  buttonClick: (buttonName: string, location: string) => umamiService.trackUserInteraction("click", buttonName, { location }),
  formSubmit: (formName: string) => umamiService.trackUserInteraction("submit", formName),
  downloadStart: (fileName: string) => umamiService.trackUserInteraction("download", fileName),
  // Erreurs
  jsError: (error: Error) => umamiService.trackError("javascript", error.message, error.stack),
  apiError: (endpoint: string, status: number) => umamiService.trackError("api", `${endpoint} - ${status}`),
  // Performance
  pageLoadTime: (duration: number) => umamiService.trackPerformance("page_load", duration),
  apiResponseTime: (endpoint: string, duration: number) => umamiService.trackPerformance("api_response", duration, "ms")
};

export default umamiService;