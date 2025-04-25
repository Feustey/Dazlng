"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";

interface NodeFeeRecommendationsProps {
  nodeId: string;
}

export default function NodeFeeRecommendations({
  nodeId,
}: NodeFeeRecommendationsProps) {
  const t = useTranslations("components.node.fees");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("baseFee.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("baseFee.description")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("feeRate.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("feeRate.description")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("timelock.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("timelock.description")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
