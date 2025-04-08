"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  SearchIcon,
  BookOpenIcon,
  BarChartIcon,
  ZapIcon,
  MailIcon,
  BitcoinIcon,
  ShieldIcon,
  NetworkIcon,
  WalletIcon,
  LockIcon,
  CodeIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  GiftIcon,
  ServerIcon,
  AlertTriangleIcon,
  SettingsIcon,
  UsersIcon,
  GlobeIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

// Types pour les catégories et les FAQ
type CategoryId =
  | "getting_started"
  | "learning"
  | "transactions"
  | "operations"
  | "metrics"
  | "nwc";

interface Category {
  id: CategoryId;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface FaqItem {
  id: string;
  icon: React.ReactNode;
  question: string;
  answer: string;
}

export default function HelpPage() {
  const t = useTranslations("Help");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<CategoryId | "">("");

  // Références pour les sections
  const sectionRefs = {
    getting_started: useRef<HTMLDivElement>(null),
    learning: useRef<HTMLDivElement>(null),
    transactions: useRef<HTMLDivElement>(null),
    operations: useRef<HTMLDivElement>(null),
    metrics: useRef<HTMLDivElement>(null),
    nwc: useRef<HTMLDivElement>(null),
  };

  const categories: Category[] = [
    {
      id: "getting_started",
      icon: <BookOpenIcon className="h-5 w-5" />,
      color: "text-primary-600 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-950",
    },
    {
      id: "learning",
      icon: <BitcoinIcon className="h-5 w-5" />,
      color: "text-secondary-600 dark:text-secondary-400",
      bgColor: "bg-secondary-50 dark:bg-secondary-950",
    },
    {
      id: "transactions",
      icon: <BarChartIcon className="h-5 w-5" />,
      color: "text-accent-600 dark:text-accent-400",
      bgColor: "bg-accent-50 dark:bg-accent-950",
    },
    {
      id: "operations",
      icon: <ZapIcon className="h-5 w-5" />,
      color: "text-primary-600 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-950",
    },
    {
      id: "metrics",
      icon: <NetworkIcon className="h-5 w-5" />,
      color: "text-secondary-600 dark:text-secondary-400",
      bgColor: "bg-secondary-50 dark:bg-secondary-950",
    },
    {
      id: "nwc",
      icon: <WalletIcon className="h-5 w-5" />,
      color: "text-accent-600 dark:text-accent-400",
      bgColor: "bg-accent-50 dark:bg-accent-950",
    },
  ];

  // Grouper les FAQ par catégorie
  const faqByCategory: Record<CategoryId, string[]> = {
    getting_started: ["what_is_lightning", "how_to_start", "why_bitcoin"],
    learning: ["how_to_transact", "keysend", "channel_close"],
    transactions: ["security", "backup_channels", "peers_connection"],
    operations: ["technical", "profitable_node", "channel_management"],
    metrics: ["node_monitoring", "sync_time", "tor_only"],
    nwc: ["how_to_connect"],
  };

  const faqItems: FaqItem[] = [
    {
      id: "what_is_lightning",
      icon: <ZapIcon className="h-5 w-5" />,
      question: t("faq.what_is_lightning"),
      answer: `Lightning Network est une solution de couche 2 (L2) pour Bitcoin qui implémente un réseau de canaux de paiement hors chaîne. En utilisant des contrats intelligents et des signatures cryptographiques, Lightning permet des transactions instantanées avec des frais minimes, tout en préservant la sécurité et la décentralisation de Bitcoin. C'est la solution la plus prometteuse pour l'adoption mondiale de Bitcoin comme système de paiement.`,
    },
    {
      id: "why_bitcoin",
      icon: <BitcoinIcon className="h-5 w-5" />,
      question: t("faq.why_bitcoin"),
      answer: `Bitcoin est la seule cryptomonnaie véritablement décentralisée et sécurisée. Son réseau est maintenu par des milliers de nœuds indépendants, sa sécurité est prouvée par plus de 14 ans d'opération, et son approvisionnement est fixé à 21 millions d'unités. Les autres "cryptomonnaies" sont soit des copies de Bitcoin avec des compromis sur la sécurité, soit des projets centralisés déguisés en décentralisés. Bitcoin est l'argent le plus dur jamais créé.`,
    },
    {
      id: "how_to_start",
      icon: <BookOpenIcon className="h-5 w-5" />,
      question: t("faq.how_to_start"),
      answer: `Pour commencer avec DazLng, suivez ces étapes :
1. Créez un compte en utilisant votre clé publique Nostr
2. Connectez votre portefeuille Bitcoin (nous recommandons Phoenix ou Blixt)
3. Suivez notre guide d'apprentissage pour comprendre les bases de Lightning
4. Commencez à gérer votre nœud et vos canaux

N'oubliez pas : "Not your keys, not your coins" - Gardez toujours le contrôle de vos fonds.`,
    },
    {
      id: "how_to_connect",
      icon: <WalletIcon className="h-5 w-5" />,
      question: t("faq.how_to_connect"),
      answer: `Nostr Wallet Connect (NWC) est un protocole open-source qui permet une connexion sécurisée entre votre portefeuille et DazLng. Le processus est simple :
1. Scannez le QR code avec votre portefeuille compatible NWC
2. Autorisez la connexion dans votre portefeuille
3. Votre portefeuille est maintenant connecté de manière sécurisée

La sécurité est garantie par des signatures cryptographiques et des clés privées qui ne quittent jamais votre appareil.`,
    },
    {
      id: "how_to_transact",
      icon: <BarChartIcon className="h-5 w-5" />,
      question: t("faq.how_to_transact"),
      answer: `Les transactions Lightning sont des transferts de valeur qui se produisent à travers un réseau de canaux de paiement. Voici comment ça marche :
1. Créez ou utilisez un canal existant avec un nœud partenaire
2. Envoyez ou recevez des satoshis via le canal
3. Les transactions sont validées par le réseau Lightning
4. Les frais sont minimes (quelques satoshis) comparés aux frais on-chain

Le réseau Lightning utilise le routage onion pour protéger la vie privée des utilisateurs.`,
    },
    {
      id: "security",
      icon: <ShieldIcon className="h-5 w-5" />,
      question: t("faq.security"),
      answer: `DazLng utilise plusieurs couches de sécurité pour protéger vos fonds :
1. Toutes les transactions sont signées cryptographiquement
2. Les clés privées ne quittent jamais votre appareil
3. Les canaux Lightning sont protégés par des contrats intelligents
4. Le réseau utilise le routage onion pour la confidentialité
5. Les sauvegardes sont chiffrées et stockées de manière sécurisée

"Trust, but verify" - Vous pouvez vérifier toutes les transactions sur la blockchain Bitcoin.`,
    },
    {
      id: "technical",
      icon: <CodeIcon className="h-5 w-5" />,
      question: t("faq.technical"),
      answer: `Pour les utilisateurs techniques, DazLng offre :
- API RESTful pour l'intégration avec d'autres services
- Support des plugins Lightning (comme CLN)
- Monitoring en temps réel des métriques du nœud
- Configuration avancée des paramètres de routage
- Support des tests et des canaux privés
- Intégration avec les outils de développement Bitcoin

Le code source est open-source et disponible sur GitHub.`,
    },
    {
      id: "profitable_node",
      icon: <BitcoinIcon className="h-5 w-5" />,
      question: t("faq.profitable_node"),
      answer: `Pour optimiser la rentabilité de votre nœud Lightning :
1. Ouvrez des canaux avec des nœuds bien positionnés dans le réseau
2. Maintenez un bon équilibre de liquidité (pas trop, pas trop peu)
3. Ajustez vos frais de routage en fonction de l'activité du réseau
4. Surveillez les métriques de performance de vos canaux
5. Évitez les canaux avec des nœuds inactifs ou peu fiables

La rentabilité n'est pas garantie, mais ces stratégies augmentent vos chances de générer des revenus.`,
    },
    {
      id: "channel_management",
      icon: <NetworkIcon className="h-5 w-5" />,
      question: t("faq.channel_management"),
      answer: `Une bonne gestion des canaux est essentielle :
1. Diversifiez vos canaux entre différents nœuds pour réduire les risques
2. Maintenez un ratio équilibré entre les fonds entrants et sortants
3. Surveillez régulièrement l'état de vos canaux (actifs, inactifs, en attente)
4. Fermez les canaux non rentables ou problématiques
5. Ouvrez de nouveaux canaux stratégiquement pour améliorer votre position dans le réseau

N'oubliez pas de toujours avoir une réserve de fonds pour les frais de fermeture de canaux.`,
    },
    {
      id: "backup_channels",
      icon: <LockIcon className="h-5 w-5" />,
      question: t("faq.backup_channels"),
      answer: `La sauvegarde des canaux est cruciale pour la sécurité de vos fonds :
1. Exportez régulièrement votre fichier de sauvegarde de canaux
2. Stockez les sauvegardes dans plusieurs emplacements sécurisés
3. Utilisez le chiffrement pour protéger vos sauvegardes
4. Testez périodiquement la restauration de vos sauvegardes
5. Conservez une copie de vos clés privées de manière sécurisée

En cas de perte d'accès à votre nœud, une bonne sauvegarde vous permettra de récupérer vos fonds.`,
    },
    {
      id: "peers_connection",
      icon: <UsersIcon className="h-5 w-5" />,
      question: t("faq.peers_connection"),
      answer: `Si votre nœud n'a pas de pairs, voici comment résoudre le problème :
1. Vérifiez votre connexion Internet et les paramètres de pare-feu
2. Assurez-vous que le port Lightning (9735 par défaut) est ouvert
3. Utilisez des nœuds publics connus pour établir des connexions
4. Rejoignez des communautés Lightning pour trouver des pairs fiables
5. Vérifiez les logs de votre nœud pour identifier d'éventuelles erreurs

Un nœud sans pairs ne peut pas participer au réseau Lightning.`,
    },
    {
      id: "tor_only",
      icon: <GlobeIcon className="h-5 w-5" />,
      question: "Comment passer en mode Tor uniquement ?",
      answer: `Pour passer votre nœud en mode Tor uniquement :
1. Assurez-vous que Tor est correctement installé et configuré
2. Modifiez les paramètres de votre nœud pour désactiver les connexions directes
3. Configurez les proxies Tor pour toutes les connexions sortantes
4. Redémarrez votre nœud pour appliquer les changements
5. Vérifiez que toutes les connexions passent bien par Tor

Le mode Tor uniquement améliore la confidentialité mais peut affecter les performances.`,
    },
    {
      id: "sync_time",
      icon: <ServerIcon className="h-5 w-5" />,
      question: "Combien de temps faut-il pour synchroniser Bitcoin Core ?",
      answer: `Le temps de synchronisation de Bitcoin Core dépend de plusieurs facteurs :
1. La vitesse de votre connexion Internet
2. La puissance de votre matériel (CPU, RAM, stockage)
3. La méthode de synchronisation (blockchain complète ou pruned)
4. Le nombre de connexions peers

En général, avec une bonne connexion et un matériel récent, la synchronisation complète prend 1 à 3 jours. Avec un nœud pruned, cela peut prendre 12 à 24 heures.`,
    },
    {
      id: "keysend",
      icon: <ZapIcon className="h-5 w-5" />,
      question: "Qu'est-ce que Keysend et comment l'utiliser ?",
      answer: `Keysend est une fonctionnalité Lightning qui permet d'envoyer des paiements sans facture préalable :
1. L'expéditeur connaît uniquement la clé publique du destinataire
2. Le paiement est envoyé directement sans génération de facture
3. Le destinataire doit accepter le paiement à l'avance
4. Keysend est idéal pour les paiements automatiques et les microtransactions
5. Cette fonctionnalité améliore la confidentialité des transactions

Keysend est particulièrement utile pour les applications automatisées et les services de streaming de satoshis.`,
    },
    {
      id: "channel_close",
      icon: <AlertTriangleIcon className="h-5 w-5" />,
      question:
        "J'ai perdu des satoshis lors de la fermeture d'un canal, pourquoi ?",
      answer: `La perte de satoshis lors de la fermeture d'un canal peut être due à plusieurs raisons :
1. Frais de transaction on-chain pour la fermeture du canal
2. Différence entre la capacité du canal et le solde réel
3. Frais de routage accumulés pendant l'utilisation du canal
4. Fermeture non coopérative entraînant des frais supplémentaires
5. Erreurs dans la gestion des fonds du canal

Pour éviter ces pertes, planifiez toujours une réserve de fonds pour les frais de fermeture et privilégiez les fermetures coopératives.`,
    },
    {
      id: "node_monitoring",
      icon: <SettingsIcon className="h-5 w-5" />,
      question: "Comment surveiller efficacement mon nœud ?",
      answer: `Une surveillance efficace de votre nœud est essentielle :
1. Utilisez les outils de monitoring intégrés à DazLng
2. Configurez des alertes pour les événements importants
3. Surveillez régulièrement les métriques de performance
4. Vérifiez l'état de vos canaux et la liquidité disponible
5. Tenez un journal des modifications et des incidents

Une bonne surveillance vous permet de détecter et résoudre les problèmes avant qu'ils n'affectent vos opérations.`,
    },
    {
      id: "daznode_setup",
      icon: <ServerIcon className="h-5 w-5" />,
      question: "Comment configurer correctement mon Daznode ?",
      answer: `La configuration initiale de votre Daznode est cruciale pour son bon fonctionnement :

1. Synchronisation du réseau :
   - La synchronisation complète de Bitcoin Core peut prendre 1 à 3 jours
   - Assurez-vous d'avoir une connexion Internet stable
   - Vérifiez régulièrement l'avancement de la synchronisation

2. Installation d'Umbrel :
   - Umbrel est préinstallé avec les applications de base
   - Changez immédiatement les mots de passe par défaut
   - Configurez les paramètres de sécurité dès le premier démarrage

3. Configuration de la sécurité :
   - Modifiez tous les mots de passe par défaut
   - Activez l'authentification à deux facteurs si disponible
   - Configurez un pare-feu approprié
   - Sauvegardez régulièrement vos clés de récupération

4. Optimisation des performances :
   - Ajustez les paramètres de mémoire selon votre matériel
   - Configurez les sauvegardes automatiques
   - Activez le monitoring des ressources

5. Vérifications post-installation :
   - Testez la connectivité du réseau
   - Vérifiez l'état de tous les services
   - Validez les sauvegardes
   - Testez la restauration des données

Une configuration soignée au démarrage évitera bien des problèmes par la suite.`,
    },
  ];

  // Fonction pour naviguer vers une section
  const scrollToSection = (sectionId: CategoryId) => {
    setActiveSection(sectionId);
    sectionRefs[sectionId].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Filtrer les FAQ en fonction de la recherche
  const filteredFaqItems = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-background to-secondary-50 dark:from-primary-950 dark:via-background dark:to-secondary-950">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 dark:from-primary-400 dark:via-secondary-400 dark:to-accent-400 text-transparent bg-clip-text">
            {t("title")}
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            {t("description")}
          </p>

          <div className="relative mb-8">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToSection(category.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
                  activeSection === category.id
                    ? "bg-primary/20 dark:bg-primary/30"
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <div
                  className={`p-3 rounded-full mb-2 ${category.bgColor} ${category.color}`}
                >
                  {category.icon}
                </div>
                <span className="text-sm font-medium">
                  {t(`categories.${category.id}`)}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {categories.map((category) => (
              <div
                key={category.id}
                ref={sectionRefs[category.id]}
                className="scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`p-2 rounded-lg mr-3 ${category.bgColor} ${category.color}`}
                  >
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-semibold">
                    {t(`categories.${category.id}`)}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {faqByCategory[category.id].map((faqId) => {
                    const faq = faqItems.find((item) => item.id === faqId);
                    if (!faq) return null;

                    return (
                      <AccordionItem key={faqId} value={faqId}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center">
                            <div className={`mr-3 ${category.color}`}>
                              {faq.icon}
                            </div>
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-10 text-muted-foreground">
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
