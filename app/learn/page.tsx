"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useNodeInfo } from "@/app/hooks/useNodeInfo";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

const LearnPage = () => {
  const { nodePubkey } = useNodeInfo();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Guide d'utilisation d'Alby</h1>

      <div className="space-y-8">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Qu'est-ce qu'Alby ?</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>Alby est un portefeuille Bitcoin Lightning qui permet de :</p>
            <ul>
              <li>Gérer vos sats (satoshis) sur le réseau Lightning</li>
              <li>Effectuer des paiements instantanés</li>
              <li>Connecter votre propre nœud Lightning</li>
              <li>Utiliser des applications Web3 Bitcoin</li>
            </ul>
            <p>
              Alby est open source et développé par{" "}
              <a
                href="https://getalby.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                getAlby
              </a>
              .
            </p>
          </CardContent>
        </Card>

        {/* Installation de l'extension */}
        <Card>
          <CardHeader>
            <CardTitle>1. Installation de l'extension Alby</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>
              Pour commencer, installez l'extension Alby sur votre navigateur :
            </p>
            <ul>
              <li>
                <a
                  href="https://chrome.google.com/webstore/detail/alby-bitcoin-lightning-wal/iilhfppdbbkdmegkfepbfkmpknlkkejpk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Chrome Web Store
                </a>
              </li>
              <li>
                <a
                  href="https://addons.mozilla.org/fr/firefox/addon/alby/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Firefox Add-ons
                </a>
              </li>
            </ul>
            <p>
              Une fois installée, l'extension apparaîtra dans votre barre
              d'outils. Cliquez dessus pour commencer la configuration.
            </p>
          </CardContent>
        </Card>

        {/* Création du wallet */}
        <Card>
          <CardHeader>
            <CardTitle>2. Création de votre wallet Alby</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>Pour créer votre wallet :</p>
            <ol>
              <li>Cliquez sur l'extension Alby</li>
              <li>Choisissez "Créer un nouveau wallet"</li>
              <li>
                Suivez les instructions pour générer votre phrase de
                récupération
              </li>
              <li>
                Stockez cette phrase en lieu sûr (c'est la seule façon de
                récupérer vos fonds)
              </li>
            </ol>
            <p>
              Pour plus de détails, consultez le{" "}
              <a
                href="https://guides.getalby.com/alby-extension-and-website/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                guide officiel d'Alby
              </a>
              .
            </p>
          </CardContent>
        </Card>

        {/* Connexion du nœud */}
        <Card>
          <CardHeader>
            <CardTitle>3. Connexion de votre nœud Lightning</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>Pour connecter votre nœud Lightning à Alby :</p>
            <ol>
              <li>Dans Alby, allez dans les paramètres</li>
              <li>Sélectionnez "Connecter un nœud Lightning"</li>
              <li>Choisissez votre type de nœud (LND, Core Lightning, etc.)</li>
              <li>Entrez les informations de connexion de votre nœud</li>
            </ol>
            <p>
              Pour plus d'informations sur la configuration des nœuds, consultez
              la{" "}
              <a
                href="https://guides.getalby.com/alby-extension-and-website/lightning-nodes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                documentation d'Alby sur les nœuds Lightning
              </a>
              .
            </p>
          </CardContent>
        </Card>

        {/* Utilisation avec Daznode */}
        <Card>
          <CardHeader>
            <CardTitle>4. Utilisation avec Daznode</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>
              Une fois Alby configuré, vous pouvez l'utiliser avec Daznode pour
              :
            </p>
            <ul>
              <li>Vous authentifier de manière sécurisée</li>
              <li>Effectuer des paiements Lightning</li>
              <li>Gérer votre nœud Lightning</li>
            </ul>
            {nodePubkey ? (
              <div className="mt-4 p-4 bg-green-500/10 rounded-lg">
                <p className="text-green-500">
                  ✅ Votre nœud Lightning est connecté !
                </p>
                <p className="text-sm mt-2">Node Pubkey : {nodePubkey}</p>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2">
                <Button asChild>
                  <Link href="/auth/signin">Connecter Alby à Daznode</Link>
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <InfoIcon className="h-4 w-4" />
                        <span className="sr-only">Plus d'informations</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] text-sm">
                      <p>
                        En cliquant sur ce bouton, vous serez redirigé vers la
                        page de connexion. Alby utilisera le protocole
                        LNURL-auth pour une authentification sécurisée sans mot
                        de passe. Si vous avez connecté un nœud Lightning à
                        votre compte Alby, nous pourrons y accéder
                        automatiquement.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ressources */}
        <Card>
          <CardHeader>
            <CardTitle>Ressources utiles</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <ul>
              <li>
                <a
                  href="https://getalby.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Site officiel d'Alby
                </a>
              </li>
              <li>
                <a
                  href="https://guides.getalby.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Guides et documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/getAlby/lightning-browser-extension"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Code source sur GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/getAlby"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Groupe Telegram
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default LearnPage;
