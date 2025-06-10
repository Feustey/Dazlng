"use client";

import React from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/shared/ui/Card';
import { 
  Crown, 
  TrendingUp, 
  Zap, 
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';
import type { EnrichedNodeData } from '@/lib/services/mcp-light-api';

interface NodeClassificationCardProps {
  data: EnrichedNodeData['combined_insights'] | null;
  sparkseerData: EnrichedNodeData['sparkseer_data'] | null;
}

// Composant Badge simple
const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

// Composant Progress simple
const Progress = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full ${className}`}>
    <div 
      className="bg-blue-600 h-full rounded-full transition-all duration-300" 
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export function NodeClassificationCard({ data, sparkseerData }: NodeClassificationCardProps) {
  if (!data || !sparkseerData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layers className="h-5 w-5" />
            <span>Classification du Nœud</span>
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Analyse intelligente SparkSeer + LND + IA
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Données de classification non disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fonction pour obtenir l'icône et la couleur selon la classification
  const getClassificationDisplay = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'major_routing_node':
        return {
          icon: <Crown className="h-5 w-5" />,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          description: 'Nœud majeur avec forte capacité de routage',
          score: 95
        };
      case 'significant_node':
        return {
          icon: <TrendingUp className="h-5 w-5" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          description: 'Nœud significatif avec bonne connectivité',
          score: 80
        };
      case 'growing_node':
        return {
          icon: <Zap className="h-5 w-5" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          description: 'Nœud en croissance avec potentiel',
          score: 65
        };
      case 'small_node':
        return {
          icon: <Activity className="h-5 w-5" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          description: 'Petit nœud, idéal pour débuter',
          score: 40
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          description: 'Classification en cours d\'analyse',
          score: 50
        };
    }
  };

  const classificationInfo = getClassificationDisplay(data.node_classification);

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
      case 'optimal':
      case 'high':
        return 'text-green-600 bg-green-50';
      case 'good':
      case 'medium':
        return 'text-blue-600 bg-blue-50';
      case 'fair':
      case 'low':
        return 'text-yellow-600 bg-yellow-50';
      case 'poor':
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Layers className="h-5 w-5" />
          <span>Classification du Nœud</span>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Analyse intelligente combinant toutes les sources de données
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Classification principale */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Type de Nœud</h3>
            <div className="text-xs text-muted-foreground">
              Score: {classificationInfo.score}/100
            </div>
          </div>
          
          <Badge className={`${classificationInfo.color} flex items-center space-x-2 p-2 w-full justify-between`}>
            <div className="flex items-center space-x-2">
              {classificationInfo.icon}
              <span className="font-medium">{data.node_classification.replace(/_/g, ' ').toUpperCase()}</span>
            </div>
          </Badge>
          
          <p className="text-xs text-muted-foreground">{classificationInfo.description}</p>
          <Progress value={classificationInfo.score} className="h-2" />
        </div>

        {/* Métriques de performance */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded-lg ${getStatusColor(data.liquidity_status)}`}>
            <div className="text-xs font-medium opacity-80">LIQUIDITÉ</div>
            <div className="text-sm font-bold">{data.liquidity_status}</div>
          </div>
          
          <div className={`p-3 rounded-lg ${getStatusColor(data.routing_capability)}`}>
            <div className="text-xs font-medium opacity-80">ROUTAGE</div>
            <div className="text-sm font-bold">{data.routing_capability}</div>
          </div>
          
          <div className={`p-3 rounded-lg ${getStatusColor(data.network_position)}`}>
            <div className="text-xs font-medium opacity-80">POSITION</div>
            <div className="text-sm font-bold">{data.network_position}</div>
          </div>
          
          <div className={`p-3 rounded-lg ${getStatusColor(data.maintenance_priority)}`}>
            <div className="text-xs font-medium opacity-80">MAINTENANCE</div>
            <div className="text-sm font-bold">{data.maintenance_priority}</div>
          </div>
        </div>

        {/* Métriques détaillées */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Métriques Détaillées</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Capacité Totale</span>
              <span className="font-medium">
                {(sparkseerData.total_capacity / 100000000).toFixed(2)} BTC
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Nombre de Canaux</span>
              <span className="font-medium">{sparkseerData.num_channels}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Rang de Centralité</span>
              <span className="font-medium">#{sparkseerData.betweenness_rank.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Taux de Réussite HTLC</span>
              <span className="font-medium">
                {(sparkseerData.htlc_success_rate * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Frais Sortants Moyens</span>
              <span className="font-medium">
                {sparkseerData.mean_outbound_fee_rate.toLocaleString()} ppm
              </span>
            </div>
          </div>
        </div>

        {/* Sources de données */}
        <div className="border-t pt-4">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">SOURCES DE DONNÉES</h4>
          <div className="flex space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${data.data_sources.sparkseer_available ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>SparkSeer</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${data.data_sources.lnd_available ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>LND</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>IA Analysis</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 