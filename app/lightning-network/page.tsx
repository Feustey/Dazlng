"use client";

import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Zap,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ZapIcon,
  Network,
  ArrowUpDown,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Données statiques pour éviter les problèmes de traduction dynamique
const contentData = {
  fr: {
    what_is: {
      functioning: {
        steps: [
          "Alice ouvre un canal de paiement avec Bob en effectuant une transaction Bitcoin.",
          "Alice et Bob peuvent maintenant effectuer un nombre illimité de transactions entre eux sans frais.",
          "Si Alice veut payer Carol, mais n'a pas de canal avec elle, elle peut utiliser le canal de Bob avec Carol comme intermédiaire.",
          "Lorsque les parties veulent clôturer le canal, elles publient la dernière transaction sur la blockchain Bitcoin.",
        ],
      },
    },
    why_use: {
      points: [
        "Transactions instantanées sans attente de confirmation de blocs",
        "Frais de transaction minimes par rapport à la blockchain principale",
        "Capacité de traitement de millions de transactions par seconde",
        "Micropaiements possibles (même pour quelques satoshis)",
      ],
    },
    getting_started: {
      steps: {
        step2: {
          wallets: [
            "Phoenix (simple et facile à utiliser)",
            "Breez (bon pour les débutants)",
            "Wallet of Satoshi (très simple, mais custodial)",
            "Zeus (avancé, contrôle complet)",
          ],
        },
      },
    },
    checklist: {
      items: [
        "Télécharger un portefeuille Lightning compatible",
        "Sécuriser votre portefeuille avec une sauvegarde et un code PIN",
        "Ajouter des fonds à votre portefeuille (achat ou réception)",
        "Ouvrir un canal avec un nœud bien connecté",
        "Faire un petit paiement test pour vérifier",
      ],
    },
  },
  en: {
    what_is: {
      functioning: {
        steps: [
          "Alice opens a payment channel with Bob by making a Bitcoin transaction.",
          "Alice and Bob can now make an unlimited number of transactions between them without fees.",
          "If Alice wants to pay Carol, but doesn't have a channel with her, she can use Bob's channel with Carol as an intermediary.",
          "When the parties want to close the channel, they publish the last transaction on the Bitcoin blockchain.",
        ],
      },
    },
    why_use: {
      points: [
        "Instant transactions without waiting for block confirmations",
        "Minimal transaction fees compared to the main blockchain",
        "Ability to process millions of transactions per second",
        "Micropayments possible (even for a few satoshis)",
      ],
    },
    getting_started: {
      steps: {
        step2: {
          wallets: [
            "Phoenix (simple and easy to use)",
            "Breez (good for beginners)",
            "Wallet of Satoshi (very simple, but custodial)",
            "Zeus (advanced, full control)",
          ],
        },
      },
    },
    checklist: {
      items: [
        "Download a compatible Lightning wallet",
        "Secure your wallet with a backup and PIN code",
        "Add funds to your wallet (buy or receive)",
        "Open a channel with a well-connected node",
        "Make a small test payment to verify",
      ],
    },
  },
};

