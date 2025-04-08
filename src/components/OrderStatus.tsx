import { useState, useEffect } from "react";
import { getOrder } from "../services/order";

interface OrderStatusProps {
  orderNumber: string;
}

interface Order {
  orderNumber: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  trackingNumber?: string;
  trackingUrl?: string;
  deliveryAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  deliveryOption: {
    name: string;
    estimatedDays: string;
  };
  total: number;
}

const statusSteps = [
  { key: "PENDING", label: "En attente" },
  { key: "PROCESSING", label: "En traitement" },
  { key: "SHIPPED", label: "Expédiée" },
  { key: "DELIVERED", label: "Livrée" },
];

export default function OrderStatus({ orderNumber }: OrderStatusProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const orderData = await getOrder(orderNumber);
        setOrder(orderData);
      } catch (err) {
        setError("Impossible de récupérer les informations de la commande");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order?.status
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Suivi de commande #{orderNumber}
      </h2>

      {/* Barre de progression */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-500"
          style={{
            width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
          }}
        ></div>

        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${
                  index <= currentStepIndex
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-sm text-gray-600">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Détails de la commande */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Détails de la commande</h3>

        <div className="space-y-4">
          <div>
            <span className="text-gray-600">Statut actuel:</span>
            <span className="ml-2 font-medium">
              {statusSteps.find((step) => step.key === order?.status)?.label}
            </span>
          </div>

          {order?.trackingNumber && (
            <div>
              <span className="text-gray-600">Numéro de suivi:</span>
              <span className="ml-2 font-medium">{order.trackingNumber}</span>
            </div>
          )}

          {order?.trackingUrl && (
            <div>
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Suivre ma commande →
              </a>
            </div>
          )}

          <div>
            <span className="text-gray-600">Adresse de livraison:</span>
            <div className="mt-1">
              {order?.deliveryAddress.firstName}{" "}
              {order?.deliveryAddress.lastName}
              <br />
              {order?.deliveryAddress.address}
              <br />
              {order?.deliveryAddress.postalCode} {order?.deliveryAddress.city}
              <br />
              {order?.deliveryAddress.country}
            </div>
          </div>

          <div>
            <span className="text-gray-600">Option de livraison:</span>
            <span className="ml-2 font-medium">
              {order?.deliveryOption.name} (
              {order?.deliveryOption.estimatedDays})
            </span>
          </div>

          <div>
            <span className="text-gray-600">Total:</span>
            <span className="ml-2 font-medium">
              {order?.total.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
