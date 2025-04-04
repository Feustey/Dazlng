"use client";

import React from "react";
import { OperationTracker } from "@/app/components/operations/OperationTracker";
import { NodeMetrics } from "@/app/components/metrics/NodeMetrics";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

      <Tabs defaultValue="operations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="operations">{t("operations")}</TabsTrigger>
          <TabsTrigger value="metrics">{t("metrics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="operations">
          <OperationTracker />
        </TabsContent>

        <TabsContent value="metrics">
          <NodeMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
