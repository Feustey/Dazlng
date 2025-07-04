import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export type OrderData = {
  fullName?: string;
  email?: string;
};

export interface OrderSummaryProps {
  data: OrderData;
}

export function OrderSummary({ data }: OrderSummaryProps) {
  const { t } = useAdvancedTranslation();
  const product = {
    name: "DazBox",
    priceBTC: 0.004,
    priceSats: Math.round(0.004 * 100000000), // 400000 sats
    quantity: 1
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">{t("checkout.recapitulatif")}</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Produit :</span>
          <span className="font-medium">{product.name}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Prix unitaire :</span>
          <span className="font-medium">₿{product.priceBTC} ({product.priceSats.toLocaleString("fr-FR")} Sats)</span>
        </div>
        
        <div className="flex justify-between">
          <span>Quantité :</span>
          <span className="font-medium">{product.quantity}</span>
        </div>
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-bold text-lg">
            <span>Total :</span>
            <span>₿{(product.priceBTC * product.quantity).toFixed(3)} ({(product.priceSats * product.quantity).toLocaleString("fr-FR")} Sats)</span>
          </div>
        </div>
      </div>
      
      {data.fullName && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold mb-2">Informations client</h4>
          <div className="space-y-1 text-sm">
            <div>Client : {data.fullName}</div>
            <div>Email : {data.email}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
