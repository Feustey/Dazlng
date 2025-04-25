"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { motion } from "framer-motion";
import Button from "../../ui/button";
import { LuExternalLink } from "react-icons/lu";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const [isLoading, setIsLoading] = useState(false);

  // Données simulées pour le tableau de bord
  const dashboardData = {
    walletBalance: "1.25 BTC",
    totalOrders: 156,
    pendingOrders: 12,
    completedOrders: 144,
    recentTransactions: [
      {
        id: "tx1",
        date: "2023-03-15T14:30:00Z",
        amount: "0.05 BTC",
        type: "payment",
        status: "completed",
      },
      {
        id: "tx2",
        date: "2023-03-14T10:20:00Z",
        amount: "0.02 BTC",
        type: "refund",
        status: "completed",
      },
      {
        id: "tx3",
        date: "2023-03-13T16:45:00Z",
        amount: "0.08 BTC",
        type: "payment",
        status: "pending",
      },
    ],
  };

  const statusColors = {
    completed: "text-green-500",
    pending: "text-amber-500",
    failed: "text-red-500",
  };

  const typeIcons = {
    payment: "💸",
    refund: "↩️",
    deposit: "📥",
    withdrawal: "📤",
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsLoading(!isLoading)}
            >
              {isLoading ? "Chargement..." : "Actualiser"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Solde du portefeuille
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.walletBalance}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Commandes totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalOrders}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Commandes en attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.pendingOrders}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Commandes terminées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.completedOrders}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
              <CardDescription>
                Vos transactions les plus récentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl">
                        {typeIcons[tx.type as keyof typeof typeIcons]}
                      </div>
                      <div>
                        <p className="font-medium">
                          {tx.type === "payment"
                            ? "Paiement"
                            : tx.type === "refund"
                              ? "Remboursement"
                              : tx.type === "deposit"
                                ? "Dépôt"
                                : "Retrait"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{tx.amount}</p>
                      <p
                        className={`text-sm ${
                          statusColors[
                            tx.status as keyof typeof statusColors
                          ] || ""
                        }`}
                      >
                        {tx.status === "completed"
                          ? "Terminé"
                          : tx.status === "pending"
                            ? "En attente"
                            : "Échoué"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Statistiques Lightning Network</CardTitle>
              <CardDescription>
                Les statistiques Lightning Network sont maintenant disponibles
                via notre nouvelle application Python dédiée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-muted/30 rounded-lg">
                <p className="text-center text-muted-foreground">
                  Les fonctionnalités du Lightning Network ont été migrées vers
                  une application dédiée pour de meilleures performances et
                  capacités d'analyse.
                </p>
                <Button className="gap-2" variant="outline">
                  Accéder à l'application Lightning
                  <LuExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
