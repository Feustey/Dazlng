"use client";

import { useState, useEffect, useCallback } from 'react';

export interface EnrichedNodeData {
  pubkey: string;
  timestamp: string;
  sparkseer_data: {
    alias: string;
    total_capacity: number;
    num_channels: number;
    betweenness_rank: number;
    mean_outbound_fee_rate: number;
    htlc_success_rate: number;
    liquidity_flexibility_score: number;
  };
  lnd_data: {
    lnd_available: boolean;
    timestamp: string;
    local_node_info: {
      pubkey: string;
      alias: string;
      version: string;
      block_height: number;
      synced_to_chain: boolean;
      synced_to_graph: boolean;
      num_active_channels: number;
      num_inactive_channels: number;
      num_pending_channels: number;
      num_peers: number;
    } | null;
    network_position: {
      num_nodes: number;
      num_channels: number;
      total_network_capacity: string;
      avg_channel_size: string;
      graph_diameter: number;
    } | null;
    channel_details: Array<{
      channel_id: string;
      remote_pubkey: string;
      capacity: string;
      local_balance: string;
      remote_balance: string;
      total_satoshis_sent: string;
      total_satoshis_received: string;
      num_updates: string;
      private: boolean;
      initiator: boolean;
      uptime: string;
    }>;
    derived_stats: {
      payment_activity: {
        available: boolean;
        total_sent_sats: number;
        total_received_sats: number;
        total_updates: number;
        avg_updates_per_channel: number;
      };
      routing_stats: {
        available: boolean;
        active_channels: number;
        total_channels: number;
        routing_efficiency: number;
        total_capacity: number;
      };
      liquidity_distribution: {
        available: boolean;
        total_local_balance: number;
        total_remote_balance: number;
        local_ratio: number;
        remote_ratio: number;
        balance_score: number;
      };
    } | null;
  };
  combined_insights: {
    data_sources: {
      sparkseer_available: boolean;
      lnd_available: boolean;
    };
    node_classification: string;
    liquidity_status: string;
    routing_capability: string;
    network_position: string;
    maintenance_priority: string;
  };
  enhanced_alerts: Array<{
    type: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    suggested_action: string;
    channel_id?: string;
    metric_value: number;
    threshold: number;
  }>;
}

export interface NetworkStatus {
  source: string;
  timestamp: string;
  network_stats: {
    num_nodes: number;
    num_channels: number;
    total_network_capacity: string;
    avg_channel_size: string;
    graph_diameter: number;
    avg_out_degree: number;
  };
  health_indicators: {
    total_capacity_btc: number;
    avg_channel_size_btc: number;
    node_density: number;
    network_reach: number;
  };
}

export function useEnrichedNodeData(pubkey: string | null) {
  const [enrichedData, setEnrichedData] = useState<EnrichedNodeData | null>(null);
  const [alerts, setAlerts] = useState<EnrichedNodeData['enhanced_alerts']>([]);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30s par défaut
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchEnrichedData = useCallback(async () => {
    if (!pubkey) return;

    try {
      setLoading(true);
      setError(null);

      // Appels parallèles aux nouvelles API enrichies
      const [enrichedResponse, alertsResponse, networkResponse] = await Promise.allSettled([
        fetch(`/api/dazno/complete/${pubkey}`),
        fetch(`/api/dazno/alerts/${pubkey}`),
        fetch(`/api/dazno/network/status`)
      ]);

      // Traitement de la réponse enrichie
      if (enrichedResponse.status === 'fulfilled' && enrichedResponse.value.ok) {
        const response = await enrichedResponse.value.json();
        if (response.success && response.data) {
          setEnrichedData(response.data);
          
          // Extraire les alertes des données enrichies si disponibles
          if (response.data.enhanced_alerts) {
            setAlerts(response.data.enhanced_alerts);
          }
        }
      }

      // Traitement des alertes séparées
      if (alertsResponse.status === 'fulfilled' && alertsResponse.value.ok) {
        const response = await alertsResponse.value.json();
        if (response.success && Array.isArray(response.data)) {
          setAlerts(response.data);
        }
      }

      // Traitement du statut réseau
      if (networkResponse.status === 'fulfilled' && networkResponse.value.ok) {
        const response = await networkResponse.value.json();
        if (response.success && response.data) {
          setNetworkStatus(response.data);
        }
      }

      setLastUpdate(new Date());

    } catch (error) {
      console.error('Erreur lors du chargement des données enrichies:', error);
      setError('Impossible de charger les données enrichies');
      
      // Créer des données de fallback
      setEnrichedData({
        pubkey,
        timestamp: new Date().toISOString(),
        sparkseer_data: {
          alias: 'Nœud Lightning',
          total_capacity: 0,
          num_channels: 0,
          betweenness_rank: 0,
          mean_outbound_fee_rate: 0,
          htlc_success_rate: 0,
          liquidity_flexibility_score: 0
        },
        lnd_data: {
          lnd_available: false,
          timestamp: new Date().toISOString(),
          local_node_info: null,
          network_position: null,
          channel_details: [],
          derived_stats: null
        },
        combined_insights: {
          data_sources: {
            sparkseer_available: false,
            lnd_available: false
          },
          node_classification: 'unknown',
          liquidity_status: 'unknown',
          routing_capability: 'unknown',
          network_position: 'unknown',
          maintenance_priority: 'low'
        },
        enhanced_alerts: [
          {
            type: 'api_unavailable',
            severity: 'warning',
            message: 'API d\'analyse non disponible',
            suggested_action: 'Vérifiez votre connexion réseau et réessayez plus tard',
            metric_value: 0,
            threshold: 1
          }
        ]
      });
      
      setAlerts([
        {
          type: 'api_unavailable',
          severity: 'warning',
          message: 'Service d\'alertes temporairement indisponible',
          suggested_action: 'Vérifiez votre connexion et réessayez plus tard',
          metric_value: 0,
          threshold: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [pubkey]);

  // Ajuster automatiquement l'intervalle selon la criticité
  useEffect(() => {
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const warningAlerts = alerts.filter(a => a.severity === 'warning');

    if (criticalAlerts.length > 0) {
      setRefreshInterval(10000); // 10s pour les alertes critiques
    } else if (warningAlerts.length > 0) {
      setRefreshInterval(20000); // 20s pour les warnings
    } else {
      setRefreshInterval(60000); // 1min pour fonctionnement normal
    }
  }, [alerts]);

  // Chargement initial et actualisation périodique
  useEffect(() => {
    if (!pubkey) return;

    fetchEnrichedData();
    
    const interval = setInterval(fetchEnrichedData, refreshInterval);
    return () => clearInterval(interval);
  }, [pubkey, refreshInterval, fetchEnrichedData]);

  const forceRefresh = useCallback(() => {
    fetchEnrichedData();
  }, [fetchEnrichedData]);

  return {
    enrichedData,
    alerts,
    networkStatus,
    loading,
    error,
    refreshInterval,
    lastUpdate,
    setRefreshInterval,
    forceRefresh
  };
} 