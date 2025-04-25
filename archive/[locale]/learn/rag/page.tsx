"use client";

import { useTranslations } from "next-intl";
import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart,
} from "lucide-react";

export default function RagPage() {
  const t = useTranslations("wiki.sections.rag");

  // Fonction pour extraire les tableaux des traductions
  const getArrayFromTranslation = (path: string) => {
    // Cette fonction est nécessaire car TypeScript ne peut pas savoir à l'avance
    // si une traduction est une chaîne ou un tableau
    const value = t(path);
    return Array.isArray(value) ? value : [];
  };

  return (
    <PageContainer>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Fond avec dégradé et grain */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-blue-950 dark:to-purple-950">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-soft-light" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          {/* Bouton retour */}
          <div className="mb-8">
            <Button
              asChild
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <Link href="/learn">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au Centre de Connaissances
              </Link>
            </Button>
          </div>

          {/* En-tête */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-blue-400/20 mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                Intelligence Artificielle
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t("description")}
            </p>
          </div>

          {/* Contenu principal */}
          <div className="prose prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">
                {t("content.introduction")}
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                {t("content.concept")}
              </p>
              <p className="text-lg text-gray-300">
                {t("content.functioning")}
              </p>
            </section>

            {/* Avantages */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                {t("content.advantages.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getArrayFromTranslation("content.advantages.points").map(
                  (point, index) => (
                    <div
                      key={index}
                      className="bg-blue-900/20 rounded-lg p-6 border border-blue-400/20"
                    >
                      <p className="text-gray-300">{point}</p>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Limitations */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <AlertCircle className="w-8 h-8 text-yellow-400 mr-3" />
                {t("content.limitations.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getArrayFromTranslation("content.limitations.points").map(
                  (point, index) => (
                    <div
                      key={index}
                      className="bg-yellow-900/20 rounded-lg p-6 border border-yellow-400/20"
                    >
                      <p className="text-gray-300">{point}</p>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Techniques avancées */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <Lightbulb className="w-8 h-8 text-purple-400 mr-3" />
                {t("content.advanced_techniques.title")}
              </h2>

              {/* Optimisation */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">
                  {t("content.advanced_techniques.optimization.title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getArrayFromTranslation(
                    "content.advanced_techniques.optimization.points"
                  ).map((point, index) => (
                    <div
                      key={index}
                      className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20"
                    >
                      <p className="text-gray-300">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Récupération */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">
                  {t("content.advanced_techniques.retrieval.title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getArrayFromTranslation(
                    "content.advanced_techniques.retrieval.points"
                  ).map((point, index) => (
                    <div
                      key={index}
                      className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20"
                    >
                      <p className="text-gray-300">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post-récupération */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">
                  {t("content.advanced_techniques.post_retrieval.title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getArrayFromTranslation(
                    "content.advanced_techniques.post_retrieval.points"
                  ).map((point, index) => (
                    <div
                      key={index}
                      className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20"
                    >
                      <p className="text-gray-300">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approches sophistiquées */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  {t("content.advanced_techniques.sophisticated.title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getArrayFromTranslation(
                    "content.advanced_techniques.sophisticated.points"
                  ).map((point, index) => (
                    <div
                      key={index}
                      className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20"
                    >
                      <p className="text-gray-300">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Évaluation */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <BarChart className="w-8 h-8 text-blue-400 mr-3" />
                {t("content.evaluation.title")}
              </h2>

              {/* Métriques de récupération */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">
                  {t("content.evaluation.retrieval.title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {getArrayFromTranslation(
                    "content.evaluation.retrieval.points"
                  ).map((point, index) => (
                    <div
                      key={index}
                      className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/20"
                    >
                      <p className="text-gray-300">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métriques de génération */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">
                  {t("content.evaluation.generation.title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getArrayFromTranslation(
                    "content.evaluation.generation.points"
                  ).map((point, index) => (
                    <div
                      key={index}
                      className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/20"
                    >
                      <p className="text-gray-300">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-lg text-gray-300 mb-4">
                {t("content.evaluation.tools")}
              </p>
              <p className="text-lg text-gray-300">
                {t("content.evaluation.expert_validation")}
              </p>
            </section>

            {/* Défis */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <AlertCircle className="w-8 h-8 text-red-400 mr-3" />
                {t("content.challenges.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getArrayFromTranslation("content.challenges.points").map(
                  (point, index) => (
                    <div
                      key={index}
                      className="bg-red-900/20 rounded-lg p-6 border border-red-400/20"
                    >
                      <p className="text-gray-300">{point}</p>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
              <p className="text-lg text-gray-300">{t("content.conclusion")}</p>
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
