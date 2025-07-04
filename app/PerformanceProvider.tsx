"use client";
import React, { useEffect, useState } from "react";
import { useWebVitals } from "../hooks/useWebVitals";

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
    // Optimisation des polices
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        document.body.classList.add("fonts-loaded");
      });
    }
    // Optimisation des images lazy loading
    if ("loading" in HTMLImageElement.prototype) {
      const images = document.querySelectorAll("img[loading=\"lazy\"]");
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.loading = "eager";
            imageObserver.unobserve(img);
          }
        });
      });
      images.forEach(img => imageObserver.observe(img));
    }
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      {children}
    </div>
  );
}

export const dynamic = "force-dynamic";