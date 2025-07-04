import React from 'react';

import MobileAccordion from './MobileAccordion';
import { Brain, Shield, Zap, TrendingUp, AlertTriangle, BarChart3, Settings, Clock } from '@/components/shared/ui/IconRegistry';

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
            <p className="text-red-400 font-semibold text-sm">{t('MobileFeaturesSection._protection_')}</p>
            <p className="text-xs">{t('MobileFeaturesSection.vitez_de_perdre_2500_en_moyenn')}</p>
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
            <p className="text-green-400 font-semibold text-sm">{t('MobileFeaturesSection._rsultat_')}</p>
            <p className="text-xs">{t('MobileFeaturesSection.45_de_revenus_en_moyenne_vs_op')}</p>
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
            <p className="text-blue-400 font-semibold text-sm">{t('MobileFeaturesSection._disponibilit_')}</p>
            <p className="text-xs">{t('MobileFeaturesSection.999_de_temps_de_fonctionnement')}</p>
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
            <p className="text-purple-400 font-semibold text-sm">{t('MobileFeaturesSection._insights_')}</p>
            <p className="text-xs">{t('MobileFeaturesSection.47_mtriques_diffrentes_pour_op')}</p>
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
            <p className="text-yellow-400 font-semibold text-sm">{t('MobileFeaturesSection._smart_')}</p>
            <p className="text-xs">{t('MobileFeaturesSection.filtrage_automatique_des_alert')}</p>
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
            <p className="text-[#00D4AA] font-semibold text-sm">{t('MobileFeaturesSection._scuris_')}</p>
            <p className="text-xs">{t('MobileFeaturesSection.aucun_accs_vos_fonds_donnes_ch')}</p>
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
            Fonctionnalités <span className="text-[#00D4AA]">{t('MobileFeaturesSection.avances')}</span>
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