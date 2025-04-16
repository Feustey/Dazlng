"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Card from "./ui/card";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Loader2 } from "lucide-react";
import { Centralities } from "../types/node";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useTranslations } from "next-intl";

export default function NetworkCentralities() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [centralities, setCentralities] = useState<Centralities | null>(null);
  const t = useTranslations("pages.network.centrality");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/centralities");
        if (!response.ok) {
          throw new Error(t("error.fetch"));
        }
        const data = await response.json();
        setCentralities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error.unknown"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  if (!centralities) {
    return null;
  }

  const renderCentralityTable = (
    title: string,
    data: { pubkey: string; value: number; rank: number }[]
  ) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.rank")}</TableHead>
            <TableHead>{t("table.pubkey")}</TableHead>
            <TableHead>{t("table.value")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 10).map((item, index) => (
            <TableRow key={item.pubkey}>
              <TableCell>{item.rank}</TableCell>
              <TableCell className="font-mono text-sm">
                {item.pubkey.slice(0, 8)}...{item.pubkey.slice(-8)}
              </TableCell>
              <TableCell>{item.value.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {renderCentralityTable(
            t("betweenness.title"),
            centralities.betweenness
          )}
          {renderCentralityTable(
            t("eigenvector.title"),
            centralities.eigenvector
          )}
          {renderCentralityTable(t("closeness.title"), centralities.closeness)}
          {renderCentralityTable(
            t("weightedBetweenness.title"),
            centralities.weighted_betweenness
          )}
          {renderCentralityTable(
            t("weightedEigenvector.title"),
            centralities.weighted_eigenvector
          )}
          {renderCentralityTable(
            t("weightedCloseness.title"),
            centralities.weighted_closeness
          )}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          {t("lastUpdate")}:{" "}
          {new Date(centralities.last_update).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
