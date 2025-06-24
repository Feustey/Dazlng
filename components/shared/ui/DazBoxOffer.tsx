import Image from "next/image";
import { FaBolt } from "react-icons/fa";
import type { FC } from "react";

const DazBoxOffer: FC = () => {
  return (
    <section className="max-w-lg mx-auto bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-3xl shadow-2xl p-6 flex flex-col items-center text-white">
      {/* Image du produit */}
      <div className="w-48 h-32 mb-4 relative">
        <Image
          src="/assets/images/dazbox.png"
          alt="DazBox"
          fill
          sizes="(max-width: 768px) 192px, 192px"
          className="rounded-xl shadow-lg object-cover"
        />
      </div>

      {/* Titre et description */}
      <h2 className="text-xl font-bold mb-3 text-center">
        Votre nœud Bitcoin !
      </h2>
      <p className="mb-4 text-sm text-center">
        La DazBox vous donne le contrôle total de vos finances numériques, sans complexité. Installation ultra-simple, sécurité maximale, et votre argent vous appartient vraiment.
      </p>

      {/* Liste des avantages */}
      <ul className="mb-6 space-y-1 text-sm text-left w-full max-w-md mx-auto">
        <li>✅ Installation plug & play : branchez, connectez, c'est prêt !</li>
        <li>✅ Zéro intermédiaire : votre argent, votre contrôle</li>
        <li>✅ Interface intuitive pour tous</li>
        <li>✅ Assistant IA intégré pour vous guider</li>
        <li>✅ 400 000 satoshis inclus (≈ 0,004 BTC ≈ 399 Sats), livraison offerte</li>
      </ul>

      {/* CTA */}
      <a
        href="/checkout/dazbox"
        className="flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-xl shadow-lg transition w-full md:w-auto"
      >
        <FaBolt className="w-5 h-5" />
        Commander ma DazBox
      </a>
      <p className="text-xs text-gray-100 mt-2 text-center">
        Livraison rapide et paiement sécurisé
      </p>
    </section>
};
};

export default DazBoxOffer; 