export default function LightningNetworkPage() {
  const { t } = useTranslation();
  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "fr";

  // Utiliser fr comme fallback si la langue n'est pas supportée
  const lang = locale in contentData ? locale : "fr";
  const content = contentData[lang];

  return (
    <PageContainer
      title={t("content.title", { fallback: "Le Lightning Network" })}
      subtitle={t("content.subtitle", {
        fallback: "Comment fonctionne la seconde couche de Bitcoin",
      })}
    >
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-10">
            {/* Introduction */}
            <section className="mb-12">
              <div className="flex items-center justify-center mb-8">
                <div className="bg-yellow-500/20 p-6 rounded-full">
                  <ZapIcon className="h-16 w-16 text-yellow-400" />
                </div>
              </div>

              <p className="text-xl text-gray-300 mb-6">
                {t("content.intro", {
                  fallback:
                    "Le Lightning Network est une solution de deuxième couche construite sur Bitcoin qui permet des transactions rapides, bon marché et évolutives. Découvrez comment il fonctionne et pourquoi il est essentiel pour l'adoption massive de Bitcoin.",
                })}
              </p>
            </section>

            {/* Qu'est-ce que le Lightning Network */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <Network className="w-8 h-8 text-purple-400 mr-3" />
                {t("content.what_is.title", {
                  fallback: "Qu'est-ce que le Lightning Network ?",
                })}
              </h2>

              <div className="bg-blue-900/10 p-8 rounded-xl border border-blue-500/20 mb-8">
                <p className="text-lg text-gray-300 mb-6">
                  {t("content.what_is.description", {
                    fallback:
                      "Le Lightning Network est un protocole de paiement de deuxième couche qui opère par-dessus la blockchain Bitcoin. Il permet des transactions instantanées entre les participants du réseau.",
                  })}
                </p>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 bg-blue-900/20 p-6 rounded-lg border border-blue-500/10">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <ZapIcon className="w-5 h-5 text-yellow-400 mr-2" />
                      {t("content.what_is.advantage1.title", {
                        fallback: "Rapide",
                      })}
                    </h4>
                    <p className="text-gray-300">
                      {t("content.what_is.advantage1.description", {
                        fallback:
                          "Les transactions sont quasi-instantanées, sans avoir à attendre les confirmations de la blockchain.",
                      })}
                    </p>
                  </div>

                  <div className="flex-1 bg-blue-900/20 p-6 rounded-lg border border-blue-500/10">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <ArrowUpDown className="w-5 h-5 text-green-400 mr-2" />
                      {t("content.what_is.advantage2.title", {
                        fallback: "Économique",
                      })}
                    </h4>
                    <p className="text-gray-300">
                      {t("content.what_is.advantage2.description", {
                        fallback:
                          "Les frais de transaction sont infimes comparés à ceux de la blockchain principale.",
                      })}
                    </p>
                  </div>

                  <div className="flex-1 bg-blue-900/20 p-6 rounded-lg border border-blue-500/10">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <Network className="w-5 h-5 text-purple-400 mr-2" />
                      {t("content.what_is.advantage3.title", {
                        fallback: "Évolutif",
                      })}
                    </h4>
                    <p className="text-gray-300">
                      {t("content.what_is.advantage3.description", {
                        fallback:
                          "Le réseau peut théoriquement gérer des millions de transactions par seconde.",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/10 p-8 rounded-xl border border-purple-500/20">
                <h3 className="text-2xl font-semibold mb-4">
                  {t("content.what_is.functioning.title", {
                    fallback: "Comment fonctionne-t-il ?",
                  })}
                </h3>
                <p className="text-lg text-gray-300 mb-4">
                  {t("content.what_is.functioning.example", {
                    fallback:
                      "Imaginons qu'Alice veuille payer Bob régulièrement :",
                  })}
                </p>
                <ol className="space-y-4 list-decimal list-inside mb-4 pl-4">
                  {content.what_is.functioning.steps.map((step, index) => (
                    <li key={index} className="text-gray-300">
                      {step}
                    </li>
                  ))}
                </ol>
                <p className="text-gray-300 italic">
                  {t("content.what_is.functioning.benefit", {
                    fallback:
                      "Le résultat : des transactions rapides, privées et à faible coût.",
                  })}
                </p>
              </div>
            </section>

            {/* Pourquoi utiliser le Lightning Network */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <Lightbulb className="w-8 h-8 text-yellow-400 mr-3" />
                {t("content.why_use.title", {
                  fallback: "Pourquoi utiliser le Lightning Network ?",
                })}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.why_use.points.map((point, index) => (
                  <div
                    key={index}
                    className="bg-yellow-900/10 p-6 rounded-lg border border-yellow-500/20 flex"
                  >
                    <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-gray-300">{point}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Comment démarrer */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">
                {t("content.getting_started.title", {
                  fallback: "Comment démarrer avec Lightning",
                })}
              </h2>

              <div className="space-y-8">
                {/* Étape 1 */}
                <div className="bg-purple-900/10 p-8 rounded-xl border border-purple-500/20">
                  <h3 className="text-2xl font-semibold mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full mr-3 text-sm font-bold">
                      1
                    </span>
                    {t("content.getting_started.steps.step1.title", {
                      fallback: "Comprendre les bases",
                    })}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {t("content.getting_started.steps.step1.description", {
                      fallback:
                        "Familiarisez-vous avec les concepts du Lightning Network : canaux de paiement, nœuds et routage.",
                    })}
                  </p>
                </div>

                {/* Étape 2 */}
                <div className="bg-purple-900/10 p-8 rounded-xl border border-purple-500/20">
                  <h3 className="text-2xl font-semibold mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full mr-3 text-sm font-bold">
                      2
                    </span>
                    {t("content.getting_started.steps.step2.title", {
                      fallback: "Choisir un portefeuille Lightning",
                    })}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {t("content.getting_started.steps.step2.description", {
                      fallback:
                        "Plusieurs options s'offrent à vous, en fonction de votre niveau technique et de vos besoins :",
                    })}
                  </p>
                  <ul className="space-y-3 mb-4">
                    {content.getting_started.steps.step2.wallets.map(
                      (wallet, index) => (
                        <li
                          key={index}
                          className="flex items-start text-gray-300"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-1" />
                          <span>{wallet}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Étape 3 */}
                <div className="bg-purple-900/10 p-8 rounded-xl border border-purple-500/20">
                  <h3 className="text-2xl font-semibold mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full mr-3 text-sm font-bold">
                      3
                    </span>
                    {t("content.getting_started.steps.step3.title", {
                      fallback: "Ajouter des fonds",
                    })}
                  </h3>
                  <p className="text-gray-300">
                    {t("content.getting_started.steps.step3.description", {
                      fallback:
                        "Ajoutez des bitcoins à votre portefeuille Lightning, soit en les achetant directement, soit en transférant depuis un portefeuille Bitcoin.",
                    })}
                  </p>
                </div>

                {/* Étape 4 */}
                <div className="bg-purple-900/10 p-8 rounded-xl border border-purple-500/20">
                  <h3 className="text-2xl font-semibold mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full mr-3 text-sm font-bold">
                      4
                    </span>
                    {t("content.getting_started.steps.step4.title", {
                      fallback: "Effectuer votre premier paiement",
                    })}
                  </h3>
                  <p className="text-gray-300">
                    {t("content.getting_started.steps.step4.description", {
                      fallback:
                        "Commencez par un petit paiement test, comme un pourboire sur un site web ou un achat de faible valeur chez un commerçant acceptant Lightning.",
                    })}
                  </p>
                </div>
              </div>
            </section>

            {/* Checklist */}
            <section className="mb-12 bg-green-900/10 p-8 rounded-xl border border-green-500/20">
              <h2 className="text-2xl font-bold mb-6">
                {t("content.checklist.title", {
                  fallback: "Checklist du débutant",
                })}
              </h2>
              <ul className="space-y-3">
                {content.checklist.items.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <div className="flex items-center justify-center w-6 h-6 border-2 border-green-500 rounded-md mr-3 flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQ */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <AlertTriangle className="w-8 h-8 text-purple-400 mr-3" />
                {t("content.faq.title", { fallback: "Questions fréquentes" })}
              </h2>
              <div className="space-y-6">
                <div className="bg-purple-900/10 p-6 rounded-lg border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-2">
                    {t("content.faq.questions.non_custodial.question", {
                      fallback: "Qu'est-ce qu'un portefeuille non-custodial ?",
                    })}
                  </h3>
                  <p className="text-gray-300">
                    {t("content.faq.questions.non_custodial.answer", {
                      fallback:
                        "Un portefeuille non-custodial signifie que vous seul contrôlez vos fonds et vos clés privées. Personne ne peut accéder à vos bitcoins sans votre permission, mais vous êtes également responsable de leur sécurité.",
                    })}
                  </p>
                </div>
                <div className="bg-purple-900/10 p-6 rounded-lg border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-2">
                    {t("content.faq.questions.technical_experience.question", {
                      fallback:
                        "Ai-je besoin d'expérience technique pour utiliser Lightning ?",
                    })}
                  </h3>
                  <p className="text-gray-300">
                    {t("content.faq.questions.technical_experience.answer", {
                      fallback:
                        "Non, les portefeuilles modernes comme Phoenix ou Wallet of Satoshi rendent l'utilisation de Lightning accessible aux débutants. Cependant, si vous souhaitez exécuter votre propre nœud, une certaine expertise technique est recommandée.",
                    })}
                  </p>
                </div>
                <div className="bg-purple-900/10 p-6 rounded-lg border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-2">
                    {t("content.faq.questions.security.question", {
                      fallback: "Le Lightning Network est-il sécurisé ?",
                    })}
                  </h3>
                  <p className="text-gray-300">
                    {t("content.faq.questions.security.answer", {
                      fallback:
                        "Oui, le Lightning Network hérite de la sécurité de Bitcoin pour ses mécanismes d'ancrage. Cependant, comme pour toute technologie récente, il est recommandé de commencer avec de petits montants pendant que vous vous familiarisez avec son fonctionnement.",
                    })}
                  </p>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 rounded-xl border border-blue-500/20">
                <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Conclusion
                </h2>
                <p className="text-lg text-gray-300 text-center">
                  {t("content.conclusion", {
                    fallback:
                      "Le Lightning Network représente une avancée majeure pour Bitcoin, transformant une réserve de valeur en un véritable moyen de paiement quotidien. En adoptant cette technologie maintenant, vous faites partie des pionniers de la révolution financière de demain.",
                  })}
                </p>
              </div>
            </section>

            {/* Call to Action */}
            <section>
              <div className="flex justify-center">
                <Button asChild size="lg" className="mr-4">
                  <Link href="/daznode">
                    Commandez votre Daznode
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/daz-ia">Découvrir Daz-IA</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
