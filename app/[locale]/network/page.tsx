"use client";

import { useTranslation } from "@/app/hooks/useTranslation";
import { motion } from "framer-motion";
import { BarChart2, Globe, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { CapacityChart, CountryChart } from "@/components/charts";
import { PageContainer } from "@/components/layout/PageContainer";

export default function NetworkPage() {
  const t = useTranslations("pages.network");

  return (
    <PageContainer title={t("title")} subtitle={t("subtitle")}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t("metrics.totalNodes")}</h3>
            <Users className="w-6 h-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-gradient">10,000+</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("metrics.totalNodesDescription")}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {t("metrics.totalChannels")}
            </h3>
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-gradient">50,000+</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("metrics.totalChannelsDescription")}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {t("metrics.totalCapacity")}
            </h3>
            <BarChart2 className="w-6 h-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-gradient">1,000 BTC</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("metrics.totalCapacityDescription")}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {t("charts.capacityHistory.title")}
            </CardTitle>
            <CardDescription>
              {t("charts.capacityHistory.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <CapacityChart />
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {t("charts.nodesByCountry.title")}
            </CardTitle>
            <CardDescription>
              {t("charts.nodesByCountry.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <CountryChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
