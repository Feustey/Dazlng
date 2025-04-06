import { Metadata } from "next";
import AuthForm from "@/app/components/AuthForm";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Rejoignez DazLng | La plateforme de gestion Lightning Network",
  description:
    "Optimisez votre présence sur le réseau Lightning avec DazLng. Inscription simple et rapide pour accéder à des outils puissants de gestion de nœuds.",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            DazLng
          </h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
            Votre passerelle vers l'excellence Lightning
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="text-center px-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Simple
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interface intuitive
              </p>
            </div>
            <div className="text-center px-4 border-l border-r border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sécurisé
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Protection avancée
              </p>
            </div>
            <div className="text-center px-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Puissant
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Outils complets
              </p>
            </div>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl">
          <AuthForm />
        </Card>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          En vous inscrivant, vous rejoignez une communauté grandissante de
          passionnés du Lightning Network.
        </p>
      </div>
    </div>
  );
}
