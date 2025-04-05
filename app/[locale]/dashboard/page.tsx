"use client";

import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t("welcome")}</h1>
      <p>{t("nodes")}</p>
    </div>
  );
}
