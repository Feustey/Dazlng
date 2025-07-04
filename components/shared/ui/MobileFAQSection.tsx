import React from 'react';

import MobileAccordion from './MobileAccordion';
import { HelpCircle, Shield, Zap, TrendingUp, Users, Clock } from '@/components/shared/ui/IconRegistry';

const MobileFAQSection: React.FC = () => {
  const faqItems = [
    {
      id: 'what-is-daznode',
      title: 'Qu\'est-ce que DazNode ?',
      icon: <HelpCircle className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            DazNode est une IA qui surveille et optimise automatiquement vos canaux Lightning Network 24/7. 
            Elle prédit les force-closes 6h à l&apos;avance et maximise vos revenus.
          </p>
          <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-lg p-3">
            <p className="text-[#00D4AA] font-semibold">{t('MobileFAQSection._en_rsum_')}</p>
            <p className="text-sm">{t('MobileFAQSection.votre_assistant_personnel_pour')}</p>
          </div>
        </div>
      )
    },
    {
      id: 'how-it-works',
      title: 'Comment ça marche ?',
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <ol className="list-decimal list-inside space-y-2">
            <li>{t('MobileFAQSection.connectez_votre_nud_lightning_')}</li>
            <li>{t('MobileFAQSection.laposia_analyse_vos_canaux_en_')}</li>
            <li>{t('MobileFAQSection.optimisation_automatique_des_p')}</li>
            <li>{t('MobileFAQSection.alertes_prventives_pour_les_pr')}</li>
            <li>{t('MobileFAQSection.vos_revenus_augmentent_automat')}</li>
          </ol>
          <div className="bg-[#F7931A]/10 border border-[#F7931A]/20 rounded-lg p-3">
            <p className="text-[#F7931A] font-semibold">{t('MobileFAQSection._rsultat_')}</p>
            <p className="text-sm">{t('MobileFAQSection.45_de_revenus_en_moyenne_0_str')}</p>
          </div>
        </div>
      )
    },
    {
      id: 'safety-security',
      title: 'C\'est sûr et sécurisé ?',
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Absolument. DazNode ne touche jamais à vos fonds. Nous lisons seulement les données publiques 
            de votre nœud pour l&apos;analyse.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-400 font-semibold text-sm">{t('MobileFAQSection._scuris')}</p>
              <p className="text-xs">{t('MobileFAQSection.lecture_seule_pas_daposaccs_au')}</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-400 font-semibold text-sm">{t('MobileFAQSection._priv')}</p>
              <p className="text-xs">{t('MobileFAQSection.donnes_chiffres_rgpd_compliant')}</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'revenue-expectations',
      title: 'Quels revenus puis-je espérer ?',
      icon: <TrendingUp className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Les revenus varient selon votre capital et l'activité du réseau. Voici les moyennes observées :
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-[#F7931A]/10 rounded-lg p-3">
              <span className="text-sm">{t('MobileFAQSection.capital_1m_sats')}</span>
              <span className="text-[#F7931A] font-bold">{t('MobileFAQSection.50100mois')}</span>
            </div>
            <div className="flex justify-between items-center bg-[#00D4AA]/10 rounded-lg p-3">
              <span className="text-sm">{t('MobileFAQSection.capital_5m_sats')}</span>
              <span className="text-[#00D4AA] font-bold">{t('MobileFAQSection.200400mois')}</span>
            </div>
            <div className="flex justify-between items-center bg-[#FFE500]/10 rounded-lg p-3">
              <span className="text-sm">{t('MobileFAQSection.capital_10m_sats')}</span>
              <span className="text-[#FFE500] font-bold">{t('MobileFAQSection.400800mois')}</span>
            </div>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400 font-semibold text-sm">{t('MobileFAQSection._important_')}</p>
            <p className="text-xs">{t('MobileFAQSection.ces_chiffres_sont_indicatifs_l')}</p>
          </div>
        </div>
      )
    },
    {
      id: 'technical-requirements',
      title: 'Quelles compétences techniques ?',
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Aucune compétence technique avancée requise ! DazNode s'occupe de tout.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-lg">✅</span>
              <span className="text-sm">{t('MobileFAQSection.savoir_utiliser_un_ordinateur')}</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-lg">✅</span>
              <span className="text-sm">{t('MobileFAQSection.avoir_un_nud_lightning_umbrel_')}</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-lg">✅</span>
              <span className="text-sm">{t('MobileFAQSection.cest_tout_')}</span>
            </div>
          </div>
          <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-lg p-3">
            <p className="text-[#00D4AA] font-semibold text-sm">{t('MobileFAQSection._notre_promesse_')}</p>
            <p className="text-xs">{t('MobileFAQSection.si_vous_savez_utiliser_whatsap')}</p>
          </div>
        </div>
      )
    },
    {
      id: 'support-help',
      title: 'Besoin d\'aide ? Support ?',
      icon: <Clock className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Notre équipe et notre communauté sont là pour vous aider 24/7.
          </p>
          <div className="space-y-3">
            <a 
              href="https://t.me/tokenforgood" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
            >
              <span className="text-lg">💬</span>
              <div>
                <p className="font-semibold">{t('MobileFAQSection.telegram_communaut')}</p>
                <p className="text-sm opacity-90">{t('MobileFAQSection.support_gratuit_247')}</p>
              </div>
            </a>
            <a 
              href="mailto:support@daznode.com" 
              className="flex items-center gap-3 bg-[#F7931A] hover:bg-[#FFE500] text-black p-3 rounded-lg transition-colors"
            >
              <span className="text-lg">📧</span>
              <div>
                <p className="font-semibold">{t('MobileFAQSection.email_support')}</p>
                <p className="text-sm opacity-90">{t('MobileFAQSection.rponse_sous_24h')}</p>
              </div>
            </a>
            <a 
              href="https://docs.daznode.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#00D4AA] hover:bg-[#00D4AA]/80 text-black p-3 rounded-lg transition-colors"
            >
              <span className="text-lg">📚</span>
              <div>
                <p className="font-semibold">Documentation</p>
                <p className="text-sm opacity-90">{t('MobileFAQSection.guides_dtaills')}</p>
              </div>
            </a>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#1A1A1A] to-[#232323]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Questions <span className="text-[#F7931A]">{t('MobileFAQSection.frquentes')}</span>
          </h2>
          <p className="text-gray-300">
            Tout ce que vous devez savoir sur DazNode
          </p>
        </div>
        
        <div className="md:hidden">
          <MobileAccordion 
            items={faqItems} 
            defaultOpen="what-is-daznode"
          />
        </div>
        
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {faqItems.map((item) => (
            <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
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

export default MobileFAQSection; 