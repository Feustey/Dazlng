"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Loader2 } from "lucide-react";
import { Centralities } from "@/app/types/node";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function NetworkCentralities() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [centralities, setCentralities] = useState<Centralities | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/centralities");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        setCentralities(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <TableHead>Rang</TableHead>
            <TableHead>Pubkey</TableHead>
            <TableHead>Valeur</TableHead>
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
      <h2 className="text-xl font-semibold mb-6">Centralités du Réseau</h2>

      <div className="space-y-8">
        {renderCentralityTable("Betweenness", centralities.betweenness)}
        {renderCentralityTable("Eigenvector", centralities.eigenvector)}
        {renderCentralityTable("Closeness", centralities.closeness)}
        {renderCentralityTable(
          "Betweenness Pondéré",
          centralities.weighted_betweenness
        )}
        {renderCentralityTable(
          "Eigenvector Pondéré",
          centralities.weighted_eigenvector
        )}
        {renderCentralityTable(
          "Closeness Pondéré",
          centralities.weighted_closeness
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Dernière mise à jour:{" "}
        {new Date(centralities.last_update).toLocaleString()}
      </div>
    </Card>
  );
}
