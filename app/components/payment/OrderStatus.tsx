"use client";

import React from "react";
import { Check, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export enum OrderStatusEnum {
  PENDING = "pending",
  PAID = "paid",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  FAILED = "failed",
}

interface OrderStatusProps {
  status: string;
  className?: string;
}

export default function OrderStatus({ status, className }: OrderStatusProps) {
  let statusColor = "";
  let statusText = "";
  let StatusIcon = Clock;

  switch (status) {
    case OrderStatusEnum.PENDING:
      statusColor = "bg-orange-100 text-orange-800 border-orange-300";
      statusText = "En attente";
      StatusIcon = Clock;
      break;
    case OrderStatusEnum.PAID:
      statusColor = "bg-blue-100 text-blue-800 border-blue-300";
      statusText = "Payée";
      StatusIcon = Check;
      break;
    case OrderStatusEnum.CONFIRMED:
      statusColor = "bg-green-100 text-green-800 border-green-300";
      statusText = "Confirmée";
      StatusIcon = Check;
      break;
    case OrderStatusEnum.SHIPPED:
      statusColor = "bg-indigo-100 text-indigo-800 border-indigo-300";
      statusText = "Expédiée";
      StatusIcon = Check;
      break;
    case OrderStatusEnum.DELIVERED:
      statusColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
      statusText = "Livrée";
      StatusIcon = Check;
      break;
    case OrderStatusEnum.CANCELLED:
      statusColor = "bg-red-100 text-red-800 border-red-300";
      statusText = "Annulée";
      StatusIcon = AlertTriangle;
      break;
    case OrderStatusEnum.FAILED:
      statusColor = "bg-red-100 text-red-800 border-red-300";
      statusText = "Échec";
      StatusIcon = AlertTriangle;
      break;
    default:
      statusColor = "bg-gray-100 text-gray-800 border-gray-300";
      statusText = "Inconnu";
      StatusIcon = AlertTriangle;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium whitespace-nowrap",
        statusColor,
        className
      )}
    >
      <StatusIcon className="w-3.5 h-3.5" />
      <span>{statusText}</span>
    </div>
  );
}
