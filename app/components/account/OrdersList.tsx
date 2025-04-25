"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: number;
  createdAt: string;
  status: string;
  total: number;
  productType: "daznode" | "daz-ia";
}

// Export à la fois comme export par défaut et comme export nommé pour la compatibilité
export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Simuler le chargement des commandes
  useState(() => {
    // TODO: Remplacer par un appel API réel
    const mockOrders: Order[] = [
      {
        id: 1,
        productType: "daznode",
        status: "DELIVERED",
        createdAt: "2024-03-20",
        total: 299,
      },
      {
        id: 2,
        productType: "daz-ia",
        status: "PROCESSING",
        createdAt: "2024-03-21",
        total: 99,
      },
    ];
    setOrders(mockOrders);
    setLoading(false);
  });

  if (loading) {
    return <div>Chargement des commandes...</div>;
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.productType.toLowerCase() === activeTab;
  });

  return (
    <div className="space-y-4 w-full">
      <Tabs.Root defaultValue="all" onValueChange={setActiveTab}>
        <Tabs.List
          className="border-b border-border grid w-full grid-cols-3"
          aria-label="Filtres des commandes"
        >
          <Tabs.Trigger
            value="all"
            className="flex items-center justify-center px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
          >
            Toutes
          </Tabs.Trigger>
          <Tabs.Trigger
            value="daznode"
            className="flex items-center justify-center px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
          >
            Daznode
          </Tabs.Trigger>
          <Tabs.Trigger
            value="daz-ia"
            className="flex items-center justify-center px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
          >
            Daz-IA
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="all">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle>
                    <span>Commande #{order.id}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant={
                      order.status === "DELIVERED" ? "success" : "warning"
                    }
                  >
                    {order.status === "DELIVERED" ? "Livré" : "En cours"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

// Export par défaut pour la compatibilité
export default OrdersList;
