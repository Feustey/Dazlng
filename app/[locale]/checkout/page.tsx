"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations("Checkout");
  const params = useParams();

  useEffect(() => {
    // Rediriger vers la page de livraison
    router.push(`/${params.locale}/checkout/delivery`);
  }, [router, params.locale]);

  return (
    <div className="flex justify-center items-center min-h-[60vh] animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">
          {t("redirecting") || "Redirection..."}
        </p>
      </div>
    </div>
  );
}
