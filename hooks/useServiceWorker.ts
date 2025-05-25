import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isActive: boolean;
  error: string | null;
}

export function useServiceWorker(): ServiceWorkerState & {
  register: () => Promise<void>;
  unregister: () => Promise<void>;
  update: () => Promise<void>;
} {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: typeof window !== 'undefined' && 'serviceWorker' in navigator,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isActive: false,
    error: null
  });

  const register = async (): Promise<void> => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Service Worker non supporté' }));
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      setState(prev => ({ 
        ...prev, 
        isRegistered: true, 
        error: null,
        isInstalling: registration.installing !== null,
        isWaiting: registration.waiting !== null,
        isActive: registration.active !== null
      }));

      // Écouter les changements d'état
      registration.addEventListener('updatefound', () => {
        setState(prev => ({ ...prev, isInstalling: true }));
        
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              setState(prev => ({ 
                ...prev, 
                isInstalling: false,
                isWaiting: navigator.serviceWorker.controller !== null
              }));
            }
            if (newWorker.state === 'activated') {
              setState(prev => ({ 
                ...prev, 
                isWaiting: false,
                isActive: true
              }));
            }
          });
        }
      });

      console.log('Service Worker enregistré avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }));
    }
  };

  const unregister = async (): Promise<void> => {
    if (!state.isSupported) return;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        setState(prev => ({ 
          ...prev, 
          isRegistered: false,
          isInstalling: false,
          isWaiting: false,
          isActive: false
        }));
        console.log('Service Worker désenregistré');
      }
    } catch (error) {
      console.error('Erreur lors du désenregistrement du Service Worker:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }));
    }
  };

  const update = async (): Promise<void> => {
    if (!state.isSupported) return;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('Service Worker mis à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du Service Worker:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }));
    }
  };

  useEffect(() => {
    if (state.isSupported) {
      // Vérifier si un service worker est déjà enregistré
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          setState(prev => ({ 
            ...prev, 
            isRegistered: true,
            isActive: registration.active !== null
          }));
        }
      });
    }
  }, [state.isSupported]);

  return {
    ...state,
    register,
    unregister,
    update
  };
} 