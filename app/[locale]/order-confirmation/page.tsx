"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, usePathname } from "next/navigation";

export default function OrderConfirmationPage() {
  const t = useTranslations("daznode");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center text-green-500">
              {t("shipping.success")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-xl">
                Merci pour votre commande ! Votre nœud Lightning est en cours de
                préparation.
              </p>
              <p className="text-muted-foreground">
                Nous vous avons envoyé un email de confirmation avec les détails
                de votre commande. Notre équipe vous contactera bientôt pour
                finaliser la livraison.
              </p>
            </div>

            <div className="bg-muted p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">
                Ce qui est inclus dans votre commande :
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Un nœud Raspberry Pi 5 pré-configuré</li>
                <li>50 000 sats pré-chargés</li>
                <li>2 semaines de support dédié</li>
                <li>1 an d'abonnement DazIA Premium</li>
              </ul>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={() => router.push(`/${locale}/dashboard`)}
                className="w-full md:w-auto"
              >
                Accéder à mon tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
