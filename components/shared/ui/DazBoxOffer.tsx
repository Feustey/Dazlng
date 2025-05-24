import Image from "next/image";
import { FaBolt } from "react-icons/fa";
import type { FC } from "react";

const DazBoxOffer: FC = () => {
  return (
    <section className="max-w-2xl mx-auto bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center text-white">
      {/* Image du produit */}
      <div className="w-64 h-40 mb-6 relative">
        <Image
          src="/assets/images/dazbox.png"
          alt="DazBox"
          layout="fill"
          objectFit="cover"
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* Titre et description */}
      <h2 className="text-2xl font-bold mb-4 text-center">
        Possédez votre propre banque Bitcoin en 5 minutes !
      </h2>
      <p className="mb-6 text-lg text-center">
        La DazBox vous donne le contrôle total de vos finances numériques, sans complexité. Installation ultra-simple, sécurité maximale, et votre argent vous appartient vraiment.
      </p>

      {/* Liste des avantages */}
      <ul className="mb-8 space-y-2 text-base text-left w-full max-w-md mx-auto">
        <li>✅ Installation plug & play : branchez, connectez, c'est prêt !</li>
        <li>✅ Zéro intermédiaire : votre argent, votre contrôle</li>
        <li>✅ Interface intuitive pour tous</li>
        <li>✅ Assistant IA intégré pour vous guider</li>
        <li>✅ 400 000 satoshis inclus (≈ 0,004 BTC ≈ 399 €), livraison offerte</li>
      </ul>

      {/* CTA */}
      <button
        className="flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-xl shadow-lg transition w-full md:w-auto"
      >
        <FaBolt className="w-5 h-5" />
        Commander ma DazBox
      </button>
      <p className="text-xs text-gray-100 mt-2 text-center">
        Livraison rapide et paiement sécurisé
      </p>
    </section>
  );
};

export default DazBoxOffer; 