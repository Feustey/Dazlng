import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";
import { HelpCircle, Shield, Zap, TrendingUp, Users, Clock } from "@/components/shared/ui/IconRegistry";

const MobileFAQSection: React.FC = () => {
  const { t } = useAdvancedTranslation("common");

  const faqItems = [
    {
      id: "what-is-daznode",
      title: "Qu'est-ce que DazNode ?",
      icon: <HelpCircle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p>
            DazNode est une IA qui surveille et optimise automatiquement vos canaux Lightning Network 24/7. 
            Elle prédit les force-closes 6h à l'avance et maximise vos revenus.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-[#00D4AA] font-semibold">En résumé :</p>
            <p className="text-sm">Votre assistant personnel pour optimiser vos revenus Lightning</p>
          </div>
        </div>
      )
    },
    {
      id: "how-it-works",
      title: "Comment ça marche ?",
      icon: <Zap className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Connectez votre nœud Lightning</li>
            <li>L'IA analyse vos canaux en temps réel</li>
            <li>Optimisation automatique des paramètres</li>
            <li>Alertes préventives pour les problèmes</li>
            <li>Vos revenus augmentent automatiquement</li>
          </ol>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-[#F7931A] font-semibold">Résultat :</p>
            <p className="text-sm">+45% de revenus en moyenne, 0 stress</p>
          </div>
        </div>
      )
    },
    {
      id: "safety-security",
      title: "C'est sûr et sécurisé ?",
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p>
            Absolument. DazNode ne touche jamais à vos fonds. Nous lisons seulement les données publiques 
            de votre nœud pour l'analyse.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-400 font-semibold text-sm">Sécurité</p>
              <p className="text-xs">Lecture seule, pas d'accès aux fonds</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-400 font-semibold text-sm">Confidentialité</p>
              <p className="text-xs">Données chiffrées, RGPD compliant</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "revenue-expectations",
      title: "Quels revenus puis-je espérer ?",
      icon: <TrendingUp className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p>
            Les revenus varient selon votre capital et l'activité du réseau. Voici les moyennes observées :
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Capital 1M sats</span>
              <span className="text-[#F7931A] font-bold">50-100€/mois</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Capital 5M sats</span>
              <span className="text-[#00D4AA] font-bold">200-400€/mois</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Capital 10M sats</span>
              <span className="text-[#FFE500] font-bold">400-800€/mois</span>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold text-sm">Important :</p>
            <p className="text-xs">Ces chiffres sont indicatifs, les résultats peuvent varier</p>
          </div>
        </div>
      )
    },
    {
      id: "technical-requirements",
      title: "Quelles compétences techniques ?",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p>
            Aucune compétence technique avancée requise ! DazNode s'occupe de tout.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span className="text-sm">Savoir utiliser un ordinateur</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span className="text-sm">Avoir un nœud Lightning (Umbrel, etc.)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span className="text-sm">C'est tout !</span>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-[#00D4AA] font-semibold text-sm">Notre promesse :</p>
            <p className="text-xs">Si vous savez utiliser WhatsApp, vous pouvez utiliser DazNode</p>
          </div>
        </div>
      )
    },
    {
      id: "support-help",
      title: "Besoin d'aide ? Support ?",
      icon: <Clock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p>
            Notre équipe et notre communauté sont là pour vous aider 24/7.
          </p>
          <div className="space-y-3">
            <a 
              href="https://t.me/daznode"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-lg">💬</span>
              <div>
                <p className="font-semibold">Telegram communauté</p>
                <p className="text-sm opacity-90">Support gratuit 24/7</p>
              </div>
            </a>
            <a 
              href="mailto:contact@daznode.com"
              className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-lg">📧</span>
              <div>
                <p className="font-semibold">Email support</p>
                <p className="text-sm opacity-90">Réponse sous 24h</p>
              </div>
            </a>
            <a 
              href="/docs"
              className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
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
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Questions <span className="text-[#F7931A]">Fréquentes</span>
          </h2>
          <p className="text-lg text-gray-300">
            Tout ce que vous devez savoir sur DazNode
          </p>
        </div>
        
        <div className="space-y-6">
          {faqItems.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#F7931A]">{item.icon}</span>
                <h3 className="font-semibold text-white text-lg">{item.title}</h3>
              </div>
              <div className="text-gray-300">
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