"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface TransactionData {
  timestamp: string;
  amount: number;
  type: "incoming" | "outgoing";
}

// Données de transaction fictives
const mockData: TransactionData[] = [
  { timestamp: "00:00", amount: 1000, type: "incoming" },
  { timestamp: "04:00", amount: 500, type: "outgoing" },
  { timestamp: "08:00", amount: 2000, type: "incoming" },
  { timestamp: "12:00", amount: 1500, type: "outgoing" },
  { timestamp: "16:00", amount: 3000, type: "incoming" },
  { timestamp: "20:00", amount: 800, type: "outgoing" },
];

// Comparaison des transactions Bitcoin vs Lightning
const comparisonData = [
  {
    name: "Frais",
    bitcoin: 200,
    lightning: 1,
  },
  {
    name: "Temps de confirmation",
    bitcoin: 100, // ~10-60 minutes
    lightning: 0.5, // instantané
  },
  {
    name: "Évolutivité (TPS)",
    bitcoin: 7,
    lightning: 1000,
  },
  {
    name: "Confidentialité",
    bitcoin: 60,
    lightning: 85,
  },
];

// Types d'utilisation des transactions Lightning
const usagePieData = [
  { name: "Micropaiements", value: 45 },
  { name: "Commerce en ligne", value: 30 },
  { name: "Transferts P2P", value: 15 },
  { name: "Applications", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const TransactionVisualizer: React.FC = () => {
  const t = useTranslations("Transactions");
  const [timeRange, setTimeRange] = useState("24h");
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [activeTab, setActiveTab] = useState("txHistory");

  React.useEffect(() => {
    // Ici, nous utiliserions normalement une API pour récupérer les données réelles
    setTransactions(mockData);
  }, [timeRange]);

  const stats = {
    totalIncoming: transactions
      .filter((t) => t.type === "incoming")
      .reduce((sum, t) => sum + t.amount, 0),
    totalOutgoing: transactions
      .filter((t) => t.type === "outgoing")
      .reduce((sum, t) => sum + t.amount, 0),
    averageAmount:
      transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length,
    transactionCount: transactions.length,
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="txHistory" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="txHistory">
            {t("history") || "Historique des transactions"}
          </TabsTrigger>
          <TabsTrigger value="comparison">
            {t("comparison") || "Bitcoin vs Lightning"}
          </TabsTrigger>
          <TabsTrigger value="insights">
            {t("insights") || "Analyses et tendances"}
          </TabsTrigger>
          <TabsTrigger value="learn">
            {t("learnMore") || "En savoir plus"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="txHistory">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {t("title") || "Visualiseur de transactions"}
              </h2>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      t("selectTimeRange") || "Sélectionner une période"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">
                    {t("last24Hours") || "Dernières 24 heures"}
                  </SelectItem>
                  <SelectItem value="7d">
                    {t("last7Days") || "7 derniers jours"}
                  </SelectItem>
                  <SelectItem value="30d">
                    {t("last30Days") || "30 derniers jours"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("totalIncoming") || "Total entrant"}
                </h3>
                <p className="text-2xl font-bold">{stats.totalIncoming} sats</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("totalOutgoing") || "Total sortant"}
                </h3>
                <p className="text-2xl font-bold">{stats.totalOutgoing} sats</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("averageAmount") || "Montant moyen"}
                </h3>
                <p className="text-2xl font-bold">
                  {stats.averageAmount.toFixed(0)} sats
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("transactionCount") || "Nombre de transactions"}
                </h3>
                <p className="text-2xl font-bold">{stats.transactionCount}</p>
              </Card>
            </div>
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {t("transactionHistory") || "Historique des transactions"}
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              {t("comparisonTitle") || "Bitcoin vs Lightning Network"}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("comparisonDesc") ||
                "Comparaison des caractéristiques clés entre les transactions sur la blockchain Bitcoin principale et le Lightning Network."}
            </p>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {t("performanceMetrics") || "Métriques de performance"}
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bitcoin" name="Bitcoin" fill="#F7931A" />
                    <Bar dataKey="lightning" name="Lightning" fill="#792EE5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t("bitcoinAdvantages") || "Avantages de Bitcoin"}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 text-green-500 h-5 w-5 mr-2 mt-0.5">
                      ✓
                    </span>
                    <span>
                      {t("bitcoinSecurity") ||
                        "Sécurité maximale et consensus global"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 text-green-500 h-5 w-5 mr-2 mt-0.5">
                      ✓
                    </span>
                    <span>
                      {t("bitcoinSettlement") ||
                        "Règlement final sans contrepartie"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 text-green-500 h-5 w-5 mr-2 mt-0.5">
                      ✓
                    </span>
                    <span>
                      {t("bitcoinPermissionless") ||
                        "Réseau sans permission pour tous"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 text-green-500 h-5 w-5 mr-2 mt-0.5">
                      ✓
                    </span>
                    <span>
                      {t("bitcoinAuditability") ||
                        "Vérifiabilité complète et transparence"}
                    </span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t("lightningAdvantages") || "Avantages du Lightning Network"}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 h-5 w-5 mr-2 mt-0.5">
                      ⚡
                    </span>
                    <span>
                      {t("lightningSpeed") || "Transactions quasi instantanées"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 h-5 w-5 mr-2 mt-0.5">
                      ⚡
                    </span>
                    <span>
                      {t("lightningFees") || "Frais de transaction minimes"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 h-5 w-5 mr-2 mt-0.5">
                      ⚡
                    </span>
                    <span>
                      {t("lightningMicropayments") ||
                        "Support pour les micropaiements"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 h-5 w-5 mr-2 mt-0.5">
                      ⚡
                    </span>
                    <span>
                      {t("lightningPrivacy") ||
                        "Meilleure confidentialité des transactions"}
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              {t("insightsTitle") || "Analyses et tendances"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t("usagePie") || "Répartition des usages Lightning"}
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usagePieData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {usagePieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t("factsTitle") || "Le saviez-vous ?"}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 h-6 w-6 mr-3 mt-0.5">
                      !
                    </span>
                    <p className="text-gray-600">
                      {t("fact1") ||
                        "Le Lightning Network peut théoriquement gérer des millions de transactions par seconde, comparé aux 7 transactions par seconde de Bitcoin."}
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 h-6 w-6 mr-3 mt-0.5">
                      !
                    </span>
                    <p className="text-gray-600">
                      {t("fact2") ||
                        "Les transactions Lightning peuvent être aussi petites que 1 satoshi (0.00000001 BTC)."}
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 h-6 w-6 mr-3 mt-0.5">
                      !
                    </span>
                    <p className="text-gray-600">
                      {t("fact3") ||
                        "Le coût moyen d'une transaction Lightning est inférieur à un centime, contre plusieurs dollars pour les transactions Bitcoin lors des périodes de forte congestion."}
                    </p>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learn">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              {t("learnTitle") || "Comprendre les transactions"}
            </h2>

            <div className="prose max-w-none">
              <h3>
                {t("bitcoinTxTitle") || "Anatomie d'une transaction Bitcoin"}
              </h3>
              <p>
                {t("bitcoinTxDesc") ||
                  "Une transaction Bitcoin est composée de plusieurs éléments clés :"}
              </p>
              <ul>
                <li>
                  <strong>{t("inputs") || "Entrées"}</strong> -{" "}
                  {t("inputsDesc") ||
                    "Références aux transactions précédentes qui sont la source des bitcoins à dépenser"}
                </li>
                <li>
                  <strong>{t("outputs") || "Sorties"}</strong> -{" "}
                  {t("outputsDesc") ||
                    "Adresses de destination et montants à envoyer"}
                </li>
                <li>
                  <strong>{t("fees") || "Frais"}</strong> -{" "}
                  {t("feesDesc") ||
                    "La différence entre les entrées et les sorties, payée aux mineurs"}
                </li>
                <li>
                  <strong>{t("signature") || "Signature"}</strong> -{" "}
                  {t("signatureDesc") ||
                    "Preuve cryptographique que l'expéditeur est autorisé à dépenser ces bitcoins"}
                </li>
              </ul>

              <h3 className="mt-6">
                {t("lightningTxTitle") ||
                  "Comment fonctionne une transaction Lightning"}
              </h3>
              <p>
                {t("lightningTxDesc") ||
                  "Les transactions Lightning fonctionnent différemment des transactions Bitcoin standard :"}
              </p>
              <ol>
                <li>
                  <strong>{t("invoice") || "Création d'une facture"}</strong> -{" "}
                  {t("invoiceDesc") ||
                    "Le destinataire génère une facture (invoice) avec le montant demandé"}
                </li>
                <li>
                  <strong>{t("pathfinding") || "Recherche de chemin"}</strong> -{" "}
                  {t("pathfindingDesc") ||
                    "L'expéditeur trouve un chemin à travers le réseau vers le destinataire"}
                </li>
                <li>
                  <strong>{t("htlc") || "Contrats HTLC"}</strong> -{" "}
                  {t("htlcDesc") ||
                    "Le paiement est sécurisé par des contrats temporisés tout au long du chemin"}
                </li>
                <li>
                  <strong>{t("settlement") || "Règlement"}</strong> -{" "}
                  {t("settlementDesc") ||
                    "Le paiement est réglé instantanément sans attendre de confirmations blockchain"}
                </li>
              </ol>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-blue-700">
                  {t("resources") || "Ressources pour en savoir plus"}
                </h4>
                <ul className="mt-2">
                  <li>
                    <a
                      href="https://lightning.network/"
                      className="text-blue-600 hover:underline"
                    >
                      Lightning Network
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://en.bitcoin.it/wiki/Lightning_Network"
                      className="text-blue-600 hover:underline"
                    >
                      Wiki Bitcoin: Lightning Network
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://docs.lightning.engineering/"
                      className="text-blue-600 hover:underline"
                    >
                      Lightning Engineering Documentation
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setActiveTab("txHistory")}>
                {t("backToVisualizer") || "Retour au visualiseur"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
