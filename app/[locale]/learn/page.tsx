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
            <Tabs defaultValue="guide" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border-accent/20 rounded-lg mb-6">
                <TabsTrigger
                  value="guide"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  {t("guide")}
                </TabsTrigger>
                <TabsTrigger
                  value="lightning"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  {t("lightning")}
                </TabsTrigger>
                <TabsTrigger
                  value="visualization"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  {t("visualization")}
                </TabsTrigger>
              </TabsList>

              <div className="bg-card/30 backdrop-blur-sm rounded-lg p-6 border border-accent/10">
                <TabsContent value="guide" className="animate-fade-in">
                  <LearningGuide />
                </TabsContent>

                <TabsContent value="lightning" className="animate-fade-in">
                  <LightningNetworkGuide />
                </TabsContent>

                <TabsContent value="visualization" className="animate-fade-in">
                  <TransactionVisualizer />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
