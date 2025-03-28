import { Accordion } from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Qu'est-ce que DazLng ?",
    answer: "DazLng est un gestionnaire de nœud Lightning Network qui vous permet de surveiller et gérer facilement votre nœud Bitcoin. Il offre une interface intuitive pour gérer vos canaux de paiement, surveiller votre activité et interagir avec le réseau Lightning."
  },
  {
    question: "Comment configurer mon nœud Lightning avec DazLng ?",
    answer: "Pour configurer votre nœud Lightning avec DazLng, vous devez d'abord installer un nœud Lightning (comme LND, c-lightning ou Eclair) sur votre serveur. Ensuite, connectez-vous à DazLng et suivez l'assistant de configuration qui vous guidera à travers le processus de connexion à votre nœud."
  },
  {
    question: "Quelles sont les exigences système pour exécuter un nœud Lightning ?",
    answer: "Pour exécuter un nœud Lightning, vous aurez besoin d'un serveur avec au moins 4GB de RAM, 100GB d'espace disque et une connexion Internet stable. Le serveur doit également être capable d'exécuter un nœud Bitcoin complet ou de se connecter à un nœud Bitcoin distant."
  },
  {
    question: "Comment gérer mes canaux de paiement ?",
    answer: "DazLng vous permet de visualiser tous vos canaux de paiement, leur capacité, leur liquidité et leur état. Vous pouvez ouvrir de nouveaux canaux, fermer des canaux existants et ajuster la liquidité entre vos canaux locaux et distants."
  },
  {
    question: "Comment surveiller la santé de mon nœud ?",
    answer: "DazLng fournit un tableau de bord complet avec des métriques en temps réel sur votre nœud, notamment le nombre de canaux, la capacité totale, les frais générés, la connectivité et l'état de synchronisation. Vous pouvez également configurer des alertes pour être notifié en cas de problème."
  },
  {
    question: "Comment gérer les paiements et les reçus ?",
    answer: "DazLng vous permet de générer des factures Lightning, de scanner des codes QR pour les paiements, et de suivre l'historique de vos transactions. Vous pouvez également configurer des notifications pour les paiements reçus."
  },
  {
    question: "Comment sécuriser mon nœud ?",
    answer: "La sécurité est une priorité absolue. DazLng recommande d'utiliser une authentification à deux facteurs, de maintenir votre nœud à jour avec les dernières versions, de sauvegarder régulièrement vos données et de suivre les meilleures pratiques de sécurité pour la gestion des clés privées."
  },
  {
    question: "Comment gérer les frais de transaction ?",
    answer: "DazLng vous permet de configurer et d'ajuster les frais de base et les frais de taux pour vos canaux. Vous pouvez définir des politiques de frais différentes pour différents canaux et surveiller les revenus générés par les frais."
  },
  {
    question: "Comment résoudre les problèmes courants ?",
    answer: "DazLng inclut un système de diagnostic intégré qui vous aide à identifier et résoudre les problèmes courants. Vous pouvez consulter les logs, vérifier la connectivité et suivre des guides de dépannage étape par étape."
  },
  {
    question: "Comment obtenir de l'aide supplémentaire ?",
    answer: "En plus de cette FAQ, DazLng propose une documentation complète en ligne, un forum communautaire et un support technique. Vous pouvez également nous contacter directement via notre système de support pour des questions spécifiques."
  }
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-h1 mb-8">Foire aux questions</h1>
      <p className="text-body mb-8 max-w-2xl">
        Trouvez rapidement les réponses aux questions les plus fréquentes sur DazLng et la gestion de votre nœud Lightning.
      </p>
      <Accordion items={faqItems} />
    </div>
  );
} 