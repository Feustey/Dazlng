"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  amount: number;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
}

export const TransactionVisualizer: React.FC = () => {
  const t = useTranslations("Transactions");
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  // Simulation de données pour la démonstration
  React.useEffect(() => {
    const demoTransactions: Transaction[] = [
      {
        id: "tx1",
        amount: 1000,
        timestamp: new Date(),
        status: "completed",
      },
      {
        id: "tx2",
        amount: 500,
        timestamp: new Date(),
        status: "pending",
      },
    ];
    setTransactions(demoTransactions);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
      <div className="grid gap-4">
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg border border-accent/20 bg-card/50 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{tx.id}</p>
                <p className="text-sm text-muted-foreground">
                  {tx.timestamp.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{tx.amount} sats</p>
                <p
                  className={`text-sm ${
                    tx.status === "completed"
                      ? "text-green-500"
                      : tx.status === "pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {tx.status}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
