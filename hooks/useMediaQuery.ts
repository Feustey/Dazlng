import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Créer la media query
    const mediaQuery = window.matchMedia(query);

    // Définir l'état initial
    setMatches(mediaQuery.matches);

    // Créer le listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Ajouter le listener
    mediaQuery.addEventListener('change', handler);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]); // Re-run si la query change

  return matches;
} 