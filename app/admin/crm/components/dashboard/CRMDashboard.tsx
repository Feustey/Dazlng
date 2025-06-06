'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Users, Mail, Target, Send, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon: Icon, className = '' }) => {
  return (
    <Card className={`p-6 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
          {title}
          <Icon className="h-4 w-4 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className={`text-xs flex items-center mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(trend)}% par rapport au mois dernier
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const CRMDashboard: React.FC = () => {
  // Dans un vrai projet, ces données viendraient d'une API
  const metrics = {
    activeCustomers: 1247,
    customerGrowth: 12.5,
    emailOpenRate: 24.8,
    openRateChange: -2.1,
    segmentCount: 8,
    activeCampaigns: 3,
    totalRevenue: 125430,
    revenueGrowth: 18.2
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard CRM</h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de vos clients et campagnes email
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Clients Actifs"
          value={metrics.activeCustomers.toLocaleString('fr-FR')}
          trend={metrics.customerGrowth}
          icon={Users}
          className="border-l-4 border-l-blue-500"
        />
        <MetricCard
          title="Taux d'Ouverture"
          value={`${metrics.emailOpenRate}%`}
          trend={metrics.openRateChange}
          icon={Mail}
          className="border-l-4 border-l-green-500"
        />
        <MetricCard
          title="Segments"
          value={metrics.segmentCount}
          icon={Target}
          className="border-l-4 border-l-purple-500"
        />
        <MetricCard
          title="Campagnes Actives"
          value={metrics.activeCampaigns}
          icon={Send}
          className="border-l-4 border-l-orange-500"
        />
      </div>

      {/* Revenus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Revenus Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {metrics.totalRevenue.toLocaleString('fr-FR')} €
            </div>
            <div className="text-sm text-green-600 flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{metrics.revenueGrowth}% ce mois
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                <div className="font-medium text-blue-900">Nouvelle Campagne</div>
                <div className="text-sm text-blue-600 mt-1">Créer une campagne email</div>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                <div className="font-medium text-purple-900">Nouveau Segment</div>
                <div className="text-sm text-purple-600 mt-1">Segmenter vos clients</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                <div className="font-medium text-green-900">Analytics</div>
                <div className="text-sm text-green-600 mt-1">Voir les performances</div>
              </button>
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
                <div className="font-medium text-orange-900">Export Données</div>
                <div className="text-sm text-orange-600 mt-1">Exporter la base clients</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu des segments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Segments de Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Clients Premium', count: 345, percentage: 28 },
              { name: 'Nouveaux Clients', count: 123, percentage: 10 },
              { name: 'Clients Inactifs', count: 89, percentage: 7 },
              { name: 'Clients Lightning', count: 234, percentage: 19 }
            ].map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{segment.name}</div>
                  <div className="text-sm text-gray-600">{segment.count} clients</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{segment.percentage}%</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dernières activités */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                type: 'campaign', 
                title: 'Newsletter Décembre envoyée',
                description: '1,247 emails envoyés avec 24.8% de taux d\'ouverture',
                time: 'Il y a 2 heures',
                status: 'success'
              },
              { 
                type: 'segment', 
                title: 'Segment "Clients Premium" mis à jour',
                description: '12 nouveaux clients ajoutés automatiquement',
                time: 'Il y a 4 heures',
                status: 'info'
              },
              { 
                type: 'customer', 
                title: 'Nouveau client inscrit',
                description: 'jean.dupont@example.com - Abonnement Premium',
                time: 'Il y a 6 heures',
                status: 'success'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' : 
                  activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-gray-600">{activity.description}</div>
                  <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 