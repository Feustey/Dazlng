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
      <div className="min-h-screen bg-background animate-fade-in">
        <div className="container mx-auto p-4 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text animate-slide-up">
            {t("title")}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="card-glass border-accent/20 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader>
                  <Skeleton className="h-4 w-1/2 bg-primary/20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full bg-primary/20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background animate-fade-in">
        <div className="container mx-auto p-4">
          <Alert variant="destructive" className="card-glass border-accent/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("error.title")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-background animate-fade-in">
        <div className="container mx-auto p-4">
          <Alert className="card-glass border-accent/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("noData.title")}</AlertTitle>
            <AlertDescription>{t("noData.description")}</AlertDescription>
          </Alert>
        </div>
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
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text animate-slide-up">
          {t("title")}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="card-glass border-accent/20 animate-slide-up">
            <CardHeader>
              <CardTitle className="gradient-text">
                {t("nodes.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("nodes.total")}
                  </span>
                  <span className="font-medium text-primary">
                    {formatNumber(summary.totalNodes)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("nodes.active")}
                  </span>
                  <span className="font-medium text-primary">
                    {formatNumber(summary.activeNodes)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass border-accent/20 animate-slide-up [animation-delay:100ms]">
            <CardHeader>
              <CardTitle className="gradient-text">
                {t("channels.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("channels.total")}
                  </span>
                  <span className="font-medium text-primary">
                    {formatNumber(summary.totalChannels)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("channels.active")}
                  </span>
                  <span className="font-medium text-primary">
                    {formatNumber(summary.activeChannels)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass border-accent/20 animate-slide-up [animation-delay:200ms]">
            <CardHeader>
              <CardTitle className="gradient-text">
                {t("capacity.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("capacity.total")}
                  </span>
                  <span className="font-medium text-primary">
                    {formatCapacity(summary.totalCapacity)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("capacity.average")}
                  </span>
                  <span className="font-medium text-primary">
                    {formatCapacity(summary.averageChannelCapacity)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass border-accent/20 animate-slide-up [animation-delay:300ms]">
            <CardHeader>
              <CardTitle className="gradient-text">
                {t("health.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("health.score")}
                  </span>
                  <span className="font-medium text-primary">
                    {summary.networkHealth}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("health.lastUpdated")}
                  </span>
                  <span className="font-medium text-primary">
                    {new Date(summary.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
