"use client";

import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { ArrowRight, Box, Sparkles, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductDetails {
  title: string;
  description: string;
  price: number;
  promoPrice?: number;
  features: string[];
}

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = pathname?.split("/")[1] || "fr";
  const orderType = searchParams.get("order");
  const promoCode = searchParams.get("FIRST10");

  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null
  );

  useEffect(() => {
    if (orderType === "dazbox") {
      setSelectedProduct({
        title: "Dazbox",
        description:
          "Nœud Lightning Network pré-configuré avec abonnement Daz-IA inclus",
        price: 500000,
        promoPrice: promoCode ? 400000 : undefined,
        features: [
          "Nœud Lightning Network pré-configuré",
          "Abonnement annuel Daz-IA inclus",
          "Installation plug-and-play",
          "Support technique dédié",
          "Mises à jour automatiques",
        ],
      });
    } else {
      setSelectedProduct({
        title: "Daz-IA",
        description:
          "Intelligence artificielle décentralisée pour votre nœud Lightning",
        price: orderType === "one-shot" ? 10000 : 100000,
        features:
          orderType === "one-shot"
            ? ["Accès unique", "Support basique", "Analyses ponctuelles"]
            : [
                "Accès illimité pendant 1 an",
                "Support prioritaire",
                "Analyses en continu",
                "Mises à jour incluses",
              ],
      });
    }
  }, [orderType, promoCode]);

  if (!selectedProduct) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Fond avec dégradé et grain */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-blue-950 dark:to-purple-950">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-soft-light" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-12">
          {/* En-tête */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
              Finaliser votre commande
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Vous êtes à quelques clics de rejoindre l'élite du Lightning
              Network. Vérifiez les détails de votre commande ci-dessous.
            </p>
          </div>

          {/* Carte du produit */}
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-white/10 overflow-hidden">
              {/* Effet de grain */}
              <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
              </div>

              <div className="relative z-10 space-y-8">
                {/* En-tête du produit */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {orderType === "dazbox" ? (
                        <Box className="w-8 h-8 text-blue-400" />
                      ) : (
                        <Sparkles className="w-8 h-8 text-purple-400" />
                      )}
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
                        {selectedProduct.title}
                      </h2>
                    </div>
                    <p className="text-xl text-gray-300">
                      {selectedProduct.description}
                    </p>
                  </div>
                  <div className="text-right">
                    {selectedProduct.promoPrice ? (
                      <div className="space-y-2">
                        <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-blue-400/20 mb-2">
                          <span className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                            Offre de lancement - 10 premières commandes
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 line-through">
                          {selectedProduct.price.toLocaleString()} sats
                        </div>
                        <div className="text-3xl font-bold text-white">
                          {selectedProduct.promoPrice.toLocaleString()} sats
                        </div>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-white">
                        {selectedProduct.price.toLocaleString()} sats
                      </div>
                    )}
                  </div>
                </div>

                {/* Caractéristiques */}
                <div className="bg-white/5 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Inclus dans votre commande :
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bouton de paiement */}
                <button className="group relative w-full inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-coral-500 hover:from-blue-600 hover:via-purple-600 hover:to-coral-600 text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-coral-600 opacity-50 blur-xl" />
                  </div>
                  <span className="relative flex items-center gap-2">
                    Procéder au paiement
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
