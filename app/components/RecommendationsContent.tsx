import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card } from "./ui/card";

export function RecommendationsContent() {
  const t = useTranslations("recommendations");

  // Définir les recommandations avec leurs impacts
  const recommendations = [
    {
      title: "Optimisation des Frais",
      description:
        "Nos analyses montrent que vous pourriez augmenter vos revenus de 15-20% en ajustant vos frais de routage selon les conditions du marché.",
      details:
        "Les frais actuels de votre nœud sont légèrement sous-optimaux par rapport aux conditions du marché. Nous recommandons d'augmenter les frais de base de 10% et d'ajuster les frais variables en fonction du volume de transactions.",
      impact: "+15-20% de revenus mensuels",
    },
    {
      title: "Expansion des Canaux",
      description:
        "Votre nœud présente un potentiel d'expansion significatif. Nous identifions 3 nœuds stratégiques pour de nouveaux canaux.",
      details:
        "L'analyse du réseau montre que vous pourriez bénéficier de canaux avec des nœuds à forte activité mais faible connectivité. Ces connexions pourraient générer un trafic de routage important.",
      impact: "+25-30% de capacité de routage",
    },
    {
      title: "Gestion de la Liquidité",
      description:
        "Votre nœud présente un déséquilibre de liquidité qui limite son efficacité. Nous proposons une stratégie de rééquilibrage.",
      details:
        "La liquidité est concentrée sur certains canaux, créant des goulots d'étranglement. Un rééquilibrage périodique pourrait améliorer significativement les performances de routage.",
      impact: "+20% d'efficacité de routage",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
        <p className="text-xl text-blue-400 mb-6">{t("subtitle")}</p>
        <p className="text-gray-300 max-w-3xl mx-auto">{t("intro")}</p>
      </motion.div>

      <div className="grid gap-8 mb-16">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                {rec.title}
              </h3>
              <p className="text-xl text-white mb-4">{rec.description}</p>
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4">
                <p className="text-gray-300 mb-2">{rec.details}</p>
                <p className="text-green-400 font-semibold">
                  Impact estimé : {rec.impact}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 border border-blue-700 mb-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">
            {t("upgrade.title")}
          </h2>
          <p className="text-xl text-blue-200 mb-6">
            {t("upgrade.description")}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
