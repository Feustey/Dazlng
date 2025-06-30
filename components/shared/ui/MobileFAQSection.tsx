import React from 'react';
import { HelpCircle, Shield, Zap, TrendingUp, Users, Clock } from 'lucide-react';
import MobileAccordion from './MobileAccordion';

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
            <p className="text-[#00D4AA] font-semibold">💡 En résumé :</p>
            <p className="text-sm">Votre assistant personnel pour gagner plus d&apos;argent avec le Lightning Network.</p>
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
            <li>Connectez votre nœud Lightning (2 minutes)</li>
            <li>L&apos;IA analyse vos canaux en temps réel</li>
            <li>Optimisation automatique des paramètres</li>
            <li>Alertes préventives pour les problèmes</li>
            <li>Vos revenus augmentent automatiquement</li>
          </ol>
          <div className="bg-[#F7931A]/10 border border-[#F7931A]/20 rounded-lg p-3">
            <p className="text-[#F7931A] font-semibold">⚡ Résultat :</p>
            <p className="text-sm">+45% de revenus en moyenne, 0 stress, 0 compétence technique requise.</p>
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
              <p className="text-green-400 font-semibold text-sm">✅ Sécurisé</p>
              <p className="text-xs">Lecture seule, pas d&apos;accès aux fonds</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-400 font-semibold text-sm">🔒 Privé</p>
              <p className="text-xs">Données chiffrées, RGPD compliant</p>
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
              <span className="text-sm">Capital 1M sats</span>
              <span className="text-[#F7931A] font-bold">50-100€/mois</span>
            </div>
            <div className="flex justify-between items-center bg-[#00D4AA]/10 rounded-lg p-3">
              <span className="text-sm">Capital 5M sats</span>
              <span className="text-[#00D4AA] font-bold">200-400€/mois</span>
            </div>
            <div className="flex justify-between items-center bg-[#FFE500]/10 rounded-lg p-3">
              <span className="text-sm">Capital 10M sats</span>
              <span className="text-[#FFE500] font-bold">400-800€/mois</span>
            </div>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400 font-semibold text-sm">⚠️ Important :</p>
            <p className="text-xs">Ces chiffres sont indicatifs. Les performances passées ne garantissent pas les résultats futurs.</p>
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
              <span className="text-sm">Savoir utiliser un ordinateur</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-lg">✅</span>
              <span className="text-sm">Avoir un nœud Lightning (Umbrel, Voltage, etc.)</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-lg">✅</span>
              <span className="text-sm">C'est tout !</span>
            </div>
          </div>
          <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-lg p-3">
            <p className="text-[#00D4AA] font-semibold text-sm"> Notre promesse :</p>
            <p className="text-xs">Si vous savez utiliser WhatsApp, vous pouvez utiliser DazNode.</p>
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
                <p className="font-semibold">Telegram Communauté</p>
                <p className="text-sm opacity-90">Support gratuit 24/7</p>
              </div>
            </a>
            <a 
              href="mailto:support@daznode.com" 
              className="flex items-center gap-3 bg-[#F7931A] hover:bg-[#FFE500] text-black p-3 rounded-lg transition-colors"
            >
              <span className="text-lg">📧</span>
              <div>
                <p className="font-semibold">Email Support</p>
                <p className="text-sm opacity-90">Réponse sous 24h</p>
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
                <p className="text-sm opacity-90">Guides détaillés</p>
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
            Questions <span className="text-[#F7931A]">Fréquentes</span>
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