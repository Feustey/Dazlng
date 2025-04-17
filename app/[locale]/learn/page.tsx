"use client";

export const dynamic = "force-dynamic";

import { useTranslations } from "next-intl";
import PageContainer from "@/components/layout/PageContainer";
import {
  ArrowRight,
  BookOpen,
  Zap,
  MessageSquare,
  Server,
  Globe,
  Brain,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LearnPage() {
  const t = useTranslations("wiki");

  const sections = [
    {
      id: "alby",
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: t("sections.alby.title"),
      description: t("sections.alby.description"),
      content: {
        introduction: t("sections.alby.content.introduction"),
        features: [
          t("sections.alby.content.features.feature1"),
          t("sections.alby.content.features.feature2"),
          t("sections.alby.content.features.feature3"),
        ],
        links: [
          {
            title: "Site officiel",
            url: "https://getalby.com",
          },
          {
            title: "Documentation",
            url: "https://guides.getalby.com",
          },
        ],
      },
    },
    {
      id: "telegram",
      icon: <MessageSquare className="w-8 h-8 text-purple-400" />,
      title: t("sections.telegram.title"),
      description: t("sections.telegram.description"),
      content: {
        introduction: t("sections.telegram.content.introduction"),
        features: [
          t("sections.telegram.content.features.feature1"),
          t("sections.telegram.content.features.feature2"),
          t("sections.telegram.content.features.feature3"),
        ],
      },
    },
    {
      id: "umbrel",
      icon: <Server className="w-8 h-8 text-coral-400" />,
      title: t("sections.umbrel.title"),
      description: t("sections.umbrel.description"),
      content: {
        introduction: t("sections.umbrel.content.introduction"),
        features: [
          t("sections.umbrel.content.features.feature1"),
          t("sections.umbrel.content.features.feature2"),
          t("sections.umbrel.content.features.feature3"),
        ],
      },
    },
    {
      id: "rtl",
      icon: <Globe className="w-8 h-8 text-blue-400" />,
      title: t("sections.rtl.title"),
      description: t("sections.rtl.description"),
      content: {
        introduction: t("sections.rtl.content.introduction"),
        features: [
          t("sections.rtl.content.features.feature1"),
          t("sections.rtl.content.features.feature2"),
          t("sections.rtl.content.features.feature3"),
        ],
      },
    },
    {
      id: "nostr",
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      title: t("sections.nostr.title"),
      description: t("sections.nostr.description"),
      content: {
        introduction: t("sections.nostr.content.introduction"),
        features: [
          t("sections.nostr.content.features.feature1"),
          t("sections.nostr.content.features.feature2"),
          t("sections.nostr.content.features.feature3"),
        ],
      },
    },
    {
      id: "rag",
      icon: <BookOpen className="w-8 h-8 text-coral-400" />,
      title: t("sections.rag.title"),
      description: t("sections.rag.description"),
      content: {
        introduction: t("sections.rag.content.introduction"),
        features: [
          t("sections.rag.content.features.feature1"),
          t("sections.rag.content.features.feature2"),
          t("sections.rag.content.features.feature3"),
        ],
      },
    },
  ];

  return (
    <PageContainer>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Fond avec dégradé et grain */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-blue-950 to-purple-950">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-soft-light" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          {/* En-tête */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-blue-400/20 mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                Centre de Connaissances
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* Sections principales avec onglets */}
          <Tabs defaultValue={sections[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 mb-8 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20 p-2 rounded-xl">
              {sections.map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="relative flex flex-col items-center gap-2 px-4 py-3 transition-all duration-300 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:shadow-lg hover:bg-white/5"
                >
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    {section.icon}
                  </div>
                  <span className="hidden lg:block text-sm font-medium transition-colors">
                    {section.title}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {sections.map((section) => (
              <TabsContent
                key={section.id}
                value={section.id}
                className="bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 transition-all duration-300 hover:border-white/20"
              >
                <div className="relative z-10 space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 rounded-lg transform transition-transform duration-300 hover:scale-105">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {section.title}
                      </h3>
                      <p className="text-gray-400 text-lg">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed">
                      {section.content.introduction}
                    </p>

                    <h4 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      Fonctionnalités principales
                    </h4>
                    <ul className="space-y-4">
                      {section.content.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-gray-300"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {section.content.links && (
                      <>
                        <h4 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
                          <LinkIcon className="w-6 h-6 text-blue-400" />
                          Liens utiles
                        </h4>
                        <ul className="space-y-3">
                          {section.content.links.map((link, index) => (
                            <li key={index}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                              >
                                <LinkIcon className="w-4 h-4" />
                                {link.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Ressources complémentaires */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent mb-8 text-center">
              {t("related_resources.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: t("related_resources.daz_ia.title"),
                  description: t("related_resources.daz_ia.description"),
                  link: "/daz-ia",
                },
                {
                  title: t("related_resources.daznode.title"),
                  description: t("related_resources.daznode.description"),
                  link: "/daznode",
                },
                {
                  title: t("related_resources.lightning_network.title"),
                  description: t(
                    "related_resources.lightning_network.description"
                  ),
                  link: "/learn/lightning-network",
                },
              ].map((resource, index) => (
                <Link
                  key={index}
                  href={resource.link}
                  className="group relative bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-50" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-400">{resource.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
