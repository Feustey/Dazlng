"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { LearningGuide } from "../../components/learning/LearningGuide";
import { TransactionVisualizer } from "../../components/transactions/TransactionVisualizer";
import { LightningNetworkGuide } from "../../components/learning/LightningNetworkGuide";

export default function LearnPage() {
  const t = useTranslations("Learn");

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

          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="guide">{t("guide")}</TabsTrigger>
              <TabsTrigger value="lightning">{t("lightning")}</TabsTrigger>
              <TabsTrigger value="visualization">
                {t("visualization")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guide">
              <LearningGuide />
            </TabsContent>

            <TabsContent value="lightning">
              <LightningNetworkGuide />
            </TabsContent>

            <TabsContent value="visualization">
              <TransactionVisualizer />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
