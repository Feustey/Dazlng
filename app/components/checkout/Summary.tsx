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
    priceSats: 400000, // 400 000 sats
    get priceBTC() { return this.priceSats / 100000000; },
    quantity: 1,
  };
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-bold mb-2">Récapitulatif</h3>
      <div>Produit : {product.name}</div>
      <div>Prix unitaire : ₿{product.priceBTC} ({product.priceSats.toLocaleString('fr-FR')} Sats)</div>
      <div>Quantité : {product.quantity}</div>
      <div className="font-bold mt-2">Total : ₿{(product.priceBTC * product.quantity).toFixed(3)} ({(product.priceSats * product.quantity).toLocaleString('fr-FR')} Sats)</div>
      {data.fullName && (
        <div className="mt-4 text-sm text-gray-500">
          <div>Client : {data.fullName}</div>
          <div>Email : {data.email}</div>
        </div>
      )}
    </div>
  );
} 