"use client";

import { useEffect, useCallback, useState, useRef } from 'react';
import { useMCPLight } from '@/hooks/useMCPLight';
import type { IntelligentAlert } from '@/lib/services/mcp-light-api';

interface ProactiveMonitoringOptions {
  enabled?: boolean;
  checkInterval?: number; // en ms
  alertThresholds?: {
    critical: boolean;
    warning: boolean;
    info: boolean;
  };
  notificationOptions?: {
    push: boolean;
    sound: boolean;
    badge: boolean;
  };
}

interface ProactiveMonitoringState {
  isMonitoring: boolean;
  lastCheck: Date | null;
  alertCount: {
    critical: number;
    warning: number;
    info: number;
    total: number;
  };
  recentAlerts: IntelligentAlert[];
  monitoringError: string | null;
}

interface ProactiveMonitoringReturn extends ProactiveMonitoringState {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  checkNow: () => Promise<void>;
  clearAlerts: () => void;
  updateOptions: (options: Partial<ProactiveMonitoringOptions>) => void;
}

export function useProactiveMonitoring(
  pubkey: string | null,
  initialOptions: ProactiveMonitoringOptions = {}
): ProactiveMonitoringReturn {
  const { getIntelligentAlerts, initialized } = useMCPLight();
  
  // Options par défaut
  const defaultOptions: ProactiveMonitoringOptions = {
    enabled: true,
    checkInterval: 30000, // 30 secondes
    alertThresholds: {
      critical: true,
      warning: true,
      info: false
    },
    notificationOptions: {
      push: true,
      sound: true,
      badge: true
    }
  };

  const [options, setOptions] = useState<ProactiveMonitoringOptions>({
    ...defaultOptions,
    ...initialOptions
  });

  const [state, setState] = useState<ProactiveMonitoringState>({
    isMonitoring: false,
    lastCheck: null,
    alertCount: {
      critical: 0,
      warning: 0,
      info: 0,
      total: 0
    },
    recentAlerts: [],
    monitoringError: null
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousAlertsRef = useRef<IntelligentAlert[]>([]);

  // Fonction pour demander les permissions de notification
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Les notifications ne sont pas supportées par ce navigateur');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Fonction pour afficher une notification
  const showNotification = useCallback(async (
    title: string, 
    body: string, 
    notificationOptions: NotificationOptions = {}
  ) => {
    if (!options.notificationOptions?.push) return;

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    try {
      const notification = new Notification(title, {
        body,
        icon: '/assets/images/daznode-icon.png',
        badge: '/assets/images/daznode-badge.png',
        tag: 'daznode-alert',
        requireInteraction: true,
        ...notificationOptions
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-fermeture après 10 secondes
      setTimeout(() => {
        notification.close();
      }, 10000);

    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification:', error);
    }
  }, [options.notificationOptions?.push]);

  // Fonction pour jouer un son d'alerte
  const playAlertSound = useCallback((severity: IntelligentAlert['severity']) => {
    if (!options.notificationOptions?.sound) return;

    try {
      // Sons différents selon la sévérité
      const audioFiles = {
        critical: '/assets/sounds/alert-critical.mp3',
        warning: '/assets/sounds/alert-warning.mp3',
        info: '/assets/sounds/alert-info.mp3'
      };

      const audio = new Audio(audioFiles[severity] || audioFiles.info);
      audio.volume = 0.5;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Impossible de jouer le son d\'alerte:', error);
    }
  }, [options.notificationOptions?.sound]);

  // Fonction pour mettre à jour le badge du navigateur
  const updateBadge = useCallback((count: number) => {
    if (!options.notificationOptions?.badge) return;

    try {
      if ('setAppBadge' in navigator) {
        (navigator as any).setAppBadge(count > 0 ? count : null);
      }
    } catch (error) {
      console.warn('Impossible de mettre à jour le badge:', error);
    }
  }, [options.notificationOptions?.badge]);

  // Fonction de vérification des alertes
  const checkAlerts = useCallback(async (): Promise<void> => {
    if (!pubkey || !initialized) return;

    try {
      setState(prev => ({ ...prev, monitoringError: null }));

      // Récupérer toutes les alertes
      const allAlerts = await getIntelligentAlerts(pubkey);
      
      // Filtrer selon les seuils configurés
      const filteredAlerts = allAlerts.filter(alert => {
        return options.alertThresholds?.[alert.severity] ?? false;
      });

      // Calculer les compteurs
      const alertCount = {
        critical: allAlerts.filter(a => a.severity === 'critical').length,
        warning: allAlerts.filter(a => a.severity === 'warning').length,
        info: allAlerts.filter(a => a.severity === 'info').length,
        total: allAlerts.length
      };

      // Détecter les nouvelles alertes
      const previousAlerts = previousAlertsRef.current;
      const newAlerts = filteredAlerts.filter(alert => 
        !previousAlerts.some(prev => 
          prev.type === alert.type && 
          prev.message === alert.message &&
          prev.channel_id === alert.channel_id
        )
      );

      // Traiter les nouvelles alertes
      if (newAlerts.length > 0) {
        console.log(`🚨 ${newAlerts.length} nouvelle(s) alerte(s) détectée(s):`, newAlerts);

        // Notifications pour chaque nouvelle alerte critique/warning
        for (const alert of newAlerts) {
          if (alert.severity === 'critical' || alert.severity === 'warning') {
            const title = alert.severity === 'critical' 
              ? '🚨 Alerte Critique - DazNode'
              : '⚠️ Alerte - DazNode';
            
            await showNotification(title, alert.message, {
              body: `Action suggérée: ${alert.suggested_action}`,
              icon: '/assets/images/daznode-icon.png'
            });

            playAlertSound(alert.severity);
          }
        }
      }

      // Mettre à jour le badge
      updateBadge(alertCount.critical + alertCount.warning);

      // Mettre à jour l'état
      setState(prev => ({
        ...prev,
        lastCheck: new Date(),
        alertCount,
        recentAlerts: filteredAlerts.slice(0, 10), // Garder les 10 plus récentes
      }));

      // Sauvegarder pour la prochaine comparaison
      previousAlertsRef.current = allAlerts;

    } catch (error) {
      console.error('Erreur lors de la vérification des alertes:', error);
      setState(prev => ({
        ...prev,
        monitoringError: error instanceof Error ? error.message : 'Erreur inconnue',
        lastCheck: new Date()
      }));
    }
  }, [pubkey, initialized, options.alertThresholds, getIntelligentAlerts, showNotification, playAlertSound, updateBadge]);

  // Fonction pour démarrer le monitoring
  const startMonitoring = useCallback(() => {
    if (!pubkey || state.isMonitoring) return;

    console.log(`🔄 Démarrage du monitoring proactif pour ${pubkey.substring(0, 16)}...`);
    
    setState(prev => ({ ...prev, isMonitoring: true, monitoringError: null }));

    // Première vérification immédiate
    checkAlerts();

    // Planifier les vérifications périodiques
    if (options.checkInterval && options.checkInterval > 0) {
      intervalRef.current = setInterval(checkAlerts, options.checkInterval);
    }
  }, [pubkey, state.isMonitoring, options.checkInterval, checkAlerts]);

  // Fonction pour arrêter le monitoring
  const stopMonitoring = useCallback(() => {
    console.log('⏹️ Arrêt du monitoring proactif');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setState(prev => ({ ...prev, isMonitoring: false }));
    updateBadge(0); // Effacer le badge
  }, [updateBadge]);

  // Fonction pour vérifier immédiatement
  const checkNow = useCallback(async (): Promise<void> => {
    await checkAlerts();
  }, [checkAlerts]);

  // Fonction pour effacer les alertes
  const clearAlerts = useCallback(() => {
    setState(prev => ({
      ...prev,
      alertCount: { critical: 0, warning: 0, info: 0, total: 0 },
      recentAlerts: [],
      monitoringError: null
    }));
    updateBadge(0);
    previousAlertsRef.current = [];
  }, [updateBadge]);

  // Fonction pour mettre à jour les options
  const updateOptions = useCallback((newOptions: Partial<ProactiveMonitoringOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
    
    // Redémarrer le monitoring si l'intervalle a changé
    if (newOptions.checkInterval && state.isMonitoring) {
      stopMonitoring();
      setTimeout(() => startMonitoring(), 100);
    }
  }, [state.isMonitoring, stopMonitoring, startMonitoring]);

  // Démarrage/arrêt automatique selon l'option enabled et la présence du pubkey
  useEffect(() => {
    if (options.enabled && pubkey && initialized && !state.isMonitoring) {
      startMonitoring();
    } else if ((!options.enabled || !pubkey) && state.isMonitoring) {
      stopMonitoring();
    }
  }, [options.enabled, pubkey, initialized, state.isMonitoring, startMonitoring, stopMonitoring]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      updateBadge(0);
    };
  }, [updateBadge]);

  // Gestion du changement de visibilité de la page (optimisation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page masquée: continuer le monitoring mais réduire la fréquence
        if (state.isMonitoring && options.checkInterval) {
          stopMonitoring();
          intervalRef.current = setInterval(checkAlerts, Math.max(options.checkInterval * 2, 60000));
        }
      } else {
        // Page visible: restaurer la fréquence normale
        if (options.enabled && pubkey) {
          stopMonitoring();
          startMonitoring();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.isMonitoring, options.checkInterval, options.enabled, pubkey, stopMonitoring, startMonitoring, checkAlerts]);

  return {
    ...state,
    startMonitoring,
    stopMonitoring,
    checkNow,
    clearAlerts,
    updateOptions
  };
} 