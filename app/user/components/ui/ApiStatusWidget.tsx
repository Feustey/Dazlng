'use client';

import React, { useState, useEffect } from 'react';
import { checkApiHealth } from '@/lib/dazno-api';

export interface ApiStatusWidgetProps {
  className?: string;
}

export default function ApiStatusWidget({ className = '' }: ApiStatusWidgetProps): React.FC {
  const [apiStatus, setApiStatus] = useState<'checking' | 'up' | 'down'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = async (): Promise<void> => {
      try {
        const isHealthy = await checkApiHealth();
        setApiStatus(isHealthy ? 'up' : 'down');
        setLastCheck(new Date());
      } catch {
        setApiStatus('down');
        setLastCheck(new Date());
      }
    };

    checkStatus();
    
    // Vérifier le statut toutes les 30 secondes
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (): string => {
    switch (apiStatus) {
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (): string => {
    switch (apiStatus) {
      case 'up': return '🟢';
      case 'down': return '🔴';
      default: return '🟡';
    }
  };

  const getStatusText = (): string => {
    switch (apiStatus) {
      case 'up': return 'API DazNo disponible';
      case 'down': return 'API DazNo indisponible';
      default: return 'Vérification API...';
    }
  };

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getStatusIcon()}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{getStatusText()}</h3>
            {lastCheck && (
              <p className="text-sm text-gray-500">
                Dernière vérification : {lastCheck.toLocaleTimeString('fr-FR')}
              </p>
            )}
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {apiStatus === 'checking' ? 'Vérification...' : 
           apiStatus === 'up' ? 'Actif' : 'Hors ligne'}
        </div>
      </div>

      {apiStatus === 'up' && (
        <div className="mt-3 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Recommandations IA
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Statistiques de nœud
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Actions prioritaires
            </span>
          </div>
        </div>
      )}

      {apiStatus === 'down' && (
        <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Mode dégradé :</span> Les données affichées sont des exemples. 
            Reconnectez votre nœud pour accéder aux vraies recommandations IA.
          </p>
        </div>
      )}
    </div>
  );
}
