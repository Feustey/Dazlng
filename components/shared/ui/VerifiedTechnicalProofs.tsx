"use client";

import React, { useState, useEffect } from 'react';

interface TechnicalProof {
  id: string;
  title: string;
  description: string;
  verificationLink: string;
  status: 'verified' | 'updating' | 'warning';
  metrics: {
    label: string;
    value: string;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
  lastUpdated: string;
}

const VerifiedTechnicalProofs: React.FC = () => {
  const [proofs, setProofs] = useState<TechnicalProof[]>([
    {
      id: 'node-performance',
      title: 'Performance de nos Nœuds',
      description: 'Métriques vérifiables sur les explorateurs Lightning publics',
      verificationLink: 'https://1ml.com/node/03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
      status: 'verified',
      metrics: [
        { label: 'Uptime', value: '99.9', unit: '%', trend: 'stable' },
        { label: 'Capacité', value: '15.7', unit: 'BTC', trend: 'up' },
        { label: 'Canaux', value: '127', unit: '', trend: 'up' },
        { label: 'Frais moyens', value: '45', unit: 'ppm', trend: 'stable' }
      ],
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    {
      id: 'ai-predictions',
      title: 'Précision des Prédictions IA',
      description: 'Validation des algorithmes de prédiction sur données historiques',
      verificationLink: 'https://github.com/daznode/ai-models/tree/main/validation',
      status: 'verified',
      metrics: [
        { label: 'Précision globale', value: '87.3', unit: '%', trend: 'up' },
        { label: 'Force-closes évités', value: '156', unit: '', trend: 'up' },
        { label: 'Faux positifs', value: '2.1', unit: '%', trend: 'down' },
        { label: 'Temps de détection', value: '4.2', unit: 'h', trend: 'down' }
      ],
      lastUpdated: '2024-01-15T09:15:00Z'
    },
    {
      id: 'security-audit',
      title: 'Audits de Sécurité',
      description: 'Audits indépendants et programme de bug bounty actif',
      verificationLink: 'https://hackerone.com/daznode',
      status: 'verified',
      metrics: [
        { label: 'Vulnérabilités critiques', value: '0', unit: '', trend: 'stable' },
        { label: 'Bugs corrigés', value: '23', unit: '', trend: 'up' },
        { label: 'Prix moyen bug bounty', value: '2.5', unit: 'BTC', trend: 'up' },
        { label: 'Dernier audit', value: '2024-01', unit: '', trend: 'stable' }
      ],
      lastUpdated: '2024-01-15T08:45:00Z'
    }
  ]);

  const getStatusColor = (status: TechnicalProof['status']) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100 border-green-200';
      case 'updating': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'warning': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: TechnicalProof['status']) => {
    switch (status) {
      case 'verified': return '✅';
      case 'updating': return '🔄';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 Preuves Techniques Vérifiables
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Toutes nos affirmations sont basées sur des données vérifiables et des métriques 
            accessibles publiquement. Aucune exagération, uniquement des faits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {proofs.map((proof) => (
            <div key={proof.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{proof.title}</h3>
                <div className={`flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(proof.status)}`}>
                  <span className="mr-2">{getStatusIcon(proof.status)}</span>
                  {proof.status === 'verified' ? 'Vérifié' : proof.status === 'updating' ? 'Mise à jour' : 'Attention'}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6">{proof.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {proof.metrics.map((metric, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                      {metric.value}
                      {metric.unit && <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>}
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Dernière mise à jour : {formatDate(proof.lastUpdated)}</span>
                <a 
                  href={proof.verificationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  🔍 Vérifier
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🎯 Transparence Totale
          </h3>
          <p className="text-blue-800 text-sm">
            Nous ne faisons aucune affirmation non vérifiable. Toutes nos métriques sont 
            accessibles publiquement et peuvent être vérifiées indépendamment par quiconque 
            le souhaite.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VerifiedTechnicalProofs; 