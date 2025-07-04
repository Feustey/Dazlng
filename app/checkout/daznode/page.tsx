"use client";
import { DazNodeCheckout } from "@/components/checkout/DazNodeCheckout";

export default function DazNodeCheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DazNodeCheckout />
    </div>
  );
}

export const dynamic = "force-dynamic";
