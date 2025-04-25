"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";

interface NodeOptimizationRecommendationsProps {
  nodeId: string;
}

export default function NodeOptimizationRecommendations({
  nodeId,
}: NodeOptimizationRecommendationsProps) {
  const t = useTranslations("components.node.optimization");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("channelBalance.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("channelBalance.description")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("peerSelection.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("peerSelection.description")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("channelSize.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("channelSize.description")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
