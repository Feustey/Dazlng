"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderStatus from "@/components/payment/OrderStatus";

interface Order {
  id: string;
  productType: "daznode" | "daz-ia";
  status: string;
  createdAt: string;
  amount: number;
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des commandes
  useState(() => {
    // TODO: Remplacer par un appel API réel
    const mockOrders: Order[] = [
      {
        id: "1",
        productType: "daznode",
        status: "DELIVERED",
        createdAt: "2024-03-20",
        amount: 299,
      },
      {
        id: "2",
        productType: "daz-ia",
        status: "PROCESSING",
        createdAt: "2024-03-21",
        amount: 99,
      },
    ];
    setOrders(mockOrders);
    setLoading(false);
  });

  if (loading) {
    return <div>Chargement des commandes...</div>;
  }

  const daznodeOrders = orders.filter(
    (order) => order.productType === "daznode"
  );
  const dazIAOrders = orders.filter((order) => order.productType === "daz-ia");

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">Toutes</TabsTrigger>
        <TabsTrigger value="daznode">Daznode</TabsTrigger>
        <TabsTrigger value="daz-ia">Daz-IA</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Commande #{order.id}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderStatus id={order.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="daznode">
        <div className="space-y-4">
          {daznodeOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>Commande Daznode #{order.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderStatus id={order.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="daz-ia">
        <div className="space-y-4">
          {dazIAOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>Commande Daz-IA #{order.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderStatus id={order.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
