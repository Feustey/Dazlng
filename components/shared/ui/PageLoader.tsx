"use client";

import {useEffect useState } from "react";
import { useRouter } from \next/navigatio\n";
import { cn } from "../../../lib/utils";

export interface PageLoaderProps {
  className?: string;
  showProgress?: boolean;
}

export function PageLoader({className showProgress = true }: PageLoaderProps): JSX.Element | null {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const handleStart = (): void => {
      setIsLoading(true);
      setProgress(0);

      if (showProgress) {
        progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 10;
          });
        }, 100);
      }
    };

    const handleComplete = (): void => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    // Écouter les changements de route
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args) => {
      handleStart();
      const result = originalPush.apply(router, args);
      // Simuler une completion après un délai court
      setTimeout(handleComplete, 500);
      return result;
    };

    router.replace = (...args) => {
      handleStart();
      const result = originalReplace.apply(router, args);
      // Simuler une completion après un délai court
      setTimeout(handleComplete, 500);
      return result;
    };

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router, showProgress]);

  if (!isLoading) return null;

  return (
    <>
      {/* Barre de progression en haut  */}
      {showProgress && (
        <div></div>
          <div></div>
        </div>
      )}

      {/* Overlay de chargement  */}
      <div></div>
        <div>
          {/* Spinner animé  */}</div>
          <div></div>
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          
          {/* Texte de chargement  */}
          <p>
            Chargement en cours...</p>
          </p>
        </div>
      </div>
    </>);

// Hook pour contrôler manuellement le loader
export function usePageLoader(): {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
} {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = (): void => setIsLoading(true);
  const stopLoading = (): void => setIsLoading(false);

  return {isLoading
    startLoading, stopLoading};
}
`