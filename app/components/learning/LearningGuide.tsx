"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface LearningStep {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  duration: number;
}

export const LearningGuide: React.FC = () => {
  const t = useTranslations("Learning");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const learningSteps: LearningStep[] = [
    {
      id: "intro",
      title: t("steps.intro.title") || "Introduction aux cryptomonnaies",
      content:
        t("steps.intro.content") ||
        `
        <div>
          <p class="mb-4">Les cryptomonnaies représentent une révolution dans le monde financier, offrant un système monétaire décentralisé et basé sur la cryptographie. Contrairement aux devises traditionnelles émises par les gouvernements, les cryptomonnaies fonctionnent sur des réseaux distribués utilisant la technologie blockchain.</p>
          
          <h3 class="text-xl font-semibold mb-2">Principes fondamentaux</h3>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Décentralisation</strong> : Aucune autorité centrale ne contrôle le réseau</li>
            <li><strong>Transparence</strong> : Toutes les transactions sont vérifiables publiquement</li>
            <li><strong>Sécurité</strong> : Protection par cryptographie avancée</li>
            <li><strong>Pseudonymat</strong> : Les utilisateurs opèrent via des adresses cryptographiques</li>
          </ul>
          
          <p class="mb-4">Les cryptomonnaies ont émergé en 2009 avec le Bitcoin, créé par une personne ou un groupe sous le pseudonyme de Satoshi Nakamoto. Depuis, des milliers d'autres cryptomonnaies ont été développées, chacune avec ses propres caractéristiques et cas d'utilisation.</p>
        </div>
      `,
      completed: false,
      duration: 10,
    },
    {
      id: "bitcoin",
      title: t("steps.bitcoin.title") || "Bitcoin : Les fondamentaux",
      content:
        t("steps.bitcoin.content") ||
        `
        <div>
          <p class="mb-4">Bitcoin est la première et la plus connue des cryptomonnaies. Lancé en 2009, il a été conçu comme un système de paiement électronique pair-à-pair qui fonctionne sans autorité centrale ou intermédiaires.</p>
          
          <h3 class="text-xl font-semibold mb-2">Caractéristiques clés</h3>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Offre limitée</strong> : Maximum de 21 millions de bitcoins, créant une rareté numérique</li>
            <li><strong>Consensus distribué</strong> : Le réseau fonctionne grâce au mécanisme de preuve de travail (Proof of Work)</li>
            <li><strong>Halving</strong> : Tous les ~4 ans, la récompense des mineurs est divisée par deux</li>
            <li><strong>Blocs</strong> : Les transactions sont regroupées dans des blocs ajoutés à la chaîne environ toutes les 10 minutes</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-2">Portefeuilles Bitcoin</h3>
          <p class="mb-4">Pour utiliser Bitcoin, vous avez besoin d'un portefeuille (wallet) qui stocke vos clés privées. Il existe plusieurs types de portefeuilles:</p>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Hardware wallets</strong> : Dispositifs physiques offrant une sécurité maximale (Ledger, Trezor)</li>
            <li><strong>Software wallets</strong> : Applications sur ordinateur ou smartphone</li>
            <li><strong>Web wallets</strong> : Services en ligne, pratiques mais moins sécurisés</li>
            <li><strong>Paper wallets</strong> : Clés imprimées sur papier pour un stockage hors ligne</li>
          </ul>
        </div>
      `,
      completed: false,
      duration: 15,
    },
    {
      id: "blockchain",
      title: t("steps.blockchain.title") || "Comprendre la blockchain",
      content:
        t("steps.blockchain.content") ||
        `
        <div>
          <p class="mb-4">La blockchain est la technologie sous-jacente qui permet aux cryptomonnaies de fonctionner. Il s'agit d'un registre distribué qui enregistre toutes les transactions de manière transparente, sécurisée et immuable.</p>
          
          <h3 class="text-xl font-semibold mb-2">Structure de la blockchain</h3>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Blocs</strong> : Contiennent des transactions et sont liés cryptographiquement au bloc précédent</li>
            <li><strong>Hachage</strong> : Chaque bloc a une empreinte numérique unique (hash) qui dépend de son contenu</li>
            <li><strong>Chaîne</strong> : Séquence de blocs où chaque nouveau bloc contient le hash du bloc précédent</li>
            <li><strong>Nœuds</strong> : Ordinateurs qui maintiennent une copie de la blockchain et vérifient les transactions</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-2">Fonctionnement d'une transaction</h3>
          <ol class="list-decimal pl-6 mb-4">
            <li>Un utilisateur initie une transaction</li>
            <li>La transaction est diffusée à tous les nœuds du réseau</li>
            <li>Les mineurs vérifient la transaction et l'incluent dans un bloc</li>
            <li>Le mineur qui résout un problème cryptographique complexe ajoute le bloc à la chaîne</li>
            <li>Le nouveau bloc est vérifié par les autres nœuds</li>
            <li>La transaction est confirmée et devient permanente</li>
          </ol>
        </div>
      `,
      completed: false,
      duration: 20,
    },
    {
      id: "mining",
      title: t("steps.mining.title") || "Le minage et la sécurité du réseau",
      content:
        t("steps.mining.content") ||
        `
        <div>
          <p class="mb-4">Le minage est le processus par lequel de nouvelles transactions sont ajoutées à la blockchain Bitcoin. Il sert également à sécuriser le réseau et à émettre de nouveaux bitcoins selon un calendrier prédéfini.</p>
          
          <h3 class="text-xl font-semibold mb-2">Le processus de minage</h3>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Collecte de transactions</strong> : Les mineurs rassemblent les transactions en attente</li>
            <li><strong>Proof of Work</strong> : Ils tentent de résoudre un puzzle cryptographique difficile</li>
            <li><strong>Validation</strong> : Le premier mineur qui trouve la solution valide le bloc</li>
            <li><strong>Récompense</strong> : Ce mineur reçoit une récompense en bitcoins nouvellement créés plus les frais de transaction</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-2">Importance du minage</h3>
          <p class="mb-4">Le minage remplit plusieurs fonctions essentielles :</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Sécurisation du réseau contre les attaques</li>
            <li>Confirmation des transactions</li>
            <li>Émission de nouveaux bitcoins de manière décentralisée</li>
            <li>Incitation économique à participer et maintenir le réseau</li>
          </ul>
          
          <p class="mb-4">Avec le temps, le minage est devenu plus compétitif et spécialisé, nécessitant du matériel informatique dédié (ASIC) et consommant une quantité significative d'énergie.</p>
        </div>
      `,
      completed: false,
      duration: 15,
    },
    {
      id: "basics",
      title: t("steps.basics.title") || "Les bases du Lightning Network",
      content:
        t("steps.basics.content") ||
        `
        <div>
          <p class="mb-4">Le Lightning Network est une solution de "couche 2" construite sur la blockchain Bitcoin pour résoudre ses problèmes d'évolutivité en permettant des transactions rapides et à faible coût.</p>
          
          <h3 class="text-xl font-semibold mb-2">Principes fondamentaux</h3>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Transactions hors chaîne</strong> : Les paiements sont effectués sans être enregistrés sur la blockchain principale</li>
            <li><strong>Canaux de paiement</strong> : Connexions directes entre utilisateurs pour échanger des bitcoins</li>
            <li><strong>Réseau maillé</strong> : Les paiements peuvent être routés à travers plusieurs canaux</li>
            <li><strong>Contrats intelligents</strong> : Utilisation de scripts Bitcoin pour sécuriser les transactions</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-2">Avantages du Lightning</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>Transactions quasi instantanées (millisecondes)</li>
            <li>Frais très faibles, rendant les micropaiements viables</li>
            <li>Confidentialité améliorée, seules les transactions d'ouverture et de fermeture de canal sont publiques</li>
            <li>Évolutivité théoriquement illimitée, millions de transactions par seconde possibles</li>
          </ul>
        </div>
      `,
      completed: false,
      duration: 15,
    },
    {
      id: "channels",
      title: t("steps.channels.title") || "Les canaux de paiement Lightning",
      content:
        t("steps.channels.content") ||
        `
        <div>
          <p class="mb-4">Les canaux de paiement sont l'élément fondamental du Lightning Network. Ils permettent à deux participants d'échanger des bitcoins instantanément sans nécessiter d'enregistrement immédiat sur la blockchain.</p>
          
          <h3 class="text-xl font-semibold mb-2">Cycle de vie d'un canal</h3>
          <ol class="list-decimal pl-6 mb-4">
            <li><strong>Ouverture</strong> : Transaction sur la blockchain qui bloque des fonds entre deux parties</li>
            <li><strong>Utilisation</strong> : Multiples transactions hors chaîne, mises à jour des soldes respectifs</li>
            <li><strong>Fermeture</strong> : Transaction finale sur la blockchain qui distribue les soldes actuels</li>
          </ol>
          
          <h3 class="text-xl font-semibold mb-2">Aspects techniques</h3>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Transactions d'engagement</strong> : Garantissent que chaque partie peut récupérer ses fonds</li>
            <li><strong>Révocation de clés</strong> : Empêche la diffusion d'anciens états du canal</li>
            <li><strong>HTLC (Hashed Timelock Contracts)</strong> : Permettent le routage sécurisé des paiements à travers plusieurs canaux</li>
            <li><strong>Capacité du canal</strong> : Montant total des bitcoins disponibles dans le canal</li>
          </ul>
          
          <p class="mb-4">La gestion efficace des canaux est essentielle pour optimiser l'expérience Lightning : équilibrer la liquidité entrante et sortante, choisir des partenaires de canal fiables, et déterminer les montants appropriés.</p>
        </div>
      `,
      completed: false,
      duration: 20,
    },
    {
      id: "transactions",
      title:
        t("steps.transactions.title") || "Transactions Lightning et routage",
      content:
        t("steps.transactions.content") ||
        `
        <div>
          <p class="mb-4">Les transactions Lightning sont fondamentalement différentes des transactions Bitcoin standard. Elles sont instantanées, quasi gratuites et peuvent être routées à travers plusieurs canaux pour atteindre leur destination.</p>
          
          <h3 class="text-xl font-semibold mb-2">Anatomie d'une transaction Lightning</h3>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Facture</strong> : Demande de paiement contenant le montant, l'identifiant du destinataire, et d'autres métadonnées</li>
            <li><strong>Découverte de route</strong> : Identification du chemin optimal à travers le réseau</li>
            <li><strong>Exécution</strong> : Transmission du paiement via des HTLC enchaînés</li>
            <li><strong>Confirmation</strong> : Accusé de réception cryptographique du destinataire</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-2">Routage et recherche de chemin</h3>
          <p class="mb-4">Le routage est l'aspect le plus sophistiqué du Lightning Network :</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Les nœuds cherchent le chemin le plus efficace et économique</li>
            <li>Les frais de routage sont payés aux nœuds intermédiaires</li>
            <li>Les algorithmes de routage s'adaptent dynamiquement aux conditions du réseau</li>
            <li>La confidentialité est préservée grâce au routage en oignon (similaire à Tor)</li>
          </ul>
          
          <p class="mb-4">Avec l'évolution du réseau, les algorithmes de routage deviennent plus sophistiqués, améliorant la fiabilité et l'efficacité des paiements Lightning.</p>
        </div>
      `,
      completed: false,
      duration: 25,
    },
    {
      id: "nodes",
      title: t("steps.nodes.title") || "Gestion d'un nœud Lightning",
      content:
        t("steps.nodes.content") ||
        `
        <div>
          <p class="mb-4">Faire fonctionner un nœud Lightning vous permet de participer activement au réseau, d'avoir un contrôle total sur vos fonds et de potentiellement gagner des frais de routage.</p>
          
          <h3 class="text-xl font-semibold mb-2">Types de nœuds Lightning</h3>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Nœud complet</strong> : Exécute à la fois un nœud Bitcoin et Lightning</li>
            <li><strong>Nœud léger</strong> : S'appuie sur des services tiers pour certaines fonctionnalités</li>
            <li><strong>Nœud mobile</strong> : Version simplifiée pour smartphones</li>
            <li><strong>Solutions clé en main</strong> : Appareils préconfiguré (comme DazNode)</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-2">Considérations pratiques</h3>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Hardware</strong> : Raspberry Pi 4 (8GB) avec SSD recommandé</li>
            <li><strong>Logiciel</strong> : Implémentations comme LND, c-lightning, ou Eclair</li>
            <li><strong>Connectivité</strong> : Connexion Internet stable, idéalement 24/7</li>
            <li><strong>Sécurité</strong> : Sauvegarde des clés privées, protection contre les attaques</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-2">Stratégies de gestion</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>Équilibrer la liquidité entre les canaux entrants et sortants</li>
            <li>Ajuster les frais de routage en fonction des conditions du marché</li>
            <li>Surveiller la santé du nœud et des canaux</li>
            <li>Établir des connexions avec des nœuds bien connectés pour améliorer l'efficacité du routage</li>
          </ul>
        </div>
      `,
      completed: false,
      duration: 20,
    },
  ];

  const handleStepComplete = (stepId: string) => {
    const updatedSteps = learningSteps.map((step) =>
      step.id === stepId ? { ...step, completed: true } : step
    );
    const newProgress =
      (updatedSteps.filter((step) => step.completed).length /
        learningSteps.length) *
      100;
    setProgress(newProgress);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">
          {t("title") || "Guide d'apprentissage"}
        </h1>
        <Progress value={progress} className="mb-8" />

        <Tabs defaultValue={learningSteps[0].id} className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-1 mb-2">
            {learningSteps.slice(0, 4).map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                className={step.completed ? "bg-green-500 text-white" : ""}
              >
                {step.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsList className="grid w-full grid-cols-4 gap-1">
            {learningSteps.slice(4).map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                className={step.completed ? "bg-green-500 text-white" : ""}
              >
                {step.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {learningSteps.map((step) => (
            <TabsContent key={step.id} value={step.id}>
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
                <div
                  className="prose max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: step.content }}
                ></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {t("duration") || "Durée estimée"}: {step.duration}{" "}
                    {t("minutes") || "minutes"}
                  </span>
                  <Button
                    onClick={() => handleStepComplete(step.id)}
                    disabled={step.completed}
                    className={step.completed ? "bg-green-500" : ""}
                  >
                    {step.completed
                      ? t("completed") || "Terminé"
                      : t("markComplete") || "Marquer comme terminé"}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
};
