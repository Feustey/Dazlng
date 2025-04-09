"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useParams } from "next/navigation";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  total: number;
}

export default function OrdersPage() {
  const t = useTranslations("Orders");
  const router = useRouter();
  const params = useParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error(t("errors.fetchFailed"));
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.unknown"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [t]);

  if (loading) {
    return (
      <div className="container py-8">
        <Card className="p-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 rounded animate-pulse mb-4"
            />
          ))}
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="p-6">
          <div className="text-center text-red-600">{error}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("list.title")}</h1>
          <p className="text-muted-foreground">{t("list.description")}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("list.id")}</TableHead>
              <TableHead>{t("list.date")}</TableHead>
              <TableHead>{t("list.status")}</TableHead>
              <TableHead>{t("list.total")}</TableHead>
              <TableHead>{t("list.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.total.toFixed(2)} €</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/${params.locale}/orders/${order.id}`)
                    }
                  >
                    {t("list.view")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
