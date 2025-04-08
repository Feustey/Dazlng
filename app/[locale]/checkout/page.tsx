"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations("Checkout");

  useEffect(() => {
    // Rediriger vers la page de livraison
    router.push("/checkout/delivery");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      <p className="ml-4 text-gray-600">
        {t("redirecting") || "Redirection..."}
      </p>
    </div>
  );
}
