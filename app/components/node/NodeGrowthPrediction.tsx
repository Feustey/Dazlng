"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, PieChart } from "@/components/ui/charts";

interface NodeGrowthPredictionProps {
  predictionData: {
    dates: string[];
    values: number[];
    factors: {
      positive: string[];
      challenges: string[];
    };
    distribution: Array<{
      label: string;
      value: number;
      color: string;
    }>;
  };
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function NodeGrowthPrediction({
  predictionData,
}: NodeGrowthPredictionProps) {
  const t = useTranslations("components.node.growth");

  const chartData = {
    labels: predictionData.dates,
    datasets: [
      {
        label: "Croissance prévue",
        data: predictionData.values,
        borderColor: "#3B82F6",
        tension: 0.4,
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            Prévision de Croissance
          </h3>
          <LineChart data={chartData} height={300} className="mb-4" />
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Distribution des Facteurs
            </h3>
            <PieChart
              data={predictionData.distribution}
              height={250}
              width={250}
            />
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Facteurs de Croissance
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-green-500 mb-2">
                  Facteurs Positifs
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {predictionData.factors.positive.map((factor, index) => (
                    <li key={index} className="text-sm">
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-500 mb-2">
                  Défis à Relever
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {predictionData.factors.challenges.map((challenge, index) => (
                    <li key={index} className="text-sm">
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Ajouter un export par défaut pour la compatibilité
export default NodeGrowthPrediction;
