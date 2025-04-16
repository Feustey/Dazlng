"use client";

import { Suspense } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card } from "@/components/ui/card";
import { LineChart, PieChart } from "@/components/ui/charts";
import { formatNumber } from "@/lib/utils";
import { NetworkStats } from "@/components/network/NetworkStats";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type Period = "1d" | "1w" | "1m" | "1y";

export default function NetworkPage() {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("1m");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold">{t("Network.title")}</h1>
        <p className="text-muted-foreground">{t("Network.subtitle")}</p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        }
      >
        <NetworkStats />
      </Suspense>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">
              {t("Network.capacityHistory")}
            </h3>
            <Select
              value={selectedPeriod}
              onValueChange={(value) => setSelectedPeriod(value as Period)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("Network.selectPeriod")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">{t("Network.period.day")}</SelectItem>
                <SelectItem value="1w">{t("Network.period.week")}</SelectItem>
                <SelectItem value="1m">{t("Network.period.month")}</SelectItem>
                <SelectItem value="1y">{t("Network.period.year")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <LineChart
            data={[]} // Les données seront chargées dynamiquement
            xKey="date"
            yKey="value"
            height={300}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-medium mb-4">
            {t("Network.nodesByCountry")}
          </h3>
          <PieChart
            data={[]} // Les données seront chargées dynamiquement
            height={300}
          />
        </Card>
      </div>
    </div>
  );
}
