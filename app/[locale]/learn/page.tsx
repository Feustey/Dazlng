"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { LightningNetworkGuide } from "../../components/learning/LightningNetworkGuide";
import { TransactionVisualizer } from "../../components/transactions/TransactionVisualizer";
import LearningResources from "../../components/learning/LearningResources";

export default function LearnPage() {
  const t = useTranslations("Learn");

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text animate-slide-up">
            {t("title")}
          </h1>

          <div className="card-glass border-accent/20 p-6 rounded-lg animate-slide-up [animation-delay:200ms]">
            <Tabs defaultValue="lightning" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm border-accent/20 rounded-lg mb-6">
                <TabsTrigger
                  value="lightning"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-foreground"
                >
                  {t("lightning")}
                </TabsTrigger>
                <TabsTrigger
                  value="visualization"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-foreground"
                >
                  {t("visualization")}
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-foreground"
                >
                  {t("resources")}
                </TabsTrigger>
                <TabsTrigger
                  value="guide"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-foreground opacity-50 cursor-not-allowed"
                  disabled
                >
                  {t("guide")}
                </TabsTrigger>
              </TabsList>

              <div className="bg-card/30 backdrop-blur-sm rounded-lg p-6 border border-accent/10">
                <TabsContent value="lightning" className="animate-fade-in">
                  <LightningNetworkGuide />
                </TabsContent>

                <TabsContent value="visualization" className="animate-fade-in">
                  <TransactionVisualizer />
                </TabsContent>

                <TabsContent value="resources" className="animate-fade-in">
                  <LearningResources />
                </TabsContent>

                <TabsContent value="guide" className="animate-fade-in">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-foreground/80 mb-4">
                      Le guide d'apprentissage sera bientôt disponible.
                    </p>
                    <p className="text-sm text-foreground/60">
                      Nous travaillons sur la création d'un guide complet pour
                      vous aider à comprendre le Lightning Network.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
