"use client";
import { DazNodeCheckout } from '@/components/checkout/DazNodeCheckout';

export default function DazNodeCheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <DazNodeCheckout />
    </div>
  );
}
export const dynamic = "force-dynamic";
