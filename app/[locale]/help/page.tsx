"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardTitle } from "../../components/ui/card";
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
import Image from "next/image";

// Types pour les catégories et les FAQ
type CategoryId =
  | "getting_started"
  | "learning"
  | "transactions"
  | "operations"
  | "metrics"
  | "alby";

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
    alby: useRef<HTMLDivElement>(null),
  };

  const categories: Category[] = [
    {
      id: "getting_started",
      icon: <BookOpenIcon className="h-5 w-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "learning",
      icon: <BitcoinIcon className="h-5 w-5" />,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      id: "transactions",
      icon: <BarChartIcon className="h-5 w-5" />,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      id: "operations",
      icon: <ZapIcon className="h-5 w-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "metrics",
      icon: <NetworkIcon className="h-5 w-5" />,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      id: "alby",
      icon: (
        <div className="w-5 h-5 relative">
          <Image
            src="/images/alby-logo.svg"
            alt="Alby"
            fill
            className="object-contain"
            priority
          />
        </div>
      ),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  // Grouper les FAQ par catégorie
  const faqByCategory: Record<CategoryId, string[]> = {
    getting_started: ["what_is_lightning", "how_to_start", "why_bitcoin"],
    learning: ["how_to_transact", "keysend", "channel_close"],
    transactions: ["security", "backup_channels", "peers_connection"],
    operations: ["technical", "profitable_node", "channel_management"],
    metrics: ["node_monitoring", "sync_time", "tor_only"],
    alby: ["what_is_alby", "install_alby", "how_to_use_alby", "alby_features"],
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
      answer: `Pour commencer avec Daznode, suivez ces étapes :
1. Créez un compte en utilisant votre clé publique Nostr
2. Connectez votre portefeuille Bitcoin (nous recommandons Phoenix ou Blixt)
3. Suivez notre guide d'apprentissage pour comprendre les bases de Lightning
4. Commencez à gérer votre nœud et vos canaux

N'oubliez pas : "Not your keys, not your coins" - Gardez toujours le contrôle de vos fonds.`,
    },
    {
      id: "how_to_transact",
      icon: <BarChartIcon className="h-5 w-5" />,
      question: t("faq.how_to_transact"),
      answer: `Pour effectuer une transaction Lightning :
1. Assurez-vous d'avoir des fonds dans votre portefeuille
2. Cliquez sur "Envoyer" ou "Recevoir" selon votre besoin
3. Entrez le montant et l'adresse Lightning ou le QR code
4. Confirmez la transaction

Les transactions sont instantanées et les frais sont minimes.`,
    },
    {
      id: "keysend",
      icon: <ZapIcon className="h-5 w-5" />,
      question: t("faq.keysend"),
      answer: `Keysend est une fonctionnalité Lightning qui permet d'envoyer des paiements sans facture préalable. C'est comme un virement direct en Bitcoin. L'expéditeur a besoin uniquement de l'ID public du destinataire. C'est plus simple et plus rapide que les factures Lightning traditionnelles.`,
    },
    {
      id: "channel_close",
      icon: <NetworkIcon className="h-5 w-5" />,
      question: t("faq.channel_close"),
      answer: `Pour fermer un canal Lightning :
1. Allez dans la section "Canaux"
2. Sélectionnez le canal que vous souhaitez fermer
3. Cliquez sur "Fermer le canal"
4. Choisissez entre une fermeture coopérative (recommandée) ou unilatérale
5. Confirmez la fermeture

Les fonds seront disponibles sur votre adresse Bitcoin après la confirmation de la transaction.`,
    },
    {
      id: "security",
      icon: <ShieldIcon className="h-5 w-5" />,
      question: t("faq.security"),
      answer: `La sécurité de votre nœud Lightning est cruciale :
1. Gardez toujours une sauvegarde de vos clés privées
2. Utilisez un mot de passe fort pour votre portefeuille
3. Activez l'authentification à deux facteurs si disponible
4. Surveillez régulièrement l'activité de votre nœud
5. Maintenez votre logiciel à jour

En cas de doute, contactez notre support.`,
    },
    {
      id: "backup_channels",
      icon: <ServerIcon className="h-5 w-5" />,
      question: t("faq.backup_channels"),
      answer: `Pour sauvegarder vos canaux Lightning :
1. Exportez régulièrement votre fichier de canaux
2. Stockez la sauvegarde dans un endroit sûr
3. En cas de perte d'accès, utilisez la sauvegarde pour restaurer vos canaux
4. Vérifiez que tous les canaux sont correctement restaurés

Nous recommandons de faire une sauvegarde hebdomadaire.`,
    },
    {
      id: "peers_connection",
      icon: <UsersIcon className="h-5 w-5" />,
      question: t("faq.peers_connection"),
      answer: `Pour vous connecter à d'autres nœuds :
1. Obtenez l'adresse publique du nœud
2. Ouvrez un canal avec ce nœud
3. Définissez la capacité du canal
4. Confirmez l'ouverture du canal

Plus vous avez de connexions, plus votre nœud est robuste.`,
    },
    {
      id: "technical",
      icon: <CodeIcon className="h-5 w-5" />,
      question: t("faq.technical"),
      answer: `Les exigences techniques pour Daznode :
1. Une connexion Internet stable
2. Au moins 1 Go de RAM
3. 100 Go d'espace disque
4. Un processeur récent
5. Une connexion Tor (recommandée)

Nous fournissons une image Docker prête à l'emploi.`,
    },
    {
      id: "profitable_node",
      icon: <BarChartIcon className="h-5 w-5" />,
      question: t("faq.profitable_node"),
      answer: `Pour rendre votre nœud profitable :
1. Ouvrez des canaux avec une capacité suffisante
2. Fixez des frais de routage compétitifs
3. Maintenez une bonne liquidité
4. Surveillez les métriques de performance
5. Ajustez les paramètres selon l'activité

La rentabilité dépend de nombreux facteurs, notamment la taille du réseau et la concurrence.`,
    },
    {
      id: "channel_management",
      icon: <SettingsIcon className="h-5 w-5" />,
      question: t("faq.channel_management"),
      answer: `Pour gérer efficacement vos canaux :
1. Équilibrez la liquidité entrante et sortante
2. Ajustez régulièrement les frais de routage
3. Fermez les canaux peu utilisés
4. Ouvrez de nouveaux canaux stratégiques
5. Surveillez la santé des canaux

Une bonne gestion des canaux est essentielle pour un nœud performant.`,
    },
    {
      id: "node_monitoring",
      icon: <GlobeIcon className="h-5 w-5" />,
      question: t("faq.node_monitoring"),
      answer: `Pour surveiller votre nœud :
1. Utilisez notre tableau de bord intégré
2. Vérifiez les métriques en temps réel
3. Configurez des alertes pour les événements importants
4. Surveillez la santé du réseau
5. Analysez les performances de routage

La surveillance proactive permet d'éviter les problèmes.`,
    },
    {
      id: "sync_time",
      icon: <CheckCircleIcon className="h-5 w-5" />,
      question: t("faq.sync_time"),
      answer: `Le temps de synchronisation dépend de :
1. La vitesse de votre connexion Internet
2. La puissance de votre matériel
3. L'état de la blockchain Bitcoin
4. Le nombre de nœuds connectés
5. La méthode de synchronisation choisie

En moyenne, comptez 4-6 heures pour une synchronisation complète.`,
    },
    {
      id: "tor_only",
      icon: <LockIcon className="h-5 w-5" />,
      question: t("faq.tor_only"),
      answer: `L'utilisation de Tor est recommandée pour :
1. Améliorer la confidentialité
2. Éviter la censure
3. Accéder à des nœuds cachés
4. Protéger votre adresse IP
5. Renforcer la sécurité globale

Daznode prend en charge nativement les connexions Tor.`,
    },
    {
      id: "what_is_alby",
      icon: (
        <div className="w-5 h-5 relative">
          <Image
            src="/images/alby-logo.svg"
            alt="Alby"
            fill
            className="object-contain"
            priority
          />
        </div>
      ),
      question: t("faq.what_is_alby"),
      answer: `L'extension Alby est un portefeuille Bitcoin et Lightning Network pour votre navigateur. Elle vous permet de gérer vos fonds Bitcoin, d'effectuer des transactions Lightning, et de vous connecter à des applications Bitcoin de manière sécurisée. Alby est open-source et développée par une équipe dédiée à l'adoption de Bitcoin.`,
    },
    {
      id: "how_to_use_alby",
      icon: (
        <div className="w-5 h-5 relative">
          <Image
            src="/images/alby-logo.svg"
            alt="Alby"
            fill
            className="object-contain"
            priority
          />
        </div>
      ),
      question: t("faq.how_to_use_alby"),
      answer: `Pour utiliser l'extension Alby :
1. Installez l'extension depuis le site officiel (https://getalby.com)
2. Créez un compte et configurez votre portefeuille
3. Ajoutez des fonds à votre portefeuille
4. Utilisez Alby pour vous connecter à des applications Bitcoin
5. Effectuez des transactions Lightning directement depuis votre navigateur

Alby est compatible avec la plupart des navigateurs modernes.`,
    },
    {
      id: "alby_features",
      icon: (
        <div className="w-5 h-5 relative">
          <Image
            src="/images/alby-logo.svg"
            alt="Alby"
            fill
            className="object-contain"
            priority
          />
        </div>
      ),
      question: t("faq.alby_features"),
      answer: `Les fonctionnalités principales d'Alby incluent :
1. Portefeuille Lightning Network intégré
2. Gestion des clés Nostr
3. Connexion en un clic aux applications Bitcoin
4. Paiements sécurisés avec authentification
5. Interface utilisateur intuitive
6. Support multi-devices
7. Intégration avec les principales applications Bitcoin

Alby est régulièrement mis à jour avec de nouvelles fonctionnalités.`,
    },
    {
      id: "install_alby",
      icon: (
        <div className="w-5 h-5 relative">
          <Image
            src="/images/alby-logo.svg"
            alt="Alby"
            fill
            className="object-contain"
            priority
          />
        </div>
      ),
      question: t("faq.install_alby"),
      answer: `Pour installer l'extension Alby sur votre navigateur :

1. Visitez la page officielle d'Alby sur https://getalby.com/products/browser-extension
2. Cliquez sur le bouton d'installation correspondant à votre navigateur (Chrome, Firefox, Brave, etc.)
3. Suivez les instructions d'installation spécifiques à votre navigateur
4. Une fois installée, l'icône d'Alby apparaîtra dans votre barre d'extensions
5. Cliquez sur l'icône pour configurer votre portefeuille

L'installation est rapide et gratuite. Après l'installation, vous pourrez immédiatement commencer à utiliser les fonctionnalités de paiement Lightning et de connexion aux applications Bitcoin.`,
    },
  ];

  const scrollToSection = (sectionId: CategoryId) => {
    setActiveSection(sectionId);
    const section = sectionRefs[sectionId];
    if (section.current) {
      section.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredFaqItems = searchQuery
    ? faqItems.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text animate-slide-up text-center md:text-left">
            {t("title")}
          </h1>

          <div className="card-glass border-accent/20 p-4 md:p-6 rounded-lg animate-slide-up [animation-delay:200ms]">
            <div className="relative mb-8">
              <Input
                type="text"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-card/50 backdrop-blur-sm border-accent/20"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={`flex items-center gap-2 p-3 md:p-4 rounded-lg transition-all duration-200 hover:scale-105 ${
                    activeSection === category.id
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-card/50"
                  }`}
                  onClick={() => scrollToSection(category.id)}
                >
                  <div
                    className={`p-2 rounded-md ${category.bgColor} ${category.color}`}
                  >
                    {category.icon}
                  </div>
                  <span className="text-sm md:text-base">
                    {t(`categories.${category.id}`)}
                  </span>
                </Button>
              ))}
            </div>

            <div className="space-y-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  ref={sectionRefs[category.id]}
                  className="scroll-mt-20"
                >
                  <h2 className="text-2xl font-bold mb-4 gradient-text">
                    {t(`categories.${category.id}`)}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqByCategory[category.id].map((faqId) => {
                      const faq = faqItems.find((item) => item.id === faqId);
                      if (!faq) return null;
                      return (
                        <AccordionItem
                          key={faqId}
                          value={faqId}
                          className="border-accent/20 transition-all duration-200 hover:bg-card/50"
                        >
                          <AccordionTrigger className="hover:text-primary px-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-1 rounded-md ${category.bgColor} ${category.color}`}
                              >
                                {faq.icon}
                              </div>
                              <span className="text-left text-sm md:text-base">
                                {faq.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground px-4 pb-4">
                            <div className="prose prose-sm md:prose-base prose-gray dark:prose-invert max-w-none">
                              {faq.answer
                                .split("\n")
                                .map((paragraph, index) => {
                                  if (paragraph.startsWith("1.")) {
                                    const items = paragraph
                                      .split("\n")
                                      .filter((item) => item.match(/^\d+\./));
                                    return (
                                      <ol
                                        key={index}
                                        className="list-decimal list-inside space-y-2 my-4"
                                      >
                                        {items.map((item, i) => (
                                          <li
                                            key={i}
                                            className="leading-relaxed"
                                          >
                                            {item.replace(/^\d+\.\s/, "")}
                                          </li>
                                        ))}
                                      </ol>
                                    );
                                  }
                                  return (
                                    paragraph && (
                                      <p
                                        key={index}
                                        className="mb-4 leading-relaxed"
                                      >
                                        {paragraph}
                                      </p>
                                    )
                                  );
                                })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
