import React from 'react';
import { Brain, Shield, Zap, TrendingUp, AlertTriangle, BarChart3, Settings, Clock } from 'lucide-react';
import MobileAccordion from './MobileAccordion';

const MobileFeaturesSection: React.FC = () => {
  const featureItems = [
    {
      id: 'ai-prediction',
      title: 'Prédiction IA Force-Closes',
      icon: <Brain className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Notre IA analyse des millions de données pour prédire les force-closes 6h à l'avance 
            avec une précision de 99.9%.
          </p>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 font-semibold text-sm">🛡️ Protection :</p>
            <p className="text-xs">Évitez de perdre 2,500€ en moyenne par force-close</p>
          </div>
        </div>
      )
    },
    {
      id: 'auto-optimization',
      title: 'Optimisation Automatique',
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            L'IA ajuste automatiquement vos paramètres de canaux pour maximiser les revenus 
            sans intervention manuelle.
          </p>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <p className="text-green-400 font-semibold text-sm">📈 Résultat :</p>
            <p className="text-xs">+45% de revenus en moyenne vs optimisation manuelle</p>
          </div>
        </div>
      )
    },
    {
      id: 'real-time-monitoring',
      title: 'Monitoring 24/7',
      icon: <Clock className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Surveillance continue de vos canaux, même pendant votre sommeil. 
            Alertes instantanées en cas de problème.
          </p>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400 font-semibold text-sm">⏰ Disponibilité :</p>
            <p className="text-xs">99.9% de temps de fonctionnement</p>
          </div>
        </div>
      )
    },
    {
      id: 'advanced-analytics',
      title: 'Analytics Avancées',
      icon: <BarChart3 className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Tableaux de bord détaillés avec métriques de performance, 
            historique des revenus et recommandations personnalisées.
          </p>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
            <p className="text-purple-400 font-semibold text-sm">📊 Insights :</p>
            <p className="text-xs">47 métriques différentes pour optimiser vos performances</p>
          </div>
        </div>
      )
    },
    {
      id: 'smart-alerts',
      title: 'Alertes Intelligentes',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Notifications intelligentes par email, SMS ou Telegram. 
            Seulement les alertes importantes, pas de spam.
          </p>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400 font-semibold text-sm">🔔 Smart :</p>
            <p className="text-xs">Filtrage automatique des alertes non critiques</p>
          </div>
        </div>
      )
    },
    {
      id: 'security-compliance',
      title: 'Sécurité & Conformité',
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Lecture seule de vos données, chiffrement de bout en bout, 
            conformité RGPD et audit de sécurité régulier.
          </p>
          <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-lg p-3">
            <p className="text-[#00D4AA] font-semibold text-sm">🔒 Sécurisé :</p>
            <p className="text-xs">Aucun accès à vos fonds, données chiffrées</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#232323] to-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Fonctionnalités <span className="text-[#00D4AA]">Avancées</span>
          </h2>
          <p className="text-gray-300">
            Découvrez comment notre IA révolutionne la gestion de nœuds Lightning
          </p>
        </div>
        
        {/* Version mobile avec accordéon */}
        <div className="md:hidden">
          <MobileAccordion 
            items={featureItems} 
            defaultOpen="ai-prediction"
          />
        </div>
        
        {/* Version desktop avec grille */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((item) => (
            <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#F7931A]">{item.icon}</span>
                <h3 className="font-semibold text-white text-lg">{item.title}</h3>
              </div>
              <div className="text-gray-300 leading-relaxed">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileFeaturesSection; 