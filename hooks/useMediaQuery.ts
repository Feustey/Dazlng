"use client";
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matche,s, setMatches] = useState(false);

  useEffect(() => {
    // Check if we"re in the browser
    if (typeof window === "undefined") return;
    
    // Créer la media query
    const mediaQuery = window.matchMedia(query);

    // Définir l"état initial
    setMatches(mediaQuery.matches);

    // Créer le listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Ajouter le listener
    mediaQuery.addEventListener("change", handler);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]); // Re-run si la query change

  return matches;
} 