'use client';

import React, { useState } from 'react';
import { useDazFlow } from '@/hooks/useDazFlow';
import {
  DazFlowAnalysis,
  DazFlowOptimization,
  ReliabilityPoint,
  Bottleneck
} from '@/lib/services/mcp-light-api';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/shared/ui/Card';
import Badge from '@/components/shared/ui/Badge';
import Button from '@/components/shared/ui/Button';
import { Alert, AlertDescription } from '@/components/shared/ui/Alert';
import { 
  Loader2, 
  TrendingUp, 
  Zap, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw,
  BarChart3,
  Activity,
  Gauge,
  Target as TargetIcon
} from 'lucide-react';

export interface DazFlowAnalyticsProps {
  nodeId: string;
  className?: string;
}

const DazFlowAnalytics: React.FC<DazFlowAnalyticsProps> = ({ nodeId, className = '' }) => {
  const { dazFlow, reliability, bottlenecks, optimization, networkHealth, loading, error, refreshData } = useDazFlow(nodeId);
  const [activeTab, setActiveTab] = useState<'overview' | 'reliability' | 'bottlenecks' | 'optimization' | 'network'>('overview');

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Chargement des analytics DazFlow index...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className={`${className}`}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des analytics DazFlow index: {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!dazFlow) {
    return (
      <Alert className={`${className}`}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Aucune donnée DazFlow index disponible pour ce nœud.
        </AlertDescription>
      </Alert>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'reliability', label: 'Fiabilité', icon: TargetIcon },
    { id: 'bottlenecks', label: 'Goulots', icon: AlertCircle },
    { id: 'optimization', label: 'Optimisation', icon: TrendingUp },
    { id: 'network', label: 'Réseau', icon: Activity }
  ] as const;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header avec titre et bouton refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gauge className="h-6 w-6 text-blue-600" />
            Analytics DazFlow Index
          </h2>
          <p className="text-gray-600 mt-1">
            Analyse avancée de la capacité de routage et des optimisations possibles
          </p>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && dazFlow && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Capacité DazFlow Index */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Capacité DazFlow Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {dazFlow.dazflow_capacity.toFixed(3)}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Capacité maximale de routage en BTC
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Efficacité de liquidité:</span>
                    <span className="font-medium">{(dazFlow.liquidity_efficiency * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Centralité réseau:</span>
                    <span className="font-medium">{(dazFlow.network_centrality * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Probabilité de succès */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Probabilité de succès
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {(dazFlow.success_probability * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Taux de succès moyen des paiements routés
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Goulots d'étranglement:</span>
                    <span className="font-medium">{dazFlow.bottlenecks_count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Recommandations:</span>
                    <span className="font-medium">{dazFlow.recommendations.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goulots d'étranglement critiques */}
            {dazFlow.bottlenecks.filter(b => b.severity === 'critical' || b.severity === 'high').length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Goulots d'étranglement critiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dazFlow.bottlenecks
                      .filter(b => b.severity === 'critical' || b.severity === 'high')
                      .slice(0, 3)
                      .map((bottleneck, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">
                              Canal {bottleneck.channel_id.substring(0, 8)}...
                            </div>
                            <div className="text-xs text-gray-600">
                              Déséquilibre: {bottleneck.imbalance_percentage.toFixed(1)}%
                            </div>
                          </div>
                          <Badge variant={bottleneck.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {bottleneck.severity}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommandations prioritaires */}
            {dazFlow.recommendations.filter(r => r.priority === 'high' || r.priority === 'critical').length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <TrendingUp className="h-5 w-5" />
                    Recommandations prioritaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dazFlow.recommendations
                      .filter(r => r.priority === 'high' || r.priority === 'critical')
                      .slice(0, 3)
                      .map((rec, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{rec.description}</div>
                            <div className="text-xs text-gray-600">
                              Amélioration attendue: +{rec.expected_improvement.toFixed(1)}%
                            </div>
                          </div>
                          <Badge variant={rec.priority === 'critical' ? 'destructive' : 'secondary'}>
                            {rec.priority}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'reliability' && reliability && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TargetIcon className="h-5 w-5 text-green-500" />
                Courbe de fiabilité des paiements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reliability.reliability_curve.map((point, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">
                        {point.amount.toLocaleString()} sats
                      </div>
                      <div className="text-sm text-gray-600">
                        Probabilité: {(point.probability * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-right">
                      {point.recommended && (
                        <Badge variant="default" className="mb-1">
                          Recommandé
                        </Badge>
                      )}
                      <div className="text-xs text-gray-500">
                        IC: {(point.confidence_interval.lower * 100).toFixed(1)}% - {(point.confidence_interval.upper * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'bottlenecks' && bottlenecks && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Goulots d'étranglement identifiés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bottlenecks.bottlenecks.map((bottleneck, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">Canal {bottleneck.channel_id.substring(0, 8)}...</div>
                        <div className="text-sm text-gray-600">
                          {bottleneck.remote_pubkey.substring(0, 16)}...
                        </div>
                      </div>
                      <Badge variant={
                        bottleneck.severity === 'critical' ? 'destructive' :
                        bottleneck.severity === 'high' ? 'secondary' :
                        bottleneck.severity === 'medium' ? 'outline' : 'default'
                      }>
                        {bottleneck.severity}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Déséquilibre:</span> {bottleneck.imbalance_percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Problèmes:</span>
                        <ul className="list-disc list-inside ml-2 mt-1">
                          {bottleneck.issues.map((issue, i) => (
                            <li key={i} className="text-gray-600">{issue}</li>
                          ))}
                        </ul>
                      </div>
                      {bottleneck.recommendations.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Recommandations:</span>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            {bottleneck.recommendations.map((rec, i) => (
                              <li key={i} className="text-gray-600">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'optimization' && optimization && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Optimisations DazFlow Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Résumé de l'optimisation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      +{optimization.improvement_percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Amélioration attendue</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {optimization.estimated_revenue_increase.toFixed(2)} BTC
                    </div>
                    <div className="text-sm text-gray-600">Augmentation revenus</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {optimization.roi_estimate.toFixed(1)}x
                    </div>
                    <div className="text-sm text-gray-600">ROI estimé</div>
                  </div>
                </div>

                {/* Actions d'optimisation */}
                <div>
                  <h4 className="font-medium mb-3">Actions recommandées</h4>
                  <div className="space-y-3">
                    {optimization.recommendations.map((action, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{action.description}</div>
                          <Badge variant={
                            action.priority === 'critical' ? 'destructive' :
                            action.priority === 'high' ? 'secondary' :
                            action.priority === 'medium' ? 'outline' : 'default'
                          }>
                            {action.priority}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Coût:</span> {action.cost.toFixed(2)} BTC
                          </div>
                          <div>
                            <span className="text-gray-600">Bénéfice:</span> {action.expected_benefit.toFixed(2)} BTC
                          </div>
                          <div>
                            <span className="text-gray-600">Cible:</span> {action.target}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'network' && networkHealth && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                Santé du réseau Lightning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Métriques globales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {networkHealth.global_dazflow.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-600">DazFlow global</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(networkHealth.average_success_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Taux de succès</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(networkHealth.network_efficiency * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Efficacité réseau</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {networkHealth.critical_bottlenecks}
                    </div>
                    <div className="text-sm text-gray-600">Goulots critiques</div>
                  </div>
                </div>

                {/* Recommandations réseau */}
                {networkHealth.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Recommandations réseau</h4>
                    <div className="space-y-3">
                      {networkHealth.recommendations.map((rec, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{rec.description}</div>
                            <Badge variant={
                              rec.priority === 'critical' ? 'destructive' :
                              rec.priority === 'high' ? 'secondary' :
                              rec.priority === 'medium' ? 'outline' : 'default'
                            }>
                              {rec.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Impact: {rec.impact.toFixed(1)}% | {rec.implementation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DazFlowAnalytics; 