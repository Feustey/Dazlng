"use client";

import { useEffect, useRef } from "react";
import Card from "@/components/ui/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Centralities } from "@/types/node";
import { useTranslations } from "next-intl";
import { formatPubkey } from "@/utils/format";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface NetworkCentralityProps {
  centralityData: Centralities;
}

export function NetworkCentrality({ centralityData }: NetworkCentralityProps) {
  const t = useTranslations("pages.network.centrality");

  // Préparation des données pour les graphiques de centralité
  const betweennessData = {
    labels: centralityData.betweenness
      .slice(0, 10)
      .map((node) => formatPubkey(node.pubkey)),
    datasets: [
      {
        label: t("betweenness.label"),
        data: centralityData.betweenness.slice(0, 10).map((node) => node.value),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const eigenvectorData = {
    labels: centralityData.eigenvector
      .slice(0, 10)
      .map((node) => formatPubkey(node.pubkey)),
    datasets: [
      {
        label: t("eigenvector.label"),
        data: centralityData.eigenvector.slice(0, 10).map((node) => node.value),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const closenessData = {
    labels: centralityData.closeness
      .slice(0, 10)
      .map((node) => formatPubkey(node.pubkey)),
    datasets: [
      {
        label: t("closeness.label"),
        data: centralityData.closeness.slice(0, 10).map((node) => node.value),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  const weightedBetweennessData = {
    labels: centralityData.weighted_betweenness
      .slice(0, 10)
      .map((node) => formatPubkey(node.pubkey)),
    datasets: [
      {
        label: t("weightedBetweenness.label"),
        data: centralityData.weighted_betweenness
          .slice(0, 10)
          .map((node) => node.value),
        backgroundColor: "rgba(255, 159, 64, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value.toFixed(4)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t("yAxisLabel"),
        },
      },
      x: {
        title: {
          display: true,
          text: t("xAxisLabel"),
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              {t("betweenness.title")}
            </CardTitle>
            <div className="h-[250px]">
              <Bar data={betweennessData} options={options} />
            </div>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              {t("closeness.title")}
            </CardTitle>
            <div className="h-[250px]">
              <Bar data={closenessData} options={options} />
            </div>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              {t("eigenvector.title")}
            </CardTitle>
            <div className="h-[250px]">
              <Bar data={eigenvectorData} options={options} />
            </div>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              {t("weightedBetweenness.title")}
            </CardTitle>
            <div className="h-[250px]">
              <Bar data={weightedBetweennessData} options={options} />
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
