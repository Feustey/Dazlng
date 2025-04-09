import { Metadata } from "next";
import AuthForm from "../../components/AuthForm";
import { Card } from "../../components/ui/card";
import { Shield, Zap, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Rejoignez Daznode | La plateforme de gestion Lightning Network",
  description:
    "Optimisez votre présence sur le réseau Lightning avec Daznode. Inscription simple et rapide pour accéder à des outils puissants de gestion de nœuds.",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 via-background to-secondary-50 dark:from-primary-950 dark:via-background dark:to-secondary-950 p-4">
      {/* Cercles décoratifs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-100 dark:bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-100 dark:bg-secondary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-accent-100 dark:bg-accent-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 dark:from-primary-400 dark:via-secondary-400 dark:to-accent-400 text-transparent bg-clip-text">
            Daznode
          </h1>
          <p className="mt-3 text-xl md:text-2xl text-muted-foreground">
            Votre passerelle vers l'excellence Lightning
          </p>
          <div className="mt-8 flex justify-center space-x-6">
            <div className="text-center px-4 group">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Simple</h3>
              <p className="text-sm text-muted-foreground">
                Interface intuitive
              </p>
            </div>
            <div className="text-center px-4 group">
              <div className="w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-950 flex items-center justify-center text-secondary-600 dark:text-secondary-400 mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Sécurisé
              </h3>
              <p className="text-sm text-muted-foreground">
                Protection avancée
              </p>
            </div>
            <div className="text-center px-4 group">
              <div className="w-12 h-12 rounded-xl bg-accent-50 dark:bg-accent-950 flex items-center justify-center text-accent-600 dark:text-accent-400 mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Puissant
              </h3>
              <p className="text-sm text-muted-foreground">Outils complets</p>
            </div>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 shadow-lg hover:shadow-xl transition-all duration-300">
          <AuthForm />
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          En vous inscrivant, vous rejoignez une communauté grandissante de
          passionnés du Lightning Network.
        </p>
      </div>
    </div>
  );
}
