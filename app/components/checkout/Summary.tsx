import React from "react";

export type OrderData = {
  fullName?: string;
  email?: string;
};

interface OrderSummaryProps {
  data: OrderData;
}

export function OrderSummary({ data }: OrderSummaryProps): React.ReactElement {
  const product = {
    name: "Dazbox",
    priceEur: 399,
    quantity: 1,
  };
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-bold mb-2">Récapitulatif</h3>
      <div>Produit : {product.name}</div>
      <div>Prix unitaire : {product.priceEur} €</div>
      <div>Quantité : {product.quantity}</div>
      <div className="font-bold mt-2">Total : {product.priceEur * product.quantity} €</div>
      {data.fullName && (
        <div className="mt-4 text-sm text-gray-500">
          <div>Client : {data.fullName}</div>
          <div>Email : {data.email}</div>
        </div>
      )}
    </div>
  );
} 