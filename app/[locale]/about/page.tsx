"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  BookOpenIcon,
  BarChartIcon,
  ZapIcon,
  UsersIcon,
  MailIcon,
  TwitterIcon,
  GithubIcon,
  ShieldIcon,
  GlobeIcon,
  HeartIcon,
  CodeIcon,
  ArrowRightIcon,
  BoltIcon,
  LockIcon,
  RocketIcon,
  NetworkIcon,
} from "lucide-react";

// Type pour nos données de contenu
type AboutContent = {
  title: string;
  subtitle?: string;
  cta?: string;
  sections: Array<{
    title: string;
    content?: string;
    items?: string[];
  }>;
};

export default function AboutPage() {
  const t = useTranslations("About");
  const locale = useLocale();
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  const LightningBoltIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
    </svg>
  );

  const NetworkIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  );

  useEffect(() => {
    // Charger le contenu en fonction de la locale
    const fetchContent = async () => {
      try {
        // Importer dynamiquement le bon fichier JSON selon la locale
        const contentData = await import(
          `../../../app/content/about-${locale}.json`
        );
        setContent(contentData.default);
      } catch (error) {
        console.error("Erreur lors du chargement du contenu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">
          Contenu non disponible
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Bannière héroïque animée */}
      <div className="relative bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 min-h-[500px] md:min-h-[600px] overflow-hidden">
        {/* Grille d'animation en arrière-plan */}
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-pattern opacity-20"></div>

        {/* Éléments flottants d'illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20, x: -30 }}
          animate={{ opacity: 0.7, y: 0, x: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-20 left-10 hidden md:block"
        >
          <div className="text-primary opacity-30">
            <LightningBoltIcon />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20, x: 30 }}
          animate={{ opacity: 0.6, y: 0, x: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute top-40 right-20 hidden md:block"
        >
          <div className="text-secondary opacity-30 h-16 w-16">
            <NetworkIcon />
          </div>
        </motion.div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-3xl mx-auto text-center pt-20 md:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-block p-1 px-3 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                Daznode Lightning Manager
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                {content.title}
              </h1>

              {content.subtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {content.subtitle}
                </p>
              )}

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all text-white"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  <ZapIcon className="mr-2 h-5 w-5" />
                  {content.cta || t("getStarted")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5"
                  onClick={() =>
                    (window.location.href = "https://github.com/daznode")
                  }
                >
                  <GithubIcon className="mr-2 h-5 w-5" />
                  GitHub
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Vague de séparation */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-16 md:h-24"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-background"
            ></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Section de statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            <Card className="text-center p-6 border-primary/10 bg-primary/5 hover:bg-primary/10 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                30k+
              </div>
              <div className="text-sm text-muted-foreground">
                {t("stats.nodes")}
              </div>
            </Card>
            <Card className="text-center p-6 border-accent/10 bg-accent/5 hover:bg-accent/10 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                100k+
              </div>
              <div className="text-sm text-muted-foreground">
                {t("stats.channels")}
              </div>
            </Card>
            <Card className="text-center p-6 border-secondary/10 bg-secondary/5 hover:bg-secondary/10 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                5000+
              </div>
              <div className="text-sm text-muted-foreground">
                {t("stats.bitcoins")}
              </div>
            </Card>
            <Card className="text-center p-6 border-primary/10 bg-primary/5 hover:bg-primary/10 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                24/7
              </div>
              <div className="text-sm text-muted-foreground">
                {t("stats.monitoring")}
              </div>
            </Card>
          </motion.div>

          {/* Sections de contenu */}
          {content.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="mb-20"
            >
              <Card
                className={`overflow-hidden border-${index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent"}/20 hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Partie texte */}
                  <div className="p-8 md:p-10 flex-1">
                    <div className="flex items-center mb-6">
                      {index % 3 === 0 && (
                        <div className="p-2 rounded-lg bg-primary/10 mr-3">
                          <LightningBoltIcon />
                        </div>
                      )}
                      {index % 3 === 1 && (
                        <div className="p-2 rounded-lg bg-secondary/10 mr-3">
                          <NetworkIcon />
                        </div>
                      )}
                      {index % 3 === 2 && (
                        <div className="p-2 rounded-lg bg-accent/10 mr-3">
                          <ShieldIcon className="h-6 w-6 text-accent" />
                        </div>
                      )}
                      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {section.title}
                      </h2>
                    </div>

                    {section.content && (
                      <p className="text-lg text-muted-foreground mb-6">
                        {section.content}
                      </p>
                    )}

                    {section.items && (
                      <div className="space-y-3">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-start space-x-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
                          >
                            <ArrowRightIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Partie image/illustration - maintenant à côté */}
                  <div
                    className={`bg-gradient-to-br from-${index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent"}/10 to-background p-6 border-l border-${index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent"}/20 flex items-center justify-center w-full md:w-1/3`}
                  >
                    <div
                      className={`text-${index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent"} opacity-60 max-w-xs mx-auto`}
                    >
                      {index % 3 === 0 ? (
                        <div className="relative w-32 h-32">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : index % 3 === 1 ? (
                        <div className="relative w-32 h-32">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="18"
                              cy="5"
                              r="3"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <circle
                              cx="6"
                              cy="12"
                              r="3"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <circle
                              cx="18"
                              cy="19"
                              r="3"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <line
                              x1="8.59"
                              y1="13.51"
                              x2="15.42"
                              y2="17.49"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <line
                              x1="15.41"
                              y1="6.51"
                              x2="8.59"
                              y2="10.49"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="relative w-32 h-32">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 16V12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 8H12.01"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Appel à l'action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-20 text-center"
          >
            <Card className="bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-10 border-accent/20">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                {t("joinRevolution")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t("joinDesc")}
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all text-white"
                onClick={() => (window.location.href = "/dashboard")}
              >
                <ZapIcon className="mr-2 h-5 w-5" />
                {t("getStarted")}
              </Button>
            </Card>
          </motion.div>

          {/* Section de contact et liens sociaux */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center mt-20"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("contact")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("contactDesc")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="default"
                className="flex items-center gap-2"
                onClick={() =>
                  window.open("https://twitter.com/daznode", "_blank")
                }
              >
                <TwitterIcon className="h-5 w-5" />
                <span>Twitter</span>
              </Button>
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() =>
                  window.open("https://github.com/daznode", "_blank")
                }
              >
                <GithubIcon className="h-5 w-5" />
                <span>GitHub</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open("mailto:contact@daznode.com")}
              >
                <MailIcon className="h-5 w-5" />
                <span>Email</span>
              </Button>
            </div>
          </motion.div>

          {/* Section FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Questions fréquentes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-primary/20 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <ZapIcon className="h-5 w-5 text-primary mr-2" />
                  Comment fonctionne un nœud Lightning ?
                </h3>
                <p className="text-muted-foreground">
                  Un nœud Lightning est un point d'accès au réseau Lightning qui
                  permet de créer des canaux de paiement avec d'autres nœuds.
                  Ces canaux permettent d'effectuer des transactions rapides et
                  peu coûteuses sans enregistrer chaque transaction sur la
                  blockchain Bitcoin.
                </p>
              </Card>

              <Card className="p-6 border-secondary/20 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <ShieldIcon className="h-5 w-5 text-secondary mr-2" />
                  Est-ce sécurisé de gérer mon propre nœud ?
                </h3>
                <p className="text-muted-foreground">
                  Oui, avec Daznode, la sécurité est notre priorité. Nous
                  utilisons des protocoles de sécurité avancés et des
                  sauvegardes automatiques pour protéger vos fonds. De plus,
                  vous conservez toujours le contrôle total de vos clés privées.
                </p>
              </Card>

              <Card className="p-6 border-accent/20 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <BarChartIcon className="h-5 w-5 text-accent mr-2" />
                  Quels sont les avantages financiers ?
                </h3>
                <p className="text-muted-foreground">
                  En gérant un nœud Lightning, vous pouvez gagner des frais de
                  routage lorsque d'autres utilisateurs transitent par vos
                  canaux. Ces revenus peuvent être modestes au début mais
                  augmentent avec la taille et l'activité de votre nœud.
                </p>
              </Card>

              <Card className="p-6 border-primary/20 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <UsersIcon className="h-5 w-5 text-primary mr-2" />
                  Quelle est la communauté autour de Daznode ?
                </h3>
                <p className="text-muted-foreground">
                  Notre communauté est composée de passionnés de Bitcoin et de
                  la technologie Lightning. Nous organisons régulièrement des
                  webinaires, des ateliers et des événements pour partager nos
                  connaissances et aider les nouveaux utilisateurs.
                </p>
              </Card>
            </div>
          </motion.div>

          {/* Section témoignages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ce que disent nos utilisateurs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-primary/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">JD</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Jean Dupont</h3>
                    <p className="text-sm text-muted-foreground">
                      Entrepreneur
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "Daznode a transformé ma façon de gérer mes transactions
                  Bitcoin. La simplicité d'utilisation est impressionnante pour
                  une technologie aussi puissante."
                </p>
              </Card>

              <Card className="p-6 border-secondary/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
                    <span className="text-secondary font-bold">ML</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Marie Laurent</h3>
                    <p className="text-sm text-muted-foreground">
                      Développeuse
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "En tant que développeuse, j'apprécie particulièrement la
                  qualité du code et la documentation. Daznode est un excellent
                  exemple de ce que devrait être un projet open-source."
                </p>
              </Card>

              <Card className="p-6 border-accent/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mr-4">
                    <span className="text-accent font-bold">PB</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Pierre Bernard</h3>
                    <p className="text-sm text-muted-foreground">
                      Investisseur
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "J'ai commencé à gérer mon nœud Lightning il y a 6 mois et je
                  suis impressionné par les revenus passifs générés. Daznode a
                  rendu tout cela possible sans connaissances techniques
                  approfondies."
                </p>
              </Card>
            </div>
          </motion.div>

          {/* Section newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-20 text-center"
          >
            <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-10 border-accent/20">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Restez informé
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Inscrivez-vous à notre newsletter pour recevoir les dernières
                actualités sur le Lightning Network et les mises à jour de
                Daznode.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="px-4 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all text-white">
                  S'inscrire
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
