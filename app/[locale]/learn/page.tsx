"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { LearningGuide } from "@/app/components/learning/LearningGuide";
import { TransactionVisualizer } from "@/app/components/transactions/TransactionVisualizer";

export default function LearnPage() {
  const t = useTranslations("Learn");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

      <Tabs defaultValue="guide" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guide">{t("guide")}</TabsTrigger>
          <TabsTrigger value="visualization">{t("visualization")}</TabsTrigger>
        </TabsList>

        <TabsContent value="guide">
          <LearningGuide />
        </TabsContent>

        <TabsContent value="visualization">
          <TransactionVisualizer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
