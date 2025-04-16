"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { useTranslations } from "next-intl";
import PageContainer from "@/components/layout/PageContainer";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Zap,
  LineChart,
  BarChart,
  Wallet,
  Shield,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function LearnPage() {
  const t = useTranslations("pages.learn");

  return (
    <PageContainer
      title="Rejoignez le Lightning Network : Libérez la Puissance de Bitcoin Instantanément"
      subtitle="Découvrez comment prendre en main le Lightning Network et exploiter tout son potentiel"
      className="max-w-[1200px] mx-auto"
    >
      {/* Introduction */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            Qu'est-ce que le Lightning Network ?
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Le Lightning Network est une solution de seconde couche construite
            au-dessus de la blockchain Bitcoin. Il permet des transactions
            rapides et à faible coût en créant des canaux de paiement entre les
            utilisateurs, évitant ainsi la congestion du réseau principal.
          </p>

          <h3>Fonctionnement du Lightning Network</h3>
          <p>
            Prenons l'exemple d'Alice et Bob qui souhaitent échanger des
            bitcoins rapidement :
          </p>
          <ol>
            <li>
              <strong>Ouverture d'un canal de paiement</strong> : Alice et Bob
              créent un portefeuille multi-signature et y déposent des fonds.
            </li>
            <li>
              <strong>Transactions hors chaîne</strong> : Ils peuvent ensuite
              effectuer des transactions instantanées entre eux sans enregistrer
              chaque opération sur la blockchain.
            </li>
            <li>
              <strong>Fermeture du canal</strong> : Lorsqu'ils terminent leurs
              échanges, le solde final est enregistré sur la blockchain.
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Avantages */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            Pourquoi Utiliser le Lightning Network ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <Zap className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Vitesse</h3>
                <p className="text-muted-foreground">
                  Les transactions sont quasi instantanées, idéales pour les
                  paiements quotidiens.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Wallet className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Frais réduits</h3>
                <p className="text-muted-foreground">
                  Les coûts de transaction sont minimes, rendant les
                  micro-paiements viables.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BarChart className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Scalabilité</h3>
                <p className="text-muted-foreground">
                  Le réseau peut gérer des millions de transactions par seconde.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Confidentialité</h3>
                <p className="text-muted-foreground">
                  Les transactions hors chaîne offrent une meilleure
                  confidentialité.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guide Pratique */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            Comment Prendre en Main le Lightning Network ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold mb-4">
                1. Acquérir des Bitcoins
              </h3>
              <p className="text-muted-foreground mb-4">
                Avant de commencer, vous devez posséder des bitcoins. Vous
                pouvez les acheter sur des plateformes d'échange réputées,
                utiliser des distributeurs automatiques de bitcoins ou accepter
                des paiements en bitcoins.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold mb-4">
                2. Choisir un Portefeuille Lightning
              </h3>
              <p className="text-muted-foreground mb-4">
                Un portefeuille Lightning vous permet d'interagir avec le
                réseau. Voici quelques options recommandées :
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>
                    Phoenix : Portefeuille non-custodial avec une excellente
                    expérience utilisateur
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>
                    Breez : Interface conviviale et contrôle total sur vos clés
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>
                    Blue Wallet : Permet une utilisation facile du Lightning
                    Network
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold mb-4">
                3. Effectuer des Transactions
              </h3>
              <p className="text-muted-foreground mb-4">
                Avec des fonds dans votre portefeuille, vous pouvez commencer à
                effectuer des transactions sur le Lightning Network. Pour
                envoyer des fonds, scannez le code QR du destinataire ou
                saisissez sa demande de paiement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card>
        <CardContent className="flex flex-col items-center text-center py-8">
          <h2 className="text-2xl font-bold mb-4">
            Prêt à Découvrir le Lightning Network ?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Commencez votre voyage dans l'univers des transactions Bitcoin
            instantanées avec nos solutions clés en main.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/daznode">
                Commandez votre Daznode
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/daz-ia">
                Découvrir Daz-IA
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
