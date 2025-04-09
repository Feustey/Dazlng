"use client";

import { Metadata } from "next";
import { getMessages } from "../../lib/get-messages";
import { useTranslations } from "next-intl";
import ProgressBar from "../../components/checkout/ProgressBar";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Checkout");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <ProgressBar />
        </div>
        {children}
      </div>
    </div>
  );
}
