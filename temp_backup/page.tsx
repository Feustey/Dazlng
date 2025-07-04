"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DazpayCheckoutPage() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/contact");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div></div>
      <div></div>
        <span className="inline-block bg-yellow-400 text-black font-bold px-4 py-1 rounded-full text-sm">{t("checkout._venir")}</span>
      </div>
      <h1 className="text-3xl font-extrabold mb-6 text-white">{t("checkout.dazpay_bientt_disponible"")}</h1>
      <div></div>
        <p>
          DazPay est actuellement en phase finale de développement et sera bientôt disponible.
          Notre solution de paiement Lightning intégrée pour votre commerce ou site web.</p>
        </p>
        <p>
          Vous êtes intéressé par DazPay pour votre entreprise ? 
          Contactez-nous pour être parmi les premiers à en bénéficier dès son lancement.</p>
        </p>
      </div>
      <div></div>
        <a>
          Contactez-nous pour plus d"informations</a>
        </a>
        <a>
          Retour à l"accueil</a>
        </a>
      </div>
      <p>
        Vous serez redirigé vers la page de contact dans quelques secondes...</p>
      </p>
    </div>);
export const dynamic = "force-dynamic";
