"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";

interface NetworkSummary {
  totalNodes: number;
  activeNodes: number;
  totalChannels: number;
  activeChannels: number;
  totalCapacity: number;
  averageChannelCapacity: number;
  averageNodeCapacity: number;
  networkHealth: number;
  lastUpdated: string;
}

export default function ReviewPage() {
  const t = useTranslations("Review");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<NetworkSummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/network-summary");
        if (!response.ok) {
          throw new Error("Failed to fetch network summary");
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error.title")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("noData.title")}</AlertTitle>
          <AlertDescription>{t("noData.description")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCapacity = (sats: number) => {
    const btc = sats / 100000000;
    return `${btc.toFixed(2)} BTC`;
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("nodes.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t("nodes.total")}</span>
                <span className="font-medium">
                  {formatNumber(summary.totalNodes)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("nodes.active")}</span>
                <span className="font-medium">
                  {formatNumber(summary.activeNodes)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("channels.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t("channels.total")}</span>
                <span className="font-medium">
                  {formatNumber(summary.totalChannels)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("channels.active")}</span>
                <span className="font-medium">
                  {formatNumber(summary.activeChannels)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("capacity.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t("capacity.total")}</span>
                <span className="font-medium">
                  {formatCapacity(summary.totalCapacity)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("capacity.averageChannel")}</span>
                <span className="font-medium">
                  {formatCapacity(summary.averageChannelCapacity)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("capacity.averageNode")}</span>
                <span className="font-medium">
                  {formatCapacity(summary.averageNodeCapacity)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("health.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t("health.score")}</span>
                <span className="font-medium">
                  {(summary.networkHealth * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("health.lastUpdated")}</span>
                <span className="font-medium">
                  {new Date(summary.lastUpdated).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
