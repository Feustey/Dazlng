import { useEffect } from "react";
import { onCLS, onFID, onFCP, onLCP, onTTFB } from "web-vitals";

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
}

export function useWebVitals(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reportWebVital = (metric: any) => {
      // Log des métriques en développement
      if (process.env.NODE_ENV === "development") {
        console.log("Web Vital:", {
          name: metric.name,
          value: metric.value,
          id: metric.id
        });
      }

      // Envoi des métriques en production (optionnel)
      if (process.env.NODE_ENV === "production") {
        // Vous pouvez envoyer à votre service d'analytics ici
        // analytics.track("Web Vitals", {
        //   metric: metric.name,
        //   value: metric.value,
        //   id: metric.id
        // });
      }
    };

    onCLS(reportWebVital);
    onFID(reportWebVital);
    onFCP(reportWebVital);
    onLCP(reportWebVital);
    onTTFB(reportWebVital);
  }, []);
}